const DistributionItem = ({ product, quantity, unit }) => {
  return (
    <div
      className="
        w-full
        rounded-[10px]
        border
        border-[#4E9F8A]
        bg-[#F8FBFC]
        px-4
        py-[7px]
        flex
        items-center
        justify-between
      "
    >
      {/* Produit */}
      <p
        className="
          text-[14px]
          sm:text-[15px]
          font-medium
          text-[#202124]
          truncate
        "
      >
        {product}
      </p>

      {/* Quantité */}
      <div className="flex items-end gap-1 shrink-0">
        <span
          className="
            text-[20px]
            sm:text-[22px]
            font-bold
            leading-none
            text-[#4E9F8A]
          "
        >
          {quantity}
        </span>

        <span
          className="
            text-[12px]
            text-[#4A4A4A]
            leading-none
            mb-[2px]
          "
        >
          {unit}
        </span>
      </div>
    </div>
  );
};

export default DistributionItem;