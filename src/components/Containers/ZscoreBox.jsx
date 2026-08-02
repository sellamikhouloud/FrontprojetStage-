const ZScoreBox = ({ label, value }) => {
  const zVal = value !== null && value !== undefined ? parseFloat(value) : null;

  let colors;
  if (zVal === null || isNaN(zVal)) {
    colors = { border: "#E5E7EB", background: "#F9FAFB", text: "#6B7280" };
  } else if (zVal < -3 || zVal > 3) {
    colors = { border: "#EF4444", background: "#FAC1C1B2", text: "#EF4444" };
  } else if (zVal < -2 || zVal > 2) {
    colors = { border: "#F59E0B", background: "#FFF7E0", text: "#CC8409" };
  } else {
    colors = { border: "#22C55E", background: "#DCFCE7", text: "#22C55E" };
  }

  return (
    <div
      className="
        flex-1
        min-w-[90px]
        rounded-[12px]
        border
        px-3
        py-2
        flex
        flex-row
        items-center
        justify-center
        gap-2
      "
      style={{
        borderColor: colors.border,
        backgroundColor: colors.background,
      }}
    >
      <span
        className="text-[11px] sm:text-[12px] font-medium"
        style={{ color: colors.text }}
      >
        {label}
      </span>
      <span
        className="text-[16px] sm:text-[18px] font-bold"
        style={{ color: colors.text }}
      >
        {zVal === null || isNaN(zVal) ? "--" : zVal.toFixed(1)}
      </span>
    </div>
  );
};

export default ZScoreBox;