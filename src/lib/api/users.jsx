import api from "@/lib/axios";

export const listUsers = (params) => api.get("/api/users/", { params });

