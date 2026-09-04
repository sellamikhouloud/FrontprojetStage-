import { useEffect, useState } from "react";
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

import { getFamille } from "../../lib/api/familles";

const CAUSE_PRINCIPALE_LABELS = {
  veuvage: "Veuvage",
  urgence: "Situation d'urgence",
  vulnerabilite: "Vulnérabilité extrême",
  autre: "Autre",
};

const MODE_REMISE_LABELS = {
  espece: "Espèce",
  transfert_mobile: "Transfert mobile",
  autre: "Autre",
};

const formatDate = (date) => {
  if (!date) return "-";
  const [y, m, d] = String(date).split("-");
  if (!y || !m || !d) return date;
  return `${d}/${m}/${y}`;
};


export default function PopupDetailBrouillonZakat({
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

  const causePrincipale =
    CAUSE_PRINCIPALE_LABELS[payload.cause_principale] ??
    payload.cause_principale ??
    "-";

  const modeRemise =
    MODE_REMISE_LABELS[payload.mode_remise] ?? payload.mode_remise ?? "-";

    
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
                    "Erreur lors de la suppression du brouillon de zakat :",
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
          style={{ borderColor: "#B9822E" }}
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
                style={{ color: "#B9822E", backgroundColor: "#FFF6E9" }}
              >
                Brouillon hors ligne
              </span>
              <h2 className="text-[20px] font-bold text-center">
                Zakat en attente d'envoi
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
            style={{ backgroundColor: "#FFF6E9" }}
          >
            <span className="text-[14px] text-[#7B7B7B]">Famille</span>
            <span className="text-[16px] font-bold" style={{ color: "#B9822E" }}>
              {payload.famille || "-"}
            </span>
          </div>
   )}

          <div className="grid grid-cols-1 sm:grid-cols-[58%_40%] gap-5 mt-4">
            <div className="space-y-3">
              <InfoCard
                title="Informations générales"
                data={[
                  { label: "Date de versement", value: formatDate(payload.date_versement) },
                  {
                    label: "Montant",
                    value: (
                      <span className="font-bold">
                        {payload.montant ?? "0"} MRU
                      </span>
                    ),
                  },
                  { label: "Mode de paiement", value: modeRemise },
                  {
                    label: "Enregistré le",
                    value: draft.createdAt
                      ? new Date(draft.createdAt).toLocaleString("fr-FR")
                      : "-",
                  },
                ]}
              />

              <InfoCard
                title="Observations complémentaires"
                text={payload.observation || "-"}
                textHeight="90px"
              />

              {draft.status === "error" && draft.error && (
                <div className="rounded-[15px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {draft.error}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h2 className="text-[18px] font-semibold">Motif de sélection</h2>

              <div>
                <p className="font-medium mb-2" style={{ color: "#B9822E" }}>
                  Cause principale :
                </p>
                <div className="border rounded-[15px] px-4 py-3" style={{ borderColor: "#F0D9A8" }}>
                  {causePrincipale}
                </div>
              </div>

              <div>
                <p className="font-medium mb-2" style={{ color: "#B9822E" }}>
                  Précisions :
                </p>
                <div
                  className="border rounded-[15px] px-4 py-3 h-[86px] overflow-y-auto"
                  style={{ borderColor: "#F0D9A8" }}
                >
                  <p className="text-[#7B7B7B]">{payload.precisions || "-"}</p>
                </div>
              </div>

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
