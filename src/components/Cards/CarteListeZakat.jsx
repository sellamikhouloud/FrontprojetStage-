const CardListZakat = ({
  sexe = "Garçon",
  nom,
  code,
  zakat,
  date,
  montant,
  valeur,
  onClick,
}) => {
  const isGirl = sexe === "Fille";

  return (
    <div
      onClick={onClick}
      className="w-full min-h-[90px] rounded-[15px] border px-[15px] py-[15px] transition hover:shadow-sm cursor-pointer"
     style={{
  background: isGirl ? "#FFF2F5" : "#F8FBFC",
  borderColor: "#E2E8F0",
}}
    >
      {/* ================= MOBILE ================= */}
      <div className="block md:hidden">
        {/* Ligne 1 */}
        <div className="flex items-center justify-between">
          <h2 className="truncate text-[18px] font-bold text-[#111827]">
            {nom}
          </h2>

          <span className="text-[16px] font-semibold text-[#111827]">
            {date}
          </span>
        </div>

        {/* Ligne 2 */}
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span
            className="text-[16px] font-medium"
            style={{
              color: isGirl ? "#EF4444" : "#528583",
            }}
          >
            {code}
          </span>

          <span className="text-[#94A3B8]">•</span>

          <span className="text-[16px] text-[#111827]">{zakat}</span>
        </div>

        {/* Ligne 3 */}
        <div className="mt-2">
          <span
            className="text-[15px] font-medium"
            style={{
              color: isGirl ? "#EF4444" : "#528583",
            }}
          >
            Montant
          </span>

          <span className="ml-2 text-[15px] text-[#111827]">
            {valeur}
          </span>
        </div>
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:block">
        {/* Première ligne */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-[20px] font-bold text-[#111827]">
              {nom}
            </h2>

            <span className="text-[#94A3B8]">•</span>

            <span
              className="text-[17px] font-medium"
              style={{
                color: isGirl ? "#EF4444" : "#528583",
              }}
            >
              {code}
            </span>

            <span className="text-[#94A3B8]">•</span>

            <span className="text-[17px] text-[#111827]">
              {zakat}
            </span>
          </div>

          <span className="text-[17px] font-semibold text-[#111827]">
            {date}
          </span>
        </div>

        {/* Deuxième ligne */}
        <div className="mt-2 flex items-center gap-2 text-[16px]">
          <span
            className="font-medium"
            style={{
              color: isGirl ? "#EF4444" : "#528583",
            }}
          >
            {montant}
          </span>

          <span className="text-[#111827]">{valeur}</span>
        </div>
      </div>
    </div>
  );
};

export default CardListZakat;