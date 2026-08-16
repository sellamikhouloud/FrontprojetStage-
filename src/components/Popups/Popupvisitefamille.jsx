import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import quitter from "../../assets/quitter.svg";
import { useState } from "react";
import PopupDetailVisite from "./Popupdetailsvisite";
import CardPopupvisite from "../Cards/cardvisite";
import PopupDetailVisiteModifier from "./PopupdetailvisiteModifier";
import Spinner from "../Spinner";

const Popupvisites = ({
  open,
  onClose,
  Visites = [],
  famille,
  isLoading = false,
}) => {
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedVisite, setSelectedVisite] = useState(null);
  const [openModifier, setOpenModifier] = useState(false);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="
            fixed inset-0 z-50
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
              sm:w-[560px]
              sm:max-h-[90vh]

              overflow-y-auto
              scrollbar-hide

              bg-white

              rounded-none
              sm:rounded-[18px]

              border-0
              sm:border
              sm:border-[#DCE5EC]

              shadow-none
              sm:shadow-2xl

              p-4
              sm:p-6
            "
          >
            <PopupDetailVisite
              open={openDetail}
              onClose={() => setOpenDetail(false)}
              visite={selectedVisite}
              famille={famille}
              onEdit={() => {
                setOpenDetail(false);
                setOpenModifier(true);
              }}
            />

          <PopupDetailVisiteModifier
  open={openModifier}
  onClose={() => setOpenModifier(false)}
  visite={selectedVisite}
  famille={famille}
/>

            {/* Header */}
            <div className="mb-5">
              <button
                onClick={onClose}
                className="
                  flex items-center gap-2
                  text-[16px] sm:text-[17px]
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
                Visites
              </h2>
            </div>

            {/* Cartes */}
            <div
              className="
                space-y-4

                sm:max-h-[60vh]
                sm:overflow-y-auto

                scrollbar-hide

                pb-2
                pr-1
              "
            >
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Spinner />
                </div>
              ) : Visites.length ? (
                Visites.map((item, index) => (
                  <CardPopupvisite
                    key={item.id ?? `visite-${index}`}
                    visite={
                      item.numero_visite !== undefined && item.numero_visite !== null
                        ? `Visite ${item.numero_visite + 1}`
                        : `Visite ${index + 1}`
                    }
                   date={
  item.date_visite
    ? new Date(item.date_visite).toLocaleDateString("fr-FR")
    : "-"
}
                    poids={item.poids_bebe ?? "-"}
                    taille={item.taille_bebe ?? "-"}
                    badges={[
                      // =========================
                      // STATUT NUTRITIONNEL BÉBÉ
                      // =========================

                      (item.statut_nutritionnel === "mam" ||
                        item.statut_nutritionnel === "Malnutrition Aiguë Modérée") && {
                        type: "mam",
                        text: "MAM nourrisson",
                      },

                      (item.statut_nutritionnel === "mas" ||
                        item.statut_nutritionnel === "Malnutrition Aiguë Sévère") && {
                        type: "mas",
                        text: "MAS nourrisson",
                      },

                      (item.statut_nutritionnel === "normale" ||
                        item.statut_nutritionnel === "Normale") && {
                        type: "mere",
                        text: "Bébé normal",
                      },

                      // =========================
                      // STATUT NUTRITIONNEL MÈRE
                      // =========================

                      (item.statut_nutritionnel_mere === "normale" ||
                        item.statut_nutritionnel_mere === "Normale") && {
                        type: "mere",
                        text: "Mère normale",
                      },

                      (item.statut_nutritionnel_mere === "a_risque" ||
                        item.statut_nutritionnel_mere === "À risque") && {
                        type: "risque",
                        text: "Mère à risque",
                      },

                      (item.statut_nutritionnel_mere === "malnutrition" ||
                        item.statut_nutritionnel_mere === "Malnutrition") && {
                        type: "mas",
                        text: "Mère malnutrie",
                      },
                    ].filter(Boolean)}
                    onClick={() => {
                      setSelectedVisite(item);
                      setOpenDetail(true);
                    }}
                  />
                ))
              ) : (
                <div className="py-10 text-center text-gray-500">Aucune visite.</div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Popupvisites;
