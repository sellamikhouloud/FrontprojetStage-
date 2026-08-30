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
            text-white
          "
        >
          {subtitle}
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <button
          type="button"
          onClick={onNotificationClick}
          className="
            relative
            flex
            items-center
            justify-center
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

          {/* Notification badge */}
          {notificationCount > 0 && (
            <span
              className="
                absolute
                -top-2
                -right-1
                min-w-[20px]
                h-[20px]
                px-1
                rounded-full
                bg-red-500
                text-white
                text-[11px]
                font-bold
                leading-none
                flex
                items-center
                justify-center
                whitespace-nowrap
                border-2
                border-[#89BFB1]
              "
            >
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}
        </button>

        {/* Settings */}
        <button
          type="button"
          onClick={onSettingsClick}
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
