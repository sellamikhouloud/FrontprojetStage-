import StatusBadge from "./Badge";

import GenderFemale from "../assets/gender-female.svg";
import GenderMale from "../assets/gender-male.svg";

import LocationRed from "../assets/Location.svg";
import LocationBlue from "../assets/Location1.svg";

import TimerRed from "../assets/Timer1.svg";
import TimerBlue from "../assets/Timer.svg";

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
      className="w-full rounded-[18px] p-5 cursor-pointer transition hover:shadow-md"
      style={{
        background: isGirl ? "#FFF2F5" : "#ECF8F7",
      }}
    >
      <div className="flex justify-between gap-4">
        {/* Partie gauche */}
        <div className="flex flex-col gap-1">
          <h2 className="text-[22px] font-bold text-[#1E1E1E] leading-none">
            {enfant}
          </h2>

          <p className="text-[19px] font-medium text-[#222]">{mere}</p>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-[16px] text-[#3A3A3A]">
            <div className="flex items-center gap-1">
              <img
                src={isGirl ? GenderFemale : GenderMale}
                className="w-4 h-4"
                alt=""
              />
              {sexe}
            </div>

            <span>•</span>

            <div className="flex items-center gap-1">
              <img
                src={isGirl ? LocationRed : LocationBlue}
                className="w-4 h-4"
                alt=""
              />
              {region}
            </div>

            <span>•</span>

            <div className="flex items-center gap-1">
              <img
                src={isGirl ? TimerRed : TimerBlue}
                className="w-4 h-4"
                alt=""
              />
              né : {naissance}
            </div>
          </div>
        </div>

        {/* Partie droite */}
        <div className="flex flex-col items-end justify-between">
          <div className="flex flex-wrap justify-end gap-2">
            {badges.map((badge, index) => (
              <StatusBadge
                key={index}
                type={badge.type}
                text={badge.text}
              />
            ))}
          </div>

          <span
            className="font-bold text-[22px] mt-5"
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
