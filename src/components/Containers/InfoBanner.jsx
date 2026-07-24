import HistoryIcon from "../../assets/HistoryIcon.svg";

const InfoHeader = ({
  title,
  value,
  icon = HistoryIcon,
}) => {
  return (
    <div
      className="
        w-full
        h-[48px] lg:h-[48px]
        rounded-[12px]
         bg-[#BED5FC]/30
        px-4
        flex
        items-center
        justify-between
      "
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <img
          src={icon}
          alt=""
          className="w-5 h-5 lg:w-6 lg:h-6"
        />

        <span
          className="
            text-[14px]
            lg:text-[18px]
            font-semibold
            text-[#3F4945]
          "
        >
          {title}
        </span>
      </div>

      {/* Right */}
      <span
        className="
          text-[14px]
          lg:text-[18px]
          font-normal
          text-[#3F4945]
        "
      >
        {value}
      </span>
    </div>
  );
};

export default InfoHeader;