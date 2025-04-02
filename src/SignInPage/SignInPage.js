import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TUICallKitServer } from "@tencentcloud/call-uikit-react";
import * as GenerateTestUserSig from "../debug/GenerateTestUserSig-es";

function SignInPage() {
    const SDKAppID = 20021401;  // Replace with your SDKAppID
    const SDKSecretKey = '86bb6ae8d9dc235241b8c2c9a05af9b7a9ce2a0827536504ca1741701a7cb80d';  // Replace with your SDKSecretKey
  
    const [callerUserID, setCallerUserID] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
  
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
  
        // alert('TUICallKit initialized successfully');
  
        // Save the callerUserID so that the Call page can use it
        localStorage.setItem('callerUserID', callerUserID);
  
        // Redirect to the Call page
        navigate('/call');
      } catch (error) {
        console.error('Error during initialization:', error);
        alert('Initialization failed');
      } finally {
        setIsLoading(false);
      }
    };
  
    const containerStyle = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    };

    const SignInButton = {
      backgroundColor: 'white',
      color: 'black',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      marginTop: '20px'
    };

    const BoxStyle = {
        width: '200px',
        padding: '10px',
        border: '1px solid gray',
        borderRadius: '5px',
        marginLeft: '10px',
        }
  
    return (
      <div className="App" style={containerStyle}>
        <h1 >Sign In</h1>
        <div>
          <span>What's your name? </span>
          <input 
            style = {BoxStyle}
            type="text" 
            placeholder="Enter caller userID" 
            onChange={(event) => setCallerUserID(event.target.value)} 
          />
        </div>
        <button onClick={init} disabled={isLoading} style={SignInButton}>
          Sign In
        </button>
        {isLoading && <p>Loading...</p>}
      </div>
    );
  }
  
  export default SignInPage;
