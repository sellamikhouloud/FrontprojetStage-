import api from "@/lib/axios";

export const listFamilles = (params) => api.get("/api/familles/", { params });

export const getFamille = (id) => api.get(`/api/familles/${id}/`);

export const searchMere = (params) => api.get("/api/meres/search/", { params });

export const createFamille = (payload) => api.post("/api/familles/", payload);

export const updateFamille = (id, patch) => api.patch(`/api/familles/${id}/`, patch);

export const marquerSortie = (id, data) =>  api.patch(`/api/familles/${id}/marquer-sortie/`, data);

export const getCourbes = (id) =>  api.get(`/api/familles/${id}/courbes/`);

export const getVisites = (id, params) => api.get(`/api/familles/${id}/visites/`, { params });

export const getDistributions = (id, params) => api.get(`/api/familles/${id}/distributions/`, { params });

export const getFamilleZakat = (id, params) => api.get(`/api/familles/${id}/zakat/`, { params });

export const exportFamilles = (params) =>
  api.get("/api/familles/export/", {
    params,
    responseType: "blob",
  });


