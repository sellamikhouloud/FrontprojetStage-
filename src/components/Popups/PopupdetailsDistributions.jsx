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
  onEdit,
  onDelete,
}) => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  if (!open || !distribution) return null;

  return (
    <AnimatePresence>
      <div
        className="
          fixed inset-0 z-[60]
          bg-transparent sm:bg-black/40
          flex items-start sm:items-center justify-center
          overflow-y-auto
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
              className="flex items-center gap-2 text-[17px] text-[#202124]"
            >
              <img src={quitter} alt="Fermer" className="w-5 h-5" />
              Fermer
            </button>

            <h2 className="mt-3 text-center text-[20px] font-bold text-[#202124]">
              Détail de la distribution {distribution.numeroDistribution}
            </h2>
          </div>

          {/* Carte */}
          <Card
            enfant={distribution.enfant}
            mere={distribution.mere}
            sexe={distribution.sexe}
            region={distribution.region}
            naissance={distribution.dateNaissance}
            code={distribution.code}
            badges={[]}
          />

          {/* Contenu */}
<div className="grid grid-cols-1 sm:grid-cols-[62%_36%] gap-3 mt-4">
            {/* Colonne gauche */}
           <div className="space-y-3 ">
              <InfoCard
                title="Informations générales"
                data={[
                  {
                    label: "Date",
                    value: distribution.date,
                  },
                  {
                    label: "Distribution n°",
                    value: distribution.numeroDistribution,
                  },
                  {
                    label: "Enregistrée par",
                    value: distribution.enregistrePar,
                  },
                ]}
              />

              <InfoCard
                title="Lait infantile"
                data={[
                  {
                    label: "Type",
                    value: distribution.typeLait,
                  },
                  {
                    label: "Nombre de boîtes",
                    value: distribution.nombreBoites,
                  },
                  {
                    label: "Poids total",
                    value: distribution.poidsTotal,
                  },
                ]}
              />
            </div>

            {/* Colonne droite */}
          <div className="space-y-3 sm:ml-2">
              <InfoCard
                title="Colis alimentaire"
                data={[
                  {
                    label: "Céréales",
                    value: distribution.cereales,
                  },
                  {
                    label: "Sucre",
                    value: distribution.sucre,
                  },
                  {
                    label: "Sel",
                    value: distribution.sel,
                  },
                ]}
              />
            </div>
          </div>

          {/* Boutons Desktop */}
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

          {/* Boutons Mobile */}
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