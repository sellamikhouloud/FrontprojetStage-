const ZakatInfoRow = ({
  label,
  value,
  valueClassName = "",
}) => {
  return (
    <div
      className="
        flex
        justify-between
        items-center
      "
    >
      <span
        className="
          text-[18px]
          font-medium
          text-[#4E9F8A]
          leading-[28px]
        "
      >
        {label}
      </span>

      <span
        className={`
          text-[18px]
          font-semibold
          leading-[30px]
          text-right
          ${valueClassName}
        `}
      >
        {value}
      </span>
    </div>
  );
};

export default ZakatInfoRow;