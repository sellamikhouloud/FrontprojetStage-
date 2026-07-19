import { useState } from "react";
import ArrowDown from "../../assets/arrow-drop-down (1).png";
import Options from "./Options";

const ChoiceContainerModifier = ({
  label,
  placeholder,
  options = [],
  value,
  onChange,
  noPadding = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selected) => {
    onChange(selected);
    setIsOpen(false);
  };

  return (
    <div
      className={`
        flex items-center gap-[10px]
        w-full
        ${noPadding ? "" : "px-4 lg:pl-50 lg:pr-5"}
      `}
    >
      <div className="flex flex-col gap-2 w-full">

        {/* Label */}
        <label
          className="
            text-[14px]
            sm:text-[15px]
            lg:text-[16px]
            font-semibold
            text-black
          "
        >
          {label}
        </label>

        {/* Select */}
        <div
  className="
    w-full
    bg-white
    border-[1.5px]
    border-dashed
    border-[#4E9F8A]
    rounded-[15px]
    overflow-hidden
  "
>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="
              w-full
              h-[45px]
              px-3

              flex
              items-center
              justify-between

              bg-white

              text-[14px]
              sm:text-[15px]
              lg:text-[16px]

              text-left
              focus:outline-none
            "
          >
            <span className={value ? "text-black" : "text-gray-400"}>
              {value || placeholder}
            </span>

            <img
              src={ArrowDown}
              alt=""
              className={`
                w-5
                h-5
                transition-transform
                duration-200
                ${isOpen ? "rotate-180" : ""}
              `}
            />
          </button>

          {isOpen && (
            <Options
              options={options}
              handleSelect={handleSelect}
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default ChoiceContainerModifier;