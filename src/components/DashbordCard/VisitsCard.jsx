import ProgressBar from "../Progress/ProgressBar";

const VisitsCard = ({
  title,
  completedVisits,
  expectedVisits,
  compliancePercentage,

  // ProgressBar props
  fillColor,
  trackColor,
  height,
  radius,
  showPercentage = false,
  percentageColor,
  className,
  animate,

  onClick,
}) => {
  return (
    <div
      className="
        w-full
        bg-[#F8FBFC]
        rounded-[20px]
        px-[15px]
        py-[20px]
        shadow-sm
        hover:shadow-md
        hover:scale-[1.01]
        transition-all
        duration-200
        cursor-pointer
        text-left
        flex
        flex-col
        gap-[18px]
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
        max-md:gap-0
      "
      onClick={onClick}
    >
      {/* Header */}
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
      max-md:text-[16px]
      max-md:leading-[20px]
    "
  >
    {title}
  </h2>

  {/* Voir liste des visites */}
  <button
    type="button"
    onClick={onClick}
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
    Voir liste des visites
  </button>
</div>

      {/* ========================= */}
      {/* MOBILE STATISTICS          */}
      {/* ========================= */}

      <div
        className="
          hidden
          max-md:flex
          w-full
          h-[55px]
          rounded-[12px]
          border
          border-[#8BC9C9]
          bg-[#F8FBFC]
          overflow-hidden
        "
      >
        {/* Completed */}
        <div
          className="
            w-1/2
            flex
            flex-col
            items-center
            justify-center
            gap-[2px]
          "
        >
          <span
            className="
              text-[14px]
              font-semibold
              leading-[14px]
            "
          >
            réalisées
          </span>

          <span
            className="
              text-[20px]
              font-extrabold
              leading-[20px]
              text-[#22C55E]
            "
          >
            {completedVisits}
          </span>
        </div>

        {/* Divider */}
        <div
          className="
            w-[2px]
            h-[40px]
            self-center
            bg-[#5E9F92]
          "
        />

        {/* Expected */}
        <div
          className="
            w-1/2
            flex
            flex-col
            items-center
            justify-center
            gap-[2px]
          "
        >
          <span
            className="
              text-[14px]
              font-semibold
              leading-[14px]
              text-center
            "
          >
            prévues ce mois
          </span>

          <span
            className="
              text-[20px]
              font-extrabold
              leading-[20px]
              text-[#91A09F]
            "
          >
            {expectedVisits}
          </span>
        </div>
      </div>

      {/* ========================= */}
      {/* DESKTOP STATISTICS         */}
      {/* ========================= */}

      <div className="flex justify-between max-md:hidden">
        {/* Completed */}
        <div className="flex flex-col items-start gap-[6px]">
          <span
            className="
              text-[48px]
              font-semibold
              leading-[32px]
              text-[#7BC8C4]
            "
          >
            {completedVisits}
          </span>

          <span
            className="
              text-[16px]
              text-[#5E6064]
            "
          >
            Réalisées
          </span>
        </div>

        {/* Expected */}
        <div className="flex flex-col items-end gap-[6px]">
          <span
            className="
              text-[48px]
              leading-[32px]
              text-[#595C5E]
            "
          >
            {expectedVisits}
          </span>

          <span
            className="
              text-[16px]
              text-[#5E6064]
            "
          >
            Prévues ce mois
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-[14px] max-md:hidden">
        <div className="flex justify-between items-center">
          <span
            className="
              text-[20px]
              font-bold
              text-[#171D1A]
              leading-[16px]
            "
          >
            Taux de compliance
          </span>

          {!showPercentage && (
            <span
              className="
                text-[20px]
                text-[#171D1A]
                leading-[16px]
              "
            >
              {compliancePercentage}%
            </span>
          )}
        </div>

        <ProgressBar
          value={compliancePercentage}
          fillColor={fillColor}
          trackColor={trackColor}
          height={height}
          radius={radius}
          showPercentage={showPercentage}
          percentageColor={percentageColor}
          className={className}
          animate={animate}
        />
      </div>
    </div>
  );
};

export default VisitsCard;