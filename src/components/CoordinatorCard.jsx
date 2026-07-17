import Arrow from "../assets/GreenArrow.svg";
import CardStatistic from "./CardStatistic";

const CoordinatorCard = ({
  title,
  manageText,

  coordinatorCount,
  coordinatorLabel,

  lastConnection,
  lastConnectionLabel,

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
        order
        border-[#BCCAC14D]
      "
    >
      {/* Header */}
      <div className="flex justify-between items-center">

        <h2
          className="
            text-[24px]
            font-semibold
            leading-[20px]
          "
        >
          {title}
        </h2>

        <button
          className="
            flex
            items-center
            gap-[10px]
            text-[#5E6064]
            text-[18px]
            font-medium
            hover:text-[#69B89C]
            transition-colors
          "
        >
          {manageText}

          <img
            src={Arrow}
            alt=""
            className="w-[15px] h-[15px]"
          />
        </button>

      </div>

      {/* Statistics */}

      <div className="flex justify-between items-center p-[10px]">

        <CardStatistic
          value={coordinatorCount}
          label={coordinatorLabel}
          valueColor={Color}
        />

        <CardStatistic
          value={lastConnection}
          label={lastConnectionLabel}
          valueColor={Color}
        />

      </div>
    </button>
  );
};

export default CoordinatorCard;