import { useState, useEffect } from "react";

const START_YEAR = 2026;

const YearPicker = ({ onChange, value }) => {
  const currentYear = new Date().getFullYear();

  // Si le parent fournit `value`, on l'utilise comme source de vérité.
  // Sinon on garde un état interne (comportement autonome).
  const [internalYear, setInternalYear] = useState(value ?? currentYear);

  const selectedYear = value ?? internalYear;

  // Si le parent change `value` de l'extérieur, on suit.
  useEffect(() => {
    if (value !== undefined && value !== internalYear) {
      setInternalYear(value);
    }
  }, [value]);

  const years = Array.from(
    { length: currentYear - START_YEAR + 1 },
    (_, i) => START_YEAR + i
  );

  const handleClick = (year) => {
    setInternalYear(year);
    onChange?.({ year });
  };

  return (
    <div className="flex flex-wrap gap-3">
      {years.map((year) => {
        const isSelected = year === selectedYear;

        return (
          <button
            key={year}
            type="button"
            onClick={() => handleClick(year)}
            className={`
              min-w-[100px]
              px-4
              py-2
              rounded-[14px]
              border
              transition-all
              duration-300
              ${
                isSelected
                  ? "bg-[#7BC8C4] border-[#7BC8C4] text-white"
                  : "bg-white border-[#C8D2D2]"
              }
            `}
            style={{
              color: isSelected ? "#FFFFFF" : "#202124",
            }}
          >
            {year}
          </button>
        );
      })}
    </div>
  );
};

export default YearPicker;
