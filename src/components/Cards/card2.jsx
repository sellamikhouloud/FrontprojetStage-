import StatusBadge from "./Badge";

import GenderFemale from "../../assets/gender-female.svg";
import GenderMale from "../../assets/gender-male.svg";

import LocationRed from "../../assets/Location.svg";
import LocationBlue from "../../assets/Location1.svg";

import TimerRed from "../../assets/Timer1.svg";
import TimerBlue from "../../assets/Timer.svg";

const CardPopup = ({
  sexe = "Fille",
  enfant,
  region,
  naissance,
  code,
  badges = [],
  onClick,
}) => {
  const isGirl = sexe === "Fille";

  const mamBadge = badges.find(
    (badge) => badge.type === "mam" || badge.type === "mas"
  );

  const mereBadge = badges.find(
    (badge) => badge.type === "mere"
  );

  const retardBadge = badges.find(
    (badge) => badge.type === "retard"
  );

  return (
    <div
      onClick={onClick}
      className="
        w-full
        rounded-[18px]
        p-5
        transition
        hover:shadow-md
      "
      style={{
        background: isGirl ? "#FFF2F5" : "#ECF8F7",
      }}
    >
      {/* Ligne 1 */}

      <div className="flex items-start justify-between gap-3">
        <h2
          className="
            text-[18px]
            sm:text-[20px]
            font-bold
            text-[#1E1E1E]
          "
        >
          {enfant}
        </h2>

        <span
          className="text-[18px] sm:text-[20px] font-bold whitespace-nowrap"
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
          className="w-4 h-4"
          alt=""
        />

        <span className="text-[16px]">{sexe}</span>
      </div>

      {/* Région + Date */}

      <div className="flex flex-wrap items-center gap-2 mt-2 text-[16px]">
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

      {/* Deux badges */}

      <div className="grid grid-cols-2 gap-2 mt-4">
        {mamBadge && (
          <StatusBadge
            type={mamBadge.type}
            text={mamBadge.text}
            className="justify-center w-full"
          />
        )}

        {mereBadge && (
          <StatusBadge
            type={mereBadge.type}
            text={mereBadge.text}
            className="justify-center w-full"
          />
        )}
      </div>

      {/* Badge retard */}

      {retardBadge && (
        <StatusBadge
          type={retardBadge.type}
          text={retardBadge.text}
          className="justify-center w-full mt-3"
        />
      )}
    </div>
  );
};

export default CardPopup;