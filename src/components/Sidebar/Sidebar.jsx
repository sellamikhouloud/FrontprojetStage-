
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { countDrafts } from "@/lib/offlineDrafts";
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
import userIcon from "../../assets/user.svg";
import { getNotifications } from "@/lib/api/Notifications";

const API_BASE_URL = "http://127.0.0.1:8000"; 


export const resolvePhotoUrl = (photo) => {
  if (!photo) return null;
  if (photo.startsWith("http://") || photo.startsWith("https://")) {
    return photo; 
  }
  return `${API_BASE_URL}${photo}`;
};
const DRAFTS_PATH = "/brouillons-hors-ligne";

function DraftsBadge({ count, expanded, onClick }) {
  if (!count) return null;

  const displayCount = count > 9 ? "9+" : count;

  return (
    <button
      type="button"
      onClick={onClick}
      title="Brouillons hors ligne en attente"
      className={`
        flex items-center
        bg-amber-400
        hover:bg-amber-300
        transition-colors
        rounded-full
        shrink-0
        ${expanded ? "w-full justify-start gap-2 px-3 py-2" : "w-10 h-10 justify-center"}
      `}
    >
      <span
        className="
          flex items-center justify-center
          min-w-[22px] h-[22px]
          px-1
          rounded-full
          bg-white
          text-amber-600
          text-[11px]
          font-bold
          leading-none
        "
      >
        {displayCount}
      </span>

      {expanded && (
        <span className="text-[13px] font-semibold text-white whitespace-nowrap">
          Brouillons hors ligne
        </span>
      )}
    </button>
  );
}

export default function Sidebar({
  showTopBarIcons = true,
  showTopBarAvatar = true,
  hideOnMobile = false,
}) {
  const navigate = useNavigate();

  const { user, ready, updateUser } = useAuth();
  const role = user?.role;

  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showProfil, setShowProfil] = useState(false);

  const [draftCount, setDraftCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

    const isAdmin = role === "admin";

  /*
   * Both coordinator and chef_coordinator are coordinator-type users.
   */
  const isCoordinator =
    role === "coordinator" || role === "chef_coordinator";

  useEffect(() => {
  if (isAdmin) return; // l'admin ne crée jamais de brouillon, inutile de vérifier

  let cancelled = false;

  const refreshDraftCount = () => {
    countDrafts()
      .then((count) => {
        if (!cancelled) setDraftCount(count);
      })
      .catch(() => {
        // IndexedDB unavailable (private mode, etc.) — badge just stays at 0.
      });
  };

  refreshDraftCount();

  window.addEventListener("focus", refreshDraftCount);
  window.addEventListener("nutrigest:drafts-changed", refreshDraftCount);

  return () => {
    cancelled = true;
    window.removeEventListener("focus", refreshDraftCount);
    window.removeEventListener("nutrigest:drafts-changed", refreshDraftCount);
  };
}, [isAdmin]);


  useEffect(() => {
  if (!ready || !user || !isAdmin) return;

  let cancelled = false;

  const refreshNotifications = async () => {
    try {
      const res = await getNotifications();
      const data = res.data;

      const results = data?.results ?? [];

      if (results.length === 0) {
        if (!cancelled) setNotificationCount(0);
        return;
      }

      const storageKey = `notificationsLastSeenId_${user.id}`;
      const lastSeenId = Number(
        localStorage.getItem(storageKey) || 0
      );

      if (lastSeenId === 0) {
        if (!cancelled) {
          setNotificationCount(data?.count ?? results.length);
        }
        return;
      }

      const newNotifications = results.filter(
        (notification) => notification.id > lastSeenId
      );

      if (!cancelled) {
        setNotificationCount(newNotifications.length);
      }
    } catch (error) {
      console.error("Erreur récupération notifications :", error);
    }
  };

  refreshNotifications();

  const interval = setInterval(refreshNotifications, 10000);

  return () => {
    cancelled = true;
    clearInterval(interval);
  };
}, [ready, user, isAdmin]);

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


  const displayedAvatar = resolvePhotoUrl(user?.photo); 

  const adminData = {
    nom: user?.nom ?? "",
    prenom: user?.prenom ?? "",
    username: user?.username,
    id: user?.id ? `id – ${user.id}` : "id – admin",
    role: "Admin",
    avatarUrl: resolvePhotoUrl(user?.photo),
    email: user?.email,
    telephone: user?.telephone,
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
  
  const handleSaveAdmin = async (updatedFields) => {
  try {
    await updateUser(updatedFields);
    return null; // succès, pas d'erreur
  } catch (err) {
    return err.response?.data || { non_field_errors: ["Impossible de mettre à jour le profil."] };
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
            md:hidden
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
                  onClick={() => {
                    const storageKey = `notificationsLastSeenId_${user.id}`;

                    getNotifications()
                      .then((res) => {
                        const results = res.data?.results ?? [];

                        if (results.length > 0) {
                          const latestId = Math.max(
                            ...results.map((notification) => notification.id)
                          );

                          localStorage.setItem(
                            storageKey,
                            latestId.toString()
                          );
                        }

                        setNotificationCount(0);
                        navigate("/notifications");
                      })
                      .catch(() => {
                        setNotificationCount(0);
                        navigate("/notifications");
                      });
                  }}
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
                    <div className="relative">
                      <img
                        src={bellIcon}
                        alt="Notifications"
                        className="w-7 h-7"
                      />

                      {notificationCount > 0 && (
                        <span
                          className="
                            absolute
                            -top-2
                            -right-2
                            min-w-[19px]
                            h-[19px]
                            px-1
                            rounded-full
                            bg-red-500
                            text-white
                            text-[10px]
                            font-bold
                            leading-none
                            flex
                            items-center
                            justify-center
                            whitespace-nowrap
                            border-2
                            border-white
                          "
                        >
                          {notificationCount > 99 ? "99+" : notificationCount}
                        </span>
                      )}
                    </div>
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
                  w-11
                  h-11
                  rounded-full
                  bg-[#9ACDBF]
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
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <img
                    src={userIcon}
                    alt="Avatar par défaut"
                  className="w-8 h-8 translate-y-[2px]"
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
            md:hidden
          "
        />
      )}

      {/* ================= DESKTOP ================= */}

      <aside
        onMouseLeave={() => setExpanded(false)}
        className={`
          sidebar-desktop
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
            
              {!isAdmin && (
               <DraftsBadge
               count={draftCount}
               expanded={expanded}
               onClick={() => navigate(DRAFTS_PATH)}
               />
              )}

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
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#9ACDBF" }}
            >
              <img src={userIcon} alt="Avatar par défaut" className="w-7 h-7 translate-y-[2px]" />
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
            md:hidden
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
              <p className="text-white font-bold text-[21px] mb-10">
                Navigation
              </p>

              <nav className="flex flex-col gap-10">
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
                {!isAdmin && (
                 <DraftsBadge
                  count={draftCount}
                  expanded={true}
                  onClick={() => {
                    setMobileOpen(false);
                    navigate(DRAFTS_PATH);
                  }}
                   />
                   )}
                

                {actions.length > 0 && (
                  <>
                    <p className="text-white font-bold text-[21px] mt-4 mb-2">
                      Action rapide
                    </p>

                    <div className="flex flex-col gap-10">
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
    className="w-10 h-10 rounded-full object-cover"
  />
) : (
  <div
    className="w-10 h-10 rounded-full flex items-center justify-center"
    style={{ backgroundColor: "#9ACDBF" }}
  >
    <img src={userIcon} alt="Avatar par défaut" className="w-7 h-7 translate-y-[2px]" />
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
    onSave={handleSaveAdmin}
  />
</RoleGate>
    </>
  );
}
