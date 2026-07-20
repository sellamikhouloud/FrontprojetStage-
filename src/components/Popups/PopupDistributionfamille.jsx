import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import quitter from "../../assets/quitter.svg";

import CardPopupDistribution from  "../Cards/cardDistribution";

const PopupDistributionfamille = ({
  open,
  onClose,
  Distribution = [],
}) => {
  return (
    <AnimatePresence>
      {open && (
        <div
 className="
  fixed
  inset-0
  z-50

  bg-transparent
  sm:bg-black/30

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
                Distributions
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

                space-y-4
              "
            >
              {Distribution.length ? (
                Distribution.map((item) => (
                  <CardPopupDistribution
                    key={item.id}
                    distribution={item.distribution}
                    date={item.date}
                    produits={item.produits}
                    onClick={() => console.log(item)}
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
    </AnimatePresence>
  );
};

export default PopupDistributionfamille;



