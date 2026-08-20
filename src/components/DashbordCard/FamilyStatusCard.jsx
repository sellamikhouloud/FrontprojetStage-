import StatusItem from "../StatusItem";

const FamilyStatusCard = ({
  title,
  stats,
  onClick,
}) => {
  return (
    <>
      {/* =====================================================
          DESKTOP
      ====================================================== */}
      <button
        onClick={onClick}
        className="
          hidden lg:block
          w-full
          bg-[#F8FBFC]
          rounded-[20px]
          px-[15px]
          py-[20px]
          shadow-sm
          hover:shadow-md
          transition-all
          duration-200
          text-left
          border
          border-[#BCCAC14D]
        "
      >
        {/* Header */}
        <div
          className="
            flex
            justify-between
            items-center
            mb-6
          "
        >
          <h2
            className="
              text-[24px]
              font-semibold
              text-[#171D1A]
              leading-[28px]
            "
          >
            {title}
          </h2>
        </div>

        {/* Statistics */}
        <div
          className="
            flex
            justify-between
            items-center
            gap-[8px]
          "
        >
          {stats.map((item) => (
            <StatusItem
              key={item.id}
              value={item.value}
              label={item.label}
              color={item.color}
              borderColor={item.borderColor}
            />
          ))}
        </div>
      </button>

      {/* =====================================================
          MOBILE
      ====================================================== */}
      <div className="lg:hidden w-full">
        {/* Mobile title - OUTSIDE the card */}
        <h2
          className="
            text-[16px]
            font-semibold
            leading-[18px]
            mb-[5px]
          "
        >
          {title}
        </h2>

        {/* Mobile Statistics Card */}
        <button
          onClick={onClick}
          className="
            relative
            w-full
            h-[58px]
            bg-[#F8FBFC]
            rounded-[12px]
            border
            border-[#4E9F8A]
            px-[10px]
            cursor-pointer
            text-left
          "
        >
          <div className="flex items-stretch h-full">
            {stats.map((item, index) => (
              <div
                key={item.id}
                className="
                  relative
                  flex-1
                  flex
                  flex-col
                  items-center
                  justify-center
                  min-w-0
                "
              >
                {/* Separator */}
                {index !== 0 && (
                  <span
                    className="
                      absolute
                      left-0
                      top-1/2
                      -translate-y-1/2
                      w-[2px]
                      h-[42px]
                      rounded-[15px]
                      bg-[#4E9F8A]
                    "
                  />
                )}

                {/* Label */}
                <span
                  className="
                    text-[14px]
                    leading-[14px]
                    font-medium
                    text-[#171D1A]
                    whitespace-nowrap
                  "
                >
                  {item.label}
                </span>

                {/* Value */}
                <span
                  className="
                    text-[20px]
                    leading-[20px]
                    font-bold
                    mt-[3px]
                  "
                  style={{
                    color: item.color,
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </button>
      </div>
    </>
  );
};

export default FamilyStatusCard;