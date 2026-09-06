import api from "@/lib/axios";

// PHOTOS

export const listPhotos = (params) =>
  api.get("/api/photos/", { params });

export const getPhoto = (id) =>
  api.get(`/api/photos/${id}/`);

export const createPhoto = (formData) =>
  api.post("/api/photos/", formData);

export const updatePhoto = (id, patch) =>
  api.patch(`/api/photos/${id}/`, patch);

export const approvePhoto = (id) =>
  api.post(`/api/photos/${id}/approve/`);

export const refusePhoto = (id, data) =>
  api.post(`/api/photos/${id}/refuser/`, data);

export const reexaminePhoto = (id) =>
  api.post(`/api/photos/${id}/reexaminer/`);


export const getBilanCandidates = (params) =>
  api.get("/api/photos/bilan_candidates/", { params });

export const saveBilanSelection = (photoIds) =>
  api.post("/api/photos/bilan/", {
    photo_ids: photoIds,
  });

export const getPendingCount = () =>
  api.get("/api/photos/en_attente_count/");

// VILLAGES

export const listVillages = () =>
  api.get("/api/villages/");
