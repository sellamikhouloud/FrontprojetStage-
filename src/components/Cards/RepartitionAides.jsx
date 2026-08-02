const RepartitionAides = ({
  title = "Répartition des aides",
  data = [
    { label: "Veuvage", percentage: "" },
    { label: "Urgence", percentage: "" },
    { label: "Vulnérabilité", percentage: "" },
    { label: "Autre", percentage: "" },
  ],
}) => {
  return (
    <div
      className="
        w-full
        rounded-[20px]
        border
        border-[#BEC9C5]
        bg-white

        pt-3
        pb-6
        px-6
        sm:px-8
      "
      
    >
      {/* Titre */}
      <h2
        className="text-[18px] font-bold mb-3"
        style={{ color: "#000000" }}
      >
        {title}
      </h2>

      {/* Liste des motifs */}
      <div className="flex flex-col gap-[19px]">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col gap-[7px]">
            {/* Label + pourcentage */}
            <div className="flex items-center justify-between">
              <span
                className="text-[14px] font-semibold"
                style={{ color: "#000000" }}
              >
                {item.label}
              </span>
              <span
                className="text-[14px] font-bold"
                style={{ color: "#004E44" }}
              >
                {item.percentage}%
              </span>
            </div>

            {/* Barre de progression */}
            <div
              className="w-full h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: "#F3F4F6" }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: "#67A7A3",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepartitionAides;
