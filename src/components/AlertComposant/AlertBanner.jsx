import arrow from "../../assets/right-arrow.png";

const AlertBanner = ({
  icon,
  title,
  subtitle,
  count,
  bgColor,
  iconBgColor,
  borderColor,
  hasLeftBorder = false,
  subtitleColor = "#5E6064",
  height = "66px",
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="
        relative
        w-full
        rounded-[20px]
        border
        overflow-hidden
        flex
        items-center
        justify-between
        gap-[18px]
        px-[20px]
        py-[15px]
        transition-all
        duration-200
        hover:shadow-md
        hover:scale-[1.02]
        cursor-pointer
      "
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
        height,
      }}
    >
      {/* Left Border */}
      {hasLeftBorder && (
        <div
          className="absolute left-0 top-0 h-full w-[6px]"
          style={{
            backgroundColor: borderColor,
            borderTopLeftRadius: "20px",
            borderBottomLeftRadius: "20px",
          }}
        />
      )}

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
        className={`
          flex-1
          flex
          ${title ? "flex-col items-start gap-[6px]" : "items-center"}
        `}
      >
        {title && (
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
        )}

        <p
          className={`
            text-[16px]
            font-medium
            leading-5
          `}
          style={{ color: subtitleColor }}
        >
          {count !== undefined ? (
            <>
              <span className="font-semibold">{count}</span> {subtitle}
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