import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import quitter from "../assets/quitter.svg";

import TextArea from "./Textarea";
import Button from "./Button";

const PopupFinSuivi = ({
  title = "Fin de suivi",
  onClose,
  onConfirm,
}) => {
  const [motif, setMotif] = useState("");

  return (
    <AnimatePresence>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="
            w-full
            max-w-[550px]

            bg-white

            rounded-[20px]
            border
            border-[#4E9F8A]

            px-8
            py-7

            shadow-xl
          "
        >

          {/* Fermer */}
          <button
            onClick={onClose}
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
              mb-6

              text-[28px]
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

        <div className="mt-8">
  <Button
    title="Confirmer la sortie"
    variant="confirm"
    onClick={() => onConfirm?.(motif)}
  />
</div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
};

export default PopupFinSuivi;