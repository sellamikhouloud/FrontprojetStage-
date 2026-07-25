import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ArrowDown from "../../assets/arrow-drop-down (1).png";

const DateSelect = ({
  placeholder = "Tapez pour choisir la date debut",
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  const handleDate = (date) => {
    onChange(date);
    setOpen(false);
  };

  return (
    <div className="w-full">
      {/* Container */}
      <div
        onClick={() => setOpen(!open)}
        className="h-[45px] rounded-[15px] border border-[#4E9F8A] bg-white px-4 flex items-center justify-between cursor-pointer"
      >
        <span
          className={`text-[14px] ${
            value ? "text-[#374151]" : "text-[#9CA3AF]"
          }`}
        >
          {value
            ? value.toLocaleDateString("fr-FR")
            : placeholder}
        </span>

        <img
          src={ArrowDown}
          alt=""
          className={`w-5 h-5 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Calendrier */}
  <div
  className={`
    overflow-hidden
    transition-all
    duration-300
    ease-in-out
    ${open ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"}
  `}
>
 <div
  className={`
    flex justify-center
    bg-white
    rounded-[24px]
    overflow-hidden
    transition-all
    duration-300
    ${
      open
        ? "translate-y-0 scale-100"
        : "-translate-y-3 scale-95"
    }
  `}
>
 <DatePicker
  inline
  selected={value}
  onChange={handleDate}
  calendarClassName="custom-calendar"
  dayClassName={(date) => {
    const isSelected =
      value &&
      date.toDateString() === value.toDateString();

    return isSelected
      ? "bg-[#4E9F8A] text-white rounded-full"
      : "hover:bg-[#D9F0EA] hover:text-[#4E9F8A] rounded-full transition-colors duration-200";
  }}
  renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
    <div className="flex items-center justify-between px-6 py-5">
      <button
        type="button"
        onClick={decreaseMonth}
        className="text-[#4E9F8A] text-2xl font-semibold hover:opacity-70"
      >
        &#8249;
      </button>

      <span className="text-[14px] font-medium text-[#374151] capitalize">
        {date.toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </span>

      <button
        type="button"
        onClick={increaseMonth}
        className="text-[#4E9F8A] text-2xl font-semibold hover:opacity-70"
      >
        &#8250;
      </button>
    </div>
  )}
/>
  </div>
</div>
    </div>
  );
};

export default DateSelect;