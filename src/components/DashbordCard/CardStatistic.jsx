const CardStatistic = ({
  value,
  label,
  Color = "#4E9F8A",
  align = "center",
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-${align} justify-center gap-[16px] flex-1 max-md:gap-[3px] ${className}`}
    >
      <span
        className="
          text-[25px]
          font-bold
          leading-[28px]
          max-md:text-[20px]
          max-md:leading-[20px]
        "
      >
        {value}
      </span>

      <span
        className="
          text-[16px]
          leading-[15px]
          text-center
          max-md:text-[11px]
          max-md:leading-[13px]
        "
        style={{ color: Color }}
      >
        {label}
      </span>
    </div>
  );
};

export default CardStatistic;