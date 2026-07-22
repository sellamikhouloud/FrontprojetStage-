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
      className="
        w-full
        min-h-[95px]
        rounded-[15px]
        border
        px-5
        py-3
        sm:px-6
        sm:py-4
        cursor-pointer
        transition
        hover:shadow-sm
      "
      style={{
        background: isGirl ? "#FFF2F5" : "#ECF8F7",
        borderColor: isGirl ? "#F3D5D5" : "#DCE8E8",
      }}
    >
      {/* Ligne 1 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex flex-wrap items-center gap-3 text-[16px] sm:text-[17px]">
          <span className="font-bold text-[#1E1E1E] text-[17px] sm:text-[18px]">
            {nom}
          </span>

          <span>•</span>

          <span
            className="font-semibold text-[16px] sm:text-[17px]"
            style={{
              color: isGirl ? "#EF4444" : "#528583",
            }}
          >
            {code}
          </span>

          <span>•</span>

          <span className="font-semibold text-[#1E1E1E] text-[16px] sm:text-[17px]">
            {distribution}
          </span>
        </div>

        <span className="font-bold text-[16px] sm:text-[17px] text-[#1E1E1E]">
          {date}
        </span>
      </div>

      {/* Ligne 2 */}
      <div className="mt-2 flex flex-wrap items-center gap-2 text-[16px] sm:text-[17px]">
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

            <span className="text-[#1E1E1E]">
              {item.quantite}
            </span>

            {index !== produits.length - 1 && <span>•</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardListDistribution;
