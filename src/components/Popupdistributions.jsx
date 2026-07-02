import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import quitter from "../assets/quitter.svg";

const PopupDistribution = ({
  title = "Distributions ce mois",
  items = [],
  onClose,
}) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  return (
    <AnimatePresence>
      {open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="
              w-full
              max-w-[520px]

              bg-white

              rounded-[15px]
              border
              border-[#4E9F8A]

              shadow-xl

              px-5
              py-6
            "
          >
            {/* Fermer */}
            <button
              onClick={handleClose}
              className="
                flex
                items-center
                gap-2

                text-[18px]
                font-medium
                text-black

                transition-opacity
                duration-150

                hover:opacity-70
              "
            >
              <img
                src={quitter}
                alt="Fermer"
                className="w-5 h-5"
              />

              Fermer
            </button>

            {/* Titre */}
            <h2
              className="
                mt-6
                mb-8

                text-center

                text-[22px]
                sm:text-[24px]

                font-semibold
                text-black
              "
            >
              {title}
            </h2>

            {/* Liste */}
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  {/* Nom */}
                  <span
                    className="
                      text-[18px]
                      font-medium
                      text-black
                    "
                  >
                    {item.name}
                  </span>

                  {/* Valeur */}
                  <div className="flex items-end gap-1">
                    <span
                      className="
                        text-[#4E9F8A]

                        text-[24px]
                        font-bold

                        leading-none
                      "
                    >
                      {item.value}
                    </span>

                    <span
                      className="
                        text-[15px]
                        font-normal
                        text-black
                      "
                    >
                      {item.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PopupDistribution;
