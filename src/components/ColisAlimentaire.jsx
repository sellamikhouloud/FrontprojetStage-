import ProductItem from "./ProductItem";
import Button from "./Button";

import Plus from "../assets/BlackPlus.svg";

const ColisAlimentaire = ({
  products = [],
  onAddProduct,
}) => {
  return (
    <div
      className="
        w-full
        flex
        flex-col
        gap-4
      "
    >
      {products.map((product) => (
        <ProductItem
          key={product.id}
          icon={product.icon}
          title={product.title}
          quantity={product.quantity}
          unit={product.unit}
        />
      ))}

      <Button
        icon={Plus}
        title="Ajouter un autre produit"
        variant="ajouter"
        noPadding
        onClick={onAddProduct}
      />
    </div>
  );
};

export default ColisAlimentaire;