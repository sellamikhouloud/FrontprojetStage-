import api from "@/lib/axios";

export const listDistributions = (params) => api.get("/api/distributions/", { params });

export const getDistribution = (id) => api.get(`/api/distributions/${id}/`);

export const updateDistribution = (id, patch) => api.patch(`/api/distributions/${id}/`, patch);

export const createDistribution = (payload) => api.post("api/distributions/", payload);

export const exportDistributions = (params) => api.get("/api/distributions/export/", {   params, responseType: "blob",});

export const annulerDistribution = (id) => api.post(`/api/distributions/${id}/annuler/`);

export const getPreCreationDistribution = (familleCode) => api.get("/api/distributions/pre-creation/", { params: { famille: familleCode } });

