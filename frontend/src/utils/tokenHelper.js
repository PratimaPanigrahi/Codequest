// src/utils/tokenHelper.js

// Save token with optional expiry (default: 30 days)
export const setToken = (token, expiresIn = 2592000) => {
  if (token) {
    const expiryTime = new Date().getTime() + expiresIn * 1000;
    const tokenData = { token, expiry: expiryTime };
    localStorage.setItem("token", JSON.stringify(tokenData));
  }
};

// Get token from localStorage, check expiry
export const getToken = () => {
  const tokenString = localStorage.getItem("token");
  if (!tokenString) return null;

  try {
    const { token, expiry } = JSON.parse(tokenString);

    if (new Date().getTime() > expiry) {
      removeToken(); // token expired
      return null;  // do NOT redirect here
    }

    return token;
  } catch {
    removeToken();
    return null;
  }
};

// Remove token from localStorage
export const removeToken = () => localStorage.removeItem("token");

// Check if user is logged in (token exists and not expired)
export const isLoggedIn = () => !!getToken();
