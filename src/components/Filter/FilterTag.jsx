import quitter from "../../assets/quitter.svg";

const FilterTag = ({
  text,
  onRemove,
  className = "",
}) => {
  return (
    <div
      className={`
        inline-flex
        items-center
        gap-1.5
        sm:gap-2

        h-[36px]
        sm:h-[40px]
        lg:h-[46px]

        px-4
        sm:px-5
        lg:px-7

        rounded-full

        bg-[#89BFB1]

        text-[#1F1F1F]

        text-[14px]
        sm:text-[16px]
        lg:text-[18px]

        font-normal

        whitespace-nowrap

        ${className}
      `}
    >
      {/* Texte */}
      <span className="truncate max-w-[120px] sm:max-w-none">
        {text}
      </span>

      {/* X */}
      <button
        type="button"
        onClick={onRemove}
        className="
          flex
          items-center
          justify-center

          w-6
          h-6
          sm:w-7
          sm:h-7

          rounded-full

          transition-all
          duration-150

          hover:bg-white/20
          hover:scale-110

          active:scale-90
        "
      >
        <img
          src={quitter}
          alt="Supprimer"
          className="
            w-[12px]
            h-[12px]

            sm:w-[14px]
            sm:h-[14px]

            lg:w-[17px]
            lg:h-[17px]

            transition-transform
            duration-150

            active:rotate-90
          "
        />
      </button>
    </div>
  );
};

export default FilterTag;