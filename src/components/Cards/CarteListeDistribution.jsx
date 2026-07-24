const CardListDistribution = ({
  sexe = "Fille",
  nom,
  code,
  distribution,
  date,
  produits = [],
  onClick,
}) => {
  const isGirl = sexe === "Fille";

  return (
    <div
      onClick={onClick}
      className="w-full min-h-[100px] rounded-[15px] border px-[15px] py-[15px] transition hover:shadow-sm cursor-pointer"
      style={{
        background: isGirl ? "#FFF2F5" : "#ECF8F7",
        borderColor: isGirl ? "#F3D5D5" : "#DCE8E8",
      }}
    >
      {/* ================= MOBILE ================= */}
      <div className="block md:hidden">
        {/* Ligne 1 */}
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex-1 min-w-0 truncate text-[20px] font-bold text-[#111827]">
            {nom}
          </h2>

          <span
            className="shrink-0 text-[18px] font-semibold"
            style={{
              color: isGirl ? "#EF4444" : "#528583",
            }}
          >
            {code}
          </span>
        </div>

        {/* Ligne 2 */}
        <div className="mt-2 flex items-center gap-2 text-[16px] text-[#111827]">
          <span>{distribution}</span>

          <span className="text-[#94A3B8]">•</span>

          <span className="font-semibold">{date}</span>
        </div>

        {/* Produits */}
        <div className="mt-3 space-y-1">
          {produits.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between"
            >
              <span
                className="text-[15px] font-semibold"
                style={{
                  color: isGirl ? "#EF4444" : "#528583",
                }}
              >
                {item.nom}
              </span>

              <span className="text-[15px] text-[#111827]">
                {item.quantite}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:block">
        {/* Première ligne */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[20px] font-bold text-[#111827]">
              {nom}
            </h2>

            <span className="text-[#94A3B8]">•</span>

            <span
              className="text-[17px] font-semibold"
              style={{
                color: isGirl ? "#EF4444" : "#528583",
              }}
            >
              {code}
            </span>

            <span className="text-[#94A3B8]">•</span>

            <span className="text-[17px] font-semibold text-[#111827]">
              {distribution}
            </span>
          </div>

          <span className="text-[17px] font-semibold text-[#111827]">
            {date}
          </span>
        </div>

        {/* Produits */}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[15px]">
          {produits.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span
                className="font-semibold"
                style={{
                  color: isGirl ? "#EF4444" : "#528583",
                }}
              >
                {item.nom}
              </span>

              <span className="text-[#374151]">
                {item.quantite}
              </span>

              {index !== produits.length - 1 && (
                <span className="text-[#94A3B8]">•</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardListDistribution;