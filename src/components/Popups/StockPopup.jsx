import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageHeader from "../Navigation,Pageheader/PageHeader";
import Button from "../Button/Button";
import Edit from "../../assets/Edit 2.svg";
import { Plus, Check, X } from "lucide-react";
import EditStockPopup from "./EditStockPopup";

const StockPopup = ({
  onClose,
  initialProducts = [],
  onSaveProducts,
}) => {
  const [showEditPopup, setShowEditPopup] = useState(false);

  const [products, setProducts] = useState([]);

  const [pendingIndex, setPendingIndex] = useState(null);
  const [backupProducts, setBackupProducts] = useState([]);

  const timerRef = useRef(null);

  const [showAddProduct, setShowAddProduct] =
    useState(false);

  const [newProduct, setNewProduct] = useState({
    title: "",
    quantity: 0,
    unit: "Kg",
  });

  useEffect(() => {
const formattedProducts = initialProducts.map(
  (product) => ({
    title: product.title || product.nom,
    quantity: product.quantity,
    unit: product.unit || product.unite,
    threshold: product.threshold,
  })
);

    setProducts(formattedProducts);
  }, [initialProducts]);

  useEffect(() => {
    return () => {
      if (timerRef.current)
        clearTimeout(timerRef.current);
    };
  }, []);

  const saveToDistributionPage = (updatedProducts) => {
    onSaveProducts?.(
      updatedProducts.map((product) => ({
  nom: product.title,
  quantity: product.quantity,
  unite: product.unit,
  threshold: product.threshold,
}))
    );
  };

  const handleIncrement = (index) => {
    if (timerRef.current)
      clearTimeout(timerRef.current);

    setBackupProducts(products);

    const updated = products.map((product, i) =>
      i === index
        ? {
            ...product,
            quantity:
              Number(product.quantity) + 1,
          }
        : product
    );

    setProducts(updated);
    setPendingIndex(index);

    timerRef.current = setTimeout(() => {
      saveToDistributionPage(updated);
      setPendingIndex(null);
    }, 60000);
  };

  const handleConfirm = () => {
    if (timerRef.current)
      clearTimeout(timerRef.current);

    saveToDistributionPage(products);
    setPendingIndex(null);
  };

  const handleCancel = () => {
    if (timerRef.current)
      clearTimeout(timerRef.current);

    setProducts(backupProducts);
    setPendingIndex(null);
  };

  const handleAddProduct = () => {
    if (!newProduct.title.trim()) return;

    const updated = [
      ...products,
{
  title: newProduct.title,
  quantity: Number(newProduct.quantity),
  unit: newProduct.unit,
  threshold: 1,
},
    ];

    setProducts(updated);

    saveToDistributionPage(updated);

    setNewProduct({
      title: "",
      quantity: 0,
      unit: "Kg",
    });

    setShowAddProduct(false);
  };

  return (
    <AnimatePresence>
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
            sm:max-w-[550px]
            sm:h-[90vh]

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

          <div className="px-5 pt-5 pb-5">

            <PageHeader
              leftTitle="Fermer"
              showRight={false}
              onBack={onClose}
            />

            <h2 className="mt-3 text-center text-[22px] sm:text-[20px] font-semibold text-[#202124]">
              Stock de produits
            </h2>

          </div>

          {/* Products */}

          <div
            className="
              flex-1
              overflow-y-auto
              px-5
              pb-4
              space-y-2
            "
          >
            {products.map((product, index) => (
              <div
                key={index}
                className="
                  min-h-[44px]
                  border
                  border-[#84D6D0]
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

                <div className="flex items-center gap-2">

                  <div className="flex items-end gap-1">

                    <span className="text-[#4E9F8A] font-bold text-[18px]">
                      {product.quantity}
                    </span>

                    <span>{product.unit}</span>

                  </div>

                  <button
                    onClick={() =>
                      handleIncrement(index)
                    }
                    className="
                      w-7
                      h-7
                      rounded-[8px]
                      bg-[#8CCDC0]
                      hover:bg-[#74C3B2]
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Plus
                      size={15}
                      color="white"
                    />
                  </button>

                  {pendingIndex === index && (
                    <>
                      <button
                        onClick={handleConfirm}
                        className="
                          w-7
                          h-7
                          rounded-[8px]
                          bg-[#4E9F8A]
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <Check
                          size={15}
                          color="white"
                        />
                      </button>

                      <button
                        onClick={handleCancel}
                        className="
                          h-7
                          px-2
                          rounded-[8px]
                          bg-[#EF4444]
                          text-white
                          text-[11px]
                          flex
                          items-center
                          gap-1
                        "
                      >
                        <X size={12} />
                        Annuler
                      </button>
                    </>
                  )}

                </div>

              </div>
            ))}
          </div>

          {/* Bottom section */}
                    <div className="bg-white px-5 py-4 shrink-0">

            {!showAddProduct ? (
              <Button
                title="Ajouter un produit"
                variant="gris"
                noWrapperPadding
                onClick={() => setShowAddProduct(true)}
              />
            ) : (
              <div className="space-y-3">

                <div
                  className="
                    flex
                    items-center
                    bg-[#F2FAFA]
                    border
                    border-[#91A09F]
                    rounded-[10px]
                    h-[48px]
                    overflow-hidden
                  "
                >
                  {/* Product name */}

                  <input
                    type="text"
                    placeholder="Tapez le nom"
                    value={newProduct.title}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        title: e.target.value,
                      })
                    }
                    className="
                      flex-1
                      h-full
                      px-4
                      outline-none
                      bg-transparent
                      text-[15px]
                    "
                  />

                  {/* Quantity */}

                  <input
                    type="text"
                    inputMode="numeric"
                    value={newProduct.quantity}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        quantity: e.target.value.replace(
                          /\D/g,
                          ""
                        ),
                      })
                    }
                    className="
                      w-[30px]
                      text-center
                      outline-none
                      bg-transparent
                      text-[#4E9F8A]
                      font-bold
                      text-[22px]
                    "
                  />

                  {/* Unit */}

                  <select
                    value={newProduct.unit}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        unit: e.target.value,
                      })
                    }
                    className="
                      h-full
                      bg-transparent
                      outline-none
                      cursor-pointer
                      text-[15px]
                      pr-3
                    "
                  >
                    <option>Kg</option>
                    <option>Litres</option>
                    <option>boîtes</option>
                    <option>Sacs</option>
                    <option>Pièces</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">

                  <div className="flex-1">
                    <Button
                      title="Sauvegarder"
                      variant="gris"
                      noWrapperPadding
                      onClick={handleAddProduct}
                    />
                  </div>

                  <div className="flex-1">
                    <Button
                      title="Annuler"
                      variant="outline"
                      noWrapperPadding
                      onClick={() => {
                        setShowAddProduct(false);

                        setNewProduct({
                          title: "",
                          quantity: 0,
                          unit: "Kg",
                        });
                      }}
                    />
                  </div>

                </div>
              </div>
            )}

            <div className="mt-4">
              <Button
                title="Modifier les seuils d'alertes nutritionnelles"
                variant="modifier"
                icon={Edit}
                noWrapperPadding
                onClick={() => setShowEditPopup(true)}
              />
            </div>

          </div>

        </motion.div>
      </div>

      {showEditPopup && (
<EditStockPopup
  products={products}
  onClose={() => setShowEditPopup(false)}
  onSave={(updatedThresholds) => {
    setProducts((prev) =>
      prev.map((product, index) => ({
        ...product,
        threshold: updatedThresholds[index].threshold,
      }))
    );

    setShowEditPopup(false);
  }}
/>
      )}

    </AnimatePresence>
  );
};

export default StockPopup;