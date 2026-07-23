const CardDonateur = ({
  name,
  email,
  date,
  code,
  status = "Actif",
}) => {
  return (
    <div className="w-full min-h-[100px] rounded-[15px] border border-[#E2E8F0] bg-[#F8FBFC] px-[15px] py-[15px] transition hover:shadow-sm">
      {/* Première ligne */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <h2 className="text-[20px] font-bold text-[#111827] truncate">
            {name}
          </h2>

          <span className="text-[#94A3B8] shrink-0 text-[18px]">•</span>

          <span className="text-[17px] font-semibold text-[#528583] shrink-0">
            {status}
          </span>
        </div>

        <span className="text-[18px] font-semibold text-[#111827] shrink-0">
          {code}
        </span>
      </div>

      {/* Deuxième ligne */}
      <div className="mt-3 flex items-center flex-wrap gap-2 text-[15px] text-[#374151]">
        <span className="break-all">{email}</span>

        <span className="text-[#94A3B8]">•</span>

        <span>{date}</span>
      </div>
    </div>
  );
};

export default CardDonateur;
