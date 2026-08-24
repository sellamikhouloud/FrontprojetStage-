import api from "@/lib/axios";

export const listVillages = () => api.get("/api/villages/");

export const getTauxDeChange = () => api.get("/api/parametres/taux-de-change/");

export const getEmailsRapport = (params) => api.get("/api/parametres/emails-rapport/", { params });
