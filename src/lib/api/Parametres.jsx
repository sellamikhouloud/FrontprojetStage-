import api from "@/lib/axios";

export const listVillages = () => api.get("/api/villages/");
