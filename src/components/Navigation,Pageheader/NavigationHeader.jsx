import Button from "../Button/Button";

import Add from "../../assets/add.svg";
import Edit1 from "../../assets/Edit 1.svg";
import Edit2 from "../../assets/Edit 2.svg";
import DocumentAdd from "../../assets/Document add.svg";

const NavigationHeader = ({
  title,

  // none | edit | add | save | export
  type = "none",
  actionTitle = "",
  onAction,

  secondType = "none",
  secondActionTitle = "",
  onSecondAction,
}) => {
  const renderAction = (currentType, currentTitle, currentAction) => {
    switch (currentType) {
      case "edit":
        return (
          <button
            onClick={currentAction}
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
            <span>{currentTitle}</span>

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
        );

      case "add":
        return (
          <button
            onClick={currentAction}
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
            <span>{currentTitle}</span>

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
        );

      case "export":
        return (
          <button
            onClick={currentAction}
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
            <span>{currentTitle}</span>

            <img
              src={DocumentAdd}
              alt="Exporter"
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
        );

      case "save":
        return (
          <div className="shrink-0">
            <Button
              title={currentTitle}
              icon={Edit2}
              iconPosition="right"
              variant="save"
              fullWidth={false}
              noPadding
              onClick={currentAction}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full flex items-center justify-between gap-3 sm:gap-4 mb-6">
      {/* Titre */}
      <h1 className="flex-1 text-[15px] sm:text-[18px] lg:text-[20px] font-bold text-[#1E1E1E] leading-tight">
        {title}
      </h1>

      {/* Actions */}
      <div className="flex items-center gap-6 shrink-0">
        {renderAction(type, actionTitle, onAction)}
        {renderAction(secondType, secondActionTitle, onSecondAction)}
      </div>
    </div>
  );
};

export default NavigationHeader;