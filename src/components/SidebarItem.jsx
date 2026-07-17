export default function SidebarItem({
  item,
  expanded,
  onMouseEnter,
}) {
  return (
    <button
      onMouseEnter={onMouseEnter}
      className={`
        flex
        items-center
        w-full
        transition-all
        duration-200
        hover:scale-105
        ${expanded ? "gap-3 justify-start" : "justify-center"}
      `}
    >
      <img
        src={item.icon}
        alt={item.label}
        className="
          w-6
          h-6
          lg:w-7
          lg:h-7
        "
      />

      {expanded && (
        <span
          className="
            text-white
            font-semibold
            whitespace-nowrap
            text-[17px]
            lg:text-[20px]
          "
        >
          {item.label}
        </span>
      )}
    </button>
  );
}