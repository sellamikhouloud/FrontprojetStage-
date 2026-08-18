import api from "@/lib/axios";

export const createDonateur = (data) => api.post("/api/donateurs/", data);

export const listDonateurs = (params) => api.get("/api/donateurs/", { params });
