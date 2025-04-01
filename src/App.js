import './App.css';
import React, { useState, useEffect } from 'react';
import { TUICallKit, TUICallKitServer, TUICallType } from "@tencentcloud/call-uikit-react";
import * as GenerateTestUserSig from "./debug/GenerateTestUserSig-es"; 

function App() {
  const SDKAppID = 20021401;  // Replace with your SDKAppID
  const SDKSecretKey = '86bb6ae8d9dc235241b8c2c9a05af9b7a9ce2a0827536504ca1741701a7cb80d';  // Replace with your SDKSecretKey
  
  const [callerUserID, setCallerUserID] = useState('');
  const [calleeUserID, setCalleeUserID] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shareableLink, setShareableLink] = useState('');

  // Initialize the TUICallKit component
  const init = async () => {
    if (!callerUserID) {
      alert('Please enter caller userID');
      return;
    }
    try {
      setIsLoading(true);
      const { userSig } = GenerateTestUserSig.genTestUserSig({ 
        userID: callerUserID,
        SDKAppID,
        SecretKey: SDKSecretKey,
      });

      await TUICallKitServer.init({
        userID: callerUserID,
        userSig,
        SDKAppID,
      });

      alert('TUICallKit initialized successfully');

      // Generate and display a shareable link
      const link = `${window.location.origin}/join?callerUserID=${callerUserID}`;
      setShareableLink(link);

    } catch (error) {
      console.error('Error during initialization:', error);
      alert('Initialization failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Make a 1v1 audio call
  const call = async () => {
    if (!calleeUserID) {
      alert('Please enter callee userID');
      return;
    }
    try {
      setIsLoading(true);
      await TUICallKitServer.calls({
        userIDList: [calleeUserID],
        type: TUICallType.AUDIO_CALL,
      }).catch((error) => {
        console.error('Call error:', error);
        alert('Call failed');
      });
    } catch (error) {
      console.error('Error during call:', error);
      alert('Call error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle incoming call with the onIncomingCall prop
  const handleIncomingCall = (eventData) => {
    const caller = eventData.sponsor || "Unknown Caller";
    
    // Show an alert with options to accept or reject
    const acceptCall = window.confirm(`Incoming call from ${caller}. Accept?`);
    if (acceptCall) {
      TUICallKitServer.accept();  // Accept the call
    } else {
      TUICallKitServer.reject();  // Reject the call
    }
  };

  return (
    <div className='App'>
      <span>Caller ID: </span>
      <input 
        type="text" 
        placeholder='Enter caller userID' 
        onChange={(event) => setCallerUserID(event.target.value)} 
      />
      <button onClick={init} disabled={isLoading}>Join</button> <br />
      
      <span>Callee ID: </span>
      <input 
        type="text" 
        placeholder='Enter callee userID' 
        onChange={(event) => setCalleeUserID(event.target.value)} 
      />
      <button onClick={call} disabled={isLoading}>Call</button>
      
      {isLoading && <p>Loading...</p>}
      
      {shareableLink && (
        <div>
          <p>Share this link with others to join the call:</p>
          <input type="text" value={shareableLink} readOnly />
          <button onClick={() => navigator.clipboard.writeText(shareableLink)}>Copy Link</button>
        </div>
      )}
      
      {/* TUICallKit Component for Call Interface UI */}
      <TUICallKit 
        onIncomingCall={handleIncomingCall}  // Use the incoming call handler
      />
    </div>
  );
}

export default App;
