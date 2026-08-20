import { useState } from "react";
import Options2 from "./Options2";

const TextareaModifier = ({
  label,
  placeholder = "",
  value,
  onChange,
  width = "w-full",
  height = "h-[80px]",
  options = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selected) => {
 
    const selectedValue = selected?.value ?? "";

    
    onChange?.({
      target: {
        value: selectedValue,
      },
    });

    setIsOpen(false);
  };

  return (
    <div className={`${width} flex flex-col`}>
      {label && (
        <label className="mb-2 text-[18px] font-semibold text-black">
          {label}
        </label>
      )}

      {/* Container cliquable */}
      <div
        className={`
          relative
          w-full
          border
          border-dashed
          border-[#84D6D0]
          rounded-[15px]
          overflow-hidden
          bg-white
          ${isOpen ? "rounded-b-none" : ""}
        `}
      >
        {/* Zone textarea */}
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onClick={() => {
            if (options.length > 0) {
              setIsOpen((prev) => !prev);
            }
          }}
          readOnly={options.length > 0}
          className={`
            ${height}
            w-full
            border-0
            rounded-[15px]
            p-3
            resize-none
            outline-none
            text-[14px]
            sm:text-[15px]
            lg:text-[16px]
            placeholder:text-gray-400
            focus:outline-none
            focus:ring-0
            focus:border-0
            cursor-pointer
          `}
        />

        {/* Liste des options */}
        {isOpen && options.length > 0 && (
          <Options2
            options={options}
            handleSelect={handleSelect}
          />
        )}
      </div>
    </div>
  );
};

export default TextareaModifier;
