import api from "../axios";

// Login
export const postLogin = (username, password) =>
  api.post("/api/auth/login/", {
    username,
    password,
  });

// Logout
export const postLogout = () =>
  api.post("/api/auth/logout/");

// Get the currently authenticated user
export const getMe = () =>
  api.get("/api/auth/me/");