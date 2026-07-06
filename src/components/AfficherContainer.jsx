const InfoCard = ({
  title,
  data = [],
  action,
  onActionClick,
}) => {
  return (
    <div className="w-full">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-[18px] font-semibold">
          {title}
        </h2>

        {action && (
          <button
            onClick={onActionClick}
            className="text-[14px] text-gray-600 hover:underline"
          >
            {action}
          </button>
        )}
      </div>

      {/* Conteneur */}
      <div className="border border-[#84D6D0] rounded-[15px] px-3 py-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-between py-1"
          >
            <span className="text-[#4E9F8A]">
              {item.label}
            </span>

            <span className="text-[#202124]">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoCard;