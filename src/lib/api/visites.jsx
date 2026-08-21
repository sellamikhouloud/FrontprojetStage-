import api from "@/lib/axios";

export const listVisites = (params) => api.get("/api/visites/", { params });

export const getVisite = (id) => api.get(`/api/visites/${id}/`);

export const updateVisite = (id, patch) => api.patch(`/api/visites/${id}/`, patch);

export const createVisite = (payload) => api.post("/api/visites/", payload);

export const annulerVisite = (id) => api.post(`/api/visites/${id}/annuler/`);

export const getPreCreationVisite = (familleCode) => api.get("/api/visites/pre_creation/", {
    params: { famille: familleCode },
  });
