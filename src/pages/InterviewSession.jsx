"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuthToken, fetchWithToken } from "../utils/handleToken";
import { Loader2, ArrowLeft, Send, MessageCircle, User } from "lucide-react";

const InterviewSession = () => {
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

  const hasInitialized = useRef(false);
  const chatEndRef = useRef(null);
  const [questionLoading, setQuestionLoading] = useState(false);


  // ✅ Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // ✅ Fetch interview details & initialize
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
          `http://localhost:8000/api/interview/get-all-interviews/`,
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
          `http://localhost:8000/api/interview/interview-session-initializer/${interviewId}/`,
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

  // ✅ Auto-end interview when endTime reached
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

  // ✅ Redirect to previous page after completion
  // ✅ Redirect to DasInterViewPlatform after completion
useEffect(() => {
  console.log("no poskjqnwjwqn")
  if (completed && sessionId) {
    console.log("eqv 2hbjqn2knw2qini23i")
    navigate(`/dsa-interview-platform/${sessionId}`);
  }
}, [completed, sessionId, navigate]);


  // ✅ Submit answer
  const handleNext = async () => {
  if (!answer.trim()) return;

  setChatHistory((prev) => [...prev, { question: currentQuestion, answer }]);
  setAnswer("");
  setQuestionLoading(true);   // ✅ Trigger loading state first

  try {
    const data = await fetchWithToken(
      `http://localhost:8000/api/interview/interview-session/${sessionId}/?answer=${encodeURIComponent(answer)}`,
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
    setQuestionLoading(false); // ✅ Stop loader once everything is ready
  }
};



  const handleStartInterview = () => setShowWelcome(false);

  // ✅ Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <Loader2 className="animate-spin w-10 h-10 text-purple-400" />
      </div>
    );
  }

  // ✅ Error screen
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <p className="text-xl text-red-400">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-purple-600 px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200"
        >
          Go Back
        </button>
      </div>
    );
  }

  // ✅ Welcome Screen
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="bg-slate-800/60 p-12 rounded-2xl border border-slate-700/50 shadow-2xl max-w-md w-full mx-4 text-center">
          <div className="bg-purple-600/20 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <MessageCircle size={48} className="text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold text-purple-300 mb-4">
            Welcome to the Interview
          </h1>
          <p className="text-slate-300 mb-8 text-lg leading-relaxed">
            You're about to begin your interview session. Take your time with
            each question and answer thoughtfully.
          </p>
          <button
            onClick={handleStartInterview}
            className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Start Interview
          </button>
        </div>
      </div>
    );
  }

  // ✅ Completion Screen
  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="bg-green-700/30 border border-green-500/30 p-12 rounded-2xl shadow-2xl max-w-md w-full mx-4 text-center">
          <div className="bg-green-600/20 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <MessageCircle size={48} className="text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-green-300 mb-4">
            Thank you for attending the interview!
          </h1>
          <p className="text-green-200 text-lg">
            Redirecting to dashboard in a moment...
          </p>
          <div className="mt-6">
            <Loader2 className="animate-spin w-6 h-6 text-green-400 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  // ✅ Main Interview UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="flex h-[calc(100vh-100px)]">
        {/* Chat History */}
        <div className="w-1/3 bg-slate-800/40 border-r border-slate-700/50 flex flex-col">
          <div className="p-4 border-b border-slate-700/50">
            <h2 className="text-xl font-semibold text-purple-300 flex items-center gap-2">
              <MessageCircle size={20} /> Chat History
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
                  {/* Question */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-slate-700/50 p-3 rounded-lg">
                        <p className="text-purple-300 font-medium text-sm">
                          Question {index + 1}
                        </p>
                        <p className="text-slate-200 mt-1">{item.question}</p>
                      </div>
                    </div>
                  </div>
                  {/* Answer */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-slate-600/50 p-3 rounded-lg">
                        <p className="text-blue-300 font-medium text-sm">
                          Your Answer
                        </p>
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

        {/* Question Section */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6 flex items-center justify-center">
            {questionLoading ? (
  <div className="flex justify-center items-center h-60">
    <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
    <p className="ml-4 text-slate-300 text-lg">Evaluating your response...</p>
  </div>
) : currentQuestion && (

              <div className="max-w-3xl w-full">
                <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700/50 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <MessageCircle size={20} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-purple-300">
                      Question {chatHistory.length + 1}
                    </h3>
                  </div>
                  <p className="text-xl text-slate-200 mb-8 leading-relaxed">
                    {currentQuestion}
                  </p>
                  <div className="space-y-4">
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="w-full bg-slate-900 text-white p-4 rounded-lg border border-slate-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 resize-none"
                      rows="6"
                      placeholder="Type your answer here..."
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleNext}
                        disabled={!answer.trim()}
                        className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed px-8 py-3 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                      >
                        <Send size={18} /> Submit Answer
                      </button>
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
