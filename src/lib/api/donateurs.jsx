import api from "@/lib/axios";

export const createDonateur = (data) => api.post("/api/donateurs/", data);

export const listDonateurs = (params) => api.get("/api/donateurs/", { params });

export const getDonateur = (id) => api.get(`/api/donateurs/${id}/`);

export const updateDonateur = (id, patch) => api.patch(`/api/donateurs/${id}/`, patch);

export const importDonateurs = (file) => {
  const fd = new FormData();
  fd.append("file", file);

  return api.post("/api/donateurs/import/", fd);
};

export const exportDonateurs = () =>
  api.get("/api/donateurs/export/", { responseType: "blob" });

export const exportImportRapportPdf = (payload) =>
  api.post("/api/donateurs/import/rapport-pdf/", payload, {
    responseType: "blob",
  });
