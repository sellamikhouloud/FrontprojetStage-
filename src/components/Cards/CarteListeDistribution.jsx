const CardListDistribution = ({
  nom,
  code,
  distribution,
  date,
  produits = [],
  success = true,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        w-full
        rounded-[15px]
        border
        px-4
        py-3
        cursor-pointer
        transition
        hover:shadow-sm
      `}
      style={{
        background: success ? "#F8FBFC" : "#FFF4F4",
        borderColor: success ? "#DCE8E8" : "#F3D5D5",
      }}
    >
      {/* Ligne 1 */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 text-[15px]">
          <span className="font-bold text-[#1E1E1E]">
            {nom}
          </span>

          <span>•</span>

          <span
            className={
              success
                ? "text-[#5B908E]"
                : "text-[#F06A6A]"
            }
          >
            {code}
          </span>

          <span>•</span>

          <span className="text-[#1E1E1E]">
            {distribution}
          </span>
        </div>

        <span className="font-bold text-[15px] text-[#1E1E1E]">
          {date}
        </span>
      </div>

      {/* Ligne 2 */}
      <div className="mt-2 flex flex-wrap items-center gap-2 text-[15px]">
        {produits.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className={`font-medium ${
                success
                  ? "text-[#4B9B92]"
                  : "text-[#F06A6A]"
              }`}
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