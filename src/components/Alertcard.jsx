import AlertIcon from "../assets/Overlay (1).svg";
import VisitIcon from "../assets/Overlay.svg";
import ArrowRight from "../assets/arrow-drop-down.svg";
import LateVisitIcon from "../assets/Icon.svg";
import LastDistributionIcon from "../assets/Frame.svg";

const variants = {
  danger: {
    background: "bg-[#EF44441A]",
    border: "border-[#C73939]",
    accent: "bg-[#EF4444]",
    icon: AlertIcon,
  },

  warning: {
    background: "bg-[#F59E0B1A]",
    border: "border-[#CC8409]",
    accent: "bg-[#F59E0B]",
    icon: VisitIcon,
  },

  lateVisit: {
    background: "bg-[#FFFBEB]",
    border: "border-[#FDE68A]",
    icon: LateVisitIcon,
  },

  lastDistribution: {
    background: "bg-[#BED5FC4D]",
    icon: LastDistributionIcon,
  },
};

const AlertCard = ({
  variant = "",
  title,
  description,
  onArrowClick,
}) => {
  const style = variants[variant];

  /* ===========================
     Visite en retard
  =========================== */

  if (variant === "lateVisit") {
    return (
      <div
        className="
          w-full
          max-w-[580px]
          min-h-[45px]
          rounded-[15px]
          border
          px-3
          py-2
          flex
          items-center
          justify-between
          gap-3
          bg-[#FFFBEB]
          border-[#FDE68A]
        "
      >
        <div className="flex items-center gap-2 flex-shrink-0">
          <img
            src={style.icon}
            alt=""
            className="w-5 h-5"
          />

          <span
            className="
              text-[13px]
              sm:text-[14px]
              md:text-[15px]
              lg:text-[16px]
              font-semibold
              text-[#78350F]
              whitespace-nowrap
            "
          >
            Visite en retard
          </span>
        </div>

        <span
          className="
            flex-1
            text-right
            text-[11px]
            sm:text-[12px]
            md:text-[13px]
            lg:text-[14px]
            text-[#78350F]
            break-words
          "
        >
          {description}
        </span>
      </div>
    );
  }

  /* ===========================
     Dernière distribution
  =========================== */

  if (variant === "lastDistribution") {
    return (
      <div
       className="
  w-full
  max-w-[580px]
  h-[58px]
  rounded-[16px]
  px-[16px]
  py-[10px]
  flex
  items-center
  justify-between
"
        style={{
          backgroundColor: "#BED5FC4D",
        }}
      >
        <div className="flex items-center gap-[18px]">
          <img
            src={style.icon}
            alt=""
            className="w-[50px] h-[50px] shrink-0"
          />

          <span
            className="
              text-[14px]
              sm:text-[16px]
              md:text-[18px]
              lg:text-[20px]
              font-semibold
              text-[#3F3F46]
            "
          >
            Dernière distribution
          </span>
        </div>

        <span
          className="
            text-[14px]
            sm:text-[16px]
            md:text-[18px]
            lg:text-[20px]
            text-[#3F3F46]
          "
        >
          {description}
        </span>
      </div>
    );
  }

  /* ===========================
     Danger & Warning
  =========================== */

  return (
    <div
      className={`
        relative
        w-full
        max-w-[580px]
        h-[70px]
        ${style.background}
        ${style.border}
        border
        rounded-[20px]
        px-[18px]
        py-[20px]
        flex
        items-center
        justify-between
      `}
    >
      <div
        className={`
          absolute
          left-0
          top-[7px]
          bottom-[7px]
          w-[6px]
          ${style.accent}
          rounded-l-[50px]
          rounded-r-[9px]
        `}
      />

      {/* Partie gauche */}
      <div className="flex items-center gap-[18px] flex-1">
        <img
          src={style.icon}
          alt=""
          className="w-[50px] h-[50px] shrink-0"
        />

        <div className="flex flex-col gap-[6px] flex-1">
          <h2
            className="
              text-[14px]
              sm:text-[16px]
              md:text-[18px]
              lg:text-[20px]
              font-semibold
              text-[#202124]
              leading-none
            "
          >
            {title}
          </h2>

          <p
            className="
              text-[11px]
              sm:text-[12px]
              md:text-[13px]
              lg:text-[14px]
              font-normal
              text-[#6B7280]
              leading-none
            "
          >
            {description}
          </p>
        </div>
      </div>

      <button
        onClick={onArrowClick}
        className="
          ml-[10px]
          flex
          items-center
          justify-center
          cursor-pointer
          transition-transform
          duration-200
          hover:scale-110
          active:scale-95
          shrink-0
        "
      >
        <img
          src={ArrowRight}
          alt="ouvrir"
          className="w-[20px] h-[20px]"
        />
      </button>
    </div>
  );
};

export default AlertCard;
