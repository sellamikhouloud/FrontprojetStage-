import Sidebar from "../components/Sidebar/Sidebar";
import PageHeader from "../components/Navigation,Pageheader/PageHeader";
import Card from "../components/Cards/Card";
import CardPopup from "../components/Cards/Card2";
import OptionsMenu from "../components/Containers/OptionsMenu";
import SelectorWithAction from "../components/Forms/SelectorWithAction";
import LaitInfantile from "../components/Distribution/LaitInfantile";

import ColisAlimentaire from "../components/Distribution/ColisAlimentaire";
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

import PopupListeFamilles from "../components/Popups/PopupListeFamilles";

import ConfirmationForm from "../components/Forms/ConfirmationForm";
import SelectProductsPopup from "../components/Popups/SelectProductsPopup";

import Popup from "../components/Popups/SuccessPopup";
import SuccessImage from "../assets/Success.svg";

export default function AjoutDistribution() {
 

  const stockProducts = [
    { id: 1, icon: Cereales, title: "Céréales", quantity: 50, unit: "kg" },
    { id: 2, icon: Legumineuses, title: "Légumineuses", quantity: 30, unit: "kg" },
    { id: 3, icon: Huile, title: "Huile alimentaire", quantity: 20, unit: "L" },
    { id: 4, icon: Sucre, title: "Sucre", quantity: 15, unit: "kg" },
    { id: 5, icon: Sel, title: "Sel", quantity: 10, unit: "kg" },
    { id: 6, icon: Huile, title: "ggg", quantity: 20, unit: "L" },
    { id: 7, icon: Sucre, title: "Riz", quantity: 15, unit: "kg" },
    { id: 8, icon: Sel, title: "Pate", quantity: 10, unit: "kg" },
  ];

  // products devient un état, pour pouvoir y ajouter les produits sélectionnés
  const [products, setProducts] = useState([]);
 const [showNewProduct, setShowNewProduct] = useState(false);
 const [date, setDate] = useState(new Date());
 const [confirmed, setConfirmed] = useState(false);
 const [showSuccessPopup, setShowSuccessPopup] = useState(false);
const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState({
    name: "",
    unit: "",
    quantity: "",
  });
   const [showStockPopup, setShowStockPopup] = useState(false);
 

const listeDesFamilles = [
  {
    id: 1,
    enfant: "Aïcha Mint Mohamed",
    sexe: "Fille",
    region: "Lexeiba",
    naissance: "12 mars 2026",
    code: "GDK-2026-003",
    badges: [
      { type: "mam", text: "MAM nourrisson" },
      { type: "mere", text: "Mère normale" },
    ],
  },
  {
    id: 2,
    enfant: "Aïcha Mint Mohamed",
    sexe: "Garçon",
    region: "Lexeiba",
    naissance: "22 mars 2025",
    code: "GDK-2026-003",
    badges: [
      { type: "mas", text: "MAS nourrisson" },
      { type: "mere", text: "Mère normale" },
    ],
  },
  {
    id: 3,
    enfant: "Aïcha Mint Mohamed",
    sexe: "Fille",
    region: "Lexeiba",
    naissance: "12 mars 2026",
    code: "GDK-2026-003",
    badges: [
      { type: "mam", text: "MAM nourrisson" },
      { type: "mere", text: "Mère normale" },
    ],
  },
];

const [openFamilles, setOpenFamilles] = useState(false);
const [selectedFamille, setSelectedFamille] = useState(null);
const [openOptions, setOpenOptions] = useState(false);

const familyOptions = [
  { label: "Changer la famille", value: "changer" },
  { label: "Voir la fiche famille", value: "voir" },
];

const handleSearch = () => {
  setOpenFamilles(true);
};
const handleUpdateQuantity = (id, newQuantity) => {
  setProducts((prev) =>
    prev.map((product) =>
      product.id === id
        ? { ...product, quantity: newQuantity }
        : product
    )
  );
};
const handleRemoveProduct = (id) => {
  setProducts((prev) => prev.filter((product) => product.id !== id));
};

const handleOptionSelect = (value) => {
  if (value === "changer") {
    setOpenFamilles(true);
  } else if (value === "voir") {
    navigate(`/famille/${selectedFamille.id}`);
  }
};
return (
  <div className="min-h-screen bg-white">

    {/* Desktop fixed sidebar */}
    <div
      className="
        hidden
        lg:flex
        fixed
        inset-y-0
        left-4
        items-center
        z-50
      "
    >
      <Sidebar role="admin" />
    </div>

    {/* Mobile sidebar (hamburger) */}
    <div className="lg:hidden">
      <Sidebar role="admin" />
    </div>

    {/* Mobile fixed white header */}
    <div
      className="
        fixed
        top-0
        left-0
        right-0
        h-20
        bg-white
        z-40
        lg:hidden
      "
    />

    {/* Page content */}
    <main
      className="
        flex-1
        overflow-y-auto
        bg-white

        pt-20
        lg:pt-4

        px-4
        lg:px-10

        pb-8
        lg:pb-2

        lg:ml-24
      "
    >
        {/* Header */}
        <div className="mb-0 lg:mb-6">
      <PageHeader
  leftTitle="Annuler"
  showRight={false}
  onBack={() => window.history.back()}
/>
        </div>
       {!selectedFamille && (
 <SelectorWithAction
  label="Choisir la famille concerne"
  description="Cliquer pour rechercher la famille concerne par la distribution"
  onAction={handleSearch}
/>
)}

       

        {/* Family Card */}
        {selectedFamille && (
          <>
            {/* Mobile */}
            <div className="relative block lg:hidden mt-4">
              <div
                className="cursor-pointer"
                onClick={() => setOpenOptions((prev) => !prev)}
              >
                 <CardPopup
        enfant={selectedFamille.enfant}
        sexe={selectedFamille.sexe}
        region={selectedFamille.region}
        naissance={selectedFamille.naissance}
        code={selectedFamille.code}
        badges={selectedFamille.badges}
      />
              </div>
 
              <OptionsMenu
                  open={openOptions}
                 onClose={() => setOpenOptions(false)}
                  options={familyOptions}
                  onSelect={handleOptionSelect}
               />
    
            </div>
 
            {/* Desktop */}
            <div className="relative hidden lg:block">
              <div
                className="cursor-pointer"
                onClick={() => setOpenOptions((prev) => !prev)}
              >
                 <Card
        enfant={selectedFamille.enfant}
        mere={selectedFamille.mere}
        sexe={selectedFamille.sexe}
        region={selectedFamille.region}
        naissance={selectedFamille.naissance}
        code={selectedFamille.code}
        badges={selectedFamille.badges}
      />
              </div>
 
               <OptionsMenu
                  open={openOptions}
                  onClose={() => setOpenOptions(false)}
                  options={familyOptions}
                  onSelect={handleOptionSelect}
                />
            </div>
          </>
        )}
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

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-2 items-end">
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
  <div className="hidden lg:block">
  <ConfirmationForm
    checked={confirmed}
    onChange={(e) => setConfirmed(e.target.checked)}
    error={!confirmed}
    errorMessage="Veuillez confirmer la remise avant d'enregistrer"
  />
</div>

  </div>

  {/* RIGHT COLUMN */}
  <div>
 <ColisAlimentaire
  products={products}
  onAddProduct={() => setShowStockPopup(true)}
  onUpdateQuantity={handleUpdateQuantity}
  onRemoveProduct={handleRemoveProduct}
/>
  {/* Mobile only */}
  <div className="mt-4 lg:hidden">
    <ConfirmationForm
      checked={confirmed}
      onChange={(e) => setConfirmed(e.target.checked)}
      error={!confirmed}
      errorMessage="Veuillez confirmer la remise avant d'enregistrer"
    />
  </div>
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
    primaryButtonText="Voir la fiche famille"
    secondaryButtonText="Revenir à l'accueil"
    onPrimaryClick={() => {
      setShowSuccessPopup(false);
      navigate(`/famille/${enfant.id}`);
    }}
    onSecondaryClick={() => {
      setShowSuccessPopup(false);
      navigate("/dashboard");
    }}
  />
)}

      </main>

      
  <PopupListeFamilles
  open={openFamilles}
  onClose={() => setOpenFamilles(false)}
  familles={listeDesFamilles}
  onSelectFamille={(famille) => {
    setSelectedFamille(famille);
    setOpenFamilles(false);
  }}
/>
{showStockPopup && (
  <SelectProductsPopup
    stockProducts={stockProducts.filter(
      (stockProduct) =>
        !products.some((p) => p.id === stockProduct.id)
    )}
    onClose={() => setShowStockPopup(false)}
    onConfirm={(selected) => {
      setProducts((prev) => [
        ...prev,
        ...selected.map((p) => ({ ...p, quantity: 0 })),
      ]);
    }}
  />
)}
    </div>
  );
}