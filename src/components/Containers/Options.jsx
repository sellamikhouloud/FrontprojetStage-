export default function Options({
  options = [],
  handleSelect,
}) {
  return (
    <div className="w-full bg-white">
      {options.map((option) => (
        <div
          key={option.value || option}
          onClick={() => handleSelect(option.value || option)}
          className="
            px-4
            py-3
            text-[16px]
            text-[#202124]
            cursor-pointer
            hover:bg-[#F5F5F5]
            transition-colors
          "
        >
          {option.label || option}
        </div>
      ))}
    </div>
  );
}
