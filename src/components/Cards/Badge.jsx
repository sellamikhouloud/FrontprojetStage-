import AlarmClock from "../../assets/Alarm clock.svg";

const StatusBadge = ({
  type = "mere",
  text,
  className = "",
  pill = false, // 👈 nouveau : true = forme pilule (comme le badge Chef)
}) => {
  const styles = {
    mam: { border: "#F59E0B", background: "#FFFFFF", text: "#F59E0B" },
    mas: { border: "#EF4444", background: "#FAC1C1B2", text: "#EF4444" },
    mere: { border: "#22C55E", background: "#FFFFFF", text: "#22C55E" },
    mereActive: { border: "#22C55E", background: "#B5ECC980", text: "#22C55E" },
    sortie: { border: "#969696", background: "#BEBEBE80", text: "#4B5563" },
    risque: { border: "#EF4444", background: "#FFFFFF", text: "#EF4444" },
    mereNormal: { border: "#22C55E", background: "#DDF5E5", text: "#22C55E" },
    retard: { border: "#F59E0B", background: "#F59E0B", text: "#FFFFFF" },

    // ⭐ Chef
    chef: { border: "#D3EDEB", background: "#D3EDEB", text: "#4E9F8A" },
  };

  const current = styles[type] || styles.mere;

  return (
    <div
      className={`
        inline-flex
        items-center
        justify-center
        gap-1 sm:gap-2

        ${pill ? "h-auto min-h-[28px] sm:min-h-[30px] px-3 sm:px-4 rounded-full" : "h-auto min-h-[34px] sm:min-h-[36px] px-3 sm:px-4 rounded-[8px]"}

        border

        text-[13px]
        sm:text-[14px]

        ${pill ? "font-bold" : "font-medium"}

        whitespace-nowrap

        ${className}
      `}
      style={{
        borderColor: current.border,
        backgroundColor: current.background,
        color: current.text,
      }}
    >
      {type === "retard" && (
        <img
          src={AlarmClock}
          alt="Alarm"
          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
        />
      )}

      <span>{text}</span>
    </div>
  );
};

export default StatusBadge;
