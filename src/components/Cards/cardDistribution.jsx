const CardPopupDistribution = ({
  date,
  produits = [],
  onClick,
}) => {
  const totalProduits = produits.length;

  return (
    <div
      onClick={onClick}
      className="w-full rounded-[18px] p-5 transition hover:shadow-md border border-[#DCE5EC]"
      style={{
        background: "#FFFFFF",
      }}
    >
      {/* Ligne 1 : Total + Date */}
      <div className="flex justify-between items-center">
        <h2 className="text-[16px] sm:text-[18px] md:text-[20px] font-medium text-[#1E1E1E]">
          Totale :{" "}
          <span style={{ color: "#4E9F8A" }}>{totalProduits}</span>{" "}
          produit{totalProduits > 1 ? "s" : ""}
        </h2>

        <span className="text-[14px] sm:text-[15px] md:text-[16px] text-[#6B7280]">
          {date}
        </span>
      </div>

      {/* Produits (badges) */}
      {produits.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {produits.map((produit, index) => (
            <span
              key={index}
              className="px-3 py-1.5 rounded-[10px] border text-[13px] sm:text-[14px] font-medium"
              style={{
                backgroundColor: "#D9F0EF",
                borderColor: "#C4DFD8",
                color: "#4E9F8A",
              }}
            >
              {produit.nom}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardPopupDistribution;
