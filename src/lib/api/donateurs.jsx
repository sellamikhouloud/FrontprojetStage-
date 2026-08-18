import api from "@/lib/axios";

export const createDonateur = (data) => api.post("/api/donateurs/", data);

export const getDonateurs = () => api.get("/api/donateurs/");
