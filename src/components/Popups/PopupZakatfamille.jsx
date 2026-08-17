import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import quitter from "../../assets/quitter.svg";

import CardListZakat from "../Cards/CarteListeZakat";
import PopupDetailZakat from "./PopupdetailsZakat";
import PopupModifierZakat from "./PopupdetailsZakatModifier";
import Spinner from "../Spinner";

const PopupZakatFamille = ({
  open,
  onClose,
  zakats = [],
  isLoading = false,
}) => {
  const [selectedZakat, setSelectedZakat] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openModifier, setOpenModifier] = useState(false);

  const selectedFamille = selectedZakat?.famille_info || null;

  return (
    <AnimatePresence>
      {open && (
        <div
          key="zakat-overlay"
          className="
            fixed inset-0 z-50
            bg-transparent sm:bg-black/30
            flex items-start sm:items-center
            justify-center
            overflow-y-auto
            scrollbar-hide
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
              sm:max-w-[620px]

              bg-white

              rounded-none
              sm:rounded-[18px]

              border-0
              sm:border
              sm:border-[#DCE5EC]

              shadow-none
              sm:shadow-2xl
            "
          >
            {/* Header */}
            <div className="px-5 sm:px-6 pt-5">
              <button
                onClick={onClose}
                className="
                  flex
                  items-center
                  gap-2
                  text-[16px]
                  sm:text-[17px]
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
                  mt-5
                  text-center
                  text-[22px]
                  sm:text-[24px]
                  font-semibold
                  text-[#1E1E1E]
                "
              >
                Zakat
              </h2>
            </div>

            {/* Cartes */}
            <div
              className="
                px-5
                sm:px-6
                pb-6
                mt-5
                flex-1
                max-h-none
                sm:max-h-[420px]
                overflow-y-auto
                scrollbar-hide
                space-y-4
              "
            >
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Spinner />
                </div>
              ) : zakats.length ? (
              zakats.map((item, index) => {
  const famille = item.famille_info || {};

  const sexe =
    famille.enfant_sexe === "M" ||
    famille.enfant_sexe === "Masculin"
      ? "Fils"
      : famille.enfant_sexe === "F" ||
        famille.enfant_sexe === "Féminin"
      ? "Fille"
      : "-";

  return (
    <CardListZakat
      key={item.id || `zakat-${index}`}
      sexe={sexe}
      showNomCode={false}
      zakat={`Zakat ${item.numero_zakat ?? "-"}`}
      date={
        item.date_versement
          ? new Date(item.date_versement).toLocaleDateString("fr-FR")
          : "-"
      }
      montant="Montant"
      valeur={`${item.montant ?? "0"} MRU / ${item.montant_eur ?? "0"} EUR`}
      onClick={() => {
        setSelectedZakat(item);
        setOpenDetail(true);
      }}
    />
  );
})
              ) : (
                <div className="py-10 text-center text-gray-500">
                  Aucun zakat.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* ============================
          POPUP DETAIL
      ============================ */}

      <PopupDetailZakat
        key="zakat-detail"
        open={openDetail}
        onClose={() => {
          setOpenDetail(false);
        }}
        zakat={selectedZakat}
        famille={selectedFamille}
        onEdit={() => {
          setOpenDetail(false);
          setOpenModifier(true);
        }}
      />

      {/* ============================
          POPUP MODIFICATION
      ============================ */}

      <PopupModifierZakat
        key="zakat-modifier"
        open={openModifier}
        onClose={() => {
          setOpenModifier(false);
        }}
        zakat={selectedZakat}
        famille={selectedFamille}
      />
    </AnimatePresence>
  );
};

export default PopupZakatFamille;
