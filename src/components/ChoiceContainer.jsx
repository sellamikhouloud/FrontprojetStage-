import { useState } from "react";
import ArrowDown from "../assets/arrow-drop-down (1).png";
import Options from "./Options";

const SelectInput = ({
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
        py-2

        ${
          noPadding
            ? ""
            : "px-4 lg:pl-50 lg:pr-5"
        }
      `}
    >
      {/* Conteneur */}
      <div className="relative flex flex-col gap-2 w-full">

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
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="
            w-full
            h-[45px]

            rounded-[15px]

            border
            border-[#4E9F8A]

            bg-white

            px-3

            flex
            items-center
            justify-between

            text-[14px]
            sm:text-[15px]
            lg:text-[16px]

            text-left

            focus:outline-none
            focus:border-[#4E9F8A]
            focus:ring-0

            transition-all
            duration-200
          "
        >
          <span
            className={value ? "text-black" : "text-gray-400"}
          >
            {value || placeholder}
          </span>

          <img
            src={ArrowDown}
            alt="ouvrir"
            className={`
              w-5 h-5 shrink-0
              transition-transform duration-200
              ${isOpen ? "rotate-180" : ""}
            `}
          />
        </button>

        {/* Liste des options */}
        {isOpen && (
          <Options
            options={options}
            handleSelect={handleSelect}
            className="absolute top-full left-0 mt-2 w-full"
          />
        )}

      </div>
    </div>
  );
};

export default SelectInput;