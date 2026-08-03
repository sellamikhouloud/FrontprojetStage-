import logo from "../../assets/Logo2.svg";

const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export default function HeaderRapport({
  selectedMonth,
  title = "Rapport Mensuel",
}) {
  const today = new Date();

  const displayedMonth = selectedMonth
    ? `${selectedMonth.monthName} ${selectedMonth.year}`
    : `${MONTHS[today.getMonth()]} ${today.getFullYear()}`;

  return (
 <div className="w-full flex flex-row items-center justify-center gap-24 sm:gap-36 md:gap-56">
      {/* Partie gauche */}
      <div
        className="flex items-center min-w-0"
        style={{ gap: "clamp(6px, 2vw, 12px)" }}
      >
        <img
          src={logo}
          alt="NutriGest"
          className="flex-shrink-0"
          style={{
            width: "clamp(32px, 9vw, 64px)",
            height: "clamp(32px, 9vw, 64px)",
          }}
        />

        <div className="min-w-0">
          <h2
            className="font-semibold leading-tight truncate"
            style={{
              color: "#4E9F8A",
              fontSize: "clamp(14px, 4.5vw, 30px)",
            }}
          >
            NutriGest
          </h2>

          <p
            className="mt-0.5 leading-tight truncate"
            style={{
              color: "#6D7A73",
              fontSize: "clamp(9px, 2.6vw, 16px)",
            }}
          >
            Gestion Humanitaire de Mauritanie
          </p>
        </div>
      </div>

      {/* Partie droite */}
      <div className="flex flex-col items-end flex-shrink-0">
        <h3
          className="font-semibold text-[#202124] leading-tight whitespace-nowrap"
          style={{ fontSize: "clamp(11px, 3.2vw, 22px)" }}
        >
          {title}
        </h3>

        <div
          className="rounded-[15px] whitespace-nowrap"
          style={{
            backgroundColor: "#D3EDEB",
            marginTop: "clamp(4px, 1.5vw, 12px)",
            paddingInline: "clamp(8px, 2.5vw, 24px)",
            paddingBlock: "clamp(3px, 1vw, 8px)",
          }}
        >
          <span
            style={{
              color: "#4E9F8A",
              fontSize: "clamp(10px, 2.8vw, 18px)",
            }}
          >
            {displayedMonth}
          </span>
        </div>
      </div>
    </div>
  );
}