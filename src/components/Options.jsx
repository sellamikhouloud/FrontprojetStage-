export default function Options({options = [], handleSelect , className = "" }){
  return (
 <div
    className={`absolute w-full z-10 bg-white border border-gray-200 rounded-[0.5rem] shadow-xl py-1 max-h-60 overflow-auto text-[0.8125rem] font-poppins font-regular ${className}`}
  >
          {options.map((option) => (
            <div
              key={option.value || option}
              className="px-4 py-2 cursor-pointer transition-colors duration-200"
              onClick={() => handleSelect(option.value || option)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#E1E3E4";
                e.currentTarget.style.color = "#202124";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.color = "#202124";
              }}
            >
              {option.label || option}
            </div>
          ))}
        </div>
  )
}
