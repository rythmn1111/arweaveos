// components/apps/AOVoiceRecorderApp.tsx
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Send, Loader2, Play, ListMusic, ArrowLeft, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { message, createDataItemSigner, result, dryrun } from "@permaweb/aoconnect";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
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
    marginBottom: '16px',
  },
  contentArea: {
    display: 'flex',
    flexDirection: 'column', 
    gap: '16px',
  },
  flexBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  postsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    overflowY: 'auto',
    maxHeight: '350px',
    paddingRight: '4px',
  },
  postItem: {
    padding: '12px',
    border: '2px solid var(--border)',
    borderRadius: '6px',
    position: 'relative',
  },
  postItemActive: {
    padding: '12px',
    border: '2px solid var(--main)',
    borderRadius: '6px',
    position: 'relative',
  },
  postHeader: {
    paddingBottom: '4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postTitle: {
    fontSize: '14px',
    fontWeight: 600,
  },
  postContent: {
    fontSize: '12px',
    marginTop: '4px',
    color: '#4b5563',
  },
  playButton: {
    height: '24px',
    width: '24px',
    padding: 0,
  },
  playButtonIcon: {
    height: '12px',
    width: '12px',
  },
  centerContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 0',
  },
  buttonRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
  },
  roundButton: {
    borderRadius: '50%',
    padding: '24px',
  },
  recordButton: {
    borderRadius: '50%',
    padding: '24px',
  },
  listenButton: {
    borderRadius: '50%',
    padding: '24px',
  },
  statusText: {
    marginBottom: '4px',
    fontSize: '14px',
    fontWeight: 500,
    textAlign: 'center',
  },
  statusDetails: {
    fontSize: '12px',
    color: '#6b7280',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: '12px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: 500,
    marginBottom: '4px',
  },
  textarea: {
    width: '100%',
    minHeight: '120px',
    padding: '8px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  editMessage: {
    marginTop: '20px',
  },
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '24px 0',
  },
  emptyMessage: {
    textAlign: 'center',
    padding: '24px 0',
    color: '#6b7280',
    fontSize: '14px',
  },
  backButton: {
    marginBottom: '8px',
  },
  iconSmall: {
    marginRight: '4px',
    height: '12px',
    width: '12px',
  },
  loader: {
    animation: 'spin 1s linear infinite',
  },
};

interface AOVoiceRecorderAppProps {
  id: number;
}

const AOVoiceRecorderApp = ({ id }: AOVoiceRecorderAppProps) => {
  const { toast } = useToast();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [mode, setMode] = useState('record'); // 'record' or 'listen'
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [fetchingPosts, setFetchingPosts] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef(null);

  // React Speech Recognition setup
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Initialize the speech synthesis on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Check if browser supports speech recognition
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setStatus('Browser does not support speech recognition.');
      toast({
        title: "Browser Not Supported",
        description: "Your browser doesn't support speech recognition",
        variant: "destructive"
      });
    }
  }, [browserSupportsSpeechRecognition, toast]);

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
      
      toast({
        title: "Registered!",
        description: "You have been registered to the message system"
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "Failed to register with the AO process",
        variant: "destructive"
      });
      setStatus('Registration failed');
    }
  };

  // Toggle recording
  const toggleRecording = async () => {
    if (!wallet) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return;
    }
    
    if (!listening) {
      try {
        await SpeechRecognition.startListening({ continuous: true });
        setStatus("Recording...");
        setIsEditing(true);
      } catch (error) {
        console.error("Error starting recording:", error);
        toast({
          title: "Recording Failed",
          description: "Could not start recording",
          variant: "destructive"
        });
      }
    } else {
      SpeechRecognition.stopListening();
      setStatus("Recording stopped");
    }
  };

  // Create post with title and content
  const createPost = async () => {
    if (!wallet) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return;
    }
    
    if (!postTitle.trim() || !transcript.trim()) {
      toast({
        title: "Empty Fields",
        description: "Please enter both a title and content",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      setStatus("Creating post...");
      
      const response = await message({
        process: PROCESS_ID,
        tags: [
          { name: 'Action', value: 'CreatePost' },
          { name: 'Title', value: postTitle }
        ],
        signer: createDataItemSigner(window.arweaveWallet),
        data: transcript
      });
      
      console.log('Post creation response:', response);
      setStatus('Post created successfully!');
      
      toast({
        title: "Post Created!",
        description: "Your post has been saved"
      });
      
      // Clear the fields after successful post creation
      setPostTitle('');
      resetTranscript();
      setIsEditing(false);
    } catch (error) {
      console.error('Post creation error:', error);
      toast({
        title: "Post Creation Failed",
        description: "Failed to create your post",
        variant: "destructive"
      });
      setStatus('Post creation failed');
    } finally {
      setLoading(false);
    }
  };

  // Start editing mode
  const startEditing = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    }
    setIsEditing(true);
  };

  // Fetch all posts
  const fetchPosts = async () => {
    if (!wallet) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return;
    }

    try {
      setFetchingPosts(true);
      setStatus("Fetching posts...");
      
      // Using dryrun to get posts
      const dryrunResult = await dryrun({
        process: PROCESS_ID,
        data: '',
        tags: [{ name: 'Action', value: 'GetPosts' }]
      });
      
      console.log('Dryrun result:', dryrunResult);
      
      // Check various places where the JSON might be
      let postsData = null;
      
      // 1. Check Output (from print statement)
      if (dryrunResult && dryrunResult.Output) {
        try {
          postsData = JSON.parse(dryrunResult.Output);
        } catch (error) {
          console.error('Error parsing Output:', error);
        }
      }
      
      // 2. Check Messages (from msg.reply)
      if (!postsData && dryrunResult && dryrunResult.Messages && dryrunResult.Messages.length > 0) {
        try {
          const msgData = dryrunResult.Messages[0].Data;
          if (msgData) {
            postsData = JSON.parse(msgData);
          }
        } catch (error) {
          console.error('Error parsing message data:', error);
        }
      }
      
      // 3. Check the Result itself (from return value)
      if (!postsData && dryrunResult && typeof dryrunResult === 'string') {
        try {
          postsData = JSON.parse(dryrunResult);
        } catch (error) {
          console.error('Error parsing result itself:', error);
        }
      }
      
      // Process the posts data if we found it
      if (postsData && Array.isArray(postsData)) {
        setPosts(postsData);
        setStatus(`Loaded ${postsData.length} posts`);
        
        toast({
          title: "Posts Loaded",
          description: `Successfully loaded ${postsData.length} posts`
        });
      } else {
        setPosts([]);
        setStatus('No posts found or invalid format');
        
        toast({
          title: "No Posts",
          description: "No valid posts were found"
        });
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "Fetch Failed",
        description: "Could not fetch posts: " + error.message,
        variant: "destructive"
      });
      setStatus('Failed to fetch posts');
    } finally {
      setFetchingPosts(false);
    }
  };

  // Switch mode between record and listen
  const switchMode = (newMode) => {
    setMode(newMode);
    if (newMode === 'listen') {
      fetchPosts();
    } else {
      setCurrentPost(null);
      stopSpeaking();
    }
  };

  // Stop speaking if currently speaking
  const stopSpeaking = () => {
    if (synthRef.current && isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Play post content using text-to-speech
  const playPost = (post) => {
    if (!synthRef.current) return;
    
    // Stop any current speech
    stopSpeaking();
    
    setCurrentPost(post);
    
    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(post.content);
    
    // Get available voices
    const voices = synthRef.current.getVoices();
    
    // Try to find a good female voice
    let selectedVoice = voices.find(voice => 
      voice.name.includes('female') || 
      voice.name.includes('Female') || 
      voice.name.includes('Samantha') ||
      voice.name.includes('Google UK English Female')
    );
    
    // Fallback to any voice if no female voice is found
    if (!selectedVoice && voices.length > 0) {
      selectedVoice = voices[0];
    }
    
    // Set the voice if one was found
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    // Set other properties
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Set event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      toast({
        title: "Playback Error",
        description: "Could not play the message",
        variant: "destructive"
      });
    };
    
    // Speak the utterance
    synthRef.current.speak(utterance);
  };

  // Render different UI based on mode
  const renderContent = () => {
    if (!wallet) {
      return (
        <div style={styles.centerContent}>
          <Button 
            onClick={connectWallet}
            disabled={loading}
            variant="noShadow"
            style={{fontSize: '16px', padding: '16px'}}
          >
            {loading ? (
              <>
                <Loader2 style={{marginRight: '8px', height: '20px', width: '20px'}} />
                Connecting...
              </>
            ) : (
              "Connect Wallet"
            )}
          </Button>
          {status && <p style={{marginTop: '16px', fontSize: '14px', color: '#6b7280'}}>{status}</p>}
        </div>
      );
    }

    if (mode === 'listen') {
      return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
          <div style={styles.flexBetween}>
            <Button 
              onClick={() => switchMode('record')}
              variant="noShadow"
              size="sm"
              style={styles.backButton}
            >
              <ArrowLeft style={{marginRight: '4px', height: '12px', width: '12px'}} />
              Back
            </Button>
            
            <Button 
              onClick={fetchPosts}
              disabled={fetchingPosts}
              variant="noShadow"
              size="sm"
            >
              {fetchingPosts ? (
                <>
                  <Loader2 style={{marginRight: '4px', height: '12px', width: '12px'}} />
                  Loading...
                </>
              ) : (
                <>
                  <ListMusic style={{marginRight: '4px', height: '12px', width: '12px'}} />
                  Refresh
                </>
              )}
            </Button>
          </div>

          {fetchingPosts ? (
            <div style={styles.loaderContainer}>
              <Loader2 style={{height: '32px', width: '32px', color: '#9ca3af'}} />
            </div>
          ) : posts.length === 0 ? (
            <div style={styles.emptyMessage}>
              No posts found. Create some posts first!
            </div>
          ) : (
            <div style={styles.postsList}>
              {posts.map((post, index) => (
                <div key={index} style={currentPost === post ? styles.postItemActive : styles.postItem}>
                  <div style={styles.postHeader}>
                    <h3 style={styles.postTitle}>{post.title}</h3>
                    <Button 
                      onClick={() => playPost(post)} 
                      variant="noShadow" 
                      size="sm"
                      disabled={isSpeaking && currentPost === post}
                      style={styles.playButton}
                    >
                      {isSpeaking && currentPost === post ? (
                        <Loader2 style={styles.playButtonIcon} />
                      ) : (
                        <Volume2 style={styles.playButtonIcon} />
                      )}
                    </Button>
                  </div>
                  {currentPost === post && (
                    <p style={styles.postContent}>{post.content}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Record mode
    if (!isEditing) {
      return (
        <div style={styles.centerContent}>
          <div style={styles.buttonRow}>
            <Button
              onClick={toggleRecording}
              disabled={loading || !browserSupportsSpeechRecognition}
              variant="noShadow"
              size="lg"
              style={{
                ...styles.recordButton,
                backgroundColor: listening ? '#ef4444' : 'var(--main)'
              }}
            >
              {listening ? (
                <MicOff style={{height: '32px', width: '32px'}} />
              ) : (
                <Mic style={{height: '32px', width: '32px'}} />
              )}
            </Button>
            
            <Button
              onClick={() => switchMode('listen')}
              variant="noShadow"
              size="lg"
              style={styles.listenButton}
            >
              <Play style={{height: '32px', width: '32px'}} />
            </Button>
          </div>
          
          <div style={{textAlign: 'center'}}>
            <p style={styles.statusText}>
              {listening ? "Stop Recording" : "Start Recording"}
            </p>
            {status && <p style={styles.statusDetails}>{status}</p>}
          </div>
        </div>
      );
    }

    // Editing mode
    return (
      <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
        <div style={styles.formGroup}>
          <label htmlFor="post-title" style={styles.label}>
            Post Title
          </label>
          <Input
            id="post-title"
            placeholder="Enter a title for your post"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            disabled={loading}
            style={{fontSize: '14px'}}
          />
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="post-content" style={styles.label}>
            Post Content
          </label>
          <textarea
            id="post-content"
            placeholder="Your transcribed content appears here. You can edit it if needed."
            value={transcript}
            readOnly={true}
            disabled={loading}
            style={styles.textarea}
          />
        </div>
        
        <div style={styles.actionButtons}>
          {!listening ? (
            <Button
              onClick={toggleRecording}
              variant="noShadow"
              size="sm"
            >
              <Mic style={styles.iconSmall} />
              Continue
            </Button>
          ) : (
            <Button
              onClick={toggleRecording}
              variant="noShadow"
              size="sm"
              style={{backgroundColor: '#ef4444'}}
            >
              <MicOff style={styles.iconSmall} />
              Stop
            </Button>
          )}
          
          <Button
            onClick={createPost}
            disabled={loading || !postTitle.trim() || !transcript.trim()}
            variant="noShadow"
            size="sm"
          >
            {loading ? (
              <>
                <Loader2 style={styles.iconSmall} />
                Saving...
              </>
            ) : (
              <>
                <Send style={styles.iconSmall} />
                Save
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  // Wrap the content in a WindowStructure
  return (
    <WindowStructure windowId={id}>
      <div style={styles.container}>
        <h2 style={styles.header}>
          {mode === 'listen' ? 'Saved Messages' : 'Annon Voices is a free speech platform where anyone can talk about anything without worrying about their privacy, as we dont record your voice and neither play it! You can also listen to other peoples voices. Connect Wallet to get started ♥'}
        </h2>
        <div style={styles.contentArea}>
          {renderContent()}
        </div>
        
        {wallet && mode === 'record' && !isEditing && transcript && (
          <div style={styles.editMessage}>
            <Button 
              variant="noShadow" 
              onClick={startEditing}
              style={{width: '100%'}}
              size="sm"
            >
              Edit Transcribed Message
            </Button>
          </div>
        )}
      </div>
    </WindowStructure>
  );
}

export default AOVoiceRecorderApp;