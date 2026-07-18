import StatusBadge from "./Badge";

import GenderFemale from "../../assets/gender-female.svg";
import GenderMale from "../../assets/gender-male.svg";

import LocationRed from "../../assets/Location.svg";
import LocationBlue from "../../assets/Location1.svg";

import TimerRed from "../../assets/Timer1.svg";
import TimerBlue from "../../assets/Timer.svg";

const Card = ({
  sexe = "Fille",
  enfant,
  mere,
  region,
  naissance,
  code,
  badges = [],
  onClick,
}) => {
  const isGirl = sexe === "Fille";

  return (
    <div
      onClick={onClick}
      className="
        w-full
        rounded-[18px]
        p-4
        sm:p-5
        cursor-pointer
        transition
        hover:shadow-md
      "
      style={{
        background: isGirl ? "#FFF2F5" : "#ECF8F7",
      }}
    >
      <div className="flex flex-col lg:flex-row lg:justify-between gap-5">
        {/* Partie gauche */}
        <div className="flex flex-col gap-1 flex-1">
          <h2
            className="
              text-[18px]
              sm:text-[20px]
              lg:text-[22px]
              font-bold
              text-[#1E1E1E]
              leading-tight
            "
          >
            {enfant}
          </h2>

          <p
            className="
              text-[16px]
              sm:text-[18px]
              lg:text-[19px]
              font-medium
              text-[#222]
            "
          >
            {mere}
          </p>

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
              sm:gap-3
              mt-2

              text-[13px]
              sm:text-[15px]
              lg:text-[16px]

              text-[#3A3A3A]
            "
          >
            <div className="flex items-center gap-1">
              <img
                src={isGirl ? GenderFemale : GenderMale}
                className="w-4 h-4 sm:w-5 sm:h-5"
                alt=""
              />
              {sexe}
            </div>

            <span>•</span>

            <div className="flex items-center gap-1">
              <img
                src={isGirl ? LocationRed : LocationBlue}
                className="w-4 h-4 sm:w-5 sm:h-5"
                alt=""
              />
              {region}
            </div>

            <span>•</span>

            <div className="flex items-center gap-1">
              <img
                src={isGirl ? TimerRed : TimerBlue}
                className="w-4 h-4 sm:w-5 sm:h-5"
                alt=""
              />
              né : {naissance}
            </div>
          </div>
        </div>

        {/* Partie droite */}
        <div className="flex flex-col lg:items-end gap-4">
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {badges.map((badge, index) => (
              <StatusBadge
                key={index}
                type={badge.type}
                text={badge.text}
              />
            ))}
          </div>

          <span
            className="
              text-[18px]
              sm:text-[20px]
              lg:text-[22px]
              font-bold
            "
            style={{
              color: isGirl ? "#EF4444" : "#528583",
            }}
          >
            {code}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
