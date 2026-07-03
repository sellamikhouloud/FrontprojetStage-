import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import quitter from "../assets/quitter.svg";
import Card from "./card";

const PopupRetard = ({
  open,
  onClose,
  familleretard = [],
}) => {
  return (
    <AnimatePresence>
      {open && (
     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="
              w-full
              max-w-[760px]
              bg-white
              rounded-[18px]
              shadow-2xl
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
                  mt-3

                  text-[24px]
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
    pb-5
    pt-2

    space-y-3

    h-[420px]
    overflow-y-auto

    pr-2
  "

            >
              {familleretard.length > 0 ? (
                familleretard.map((item) => (
                  <Card
                    key={item.id}
                    {...item}
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