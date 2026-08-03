import SelectInput from "../Containers/ChoiceContainer";
import CounterInput from "../Forms/CounterInput";
import ErrorMessage from "../Forms/ErrorMessage";

const LaitInfantile = ({
  type,
  onTypeChange,
  grammage,
  onGrammageChange,
  boxes,
  onIncrement,
  onDecrement,
  errors = {},
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
              <SelectInput
                noPadding
                value={type}
                onChange={onTypeChange}
                placeholder="Tapez pour choisir le type de lait"
                error={errors.laitType}
               options={[
  { value: "1er âge (0-6 mois)", label: "1er âge (0-6 mois)" },
  { value: "2ème âge (6-12 mois)", label: "2ème âge (6-12 mois)" },
]}
              />
              <ErrorMessage
                message={errors.laitType ? "Veuillez choisir un type de lait" : null}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grammage */}
      <div className="mb-1">
        <label className="block mb-2 text-[16px] font-medium text-[#202124]">
          Grammage d'une boîte
        </label>

        <div className="w-full flex">
          <div className="flex-1">
            <div className="flex flex-col gap-2">
              <div
                className={`
                  w-full
                  h-[45px]
                  rounded-[15px]
                  border
                  bg-white
                  px-4
                  flex
                  items-center
                  gap-2
                  ${errors.grammage ? "border-[#EF4444]" : "border-[#4E9F8A]"}
                `}
              >
                <input
                  type="text"
                  inputMode="numeric"
                  value={grammage}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (/^\d*$/.test(raw)) {
                      onGrammageChange(raw);
                    }
                  }}
                  placeholder="Ex : 400"
                  className="
                    flex-1
                    w-full
                    text-[14px]
                    sm:text-[15px]
                    lg:text-[16px]
                    text-black
                    placeholder:text-gray-400
                    bg-transparent
                    focus:outline-none
                  "
                />
                <span
                  className="
                    text-[14px]
                    sm:text-[15px]
                    lg:text-[16px]
                    font-medium
                    text-[#4E9F8A]
                    select-none
                  "
                >
                  g
                </span>
              </div>
              <ErrorMessage
                message={errors.grammage ? "Veuillez saisir un grammage valide" : null}
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

        <div className="w-full flex justify-center">
          <CounterInput
            value={boxes}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            mobileWidth="w-[60px]"
            desktopWidth="lg:w-[70px]"
          />
        </div>
      </div>
    </div>
  );
};

export default LaitInfantile;
