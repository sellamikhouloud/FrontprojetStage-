import Button from "../Button/Button";

import Add from "../../assets/add.svg";
import Edit1 from "../../assets/Edit 1.svg";
import Edit2 from "../../assets/Edit 2.svg";
import DocumentAdd from "../../assets/Document add.svg";
import Share from "../../assets/Share.svg";
import Historique from "../../assets/History.svg";

const ICONS = {
  edit: Edit1,
  add: Add,
  export: DocumentAdd,
  share: Share,
  historique: Historique,
};

const NavigationHeader = ({
  title,

  type = "none",
  actionTitle = "",
  onAction,

  secondType = "none",
  secondActionTitle = "",
  onSecondAction,

  thirdType = "none",
  thirdActionTitle = "",
  onThirdAction,
}) => {
  
  const renderAction = (currentType, currentTitle, currentAction) => {
    switch (currentType) {
      case "edit":
      case "add":
      case "export":
      case "share":
      case "historique": {
        const icon = ICONS[currentType];
        const alt =
          currentType === "share"
            ? "Partager"
            : currentType === "add"
            ? "Ajouter"
            : currentType === "export"
            ? "Exporter"
            : currentType === "historique"
            ? "Historique"
            : "Modifier";

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
              src={icon}
              alt={alt}
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
      }

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

  
  const renderMobileAction = (currentType, currentTitle, currentAction, widthClass) => {
    if (!currentType || currentType === "none" || !currentTitle) return null;

    if (currentType === "save") {
      return (
        <div className={widthClass} key={currentTitle}>
          <Button
            title={currentTitle}
            icon={Edit2}
            iconPosition="right"
            variant="save"
            fullWidth
            onClick={currentAction}
          />
        </div>
      );
    }

    const icon = ICONS[currentType];
    if (!icon) return null;

    return (
      <button
        key={currentTitle}
        onClick={currentAction}
        className={`
          ${widthClass}
          flex
          items-center
          justify-center
          gap-2
          rounded-2xl
          border-2
          border-[#4E9F8A]
          bg-[#C4DFD8]
          px-4
          py-2
          text-[15px]
          font-medium
          text-[#1E1E1E]
          cursor-pointer
          transition-all
          duration-150
          active:scale-95
        `}
      >
        <span>{currentTitle}</span>
        <img src={icon} alt={currentTitle} className="w-4 h-4 shrink-0" />
      </button>
    );
  };

  
  const activeActions = [
    { type, title: actionTitle, action: onAction },
    { type: secondType, title: secondActionTitle, action: onSecondAction },
    { type: thirdType, title: thirdActionTitle, action: onThirdAction },
  ].filter((a) => a.type && a.type !== "none" && a.title);

  const [firstAction, ...restActions] = activeActions;

  return (
    <div className="w-full mb-4">
      {/* ---------- MOBILE ---------- */}
      <div className="flex sm:hidden flex-col w-full gap-3">
        <h1 className="text-[15px] font-bold text-[#1E1E1E] leading-tight">
          {title}
        </h1>

        {activeActions.length > 0 && (
          <div className="flex flex-col gap-2 w-full">
            {firstAction &&
              renderMobileAction(
                firstAction.type,
                firstAction.title,
                firstAction.action,
                "w-full"
              )}

            {restActions.length === 2 && (
              <div className="flex gap-2 w-full">
                {renderMobileAction(
                  restActions[0].type,
                  restActions[0].title,
                  restActions[0].action,
                  "flex-1"
                )}
                {renderMobileAction(
                  restActions[1].type,
                  restActions[1].title,
                  restActions[1].action,
                  "flex-1"
                )}
              </div>
            )}

            {restActions.length === 1 &&
              renderMobileAction(
                restActions[0].type,
                restActions[0].title,
                restActions[0].action,
                "w-full"
              )}
          </div>
        )}
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden sm:flex w-full items-center justify-between gap-4">
        <h1 className="flex-1 text-[18px] lg:text-[20px] font-bold text-[#1E1E1E] leading-tight">
          {title}
        </h1>

        <div
          className="
            flex
            flex-row
            flex-wrap
            items-center
            justify-end
            gap-x-6
            gap-y-2
            shrink-0
          "
        >
          {renderAction(type, actionTitle, onAction)}
          {renderAction(secondType, secondActionTitle, onSecondAction)}
          {renderAction(thirdType, thirdActionTitle, onThirdAction)}
        </div>
      </div>
    </div>
  );
};

export default NavigationHeader;
