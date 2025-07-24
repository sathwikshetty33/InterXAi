"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/ui/header";
import Footer from "../components/ui/footer";
import {
  Trophy,
  Medal,
  Award,
  User,
  Calendar,
  Clock,
  TrendingUp,
  Eye,
} from "lucide-react";
import { getAuthToken } from "../utils/handleToken";

const Leaderboard = () => {
  const { id: interviewId } = useParams(); // Get interview ID from URL
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchLeaderboardData();
    // Trigger animation
    setTimeout(() => setVisible(true), 100);
  }, [interviewId]);

  const fetchLeaderboardData = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `http://localhost:8000/api/interview/leaderboard/${interviewId}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }

      const data = await response.json();
      console.log(data);
      setLeaderboardData(data.data || []);
      setInterviewHistory(data.interview_history || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-slate-300 font-bold">
            {rank}
          </span>
        );
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400 bg-green-900/30";
    if (score >= 60) return "text-yellow-400 bg-yellow-900/30";
    if (score >= 40) return "text-orange-400 bg-orange-900/30";
    return "text-red-400 bg-red-900/30";
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      completed: "bg-green-900/30 text-green-400 border-green-500/30",
      ongoing: "bg-blue-900/30 text-blue-400 border-blue-500/30",
      scheduled: "bg-slate-800/50 text-slate-300 border-slate-600/30",
      cancelled: "bg-red-900/30 text-red-400 border-red-500/30",
      cheated: "bg-red-900/30 text-red-400 border-red-500/30",
    };

    const colorClass = statusColors[status] || "bg-slate-800/50 text-slate-300 border-slate-600/30";

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewDetails = (candidate) => {
    console.log(candidate);
    setSelectedCandidate(candidate);
    setShowHistory(true);
    console.log(showHistory);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
        <Header viewerType="owner" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
        <Header viewerType="owner" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-red-900/30 border border-red-500/50 text-red-400 px-6 py-4 rounded-xl backdrop-blur-xl">
            Error: {error}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const sortedData = [...leaderboardData].sort(
    (a, b) => (b.score || 0) - (a.score || 0)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      <Header viewerType="owner" />
      
      <div className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className={`transform transition-all duration-1000 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 mb-8 p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent animate-shimmer"></div>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white flex items-center gap-3 mb-2">
                  <Trophy className="w-10 h-10 text-yellow-500" />
                  Interview Leaderboard
                </h1>
                <p className="text-slate-300 text-lg">
                  Performance rankings for all candidates
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-purple-400 font-medium">Total Candidates</p>
                <p className="text-4xl font-bold text-purple-300">
                  {sortedData.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className={`transform transition-all duration-1000 delay-200 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent animate-shimmer"></div>
            
            <div className="px-8 py-6 bg-slate-900/30 border-b border-slate-700/50">
              <h2 className="text-2xl font-semibold text-white">Rankings</h2>
            </div>

            {sortedData.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <User className="w-16 h-16 mx-auto mb-6 text-slate-600" />
                <p className="text-lg">No candidates found for this interview.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-700/50">
                  <thead className="bg-slate-900/40">
                    <tr>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-purple-300 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-purple-300 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-purple-300 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-purple-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-purple-300 uppercase tracking-wider">
                        Start Time
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-purple-300 uppercase tracking-wider">
                        End Time
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-purple-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {sortedData.map((candidate, index) => (
                      <tr
                        key={candidate.id}
                        className={`hover:bg-slate-700/20 transition-colors ${
                          index < 3 ? "bg-gradient-to-r from-purple-900/20 to-transparent" : ""
                        }`}
                      >
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center">
                            {getRankIcon(index + 1)}
                            <span className="ml-3 text-lg font-bold text-white">
                              #{index + 1}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
                                <User className="w-6 h-6 text-white" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-lg font-semibold text-white">
                                {candidate.Application?.user?.username ||
                                  "Anonymous"}
                              </div>
                              <div className="text-sm text-slate-400">
                                ID: {candidate.Application?.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div
                            className={`inline-flex px-4 py-2 rounded-full text-lg font-bold border ${getScoreColor(
                              candidate.score || 0
                            )}`}
                          >
                            {candidate.score
                              ? candidate.score.toFixed(1)
                              : "N/A"}
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          {getStatusBadge(candidate.status)}
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-sm text-slate-300">
                          <div className="flex items-center">
                            <Calendar className="w-5 h-5 mr-2 text-purple-400" />
                            {formatDateTime(candidate.start_time)}
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-sm text-slate-300">
                          <div className="flex items-center">
                            <Clock className="w-5 h-5 mr-2 text-purple-400" />
                            {candidate.end_time
                              ? formatDateTime(candidate.end_time)
                              : "In Progress"}
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewDetails(candidate)}
                            className="text-blue-400 hover:text-blue-300 flex items-center gap-2 hover:bg-blue-900/20 px-3 py-2 rounded-lg transition-all duration-200 border border-blue-500/30 hover:border-blue-400/50"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Performance Insights */}
        {sortedData.length > 0 && (
          <div className={`mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 transform transition-all duration-1000 delay-400 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400/50 to-transparent"></div>
              <div className="flex items-center">
                <div className="p-3 bg-green-900/30 rounded-xl border border-green-500/30">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
                <div className="ml-6">
                  <p className="text-sm font-medium text-green-400 uppercase tracking-wider">
                    Highest Score
                  </p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {Math.max(...sortedData.map((c) => c.score || 0)).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
              <div className="flex items-center">
                <div className="p-3 bg-blue-900/30 rounded-xl border border-blue-500/30">
                  <Trophy className="w-8 h-8 text-blue-400" />
                </div>
                <div className="ml-6">
                  <p className="text-sm font-medium text-blue-400 uppercase tracking-wider">
                    Average Score
                  </p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {(
                      sortedData.reduce((sum, c) => sum + (c.score || 0), 0) /
                      sortedData.length
                    ).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
              <div className="flex items-center">
                <div className="p-3 bg-purple-900/30 rounded-xl border border-purple-500/30">
                  <User className="w-8 h-8 text-purple-400" />
                </div>
                <div className="ml-6">
                  <p className="text-sm font-medium text-purple-400 uppercase tracking-wider">
                    Completed
                  </p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {
                      sortedData.filter((c) => c.status === "completed").length
                    }
                    <span className="text-xl text-slate-400">/{sortedData.length}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Candidate Details Modal */}
{showHistory && selectedCandidate && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
      {/* Header */}
      <div className="sticky top-0 bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-700">
        <h3 className="text-lg font-semibold text-white">
          Interview Details - {selectedCandidate.Application?.user?.username}
        </h3>
        <button
          onClick={() => setShowHistory(false)}
          className="text-slate-400 hover:text-white text-2xl font-bold"
        >
          ✕
        </button>
      </div>

      {/* Candidate Summary */}
      <div className="p-6 space-y-6 text-slate-300">
        <div className="bg-slate-800 rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-4 border border-slate-700">
          <div>
            <p className="text-sm text-slate-400">Final Score</p>
            <p className="text-xl font-bold text-blue-400">
              {selectedCandidate.score?.toFixed(1) || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Status</p>
            <p className="mt-1">{getStatusBadge(selectedCandidate.status)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Recommendation</p>
            <p className="text-sm font-medium">
              {selectedCandidate.recommendation || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Duration</p>
            <p className="text-sm font-medium">
              {selectedCandidate.start_time && selectedCandidate.end_time
                ? `${Math.round(
                    (new Date(selectedCandidate.end_time) -
                      new Date(selectedCandidate.start_time)) /
                      (1000 * 60)
                  )} min`
                : "In Progress"}
            </p>
          </div>
        </div>

        {/* Feedback */}
        {selectedCandidate.feedback && (
          <div>
            <h4 className="text-md font-semibold text-white mb-2">Overall Feedback</h4>
            <div className="bg-blue-900/30 border-l-4 border-blue-400 p-4">
              <p className="text-sm">{selectedCandidate.feedback}</p>
            </div>
          </div>
        )}

        {/* Strengths */}
        {selectedCandidate.strengths && (
          <div>
            <h4 className="text-md font-semibold text-white mb-2">Strengths</h4>
            <div className="bg-green-900/30 border-l-4 border-green-400 p-4">
              <p className="text-sm">{selectedCandidate.strengths}</p>
            </div>
          </div>
        )}

        {/* Question-wise Performance */}
        {interviewHistory && interviewHistory.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-white mb-4">Question-wise Performance</h4>
            <div className="space-y-4">
              {interviewHistory.map((item, index) => (
                <div key={index} className="border border-slate-700 rounded-lg p-4 bg-slate-800">
                  <div className="flex justify-between items-start mb-3">
                    <h5 className="font-medium text-white">
                      Question {index + 1}
                    </h5>
                    {item.individual_score && (
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(
                          item.individual_score
                        )}`}
                      >
                        {item.individual_score.toFixed(1)}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-purple-300">Main Question:</p>
                      <p className="text-sm text-slate-300 bg-slate-900 p-2 rounded">
                        {item.main_question}
                      </p>
                    </div>

                    {item.expected_answer && (
                      <div>
                        <p className="text-sm font-medium text-purple-300">Expected Answer:</p>
                        <p className="text-sm text-slate-300 bg-slate-900 p-2 rounded">
                          {item.expected_answer}
                        </p>
                      </div>
                    )}

                    {item.conversation_history && item.conversation_history.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-purple-300 mb-2">
                          Follow-up Questions:
                        </p>
                        <div className="space-y-2">
                          {item.conversation_history.map((qa, qaIndex) => (
                            <div key={qaIndex} className="bg-slate-900 p-3 rounded">
                              <p className="text-sm font-medium text-blue-400">
                                Q: {qa.question}
                              </p>
                              <p className="text-sm text-slate-300 mt-1">
                                A: {qa.answer}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.individual_feedback && (
                      <div>
                        <p className="text-sm font-medium text-purple-300">Feedback:</p>
                        <p className="text-sm text-slate-300 bg-yellow-900/30 p-2 rounded">
                          {item.individual_feedback}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}

      
      <Footer />
    </div>
  );
};

export default Leaderboard;