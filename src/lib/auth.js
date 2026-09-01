import {
  postLogin,
  postLogout,
  getMe,
  patchMe,
} from "./api/auth";

import { fetchCSRFToken } from "./axios";

const AUTH_USER_KEY = "nutrigest:auth:user";

// LOGIN
export async function login(username, password) {
  // Get CSRF cookie first
  await fetchCSRFToken();

  const { data } = await postLogin(username, password);

  // Save the user locally for offline session restoration
  localStorage.setItem(
    AUTH_USER_KEY,
    JSON.stringify(data.user)
  );

  return data.user;
}

// LOGOUT
export async function logout() {
  try {
    await fetchCSRFToken();
    await postLogout();
  } catch {
    // Ignore logout errors
  } finally {
    // Always remove the local offline session
    localStorage.removeItem(AUTH_USER_KEY);
  }
}

// GET CURRENT USER
export async function getCurrentUser() {
  try {
    // Try the real backend first
    const { data } = await getMe();

    // Refresh the cached user
    localStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify(data)
    );

    return data;
  } catch {
    // Backend unavailable → try cached user
    try {
      const cachedUser = localStorage.getItem(AUTH_USER_KEY);

      if (!cachedUser) {
        return null;
      }

      return JSON.parse(cachedUser);
    } catch {
      return null;
    }
  }
}

export async function updateCurrentUser(payload) {
  await fetchCSRFToken();

  const { data } = await patchMe(payload);

  // Keep offline user information up to date
  localStorage.setItem(
    AUTH_USER_KEY,
    JSON.stringify(data)
  );

  return data;
}
