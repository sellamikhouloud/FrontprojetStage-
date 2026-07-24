import Sidebar from "../components/Sidebar/Sidebar";
import PageHeader from "../components/Navigation,Pageheader/PageHeader";
import Card from "../components/Cards/Card";
import LaitInfantile from "../components/LaitInfantile";

import ColisAlimentaire from "../components/ColisAlimentaire";
import { useState } from "react";

import Cereales from "../assets/Cereales.svg";
import Legumineuses from "../assets/Legumineuses.svg";
import Huile from "../assets/Huile.svg";
import Sucre from "../assets/Sucre.svg";
import Sel from "../assets/Sel.svg";


import DateContainer from "../components/Containers/DateContainer";
import InfoCard from "../components/Containers/AfficherContainer";
import InfoHeader from "../components/Containers/InfoBanner";
import Button from "../components/Button/Button";

export default function AjoutDistribution() {
  const enfant = {
    enfant: "Aïcha Mint Mohamed",
    mere: "Meriem",
    sexe: "Fille",
    region: "Lexeiba",
    naissance: "12 mars 2026",
    code: "GDK-2026-003",
    badges: [
      {
        type: "mam",
        text: "MAM nourrisson",
      },
      {
        type: "mere",
        text: "Mère normale",
      },
    ],
  };

  const products = [
  {
    id: 1,
    icon: Cereales,
    title: "Céréales",
    quantity: 5,
    unit: "kg",
  },
  {
    id: 2,
    icon: Legumineuses,
    title: "Légumineuses",
    quantity: 2,
    unit: "kg",
  },
  {
    id: 3,
    icon: Huile,
    title: "Huile alimentaire",
    quantity: 1.5,
    unit: "L",
  },
  {
    id: 4,
    icon: Sucre,
    title: "Sucre",
    quantity: 1,
    unit: "kg",
  },
  {
    id: 5,
    icon: Sel,
    title: "Sel",
    quantity: 1,
    unit: "kg",
  },
];
 const [showNewProduct, setShowNewProduct] = useState(false);
 const [date, setDate] = useState(new Date("2026-06-18"));

  const [newProduct, setNewProduct] = useState({
    name: "",
    unit: "",
    quantity: "",
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
  
 {/* Fixed sidebar */}

<div
  className="
    fixed
    inset-y-0
    left-4
    flex
    items-center
    z-50
  "
>
  <Sidebar />
</div>

  {/* Page content */}
 <div className="ml-24 flex-1 overflow-y-auto px-5 pt-18 md:pt-0 pb-8 lg:p-10 bg-white">

        {/* Header */}
        <PageHeader
          leftTitle="Annuler"
          rightTitle="Voir historique des distributions"
          onBack={() => window.history.back()}
          onRightClick={() => {}}
        />

        {/* Family Card */}
        <Card
          enfant={enfant.enfant}
          mere={enfant.mere}
          sexe={enfant.sexe}
          region={enfant.region}
          naissance={enfant.naissance}
          code={enfant.code}
          badges={enfant.badges}
        />

        {/* Rest of page */}
      {/* Main content */}
<div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">

  {/* LEFT COLUMN */}
  <div className="flex flex-col gap-5">

    {/* Last distribution */}
    <InfoHeader
      title="Dernière distribution"
      value="15/05/2026"
    />

   {/* Date + Distribution number */}
<div className="flex flex-col gap-1">
  <h3
    className="
      text-[16px]
      lg:text-[18px]
      font-semibold
      text-[#202124]
    "
  >
    Date de la distribution
  </h3>

  <div className="grid grid-cols-2 gap-4 items-end">
    <DateContainer
      value={date}
      onChange={setDate}
      noPadding
    />

    <div className="w-full">
      <div
        className="
          h-[45px]
          rounded-[15px]
          border
          border-[#4E9F8A]
          bg-white
          px-4
          pr-12
          flex
          items-center
        "
      >
        <p className="text-[14px] leading-[20px] text-[#374151]">
          Distribution numéro 03
        </p>
      </div>
    </div>
  </div>
</div>

    {/* Milk */}
    <LaitInfantile />

    {/* Temporary confirmation */}
    <div
      className="
        h-[52px]
        rounded-[15px]
        border
        border-[#D1D5DB]
        bg-white
        flex
        items-center
        px-4
      "
    >
      <input
        type="checkbox"
        className="mr-3"
      />

      <span className="font-medium text-[15px]">
        Je confirme la remise de cette distribution à la famille
      </span>
    </div>

    {/* Temporary error */}
    <p className="text-[#EF4444] text-[14px]">
      Veuillez confirmer la remise avant d'enregistrer
    </p>

  </div>

  {/* RIGHT COLUMN */}
  <div>
    <ColisAlimentaire
      products={products}
      onAddProduct={() => {}}
    />
  </div>

</div>

{/* Save button */}
<div className="mt-8">
  <Button
    title="Enregistrer"
    variant="save"
    fullWidth
  />
</div>

      </div>
    </div>
  );
}