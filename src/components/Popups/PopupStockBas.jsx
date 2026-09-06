import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import quitter from "../../assets/quitter.svg";

export default function PopupStockBas({
  isOpen,
  onClose,
  products = [],
}) {
  const navigate = useNavigate();

  const [lowStockProducts, setLowStockProducts] = useState([]);

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

const formatStockAlert = (alert) => {
  const message = alert?.message || "";

  const match = message.match(
    /produit\s+'([^']+)'.*?\(([\d.,]+)\/([\d.,]+)\)\s*([^\s.]+)?\.?$/
  );

  if (!match) {
    return {
      id: alert?.id,
      name: "Produit",
      quantity: 0,
      threshold: 0,
      unit: "",
    };
  }

  const [, name, quantity, threshold, unit] = match;

  return {
    id: alert?.id,
    name,
    quantity: formatQuantity(
      quantity.replace(",", ".")
    ),
    threshold: formatQuantity(
      threshold.replace(",", ".")
    ),
    unit: unit || "",
  };
};

  // =========================================================
  // LOAD PRODUCTS FROM DASHBOARD DATA
  // =========================================================

  useEffect(() => {
    // =======================================================
    // SAME LOGIC AS PopupMas
    // Don't process anything when popup is closed
    // =======================================================

    if (!isOpen) {
      setLowStockProducts([]);
      return;
    }

    // =======================================================
    // DASHBOARD ALREADY GIVES US THE STOCK ALERTS
    // =======================================================

    if (!Array.isArray(products)) {
      setLowStockProducts([]);
      return;
    }

    // =======================================================
    // KEEP ONLY UNRESOLVED LOW-STOCK ALERTS
    // =======================================================

    const formattedProducts = products
      .filter(
        (alert) =>
          alert?.type === "stock_faible" &&
          !alert?.est_resolue
      )
      .map(formatStockAlert);

    // =======================================================
    // SAVE PRODUCTS
    // =======================================================

    setLowStockProducts(formattedProducts);
  }, [isOpen, products]);

  // =========================================================
  // GO TO STOCK PAGE
  // =========================================================

  const handleGoToStock = () => {
    onClose();

    navigate("/liste-distributions", {
      state: {
        openStockPopup: true,
      },
    });
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
            {/* =================================================
                CLOSE
            ================================================= */}

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

            {/* =================================================
                TITLE
            ================================================= */}

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

            {/* =================================================
                PRODUCTS
            ================================================= */}

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
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((item) => (
                  <div
                    key={item.id}
                    className="
                      flex
                      justify-between
                      items-center
                    "
                  >
                    <span
                      className="
                        text-[16px]
                        sm:text-[18px]
                        font-medium
                      "
                    >
                      {item.name}
                    </span>

                    <div className="flex items-end gap-1">
                      <span
                        className="
                          text-[#EF4444]
                          text-[22px]
                          sm:text-[24px]
                          font-extrabold
                          leading-none
                        "
                      >
                        {item.quantity}
                      </span>

                      {item.unit && (
                        <span
                          className="
                            text-[13px]
                            sm:text-[14px]
                          "
                        >
                          {item.unit}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className="
                    py-10
                    text-center
                    text-gray-500
                    text-[16px]
                  "
                >
                  Aucun produit en stock bas.
                </div>
              )}
            </div>

            {/* =================================================
                BUTTON
            ================================================= */}

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
