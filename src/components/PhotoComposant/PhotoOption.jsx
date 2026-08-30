import ArrowRight from "../../assets/arrow-right.svg";

const PhotoOption = ({
  icon,
  title,
  subtitle,
  color,
  background,
  border,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="
        w-full
        h-[60px]
        rounded-[16px]
        border
        px-4
        py-3
        gap-[16px]
        flex
        items-center
        justify-between
        transition-all
        duration-200
        hover:shadow-md
      "
      style={{
        backgroundColor: background,
        borderColor: border,
        borderLeft: `6px solid ${color}`,
      }}
    >
      <div className="flex items-center w-full gap-4">
        <img
          src={icon}
          alt=""
          className="w-[42px] h-[42px]"
        />

        <div className="flex-1 flex flex-col items-start">
          <h3 className="text-[16px] font-semibold">
            {title}
          </h3>

          <p className="text-[12px] text-[#6F7975]">
            {subtitle}
          </p>
        </div>

        <img
          src={ArrowRight}
          alt=""
          className="w-4 h-4 ml-auto"
        />
      </div>
    </button>
  );
};

export default PhotoOption;
