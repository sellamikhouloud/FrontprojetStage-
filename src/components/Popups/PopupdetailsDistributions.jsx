import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Card from "../Cards/Card";
import InfoCard from "../Containers/AfficherContainer";
import Button from "../Button/Button";
import Popup from "./SuccessPopup";

import quitter from "../../assets/quitter.svg";
import EditIcon from "../../assets/Container.svg";
import DeleteIcon from "../../assets/Delete.svg";
import SuccessImage from "../../assets/Confirm.svg";
import { useAuth } from "../Providers/AuthProvider"; // 1. Import du hook d'authentification

const PopupDetailDistribution = ({
  open,
  onClose,
  distribution,
  famille,
  onEdit,
  onDelete,
}) => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth(); // 2. Récupération de l'utilisateur connecté

  if (!open || !distribution) return null;

  // Récupération de la famille associée à travers la prop ou directement depuis l'objet distribution
  const familleData = famille || distribution?.famille;

  // 3. Vérification des permissions
  const isCoordinateur = user?.role === "coordinator";

  // coordinateur peut être soit un objet { id, nom, ... }, soit directement un ID brut
  const coordinateurId =
    familleData?.coordinateur && typeof familleData.coordinateur === "object"
      ? familleData.coordinateur.id
      : familleData?.coordinateur;

  const isCoordinateurAssigne =
    String(coordinateurId) === String(user?.id);

  const isSuperviseParMoi = !isCoordinateur || isCoordinateurAssigne;

  const isAnnulee = Boolean(distribution.annulee);

  // Condition globale pour autoriser la modification ou l'annulation
  const canEditOrDelete = !isAnnulee && isSuperviseParMoi;

  const handleGoToFamille = () => {
    const familleId = familleData?.id;
    if (!familleId) return;

    navigate(`/famille/${familleId}`, {
      state: {
        restoreDistributionId: distribution.id,
        fromPage: "/liste-distributions",
      },
    });
  };

  const produitsLait = (distribution.produits || []).filter(
    (item) => item.produit?.type_produit === "lait"
  );

  const produitsAlimentaires = (distribution.produits || []).filter(
    (item) => item.produit?.type_produit !== "lait"
  );

  return (
    <AnimatePresence>
      <div
        className="
          fixed inset-0 z-[60]
          bg-transparent sm:bg-black/40
          flex items-start sm:items-center
          justify-center
          overflow-y-auto
          scrollbar-hide
        "
        onClick={onClose}
      >
        {showDeletePopup && (
          <div onClick={(e) => e.stopPropagation()}>
            <Popup
              title="Confirmer l'annulation"
              image={SuccessImage}
              description="Êtes-vous sûr de vouloir Annuler cette distribution ? Cette action est irréversible."
              primaryButtonText="Annuler la distribution"
              secondaryButtonText="Annuler"
              primaryButtonVariant="danger"
              onPrimaryClick={() => {
                setShowDeletePopup(false);
                onDelete?.(distribution);
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
          {/* Header */}
          <div className="mb-4">
            <button
              onClick={onClose}
              className="
                flex items-center gap-2
                text-[17px]
                text-[#202124]
              "
            >
              <img
                src={quitter}
                alt="Fermer"
                className="w-5 h-5"
              />
              Fermer
            </button>

            <h2 className="mt-3 text-center text-[20px] font-bold text-[#202124]">
              Détail distribution
            </h2>
          </div>

          {/* Carte famille */}
          <div onClick={handleGoToFamille} className="cursor-pointer hover:opacity-95 transition">
            <Card
              mere={`${familleData?.mere?.nom ?? ""} ${familleData?.mere?.prenom ?? ""}`.trim()}
              enfant={familleData?.nourrisson?.prenom ?? "-"}
              sexe={
                familleData?.nourrisson?.sexe === "M"
                  ? "Fils"
                  : familleData?.nourrisson?.sexe === "F"
                  ? "Fille"
                  : "-"
              }
              region={familleData?.mere?.village?.nom ?? "-"}
              naissance={familleData?.nourrisson?.date_naissance ?? "-"}
              code={familleData?.id ?? "-"}
              badges={[]}
            />
          </div>

          {/* Contenu */}
          <div className="grid grid-cols-1 sm:grid-cols-[62%_36%] gap-3 mt-4">
            {/* COLONNE GAUCHE */}
            <div className="space-y-3">
              {/* Informations générales */}
              <InfoCard
                title="Informations générales"
                data={[
                  {
                    label: "Date",
                    value: distribution.date_distribution
                      ? new Date(
                          distribution.date_distribution
                        ).toLocaleDateString("fr-FR")
                      : "-",
                  },
                  {
                    label: "Distribution n°",
                    value: distribution.numeroDistribution ?? "-",
                  },
                  {
                    label: "Créé par",
                    value: distribution.audit?.cree_par
                      ? `${distribution.audit.cree_par.nom} ${distribution.audit.cree_par.prenom}`
                      : "-",
                  },
                  {
                    label: "Date de création",
                    value: distribution.audit?.date_creation
                      ? new Date(
                          distribution.audit.date_creation
                        ).toLocaleDateString("fr-FR")
                      : "-",
                  },
                  {
                    label: "Modifié par",
                    value: distribution.audit?.modifie_par
                      ? `${distribution.audit.modifie_par.nom} ${distribution.audit.modifie_par.prenom}`
                      : "-",
                  },
                  {
                    label: "Date de modification",
                    value: distribution.audit?.date_modification
                      ? new Date(
                          distribution.audit.date_modification
                        ).toLocaleDateString("fr-FR")
                      : "-",
                  },
                ]}
              />

              {/* Lait */}
              {produitsLait.length > 0 && (
                <InfoCard
                  title="Lait infantile"
                  data={produitsLait.flatMap((item) => [
                    {
                      label: "Produit",
                      value: item.produit?.nom ?? "-",
                    },
                    {
                      label: "Nombre de boîtes",
                      value: `${Number(item.quantite ?? 0)} ${
                        item.produit?.unite === "boite"
                          ? "boîtes"
                          : item.produit?.unite ?? ""
                      }`,
                    },
                    {
                      label: "Poids total",
                      value: item.poids_total != null
                        ? `${item.poids_total} kg`
                        : "-",
                    },
                  ])}
                />
              )}
            </div>

            {/* COLONNE DROITE */}
            <div className="space-y-3 sm:ml-2">
              {/* Colis alimentaire */}
              {produitsAlimentaires.length > 0 && (
                <InfoCard
                  title="Colis alimentaire"
                  data={produitsAlimentaires.map((item) => ({
                    label: item.produit?.nom ?? "-",
                    value: `${Number(item.quantite ?? 0)} ${
                      item.produit?.unite ?? ""
                    }`,
                  }))}
                />
              )}
            </div>
          </div>

          {/* 4. Affichage conditionnel des boutons Modifier / Annuler */}
          {canEditOrDelete && (
            <>
              {/* Desktop */}
              <div className="hidden sm:grid grid-cols-2 gap-4 mt-6">
                <Button
                  title="Modifier"
                  variant="modifier"
                  icon={EditIcon}
                  noWrapperPadding
                  onClick={() => onEdit?.(distribution)}
                />

                <Button
                  title="Annuler"
                  variant="supprimer"
                  icon={DeleteIcon}
                  noWrapperPadding
                  onClick={() => setShowDeletePopup(true)}
                />
              </div>

              {/* Mobile */}
              <div className="sm:hidden grid grid-cols-1 gap-3 mt-6">
                <Button
                  title="Modifier"
                  variant="modifier"
                  icon={EditIcon}
                  noWrapperPadding
                  onClick={() => onEdit?.(distribution)}
                />

                <Button
                  title="Annuler"
                  variant="supprimer"
                  icon={DeleteIcon}
                  noWrapperPadding
                  onClick={() => setShowDeletePopup(true)}
                />
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PopupDetailDistribution;
