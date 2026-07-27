import { Plus } from "lucide-react";

const StockRow = ({
  title,
  quantity,
  unit,
  mode = "view", // "view" | "edit"
  onAdd,
  onChange,
}) => {
  return (
    <div
      className={`
        w-full
        h-[53px]
        rounded-[14px]
        border
        flex
        items-center
        justify-between
        px-3
        transition-all
        ${
          mode === "view"
            ? "border-[#4E9F8A]"
            : "border-[#FF6B6B]"
        }
      `}
    >
      {/* Product name */}
      <span className="text-[16px] font-medium leading-[16px]">
        {title}
      </span>

      {/* Right side */}
      {mode === "view" ? (
        <div className="flex items-center gap-3">
          <div className="flex items-end gap-1">
            <span className="text-[24px] font-bold text-[#4E9F8A]">
              {quantity}
            </span>

            <span className="text-[14px]">
              {unit}
            </span>
          </div>

          <button
            onClick={onAdd}
            className="
              w-8
              h-8
              rounded-[10px]
              bg-[#8CCDC0]
              hover:bg-[#89BFB1]
              transition
              flex
              items-center
              justify-center
            "
          >
            <Plus
              size={18}
              strokeWidth={2.5}
              color="white"
            />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={quantity}
            onChange={(e) => onChange(Number(e.target.value))}
            className="
              w-[42px]
              h-[28px]
              rounded-[8px]
              bg-[#EF4444]
              text-center
              text-[#FF4D4F]
              font-bold
              text-[16px]
              outline-none
              border-none
              appearance-none
            "
          />

          <span className="text-[15px] text-[#202124]">
            {unit}
          </span>
        </div>
      )}
    </div>
  );
};

export default StockRow;