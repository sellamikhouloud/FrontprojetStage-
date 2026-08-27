import React, { useEffect, useRef, useState } from "react";

const STATUS_OPTIONS = [
  {
    value: "all",
    label: "Toutes",
    selected: "bg-[#55A694] text-white border-[#55A694]",
    unselected: "bg-white text-[#55A694] border-[#55A694]",
  },
  {
    value: "active",
    label: "Actif",
    selected: "bg-[#B5ECC9CC] text-[#22C55E] border-[#22C55E]",
    unselected: "bg-white text-[#22C55E] border-[#22C55E]",
  },
  {
    value: "inactive",
    label: "Inactif",
    selected: "bg-[#FFD9E2] text-[#EF4444] border-[#EF4444]",
    unselected: "bg-white text-[#EF4444] border-[#EF4444]",
  },
];
const ROLE_OPTIONS = [
  { value: "all", label: "Tout" },
  { value: "chef_coordinator", label: "Chef coordinateur" },
  { value: "coordinator", label: "Coordinateur" },
];

const TYPE_OPTIONS = [
  { value: "all", label: "Tout" },
  { value: "malnutrition", label: "Malnutrition" },
  { value: "visite_retard", label: "Visite en retard" },
  { value: "stock_faible", label: "Stock faible" },
  { value: "validation_rapport", label: "Validation Rapport" },
  { value: "verification_taux_change", label: "Verification Taux de Change" },
];

const GenericDropdownFilter = ({
  value = "all",
  onChange,
  options,
  label,
  dropdownAlign = "right",
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const currentLabel =
    options.find((option) => option.value === value)?.label ?? "Tout";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setOpen(false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="
        relative
        w-[78px]
        min-w-0
        shrink-0

        sm:w-[210px]
      "
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="
          w-full

          h-10
          sm:h-[45px]

          rounded-[10px]
          sm:rounded-[15px]

          border
          border-black

          bg-white

          px-1
          sm:px-3

          flex
          items-center
          justify-center

          gap-0.5
          sm:gap-1

          min-w-0

          transition-all
          duration-200

          hover:bg-gray-50
          active:scale-[0.98]
        "
      >
        <span
          className="
            flex
            items-center
            justify-center
            gap-0.5

            min-w-0
            overflow-hidden
          "
        >
          <span
            className="
              text-black

              text-[9px]
              sm:text-[16px]

              font-semibold

              shrink-0
            "
          >
            {label} :
          </span>

          <span
            className="
              text-black

              text-[9px]
              sm:text-[16px]

              font-semibold

              truncate
              min-w-0
              ml-0.5
              sm:ml-1
            "
          >
            {currentLabel}
          </span>
        </span>

        <svg
          className={`
            w-2.5
            h-2.5

            sm:w-4
            sm:h-4

            shrink-0

            text-black

            transition-transform
            duration-200

            ${open ? "rotate-180" : ""}
          `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div
          className={`
            absolute
            z-[100]

            top-full

            ${
              dropdownAlign === "left"
                ? "left-0 right-auto"
                : "right-0 left-auto"
            }

            sm:left-1/2
            sm:right-auto
            sm:-translate-x-1/2

            mt-1

            w-[min(260px,calc(100vw-24px))]
            sm:w-[260px]

            bg-white

            border
            border-gray-200

            rounded-[12px]

            shadow-xl

            overflow-hidden

            max-h-[260px]

            overflow-y-auto
          `}
          role="listbox"
        >
          {options.map((option) => {
            const isSelected = value === option.value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`
                  block

                  w-full

                  min-h-[42px]

                  px-3
                  sm:px-4

                  py-2.5

                  text-center

                  text-[13px]
                  sm:text-[15px]

                  font-medium

                  whitespace-normal

                  break-words

                  transition-colors

                  ${
                    isSelected
                      ? "bg-[#55A694]/10 text-[#55A694]"
                      : "text-black hover:bg-gray-50"
                  }
                `}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const RoleFilter = ({ value = "all", onChange }) => (
  <GenericDropdownFilter
    value={value}
    onChange={onChange}
    options={ROLE_OPTIONS}
    label="Rôle"
    dropdownAlign="right"
  />
);

const TypeFilter = ({ value = "all", onChange }) => (
  <GenericDropdownFilter
    value={value}
    onChange={onChange}
    options={TYPE_OPTIONS}
    label="Type"
    dropdownAlign="left"
  />
);

const StatusFilter = ({
  value = "all",
  onChange,

  showRoleFilter = false,

  roleValue = "all",
  onRoleChange,
}) => {
  return (
    <div
      className="
        w-full

        flex
        flex-nowrap
        items-center

        gap-1
        sm:gap-[8px]
      "
    >
      {STATUS_OPTIONS.map((option) => {
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              flex-1
              min-w-0

              sm:flex-none
              sm:w-[149px]

              h-10
              sm:h-[45px]

              rounded-[10px]
              sm:rounded-[15px]

              border

              text-[10px]
              sm:text-[16px]

              font-semibold

              px-1
              sm:px-2

              truncate

              transition-all
              duration-200

              ${isSelected ? option.selected : option.unselected}

              hover:opacity-90
              active:scale-[0.98]
            `}
          >
            {option.label}
          </button>
        );
      })}

      {showRoleFilter && (
        <RoleFilter value={roleValue} onChange={onRoleChange} />
      )}
    </div>
  );
};

export default StatusFilter;
export { RoleFilter, TypeFilter };

