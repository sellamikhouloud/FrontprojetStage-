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
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="
              w-full

              min-h-screen
              sm:min-h-0

              sm:max-w-[520px]

              bg-white

              rounded-none
              sm:rounded-[15px]

              border-0
              sm:border
              sm:border-[#4E9F8A]

              shadow-none
              sm:shadow-xl

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

                text-[16px]
                sm:text-[18px]

                font-medium
                text-black

                hover:opacity-70
                transition-opacity
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
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <span
                    className="
                      text-[16px]
                      sm:text-[18px]
                      font-medium
                      text-black
                    "
                  >
                    {item.name}
                  </span>

                  <div className="flex items-end gap-1">
                    <span
                      className="
                        text-[#4E9F8A]

                        text-[22px]
                        sm:text-[24px]

                        font-bold
                        leading-none
                      "
                    >
                      {item.value}
                    </span>

                    <span
                      className="
                        text-[14px]
                        sm:text-[15px]
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
