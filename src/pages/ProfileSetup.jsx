"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../components/ui/header';
import Footer from '../components/ui/footer';
import ProfileForm from "../components/forms/ProfileForm";
import { getAuthToken } from "../utils/handleToken";

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    photo: "",
    bio: "",
    github: "",
    leetcode: "",
  });

  const [loading, setLoading] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);

  // 🔐 Ensure user is authenticated
  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      const email = sessionStorage.getItem("email");
      const password = sessionStorage.getItem("password");

      if (email && password) {
        // Try logging in
        fetch("http://localhost:8000/api/users/login/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.token) {
              localStorage.setItem("authToken", data.token);
            } else {
              alert("Login failed. Please sign in again.");
              navigate("/signin");
            }
          })
          .catch(() => {
            alert("Error logging in.");
            navigate("/signin");
          })
          .finally(() => setTokenChecked(true));
      } else {
        navigate("/signin");
      }
    } else {
      setTokenChecked(true);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = getAuthToken();

    try {
      const response = await fetch("http://localhost:8000/api/users/profile/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        const idRes = await fetch("http://localhost:8000/api/users/get-id/", {
          headers: { Authorization: `Token ${token}` },
        });

        const idData = await idRes.json();

        if (idData.success) {
          navigate(`/profile/${idData.profile_id}`);
        } else {
          alert("Profile saved, but couldn't retrieve user ID.");
        }
      } else {
        alert("Failed to save profile: " + JSON.stringify(data.errors));
      }
    } catch (error) {
      alert("Server error while saving profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!tokenChecked) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        Checking session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <Header />
  
      <div className="max-w-xl mx-auto py-16 px-6">
        <div className="bg-slate-800/60 backdrop-blur-lg border border-purple-500/20 rounded-3xl shadow-2xl p-8 transition-all duration-300">
          <h1 className="text-3xl font-bold mb-6 text-center text-purple-300">
            Set Up Your Profile
          </h1>
  
          <ProfileForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </div>
  
      <Footer />
    </div>
  );
  
}
