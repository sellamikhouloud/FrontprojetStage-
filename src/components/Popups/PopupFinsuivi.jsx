import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import quitter from "../../assets/quitter.svg";

import TextArea from "../Containers/Textarea";
import Button from "../Button/Button";

const PopupFinSuivi = ({
  open,
  title = "Fin de suivi",
  onClose,
  onConfirm,
}) => {
  const [motif, setMotif] = useState("");

  return (
    <AnimatePresence>
      {open && (
        <div
         className="
  fixed
  inset-0
  z-50

  bg-white
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
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="
              w-full

              min-h-screen
              sm:min-h-0

              sm:max-w-[550px]

              bg-white

              rounded-none
              sm:rounded-[20px]

              border-0
              sm:border
              sm:border-[#4E9F8A]

              shadow-none
              sm:shadow-xl

              px-5
              sm:px-8

              py-6
              sm:py-7
            "
          >
            {/* Fermer */}
            <button
              onClick={onClose}
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
                mb-6

                text-center

                text-[24px]
                sm:text-[28px]

                font-semibold
                text-[#1F2937]
              "
            >
              {title}
            </h2>

            {/* TextArea */}
            <TextArea
              label="Motif de sortie"
              placeholder="Entrez le motif"
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              height="h-[130px]"
            />

            {/* Bouton */}
            <div className="mt-8">
              <Button
                title="Confirmer la sortie"
                variant="confirm"
                onClick={() => {
                  onConfirm?.(motif);
                  setMotif("");
                }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PopupFinSuivi;
