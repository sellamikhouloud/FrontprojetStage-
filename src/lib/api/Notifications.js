import api from "@/lib/axios";


export const getNotifications = (params) => api.get("/api/alertes/notifications/", { params });

export const getHistoriqueAlertes = (params) =>api.get("/api/alertes/historique/", { params });

export const exportHistoriqueAlertes = () => api.get("/api/alertes/historique/export/", {  responseType: "blob", });
