import api from "@/lib/axios";

export const listUsers = (params) => api.get("/api/users/", { params });

export const checkUsernameExists = (username) => api.get("/api/users/username_existe/", { params: { username } });

export const getUserById = (id) => { return api.get(`/api/users/${id}/`)};





