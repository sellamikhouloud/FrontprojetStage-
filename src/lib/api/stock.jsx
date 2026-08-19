
import api from "@/lib/axios";

export function listProduits(params = {}) { return api.get("api/produits/", { params }); }

export function validerProduit(id, data) { return api.patch(`api/produits/${id}/valider/`, data); }