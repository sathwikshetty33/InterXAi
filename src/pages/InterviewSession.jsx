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
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuthToken, fetchWithToken } from "../utils/handleToken";
import { 
  Loader2, 
  ArrowLeft, 
  Send, 
  MessageCircle, 
  User, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Phone, 
  PhoneOff,
  Settings,
  Timer,
  Pause,
  Play,
  SkipForward,
  AlertTriangle
} from "lucide-react";

const InterviewSession = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const token = getAuthToken();

  // Original state from your code
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

  // New interactive features state
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [voice, setVoice] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [interviewTimer, setInterviewTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [transcriptHistory, setTranscriptHistory] = useState([]);
  const [questionLoading, setQuestionLoading] = useState(false);

  // Refs
  const hasInitialized = useRef(false);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);
  const timerRef = useRef(null);
  const interviewStartTime = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      synthesisRef.current = synth;
      
      const updateVoices = () => {
        const voices = synth.getVoices();
        setAvailableVoices(voices);
        if (!voice && voices.length > 0) {
          // Prefer female voice for interview
          const preferredVoice = voices.find(v => 
            v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Karen')
          ) || voices[0];
          setVoice(preferredVoice);
        }
      };
      
      updateVoices();
      synth.onvoiceschanged = updateVoices;
    }
  }, [voice]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        let maxConfidence = 0;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          const confidence = result[0].confidence || 0;
          
          if (result.isFinal) {
            finalTranscript += transcript;
            maxConfidence = Math.max(maxConfidence, confidence);
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setAnswer(prev => prev + finalTranscript);
          setConfidence(maxConfidence);
          setTranscriptHistory(prev => [...prev, { text: finalTranscript, confidence: maxConfidence, timestamp: Date.now() }]);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (isRecording) {
          recognition.start(); // Restart if still recording
        }
      };

      recognitionRef.current = recognition;
    }
  }, [isRecording]);

  // Timer effect
  useEffect(() => {
    if (!interviewStartTime.current) {
      interviewStartTime.current = Date.now();
    }

    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setInterviewTimer(Math.floor((Date.now() - interviewStartTime.current) / 1000));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused]);

  // Auto-scroll to bottom (from your original code)
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Original fetch interview details & initialize (from your code)
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
  }, [interviewId, token, navigate, API_URL]);

  // Auto-end interview when endTime reached (from your original code)
  useEffect(() => {
    if (!endTime) return;
    const timer = setInterval(() => {
      if (new Date() >= endTime) {
        setCompleted(true);
        setCurrentQuestion(null);
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  // Redirect to DSA platform after completion (from your original code)
  useEffect(() => {
    if (completed && sessionId) {
      navigate(`/dsa-interview-platform/${sessionId}`);
    }
  }, [completed, sessionId, navigate]);

  // Text-to-speech function
  const speak = useCallback((text) => {
    if (!speechEnabled || !synthesisRef.current || !voice) return;
    
    // Cancel any ongoing speech
    synthesisRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.rate = speechRate;
    utterance.volume = volume;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => {
      console.log('Speech started');
    };
    
    utterance.onend = () => {
      console.log('Speech ended');
    };
    
    synthesisRef.current.speak(utterance);
  }, [speechEnabled, voice, speechRate, volume]);

  // Auto-speak new questions
  useEffect(() => {
    if (currentQuestion && autoSpeak && !questionLoading && !showWelcome) {
      const questionText = `Question ${chatHistory.length + 1}: ${currentQuestion}`;
      setTimeout(() => speak(questionText), 500);
    }
  }, [currentQuestion, autoSpeak, speak, chatHistory.length, questionLoading, showWelcome]);

  // Speech recognition controls
  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      setIsRecording(false);
      recognitionRef.current.stop();
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Original submit answer function (from your code) with voice enhancements
  const handleNext = async () => {
    if (!answer.trim()) return;

    // Stop any ongoing speech
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }

    setChatHistory((prev) => [...prev, { question: currentQuestion, answer }]);
    setAnswer("");
    setQuestionLoading(true);

    try {
      const data = await fetchWithToken(
        `${API_URL}/interview/interview-session/${sessionId}/?answer=${encodeURIComponent(answer)}`,
        token,
        null,
        "POST"
      );

      if (!data) {
        setError("Error submitting answer.");
        return;
      }

      if (data.completed) {
        setCompleted(true);
      } else {
        setCurrentQuestion(data.current_question);
      }
    } catch (err) {
      setError("Error submitting answer.");
    } finally {
      setQuestionLoading(false);
    }
  };

  const handleEndInterview = () => {
    if (window.confirm("Are you sure you want to end the interview? This action cannot be undone.")) {
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
      setCompleted(true);
    }
  };

  const handleStartInterview = () => {
    setShowWelcome(false);
    interviewStartTime.current = Date.now();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    if (synthesisRef.current) {
      if (isPaused) {
        synthesisRef.current.resume();
      } else {
        synthesisRef.current.pause();
      }
    }
  };

  // Loading screen (from your original code)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="text-center">
          <Loader2 className="animate-spin w-16 h-16 text-purple-400 mx-auto mb-4" />
          <p className="text-lg">Initializing interview session...</p>
        </div>
      </div>
    );
  }

  // Error screen (from your original code)
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
        <p className="text-xl text-red-400 mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-purple-600 px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Welcome screen (enhanced version of your original)
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="bg-slate-800/60 p-12 rounded-2xl border border-slate-700/50 shadow-2xl max-w-lg w-full mx-4 text-center backdrop-blur-sm">
          <div className="bg-purple-600/20 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <MessageCircle size={48} className="text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold text-purple-300 mb-4">
            Welcome to the Interview
          </h1>
          <p className="text-slate-300 mb-6 text-lg leading-relaxed">
            You're about to begin your interview session. Take your time with each question and answer thoughtfully.
          </p>
          <div className="bg-slate-700/50 p-4 rounded-lg mb-6 text-sm text-left">
            <h3 className="text-purple-300 font-semibold mb-2">Enhanced Features:</h3>
            <ul className="space-y-1 text-slate-300">
              <li>• 🎙️ Voice-to-text transcription</li>
              <li>• 🔊 Text-to-speech for questions</li>
              <li>• ⏱️ Real-time interview timer</li>
              <li>• 📝 Complete conversation history</li>
              <li>• ⚙️ Customizable voice settings</li>
            </ul>
          </div>
          <button
            onClick={handleStartInterview}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Start Interview
          </button>
        </div>
      </div>
    );
  }

  // Completion screen (from your original code)
  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="bg-green-700/30 border border-green-500/30 p-12 rounded-2xl shadow-2xl max-w-lg w-full mx-4 text-center backdrop-blur-sm">
          <div className="bg-green-600/20 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <MessageCircle size={48} className="text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-green-300 mb-4">
            Thank you for attending the interview!
          </h1>
          <p className="text-green-200 text-lg mb-4">
            Total time: {formatTime(interviewTimer)}
          </p>
          <p className="text-green-200 mb-6">
            Redirecting to dashboard in a moment...
          </p>
          <div className="mt-6">
            <Loader2 className="animate-spin w-6 h-6 text-green-400 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  // Main interview UI (enhanced version of your original)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Enhanced Header */}
      <div className="bg-slate-800/60 border-b border-slate-700/50 p-4 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Timer className="text-purple-400" size={20} />
              <span className="font-mono text-lg">{formatTime(interviewTimer)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
              <span className="text-sm">
                {isRecording ? 'Recording...' : 'Ready'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={togglePause}
              className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              <Settings size={16} />
            </button>
            <button
              onClick={handleEndInterview}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <PhoneOff size={16} />
              End Interview
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-4 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <label className="block text-slate-300 mb-1">Voice</label>
                <select
                  value={voice?.name || ''}
                  onChange={(e) => setVoice(availableVoices.find(v => v.name === e.target.value))}
                  className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1"
                >
                  {availableVoices.map((v) => (
                    <option key={v.name} value={v.name}>{v.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Speed: {speechRate}</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={speechEnabled}
                    onChange={(e) => setSpeechEnabled(e.target.checked)}
                  />
                  <span>Enable TTS</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={autoSpeak}
                    onChange={(e) => setAutoSpeak(e.target.checked)}
                  />
                  <span>Auto-speak</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Chat History (enhanced version of your original) */}
        <div className="w-1/3 bg-slate-800/40 border-r border-slate-700/50 flex flex-col">
          <div className="p-4 border-b border-slate-700/50">
            <h2 className="text-xl font-semibold text-purple-300 flex items-center gap-2">
              <MessageCircle size={20} /> 
              Chat History ({chatHistory.length})
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.length === 0 ? (
              <div className="text-center text-slate-400 mt-8">
                <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
                <p>No messages yet</p>
                <p className="text-sm mt-2">Your conversation will appear here</p>
              </div>
            ) : (
              chatHistory.map((item, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-slate-700/50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-purple-300 font-medium text-sm">Question {index + 1}</p>
                          <button
                            onClick={() => speak(item.question)}
                            className="text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            <Volume2 size={14} />
                          </button>
                        </div>
                        <p className="text-slate-200 mt-1">{item.question}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-slate-600/50 p-3 rounded-lg">
                        <p className="text-blue-300 font-medium text-sm mb-1">Your Answer</p>
                        <p className="text-slate-200 mt-1">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Question Section (enhanced version of your original) */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6 flex items-center justify-center">
            {questionLoading ? (
              <div className="flex flex-col justify-center items-center h-60">
                <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
                <p className="text-slate-300 text-xl">Evaluating your response...</p>
                <p className="text-slate-400 text-sm mt-2">Preparing next question</p>
              </div>
            ) : currentQuestion && (
              <div className="max-w-4xl w-full">
                <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700/50 shadow-2xl backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        <MessageCircle size={20} className="text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-purple-300">
                        Question {chatHistory.length + 1}
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => speak(currentQuestion)}
                        className="p-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
                        title="Speak question"
                      >
                        {speechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/50 p-6 rounded-lg mb-6 border-l-4 border-purple-500">
                    <p className="text-xl text-slate-200 leading-relaxed">
                      {currentQuestion}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="w-full bg-slate-900 text-white p-4 rounded-lg border border-slate-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 resize-none pr-16"
                        rows="6"
                        placeholder="Type your answer here or use voice input..."
                      />
                      
                      {/* Voice input button */}
                      <button
                        onClick={toggleRecording}
                        className={`absolute right-3 top-3 p-2 rounded-lg transition-all duration-200 ${
                          isRecording 
                            ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                        title={isRecording ? "Stop recording" : "Start voice input"}
                      >
                        {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                      </button>
                    </div>
                    
                    {/* Confidence indicator */}
                    {confidence > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-slate-400">
                          Speech confidence: {Math.round(confidence * 100)}%
                        </span>
                      </div>
                    )}
                    
                    {/* Controls */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>{answer.length} characters</span>
                        {isListening && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            <span>Listening...</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => setAnswer("")}
                          className="bg-slate-600 hover:bg-slate-500 px-4 py-2 rounded-lg transition-colors"
                          disabled={!answer.trim()}
                        >
                          Clear
                        </button>
                        <button
                          onClick={handleNext}
                          disabled={!answer.trim()}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed px-8 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                        >
                          <Send size={18} /> Submit Answer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;