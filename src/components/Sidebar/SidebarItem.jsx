import { NavLink } from "react-router-dom";

export default function SidebarItem({
  item,
  expanded,
  onMouseEnter,
}) {
  return (
    <NavLink 
      to={item.path}
    >
      {({ isActive }) => (
        <button
          onMouseEnter={onMouseEnter}
          className={`
            flex
            items-center
            transition-all
            duration-200
            hover:scale-105
            ${expanded ? "justify-start gap-4 xl:gap-3" : "justify-center"}
          `}
        >
          <img
            src={isActive ? item.activeIcon : item.icon}
            alt={item.label}
            className="
              w-6.5 h-6.5
              lg:w-5 lg:h-5
              xl:w-4.5 xl:h-4.5
            "
          />

          {expanded && (
            <span
              className="
                whitespace-nowrap
                text-white
                font-semibold
                text-[18px]
                lg:text-[15px]
                xl:text-[13px]
              "
            >
              {item.label}
            </span>
          )}
        </button>
      )}
    </NavLink>
  );
}