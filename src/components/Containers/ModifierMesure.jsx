export default function ModifierMesure({
  title = "Mesure nourrisson",

  poids,
  taille,
  muac,
  hemoglobine,

  setPoids,
  setTaille,
  setMuac,
  setHemoglobine,

  variant = "nourrisson",
}) {
  const isMere = variant === "mere";

  const poidsAffiche =
    poids === "" || poids === null || poids === undefined ? "" : poids;

  const tailleAffiche =
    taille === "" || taille === null || taille === undefined ? "" : taille;

  const muacAffiche =
    muac === "" || muac === null || muac === undefined ? "" : muac;

  const hemoglobineAffiche =
    hemoglobine === "" ||
    hemoglobine === null ||
    hemoglobine === undefined
      ? ""
      : hemoglobine;

  const handlePoidsChange = (value) => {
    if (value === "") {
      setPoids?.("");
      return;
    }

    const number = Number(value);
    if (isNaN(number)) return;

    setPoids?.(value);
  };

  const handleTailleChange = (value) => {
    if (value === "") {
      setTaille?.("");
      return;
    }

    const number = Number(value);
    if (isNaN(number)) return;

    setTaille?.(value);
  };

  const handleMuacChange = (value) => {
    if (value === "") {
      setMuac?.("");
      return;
    }

    const number = Number(value);
    if (isNaN(number)) return;

    setMuac?.(value);
  };

  const handleHemoglobineChange = (value) => {
    if (value === "") {
      setHemoglobine?.("");
      return;
    }

    const number = Number(value);
    if (isNaN(number)) return;

    setHemoglobine?.(value);
  };

  const poidsUnit = isMere ? "kg" : "g";
  const tailleUnit = isMere ? "m" : "cm";
  const muacUnit = isMere ? "cm" : "mm";
  const hemoglobineUnit = "g/dL";

  // Classe commune pour tous les inputs
  const inputClass = `
    w-auto
    max-w-[55px]
    sm:max-w-[80px]
    bg-transparent
    text-center
    text-[16px]
    sm:text-[18px]
    font-bold
    text-[#202124]
    outline-none
    border-none
    p-0
    m-0
    [appearance:textfield]
    [&::-webkit-inner-spin-button]:appearance-none
    [&::-webkit-outer-spin-button]:appearance-none
  `;

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
        <div
          className={`
            grid
            ${isMere ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}
            items-center
            text-center
            gap-y-4
            sm:gap-y-0
          `}
        >

          {/* ================= POIDS ================= */}
          <div className="relative">
            <p className="text-[14px] sm:text-[16px] text-[#666666]">
              Poids
            </p>

            <div className="flex justify-center items-baseline gap-0">
              <input
                type="number"
                step="any"
                value={poidsAffiche}
                onChange={(e) => handlePoidsChange(e.target.value)}
                className={inputClass}
              />

              <span className="text-[12px] sm:text-[14px] font-bold whitespace-nowrap">
                {poidsUnit}
              </span>
            </div>

            {isMere && (
              <div className="hidden sm:block absolute right-0 top-1/2 h-10 -translate-y-1/2 border-r border-[#E5E7EB]" />
            )}
          </div>

          {/* ================= TAILLE ================= */}
          <div className="relative">

            {!isMere && (
              <div className="absolute left-0 top-1/2 h-10 -translate-y-1/2 border-l border-[#E5E7EB]" />
            )}

            {isMere && (
              <div className="hidden sm:block absolute left-0 top-1/2 h-10 -translate-y-1/2 border-l border-[#E5E7EB]" />
            )}

            <p className="text-[14px] sm:text-[16px] text-[#666666]">
              Taille
            </p>

            <div className="flex justify-center items-baseline gap-0">
              <input
                type="number"
                step="any"
                value={tailleAffiche}
                onChange={(e) => handleTailleChange(e.target.value)}
                className={inputClass}
              />

              <span className="text-[12px] sm:text-[14px] font-bold whitespace-nowrap">
                {tailleUnit}
              </span>
            </div>

            <div className="hidden sm:block absolute right-0 top-1/2 h-10 -translate-y-1/2 border-r border-[#E5E7EB]" />
          </div>

          {/* ================= MUAC ================= */}
          <div className="relative">
            <p className="text-[14px] sm:text-[16px] text-[#666666]">
              MUAC
            </p>

            <div className="flex justify-center items-baseline gap-0">
              <input
                type="number"
                step="any"
                value={muacAffiche}
                onChange={(e) => handleMuacChange(e.target.value)}
                className={inputClass}
              />

              <span className="text-[12px] sm:text-[14px] font-bold whitespace-nowrap">
                {muacUnit}
              </span>
            </div>

            {isMere && (
              <div className="hidden sm:block absolute right-0 top-1/2 h-10 -translate-y-1/2 border-r border-[#E5E7EB]" />
            )}
          </div>

          {/* ================= HÉMOGLOBINE (mère uniquement) ================= */}
          {isMere && (
            <div>
              <p className="text-[14px] sm:text-[16px] text-[#666666]">
                Hémoglobine
              </p>

              <div className="flex justify-center items-baseline gap-0">
                <input
                  type="number"
                  step="any"
                  value={hemoglobineAffiche}
                  onChange={(e) =>
                    handleHemoglobineChange(e.target.value)
                  }
                  className={inputClass}
                />

                <span className="text-[12px] sm:text-[14px] font-bold whitespace-nowrap">
                  {hemoglobineUnit}
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
