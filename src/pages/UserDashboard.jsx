"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from '../components/header';
import Footer from '../components/Footer';
import { Loader2, Github, Brain } from "lucide-react";

export default function UserDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("No token found. Please login first.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/api/users/profile/${id}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        setProfile(response.data.profile);
        setTimeout(() => setVisible(true), 200);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        alert("Invalid or expired token. Please login again.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, navigate]);

  const githubUsername = profile?.github || "";
  const leetcodeUsername = profile?.leetcode || "";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-300 bg-slate-900">
        Profile not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      <Header />

      <div className="flex flex-col items-center justify-center py-16 px-4 relative z-10">
        <div className={`max-w-6xl w-full transform transition-all duration-1000 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="bg-slate-800/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-700/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent animate-shimmer"></div>

            <div className="flex flex-col items-center space-y-4">
              <img
                src={profile.photo || "/default-profile.png"}
                alt="User Profile"
                className="w-24 h-24 rounded-full border-2 border-purple-500 shadow-lg"
              />
              <h1 className="text-2xl font-bold">@{profile.username || "Anonymous"}</h1>
              <p className="text-sm text-slate-400 text-center">
                {profile.bio || "This user has not added a bio."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mt-6">
                {/* GitHub Card */}
                {githubUsername && (
                  <div className="bg-[#0d1117] border border-gray-700 rounded-2xl shadow-xl p-4">
                    <h3 className="text-white text-lg font-semibold mb-2 flex items-center gap-2">
                      <Github className="w-5 h-5" /> GitHub Stats
                    </h3>
                    <p className="text-sm text-slate-400 mb-2">Username:</p>
                    <a
                      href={`https://github.com/${githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline break-all"
                    >
                      {githubUsername}
                    </a>
                    <div className="mt-4 rounded-xl overflow-hidden">
                      <img
                        src={`https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&theme=github_dark`}
                        alt="GitHub Stats"
                        className="w-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* LeetCode Card */}
                {leetcodeUsername && (
                  <div className="bg-[#1d1d1f] border border-yellow-500/30 rounded-2xl shadow-xl p-4">
                    <h3 className="text-white text-lg font-semibold mb-2 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-yellow-400" /> LeetCode Stats
                    </h3>
                    <p className="text-sm text-slate-400 mb-2">Username:</p>
                    <a
                      href={`https://leetcode.com/${leetcodeUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-400 hover:underline break-all"
                    >
                      {leetcodeUsername}
                    </a>
                    <div className="mt-4 rounded-xl overflow-hidden">
                      <img
                        src={`https://leetcard.jacoblin.cool/${leetcodeUsername}?theme=dark&font=baloo&show_rank=true`}
                        alt="LeetCode Card"
                        className="w-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  );
}
