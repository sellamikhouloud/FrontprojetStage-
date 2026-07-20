const Popup = ({
  title,
  image,
  id,
  description,
  primaryButtonText,
  secondaryButtonText,
  primaryButtonVariant = "success", // default success 
  onPrimaryClick,
  onSecondaryClick,
}) => {
  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/30
      "
    >
      <div
        className="
          bg-white
          rounded-[20px]

          w-[320px]
          lg:w-[460px]

          px-6
          lg:px-8

          py-6

          flex
          flex-col
          items-center

          gap-5
        "
      >
        {/* Titre */}
        <h2
          className="
            text-[18px]
            lg:text-[20px]
            font-bold
            text-center
            text-black
          "
        >
          {title}
        </h2>

        {/* Illustration */}
        <img
          src={image}
          alt=""
          className="
            w-[120px]
            h-[74px]

            lg:w-[176px]
            lg:h-[157px]

            object-contain
          "
        />

        {/* Description */}
        {description && (
          <p
            className="
              text-[14px]
              lg:text-[16px]
              text-center
              text-[#6B7280]
              leading-6
            "
          >
            {description}
          </p>
        )}

        {/* Identifiant */}
        {id && (
          <p
            className="
              text-[14px]
              lg:text-[18px]
              text-center
              text-black
            "
          >
            <span className="font-semibold">
              L'identifiant effectué :
            </span>{" "}
            <span className="font-bold">
              {id}
            </span>
          </p>
        )}

        {/* Buttons */}
        <div
          className="
            flex
            flex-col
            items-center
            gap-[8px]
            lg:gap-[12px]
            w-full
          "
        >
          {/* Primary */}
          <button
            type="button"
            onClick={onPrimaryClick}
            className={`
              w-[200px]
              lg:w-[284px]

              h-[45px]

              rounded-[15px]

              ${
                primaryButtonVariant === "danger"
                  ? "bg-[#EF4444]"
                  : "bg-[#22C55E]"
              }

              text-white

              text-[14px]
              lg:text-[16px]
              font-semibold

              transition-all
              duration-200

              hover:brightness-95
              active:scale-[0.98]
            `}
          >
            {primaryButtonText}
          </button>

          {/* Secondary */}
          {/* Secondary */}
{secondaryButtonText && (
  <button
    type="button"
    onClick={onSecondaryClick}
    className="
      w-[200px]
      lg:w-[284px]

      h-[45px]

      rounded-[15px]

      border
      border-[#4E9F8A]

      bg-white
      text-[#4E9F8A]

      text-[14px]
      lg:text-[16px]
      font-semibold

      transition-all
      duration-200

      hover:bg-[#F8FCFB]
      active:scale-[0.98]
    "
  >
    {secondaryButtonText}
  </button>
)}
        </div>
      </div>
    </div>
  );
};

export default Popup;