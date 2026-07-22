const CardDonateur = ({
  name,
  email,
  date,
  code,
  status = "Actif",
}) => {
  return (
    <div
      className="
        w-full
        min-h-[100px]
        rounded-[15px]
        border
        bg-[#F8FBFC]
        border-[#E2E8F0]
        px-[15px]
        py-[15px]
        transition
        hover:shadow-sm
      "
    >
      {/* Première ligne */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-[18px] sm:text-[19px] lg:text-[20px] font-bold text-[#111827]">
            {name}
          </h2>

          <span className="text-[#94A3B8]">•</span>

          <span
            className="text-[16px] sm:text-[17px] font-semibold"
            style={{ color: "#528583" }}
          >
            {status}
          </span>
        </div>

        <span className="text-[16px] sm:text-[17px] font-semibold text-[#111827]">
          {code}
        </span>
      </div>

      {/* Deuxième ligne */}
      <div className="mt-2 flex flex-wrap items-center gap-2 text-[14px] sm:text-[15px] text-[#374151]">
        <span className="text-[#94A3B8]">•</span>

        <span className="break-all">{email}</span>

        <span className="text-[#94A3B8]">•</span>

        <span>{date}</span>
      </div>
    </div>
  );
};

export default CardDonateur;
