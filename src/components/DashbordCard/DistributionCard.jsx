import DistributionItem from "../Distribution/DistributionItem";

const DistributionCard = ({
  title,
  products = [],
  viewAllText = "Voir tous",
  dividerColor = "#4E9F8A",
  onClick,        // card click -> navigate
  onViewAllClick, // button click -> open popup
}) => {
  return (
    <div
      onClick={onClick}
      className="
        w-full
        bg-[#F8FBFC]
        rounded-[20px]
        px-6
        py-6
        shadow-sm
        border
        border-[#BCCAC14D]
        cursor-pointer
      "
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2
          className="
            text-[24px]
            font-semibold
            leading-[20px]
          "
        >
          {title}
        </h2>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewAllClick?.();
          }}
          className="
            text-[18px]
            font-medium
            text-[#535353]
            hover:text-[#69B89C]
            transition-colors
          "
        >
          {viewAllText}
        </button>
      </div>

      {/* Products */}
      <div className="flex items-center">
        {products.map((product, index) => (
          <DistributionItem
            key={product.id}
            name={product.name}
            quantity={product.quantity}
            unit={product.unit}
            dividerColor={dividerColor}
            showDivider={index !== products.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default DistributionCard;