const Input = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}) => {
  return (
    <div
      className="
        w-full

        px-4
        lg:pl-20
        lg:pr-5

        py-2
      "
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

        {/* Input */}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="
            w-full

            h-[45px]

            rounded-[15px]

            border
            border-[#4E9F8A]

            bg-white

            px-3

            text-[14px]
            sm:text-[15px]
            lg:text-[16px]

            placeholder:text-gray-400

            focus:outline-none
            focus:border-[#4E9F8A]
            focus:ring-0

            transition-all
            duration-200
          "
        />

      </div>
    </div>
  );
};

export default Input;
