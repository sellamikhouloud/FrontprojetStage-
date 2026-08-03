const StatusCard = ({ value, label, type }) => {
  const styles = {
    active: {
      color: "#22C55E",
      border: "#22C55E",
    },
    alert: {
      color: "#F59E0B",
      border: "#F59E0B",
    },
    sortie: {
      color: "#6D6D6D",
      border: "#6D6D6D",
    },
  };

  const current = styles[type];

  return (
    <div
      className="
        flex
        flex-1
        items-center
        justify-center
        rounded-2xl
        border
        bg-white
        overflow-hidden
      "
      style={{
        borderColor: current.border,
        minWidth: "80px",
        maxWidth: "300px",
        height: "clamp(40px, 12vw, 56px)",
        paddingInline: "clamp(6px, 2vw, 16px)",
        gap: "clamp(2px, 1vw, 6px)",
      }}
    >
      <span
        className="font-bold leading-none whitespace-nowrap"
        style={{
          color: current.color,
          fontSize: "clamp(14px, 5vw, 28px)",
        }}
      >
        {value}
      </span>

      <span
        className="font-medium leading-none whitespace-nowrap"
        style={{
          color: current.color,
          fontSize: "clamp(9px, 3vw, 16px)",
        }}
      >
        {label}
      </span>
    </div>
  );
};

export default StatusCard;