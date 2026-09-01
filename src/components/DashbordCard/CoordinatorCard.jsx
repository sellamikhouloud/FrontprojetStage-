import Arrow from "../../assets/GreenArrow.svg";
import CardStatistic from "./CardStatistic";

const CoordinatorCard = ({
  title,
  manageText,
  coordinatorCount,
  coordinatorLabel,
  chefCoordinatorCount,
  chefCoordinatorLabel,
  Color = "#4E9F8A",
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="
        w-full
        bg-[#F8FBFC]
        rounded-[20px]
        px-[20px]
        py-[20px]
        shadow-sm
        hover:shadow-md
        hover:scale-[1.01]
        transition-all
        duration-200
        cursor-pointer
        text-left
        border
        border-[#BCCAC14D]
        max-md:bg-transparent
        max-md:border-0
        max-md:rounded-none
        max-md:px-0
        max-md:py-0
        max-md:shadow-none
        max-md:hover:shadow-none
        max-md:hover:scale-100
      "
    >
      {/* Header */}
      <div
        className="
          flex
          justify-between
          items-center
          max-md:mb-[7px]
        "
      >
        <h2
          className="
            text-[24px]
            font-semibold
            leading-[20px]
            text-[#171D1A]
            max-md:text-[16px]
            max-md:leading-[20px]
          "
        >
          {title}
        </h2>

        <div
          className="
            flex
            items-center
            gap-[10px]
            text-[#5E6064]
            text-[18px]
            font-medium
            hover:text-[#69B89C]
            transition-colors
            cursor-pointer
            max-md:text-[13px]
            max-md:gap-[5px]
          "
        >
          {manageText}

          <img
            src={Arrow}
            alt=""
            className="
              w-[15px]
              h-[15px]
              mt-1
              max-md:w-[12px]
              max-md:h-[12px]
            "
          />
        </div>
      </div>

      {/* Statistics */}
      <div
        className="
          flex
          justify-between
          items-center
          p-[10px]
          max-md:w-full
          max-md:h-[65px]
          max-md:p-[10px]
          max-md:rounded-[12px]
          max-md:bg-[#F8FBFC]
          max-md:border
          max-md:border-[#BCCAC14D]
        "
      >
        <CardStatistic
          value={coordinatorCount}
          label={coordinatorLabel}
          Color={Color}
        />

        <CardStatistic
          value={chefCoordinatorCount}
          label={chefCoordinatorLabel}
          Color={Color}
        />
      </div>
    </button>
  );
};

export default CoordinatorCard;
