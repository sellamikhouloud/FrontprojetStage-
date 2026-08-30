import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import quitter from "../../assets/quitter.svg";
import { listStock } from "../../lib/api/stock";

export default function PopupStockBas({
  isOpen,
  onClose,
  products = [],
  onLowStockCountChange,
}) {
  const navigate = useNavigate();

  // =========================================================
  // STATES
  // =========================================================

  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // =========================================================
  // FORMAT QUANTITY
  // =========================================================

  const formatQuantity = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return 0;
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return 0;
    }

    return Number(number.toFixed(2));
  };

  // =========================================================
  // BACKEND UNIT -> FRONTEND UNIT
  // =========================================================

  const getDisplayUnit = (unit) => {
    switch (unit) {
      case "kg":
        return "Kg";

      case "litre":
      case "litres":
        return "Litres";

      case "boite":
      case "boîtes":
        return "boîtes";

      default:
        return unit || "Kg";
    }
  };

  // =========================================================
  // GET LOW STOCK PRODUCTS
  // =========================================================

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      setIsLoading(true);

      try {
        // =====================================================
        // GET PRODUCTS FROM BACKEND
        // =====================================================

        const response = await listStock();

        const backendProducts =
          response?.data?.results ??
          response?.data ??
          [];

        // =====================================================
        // FORMAT + FILTER LOW STOCK
        // stock_courant <= alerte_seuil
        // =====================================================

        const formattedProducts = backendProducts
          .map((product) => {
            const quantity = formatQuantity(
              product.stock_courant ??
                product.quantity ??
                0
            );

            const threshold = formatQuantity(
              product.alerte_seuil ??
                product.threshold ??
                1
            );

            return {
              id: product.id,

              name:
                product.nom ??
                product.name ??
                product.title ??
                "",

              quantity,

              unit: getDisplayUnit(
                product.unite ??
                  product.unit
              ),

              threshold,
            };
          })
          .filter(
            (product) =>
              product.quantity <=
              product.threshold
          );

        // =====================================================
        // SAVE LOW STOCK PRODUCTS
        // =====================================================

        setLowStockProducts(
          formattedProducts
        );

        // =====================================================
        // SEND EXACT COUNT TO PARENT
        // =====================================================

        onLowStockCountChange?.(
          formattedProducts.length
        );
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du stock bas :",
          error
        );

        // =====================================================
        // FALLBACK TO PRODUCTS FROM PARENT
        // =====================================================

        const fallbackProducts = products
          .map((product) => {
            const quantity =
              formatQuantity(
                product.quantity ??
                  product.stock_courant ??
                  0
              );

            const threshold =
              formatQuantity(
                product.threshold ??
                  product.alerte_seuil ??
                  1
              );

            return {
              id: product.id,

              name:
                product.name ??
                product.title ??
                product.nom ??
                "",

              quantity,

              unit: getDisplayUnit(
                product.unit ??
                  product.unite
              ),

              threshold,
            };
          })
          .filter(
            (product) =>
              product.quantity <=
              product.threshold
          );

        setLowStockProducts(
          fallbackProducts
        );

        // =====================================================
        // SEND EXACT FALLBACK COUNT TO PARENT
        // =====================================================

        onLowStockCountChange?.(
          fallbackProducts.length
        );
      } finally {
        setIsLoading(false);
      }
    };

    // =========================================================
    // FETCH EVEN WHEN POPUP IS CLOSED
    // =========================================================

    fetchLowStockProducts();
  }, [products, onLowStockCountChange]);

  // =========================================================
  // GO TO STOCK PAGE
  // =========================================================

  const handleGoToStock = () => {
    onClose();
    navigate("/liste-distributions");
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="
            fixed
            inset-0
            z-50
            bg-[#9A9A9A]/60

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
              sm:w-[620px]
              sm:max-h-[90vh]

              bg-white

              rounded-none
              sm:rounded-[42px]

              border-0
              sm:border
              sm:border-[#69B89C]

              shadow-none
              sm:shadow-xl

              px-6
              sm:px-8

              pt-5
              sm:pt-7

              pb-6
              sm:pb-7
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

            <h2
              className="
                mt-6
                mb-8
                text-center
                text-[22px]
                sm:text-[24px]
                font-semibold
              "
            >
              Stock Bas
            </h2>

            {/* Products */}

            <div
              className={`
                space-y-4
                ${
                  lowStockProducts.length > 4
                    ? "max-h-[45vh] overflow-y-auto"
                    : ""
                }
              `}
            >
              {isLoading ? (
                <div className="py-10 text-center text-gray-500 text-[16px]">
                  Chargement...
                </div>
              ) : lowStockProducts.length > 0 ? (
                lowStockProducts.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <span className="text-[16px] sm:text-[18px] font-medium">
                      {item.name}
                    </span>

                    <div className="flex items-end gap-1">
                      <span className="text-[#EF4444] text-[22px] sm:text-[24px] font-extrabold leading-none">
                        {item.quantity}
                      </span>

                      <span className="text-[13px] sm:text-[14px]">
                        {item.unit}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-gray-500 text-[16px]">
                  Aucun produit en stock bas.
                </div>
              )}
            </div>

            {/* Button */}

            <button
              onClick={handleGoToStock}
              className="
                mt-10
                sm:mt-12

                w-full
                h-[52px]
                sm:h-[54px]

                rounded-full
                bg-[#73C8C5]
                hover:bg-[#69BEBB]
                transition

                flex
                items-center
                justify-center
                gap-3

                text-white
                text-[16px]
                sm:text-[18px]
                font-semibold
              "
            >
              <Pencil size={20} />

              Aller à la page de stock
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
