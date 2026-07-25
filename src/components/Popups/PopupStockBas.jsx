import { motion, AnimatePresence } from "framer-motion";
import { Pencil } from "lucide-react";
import quitter from "../../assets/quitter.svg";

export default function PopupStockBas({
  isOpen,
  onClose,
  products = [],
  onGoToStock,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}

          <motion.div
            className="fixed inset-0 z-40 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Popup */}

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ duration: 0.25 }}
            className="
              fixed
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
              z-50
              w-[620px]
              max-w-[95vw]
              rounded-[42px]
              border
              border-[#69B89C]
              bg-white
              px-8
              py-7
              shadow-xl
            "
          >
            {/* Close */}

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

            {/* Title */}

            <h2 className="mt-8 mb-10 text-center text-[24px] font-semibold">
              Stock Bas
            </h2>

            {/* Products */}

            <div className="space-y-4">
              {products.length > 0 ? (
                products.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-[18px] font-medium">
                      {item.name}
                    </span>

                    <div className="flex items-end gap-1">
                      <span
                        className="
                          text-[#EB5757]
                          text-[26px]
                          font-bold
                          leading-none
                        "
                      >
                        {item.quantity}
                      </span>

                      <span className="text-[15px] text-[#3A3A3A]">
                        {item.unit}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  Aucun produit en stock bas.
                </p>
              )}
            </div>

            {/* Button */}

            <button
              onClick={onGoToStock}
              className="
                mt-12
                flex
                h-[54px]
                w-full
                items-center
                justify-center
                gap-3
                rounded-full
                bg-[#73C8C5]
                text-[18px]
                font-semibold
                text-white
                transition
                hover:bg-[#69BEBB]
              "
            >
              <Pencil size={20} />

              Aller à la page de stock
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}