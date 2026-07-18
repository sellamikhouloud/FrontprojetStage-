import quitter from "../../assets/quitter.svg";
import UpRight from "../../assets/Up Right.svg";

const PageHeader = ({
  leftTitle,
  rightTitle,
  showRight = true,
  onBack,
  onRightClick,
}) => {
  return (
    <div
      className="
        w-full
        flex
        items-center
        justify-between
        gap-4
        py-3
      "
    >
      {/* Partie gauche */}
      <div className="flex items-center gap-2 min-w-0">
        <img
          src={quitter}
          alt="Retour"
          onClick={onBack}
          className="
            w-4 h-4
            sm:w-5 sm:h-5
            cursor-pointer
            hover:opacity-80
            transition
            shrink-0
          "
        />

        <span
          className="
            text-[14px]
            sm:text-[16px]
            md:text-[18px]
            font-semibold
            text-[#202124]
            truncate
          "
        >
          {leftTitle}
        </span>
      </div>

      {/* Partie droite */}
      {showRight && (
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="
              text-[14px]
              sm:text-[16px]
              md:text-[18px]
              font-bold
              text-[#202124]
              truncate
            "
          >
            {rightTitle}
          </span>

          <img
            src={UpRight}
            alt="Voir"
            onClick={onRightClick}
            className="
              w-3 h-3
              sm:w-4 sm:h-4
              cursor-pointer
              hover:opacity-80
              transition
              shrink-0
            "
          />
        </div>
      )}
    </div>
  );
};

export default PageHeader;