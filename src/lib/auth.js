import {
  postLogin,
  postLogout,
  getMe,
  patchMe,
} from "./api/auth";

import { fetchCSRFToken } from "./axios";

// LOGIN
export async function login(username, password) {

  // Get CSRF cookie first
  await fetchCSRFToken();

  const { data } = await postLogin(
    username,
    password
  );

  return data.user;
}

// LOGOUT
export async function logout() {
  try {
    // Get CSRF cookie first
    await fetchCSRFToken();

    await postLogout();
  } catch {
    // Ignore logout errors
  }
}


export async function getCurrentUser() {
  try {

    const { data } = await getMe();

    return data;
  } catch {
    return null;
  }
}

export async function updateCurrentUser(payload) {
  await fetchCSRFToken();
  const { data } = await patchMe(payload);
  return data;
}
