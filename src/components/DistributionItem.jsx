const DistributionItem = ({
  name,
  quantity,
  unit,
  showDivider = true,
  dividerColor = "#7BC8C4",
}) => {
  return (
    <div className="flex flex-1 items-center">
      <div className="flex-1 flex flex-col items-center gap-[10px] px-[10px] pt-[5px]">
        {/* Product Name */}
        <h3
          className="
            text-[18px]
            font-medium
            text-center
            leading-[16px]
          "
        >
          {name}
        </h3>

        {/* Quantity */}
        <div className="flex items-end gap-[2px]">
          <span
            className="text-[24px] font-bold leading-[28px]"
            style={{ color: dividerColor }}
          >
            {quantity}
          </span>

          <span
            className="
              text-[14px]
              font-medium
            "
          >
            {unit}
          </span>
        </div>
      </div>

      {showDivider && (
        <div
          className="w-[4px] h-[84px] rounded-[15px]"
          style={{ backgroundColor: dividerColor }}
        />
      )}
    </div>
  );
};

export default DistributionItem;