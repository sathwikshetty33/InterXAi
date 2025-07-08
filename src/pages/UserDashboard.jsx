"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuthToken, fetchWithToken } from "../utils/handleToken";
import Header from '../components/ui/header';
import Footer from '../components/ui/footer';
import { Loader2, Github, Brain, Pencil } from "lucide-react";

export default function UserDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({});
  const [viewerType, setViewerType] = useState("guest"); // 'owner', 'authenticated', 'guest'

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getAuthToken();
  
      // Fetch profile (publicly available)
      const data = await fetchWithToken(
        `http://localhost:8000/api/users/profile/${id}/`,
        token,
        navigate
      );
  
      if (data) {
        setProfile(data.profile);
        setFormData(data.profile);
        setTimeout(() => setVisible(true), 200);
      }
  
      // Determine viewer type
      if (token) {
        try {
          const res = await fetch(`http://localhost:8000/api/users/check-user/${id}/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
  
          const result = await res.json();
          setViewerType(res.ok && result.success ? "owner" : "authenticated");
        } catch {
          setViewerType("guest");
        }
      } else {
        // 🚨 Important: fallback to guest if no token
        setViewerType("guest");
      }
  
      setLoading(false);
    };
  
    fetchProfile();
  }, [id, navigate]);
  

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (field) => {
    const token = getAuthToken();
    try {
      const response = await fetch("http://localhost:8000/api/users/profile/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ [field]: formData[field] }),
      });

      const data = await response.json();

      if (data.success) {
        setProfile((prev) => ({ ...prev, [field]: formData[field] }));
        setEditingField(null);
      } else {
        alert("Update failed: " + JSON.stringify(data.errors));
      }
    } catch (error) {
      alert("Server error while updating.");
    }
  };

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
      <Header viewerType={viewerType} />

      <div className="flex flex-col items-center justify-center py-16 px-4 relative z-10">
        <div className={`max-w-6xl w-full transform transition-all duration-1000 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-slate-800/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-700/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent animate-shimmer"></div>

            <div className="flex flex-col items-center space-y-4">
              {viewerType === "owner" && editingField === "photo" ? (
                <div className="flex flex-col items-center">
                  <input
                    type="text"
                    name="photo"
                    value={formData.photo}
                    onChange={handleChange}
                    className="bg-slate-700 text-white p-2 rounded mb-2"
                  />
                  <button onClick={() => handleSave("photo")} className="text-sm bg-purple-600 px-3 py-1 rounded">Save</button>
                </div>
              ) : (
                <img
                  src={profile.photo}
                  alt="User Profile"
                  className={`w-24 h-24 rounded-full border-2 border-purple-500 shadow-lg ${viewerType === "owner" ? "cursor-pointer" : ""}`}
                  onClick={() => viewerType === "owner" && setEditingField("photo")}
                />
              )}

              <h1 className="text-2xl font-bold flex items-center gap-2">
                @{profile.username || "Anonymous"}
              </h1>

              <div className="text-center">
                {viewerType === "owner" && editingField === "bio" ? (
                  <div className="space-y-2">
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="bg-slate-700 text-white p-2 rounded w-full"
                    />
                    <button onClick={() => handleSave("bio")} className="text-sm bg-purple-600 px-3 py-1 rounded">Save</button>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 flex items-center gap-2">
                    {profile.bio || "This user has not added a bio."}
                    {viewerType === "owner" && <Pencil className="w-4 h-4 cursor-pointer" onClick={() => setEditingField("bio")} />}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mt-6">
                {/* GitHub Card */}
                <div className="bg-[#0d1117] border border-gray-700 rounded-2xl shadow-xl p-4">
                  <h3 className="text-white text-lg font-semibold mb-2 flex items-center gap-2">
                    <Github className="w-5 h-5" /> GitHub Stats
                    {viewerType === "owner" && editingField !== "github" && (
                      <Pencil className="w-4 h-4 cursor-pointer ml-auto" onClick={() => setEditingField("github")} />
                    )}
                  </h3>
                  {viewerType === "owner" && editingField === "github" ? (
                    <div className="space-y-2">
                      <input
                        name="github"
                        value={formData.github}
                        onChange={handleChange}
                        className="bg-slate-700 text-white p-2 rounded w-full"
                      />
                      <button onClick={() => handleSave("github")} className="text-sm bg-purple-600 px-3 py-1 rounded">Save</button>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>

                {/* LeetCode Card */}
                <div className="bg-[#1d1d1f] border border-yellow-500/30 rounded-2xl shadow-xl p-4">
                  <h3 className="text-white text-lg font-semibold mb-2 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-yellow-400" /> LeetCode Stats
                    {viewerType === "owner" && editingField !== "leetcode" && (
                      <Pencil className="w-4 h-4 cursor-pointer ml-auto" onClick={() => setEditingField("leetcode")} />
                    )}
                  </h3>
                  {viewerType === "owner" && editingField === "leetcode" ? (
                    <div className="space-y-2">
                      <input
                        name="leetcode"
                        value={formData.leetcode}
                        onChange={handleChange}
                        className="bg-slate-700 text-white p-2 rounded w-full"
                      />
                      <button onClick={() => handleSave("leetcode")} className="text-sm bg-purple-600 px-3 py-1 rounded">Save</button>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  );
}
