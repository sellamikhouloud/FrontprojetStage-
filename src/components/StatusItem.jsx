const StatusItem = ({
  value,
  label,
  color,
  borderColor
}) => {
  return (
    <div
      className="
        flex
        flex-1
        items-center
        justify-center
        gap-[1px]
        border-[1.5px]
        rounded-[20px]
        px-[10px]
        pb-[15px]
      "
      style={{borderColor : borderColor}}
    >

      {/* Text */}
      <div className="flex flex-col justify-center items-center">
        <span
          className="
            text-[38px]
            font-semibold
          "
          style={{color : color}}
        >
          {value}
        </span>

        <span
          className="
            text-[18px]
            font-semibold
            leading-[16px]
          "
          style={{color : color}}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

export default StatusItem;