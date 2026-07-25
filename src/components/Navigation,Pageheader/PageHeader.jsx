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
        flex
        flex-col
        gap-3
        lg:flex-row
        lg:justify-between
        lg:items-center
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
        <div
          onClick={onRightClick}
          className="
            flex
            items-center
            gap-2
            min-w-0
            cursor-pointer
            hover:opacity-80
            transition
          "
        >
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
            className="
              w-3 h-3
              sm:w-4 sm:h-4
              shrink-0
            "
          />
        </div>
      )}
    </div>
  );
};

export default PageHeader;