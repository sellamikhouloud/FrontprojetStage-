import api from "@/lib/axios";

export const listAidesZakat = (params) => api.get("/api/zakat/aides/", { params });

export const getAideZakat = (id) =>  api.get(`/api/zakat/aides/${id}/`);

export const createAideZakat = (data) => api.post("/api/zakat/aides/", data);

export const updateAideZakat = (id, patch) => api.patch(`/api/zakat/aides/${id}/`, patch);

export const annulerAideZakat = (id) => api.post(`/api/zakat/aides/${id}/annuler/`);

export const createVersementSolde = (data) =>  api.post("/api/zakat/versements-solde/", data);

export const listVersementsSolde = (params) => api.get("/api/zakat/versements-solde/", { params });

export const getVersementSolde = (id) => api.get(`/api/zakat/versements-solde/${id}/`);

export const getSoldeActuel = () => api.get("/api/zakat/versements-solde/solde_actuel/");

export const getDerniereZakatFamille = (params) => api.get("/api/zakat/aides/derniere/", { params });

export const getZakatDashboard = () => api.get("/api/zakat/dashboard/");

export const exportAidesZakat = () => api.get("/api/zakat/aides/export", { responseType: "blob", });

export const updateVersementSolde = (id, data) => api.patch(`/api/zakat/versements-solde/${id}/`, data);
