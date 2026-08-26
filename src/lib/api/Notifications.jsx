import api from "@/lib/axios";

export const getNotifications = () => api.get("/api/alertes/notifications/");

export const getHistoriqueAlertes = (params) =>api.get("/api/alertes/historique/", { params });

export const exportHistoriqueAlertes = () => api.get("/api/alertes/historique/export/", {  responseType: "blob", });
