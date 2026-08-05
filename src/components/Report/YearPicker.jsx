import { useState } from "react";

const YearPicker = ({ onChange }) => {
  const currentYear = new Date().getFullYear();

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const years = Array.from(
    { length: selectedYear - currentYear + 4 },
    (_, i) => currentYear + i
  );

  const handleClick = (year) => {
    setSelectedYear(year);

    onChange?.({
      year,
    });
  };

  return (
    <div className="flex flex-wrap gap-3">
      {years.map((year) => {
        const isSelected = year === selectedYear;
        const isFuture = year > currentYear;

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
              color: isSelected
                ? "#FFFFFF"
                : isFuture
                ? "#C9C9C9"
                : "#202124",
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