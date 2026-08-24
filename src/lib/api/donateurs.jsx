import api from "@/lib/axios";

export const createDonateur = (data) => api.post("/api/donateurs/", data);

export const listDonateurs = (params) => api.get("/api/donateurs/", { params });

export const getDonateur = (id) => api.get(`/api/donateurs/${id}/`);

export const updateDonateur = (id, patch) => api.patch(`/api/donateurs/${id}/`, patch);
