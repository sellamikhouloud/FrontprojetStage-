const CoordinateurSelector = ({
  label = "Coordinateur à affecter",
  selectedCoordinateur,
  onOpenPopup,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[14px] lg:text-[16px] font-semibold text-[#000000]">
        {label}
      </label>

      <button
        type="button"
        onClick={onOpenPopup}
        className="
          w-full
          h-[45px]
          rounded-[15px]
          border
          border-[#4E9F8A]
          bg-white
          px-4
          flex
          items-center
          text-left
          hover:bg-[#F8FBFC]
          transition-colors
        "
      >
        <span
          className={`
            text-[14px]
            ${selectedCoordinateur ? "text-[#374151] font-medium" : "text-[#9CA3AF]"}
          `}
        >
          {selectedCoordinateur
            ? selectedCoordinateur.name
            : "Saisir l'identifiant du coordinateur"}
        </span>
      </button>
    </div>
  );
};

export default CoordinateurSelector;
