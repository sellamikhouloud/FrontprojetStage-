import icon from "../assets/icon.svg";
import Warning from "../assets/warning.svg";
import Calendar from "../assets/BlackCalendar.svg";

const variants = {
  success: {
    bg: "bg-[#F2FAFA]",
    border: "border-[#4E9F8A]",
    leftBorder: "border-l-[9px] border-l-[#4E9F8A]",
    padding: "pt-[8px] pb-[8px] pl-[14px] pr-[18px]",
    text: "text-[#000000E5]",
    icon: icon,
    iconWithTitle: false,
  },

  info: {
    bg: "bg-[#BED5FC4D]",
    border: "border-[#BED5FC4D]",
    padding: "pt-[16px] pb-[16px] pl-[20px] pr-[20px]",
    text: "text-[#6F7975]",
    icon: null,
    iconWithTitle: false,
  },

  warning: {
    bg: "bg-[#FFFBEB]",
    border: "border-[#FDE68A]",
    padding: "pt-[14px] pb-[14px] pl-[18px] pr-[18px]",
    text: "text-[#CC8409]",
    icon: Warning,
    iconWithTitle: true,
  },
};

const AlertBox = ({
  variant = "info",
  title,
  titleColor = "text-black",
  date,
  message,
  children,
}) => {
  const style = variants[variant];

  return (
    <div
      className={`
        w-full
        rounded-[25px]
        border

        ${style.padding}
        ${style.bg}
        ${style.border}
        ${style.leftBorder || ""}
      `}
    >
      {/* SUCCESS */}
      {variant === "success" ? (
        <div className="flex items-center gap-3">
          <img
            src={style.icon}
            alt=""
            className="w-5 h-5 shrink-0"
          />

          <div
            className={`
              flex-1
              text-[14px]
              leading-[22px]
              ${style.text}
            `}
          >
            {children || message}
          </div>
        </div>
      ) : (
        <>
          {/* WARNING TITLE */}
          {title && style.iconWithTitle && (
            <div className="flex items-center gap-3 mb-3">
              {style.icon && (
                <img
                  src={style.icon}
                  alt=""
                  className="w-5 h-5 shrink-0"
                />
              )}

              <h3
                className={`
                  font-bold
                  ${titleColor}
                `}
              >
                {title}
              </h3>
            </div>
          )}

          {/* INFO TITLE */}
          {title && !style.iconWithTitle && (
            <>
              <h3
                className={`
                  font-bold
                  ${titleColor}
                `}
              >
                {title}
              </h3>

              {variant === "info" && date && (
                <div className="flex items-center gap-2 mt-2 mb-3">
                  <img
                    src={Calendar}
                    alt=""
                    className="w-4 h-4"
                  />

                  <span className="text-[13px] font-medium text-black">
                    {date}
                  </span>
                </div>
              )}
            </>
          )}

          {/* CONTENT */}
          {!title && style.icon ? (
            <div className="flex items-start gap-3">
              <img
                src={style.icon}
                alt=""
                className="w-5 h-5 shrink-0 mt-1"
              />

              <div
                className={`
                  flex-1
                  text-[14px]
                  leading-[22px]
                  ${style.text}
                `}
              >
                {children || message}
              </div>
            </div>
          ) : (
            <div
              className={`
                text-[14px]
                leading-6
                ${style.text}
              `}
            >
              {children || message}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AlertBox;