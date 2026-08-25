import api from "@/lib/axios";

export const getNotifications = () => api.get("/api/alertes/notifications/");

export const getHistoriqueAlertes = () => api.get("/api/alertes/historique/");

export const exportHistoriqueAlertes = () => api.get("/api/alertes/historique/export/", {  responseType: "blob", });