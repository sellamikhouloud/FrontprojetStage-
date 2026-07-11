export default function SidebarItem({
  item,
  expanded,
  onMouseEnter,
}) {
  return (
    <button
      onMouseEnter={onMouseEnter}
      className={`
        flex items-center w-full transition-all duration-200
        hover:scale-105
        ${expanded ? "gap-5 justify-start" : "justify-center"}
      `}
    >
      <img
        src={item.icon}
        alt={item.label}
        className="w-7 h-7"
      />

      {expanded && (
        <span className="text-white font-medium whitespace-nowrap">
          {item.label}
        </span>
      )}
    </button>
  );
}