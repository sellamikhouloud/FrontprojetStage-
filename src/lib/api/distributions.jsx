import api from "@/lib/axios";

export const listDistributions = (params) => api.get("/api/distributions/", { params });

export const getDistribution = (id) => api.get(`/api/distributions/${id}/`);

export const updateDistribution = (id, patch) => api.patch(`/api/distributions/${id}/`, patch);

export const listStock = (params) => api.get("/api/produits/", { params });

export const CreateProduit  = (payload) => api.post("/api/produits/", payload);

export const updateProduit = (id, patch) => api.patch(`/api/produits/${id}/`, patch);
