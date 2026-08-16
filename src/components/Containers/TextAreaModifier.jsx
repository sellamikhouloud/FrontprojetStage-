const TextareaModifier = ({
  label,
  placeholder = "",
  value,
  onChange,
  width = "w-full",
  height = "h-[80px]", 
}) => {
  return (
    <div className={`${width} flex flex-col`}>
      {label && (
        <label className="mb-2 text-[18px] font-semibold text-black">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          ${height} w-full
          border border-dashed border-[#84D6D0]
          rounded-[15px] p-3
          resize-none outline-none
          text-[14px] sm:text-[15px] lg:text-[16px]
          placeholder:text-gray-400
          focus:outline-none focus:ring-0 focus:border-[#84D6D0]
        `}
      />
    </div>
  );
};

export default TextareaModifier;
