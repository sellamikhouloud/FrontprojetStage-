import { useState } from "react";

const SelectorWithAction = ({
  label,
  description,
  actionLabel = "Rechercher",
  onAction,
  // Optional: lets the user type a value directly instead of searching —
  // e.g. entering a family code by hand when offline and search can't run.
  // Fully optional: omit these props and the component behaves exactly
  // as before.
  manualEntryLabel, // e.g. "Entrer le code famille directement"
  manualEntryPlaceholder = "Ex : GDK-2026-059",
  onManualSubmit, // (value: string) => void
  manualEntryError, // string | null — shown under the input if set
}) => {
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualValue, setManualValue] = useState("");

  const canShowManualEntry = !!manualEntryLabel && !!onManualSubmit;

  const handleValidate = () => {
    const trimmed = manualValue.trim();
    if (!trimmed) return;
    onManualSubmit(trimmed);
  };

  return (
    <div
      className="
        flex flex-col
        w-full
        rounded-[15px]
        bg-[#F8FBFC]
        py-[15px]
        px-4
        lg:px-[25px]
        gap-3
      "
    >
      <div
        className="
          flex flex-col
          lg:flex-row lg:items-center lg:justify-between
          gap-3
          lg:gap-4
          w-full
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

      {canShowManualEntry && (
        <div className="flex flex-col gap-2">
          {!showManualEntry ? (
            <button
              type="button"
              onClick={() => setShowManualEntry(true)}
              className="
                self-start
                text-[13px]
                font-medium
                text-[#4E9F8A]
                underline
                underline-offset-2
                hover:text-[#3d8272]
              "
            >
              {manualEntryLabel}
            </button>
          ) : (
            <div className="flex flex-col gap-1">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={manualValue}
                  onChange={(e) => setManualValue(e.target.value)}
                  placeholder={manualEntryPlaceholder}
                  className="
                    flex-1
                    h-[42px]
                    rounded-[12px]
                    border
                    border-[#E5E7EB]
                    bg-white
                    px-4
                    text-[14px]
                    text-[#374151]
                    placeholder:text-gray-400
                    focus:outline-none
                    focus:border-[#4E9F8A]
                  "
                />

                <button
                  type="button"
                  onClick={handleValidate}
                  disabled={!manualValue.trim()}
                  className="
                    h-[42px]
                    px-6
                    rounded-[12px]
                    bg-[#4E9F8A]
                    text-white
                    text-[14px]
                    font-semibold
                    disabled:opacity-50
                    hover:brightness-95
                    active:scale-[0.99]
                    transition-all
                    duration-200
                  "
                >
                  Valider
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowManualEntry(false);
                    setManualValue("");
                  }}
                  className="text-[13px] text-gray-500 underline self-center"
                >
                  Annuler
                </button>
              </div>

              {manualEntryError && (
                <span className="text-[12px] text-red-500">
                  {manualEntryError}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectorWithAction;
