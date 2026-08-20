const DonorCard = ({
  title,
  totalDonors,
  activeDonors,
  newDonorsThisMonth,
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
        text-left
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
      "
    >
      {/* Header */}
      <h2
        className="
          text-[24px]
          font-semibold
          leading-[28px]
          text-[#171D1A]
          mb-[10px]

          max-md:text-[16px]
          max-md:leading-[20px]
          max-md:mb-[7px]
        "
      >
        {title}
      </h2>

      {/* Statistics */}
      <div
        className="
          grid
          grid-cols-3
          gap-[16px]

          max-md:w-full
          max-md:h-[65px]
          max-md:rounded-[12px]
          max-md:bg-[#F8FBFC]
          max-md:border
          max-md:border-[#BCCAC14D]
          max-md:gap-[16px]
        "
      >
        {/* Total donors */}
        <div className="flex flex-col items-center justify-center">
          <span
            className="
              text-[25px]
              font-bold
              leading-none

              max-md:text-[20px]
            "
          >
            {totalDonors}
          </span>

          <span
            className="
              text-[16px]
              text-[#4E9F8A]
              text-center
              mt-2

              max-md:text-[11px]
              max-md:mt-[3px]
              max-md:leading-[13px]
            "
          >
            Total donateurs
          </span>
        </div>

        {/* Active donors */}
        <div className="flex flex-col items-center justify-center">
          <span
            className="
              text-[25px]
              font-bold
              leading-none

              max-md:text-[20px]
            "
          >
            {activeDonors}
          </span>

          <span
            className="
              text-[16px]
              text-[#4E9F8A]
              text-center
              mt-2

              max-md:text-[11px]
              max-md:mt-[3px]
              max-md:leading-[13px]
            "
          >
            Donateurs actifs
          </span>
        </div>

        {/* New donors */}
        <div className="flex flex-col items-center justify-center">
          <span
            className="
              text-[25px]
              font-bold
              leading-none

              max-md:text-[20px]
            "
          >
            +{newDonorsThisMonth}
          </span>

          <span
            className="
              text-[16px]
              text-[#4E9F8A]
              text-center
              mt-2

              max-md:text-[11px]
              max-md:mt-[3px]
              max-md:leading-[13px]
            "
          >
            Nouveaux ce mois
          </span>
        </div>
      </div>
    </button>
  );
};

export default DonorCard;