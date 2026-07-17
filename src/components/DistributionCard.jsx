import DistributionItem from "./DistributionItem";

const DistributionCard = ({
  title,
  products = [],
  viewAllText = "Voir tous",
  dividerColor = "#73C8C5",
  onClick,
}) => {
  return (
    <div
      className="
        w-full
        bg-[#F8FBFC]
        rounded-[20px]
        px-6
        py-6
        shadow-sm
        border
        border-[#BCCAC14D]
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
          onClick={onClick}
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