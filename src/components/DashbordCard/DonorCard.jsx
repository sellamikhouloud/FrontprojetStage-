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
      "
    >
      {/* Header */}
      <h2
        className="
          text-[24px]
          font-semibold
          leading-[28px]
          text-[#171D1A]
          mb-[24px]
        "
      >
        {title}
      </h2>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-[16px]">

        {/* Total donors */}
        <div className="flex flex-col items-center">
          <span className="text-[32px] font-bold leading-none">
            {totalDonors}
          </span>

          <span className="text-[16px] text-[#4E9F8A] text-center mt-2">
            Total donateurs
          </span>
        </div>

        {/* Active donors */}
        <div className="flex flex-col items-center">
          <span className="text-[32px] font-bold leading-none">
            {activeDonors}
          </span>

          <span className="text-[16px] text-[#4E9F8A] text-center mt-2">
            Donateurs actifs
          </span>
        </div>

        {/* New donors */}
        <div className="flex flex-col items-center">
          <span className="text-[32px] font-bold leading-none">
            +{newDonorsThisMonth}
          </span>

          <span className="text-[16px] text-[#4E9F8A] text-center mt-2">
            Nouveaux ce mois
          </span>
        </div>

      </div>
    </button>
  );
};

export default DonorCard;