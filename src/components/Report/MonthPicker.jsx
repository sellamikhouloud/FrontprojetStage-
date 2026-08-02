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
  const year = new Date().getFullYear();

  const [selected, setSelected] = useState(
    new Date().getMonth()
  );

  const handleClick = (index) => {
    setSelected(index);

    onChange?.({
      month: index + 1,
      monthName: months[index],
      year,
    });
  };

  return (
    <div className="flex flex-wrap gap-3">
      {months.map((month, index) => (
        <button
          key={month}
          onClick={() => handleClick(index)}
          className={`
            px-4
            py-2

            min-h-[40px]

            rounded-[14px]
            border
            border-[#C8D2D2]

            text-[13px]
            md:text-[15px]

            whitespace-nowrap

            transition-all
            duration-300

            ${
              selected === index
                ? "bg-[#7BC8C4] border-[#7BC8C4] text-white"
                : "bg-white text-[#202124]"
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