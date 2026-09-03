import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Card from "../Cards/Card";
import InfoCard from "../Containers/AfficherContainer";
import Button from "../Button/Button";
import { useAuth } from "../Providers/AuthProvider";
import quitter from "../../assets/quitter.svg";
import EditIcon from "../../assets/Container.svg";
import DeleteIcon from "../../assets/Delete.svg";

import Popup from "./SuccessPopup";
import SuccessImage from "../../assets/Confirm.svg";
const PopupDetailZakat = ({
  open,
  onClose,
  zakat,
  famille,
  onEdit,
  onDelete,
  fromFamilyHistory = false,
}) => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const navigate = useNavigate();
 const { user } = useAuth();
  if (!open || !zakat) return null;

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("fr-FR");
  };

  const causePrincipaleLabels = {
    veuvage: "Veuvage",
    urgence: "Situation d'urgence",
    vulnerabilite: "Vulnérabilité extrême",
    autre: "Autre",
  };

  const causePrincipale =
    causePrincipaleLabels[zakat.cause_principale] ??
    zakat.cause_principale ??
    "-";
const enfant =
  famille?.nourrisson?.prenom ||
  famille?.enfant_prenom ||
  "-";
const mere = [
  famille?.mere?.nom || famille?.mere_nom,
  famille?.mere?.prenom || famille?.mere_prenom,
]
  .filter(Boolean)
  .join(" ") || "-";
const sexe =
  famille?.nourrisson?.sexe === "M"
    ? "Fils"
    : famille?.nourrisson?.sexe === "F"
    ? "Fille"
    : famille?.enfant_sexe === "M"
    ? "Fils"
    : famille?.enfant_sexe === "F"
    ? "Fille"
    : "-";

const region =
  famille?.mere?.village?.nom ||
  famille?.village ||
  "-";

const dateNaissance = formatDate(
  famille?.nourrisson?.date_naissance ||
  famille?.enfant_date_naissance
);

const code =
  famille?.id ||
  zakat.famille ||
  "-";
  const numeroZakat = zakat.numero_zakat ?? "-";
  const dateVersement = formatDate(zakat.date_versement);
  const dateCreation = formatDate(zakat.date_creation);
  const dateModification = formatDate(zakat.date_modification);
 
  const familleData = famille || zakat?.famille_info;

const isCoordinateur = user?.role === "coordinator";

// Récupérer le coordinateur de la famille
const coordinateur =
  familleData?.coordinateur ??
  familleData?.coordinateur_id ??
  zakat?.famille_info?.coordinateur ??
  zakat?.famille_info?.coordinateur_id ??
  null;

const coordinateurId =
  typeof coordinateur === "object"
    ? coordinateur?.id
    : coordinateur;

// Vérifier si le coordinateur connecté est celui de la famille
const isCoordinateurAssigne =
  isCoordinateur &&
  coordinateurId != null &&
  String(coordinateurId) === String(user?.id);

// Permissions
const canEditOrDelete = fromFamilyHistory
  ? !zakat.est_annule &&
    (!isCoordinateur || isCoordinateurAssigne)
  : !zakat.est_annule;

  const modeRemiseLabels = {
    espece: "Espèce",
    transfert_mobile: "Transfert mobile",
    autre: "Autre",
  };

  const modeRemise =
    modeRemiseLabels[zakat.mode_remise] ?? zakat.mode_remise ?? "-";

  // Redirection vers la fiche famille avec conservation de l'ID de la Zakat
 const handleFamilyClick = () => {
  const familleId =
    famille?.id ||
    zakat.famille_info?.id ||
    zakat.famille;

  if (familleId) {
    navigate(`/famille/${familleId}`, {
      state: {
        fromPage: location.pathname,
        restoreZakatId: zakat.id,
      },
    });
  }
};

  const ActionButtons = ({ className }) => (
    <div className={className}>
      <Button
        title="Modifier"
        variant="modifier"
        icon={EditIcon}
        noWrapperPadding
        onClick={() => onEdit?.(zakat)}
      />

      <Button
        title=" Annuler"
        variant="supprimer"
        icon={DeleteIcon}
        noWrapperPadding
        onClick={() => setShowDeletePopup(true)}
      />
    </div>
  );

  return (
    <AnimatePresence>
      <div
        className="
          fixed
          inset-0
          z-[60]

          bg-transparent
          sm:bg-black/40

          flex
          items-start
          sm:items-center
          justify-center

          overflow-y-auto
          scrollbar-hide
        "
        onClick={onClose}
      >
        {showDeletePopup && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-[100] flex items-center justify-center"
          >
            <Popup
              title="Confirmer l'annulation"
              image={SuccessImage}
              description="Êtes-vous sûr de vouloir Annuler ce Zakat ? Cette action est irréversible."
              primaryButtonText="Annuler Zakat "
              secondaryButtonText="Annuler"
              primaryButtonVariant="danger"
              onPrimaryClick={async () => {
                try {
                  await onDelete?.(zakat);
                  setShowDeletePopup(false);
                } catch (error) {
                  console.error(
                    "Erreur lors de la suppression du Zakat :",
                    error
                  );
                }
              }}
              onSecondaryClick={() => {
                setShowDeletePopup(false);
              }}
            />
          </div>
        )}

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.96,
          }}
          transition={{
            duration: 0.2,
          }}
          onClick={(e) => e.stopPropagation()}
          className="
            w-full
            min-h-screen

            sm:min-h-0
            sm:w-[952px]
            sm:max-h-[90vh]

            overflow-y-auto
            scrollbar-hide

            bg-white

            rounded-none
            sm:rounded-[20px]

            border-0
            sm:border

            p-4
            sm:p-6
          "
          style={{
            borderColor: "#4E9F8A",
          }}
        >
          <div className="mb-4">
            <button
              onClick={onClose}
              className="
                flex
                items-center
                gap-2

                text-[17px]
                text-[#202124]

                hover:opacity-70
                transition
              "
            >
              <img
                src={quitter}
                alt="Fermer"
                className="w-5 h-5"
              />
              Fermer
            </button>

            <h2
              className="
                mt-3
                text-center
                text-[20px]
                font-bold
              "
            >
              Détail du Zakat n°{numeroZakat}
            </h2>
          </div>

          {/* Clic sur la carte famille */}
          <div onClick={handleFamilyClick} className="cursor-pointer">
            <Card
              mere={mere}
              enfant={enfant}
              sexe={sexe}
              region={region}
              naissance={dateNaissance}
              code={code}
              badges={[]}
            />
          </div>

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-[58%_40%]

              gap-5
              mt-4
            "
          >
            <div className="space-y-3">
              <InfoCard
                title="Informations générales"
                data={[
                  {
                    label: "Date",
                    value: dateVersement,
                  },
                  {
                    label: "Zakat n°",
                    value: `${numeroZakat}`,
                  },
                  {
                    label: "Montant versé",
                    value: (
                      <div className="flex items-center gap-2">
                        <span className="font-bold">
                          {zakat.montant ?? "0"} MRU
                        </span>

                        <span className="text-[12px] text-[#8A8A8A]">
                          ≈ {zakat.montant_eur ?? "0"} EUR
                        </span>
                      </div>
                    ),
                  },
                  {
                    label: "Mode de paiement",
                    value: modeRemise,
                  },
                  {
                    label: "Créé par",
                    value: zakat.cree_par?.nom || "-",
                  },
                  {
                    label: "Date de création",
                    value: dateCreation,
                  },
                  {
                    label: "Modifié par",
                    value: zakat.modifie_par?.nom || "-",
                  },
                  {
                    label: "Date de modification",
                    value: dateModification,
                  },
                ]}
              />

              <InfoCard
                title="Observations complémentaires"
                text={zakat.observation || "-"}
                textHeight="90px"
              />
            </div>

            <div className="space-y-3">
              <h2 className="text-[18px] font-semibold">
                Motif de sélection
              </h2>

              <div>
                <p className="text-[#4E9F8A] font-medium mb-2">
                  Cause principale :
                </p>

                <div
                  className="
                    border
                    border-[#84D6D0]
                    rounded-[15px]

                    px-4
                    py-3
                  "
                >
                  {causePrincipale}
                </div>
              </div>

              <div>
                <p className="text-[#4E9F8A] font-medium mb-2">
                  Précisions :
                </p>

                <div
                  className="
                    border
                    border-[#84D6D0]
                    rounded-[15px]

                    px-4
                    py-3

                    h-[86px]
                  "
                >
                  <p className="text-[#7B7B7B]">
                    {zakat.precisions || "-"}
                  </p>
                </div>
              </div>

             {canEditOrDelete && (
  <ActionButtons
    className="
      mt-6
      grid
      grid-cols-1
      gap-3
      w-full
    "
  />
)}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PopupDetailZakat;
