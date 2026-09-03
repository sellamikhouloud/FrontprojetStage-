import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar/Sidebar";
import NavigationHeader from "@/components/Navigation,Pageheader/NavigationHeader";
import Spinner from "@/components/Spinner";
import NoResultImage from "@/assets/no result picture.svg";
import {
  listDrafts,
  deleteDraft,
  markDraftStatus,
} from "@/lib/offlineDrafts";
import PopupDetailBrouillonZakat from "@/components/Popups/PopupDetailBrouillonZakat";
import PopupDetailBrouillonVisite from "@/components/Popups/PopupDetailBrouillonVisite";
import PopupDetailBrouillonDistribution from "@/components/Popups/PopupDetailBrouillonDistribution";
import PopupDetailBrouillonFamille from "../components/Popups/Popupfamillebrouillon";
import { loadCache } from "@/lib/offlineCache";

import { createDistribution } from "@/lib/api/distributions";
import { createVisite } from "@/lib/api/visites";
import { createAideZakat } from "@/lib/api/zakat";

 import { createFamilleFromDraft } from "@/lib/api/familles";

const TYPE_LABELS = {
  famille: "Nouvelle famille",
  visite: "Visite",
  distribution: "Distribution",
  aide_zakat: "Aide zakat",
};


const TYPE_STYLES = {
  famille: {
    cardBg: "#EEF3FF",
    chipText: "#3B5BA9",
  },
  visite: {
    cardBg: "#FFE6EC",
    chipText: "#C24D6B",
  },
  distribution: {
    cardBg: "#ECF8F7",
    chipText: "#4E9F8A",
  },
  aide_zakat: {
    cardBg: "#FFF6E9",
    chipText: "#B9822E",
  },
};

const DEFAULT_TYPE_STYLE = {
  cardBg: "#F8FBFC",
  chipText: "#528583",
};


const SUBMIT_FN = {
  distribution: (payload) => createDistribution(payload),
  visite: (payload) => createVisite(payload),
  aide_zakat: (payload) => createAideZakat(payload),
  famille: (payload, files) => createFamilleFromDraft(payload, files),
};

const MONTH_VALUES = [
  "janvier", "fevrier", "mars", "avril", "mai", "juin",
  "juillet", "aout", "septembre", "octobre", "novembre", "decembre",
];


function extractBackendErrorMessage(error) {
  const data = error?.response?.data;

  if (!data) {
    return error?.message || "Échec de l'envoi. Réessayez une fois en ligne.";
  }

  if (typeof data === "string") {
    if (/<html[\s>]/i.test(data)) {
      return "Erreur inattendue côté serveur. Réessayez plus tard.";
    }
    return data;
  }

  if (Array.isArray(data)) {
    const messages = data.filter((m) => typeof m === "string");
    return messages.join(" — ") || "Échec de l'envoi. Réessayez une fois en ligne.";
  }

  if (data.detail) {
    return data.detail;
  }

  if (typeof data === "object") {
    const messages = [];

    Object.entries(data).forEach(([field, value]) => {
      const values = Array.isArray(value) ? value : [value];

      values.forEach((msg) => {
        if (typeof msg !== "string") return;
        if (field === "non_field_errors") {
          messages.push(msg);
        } else {
          messages.push(`${field} : ${msg}`);
        }
      });
    });

    if (messages.length > 0) {
      return messages.join(" — ");
    }
  }

  return "Échec de l'envoi. Réessayez une fois en ligne.";
}

function summarize(draft) {
  const { type, payload } = draft;
  if (type === "distribution") {
    const nbProduits = payload?.produits?.length ?? 0;
    return `Famille ${payload?.famille ?? "-"} · ${nbProduits} produit(s) · ${
      payload?.date_distribution ?? "-"
    }`;
  }
  if (type === "aide_zakat") {
    const montant = payload?.montant ? `${Number(payload.montant).toLocaleString("fr-FR")} MRU` : "-";
    return `Famille ${payload?.famille ?? "-"} · ${montant} · ${payload?.date_versement ?? "-"}`;
  }
  if (type === "visite") {
    return `Famille ${payload?.famille ?? payload?.code ?? "-"}`;
  }
  if (type === "famille") {
    return (
      `${payload?.mere?.nom ?? ""} ${payload?.mere?.prenom ?? ""}`.trim() ||
      "Nouvelle famille"
    );
  }
  return "-";
}

export default function BrouillonsHorsLigne() {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(null);
  const [detailZakatDraft, setDetailZakatDraft] = useState(null);
  const [detailVisiteDraft, setDetailVisiteDraft] = useState(null);
  const [detailDistributionDraft, setDetailDistributionDraft] = useState(null);
   const [detailFamilleDraft, setDetailFamilleDraft] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setIsError(false);
    try {
      const all = await listDrafts();
      setDrafts(all);
    } catch (error) {
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleAjouter = async (draft) => {
    const submit = SUBMIT_FN[draft.type];
    if (!submit) {
      await markDraftStatus(draft.clientId, "error", "Type de brouillon non pris en charge.");
      refresh();
      return;
    }

    await markDraftStatus(draft.clientId, "sending");
    refresh();

    try {
    
      await submit(
        { ...draft.payload, client_id: draft.clientId },
        draft.files
      );
      await deleteDraft(draft.clientId);
    } catch (error) {
      const message = extractBackendErrorMessage(error);
      await markDraftStatus(draft.clientId, "error", message);
    }
    refresh();
  };

  const handleSupprimer = async (draft) => {
    await deleteDraft(draft.clientId);
    setConfirmingDelete(null);
    refresh();
  };


  const handleCardClick = (draft) => {
    if (draft.type === "aide_zakat") {
      setDetailZakatDraft(draft);
    } else if (draft.type === "visite") {
      setDetailVisiteDraft(draft);
    } else if (draft.type === "distribution") {
      setDetailDistributionDraft(draft);
    }else if (draft.type === "famille") {
      setDetailFamilleDraft(draft);
    }
  };

  const handleEditZakatDraft = async (draft) => {
  
    const minimalFamille = {
      id: draft.payload?.famille,
      code: draft.payload?.famille,
      enfant: undefined,
      mere: undefined,
      sexe: "-",
      region: "-",
      naissance: undefined,
      badges: [{ type: "retard", text: "Depuis un brouillon — non re-vérifié" }],
    };

 
    await deleteDraft(draft.clientId);
    setDetailZakatDraft(null);

    navigate("/ajout-zakat", {
      state: {
        draft: {
          selectedFamille: minimalFamille,
          date: draft.payload?.date_versement
            ? new Date(draft.payload.date_versement)
            : new Date(),
          confirmed: draft.payload?.confirmation ?? false,
          montant: draft.payload?.montant ? String(draft.payload.montant) : "",
          modePaiement: draft.payload?.mode_remise ?? null,
          causePrincipale: draft.payload?.cause_principale ?? null,
          precisions: draft.payload?.precisions ?? "",
          observations: draft.payload?.observation ?? "",
        },
      },
    });
  };

  const handleDeleteZakatDraft = async (draft) => {
    await deleteDraft(draft.clientId);
    setDetailZakatDraft(null);
    refresh();
  };

  const handleEditVisiteDraft = async (draft) => {
    const p = draft.payload || {};

    const minimalFamille = {
      id: p.famille,
      code: p.famille,
      enfant: undefined,
      mere: undefined,
      sexe: "-",
      region: "-",
      naissance: undefined,
      badges: [{ type: "retard", text: "Depuis un brouillon — non re-vérifié" }],
    };

   
    const positionNourrisson =
      p.mesure_couchee === true ? false : p.mesure_couchee === false ? true : null;

    const mois = p.month ? MONTH_VALUES[p.month - 1] ?? null : null;

    await deleteDraft(draft.clientId);
    setDetailVisiteDraft(null);

    navigate("/ajout-visite", {
      state: {
        draft: {
          selectedFamille: minimalFamille,
          date: p.date_visite ? new Date(p.date_visite) : new Date(),
          mois,
       
          poidsNourrisson: p.poids_bebe != null ? String(p.poids_bebe) : "",
          tailleNourrisson: p.taille_bebe != null ? String(p.taille_bebe) : "",
          muacNourrisson: p.muac_bebe != null ? String(p.muac_bebe) : "",
          positionNourrisson,
          observationsNourrisson: p.observations_cliniques_bebe ?? "",
          poidsMere: p.poids_mere != null ? String(p.poids_mere) : "",
          tailleMere: p.taille_mere != null ? String(p.taille_mere) : "",
          muacMere: p.muac_mere != null ? String(p.muac_mere) : "",
          observationsMere: p.observations_cliniques_mere ?? "",
          evaluationVisuelle: p.evaluation_famille ?? "",
          hemoglobine: p.hemoglobine ?? "",
        },
      },
    });
  };
  const handleEditFamilleDraft = async (draft) => {
  await deleteDraft(draft.clientId);

  setDetailFamilleDraft(null);

  navigate("/information-mere", {
    state: {
      draftFamille: draft,
    },
  });
};

  const handleDeleteVisiteDraft = async (draft) => {
    await deleteDraft(draft.clientId);
    setDetailVisiteDraft(null);
    refresh();
  };

  const STOCK_CACHE_KEY = "stock-produits";

  const handleEditDistributionDraft = async (draft) => {
    const p = draft.payload || {};

    const minimalFamille = {
      id: p.famille,
      code: p.famille,
      enfant: undefined,
      mere: undefined,
      sexe: "-",
      region: "-",
      naissance: undefined,
      badges: [{ type: "retard", text: "Depuis un brouillon — non re-vérifié" }],
    };

    // The draft only stores { produit: id, quantite } — AjoutDistribution's
    // form state needs { id, title, quantity, unit, maxQuantity } for normal
    // products, and separate laitType/selectedLaitOption/boxes state for
    // milk. Resolve ids against the same "stock-produits" cache the popup
    // uses, so the form pre-fills with readable names instead of just ids.
    const stockCache = loadCache(STOCK_CACHE_KEY);
    const stockData = stockCache?.data;
    const stockProduits = stockData?.produits || [];
    const laitTypes = stockData?.lait || {};

    const products = [];
    let laitType = null;
    let selectedLaitOption = null;
    let boxes = 0;

    (p.produits || []).forEach((item) => {
      const stockMatch = stockProduits.find((sp) => sp.id === item.produit);
      if (stockMatch) {
        products.push({
          id: stockMatch.id,
          title: stockMatch.nom,
          quantity: Number(item.quantite),
          unit: stockMatch.unite === "boite" ? "boîtes" : stockMatch.unite ?? "",
          maxQuantity: Number(item.quantite),
        });
        return;
      }

      for (const [typeKey, options] of Object.entries(laitTypes)) {
        const laitMatch = (options || []).find((o) => o.id === item.produit);
        if (laitMatch) {
          laitType = typeKey;
          selectedLaitOption = laitMatch;
          boxes = Number(item.quantite);
          return;
        }
      }

      // Not found in cache at all — keep it as a plain product so it isn't
      // silently dropped, just with no readable name available.
      products.push({
        id: item.produit,
        title: `Produit #${item.produit}`,
        quantity: Number(item.quantite),
        unit: "",
        maxQuantity: Number(item.quantite),
      });
    });

    // Same reasoning as zakat/visite: delete now, so re-submitting from
    // AjoutDistribution creates one fresh draft instead of leaving this one
    // behind as a duplicate.
    await deleteDraft(draft.clientId);
    setDetailDistributionDraft(null);

    navigate("/ajout-distribution", {
      state: {
        draft: {
          selectedFamille: minimalFamille,
          products,
          date: p.date_distribution ? new Date(p.date_distribution) : new Date(),
          confirmed: p.reception_confirmee ?? false,
          laitType,
          selectedLaitOption,
          boxes,
        },
      },
    });
  };


  const handleDeleteDistributionDraft = async (draft) => {
    await deleteDraft(draft.clientId);
    setDetailDistributionDraft(null);
    refresh();
  };
  const handleDeleteFamilleDraft = async (draft) => {
  await deleteDraft(draft.clientId);
  setDetailFamilleDraft(null);
  refresh();
};

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-5 pt-18 md:pt-0 pb-8 lg:p-10 bg-white">
        <NavigationHeader title="Brouillons hors ligne" />

        <p className="text-sm text-gray-500 my-4">
          Enregistrements créés hors connexion. Rien n'est envoyé au serveur
          tant que vous n'avez pas cliqué sur « Ajouter » pour chacun.
        </p>

        {isError && (
          <div className="text-center text-red-500 py-6">
            <p>Impossible de charger les brouillons.</p>
            <button onClick={() => refresh()} className="mt-2 underline">
              Réessayer
            </button>
          </div>
        )}

        {loading && !isError && (
          <div className="flex justify-center items-center py-10 md:py-20">
            <Spinner />
          </div>
        )}

        {!loading && !isError && drafts.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-10 md:py-20 px-4">
            <img
              src={NoResultImage}
              alt="Aucun brouillon"
              className="w-56 sm:w-72 md:w-96 h-auto"
            />
            <p className="text-gray-500 mt-4">Aucun brouillon en attente.</p>
          </div>
        )}

        {!loading && !isError && drafts.length > 0 && (
          <div className="w-full flex-1 space-y-3">
            {drafts.map((draft) => {
              const style = TYPE_STYLES[draft.type] ?? DEFAULT_TYPE_STYLE;

              return (
                <div
                  key={draft.clientId}
                  onClick={() => handleCardClick(draft)}
                 className={`w-full border border-gray-100 rounded-2xl shadow-sm p-4 md:p-5 flex flex-col gap-3 transition-colors ${
                  draft.type === "aide_zakat" ||
                  draft.type === "visite" ||
                  draft.type === "distribution" ||
                  draft.type === "famille"
                  ? "cursor-pointer"
                     : ""
                   }`}
                  style={{
                    backgroundColor: style.cardBg,
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="min-w-0">
                      <span
                        className="inline-block text-xs font-semibold uppercase tracking-wide rounded-full px-2.5 py-1 mb-2"
                        style={{
                          color: style.chipText,
                          backgroundColor: "rgba(255,255,255,0.7)",
                        }}
                      >
                        {TYPE_LABELS[draft.type] ?? draft.type}
                      </span>
                      <p className="text-[15px] text-gray-800 font-medium truncate">
                        {summarize(draft)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Créé le {new Date(draft.createdAt).toLocaleString("fr-FR")}
                      </p>
                    </div>

                    <div
                      className="flex gap-2 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleAjouter(draft)}
                        disabled={draft.status === "sending"}
                        className="text-sm font-medium text-white bg-[#4E9F8A] hover:bg-[#438a77] rounded-full px-5 py-2 transition-colors disabled:opacity-50"
                      >
                        {draft.status === "sending" ? "Envoi..." : "Ajouter"}
                      </button>

                      {confirmingDelete === draft.clientId ? (
                        <>
                          <button
                            onClick={() => handleSupprimer(draft)}
                            className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-full px-4 py-2 transition-colors"
                          >
                            Confirmer
                          </button>
                          <button
                            onClick={() => setConfirmingDelete(null)}
                            className="text-sm font-medium text-gray-600 rounded-full px-4 py-2"
                          >
                            Annuler
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setConfirmingDelete(draft.clientId)}
                          className="text-sm font-medium text-red-600 hover:bg-red-50/60 rounded-full px-4 py-2 transition-colors"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>

                  {draft.status === "error" && draft.error && (
  <div className="border-t border-white/60 pt-3">
    <p className="text-sm font-bold text-red-600 bg-red-50 rounded-lg px-3 py-2">
      {draft.error}
    </p>
  </div>
)}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <PopupDetailBrouillonZakat
        open={!!detailZakatDraft}
        draft={detailZakatDraft}
        onClose={() => setDetailZakatDraft(null)}
        onEdit={handleEditZakatDraft}
        onDelete={handleDeleteZakatDraft}
      />

      <PopupDetailBrouillonVisite
        open={!!detailVisiteDraft}
        draft={detailVisiteDraft}
        onClose={() => setDetailVisiteDraft(null)}
        onEdit={handleEditVisiteDraft}
        onDelete={handleDeleteVisiteDraft}
      />

      <PopupDetailBrouillonDistribution
        open={!!detailDistributionDraft}
        draft={detailDistributionDraft}
        onClose={() => setDetailDistributionDraft(null)}
        onEdit={handleEditDistributionDraft}
        onDelete={handleDeleteDistributionDraft}
      />
     <PopupDetailBrouillonFamille
  open={!!detailFamilleDraft}
  draft={detailFamilleDraft}
  onClose={() => setDetailFamilleDraft(null)}
  onEdit={handleEditFamilleDraft}
  onDelete={handleDeleteFamilleDraft}
/>
    </div>
  );
}