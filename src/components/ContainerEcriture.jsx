const Input = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  noPadding = false,
  variant = "default",
  multiline = false,
  rows = 4,
}) => {
  const variants = {
    default: `
      border
      border-[#4E9F8A]
      rounded-[15px]
      text-black
      placeholder:text-gray-400
    `,

    dashed: `
      border
      border-dashed
      border-[#000000]
      rounded-[18px]
      text-[#525252]
      placeholder:text-[#6F7975]
    `,
  };

  const inputClass = `
    w-full
    bg-white
    px-3
    py-3
    mb-5

    text-[14px]
    sm:text-[15px]
    lg:text-[16px]

    focus:outline-none
    focus:ring-0

    transition-all
    duration-200

    ${multiline ? "min-h-[120px] resize-none" : "h-[45px]"}
    ${variants[variant]}
  `;

  return (
    <div
      className={`
        flex items-center gap-[10px]
        w-full
        ${noPadding ? "" : "py-2 px-4 lg:pl-50 lg:pr-5"}
      `}
    >
      <div className="flex flex-col gap-2 w-full">

        {/* Label */}
        {label && (
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
        )}

        {/* Input or Textarea */}
        {multiline ? (
          <textarea
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            rows={rows}
            className={inputClass}
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={inputClass}
          />
        )}
      </div>
    </div>
  );
};

export default Input;