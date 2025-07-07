// utils/handleToken.js
import axios from 'axios';

export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

export const fetchWithToken = async (url, token, navigate) => {
  if (!token) {
    alert("No token found. Please login first.");
    navigate("/login");
    return null;
  }

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch:", error);
    alert("Invalid or expired token. Please login again.");
    navigate("/login");
    return null;
  }
};

// ✅ Add this function for login + token + navigation
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

    localStorage.setItem('authToken', data.token);

    const idRes = await fetch('http://localhost:8000/api/users/get-id/', {
      headers: { Authorization: `Token ${data.token}` },
    });

    const idData = await idRes.json();

    if (!idRes.ok || !idData.profile_id) {
      return false;
    }

    // ✅ Navigate to the profile dashboard
    navigate(`/profile/${idData.profile_id}`);
    return true;
  } catch (error) {
    console.error('Token handling error:', error);
    return false;
  }
};
