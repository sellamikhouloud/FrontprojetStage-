export default function Options2({
  options = [],
  handleSelect,
}) {
  return (
    <div
      className="
        w-full
        bg-white
        max-h-[220px]
        overflow-y-auto
        rounded-b-[15px]
        scrollbar-thin
      "
    >
      {options.map((option, index) => (
        <div
          key={option.value ?? index}
          onClick={() => handleSelect(option)}
          className="
            w-full
            px-4
            py-3
            text-[16px]
            text-[#202124]
            cursor-pointer
            break-words
            whitespace-normal
            hover:bg-[#F5F5F5]
            transition-colors
          "
        >
          {option.label}
        </div>
      ))}
    </div>
  );
}