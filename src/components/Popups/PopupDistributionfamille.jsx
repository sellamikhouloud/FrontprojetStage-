import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import quitter from "../../assets/quitter.svg";

import CardPopupDistribution from "../Cards/cardDistribution";
import PopupDetailDistribution from "./PopupdetailsDistributions";

import Spinner from "../Spinner";

const PopupDistributionfamille = ({
  open,
  onClose,
  Distribution = [],
  famille,
  isLoading = false,
}) => {
  const [selectedDistribution, setSelectedDistribution] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
 

  // Tri chronologique : la plus ancienne = Distribution 1
  const distributionsTriees = useMemo(() => {
    return [...Distribution]
      .sort((a, b) => {
        const dateA = new Date(a.date_distribution);
        const dateB = new Date(b.date_distribution);

        const diff = dateA - dateB;

        // Si même date, on utilise l'id comme deuxième critère
        return diff !== 0 ? diff : (a.id ?? 0) - (b.id ?? 0);
      })
      .map((item, index) => ({
        ...item,
        numeroDistribution: index + 1,
      }));
  }, [Distribution]);

  return (
    <AnimatePresence>
      {open && (
        <div
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

              overflow-y-auto
              scrollbar-hide
            "
          >
            {/* Header */}
            <div className="px-5 sm:px-6 pt-5">
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
                  text-[22px] sm:text-[24px]
                  font-semibold
                  text-[#1E1E1E]
                "
              >
                Distributions
              </h2>
            </div>

            {/* Cartes */}
            <div
              className="
                px-5 sm:px-6
                pb-6
                mt-5
                space-y-4

                sm:max-h-[420px]
                sm:overflow-y-auto
                scrollbar-hide
              "
            >
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Spinner />
                </div>
              ) : distributionsTriees.length ? (
                distributionsTriees.map((item) => (
                  <CardPopupDistribution
                    key={item.id}
                    distribution={`Distribution ${item.numeroDistribution}`}
                    date={
                      item.date_distribution
                        ? new Date(
                            item.date_distribution
                          ).toLocaleDateString("fr-FR")
                        : "-"
                    }
                    produits={(item.produits || []).map((prod) => ({
  nom: prod.produit?.nom ?? "-",
  quantite: `${Number(prod.quantite ?? 0)} ${
  prod.produit?.unite === "boite"
    ? "boîtes"
    : prod.produit?.unite ?? ""
}`.trim(),
}))}
                    onClick={() => {
                      setSelectedDistribution(item);
                      setOpenDetail(true);
                    }}
                  />
                ))
              ) : (
                <div className="py-10 text-center text-gray-500">
                  Aucune distribution.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      <PopupDetailDistribution
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        distribution={selectedDistribution}
        famille={famille}
        onEdit={() => {
          setOpenDetail(false);
          setOpenModifier(true);
        }}
      />

     
    </AnimatePresence>
  );
};

export default PopupDistributionfamille;


