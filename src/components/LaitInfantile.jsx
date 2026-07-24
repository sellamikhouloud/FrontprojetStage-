import { useState } from "react";
import SelectInput from "./Containers/ChoiceContainer";
import TextInput from "./Containers/ContainerEcriture";
import CounterInput from "./Forms/CounterInput";

const LaitInfantile = () => {
  const [boxes, setBoxes] = useState(4);
  const [grammage, setGrammage] = useState("");

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
    <SelectInput
      noPadding
      placeholder="Tapez pour choisir le type de lait"
      options={[
        { value: "premier", label: "1er âge" },
        { value: "deuxieme", label: "2ème âge" },
      ]}
    />
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
      <div
        className="
          w-full
          h-[45px]
          rounded-[15px]
          border
          border-[#4E9F8A]
          bg-white
          px-4
          flex
          items-center
          gap-2
        "
      >
        <input
          type="text"
          inputMode="numeric"
          value={grammage}
          onChange={(e) => {
            const raw = e.target.value;
            if (/^\d*$/.test(raw)) {
              setGrammage(raw);
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
      onIncrement={() => setBoxes((v) => v + 1)}
      onDecrement={() => setBoxes((v) => Math.max(0, v - 1))}
      mobileWidth="w-[60px]"
      desktopWidth="lg:w-[70px]"
    />
  </div>
</div>
    </div>
  );
};

export default LaitInfantile;