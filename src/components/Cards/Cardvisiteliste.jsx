import StatusBadge from "./Badge";

const CardVisiteListe = ({
  nom,
  code,
  visite,
  date,
  poids,
  taille,
  badgeBebe,   // { type, text }
  badgeMere,   // { type, text }
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="w-full rounded-[15px] border border-[#E2E8F0] bg-[#F8FBFC] px-[15px] py-[15px] transition hover:shadow-sm cursor-pointer"
    >
      {/* ================= MOBILE ================= */}
      <div className="block md:hidden">
        {/* Ligne 1 : Nom + Date */}
        <div className="flex items-center justify-between gap-2">
          <h2 className="truncate text-[18px] font-bold text-[#111827]">
            {nom}
          </h2>

          <span className="shrink-0 text-[14px] font-semibold text-[#111827]">
            {date}
          </span>
        </div>

        {/* Ligne 2 : Code • Visite */}
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {code && (
            <>
              <span
                className="text-[15px] font-medium"
                style={{ color: "#528583" }}
              >
                {code}
              </span>
              <span className="text-[#94A3B8]">•</span>
            </>
          )}

          <span className="text-[15px] font-semibold text-[#111827]">
            {visite}
          </span>
        </div>

        {/* Ligne 3 : Poids + Taille */}
        <div className="mt-3 flex items-center justify-between">
          <div>
            <span
              className="text-[13px] font-medium"
              style={{ color: "#4E9F8A" }}
            >
              Poids (g)
            </span>
            <span className="ml-2 text-[15px] font-semibold text-[#1E1E1E]">
              {poids}
            </span>
          </div>

          <div>
            <span
              className="text-[13px] font-medium"
              style={{ color: "#4E9F8A" }}
            >
              Taille (cm)
            </span>
            <span className="ml-2 text-[15px] font-semibold text-[#1E1E1E]">
              {taille}
            </span>
          </div>
        </div>

        {/* Badges */}
        {(badgeBebe || badgeMere) && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            {badgeBebe && (
              <StatusBadge
                type={badgeBebe.type}
                text={badgeBebe.text}
                className="justify-center w-full"
              />
            )}

            {badgeMere && (
              <StatusBadge
                type={badgeMere.type}
                text={badgeMere.text}
                className="justify-center w-full"
              />
            )}
          </div>
        )}
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:block">
        {/* Ligne 1 : Nom • Code • Visite ------ Date */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            <h2 className="truncate text-[20px] font-bold text-[#111827]">
              {nom}
            </h2>

            {code && (
              <>
                <span className="text-[#94A3B8]">•</span>
                <span
                  className="text-[17px] font-medium"
                  style={{ color: "#528583" }}
                >
                  {code}
                </span>
              </>
            )}

            <span className="text-[#94A3B8]">•</span>

            <span className="text-[17px] font-semibold text-[#111827]">
              {visite}
            </span>
          </div>

          <span className="shrink-0 text-[17px] font-semibold text-[#111827]">
            {date}
          </span>
        </div>

        {/* Ligne 2 : Poids + Taille + Badges */}
        <div className="mt-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <span
                className="text-[15px] font-medium"
                style={{ color: "#4E9F8A" }}
              >
                Poids (g)
              </span>
              <span className="ml-2 text-[16px] font-semibold text-[#1E1E1E]">
                {poids}
              </span>
            </div>

            <div>
              <span
                className="text-[15px] font-medium"
                style={{ color: "#4E9F8A" }}
              >
                Taille (cm)
              </span>
              <span className="ml-2 text-[16px] font-semibold text-[#1E1E1E]">
                {taille}
              </span>
            </div>
          </div>

          {(badgeBebe || badgeMere) && (
            <div className="flex items-center gap-2">
              {badgeBebe && (
                <StatusBadge type={badgeBebe.type} text={badgeBebe.text} />
              )}

              {badgeMere && (
                <StatusBadge type={badgeMere.type} text={badgeMere.text} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardVisiteListe;