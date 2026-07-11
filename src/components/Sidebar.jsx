import { useState } from "react";
import SidebarItem from "./SidebarItem";
import { sidebarConfig } from "./sidebarData";
import menuIcon from "../assets/menu.svg"; // hamburger icon
import closeIcon from "../assets/close.svg"; // X icon

export default function Sidebar({ role = "coordinator" }) {
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { navigation, actions, logo, avatar } = sidebarConfig[role];

  const showLabels = expanded || mobileOpen;

  const handleItemClick = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* ================= MOBILE BUTTON ================= */}

      <button
        onClick={() => setMobileOpen(true)}
        className="
          lg:hidden
          fixed
          top-4
          left-4
          z-50
          p-3
        "
      >
        <img src={menuIcon} alt="Menu" className="w-10 h-10" />
      </button>

      {/* ================= OVERLAY ================= */}

      {mobileOpen && (
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
    h-[944px]
    bg-[#4E9F8A]
    rounded-[42px]
    pt-8
    pb-6
    flex-col
    transition-all
    duration-300
    overflow-hidden
    ${expanded ? "w-[295px] px-8" : "w-[86px] px-[18px]"}
  `}
>
  {/* Logo */}
  <div className="flex justify-center">
    <img
      src={logo}
      alt="NutriGest"
      className="w-12 h-auto"
    />
  </div>

  {/* Navigation centered */}
  <div className="flex-1 flex items-center">
    <div className="w-full">
      {expanded && (
        <p className="text-white font-bold mb-8">
          Navigation
        </p>
      )}

      <nav
        className={`flex flex-col gap-8 ${
          expanded ? "items-start" : "items-center"
        }`}
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
          <p className="text-white font-bold mt-5">
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
  <div className="flex justify-center">
    <button>
      <img
        src={avatar}
        alt="Avatar"
        className="w-10 h-10 rounded-full"
      />
    </button>
  </div>
</aside>

      {/* ================= MOBILE ================= */}

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
          px-6
          py-8
          z-50
          transition-transform
          duration-300
          lg:hidden

          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Close */}

        <button
          onClick={() => setMobileOpen(false)}
          className="mb-10"
        >
          <img
            src={closeIcon}
            alt="Close"
            className="w-10 h-10"
          />
        </button>

        {/* Logo */}

        <div className="flex justify-center mb-10">
          <img src={logo} alt="NutriGest" className="w-14" />
        </div>

        {/* Navigation */}

        <p className="text-white font-bold text-xl mb-6">
          Navigation
        </p>

        <nav className="flex flex-col gap-6">
          {navigation.map((item, index) => (
            <div key={index} onClick={handleItemClick}>
              <SidebarItem
                item={item}
                expanded={true}
              />
            </div>
          ))}

          {actions.length > 0 && (
            <>
              <p className="text-white font-bold text-xl mt-4">
                Action rapide
              </p>

              {actions.map((item, index) => (
                <div key={index} onClick={handleItemClick}>
                  <SidebarItem
                    item={item}
                    expanded={true}
                  />
                </div>
              ))}
            </>
          )}
        </nav>

        {/* Avatar */}

        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <button>
            <img
              src={avatar}
              alt="Avatar"
              className="w-12 h-12 rounded-full"
            />
          </button>
        </div>
      </aside>
    </>
  );
}