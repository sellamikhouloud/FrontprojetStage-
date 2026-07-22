export default function StockCard({ nom, quantity, unite }) {
  return (
    <div
      className="
        min-w-[90px] md:min-w-[140px]
        h-[90px]
        bg-[#F8FBFC]
        rounded-xl
        px-[15px]
        py-[20px]
        flex
        flex-col
        items-center
        justify-center
        gap-[10px]
        flex-shrink-0
      "
    >
      {/* Nom */}
      <p className="text-[18px] font-medium text-black text-center leading-none">
        {nom}
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
