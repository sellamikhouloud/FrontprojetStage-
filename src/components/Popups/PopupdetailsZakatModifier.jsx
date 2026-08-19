import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TextareaModifier from "../Containers/TextAreaModifier";
import Card from "../Cards/Card";
import EditableInfoCard from "../Containers/ModifierContainer";
import Button from "../Button/Button";
import SuccessBanner from "./SuccessBanner";
import quitter from "../../assets/quitter.svg";

const PopupModifierZakat = ({
  open,
  onClose,
  zakat,
  famille,
  onSave,
}) => {
  const [infos, setInfos] = useState([]);
  const [observations, setObservations] = useState("");
  const [cause, setCause] = useState("");
  const [precisions, setPrecisions] = useState("");
  const [showBanner, setShowBanner] = useState(false);
const causePrincipaleOptions = [
  {
    value: "veuvage",
    label: "Veuvage",
  },
  {
    value: "urgence",
    label: "Situation d'urgence",
  },
  {
    value: "vulnerabilite",
    label: "Vulnérabilité extrême",
  },
  {
    value: "autre",
    label: "Autre",
  },
];
  useEffect(() => {
    if (!zakat) return;

    setInfos([
      {
        label: "Date",
        value: zakat.date_versement
          ? new Date(zakat.date_versement)
          : null,
        type: "date",
      },
      {
        label: "Zakat n°",
        value: zakat.numero_zakat ?? "-",
        editable: false,
      },
      {
        label: "Montant versé",
        value: zakat.montant ?? "",
        type: "number",
        unit: "MRU",
      },
      {
        label: "Mode de paiement",
        value: zakat.mode_remise ?? "",
        options: [
          "Espèces",
          "Bankily",
          "Masrivi",
          "Chèque",
        ],
      },
      {
        label: "Enregistrée par",
        value: zakat.cree_par?.nom || "-",
        editable: false,
      },

        {
        label: "Date d'enregistrement",
        value: zakat.date_creation
          ? new Date(zakat.date_creation).toLocaleDateString("fr-FR")
          : "-",
        editable: false,
      },
      {
        label: "Modifié par",
        value: zakat.modifie_par?.nom || "-",
        editable: false,
      },
      {
        label: "Date de modification",
        value: zakat.date_modification
          ? new Date(zakat.date_modification).toLocaleDateString("fr-FR")
          : "-",
        editable: false,
      },
    ]);

    setObservations(zakat.observation || "");
    setCause(zakat.cause_principale || "");
    setPrecisions(zakat.precisions || "");
  }, [zakat]);

  if (!open || !zakat) return null;

  const enfant = famille?.enfant_prenom || "-";
  const mere = famille?.mere_nom || "-";

  const sexe =
  famille?.enfant_sexe === "M"
    ? "Fils"
    : famille?.enfant_sexe === "F"
    ? "Fille"
    : "-";

  const region = famille?.village || "-";

  const dateNaissance = famille?.enfant_date_naissance
    ? new Date(famille.enfant_date_naissance).toLocaleDateString("fr-FR")
    : "-";

  const code = zakat.famille || "-";

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

      date_versement: infos[0]?.value,
      numero_zakat: infos[1]?.value,
      montant: infos[2]?.value,
      mode_remise: infos[3]?.value,

      observation: observations,
      cause_principale: cause,
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
              Détail du zakat {zakat.numero_zakat}
            </h2>

          </div>

          {/* Carte */}

          <Card
           mere={mere}
            enfant={enfant}
            sexe={sexe}
            region={region}
            naissance={dateNaissance}
            code={code}
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
                height="h-[60px]"
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
  height="h-[50px]"
  options={causePrincipaleOptions}
/>

              <TextareaModifier
                label="Précisions :"
                value={precisions}
                onChange={(e) => setPrecisions(e.target.value)}
                height="h-[80px]"
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
