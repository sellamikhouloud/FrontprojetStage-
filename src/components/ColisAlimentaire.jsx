import ProductItem from "./ProductItem";
import Button from "./Button/Button";

import Plus from "../assets/BlackPlus.svg";
import { useState } from "react";
import NewProductCard from "./NewProductCard";

const ColisAlimentaire = ({
  title = "Colis Alimentaire",
  products = [],
  onAddProduct,
}) => {

const [newProducts, setNewProducts] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    unit: "",
    quantity: "",
  });

  return (
    <div
      className="
        w-full
        rounded-[20px]
        border
        border-[#E5E7EB]
        bg-[#F9FAFB]
        p-5
      "
    >
      {/* Title */}
      <h2 className="text-[20px] font-bold text-[#202124] mb-5">
        {title}
      </h2>

      {/* Products */}
      <div className="flex flex-col gap-3">
        {products.map((product) => (
          <ProductItem
            key={product.id}
            icon={product.icon}
            title={product.title}
            quantity={product.quantity}
            unit={product.unit}
          />
        ))}
      </div>

      {/* Button */}
      
      <div className="mt-5">
  <Button
  icon={Plus}
  title="Ajouter un autre produit"
  variant="ajouter"
  noPadding
  onClick={() =>
    setNewProducts([
      ...newProducts,
      {
        id: Date.now(),
        name: "",
        unit: "",
        quantity: "",
      },
    ])
  }
  className="
    w-full
    h-[56px]
    rounded-[20px]
  "
/>
</div>

     {newProducts.map((product) => (
  <NewProductCard
    key={product.id}
    product={product}
    setProduct={(updatedProduct) =>
      setNewProducts(
        newProducts.map((p) =>
          p.id === product.id ? updatedProduct : p
        )
      )
    }
    onClose={() =>
      setNewProducts(
        newProducts.filter((p) => p.id !== product.id)
      )
    }
  />
))}

      </div>

    
  );
};

export default ColisAlimentaire;
