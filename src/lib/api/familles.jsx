import api from "@/lib/axios";

export const listFamilles = (params) => api.get("/api/familles/", { params });

export const getFamille = (id) => api.get(`/api/familles/${id}/`);

export const searchMere = (params) => api.get("/api/meres/search/", { params });

export const createFamille = (payload) => api.post("/api/familles/", payload);

export const updateFamille = (id, patch) => api.patch(`/api/familles/${id}/`, patch);

export const marquerSortie = (id, data) =>  api.patch(`/api/familles/${id}/marquer-sortie/`, data);

export const getCourbes = (id) =>  api.get(`/api/familles/${id}/courbes/`);

export const getVisites = (id) => api.get(`/api/familles/${id}/visites/`);

export const getDistributions = (id) =>  api.get(`/api/familles/${id}/distributions/`);

export const getFamilleZakat = (id) => api.get(`/api/familles/${id}/zakat/`);
