import StatusItem from "./StatusItem";

const FamilyStatusCard = ({
  title,
  stats,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="
        w-full
        bg-[#F8FBFC]
        rounded-[20px]
        px-[15px]
        py-[20px]
        shadow-sm
        hover:shadow-md
        transition-all
        duration-200
        text-left
        border
        border-[#BCCAC14D]
      "
    >
      {/* Header */}
      <div
        className="
          flex
          justify-between
          items-center
          mb-6
        "
      >
        <h2
          className="
            text-[24px]
            font-semibold
            text-[#171D1A]
            leading-[28px]
          "
        >
          {title}
        </h2>
      </div>

      {/* Statistics */}
      <div
        className="
          flex
          justify-between
          items-center
          gap-[8px]
        "
      >
        {stats.map((item) => (
          <StatusItem
            key={item.id}
            value={item.value}
            label={item.label}
            color={item.color}
            borderColor={item.borderColor}
          />
        ))}
      </div>
    </button>
  );
};

export default FamilyStatusCard;