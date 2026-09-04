import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import InfoCard from "../Containers/AfficherContainer";
import Button from "../Button/Button";
import Card from "../Cards/Card";
import CardPopup from "../Cards/Card2";


import quitter from "../../assets/quitter.svg";
import EditIcon from "../../assets/Container.svg";
import DeleteIcon from "../../assets/Delete.svg";

import Popup from "./SuccessPopup";
import SuccessImage from "../../assets/Confirm.svg";

import { loadCache } from "@/lib/offlineCache";
import { getFamille } from "../../lib/api/familles";

const STOCK_CACHE_KEY = "stock-produits";

const formatDate = (date) => {
  if (!date) return "-";
  const [y, m, d] = String(date).split("-");
  if (!y || !m || !d) return date;
  return `${d}/${m}/${y}`;
};

const LAIT_TYPE_LABELS = {
  "1er_age": "Lait 1er âge",
  "2eme_age": "Lait 2e âge",
};


function resolveProductLine(produitId, quantite, stockCacheData) {
  const produits = stockCacheData?.produits || [];
  const match = produits.find((p) => p.id === produitId);
  if (match) {
    const unite = match.unite === "boite" ? "boîtes" : match.unite ?? "";
    return { nom: match.nom, quantiteLabel: `${quantite} ${unite}`.trim(), isLait: false };
  }

  const laitTypes = stockCacheData?.lait || {};
  for (const [typeKey, options] of Object.entries(laitTypes)) {
    const laitMatch = (options || []).find((o) => o.id === produitId);
    if (laitMatch) {
      const label = LAIT_TYPE_LABELS[typeKey] ?? "Lait infantile";
      const grammage = laitMatch.grammage ? ` ${laitMatch.grammage}g` : "";
      return {
        nom: `${label}${grammage}`,
        quantiteLabel: `${quantite} boîtes`,
        isLait: true,
      };
    }
  }

  return { nom: `Produit #${produitId}`, quantiteLabel: `${quantite}`, isLait: false };
}


export default function PopupDetailBrouillonDistribution({
  open,
  onClose,
  draft,
  onEdit,
  onDelete,
}) {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [familleData, setFamilleData] = useState(null);
  const [familleLoading, setFamilleLoading] = useState(false);




    useEffect(() => {
  if (!open || !draft) return;

  const code = draft.payload?.famille;

  if (!code) {
    setFamilleData(null);
    return;
  }

  const loadFamille = async () => {
    try {
      setFamilleLoading(true);

      const response = await getFamille(code);

      setFamilleData(response.data);
    } catch (error) {
      console.error("Erreur récupération famille :", error);
      setFamilleData(null);
    } finally {
      setFamilleLoading(false);
    }
  };

  loadFamille();
}, [open, draft]);


  if (!open || !draft) return null;

  const payload = draft.payload || {};
  const stockCache = loadCache(STOCK_CACHE_KEY);

    
const familleCard = familleData
  ? {
      id: familleData.id,
      enfant: familleData.nourrisson?.prenom,
      mere: `${familleData.mere?.nom ?? ""} ${familleData.mere?.prenom ?? ""}`,
      sexe:
        familleData.nourrisson?.sexe === "M"
          ? "Fils"
          : familleData.nourrisson?.sexe === "F"
          ? "Fille"
          : "-",
      region: familleData.mere?.village?.nom ?? "-",
      naissance: familleData.nourrisson?.date_naissance,
      code: familleData.id,
      badges: [
        familleData.statut_nutritionnel_bebe === "mam" && {
          type: "mam",
          text: "MAM nourrisson",
        },
        familleData.statut_nutritionnel_bebe === "mas" && {
          type: "mas",
          text: "MAS nourrisson",
        },
        familleData.statut_nutritionnel_bebe === "normale" && {
          type: "mere",
          text: "Nourrisson normal",
        },
        familleData.statut_nutritionnel_mere === "normale" && {
          type: "mere",
          text: "Mère normale",
        },
        familleData.statut_nutritionnel_mere === "a_risque" && {
          type: "risque",
          text: "Mère à risque",
        },
        familleData.statut_nutritionnel_mere === "malnutrition" && {
          type: "mas",
          text: "Mère malnutrie",
        },
        familleData.est_visite_en_retard && {
          type: "retard",
          text: "Visite en retard",
        },
      ].filter(Boolean),
    }
  : null;

  const lignes = (payload.produits || []).map((item) =>
    resolveProductLine(item.produit, item.quantite, stockCache?.data)
  );

  const produitsLait = lignes.filter((l) => l.isLait);
  const produitsAlimentaires = lignes.filter((l) => !l.isLait);


  return (
    <AnimatePresence>
      <div
        className="
          fixed inset-0 z-[60]
          bg-transparent sm:bg-black/40
          flex items-start sm:items-center justify-center
          overflow-y-auto scrollbar-hide
        "
        onClick={onClose}
      >
        {showDeletePopup && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-[100] flex items-center justify-center"
          >
            <Popup
              title="Supprimer ce brouillon"
              image={SuccessImage}
              description="Êtes-vous sûr de vouloir supprimer ce brouillon ? Il n'a jamais été envoyé au serveur — cette action est irréversible."
              primaryButtonText="Supprimer le brouillon"
              secondaryButtonText="Annuler"
              primaryButtonVariant="danger"
              onPrimaryClick={async () => {
                try {
                  await onDelete?.(draft);
                  setShowDeletePopup(false);
                } catch (error) {
                  console.error(
                    "Erreur lors de la suppression du brouillon de distribution :",
                    error
                  );
                }
              }}
              onSecondaryClick={() => setShowDeletePopup(false)}
            />
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="
            w-full min-h-screen
            sm:min-h-0 sm:w-[952px] sm:max-h-[90vh]
            overflow-y-auto scrollbar-hide
            bg-white
            rounded-none sm:rounded-[20px]
            border-0 sm:border
            p-4 sm:p-6
          "
          style={{ borderColor: "#4E9F8A" }}
        >
          <div className="mb-4">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-[17px] text-[#202124] hover:opacity-70 transition"
            >
              <img src={quitter} alt="Fermer" className="w-5 h-5" />
              Fermer
            </button>

            <div className="mt-3 flex flex-col items-center gap-1">
              <span
                className="inline-block text-xs font-semibold uppercase tracking-wide rounded-full px-2.5 py-1"
                style={{ color: "#4E9F8A", backgroundColor: "#ECF8F7" }}
              >
                Brouillon hors ligne
              </span>
              <h2 className="text-[20px] font-bold text-center">
                Distribution en attente d'envoi
              </h2>
            </div>
          </div>

         
         {familleCard ? (
  <>
    {/* MOBILE */}
    <div className="block lg:hidden mt-4">
      <CardPopup
        enfant={familleCard.enfant}
        mere={familleCard.mere}
        sexe={familleCard.sexe}
        region={familleCard.region}
        naissance={familleCard.naissance}
        code={familleCard.code}
        badges={familleCard.badges}
      />
    </div>

    {/* DESKTOP */}
    <div className="hidden lg:block mt-4">
      <Card
        enfant={familleCard.enfant}
        mere={familleCard.mere}
        sexe={familleCard.sexe}
        region={familleCard.region}
        naissance={familleCard.naissance}
        code={familleCard.code}
        badges={familleCard.badges}
      />
    </div>
  </>
) : (
  <div
    className="rounded-[15px] px-4 py-3 flex items-center justify-between"
    style={{ backgroundColor: "#ECF8F7" }}
  >
    <span className="text-[14px] text-[#7B7B7B]">
      Famille
    </span>

    <span
      className="text-[16px] font-bold"
      style={{ color: "#4E9F8A" }}
    >
      {familleLoading ? "Chargement..." : payload.famille || "-"}
    </span>
  </div>
)}

          <div className="grid grid-cols-1 sm:grid-cols-[62%_36%] gap-3 mt-4">
            <div className="space-y-3">
              <InfoCard
                title="Informations générales"
                data={[
                  { label: "Date", value: formatDate(payload.date_distribution) },
                  {
                    label: "Remise confirmée",
                    value: payload.reception_confirmee ? "Oui" : "Non",
                  },
                  {
                    label: "Enregistré le",
                    value: draft.createdAt
                      ? new Date(draft.createdAt).toLocaleString("fr-FR")
                      : "-",
                  },
                ]}
              />

              {produitsLait.length > 0 && (
                <InfoCard
                  title="Lait infantile"
                  data={produitsLait.map((l) => ({
                    label: l.nom,
                    value: l.quantiteLabel,
                  }))}
                />
              )}

              {!loadCache(STOCK_CACHE_KEY)?.data && (
                <p className="text-xs text-gray-400">
                  Stock non chargé en cache — les noms de produits ne peuvent
                  pas être vérifiés tant qu'une connexion n'a pas eu lieu.
                </p>
              )}

              {draft.status === "error" && draft.error && (
                <div className="rounded-[15px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {draft.error}
                </div>
              )}
            </div>

            <div className="space-y-3">
              {produitsAlimentaires.length > 0 && (
                <InfoCard
                  title="Colis alimentaire"
                  data={produitsAlimentaires.map((l) => ({
                    label: l.nom,
                    value: l.quantiteLabel,
                  }))}
                />
              )}

              <div className="mt-6 grid grid-cols-1 gap-3 w-full">
                <Button
                  title="Modifier"
                  variant="modifier"
                  icon={EditIcon}
                  noWrapperPadding
                  onClick={() => onEdit?.(draft)}
                />
                <Button
                  title="Supprimer"
                  variant="supprimer"
                  icon={DeleteIcon}
                  noWrapperPadding
                  onClick={() => setShowDeletePopup(true)}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
