import React from "react";

const STATUS_OPTIONS = [
  {
    value: "all",
    label: "Toutes",
    selected: "bg-[#55A694] text-white border-[#55A694]",
    unselected: "bg-white text-[#55A694] border-[#55A694]",
  },
  {
    value: "active",
    label: "Actif",
    selected: "bg-[#22C55E] text-white border-[#22C55E]",
    unselected: "bg-white text-[#22C55E] border-[#22C55E]",
  },
  {
    value: "inactive",
    label: "Inactif",
    selected: "bg-[#EF4444] text-white border-[#EF4444]",
    unselected: "bg-white text-[#EF4444] border-[#EF4444]",
  },
];

const StatusFilter = ({ value = "all", onChange }) => {
  return (
    // Mobile : grille 3 colonnes égales qui prend toute la largeur.
    // À partir de sm: on repasse en boutons de taille fixe alignés à gauche,
    // comme sur desktop.
    <div className="w-full grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-[8px]">
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

export default StatusFilter;
