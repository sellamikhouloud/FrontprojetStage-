
import api from "@/lib/axios";

export const getRapportMensuel = (annee, mois) =>
  api.get("/api/rapports/", {
    params: { annee, type: "mensuel", mois },
  });

export const getRapportBilanDonateur = (annee, mois) =>
  api.get("/api/rapports/", {
    params: { annee, type: "bilan_donateur", mois },
  });

export const getRapportAnnuel = (annee) =>
  api.get("/api/rapports/", {
    params: { annee, type: "annuel" },
  });

 
  export const validerRapport = (id, message) =>
  api.patch(`/api/rapports/${id}/valider/`, { message });

export const genererPdfRapport = (id) =>
  api.get(`/api/rapports/${id}/generer_pdf/`, {
    responseType: "blob", // important pour recevoir un fichier binaire
  });
  
