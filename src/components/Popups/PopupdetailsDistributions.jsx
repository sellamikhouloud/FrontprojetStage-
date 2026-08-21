import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Card from "../Cards/Card";
import InfoCard from "../Containers/AfficherContainer";
import Button from "../Button/Button";
import Popup from "./SuccessPopup";

import quitter from "../../assets/quitter.svg";
import EditIcon from "../../assets/Container.svg";
import DeleteIcon from "../../assets/Delete.svg";
import SuccessImage from "../../assets/Confirm.svg";

const PopupDetailDistribution = ({
  open,
  onClose,
  distribution,
  famille,
  onEdit,
  onDelete,
}) => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  if (!open || !distribution) return null;

  // Séparation lait / produits alimentaires
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
              title="Confirmer la suppression"
              image={SuccessImage}
              description="Êtes-vous sûr de vouloir supprimer cette distribution ? Cette action est irréversible."
              primaryButtonText="Supprimer"
              secondaryButtonText="Annuler"
              primaryButtonVariant="danger"
              onPrimaryClick={() => {
                setShowDeletePopup(false);
                onDelete?.(distribution);
              }}
              onSecondaryClick={() =>
                setShowDeletePopup(false)
              }
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
              Détail de la distribution n°{distribution.numeroDistribution}
            </h2>
          </div>

          {/* Carte famille */}
          <Card
            mere={`${famille?.mere?.nom ?? ""} ${famille?.mere?.prenom ?? ""}`.trim()}
  enfant={famille?.nourrisson?.prenom ?? "-"}
          sexe={
  famille?.nourrisson?.sexe === "M"
    ? "Fils"
    : famille?.nourrisson?.sexe === "F"
    ? "Fille"
    : "-"
}
            region={famille?.mere?.village?.nom ?? "-"}
            naissance={
              famille?.nourrisson?.date_naissance ?? "-"
            }
            code={famille?.id ?? "-"}
            badges={[]}
          />

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
                    value:
                      distribution.numeroDistribution ?? "-",
                  },
                
                  {
                    label: "Enregistrée par",
                    value:
                      distribution.audit?.cree_par
                        ? `${distribution.audit.cree_par.nom} ${distribution.audit.cree_par.prenom}`
                        : "-",
                  },
                  {
                    label: "Date d'enregistrement",
                    value: distribution.audit?.date_creation
                      ? new Date(
                          distribution.audit.date_creation
                        ).toLocaleDateString("fr-FR")
                      : "-",
                  },
                  {
                    label: "Modifié par",
                    value:
                      distribution.audit?.modifie_par
                        ? `${distribution.audit.modifie_par.nom} ${distribution.audit.modifie_par.prenom}`
                        : "-",
                  },
                  {
                    label: "Date de modification",
                    value:
                      distribution.audit?.date_modification
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
              <InfoCard
                title="Colis alimentaire"
                data={produitsAlimentaires.map((item) => ({
  label: item.produit?.nom ?? "-",
  value: `${Number(item.quantite ?? 0)} ${
    item.produit?.unite ?? ""
  }`,
}))}
              />
            </div>
          </div>

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
              title="Supprimer"
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
              title="Supprimer"
              variant="supprimer"
              icon={DeleteIcon}
              noWrapperPadding
              onClick={() => setShowDeletePopup(true)}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PopupDetailDistribution;
