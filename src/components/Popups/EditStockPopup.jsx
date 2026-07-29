import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import PageHeader from "../Navigation,Pageheader/PageHeader";
import Button from "../Button/Button";

import Modify from "../../assets/Modify.svg";

const EditStockPopup = ({
  open = true,
  products: initialProducts = [],
  onClose,
  onSave,
}) => {
  const [thresholds, setThresholds] = useState([]);

  useEffect(() => {
    setThresholds(
      initialProducts.map((product) => ({
        title: product.title || product.nom,
        unit: product.unit || product.unite,
        threshold:
          product.threshold ??
          product.seuil ??
          1,
      }))
    );
  }, [initialProducts]);

  const handleChange = (index, value) => {
    const updated = [...thresholds];

    updated[index].threshold =
      value === ""
        ? ""
        : Math.max(0, Number(value));

    setThresholds(updated);
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="
            fixed
            inset-0
            z-50
            bg-[#9A9A9A80]
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
            onClick={(e) => e.stopPropagation()}
            className="
              w-full
              min-h-screen

              sm:min-h-0
              sm:w-full
              sm:max-w-[550px]
              sm:h-[90vh]

              bg-white

              rounded-none
              sm:rounded-[20px]

              shadow-none
              sm:shadow-xl

              flex
              flex-col

              overflow-hidden
            "
          >
            {/* Header */}

            <div className="px-5 pt-4 pb-5 shrink-0">
              <PageHeader
                leftTitle="Annuler"
                showRight={false}
                onBack={onClose}
              />

              <h2 className="text-center text-[20px] font-semibold mt-2">
                Modifier les seuils d'alertes nutritionnelles
              </h2>
            </div>

            {/* Scrollable list */}

            <div
              className="
                flex-1
                overflow-y-auto
                px-5
                pb-4
                space-y-2
              "
            >
              {thresholds.map((product, index) => (
                <div
                  key={`${product.title}-${index}`}
                  className="
                    h-[44px]
                    border
                    border-[#FF6B6B]
                    rounded-[12px]
                    px-3
                    flex
                    items-center
                    justify-between
                  "
                >
                  <span className="text-[15px] font-medium">
                    {product.title}
                  </span>

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      px-3
                      h-[32px]
                      rounded-[10px]
                      bg-[#FFE6EC]
                    "
                  >
                    <input
                      type="text"
                      inputMode="numeric"
                      value={product.threshold}
                      onChange={(e) =>
                        handleChange(
                          index,
                          e.target.value
                        )
                      }
                      className="
                        w-[35px]
                        bg-transparent
                        text-[#EF4444]
                        text-[20px]
                        font-bold
                        text-center
                        outline-none
                      "
                    />

                    <span className="text-[14px] whitespace-nowrap">
                      {product.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom button */}

            <div className="px-5 py-4 bg-white shrink-0">
              <Button
                title="Sauvegarder"
                variant="modifier"
                icon={Modify}
                noWrapperPadding
                onClick={() => onSave(thresholds)}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditStockPopup;