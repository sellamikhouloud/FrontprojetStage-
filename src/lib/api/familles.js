import api from "@/lib/axios";

export const listFamilles = (params) => api.get("/api/familles/", { params });

export const getFamille = (id) => api.get(`/api/familles/${id}/`);

export const searchMere = (params) => api.get("/api/meres/search/", { params });

export const createFamille = (payload) => api.post("/api/familles/", payload);

export const updateFamille = (id, patch) => api.patch(`/api/familles/${id}/`, patch);

export const marquerSortie = (id, data) =>  api.patch(`/api/familles/${id}/marquer-sortie/`, data);

export const getCourbes = (id) =>  api.get(`/api/familles/${id}/courbes/`);

export const getVisites = (id, params) => api.get(`/api/familles/${id}/visites/`, { params });

export const getDistributions = (id, params) => api.get(`/api/familles/${id}/distributions/`, { params });

export const getFamilleZakat = (id, params) => api.get(`/api/familles/${id}/zakat/`, { params });

export const exportFamilles = (params) =>
  api.get("/api/familles/export/", {
    params,
    responseType: "blob",
  });


  export async function createFamilleFromDraft(payload, files) {
  const { mere, nourrissons, nourrissonClientIds, client_id, ...rest } = payload;
  const photo = files?.photo instanceof File ? files.photo : null;
  let currentIdMere = null;
  const resultats = [];

  for (let i = 0; i < nourrissons.length; i++) {
  
    const itemClientId = nourrissonClientIds?.[i] ?? crypto.randomUUID();

    const searchResponse = await searchMere({
      nom: mere.nom,
      prenom: mere.prenom,
      date_naissance: mere.date_naissance,
    });
    const searchedIdMere = searchResponse.data?.id ?? null;
    if (searchedIdMere) {
      currentIdMere = searchedIdMere;
    }

    let sendPayload;
    if (photo) {
      sendPayload = new FormData();
      Object.entries(mere || {}).forEach(([key, value]) => {
        if (value === null || value === undefined) return;
        sendPayload.append(`mere.${key}`, value);
      });
      sendPayload.append("mere.photo", photo);
      if (currentIdMere) {
        sendPayload.append("id_mere", currentIdMere);
      }
      Object.entries(nourrissons[i] || {}).forEach(([key, value]) => {
        if (value === null || value === undefined) return;
        sendPayload.append(`nourrisson.${key}`, value);
      });
      sendPayload.append("date_entree", rest.date_entree ?? "");
      sendPayload.append("statut", rest.statut ?? "");
      if (rest.date_sortie) sendPayload.append("date_sortie", rest.date_sortie);
      if (rest.motif_sortie) sendPayload.append("motif_sortie", rest.motif_sortie);
      if (rest.coordinateur) sendPayload.append("coordinateur", rest.coordinateur);
      sendPayload.append("client_id", itemClientId);
    } else {
      sendPayload = {
        mere: { ...mere, photo: null },
        id_mere: currentIdMere || undefined,
        nourrisson: nourrissons[i],
        date_entree: rest.date_entree,
        statut: rest.statut,
        date_sortie: rest.date_sortie,
        motif_sortie: rest.motif_sortie,
        coordinateur: rest.coordinateur,
        client_id: itemClientId,
      };
    }

    const response = await createFamille(sendPayload);
    resultats.push(response.data);

    if (!currentIdMere) {
      const searchAfterCreate = await searchMere({
        nom: mere.nom,
        prenom: mere.prenom,
        date_naissance: mere.date_naissance,
      });
      currentIdMere = searchAfterCreate.data?.id ?? currentIdMere;
    }
  }

  return resultats;
}


