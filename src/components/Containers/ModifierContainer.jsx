import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Options from "./Options";

const EditableInfoCard = ({
  title,
  data = [],
  editable = true,
  onChange,
}) => {
  const [openedIndex, setOpenedIndex] = useState(null);

  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpenedIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div className="w-full" ref={containerRef}>
      {/* Titre */}
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-[18px] font-semibold">
          {title}
        </h2>
      </div>

      {/* Conteneur */}
      <div className="border-2 border-dashed border-[#84D6D0] rounded-[15px] px-4 py-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="relative flex justify-between items-center py-1 gap-4"
          >
            {/* Label */}
            <span className="text-[#4E9F8A] font-medium">
              {item.label}
            </span>

            {/* ================= DATE ================= */}
            {item.type === "date" ? (
              <div className="relative w-[220px]">
                <div
                  onClick={() =>
                    editable &&
                    setOpenedIndex(
                      openedIndex === index ? null : index
                    )
                  }
                  className="text-right cursor-pointer text-[#202124]"
                >
                  {item.value
                    ? item.value.toLocaleDateString("fr-FR")
                    : "Choisir une date"}
                </div>

                {openedIndex === index && (
                  <div
                    className="absolute right-0 mt-3 z-50 bg-white rounded-[20px] shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DatePicker
                      inline
                      selected={item.value}
                      onChange={(date) => {
                        onChange(index, date);
                        setOpenedIndex(null);
                      }}
                      calendarClassName="custom-calendar"
                      dayClassName={(date) => {
                        const isSelected =
                          item.value &&
                          date.toDateString() ===
                            item.value.toDateString();

                        return isSelected
                          ? "bg-[#4E9F8A] text-white rounded-full"
                          : "hover:bg-[#D9F0EA] hover:text-[#4E9F8A] rounded-full transition-colors duration-200";
                      }}
                      renderCustomHeader={({
                        date,
                        decreaseMonth,
                        increaseMonth,
                      }) => (
                        <div className="flex items-center justify-between px-6 py-5">
                          <button
                            type="button"
                            onClick={decreaseMonth}
                            className="text-[#4E9F8A] text-2xl font-semibold hover:opacity-70"
                          >
                            &#8249;
                          </button>

                          <span className="text-[14px] font-medium text-[#374151] capitalize">
                            {date.toLocaleString("fr-FR", {
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
                )}
              </div>
            ) : item.options ? (
              /* ================= OPTIONS ================= */
              <div className="relative w-[220px]">
                <div
                  onClick={() =>
                    editable &&
                    setOpenedIndex(
                      openedIndex === index ? null : index
                    )
                  }
                  className="text-right cursor-pointer text-[#202124]"
                >
                  {item.value}
                </div>

                {openedIndex === index && (
                  <div
                    className="absolute right-0 mt-2 w-full bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Options
                      options={item.options}
                      handleSelect={(value) => {
                        onChange(index, value);
                        setOpenedIndex(null);
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              /* ================= INPUT ================= */
              <div className="flex items-center justify-end gap-2 w-[220px]">
  <input
    type="text"
    value={item.value}
    onChange={(e) => onChange(index, e.target.value)}
    disabled={!editable}
    className="
      flex-1
      text-right
      bg-transparent
      border-none
      outline-none
      text-[#202124]
      disabled:cursor-default
    "
  />

  {item.unit && (
    <span className="text-[#6B7280] whitespace-nowrap">
      {item.unit}
    </span>
  )}
</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditableInfoCard;
