import { AnimatePresence, motion } from "framer-motion";

import InfoCard from "../Containers/AfficherContainer";
import Button from "../Button/Button";

import quitter from "../../assets/quitter.svg";
import EditIcon from "../../assets/Container.svg";

const PopupDetailVersement = ({
  open,
  onClose,
  versement,
  onEdit,
  loading = false,
  error = false,
}) => {
  if (!open) return null;

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("fr-FR");
  };

  const dateVersement = formatDate(versement?.date_versement);

  const montant = versement?.montant ?? "0";
  const montantEur = versement?.montant_eur ?? null;

  const tauxUtilise =
    versement?.taux_utilise !== null && versement?.taux_utilise !== undefined
      ? versement.taux_utilise
      : "-";

  const note = versement?.note || "-";

  const creePar = versement?.cree_par?.nom || "-";
  const modifiePar = versement?.modifie_par?.nom || "-";

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
            sm:w-[820px]
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
              <img src={quitter} alt="Fermer" className="w-5 h-5" />
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
              Detail versement
            </h2>
          </div>

          {loading && (
            <p className="text-center text-gray-500 py-10">Chargement...</p>
          )}

          {!loading && error && (
            <p className="text-center text-red-500 py-10">
              Impossible de charger les détails du versement.
            </p>
          )}

          {!loading && !error && versement && (
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
                      label: "Enregistré par",
                      value: creePar,
                    },
                    {
                      label: "Modifié par",
                      value: modifiePar,
                    },
                  ]}
                />

                <div>
                  <p className="text-black font-semibold mb-2">Montant MRU</p>

                  <div
                    className="
                      flex
                      items-center
                      justify-between

                      border
                      border-[#84D6D0]
                      rounded-[15px]

                      px-4
                      py-4
                    "
                  >
                    <span className="font-bold text-[#4E9F8A]">
                      {montant} MRU
                    </span>
                    {montantEur !== null && (
                      <span className="text-[16px] text-[#000000] font-regular">
                        ≈ {montantEur} EUR
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-[#4E9F8A] font-medium mb-2">Note :</p>

                  <div
                    className="
                      border
                      border-[#84D6D0]
                      rounded-[15px]

                      px-4
                      py-3

                      min-h-[70px]
                    "
                  >
                    <p className="text-[#000000]">{note}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[#4E9F8A] font-medium mb-2">
                    Taux de change utilisé :
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
                    <p className="text-[#7B7B7B]">{tauxUtilise}</p>
                  </div>
                </div>

                <Button
                  title="Modifier"
                  variant="modifier"
                  icon={EditIcon}
                  noWrapperPadding
                  onClick={() => onEdit?.(versement)}
                  className="w-full mt-4"
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PopupDetailVersement;