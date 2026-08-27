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
  isSaving = false,
}) => {
  const [thresholds, setThresholds] = useState([]);

  // INITIALIZE
  useEffect(() => {
    if (!Array.isArray(initialProducts)) {
      setThresholds([]);
      return;
    }

    const formattedThresholds = initialProducts.map((product) => ({
      id: product.id,

      title:
        product.title ??
        product.nom ??
        "",

      unit:
        product.unit ??
        product.unite ??
        "",

      threshold:
        product.threshold ??
        product.alerte_seuil ??
        product.seuil ??
        1,
    }));

    setThresholds(formattedThresholds);
  }, [initialProducts]);

  // CHANGE THRESHOLD
  const handleChange = (index, value) => {
    // Only numbers
    const cleanedValue = value.replace(/\D/g, "");

    setThresholds((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        threshold:
          cleanedValue === ""
            ? ""
            : Number(cleanedValue),
      };

      return updated;
    });
  };

  // SAVE
  const handleSave = () => {
    // Check empty values
    const hasInvalidValue = thresholds.some(
      (product) =>
        product.threshold === "" ||
        product.threshold === null ||
        product.threshold === undefined
    );

    if (hasInvalidValue) {
      return;
    }

    console.log(
      "================================"
    );

    console.log(
      "SEUILS MODIFIÉS"
    );

    console.log(
      thresholds
    );

    console.log(
      "================================"
    );

    // Send the complete edited list to StockPopup
    onSave?.(thresholds);
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
          onClick={onClose}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
            }}
            transition={{
              duration: 0.2,
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
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
            {/* =================================================
                HEADER
            ================================================= */}

            <div className="px-5 pt-4 pb-5 shrink-0">
              <PageHeader
                leftTitle="Annuler"
                showRight={false}
                onBack={onClose}
              />

              <h2
                className="
                  text-center
                  text-[20px]
                  font-semibold
                  mt-2
                "
              >
                Modifier les seuils d'alertes
                nutritionnelles
              </h2>
            </div>

            {/* =================================================
                PRODUCTS
            ================================================= */}

            <div
              className="
                flex-1
                overflow-y-auto
                px-5
                pb-4
                space-y-2
              "
            >
              {thresholds.length === 0 ? (
                <div
                  className="
                    flex
                    items-center
                    justify-center
                    h-full
                    text-gray-500
                  "
                >
                  Aucun produit disponible.
                </div>
              ) : (
                thresholds.map(
                  (product, index) => (
                    <div
                      key={`${product.id}-${index}`}
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
                      {/* PRODUCT NAME */}

                      <span
                        className="
                          text-[15px]
                          font-medium
                        "
                      >
                        {product.title}
                      </span>

                      {/* THRESHOLD */}

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
                          pattern="[0-9]*"
                          value={
                            product.threshold
                          }
                          disabled={isSaving}
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

                        <span
                          className="
                            text-[14px]
                            whitespace-nowrap
                          "
                        >
                          {product.unit}
                        </span>
                      </div>
                    </div>
                  )
                )
              )}
            </div>

            {/* =================================================
                SAVE
            ================================================= */}

            <div
              className="
                px-5
                py-4
                bg-white
                shrink-0
              "
            >
              <Button
                title={
                  isSaving
                    ? "Sauvegarde..."
                    : "Sauvegarder"
                }
                variant="modifier"
                icon={Modify}
                noWrapperPadding
                onClick={handleSave}
                disabled={isSaving}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditStockPopup;
