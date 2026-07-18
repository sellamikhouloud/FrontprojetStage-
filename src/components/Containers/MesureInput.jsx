const MesureInput = ({
  label,
  unit,
  value,
  onChange,
  placeholder = "----",
  type = "text",
}) => {
  return (
    <div className="flex flex-col w-full max-w-[220px]">
      {/* Titre */}
      <label
        className="
          mb-2
          text-center
          text-[14px]
          sm:text-[15px]
          lg:text-[16px]
          font-semibold
          text-[#495556]
        "
      >
        {label}
      </label>

      {/* Champ */}
      <div
        className="
          flex
          items-center
          justify-between

          w-full
          h-[46px]

          px-3

          rounded-[15px]
          border
          border-[#346A5C]

          bg-white
        "
      >
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="
            flex-1
            min-w-0

            bg-transparent

            text-[18px]
            text-[#6B7280]

            placeholder:text-[#9CA3AF]

            outline-none
          "
        />

        <span
          className="
            ml-2
            shrink-0

            text-[16px]
            text-[#707070]
          "
        >
          {unit}
        </span>
      </div>
    </div>
  );
};

export default MesureInput;
