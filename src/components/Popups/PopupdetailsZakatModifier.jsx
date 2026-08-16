import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TextareaModifier from "../Containers/TextAreaModifier";
import Card from "../Cards/Card";
import EditableInfoCard from "../Containers/ModifierContainer";
import SelectInput from "../Containers/ChoiceContainer";
import Button from "../Button/Button";
import SuccessBanner from "./SuccessBanner";
import quitter from "../../assets/quitter.svg";

const PopupModifierZakat = ({
  open,
  onClose,
  zakat,
  onSave,
}) => {
  const [infos, setInfos] = useState([]);
  const [observations, setObservations] = useState("");
  const [cause, setCause] = useState("");
  const [precisions, setPrecisions] = useState("");
  const [showBanner, setShowBanner] = useState(false);
  useEffect(() => {
    if (!zakat) return;

    const parseDate = (date) => {
      if (!date) return null;

      const parts = date.split("/");

      if (parts.length !== 3) return null;

      return new Date(parts[2], parts[1] - 1, parts[0]);
    };

 setInfos([
  {
    label: "Date",
    value: parseDate(zakat.date),
    type: "date",
  },
  {
    label: "Zakat n°",
    value: zakat.numero,
    editable: false,
  },
  {
    label: "Montant versé",
    value: zakat.montant,
    type: "number",
    unit: "MRU",
  },
  {
    label: "Mode de paiement",
    value: zakat.modePaiement,
    options: [
      "Espèces",
      "Bankily",
      "Masrivi",
      "Chèque",
    ],
  },
  {
    label: "Enregistrée par",
    value: zakat.enregistrePar,
    editable: false,
  },
  {
    label: "Modifié par",
    value: zakat.modifiePar || "-",
    editable: false,
  },
  {
    label: "Date de modification",
    value: zakat.dateModification || "-",
    editable: false,
  },
]);
    setObservations(zakat.observations || "");
    setCause(zakat.causePrincipale || "");
    setPrecisions(zakat.precisions || "");
  }, [zakat]);

  if (!open || !zakat) return null;

  const handleChange = (index, value) => {
    setInfos((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, value }
          : item
      )
    );
  };

 const handleSave = () => {
 const updatedZakat = {
  ...zakat,

  date: infos[0]?.value,
  numero: infos[1]?.value,
  montant: infos[2]?.value,
  modePaiement: infos[3]?.value,
  enregistrePar: infos[4]?.value,
  modifiePar: infos[5]?.value,
  dateModification: infos[6]?.value,

  observations,
  causePrincipale: cause,
  precisions,
};

  setShowBanner(true);

  setTimeout(() => {
    setShowBanner(false);

    onSave?.(updatedZakat);

    onClose();
  }, 1500);
};
  return (
    <AnimatePresence>
    <div
  className="
    fixed inset-0 z-[70]
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
              className="flex items-center gap-2 text-[17px]"
            >
              <img
                src={quitter}
                alt=""
                className="w-5 h-5"
              />

              Annuler

            </button>

            <h2 className="mt-3 text-center text-[22px] font-bold">
              Détail du zakat {zakat.numero}
            </h2>

          </div>

          {/* Carte */}

          <Card
            enfant={zakat.enfant}
            mere={zakat.mere}
            sexe={zakat.sexe}
            region={zakat.region}
            naissance={zakat.dateNaissance}
            code={zakat.code}
            badges={[]}
          />

          <div className="grid grid-cols-1 sm:grid-cols-[58%_40%] gap-5 mt-4">
                        {/* Colonne gauche */}

            <div className="space-y-4">

              <EditableInfoCard
                title="Informations générales"
                data={infos}
                editable={true}
                onChange={handleChange}
              />

              <TextareaModifier
  label="Observations complémentaires"
  value={observations}
  onChange={(e) => setObservations(e.target.value)}
  height="h-[90px]"
/>

            </div>

            {/* Colonne droite */}

            <div className="space-y-4">

              <h2 className="text-[18px] font-semibold">
                Motif de sélection
              </h2>
             
  <TextareaModifier
  label="Cause principale :"
  value={cause}
  onChange={(e) => setCause(e.target.value)}
  placeholder="Saisir la cause principale"
  height="h-[60px]"
/>

             <TextareaModifier
  label="Précisions :"
  value={precisions}
  onChange={(e) => setPrecisions(e.target.value)}
  height="h-[120px]"
/>

             <div className="mt-4">

  {showBanner && (
    <SuccessBanner text="Enregistré avec succès" />
  )}

  <Button
    title="Enregistrer"
    variant="modifier"
    noWrapperPadding
    onClick={handleSave}
  />

</div>
            </div>

          </div>

        </motion.div>

      </div>

    </AnimatePresence>

  );
};

export default PopupModifierZakat;
