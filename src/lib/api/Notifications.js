import api from "@/lib/axios";


export const getNotifications = (params) => api.get("/api/alertes/notifications/", { params });

export const getHistoriqueAlertes = (params) =>api.get("/api/alertes/historique/", { params });

export const exportHistoriqueAlertes = (params) =>
  api.get("/api/alertes/historique/export/", {
    params,
    responseType: "blob",
  });
