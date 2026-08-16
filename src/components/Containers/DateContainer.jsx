import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import calendar from "../../assets/calender.svg";

// Convertit une chaîne "YYYY-MM-DD" (ou un Date déjà existant) en objet Date

const toDate = (val) => {
  if (!val) return null;
  if (val instanceof Date) return val;
  const parsed = new Date(val);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

// Convertit l'objet Date renvoyé par le picker en "YYYY-MM-DD" à partir des

const toDateOnlyString = (date) => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const DateContainer = ({
  label,
  value,
  onChange,
  noPadding = false,
  defaultToToday = true,
  hideLabelSpace = false, 
}) => {
  const displayValue = toDate(value) || (defaultToToday ? new Date() : null);

  const handleChange = (date) => {
    onChange(toDateOnlyString(date));
  };

  return (
    <div
      className={`
        flex items-center
        w-full
        ${noPadding ? "" : "py-2 px-4 lg:pl-50 lg:pr-5"}
      `}
    >
      <div className="flex flex-col gap-2 w-full">
        {(!hideLabelSpace || label) && (
          <label className="text-[14px] lg:text-[16px] font-semibold text-[#000000]">
            {label}
          </label>
        )}

        <div className="relative w-full">
          <DatePicker
            selected={displayValue}
            onChange={handleChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="Sélectionner une date"
            wrapperClassName="w-full"
            popperPlacement="bottom-start"
            calendarClassName="custom-calendar"
            renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
              <div className="flex items-center justify-between px-6 py-5">
                <button
                  type="button"
                  onClick={decreaseMonth}
                  className="text-[#4E9F8A] text-2xl font-semibold hover:opacity-70"
                >
                  &#8249;
                </button>
                <span className="text-[14px] font-medium font-jakarta text-[#374151] capitalize">
                  {date.toLocaleString("default", { month: "long", year: "numeric" })}
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
            className="
              w-full h-[45px] rounded-[15px] border border-[#4E9F8A]
              bg-white px-4 pr-12 text-[14px] text-[#374151]
              placeholder:text-[#9CA3AF]
              focus:outline-none focus:ring-0 focus:border-[#4E9F8A]
              transition-none
            "
          />

          <img
            src={calendar}
            alt="calendar"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
};

export default DateContainer;
