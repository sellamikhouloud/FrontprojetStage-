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

export default function Sidebar({
  role = "coordinator",
  user = {},
  showTopBarIcons = true,       // notif + paramètres (admin uniquement)
  showTopBarAvatar = true,      // cercle avatar (coordinateur uniquement)
  hideOnMobile = false,         // masque la sidebar mobile (top bar + drawer) sur certaines pages
}) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showProfil, setShowProfil] = useState(false);

  // Fallback to coordinator if role doesn't exist
  const config = sidebarConfig[role] || sidebarConfig.coordinator;

  const {
    navigation,
    actions,
    logo,
    avatar: defaultAvatar,
  } = config;

  // User avatar if available, otherwise use the default avatar
  const displayedAvatar = user.profilePicture || defaultAvatar;

  const isAdmin = role === "admin";
  const isCoordinator = role === "coordinator";

  const adminData = {
    nom: user.nom || "Admin",
    id: user.id ? `id – ${user.id}` : "id – admin",
    role: "Admin",
    avatarUrl: user.profilePicture,
    email: user.email,
    telephone: user.telephone,
    region: user.region,
  };

  const handleItemClick = () => {
    setMobileOpen(false);
  };

  // Admin -> ouvre la popup profil. Coordinateur -> navigue vers la page profil dédiée.
  const handleAvatarClick = () => {
    if (isAdmin) {
      setShowProfil(true);
    } else {
      navigate("/profile-coor");
    }
  };

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
            <img src={menuIcon} alt="Menu" className="w-10 h-10" />
          </button>

          {/* Notification + Paramètres — admin uniquement */}
          {isAdmin && showTopBarIcons && (
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
                <img src={bellIcon} alt="Notifications" className="w-7 h-7" />
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
                <img src={settingsIcon} alt="Paramètres" className="w-7 h-7" />
              </button>
            </div>
          )}

          {/* Avatar cercle — coordinateur uniquement */}
          {isCoordinator && showTopBarAvatar && (
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
              <User
                className="w-9 h-9 text-[#EAF7F3]"
                strokeWidth={0}
                fill="#EAF7F3"
              />
            </button>
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
      {/* mt / mb / ml ajoutent l'espace blanc autour de la sidebar (haut, bas, gauche) sur toutes les pages */}

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
            </button>
          </div>
        </aside>
      )}

      {/* ================= POPUP PROFIL ADMIN (uniquement pour les admins) ================= */}

      {isAdmin && (
        <PopupProfilAdmin
          open={showProfil}
          admin={adminData}
          onClose={() => setShowProfil(false)}
        />
      )}
    </>
  );
}
