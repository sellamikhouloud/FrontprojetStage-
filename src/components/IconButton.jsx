const IconButton = ({
  icon,
  alt = "",
  onClick,
  className = "",
  iconClassName = "",
  bgColor = "#7BC8C4",
  radius = 15,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        items-center
        justify-center
        transition-all
        duration-200
        hover:brightness-95
        active:scale-95
        ${className}
      `}
      style={{
        backgroundColor: bgColor,
        borderRadius: `${radius}px`,
      }}
    >
      <img
        src={icon}
        alt={alt}
        className={iconClassName}
      />
    </button>
  );
};

export default IconButton;