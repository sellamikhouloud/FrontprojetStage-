const SelectorWithAction = ({
  label,
  description,
  actionLabel = "Rechercher",
  onAction,
}) => {
  return (
    <div
      className="
        flex flex-col
        lg:flex-row lg:items-center lg:justify-between
        gap-3
        lg:gap-4
        w-full
        rounded-[15px]
        bg-[#F8FBFC]
        py-[15px]
        px-4
        lg:px-[25px]
      "
    >
      <div className="flex flex-col gap-1">
        <span className="font-bold text-[#000000] text-[18px] lg:text-[22px]">
          {label}
        </span>

        {description && (
          <span className="font-normal text-[#6B7280] text-[14px]">
            {description}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={onAction}
        className="
          bg-[#89BFB1]
          text-white
          font-bold
          text-[14px]
          sm:text-[16px]
          rounded-[15px]
          px-8
          h-[42px]
          sm:h-[45px]
          w-full
          lg:w-auto
          lg:min-w-[160px]
          shrink-0
          hover:brightness-95
          active:scale-[0.99]
          transition-all
          duration-200
        "
      >
        {actionLabel}
      </button>
    </div>
  );
};

export default SelectorWithAction;