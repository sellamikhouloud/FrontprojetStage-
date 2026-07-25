import { useState, useEffect } from "react";
import PageHeader from "../Navigation,Pageheader/PageHeader";
import Button from "../Button/Button";
import Edit from "../../assets/Edit 2.svg";
import { Plus } from "lucide-react";
import EditStockPopup from "./EditStockPopup";

const StockPopup = ({
  onClose,
  initialProducts = [],
  onSaveProducts,
}) => {
  const [showEditPopup, setShowEditPopup] = useState(false);

  const [products, setProducts] = useState([]);

  // Initialize from DistributionPage
  useEffect(() => {
    const formattedProducts = initialProducts.map((product) => ({
      title: product.title || product.nom,
      quantity: product.quantity,
      unit: product.unit || product.unite,
    }));

    setProducts(formattedProducts);
  }, [initialProducts]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#9A9A9A80] p-4">
      <div
        className="
          w-full
          max-w-[550px]
          rounded-[20px]
          bg-white
          shadow-[0_10px_30px_rgba(0,0,0,0.08)]
          px-5
          py-4
        "
      >
        <PageHeader
          leftTitle="Fermer"
          showRight={false}
          onBack={onClose}
        />

        <h2 className="text-center text-[20px] font-semibold mt-0 mb-4 text-[#202124]">
          Stock de produits
        </h2>

        <div className="space-y-1.5">
          {products.map((product) => (
            <div
              key={product.title}
              className="
                h-[40px]
                border
                border-[#84D6D0]
                rounded-[12px]
                px-3
                flex
                items-center
                justify-between
              "
            >
              <span className="text-[15px] font-medium text-[#202124]">
                {product.title}
              </span>

              <div className="flex items-center gap-2">
                <div className="flex items-end gap-1">
                  <span className="text-[#4E9F8A] text-[15px] font-bold leading-none">
                    {product.quantity}
                  </span>

                  <span className="text-[14px] text-[#202124] leading-none">
                    {product.unit}
                  </span>
                </div>

                <button
                  className="
                    w-6
                    h-6
                    rounded-[8px]
                    bg-[#8CCDC0]
                    hover:bg-[#74C3B2]
                    transition
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >
                  <Plus
                    size={14}
                    strokeWidth={3}
                    color="white"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <Button
            title="Modifier les seuils d'alertes nutritionnelles"
            variant="modifier"
            icon={Edit}
            noWrapperPadding={true}
            onClick={() => setShowEditPopup(true)}
          />
        </div>
      </div>

{showEditPopup && (
  <EditStockPopup
    products={products}
    onClose={() => setShowEditPopup(false)}
    onSave={(updatedProducts) => {
      // Update StockPopup
      setProducts(updatedProducts);

      // Update DistributionPage
      onSaveProducts?.(
        updatedProducts.map((product) => ({
          nom: product.title,
          quantity: product.quantity,
          unite: product.unit,
        }))
      );

      // Close popup
      setShowEditPopup(false);
    }}
  />
)}
    </div>
  );
};

export default StockPopup;