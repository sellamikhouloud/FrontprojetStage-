const CardPopupDistribution = ({
  enfant,
  code,
  distribution,
  date,
  produits = [],
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="w-full rounded-[18px] p-5 transition hover:shadow-md border border-[#DCE5EC]"
      style={{
        background: "#F8FBFC",
      }}
    >
      {/* Ligne 1 */}
      <div className="flex justify-between items-start">
        <h2 className="text-[18px] font-bold text-[#1E1E1E]">
          {enfant}
        </h2>

        <span
          className="text-[18px] font-bold"
          style={{ color: "#528583" }}
        >
          {code}
        </span>
      </div>

      {/* Ligne 2 */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-[18px] font-semibold text-[#1E1E1E]">
          {distribution}
        </span>

        <span className="text-[18px] text-[#1E1E1E]">
          {date}
        </span>
      </div>

      {/* Produits dynamiques */}
      <div className="mt-4 space-y-2">
        {produits.map((produit, index) => (
          <div
            key={index}
            className="flex items-center"
          >
            <span
              className="text-[16px]"
              style={{ color: "#4E9F8A" }}
            >
              {produit.nom}
            </span>

            <span className="ml-4 text-[18px] text-[#1E1E1E]">
              {produit.quantite}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardPopupDistribution;