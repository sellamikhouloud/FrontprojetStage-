import ArrowLeft from "../assets/left-arrow.png";
import ArrowRight from "../assets/right-arrow.png";

const Navigation = ({
  onBack,
  onNext,
  backText = "Back",
  nextText = "Suivant",
  showBack = true,
}) => {
  return (
 <div className="w-full py-2">
      <div
        className="
          h-[45px]
          flex
          items-center
          justify-between
        "
      >
        {/* Back */}
        {showBack ? (
          <button
            type="button"
            onClick={onBack}
            className="
              flex
              items-center
              gap-1.5

              text-black
              font-medium

              text-[16px]
              sm:text-[17px]
              lg:text-[18px]

              cursor-pointer

              transition-all
              duration-150
              ease-in-out

              hover:opacity-80

              active:scale-[0.98]
              active:opacity-60
            "
          >
            <img
              src={ArrowLeft}
              alt="Back"
              className="w-[10px] h-[10px]"
            />

            <span>{backText}</span>
          </button>
        ) : (
          <div />
        )}

        {/* Suivant */}
        <button
          type="button"
          onClick={onNext}
          className="
            flex
            items-center
            gap-1.5

            text-black
            font-medium

            text-[16px]
            sm:text-[17px]
            lg:text-[18px]

            cursor-pointer

            transition-all
            duration-150
            ease-in-out

            hover:opacity-80

            active:scale-[0.98]
            active:opacity-60
          "
        >
          <span>{nextText}</span>

          <img
            src={ArrowRight}
            alt="Suivant"
            className="w-[10px] h-[10px]"
          />
        </button>
      </div>
    </div>
  );
};

export default Navigation;