import SelectInput2 from "../Containers/ChoiceContainer2";
import CounterInput from "../Forms/CounterInput";
import ErrorMessage from "../Forms/ErrorMessage";

const LaitInfantile = ({
  type,
  onTypeChange,
  // Liste des grammages dispo pour le type sélectionné : [{ id, grammage, nb_boites }, ...]
  options = [],
  optionsLoading = false,
  // Grammage sélectionné : { id, grammage, nb_boites } | null
  selectedOption,
  onSelectOption,
  showPopup,
  onOpenPopup,
  onClosePopup,
  boxes,
  onIncrement,
  onDecrement,
  errors = {},
  // Tant qu'aucune famille n'est sélectionnée, le lait n'est pas accessible
  hasFamille = true,
  onRequireFamille,
}) => {
  return (
    <div
      className="
        rounded-[20px]
        border
        border-[#E5E7EB]
        bg-[#F9FAFB]
         px-4
         py-4
      "
    >
      {/* Title */}
      <h2 className="text-[20px] font-bold text-[#202124] mb-0">
        Lait infantile
      </h2>

      {/* Type */}
      <div className="mb-1">
        <div className="w-full flex">
          <div className="flex-1">
            <div className="flex flex-col gap-2">
            <div
              onClickCapture={(e) => {
                if (!hasFamille) {
                  e.preventDefault();
                  e.stopPropagation();
                  onRequireFamille?.();
                }
              }}
            >
              <SelectInput2
                noPadding
                
                value={type}
                onChange={onTypeChange}
                placeholder="Choisir le type de lait"
                options={[
                  { value: "1er_age", label: "1er âge (0-6 mois)" },
                  { value: "2eme_age", label: "2ème âge (6-12 mois)" },
                ]}
              />
            </div>
              <ErrorMessage
                message={
                  errors.famille
                    ? "Veuillez d'abord choisir une famille"
                    : errors.laitType
                    ? "Veuillez choisir un type de lait"
                    : null
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grammage — ouvre une popup listant grammage + stock dispo */}
      <div className="mb-1">
        <label className="block mb-2 text-[16px] font-medium text-[#202124]">
          Grammage d'une boîte
        </label>

        <div className="w-full flex">
          <div className="flex-1">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={onOpenPopup}
                className={`
                  w-full
                  h-[45px]
                  rounded-[15px]
                  border
                  bg-white
                  px-4
                  flex
                  items-center
                  justify-between
                  text-left
                  ${errors.grammage ? "border-[#EF4444]" : "border-[#4E9F8A]"}
                `}
              >
                <span
                  className={`
                    text-[14px]
                    sm:text-[15px]
                    lg:text-[16px]
                    ${selectedOption ? "text-black" : "text-gray-400"}
                  `}
                >
                  {selectedOption
                    ? `${selectedOption.grammage} g — ${selectedOption.nb_boites} boîtes dispo`
                    : "Choisir un grammage"}
                </span>
                <span className="text-[#4E9F8A] text-[13px] font-medium select-none">
                  Choisir
                </span>
              </button>
              <ErrorMessage
                message={errors.grammage ? "Veuillez choisir un grammage" : null}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Counter */}
      <div>
        <label className="block mb-1 text-[16px] font-medium text-[#202124]">
          Nombre de boîtes
        </label>

        <div className="w-full flex flex-col items-center gap-1">
          <CounterInput
            value={boxes}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            mobileWidth="w-[60px]"
            desktopWidth="lg:w-[70px]"
          />
          <ErrorMessage
            message={
              errors.laitStock
                ? errors.laitStock
                : errors.boxes
                ? "Veuillez indiquer un nombre de boîtes supérieur à 0"
                : null
            }
          />
        </div>
      </div>

      {/* Popup de sélection du grammage */}
      {showPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={onClosePopup}
        >
          <div
            className="w-full max-w-[380px] rounded-[20px] bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[16px] font-semibold text-[#202124]">
                Choisir un grammage
              </h3>
              <button
                type="button"
                onClick={onClosePopup}
                className="text-[#9CA3AF] text-[14px]"
              >
                Fermer
              </button>
            </div>

            {optionsLoading && (
              <p className="text-[14px] text-[#6B7280] py-2">Chargement...</p>
            )}

            {!optionsLoading && options.length === 0 && (
              <p className="text-[14px] text-[#6B7280] py-2">
                Aucun grammage disponible pour ce type de lait.
              </p>
            )}

            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectOption(opt)}
                  className={`
                    w-full
                    h-[50px]
                    rounded-[12px]
                    border
                    px-4
                    flex
                    items-center
                    justify-between
                    text-left
                    ${
                      selectedOption?.id === opt.id
                        ? "border-[#4E9F8A] bg-[#F0FBF8]"
                        : "border-[#E5E7EB] bg-white"
                    }
                  `}
                >
                  <span className="text-[14px] font-medium text-[#202124]">
                    {opt.grammage} g
                  </span>
                  <span className="text-[13px] text-[#6B7280]">
                    {opt.nb_boites} boîtes dispo
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaitInfantile;
