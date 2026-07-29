import ProductItem from "./ProductItem";
import Button from "../Button/Button";
import Plus from "../../assets/BlackPlus.svg";

const ColisAlimentaire = ({
  title = "Colis Alimentaire",
  products = [],
  onAddProduct,
  onUpdateQuantity,
  onRemoveProduct,
}) => {
  return (
    <div className="w-full rounded-[20px] border border-[#E5E7EB] bg-[#F9FAFB] p-5">
      <h2 className="text-[20px] font-bold text-[#202124] mb-5">
        {title}
      </h2>

      <div
        className="
           flex flex-col gap-3
           lg:max-h-[328px]
           lg:overflow-y-auto
           pr-1
        "
      >
        {products.map((product) => (
          <ProductItem
            key={product.id}
            icon={product.icon}
            title={product.title}
            quantity={product.quantity}
            unit={product.unit}
            onQuantityChange={(newQuantity) =>
              onUpdateQuantity(product.id, newQuantity)
            }
            onRemove={() => onRemoveProduct(product.id)}
          />
        ))}
      </div>

      <div className="mt-5">
        <Button
          icon={Plus}
          title={
            products.length === 0
              ? "Ajouter les produits à distribuer"
              : "Ajouter un autre produit"
          }
          variant="ajouter"
          noPadding
          onClick={onAddProduct}
          className="w-full h-[56px] rounded-[20px]"
        />
      </div>
    </div>
  );
};

export default ColisAlimentaire;