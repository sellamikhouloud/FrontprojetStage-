export default function AfficherMesure({
  title = "Mesure nourrisson",
  poids,
  taille,
  muac,
}) {
  return (
    <div className="w-full">
      <h3 className="text-[18px] font-semibold text-[#202124] mb-2">
        {title}
      </h3>

      <div className="rounded-[14px] border border-[#9CD6D2] bg-white px-4 py-2">
        <div className="grid grid-cols-3 items-center text-center">
          {/* Poids */}
          <div>
            <p className="text-[14px] text-[#666666]">Poids</p>
            <p className="text-[20px] font-bold text-[#202124]">
              {poids} <span className="text-[15px]">g</span>
            </p>
          </div>

          {/* Taille */}
          <div className="relative">
            <div className="absolute left-0 top-1/2 h-10 -translate-y-1/2 border-l border-[#E5E7EB]" />

            <p className="text-[14px] text-[#666666]">Taille</p>
            <p className="text-[20px] font-bold text-[#202124]">
              {taille} <span className="text-[15px]">cm</span>
            </p>

            <div className="absolute right-0 top-1/2 h-10 -translate-y-1/2 border-r border-[#E5E7EB]" />
          </div>

          {/* MUAC */}
          <div>
            <p className="text-[14px] text-[#666666]">MUAC</p>
            <p className="text-[20px] font-bold text-[#202124]">
              {muac} <span className="text-[15px]">mm</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}