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
    selected: "bg-[#22C55E] text-white border-[#22C55E]",
    unselected: "bg-white text-[#22C55E] border-[#22C55E]",
  },
  {
    value: "inactive",
    label: "Inactif",
    selected: "bg-[#EF4444] text-white border-[#EF4444]",
    unselected: "bg-white text-[#EF4444] border-[#EF4444]",
  },
];

const ROLE_OPTIONS = [
  {
    value: "all",
    label: "Tout",
  },
  {
   
    value: "chef_coordinator",
    label: "Chef coordinateur",
  },
  {
   
    value: "coordinator",
    label: "Coordinateur",
  },
];



const RoleFilter = ({ value = "all", onChange }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const currentLabel =
    ROLE_OPTIONS.find((option) => option.value === value)?.label ?? "Tout";

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
        w-full
        min-w-0
        sm:w-[149px]
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
          justify-between

          gap-1

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
            gap-0.5

            min-w-0
            flex-1

            overflow-hidden
          "
        >
          <span
            className="
              text-black

              text-[10px]
              sm:text-[16px]

              font-semibold

              shrink-0
            "
          >
            Rôle :
          </span>

          <span
            className="
              text-black

              text-[10px]
              sm:text-[16px]

              font-semibold

              truncate
              min-w-0
            "
          >
            {currentLabel}
          </span>
        </span>

        <svg
          className={`
            w-3
            h-3

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
          className="
            absolute
            z-[100]

            top-full

            right-0
            left-auto

            sm:right-auto
            sm:left-0

            mt-1

            w-[min(220px,calc(100vw-24px))]
            sm:w-[210px]

            bg-white

            border
            border-gray-200

            rounded-[12px]

            shadow-xl

            overflow-hidden

            max-h-[220px]

            overflow-y-auto
          "
          role="listbox"
        >
          {ROLE_OPTIONS.map((option) => {
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

                  text-left

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

/* =========================================================
   STATUS FILTER
========================================================= */

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

        grid
        grid-cols-4

        gap-1

        sm:flex
        sm:flex-wrap

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
              w-full
              min-w-0

              sm:w-[149px]

              h-10
              sm:h-[45px]

              rounded-[10px]
              sm:rounded-[15px]

              border

              text-[11px]
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
export { RoleFilter };
