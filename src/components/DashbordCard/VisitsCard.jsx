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
  showPercentage,
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
      </div>

      {/* Statistics */}
      <div className="flex justify-between">

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
              font-semibold
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

      {/* Compliance */}
      <div className="flex flex-col gap-[14px]">

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