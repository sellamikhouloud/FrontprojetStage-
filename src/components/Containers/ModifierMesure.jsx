export default function ModifierMesure({
  title = "Mesure nourrisson",
  poids,
  taille,
  muac,
  setPoids,
  setTaille,
  setMuac,
}) {
  return (
    <div className="w-full">
      <h3 className="text-[18px] font-semibold text-[#202124] mb-2">
        {title}
      </h3>

      <div className="rounded-[14px] border border-dashed border-[#9CD6D2] bg-white px-4 py-3">
        <div className="grid grid-cols-3 items-center text-center">
          {/* Poids */}
          <div>
            <p className="text-[14px] text-[#666666]">Poids</p>

            <div className="flex justify-center items-center gap-1 mt-1">
              <input
                type="number"
                value={poids}
                onChange={(e) => setPoids(e.target.value)}
                className="w-16 bg-transparent text-center text-[20px] font-bold text-[#202124] outline-none border-none"
              />
              <span className="text-[15px] font-bold">g</span>
            </div>
          </div>

          {/* Taille */}
          <div className="relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-10 border-l border-[#D9D9D9]" />

            <p className="text-[14px] text-[#666666]">Taille</p>

            <div className="flex justify-center items-center gap-1 mt-1">
              <input
                type="number"
                value={taille}
                onChange={(e) => setTaille(e.target.value)}
                className="w-16 bg-transparent text-center text-[20px] font-bold text-[#202124] outline-none border-none"
              />
              <span className="text-[15px] font-bold">cm</span>
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-10 border-r border-[#D9D9D9]" />
          </div>

          {/* MUAC */}
          <div>
            <p className="text-[14px] text-[#666666]">MUAC</p>

            <div className="flex justify-center items-center gap-1 mt-1">
              <input
                type="number"
                value={muac}
                onChange={(e) => setMuac(e.target.value)}
                className="w-16 bg-transparent text-center text-[20px] font-bold text-[#202124] outline-none border-none"
              />
              <span className="text-[15px] font-bold">mm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}