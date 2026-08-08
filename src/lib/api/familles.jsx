import api from "@/lib/axios";

export const listFamilles = (params) => api.get("/api/familles/", { params });

export const getFamille = (id) => api.get(`/api/familles/${id}/`);

export const updateFamille = (id, patch) => api.patch(`/api/familles/${id}/`, patch);
