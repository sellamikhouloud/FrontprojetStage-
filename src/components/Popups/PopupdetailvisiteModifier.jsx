import Card from "../Cards/Card";
import StatusBadge from "../Cards/Badge";
import InfoCard from "../Containers/AfficherContainer";
import AfficherMesure from "../Containers/AfficherMesure";
import Button from "../Button/Button";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import quitter from "../../assets/quitter.svg";
import EditIcon from "../../assets/Container.svg";
import DeleteIcon from "../../assets/Delete.svg";
import Popup from "./SuccessPopup";
import SuccessImage from "../../assets/Confirm.svg";
import ContainerEcritureModifier from "../Containers/ContainerEcritureModifier";

const PopupDetailVisiteModifier = ({
  open,
  onClose,
  visite,
  onEdit,
  onDelete,
}) => {

const [observationNourrisson, setObservationNourrisson] = useState(
  visite?.observationNourrisson || ""
);

const [observationMere, setObservationMere] = useState(
  visite?.observationMere || ""
);

const [evaluationFamiliale, setEvaluationFamiliale] = useState(
  visite?.evaluationFamiliale || ""
);
  if (!open || !visite) return null;

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
  "
  onClick={onClose}
>


  
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

     <div className="mb-2">
  {/* Bouton Fermer */}
  <button
    onClick={onClose}
    className="flex items-center gap-2 text-[17px] text-[#202124] hover:opacity-70 transition"
  >
    <img
      src={quitter}
      alt="Fermer"
      className="w-5 h-5"
    />
    Fermer
  </button>

  {/* Titre */}
  <h2 className="mt-2 text-center text-[20px] font-bold text-[#202124]">
    Détail du visite {visite.numeroVisite}
  </h2>
</div>

          {/* Carte famille */}

          <Card
            enfant={visite.enfant}
            mere={visite.mere}
            sexe={visite.sexe}
            region={visite.region}
            naissance={visite.dateNaissance}
            code={visite.code}
            badges={[]}
          />
         

          {/* Contenu */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {/* Gauche */}

            <div className="space-y-3">

              <InfoCard
                title="Informations générales"
                data={[
                  {
                    label: "Date",
                    value: visite.date,
                  },
                  {
                    label: "Visite n ",
                    value: visite.numeroVisite,
                  },
                  {
                    label: "Enregistrée par",
                    value: visite.enregistrePar,
                  },
                ]}
              />

              <AfficherMesure
                title="Mesure nourrisson"
                poids={visite.nourrisson?.poids}
                taille={visite.nourrisson?.taille}
                muac={visite.nourrisson?.muac}
              />
<ContainerEcritureModifier
  label="Observations cliniques nourrisson"
  value={observationNourrisson}
  onChange={(e) => setObservationNourrisson(e.target.value)}
  noPadding
/>
<div className="hidden sm:block mt-3 w-full">
  <Button
    title="Enregistrer"
    variant="primary"
    icon={EditIcon}
    noWrapperPadding
    className="w-full"
    onClick={() => onEdit?.(visite)}
  />
</div>
            </div>

            {/* Droite */}

            <div className="space-y-3">
<div
  className="
    w-full
    h-[90px]
    rounded-[20px]
    border
    border-[#E6ECEA]
    bg-[#F8FBFC]
    px-[15px]
    py-[7px]
    flex
    flex-col
    justify-between
  "
>
  <h3 className="text-[18px] font-semibold text-center text-[#202124]">
    Statut calculé
  </h3>

 <div className="flex flex-wrap sm:flex-nowrap justify-center items-center gap-3">
    {visite.statuts?.map((badge, index) => (
     <StatusBadge
  key={index}
  type={badge.type}
  text={badge.text}
  className="
    h-[44px]
    sm:h-[50px]

    flex-1
    sm:flex-none

    min-w-0
    sm:min-w-[190px]

    rounded-[18px]

    text-[14px]
    sm:text-[16px]

    font-semibold

    px-4
    sm:px-6
  "
/>
    ))}
  </div>
</div>
              <AfficherMesure
                title="Mesure mère"
                poids={visite.mereMesure?.poids}
              
                muac={visite.mereMesure?.muac}
              />

          <ContainerEcritureModifier
  label="Observations cliniques mère"
  value={observationMere}
  onChange={(e) => setObservationMere(e.target.value)}
  noPadding
/>

<ContainerEcritureModifier
  label="Évaluation visuelle de la situation familiale"
  value={evaluationFamiliale}
  onChange={(e) => setEvaluationFamiliale(e.target.value)}
  noPadding
/>
           

            </div>

          </div>

<div className="mt-6 grid grid-cols-1 gap-3 w-full sm:hidden">
     <div className="w-full">
    <Button
      title="Enregistrer"
      variant="primary"
      icon={EditIcon}
      noWrapperPadding
      onClick={() => onEdit?.(visite)}
    />
  </div>
</div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PopupDetailVisiteModifier;