const CardStatistic = ({
  value,
  label,
  Color = "#4E9F8A",
  align = "center",
}) => {
  return (
    <div
      className={`flex flex-col items-${align} justify-center gap-[16px] flex-1`}
    >
      <span
        className="text-[32px] font-bold leading-[28px]"
      >
        {value}
      </span>

      <span
        className="
          text-[16px]
          font-medium
          leading-[15px]
          text-center
        "
        style={{ color: Color }}
      >
        {label}
      </span>
    </div>
  );
};

export default CardStatistic;