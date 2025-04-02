// import React, { useState, useEffect } from 'react';
// import { TUICallKit, TUICallKitServer, TUICallType } from "@tencentcloud/call-uikit-react";
// import { TUICallEvent, tuiCallEngine } from 'tuicall-engine-webrtc';

// function CallPage() {
//     const [calleeUserID, setCalleeUserID] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
    
//     // Retrieve the caller's userID from localStorage
//     const callerUserID = localStorage.getItem('callerUserID') || 'Unknown';
  
//     useEffect(() => {
//       // Initialize TUICallKit when the component mounts
//       const initializeCallKit = async () => {
//         try {
//           await tuiCallEngine.on(TUICallEvent.ON_CALL_RECEIVED, handleOnCallReceived);
//         } catch (error) {
//           console.error('Error using tuiCallEngine', error);
//         }
//       };
  
//       initializeCallKit();
//     }
//     , [callerUserID]);

//     const handleOnCallReceived = (eventData) => {
//       const caller = eventData.sponsor || "Unknown Caller";
//       const acceptCall = window.confirm(`Incoming call from ${caller}. Accept?`);
//       if (caller) {
//         alert(`Incoming call from ${caller}`);
//       } else {
//         alert(`notify Error`);
//       }
//     }

//     const call = async () => {
//       if (!calleeUserID) {
//         alert('Please enter callee userID');
//         return;
//       }
//       try {
//         setIsLoading(true);
//         await TUICallKitServer.calls({
//           userIDList: [calleeUserID],
//           type: TUICallType.AUDIO_CALL,
//         }).catch((error) => {
//           console.error('Call error:', error);
//           alert('Call failed');
//         });
//       } catch (error) {
//         console.error('Error during call:', error);
//         alert('Call error');
//       } finally {
//         setIsLoading(false);
//       }
//     };
  
//     const handleIncomingCall = (eventData) => {
//       const caller = eventData.sponsor || "Unknown Caller";
//       const acceptCall = window.confirm(`Incoming call from ${caller}. Accept?`);
//       if (acceptCall) {
//         TUICallKitServer.accept();
//       } else {
//         TUICallKitServer.reject();
//       }
//     };
//     const containerStyle = {
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'center',
//       alignItems: 'center',
//       height: '100vh'
//     };

//     const CallButton = {
//         backgroundColor: '#4CBB17',
//         color: 'white',
//         border: 'none',
//         padding: '10px 20px',
//         cursor: 'pointer',
//         borderRadius: '5px',
//         marginTop: '20px',
//         };

//         const BoxStyle = {
//         width: '200px',
//         padding: '10px',
//         border: '1px solid gray',
//         borderRadius: '5px',
//         marginLeft: '10px',
//         }
  
//     return (
//       <div className="App" style={containerStyle}>
//         <h1>Call Page</h1>
//         <div>
//           <p>Hello, {callerUserID}!</p>
//         </div>
//         <div>
//           <span>Who do you want to call? </span>
//           <input 
//             style = {BoxStyle}
//             type="text" 
//             placeholder="Enter callee userID" 
//             onChange={(event) => setCalleeUserID(event.target.value)} 
//           />
//         </div>
//         <button onClick={call} disabled={isLoading} style={CallButton}>
//           Call
//         </button>
//         {isLoading && <p>Loading...</p>}
//         {/* TUICallKit Component for Call Interface UI */}
//         <TUICallKit onIncomingCall={handleIncomingCall} />
//       </div>
//     );
//   }
  
//   export default CallPage;
import React, { useState } from 'react';
import { TUICallKit, TUICallKitServer, TUICallType } from "@tencentcloud/call-uikit-react";

function CallPage() {
    const [calleeUserID, setCalleeUserID] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Retrieve the caller's userID from localStorage
    const callerUserID = localStorage.getItem('callerUserID') || 'Unknown';

    // Handle incoming call event
    const handleIncomingCall = (eventData) => {
        const caller = eventData?.sponsor || "Unknown Caller"; // Get sponsor (caller)
        console.log("================================",eventData); //where in the docment can check what data object event will return?
        //doc shows here returns a event, but what is it? need to know so I can grab needed info 

        // Check if this is the receiver's call (i.e., not the caller)
        if (caller !== calleeUserID) {
            // Show a pop-up alert for the incoming call
            const acceptCall = window.confirm(`📞 Let's have a call.`);

            // If accepted, accept the call, otherwise reject
            if (acceptCall) {
                TUICallKitServer.accept(); // Accept the call
            } else {
                TUICallKitServer.reject(); // Reject the call
            }
        }
    };

    // Initiate a call to the callee
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

    // Styles for the page
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
    };

    const CallButton = {
        backgroundColor: '#4CBB17',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        cursor: 'pointer',
        borderRadius: '5px',
        marginTop: '20px',
    };

    const BoxStyle = {
        width: '200px',
        padding: '10px',
        border: '1px solid gray',
        borderRadius: '5px',
        marginLeft: '10px',
    };

    return (
        <div className="App" style={containerStyle}>
            <h1>Call Page</h1>
            <div>
                <p>Hello, {callerUserID}!</p>
            </div>
            <div>
                <span>Who do you want to call? </span>
                <input 
                    style={BoxStyle}
                    type="text" 
                    placeholder="Enter callee userID" 
                    onChange={(event) => setCalleeUserID(event.target.value)} 
                />
            </div>
            <button onClick={call} disabled={isLoading} style={CallButton}>
                Call
            </button>
            {isLoading && <p>Loading...</p>}
            
            {/* TUICallKit Component for Call Interface UI */}
            <TUICallKit 
                beforeCalling={handleIncomingCall} // Use this to listen to incoming calls
            />
        </div>
    );
}

export default CallPage;


