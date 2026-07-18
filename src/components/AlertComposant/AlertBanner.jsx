import arrow from "../../assets/right-arrow.png";

const AlertBanner = ({
  icon,
  title,
  subtitle,
  count,
  bgColor,
  iconBgColor,
  borderColor,
  leftBorder,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="
        w-full
        rounded-[20px]
        border
        flex
        items-center
        justify-between
        gap-[18px]
        px-[20px]
        py-[18px]
        transition-all
        duration-200
        hover:shadow-md
        hover:scale-[1.02]
        cursor-pointer
      "
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
        borderLeft: leftBorder,
      }}
    >
      {/* Icon */}
      <div
        className="
          w-[48px]
          h-[48px]
          rounded-full
          flex
          items-center
          justify-center
          flex-shrink-0
        "
        style={{ backgroundColor: iconBgColor }}
      >
        <img
          src={icon}
          alt={title}
          className="w-[17px] h-[17px]"
        />
      </div>

      {/* Text */}
      <div
        className="
          flex-1
          flex
          flex-col
          items-start
          gap-[6px]
        "
      >
        <h3
          className="
            text-[18px]
            font-semibold
            leading-5
            text-[#2E2E2E]
          "
        >
          {title}
        </h3>

        <p
          className="
            text-[16px]
            font-medium
            leading-5
            text-[#5E6064]
          "
        >
          {count !== undefined ? (
            <>
              <span>{count}</span> {subtitle}
            </>
          ) : (
            subtitle
          )}
        </p>
      </div>

      {/* Arrow */}
      <div className="flex items-center">
        <img
          src={arrow}
          alt="Arrow"
          className="w-4 h-4 flex-shrink-0"
        />
      </div>
    </button>
  );
};

export default AlertBanner;