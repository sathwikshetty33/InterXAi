import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ viewerType }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleBackToProfile = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch('http://localhost:8000/api/users/get-id/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        navigate(`/profile/${data.profile_id}`);
      }
    } catch (err) {
      console.error("Error navigating to profile:", err);
    }
  };

  return (
    <nav className="flex items-center justify-between px-16 py-8 bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <div className="flex relative">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse"></div>
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full -ml-4 animate-pulse delay-150"></div>
        </div>
        <span className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">InterXAI</span>
      </div>

      <div className="flex items-center space-x-12">
        <a href="/" className="text-white hover:text-purple-300 text-lg font-medium relative group">
          Home
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
        </a>
        <a href="/about" className="text-gray-300 hover:text-white text-lg font-medium relative group">
          About
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
        </a>

        {viewerType === 'owner' && (
          <button onClick={handleLogout} className="text-red-400 hover:text-white text-lg font-medium">
            Logout
          </button>
        )}

        {viewerType === 'authenticated' && (
          <button onClick={handleBackToProfile} className="text-purple-400 hover:text-white text-lg font-medium">
            Back to Profile
          </button>
        )}

        {viewerType === 'guest' && (
          <>
            <a href="/login" className="text-gray-300 hover:text-white text-lg font-medium">Login</a>
            <a href="/signup" className="text-gray-300 hover:text-white text-lg font-medium">Sign Up</a>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
