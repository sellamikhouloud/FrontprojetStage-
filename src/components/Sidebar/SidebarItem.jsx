import { NavLink } from "react-router-dom";

export default function SidebarItem({
  item,
  expanded,
  onMouseEnter,
}) {
  return (
    <NavLink to={item.path}>
      {({ isActive }) => (
        <button
          onMouseEnter={onMouseEnter}
          className={`
            flex
            items-center
            transition-all
            duration-200
            hover:scale-105
            ${expanded ? "justify-start gap-2 xl:gap-3" : "justify-center"}
          `}
        >
          <img
            src={isActive ? item.activeIcon : item.icon}
            alt={item.label}
            className="
              w-5 h-5
              lg:w-6 lg:h-6
              xl:w-5 xl:h-5
            "
          />

          {expanded && (
            <span
              className="
                whitespace-nowrap
                text-white
                font-semibold
                text-[14px]
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