import api from "@/lib/axios";

export const listVisites = (params) => api.get("/api/visites/", { params });

export const getVisite = (id) => api.get(`/api/visites/${id}/`);

export const updateVisite = (id, patch) => api.patch(`/api/visites/${id}/`, patch);
