import React from "react";

const STATUS_OPTIONS = [
  {
    value: "active",
    label: "Actives",
    selected: "bg-[#22C55E] text-white border-[#22C55E]",
    unselected: "bg-white text-[#22C55E] border-[#22C55E]",
  },
  {
    value: "annulee",
    label: "Annulées",
    selected: "bg-[#EF4444] text-white border-[#EF4444]",
    unselected: "bg-white text-[#EF4444] border-[#EF4444]",
  },
];

const VDZStatusFilter = ({ value = "active", onChange }) => {
  return (
    <div className="w-full grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-[8px]">
      {STATUS_OPTIONS.map((option) => {
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              w-full
              sm:w-[149px]

              h-10
              sm:h-[45px]

              rounded-[12px]
              sm:rounded-[15px]
              border

              text-sm
              sm:text-[16px]
              font-semibold

              px-2
              truncate

              transition-all
              duration-200

              ${isSelected ? option.selected : option.unselected}

              hover:opacity-90
              active:scale-[0.98]
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default VDZStatusFilter;