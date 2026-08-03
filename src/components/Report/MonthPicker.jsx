import { useState } from "react";

const months = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const MonthPicker = ({ onChange }) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();

  const [selected, setSelected] = useState(currentDate.getMonth());

  const handleClick = (index) => {
    setSelected(index);

    const value = {
      month: index + 1,
      monthName: months[index],
      year,
    };

    onChange?.(value);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {months.map((month, index) => (
        <button
          key={month}
          type="button"
          onClick={() => handleClick(index)}
          className={`
            px-4
            py-2
            min-h-[40px]
            rounded-[14px]
            border
            whitespace-nowrap
            transition-all
            duration-300
            ${
              selected === index
                ? "bg-[#7BC8C4] border-[#7BC8C4] text-white"
                : "bg-white border-[#C8D2D2] text-[#202124]"
            }
          `}
        >
          {month} {year}
        </button>
      ))}
    </div>
  );
};

export default MonthPicker;
