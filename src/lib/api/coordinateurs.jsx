import api from "@/lib/axios";

export const listCoordinateurs = (params) => api.get("/api/users/lister_coordinateurs/", { params });

export const createUser = (payload) => api.post("/api/users/", payload);
