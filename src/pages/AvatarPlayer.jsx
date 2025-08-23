// import React, { useEffect, useState, useRef } from "react";
// import { Loader2, Volume2, VolumeX, RotateCcw, AlertCircle } from "lucide-react";

// const AvatarPlayer = ({ text, didApiKey="cml0dmlrcml0dnN5bXBAZ21haWwuY29t:WLhtVt_KC6-8nT-LbWa5d", onVideoEnd, className = "" }) => {
//   const [videoUrl, setVideoUrl] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [muted, setMuted] = useState(false);
//   const videoRef = useRef(null);

//   useEffect(() => {
//     if (!text || !didApiKey) return;

//     const fetchAvatarVideo = async () => {
//       setLoading(true);
//       setVideoUrl(null);
//       setError(null);
      
//       try {
//         // Step 1: Create D-ID talk
//         const createResponse = await fetch('https://api.d-id.com/talks', {
//           method: 'POST',
//           headers: {
//             'Authorization': `Basic ${didApiKey}`,
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             script: {
//               type: 'text',
//               input: text.trim(),
//               provider: {
//                 type: 'microsoft',
//                 voice_id: 'Jenny'
//               }
//             },
//             source_url: 'https://create-images-results.d-id.com/DefaultPresenters/Noelle_f/image.jpeg',
//             config: {
//               fluent: 'false',
//               pad_audio: '0.0'
//             }
//           })
//         });

//         if (!createResponse.ok) {
//           const errorData = await createResponse.json();
//           throw new Error(`D-ID API error: ${errorData.message || createResponse.status}`);
//         }

//         const createData = await createResponse.json();
//         const talkId = createData.id;

//         // Step 2: Poll for completion
//         let attempts = 0;
//         const maxAttempts = 30; // 30 seconds timeout

//         while (attempts < maxAttempts) {
//           const statusResponse = await fetch(`https://api.d-id.com/talks/${talkId}`, {
//             headers: {
//               'Authorization': `Basic ${didApiKey}`,
//             }
//           });

//           if (!statusResponse.ok) {
//             throw new Error('Failed to check video status');
//           }

//           const statusData = await statusResponse.json();
//           const status = statusData.status;

//           if (status === 'done') {
//             setVideoUrl(statusData.result_url);
//             return;
//           } else if (status === 'error') {
//             throw new Error('D-ID video generation failed');
//           }

//           // Wait 1 second before next check
//           await new Promise(resolve => setTimeout(resolve, 1000));
//           attempts++;
//         }

//         throw new Error('Video generation timeout - please try again');

//       } catch (err) {
//         console.error("Error fetching avatar video:", err);
//         setError(err.message || "Failed to generate avatar video");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAvatarVideo();
//   }, [text, didApiKey]);

//   const handleVideoEnd = () => {
//     if (onVideoEnd) {
//       onVideoEnd();
//     }
//   };

//   const handleMuteToggle = () => {
//     if (videoRef.current) {
//       videoRef.current.muted = !muted;
//       setMuted(!muted);
//     }
//   };

//   const handleReplay = () => {
//     if (videoRef.current) {
//       videoRef.current.currentTime = 0;
//       videoRef.current.play();
//     }
//   };

//   const handleVideoError = (e) => {
//     console.error("Video playback error:", e);
//     setError("Video playback failed");
//   };

//   if (loading) {
//     return (
//       <div className={`avatar-player-container ${className}`}>
//         <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 p-6">
//           <div className="flex flex-col items-center justify-center space-y-4">
//             <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center">
//               <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
//             </div>
//             <div className="text-center">
//               <p className="text-purple-300 font-medium">Generating Avatar</p>
//               <p className="text-slate-400 text-sm mt-1">
//                 Creating personalized response...
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={`avatar-player-container ${className}`}>
//         <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
//           <div className="flex flex-col items-center justify-center space-y-4">
//             <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center">
//               <AlertCircle className="w-6 h-6 text-red-400" />
//             </div>
//             <div className="text-center">
//               <p className="text-red-300 font-medium">Avatar Error</p>
//               <p className="text-red-200/70 text-sm mt-1">{error}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!videoUrl) {
//     return null;
//   }

//   return (
//     <div className={`avatar-player-container ${className}`}>
//       <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 overflow-hidden shadow-2xl">
//         {/* Video Container */}
//         <div className="relative aspect-video bg-slate-900">
//           <video
//             ref={videoRef}
//             key={videoUrl} // Force reload when URL changes
//             src={videoUrl}
//             autoPlay
//             muted={muted}
//             playsInline
//             onEnded={handleVideoEnd}
//             onError={handleVideoError}
//             className="w-full h-full object-cover"
//             preload="auto"
//           />
          
//           {/* Overlay Controls */}
//           <div className="absolute bottom-4 right-4 flex space-x-2">
//             <button
//               onClick={handleMuteToggle}
//               className="bg-slate-900/80 hover:bg-slate-800 text-white p-2 rounded-full transition-all duration-200 border border-slate-600/50"
//               title={muted ? "Unmute" : "Mute"}
//             >
//               {muted ? (
//                 <VolumeX className="w-4 h-4" />
//               ) : (
//                 <Volume2 className="w-4 h-4" />
//               )}
//             </button>
            
//             <button
//               onClick={handleReplay}
//               className="bg-slate-900/80 hover:bg-slate-800 text-white p-2 rounded-full transition-all duration-200 border border-slate-600/50"
//               title="Replay"
//             >
//               <RotateCcw className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//         {/* Info Bar */}
//         <div className="bg-slate-800/80 px-4 py-3 border-t border-slate-700/50">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//               <span className="text-slate-300 text-sm font-medium">
//                 AI Avatar Speaking
//               </span>
//             </div>
//             <div className="text-slate-400 text-xs">
//               Lip-sync enabled
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AvatarPlayer;
import React, { useEffect, useState, useRef } from "react";
import { Loader2, Volume2, VolumeX, RotateCcw, AlertCircle } from "lucide-react";

const AvatarPlayer = ({ text, onVideoEnd, className = "" }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!text) return;

    const fetchAvatarVideo = async () => {
      setLoading(true);
      setVideoUrl(null);
      setError(null);
      
      try {
        const res = await fetch("http://localhost:8000/avatar-talk/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        
        const data = await res.json();
        
        if (data.result_url) {
          setVideoUrl(data.result_url);
        } else {
          throw new Error(data.error || "No video URL");
        }
      } catch (err) {
        console.error("Error fetching avatar video:", err);
        setError(err.message || "Failed to generate avatar video");
      } finally {
        setLoading(false);
      }
    };

    fetchAvatarVideo();
  }, [text]);

  const handleVideoEnd = () => {
    if (onVideoEnd) {
      onVideoEnd();
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const handleVideoError = (e) => {
    console.error("Video playback error:", e);
    setError("Video playback failed");
  };

  if (loading) {
    return (
      <div className={`avatar-player-container ${className}`}>
        <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-purple-300 font-medium">Generating Avatar</p>
              <p className="text-slate-400 text-sm mt-1">
                Creating personalized response...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`avatar-player-container ${className}`}>
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <div className="text-center">
              <p className="text-red-300 font-medium">Avatar Error</p>
              <p className="text-red-200/70 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!videoUrl) {
    return null;
  }

  return (
    <div className={`avatar-player-container ${className}`}>
      <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 overflow-hidden shadow-2xl">
        {/* Video Container */}
        <div className="relative aspect-video bg-slate-900">
          <video
            ref={videoRef}
            key={videoUrl} // Force reload when URL changes
            src={videoUrl}
            autoPlay
            muted={muted}
            playsInline
            onEnded={handleVideoEnd}
            onError={handleVideoError}
            className="w-full h-full object-cover"
            preload="auto"
          />
          
          {/* Overlay Controls */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button
              onClick={handleMuteToggle}
              className="bg-slate-900/80 hover:bg-slate-800 text-white p-2 rounded-full transition-all duration-200 border border-slate-600/50"
              title={muted ? "Unmute" : "Mute"}
            >
              {muted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            
            <button
              onClick={handleReplay}
              className="bg-slate-900/80 hover:bg-slate-800 text-white p-2 rounded-full transition-all duration-200 border border-slate-600/50"
              title="Replay"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info Bar */}
        <div className="bg-slate-800/80 px-4 py-3 border-t border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-slate-300 text-sm font-medium">
                AI Avatar Speaking
              </span>
            </div>
            <div className="text-slate-400 text-xs">
              Lip-sync enabled
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarPlayer;