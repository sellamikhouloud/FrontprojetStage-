const EditableInfoCard = ({
  title,
  data = [],
  editable = true,
  onChange,
}) => {
  return (
    <div className="w-full">
      {/* Titre */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-[18px] font-semibold">
          {title}
        </h2>
      </div>

      {/* Conteneur */}
      <div className="border-2 border-dashed border-[#84D6D0] rounded-[15px] px-4 py-3">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 gap-6"
          >
            {/* Label */}
            <span className="text-[#4E9F8A] font-medium">
              {item.label}
            </span>

            {/* Valeur */}
            <input
              type="text"
              value={item.value}
              onChange={(e) => onChange(index, e.target.value)}
              disabled={!editable}
              className="
                w-[220px]
                text-right
                bg-transparent
                border-none
                outline-none
                text-[#202124]
                disabled:cursor-default
              "
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditableInfoCard;