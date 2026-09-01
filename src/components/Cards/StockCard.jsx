export default function StockCard({
  nom,
  quantity,
  unite,
  grammage,
  statut,
  showStatusColor = true,
  onClick,
}) {
  const isEnAttente = showStatusColor && statut === "en_attente";

  return (
    <div
      onClick={onClick}
      className={`
        min-w-[90px] md:min-w-[140px]
        h-[90px]
        rounded-xl
        px-[15px]
        py-[20px]
        flex
        flex-col
        items-center
        justify-center
        gap-[10px]
        flex-shrink-0
        ${onClick ? "cursor-pointer" : ""}
      `}
      style={{
        backgroundColor: isEnAttente ? "rgba(250, 207, 133, 0.5)" : "#F8FBFC",
      }}
    >
{/* Nom */}
<p className="text-[18px] font-medium text-black text-center leading-none">
  {nom}

  {grammage !== null &&
    grammage !== undefined &&
    grammage !== "" && (
      <span className="ml-1 text-[12px] text-[#4E9F8A]">
        ({grammage} g)
      </span>
    )}
</p>

      {/* Quantité */}
      <div className="flex items-end gap-1 leading-none">
        <span className="text-[20px] font-extrabold text-[#4FA18F]">
          {quantity}
        </span>

        <span className="text-[14px] font-normal text-black">
          {unite}
        </span>
      </div>
    </div>
  );
}