import ZakatIcon from "../../assets/Icon (1).svg";
import Decoration from "../../assets/Icon (3).svg";

const CardZakatSummary = ({
  montant = "2,450,000 MRU",
  familles = 32,
}) => {
  return (
    <div
      className="relative w-full max-w-[740px] rounded-[20px] bg-[#57A892] overflow-hidden"
      style={{
        paddingInline: "clamp(20px, 5vw, 36px)",
        paddingBlock: "clamp(16px, 3.5vw, 24px)",
        minHeight: "170px",
      }}
    >
      {/* Décoration */}
      <img
        src={Decoration}
        alt=""
        className="absolute right-0 top-0 h-full opacity-10 object-contain pointer-events-none select-none"
      />

      <div className="relative z-10 flex flex-col justify-between h-full gap-6">
        {/* Titre */}
        <div className="flex items-center gap-3">
          <img
            src={ZakatIcon}
            alt="Zakat"
            className="flex-shrink-0"
            style={{
              width: "clamp(22px, 4.8vw, 28px)",
              height: "clamp(22px, 4.8vw, 28px)",
            }}
          />

          <h2
            className="text-white font-medium leading-tight tracking-[1.6px]"
            style={{
              fontSize: "clamp(16px, 3.5vw, 20px)",
            }}
          >
            Zakat
          </h2>
        </div>

        {/* Informations */}
        <div className="flex flex-wrap justify-between items-end gap-x-8 gap-y-4">
          {/* Montant */}
          <div className="min-w-0">
            <p
              className="text-[#CDE4DE] whitespace-nowrap"
              style={{
                fontSize: "clamp(13px, 3vw, 16px)",
              }}
            >
              Montant total versé
            </p>

            <h3
              className="mt-2 text-white font-bold leading-none whitespace-nowrap"
              style={{
                fontSize: "clamp(22px, 4.8vw, 28px)",
              }}
            >
              {montant}
            </h3>
          </div>

          {/* Familles */}
          <div className="min-w-0">
            <p
              className="text-[#CDE4DE] whitespace-nowrap"
              style={{
                fontSize: "clamp(13px, 3vw, 16px)",
              }}
            >
              Familles bénéficiaires
            </p>

            <div className="flex items-end gap-2 mt-2">
              <span
                className="text-white font-bold leading-none whitespace-nowrap"
                style={{
                  fontSize: "clamp(22px, 4.8vw, 28px)",
                }}
              >
                {familles}
              </span>

              <span
                className="text-[#E5F2EE] leading-none whitespace-nowrap"
                style={{
                  fontSize: "clamp(14px, 3.2vw, 17px)",
                }}
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
