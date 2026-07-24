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

import { useNavigate } from "react-router-dom";
import DateContainer from "../components/Containers/DateContainer";
import InfoCard from "../components/Containers/AfficherContainer";
import InfoHeader from "../components/Containers/InfoBanner";
import Button from "../components/Button/Button";

import ConfirmationForm from "../components/Forms/ConfirmationForm";

import Popup from "../components/Popups/SuccessPopup";
import SuccessImage from "../assets/Success.svg";

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
 const [confirmed, setConfirmed] = useState(false);
 const [showSuccessPopup, setShowSuccessPopup] = useState(false);
const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState({
    name: "",
    unit: "",
    quantity: "",
  });

  return (
    <div className="min-h-screen bg-white">
  
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
<div className="ml-24 flex-1 overflow-y-auto px-5 pt-6 pb-8 lg:px-10 lg:pt-4 lg:pb-10 bg-white">

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
<div className="mt-5 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">

  {/* LEFT COLUMN */}
  <div className="flex flex-col gap-4">

    {/* Last distribution */}
    <InfoHeader
      title="Dernière distribution"
      value="15/05/2026"
    />

   {/* Date + Distribution number */}
<div className="flex flex-col gap-0">
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

  <div className="grid grid-cols-2 gap-2 items-end">
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
   <ConfirmationForm
  checked={confirmed}
  onChange={(e) => setConfirmed(e.target.checked)}
  error={!confirmed}
  errorMessage="Veuillez confirmer la remise avant d'enregistrer"
/>

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
<div className="mt-2">
  <Button
    title="Enregistrer"
    variant="save"
    noPadding
    onClick={() => setShowSuccessPopup(true)}
  />
</div>
{showSuccessPopup && (
  <Popup
    title="Distribution enregistrée avec succès"
    image={SuccessImage}
    primaryButtonText="Voir le détail de la distribution"
    secondaryButtonText="Revenir à l'accueil"
    onPrimaryClick={() => {
      setShowSuccessPopup(false);

      // Navigate to distribution details
      // navigate(`/distribution/${id}`);
    }}
    onSecondaryClick={() => {
      setShowSuccessPopup(false);

      // Navigate to home
      // navigate("/");
    }}
  />
)}

      </div>
    </div>
  );
}