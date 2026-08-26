import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { sidebarConfig } from "./sidebarData";
import menuIcon from "../../assets/menu.svg";
import closeIcon from "../../assets/close.svg";
import bellIcon from "../../assets/Bell.svg";
import settingsIcon from "../../assets/SettingsBlack.svg";
import PopupProfilAdmin from "../Popups/PopupProfilAdmin";
import RoleGate from "../auth/RoleGate";
import { useAuth } from "../Providers/AuthProvider";

export default function Sidebar({
  showTopBarIcons = true,
  showTopBarAvatar = true,
  hideOnMobile = false,
}) {
  const navigate = useNavigate();

  const { user, ready } = useAuth();
  const role = user?.role;

  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showProfil, setShowProfil] = useState(false);

  /*
   * chef_coordinator uses the coordinator sidebar configuration.
   *
   * If sidebarConfig contains a specific chef_coordinator config,
   * it will use that one.
   *
   * Otherwise it falls back to the coordinator configuration.
   */
  
  const config =
    sidebarConfig[role] ||
    (role === "chef_coordinator"
      ? sidebarConfig.coordinator
      : sidebarConfig.coordinator);

  const {
    navigation,
    actions,
    logo,
    avatar: defaultAvatar,
  } = config;

  // User avatar if available, otherwise use the default avatar
  const displayedAvatar = user?.profilePicture || defaultAvatar;

  const isAdmin = role === "admin";

  /*
   * Both coordinator and chef_coordinator are coordinator-type users.
   */
  const isCoordinator =
    role === "coordinator" || role === "chef_coordinator";

  const adminData = {
    nom: user?.nom || "Admin",
    id: user?.id ? `id – ${user.id}` : "id – admin",
    role: "Admin",
    avatarUrl: user?.profilePicture,
    email: user?.email,
    telephone: user?.telephone,
    region: user?.region,
  };

  const handleItemClick = () => {
    setMobileOpen(false);
  };

  /*
   * Admin -> ouvre la popup profil.
   * Coordinator / Chef Coordinator -> page profil coordinateur.
   */
  const handleAvatarClick = () => {
    if (isAdmin) {
      setShowProfil(true);
    } else if (isCoordinator) {
      navigate("/profile-coor");
    }
  };

  /*
   * While auth is loading, don't render the sidebar.
   */
  if (!ready) {
    return null;
  }

  return (
    <>
      {/* ================= MOBILE TOP BAR ================= */}
      {!hideOnMobile && (
        <div
          className="
            lg:hidden
            fixed
            top-0
            left-0
            right-0
            h-16
            bg-white
            z-50
            flex
            items-center
            justify-between
            px-4
          "
        >
          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="
              w-11
              h-11
              rounded-[12px]
              flex
              items-center
              justify-center
            "
          >
            <img
              src={menuIcon}
              alt="Menu"
              className="w-10 h-10"
            />
          </button>

          {/* Notification + Paramètres — admin uniquement */}
          {showTopBarIcons && (
            <RoleGate allow={["admin"]}>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  aria-label="Notifications"
                  className="
                    w-9
                    h-9
                    flex
                    items-center
                    justify-center
                    hover:opacity-70
                    transition
                  "
                >
                  <img
                    src={bellIcon}
                    alt="Notifications"
                    className="w-7 h-7"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/parametres")}
                  aria-label="Paramètres"
                  className="
                    w-9
                    h-9
                    flex
                    items-center
                    justify-center
                    hover:opacity-70
                    transition
                  "
                >
                  <img
                    src={settingsIcon}
                    alt="Paramètres"
                    className="w-7 h-7"
                  />
                </button>
              </div>
            </RoleGate>
          )}

          {/* Avatar — coordinator + chef_coordinator */}
          {showTopBarAvatar && (
            <RoleGate
              allow={["coordinator", "chef_coordinator"]}
            >
              <button
                type="button"
                onClick={handleAvatarClick}
                aria-label="Profil"
                className="
                  w-[45px]
                  h-[45px]
                  rounded-full
                  bg-[#8FC9C3]
                  flex
                  items-center
                  justify-center
                  overflow-hidden
                  hover:opacity-80
                  transition
                "
              >
                {displayedAvatar ? (
                  <img
                    src={displayedAvatar}
                    alt="Avatar"
                    className="
                      w-full
                      h-full
                      rounded-full
                      object-cover
                    "
                  />
                ) : (
                  <User
                    className="w-9 h-9 text-[#EAF7F3]"
                    strokeWidth={0}
                    fill="#EAF7F3"
                  />
                )}
              </button>
            </RoleGate>
          )}
        </div>
      )}

      {/* ================= OVERLAY ================= */}
      {!hideOnMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="
            fixed
            inset-0
            bg-black/30
            z-40
            lg:hidden
          "
        />
      )}

      {/* ================= DESKTOP ================= */}

      <aside
        onMouseLeave={() => setExpanded(false)}
        className={`
          hidden
          md:flex
          self-stretch
          mt-4
          mb-4
          ml-6
          bg-[#4E9F8A]
          rounded-[42px]
          pt-4
          pb-4
          flex-col
          transition-all
          duration-300
          overflow-hidden
          ${expanded ? "w-[295px] px-8" : "w-[86px] px-[18px]"}
        `}
      >
        {/* Logo */}

        <div className="flex justify-center flex-shrink-0">
          <img
            src={logo}
            alt="NutriGest"
            className="w-12 h-auto"
          />
        </div>

        {/* Navigation */}

        <div
          className="
            flex-1
            flex
            items-center
            justify-center
            overflow-hidden
          "
        >
          <div className="w-full">
            {expanded && (
              <p className="text-white font-bold mb-6">
                Navigation
              </p>
            )}

            <nav
              className={`
                flex
                flex-col
                gap-7
                ${expanded ? "items-start" : "items-center"}
              `}
            >
              {navigation.map((item, index) => (
                <SidebarItem
                  key={index}
                  item={item}
                  expanded={expanded}
                  onMouseEnter={() => setExpanded(true)}
                />
              ))}

              {actions.length > 0 && expanded && (
                <p className="text-white font-bold">
                  Action rapide
                </p>
              )}

              {actions.map((item, index) => (
                <SidebarItem
                  key={index}
                  item={item}
                  expanded={expanded}
                  onMouseEnter={() => setExpanded(true)}
                />
              ))}
            </nav>
          </div>
        </div>

        {/* Avatar */}

        <div className="flex justify-center flex-shrink-0">
          <button onClick={handleAvatarClick}>
            {displayedAvatar ? (
              <img
                src={displayedAvatar}
                alt="Avatar"
                className="
                  w-10
                  h-10
                  rounded-full
                  object-cover
                "
              />
            ) : (
              <div
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-[#8FC9C3]
                  flex
                  items-center
                  justify-center
                "
              >
                <User
                  className="w-7 h-7 text-[#EAF7F3]"
                  strokeWidth={0}
                  fill="#EAF7F3"
                />
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* ================= MOBILE ================= */}

      {!hideOnMobile && (
        <aside
          className={`
            fixed
            top-0
            left-0
            h-screen
            w-[78%]
            max-w-[320px]
            bg-[#4E9F8A]
            rounded-r-[24px]
            px-5
            py-5
            z-50
            flex
            flex-col
            transition-transform
            duration-300
            lg:hidden
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Top */}

          <div className="flex-shrink-0">
            <button onClick={() => setMobileOpen(false)}>
              <img
                src={closeIcon}
                alt="Close"
                className="w-8 h-8"
              />
            </button>

            <div className="flex justify-center mt-3">
              <img
                src={logo}
                alt="NutriGest"
                className="w-12 h-auto"
              />
            </div>
          </div>

          {/* Navigation */}

          <div
            className="
              flex-1
              flex
              items-center
              justify-center
              min-h-0
            "
          >
            <div className="w-full">
              <p className="text-white font-bold text-[18px] mb-3">
                Navigation
              </p>

              <nav className="flex flex-col gap-3">
                {navigation.map((item, index) => (
                  <div
                    key={index}
                    onClick={handleItemClick}
                  >
                    <SidebarItem
                      item={item}
                      expanded={true}
                    />
                  </div>
                ))}

                {actions.length > 0 && (
                  <>
                    <p className="text-white font-bold text-[18px] mt-4 mb-2">
                      Action rapide
                    </p>

                    <div className="flex flex-col gap-3">
                      {actions.map((item, index) => (
                        <div
                          key={index}
                          onClick={handleItemClick}
                        >
                          <SidebarItem
                            item={item}
                            expanded={true}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </nav>
            </div>
          </div>

          {/* Avatar */}

          <div className="flex justify-center flex-shrink-0 pt-2">
            <button
              onClick={() => {
                setMobileOpen(false);
                handleAvatarClick();
              }}
            >
              {displayedAvatar ? (
                <img
                  src={displayedAvatar}
                  alt="Avatar"
                  className="
                    w-10
                    h-10
                    rounded-full
                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    w-10
                    h-10
                    rounded-full
                    bg-[#8FC9C3]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <User
                    className="w-7 h-7 text-[#EAF7F3]"
                    strokeWidth={0}
                    fill="#EAF7F3"
                  />
                </div>
              )}
            </button>
          </div>
        </aside>
      )}

      {/* ================= POPUP PROFIL ADMIN ================= */}

      <RoleGate allow={["admin"]}>
        <PopupProfilAdmin
          open={showProfil}
          admin={adminData}
          onClose={() => setShowProfil(false)}
        />
      </RoleGate>
    </>
  );
}