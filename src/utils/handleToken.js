// utils/handleToken.js
import axios from 'axios';

// ✅ Get token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// ✅ Safe fetch with or without token — supports public + private routes
export const fetchWithToken = async (url, token, navigate) => {
  try {
    const headers = token ? { Authorization: `Token ${token}` } : {};

    const response = await axios.get(url, { headers });

    return response.data;
  } catch (error) {
    if (token) {
      // Token exists but invalid
      console.error("Invalid token or expired:", error);
      localStorage.removeItem("authToken");
      navigate("/login");
    } else {
      // Token is missing — assume guest, no alert
      console.warn("No token provided. Viewing as guest.");
    }
    return null;
  }
};

// ✅ Token handler: login + fetch ID + redirect
export const handleToken = async (username, password, navigate) => {
  try {
    const res = await fetch('http://localhost:8000/api/users/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.token) {
      return false;
    }

    // Save token
    localStorage.setItem('authToken', data.token);

    // Fetch user ID using token
    const idRes = await fetch('http://localhost:8000/api/users/get-id/', {
      headers: { Authorization: `Token ${data.token}` },
    });

    const idData = await idRes.json();

    if (!idRes.ok || !idData.profile_id) {
      return false;
    }

    // ✅ Redirect to profile
    navigate(`/profile/${idData.profile_id}`);
    return true;
  } catch (error) {
    console.error('Token handling error:', error);
    return false;
  }
};
