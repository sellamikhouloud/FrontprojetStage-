import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageHeader from "../Navigation,Pageheader/PageHeader";
import Button from "../Button/Button";
import { Check } from "lucide-react";

const SelectProductsPopup = ({
  open = true,
  onClose,
  stockProducts = [],
  onConfirm,
}) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleProduct = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const selectedProducts = stockProducts.filter((product) =>
      selectedIds.includes(product.id)
    );

    onConfirm?.(selectedProducts);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="
            fixed inset-0 z-50

            bg-transparent
            sm:bg-[#9A9A9A80]

            flex
            items-start
            sm:items-center
            justify-center

            overflow-y-auto
            sm:p-4
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
              h-screen

              sm:h-auto
              sm:min-h-0
              sm:max-w-[550px]
              sm:max-h-[90vh]

              bg-white

              rounded-none
              sm:rounded-[20px]

              shadow-none
              sm:shadow-[0_10px_30px_rgba(0,0,0,0.08)]

              flex
              flex-col
              overflow-hidden
            "
          >
            {/* Header */}
            <div className="px-5 pt-4 pb-6">
              <PageHeader
                leftTitle="Fermer"
                showRight={false}
                onBack={onClose}
              />

              <h2 className="text-center text-[20px] font-semibold text-[#202124]">
                Produits en stock
              </h2>

              <p className="text-center text-[14px] text-[#6B7280] mt-1">
                Sélectionnez les produits à ajouter au colis alimentaire
              </p>
            </div>

            {/* List */}
            <div
              className="
                flex-1
                overflow-y-auto
                px-5
                pb-4
                space-y-2
              "
            >
              {stockProducts.map((product) => {
                const isSelected = selectedIds.includes(product.id);

                return (
                  <div
                    key={product.id}
                    onClick={() => toggleProduct(product.id)}
                    className={`
                      min-h-[52px]
                      border
                      rounded-[12px]
                      px-3
                      flex
                      items-center
                      justify-between
                      cursor-pointer
                      transition-colors
                      ${
                        isSelected
                          ? "border-[#4E9F8A] bg-[#F2FAFA]"
                          : "border-[#84D6D0] bg-white"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {product.icon && (
                        <img
                          src={product.icon}
                          alt=""
                          className="w-6 h-6 object-contain"
                        />
                      )}

                      <span className="text-[15px] font-medium">
                        {product.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-end gap-1">
                        <span className="text-[#4E9F8A] font-bold text-[16px]">
                          {product.quantity}
                        </span>
                        <span className="text-[14px]">{product.unit}</span>
                      </div>

                      <div
                        className={`
                          w-6
                          h-6
                          rounded-[6px]
                          border
                          flex
                          items-center
                          justify-center
                          transition-colors
                          ${
                            isSelected
                              ? "bg-[#4E9F8A] border-[#4E9F8A]"
                              : "border-[#B5C8C7] bg-white"
                          }
                        `}
                      >
                        {isSelected && (
                          <Check size={14} color="white" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {stockProducts.length === 0 && (
                <div className="py-10 text-center text-gray-500">
                  Aucun produit en stock.
                </div>
              )}
            </div>

            {/* Bottom action */}
            <div className="bg-white px-5 py-4 shrink-0">
              <Button
                title={`Ajouter (${selectedIds.length})`}
                variant="save"
                noWrapperPadding
                disabled={selectedIds.length === 0}
                onClick={handleConfirm}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SelectProductsPopup;