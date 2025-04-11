import React, { useState } from "react";
import WindowStructure from "@/components/window";
import Image from "next/image";

interface TestingAppProps {
  id: number;
}

export default function TestingApp({ id }: TestingAppProps) {
  const [count, setCount] = useState<number>(0);
  
  const increment = () => {
    setCount(count + 1);
  };
  
  const decrement = () => {
    setCount(count - 1);
  };
  
  const reset = () => {
    setCount(0);
  };
  
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
    },
    counterValue: {
      fontSize: '3rem',
      marginBottom: '1rem',
    },
    button: {
      padding: '0.5rem 1rem',
      margin: '0.5rem',
      fontSize: '1.2rem',
      cursor: 'pointer',
    },
    iframeContainer: {
      width: '100%',
      height: '500px',
      border: 'none',
      marginTop: '1rem',
    }
  };
  
  return (
    <>
      <WindowStructure windowId={id}>
        
          <div className="web3">

          <iframe 
            src="https://excalidraw.com/" 
            title="Excalidraw" 
            style={styles.iframeContainer}
            allow="clipboard-read; clipboard-write"
            />
            </ div>
        {/* </div> */}
      </WindowStructure>
    </>
  );
}