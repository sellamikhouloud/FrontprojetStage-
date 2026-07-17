import Button from "./Button";

const Popup = ({
  title,
  image,
  id,
  primaryButtonText,
  secondaryButtonText,
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

          w-[357px]
          px-[25px]
          py-[20px]

          lg:w-[561px]
          lg:px-[67px]
          lg:py-[26px]

          flex
          flex-col
          items-center

          gap-[28px]
          lg:gap-[26px]
        "
      >
        {/* Titre */}
        <h2
          className="
            text-[20px]
            lg:text-[28px]
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
  alt="Success"
  className="
    w-[140px]
    h-[84px]

    lg:w-[196px]
    lg:h-[177px]

    object-contain
  "
/>

        {/* Identifiant (optionnel) */}
        {id && (
          <p
            className="
              text-[16px]
              lg:text-[22px]
              font-semibold
              text-center
              text-black
            "
          >
            L'identifiant effectué : {id}
          </p>
        )}

        {/* Boutons */}
    {/* Buttons */}
<div
  className="
    flex
    flex-col
    items-center
    gap-[10px]
    lg:gap-[14px]
    w-full
  "
>
  {/* Primary Button */}
  <button
    type="button"
    onClick={onPrimaryClick}
    className="
      w-[200px]
      lg:w-[284px]

      h-[45px]

      rounded-[15px]

      bg-[#22C55E]
      text-white

      text-[14px]
      lg:text-[16px]
      font-semibold

      transition-all
      duration-200

      hover:brightness-95
      active:scale-[0.98]
    "
  >
    {primaryButtonText}
  </button>

  {/* Secondary Button */}
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
</div>
      </div>
    </div>
  );
};

export default Popup;