export default function ModifierMesure({
  title = "Mesure nourrisson",

  // Mesures classiques
  poids,
  taille,
  muac,
  setPoids,
  setTaille,
  setMuac,
}) {
  return (
    <div className="w-full">

      {/* Titre */}
      <h3 className="text-[18px] font-semibold text-[#202124] mb-2">
        {title}
      </h3>

      {/* Conteneur */}
      <div
        className="
          rounded-[14px]
          border
          border-dashed
          border-[#9CD6D2]
          bg-white
          px-4
          py-2
        "
      >
        <div className="grid grid-cols-3 items-center text-center">

          {/* ================= POIDS ================= */}
          <div>
            <p className="text-[16px] text-[#666666]">
              Poids
            </p>

            <div className="flex justify-center items-center gap-1">
              <input
                type="number"
                value={poids ?? ""}
                onChange={(e) =>
                  setPoids?.(e.target.value)
                }
                className="
                  w-auto
                  max-w-[80px]
                  bg-transparent
                  text-center
                  text-[18px]
                  font-bold
                  text-[#202124]
                  outline-none
                  border-none
                  p-0
                  m-0
                "
              />

              <span className="text-[14px] font-bold">
                g
              </span>
            </div>
          </div>

          {/* ================= TAILLE ================= */}
          <div className="relative">

            {/* Séparateur gauche */}
            <div
              className="
                absolute
                left-0
                top-1/2
                h-10
                -translate-y-1/2
                border-l
                border-[#E5E7EB]
              "
            />

            <p className="text-[16px] text-[#666666]">
              Taille
            </p>

            <div className="flex justify-center items-center gap-1">
              <input
                type="number"
                value={taille ?? ""}
                onChange={(e) =>
                  setTaille?.(e.target.value)
                }
                className="
                  w-auto
                  max-w-[80px]
                  bg-transparent
                  text-center
                  text-[18px]
                  font-bold
                  text-[#202124]
                  outline-none
                  border-none
                  p-0
                  m-0
                "
              />

              <span className="text-[14px] font-bold">
                cm
              </span>
            </div>

            {/* Séparateur droit */}
            <div
              className="
                absolute
                right-0
                top-1/2
                h-10
                -translate-y-1/2
                border-r
                border-[#E5E7EB]
              "
            />
          </div>

          {/* ================= MUAC ================= */}
          <div>
            <p className="text-[16px] text-[#666666]">
              MUAC
            </p>

            <div className="flex justify-center items-center gap-1">
              <input
                type="number"
                value={muac ?? ""}
                onChange={(e) =>
                  setMuac?.(e.target.value)
                }
                className="
                  w-auto
                  max-w-[80px]
                  bg-transparent
                  text-center
                  text-[18px]
                  font-bold
                  text-[#202124]
                  outline-none
                  border-none
                  p-0
                  m-0
                "
              />

              <span className="text-[14px] font-bold">
                mm
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
