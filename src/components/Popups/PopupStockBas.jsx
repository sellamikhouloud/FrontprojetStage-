import { motion, AnimatePresence } from "framer-motion";
import { X, Pencil } from "lucide-react";

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
            className="fixed inset-0 bg-black/30 z-40"
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
              className="flex items-center gap-2 text-[18px] font-medium"
            >
              <X size={28} />
              Fermer
            </button>

            {/* Title */}

            <h2 className="text-center text-[24px] font-semibold mt-8 mb-10">
              Stock Bas
            </h2>

            {/* Products */}

            <div className="space-y-3">
              {products.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <span className="text-[18px] font-medium">
                    {item.name}
                  </span>

                  <div className="flex items-end gap-1">
                    <span className="text-[#EF4444] text-[24px] font-extrabold leading-[28px]">
                      {item.quantity}
                    </span>

                    <span className="text-[14px]">
                      {item.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Button */}

            <button
              onClick={onGoToStock}
              className="
                mt-12
                w-full
                h-[54px]
                rounded-full
                bg-[#73C8C5]
                hover:bg-[#69BEBB]
                transition
                flex
                items-center
                justify-center
                gap-3
                text-white
                text-[18px]
                font-semibold
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