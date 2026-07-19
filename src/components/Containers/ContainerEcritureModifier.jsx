const ContainerEcritureModifier = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  noPadding = false,
}) => {
  return (
    <div
      className={`
        w-full
        ${noPadding ? "" : "px-4"}
        flex
        flex-col
        gap-1
      `}
    >
      {label && (
        <label
          className="
            text-[14px]
            lg:text-[16px]
            font-semibold
            text-black
          "
        >
          {label}
        </label>
      )}

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          w-full
          h-[45px]
          lg:h-[45px]

          rounded-[15px]

         border-[1.5px]
          border-dashed
          border-[#4E9F8A]

          bg-white

          px-5

          text-[15px]
          lg:text-[16px]

          text-[#202124]
          placeholder:text-[#7A7A7A]

          outline-none

          focus:border-[#4E9F8A]
          transition-all
        "
      />
    </div>
  );
};

export default ContainerEcritureModifier;