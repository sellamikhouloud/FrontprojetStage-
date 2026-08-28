export default function ModifierMesure({
  title = "Mesure nourrisson",

  poids,
  taille,
  muac,

  setPoids,
  setTaille,
  setMuac,

  // "nourrisson" par défaut
  // "mere" pour la mère
  variant = "nourrisson",
}) {
  const isMere = variant === "mere";



  const poidsAffiche =
    poids === "" || poids === null || poids === undefined ? "" : poids;

  const tailleAffiche =
    taille === "" || taille === null || taille === undefined ? "" : taille;

  const muacAffiche =
    muac === "" || muac === null || muac === undefined ? "" : muac;

  // =====================================================
  // MODIFICATION POIDS
  // =====================================================

  const handlePoidsChange = (value) => {
    if (value === "") {
      setPoids?.("");
      return;
    }

    const number = Number(value);

    if (isNaN(number)) return;

    setPoids?.(value);
  };

  // =====================================================
  // MODIFICATION TAILLE
  // =====================================================

  const handleTailleChange = (value) => {
    if (value === "") {
      setTaille?.("");
      return;
    }

    const number = Number(value);

    if (isNaN(number)) return;

    setTaille?.(value);
  };

  // =====================================================
  // MODIFICATION MUAC
  // =====================================================

  const handleMuacChange = (value) => {
    if (value === "") {
      setMuac?.("");
      return;
    }

    const number = Number(value);

    if (isNaN(number)) return;

    setMuac?.(value);
  };

  // =====================================================
  // UNITÉS
  // =====================================================

  const poidsUnit = isMere ? "kg" : "g";
  const tailleUnit = isMere ? "m" : "cm";
  const muacUnit = isMere ? "cm" : "mm";

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
                step="any"
                value={poidsAffiche}
                onChange={(e) =>
                  handlePoidsChange(e.target.value)
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
                {poidsUnit}
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
                step="any"
                value={tailleAffiche}
                onChange={(e) =>
                  handleTailleChange(e.target.value)
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
                {tailleUnit}
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
                step="any"
                value={muacAffiche}
                onChange={(e) =>
                  handleMuacChange(e.target.value)
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
                {muacUnit}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
