import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import quitter from "../assets/quitter.svg";
import CardPopup from "./card2";

const PopupRetard = ({
  open,
  onClose,
  familleretard = [],
}) => {
  return (
    <AnimatePresence>
      {open && (
        <div
          className="
            fixed
            inset-0
            z-50

            bg-white

            flex
            items-start
            sm:items-center

            justify-center

            overflow-y-auto
          "
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="
              w-full

              min-h-screen
              sm:min-h-0

              sm:max-w-[760px]

              bg-white

              rounded-none
              sm:rounded-[18px]

              border-0
              sm:border
              sm:border-[#DCE5EC]

              shadow-none
              sm:shadow-2xl

              overflow-hidden
            "
          >
            {/* Header */}
            <div className="px-5 sm:px-6 pt-5 pb-3">
              <button
                onClick={onClose}
                className="
                  flex
                  items-center
                  gap-2
                  text-[16px]
                  sm:text-[18px]
                  font-medium
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
                  sm:text-[28px]
                  font-semibold
                  text-[#1E1E1E]
                "
              >
                Visites en retard
              </h2>
            </div>

            {/* Liste des cartes */}
            <div
              className="
                px-5
                sm:px-6

                pb-6

                mt-4

                flex-1

                max-h-none
                sm:h-[420px]

                overflow-y-auto

                space-y-4
              "
            >
              {familleretard.length > 0 ? (
                familleretard.map((item) => (
                  <CardPopup
                    key={item.id}
                    sexe={item.sexe}
                    enfant={item.enfant}
                    region={item.region}
                    naissance={item.naissance}
                    code={item.code}
                    badges={item.badges}
                    onClick={() => console.log(item)}
                  />
                ))
              ) : (
                <div className="py-10 text-center text-gray-500 text-[16px]">
                  Aucune visite en retard.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PopupRetard;
