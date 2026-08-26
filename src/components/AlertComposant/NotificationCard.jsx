import arrow from "../../assets/right-arrow.png";
import retardIcon from "../../assets/retard.svg";
import retard2Icon from "../../assets/retard2.svg";
import attentionIcon from "../../assets/Attention.svg";

const TYPE_CONFIG = {
  validation_rapport: {
    bgColor: "#ECF8F7",
    borderColor: "#7BC8C4",
    icon: retard2Icon,
  },

  verification_taux_change: {
    title: "Vérifier le taux de change",
    bgColor: "#FACF8533",
    borderColor: "#F59E0B",
    icon: retardIcon,
  },

  visite_retard: {
    title: "Visite en retard",
    bgColor: "#FACF8533",
    borderColor: "#F59E0B",
    icon: retardIcon,
  },

  stock_faible: {
    title: "Stock faible",
    bgColor: "#EF44441A",
    borderColor: "#C73939",
    icon: attentionIcon,
  },

  malnutrition: {
    title: "Malnutrition Aiguë Sévère",
    bgColor: "#FFF2F5",
    borderColor: "#EF4444",
    icon: attentionIcon,
  },
};

const DEFAULT_CONFIG = {
  title: "Notification",
  bgColor: "#F3F4F6",
  borderColor: "#9CA3AF",
  icon: retardIcon,
};

const getRapportTitle = (message = "") => {
  const msg = message.toLowerCase();

  if (
    msg.includes("bilan des donateurs") ||
    msg.includes("bilan donateurs")
  ) {
    return "Bilan donateurs à compléter et valider";
  }

  if (msg.includes("rapport annuel")) {
    return "Rapport annuel à valider";
  }

  if (msg.includes("rapport mensuel")) {
    return "Rapport mensuel à valider";
  }

  return "Rapport à valider";
};

const NotificationCard = ({
  type,
  message,
  onClick,
  showArrow = true,
}) => {
  const config = TYPE_CONFIG[type] || DEFAULT_CONFIG;

  const title =
    type === "validation_rapport"
      ? getRapportTitle(message)
      : config.title || DEFAULT_CONFIG.title;

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        relative
        w-full
        min-h-[78px]
        rounded-[16px]
        border
        overflow-hidden
        flex
        items-center
        justify-between
        gap-3
        sm:gap-4
        px-4
        py-3
        sm:px-5
        sm:py-3.5
        transition-all
        duration-200
        hover:shadow-md
        hover:scale-[1.005]
        cursor-pointer
        text-left
      "
      style={{
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
      }}
    >
      {/* Barre gauche */}
      <div
        className="
          absolute
          left-0
          top-0
          h-full
          w-[5px]
        "
        style={{
          backgroundColor: config.borderColor,
        }}
      />

      {/* Icône */}
      <div
        className="
          w-[38px]
          h-[38px]
          sm:w-[44px]
          sm:h-[44px]
          rounded-full
          flex
          items-center
          justify-center
          flex-shrink-0
        "
        style={{
          backgroundColor: `${config.borderColor}20`,
        }}
      >
        <img
          src={config.icon}
          alt=""
          className="
            w-[15px]
            h-[15px]
            sm:w-[17px]
            sm:h-[17px]
          "
        />
      </div>

      {/* Texte */}
      <div
        className="
          flex-1
          min-w-0
          flex
          flex-col
          items-start
          gap-1
        "
      >
        {/* Titre */}
        <h3
          className="
            w-full
            text-[14px]
            sm:text-[17px]
            md:text-[18px]
            font-semibold
            leading-5
            sm:leading-6
            text-[#202124]
            break-words
            line-clamp-2
          "
        >
          {title}
        </h3>

        {/* Message */}
        <p
          className="
            w-full
            text-[13px]
            sm:text-[14px]
            md:text-[15px]
            font-medium
            leading-5
            sm:leading-[22px]
            text-[#5E6064]
            line-clamp-2
            break-words
          "
        >
          {message}
        </p>
      </div>

      {/* Flèche */}
      {showArrow && (
        <div
          className="
            flex
            items-center
            flex-shrink-0
            pr-1
          "
        >
          <img
            src={arrow}
            alt=""
            className="
              w-4
              h-4
              opacity-60
            "
          />
        </div>
      )}
    </button>
  );
};

export default NotificationCard;