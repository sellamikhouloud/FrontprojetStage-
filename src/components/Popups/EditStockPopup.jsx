import { useState } from "react";
import PageHeader from "../Navigation,Pageheader/PageHeader";
import Button from "../Button/Button";
import Modify from "../../assets/Modify.svg";

const initialProducts = [
  { title: "Lait", quantity: 1, unit: "boîtes" },
  { title: "Céréales", quantity: 1, unit: "Kg" },
  { title: "Huile", quantity: 1, unit: "Litres" },
  { title: "Sucre", quantity: 1, unit: "Kg" },
  { title: "Sel iodé", quantity: 1, unit: "Kg" },
  { title: "Légumineuses", quantity: 1, unit: "Kg" },
  { title: "Farine de blé", quantity: 1, unit: "Kg" },
  { title: "Pâtes alimentaires", quantity: 1, unit: "Kg" },
];

const EditStockPopup = ({ onClose, onSave }) => {
  const [products, setProducts] = useState(initialProducts);

  const handleChange = (index, value) => {
    const updated = [...products];

    updated[index].quantity =
      value === "" ? "" : Math.max(0, Number(value));

    setProducts(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#9A9A9A80] p-4">
      <div
        className="
          w-full
          max-w-[550px]
          bg-white
          rounded-[20px]
          px-5
          py-4
          shadow-xl
        "
      >
        <PageHeader
          leftTitle="Annuler"
          showRight={false}
          onBack={onClose}
        />

        <h2 className="text-center text-[17px] font-bold mt-1 mb-5">
          Stock de produits
        </h2>

        <div className="space-y-2">
          {products.map((product, index) => (
            <div
              key={product.title}
              className="
                h-[40px]
                border
                border-[#FF6B6B]
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

              <div className="
                    flex
                    items-center
                    justify-center
                    gap-[6px]
                    px-[14px]
                    h-[30px]
                    rounded-[10px]
                    bg-[#FFE6EC]
                "
                >
                <input
                    type="text"
                    inputMode="numeric"
                    maxLength={3}
                    value={product.quantity}
                    onChange={(e) => handleChange(index, e.target.value)}
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

        <div className="mt-5">
          <Button
            title="Sauvegarder"
            variant="modifier"
            icon={Modify}
            noWrapperPadding
            onClick={() => onSave?.(products)}
          />
        </div>
      </div>
    </div>
  );
};

export default EditStockPopup;