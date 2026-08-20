import Arrow from "../../assets/right-arrow.png";
import ProgressBar from "../Progress/ProgressBar";

const NutritionCard = ({
  title,

  normalPercentage,
  mamPercentage,
  masPercentage,

  normalColor,
  mamColor,
  masColor,

  trackColor,

  height,
  radius,
}) => {
  return (
    <>
      {/* =====================================================
          DESKTOP
      ====================================================== */}
      <div
        className="
          hidden lg:flex
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
          border
          border-[#BCCAC14D]
          flex-col
          gap-4
        "
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2
            className="
              text-[24px]
              font-semibold
              leading-[20px]
              text-[#171D1A]
            "
          >
            {title}
          </h2>
        </div>

        {/* Progress Bar */}
        <ProgressBar
          segments={[
            {
              value: normalPercentage,
              color: normalColor,
            },
            {
              value: mamPercentage,
              color: mamColor,
            },
            {
              value: masPercentage,
              color: masColor,
            },
          ]}
          trackColor={trackColor}
          height={height}
          radius={radius}
          showPercentage={false}
        />

        {/* Legend */}
        <div className="flex justify-between">
          {/* Normal */}
          <div className="flex items-center gap-[4px]">
            <div
              className="w-[12px] h-[12px] rounded-full"
              style={{ backgroundColor: normalColor }}
            />

            <span
              className="
                text-[18px]
                font-medium
                leading-[16px]
              "
            >
              Normal {normalPercentage}%
            </span>
          </div>

          {/* MAM */}
          <div className="flex items-center gap-[4px]">
            <div
              className="w-[12px] h-[12px] rounded-full"
              style={{ backgroundColor: mamColor }}
            />

            <span
              className="
                text-[18px]
                font-medium
                leading-[16px]
              "
            >
              MAM {mamPercentage}%
            </span>
          </div>

          {/* MAS */}
          <div className="flex items-center gap-[4px]">
            <div
              className="w-[12px] h-[12px] rounded-full"
              style={{ backgroundColor: masColor }}
            />

            <span
              className="
                text-[18px]
                font-medium
                leading-[16px]
              "
            >
              MAS {masPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE
      ====================================================== */}
      <div className="lg:hidden w-full">
        {/* Mobile title - OUTSIDE the card */}
        <h2
          className="
            text-[16px]
            font-medium
            leading-[18px]
            text-[#171D1A]
            mb-[5px]
          "
        >
          {title}
        </h2>

        {/* Mobile Nutrition Card */}
        <div
          className="
            w-full
            bg-[#F8FBFC]
            rounded-[15px]
            border
            border-[#4E9F8A]
            px-[18px]
            py-[12px]
          "
        >
          {/* Progress Bar */}
          <div className="w-full">
            <ProgressBar
              segments={[
                {
                  value: normalPercentage,
                  color: normalColor,
                },
                {
                  value: mamPercentage,
                  color: mamColor,
                },
                {
                  value: masPercentage,
                  color: masColor,
                },
              ]}
              trackColor={trackColor}
              height="10px"
              radius="15px"
              showPercentage={false}
            />
          </div>

          {/* Legend */}
          <div
            className="
              flex
              items-center
              justify-between
              w-full
              mt-[10px]
            "
          >
            {/* Normal */}
            <div className="flex items-center gap-[4px]">
              <div
                className="w-[10px] h-[10px] rounded-full"
                style={{ backgroundColor: normalColor }}
              />

              <span
                className="
                  text-[14px]
                  font-medium
                  leading-[14px]
                  whitespace-nowrap
                "
              >
                Normal {normalPercentage}%
              </span>
            </div>

            {/* MAM */}
            <div className="flex items-center gap-[4px]">
              <div
                className="w-[10px] h-[10px] rounded-full"
                style={{ backgroundColor: mamColor }}
              />

              <span
                className="
                  text-[14px]
                  font-medium
                  leading-[14px]
                  whitespace-nowrap
                "
              >
                MAM {mamPercentage}%
              </span>
            </div>

            {/* MAS */}
            <div className="flex items-center gap-[4px]">
              <div
                className="w-[10px] h-[10px] rounded-full"
                style={{ backgroundColor: masColor }}
              />

              <span
                className="
                  text-[14px]
                  font-medium
                  leading-[14px]
                  whitespace-nowrap
                "
              >
                MAS {masPercentage}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NutritionCard;