
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import InfoCard from "../Containers/AfficherContainer";
import Button from "../Button/Button";

import quitter from "../../assets/quitter.svg";
import EditIcon from "../../assets/Container.svg";
import DeleteIcon from "../../assets/Delete.svg";

import Popup from "./SuccessPopup";
import SuccessImage from "../../assets/Confirm.svg";

const formatDate = (date) => {
  if (!date) return "-";
  const [y, m, d] = String(date).split("-");
  if (!y || !m || !d) return date;
  return `${d}/${m}/${y}`;
};

const STATUT_LABELS = {
  actif: "Actif",
  sorti: "Sorti",

};


const KNOWN_LABELS = {
  nom: "Nom",
  prenom: "Prénom",
  date_naissance: "Date de naissance",
  village: "Village",
  telephone: "Téléphone",
  statut_matrimonial: "Statut matrimonial",
  nb_enfants: "Nombre d'enfants",

  // Nourrisson
  poids_naissance: "Poids à la naissance",
  taille_naissance: "Taille à la naissance",
  sexe: "Sexe",
};

function toInfoCardData(obj, excludeKeys = []) {
  return Object.entries(obj || {})
    .filter(([key, value]) => !excludeKeys.includes(key) && value !== null && value !== undefined && value !== "")
    .map(([key, value]) => ({
      label: KNOWN_LABELS[key] ?? key,
      value: key.includes("date") ? formatDate(value) : String(value),
    }));
}


export default function PopupDetailBrouillonFamille({
  open,
  onClose,
  draft,
  onEdit,
  onDelete,
}) {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showPhotoPopup, setShowPhotoPopup] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
  const photo = draft?.files?.photo;

  if (!photo) {
    setPhotoUrl(null);
    return;
  }

  const url = URL.createObjectURL(photo);
  setPhotoUrl(url);

  return () => {
    URL.revokeObjectURL(url);
  };
}, [draft?.files?.photo]);

  if (!open || !draft) return null;

  const payload = draft.payload || {};
  const mere = payload.mere || {};
  const nourrissons = payload.nourrissons || [];
  const hasPhoto = !!draft.files?.photo;

  

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
                    "Erreur lors de la suppression du brouillon de famille :",
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
          style={{ borderColor: "#3B5BA9" }}
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
                style={{ color: "#3B5BA9", backgroundColor: "#EEF3FF" }}
              >
                Brouillon hors ligne
              </span>
              <h2 className="text-[20px] font-bold text-center">
                Nouvelle famille en attente d'envoi
              </h2>
            </div>
          </div>

         <div
  className="rounded-[15px] px-4 py-3 flex items-center justify-between"
  style={{ backgroundColor: "#EEF3FF" }}
>
  <span className="text-[14px] text-[#7B7B7B]">
    Mère
  </span>

  <div className="flex items-center gap-3">
    <span
      className="text-[16px] font-bold"
      style={{ color: "#3B5BA9" }}
    >
      {`${mere.nom ?? ""} ${mere.prenom ?? ""}`.trim() || "-"}
    </span>

    {hasPhoto && (
      <button
        type="button"
        onClick={() => setShowPhotoPopup(true)}
        className="text-[13px] font-semibold text-[#4E9F8A] hover:underline cursor-pointer"
      >
        Voir la photo
      </button>
    )}
  </div>
</div>

          <div className="grid grid-cols-1 sm:grid-cols-[62%_36%] gap-3 mt-4">
            <div className="space-y-3">
              <InfoCard
  title="Informations générales"
  data={[
    ...(payload.date_entree
      ? [
          {
            label: "Date d'entrée",
            value: formatDate(payload.date_entree),
          },
        ]
      : []),

    ...(payload.statut
      ? [
          {
            label: "Statut",
            value: STATUT_LABELS[payload.statut] ?? payload.statut,
          },
        ]
      : []),

    ...(payload.date_sortie
      ? [
          {
            label: "Date de sortie",
            value: formatDate(payload.date_sortie),
          },
        ]
      : []),

    ...(payload.motif_sortie
      ? [
          {
            label: "Motif de sortie",
            value: payload.motif_sortie,
          },
        ]
      : []),

    ...(draft.createdAt
      ? [
          {
            label: "Enregistré le",
            value: new Date(draft.createdAt).toLocaleString("fr-FR"),
          },
        ]
      : []),
  ]}
/>

              <InfoCard
               title="Mère"
               data={toInfoCardData(mere)}
              />



              {draft.status === "error" && draft.error && (
                <div className="rounded-[15px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {draft.error}
                </div>
              )}
            </div>

            <div className="space-y-3">
              {nourrissons.map((n, i) => (
                <InfoCard
                  key={i}
                  title={nourrissons.length > 1 ? `Nourrisson ${i + 1}` : "Nourrisson"}
                  data={toInfoCardData(n)}
                />
              ))}

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
        {showPhotoPopup && photoUrl && (
  <div
    className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4"
    onClick={() => setShowPhotoPopup(false)}
  >
    <div
      className="relative max-w-[90vw] max-h-[90vh] rounded-2xl bg-white p-4 shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <button
  type="button"
  onClick={() => setShowPhotoPopup(false)}
  className="
    absolute top-3 right-3
    w-8 h-8
    rounded-full
    bg-white
    shadow-sm
    flex items-center justify-center
    hover:bg-gray-100
  "
  aria-label="Fermer la photo"
>
  <X size={18} color="#202124" strokeWidth={2.5} />
</button>

      <img
        src={photoUrl}
        alt={`Photo de ${mere.prenom ?? ""} ${mere.nom ?? ""}`}
        className="max-w-[80vw] max-h-[80vh] object-contain rounded-xl"
      />
    </div>
  </div>
)}
      </div>
    </AnimatePresence>
  );
}