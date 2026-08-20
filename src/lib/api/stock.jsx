
import api from "@/lib/axios";

export function listProduits(params = {}) { return api.get("api/produits/", { params }); }

export function validerProduit(id, data) { return api.patch(`api/produits/${id}/valider/`, data); }

export const updateProduit = (id, patch) => api.patch(`/api/produits/${id}/`, patch);

export const ajouterStock = (id, payload) => api.patch(`/api/produits/${id}/ajouter-stock/`, payload);

export const modifierSeuil = (id, payload) => api.patch(`/api/produits/${id}/modifier_seuil/`, payload);

export const listStock = (params) => api.get("/api/produits/", { params });

export const CreateProduit  = (payload) => api.post("/api/produits/", payload);

