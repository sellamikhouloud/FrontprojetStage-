import Modify from "../../assets/Edit 1.svg";

const CoordinatorWelcomeCard = ({
  greeting = "Bonjour",
  userName,
  message = "Bonne journée !",
  onModifyClick,
}) => {
  return (
    <div
      className="
        w-full
        bg-[#F8FBFC]
        rounded-[20px]
        px-[22px]
        py-[18px]
        flex
        items-center
        justify-between
      "
    >
      {/* Greeting */}
      <h2
        className="
          text-[22px]
          font-medium
        "
      >
        {greeting} {userName}. {message}
      </h2>

      {/* Modify */}
      <button
        onClick={onModifyClick}
        className="
          flex
          items-center
          justify-center
          transition-transform
          duration-200
          hover:scale-105
        "
      >
        <img
          src={Modify}
          alt="Modifier"
          className="w-6 h-6"
        />
      </button>
    </div>
  );
};

export default CoordinatorWelcomeCard;