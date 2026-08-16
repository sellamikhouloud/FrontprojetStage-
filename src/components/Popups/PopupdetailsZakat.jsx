import { AnimatePresence, motion } from "framer-motion";

import Card from "../Cards/Card";
import InfoCard from "../Containers/AfficherContainer";
import Button from "../Button/Button";

import quitter from "../../assets/quitter.svg";
import EditIcon from "../../assets/Container.svg";

const PopupDetailZakat = ({
  open,
  onClose,
  zakat,
  famille,
  onEdit,
}) => {
  if (!open || !zakat) return null;

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("fr-FR");
  };

  const enfant = famille?.enfant_prenom || "-";
  const mere = famille?.mere_nom || "-";

  const sexe =
    famille?.enfant_sexe === "M" || famille?.enfant_sexe === "Masculin"
      ? "Fils"
      : famille?.enfant_sexe === "F" || famille?.enfant_sexe === "Féminin"
      ? "Fille"
      : "-";

  const region = famille?.village || "-";
  const dateNaissance = formatDate(famille?.enfant_date_naissance);
  const code = zakat.famille || "-";

  const numeroZakat = zakat.numero_zakat ?? "-";
  const dateVersement = formatDate(zakat.date_versement);
  const dateCreation = formatDate(zakat.date_creation);
  const dateModification = formatDate(zakat.date_modification);

  return (
    <AnimatePresence>
      <div
        className="
          fixed inset-0 z-[60]
          bg-transparent sm:bg-black/40
          flex items-start sm:items-center
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
          {/* HEADER */}
          <div className="mb-4">
            <button
              onClick={onClose}
              className="
                flex
                items-center
                gap-2
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

          {/* CARTE FAMILLE */}
          <Card
            enfant={enfant}
            mere={mere}
            sexe={sexe}
            region={region}
            naissance={dateNaissance}
            code={code}
            badges={[]}
          />

          {/* CONTENU */}
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-[58%_40%]
              gap-5
              mt-4
            "
          >
            {/* ======================
                COLONNE GAUCHE
            ====================== */}

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
                    value: zakat.mode_remise ?? "-",
                  },
                  {
                    label: "Enregistrée par",
                    value: zakat.cree_par?.nom || "-",
                  },
                  {
                    label: "Date d'enregistrement",
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

            {/* ======================
                COLONNE DROITE
            ====================== */}

            <div className="space-y-3">

              <h2 className="text-[18px] font-semibold">
                Motif de sélection
              </h2>

              {/* CAUSE */}
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
                  {zakat.cause_principale || "-"}
                </div>
              </div>

              {/* PRECISIONS */}
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

              {/* MODIFIER */}
              <Button
                title="Modifier"
                variant="modifier"
                icon={EditIcon}
                noWrapperPadding
                onClick={() => onEdit?.(zakat)}
              />

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PopupDetailZakat;
