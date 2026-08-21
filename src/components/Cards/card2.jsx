import StatusBadge from "./Badge";

import GenderFemale from "../../assets/gender-female.svg";
import GenderMale from "../../assets/gender-male.svg";

import LocationRed from "../../assets/Location.svg";
import LocationBlue from "../../assets/Location1.svg";

import TimerRed from "../../assets/Timer1.svg";
import TimerBlue from "../../assets/Timer.svg";

const CardPopup = ({
  sexe = "Fille",
  mere,
  enfant,
  region,
  naissance,
  code,
  badges = [],
  onClick,
}) => {
  const isGirl = sexe === "Fille";

  // Badges qui doivent être affichés dans la première partie
  const firstRowBadges = badges.filter(
    (badge) => badge.type !== "retard"
  );

  // Badge retard reste seul sur sa ligne
  const retardBadges = badges.filter(
    (badge) => badge.type === "retard"
  );

  return (
    <div
      onClick={onClick}
      className="
        w-full
        rounded-[18px]
        p-4 sm:p-5
        transition
        hover:shadow-md
      "
      style={{
        background: isGirl ? "#FFF2F5" : "#ECF8F7",
      }}
    >
      {/* Ligne 1 : Mère + Code */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {/* Nom + prénom mère */}
          <h2
            className="
              text-[17px]
              sm:text-[20px]
              font-bold
              text-[#1E1E1E]
              break-words
            "
          >
            {mere}
          </h2>

          {/* Prénom bébé */}
          <p
            className="
              mt-1
              text-[15px]
              sm:text-[17px]
              font-medium
              text-[#222]
              break-words
            "
          >
            {enfant}
          </p>
        </div>

        {/* Code */}
        <span
          className="
            text-[17px]
            sm:text-[20px]
            font-bold
            whitespace-nowrap
            shrink-0
          "
          style={{
            color: isGirl ? "#EF4444" : "#528583",
          }}
        >
          {code}
        </span>
      </div>

      {/* Sexe */}
      <div className="flex items-center gap-2 mt-2">
        <img
          src={isGirl ? GenderFemale : GenderMale}
          className="w-4 h-4 shrink-0"
          alt=""
        />

        <span className="text-[14px] sm:text-[16px]">
          {sexe}
        </span>
      </div>

      {/* Région + Date */}
      <div
        className="
          flex
          flex-wrap
          items-center
          gap-x-2
          gap-y-1
          mt-2
          text-[14px]
          sm:text-[16px]
        "
      >
        <div className="flex items-center gap-1">
          <img
            src={isGirl ? LocationRed : LocationBlue}
            className="w-4 h-4 shrink-0"
            alt=""
          />

          <span className="break-words">
            {region}
          </span>
        </div>

        <span>•</span>

        <div className="flex items-center gap-1">
          <img
            src={isGirl ? TimerRed : TimerBlue}
            className="w-4 h-4 shrink-0"
            alt=""
          />

          <span>
            né : {naissance}
          </span>
        </div>
      </div>

      {/* Tous les badges sauf retard */}
      {firstRowBadges.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
          {firstRowBadges.map((badge, index) => (
            <StatusBadge
              key={index}
              type={badge.type}
              text={badge.text}
              className="justify-center w-full"
            />
          ))}
        </div>
      )}

      {/* Badge retard */}
      {retardBadges.map((badge, index) => (
        <StatusBadge
          key={`retard-${index}`}
          type={badge.type}
          text={badge.text}
          className="justify-center w-full mt-3"
        />
      ))}
    </div>
  );
};

export default CardPopup;
