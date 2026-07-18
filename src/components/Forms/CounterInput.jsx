import IconButton from "../Button/IconButton";
import addWhite from "../../assets/addWhite.svg";
import minusWhite from "../../assets/minusWhite.svg";

const CounterInput = ({
  value,
  onIncrement,
  onDecrement,
  mobileWidth = "w-[120px]",
  desktopWidth = "lg:w-[180px]",
}) => {
  return (
    <div className="flex items-center gap-[12px] lg:gap-[18px]">
      {/* Minus button */}
      <IconButton
        icon={minusWhite}
        alt="Retirer"
        onClick={onDecrement}
        className="w-[35px] h-[35px] lg:w-[40px] lg:h-[40px]"
        iconClassName="w-[14px] h-[14px] lg:w-[16px] lg:h-[16px]"
      />

      {/* Counter */}
      <div
        className={`
          ${mobileWidth}
          ${desktopWidth}
          h-[35px]
          lg:h-[40px]
          border
          border-[#4E9F8A]
          rounded-[15px]
          bg-white
          flex
          items-center
          justify-center
        `}
      >
        <span
          className="
            text-[14px]
            lg:text-[16px]
            font-semibold
            text-[#525252]
          "
        >
          {value}
        </span>
      </div>

      {/* Plus button */}
      <IconButton
        icon={addWhite}
        alt="Ajouter"
        onClick={onIncrement}
        className="w-[35px] h-[35px] lg:w-[40px] lg:h-[40px]"
        iconClassName="w-[14px] h-[14px] lg:w-[16px] lg:h-[16px]"
      />
    </div>
  );
};

export default CounterInput;