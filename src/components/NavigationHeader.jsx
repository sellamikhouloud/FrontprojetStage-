import Button from "./Button";

import Add from "../assets/add.svg";
import Edit1 from "../assets/Edit 1.svg";
import Edit2 from "../assets/Edit 2.svg";

const NavigationHeader = ({
  title,

  // none | edit | add | save
  type = "none",

  actionTitle = "",

  onAction,
}) => {
  return (
    <div className="w-full flex items-center justify-between gap-3 sm:gap-4 mb-6">
      {/* Titre */}
      <h1 className="flex-1 text-[15px] sm:text-[18px] lg:text-[20px] font-bold text-[#1E1E1E] leading-tight">
        {title}
      </h1>

      {/* Rien */}
      {type === "none" && null}

      {/* Modifier */}
      {type === "edit" && (
        <button
          onClick={onAction}
          className="
            group
            flex
            items-center
            gap-1
            sm:gap-2

            text-[#1E1E1E]
            text-[13px]
            sm:text-[16px]
            lg:text-[18px]
            font-medium

            whitespace-nowrap
            shrink-0
            cursor-pointer

            transition-all
            duration-150
            hover:opacity-70
            active:scale-95
          "
        >
          <span>{actionTitle}</span>

          <img
            src={Edit1}
            alt="Modifier"
            className="
              w-4
              h-4
              sm:w-5
              sm:h-5
              transition-transform
              duration-150
              group-active:scale-90
            "
          />
        </button>
      )}

      {/* Ajouter */}
      {type === "add" && (
        <button
          onClick={onAction}
          className="
            group
            flex
            items-center
            gap-1
            sm:gap-2

            text-[#1E1E1E]
            text-[13px]
            sm:text-[16px]
            lg:text-[18px]
            font-medium

            whitespace-nowrap
            shrink-0
            cursor-pointer

            transition-all
            duration-150
            hover:opacity-70
            active:scale-95
          "
        >
          <span>{actionTitle}</span>

          <img
            src={Add}
            alt="Ajouter"
            className="
              w-4
              h-4
              sm:w-5
              sm:h-5
              transition-transform
              duration-150
              group-active:scale-90
            "
          />
        </button>
      )}

      {/* Enregistrer */}
      {type === "save" && (
        <Button
          title={actionTitle}
          icon={Edit2}
          variant="primary"
          fullWidth={false}
          onClick={onAction}
        />
      )}
    </div>
  );
};

export default NavigationHeader;
