import calendar from "../assets/calender.svg";

const DateContainer = ({
  label,
  value,
  onChange,
  noPadding = false,
}) => {
    return(
    <div
      className={`
        flex items-center gap-[10px]
        w-full
        pb-2
        ${
          noPadding
            ? ""
            : "py-2 px-4 lg:pl-50 lg:pr-5"
        }
      `}
    >
      <div className="flex flex-col gap-2 w-full">
        {/* Label */}
           <label className="
            text-[14px]
            sm:text-[15px]
            lg:text-[16px]

            font-semibold
            text-blackbold
             
           ">
            {label}
           </label>

        {/* Date Input */}
        <input 
        type="date"
        value={value}
        onChange={onChange}
        className="
            w-full
            h-[45px]         
            border
            border-[#4E9F8A]
            rounded-[15px]
            p-3
            gap-[10px]
          
            text-left

            focus:outline-none
            focus:border-[#4E9F8A]
            focus:ring-0

            transition-all
            duration-200
        "
        />
        </div>
      </div>
    )
}
export default DateContainer;
