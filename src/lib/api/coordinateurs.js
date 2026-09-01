import api from "@/lib/axios";

export const listCoordinateurs = (params) => api.get("/api/users/lister_coordinateurs/", { params });

export const createUser = (payload) => api.post("/api/users/", payload);

export const updateCoordinateur = (id, data) => api.patch(`/api/users/${id}/`, data);
 
export const activateCoordinateur = (id) => api.post(`/api/users/${id}/activate/`);

export const deactivateCoordinateur = (id) => api.post(`/api/users/${id}/deactivate/`);

export const exportUsers = (params) =>
  api.get("/api/users/export/", {
    params,
    responseType: "blob",
  });
