const TextArea = ({
  label,
  placeholder = "Tapez ici si il y a des observations",
  value,
  onChange,
  width = "w-full",
  height = "h-[150px]",
}) => {
  return (
    <div className={`${width} flex flex-col`}>
      {/* Label */}
      <label
        className="
          mb-2
          text-[14px]
          sm:text-[15px]
          lg:text-[16px]
          font-semibold
          text-black
        "
      >
        {label}
      </label>

      {/* TextArea */}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          ${height}
          w-full

          rounded-[15px]
          border
          border-[#4E9F8A]

          p-4

          resize-none

          text-[14px]
          sm:text-[15px]
          lg:text-[16px]

          placeholder:text-gray-400

          focus:outline-none
          focus:ring-0
          focus:border-[#4E9F8A]
        `}
      />
    </div>
  );
};

export default TextArea;
