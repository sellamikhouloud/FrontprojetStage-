import api from "@/lib/axios";

export const listVillages = () => api.get("/api/villages/");

export const getTauxDeChange = () => api.get("/api/parametres/taux-de-change/");
