import api from "@/lib/axios";

// ADMIN DASHBOARD
export const getDashboard = () => api.get("/api/dashboard/");
