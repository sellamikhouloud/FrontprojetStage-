import { useState } from "react";
import SelectInput from "./Containers/ChoiceContainer";
import TextInput from "./Containers/ContainerEcriture";
import CounterInput from "./Forms/CounterInput";

const LaitInfantile = () => {
  const [boxes, setBoxes] = useState(4);

  return (
    <div
      className="
        rounded-[20px]
        border
        border-[#E5E7EB]
        bg-[#F9FAFB]
        p-5
      "
    >
      {/* Title */}
      <h2 className="text-[20px] font-bold text-[#202124] mb-5">
        Lait infantile
      </h2>

      {/* Type */}
      <div className="mb-4">
        <label className="block mb-2 text-[16px] font-medium text-[#202124]">
          Type de lait
        </label>

        <SelectInput
          placeholder="Tapez pour choisir le type de lait"
          options={[
            { value: "premier", label: "1er âge" },
            { value: "deuxieme", label: "2ème âge" },
          ]}
        />
      </div>

      {/* Grammage */}
      <div className="mb-4">
        <label className="block mb-2 text-[16px] font-medium text-[#202124]">
          Grammage d'une boîte
        </label>

        <TextInput placeholder="Ex : 400 g" />
      </div>

      {/* Counter */}
      <div>
        <label className="block mb-3 text-[16px] font-medium text-[#202124]">
          Nombre de boîtes
        </label>

        <CounterInput
          value={boxes}
          onIncrement={() => setBoxes((v) => v + 1)}
          onDecrement={() => setBoxes((v) => Math.max(0, v - 1))}
          mobileWidth="w-[50px]"
          desktopWidth="lg:w-[80px]"
        />
      </div>
    </div>
  );
};

export default LaitInfantile;