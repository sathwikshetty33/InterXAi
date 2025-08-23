// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getAuthToken, fetchWithToken } from "../utils/handleToken";
// import { Loader2, ArrowLeft, Send, MessageCircle, User } from "lucide-react";

// const InterviewSession = () => {
//   const { interviewId } = useParams();
//   const navigate = useNavigate();
//   const token = getAuthToken();

//   const [loading, setLoading] = useState(true);
//   const [sessionId, setSessionId] = useState(null);
//   const [currentQuestion, setCurrentQuestion] = useState(null);
//   const [answer, setAnswer] = useState("");
//   const [chatHistory, setChatHistory] = useState([]);
//   const [completed, setCompleted] = useState(false);
//   const [error, setError] = useState(null);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [endTime, setEndTime] = useState(null);
//   const [interviewActive, setInterviewActive] = useState(false);

//   const hasInitialized = useRef(false);
//   const chatEndRef = useRef(null);
//   const [questionLoading, setQuestionLoading] = useState(false);
//    const API_URL = import.meta.env.VITE_API_URL;

//   // ✅ Auto-scroll to bottom
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chatHistory]);

//   // ✅ Fetch interview details & initialize
//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     if (hasInitialized.current) return;
//     hasInitialized.current = true;

//     const initSession = async () => {
//       try {
//         const API_URL = import.meta.env.VITE_API_URL;
//         const interviewData = await fetchWithToken(
//           `${API_URL}/interview/get-all-interviews/`,
//           token
//         );
//         const currentInterview = interviewData.find(
//           (item) => item.id === parseInt(interviewId)
//         );

//         if (!currentInterview) {
//           setError("Interview not found.");
//           setLoading(false);
//           return;
//         }

//         const now = new Date();
//         const start = new Date(currentInterview.startTime);
//         const end = new Date(currentInterview.endTime);
//         setEndTime(end);

//         if (now < start) {
//           setError("Interview has not started yet.");
//           setLoading(false);
//           return;
//         }
//         if (now > end) {
//           setError("Interview time has ended.");
//           setLoading(false);
//           return;
//         }

//         setInterviewActive(true);
        
//         const data = await fetchWithToken(
//           `${API_URL}/interview/interview-session-initializer/${interviewId}/`,
//           token,
//           null,
//           "POST"
//         );

//         if (!data || !data.session_id) {
//           setError(data?.error || "Failed to start interview.");
//         } else {
//           setSessionId(data.session_id);
//           setCurrentQuestion(data.question);
//         }
//       } catch (err) {
//         setError("Error initializing session.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     initSession();
//   }, [interviewId, token, navigate]);

//   // ✅ Auto-end interview when endTime reached
//   useEffect(() => {
//     if (!endTime) return;
//     const timer = setInterval(() => {
//       if (new Date() >= endTime) {
//         setCompleted(true);
//         setCurrentQuestion(null);
//         clearInterval(timer);
//       }
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [endTime]);

//   // ✅ Redirect to previous page after completion
//   // ✅ Redirect to DasInterViewPlatform after completion
// useEffect(() => {
//   console.log("no poskjqnwjwqn")
//   if (completed && sessionId) {
//     console.log("eqv 2hbjqn2knw2qini23i")
//     navigate(`/dsa-interview-platform/${sessionId}`);
//   }
// }, [completed, sessionId, navigate]);


//   // ✅ Submit answer
//   const handleNext = async () => {
//   if (!answer.trim()) return;

//   setChatHistory((prev) => [...prev, { question: currentQuestion, answer }]);
//   setAnswer("");
//   setQuestionLoading(true);   // ✅ Trigger loading state first

//   try {
//     const data = await fetchWithToken(
//       `${API_URL}/interview/interview-session/${sessionId}/?answer=${encodeURIComponent(answer)}`,
//       token,
//       null,
//       "POST"
//     );

//     if (!data) {
//       setError("Error submitting answer.");
//       return;
//     }

//     if (data.completed) {
//       setCompleted(true);
//     } else {
//       setCurrentQuestion(data.current_question);
//     }
//   } catch (err) {
//     setError("Error submitting answer.");
//   } finally {
//     setQuestionLoading(false); // ✅ Stop loader once everything is ready
//   }
// };



//   const handleStartInterview = () => setShowWelcome(false);

//   // ✅ Loading
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
//         <Loader2 className="animate-spin w-10 h-10 text-purple-400" />
//       </div>
//     );
//   }

//   // ✅ Error screen
//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen text-white bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//         <p className="text-xl text-red-400">{error}</p>
//         <button
//           onClick={() => navigate(-1)}
//           className="mt-4 bg-purple-600 px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   // ✅ Welcome Screen
//   if (showWelcome) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
//         <div className="bg-slate-800/60 p-12 rounded-2xl border border-slate-700/50 shadow-2xl max-w-md w-full mx-4 text-center">
//           <div className="bg-purple-600/20 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
//             <MessageCircle size={48} className="text-purple-400" />
//           </div>
//           <h1 className="text-4xl font-bold text-purple-300 mb-4">
//             Welcome to the Interview
//           </h1>
//           <p className="text-slate-300 mb-8 text-lg leading-relaxed">
//             You're about to begin your interview session. Take your time with
//             each question and answer thoughtfully.
//           </p>
//           <button
//             onClick={handleStartInterview}
//             className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
//           >
//             Start Interview
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ✅ Completion Screen
//   if (completed) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
//         <div className="bg-green-700/30 border border-green-500/30 p-12 rounded-2xl shadow-2xl max-w-md w-full mx-4 text-center">
//           <div className="bg-green-600/20 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
//             <MessageCircle size={48} className="text-green-400" />
//           </div>
//           <h1 className="text-4xl font-bold text-green-300 mb-4">
//             Thank you for attending the interview!
//           </h1>
//           <p className="text-green-200 text-lg">
//             Redirecting to dashboard in a moment...
//           </p>
//           <div className="mt-6">
//             <Loader2 className="animate-spin w-6 h-6 text-green-400 mx-auto" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ✅ Main Interview UI
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
//       <div className="flex h-[calc(100vh-100px-5rem)]"> {/* Adjusted height to account for sticky header */}
//         {/* Chat History */}
//         <div className="w-1/3 bg-slate-800/40 border-r border-slate-700/50 flex flex-col">
//           <div className="p-4 border-b border-slate-700/50">
//             <h2 className="text-xl font-semibold text-purple-300 flex items-center gap-2">
//               <MessageCircle size={20} /> Chat History
//             </h2>
//           </div>
//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             {chatHistory.length === 0 ? (
//               <div className="text-center text-slate-400 mt-8">
//                 <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
//                 <p>No messages yet</p>
//                 <p className="text-sm mt-2">Your conversation will appear here</p>
//               </div>
//             ) : (
//               chatHistory.map((item, index) => (
//                 <div key={index} className="space-y-3">
//                   {/* Question */}
//                   <div className="flex gap-3">
//                     <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
//                       <MessageCircle size={16} className="text-white" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="bg-slate-700/50 p-3 rounded-lg">
//                         <p className="text-purple-300 font-medium text-sm">
//                           Question {index + 1}
//                         </p>
//                         <p className="text-slate-200 mt-1">{item.question}</p>
//                       </div>
//                     </div>
//                   </div>
//                   {/* Answer */}
//                   <div className="flex gap-3">
//                     <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
//                       <User size={16} className="text-white" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="bg-slate-600/50 p-3 rounded-lg">
//                         <p className="text-blue-300 font-medium text-sm">
//                           Your Answer
//                         </p>
//                         <p className="text-slate-200 mt-1">{item.answer}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//             <div ref={chatEndRef} />
//           </div>
//         </div>

//         {/* Question Section */}
//         <div className="flex-1 flex flex-col">
//           <div className="flex-1 p-6 flex items-center justify-center">
//             {questionLoading ? (
//   <div className="flex justify-center items-center h-60">
//     <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
//     <p className="ml-4 text-slate-300 text-lg">Evaluating your response...</p>
//   </div>
// ) : currentQuestion && (

//               <div className="max-w-3xl w-full">
//                 <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700/50 shadow-2xl">
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
//                       <MessageCircle size={20} className="text-white" />
//                     </div>
//                     <h3 className="text-xl font-bold text-purple-300">
//                       Question {chatHistory.length + 1}
//                     </h3>
//                   </div>
//                   <p className="text-xl text-slate-200 mb-8 leading-relaxed">
//                     {currentQuestion}
//                   </p>
//                   <div className="space-y-4">
//                     <textarea
//                       value={answer}
//                       onChange={(e) => setAnswer(e.target.value)}
//                       className="w-full bg-slate-900 text-white p-4 rounded-lg border border-slate-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 resize-none"
//                       rows="6"
//                       placeholder="Type your answer here..."
//                     />
//                     <div className="flex justify-end">
//                       <button
//                         onClick={handleNext}
//                         disabled={!answer.trim()}
//                         className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed px-8 py-3 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
//                       >
//                         <Send size={18} /> Submit Answer
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InterviewSession;




// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { OrbitControls, useGLTF, Html } from "@react-three/drei";
// import { getAuthToken, fetchWithToken } from "../utils/handleToken";
// import { Loader2, ArrowLeft, Send, MessageCircle, User, Volume2, VolumeX, Mic, MicOff } from "lucide-react";

// // Avatar Component with Lip Sync
// function AvatarModel({ isTalking }) {
//   const { scene } = useGLTF("/person.glb");
//   const meshRef = useRef();
//   const [debugInfo, setDebugInfo] = useState("");
  
//   useEffect(() => {
//     // Debug: Log available morph targets when model loads
//     if (scene) {
//       scene.traverse((child) => {
//         if (child.isMesh && child.morphTargetDictionary) {
//           console.log("Found mesh with morph targets:", Object.keys(child.morphTargetDictionary));
//           setDebugInfo(`Morph targets: ${Object.keys(child.morphTargetDictionary).join(", ")}`);
//         }
//       });
//     }
//   }, [scene]);
  
//   useFrame(() => {
//     if (!scene) return;
    
//     // Find any mesh with morph targets
//     scene.traverse((child) => {
//       if (child.isMesh && child.morphTargetDictionary && child.morphTargetInfluences) {
//         const morphDict = child.morphTargetDictionary;
        
//         // Try multiple possible mouth morph target names
//         const possibleMouthNames = [
//           'MouthOpen', 'mouthOpen', 'mouth_open', 'Mouth_Open',
//           'jawOpen', 'jaw_open', 'Jaw_Open', 'JawOpen',
//           'viseme_aa', 'viseme_A', 'A', 'aa', 'mouth',
//           'Mouth', 'jaw', 'Jaw'
//         ];
        
//         let mouthIndex = -1;
//         let foundKey = '';
        
//         for (const key of possibleMouthNames) {
//           if (morphDict[key] !== undefined) {
//             mouthIndex = morphDict[key];
//             foundKey = key;
//             break;
//           }
//         }
        
//         // If no specific mouth target found, try the first available morph target
//         if (mouthIndex === -1 && Object.keys(morphDict).length > 0) {
//           const firstKey = Object.keys(morphDict)[0];
//           mouthIndex = morphDict[firstKey];
//           foundKey = firstKey;
//         }
        
//         if (mouthIndex !== -1 && child.morphTargetInfluences[mouthIndex] !== undefined) {
//           // Create more varied mouth movement
//           const time = Date.now() * 0.01;
//           const baseMovement = Math.abs(Math.sin(time)) * 0.6;
//           const variation = Math.abs(Math.sin(time * 2.3)) * 0.3;
//           const movement = isTalking ? (baseMovement + variation) : 0;
          
//           child.morphTargetInfluences[mouthIndex] = movement;
//         }
//       }
//     });
    
//     // Also add some basic head movement animation
//     if (meshRef.current) {
//       const time = Date.now() * 0.002;
//       if (isTalking) {
//         meshRef.current.rotation.y = Math.sin(time) * 0.05;
//         meshRef.current.rotation.x = Math.sin(time * 1.3) * 0.02;
//       } else {
//         // Gentle idle movement
//         meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.02;
//         meshRef.current.rotation.x = Math.sin(time * 0.7) * 0.01;
//       }
//     }
//   });
  
//   return (
//     <group ref={meshRef}>
//       <primitive object={scene} scale={2} position={[0, -2, 0]} />
//       {/* Debug info - remove in production */}
//       {debugInfo && (
//         <Html position={[0, 3, 0]}>
//           <div className="text-xs text-white bg-black/50 p-2 rounded">
//             {debugInfo}
//           </div>
//         </Html>
//       )}
//     </group>
//   );
// }

// // Talking Avatar Component
// function TalkingAvatar({ text, isEnabled, onSpeechEnd }) {
//   const [isTalking, setIsTalking] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [debugMode, setDebugMode] = useState(false); // Set to false in production
//   const utteranceRef = useRef(null);

//   // Force talking state for testing - remove this in production
//   const [forceAnimation, setForceAnimation] = useState(false);

//   useEffect(() => {
//     if (!text || !isEnabled) return;

//     setIsLoading(true);
    
//     const utterance = new SpeechSynthesisUtterance(text);
//     utteranceRef.current = utterance;
    
//     utterance.lang = "en-US";
//     utterance.rate = 0.9;
//     utterance.pitch = 1.1;
    
//     utterance.onstart = () => {
//       setIsTalking(true);
//       setIsLoading(false);
//       console.log("Speech started - isTalking should be true");
//     };
    
//     utterance.onend = () => {
//       setIsTalking(false);
//       console.log("Speech ended - isTalking should be false");
//       onSpeechEnd?.();
//     };
    
//     utterance.onerror = (error) => {
//       console.error("Speech error:", error);
//       setIsTalking(false);
//       setIsLoading(false);
//     };

//     // Small delay to make it feel more natural
//     setTimeout(() => {
//       console.log("Starting speech synthesis...");
//       window.speechSynthesis.speak(utterance);
//     }, 500);

//     return () => {
//       if (utteranceRef.current) {
//         window.speechSynthesis.cancel();
//       }
//     };
//   }, [text, isEnabled, onSpeechEnd]);

//   const stopSpeaking = () => {
//     window.speechSynthesis.cancel();
//     setIsTalking(false);
//     setIsLoading(false);
//   };

//   const toggleForceAnimation = () => {
//     setForceAnimation(!forceAnimation);
//     console.log("Force animation:", !forceAnimation);
//   };

//   return (
//     <div className="relative w-full h-80 bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg overflow-hidden mb-6 border border-slate-700/50">
//       <Canvas camera={{ position: [0, 1, 5], fov: 40 }}>
//         <ambientLight intensity={0.8} />
//         <directionalLight position={[5, 5, 5]} intensity={1} />
//         <directionalLight position={[-5, 5, 5]} intensity={0.5} />
//         <pointLight position={[0, 2, 2]} intensity={0.5} />
//         <AvatarModel isTalking={isTalking || forceAnimation} />
//         <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} />
//       </Canvas>
      
//       {/* Debug Controls - Remove in production */}
//       {debugMode && (
//         <div className="absolute top-4 left-4 space-y-2">
//           <button
//             onClick={toggleForceAnimation}
//             className={`px-3 py-1 rounded text-xs ${
//               forceAnimation ? 'bg-green-600 text-white' : 'bg-slate-600 text-slate-300'
//             }`}
//           >
//             {forceAnimation ? 'Stop Test Animation' : 'Test Animation'}
//           </button>
//           <div className="text-xs text-white bg-black/70 p-2 rounded">
//             <div>isTalking: {isTalking.toString()}</div>
//             <div>isLoading: {isLoading.toString()}</div>
//             <div>forceAnimation: {forceAnimation.toString()}</div>
//           </div>
//         </div>
//       )}
      
//       {/* Speech Indicator */}
//       <div className="absolute top-4 right-4 flex items-center gap-2">
//         {isLoading && (
//           <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-full">
//             <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
//             <span className="text-sm text-slate-300">Preparing...</span>
//           </div>
//         )}
        
//         {isTalking && (
//           <button
//             onClick={stopSpeaking}
//             className="flex items-center gap-2 bg-red-600/80 hover:bg-red-700/80 px-3 py-1 rounded-full transition-all duration-200"
//             title="Stop Speaking"
//           >
//             <VolumeX className="w-4 h-4 text-white" />
//             <span className="text-sm text-white">Stop</span>
//  </button>
//         )}
//       </div>
      
//       {/* Talking Animation Indicator */}
//       {(isTalking || forceAnimation) && (
//         <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-green-600/20 border border-green-500/30 px-3 py-2 rounded-full">
//           <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//           <span className="text-sm text-green-300">
//             {forceAnimation ? 'Testing Animation' : 'Speaking...'}
//           </span>
//         </div>
//       )}
//     </div>
//   );
// }

// const InterviewSession = () => {
//   const { interviewId } = useParams();
//   const navigate = useNavigate();
//   const token = getAuthToken();

//   const [loading, setLoading] = useState(true);
//   const [sessionId, setSessionId] = useState(null);
//   const [currentQuestion, setCurrentQuestion] = useState(null);
//   const [answer, setAnswer] = useState("");
//   const [chatHistory, setChatHistory] = useState([]);
//   const [completed, setCompleted] = useState(false);
//   const [error, setError] = useState(null);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [endTime, setEndTime] = useState(null);
//   const [interviewActive, setInterviewActive] = useState(false);
//   const [speechEnabled, setSpeechEnabled] = useState(true);
//   const [questionSpoken, setQuestionSpoken] = useState(false);
//   const hasInitialized = useRef(false);
//   const chatEndRef = useRef(null);
//   const [questionLoading, setQuestionLoading] = useState(false);
//   const API_URL = import.meta.env.VITE_API_URL;
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chatHistory]);
//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//     if (hasInitialized.current) return;
//     hasInitialized.current = true;

//     const initSession = async () => {
//       try {
//         const API_URL = import.meta.env.VITE_API_URL;
//         const interviewData = await fetchWithToken(
//           `${API_URL}/interview/get-all-interviews/`,
//           token
//         );
//         const currentInterview = interviewData.find(
//           (item) => item.id === parseInt(interviewId)
//         );

//         if (!currentInterview) {
//           setError("Interview not found.");
//           setLoading(false);
//           return;
//         }
//         const now = new Date();
//         const start = new Date(currentInterview.startTime);
//         const end = new Date(currentInterview.endTime);
//         setEndTime(end);
//         if (now < start) {
//           setError("Interview has not started yet.");
//           setLoading(false);
//           return;
//         }
//         if (now > end) {
//           setError("Interview time has ended.");
//           setLoading(false);
//           return;
//         }
//         setInterviewActive(true);
//         const data = await fetchWithToken(
//           `${API_URL}/interview/interview-session-initializer/${interviewId}/`,
//           token,
//           null,
//           "POST"
//         );
//         if (!data || !data.session_id) {
//           setError(data?.error || "Failed to start interview.");
//         } else {
//           setSessionId(data.session_id);
//           setCurrentQuestion(data.question);
//         }
//       } catch (err) {
//         setError("Error initializing session.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     initSession();
//   }, [interviewId, token, navigate]);
//   useEffect(() => {
//     if (!endTime) return;
//     const timer = setInterval(() => {
//       if (new Date() >= endTime) {
//         setCompleted(true);
//         setCurrentQuestion(null);
//         clearInterval(timer);
//       }
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [endTime]);
//   useEffect(() => {
//     if (completed && sessionId) {
//       navigate(`/dsa-interview-platform/${sessionId}`);
//     }
//   }, [completed, sessionId, navigate]);
//   useEffect(() => {
//     if (currentQuestion && !questionLoading) {
//       setQuestionSpoken(false);
//     }
//   }, [currentQuestion, questionLoading]);
//   const handleNext = async () => {
//     if (!answer.trim()) return;

//     setChatHistory((prev) => [...prev, { question: currentQuestion, answer }]);
//     setAnswer("");
//     setQuestionLoading(true);

//     try {
//       const data = await fetchWithToken(
//         `${API_URL}/interview/interview-session/${sessionId}/?answer=${encodeURIComponent(answer)}`,
//         token,
//         null,
//         "POST"
//       );

//       if (!data) {
//         setError("Error submitting answer.");
//         return;
//       }

//       if (data.completed) {
//         setCompleted(true);
//       } else {
//         setCurrentQuestion(data.current_question);
//       }
//     } catch (err) {
//       setError("Error submitting answer.");
//     } finally {
//       setQuestionLoading(false);
//     }
//   };

//   const handleStartInterview = () => setShowWelcome(false);

//   const handleSpeechEnd = () => {
//     setQuestionSpoken(true);
//   };

//   const toggleSpeech = () => {
//     if (speechEnabled) {
//       window.speechSynthesis.cancel();
//     }
//     setSpeechEnabled(!speechEnabled);
//   };
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
//         <Loader2 className="animate-spin w-10 h-10 text-purple-400" />
//       </div>
//     );
//   }
//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen text-white bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//         <p className="text-xl text-red-400">{error}</p>
//         <button
//           onClick={() => navigate(-1)}
//           className="mt-4 bg-purple-600 px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }
//   if (showWelcome) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
//         <div className="bg-slate-800/60 p-12 rounded-2xl border border-slate-700/50 shadow-2xl max-w-md w-full mx-4 text-center">
//           <div className="bg-purple-600/20 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
//             <MessageCircle size={48} className="text-purple-400" />
//           </div>
//           <h1 className="text-4xl font-bold text-purple-300 mb-4">
//             Welcome to the AI Interview
//           </h1>
//           <p className="text-slate-300 mb-8 text-lg leading-relaxed">
//             You're about to begin your interactive interview session with an AI interviewer. 
//             Take your time with each question and answer thoughtfully.
//           </p>
//           <button
//             onClick={handleStartInterview}
//             className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
//           >
//             Start Interview
//           </button>
//         </div>
//       </div>
//     );
//   }
//   if (completed) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
//         <div className="bg-green-700/30 border border-green-500/30 p-12 rounded-2xl shadow-2xl max-w-md w-full mx-4 text-center">
//           <div className="bg-green-600/20 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
//             <MessageCircle size={48} className="text-green-400" />
//           </div>
//           <h1 className="text-4xl font-bold text-green-300 mb-4">
//             Thank you for attending the interview!
//           </h1>
//           <p className="text-green-200 text-lg">
//             Redirecting to dashboard in a moment...
//           </p>
//           <div className="mt-6">
//             <Loader2 className="animate-spin w-6 h-6 text-green-400 mx-auto" />
//           </div>
//         </div>
//       </div>
//     );
//   }
//   return (<>
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
//       <div className="sticky top-0 z-10 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-all duration-200"
//             >
//               <ArrowLeft size={20} />
//             </button>
//             <h1 className="text-xl font-bold text-purple-300">AI Interview Session</h1>
//           </div>
//           <div className="flex items-center gap-4">
//             <button
//               onClick={toggleSpeech}
//               className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
//                 speechEnabled
//                   ? "bg-green-600/20 border border-green-500/30 text-green-300"
//                   : "bg-red-600/20 border border-red-500/30 text-red-300"
//               }`}
//             >
//               {speechEnabled ? (
//                 <>
//                   <Volume2 size={16} />
//                   <span className="text-sm">Speech On</span>
//                 </>
//               ) : (
//                 <>
//                   <VolumeX size={16} />
//                   <span className="text-sm">Speech Off</span>
//                 </>
//               )}
//             </button>
//             <div className="text-sm text-slate-400">
//               Question {chatHistory.length + 1}
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="flex h-[calc(100vh-80px)]">
//         <div className="w-1/3 bg-slate-800/40 border-r border-slate-700/50 flex flex-col">
//           <div className="p-4 border-b border-slate-700/50">
//             <h2 className="text-xl font-semibold text-purple-300 flex items-center gap-2">
//               <MessageCircle size={20} /> Interview History
//             </h2>
//           </div>
//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             {chatHistory.length === 0 ? (
//               <div className="text-center text-slate-400 mt-8">
//                 <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
//                 <p>No conversation yet</p>
//                 <p className="text-sm mt-2">Your interview will appear here</p>
//               </div>
//             ) : (
//               chatHistory.map((item, index) => (
//                 <div key={index} className="space-y-3">
//                   <div className="flex gap-3">
//                     <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
//                       <MessageCircle size={16} className="text-white" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="bg-slate-700/50 p-3 rounded-lg">
//                         <p className="text-purple-300 font-medium text-sm">
//                           Question {index + 1}
//                         </p>
//                         <p className="text-slate-200 mt-1">{item.question}</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex gap-3">
//                     <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
//                       <User size={16} className="text-white" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="bg-slate-600/50 p-3 rounded-lg">
//                         <p className="text-blue-300 font-medium text-sm">
//                           Your Answer
//                         </p>
//                         <p className="text-slate-200 mt-1">{item.answer}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//             <div ref={chatEndRef} />
//           </div>
//         </div>
//         <div className="flex-1 flex flex-col">
//           <div className="flex-1 p-6 flex flex-col">
//             {questionLoading ? (
//               <div className="flex-1 flex justify-center items-center">
//                 <div className="text-center">
//                   <Loader2 className="w-10 h-10 text-purple-400 animate-spin mx-auto mb-4" />
//                   <p className="text-slate-300 text-lg">Evaluating your response...</p>
//                   <p className="text-slate-400 text-sm mt-2">Preparing next question</p>
//                 </div>
//               </div>
//             ) : currentQuestion ? (
//               <>
//                 <TalkingAvatar
//                   text={speechEnabled && !questionSpoken ? currentQuestion : ""}
//                   isEnabled={speechEnabled && !questionSpoken}
//                   onSpeechEnd={handleSpeechEnd}
//                 />
//                 <div className="flex-1 flex items-center justify-center">
//                   <div className="max-w-3xl w-full">
//                     <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700/50 shadow-2xl">
//                       <div className="flex items-center gap-3 mb-6">
//                         <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
//                           <MessageCircle size={20} className="text-white" />
//                         </div>
//                         <h3 className="text-xl font-bold text-purple-300">
//                           Question {chatHistory.length + 1}
//                         </h3>
//                         {speechEnabled && !questionSpoken && (
//                           <div className="ml-auto flex items-center gap-2 text-green-400 text-sm">
//                             <Volume2 size={16} />
//                             <span>AI is speaking...</span>
//                           </div>
//                         )}
//                       </div>
//                       <p className="text-xl text-slate-200 mb-8 leading-relaxed">
//                         {currentQuestion}
//                       </p>                 
//                       <div className="space-y-4">
//                         <textarea
//                           value={answer}
//                           onChange={(e) => setAnswer(e.target.value)}
//                           className="w-full bg-slate-900 text-white p-4 rounded-lg border border-slate-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 resize-none"
//                           rows="6"
//                           placeholder="Type your answer here..."
//                         />
//                         <div className="flex justify-between items-center">
//                           <div className="text-sm text-slate-400">
//                             {answer.length} characters
//                           </div>
//                           <button
//                             onClick={handleNext}
//                             disabled={!answer.trim()}
//                             className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed px-8 py-3 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
//                           >
//                             <Send size={18} /> Submit Answer
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             ) : null}
//           </div>
//         </div>
//       </div>
//     </div></>
//   );
// };

// export default InterviewSession;





// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import { OrbitControls, useGLTF, Html } from "@react-three/drei";
// import { getAuthToken, fetchWithToken } from "../utils/handleToken";
// import { Loader2, ArrowLeft, Send, MessageCircle, User, Volume2, VolumeX, Mic, MicOff } from "lucide-react";

// // Face-focused camera component
// function FaceCamera() {
//   const orbitControlsRef = useRef();
//   const { camera } = useThree();

//   useEffect(() => {
//     // Position camera to focus on face area where morph targets work
//     camera.position.set(0, 1.8, 3.5); // Adjusted for face focus
//     camera.lookAt(0, 1.8, 0); // Look directly at face level
//     camera.updateProjectionMatrix();
//   }, [camera]);

//   useFrame(() => {
//     if (orbitControlsRef.current) {
//       orbitControlsRef.current.target.set(0, 1.8, 0); // Face-level target
//       orbitControlsRef.current.update();
//     }
//   });

//   return (
//     <OrbitControls
//       ref={orbitControlsRef}
//       enableZoom={false}
//       enablePan={false}
//       maxPolarAngle={Math.PI / 2}
//       minPolarAngle={0}
//     />
//   );
// }

// // Enhanced Avatar Component with Better Lip Sync
// function AvatarModel({ isTalking, speechProgress = 0 }) {
//   const { scene } = useGLTF("/person.glb");
//   const meshRef = useRef();
//   const [debugInfo, setDebugInfo] = useState("");
//   const [foundMorphTargets, setFoundMorphTargets] = useState([]);
//   const animationRef = useRef({ time: 0, intensity: 0 });
  
//   useEffect(() => {
//     // Debug: Log available morph targets when model loads
//     if (scene) {
//       const targets = [];
//       scene.traverse((child) => {
//         if (child.isMesh && child.morphTargetDictionary) {
//           const morphKeys = Object.keys(child.morphTargetDictionary);
//           console.log("Found mesh with morph targets:", morphKeys);
//           targets.push(...morphKeys);
//           setDebugInfo(`Morph targets: ${morphKeys.join(", ")}`);
//         }
//       });
//       setFoundMorphTargets(targets);
//     }
//   }, [scene]);
  
//   useFrame((state) => {
//     if (!scene) return;
    
//     const deltaTime = state.clock.getDelta();
//     animationRef.current.time += deltaTime;
    
//     // Smooth transition for talking intensity
//     const targetIntensity = isTalking ? 1 : 0;
//     animationRef.current.intensity += (targetIntensity - animationRef.current.intensity) * deltaTime * 8;
    
//     // Find any mesh with morph targets and apply lip sync
//     scene.traverse((child) => {
//       if (child.isMesh && child.morphTargetDictionary && child.morphTargetInfluences) {
//         const morphDict = child.morphTargetDictionary;
        
//         // Enhanced list of possible mouth morph target names
//         const possibleMouthNames = [
//           // Common mouth/jaw targets
//           'MouthOpen', 'mouthOpen', 'mouth_open', 'Mouth_Open', 'MOUTH_OPEN',
//           'jawOpen', 'jaw_open', 'Jaw_Open', 'JawOpen', 'JAW_OPEN',
          
//           // Viseme targets (phoneme-based)
//           'viseme_aa', 'viseme_A', 'viseme_E', 'viseme_I', 'viseme_O', 'viseme_U',
//           'A', 'E', 'I', 'O', 'U', 'aa', 'ee', 'ii', 'oo', 'uu',
          
//           // Generic mouth targets
//           'mouth', 'Mouth', 'MOUTH', 'jaw', 'Jaw', 'JAW',
          
//           // ReadyPlayerMe style targets
//           'mouthFunnel', 'mouthPucker', 'mouthSmile', 'mouthFrown',
          
//           // Mixamo/other common targets
//           'Mouth_Open_Wide', 'jaw_drop', 'mouth_wide'
//         ];
        
//         let mouthIndex = -1;
//         let foundKey = '';
        
//         // Try to find a mouth morph target
//         for (const key of possibleMouthNames) {
//           if (morphDict[key] !== undefined) {
//             mouthIndex = morphDict[key];
//             foundKey = key;
//             break;
//           }
//         }
        
//         // If no specific mouth target found, try the first available morph target
//         if (mouthIndex === -1 && Object.keys(morphDict).length > 0) {
//           const firstKey = Object.keys(morphDict)[0];
//           mouthIndex = morphDict[firstKey];
//           foundKey = firstKey;
//         }
        
//         if (mouthIndex !== -1 && child.morphTargetInfluences[mouthIndex] !== undefined) {
//           // Enhanced mouth animation with more realistic patterns
//           const time = animationRef.current.time;
//           const intensity = animationRef.current.intensity;
          
//           // Create varied mouth movement patterns
//           const baseFreq = 4 + Math.sin(time * 0.3) * 0.5; // Varying frequency
//           const baseMovement = Math.abs(Math.sin(time * baseFreq)) * 0.7;
//           const variation1 = Math.abs(Math.sin(time * baseFreq * 1.7)) * 0.2;
//           const variation2 = Math.abs(Math.sin(time * baseFreq * 2.3)) * 0.15;
//           const microVariation = Math.sin(time * 15) * 0.05;
          
//           // Combine variations for more natural speech
//           const totalMovement = (baseMovement + variation1 + variation2 + microVariation) * intensity;
          
//           // Apply with smooth clamping
//           child.morphTargetInfluences[mouthIndex] = Math.min(Math.max(totalMovement, 0), 1);
          
//           // Also animate other related morph targets if available
//           ['mouthSmile', 'mouthFrown', 'mouthPucker'].forEach(targetName => {
//             if (morphDict[targetName] !== undefined) {
//               const targetIndex = morphDict[targetName];
//               const subtleMovement = Math.sin(time * 6 + targetIndex) * 0.1 * intensity;
//               child.morphTargetInfluences[targetIndex] = Math.min(Math.max(subtleMovement, 0), 0.3);
//             }
//           });
//         }
//       }
//     });
    
//     // Enhanced head movement animation
//     if (meshRef.current) {
//       const time = animationRef.current.time;
//       const intensity = animationRef.current.intensity;
      
//       if (intensity > 0.1) {
//         // More dynamic head movement while talking
//         meshRef.current.rotation.y = Math.sin(time * 2) * 0.08 * intensity;
//         meshRef.current.rotation.x = Math.sin(time * 1.7) * 0.03 * intensity;
//         meshRef.current.rotation.z = Math.sin(time * 1.3) * 0.02 * intensity;
        
//         // Slight head bobbing
//         meshRef.current.position.y = -2 + Math.sin(time * 3) * 0.02 * intensity;
//       } else {
//         // Gentle idle movement
//         meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.02;
//         meshRef.current.rotation.x = Math.sin(time * 0.7) * 0.01;
//         meshRef.current.rotation.z = 0;
//         meshRef.current.position.y = -2;
//       }
//     }
//   });
  
//   return (
//     <group ref={meshRef}>
//       <primitive object={scene} scale={2} position={[0, -2, 0]} />
//       {/* Debug info - remove in production */}
//       {debugInfo && (
//         <Html position={[0, 3, 0]}>
//           <div className="text-xs text-white bg-black/50 p-2 rounded max-w-md">
//             <div>{debugInfo}</div>
//             <div className="mt-1 text-green-400">
//               isTalking: {isTalking.toString()}
//             </div>
//             <div className="text-yellow-400">
//               Intensity: {animationRef.current?.intensity?.toFixed(2) || 0}
//             </div>
//           </div>
//         </Html>
//       )}
//     </group>
//   );
// }

// // Enhanced Talking Avatar Component with Better Speech Detection
// function TalkingAvatar({ text, isEnabled, onSpeechEnd }) {
//   const [isTalking, setIsTalking] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [debugMode, setDebugMode] = useState(true); // Set to false in production
//   const [speechProgress, setSpeechProgress] = useState(0);
//   const utteranceRef = useRef(null);
//   const speechTimeoutRef = useRef(null);

//   // Force talking state for testing - remove this in production
//   const [forceAnimation, setForceAnimation] = useState(false);

//   useEffect(() => {
//     if (!text || !isEnabled) {
//       setIsTalking(false);
//       return;
//     }

//     console.log("Starting speech synthesis for:", text.substring(0, 50) + "...");
//     setIsLoading(true);
    
//     // Cancel any previous speech
//     window.speechSynthesis.cancel();
    
//     const utterance = new SpeechSynthesisUtterance(text);
//     utteranceRef.current = utterance;
    
//     // Enhanced speech settings
//     utterance.lang = "en-US";
//     utterance.rate = 0.85; // Slightly slower for better lip sync
//     utterance.pitch = 1.0;
//     utterance.volume = 0.8;
    
//     // Try to get a more natural voice
//     const voices = window.speechSynthesis.getVoices();
//     const preferredVoice = voices.find(voice => 
//       voice.lang.startsWith('en') && 
//       (voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.name.includes('Natural'))
//     );
//     if (preferredVoice) {
//       utterance.voice = preferredVoice;
//     }
    
//     utterance.onstart = () => {
//       console.log("✓ Speech started - setting isTalking to true");
//       setIsTalking(true);
//       setIsLoading(false);
//       setSpeechProgress(0);
//     };
    
//     utterance.onboundary = (event) => {
//       // Track speech progress for more accurate lip sync
//       if (text) {
//         const progress = event.charIndex / text.length;
//         setSpeechProgress(progress);
//         console.log(`Speech progress: ${(progress * 100).toFixed(1)}%`);
//       }
//     };
    
//     utterance.onend = () => {
//       console.log("✓ Speech ended - setting isTalking to false");
//       setIsTalking(false);
//       setSpeechProgress(0);
//       onSpeechEnd?.();
//     };
    
//     utterance.onerror = (error) => {
//       console.error("Speech error:", error);
//       setIsTalking(false);
//       setIsLoading(false);
//       setSpeechProgress(0);
//     };

//     // Clear any existing timeout
//     if (speechTimeoutRef.current) {
//       clearTimeout(speechTimeoutRef.current);
//     }

//     // Start speech with a small delay for more natural feel
//     speechTimeoutRef.current = setTimeout(() => {
//       console.log("Initiating speech synthesis...");
//       try {
//         window.speechSynthesis.speak(utterance);
        
//         // Fallback: Force set isTalking after a short delay if onstart doesn't fire
//         setTimeout(() => {
//           if (!isTalking && window.speechSynthesis.speaking) {
//             console.log("⚠ Fallback: Force setting isTalking to true");
//             setIsTalking(true);
//             setIsLoading(false);
//           }
//         }, 1000);
        
//       } catch (error) {
//         console.error("Speech synthesis error:", error);
//         setIsTalking(false);
//         setIsLoading(false);
//       }
//     }, 300);

//     return () => {
//       if (speechTimeoutRef.current) {
//         clearTimeout(speechTimeoutRef.current);
//       }
//       if (utteranceRef.current) {
//         window.speechSynthesis.cancel();
//       }
//       setIsTalking(false);
//     };
//   }, [text, isEnabled, onSpeechEnd]);

//   const stopSpeaking = () => {
//     window.speechSynthesis.cancel();
//     setIsTalking(false);
//     setIsLoading(false);
//     setSpeechProgress(0);
//     if (speechTimeoutRef.current) {
//       clearTimeout(speechTimeoutRef.current);
//     }
//   };

//   const toggleForceAnimation = () => {
//     const newState = !forceAnimation;
//     setForceAnimation(newState);
//     console.log("🔧 Force animation:", newState);
//   };

//   return (
//     <div className="relative w-full h-80 bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg overflow-hidden mb-6 border border-slate-700/50">
//       <Canvas camera={{ position: [0, 1.6, 2.5], fov: 25 }}>
//         <ambientLight intensity={0.8} />
//         <directionalLight position={[5, 5, 5]} intensity={1} />
//         <directionalLight position={[-5, 5, 5]} intensity={0.5} />
//         <pointLight position={[0, 2, 2]} intensity={0.5} />
        
//         <AvatarModel 
//           isTalking={isTalking || forceAnimation} 
//           speechProgress={speechProgress}
//         />
//         <FaceCamera />
//       </Canvas>
      
//       {/* Enhanced Debug Controls */}
//       {debugMode && (
//         <div className="absolute top-4 left-4 space-y-2">
//           <button
//             onClick={toggleForceAnimation}
//             className={`px-3 py-1 rounded text-xs font-medium ${
//               forceAnimation ? 'bg-green-600 text-white' : 'bg-slate-600 text-slate-300'
//             }`}
//           >
//             {forceAnimation ? '🟢 Stop Test' : '🔴 Test Animation'}
//           </button>
//           <div className="text-xs text-white bg-black/80 p-3 rounded max-w-xs">
//             <div className="space-y-1">
//               <div className={`font-bold ${isTalking ? 'text-green-400' : 'text-red-400'}`}>
//                 🎤 isTalking: {isTalking.toString()}
//               </div>
//               <div className={`${isLoading ? 'text-yellow-400' : 'text-slate-400'}`}>
//                 ⏳ isLoading: {isLoading.toString()}
//               </div>
//               <div className="text-blue-400">
//                 🔧 forceAnimation: {forceAnimation.toString()}
//               </div>
//               <div className="text-purple-400">
//                 📊 Progress: {(speechProgress * 100).toFixed(0)}%
//               </div>
//               <div className={`text-xs ${window.speechSynthesis.speaking ? 'text-green-300' : 'text-gray-400'}`}>
//                 🔊 Browser Speaking: {window.speechSynthesis.speaking.toString()}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {/* Speech Status Indicators */}
//       <div className="absolute top-4 right-4 flex items-center gap-2">
//         {isLoading && (
//           <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-2 rounded-full border border-yellow-500/30">
//             <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />
//             <span className="text-sm text-yellow-300">Preparing speech...</span>
//           </div>
//         )}
        
//         {(isTalking || forceAnimation) && !isLoading && (
//           <button
//             onClick={stopSpeaking}
//             className="flex items-center gap-2 bg-red-600/90 hover:bg-red-700/90 px-3 py-2 rounded-full transition-all duration-200 border border-red-500/30"
//             title="Stop Speaking"
//           >
//             <VolumeX className="w-4 h-4 text-white" />
//             <span className="text-sm text-white">Stop</span>
//           </button>
//         )}
//       </div>
      
//       {/* Enhanced Talking Animation Indicator */}
//       {(isTalking || forceAnimation) && (
//         <div className="absolute bottom-4 left-4 flex items-center gap-3 bg-green-600/20 border border-green-500/40 px-4 py-3 rounded-full backdrop-blur-sm">
//           <div className="relative">
//             <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
//             <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-30"></div>
//           </div>
//           <div className="flex flex-col">
//             <span className="text-sm font-medium text-green-200">
//               {forceAnimation ? '🔧 Testing Animation' : '🗣️ AI Speaking'}
//             </span>
//             {speechProgress > 0 && (
//               <div className="w-24 h-1 bg-green-900/50 rounded-full mt-1">
//                 <div 
//                   className="h-full bg-green-400 rounded-full transition-all duration-200"
//                   style={{ width: `${speechProgress * 100}%` }}
//                 ></div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import { OrbitControls, useGLTF, Html } from "@react-three/drei";
// import { getAuthToken, fetchWithToken } from "../utils/handleToken";
// import { Loader2, ArrowLeft, Send, MessageCircle, User, Volume2, VolumeX } from "lucide-react";

// // Face-focused camera component
// function FaceCamera() {
//   const orbitControlsRef = useRef();
//   const { camera } = useThree();

//   useEffect(() => {
//     camera.lookAt(0, 1.6, 0); // Align target with Canvas camera height
//   }, [camera]);

//   useFrame(() => {
//     if (orbitControlsRef.current) {
//       orbitControlsRef.current.target.set(0, 1.6, 0); // Face-level target
//       orbitControlsRef.current.update();
//     }
//   });

//   return (
//     <OrbitControls
//       ref={orbitControlsRef}
//       enableZoom={false}
//       enablePan={false}
//       maxPolarAngle={Math.PI / 2}
//       minPolarAngle={0}
//     />
//   );
// }

// // Enhanced Avatar Component with Better Lip Sync
// function AvatarModel({ isTalking, speechProgress = 0 }) {
//   const { scene } = useGLTF("/person.glb");
//   const meshRef = useRef();
//   const [debugInfo, setDebugInfo] = useState("");
//   const [foundMorphTargets, setFoundMorphTargets] = useState([]);
//   const animationRef = useRef({ time: 0, intensity: 0 });
//   const morphMeshRef = useRef(null); // Cache mesh with morph targets

//   useEffect(() => {
//     // Cache mesh with morph targets
//     if (scene) {
//       const targets = [];
//       scene.traverse((child) => {
//         if (child.isMesh && child.morphTargetDictionary) {
//           morphMeshRef.current = child; // Store the first mesh with morph targets
//           const morphKeys = Object.keys(child.morphTargetDictionary);
//           console.log("Found mesh with morph targets:", morphKeys);
//           targets.push(...morphKeys);
//           setDebugInfo(`Morph targets: ${morphKeys.join(", ")}`);
//         }
//       });
//       setFoundMorphTargets(targets);
//     }
//   }, [scene]);

//   useFrame((state) => {
//     if (!morphMeshRef.current || (!isTalking && speechProgress === 0)) return; // Skip if not talking

//     const deltaTime = state.clock.getDelta();
//     animationRef.current.time += deltaTime;

//     // Smooth transition for talking intensity
//     const targetIntensity = isTalking ? 1 : 0;
//     animationRef.current.intensity += (targetIntensity - animationRef.current.intensity) * deltaTime * 8;

//     const child = morphMeshRef.current;
//     if (child.morphTargetDictionary && child.morphTargetInfluences) {
//       const morphDict = child.morphTargetDictionary;

//       const possibleMouthNames = [
//         'MouthOpen', 'mouthOpen', 'mouth_open', 'Mouth_Open', 'MOUTH_OPEN',
//         'jawOpen', 'jaw_open', 'Jaw_Open', 'JawOpen', 'JAW_OPEN',
//         'viseme_aa', 'viseme_A', 'viseme_E', 'viseme_I', 'viseme_O', 'viseme_U',
//         'A', 'E', 'I', 'O', 'U', 'aa', 'ee', 'ii', 'oo', 'uu',
//         'mouth', 'Mouth', 'MOUTH', 'jaw', 'Jaw', 'JAW',
//         'mouthFunnel', 'mouthPucker', 'mouthSmile', 'mouthFrown',
//         'Mouth_Open_Wide', 'jaw_drop', 'mouth_wide'
//       ];

//       let mouthIndex = -1;
//       let foundKey = '';

//       for (const key of possibleMouthNames) {
//         if (morphDict[key] !== undefined) {
//           mouthIndex = morphDict[key];
//           foundKey = key;
//           break;
//         }
//       }

//       if (mouthIndex === -1 && Object.keys(morphDict).length > 0) {
//         const firstKey = Object.keys(morphDict)[0];
//         mouthIndex = morphDict[firstKey];
//         foundKey = firstKey;
//       }

//       if (mouthIndex !== -1 && child.morphTargetInfluences[mouthIndex] !== undefined) {
//         const time = animationRef.current.time;
//         const intensity = animationRef.current.intensity;

//         const baseFreq = 4 + Math.sin(time * 0.3) * 0.5;
//         const baseMovement = Math.abs(Math.sin(time * baseFreq)) * 0.7;
//         const variation1 = Math.abs(Math.sin(time * baseFreq * 1.7)) * 0.2;
//         const variation2 = Math.abs(Math.sin(time * baseFreq * 2.3)) * 0.15;
//         const microVariation = Math.sin(time * 15) * 0.05;

//         const totalMovement = (baseMovement + variation1 + variation2 + microVariation) * intensity;
//         child.morphTargetInfluences[mouthIndex] = Math.min(Math.max(totalMovement, 0), 1);

//         ['mouthSmile', 'mouthFrown', 'mouthPucker'].forEach(targetName => {
//           if (morphDict[targetName] !== undefined) {
//             const targetIndex = morphDict[targetName];
//             const subtleMovement = Math.sin(time * 6 + targetIndex) * 0.1 * intensity;
//             child.morphTargetInfluences[targetIndex] = Math.min(Math.max(subtleMovement, 0), 0.3);
//           }
//         });
//       }
//     }

//     if (meshRef.current) {
//       const time = animationRef.current.time;
//       const intensity = animationRef.current.intensity;

//       if (intensity > 0.1) {
//         meshRef.current.rotation.y = Math.sin(time * 2) * 0.08 * intensity;
//         meshRef.current.rotation.x = Math.sin(time * 1.7) * 0.03 * intensity;
//         meshRef.current.rotation.z = Math.sin(time * 1.3) * 0.02 * intensity;
//         meshRef.current.position.y = -2 + Math.sin(time * 3) * 0.02 * intensity;
//       } else {
//         meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.02;
//         meshRef.current.rotation.x = Math.sin(time * 0.7) * 0.01;
//         meshRef.current.rotation.z = 0;
//         meshRef.current.position.y = -2;
//       }
//     }
//   });

//   return (
//     <group ref={meshRef}>
//       <primitive object={scene} scale={2} position={[0, -2, 0]} />
//       {debugInfo && (
//         <Html position={[0, 3, 0]}>
//           <div className="text-xs text-white bg-black/50 p-2 rounded max-w-md">
//             <div>{debugInfo}</div>
//             <div className="mt-1 text-green-400">
//               isTalking: {isTalking.toString()}
//             </div>
//             <div className="text-yellow-400">
//               Intensity: {animationRef.current?.intensity?.toFixed(2) || 0}
//             </div>
//           </div>
//         </Html>
//       )}
//     </group>
//   );
// }

// // Enhanced Talking Avatar Component with Better Speech Detection
// function TalkingAvatar({ text, isEnabled, onSpeechEnd }) {
//   const [isTalking, setIsTalking] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [debugMode] = useState(import.meta.env.DEV); // Use environment variable for debug mode
//   const [speechProgress, setSpeechProgress] = useState(0);
//   const utteranceRef = useRef(null);
//   const speechTimeoutRef = useRef(null);
//   const voicesLoadedRef = useRef(false);

//   useEffect(() => {
//     // Ensure voices are loaded
//     const loadVoices = () => {
//       const voices = window.speechSynthesis.getVoices();
//       if (voices.length > 0) {
//         voicesLoadedRef.current = true;
//       }
//     };
//     loadVoices();
//     window.speechSynthesis.onvoiceschanged = loadVoices;

//     if (!text || !isEnabled) {
//       setIsTalking(false);
//       return;
//     }

//     console.log("Starting speech synthesis for:", text.substring(0, 50) + "...");
//     setIsLoading(true);

//     window.speechSynthesis.cancel();
//     const utterance = new SpeechSynthesisUtterance(text);
//     utteranceRef.current = utterance;

//     utterance.lang = "en-US";
//     utterance.rate = 0.85;
//     utterance.pitch = 1.0;
//     utterance.volume = 0.8;

//     if (voicesLoadedRef.current) {
//       const voices = window.speechSynthesis.getVoices();
//       const preferredVoice = voices.find(voice =>
//         voice.lang.startsWith('en') &&
//         (voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.name.includes('Natural'))
//       );
//       if (preferredVoice) {
//         utterance.voice = preferredVoice;
//       }
//     }

//     utterance.onstart = () => {
//       console.log("✓ Speech started - setting isTalking to true");
//       setIsTalking(true);
//       setIsLoading(false);
//       setSpeechProgress(0);
//     };

//     utterance.onboundary = (event) => {
//       if (text) {
//         const progress = event.charIndex / text.length;
//         setSpeechProgress(progress);
//         console.log(`Speech progress: ${(progress * 100).toFixed(1)}%`);
//       }
//     };

//     utterance.onend = () => {
//       console.log("✓ Speech ended - setting isTalking to false");
//       setIsTalking(false);
//       setSpeechProgress(0);
//       onSpeechEnd?.();
//     };

//     utterance.onerror = (error) => {
//       console.error("Speech error:", error);
//       setIsTalking(false);
//       setIsLoading(false);
//       setSpeechProgress(0);
//     };

//     if (speechTimeoutRef.current) {
//       clearTimeout(speechTimeoutRef.current);
//     }

//     speechTimeoutRef.current = setTimeout(() => {
//       console.log("Initiating speech synthesis...");
//       try {
//         window.speechSynthesis.speak(utterance);
//       } catch (error) {
//         console.error("Speech synthesis error:", error);
//         setIsTalking(false);
//         setIsLoading(false);
//       }
//     }, 300);

//     return () => {
//       if (speechTimeoutRef.current) {
//         clearTimeout(speechTimeoutRef.current);
//       }
//       window.speechSynthesis.cancel();
//       setIsTalking(false);
//     };
//   }, [text, isEnabled, onSpeechEnd]);

//   const stopSpeaking = () => {
//     window.speechSynthesis.cancel();
//     setIsTalking(false);
//     setIsLoading(false);
//     setSpeechProgress(0);
//     if (speechTimeoutRef.current) {
//       clearTimeout(speechTimeoutRef.current);
//     }
//   };

//   return (
//     <div className="relative w-full h-80 bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg overflow-hidden mb-6 border border-slate-700/50">
//       <Canvas camera={{ position: [0, 1.6, 2.5], fov: 25 }} frameloop="demand">
//         <ambientLight intensity={0.8} />
//         <directionalLight position={[5, 5, 5]} intensity={1} />
//         <directionalLight position={[-5, 5, 5]} intensity={0.5} />
//         <pointLight position={[0, 2, 2]} intensity={0.5} />
//         <AvatarModel isTalking={isTalking} speechProgress={speechProgress} />
//         <FaceCamera />
//       </Canvas>

//       {debugMode && (
//         <div className="absolute top-4 left-4 space-y-2">
//           <div className="text-xs text-white bg-black/80 p-3 rounded max-w-xs">
//             <div className="space-y-1">
//               <div className={`font-bold ${isTalking ? 'text-green-400' : 'text-red-400'}`}>
//                 🎤 isTalking: {isTalking.toString()}
//               </div>
//               <div className={`${isLoading ? 'text-yellow-400' : 'text-slate-400'}`}>
//                 ⏳ isLoading: {isLoading.toString()}
//               </div>
//               <div className="text-purple-400">
//                 📊 Progress: {(speechProgress * 100).toFixed(0)}%
//               </div>
//               <div className={`text-xs ${window.speechSynthesis.speaking ? 'text-green-300' : 'text-gray-400'}`}>
//                 🔊 Browser Speaking: {window.speechSynthesis.speaking.toString()}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {isLoading && (
//         <div className="absolute top-4 right-4 flex items-center gap-2 bg-slate-800/90 px-3 py-2 rounded-full border border-yellow-500/30">
//           <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />
//           <span className="text-sm text-yellow-300">Preparing speech...</span>
//         </div>
//       )}

//       {isTalking && !isLoading && (
//         <div className="absolute top-4 right-4 flex items-center gap-2">
//           <button
//             onClick={stopSpeaking}
//             className="flex items-center gap-2 bg-red-600/90 hover:bg-red-700/90 px-3 py-2 rounded-full transition-all duration-200 border border-red-500/30"
//             title="Stop Speaking"
//           >
//             <VolumeX className="w-4 h-4 text-white" />
//             <span className="text-sm text-white">Stop</span>
//           </button>
//         </div>
//       )}

//       {isTalking && (
//         <div className="absolute bottom-4 left-4 flex items-center gap-3 bg-green-600/20 border border-green-500/40 px-4 py-3 rounded-full backdrop-blur-sm">
//           <div className="relative">
//             <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
//             <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-30"></div>
//           </div>
//           <div className="flex flex-col">
//             <span className="text-sm font-medium text-green-200">
//               🗣️ AI Speaking
//             </span>
//             {speechProgress > 0 && (
//               <div className="w-24 h-1 bg-green-900/50 rounded-full mt-1">
//                 <div
//                   className="h-full bg-green-400 rounded-full transition-all duration-200"
//                   style={{ width: `${speechProgress * 100}%` }}
//                 ></div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // InterviewSession remains unchanged (omitted for brevity)
// const InterviewSession = () => {
//   const { interviewId } = useParams();
//   const navigate = useNavigate();
//   const token = getAuthToken();

//   const [loading, setLoading] = useState(true);
//   const [sessionId, setSessionId] = useState(null);
//   const [currentQuestion, setCurrentQuestion] = useState(null);
//   const [answer, setAnswer] = useState("");
//   const [chatHistory, setChatHistory] = useState([]);
//   const [completed, setCompleted] = useState(false);
//   const [error, setError] = useState(null);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [endTime, setEndTime] = useState(null);
//   const [interviewActive, setInterviewActive] = useState(false);
//   const [speechEnabled, setSpeechEnabled] = useState(true);
//   const [questionSpoken, setQuestionSpoken] = useState(false);
//   const hasInitialized = useRef(false);
//   const chatEndRef = useRef(null);
//   const [questionLoading, setQuestionLoading] = useState(false);
//   const API_URL = import.meta.env.VITE_API_URL;
  
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chatHistory]);
  
//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//     if (hasInitialized.current) return;
//     hasInitialized.current = true;

//     const initSession = async () => {
//       try {
//         const API_URL = import.meta.env.VITE_API_URL;
//         const interviewData = await fetchWithToken(
//           `${API_URL}/interview/get-all-interviews/`,
//           token
//         );
//         const currentInterview = interviewData.find(
//           (item) => item.id === parseInt(interviewId)
//         );

//         if (!currentInterview) {
//           setError("Interview not found.");
//           setLoading(false);
//           return;
//         }
//         const now = new Date();
//         const start = new Date(currentInterview.startTime);
//         const end = new Date(currentInterview.endTime);
//         setEndTime(end);
//         if (now < start) {
//           setError("Interview has not started yet.");
//           setLoading(false);
//           return;
//         }
//         if (now > end) {
//           setError("Interview time has ended.");
//           setLoading(false);
//           return;
//         }
//         setInterviewActive(true);
//         const data = await fetchWithToken(
//           `${API_URL}/interview/interview-session-initializer/${interviewId}/`,
//           token,
//           null,
//           "POST"
//         );
//         if (!data || !data.session_id) {
//           setError(data?.error || "Failed to start interview.");
//         } else {
//           setSessionId(data.session_id);
//           setCurrentQuestion(data.question);
//         }
//       } catch (err) {
//         setError("Error initializing session.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     initSession();
//   }, [interviewId, token, navigate]);
  
//   useEffect(() => {
//     if (!endTime) return;
//     const timer = setInterval(() => {
//       if (new Date() >= endTime) {
//         setCompleted(true);
//         setCurrentQuestion(null);
//         clearInterval(timer);
//       }
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [endTime]);
  
//   useEffect(() => {
//     if (completed && sessionId) {
//       navigate(`/dsa-interview-platform/${sessionId}`);
//     }
//   }, [completed, sessionId, navigate]);
  
//   useEffect(() => {
//     if (currentQuestion && !questionLoading) {
//       setQuestionSpoken(false);
//     }
//   }, [currentQuestion, questionLoading]);
  
//   const handleNext = async () => {
//     if (!answer.trim()) return;

//     setChatHistory((prev) => [...prev, { question: currentQuestion, answer }]);
//     setAnswer("");
//     setQuestionLoading(true);

//     try {
//       const data = await fetchWithToken(
//         `${API_URL}/interview/interview-session/${sessionId}/?answer=${encodeURIComponent(answer)}`,
//         token,
//         null,
//         "POST"
//       );

//       if (!data) {
//         setError("Error submitting answer.");
//         return;
//       }

//       if (data.completed) {
//         setCompleted(true);
//       } else {
//         setCurrentQuestion(data.current_question);
//       }
//     } catch (err) {
//       setError("Error submitting answer.");
//     } finally {
//       setQuestionLoading(false);
//     }
//   };

//   const handleStartInterview = () => setShowWelcome(false);

//   const handleSpeechEnd = () => {
//     console.log("✓ Speech ended, marking question as spoken");
//     setQuestionSpoken(true);
//   };

//   const toggleSpeech = () => {
//     if (speechEnabled) {
//       window.speechSynthesis.cancel();
//     }
//     setSpeechEnabled(!speechEnabled);
//     console.log("🔊 Speech toggled:", !speechEnabled);
//   };
  
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
//         <Loader2 className="animate-spin w-10 h-10 text-purple-400" />
//       </div>
//     );
//   }
  
//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen text-white bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//         <p className="text-xl text-red-400">{error}</p>
//         <button
//           onClick={() => navigate(-1)}
//           className="mt-4 bg-purple-600 px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }
  
//   if (showWelcome) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
//         <div className="bg-slate-800/60 p-12 rounded-2xl border border-slate-700/50 shadow-2xl max-w-md w-full mx-4 text-center">
//           <div className="bg-purple-600/20 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
//             <MessageCircle size={48} className="text-purple-400" />
//           </div>
//           <h1 className="text-4xl font-bold text-purple-300 mb-4">
//             Welcome to the AI Interview
//           </h1>
//           <p className="text-slate-300 mb-8 text-lg leading-relaxed">
//             You're about to begin your interactive interview session with an AI interviewer. 
//             Take your time with each question and answer thoughtfully.
//           </p>
//           <button
//             onClick={handleStartInterview}
//             className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
//           >
//             Start Interview
//           </button>
//         </div>
//       </div>
//     );
//   }
  
//   if (completed) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
//         <div className="bg-green-700/30 border border-green-500/30 p-12 rounded-2xl shadow-2xl max-w-md w-full mx-4 text-center">
//           <div className="bg-green-600/20 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
//             <MessageCircle size={48} className="text-green-400" />
//           </div>
//           <h1 className="text-4xl font-bold text-green-300 mb-4">
//             Thank you for attending the interview!
//           </h1>
//           <p className="text-green-200 text-lg">
//             Redirecting to dashboard in a moment...
//           </p>
//           <div className="mt-6">
//             <Loader2 className="animate-spin w-6 h-6 text-green-400 mx-auto" />
//           </div>
//         </div>
//       </div>
//     );
//   }
  
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
//       <div className="sticky top-0 z-10 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-all duration-200"
//             >
//               <ArrowLeft size={20} />
//             </button>
//             <h1 className="text-xl font-bold text-purple-300">AI Interview Session</h1>
//           </div>
//           <div className="flex items-center gap-4">
//             <button
//               onClick={toggleSpeech}
//               className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
//                 speechEnabled
//                   ? "bg-green-600/20 border border-green-500/30 text-green-300"
//                   : "bg-red-600/20 border border-red-500/30 text-red-300"
//               }`}
//             >
//               {speechEnabled ? (
//                 <>
//                   <Volume2 size={16} />
//                   <span className="text-sm">Speech On</span>
//                 </>
//               ) : (
//                 <>
//                   <VolumeX size={16} />
//                   <span className="text-sm">Speech Off</span>
//                 </>
//               )}
//             </button>
//             <div className="text-sm text-slate-400">
//               Question {chatHistory.length + 1}
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <div className="flex h-[calc(100vh-80px)]">
//         <div className="w-1/3 bg-slate-800/40 border-r border-slate-700/50 flex flex-col">
//           <div className="p-4 border-b border-slate-700/50">
//             <h2 className="text-xl font-semibold text-purple-300 flex items-center gap-2">
//               <MessageCircle size={20} /> Interview History
//             </h2>
//           </div>
//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             {chatHistory.length === 0 ? (
//               <div className="text-center text-slate-400 mt-8">
//                 <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
//                 <p>No conversation yet</p>
//                 <p className="text-sm mt-2">Your interview will appear here</p>
//               </div>
//             ) : (
//               chatHistory.map((item, index) => (
//                 <div key={index} className="space-y-3">
//                   <div className="flex gap-3">
//                     <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
//                       <MessageCircle size={16} className="text-white" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="bg-slate-700/50 p-3 rounded-lg">
//                         <p className="text-purple-300 font-medium text-sm">
//                           Question {index + 1}
//                         </p>
//                         <p className="text-slate-200 mt-1">{item.question}</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex gap-3">
//                     <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
//                       <User size={16} className="text-white" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="bg-slate-600/50 p-3 rounded-lg">
//                         <p className="text-blue-300 font-medium text-sm">
//                           Your Answer
//                         </p>
//                         <p className="text-slate-200 mt-1">{item.answer}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//             <div ref={chatEndRef} />
//           </div>
//         </div>
        
//         <div className="flex-1 flex flex-col">
//           <div className="flex-1 p-6 flex flex-col">
//             {questionLoading ? (
//               <div className="flex-1 flex justify-center items-center">
//                 <div className="text-center">
//                   <Loader2 className="w-10 h-10 text-purple-400 animate-spin mx-auto mb-4" />
//                   <p className="text-slate-300 text-lg">Evaluating your response...</p>
//                   <p className="text-slate-400 text-sm mt-2">Preparing next question</p>
//                 </div>
//               </div>
//             ) : currentQuestion ? (
//               <>
//                 <TalkingAvatar
//                   text={speechEnabled && !questionSpoken ? currentQuestion : ""}
//                   isEnabled={speechEnabled && !questionSpoken}
//                   onSpeechEnd={handleSpeechEnd}
//                 />
//                 <div className="flex-1 flex items-center justify-center">
//                   <div className="max-w-3xl w-full">
//                     <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700/50 shadow-2xl">
//                       <div className="flex items-center gap-3 mb-6">
//                         <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
//                           <MessageCircle size={20} className="text-white" />
//                         </div>
//                         <h3 className="text-xl font-bold text-purple-300">
//                           Question {chatHistory.length + 1}
//                         </h3>
//                         {speechEnabled && !questionSpoken && (
//                           <div className="ml-auto flex items-center gap-2 text-green-400 text-sm">
//                             <Volume2 size={16} />
//                             <span>AI is speaking...</span>
//                           </div>
//                         )}
//                       </div>
//                       <p className="text-xl text-slate-200 mb-8 leading-relaxed">
//                         {currentQuestion}
//                       </p>                 
//                       <div className="space-y-4">
//                         <textarea
//                           value={answer}
//                           onChange={(e) => setAnswer(e.target.value)}
//                           className="w-full bg-slate-900 text-white p-4 rounded-lg border border-slate-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 resize-none"
//                           rows="6"
//                           placeholder="Type your answer here..."
//                         />
//                         <div className="flex justify-between items-center">
//                           <div className="text-sm text-slate-400">
//                             {answer.length} characters
//                           </div>
//                           <button
//                             onClick={handleNext}
//                             disabled={!answer.trim()}
//                             className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed px-8 py-3 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
//                           >
//                             <Send size={18} /> Submit Answer
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             ) : null}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InterviewSession;




// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Canvas, useFrame, useThree } from "@react-three/fiber"; // Added useThree here
// import { OrbitControls, useGLTF, Html } from "@react-three/drei";
// import { getAuthToken, fetchWithToken } from "../utils/handleToken";
// import { Loader2, ArrowLeft, Send, MessageCircle, User, Volume2, VolumeX, Mic, MicOff } from "lucide-react";

// // Avatar Component with Lip Sync and Face-Focused Camera
// // function AvatarModel({ isTalking }) {
// //   const { scene } = useGLTF("/person.glb");
// //   const meshRef = useRef();
// //   const [debugInfo, setDebugInfo] = useState("");
  
// //   useEffect(() => {
// //     if (scene) {
// //       scene.traverse((child) => {
// //         if (child.isMesh && child.morphTargetDictionary) {
// //           console.log("Found mesh with morph targets:", Object.keys(child.morphTargetDictionary));
// //           setDebugInfo(`Morph targets: ${Object.keys(child.morphTargetDictionary).join(", ")}`);
// //         }
// //       });
// //     }
// //   }, [scene]);
  
// //   useFrame(() => {
// //     if (!scene) return;
    
// //     scene.traverse((child) => {
// //       if (child.isMesh && child.morphTargetDictionary && child.morphTargetInfluences) {
// //         const morphDict = child.morphTargetDictionary;
        
// //         const possibleMouthNames = [
// //           'MouthOpen', 'mouthOpen', 'mouth_open', 'Mouth_Open',
// //           'jawOpen', 'jaw_open', 'Jaw_Open', 'JawOpen',
// //           'viseme_aa', 'viseme_A', 'A', 'aa', 'mouth',
// //           'Mouth', 'jaw', 'Jaw'
// //         ];
        
// //         let mouthIndex = -1;
// //         let foundKey = '';
        
// //         for (const key of possibleMouthNames) {
// //           if (morphDict[key] !== undefined) {
// //             mouthIndex = morphDict[key];
// //             foundKey = key;
// //             break;
// //           }
// //         }
        
// //         if (mouthIndex === -1 && Object.keys(morphDict).length > 0) {
// //           const firstKey = Object.keys(morphDict)[0];
// //           mouthIndex = morphDict[firstKey];
// //           foundKey = firstKey;
// //         }
        
// //         if (mouthIndex !== -1 && child.morphTargetInfluences[mouthIndex] !== undefined) {
// //           const time = Date.now() * 0.01;
// //           const baseMovement = Math.abs(Math.sin(time)) * 0.6;
// //           const variation = Math.abs(Math.sin(time * 2.3)) * 0.3;
// //           const movement = isTalking ? (baseMovement + variation) : 0;
          
// //           child.morphTargetInfluences[mouthIndex] = movement;
// //         }
// //       }
// //     });
    
// //     if (meshRef.current) {
// //       const time = Date.now() * 0.002;
// //       if (isTalking) {
// //         meshRef.current.rotation.y = Math.sin(time) * 0.05;
// //         meshRef.current.rotation.x = Math.sin(time * 1.3) * 0.02;
// //       } else {
// //         meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.02;
// //         meshRef.current.rotation.x = Math.sin(time * 0.7) * 0.01;
// //       }
// //     }
// //   });
  
// //   return (
// //     <group ref={meshRef}>
// //       <primitive object={scene} scale={2} position={[0, -2, 0]} />
// //       {debugInfo && (
// //         <Html position={[0, 3, 0]}>
// //           <div className="text-xs text-white bg-black/50 p-2 rounded">
// //             {debugInfo}
// //           </div>
// //         </Html>
// //       )}
// //     </group>
// //   );
// // }
// function AvatarModel({ isTalking }) {
//   const { scene } = useGLTF("/person.glb");
//   const meshRef = useRef();
//   const [debugInfo, setDebugInfo] = useState("");
//   const [foundMouthTarget, setFoundMouthTarget] = useState(null);
  
//   useEffect(() => {
//     if (scene) {
//       scene.traverse((child) => {
//         if (child.isMesh && child.morphTargetDictionary) {
//           console.log("Found mesh with morph targets:", Object.keys(child.morphTargetDictionary));
//           setDebugInfo(`Morph targets: ${Object.keys(child.morphTargetDictionary).join(", ")}`);
          
//           // Find and store the mouth target for better performance
//           const possibleMouthNames = [
//             'MouthOpen', 'mouthOpen', 'mouth_open', 'Mouth_Open',
//             'jawOpen', 'jaw_open', 'Jaw_Open', 'JawOpen',
//             'viseme_aa', 'viseme_A', 'A', 'aa', 'mouth',
//             'Mouth', 'jaw', 'Jaw'
//           ];
          
//           for (const key of possibleMouthNames) {
//             if (child.morphTargetDictionary[key] !== undefined) {
//               setFoundMouthTarget({
//                 index: child.morphTargetDictionary[key],
//                 name: key,
//                 mesh: child
//               });
//               console.log(`Found mouth target: ${key} at index ${child.morphTargetDictionary[key]}`);
//               break;
//             }
//           }
//         }
//       });
//     }
//   }, [scene]);
  
//   useFrame(() => {
//     if (!scene) return;
    
//     // More efficient approach - use the found mouth target
//     if (foundMouthTarget && foundMouthTarget.mesh.morphTargetInfluences) {
//       const time = Date.now() * 0.01;
      
//       if (isTalking) {
//         // More realistic lip movement patterns
//         const baseMovement = Math.abs(Math.sin(time * 3)) * 0.4;
//         const variation = Math.abs(Math.sin(time * 5.7)) * 0.3;
//         const microVariation = Math.abs(Math.sin(time * 11.3)) * 0.1;
//         const movement = Math.min(baseMovement + variation + microVariation, 0.8);
        
//         foundMouthTarget.mesh.morphTargetInfluences[foundMouthTarget.index] = movement;
//       } else {
//         // Gradual close
//         const current = foundMouthTarget.mesh.morphTargetInfluences[foundMouthTarget.index];
//         foundMouthTarget.mesh.morphTargetInfluences[foundMouthTarget.index] = Math.max(0, current * 0.95);
//       }
//     } else {
//       // Fallback to original method if specific target not found
//       scene.traverse((child) => {
//         if (child.isMesh && child.morphTargetDictionary && child.morphTargetInfluences) {
//           const morphDict = child.morphTargetDictionary;
//           const keys = Object.keys(morphDict);
          
//           if (keys.length > 0) {
//             const firstIndex = morphDict[keys[0]];
//             const time = Date.now() * 0.01;
            
//             if (isTalking) {
//               const baseMovement = Math.abs(Math.sin(time * 3)) * 0.5;
//               const variation = Math.abs(Math.sin(time * 5.7)) * 0.2;
//               child.morphTargetInfluences[firstIndex] = baseMovement + variation;
//             } else {
//               child.morphTargetInfluences[firstIndex] = 0;
//             }
//           }
//         }
//       });
//     }
    
//     // Enhanced head movements
//     if (meshRef.current) {
//       const time = Date.now() * 0.001;
//       if (isTalking) {
//         // More dynamic head movement while talking
//         meshRef.current.rotation.y = Math.sin(time * 2) * 0.08;
//         meshRef.current.rotation.x = Math.sin(time * 1.7) * 0.04;
//         meshRef.current.rotation.z = Math.sin(time * 0.8) * 0.02;
//       } else {
//         // Subtle idle movement
//         meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.03;
//         meshRef.current.rotation.x = Math.sin(time * 0.7) * 0.015;
//         meshRef.current.rotation.z = Math.sin(time * 0.3) * 0.01;
//       }
//     }
//   });
  
//   return (
//     <group ref={meshRef}>
//       <primitive object={scene} scale={2.2} position={[0, -2.2, 0]} />
//       {debugInfo && (
//         <Html position={[0, 3, 0]}>
//           <div className="text-xs text-white bg-black/70 p-2 rounded max-w-xs">
//             <div>{debugInfo}</div>
//             {foundMouthTarget && (
//               <div className="text-green-300 mt-1">
//                 Active: {foundMouthTarget.name} (#{foundMouthTarget.index})
//               </div>
//             )}
//           </div>
//         </Html>
//       )}
//     </group>
//   );
// }

// // Camera Control Component to Focus on Face
// // function FaceCamera() {
// //   const orbitControlsRef = useRef();
// //   const { camera } = useThree();

// //   useEffect(() => {
// //     // Position camera at eye-level but not too close
// //     camera.position.set(0, 1.6, 3); // back up a bit on Z for torso + face
// //     camera.lookAt(0, 1.2, 0); // 👈 Look slightly below the face (chest/stomach area)
// //     camera.updateProjectionMatrix();
// //   }, [camera]);

// //   useFrame(() => {
// //     if (orbitControlsRef.current) {
// //       orbitControlsRef.current.target.set(0, 1.2, 0); // 👈 keep orbit target at stomach/chest height
// //       orbitControlsRef.current.update();
// //     }
// //   });

// //   return (
// //     <OrbitControls
// //       ref={orbitControlsRef}
// //       enableZoom={false}
// //       enablePan={false}
// //       maxPolarAngle={Math.PI / 2}
// //     />
// //   );
// // }

// function FaceCamera() {
//   const orbitControlsRef = useRef();
//   const { camera } = useThree();

//   useEffect(() => {
//     // Position camera to focus on face area where morph targets work
//     camera.position.set(0, 1.8, 3.5); // Adjusted for face focus
//     camera.lookAt(0, 1.8, 0); // Look directly at face level
//     camera.updateProjectionMatrix();
//   }, [camera]);

//   useFrame(() => {
//     if (orbitControlsRef.current) {
//       orbitControlsRef.current.target.set(0, 1.8, 0); // Face-level target
//       orbitControlsRef.current.update();
//     }
//   });

//   return (
//     <OrbitControls
//       ref={orbitControlsRef}
//       enableZoom={false}
//       enablePan={false}
//       maxPolarAngle={Math.PI / 2}
//       minPolarAngle={0}
//     />
//   );
// }

// // Talking Avatar Component
// // function TalkingAvatar({ text, isEnabled, onSpeechEnd }) {
// //   const [isTalking, setIsTalking] = useState(false);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [debugMode, setDebugMode] = useState(true);
// //   const utteranceRef = useRef(null);
// //   const [forceAnimation, setForceAnimation] = useState(false);

// //   useEffect(() => {
// //     if (!text || !isEnabled) return;

// //     setIsLoading(true);
    
// //     const utterance = new SpeechSynthesisUtterance(text);
// //     utteranceRef.current = utterance;
    
// //     utterance.lang = "en-US";
// //     utterance.rate = 0.9;
// //     utterance.pitch = 1.1;
    
// //     utterance.onstart = () => {
// //       setIsTalking(true);
// //       setIsLoading(false);
// //       console.log("Speech started - isTalking should be true");
// //     };
    
// //     utterance.onend = () => {
// //       setIsTalking(false);
// //       console.log("Speech ended - isTalking should be false");
// //       onSpeechEnd?.();
// //     };
    
// //     utterance.onerror = (error) => {
// //       console.error("Speech error:", error);
// //       setIsTalking(false);
// //       setIsLoading(false);
// //     };

// //     setTimeout(() => {
// //       console.log("Starting speech synthesis...");
// //       window.speechSynthesis.speak(utterance);
// //     }, 500);

// //     return () => {
// //       if (utteranceRef.current) {
// //         window.speechSynthesis.cancel();
// //       }
// //     };
// //   }, [text, isEnabled, onSpeechEnd]);

// //   const stopSpeaking = () => {
// //     window.speechSynthesis.cancel();
// //     setIsTalking(false);
// //     setIsLoading(false);
// //   };

// //   const toggleForceAnimation = () => {
// //     setForceAnimation(!forceAnimation);
// //     console.log("Force animation:", !forceAnimation);
// //   };

// //   return (
// //     <div className="relative w-full h-80 bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg overflow-hidden mb-6 border border-slate-700/50">
// //     <Canvas camera={{ position: [0, 1.6, 2.5], fov: 25 }}>
// //   <ambientLight intensity={0.8} />
// //   <directionalLight position={[5, 5, 5]} intensity={1} />
// //   <directionalLight position={[-5, 5, 5]} intensity={0.5} />
// //   <pointLight position={[0, 2, 2]} intensity={0.5} />

// //   <AvatarModel isTalking={isTalking || forceAnimation} />
// //   <FaceCamera />
// // </Canvas>

      
// //       {debugMode && (
// //         <div className="absolute top-4 left-4 space-y-2">
// //           <button
// //             onClick={toggleForceAnimation}
// //             className={`px-3 py-1 rounded text-xs ${
// //               forceAnimation ? 'bg-green-600 text-white' : 'bg-slate-600 text-slate-300'
// //             }`}
// //           >
// //             {forceAnimation ? 'Stop Test Animation' : 'Test Animation'}
// //           </button>
// //           <div className="text-xs text-white bg-black/70 p-2 rounded">
// //             <div>isTalking: {isTalking.toString()}</div>
// //             <div>isLoading: {isLoading.toString()}</div>
// //             <div>forceAnimation: {forceAnimation.toString()}</div>
// //           </div>
// //         </div>
// //       )}
      
// //       <div className="absolute top-4 right-4 flex items-center gap-2">
// //         {isLoading && (
// //           <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-full">
// //             <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
// //             <span className="text-sm text-slate-300">Preparing...</span>
// //           </div>
// //         )}
        
// //         {isTalking && (
// //           <button
// //             onClick={stopSpeaking}
// //             className="flex items-center gap-2 bg-red-600/80 hover:bg-red-700/80 px-3 py-1 rounded-full transition-all duration-200"
// //             title="Stop Speaking"
// //           >
// //             <VolumeX className="w-4 h-4 text-white" />
// //             <span className="text-sm text-white">Stop</span>
// //           </button>
// //         )}
// //       </div>
      
// //       {(isTalking || forceAnimation) && (
// //         <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-green-600/20 border border-green-500/30 px-3 py-2 rounded-full">
// //           <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
// //           <span className="text-sm text-green-300">
// //             {forceAnimation ? 'Testing Animation' : 'Speaking...'}
// //           </span>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
// function TalkingAvatar({ text, isEnabled, onSpeechEnd }) {
//   const [isTalking, setIsTalking] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [debugMode, setDebugMode] = useState(true);
//   const utteranceRef = useRef(null);
//   const [forceAnimation, setForceAnimation] = useState(false);

//   useEffect(() => {
//     if (!text || !isEnabled) return;

//     setIsLoading(true);
    
//     const utterance = new SpeechSynthesisUtterance(text);
//     utteranceRef.current = utterance;
    
//     utterance.lang = "en-US";
//     utterance.rate = 0.9;
//     utterance.pitch = 1.1;
    
//     utterance.onstart = () => {
//       setIsTalking(true);
//       setIsLoading(false);
//       console.log("Speech started - isTalking should be true");
//     };
    
//     utterance.onend = () => {
//       setIsTalking(false);
//       console.log("Speech ended - isTalking should be false");
//       onSpeechEnd?.();
//     };
    
//     utterance.onerror = (error) => {
//       console.error("Speech error:", error);
//       setIsTalking(false);
//       setIsLoading(false);
//     };

//     setTimeout(() => {
//       console.log("Starting speech synthesis...");
//       window.speechSynthesis.speak(utterance);
//     }, 500);

//     return () => {
//       if (utteranceRef.current) {
//         window.speechSynthesis.cancel();
//       }
//     };
//   }, [text, isEnabled, onSpeechEnd]);

//   const stopSpeaking = () => {
//     window.speechSynthesis.cancel();
//     setIsTalking(false);
//     setIsLoading(false);
//   };

//   const toggleForceAnimation = () => {
//     setForceAnimation(!forceAnimation);
//     console.log("Force animation:", !forceAnimation);
//   };

//   return (
//     <div className="relative w-full h-80 bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg overflow-hidden mb-6 border border-slate-700/50">
//       <Canvas 
//         camera={{ 
//           position: [0, 1.8, 3.5], 
//           fov: 30,
//           near: 0.1,
//           far: 1000 
//         }}
//         gl={{ antialias: true, alpha: true }}
//       >
//         <ambientLight intensity={0.6} />
//         <directionalLight position={[2, 3, 5]} intensity={1.2} castShadow />
//         <directionalLight position={[-2, 2, 3]} intensity={0.8} />
//         <pointLight position={[0, 2.5, 2]} intensity={0.6} />
//         <spotLight 
//           position={[0, 5, 5]} 
//           angle={0.3} 
//           penumbra={0.5} 
//           intensity={0.5}
//           castShadow 
//         />

//         <AvatarModel isTalking={isTalking || forceAnimation} />
//         <FaceCamera />
//       </Canvas>

//       {debugMode && (
//         <div className="absolute top-4 left-4 space-y-2">
//           <button
//             onClick={toggleForceAnimation}
//             className={`px-3 py-1 rounded text-xs ${
//               forceAnimation ? 'bg-green-600 text-white' : 'bg-slate-600 text-slate-300'
//             }`}
//           >
//             {forceAnimation ? 'Stop Test Animation' : 'Test Animation'}
//           </button>
//           <div className="text-xs text-white bg-black/70 p-2 rounded">
//             <div>isTalking: {(isTalking || forceAnimation).toString()}</div>
//             <div>isLoading: {isLoading.toString()}</div>
//             <div>Speech Enabled: {isEnabled.toString()}</div>
//           </div>
//         </div>
//       )}
      
//       <div className="absolute top-4 right-4 flex items-center gap-2">
//         {isLoading && (
//           <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-full">
//             <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
//             <span className="text-sm text-slate-300">Preparing...</span>
//           </div>
//         )}
        
//         {isTalking && (
//           <button
//             onClick={stopSpeaking}
//             className="flex items-center gap-2 bg-red-600/80 hover:bg-red-700/80 px-3 py-1 rounded-full transition-all duration-200"
//             title="Stop Speaking"
//           >
//             <VolumeX className="w-4 h-4 text-white" />
//             <span className="text-sm text-white">Stop</span>
//           </button>
//         )}
//       </div>
      
//       {(isTalking || forceAnimation) && (
//         <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-green-600/20 border border-green-500/30 px-3 py-2 rounded-full">
//           <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//           <span className="text-sm text-green-300">
//             {forceAnimation ? 'Testing Animation' : 'Speaking...'}
//           </span>
//         </div>
//       )}
//     </div>
//   );
// }
// const InterviewSession = () => {
//   const { interviewId } = useParams();
//   const navigate = useNavigate();
//   const token = getAuthToken();

//   const [loading, setLoading] = useState(true);
//   const [sessionId, setSessionId] = useState(null);
//   const [currentQuestion, setCurrentQuestion] = useState(null);
//   const [answer, setAnswer] = useState("");
//   const [chatHistory, setChatHistory] = useState([]);
//   const [completed, setCompleted] = useState(false);
//   const [error, setError] = useState(null);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [endTime, setEndTime] = useState(null);
//   const [interviewActive, setInterviewActive] = useState(false);
//   const [speechEnabled, setSpeechEnabled] = useState(true);
//   const [questionSpoken, setQuestionSpoken] = useState(false);

//   const hasInitialized = useRef(false);
//   const chatEndRef = useRef(null);
//   const [questionLoading, setQuestionLoading] = useState(false);
//   const API_URL = import.meta.env.VITE_API_URL;

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chatHistory]);

//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     if (hasInitialized.current) return;
//     hasInitialized.current = true;

//     const initSession = async () => {
//       try {
//         const interviewData = await fetchWithToken(
//           `${API_URL}/interview/get-all-interviews/`,
//           token
//         );
//         const currentInterview = interviewData.find(
//           (item) => item.id === parseInt(interviewId)
//         );

//         if (!currentInterview) {
//           setError("Interview not found.");
//           setLoading(false);
//           return;
//         }

//         const now = new Date();
//         const start = new Date(currentInterview.startTime);
//         const end = new Date(currentInterview.endTime);
//         setEndTime(end);

//         if (now < start) {
//           setError("Interview has not started yet.");
//           setLoading(false);
//           return;
//         }
//         if (now > end) {
//           setError("Interview time has ended.");
//           setLoading(false);
//           return;
//         }

//         setInterviewActive(true);
        
//         const data = await fetchWithToken(
//           `${API_URL}/interview/interview-session-initializer/${interviewId}/`,
//           token,
//           null,
//           "POST"
//         );

//         if (!data || !data.session_id) {
//           setError(data?.error || "Failed to start interview.");
//         } else {
//           setSessionId(data.session_id);
//           setCurrentQuestion(data.question);
//         }
//       } catch (err) {
//         setError("Error initializing session.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     initSession();
//   }, [interviewId, token, navigate]);

//   useEffect(() => {
//     if (!endTime) return;
//     const timer = setInterval(() => {
//       if (new Date() >= endTime) {
//         setCompleted(true);
//         setCurrentQuestion(null);
//         clearInterval(timer);
//       }
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [endTime]);

//   useEffect(() => {
//     if (completed && sessionId) {
//       navigate(`/dsa-interview-platform/${sessionId}`);
//     }
//   }, [completed, sessionId, navigate]);

//   useEffect(() => {
//     if (currentQuestion && !questionLoading) {
//       setQuestionSpoken(false);
//     }
//   }, [currentQuestion, questionLoading]);

//   const handleNext = async () => {
//     if (!answer.trim()) return;

//     setChatHistory((prev) => [...prev, { question: currentQuestion, answer }]);
//     setAnswer("");
//     setQuestionLoading(true);

//     try {
//       const data = await fetchWithToken(
//         `${API_URL}/interview/interview-session/${sessionId}/?answer=${encodeURIComponent(answer)}`,
//         token,
//         null,
//         "POST"
//       );

//       if (!data) {
//         setError("Error submitting answer.");
//         return;
//       }

//       if (data.completed) {
//         setCompleted(true);
//       } else {
//         setCurrentQuestion(data.current_question);
//       }
//     } catch (err) {
//       setError("Error submitting answer.");
//     } finally {
//       setQuestionLoading(false);
//     }
//   };

//   const handleStartInterview = () => setShowWelcome(false);

//   const handleSpeechEnd = () => {
//     setQuestionSpoken(true);
//   };

//   const toggleSpeech = () => {
//     if (speechEnabled) {
//       window.speechSynthesis.cancel();
//     }
//     setSpeechEnabled(!speechEnabled);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
//         <Loader2 className="animate-spin w-10 h-10 text-purple-400" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen text-white bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//         <p className="text-xl text-red-400">{error}</p>
//         <button
//           onClick={() => navigate(-1)}
//           className="mt-4 bg-purple-600 px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   if (showWelcome) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
//         <div className="bg-slate-800/60 p-12 rounded-2xl border border-slate-700/50 shadow-2xl max-w-md w-full mx-4 text-center">
//           <div className="bg-purple-600/20 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
//             <MessageCircle size={48} className="text-purple-400" />
//           </div>
//           <h1 className="text-4xl font-bold text-purple-300 mb-4">
//             Welcome to the AI Interview
//           </h1>
//           <p className="text-slate-300 mb-8 text-lg leading-relaxed">
//             You're about to begin your interactive interview session with an AI interviewer. 
//             Take your time with each question and answer thoughtfully.
//           </p>
//           <button
//             onClick={handleStartInterview}
//             className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
//           >
//             Start Interview
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (completed) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
//         <div className="bg-green-700/30 border border-green-500/30 p-12 rounded-2xl shadow-2xl max-w-md w-full mx-4 text-center">
//           <div className="bg-green-600/20 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
//             <MessageCircle size={48} className="text-green-400" />
//           </div>
//           <h1 className="text-4xl font-bold text-green-300 mb-4">
//             Thank you for attending the interview!
//           </h1>
//           <p className="text-green-200 text-lg">
//             Redirecting to dashboard in a moment...
//           </p>
//           <div className="mt-6">
//             <Loader2 className="animate-spin w-6 h-6 text-green-400 mx-auto" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
//       <div className="sticky top-0 z-10 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-all duration-200"
//             >
//               <ArrowLeft size={20} />
//             </button>
//             <h1 className="text-xl font-bold text-purple-300">AI Interview Session</h1>
//           </div>
          
//           <div className="flex items-center gap-4">
//             <button
//               onClick={toggleSpeech}
//               className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
//                 speechEnabled
//                   ? "bg-green-600/20 border border-green-500/30 text-green-300"
//                   : "bg-red-600/20 border border-red-500/30 text-red-300"
//               }`}
//             >
//               {speechEnabled ? (
//                 <>
//                   <Volume2 size={16} />
//                   <span className="text-sm">Speech On</span>
//                 </>
//               ) : (
//                 <>
//                   <VolumeX size={16} />
//                   <span className="text-sm">Speech Off</span>
//                 </>
//               )}
//             </button>
            
//             <div className="text-sm text-slate-400">
//               Question {chatHistory.length + 1}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex h-[calc(100vh-80px)]">
//         <div className="w-1/3 bg-slate-800/40 border-r border-slate-700/50 flex flex-col">
//           <div className="p-4 border-b border-slate-700/50">
//             <h2 className="text-xl font-semibold text-purple-300 flex items-center gap-2">
//               <MessageCircle size={20} /> Interview History
//             </h2>
//           </div>
//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             {chatHistory.length === 0 ? (
//               <div className="text-center text-slate-400 mt-8">
//                 <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
//                 <p>No conversation yet</p>
//                 <p className="text-sm mt-2">Your interview will appear here</p>
//               </div>
//             ) : (
//               chatHistory.map((item, index) => (
//                 <div key={index} className="space-y-3">
//                   <div className="flex gap-3">
//                     <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
//                       <MessageCircle size={16} className="text-white" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="bg-slate-700/50 p-3 rounded-lg">
//                         <p className="text-purple-300 font-medium text-sm">
//                           Question {index + 1}
//                         </p>
//                         <p className="text-slate-200 mt-1">{item.question}</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex gap-3">
//                     <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
//                       <User size={16} className="text-white" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="bg-slate-600/50 p-3 rounded-lg">
//                         <p className="text-blue-300 font-medium text-sm">
//                           Your Answer
//                         </p>
//                         <p className="text-slate-200 mt-1">{item.answer}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//             <div ref={chatEndRef} />
//           </div>
//         </div>

//         <div className="flex-1 flex flex-col">
//           <div className="flex-1 p-6 flex flex-col">
//             {questionLoading ? (
//               <div className="flex-1 flex justify-center items-center">
//                 <div className="text-center">
//                   <Loader2 className="w-10 h-10 text-purple-400 animate-spin mx-auto mb-4" />
//                   <p className="text-slate-300 text-lg">Evaluating your response...</p>
//                   <p className="text-slate-400 text-sm mt-2">Preparing next question</p>
//                 </div>
//               </div>
//             ) : currentQuestion ? (
//               <>
//                 <TalkingAvatar
//                   text={speechEnabled && !questionSpoken ? currentQuestion : ""}
//                   isEnabled={speechEnabled && !questionSpoken}
//                   onSpeechEnd={handleSpeechEnd}
//                 />

//                 <div className="flex-1 flex items-center justify-center">
//                   <div className="max-w-3xl w-full">
//                     <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700/50 shadow-2xl">
//                       <div className="flex items-center gap-3 mb-6">
//                         <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
//                           <MessageCircle size={20} className="text-white" />
//                         </div>
//                         <h3 className="text-xl font-bold text-purple-300">
//                           Question {chatHistory.length + 1}
//                         </h3>
//                         {speechEnabled && !questionSpoken && (
//                           <div className="ml-auto flex items-center gap-2 text-green-400 text-sm">
//                             <Volume2 size={16} />
//                             <span>AI is speaking...</span>
//                           </div>
//                         )}
//                       </div>
                      
//                       <p className="text-xl text-slate-200 mb-8 leading-relaxed">
//                         {currentQuestion}
//                       </p>
                      
//                       <div className="space-y-4">
//                         <textarea
//                           value={answer}
//                           onChange={(e) => setAnswer(e.target.value)}
//                           className="w-full bg-slate-900 text-white p-4 rounded-lg border border-slate-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 resize-none"
//                           rows="6"
//                           placeholder="Type your answer here..."
//                         />
//                         <div className="flex justify-between items-center">
//                           <div className="text-sm text-slate-400">
//                             {answer.length} characters
//                           </div>
//                           <button
//                             onClick={handleNext}
//                             disabled={!answer.trim()}
//                             className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed px-8 py-3 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
//                           >
//                             <Send size={18} /> Submit Answer
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             ) : null}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InterviewSession;




// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import { OrbitControls, useGLTF, Html } from "@react-three/drei";
// import { getAuthToken, fetchWithToken } from "../utils/handleToken";
// import { Loader2, ArrowLeft, Send, MessageCircle, User, Volume2, VolumeX, Mic, MicOff } from "lucide-react";

// // Face-focused camera component
// function FaceCamera() {
//   const orbitControlsRef = useRef();
//   const { camera } = useThree();

//   useEffect(() => {
//     camera.position.set(0, 1.8, 3.5); // Focus on face
//     camera.lookAt(0, 1.8, 0); // Target face level
//   }, [camera]);

//   useFrame(() => {
//     if (orbitControlsRef.current) {
//       orbitControlsRef.current.target.set(0, 1.8, 0); // Maintain face-level target
//       orbitControlsRef.current.update();
//     }
//   });

//   return (
//     <OrbitControls
//       ref={orbitControlsRef}
//       enableZoom={false}
//       enablePan={false}
//       maxPolarAngle={Math.PI / 2}
//       minPolarAngle={0}
//     />
//   );
// }

// // Avatar component with lip-sync only
// function AvatarModel({ isTalking }) {
//   const { scene } = useGLTF("/person.glb");
//   const [debugInfo, setDebugInfo] = useState("");
//   const [foundMouthTarget, setFoundMouthTarget] = useState(null);

//   useEffect(() => {
//     if (scene) {
//       scene.traverse((child) => {
//         if (child.isMesh && child.morphTargetDictionary) {
//           console.log("Found mesh with morph targets:", Object.keys(child.morphTargetDictionary));
//           setDebugInfo(`Morph targets: ${Object.keys(child.morphTargetDictionary).join(", ")}`);

//           const possibleMouthNames = [
//             'MouthOpen', 'mouthOpen', 'mouth_open', 'Mouth_Open',
//             'jawOpen', 'jaw_open', 'Jaw_Open', 'JawOpen',
//             'viseme_aa', 'viseme_A', 'A', 'aa', 'mouth',
//             'Mouth', 'jaw', 'Jaw'
//           ];

//           for (const key of possibleMouthNames) {
//             if (child.morphTargetDictionary[key] !== undefined) {
//               setFoundMouthTarget({
//                 index: child.morphTargetDictionary[key],
//                 name: key,
//                 mesh: child
//               });
//               console.log(`Found mouth target: ${key} at index ${child.morphTargetDictionary[key]}`);
//               break;
//             }
//           }
//         }
//       });
//     }
//   }, [scene]);

//   useFrame(() => {
//     if (!scene || !isTalking) return;

//     if (foundMouthTarget && foundMouthTarget.mesh.morphTargetInfluences) {
//       const time = Date.now() * 0.01;
//       const baseMovement = Math.abs(Math.sin(time * 3)) * 0.4;
//       const variation = Math.abs(Math.sin(time * 5.7)) * 0.3;
//       const microVariation = Math.abs(Math.sin(time * 11.3)) * 0.1;
//       const movement = Math.min(baseMovement + variation + microVariation, 0.8);

//       foundMouthTarget.mesh.morphTargetInfluences[foundMouthTarget.index] = movement;
//     } else {
//       scene.traverse((child) => {
//         if (child.isMesh && child.morphTargetDictionary && child.morphTargetInfluences) {
//           const morphDict = child.morphTargetDictionary;
//           const keys = Object.keys(morphDict);

//           if (keys.length > 0) {
//             const firstIndex = morphDict[keys[0]];
//             const time = Date.now() * 0.01;
//             const baseMovement = Math.abs(Math.sin(time * 3)) * 0.5;
//             const variation = Math.abs(Math.sin(time * 5.7)) * 0.2;
//             child.morphTargetInfluences[firstIndex] = baseMovement + variation;
//           }
//         }
//       });
//     }
//   });

//   return (
//     <group>
//       <primitive object={scene} scale={2.2} position={[0, -2.2, 0]} />
//       {debugInfo && import.meta.env.DEV && (
//         <Html position={[0, 3, 0]}>
//           <div className="text-xs text-white bg-black/70 p-2 rounded max-w-xs">
//             <div>{debugInfo}</div>
//             {foundMouthTarget && (
//               <div className="text-green-300 mt-1">
//                 Active: {foundMouthTarget.name} (#{foundMouthTarget.index})
//               </div>
//             )}
//           </div>
//         </Html>
//       )}
//     </group>
//   );
// }

// // Talking Avatar Component with Text-to-Speech
// function TalkingAvatar({ text, isEnabled, onSpeechEnd }) {
//   const [isTalking, setIsTalking] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const utteranceRef = useRef(null);
//   const voicesLoadedRef = useRef(false);

//   useEffect(() => {
//     // Ensure voices are loaded
//     const loadVoices = () => {
//       const voices = window.speechSynthesis.getVoices();
//       if (voices.length > 0) {
//         voicesLoadedRef.current = true;
//       }
//     };
//     loadVoices();
//     window.speechSynthesis.onvoiceschanged = loadVoices;

//     if (!text || !isEnabled) {
//       setIsTalking(false);
//       return;
//     }

//     setIsLoading(true);
//     window.speechSynthesis.cancel();
//     const utterance = new SpeechSynthesisUtterance(text);
//     utteranceRef.current = utterance;

//     utterance.lang = "en-US";
//     utterance.rate = 0.9;
//     utterance.pitch = 1.1;
//     utterance.volume = 0.8;

//     if (voicesLoadedRef.current) {
//       const voices = window.speechSynthesis.getVoices();
//       const preferredVoice = voices.find(voice =>
//         voice.lang.startsWith('en') &&
//         (voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.name.includes('Natural'))
//       );
//       if (preferredVoice) {
//         utterance.voice = preferredVoice;
//       }
//     }

//     utterance.onstart = () => {
//       setIsTalking(true);
//       setIsLoading(false);
//       console.log("Speech started - isTalking should be true");
//     };

//     utterance.onend = () => {
//       setIsTalking(false);
//       console.log("Speech ended - isTalking should be false");
//       onSpeechEnd?.();
//     };

//     utterance.onerror = (error) => {
//       console.error("Speech error:", error);
//       setIsTalking(false);
//       setIsLoading(false);
//     };

//     setTimeout(() => {
//       try {
//         window.speechSynthesis.speak(utterance);
//       } catch (error) {
//         console.error("Speech synthesis error:", error);
//         setIsTalking(false);
//         setIsLoading(false);
//       }
//     }, 500);

//     return () => {
//       window.speechSynthesis.cancel();
//     };
//   }, [text, isEnabled, onSpeechEnd]);

//   const stopSpeaking = () => {
//     window.speechSynthesis.cancel();
//     setIsTalking(false);
//     setIsLoading(false);
//   };

//   return (
//     <div className="relative w-full h-[40vh] bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg overflow-hidden mb-6 border border-slate-700/50">
//       <Canvas
//         camera={{
//           position: [0, 1.8, 3.5],
//           fov: 30,
//           near: 0.1,
//           far: 1000
//         }}
//         gl={{ antialias: true, alpha: true }}
//         frameloop="demand"
//       >
//         <ambientLight intensity={0.6} />
//         <directionalLight position={[2, 3, 5]} intensity={1.2} castShadow />
//         <directionalLight position={[-2, 2, 3]} intensity={0.8} />
//         <pointLight position={[0, 2.5, 2]} intensity={0.6} />
//         <spotLight position={[0, 5, 5]} angle={0.3} penumbra={0.5} intensity={0.5} castShadow />
//         <AvatarModel isTalking={isTalking} />
//         <FaceCamera />
//       </Canvas>

//       {import.meta.env.DEV && (
//         <div className="absolute top-4 left-4 space-y-2">
//           <div className="text-xs text-white bg-black/70 p-2 rounded">
//             <div>isTalking: {isTalking.toString()}</div>
//             <div>isLoading: {isLoading.toString()}</div>
//             <div>Speech Enabled: {isEnabled.toString()}</div>
//           </div>
//         </div>
//       )}

//       <div className="absolute top-4 right-4 flex items-center gap-2">
//         {isLoading && (
//           <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-full">
//             <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
//             <span className="text-sm text-slate-300">Preparing...</span>
//           </div>
//         )}

//         {isTalking && (
//           <button
//             onClick={stopSpeaking}
//             className="flex items-center gap-2 bg-red-600/80 hover:bg-red-700/80 px-3 py-1 rounded-full transition-all duration-200"
//             title="Stop Speaking"
//           >
//             <VolumeX className="w-4 h-4 text-white" />
//             <span className="text-sm text-white">Stop</span>
//           </button>
//         )}
//       </div>

//       {isTalking && (
//         <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-green-600/20 border border-green-500/30 px-3 py-2 rounded-full">
//           <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//           <span className="text-sm text-green-300">Speaking...</span>
//         </div>
//       )}
//     </div>
//   );
// }

// // InterviewSession Component with Speech-to-Text and End Interview Button
// function InterviewSession() {
//   const { interviewId } = useParams();
//   const navigate = useNavigate();
//   const token = getAuthToken();

//   const [loading, setLoading] = useState(true);
//   const [sessionId, setSessionId] = useState(null);
//   const [currentQuestion, setCurrentQuestion] = useState(null);
//   const [answer, setAnswer] = useState("");
//   const [chatHistory, setChatHistory] = useState([]);
//   const [completed, setCompleted] = useState(false);
//   const [error, setError] = useState(null);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [endTime, setEndTime] = useState(null);
//   const [interviewActive, setInterviewActive] = useState(false);
//   const [speechEnabled, setSpeechEnabled] = useState(true);
//   const [questionSpoken, setQuestionSpoken] = useState(false);
//   const [isRecognizing, setIsRecognizing] = useState(false);
//   const recognitionRef = useRef(null);

//   const hasInitialized = useRef(false);
//   const chatEndRef = useRef(null);
//   const [questionLoading, setQuestionLoading] = useState(false);
//   const API_URL = import.meta.env.VITE_API_URL;

//   // Speech-to-Text Setup
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (SpeechRecognition) {
//       recognitionRef.current = new SpeechRecognition();
//       recognitionRef.current.lang = "en-US";
//       recognitionRef.current.interimResults = true;
//       recognitionRef.current.continuous = true;

//       recognitionRef.current.onresult = (event) => {
//         const transcript = Array.from(event.results)
//           .map(result => result[0].transcript)
//           .join("");
//         setAnswer(prev => prev + (prev ? " " : "") + transcript);
//       };

//       recognitionRef.current.onerror = (error) => {
//         console.error("Speech recognition error:", error);
//         setIsRecognizing(false);
//       };

//       recognitionRef.current.onend = () => {
//         setIsRecognizing(false);
//       };
//     } else {
//       console.warn("Speech Recognition API not supported in this browser.");
//     }

//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//       }
//     };
//   }, []);

//   const toggleSpeechRecognition = () => {
//     if (!recognitionRef.current) return;

//     if (isRecognizing) {
//       recognitionRef.current.stop();
//       setIsRecognizing(false);
//     } else {
//       try {
//         recognitionRef.current.start();
//         setIsRecognizing(true);
//       } catch (error) {
//         console.error("Failed to start speech recognition:", error);
//       }
//     }
//   };

//   // Existing useEffect hooks (unchanged)
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chatHistory]);

//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//     if (hasInitialized.current) return;
//     hasInitialized.current = true;

//     const initSession = async () => {
//       try {
//         const interviewData = await fetchWithToken(
//           `${API_URL}/interview/get-all-interviews/`,
//           token
//         );
//         const currentInterview = interviewData.find(
//           (item) => item.id === parseInt(interviewId)
//         );

//         if (!currentInterview) {
//           setError("Interview not found.");
//           setLoading(false);
//           return;
//         }
//         const now = new Date();
//         const start = new Date(currentInterview.startTime);
//         const end = new Date(currentInterview.endTime);
//         setEndTime(end);
//         if (now < start) {
//           setError("Interview has not started yet.");
//           setLoading(false);
//           return;
//         }
//         if (now > end) {
//           setError("Interview time has ended.");
//           setLoading(false);
//           return;
//         }
//         setInterviewActive(true);
//         const data = await fetchWithToken(
//           `${API_URL}/interview/interview-session-initializer/${interviewId}/`,
//           token,
//           null,
//           "POST"
//         );
//         if (!data || !data.session_id) {
//           setError(data?.error || "Failed to start interview.");
//         } else {
//           setSessionId(data.session_id);
//           setCurrentQuestion(data.question);
//         }
//       } catch (err) {
//         setError("Error initializing session.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     initSession();
//   }, [interviewId, token, navigate]);

//   useEffect(() => {
//     if (!endTime) return;
//     const timer = setInterval(() => {
//       if (new Date() >= endTime) {
//         setCompleted(true);
//         setCurrentQuestion(null);
//         clearInterval(timer);
//       }
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [endTime]);

//   useEffect(() => {
//     if (completed && sessionId) {
//       navigate(`/dsa-interview-platform/${sessionId}`);
//     }
//   }, [completed, sessionId, navigate]);

//   useEffect(() => {
//     if (currentQuestion && !questionLoading) {
//       setQuestionSpoken(false);
//     }
//   }, [currentQuestion, questionLoading]);

//   const handleNext = async () => {
//     if (!answer.trim()) return;

//     setChatHistory((prev) => [...prev, { question: currentQuestion, answer }]);
//     setAnswer("");
//     setQuestionLoading(true);

//     try {
//       const data = await fetchWithToken(
//         `${API_URL}/interview/interview-session/${sessionId}/?answer=${encodeURIComponent(answer)}`,
//         token,
//         null,
//         "POST"
//       );

//       if (!data) {
//         setError("Error submitting answer.");
//         return;
//       }

//       if (data.completed) {
//         setCompleted(true);
//       } else {
//         setCurrentQuestion(data.current_question);
//       }
//     } catch (err) {
//       setError("Error submitting answer.");
//     } finally {
//       setQuestionLoading(false);
//     }
//   };

//   const handleEndInterview = async () => {
//     setCompleted(true);
//     try {
//       await fetchWithToken(
//         `${API_URL}/interview/interview-session/${sessionId}/complete`,
//         token,
//         null,
//         "POST"
//       );
//     } catch (err) {
//       console.error("Error completing interview:", err);
//     }
//     navigate(`/dsa-interview-platform/${sessionId}`);
//   };

//   const handleStartInterview = () => setShowWelcome(false);

//   const handleSpeechEnd = () => {
//     setQuestionSpoken(true);
//   };

//   const toggleSpeech = () => {
//     if (speechEnabled) {
//       window.speechSynthesis.cancel();
//     }
//     setSpeechEnabled(!speechEnabled);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
//         <Loader2 className="animate-spin w-10 h-10 text-purple-400" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen text-white bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//         <p className="text-xl text-red-400">{error}</p>
//         <button
//           onClick={() => navigate(-1)}
//           className="mt-4 bg-purple-600 px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   if (showWelcome) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
//         <div className="bg-slate-800/60 p-12 rounded-2xl border border-slate-700/50 shadow-2xl max-w-md w-full mx-4 text-center">
//           <div className="bg-purple-600/20 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
//             <MessageCircle size={48} className="text-purple-400" />
//           </div>
//           <h1 className="text-4xl font-bold text-purple-300 mb-4">
//             Welcome to the AI Interview
//           </h1>
//           <p className="text-slate-300 mb-8 text-lg leading-relaxed">
//             You're about to begin your interactive interview session with an AI interviewer. 
//             Take your time with each question and answer thoughtfully.
//           </p>
//           <button
//             onClick={handleStartInterview}
//             className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
//           >
//             Start Interview
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (completed) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
//         <div className="bg-green-700/30 border border-green-500/30 p-12 rounded-2xl shadow-2xl max-w-md w-full mx-4 text-center">
//           <div className="bg-green-600/20 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
//             <MessageCircle size={48} className="text-green-400" />
//           </div>
//           <h1 className="text-4xl font-bold text-green-300 mb-4">
//             Thank you for attending the interview!
//           </h1>
//           <p className="text-green-200 text-lg">
//             Redirecting to dashboard in a moment...
//           </p>
//           <div className="mt-6">
//             <Loader2 className="animate-spin w-6 h-6 text-green-400 mx-auto" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
//       <div className="sticky top-0 z-10 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-all duration-200"
//             >
//               <ArrowLeft size={20} />
//             </button>
//             <h1 className="text-xl font-bold text-purple-300">AI Interview Session</h1>
//           </div>
//           <div className="flex items-center gap-4">
//             <button
//               onClick={toggleSpeech}
//               className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
//                 speechEnabled
//                   ? "bg-green-600/20 border border-green-500/30 text-green-300"
//                   : "bg-red-600/20 border border-red-500/30 text-red-300"
//               }`}
//             >
//               {speechEnabled ? (
//                 <>
//                   <Volume2 size={16} />
//                   <span className="text-sm">Speech On</span>
//                 </>
//               ) : (
//                 <>
//                   <VolumeX size={16} />
//                   <span className="text-sm">Speech Off</span>
//                 </>
//               )}
//             </button>
//             <button
//               onClick={toggleSpeechRecognition}
//               className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
//                 isRecognizing
//                   ? "bg-blue-600/20 border border-blue-500/30 text-blue-300"
//                   : "bg-slate-600/20 border border-slate-500/30 text-slate-300"
//               }`}
//               disabled={!recognitionRef.current}
//             >
//               {isRecognizing ? (
//                 <>
//                   <Mic size={16} />
//                   <span className="text-sm">Recording...</span>
//                 </>
//               ) : (
//                 <>
//                   <MicOff size={16} />
//                   <span className="text-sm">Speak Answer</span>
//                 </>
//               )}
//             </button>
//             <div className="text-sm text-slate-400">
//               Question {chatHistory.length + 1}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex h-[calc(100vh-80px)]">
//         <div className="w-1/3 bg-slate-800/40 border-r border-slate-700/50 flex flex-col">
//           <div className="p-4 border-b border-slate-700/50">
//             <h2 className="text-xl font-semibold text-purple-300 flex items-center gap-2">
//               <MessageCircle size={20} /> Interview History
//             </h2>
//           </div>
//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             {chatHistory.length === 0 ? (
//               <div className="text-center text-slate-400 mt-8">
//                 <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
//                 <p>No conversation yet</p>
//                 <p className="text-sm mt-2">Your interview will appear here</p>
//               </div>
//             ) : (
//               chatHistory.map((item, index) => (
//                 <div key={index} className="space-y-3">
//                   <div className="flex gap-3">
//                     <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
//                       <MessageCircle size={16} className="text-white" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="bg-slate-700/50 p-3 rounded-lg">
//                         <p className="text-purple-300 font-medium text-sm">
//                           Question {index + 1}
//                         </p>
//                         <p className="text-slate-200 mt-1">{item.question}</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex gap-3">
//                     <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
//                       <User size={16} className="text-white" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="bg-slate-600/50 p-3 rounded-lg">
//                         <p className="text-blue-300 font-medium text-sm">
//                           Your Answer
//                         </p>
//                         <p className="text-slate-200 mt-1">{item.answer}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//             <div ref={chatEndRef} />
//           </div>
//         </div>

//         <div className="flex-1 flex flex-col">
//           <div className="flex-1 p-6 flex flex-col">
//             {questionLoading ? (
//               <div className="flex-1 flex justify-center items-center">
//                 <div className="text-center">
//                   <Loader2 className="w-10 h-10 text-purple-400 animate-spin mx-auto mb-4" />
//                   <p className="text-slate-300 text-lg">Evaluating your response...</p>
//                   <p className="text-slate-400 text-sm mt-2">Preparing next question</p>
//                 </div>
//               </div>
//             ) : currentQuestion ? (
//               <>
//                 <TalkingAvatar
//                   text={speechEnabled && !questionSpoken ? currentQuestion : ""}
//                   isEnabled={speechEnabled && !questionSpoken}
//                   onSpeechEnd={handleSpeechEnd}
//                 />
//                 <div className="flex-1 flex items-center justify-center">
//                   <div className="max-w-3xl w-full">
//                     <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700/50 shadow-2xl">
//                       <div className="flex items-center gap-3 mb-6">
//                         <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
//                           <MessageCircle size={20} className="text-white" />
//                         </div>
//                         <h3 className="text-xl font-bold text-purple-300">
//                           Question {chatHistory.length + 1}
//                         </h3>
//                         {speechEnabled && !questionSpoken && (
//                           <div className="ml-auto flex items-center gap-2 text-green-400 text-sm">
//                             <Volume2 size={16} />
//                             <span>AI is speaking...</span>
//                           </div>
//                         )}
//                       </div>
//                       <p className="text-xl text-slate-200 mb-8 leading-relaxed">
//                         {currentQuestion}
//                       </p>
//                       <div className="space-y-4">
//                         <textarea
//                           value={answer}
//                           onChange={(e) => setAnswer(e.target.value)}
//                           className="w-full bg-slate-900 text-white p-4 rounded-lg border border-slate-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 resize-none"
//                           rows="6"
//                           placeholder="Type or speak your answer here..."
//                         />
//                         <div className="flex justify-between items-center">
//                           <div className="text-sm text-slate-400">
//                             {answer.length} characters
//                           </div>
//                           <div className="flex gap-4">
//                             <button
//                               onClick={handleNext}
//                               disabled={!answer.trim()}
//                               className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed px-8 py-3 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
//                             >
//                               <Send size={18} /> Submit Answer
//                             </button>
//                             <button
//                               onClick={handleEndInterview}
//                               className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
//                             >
//                               End Interview
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             ) : null}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default InterviewSession;




import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import { getAuthToken, fetchWithToken } from "../utils/handleToken";
import { Loader2, ArrowLeft, Send, MessageCircle, User, Volume2, VolumeX, Mic, MicOff, Clock, Play, Pause } from "lucide-react";
import { useCallback } from "react";
// Enhanced Face-focused camera component
// function FaceCamera() {
//   const orbitControlsRef = useRef();
//   const { camera } = useThree();

//   useEffect(() => {
//     camera.position.set(0, 1.8, 4.2);
//     camera.lookAt(0, 1.8, 0);
//     camera.fov = 35;
//     camera.updateProjectionMatrix();
//   }, [camera]);

//   useFrame(() => {
//     if (orbitControlsRef.current) {
//       orbitControlsRef.current.target.set(0, 1.8, 0);
//       orbitControlsRef.current.update();
//     }
//   });

//   return (
//     <OrbitControls
//       ref={orbitControlsRef}
//       enableZoom={true}
//       enablePan={false}
//       maxDistance={6}
//       minDistance={2.5}
//       maxPolarAngle={Math.PI / 1.8}
//       minPolarAngle={Math.PI / 6}
//       enableDamping={true}
//       dampingFactor={0.05}
//     />
//   );
// }
function FaceCamera() {
  const orbitControlsRef = useRef();
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 1.8, 4.2);
    camera.lookAt(0, 1.8, 0);
    camera.fov = 35;
    camera.updateProjectionMatrix();
  }, [camera]);

  useFrame(() => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.target.set(0, 1.8, 0);
      orbitControlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={orbitControlsRef}
      enableZoom={true}
      enablePan={false}
      maxDistance={6}
      minDistance={2.5}
      maxPolarAngle={Math.PI / 1.8}
      minPolarAngle={Math.PI / 6}
      enableDamping={true}
      dampingFactor={0.05}
    />
  );
}
// Enhanced Avatar component with improved lip-sync
// function AvatarModel({ isTalking, audioData }) {
//   const { scene } = useGLTF("/person.glb");
//   const [debugInfo, setDebugInfo] = useState("");
//   const [foundMouthTarget, setFoundMouthTarget] = useState(null);
//   const [foundEyeBlinkTarget, setFoundEyeBlinkTarget] = useState(null);
//   const lipSyncRef = useRef({
//     intensity: 0,
//     lastTime: 0,
//     blinkTime: 0,
//     nextBlink: Math.random() * 3000 + 2000
//   });

//   useEffect(() => {
//     if (scene) {
//       scene.traverse((child) => {
//         if (child.isMesh && child.morphTargetDictionary) {
//           console.log("Found mesh with morph targets:", Object.keys(child.morphTargetDictionary));
          
//           const possibleMouthNames = [
//             'MouthOpen', 'mouthOpen', 'mouth_open', 'Mouth_Open',
//             'jawOpen', 'jaw_open', 'Jaw_Open', 'JawOpen',
//             'viseme_aa', 'viseme_A', 'A', 'aa', 'mouth',
//             'Mouth', 'jaw', 'Jaw', 'mouthSmile', 'mouth_smile'
//           ];

//           const possibleEyeNames = [
//             'eyeBlinkLeft', 'eyeBlinkRight', 'eyeBlink', 'blink',
//             'EyeBlinkLeft', 'EyeBlinkRight', 'EyeBlink', 'Blink'
//           ];

//           for (const key of possibleMouthNames) {
//             if (child.morphTargetDictionary[key] !== undefined) {
//               setFoundMouthTarget({
//                 index: child.morphTargetDictionary[key],
//                 name: key,
//                 mesh: child
//               });
//               console.log(`Found mouth target: ${key} at index ${child.morphTargetDictionary[key]}`);
//               break;
//             }
//           }

//           for (const key of possibleEyeNames) {
//             if (child.morphTargetDictionary[key] !== undefined) {
//               setFoundEyeBlinkTarget({
//                 index: child.morphTargetDictionary[key],
//                 name: key,
//                 mesh: child
//               });
//               console.log(`Found eye blink target: ${key} at index ${child.morphTargetDictionary[key]}`);
//               break;
//             }
//           }

//           setDebugInfo(`Morph targets: ${Object.keys(child.morphTargetDictionary).join(", ")}`);
//         }
//       });
//     }
//   }, [scene]);

//   useFrame((state) => {
//     if (!scene) return;

//     const time = state.clock.getElapsedTime() * 1000;
//     const deltaTime = time - lipSyncRef.current.lastTime;
//     lipSyncRef.current.lastTime = time;

//     // Enhanced lip-sync animation
//     if (isTalking && foundMouthTarget && foundMouthTarget.mesh.morphTargetInfluences) {
//       // Create more realistic mouth movement patterns
//       const fastOscillation = Math.abs(Math.sin(time * 0.01)) * 0.6;
//       const mediumOscillation = Math.abs(Math.sin(time * 0.007)) * 0.4;
//       const slowOscillation = Math.abs(Math.sin(time * 0.003)) * 0.2;
//       const randomVariation = (Math.random() - 0.5) * 0.1;
      
//       const targetIntensity = Math.min(
//         fastOscillation + mediumOscillation + slowOscillation + randomVariation,
//         0.85
//       );
      
//       // Smooth interpolation for more natural movement
//       lipSyncRef.current.intensity = lerp(
//         lipSyncRef.current.intensity,
//         targetIntensity,
//         0.15
//       );
      
//       foundMouthTarget.mesh.morphTargetInfluences[foundMouthTarget.index] = 
//         Math.max(0, lipSyncRef.current.intensity);
//     } else if (foundMouthTarget && foundMouthTarget.mesh.morphTargetInfluences) {
//       // Gradually close mouth when not talking
//       lipSyncRef.current.intensity = lerp(lipSyncRef.current.intensity, 0, 0.1);
//       foundMouthTarget.mesh.morphTargetInfluences[foundMouthTarget.index] = 
//         Math.max(0, lipSyncRef.current.intensity);
//     }

//     // Enhanced eye blinking animation
//     if (foundEyeBlinkTarget && foundEyeBlinkTarget.mesh.morphTargetInfluences) {
//       if (time - lipSyncRef.current.blinkTime > lipSyncRef.current.nextBlink) {
//         lipSyncRef.current.blinkTime = time;
//         lipSyncRef.current.nextBlink = Math.random() * 4000 + 1500; // Random blink interval
        
//         // Quick blink animation
//         const blinkDuration = 150;
//         const blinkProgress = Math.min((time - lipSyncRef.current.blinkTime) / blinkDuration, 1);
//         const blinkValue = blinkProgress < 0.5 
//           ? blinkProgress * 2 
//           : 2 - (blinkProgress * 2);
        
//         foundEyeBlinkTarget.mesh.morphTargetInfluences[foundEyeBlinkTarget.index] = blinkValue;
//       }
//     }
//   });

//   // Linear interpolation helper
//   function lerp(start, end, factor) {
//     return start + (end - start) * factor;
//   }

//   return (
//     <group>
//       <primitive object={scene} scale={2.4} position={[0, -2.4, 0]} />
//       {debugInfo && import.meta.env.DEV && (
//         <Html position={[0, 3.2, 0]}>
//           <div className="text-xs text-white bg-black/80 p-3 rounded-lg max-w-xs backdrop-blur-sm border border-white/20">
//             <div className="font-mono">{debugInfo}</div>
//             {foundMouthTarget && (
//               <div className="text-green-300 mt-2 font-semibold">
//                 Mouth: {foundMouthTarget.name} (#{foundMouthTarget.index})
//               </div>
//             )}
//             {foundEyeBlinkTarget && (
//               <div className="text-blue-300 mt-1 font-semibold">
//                 Blink: {foundEyeBlinkTarget.name} (#{foundEyeBlinkTarget.index})
//               </div>
//             )}
//           </div>
//         </Html>
//       )}
//     </group>
//   );
// }
// function AvatarModel({ isTalking, audioData }) {
//   const { scene } = useGLTF("/person.glb");
//   const [debugInfo, setDebugInfo] = useState("");
//   const [foundMouthTarget, setFoundMouthTarget] = useState(null);
//   const [foundEyeBlinkTarget, setFoundEyeBlinkTarget] = useState(null);
//   const lipSyncRef = useRef({
//     intensity: 0,
//     lastTime: 0,
//     blinkTime: 0,
//     nextBlink: Math.random() * 3000 + 2000
//   });

//   useEffect(() => {
//     if (scene) {
//       scene.traverse((child) => {
//         if (child.isMesh && child.morphTargetDictionary) {
//           console.log("Found mesh with morph targets:", Object.keys(child.morphTargetDictionary));
          
//           const possibleMouthNames = [
//             'MouthOpen', 'mouthOpen', 'mouth_open', 'Mouth_Open',
//             'jawOpen', 'jaw_open', 'Jaw_Open', 'JawOpen',
//             'viseme_aa', 'viseme_A', 'A', 'aa', 'mouth',
//             'Mouth', 'jaw', 'Jaw', 'mouthSmile', 'mouth_smile'
//           ];

//           const possibleEyeNames = [
//             'eyeBlinkLeft', 'eyeBlinkRight', 'eyeBlink', 'blink',
//             'EyeBlinkLeft', 'EyeBlinkRight', 'EyeBlink', 'Blink'
//           ];

//           for (const key of possibleMouthNames) {
//             if (child.morphTargetDictionary[key] !== undefined) {
//               setFoundMouthTarget({
//                 index: child.morphTargetDictionary[key],
//                 name: key,
//                 mesh: child
//               });
//               console.log(`Found mouth target: ${key} at index ${child.morphTargetDictionary[key]}`);
//               break;
//             }
//           }

//           for (const key of possibleEyeNames) {
//             if (child.morphTargetDictionary[key] !== undefined) {
//               setFoundEyeBlinkTarget({
//                 index: child.morphTargetDictionary[key],
//                 name: key,
//                 mesh: child
//               });
//               console.log(`Found eye blink target: ${key} at index ${child.morphTargetDictionary[key]}`);
//               break;
//             }
//           }

//           setDebugInfo(`Morph targets: ${Object.keys(child.morphTargetDictionary).join(", ")}`);
//         }
//       });
//     }
//   }, [scene]);

//   useFrame((state) => {
//     if (!scene) return;

//     const time = state.clock.getElapsedTime() * 1000;
//     const deltaTime = time - lipSyncRef.current.lastTime;
//     lipSyncRef.current.lastTime = time;

//     // Enhanced lip-sync animation
//     if (isTalking && foundMouthTarget && foundMouthTarget.mesh.morphTargetInfluences) {
//       // Create more realistic mouth movement patterns
//       const fastOscillation = Math.abs(Math.sin(time * 0.01)) * 0.6;
//       const mediumOscillation = Math.abs(Math.sin(time * 0.007)) * 0.4;
//       const slowOscillation = Math.abs(Math.sin(time * 0.003)) * 0.2;
//       const randomVariation = (Math.random() - 0.5) * 0.1;
      
//       const targetIntensity = Math.min(
//         fastOscillation + mediumOscillation + slowOscillation + randomVariation,
//         0.85
//       );
      
//       // Smooth interpolation for more natural movement
//       lipSyncRef.current.intensity = lerp(
//         lipSyncRef.current.intensity,
//         targetIntensity,
//         0.15
//       );
      
//       foundMouthTarget.mesh.morphTargetInfluences[foundMouthTarget.index] = 
//         Math.max(0, lipSyncRef.current.intensity);
//     } else if (foundMouthTarget && foundMouthTarget.mesh.morphTargetInfluences) {
//       // Gradually close mouth when not talking
//       lipSyncRef.current.intensity = lerp(lipSyncRef.current.intensity, 0, 0.1);
//       foundMouthTarget.mesh.morphTargetInfluences[foundMouthTarget.index] = 
//         Math.max(0, lipSyncRef.current.intensity);
//     }

//     // Enhanced eye blinking animation
//     if (foundEyeBlinkTarget && foundEyeBlinkTarget.mesh.morphTargetInfluences) {
//       if (time - lipSyncRef.current.blinkTime > lipSyncRef.current.nextBlink) {
//         lipSyncRef.current.blinkTime = time;
//         lipSyncRef.current.nextBlink = Math.random() * 4000 + 1500; // Random blink interval
        
//         // Quick blink animation
//         const blinkDuration = 150;
//         const blinkProgress = Math.min((time - lipSyncRef.current.blinkTime) / blinkDuration, 1);
//         const blinkValue = blinkProgress < 0.5 
//           ? blinkProgress * 2 
//           : 2 - (blinkProgress * 2);
        
//         foundEyeBlinkTarget.mesh.morphTargetInfluences[foundEyeBlinkTarget.index] = blinkValue;
//       }
//     }
//   });
//   function lerp(start, end, factor) {
//     return start + (end - start) * factor;
//   }
//   return (
//     <group>
//       <primitive object={scene} scale={2.4} position={[0, -2.4, 0]} />
//       {debugInfo && import.meta.env.DEV && (
//         <Html position={[0, 3.2, 0]}>
//           <div className="text-xs text-white bg-black/80 p-3 rounded-lg max-w-xs backdrop-blur-sm border border-white/20">
//             <div className="font-mono">{debugInfo}</div>
//             {foundMouthTarget && (
//               <div className="text-green-300 mt-2 font-semibold">
//                 Mouth: {foundMouthTarget.name} (#{foundMouthTarget.index})
//               </div>
//             )}
//             {foundEyeBlinkTarget && (
//               <div className="text-blue-300 mt-1 font-semibold">
//                 Blink: {foundEyeBlinkTarget.name} (#{foundEyeBlinkTarget.index})
//               </div>
//             )}
//           </div>
//         </Html>
//       )}
//     </group>
//   );
// }
  
// function AvatarModel({ isTalking, audioData }) {
//   const { scene } = useGLTF("/person.glb");
//   const [debugInfo, setDebugInfo] = useState("");
//   const [foundMouthTarget, setFoundMouthTarget] = useState(null);
//   const [foundEyeBlinkTarget, setFoundEyeBlinkTarget] = useState(null);
  
//   // Use useRef for values that need to persist across renders but don't trigger re-renders
//   const lipSyncRef = useRef({
//     intensity: 0,
//     lastTime: 0,
//     blinkTime: 0,
//     nextBlink: Math.random() * 3000 + 2000,
//     blinkIntensity: 0,
//     isBlinking: false,
//     blinkStartTime: 0
//   });

//   // Memoized lerp function to avoid recreation on each render
//   const lerp = useCallback((start, end, factor) => {
//     return start + (end - start) * factor;
//   }, []);

//   useEffect(() => {
//     if (scene) {
//       scene.traverse((child) => {
//         if (child.isMesh && child.morphTargetDictionary) {
//           console.log("Found mesh with morph targets:", Object.keys(child.morphTargetDictionary));
          
//           const possibleMouthNames = [
//             'MouthOpen', 'mouthOpen', 'mouth_open', 'Mouth_Open',
//             'jawOpen', 'jaw_open', 'Jaw_Open', 'JawOpen',
//             'viseme_aa', 'viseme_A', 'A', 'aa', 'mouth',
//             'Mouth', 'jaw', 'Jaw', 'mouthSmile', 'mouth_smile'
//           ];

//           const possibleEyeNames = [
//             'eyeBlinkLeft', 'eyeBlinkRight', 'eyeBlink', 'blink',
//             'EyeBlinkLeft', 'EyeBlinkRight', 'EyeBlink', 'Blink'
//           ];

//           // Find mouth target
//           for (const key of possibleMouthNames) {
//             if (child.morphTargetDictionary[key] !== undefined) {
//               setFoundMouthTarget({
//                 index: child.morphTargetDictionary[key],
//                 name: key,
//                 mesh: child
//               });
//               console.log(`Found mouth target: ${key} at index ${child.morphTargetDictionary[key]}`);
//               break;
//             }
//           }

//           // Find eye blink target
//           for (const key of possibleEyeNames) {
//             if (child.morphTargetDictionary[key] !== undefined) {
//               setFoundEyeBlinkTarget({
//                 index: child.morphTargetDictionary[key],
//                 name: key,
//                 mesh: child
//               });
//               console.log(`Found eye blink target: ${key} at index ${child.morphTargetDictionary[key]}`);
//               break;
//             }
//           }

//           setDebugInfo(`Morph targets: ${Object.keys(child.morphTargetDictionary).join(", ")}`);
//         }
//       });
//     }
//   }, [scene]);

//   useFrame((state) => {
//     if (!scene) return;

//     const time = state.clock.getElapsedTime() * 1000;
//     const deltaTime = time - lipSyncRef.current.lastTime;
//     lipSyncRef.current.lastTime = time;

//     // Enhanced lip-sync animation
//     if (isTalking && foundMouthTarget && foundMouthTarget.mesh.morphTargetInfluences) {
//       // Create more realistic mouth movement patterns
//       const fastOscillation = Math.abs(Math.sin(time * 0.01)) * 0.6;
//       const mediumOscillation = Math.abs(Math.sin(time * 0.007)) * 0.4;
//       const slowOscillation = Math.abs(Math.sin(time * 0.003)) * 0.2;
//       const randomVariation = (Math.random() - 0.5) * 0.1;
      
//       const targetIntensity = Math.min(
//         Math.max(fastOscillation + mediumOscillation + slowOscillation + randomVariation, 0),
//         0.85
//       );
      
//       // Smooth interpolation for more natural movement
//       lipSyncRef.current.intensity = lerp(
//         lipSyncRef.current.intensity,
//         targetIntensity,
//         0.15
//       );
      
//       foundMouthTarget.mesh.morphTargetInfluences[foundMouthTarget.index] = 
//         Math.max(0, lipSyncRef.current.intensity);
//     } else if (foundMouthTarget && foundMouthTarget.mesh.morphTargetInfluences) {
//       // Gradually close mouth when not talking
//       lipSyncRef.current.intensity = lerp(lipSyncRef.current.intensity, 0, 0.1);
//       foundMouthTarget.mesh.morphTargetInfluences[foundMouthTarget.index] = 
//         Math.max(0, lipSyncRef.current.intensity);
//     }

//     // Fixed eye blinking animation
//     if (foundEyeBlinkTarget && foundEyeBlinkTarget.mesh.morphTargetInfluences) {
//       const timeSinceLastBlink = time - lipSyncRef.current.blinkTime;
      
//       if (!lipSyncRef.current.isBlinking && timeSinceLastBlink > lipSyncRef.current.nextBlink) {
//         // Start new blink
//         lipSyncRef.current.isBlinking = true;
//         lipSyncRef.current.blinkStartTime = time;
//         lipSyncRef.current.blinkTime = time;
//         lipSyncRef.current.nextBlink = Math.random() * 4000 + 1500; // Random blink interval
//       }
      
//       if (lipSyncRef.current.isBlinking) {
//         const blinkDuration = 150;
//         const blinkProgress = Math.min((time - lipSyncRef.current.blinkStartTime) / blinkDuration, 1);
        
//         // Smooth blink animation (ease-in-out)
//         let blinkValue;
//         if (blinkProgress < 0.5) {
//           // Closing phase
//           blinkValue = Math.sin(blinkProgress * Math.PI);
//         } else {
//           // Opening phase
//           blinkValue = Math.sin((1 - blinkProgress) * Math.PI);
//         }
        
//         lipSyncRef.current.blinkIntensity = blinkValue;
//         foundEyeBlinkTarget.mesh.morphTargetInfluences[foundEyeBlinkTarget.index] = blinkValue;
        
//         // End blink
//         if (blinkProgress >= 1) {
//           lipSyncRef.current.isBlinking = false;
//           lipSyncRef.current.blinkIntensity = 0;
//           foundEyeBlinkTarget.mesh.morphTargetInfluences[foundEyeBlinkTarget.index] = 0;
//         }
//       }
//     }
//   });

//   return (
//     <group>
//       <primitive object={scene} scale={2.4} position={[0, -2.4, 0]} />
//       {debugInfo && import.meta.env.DEV && (
//         <Html position={[0, 3.2, 0]}>
//           <div className="text-xs text-white bg-black/80 p-3 rounded-lg max-w-xs backdrop-blur-sm border border-white/20">
//             <div className="font-mono">{debugInfo}</div>
//             {foundMouthTarget && (
//               <div className="text-green-300 mt-2 font-semibold">
//                 Mouth: {foundMouthTarget.name} (#{foundMouthTarget.index})
//               </div>
//             )}
//             {foundEyeBlinkTarget && (
//               <div className="text-blue-300 mt-1 font-semibold">
//                 Blink: {foundEyeBlinkTarget.name} (#{foundEyeBlinkTarget.index})
//               </div>
//             )}
//           </div>
//         </Html>
//       )}
//     </group>
//   );
// }
function AvatarModel({ isTalking, audioData }) {
  const { scene } = useGLTF("/person.glb");
  const [debugInfo, setDebugInfo] = useState("");
  const [foundMouthTarget, setFoundMouthTarget] = useState(null);
  const [foundEyeBlinkTarget, setFoundEyeBlinkTarget] = useState(null);
  
  // Use useRef for values that need to persist across renders but don't trigger re-renders
  const lipSyncRef = useRef({
    intensity: 0,
    lastTime: 0,
    blinkTime: 0,
    nextBlink: Math.random() * 3000 + 2000,
    blinkIntensity: 0,
    isBlinking: false,
    blinkStartTime: 0
  });

  // Memoized lerp function to avoid recreation on each render
  const lerp = useCallback((start, end, factor) => {
    return start + (end - start) * factor;
  }, []);

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh && child.morphTargetDictionary) {
          console.log("Found mesh with morph targets:", Object.keys(child.morphTargetDictionary));
          
          const possibleMouthNames = [
            'MouthOpen', 'mouthOpen', 'mouth_open', 'Mouth_Open',
            'jawOpen', 'jaw_open', 'Jaw_Open', 'JawOpen',
            'viseme_aa', 'viseme_A', 'A', 'aa', 'mouth',
            'Mouth', 'jaw', 'Jaw', 'mouthSmile', 'mouth_smile'
          ];

          const possibleEyeNames = [
            'eyeBlinkLeft', 'eyeBlinkRight', 'eyeBlink', 'blink',
            'EyeBlinkLeft', 'EyeBlinkRight', 'EyeBlink', 'Blink'
          ];

          // Find mouth target
          for (const key of possibleMouthNames) {
            if (child.morphTargetDictionary[key] !== undefined) {
              setFoundMouthTarget({
                index: child.morphTargetDictionary[key],
                name: key,
                mesh: child
              });
              console.log(`Found mouth target: ${key} at index ${child.morphTargetDictionary[key]}`);
              break;
            }
          }

          // Find eye blink target
          for (const key of possibleEyeNames) {
            if (child.morphTargetDictionary[key] !== undefined) {
              setFoundEyeBlinkTarget({
                index: child.morphTargetDictionary[key],
                name: key,
                mesh: child
              });
              console.log(`Found eye blink target: ${key} at index ${child.morphTargetDictionary[key]}`);
              break;
            }
          }

          setDebugInfo(`Morph targets: ${Object.keys(child.morphTargetDictionary).join(", ")}`);
        }
      });
    }
  }, [scene]);

  useFrame((state) => {
    if (!scene) return;

    const time = state.clock.getElapsedTime() * 1000;
    const deltaTime = time - lipSyncRef.current.lastTime;
    lipSyncRef.current.lastTime = time;

    // Enhanced lip-sync animation
    if (isTalking && foundMouthTarget && foundMouthTarget.mesh.morphTargetInfluences) {
      // Create more realistic mouth movement patterns
      const fastOscillation = Math.abs(Math.sin(time * 0.01)) * 0.6;
      const mediumOscillation = Math.abs(Math.sin(time * 0.007)) * 0.4;
      const slowOscillation = Math.abs(Math.sin(time * 0.003)) * 0.2;
      const randomVariation = (Math.random() - 0.5) * 0.1;
      
      const targetIntensity = Math.min(
        Math.max(fastOscillation + mediumOscillation + slowOscillation + randomVariation, 0),
        0.85
      );
      
      // Smooth interpolation for more natural movement
      lipSyncRef.current.intensity = lerp(
        lipSyncRef.current.intensity,
        targetIntensity,
        0.15
      );
      
      foundMouthTarget.mesh.morphTargetInfluences[foundMouthTarget.index] = 
        Math.max(0, lipSyncRef.current.intensity);
    } else if (foundMouthTarget && foundMouthTarget.mesh.morphTargetInfluences) {
      // Gradually close mouth when not talking
      lipSyncRef.current.intensity = lerp(lipSyncRef.current.intensity, 0, 0.1);
      foundMouthTarget.mesh.morphTargetInfluences[foundMouthTarget.index] = 
        Math.max(0, lipSyncRef.current.intensity);
    }

    // Fixed eye blinking animation
    if (foundEyeBlinkTarget && foundEyeBlinkTarget.mesh.morphTargetInfluences) {
      const timeSinceLastBlink = time - lipSyncRef.current.blinkTime;
      
      if (!lipSyncRef.current.isBlinking && timeSinceLastBlink > lipSyncRef.current.nextBlink) {
        // Start new blink
        lipSyncRef.current.isBlinking = true;
        lipSyncRef.current.blinkStartTime = time;
        lipSyncRef.current.blinkTime = time;
        lipSyncRef.current.nextBlink = Math.random() * 4000 + 1500; // Random blink interval
      }
      
      if (lipSyncRef.current.isBlinking) {
        const blinkDuration = 150;
        const blinkProgress = Math.min((time - lipSyncRef.current.blinkStartTime) / blinkDuration, 1);
        
        // Smooth blink animation (ease-in-out)
        let blinkValue;
        if (blinkProgress < 0.5) {
          // Closing phase
          blinkValue = Math.sin(blinkProgress * Math.PI);
        } else {
          // Opening phase
          blinkValue = Math.sin((1 - blinkProgress) * Math.PI);
        }
        
        lipSyncRef.current.blinkIntensity = blinkValue;
        foundEyeBlinkTarget.mesh.morphTargetInfluences[foundEyeBlinkTarget.index] = blinkValue;
        
        // End blink
        if (blinkProgress >= 1) {
          lipSyncRef.current.isBlinking = false;
          lipSyncRef.current.blinkIntensity = 0;
          foundEyeBlinkTarget.mesh.morphTargetInfluences[foundEyeBlinkTarget.index] = 0;
        }
      }
    }
  });

  return (
    <group>
      {/* Adjusted positioning to show more of the head/face instead of neck */}
      <primitive 
        object={scene} 
        scale={2.2} 
        position={[0, -1.8, 0]} 
        rotation={[0, 0, 0]} 
      />
      {debugInfo && import.meta.env.DEV && (
        <Html position={[0, 2.5, 0]}>
          <div className="text-xs text-white bg-black/80 p-3 rounded-lg max-w-xs backdrop-blur-sm border border-white/20">
            <div className="font-mono">{debugInfo}</div>
            {foundMouthTarget && (
              <div className="text-green-300 mt-2 font-semibold">
                Mouth: {foundMouthTarget.name} (#{foundMouthTarget.index})
              </div>
            )}
            {foundEyeBlinkTarget && (
              <div className="text-blue-300 mt-1 font-semibold">
                Blink: {foundEyeBlinkTarget.name} (#{foundEyeBlinkTarget.index})
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
// Enhanced Talking Avatar Component
// function TalkingAvatar({ text, isEnabled, onSpeechEnd }) {
//   const [isTalking, setIsTalking] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);
//   const utteranceRef = useRef(null);
//   const voicesLoadedRef = useRef(false);

//   useEffect(() => {
//     const loadVoices = () => {
//       const voices = window.speechSynthesis.getVoices();
//       if (voices.length > 0) {
//         voicesLoadedRef.current = true;
//       }
//     };
//     loadVoices();
//     window.speechSynthesis.onvoiceschanged = loadVoices;

//     if (!text || !isEnabled) {
//       setIsTalking(false);
//       return;
//     }

//     setIsLoading(true);
//     window.speechSynthesis.cancel();
//     const utterance = new SpeechSynthesisUtterance(text);
//     utteranceRef.current = utterance;

//     utterance.lang = "en-US";
//     utterance.rate = 0.85;
//     utterance.pitch = 1.05;
//     utterance.volume = 0.9;

//     if (voicesLoadedRef.current) {
//       const voices = window.speechSynthesis.getVoices();
//       const preferredVoice = voices.find(voice =>
//         voice.lang.startsWith('en') &&
//         (voice.name.includes('Google') || voice.name.includes('Microsoft') || 
//          voice.name.includes('Natural') || voice.name.includes('Premium'))
//       );
//       if (preferredVoice) {
//         utterance.voice = preferredVoice;
//       }
//     }

//     utterance.onstart = () => {
//       setIsTalking(true);
//       setIsLoading(false);
//       setIsPaused(false);
//     };

//     utterance.onend = () => {
//       setIsTalking(false);
//       setIsPaused(false);
//       onSpeechEnd?.();
//     };

//     utterance.onerror = (error) => {
//       console.error("Speech error:", error);
//       setIsTalking(false);
//       setIsLoading(false);
//       setIsPaused(false);
//     };

//     setTimeout(() => {
//       try {
//         window.speechSynthesis.speak(utterance);
//       } catch (error) {
//         console.error("Speech synthesis error:", error);
//         setIsTalking(false);
//         setIsLoading(false);
//       }
//     }, 300);

//     return () => {
//       window.speechSynthesis.cancel();
//     };
//   }, [text, isEnabled, onSpeechEnd]);

//   const stopSpeaking = () => {
//     window.speechSynthesis.cancel();
//     setIsTalking(false);
//     setIsLoading(false);
//     setIsPaused(false);
//   };

//   const pauseResumeSpeaking = () => {
//     if (isPaused) {
//       window.speechSynthesis.resume();
//       setIsPaused(false);
//     } else {
//       window.speechSynthesis.pause();
//       setIsPaused(true);
//     }
//   };

//   return (
//     <div className="relative w-full h-[45vh] bg-gradient-to-br from-slate-800 via-slate-700 to-indigo-900 rounded-2xl overflow-hidden mb-6 border border-slate-600/50 shadow-2xl">
//       {/* Ambient background effects */}
//       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
//       <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.3),transparent)] pointer-events-none" />
      
//       <Canvas
//         camera={{
//           position: [0, 1.8, 4.2],
//           fov: 35,
//           near: 0.1,
//           far: 1000
//         }}
//         gl={{ 
//           antialias: true, 
//           alpha: true,
//           powerPreference: "high-performance"
//         }}
//         shadows
//       >
//         <fog attach="fog" args={['#1e293b', 8, 15]} />
        
//         {/* Enhanced lighting setup */}
//         <ambientLight intensity={0.4} color="#f1f5f9" />
//         <directionalLight 
//           position={[3, 4, 5]} 
//           intensity={1.5} 
//           color="#ffffff"
//           castShadow
//           shadow-mapSize-width={2048}
//           shadow-mapSize-height={2048}
//         />
//         <directionalLight position={[-2, 3, 3]} intensity={0.6} color="#e2e8f0" />
//         <pointLight position={[0, 3, 3]} intensity={0.8} color="#fbbf24" />
//         <spotLight 
//           position={[0, 6, 4]} 
//           angle={0.4} 
//           penumbra={0.3} 
//           intensity={0.7} 
//           color="#a78bfa"
//           castShadow 
//         />
        
//         <AvatarModel isTalking={isTalking && !isPaused} />
//         <FaceCamera />
//       </Canvas>

//       {/* Enhanced status indicators */}
//       <div className="absolute top-6 left-6 space-y-3">
//         {import.meta.env.DEV && (
//           <div className="text-xs text-white bg-black/80 p-3 rounded-xl backdrop-blur-sm border border-white/20">
//             <div className="space-y-1 font-mono">
//               <div className="flex justify-between">
//                 <span>Talking:</span>
//                 <span className={isTalking ? 'text-green-400' : 'text-red-400'}>
//                   {isTalking.toString()}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Loading:</span>
//                 <span className={isLoading ? 'text-yellow-400' : 'text-gray-400'}>
//                   {isLoading.toString()}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Paused:</span>
//                 <span className={isPaused ? 'text-orange-400' : 'text-gray-400'}>
//                   {isPaused.toString()}
//                 </span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Enhanced control buttons */}
//       <div className="absolute top-6 right-6 flex items-center gap-3">
//         {isLoading && (
//           <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-purple-500/30">
//             <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
//             <span className="text-sm text-purple-300 font-medium">Preparing voice...</span>
//           </div>
//         )}

//         {isTalking && (
//           <div className="flex items-center gap-2">
//             <button
//               onClick={pauseResumeSpeaking}
//               className="flex items-center gap-2 bg-blue-600/80 hover:bg-blue-700/80 backdrop-blur-md px-4 py-2 rounded-full transition-all duration-300 border border-blue-400/30 shadow-lg hover:shadow-xl"
//               title={isPaused ? "Resume Speaking" : "Pause Speaking"}
//             >
//               {isPaused ? (
//                 <Play className="w-4 h-4 text-white" />
//               ) : (
//                 <Pause className="w-4 h-4 text-white" />
//               )}
//               <span className="text-sm text-white font-medium">
//                 {isPaused ? "Resume" : "Pause"}
//               </span>
//             </button>
            
//             <button
//               onClick={stopSpeaking}
//               className="flex items-center gap-2 bg-red-600/80 hover:bg-red-700/80 backdrop-blur-md px-4 py-2 rounded-full transition-all duration-300 border border-red-400/30 shadow-lg hover:shadow-xl"
//               title="Stop Speaking"
//             >
//               <VolumeX className="w-4 h-4 text-white" />
//               <span className="text-sm text-white font-medium">Stop</span>
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Enhanced speaking indicator */}
//       {(isTalking && !isPaused) && (
//         <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-emerald-600/20 backdrop-blur-md border border-emerald-500/40 px-4 py-3 rounded-full shadow-lg">
//           <div className="relative">
//             <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
//             <div className="absolute top-0 left-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
//           </div>
//           <span className="text-sm text-emerald-300 font-medium">AI Speaking...</span>
//           <div className="flex gap-1">
//             {[...Array(3)].map((_, i) => (
//               <div
//                 key={i}
//                 className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse"
//                 style={{
//                   animationDelay: `${i * 0.2}s`,
//                   animationDuration: '0.6s'
//                 }}
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {isPaused && (
//         <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-orange-600/20 backdrop-blur-md border border-orange-500/40 px-4 py-3 rounded-full shadow-lg">
//           <Pause className="w-4 h-4 text-orange-400" />
//           <span className="text-sm text-orange-300 font-medium">Speech Paused</span>
//         </div>
//       )}
//     </div>
//   );
// }

// function TalkingAvatar({ text, isEnabled, onSpeechEnd }) {
//   const [isTalking, setIsTalking] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);
//   const utteranceRef = useRef(null);
//   const voicesLoadedRef = useRef(false);

//   useEffect(() => {
//     const loadVoices = () => {
//       const voices = window.speechSynthesis.getVoices();
//       if (voices.length > 0) {
//         voicesLoadedRef.current = true;
//       }
//     };
//     loadVoices();
//     window.speechSynthesis.onvoiceschanged = loadVoices;

//     if (!text || !isEnabled) {
//       setIsTalking(false);
//       return;
//     }

//     setIsLoading(true);
//     window.speechSynthesis.cancel();
//     const utterance = new SpeechSynthesisUtterance(text);
//     utteranceRef.current = utterance;

//     utterance.lang = "en-US";
//     utterance.rate = 0.85;
//     utterance.pitch = 1.05;
//     utterance.volume = 0.9;

//     if (voicesLoadedRef.current) {
//       const voices = window.speechSynthesis.getVoices();
//       const preferredVoice = voices.find(voice =>
//         voice.lang.startsWith('en') &&
//         (voice.name.includes('Google') || voice.name.includes('Microsoft') || 
//          voice.name.includes('Natural') || voice.name.includes('Premium'))
//       );
//       if (preferredVoice) {
//         utterance.voice = preferredVoice;
//       }
//     }

//     utterance.onstart = () => {
//       setIsTalking(true);
//       setIsLoading(false);
//       setIsPaused(false);
//     };

//     utterance.onend = () => {
//       setIsTalking(false);
//       setIsPaused(false);
//       onSpeechEnd?.();
//     };

//     utterance.onerror = (error) => {
//       console.error("Speech error details:", {
//         error: error.error,
//         message: error.message,
//         utteranceText: text,
//         speaking: window.speechSynthesis.speaking,
//         pending: window.speechSynthesis.pending
//       });
//       setIsTalking(false);
//       setIsLoading(false);
//       setIsPaused(false);
//     };

//     try {
//       if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
//         window.speechSynthesis.speak(utterance);
//       } else {
//         console.warn("Speech already in progress, skipping...");
//       }
//     } catch (error) {
//       console.error("Speech synthesis error:", error);
//       setIsTalking(false);
//       setIsLoading(false);
//     }

//     return () => {
//       window.speechSynthesis.cancel();
//     };
//   }, [text, isEnabled, onSpeechEnd]);

//   const stopSpeaking = () => {
//     window.speechSynthesis.cancel();
//     setIsTalking(false);
//     setIsLoading(false);
//     setIsPaused(false);
//   };

//   const pauseResumeSpeaking = () => {
//     if (isPaused) {
//       window.speechSynthesis.resume();
//       setIsPaused(false);
//     } else {
//       window.speechSynthesis.pause();
//       setIsPaused(true);
//     }
//   };

//   return (
//     <div className="relative w-full h-[45vh] bg-gradient-to-br from-slate-800 via-slate-700 to-indigo-900 rounded-2xl overflow-hidden mb-6 border border-slate-600/50 shadow-2xl">
//       {/* Ambient background effects */}
//       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
//       <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.3),transparent)] pointer-events-none" />
      
//       <Canvas
//         camera={{
//           position: [0, 1.8, 4.2],
//           fov: 35,
//           near: 0.1,
//           far: 1000
//         }}
//         gl={{ 
//           antialias: true, 
//           alpha: true,
//           powerPreference: "high-performance"
//         }}
//         shadows
//       >
//         <fog attach="fog" args={['#1e293b', 8, 15]} />
        
//         {/* Enhanced lighting setup */}
//         <ambientLight intensity={0.4} color="#f1f5f9" />
//         <directionalLight 
//           position={[3, 4, 5]} 
//           intensity={1.5} 
//           color="#ffffff"
//           castShadow
//           shadow-mapSize-width={2048}
//           shadow-mapSize-height={2048}
//         />
//         <directionalLight position={[-2, 3, 3]} intensity={0.6} color="#e2e8f0" />
//         <pointLight position={[0, 3, 3]} intensity={0.8} color="#fbbf24" />
//         <spotLight 
//           position={[0, 6, 4]} 
//           angle={0.4} 
//           penumbra={0.3} 
//           intensity={0.7} 
//           color="#a78bfa"
//           castShadow 
//         />
        
//         <AvatarModel isTalking={isTalking && !isPaused} />
//         <FaceCamera />
//       </Canvas>

//       {/* Enhanced status indicators */}
//       <div className="absolute top-6 left-6 space-y-3">
//         {import.meta.env.DEV && (
//           <div className="text-xs text-white bg-black/80 p-3 rounded-xl backdrop-blur-sm border border-white/20">
//             <div className="space-y-1 font-mono">
//               <div className="flex justify-between">
//                 <span>Talking:</span>
//                 <span className={isTalking ? 'text-green-400' : 'text-red-400'}>
//                   {isTalking.toString()}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Loading:</span>
//                 <span className={isLoading ? 'text-yellow-400' : 'text-gray-400'}>
//                   {isLoading.toString()}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Paused:</span>
//                 <span className={isPaused ? 'text-orange-400' : 'text-gray-400'}>
//                   {isPaused.toString()}
//                 </span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Enhanced control buttons */}
//       <div className="absolute top-6 right-6 flex items-center gap-3">
//         {isLoading && (
//           <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-purple-500/30">
//             <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
//             <span className="text-sm text-purple-300 font-medium">Preparing voice...</span>
//           </div>
//         )}

//         {isTalking && (
//           <div className="flex items-center gap-2">
//             <button
//               onClick={pauseResumeSpeaking}
//               className="flex items-center gap-2 bg-blue-600/80 hover:bg-blue-700/80 backdrop-blur-md px-4 py-2 rounded-full transition-all duration-300 border border-blue-400/30 shadow-lg hover:shadow-xl"
//               title={isPaused ? "Resume Speaking" : "Pause Speaking"}
//             >
//               {isPaused ? (
//                 <Play className="w-4 h-4 text-white" />
//               ) : (
//                 <Pause className="w-4 h-4 text-white" />
//               )}
//               <span className="text-sm text-white font-medium">
//                 {isPaused ? "Resume" : "Pause"}
//               </span>
//             </button>
            
//             <button
//               onClick={stopSpeaking}
//               className="flex items-center gap-2 bg-red-600/80 hover:bg-red-700/80 backdrop-blur-md px-4 py-2 rounded-full transition-all duration-300 border border-red-400/30 shadow-lg hover:shadow-xl"
//               title="Stop Speaking"
//             >
//               <VolumeX className="w-4 h-4 text-white" />
//               <span className="text-sm text-white font-medium">Stop</span>
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Enhanced speaking indicator */}
//       {(isTalking && !isPaused) && (
//         <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-emerald-600/20 backdrop-blur-md border border-emerald-500/40 px-4 py-3 rounded-full shadow-lg">
//           <div className="relative">
//             <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
//             <div className="absolute top-0 left-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
//           </div>
//           <span className="text-sm text-emerald-300 font-medium">AI Speaking...</span>
//           <div className="flex gap-1">
//             {[...Array(3)].map((_, i) => (
//               <div
//                 key={i}
//                 className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse"
//                 style={{
//                   animationDelay: `${i * 0.2}s`,
//                   animationDuration: '0.6s'
//                 }}
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {isPaused && (
//         <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-orange-600/20 backdrop-blur-md border border-orange-500/40 px-4 py-3 rounded-full shadow-lg">
//           <Pause className="w-4 h-4 text-orange-400" />
//           <span className="text-sm text-orange-300 font-medium">Speech Paused</span>
//         </div>
//       )}
//     </div>
//   );
// }
// Enhanced Interview Session Component
// function InterviewSession() {
//   const { interviewId } = useParams();
//   const navigate = useNavigate();
//   const token = getAuthToken();

//   const [loading, setLoading] = useState(true);
//   const [sessionId, setSessionId] = useState(null);
//   const [currentQuestion, setCurrentQuestion] = useState(null);
//   const [answer, setAnswer] = useState("");
//   const [chatHistory, setChatHistory] = useState([]);
//   const [completed, setCompleted] = useState(false);
//   const [error, setError] = useState(null);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [endTime, setEndTime] = useState(null);
//   const [interviewActive, setInterviewActive] = useState(false);
//   const [speechEnabled, setSpeechEnabled] = useState(true);
//   const [questionSpoken, setQuestionSpoken] = useState(false);
//   const [isRecognizing, setIsRecognizing] = useState(false);
//   const [timeRemaining, setTimeRemaining] = useState(null);
//   const recognitionRef = useRef(null);

//   const hasInitialized = useRef(false);
//   const chatEndRef = useRef(null);
//   const [questionLoading, setQuestionLoading] = useState(false);
//   const API_URL = import.meta.env.VITE_API_URL;

//   // Enhanced Speech-to-Text Setup
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (SpeechRecognition) {
//       recognitionRef.current = new SpeechRecognition();
//       recognitionRef.current.lang = "en-US";
//       recognitionRef.current.interimResults = true;
//       recognitionRef.current.continuous = true;
//       recognitionRef.current.maxAlternatives = 3;

//       let finalTranscript = '';
//       recognitionRef.current.onresult = (event) => {
//         let interimTranscript = '';
        
//         for (let i = event.resultIndex; i < event.results.length; i++) {
//           const transcript = event.results[i][0].transcript;
//           if (event.results[i].isFinal) {
//             finalTranscript += transcript + ' ';
//           } else {
//             interimTranscript += transcript;
//           }
//         }
        
//         setAnswer(finalTranscript + interimTranscript);
//       };

//       recognitionRef.current.onerror = (error) => {
//         console.error("Speech recognition error:", error);
//         setIsRecognizing(false);
//       };

//       recognitionRef.current.onend = () => {
//         setIsRecognizing(false);
//       };
//     }

//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//       }
//     };
//   }, []);

//   // Timer for remaining interview time
//   useEffect(() => {
//     if (!endTime) return;
    
//     const updateTimer = () => {
//       const now = new Date();
//       const remaining = Math.max(0, endTime - now);
//       setTimeRemaining(remaining);
      
//       if (remaining <= 0) {
//         setCompleted(true);
//         setCurrentQuestion(null);
//       }
//     };
    
//     updateTimer();
//     const timer = setInterval(updateTimer, 1000);
//     return () => clearInterval(timer);
//   }, [endTime]);

//   const formatTime = (milliseconds) => {
//     const minutes = Math.floor(milliseconds / 60000);
//     const seconds = Math.floor((milliseconds % 60000) / 1000);
//     return `${minutes}:${seconds.toString().padStart(2, '0')}`;
//   };

//   const toggleSpeechRecognition = () => {
//     if (!recognitionRef.current) return;

//     if (isRecognizing) {
//       recognitionRef.current.stop();
//       setIsRecognizing(false);
//     } else {
//       try {
//         setAnswer(''); // Clear previous text
//         recognitionRef.current.start();
//         setIsRecognizing(true);
//       } catch (error) {
//         console.error("Failed to start speech recognition:", error);
//       }
//     }
//   };

//   // Existing useEffect hooks (unchanged functionality, but keeping them for completeness)
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chatHistory]);

//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//     if (hasInitialized.current) return;
//     hasInitialized.current = true;

//     const initSession = async () => {
//       try {
//         const interviewData = await fetchWithToken(
//           `${API_URL}/interview/get-all-interviews/`,
//           token
//         );
//         const currentInterview = interviewData.find(
//           (item) => item.id === parseInt(interviewId)
//         );

//         if (!currentInterview) {
//           setError("Interview not found.");
//           setLoading(false);
//           return;
//         }
        
//         const now = new Date();
//         const start = new Date(currentInterview.startTime);
//         const end = new Date(currentInterview.endTime);
//         setEndTime(end);
        
//         if (now < start) {
//           setError("Interview has not started yet.");
//           setLoading(false);
//           return;
//         }
//         if (now > end) {
//           setError("Interview time has ended.");
//           setLoading(false);
//           return;
//         }
        
//         setInterviewActive(true);
//         const data = await fetchWithToken(
//           `${API_URL}/interview/interview-session-initializer/${interviewId}/`,
//           token,
//           null,
//           "POST"
//         );
        
//         if (!data || !data.session_id) {
//           setError(data?.error || "Failed to start interview.");
//         } else {
//           setSessionId(data.session_id);
//           setCurrentQuestion(data.question);
//         }
//       } catch (err) {
//         setError("Error initializing session.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     initSession();
//   }, [interviewId, token, navigate]);

//   useEffect(() => {
//     if (completed && sessionId) {
//       navigate(`/dsa-interview-platform/${sessionId}`);
//     }
//   }, [completed, sessionId, navigate]);

//   useEffect(() => {
//     if (currentQuestion && !questionLoading) {
//       setQuestionSpoken(false);
//     }
//   }, [currentQuestion, questionLoading]);

//   const handleNext = async () => {
//     if (!answer.trim()) return;

//     setChatHistory((prev) => [...prev, { question: currentQuestion, answer }]);
//     setAnswer("");
//     setQuestionLoading(true);

//     try {
//       const data = await fetchWithToken(
//         `${API_URL}/interview/interview-session/${sessionId}/?answer=${encodeURIComponent(answer)}`,
//         token,
//         null,
//         "POST"
//       );

//       if (!data) {
//         setError("Error submitting answer.");
//         return;
//       }

//       if (data.completed) {
//         setCompleted(true);
//       } else {
//         setCurrentQuestion(data.current_question);
//       }
//     } catch (err) {
//       setError("Error submitting answer.");
//     } finally {
//       setQuestionLoading(false);
//     }
//   };

//   const handleEndInterview = async () => {
//     setCompleted(true);
//     try {
//       await fetchWithToken(
//         `${API_URL}/interview/interview-session/${sessionId}/complete`,
//         token,
//         null,
//         "POST"
//       );
//     } catch (err) {
//       console.error("Error completing interview:", err);
//     }
//     navigate(`/dsa-interview-platform/${sessionId}`);
//   };

//   const handleStartInterview = () => setShowWelcome(false);
//   const handleSpeechEnd = () => setQuestionSpoken(true);
//   const toggleSpeech = () => {
//     if (speechEnabled) {
//       window.speechSynthesis.cancel();
//     }
//     setSpeechEnabled(!speechEnabled);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//         <div className="text-center">
//           <Loader2 className="animate-spin w-16 h-16 text-purple-400 mx-auto mb-4" />
//           <p className="text-xl text-white">Initializing Interview...</p>
//           <p className="text-slate-400 mt-2">Please wait while we set up your session</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen text-white bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
//         <div className="bg-red-600/20 border border-red-500/30 p-8 rounded-2xl text-center max-w-md">
//           <div className="w-16 h-16 bg-red-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
//             <MessageCircle size={32} className="text-red-400" />
//           </div>
//           <h2 className="text-2xl font-bold text-red-400 mb-4">Interview Error</h2>
//           <p className="text-lg text-red-200 mb-6">{error}</p>
//           <button
//             onClick={() => navigate(-1)}
//             className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (showWelcome) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
//         <div className="bg-slate-800/80 backdrop-blur-md p-12 rounded-3xl border border-slate-600/50 shadow-2xl max-w-2xl w-full text-center">
//           <div className="relative mb-8">
//             <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6 shadow-2xl">
//               <MessageCircle size={64} className="text-white" />
//             </div>
//             <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full animate-pulse"></div>
//           </div>
          
//           <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
//             AI Interview Session
//           </h1>
          
//           <p className="text-slate-300 mb-8 text-xl leading-relaxed">
//             Welcome to your interactive interview session. You'll be speaking with an AI interviewer 
//             that will ask you questions and evaluate your responses in real-time.
//           </p>
          
//           <div className="space-y-4 mb-8">
//             <div className="flex items-center justify-center gap-3 text-slate-400">
//               <Clock size={20} />
//               <span>Expected Duration: 30-45 minutes</span>
//             </div>
//             <div className="flex items-center justify-center gap-3 text-slate-400">
//               <Mic size={20} />
//               <span>Voice recognition enabled</span>
//             </div>
//           </div>
          
//           <button
//             onClick={handleStartInterview}
//             className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-12 py-4 rounded-xl font-bold text-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
//           >
//             Begin Interview
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (completed) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center p-4">
//         <div className="bg-green-800/30 backdrop-blur-md border border-green-500/40 p-12 rounded-3xl shadow-2xl max-w-2xl w-full text-center">
//           <div className="relative mb-8">
//             <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6 shadow-2xl">
//               <MessageCircle size={64} className="text-white" />
//             </div>
//             <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-bounce">
//               <span className="text-xs">✓</span>
//             </div>
//           </div>
          
//           <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-6">
//             Interview Complete!
//           </h1>
          
//           <p className="text-green-200 text-xl mb-8">
//             Thank you for participating in the AI interview session. 
//             Your responses have been recorded and will be reviewed.
//           </p>
          
//           <div className="flex items-center justify-center gap-3 text-green-300 mb-8">
//             <Loader2 className="animate-spin w-6 h-6" />
//             <span className="text-lg">Redirecting to results...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
//       {/* Enhanced Header */}
//       <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50 shadow-xl">
//         <div className="px-6 py-4">
//           <div className="flex items-center justify-between">
//             {/* Left section */}
//             <div className="flex items-center gap-6">
//               <button
//                 onClick={() => navigate(-1)}
//                 className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 transition-all duration-200 shadow-lg hover:shadow-xl border border-slate-600/50"
//               >
//                 <ArrowLeft size={20} />
//               </button>
//               <div>
//                 <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
//                   AI Interview Session
//                 </h1>
//                 <p className="text-slate-400 text-sm">Question {chatHistory.length + 1}</p>
//               </div>
//             </div>

//             {/* Center section - Timer */}
//             {timeRemaining !== null && (
//               <div className="flex items-center gap-3 bg-slate-800/80 backdrop-blur-md px-6 py-3 rounded-xl border border-slate-600/50 shadow-lg">
//                 <Clock size={20} className="text-orange-400" />
//                 <div className="text-center">
//                   <div className="text-lg font-mono font-bold text-orange-300">
//                     {formatTime(timeRemaining)}
//                   </div>
//                   <div className="text-xs text-slate-400">Remaining</div>
//                 </div>
//               </div>
//             )}

//             {/* Right section - Controls */}
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={toggleSpeech}
//                 className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border ${
//                   speechEnabled
//                     ? "bg-green-600/20 border-green-500/40 text-green-300 hover:bg-green-600/30"
//                     : "bg-red-600/20 border-red-500/40 text-red-300 hover:bg-red-600/30"
//                 }`}
//               >
//                 {speechEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
//                 <span className="font-medium">{speechEnabled ? "Audio On" : "Audio Off"}</span>
//               </button>
              
//               <button
//                 onClick={toggleSpeechRecognition}
//                 className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border ${
//                   isRecognizing
//                     ? "bg-blue-600/20 border-blue-500/40 text-blue-300 hover:bg-blue-600/30"
//                     : "bg-slate-600/20 border-slate-500/40 text-slate-300 hover:bg-slate-600/30"
//                 }`}
//                 disabled={!recognitionRef.current}
//                 title={!recognitionRef.current ? "Speech recognition not supported" : ""}
//               >
//                 {isRecognizing ? <Mic size={18} /> : <MicOff size={18} />}
//                 <span className="font-medium">
//                   {isRecognizing ? "Listening..." : "Voice Input"}
//                 </span>
//                 {isRecognizing && (
//                   <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
//                 )}
//               </button>

//               <button
//                 onClick={handleEndInterview}
//                 className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 px-4 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-red-300"
//               >
//                 End Interview
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex h-[calc(100vh-100px)]">
//         {/* Enhanced Sidebar - Chat History */}
//         <div className="w-80 bg-slate-900/60 backdrop-blur-md border-r border-slate-700/50 flex flex-col shadow-2xl">
//           <div className="p-6 border-b border-slate-700/50">
//             <h2 className="text-2xl font-bold text-purple-300 flex items-center gap-3">
//               <MessageCircle size={24} /> 
//               <span>Interview History</span>
//             </h2>
//             <p className="text-slate-400 text-sm mt-1">
//               {chatHistory.length} question{chatHistory.length !== 1 ? 's' : ''} completed
//             </p>
//           </div>
          
//           <div className="flex-1 overflow-y-auto p-4 space-y-6">
//             {chatHistory.length === 0 ? (
//               <div className="text-center text-slate-400 mt-12">
//                 <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/30">
//                   <MessageCircle size={64} className="mx-auto mb-4 opacity-30" />
//                   <p className="text-lg font-medium">No Questions Yet</p>
//                   <p className="text-sm mt-2 text-slate-500">
//                     Your interview conversation will appear here as you progress
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               chatHistory.map((item, index) => (
//                 <div key={index} className="space-y-4">
//                   {/* Question */}
//                   <div className="flex gap-3">
//                     <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
//                       <MessageCircle size={18} className="text-white" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="bg-slate-800/60 backdrop-blur-sm p-4 rounded-xl border border-slate-700/30 shadow-lg">
//                         <div className="flex items-center gap-2 mb-2">
//                           <p className="text-purple-300 font-semibold text-sm">
//                             AI Interviewer
//                           </p>
//                           <span className="text-xs text-slate-500">Question {index + 1}</span>
//                         </div>
//                         <p className="text-slate-200 leading-relaxed">{item.question}</p>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Answer */}
//                   <div className="flex gap-3">
//                     <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
//                       <User size={18} className="text-white" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="bg-slate-700/60 backdrop-blur-sm p-4 rounded-xl border border-slate-600/30 shadow-lg">
//                         <p className="text-blue-300 font-semibold text-sm mb-2">
//                           Your Response
//                         </p>
//                         <p className="text-slate-200 leading-relaxed">{item.answer}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//             <div ref={chatEndRef} />
//           </div>
//         </div>

//         {/* Main Content Area */}
//         <div className="flex-1 flex flex-col">
//           <div className="flex-1 p-8 overflow-y-auto">
//             {questionLoading ? (
//               <div className="flex-1 flex justify-center items-center">
//                 <div className="text-center bg-slate-800/60 backdrop-blur-md p-12 rounded-2xl border border-slate-700/50 shadow-2xl">
//                   <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-6" />
//                   <h3 className="text-2xl font-bold text-purple-300 mb-3">Processing Response</h3>
//                   <p className="text-slate-300 text-lg mb-2">Analyzing your answer...</p>
//                   <p className="text-slate-400">Generating next question</p>
//                   <div className="mt-6 flex justify-center gap-2">
//                     {[...Array(3)].map((_, i) => (
//                       <div
//                         key={i}
//                         className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
//                         style={{ animationDelay: `${i * 0.3}s` }}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ) : currentQuestion ? (
//               <>
//                 <TalkingAvatar
//                   text={speechEnabled && !questionSpoken ? currentQuestion : ""}
//                   isEnabled={speechEnabled && !questionSpoken}
//                   onSpeechEnd={handleSpeechEnd}
//                 />
                
//                 <div className="flex-1 flex items-center justify-center">
//                   <div className="max-w-4xl w-full">
//                     <div className="bg-slate-800/80 backdrop-blur-lg p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
//                       {/* Question Header */}
//                       <div className="flex items-center gap-4 mb-8">
//                         <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
//                           <MessageCircle size={24} className="text-white" />
//                         </div>
//                         <div className="flex-1">
//                           <h3 className="text-2xl font-bold text-purple-300">
//                             Question {chatHistory.length + 1}
//                           </h3>
//                           <p className="text-slate-400">Take your time to provide a thoughtful response</p>
//                         </div>
//                         {speechEnabled && !questionSpoken && (
//                           <div className="flex items-center gap-3 text-green-400 bg-green-600/20 px-4 py-2 rounded-full border border-green-500/30">
//                             <Volume2 size={20} />
//                             <span className="font-medium">AI Speaking...</span>
//                           </div>
//                         )}
//                       </div>
                      
//                       {/* Question Text */}
//                       <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-600/30 mb-8">
//                         <p className="text-xl text-slate-100 leading-relaxed font-medium">
//                           {currentQuestion}
//                         </p>
//                       </div>
                      
//                       {/* Answer Input */}
//                       <div className="space-y-6">
//                         <div className="relative">
//                           <textarea
//                             value={answer}
//                             onChange={(e) => setAnswer(e.target.value)}
//                             className="w-full bg-slate-900/80 text-white p-6 rounded-2xl border border-slate-700 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 resize-none backdrop-blur-sm shadow-lg"
//                             rows="8"
//                             placeholder={`Type your answer here${recognitionRef.current ? ' or use voice input...' : '...'}`}
//                           />
//                           {isRecognizing && (
//                             <div className="absolute top-4 right-4 flex items-center gap-2 bg-blue-600/80 px-3 py-2 rounded-full">
//                               <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
//                               <span className="text-white text-sm font-medium">Listening</span>
//                             </div>
//                           )}
//                         </div>
                        
//                         {/* Answer Controls */}
//                         <div className="flex justify-between items-center">
//                           <div className="flex items-center gap-4">
//                             <div className="text-sm text-slate-400">
//                               <span className={answer.length > 500 ? 'text-green-400' : 'text-slate-400'}>
//                                 {answer.length}
//                               </span> characters
//                             </div>
//                             {answer.length > 100 && (
//                               <div className="text-sm text-green-400 flex items-center gap-1">
//                                 <span>✓</span> Good length
//                               </div>
//                             )}
//                           </div>
                          
//                           <div className="flex gap-4">
//                             <button
//                               onClick={() => setAnswer('')}
//                               disabled={!answer.trim()}
//                               className="bg-slate-600/50 hover:bg-slate-600/70 disabled:bg-slate-700/30 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl border border-slate-500/30"
//                             >
//                               Clear
//                             </button>
                            
//                             <button
//                               onClick={handleNext}
//                               disabled={!answer.trim()}
//                               className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed px-10 py-3 rounded-xl flex items-center gap-3 font-bold transition-all duration-200 shadow-lg hover:shadow-2xl transform hover:scale-105 disabled:transform-none border border-purple-500/30 disabled:border-slate-500/30"
//                             >
//                               <Send size={20} /> 
//                               Submit Answer
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             ) : null}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// function TalkingAvatar({ text, isEnabled, onSpeechEnd }) {
//   const [isTalking, setIsTalking] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);
//   const [currentText, setCurrentText] = useState('');
//   const utteranceRef = useRef(null);
//   const voicesLoadedRef = useRef(false);
//   const isProcessingRef = useRef(false); // Prevent multiple simultaneous processing

//   useEffect(() => {
//     const loadVoices = () => {
//       const voices = window.speechSynthesis.getVoices();
//       if (voices.length > 0) {
//         voicesLoadedRef.current = true;
//       }
//     };
//     loadVoices();
//     window.speechSynthesis.onvoiceschanged = loadVoices;
//   }, []);

//   useEffect(() => {
//     // If no text, not enabled, or already processing the same text, return
//     if (!text || !isEnabled || isProcessingRef.current || text === currentText) {
//       if (!text || !isEnabled) {
//         // Stop any current speech and reset states
//         window.speechSynthesis.cancel();
//         setIsTalking(false);
//         setIsLoading(false);
//         setIsPaused(false);
//         setCurrentText('');
//         isProcessingRef.current = false;
//       }
//       return;
//     }

//     // Mark as processing to prevent duplicate calls
//     isProcessingRef.current = true;
//     setCurrentText(text);
//     setIsLoading(true);

//     // Cancel any existing speech
//     window.speechSynthesis.cancel();
    
//     // Small delay to ensure cancellation is processed
//     const initSpeech = setTimeout(() => {
//       try {
//         const utterance = new SpeechSynthesisUtterance(text);
//         utteranceRef.current = utterance;

//         utterance.lang = "en-US";
//         utterance.rate = 0.85;
//         utterance.pitch = 1.05;
//         utterance.volume = 0.9;

//         if (voicesLoadedRef.current) {
//           const voices = window.speechSynthesis.getVoices();
//           const preferredVoice = voices.find(voice =>
//             voice.lang.startsWith('en') &&
//             (voice.name.includes('Google') || voice.name.includes('Microsoft') || 
//              voice.name.includes('Natural') || voice.name.includes('Premium'))
//           );
//           if (preferredVoice) {
//             utterance.voice = preferredVoice;
//           }
//         }

//         utterance.onstart = () => {
//           console.log('Speech started for text:', text.substring(0, 50) + '...');
//           setIsTalking(true);
//           setIsLoading(false);
//           setIsPaused(false);
//         };

//         utterance.onend = () => {
//           console.log('Speech ended for text:', text.substring(0, 50) + '...');
//           setIsTalking(false);
//           setIsPaused(false);
//           isProcessingRef.current = false;
//           onSpeechEnd?.();
//         };

//         utterance.onerror = (error) => {
//           console.error("Speech error details:", {
//             error: error.error,
//             message: error.message,
//             utteranceText: text.substring(0, 100),
//             speaking: window.speechSynthesis.speaking,
//             pending: window.speechSynthesis.pending
//           });
//           setIsTalking(false);
//           setIsLoading(false);
//           setIsPaused(false);
//           isProcessingRef.current = false;
//         };

//         // Double-check that we're not already speaking before starting
//         if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
//           console.log('Starting speech synthesis for:', text.substring(0, 50) + '...');
//           window.speechSynthesis.speak(utterance);
//         } else {
//           console.warn("Speech already in progress, cancelling and retrying...");
//           window.speechSynthesis.cancel();
//           // Retry after a short delay
//           setTimeout(() => {
//             if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
//               window.speechSynthesis.speak(utterance);
//             }
//           }, 100);
//         }
//       } catch (error) {
//         console.error("Speech synthesis error:", error);
//         setIsTalking(false);
//         setIsLoading(false);
//         isProcessingRef.current = false;
//       }
//     }, 100);

//     return () => {
//       clearTimeout(initSpeech);
//       // Only cancel if this is the current utterance
//       if (utteranceRef.current) {
//         window.speechSynthesis.cancel();
//       }
//       isProcessingRef.current = false;
//     };
//   }, [text, isEnabled, onSpeechEnd, currentText]);

//   const stopSpeaking = () => {
//     console.log('Manually stopping speech');
//     window.speechSynthesis.cancel();
//     setIsTalking(false);
//     setIsLoading(false);
//     setIsPaused(false);
//     setCurrentText('');
//     isProcessingRef.current = false;
//   };

//   const pauseResumeSpeaking = () => {
//     if (isPaused) {
//       console.log('Resuming speech');
//       window.speechSynthesis.resume();
//       setIsPaused(false);
//     } else {
//       console.log('Pausing speech');
//       window.speechSynthesis.pause();
//       setIsPaused(true);
//     }
//   };

//   return (
//     <div className="relative w-full h-[45vh] bg-gradient-to-br from-slate-800 via-slate-700 to-indigo-900 rounded-2xl overflow-hidden mb-6 border border-slate-600/50 shadow-2xl">
//       {/* Ambient background effects */}
//       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
//       <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.3),transparent)] pointer-events-none" />
      
//       <Canvas
//         camera={{
//           position: [0, 1.8, 4.2],
//           fov: 35,
//           near: 0.1,
//           far: 1000
//         }}
//         gl={{ 
//           antialias: true, 
//           alpha: true,
//           powerPreference: "high-performance"
//         }}
//         shadows
//       >
//         <fog attach="fog" args={['#1e293b', 8, 15]} />
        
//         {/* Enhanced lighting setup */}
//         <ambientLight intensity={0.4} color="#f1f5f9" />
//         <directionalLight 
//           position={[3, 4, 5]} 
//           intensity={1.5} 
//           color="#ffffff"
//           castShadow
//           shadow-mapSize-width={2048}
//           shadow-mapSize-height={2048}
//         />
//         <directionalLight position={[-2, 3, 3]} intensity={0.6} color="#e2e8f0" />
//         <pointLight position={[0, 3, 3]} intensity={0.8} color="#fbbf24" />
//         <spotLight 
//           position={[0, 6, 4]} 
//           angle={0.4} 
//           penumbra={0.3} 
//           intensity={0.7} 
//           color="#a78bfa"
//           castShadow 
//         />
        
//         <AvatarModel isTalking={isTalking && !isPaused} />
//         <FaceCamera />
//       </Canvas>

//       {/* Enhanced status indicators */}
//       <div className="absolute top-6 left-6 space-y-3">
//         {import.meta.env.DEV && (
//           <div className="text-xs text-white bg-black/80 p-3 rounded-xl backdrop-blur-sm border border-white/20">
//             <div className="space-y-1 font-mono">
//               <div className="flex justify-between">
//                 <span>Talking:</span>
//                 <span className={isTalking ? 'text-green-400' : 'text-red-400'}>
//                   {isTalking.toString()}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Loading:</span>
//                 <span className={isLoading ? 'text-yellow-400' : 'text-gray-400'}>
//                   {isLoading.toString()}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Paused:</span>
//                 <span className={isPaused ? 'text-orange-400' : 'text-gray-400'}>
//                   {isPaused.toString()}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Processing:</span>
//                 <span className={isProcessingRef.current ? 'text-blue-400' : 'text-gray-400'}>
//                   {isProcessingRef.current.toString()}
//                 </span>
//               </div>
//               <div className="text-purple-300 mt-2 truncate">
//                 Text: {currentText.substring(0, 30)}...
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Enhanced control buttons */}
//       <div className="absolute top-6 right-6 flex items-center gap-3">
//         {isLoading && (
//           <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-purple-500/30">
//             <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
//             <span className="text-sm text-purple-300 font-medium">Preparing voice...</span>
//           </div>
//         )}

//         {isTalking && (
//           <div className="flex items-center gap-2">
//             <button
//               onClick={pauseResumeSpeaking}
//               className="flex items-center gap-2 bg-blue-600/80 hover:bg-blue-700/80 backdrop-blur-md px-4 py-2 rounded-full transition-all duration-300 border border-blue-400/30 shadow-lg hover:shadow-xl"
//               title={isPaused ? "Resume Speaking" : "Pause Speaking"}
//             >
//               {isPaused ? (
//                 <Play className="w-4 h-4 text-white" />
//               ) : (
//                 <Pause className="w-4 h-4 text-white" />
//               )}
//               <span className="text-sm text-white font-medium">
//                 {isPaused ? "Resume" : "Pause"}
//               </span>
//             </button>
            
//             <button
//               onClick={stopSpeaking}
//               className="flex items-center gap-2 bg-red-600/80 hover:bg-red-700/80 backdrop-blur-md px-4 py-2 rounded-full transition-all duration-300 border border-red-400/30 shadow-lg hover:shadow-xl"
//               title="Stop Speaking"
//             >
//               <VolumeX className="w-4 h-4 text-white" />
//               <span className="text-sm text-white font-medium">Stop</span>
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Enhanced speaking indicator */}
//       {(isTalking && !isPaused) && (
//         <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-emerald-600/20 backdrop-blur-md border border-emerald-500/40 px-4 py-3 rounded-full shadow-lg">
//           <div className="relative">
//             <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
//             <div className="absolute top-0 left-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
//           </div>
//           <span className="text-sm text-emerald-300 font-medium">AI Speaking...</span>
//           <div className="flex gap-1">
//             {[...Array(3)].map((_, i) => (
//               <div
//                 key={i}
//                 className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse"
//                 style={{
//                   animationDelay: `${i * 0.2}s`,
//                   animationDuration: '0.6s'
//                 }}
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {isPaused && (
//         <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-orange-600/20 backdrop-blur-md border border-orange-500/40 px-4 py-3 rounded-full shadow-lg">
//           <Pause className="w-4 h-4 text-orange-400" />
//           <span className="text-sm text-orange-300 font-medium">Speech Paused</span>
//         </div>
//       )}
//     </div>
//   );
// }
function TalkingAvatar({ text, isEnabled, onSpeechEnd }) {
  const [isTalking, setIsTalking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const utteranceRef = useRef(null);
  const voicesLoadedRef = useRef(false);
  const isProcessingRef = useRef(false);
  const timeoutRef = useRef(null);

  // Load voices on component mount
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        voicesLoadedRef.current = true;
        console.log('Available voices:', voices.length);
      }
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    // Early return conditions
    if (!text || !isEnabled) {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
      setIsTalking(false);
      setIsLoading(false);
      setIsPaused(false);
      setCurrentText('');
      isProcessingRef.current = false;
      return;
    }

    // Avoid processing the same text multiple times
    if (isProcessingRef.current || text === currentText) {
      return;
    }

    console.log('Starting speech synthesis for new text:', text.substring(0, 50) + '...');
    
    // Mark as processing to prevent duplicate calls
    isProcessingRef.current = true;
    setCurrentText(text);
    setIsLoading(true);

    // Cancel any existing speech
    window.speechSynthesis.cancel();
    
    // Small delay to ensure cancellation is processed
    timeoutRef.current = setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;

        // Configure utterance
        utterance.lang = "en-US";
        utterance.rate = 0.85;
        utterance.pitch = 1.05;
        utterance.volume = 0.9;

        // Select preferred voice
        if (voicesLoadedRef.current) {
          const voices = window.speechSynthesis.getVoices();
          const preferredVoice = voices.find(voice =>
            voice.lang.startsWith('en') &&
            (voice.name.includes('Google') || 
             voice.name.includes('Microsoft') || 
             voice.name.includes('Natural') || 
             voice.name.includes('Premium'))
          ) || voices.find(voice => voice.lang.startsWith('en'));
          
          if (preferredVoice) {
            utterance.voice = preferredVoice;
            console.log('Selected voice:', preferredVoice.name);
          }
        }

        // Event handlers
        utterance.onstart = () => {
          console.log('Speech started successfully');
          setIsTalking(true);
          setIsLoading(false);
          setIsPaused(false);
        };

        utterance.onend = () => {
          console.log('Speech ended successfully');
          setIsTalking(false);
          setIsPaused(false);
          isProcessingRef.current = false;
          if (onSpeechEnd) {
            onSpeechEnd();
          }
        };

        utterance.onerror = (error) => {
          console.error("Speech synthesis error:", {
            error: error.error,
            message: error.message,
            textLength: text.length,
            speaking: window.speechSynthesis.speaking,
            pending: window.speechSynthesis.pending
          });
          
          setIsTalking(false);
          setIsLoading(false);
          setIsPaused(false);
          isProcessingRef.current = false;
          
          // Retry on certain errors
          if (error.error === 'interrupted' || error.error === 'canceled') {
            console.log('Retrying speech synthesis...');
            setTimeout(() => {
              if (!window.speechSynthesis.speaking) {
                window.speechSynthesis.speak(utterance);
              }
            }, 100);
          }
        };

        utterance.onpause = () => {
          setIsPaused(true);
        };

        utterance.onresume = () => {
          setIsPaused(false);
        };

        // Start speech synthesis
        if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
          console.log('Starting speech synthesis...');
          window.speechSynthesis.speak(utterance);
        } else {
          console.warn("Speech synthesis busy, cancelling and retrying...");
          window.speechSynthesis.cancel();
          setTimeout(() => {
            if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
              window.speechSynthesis.speak(utterance);
            } else {
              console.error('Failed to start speech synthesis - system busy');
              setIsLoading(false);
              isProcessingRef.current = false;
            }
          }, 100);
        }
      } catch (error) {
        console.error("Speech synthesis setup error:", error);
        setIsTalking(false);
        setIsLoading(false);
        isProcessingRef.current = false;
      }
    }, 100);

  }, [text, isEnabled, onSpeechEnd, currentText]);

  const stopSpeaking = useCallback(() => {
    console.log('Manually stopping speech');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    window.speechSynthesis.cancel();
    setIsTalking(false);
    setIsLoading(false);
    setIsPaused(false);
    setCurrentText('');
    isProcessingRef.current = false;
  }, []);

  const pauseResumeSpeaking = useCallback(() => {
    if (isPaused) {
      console.log('Resuming speech');
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else if (isTalking) {
      console.log('Pausing speech');
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isPaused, isTalking]);

  return (
    <div className="relative w-full h-[45vh] bg-gradient-to-br from-slate-800 via-slate-700 to-indigo-900 rounded-2xl overflow-hidden mb-6 border border-slate-600/50 shadow-2xl">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.3),transparent)] pointer-events-none" />
      
      <Canvas
        camera={{
          position: [0, 1.8, 4.2],
          fov: 35,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        shadows
      >
        <fog attach="fog" args={['#1e293b', 8, 15]} />
        
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.4} color="#f1f5f9" />
        <directionalLight 
          position={[3, 4, 5]} 
          intensity={1.5} 
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-2, 3, 3]} intensity={0.6} color="#e2e8f0" />
        <pointLight position={[0, 3, 3]} intensity={0.8} color="#fbbf24" />
        <spotLight 
          position={[0, 6, 4]} 
          angle={0.4} 
          penumbra={0.3} 
          intensity={0.7} 
          color="#a78bfa"
          castShadow 
        />
        
        <AvatarModel isTalking={isTalking && !isPaused} />
        {/* Assuming FaceCamera is defined elsewhere */}
        {/* <FaceCamera /> */}
      </Canvas>

      {/* Enhanced status indicators */}
      <div className="absolute top-6 left-6 space-y-3">
        {import.meta.env.DEV && (
          <div className="text-xs text-white bg-black/80 p-3 rounded-xl backdrop-blur-sm border border-white/20">
            <div className="space-y-1 font-mono">
              <div className="flex justify-between">
                <span>Talking:</span>
                <span className={isTalking ? 'text-green-400' : 'text-red-400'}>
                  {isTalking.toString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Loading:</span>
                <span className={isLoading ? 'text-yellow-400' : 'text-gray-400'}>
                  {isLoading.toString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Paused:</span>
                <span className={isPaused ? 'text-orange-400' : 'text-gray-400'}>
                  {isPaused.toString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Processing:</span>
                <span className={isProcessingRef.current ? 'text-blue-400' : 'text-gray-400'}>
                  {isProcessingRef.current.toString()}
                </span>
              </div>
              <div className="text-purple-300 mt-2 truncate">
                Text: {currentText.substring(0, 30)}{currentText.length > 30 ? '...' : ''}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced control buttons */}
      <div className="absolute top-6 right-6 flex items-center gap-3">
        {isLoading && (
          <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-purple-500/30">
            <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">Preparing voice...</span>
          </div>
        )}

        {isTalking && (
          <div className="flex items-center gap-2">
            <button
              onClick={pauseResumeSpeaking}
              className="flex items-center gap-2 bg-blue-600/80 hover:bg-blue-700/80 backdrop-blur-md px-4 py-2 rounded-full transition-all duration-300 border border-blue-400/30 shadow-lg hover:shadow-xl"
              title={isPaused ? "Resume Speaking" : "Pause Speaking"}
            >
              {isPaused ? (
                <Play className="w-4 h-4 text-white" />
              ) : (
                <Pause className="w-4 h-4 text-white" />
              )}
              <span className="text-sm text-white font-medium">
                {isPaused ? "Resume" : "Pause"}
              </span>
            </button>
            
            <button
              onClick={stopSpeaking}
              className="flex items-center gap-2 bg-red-600/80 hover:bg-red-700/80 backdrop-blur-md px-4 py-2 rounded-full transition-all duration-300 border border-red-400/30 shadow-lg hover:shadow-xl"
              title="Stop Speaking"
            >
              <VolumeX className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-medium">Stop</span>
            </button>
          </div>
        )}
      </div>

      {/* Enhanced speaking indicator */}
      {(isTalking && !isPaused) && (
        <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-emerald-600/20 backdrop-blur-md border border-emerald-500/40 px-4 py-3 rounded-full shadow-lg">
          <div className="relative">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <div className="absolute top-0 left-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
          </div>
          <span className="text-sm text-emerald-300 font-medium">AI Speaking...</span>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '0.6s'
                }}
              />
            ))}
          </div>
        </div>
      )}

      {isPaused && (
        <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-orange-600/20 backdrop-blur-md border border-orange-500/40 px-4 py-3 rounded-full shadow-lg">
          <Pause className="w-4 h-4 text-orange-400" />
          <span className="text-sm text-orange-300 font-medium">Speech Paused</span>
        </div>
      )}
    </div>
  );
}

// function InterviewSession() {
//   const { interviewId } = useParams();
//   const navigate = useNavigate();
//   const token = getAuthToken();

//   const [loading, setLoading] = useState(true);
//   const [sessionId, setSessionId] = useState(null);
//   const [currentQuestion, setCurrentQuestion] = useState(null);
//   const [answer, setAnswer] = useState("");
//   const [chatHistory, setChatHistory] = useState([]);
//   const [completed, setCompleted] = useState(false);
//   const [error, setError] = useState(null);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [endTime, setEndTime] = useState(null);
//   const [interviewActive, setInterviewActive] = useState(false);
//   const [speechEnabled, setSpeechEnabled] = useState(true);
//   const [questionSpoken, setQuestionSpoken] = useState(false);
//   const [isRecognizing, setIsRecognizing] = useState(false);
//   const [timeRemaining, setTimeRemaining] = useState(null);
//   const recognitionRef = useRef(null);

//   const hasInitialized = useRef(false);
//   const chatEndRef = useRef(null);
//   const [questionLoading, setQuestionLoading] = useState(false);
//   const API_URL = import.meta.env.VITE_API_URL;

//   // Enhanced Speech-to-Text Setup
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (SpeechRecognition) {
//       recognitionRef.current = new SpeechRecognition();
//       recognitionRef.current.lang = "en-US";
//       recognitionRef.current.interimResults = true;
//       recognitionRef.current.continuous = true;
//       recognitionRef.current.maxAlternatives = 3;

//       let finalTranscript = '';
//       recognitionRef.current.onresult = (event) => {
//         let interimTranscript = '';
        
//         for (let i = event.resultIndex; i < event.results.length; i++) {
//           const transcript = event.results[i][0].transcript;
//           if (event.results[i].isFinal) {
//             finalTranscript += transcript + ' ';
//           } else {
//             interimTranscript += transcript;
//           }
//         }
        
//         setAnswer(finalTranscript + interimTranscript);
//       };

//       recognitionRef.current.onerror = (error) => {
//         console.error("Speech recognition error:", error);
//         setIsRecognizing(false);
//         setError(`Speech recognition failed: ${error.error}`);
//       };

//       recognitionRef.current.onend = () => {
//         setIsRecognizing(false);
//       };
//     }

//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//       }
//     };
//   }, []);

//   // Timer for remaining interview time
//   useEffect(() => {
//     if (!endTime) return;
    
//     const updateTimer = () => {
//       const now = new Date();
//       const remaining = Math.max(0, endTime - now);
//       setTimeRemaining(remaining);
      
//       if (remaining <= 0) {
//         setCompleted(true);
//         setCurrentQuestion(null);
//       }
//     };
    
//     updateTimer();
//     const timer = setInterval(updateTimer, 1000);
//     return () => clearInterval(timer);
//   }, [endTime]);

//   const formatTime = (milliseconds) => {
//     const minutes = Math.floor(milliseconds / 60000);
//     const seconds = Math.floor((milliseconds % 60000) / 1000);
//     return `${minutes}:${seconds.toString().padStart(2, '0')}`;
//   };

//   const toggleSpeechRecognition = () => {
//     if (!recognitionRef.current) return;

//     if (isRecognizing) {
//       recognitionRef.current.stop();
//       setIsRecognizing(false);
//     } else {
//       try {
//         setAnswer(''); // Clear previous text
//         recognitionRef.current.start();
//         setIsRecognizing(true);
//       } catch (error) {
//         console.error("Failed to start speech recognition:", error);
//       }
//     }
//   };

//   // Existing useEffect hooks (unchanged functionality, but keeping them for completeness)
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chatHistory]);

//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//     if (hasInitialized.current) return;
//     hasInitialized.current = true;

//     const initSession = async () => {
//       try {
//         const interviewData = await fetchWithToken(
//           `${API_URL}/interview/get-all-interviews/`,
//           token
//         );
//         const currentInterview = interviewData.find(
//           (item) => item.id === parseInt(interviewId)
//         );

//         if (!currentInterview) {
//           setError("Interview not found.");
//           setLoading(false);
//           return;
//         }
        
//         const now = new Date();
//         const start = new Date(currentInterview.startTime);
//         const end = new Date(currentInterview.endTime);
//         setEndTime(end);
        
//         if (now < start) {
//           setError("Interview has not started yet.");
//           setLoading(false);
//           return;
//         }
//         if (now > end) {
//           setError("Interview time has ended.");
//           setLoading(false);
//           return;
//         }
        
//         setInterviewActive(true);
//         const data = await fetchWithToken(
//           `${API_URL}/interview/interview-session-initializer/${interviewId}/`,
//           token,
//           null,
//           "POST"
//         );
        
//         if (!data || !data.session_id) {
//           setError(data?.error || "Failed to start interview.");
//         } else {
//           setSessionId(data.session_id);
//           setCurrentQuestion(data.question);
//         }
//       } catch (err) {
//         setError("Error initializing session.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     initSession();
//   }, [interviewId, token, navigate]);

//   useEffect(() => {
//     if (completed && sessionId) {
//       navigate(`/dsa-interview-platform/${sessionId}`);
//     }
//   }, [completed, sessionId, navigate]);

//   useEffect(() => {
//     if (currentQuestion && !questionLoading) {
//       setQuestionSpoken(false);
//     }
//   }, [currentQuestion, questionLoading]);

//   const handleNext = async () => {
//     if (!answer.trim()) return;

//     setChatHistory((prev) => [...prev, { question: currentQuestion, answer }]);
//     setAnswer("");
//     setQuestionLoading(true);

//     try {
//       const timeout = setTimeout(() => {
//         setError("Request timed out. Please try again.");
//         setQuestionLoading(false);
//       }, 10000);

//       const data = await fetchWithToken(
//         `${API_URL}/interview/interview-session/${sessionId}/?answer=${encodeURIComponent(answer)}`,
//         token,
//         null,
//         "POST"
//       );

//       clearTimeout(timeout);

//       if (!data) {
//         setError("Error submitting answer.");
//         return;
//       }

//       if (data.completed) {
//         setCompleted(true);
//       } else {
//         setCurrentQuestion(data.current_question);
//       }
//     } catch (err) {
//       setError("Error submitting answer.");
//     } finally {
//       setQuestionLoading(false);
//     }
//   };

//   const handleEndInterview = async () => {
//     setCompleted(true);
//     try {
//       await fetchWithToken(
//         `${API_URL}/interview/interview-session/${sessionId}/complete`,
//         token,
//         null,
//         "POST"
//       );
//     } catch (err) {
//       console.error("Error completing interview:", err);
//     }
//     navigate(`/dsa-interview-platform/${sessionId}`);
//   };

//   const handleStartInterview = () => setShowWelcome(false);
//   const handleSpeechEnd = () => setQuestionSpoken(true);
//   const toggleSpeech = () => {
//     if (speechEnabled) {
//       window.speechSynthesis.cancel();
//     }
//     setSpeechEnabled(!speechEnabled);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//         <div className="text-center">
//           <Loader2 className="animate-spin w-16 h-16 text-purple-400 mx-auto mb-4" />
//           <p className="text-xl text-white">Initializing Interview...</p>
//           <p className="text-slate-400 mt-2">Please wait while we set up your session</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen text-white bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
//         <div className="bg-red-600/20 border border-red-500/30 p-8 rounded-2xl text-center max-w-md">
//           <div className="w-16 h-16 bg-red-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
//             <MessageCircle size={32} className="text-red-400" />
//           </div>
//           <h2 className="text-2xl font-bold text-red-400 mb-4">Interview Error</h2>
//           <p className="text-lg text-red-200 mb-6">{error}</p>
//           <button
//             onClick={() => navigate(-1)}
//             className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (showWelcome) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
//         <div className="bg-slate-800/80 backdrop-blur-md p-12 rounded-3xl border border-slate-600/50 shadow-2xl max-w-2xl w-full text-center">
//           <div className="relative mb-8">
//             <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6 shadow-2xl">
//               <MessageCircle size={64} className="text-white" />
//             </div>
//             <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full animate-pulse"></div>
//           </div>
          
//           <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
//             AI Interview Session
//           </h1>
          
//           <p className="text-slate-300 mb-8 text-xl leading-relaxed">
//             Welcome to your interactive interview session. You'll be speaking with an AI interviewer 
//             that will ask you questions and evaluate your responses in real-time.
//           </p>
          
//           <div className="space-y-4 mb-8">
//             <div className="flex items-center justify-center gap-3 text-slate-400">
//               <Clock size={20} />
//               <span>Expected Duration: 30-45 minutes</span>
//             </div>
//             <div className="flex items-center justify-center gap-3 text-slate-400">
//               <Mic size={20} />
//               <span>Voice recognition enabled</span>
//             </div>
//           </div>
          
//           <button
//             onClick={handleStartInterview}
//             className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-12 py-4 rounded-xl font-bold text-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
//           >
//             Begin Interview
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (completed) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center p-4">
//         <div className="bg-green-800/30 backdrop-blur-md border border-green-500/40 p-12 rounded-3xl shadow-2xl max-w-2xl w-full text-center">
//           <div className="relative mb-8">
//             <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6 shadow-2xl">
//               <MessageCircle size={64} className="text-white" />
//             </div>
//             <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-bounce">
//               <span className="text-xs">✓</span>
//             </div>
//           </div>
          
//           <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-6">
//             Interview Complete!
//           </h1>
          
//           <p className="text-green-200 text-xl mb-8">
//             Thank you for participating in the AI interview session. 
//             Your responses have been recorded and will be reviewed.
//           </p>
          
//           <div className="flex items-center justify-center gap-3 text-green-300 mb-8">
//             <Loader2 className="animate-spin w-6 h-6" />
//             <span className="text-lg">Redirecting to results...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
//       {/* Enhanced Header */}
//       <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50 shadow-xl">
//         <div className="px-6 py-4">
//           <div className="flex items-center justify-between">
//             {/* Left section */}
//             <div className="flex items-center gap-6">
//               <button
//                 onClick={() => navigate(-1)}
//                 className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 transition-all duration-200 shadow-lg hover:shadow-xl border border-slate-600/50"
//               >
//                 <ArrowLeft size={20} />
//               </button>
//               <div>
//                 <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
//                   AI Interview Session
//                 </h1>
//                 <p className="text-slate-400 text-sm">Question {chatHistory.length + 1}</p>
//               </div>
//             </div>

//             {/* Center section - Timer */}
//             {timeRemaining !== null && (
//               <div className="flex items-center gap-3 bg-slate-800/80 backdrop-blur-md px-6 py-3 rounded-xl border border-slate-600/50 shadow-lg">
//                 <Clock size={20} className="text-orange-400" />
//                 <div className="text-center">
//                   <div className="text-lg font-mono font-bold text-orange-300">
//                     {formatTime(timeRemaining)}
//                   </div>
//                   <div className="text-xs text-slate-400">Remaining</div>
//                 </div>
//               </div>
//             )}

//             {/* Right section - Controls */}
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={toggleSpeech}
//                 className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border ${
//                   speechEnabled
//                     ? "bg-green-600/20 border-green-500/40 text-green-300 hover:bg-green-600/30"
//                     : "bg-red-600/20 border-red-500/40 text-red-300 hover:bg-red-600/30"
//                 }`}
//               >
//                 {speechEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
//                 <span className="font-medium">{speechEnabled ? "Audio On" : "Audio Off"}</span>
//               </button>
              
//               <button
//                 onClick={toggleSpeechRecognition}
//                 className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border ${
//                   isRecognizing
//                     ? "bg-blue-600/20 border-blue-500/40 text-blue-300 hover:bg-blue-600/30"
//                     : "bg-slate-600/20 border-slate-500/40 text-slate-300 hover:bg-slate-600/30"
//                 }`}
//                 disabled={!recognitionRef.current}
//                 title={!recognitionRef.current ? "Speech recognition not supported" : ""}
//               >
//                 {isRecognizing ? <Mic size={18} /> : <MicOff size={18} />}
//                 <span className="font-medium">
//                   {isRecognizing ? "Listening..." : "Voice Input"}
//                 </span>
//                 {isRecognizing && (
//                   <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
//                 )}
//               </button>

//               <button
//                 onClick={handleEndInterview}
//                 className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 px-4 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-red-300"
//               >
//                 End Interview
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex h-[calc(100vh-100px)]">
//         {/* Enhanced Sidebar - Chat History */}
//         <div className="w-80 bg-slate-900/60 backdrop-blur-md border-r border-slate-700/50 flex flex-col shadow-2xl">
//           <div className="p-6 border-b border-slate-700/50">
//             <h2 className="text-2xl font-bold text-purple-300 flex items-center gap-3">
//               <MessageCircle size={24} /> 
//               <span>Interview History</span>
//             </h2>
//             <p className="text-slate-400 text-sm mt-1">
//               {chatHistory.length} question{chatHistory.length !== 1 ? 's' : ''} completed
//             </p>
//           </div>
          
//           <div className="flex-1 overflow-y-auto p-4 space-y-6">
//             {chatHistory.length === 0 ? (
//               <div className="text-center text-slate-400 mt-12">
//                 <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/30">
//                   <MessageCircle size={64} className="mx-auto mb-4 opacity-30" />
//                   <p className="text-lg font-medium">No Questions Yet</p>
//                   <p className="text-sm mt-2 text-slate-500">
//                     Your interview conversation will appear here as you progress
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               chatHistory.map((item, index) => (
//                 <div key={index} className="space-y-4">
//                   {/* Question */}
//                   <div className="flex gap-3">
//                     <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
//                       <MessageCircle size={18} className="text-white" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="bg-slate-800/60 backdrop-blur-sm p-4 rounded-xl border border-slate-700/30 shadow-lg">
//                         <div className="flex items-center gap-2 mb-2">
//                           <p className="text-purple-300 font-semibold text-sm">
//                             AI Interviewer
//                           </p>
//                           <span className="text-xs text-slate-500">Question {index + 1}</span>
//                         </div>
//                         <p className="text-slate-200 leading-relaxed">{item.question}</p>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Answer */}
//                   <div className="flex gap-3">
//                     <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
//                       <User size={18} className="text-white" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="bg-slate-700/60 backdrop-blur-sm p-4 rounded-xl border border-slate-600/30 shadow-lg">
//                         <p className="text-blue-300 font-semibold text-sm mb-2">
//                           Your Response
//                         </p>
//                         <p className="text-slate-200 leading-relaxed">{item.answer}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//             <div ref={chatEndRef} />
//           </div>
//         </div>

//         {/* Main Content Area */}
//         <div className="flex-1 flex flex-col">
//           <div className="flex-1 p-8 overflow-y-auto">
//             {questionLoading ? (
//               <div className="flex-1 flex justify-center items-center">
//                 <div className="text-center bg-slate-800/60 backdrop-blur-md p-12 rounded-2xl border border-slate-700/50 shadow-2xl">
//                   <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-6" />
//                   <h3 className="text-2xl font-bold text-purple-300 mb-3">Processing Response</h3>
//                   <p className="text-slate-300 text-lg mb-2">Analyzing your answer...</p>
//                   <p className="text-slate-400">Generating next question</p>
//                   <div className="mt-6 flex justify-center gap-2">
//                     {[...Array(3)].map((_, i) => (
//                       <div
//                         key={i}
//                         className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
//                         style={{ animationDelay: `${i * 0.3}s` }}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ) : currentQuestion ? (
//               <>
//                 <TalkingAvatar
//                   text={speechEnabled && !questionSpoken ? currentQuestion : ""}
//                   isEnabled={speechEnabled && !questionSpoken}
//                   onSpeechEnd={handleSpeechEnd}
//                 />
                
//                 <div className="flex-1 flex items-center justify-center">
//                   <div className="max-w-4xl w-full">
//                     <div className="bg-slate-800/80 backdrop-blur-lg p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
//                       {/* Question Header */}
//                       <div className="flex items-center gap-4 mb-8">
//                         <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
//                           <MessageCircle size={24} className="text-white" />
//                         </div>
//                         <div className="flex-1">
//                           <h3 className="text-2xl font-bold text-purple-300">
//                             Question {chatHistory.length + 1}
//                           </h3>
//                           <p className="text-slate-400">Take your time to provide a thoughtful response</p>
//                         </div>
//                         {speechEnabled && !questionSpoken && (
//                           <div className="flex items-center gap-3 text-green-400 bg-green-600/20 px-4 py-2 rounded-full border border-green-500/30">
//                             <Volume2 size={20} />
//                             <span className="font-medium">AI Speaking...</span>
//                           </div>
//                         )}
//                       </div>
                      
//                       {/* Question Text */}
//                       <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-600/30 mb-8">
//                         <p className="text-xl text-slate-100 leading-relaxed font-medium">
//                           {currentQuestion}
//                         </p>
//                       </div>
                      
//                       {/* Answer Input */}
//                       <div className="space-y-6">
//                         <div className="relative">
//                           <textarea
//                             value={answer}
//                             onChange={(e) => setAnswer(e.target.value)}
//                             className="w-full bg-slate-900/80 text-white p-6 rounded-2xl border border-slate-700 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 resize-none backdrop-blur-sm shadow-lg"
//                             rows="8"
//                             placeholder={`Type your answer here${recognitionRef.current ? ' or use voice input...' : '...'}`}
//                           />
//                           {isRecognizing && (
//                             <div className="absolute top-4 right-4 flex items-center gap-2 bg-blue-600/80 px-3 py-2 rounded-full">
//                               <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
//                               <span className="text-white text-sm font-medium">Listening</span>
//                             </div>
//                           )}
//                         </div>
                        
//                         {/* Answer Controls */}
//                         <div className="flex justify-between items-center">
//                           <div className="flex items-center gap-4">
//                             <div className="text-sm text-slate-400">
//                               <span className={answer.length > 500 ? 'text-green-400' : 'text-slate-400'}>
//                                 {answer.length}
//                               </span> characters
//                             </div>
//                             {answer.length > 100 && (
//                               <div className="text-sm text-green-400 flex items-center gap-1">
//                                 <span>✓</span> Good length
//                               </div>
//                             )}
//                           </div>
                          
//                           <div className="flex gap-4">
//                             <button
//                               onClick={() => setAnswer('')}
//                               disabled={!answer.trim()}
//                               className="bg-slate-600/50 hover:bg-slate-600/70 disabled:bg-slate-700/30 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl border border-slate-500/30"
//                             >
//                               Clear
//                             </button>
                            
//                             <button
//                               onClick={handleNext}
//                               disabled={!answer.trim()}
//                               className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed px-10 py-3 rounded-xl flex items-center gap-3 font-bold transition-all duration-200 shadow-lg hover:shadow-2xl transform hover:scale-105 disabled:transform-none border border-purple-500/30 disabled:border-slate-500/30"
//                             >
//                               <Send size={20} /> 
//                               Submit Answer
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             ) : null}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// function InterviewSession() {
//   const { interviewId } = useParams();
//   const navigate = useNavigate();
//   const token = getAuthToken();

//   const [loading, setLoading] = useState(true);
//   const [sessionId, setSessionId] = useState(null);
//   const [currentQuestion, setCurrentQuestion] = useState(null);
//   const [answer, setAnswer] = useState("");
//   const [chatHistory, setChatHistory] = useState([]);
//   const [completed, setCompleted] = useState(false);
//   const [error, setError] = useState(null);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [endTime, setEndTime] = useState(null);
//   const [interviewActive, setInterviewActive] = useState(false);
//   const [speechEnabled, setSpeechEnabled] = useState(true);
//   const [questionSpoken, setQuestionSpoken] = useState(false);
//   const [shouldSpeak, setShouldSpeak] = useState(false);
//   const [isRecognizing, setIsRecognizing] = useState(false);
//   const [timeRemaining, setTimeRemaining] = useState(null);
//   const recognitionRef = useRef(null);

//   const hasInitialized = useRef(false);
//   const chatEndRef = useRef(null);
//   const [questionLoading, setQuestionLoading] = useState(false);
//   const API_URL = import.meta.env.VITE_API_URL;

//   // Enhanced Speech-to-Text Setup
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (SpeechRecognition) {
//       recognitionRef.current = new SpeechRecognition();
//       recognitionRef.current.lang = "en-US";
//       recognitionRef.current.interimResults = true;
//       recognitionRef.current.continuous = false; // Changed to false for better control
//       recognitionRef.current.maxAlternatives = 1; // Reduced for better performance

//       let finalTranscript = '';
      
//       recognitionRef.current.onresult = (event) => {
//         let interimTranscript = '';
        
//         for (let i = event.resultIndex; i < event.results.length; i++) {
//           const transcript = event.results[i][0].transcript;
//           if (event.results[i].isFinal) {
//             finalTranscript += transcript + ' ';
//             setAnswer(prevAnswer => prevAnswer + transcript + ' ');
//           } else {
//             interimTranscript += transcript;
//           }
//         }
        
//         // Only update with interim results if needed
//         if (interimTranscript) {
//           setAnswer(prevAnswer => {
//             const baseAnswer = prevAnswer.replace(/\s*\[interim\].*$/, '');
//             return baseAnswer + ' [interim] ' + interimTranscript;
//           });
//         }
//       };

//       recognitionRef.current.onerror = (error) => {
//         console.error("Speech recognition error:", error);
//         setIsRecognizing(false);
        
//         // Handle specific errors
//         if (error.error === 'not-allowed') {
//           setError('Microphone access denied. Please allow microphone access and try again.');
//         } else if (error.error === 'no-speech') {
//           // Don't show error for no-speech, just stop recognition
//           console.log('No speech detected');
//         } else {
//           setError(`Speech recognition failed: ${error.error}`);
//         }
//       };

//       recognitionRef.current.onend = () => {
//         setIsRecognizing(false);
//         // Clean up interim results
//         setAnswer(prevAnswer => prevAnswer.replace(/\s*\[interim\].*$/, ''));
//       };
//     }

//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.abort();
//         recognitionRef.current = null;
//       }
//     };
//   }, []);
//   // Timer for remaining interview time
//   useEffect(() => {
//     if (!endTime) return;
    
//     const updateTimer = () => {
//       const now = new Date();
//       const remaining = Math.max(0, endTime - now);
//       setTimeRemaining(remaining);
      
//       if (remaining <= 0) {
//         setCompleted(true);
//         setCurrentQuestion(null);
//       }
//     };
    
//     updateTimer();
//     const timer = setInterval(updateTimer, 1000);
//     return () => clearInterval(timer);
//   }, [endTime]);

//   // Updated question handling
//   useEffect(() => {
//     if (currentQuestion && !questionLoading) {
//       setQuestionSpoken(false);
//       setShouldSpeak(false);
      
//       // Small delay to ensure component is ready
//       const timer = setTimeout(() => {
//         setShouldSpeak(speechEnabled);
//       }, 300);
      
//       return () => clearTimeout(timer);
//     }
//   }, [currentQuestion, questionLoading, speechEnabled]);

//   const formatTime = (milliseconds) => {
//     const minutes = Math.floor(milliseconds / 60000);
//     const seconds = Math.floor((milliseconds % 60000) / 1000);
//     return `${minutes}:${seconds.toString().padStart(2, '0')}`;
//   };

//   const toggleSpeechRecognition = useCallback(() => {
//     if (!recognitionRef.current) {
//       setError('Speech recognition not supported in this browser');
//       return;
//     }

//     if (isRecognizing) {
//       recognitionRef.current.stop();
//       setIsRecognizing(false);
//     } else {
//       try {
//         // Clean up any interim results
//         setAnswer(prevAnswer => prevAnswer.replace(/\s*\[interim\].*$/, ''));
//         recognitionRef.current.start();
//         setIsRecognizing(true);
//         setError(null); // Clear any previous errors
//       } catch (error) {
//         console.error("Failed to start speech recognition:", error);
//         setError('Failed to start voice input. Please try again.');
//       }
//     }
//   }, [isRecognizing]);

//   // Existing useEffect hooks
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chatHistory]);

//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//     if (hasInitialized.current) return;
//     hasInitialized.current = true;

//     const initSession = async () => {
//       try {
//         const interviewData = await fetchWithToken(
//           `${API_URL}/interview/get-all-interviews/`,
//           token
//         );
//         const currentInterview = interviewData.find(
//           (item) => item.id === parseInt(interviewId)
//         );

//         if (!currentInterview) {
//           setError("Interview not found.");
//           setLoading(false);
//           return;
//         }
        
//         const now = new Date();
//         const start = new Date(currentInterview.startTime);
//         const end = new Date(currentInterview.endTime);
//         setEndTime(end);
        
//         if (now < start) {
//           setError("Interview has not started yet.");
//           setLoading(false);
//           return;
//         }
//         if (now > end) {
//           setError("Interview time has ended.");
//           setLoading(false);
//           return;
//         }
        
//         setInterviewActive(true);
//         const data = await fetchWithToken(
//           `${API_URL}/interview/interview-session-initializer/${interviewId}/`,
//           token,
//           null,
//           "POST"
//         );
        
//         if (!data || !data.session_id) {
//           setError(data?.error || "Failed to start interview.");
//         } else {
//           setSessionId(data.session_id);
//           setCurrentQuestion(data.question);
//         }
//       } catch (err) {
//         setError("Error initializing session.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     initSession();
//   }, [interviewId, token, navigate]);

//   useEffect(() => {
//     if (completed && sessionId) {
//       navigate(`/dsa-interview-platform/${sessionId}`);
//     }
//   }, [completed, sessionId, navigate]);

//   // Updated speech end handler with useCallback
//   const handleSpeechEnd = useCallback(() => {
//     setQuestionSpoken(true);
//     setShouldSpeak(false);
//     console.log('Question speech ended');
//   }, []);


//   // Updated toggle speech function
//   const toggleSpeech = () => {
//     if (speechEnabled) {
//       window.speechSynthesis.cancel();
//       setShouldSpeak(false);
//     }
//     setSpeechEnabled(!speechEnabled);
    
//     // If enabling speech and there's a current question that hasn't been spoken
//     if (!speechEnabled && currentQuestion && !questionSpoken) {
//       setTimeout(() => {
//         setShouldSpeak(true);
//       }, 100);
//     }
//   };

//   const handleNext = useCallback(async () => {
//     const trimmedAnswer = answer.replace(/\s*\[interim\].*$/, '').trim();
//     if (!trimmedAnswer) {
//       setError('Please provide an answer before continuing.');
//       return;
//     }

//     // Stop any ongoing speech recognition
//     if (isRecognizing) {
//       recognitionRef.current?.stop();
//       setIsRecognizing(false);
//     }

//     setChatHistory((prev) => [...prev, { question: currentQuestion, answer: trimmedAnswer }]);
//     setAnswer("");
//     setQuestionLoading(true);
//     setError(null);

//     try {
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => {
//         controller.abort();
//         setError("Request timed out. Please try again.");
//         setQuestionLoading(false);
//       }, 15000); // Increased timeout

//       const data = await fetchWithToken(
//         `${API_URL}/interview/interview-session/${sessionId}/?answer=${encodeURIComponent(trimmedAnswer)}`,
//         token,
//         { signal: controller.signal },
//         "POST"
//       );

//       clearTimeout(timeoutId);

//       if (!data) {
//         throw new Error("No response received");
//       }

//       if (data.completed) {
//         setCompleted(true);
//       } else if (data.current_question) {
//         setCurrentQuestion(data.current_question);
//       } else {
//         throw new Error("Invalid response format");
//       }
//     } catch (err) {
//       console.error("Error submitting answer:", err);
//       if (err.name === 'AbortError') {
//         setError("Request was cancelled. Please try again.");
//       } else {
//         setError("Error submitting answer. Please check your connection and try again.");
//       }
//     } finally {
//       setQuestionLoading(false);
//     }
//   }, [answer, currentQuestion, sessionId, token, isRecognizing]);


//   const handleEndInterview = async () => {
//     setCompleted(true);
//     try {
//       await fetchWithToken(
//         `${API_URL}/interview/interview-session/${sessionId}/complete`,
//         token,
//         null,
//         "POST"
//       );
//     } catch (err) {
//       console.error("Error completing interview:", err);
//     }
//     navigate(`/dsa-interview-platform/${sessionId}`);
//   };

//   const handleStartInterview = () => setShowWelcome(false);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//         <div className="text-center">
//           <Loader2 className="animate-spin w-16 h-16 text-purple-400 mx-auto mb-4" />
//           <p className="text-xl text-white">Initializing Interview...</p>
//           <p className="text-slate-400 mt-2">Please wait while we set up your session</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen text-white bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
//         <div className="bg-red-600/20 border border-red-500/30 p-8 rounded-2xl text-center max-w-md">
//           <div className="w-16 h-16 bg-red-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
//             <MessageCircle size={32} className="text-red-400" />
//           </div>
//           <h2 className="text-2xl font-bold text-red-400 mb-4">Interview Error</h2>
//           <p className="text-lg text-red-200 mb-6">{error}</p>
//           <button
//             onClick={() => navigate(-1)}
//             className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (showWelcome) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
//         <div className="bg-slate-800/80 backdrop-blur-md p-12 rounded-3xl border border-slate-600/50 shadow-2xl max-w-2xl w-full text-center">
//           <div className="relative mb-8">
//             <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6 shadow-2xl">
//               <MessageCircle size={64} className="text-white" />
//             </div>
//             <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full animate-pulse"></div>
//           </div>
          
//           <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
//             AI Interview Session
//           </h1>
          
//           <p className="text-slate-300 mb-8 text-xl leading-relaxed">
//             Welcome to your interactive interview session. You'll be speaking with an AI interviewer 
//             that will ask you questions and evaluate your responses in real-time.
//           </p>
          
//           <div className="space-y-4 mb-8">
//             <div className="flex items-center justify-center gap-3 text-slate-400">
//               <Clock size={20} />
//               <span>Expected Duration: 30-45 minutes</span>
//             </div>
//             <div className="flex items-center justify-center gap-3 text-slate-400">
//               <Mic size={20} />
//               <span>Voice recognition enabled</span>
//             </div>
//           </div>
          
//           <button
//             onClick={handleStartInterview}
//             className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-12 py-4 rounded-xl font-bold text-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
//           >
//             Begin Interview
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (completed) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center p-4">
//         <div className="bg-green-800/30 backdrop-blur-md border border-green-500/40 p-12 rounded-3xl shadow-2xl max-w-2xl w-full text-center">
//           <div className="relative mb-8">
//             <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6 shadow-2xl">
//               <MessageCircle size={64} className="text-white" />
//             </div>
//             <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-bounce">
//               <span className="text-xs">✓</span>
//             </div>
//           </div>
          
//           <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-6">
//             Interview Complete!
//           </h1>
          
//           <p className="text-green-200 text-xl mb-8">
//             Thank you for participating in the AI interview session. 
//             Your responses have been recorded and will be reviewed.
//           </p>
          
//           <div className="flex items-center justify-center gap-3 text-green-300 mb-8">
//             <Loader2 className="animate-spin w-6 h-6" />
//             <span className="text-lg">Redirecting to results...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
//       {/* Enhanced Header */}
//       <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50 shadow-xl">
//         <div className="px-6 py-4">
//           <div className="flex items-center justify-between">
//             {/* Left section */}
//             <div className="flex items-center gap-6">
//               <button
//                 onClick={() => navigate(-1)}
//                 className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 transition-all duration-200 shadow-lg hover:shadow-xl border border-slate-600/50"
//               >
//                 <ArrowLeft size={20} />
//               </button>
//               <div>
//                 <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
//                   AI Interview Session
//                 </h1>
//                 <p className="text-slate-400 text-sm">Question {chatHistory.length + 1}</p>
//               </div>
//             </div>

//             {/* Center section - Timer */}
//             {timeRemaining !== null && (
//               <div className="flex items-center gap-3 bg-slate-800/80 backdrop-blur-md px-6 py-3 rounded-xl border border-slate-600/50 shadow-lg">
//                 <Clock size={20} className="text-orange-400" />
//                 <div className="text-center">
//                   <div className="text-lg font-mono font-bold text-orange-300">
//                     {formatTime(timeRemaining)}
//                   </div>
//                   <div className="text-xs text-slate-400">Remaining</div>
//                 </div>
//               </div>
//             )}

//             {/* Right section - Controls */}
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={toggleSpeech}
//                 className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border ${
//                   speechEnabled
//                     ? "bg-green-600/20 border-green-500/40 text-green-300 hover:bg-green-600/30"
//                     : "bg-red-600/20 border-red-500/40 text-red-300 hover:bg-red-600/30"
//                 }`}
//               >
//                 {speechEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
//                 <span className="font-medium">{speechEnabled ? "Audio On" : "Audio Off"}</span>
//               </button>
              
//               <button
//                 onClick={toggleSpeechRecognition}
//                 className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border ${
//                   isRecognizing
//                     ? "bg-blue-600/20 border-blue-500/40 text-blue-300 hover:bg-blue-600/30"
//                     : "bg-slate-600/20 border-slate-500/40 text-slate-300 hover:bg-slate-600/30"
//                 }`}
//                 disabled={!recognitionRef.current}
//                 title={!recognitionRef.current ? "Speech recognition not supported" : ""}
//               >
//                 {isRecognizing ? <Mic size={18} /> : <MicOff size={18} />}
//                 <span className="font-medium">
//                   {isRecognizing ? "Listening..." : "Voice Input"}
//                 </span>
//                 {isRecognizing && (
//                   <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
//                 )}
//               </button>

//               <button
//                 onClick={handleEndInterview}
//                 className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 px-4 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-red-300"
//               >
//                 End Interview
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex h-[calc(100vh-100px)]">
//         {/* Enhanced Sidebar - Chat History */}
//         <div className="w-80 bg-slate-900/60 backdrop-blur-md border-r border-slate-700/50 flex flex-col shadow-2xl">
//           <div className="p-6 border-b border-slate-700/50">
//             <h2 className="text-2xl font-bold text-purple-300 flex items-center gap-3">
//               <MessageCircle size={24} /> 
//               <span>Interview History</span>
//             </h2>
//             <p className="text-slate-400 text-sm mt-1">
//               {chatHistory.length} question{chatHistory.length !== 1 ? 's' : ''} completed
//             </p>
//           </div>
          
//           <div className="flex-1 overflow-y-auto p-4 space-y-6">
//             {chatHistory.length === 0 ? (
//               <div className="text-center text-slate-400 mt-12">
//                 <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/30">
//                   <MessageCircle size={64} className="mx-auto mb-4 opacity-30" />
//                   <p className="text-lg font-medium">No Questions Yet</p>
//                   <p className="text-sm mt-2 text-slate-500">
//                     Your interview conversation will appear here as you progress
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               chatHistory.map((item, index) => (
//                 <div key={index} className="space-y-4">
//                   {/* Question */}
//                   <div className="flex gap-3">
//                     <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
//                       <MessageCircle size={18} className="text-white" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="bg-slate-800/60 backdrop-blur-sm p-4 rounded-xl border border-slate-700/30 shadow-lg">
//                         <div className="flex items-center gap-2 mb-2">
//                           <p className="text-purple-300 font-semibold text-sm">
//                             AI Interviewer
//                           </p>
//                           <span className="text-xs text-slate-500">Question {index + 1}</span>
//                         </div>
//                         <p className="text-slate-200 leading-relaxed">{item.question}</p>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Answer */}
//                   <div className="flex gap-3">
//                     <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
//                       <User size={18} className="text-white" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="bg-slate-700/60 backdrop-blur-sm p-4 rounded-xl border border-slate-600/30 shadow-lg">
//                         <p className="text-blue-300 font-semibold text-sm mb-2">
//                           Your Response
//                         </p>
//                         <p className="text-slate-200 leading-relaxed">{item.answer}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//             <div ref={chatEndRef} />
//           </div>
//         </div>

//         {/* Main Content Area */}
//         <div className="flex-1 flex flex-col">
//           <div className="flex-1 p-8 overflow-y-auto">
//             {questionLoading ? (
//               <div className="flex-1 flex justify-center items-center">
//                 <div className="text-center bg-slate-800/60 backdrop-blur-md p-12 rounded-2xl border border-slate-700/50 shadow-2xl">
//                   <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-6" />
//                   <h3 className="text-2xl font-bold text-purple-300 mb-3">Processing Response</h3>
//                   <p className="text-slate-300 text-lg mb-2">Analyzing your answer...</p>
//                   <p className="text-slate-400">Generating next question</p>
//                   <div className="mt-6 flex justify-center gap-2">
//                     {[...Array(3)].map((_, i) => (
//                       <div
//                         key={i}
//                         className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
//                         style={{ animationDelay: `${i * 0.3}s` }}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ) : currentQuestion ? (
//               <>
//                 <TalkingAvatar
//                   text={shouldSpeak && !questionSpoken ? currentQuestion : ""}
//                   isEnabled={shouldSpeak && !questionSpoken}
//                   onSpeechEnd={handleSpeechEnd}
//                 />
                
//                 <div className="flex-1 flex items-center justify-center">
//                   <div className="max-w-4xl w-full">
//                     <div className="bg-slate-800/80 backdrop-blur-lg p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
//                       {/* Question Header */}
//                       <div className="flex items-center gap-4 mb-8">
//                         <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
//                           <MessageCircle size={24} className="text-white" />
//                         </div>
//                         <div className="flex-1">
//                           <h3 className="text-2xl font-bold text-purple-300">
//                             Question {chatHistory.length + 1}
//                           </h3>
//                           <p className="text-slate-400">Take your time to provide a thoughtful response</p>
//                         </div>
//                         {shouldSpeak && !questionSpoken && (
//                           <div className="flex items-center gap-3 text-green-400 bg-green-600/20 px-4 py-2 rounded-full border border-green-500/30">
//                             <Volume2 size={20} />
//                             <span className="font-medium">AI Speaking...</span>
//                           </div>
//                         )}
//                       </div>
                      
//                       {/* Question Text */}
//                       <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-600/30 mb-8">
//                         <p className="text-xl text-slate-100 leading-relaxed font-medium">
//                           {currentQuestion}
//                         </p>
//                       </div>
                      
//                       {/* Answer Input */}
//                       <div className="space-y-6">
//                         <div className="relative">
//                           <textarea
//                             value={answer}
//                             onChange={(e) => setAnswer(e.target.value)}
//                             className="w-full bg-slate-900/80 text-white p-6 rounded-2xl border border-slate-700 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 resize-none backdrop-blur-sm shadow-lg"
//                             rows="8"
//                             placeholder={`Type your answer here${recognitionRef.current ? ' or use voice input...' : '...'}`}
//                           />
//                           {isRecognizing && (
//                             <div className="absolute top-4 right-4 flex items-center gap-2 bg-blue-600/80 px-3 py-2 rounded-full">
//                               <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
//                               <span className="text-white text-sm font-medium">Listening</span>
//                             </div>
//                           )}
//                         </div>
                        
//                         {/* Answer Controls */}
//                         <div className="flex justify-between items-center">
//                           <div className="flex items-center gap-4">
//                             <div className="text-sm text-slate-400">
//                               <span className={answer.length > 500 ? 'text-green-400' : 'text-slate-400'}>
//                                 {answer.length}
//                               </span> characters
//                             </div>
//                             {answer.length > 100 && (
//                               <div className="text-sm text-green-400 flex items-center gap-1">
//                                 <span>✓</span> Good length
//                               </div>
//                             )}
//                           </div>
                          
//                           <div className="flex gap-4">
//                             <button
//                               onClick={() => setAnswer('')}
//                               disabled={!answer.trim()}
//                               className="bg-slate-600/50 hover:bg-slate-600/70 disabled:bg-slate-700/30 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl border border-slate-500/30"
//                             >
//                               Clear
//                             </button>
                            
//                             <button
//                               onClick={handleNext}
//                               disabled={!answer.trim()}
//                               className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed px-10 py-3 rounded-xl flex items-center gap-3 font-bold transition-all duration-200 shadow-lg hover:shadow-2xl transform hover:scale-105 disabled:transform-none border border-purple-500/30 disabled:border-slate-500/30"
//                             >
//                               <Send size={20} /> 
//                               Submit Answer
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             ) : null}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
function InterviewSession() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const token = getAuthToken();

  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [endTime, setEndTime] = useState(null);
  const [interviewActive, setInterviewActive] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [questionSpoken, setQuestionSpoken] = useState(false);
  const [shouldSpeak, setShouldSpeak] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const recognitionRef = useRef(null);

  const hasInitialized = useRef(false);
  const chatEndRef = useRef(null);
  const [questionLoading, setQuestionLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  // Enhanced Speech-to-Text Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.interimResults = true;
      recognitionRef.current.continuous = false;
      recognitionRef.current.maxAlternatives = 1;

      let finalTranscript = '';
      
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
            setAnswer(prevAnswer => prevAnswer + transcript + ' ');
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (interimTranscript) {
          setAnswer(prevAnswer => {
            const baseAnswer = prevAnswer.replace(/\s*\[interim\].*$/, '');
            return baseAnswer + ' [interim] ' + interimTranscript;
          });
        }
      };

      recognitionRef.current.onerror = (error) => {
        console.error("Speech recognition error:", error);
        setIsRecognizing(false);
        
        if (error.error === 'not-allowed') {
          setError('Microphone access denied. Please allow microphone access and try again.');
        } else if (error.error === 'no-speech') {
          console.log('No speech detected');
        } else {
          setError(`Speech recognition failed: ${error.error}`);
        }
      };

      recognitionRef.current.onend = () => {
        setIsRecognizing(false);
        setAnswer(prevAnswer => prevAnswer.replace(/\s*\[interim\].*$/, ''));
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, []);

  // Timer for remaining interview time
  useEffect(() => {
    if (!endTime) return;
    
    const updateTimer = () => {
      const now = new Date();
      const remaining = Math.max(0, endTime - now);
      setTimeRemaining(remaining);
      
      if (remaining <= 0) {
        setCompleted(true);
        setCurrentQuestion(null);
      }
    };
    
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  useEffect(() => {
    if (currentQuestion && !questionLoading) {
      setQuestionSpoken(false);
      setShouldSpeak(false);
      
      const timer = setTimeout(() => {
        setShouldSpeak(speechEnabled);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [currentQuestion, questionLoading, speechEnabled]);

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleSpeechRecognition = useCallback(() => {
    if (!recognitionRef.current) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    if (isRecognizing) {
      recognitionRef.current.stop();
      setIsRecognizing(false);
    } else {
      try {
        setAnswer(prevAnswer => prevAnswer.replace(/\s*\[interim\].*$/, ''));
        recognitionRef.current.start();
        setIsRecognizing(true);
        setError(null);
      } catch (error) {
        console.error("Failed to start speech recognition:", error);
        setError('Failed to start voice input. Please try again.');
      }
    }
  }, [isRecognizing]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initSession = async () => {
      try {
        const interviewData = await fetchWithToken(
          `${API_URL}/interview/get-all-interviews/`,
          token
        );
        const currentInterview = interviewData.find(
          (item) => item.id === parseInt(interviewId)
        );

        if (!currentInterview) {
          setError("Interview not found.");
          setLoading(false);
          return;
        }
        
        const now = new Date();
        const start = new Date(currentInterview.startTime);
        const end = new Date(currentInterview.endTime);
        setEndTime(end);
        
        if (now < start) {
          setError("Interview has not started yet.");
          setLoading(false);
          return;
        }
        if (now > end) {
          setError("Interview time has ended.");
          setLoading(false);
          return;
        }
        
        setInterviewActive(true);
        const data = await fetchWithToken(
          `${API_URL}/interview/interview-session-initializer/${interviewId}/`,
          token,
          null,
          "POST"
        );
        
        if (!data || !data.session_id) {
          setError(data?.error || "Failed to start interview.");
        } else {
          setSessionId(data.session_id);
          setCurrentQuestion(data.question);
        }
      } catch (err) {
        setError("Error initializing session.");
      } finally {
        setLoading(false);
      }
    };
    initSession();
  }, [interviewId, token, navigate]);

  useEffect(() => {
    if (completed && sessionId) {
      navigate(`/dsa-interview-platform/${sessionId}`);
    }
  }, [completed, sessionId, navigate]);

  const handleSpeechEnd = useCallback(() => {
    setQuestionSpoken(true);
    setShouldSpeak(false);
    console.log('Question speech ended');
  }, []);

  const toggleSpeech = () => {
    if (speechEnabled) {
      window.speechSynthesis.cancel();
      setShouldSpeak(false);
    }
    setSpeechEnabled(!speechEnabled);
    
    if (!speechEnabled && currentQuestion && !questionSpoken) {
      setTimeout(() => {
        setShouldSpeak(true);
      }, 100);
    }
  };

  const handleNext = useCallback(async () => {
    const trimmedAnswer = answer.replace(/\s*\[interim\].*$/, '').trim();
    if (!trimmedAnswer) {
      setError('Please provide an answer before continuing.');
      return;
    }

    if (isRecognizing) {
      recognitionRef.current?.stop();
      setIsRecognizing(false);
    }

    setChatHistory((prev) => [...prev, { question: currentQuestion, answer: trimmedAnswer }]);
    setAnswer("");
    setQuestionLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        setError("Request timed out. Please try again.");
        setQuestionLoading(false);
      }, 15000);

      const data = await fetchWithToken(
        `${API_URL}/interview/interview-session/${sessionId}/?answer=${encodeURIComponent(trimmedAnswer)}`,
        token,
        { signal: controller.signal },
        "POST"
      );

      clearTimeout(timeoutId);

      if (!data) {
        throw new Error("No response received");
      }

      if (data.completed) {
        setCompleted(true);
      } else if (data.current_question) {
        setCurrentQuestion(data.current_question);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
      if (err.name === 'AbortError') {
        setError("Request was cancelled. Please try again.");
      } else {
        setError("Error submitting answer. Please check your connection and try again.");
      }
    } finally {
      setQuestionLoading(false);
    }
  }, [answer, currentQuestion, sessionId, token, isRecognizing]);

  const handleEndInterview = async () => {
    setCompleted(true);
    try {
      await fetchWithToken(
        `${API_URL}/interview/interview-session/${sessionId}/complete`,
        token,
        null,
        "POST"
      );
    } catch (err) {
      console.error("Error completing interview:", err);
    }
    navigate(`/dsa-interview-platform/${sessionId}`);
  };

  const handleStartInterview = () => setShowWelcome(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <Loader2 className="animate-spin w-16 h-16 text-purple-400 mx-auto mb-4" />
          <p className="text-xl text-white">Initializing Interview...</p>
          <p className="text-slate-400 mt-2">Please wait while we set up your session</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
        <div className="bg-red-600/20 border border-red-500/30 p-8 rounded-2xl text-center max-w-md">
          <div className="w-16 h-16 bg-red-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={32} className="text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-4">Interview Error</h2>
          <p className="text-lg text-red-200 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/80 backdrop-blur-md p-12 rounded-3xl border border-slate-600/50 shadow-2xl max-w-2xl w-full text-center">
          <div className="relative mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <MessageCircle size={64} className="text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
            AI Interview Session
          </h1>
          
          <p className="text-slate-300 mb-8 text-xl leading-relaxed">
            Welcome to your interactive interview session. You'll be speaking with an AI interviewer 
            that will ask you questions and evaluate your responses in real-time.
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center gap-3 text-slate-400">
              <Clock size={20} />
              <span>Expected Duration: 30-45 minutes</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-slate-400">
              <Mic size={20} />
              <span>Voice recognition enabled</span>
            </div>
          </div>
          
          <button
            onClick={handleStartInterview}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-12 py-4 rounded-xl font-bold text-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
          >
            Begin Interview
          </button>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-green-800/30 backdrop-blur-md border border-green-500/40 p-12 rounded-3xl shadow-2xl max-w-2xl w-full text-center">
          <div className="relative mb-8">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <MessageCircle size={64} className="text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-bounce">
              <span className="text-xs">✓</span>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-6">
            Interview Complete!
          </h1>
          
          <p className="text-green-200 text-xl mb-8">
            Thank you for participating in the AI interview session. 
            Your responses have been recorded and will be reviewed.
          </p>
          
          <div className="flex items-center justify-center gap-3 text-green-300 mb-8">
            <Loader2 className="animate-spin w-6 h-6" />
            <span className="text-lg">Redirecting to results...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50 shadow-xl">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Left section */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate(-1)}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 transition-all duration-200 shadow-lg hover:shadow-xl border border-slate-600/50"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  AI Interview Session
                </h1>
                <p className="text-slate-400 text-lg">Question {chatHistory.length + 1}</p>
              </div>
            </div>

            {/* Center section - Timer */}
            {/* {timeRemaining !== null && (
              <div className="flex items-center gap-4 bg-slate-800/80 backdrop-blur-md px-8 py-4 rounded-xl border border-slate-600/50 shadow-lg">
                <Clock size={24} className="text-orange-400" />
                <div className="text-center">
                  <div className="text-xl font-mono font-bold text-orange-300">
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="text-sm text-slate-400">Remaining</div>
                </div>
              </div>
            )} */}

            {/* Right section - Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSpeech}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border ${
                  speechEnabled
                    ? "bg-green-600/20 border-green-500/40 text-green-300 hover:bg-green-600/30"
                    : "bg-red-600/20 border-red-500/40 text-red-300 hover:bg-red-600/30"
                }`}
              >
                {speechEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                <span className="font-medium">{speechEnabled ? "Audio On" : "Audio Off"}</span>
              </button>
              
              <button
                onClick={toggleSpeechRecognition}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border ${
                  isRecognizing
                    ? "bg-blue-600/20 border-blue-500/40 text-blue-300 hover:bg-blue-600/30"
                    : "bg-slate-600/20 border-slate-500/40 text-slate-300 hover:bg-slate-600/30"
                }`}
                disabled={!recognitionRef.current}
              >
                {isRecognizing ? <Mic size={20} /> : <MicOff size={20} />}
                <span className="font-medium">
                  {isRecognizing ? "Listening..." : "Voice Input"}
                </span>
                {isRecognizing && (
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                )}
              </button>

              <button
                onClick={handleEndInterview}
                className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 px-5 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-red-300"
              >
                End Interview
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        {questionLoading ? (
          <div className="flex justify-center items-center h-[calc(100vh-140px)]">
            <div className="text-center bg-slate-800/60 backdrop-blur-md p-12 rounded-2xl border border-slate-700/50 shadow-2xl">
              <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-purple-300 mb-3">Processing Response</h3>
              <p className="text-slate-300 text-lg mb-2">Analyzing your answer...</p>
              <p className="text-slate-400">Generating next question</p>
              <div className="mt-6 flex justify-center gap-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : currentQuestion ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-140px)]">
            {/* Left side - Avatar */}
            <div className="flex items-center justify-center bg-slate-800/30 rounded-2xl border border-slate-700/30">
              <TalkingAvatar
                text={shouldSpeak && !questionSpoken ? currentQuestion : ""}
                isEnabled={shouldSpeak && !questionSpoken}
                onSpeechEnd={handleSpeechEnd}
              />
            </div>
            
            {/* Right side - Question and Input */}
            <div className="flex flex-col justify-center space-y-6">
              <div className="bg-slate-800/80 backdrop-blur-lg p-8 rounded-2xl border border-slate-700/50 shadow-xl">
                {/* Question Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <MessageCircle size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-purple-300">
                      Question {chatHistory.length + 1}
                    </h3>
                    <p className="text-slate-400 text-sm">Take your time to provide a thoughtful response</p>
                  </div>
                  {shouldSpeak && !questionSpoken && (
                    <div className="flex items-center gap-2 text-green-400 bg-green-600/20 px-3 py-1 rounded-full border border-green-500/30">
                      <Volume2 size={16} />
                      <span className="text-sm font-medium">AI Speaking...</span>
                    </div>
                  )}
                </div>
                
                {/* Question Text */}
                <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-600/30 mb-6">
                  <p className="text-lg text-slate-100 leading-relaxed font-medium">
                    {currentQuestion}
                  </p>
                </div>
                
                {/* Answer Input */}
                <div className="space-y-4">
                  <div className="relative">
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="w-full bg-slate-900/80 text-white p-5 rounded-xl border border-slate-700 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 resize-none backdrop-blur-sm shadow-lg"
                      rows="6"
                      placeholder={`Type your answer here${recognitionRef.current ? ' or use voice input...' : '...'}`}
                    />
                    {isRecognizing && (
                      <div className="absolute top-3 right-3 flex items-center gap-2 bg-blue-600/80 px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="text-white text-sm font-medium">Listening</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Answer Controls */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-slate-400">
                        <span className={answer.length > 500 ? 'text-green-400' : 'text-slate-400'}>
                          {answer.length}
                        </span> characters
                      </div>
                      {answer.length > 100 && (
                        <div className="text-sm text-green-400 flex items-center gap-1">
                          <span>✓</span> Good length
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => setAnswer('')}
                        disabled={!answer.trim()}
                        className="bg-slate-600/50 hover:bg-slate-600/70 disabled:bg-slate-700/30 disabled:cursor-not-allowed px-5 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl border border-slate-500/30"
                      >
                        Clear
                      </button>
                      
                      <button
                        onClick={handleNext}
                        disabled={!answer.trim()}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed px-8 py-2 rounded-lg flex items-center gap-2 font-bold transition-all duration-200 shadow-lg hover:shadow-2xl transform hover:scale-105 disabled:transform-none border border-purple-500/30 disabled:border-slate-500/30"
                      >
                        <Send size={18} /> 
                        Submit Answer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
export default InterviewSession;