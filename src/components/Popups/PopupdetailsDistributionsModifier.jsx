import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Card from "../Cards/Card";
import EditableInfoCard from "../Containers/ModifierContainer";
import Button from "../Button/Button";
import Popup from "./SuccessPopup";
import quitter from "../../assets/quitter.svg";
import EditIcon from "../../assets/Container.svg";
import DeleteIcon from "../../assets/Delete.svg";
import SuccessImage from "../../assets/Confirm.svg";
import SuccessBanner from "./SuccessBanner";

const PopupDetailDistributionModifier = ({
  open,
  onClose,
  distribution,
  onEdit,
  onDelete,
}) => {
 
  const [showBanner, setShowBanner] = useState(false);
const [generalInfo, setGeneralInfo] = useState([]);
const [laitInfo, setLaitInfo] = useState([]);
const [colisInfo, setColisInfo] = useState([]);

const updateField = (setter, data) => (index, value) => {
  const updated = [...data];
  updated[index].value = value;
  setter(updated);
};

useEffect(() => {
  if (!distribution) return;

  setGeneralInfo([
    { label: "Date", value: distribution.date },
    { label: "Distribution n°", value: distribution.numeroDistribution },
    { label: "Enregistrée par", value: distribution.enregistrePar },
  ]);

  setLaitInfo([
    { label: "Type", value: distribution.typeLait },
    { label: "Nombre de boîtes", value: distribution.nombreBoites },
    { label: "Poids total", value: distribution.poidsTotal },
  ]);

  setColisInfo(distribution.colisAlimentaire || []);
}, [distribution]);

const handleSave = () => {
  const updatedDistribution = {
    ...distribution,

    date: generalInfo[0]?.value,
    numeroDistribution: generalInfo[1]?.value,
    enregistrePar: generalInfo[2]?.value,

    typeLait: laitInfo[0]?.value,
    nombreBoites: laitInfo[1]?.value,
    poidsTotal: laitInfo[2]?.value,

    cereales: colisInfo[0]?.value,
    sucre: colisInfo[1]?.value,
    sel: colisInfo[2]?.value,
  };

  onEdit?.(updatedDistribution);

  setShowBanner(true);

  setTimeout(() => {
    setShowBanner(false);
    onClose();
  }, 1500);
};
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
<div className="grid grid-cols-1 sm:grid-cols-[62%_36%] gap-3 mt-3">
            {/* Colonne gauche */}
           <div className="space-y-2 ">
             <EditableInfoCard
  title="Informations générales"
  data={generalInfo}
  onChange={updateField(setGeneralInfo, generalInfo)}
/>

            <EditableInfoCard
  title="Lait infantile"
  data={laitInfo}
  onChange={updateField(setLaitInfo, laitInfo)}
/>
            </div>

            {/* Colonne droite */}
          <div className="space-y-2 sm:ml-2">
             <EditableInfoCard
  title="Colis alimentaire"
  data={colisInfo}
  onChange={updateField(setColisInfo, colisInfo)}
/>
            </div>
          </div>

          {/* Boutons Desktop */}
      <div className="hidden sm:block mt-3 w-full">
   {showBanner && (
  <SuccessBanner text="Enregistré avec succès" />
)}
  <Button
      title="Enregistrer"
      variant="primary"
      icon={EditIcon}
      noWrapperPadding
    onClick={handleSave}
    />
   
</div>

          {/* Boutons Mobile */}
        
<div className="mt-6 grid grid-cols-1 gap-3 w-full sm:hidden">
     <div className="w-full">
       {showBanner && (
  <SuccessBanner text="Enregistré avec succès" />
)}
    <Button
      title="Enregistrer"
      variant="primary"
      icon={EditIcon}
      noWrapperPadding
    onClick={handleSave}
    />
   
  </div>
</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PopupDetailDistributionModifier;
