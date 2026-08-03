import ZakatIcon from "../../assets/Icon (1).svg";
import Decoration from "../../assets/Icon (3).svg";

const CardZakatSummary = ({
  montant = "2,450,000 MRU",
  familles = 32,
}) => {
  return (
    <div
      className="relative w-full max-w-[714px] rounded-[20px] bg-[#57A892] overflow-hidden"
      style={{
        paddingInline: "clamp(16px, 5vw, 32px)",
        paddingBlock: "clamp(12px, 3vw, 20px)",
      }}
    >
      {/* Décoration */}
      <img
        src={Decoration}
        alt=""
        className="absolute right-0 top-0 h-full opacity-10 object-contain pointer-events-none select-none"
      />

      <div className="relative z-10 flex flex-col justify-between gap-4">
        {/* Titre */}
        <div className="flex items-center gap-2">
          <img
            src={ZakatIcon}
            alt="Zakat"
            className="flex-shrink-0"
            style={{
              width: "clamp(18px, 4.5vw, 24px)",
              height: "clamp(18px, 4.5vw, 24px)",
            }}
          />

          <h2
            className="text-white font-normal leading-tight tracking-[1.6px]"
            style={{ fontSize: "clamp(13px, 3.2vw, 16px)" }}
          >
            Zakat
          </h2>
        </div>

        {/* Informations */}
        <div className="flex flex-wrap justify-between items-end gap-x-6 gap-y-3">
          {/* Montant */}
          <div className="min-w-0">
            <p
              className="text-[#CDE4DE] whitespace-nowrap"
              style={{ fontSize: "clamp(11px, 2.8vw, 14px)" }}
            >
              Montant total versé
            </p>

            <h3
              className="mt-[2px] text-white font-bold leading-none whitespace-nowrap"
              style={{ fontSize: "clamp(16px, 4.2vw, 22px)" }}
            >
              {montant}
            </h3>
          </div>

          {/* Familles */}
          <div className="min-w-0">
            <p
              className="text-[#CDE4DE] whitespace-nowrap"
              style={{ fontSize: "clamp(11px, 2.8vw, 14px)" }}
            >
              Familles bénéficiaires
            </p>

            <div className="flex items-end gap-2 mt-[2px]">
              <span
                className="text-white font-bold leading-none whitespace-nowrap"
                style={{ fontSize: "clamp(16px, 4.2vw, 22px)" }}
              >
                {familles}
              </span>

              <span
                className="text-[#E5F2EE] leading-none whitespace-nowrap"
                style={{ fontSize: "clamp(12px, 3vw, 16px)" }}
              >
                Familles
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardZakatSummary;
