import SuccessIcon from "../../assets/SuccessIcon.svg";

const SuccessBanner = ({
  text = "Enregistrer avec succès",
}) => {
  return (
    <div
      className="
        w-[234px]
        h-[31px]
        lg:w-[311px]
        lg:h-[54px]

        bg-[#F8FBFC]
        rounded-[12px]

        flex
        items-center
        justify-center
        gap-2

        mx-auto
      "
    >
      <span
        className="
          text-[#22C55E]
          text-[14px]
          lg:text-[18px]
          font-medium
          lg:font-bold
        "
      >
        {text}
      </span>

      <img
        src={SuccessIcon}
        alt="Succès"
        className="
          w-[16px]
          h-[16px]
          lg:w-[24px]
          lg:h-[24px]
          object-contain
        "
      />
    </div>
  );
};

export default SuccessBanner;