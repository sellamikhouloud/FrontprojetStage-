import DistributionItem from "../Distribution/DistributionItem";

const DistributionCard = ({
  title,
  products = [],
  viewAllText = "Voir tous",
  dividerColor = "#4E9F8A",
  onClick,
  onViewAllClick,
}) => {
  // Only display the first 5 distributions
  const displayedProducts = products.slice(0, 3);

  return (
    <>
      {/* =====================================================
          DESKTOP / TABLET
      ====================================================== */}
      <div
        onClick={onClick}
        className="
          hidden md:block
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
              flex
              items-center
              gap-[10px]
              text-[#5E6064]
              text-[18px]
              font-medium
              hover:text-[#69B89C]
              transition-colors
              cursor-pointer
              max-md:text-[13px]
              max-md:gap-[5px]
            "
          >
            {viewAllText}
          </button>
        </div>

        {/* Products / Empty state */}
        {displayedProducts.length === 0 ? (
          <div className="text-center">
            Aucune distribution ce mois-ci
          </div>
        ) : (
          <div className="flex items-center">
            {displayedProducts.map((product, index) => (
              <DistributionItem
                key={product.id}
                name={product.name}
                quantity={product.quantity}
                unit={product.unit}
                dividerColor={dividerColor}
                showDivider={index !== displayedProducts.length - 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* =====================================================
          MOBILE
      ====================================================== */}
      <div className="md:hidden w-full">
        {/* Mobile Header - OUTSIDE the card */}
        <div className="flex items-center justify-between mb-[5px]">
          <h2
            className="
              text-[16px]
              font-semibold
              leading-[18px]
              text-[#111111]
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
              text-[#5E6064]
              text-[13px]
              font-medium
              hover:text-[#69B89C]
              transition-colors
              cursor-pointer"
          >
            {viewAllText}
          </button>
        </div>

        {/* Mobile Products Card */}
        <div
          onClick={onClick}
          className="
            w-full
            h-[62px]
            bg-white
            rounded-[15px]
            border
            border-[#4E9F8A]
            cursor-pointer
            px-[10px]
          "
        >
          {displayedProducts.length === 0 ? (
            <div className="flex items-center justify-center h-full text-[12px] text-[#535353]">
              Aucune distribution ce mois-ci
            </div>
          ) : (
            <div className="flex items-stretch h-full">
              {displayedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="
                    flex-1
                    flex
                    flex-col
                    gap-[10px]
                    items-center
                    justify-center
                    min-w-0
                    relative
                  "
                >
                  {/* Separator */}
                  {index !== 0 && (
                    <span
                      className="
                        absolute
                        left-0
                        top-1/2
                        -translate-y-1/2
                        w-[2px]
                        h-[42px]
                        rounded-[15px]
                        bg-[#4E9F8A]
                      "
                    />
                  )}

                  {/* Product name */}
                  <span
                    className="
                      text-[14px]
                      leading-[12px]
                      font-medium
                      whitespace-nowrap
                    "
                  >
                    {product.name}
                  </span>

                  {/* Quantity + unit */}
                  <div
                    className="
                      flex
                      items-baseline
                      justify-center
                      gap-[2px]
                      mt-[1px]
                    "
                  >
                    <span
                      className="
                        text-[20px]
                        leading-[18px]
                        font-bold
                        text-[#4E9F8A]
                      "
                    >
                      {product.quantity}
                    </span>

                    <span
                      className="
                        text-[12px]
                        leading-[10px]
                        whitespace-nowrap
                      "
                    >
                      {product.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DistributionCard;
