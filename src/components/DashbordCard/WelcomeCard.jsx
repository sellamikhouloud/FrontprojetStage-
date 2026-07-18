import NotificationIcon from "../../assets/Notifications.svg";
import SettingsIcon from "../../assets/Settings.svg";

const WelcomeCard = ({
  greeting = "Bonjour",
  userName,
  subtitle,
  notificationCount = 0,
  onNotificationClick,
  onSettingsClick,
}) => {
  return (
    <div
      className="
        w-full
        bg-[#89BFB1]
        rounded-[35px]
        p-[30px]
        flex
        justify-between
        items-start
      "
    >
      {/* Left */}
      <div className="flex flex-col gap-2">
        <h1
          className="
            text-[32px]
            font-bold
            text-white
          "
        >
          {greeting} {userName}
        </h1>

        <p
          className="
            text-[20px]
            text-white          "
        >
          {subtitle}
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <button
          onClick={onNotificationClick}
          className="
            relative
            transition-transform
            duration-200
            hover:scale-105
          "
        >
          <img
            src={NotificationIcon}
            alt="Notifications"
            className="w-[39.6px] h-[39.6px]"
          />

          {notificationCount > 0 && (
            <span
              className="
                absolute
                -top-2
                -right-2
                min-w-[20px]
                h-[20px]
                rounded-full
                bg-red-500
                text-white
                text-[11px]
                font-semibold
                flex
                items-center
                justify-center
                px-1
              "
            >
              {notificationCount}
            </span>
          )}
        </button>

        {/* Settings */}
        <button
          onClick={onSettingsClick}
          className="
            transition-transform
            duration-200
            hover:scale-105
          "
        >
          <img
            src={SettingsIcon}
            alt="Settings"
            className="w-[34.8px] h-[34.8px]"
          />
        </button>
      </div>
    </div>
  );
};

export default WelcomeCard;