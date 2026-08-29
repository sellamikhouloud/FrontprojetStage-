export default function AfficherMesure({
  title = "Mesure nourrisson",
  poids,
  taille,
  muac,
  hemoglobine,
  statutImc,
  hemoglobineStatut,
  variant = "mesures",
  type = "nourrisson",
}) {

  if (variant === "complement") {
    return (
      <div className="w-full">
        <h3 className="text-[18px] font-semibold text-[#202124] mb-2">
          {title}
        </h3>

        <div className="rounded-[14px] border border-[#9CD6D2] bg-white px-4 py-2">
          <div className="grid grid-cols-2 items-center text-center">
            {/* Statut IMC */}
            <div className="relative">
              <p className="text-[14px] sm:text-[16px] text-[#666666]">
                Statut IMC
              </p>

              <p className="text-[16px] sm:text-[18px] font-bold text-[#202124]">
                {statutImc ?? "-"}
              </p>

              <div className="absolute right-0 top-1/2 h-10 -translate-y-1/2 border-r border-[#E5E7EB]" />
            </div>

            {/* Hémoglobine (statut) */}
            <div>
              <p className="text-[14px] sm:text-[16px] text-[#666666]">
                Statut Hémoglobine
              </p>

              <p className="text-[16px] sm:text-[18px] font-bold text-[#202124]">
                {hemoglobineStatut ?? "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isMere = type === "mere";

  // Affichage direct, sans conversion, pour tout le monde (mère et nourrisson)
  const poidsAffiche = poids != null ? Number(poids).toFixed(2) : "-";
  const poidsUnite = isMere ? "kg" : "g";

  const tailleAffiche = taille != null ? Number(taille).toFixed(2) : "-";
  const tailleUnite = isMere ? "m" : "cm";

  const muacAffiche = muac != null ? Number(muac).toFixed(2) : "-";
  const muacUnite = isMere ? "cm" : "mm";

  // Hémoglobine (valeur brute) — uniquement pour la mère
  const hemoglobineAffiche = hemoglobine != null ? Number(hemoglobine).toFixed(2) : "-";
  const hemoglobineUnite = "g/dL";

  return (
    <div className="w-full">
      <h3 className="text-[18px] font-semibold text-[#202124] mb-2">
        {title}
      </h3>

      <div className="rounded-[14px] border border-[#9CD6D2] bg-white px-4 py-2">
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

            <p className="text-[16px] sm:text-[18px] font-bold text-[#202124] whitespace-nowrap">
              {poidsAffiche}{" "}
              <span className="text-[12px] sm:text-[14px]">
                {poidsUnite}
              </span>
            </p>

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

            <p className="text-[16px] sm:text-[18px] font-bold text-[#202124] whitespace-nowrap">
              {tailleAffiche}{" "}
              <span className="text-[12px] sm:text-[14px]">
                {tailleUnite}
              </span>
            </p>

            <div className="hidden sm:block absolute right-0 top-1/2 h-10 -translate-y-1/2 border-r border-[#E5E7EB]" />
          </div>

          {/* ================= MUAC ================= */}
          <div className="relative">
            <p className="text-[14px] sm:text-[16px] text-[#666666]">
              MUAC
            </p>

            <p className="text-[16px] sm:text-[18px] font-bold text-[#202124] whitespace-nowrap">
              {muacAffiche}{" "}
              <span className="text-[12px] sm:text-[14px]">
                {muacUnite}
              </span>
            </p>

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

              <p className="text-[16px] sm:text-[18px] font-bold text-[#202124] whitespace-nowrap">
                {hemoglobineAffiche}{" "}
                <span className="text-[12px] sm:text-[14px]">
                  {hemoglobineUnite}
                </span>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
