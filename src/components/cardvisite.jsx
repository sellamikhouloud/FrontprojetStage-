import StatusBadge from "./Badge";

const CardPopupvisite = ({
  enfant,
  code,
  visite,
  date,
  poids,
  taille,
  badges = [],
  onClick,
}) => {
  const mamBadge = badges.find(
    (badge) => badge.type === "mam" || badge.type === "mas"
  );

  const mereBadge = badges.find(
    (badge) => badge.type === "mere"
  );

  return (
    <div
      onClick={onClick}
      className="w-full rounded-[18px] p-5 transition hover:shadow-md"
      style={{
        background: "#F8FBFC",
      }}
    >
      {/* Ligne 1 */}
      <div className="flex justify-between items-start">
        <h2 className="text-[16px] sm:text-[18px] md:text-[20px] font-bold text-[#1E1E1E]">
          {enfant}
        </h2>

        <span
          className="text-[15px] sm:text-[16px] md:text-[18px] font-bold"
          style={{
            color: "#528583",
          }}
        >
          {code}
        </span>
      </div>

      {/* Ligne 2 */}
      <div className="flex justify-between items-center mt-3">
        <span className="text-[15px] sm:text-[16px] md:text-[18px] font-semibold text-[#1E1E1E]">
          {visite}
        </span>

        <span className="text-[15px] sm:text-[16px] md:text-[18px] text-[#1E1E1E]">
          {date}
        </span>
      </div>

      {/* Ligne 3 */}
      <div className="flex justify-between items-center mt-3">
        <div>
          <span
            className="text-[13px] sm:text-[14px] md:text-[16px]"
            style={{ color: "#4E9F8A" }}
          >
            Poids (g)
          </span>

          <span className="ml-3 text-[15px] sm:text-[16px] md:text-[18px] text-[#1E1E1E]">
            {poids}
          </span>
        </div>

        <div>
          <span
            className="text-[13px] sm:text-[14px] md:text-[16px]"
            style={{ color: "#4E9F8A" }}
          >
            Taille (cm)
          </span>

          <span className="ml-3 text-[15px] sm:text-[16px] md:text-[18px] text-[#1E1E1E]">
            {taille}
          </span>
        </div>
      </div>

      {/* Badges */}
      <div className="grid grid-cols-2 gap-2 mt-5">
        {mamBadge && (
          <StatusBadge
            type={mamBadge.type}
            text={mamBadge.text}
            className="justify-center w-full"
          />
        )}

        {mereBadge && (
          <StatusBadge
            type={mereBadge.type}
            text={mereBadge.text}
            className="justify-center w-full"
          />
        )}
      </div>
    </div>
  );
};

export default CardPopupvisite;