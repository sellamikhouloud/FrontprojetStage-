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
        max-md:rounded-[14px]
        border
        overflow-hidden
        flex
        items-center
        justify-between
        gap-[18px]
        max-md:gap-[10px]
        px-[20px]
        max-md:px-[12px]
        py-[15px]
        max-md:py-[9px]
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
          className="
            absolute
            left-0
            top-0
            h-full
            w-[6px]
            max-md:w-[4px]
          "
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
          max-md:w-[36px]
          max-md:h-[36px]
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
          className="
            w-[17px]
            h-[17px]
            max-md:w-[14px]
            max-md:h-[14px]
          "
        />
      </div>

      {/* Text */}
      <div
        className={`
          flex-1
          flex
          text-left
          min-w-0
          ${title ? "flex-col items-start gap-[4px]" : "items-start"}
        `}
      >
        {title && (
          <h3
            className="
              text-[17px]
              max-md:text-[13px]
              font-semibold
              leading-5
              max-md:leading-[15px]
              text-left
              truncate
              max-w-full
            "
          >
            {title}
          </h3>
        )}

        <p
          className="
            text-[15px]
            max-md:text-[11px]
            font-medium
            leading-5
            max-md:leading-[14px]
            text-left
            truncate
            max-w-full
          "
          style={{ color: subtitleColor }}
        >
          {count !== undefined ? (
            <>
              <span className="font-semibold">{count}</span>{" "}
              {subtitle}
            </>
          ) : (
            subtitle
          )}
        </p>
      </div>

      {/* Arrow */}
      <div className="flex items-center flex-shrink-0">
        <img
          src={arrow}
          alt="Arrow"
          className="
            w-4
            h-4
            max-md:w-[12px]
            max-md:h-[12px]
            flex-shrink-0
          "
        />
      </div>
    </button>
  );
};

export default AlertBanner;