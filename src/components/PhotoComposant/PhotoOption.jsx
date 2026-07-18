import ArrowRight from "../assets/arrow-right.svg";

const PhotoOption = ({
    icon,
    title,
    subtitle,
    color,
    background,
    border,
    onClick,
}) => {
  return(
    <button
    onClick = {onClick}
    className="
    w-full
    h-[97px]
    rounded-[20px] 
    border 
    p-5 
    gap-[25px]
    flex 
    items-center 
    justify-between 
    transition-all 
    duration-200 
    hover:shadow-md
    "
    style = {{
        backgroundColor:background,
        borderColor:border,
        borderLeft: `8px solid ${color}`,
    }}
    >
        <div className="flex items-center w-full gap-5">
        <img
            src={icon}
            alt=""
            className="w-[55px] h-[55px]"
        />

        <div className="flex-1 flex flex-col items-start">
            <h3 className="text-[18px] font-semibold">
            {title}
            </h3>
            <p className="text-[14px] text-[#6F7975]">
            {subtitle}
            </p>
        </div>

        <img
            src={ArrowRight}
            alt=""
            className="ml-auto"
        />
        </div>
    </button>
  )
}
export default PhotoOption;