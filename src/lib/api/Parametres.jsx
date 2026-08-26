import api from "@/lib/axios";

export const listVillages = () => api.get("/api/villages/");

export const createVillage = (nom) => api.post("/api/villages/", { nom });

export const updateVillage = (id, nom) => api.patch(`/api/villages/${id}/`, { nom });

export const deleteVillage = (id) => api.delete(`/api/villages/${id}/`);

export const getTauxDeChange = () => api.get("/api/parametres/taux-de-change/");

export const updateTauxDeChange = (valeur) => api.patch("/api/parametres/taux-de-change/", { valeur });

export const getEmailsRapport = (params) => api.get("/api/parametres/emails-rapport/", { params });

export const createEmailRapport = (payload) => { 
  return api.post("/api/parametres/emails-rapport/", payload);
};
export const deleteEmailRapport = (id) => {
  return api.delete(`/api/parametres/emails-rapport/${id}/`);
};

export const getPreferences = () => api.get("/api/preferences/");

export const updatePreferences = (payload) => api.patch("/api/preferences/", payload);

export const getJoursGenerationRapports = () => api.get("/api/parametres/jours-generation-rapports/");

export const updateJoursGenerationRapports = (payload) => api.patch("/api/parametres/jours-generation-rapports/", payload);
