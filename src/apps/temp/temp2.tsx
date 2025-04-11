// components/apps/NotesApp.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Save, Trash2, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { message, createDataItemSigner, dryrun } from "@permaweb/aoconnect";
import WindowStructure from "@/components/window";

// The process ID is hardcoded directly in the component
const PROCESS_ID = '4KDfJ-IRes7joLZXqHMrROLNghcVy6C4E-I9OJ3PM8E';

// Direct CSS styles
const styles = {
  container: {
    padding: '16px',
  },
  header: {
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '12px',
  },
  flexBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  notesList: {
    overflowY: 'auto',
    maxHeight: '280px',
    paddingRight: '4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  noteItem: {
    position: 'relative',
    padding: '8px',
    border: '2px solid var(--border)',
    borderRadius: '6px',
    marginBottom: '8px',
  },
  noteContent: {
    fontSize: '12px',
    paddingTop: '4px',
    paddingBottom: '4px',
    paddingRight: '24px',
  },
  noteTimestamp: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px',
  },
  deleteButton: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    padding: '4px',
    height: '20px',
    width: '20px',
    backgroundColor: '#fee2e2',
    borderRadius: '4px',
  },
  deleteIcon: {
    height: '12px',
    width: '12px',
    color: '#ef4444',
  },
  inputContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
  },
  statusText: {
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '8px',
  },
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '24px 0',
  },
  emptyNotesMessage: {
    textAlign: 'center',
    padding: '24px 0',
    color: '#6b7280',
    fontSize: '12px',
  },
  connectContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 0',
  },
  connectStatus: {
    marginTop: '8px',
    fontSize: '12px',
    color: '#6b7280',
  },
};

interface NotesAppProps {
  id: number;
}

const NotesApp = ({ id }: NotesAppProps) => {
  const { toast } = useToast();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Effect to fetch notes when wallet changes
  useEffect(() => {
    if (wallet) {
      fetchNotes(wallet);
    }
  }, [wallet]);

  // Connect to Arweave wallet
  const connectWallet = async () => {
    try {
      setLoading(true);
      setStatus("Connecting to wallet...");
      
      // Check if ArConnect or other Arweave wallet extension is available
      if (typeof window.arweaveWallet === 'undefined') {
        toast({
          title: "Wallet not found",
          description: "Please install ArConnect or another Arweave wallet extension",
          variant: "destructive"
        });
        setStatus('Wallet not found. Please install ArConnect.');
        return;
      }
      
      // Request wallet permissions
      await window.arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGN_TRANSACTION', 'DISPATCH']);
      
      // Get wallet address
      const address = await window.arweaveWallet.getActiveAddress();
      setWallet(address);
      setStatus(`Connected: ${address.slice(0, 6)}...${address.slice(-4)}`);
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      });

      // Register user with the AO process
      await registerUser(address);
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to wallet",
        variant: "destructive"
      });
      setStatus('Connection failed');
    } finally {
      setLoading(false);
    }
  };
  
  // Register user with the AO process
  const registerUser = async (address) => {
    try {
      setStatus('Registering...');
      
      const response = await message({
        process: PROCESS_ID,
        tags: [{ name: 'Action', value: 'Register' }],
        signer: createDataItemSigner(window.arweaveWallet),
        data: 'Register me'
      });
      
      console.log('Registration response:', response);
      setStatus('Registered successfully!');
      
    } catch (error) {
      console.error('Registration error:', error);
      setStatus('Registration failed');
    }
  };

  // Fetch all notes and filter in the frontend
  const fetchNotes = async (walletAddress = wallet) => {
    if (!walletAddress) {
      console.log('No wallet address available for filtering');
      return;
    }

    try {
      setRefreshing(true);
      setStatus("Fetching notes...");
      
      // Using dryrun to get ALL notes
      const dryrunResult = await dryrun({
        process: PROCESS_ID,
        data: '',
        tags: [{ name: 'Action', value: 'GetAllNotes' }]
      });
      
      console.log('Dryrun result:', dryrunResult);
      
      // Try to extract the notes data from various places
      let allNotes = null;
      
      // 1. Check Output
      if (dryrunResult && dryrunResult.Output) {
        if (typeof dryrunResult.Output === 'string') {
          try {
            allNotes = JSON.parse(dryrunResult.Output);
            console.log('Notes parsed from Output string:', allNotes);
          } catch (error) {
            console.error('Error parsing Output string:', error);
          }
        } else if (Array.isArray(dryrunResult.Output)) {
          allNotes = dryrunResult.Output;
          console.log('Notes from Output array:', allNotes);
        }
      }
      
      // 2. Check Messages
      if (!allNotes && dryrunResult && dryrunResult.Messages && dryrunResult.Messages.length > 0) {
        for (const msg of dryrunResult.Messages) {
          if (msg.Data) {
            try {
              if (typeof msg.Data === 'string') {
                allNotes = JSON.parse(msg.Data);
              } else if (Array.isArray(msg.Data)) {
                allNotes = msg.Data;
              }
              if (allNotes) {
                console.log('Notes from message data:', allNotes);
                break;
              }
            } catch (error) {
              console.error('Error parsing message data:', error);
            }
          }
        }
      }
      
      // If we got notes, filter them for the current user
      if (allNotes && Array.isArray(allNotes)) {
        // Make sure we're using the correct wallet address for filtering
        console.log('Filtering notes for wallet:', walletAddress);
        
        // Filter notes for the current user
        const myNotes = allNotes.filter(note => note.author === walletAddress);
        
        // Sort notes by timestamp (newest first)
        myNotes.sort((a, b) => b.timestamp - a.timestamp);
        
        setNotes(myNotes);
        setStatus(`Loaded ${myNotes.length} of your notes`);
        
        if (myNotes.length === 0 && !initialLoad) {
          toast({
            title: "No Notes Found", 
            description: "You don't have any notes yet. Create your first one!"
          });
        }
        
        // Update initialLoad flag
        setInitialLoad(false);
      } else {
        // If no notes were found, set to empty array
        setNotes([]);
        setStatus('No notes found or error parsing data');
        
        console.log('Debug info:', {
          hasOutput: !!dryrunResult?.Output,
          outputType: typeof dryrunResult?.Output,
          hasMessages: !!dryrunResult?.Messages,
          messagesCount: dryrunResult?.Messages?.length || 0
        });
        
        if (!initialLoad) {
          toast({
            title: "Data Format Issue",
            description: "Could not retrieve notes in the expected format",
            variant: "destructive"
          });
        }
        
        // Update initialLoad flag
        setInitialLoad(false);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      
      if (!initialLoad) {
        toast({
          title: "Fetch Failed",
          description: "Could not fetch notes: " + error.message,
          variant: "destructive"
        });
      }
      
      setStatus('Failed to fetch notes');
      setInitialLoad(false);
    } finally {
      setRefreshing(false);
    }
  };

  // Create a new note
  const createNote = async () => {
    if (!wallet) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return;
    }
    
    if (!newNote.trim()) {
      toast({
        title: "Empty Note",
        description: "Please enter some content for your note",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsCreating(true);
      setStatus("Creating note...");
      
      const response = await message({
        process: PROCESS_ID,
        tags: [{ name: 'Action', value: 'CreateNote' }],
        signer: createDataItemSigner(window.arweaveWallet),
        data: newNote
      });
      
      console.log('Note creation response:', response);
      setStatus('Note created successfully!');
      
      toast({
        title: "Note Created!",
        description: "Your note has been saved"
      });
      
      // Clear the input field
      setNewNote('');
      
      // Refresh notes list
      setTimeout(() => fetchNotes(), 1000); // Wait a bit for the note to be processed
      
      // Exit creation mode
      setIsCreating(false);
    } catch (error) {
      console.error('Note creation error:', error);
      toast({
        title: "Note Creation Failed",
        description: "Failed to create your note",
        variant: "destructive"
      });
      setStatus('Note creation failed');
      setIsCreating(false);
    }
  };

  // Delete a note
  const deleteNote = async (timestamp) => {
    if (!wallet) return;
    
    try {
      setStatus("Deleting note...");
      
      const response = await message({
        process: PROCESS_ID,
        tags: [
          { name: 'Action', value: 'DeleteNote' },
          { name: 'Timestamp', value: timestamp.toString() }
        ],
        signer: createDataItemSigner(window.arweaveWallet),
        data: "Delete note"
      });
      
      console.log('Delete response:', response);
      
      toast({
        title: "Note Deleted",
        description: "Your note has been deleted"
      });
      
      // Refresh notes list
      setTimeout(() => fetchNotes(), 1000); // Wait a bit for the deletion to be processed
      
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete note",
        variant: "destructive"
      });
    }
  };

  // Format timestamp into readable date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  // Render the content for the window
  const renderContent = () => {
    if (!wallet) {
      return (
        <div style={styles.connectContainer}>
          <Button 
            onClick={connectWallet}
            disabled={loading}
            variant="noShadow"
          >
            {loading ? (
              <>
                <Loader2 style={{marginRight: '8px', height: '16px', width: '16px'}} className="animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect Wallet"
            )}
          </Button>
          {status && <p style={styles.connectStatus}>{status}</p>}
        </div>
      );
    }

    return (
      <>
        <div style={styles.flexBetween}>
          <h3 style={{fontSize: '14px', fontWeight: 500}}>My Notes</h3>
          <Button 
            onClick={() => fetchNotes()}
            disabled={refreshing}
            variant="noShadow"
            size="sm"
            style={{height: '28px', padding: '0 8px'}}
          >
            {refreshing ? (
              <Loader2 style={{height: '12px', width: '12px'}} className="animate-spin" />
            ) : (
              <RefreshCw style={{height: '12px', width: '12px'}} />
            )}
          </Button>
        </div>
        
        <div style={styles.inputContainer}>
          <Input
            placeholder="Write a new note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            disabled={isCreating}
            style={{fontSize: '12px', height: '32px'}}
          />
          <Button 
            onClick={createNote}
            disabled={isCreating || !newNote.trim()}
            variant="noShadow"
            size="sm"
            style={{height: '32px', width: '32px', padding: 0}}
          >
            {isCreating ? (
              <Loader2 style={{height: '12px', width: '12px'}} className="animate-spin" />
            ) : (
              <Save style={{height: '12px', width: '12px'}} />
            )}
          </Button>
        </div>
        
        {status && <p style={styles.statusText}>{status}</p>}
        
        {refreshing ? (
          <div style={styles.loaderContainer}>
            <Loader2 style={{height: '24px', width: '24px', color: '#9ca3af'}} className="animate-spin" />
          </div>
        ) : notes.length === 0 ? (
          <div style={styles.emptyNotesMessage}>
            No notes found. Create your first note!
          </div>
        ) : (
          <div style={styles.notesList}>
            {notes.map((note, index) => (
              <div key={index} style={styles.noteItem}>
                <p style={styles.noteContent}>{note.content}</p>
                <p style={styles.noteTimestamp}>
                  {formatDate(note.timestamp)}
                </p>
                <Button 
                  onClick={() => deleteNote(note.timestamp)}
                  variant="noShadow"
                  size="sm"
                  style={styles.deleteButton}
                >
                  <Trash2 style={styles.deleteIcon} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <WindowStructure windowId={id}>
      <div style={styles.container}>
        <h2 style={styles.header}>These notes are only accessible thorugh your unique wallet adress</h2>
        {renderContent()}
      </div>
    </WindowStructure>
  );
};

export default NotesApp;