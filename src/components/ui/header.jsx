import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = ({ viewerType: propViewerType }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [viewerType, setViewerType] = useState('guest');
  const [orgId, setOrgId] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);

  const token = localStorage.getItem('authToken');

  const isOrgDashboardPage = location.pathname.startsWith('/org-dashboard');
  const isOrgRegisterPage = location.pathname === '/register-org';
  const isDefaultPage = ['/', '/login', '/signup', '/about'].includes(location.pathname);

  useEffect(() => {
    if (!token) {
      setViewerType('guest');
    } else if (propViewerType === 'owner') {
      setViewerType('owner');
    } else {
      setViewerType('authenticated');
    }

    if (token) {
      // Check profile
      fetch('http://localhost:8000/api/users/get-id/', {
        headers: { Authorization: `Token ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) setHasProfile(true);
        })
        .catch(() => setHasProfile(false));

      // Check organization
      fetch('http://localhost:8000/api/organization/get-org-id/', {
        headers: { Authorization: `Token ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data.organization_id) {
            setOrgId(data.organization_id);
          } else {
            setOrgId(null); // gracefully handle non-org users
          }
        })
        .catch(() => setOrgId(null));
    }
  }, [location.pathname, propViewerType, token]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setViewerType('guest');
    navigate('/login');
  };

  const handleBackToProfile = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/users/get-id/', {
        headers: { Authorization: `Token ${token}` },
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
        <span className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          InterXAI
        </span>
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

        {/* -------- OWNER -------- */}
        {viewerType === 'owner' && (
          <>
            {isOrgDashboardPage ? (
              <>
                <button
                  onClick={handleBackToProfile}
                  className="text-gray-300 hover:text-white text-lg font-medium relative group"
                >
                  Back to Profile
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
                </button>
                <a
                  href="/interview"
                  className="text-gray-300 hover:text-white text-lg font-medium relative group"
                >
                  Set Interview
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
                </a>
              </>
            ) : orgId ? (
              <a
                href={`/org-dashboard/${orgId}`}
                className="text-gray-300 hover:text-white text-lg font-medium relative group"
              >
                Go to Organization
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            ) : (
              <a
                href="/register-org"
                className="text-gray-300 hover:text-white text-lg font-medium relative group"
              >
                Register as Organization
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            )}
            <button onClick={handleLogout} className="text-red-400 hover:text-white text-lg font-medium relative group">
              Logout
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
            </button>
          </>
        )}

        {/* -------- AUTHENTICATED -------- */}
        {viewerType === 'authenticated' && hasProfile && (
          <>
            {(isOrgDashboardPage || isOrgRegisterPage) ? (
              <button
                onClick={handleBackToProfile}
                className="text-gray-300 hover:text-white text-lg font-medium relative group"
              >
                Back to Profile
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
              </button>
            ) : orgId ? (
              <a
                href={`/org-dashboard/${orgId}`}
                className="text-purple-300 hover:text-white text-lg font-medium relative group"
              >
                Go to Organization
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            ) : (
              <a
                href="/register-org"
                className="text-gray-300 hover:text-white text-lg font-medium relative group"
              >
                Register as Organization
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            )}
            <button onClick={handleLogout} className="text-red-400 hover:text-white text-lg font-medium relative group">
              Logout
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
            </button>
          </>
        )}

        {/* -------- GUEST -------- */}
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
