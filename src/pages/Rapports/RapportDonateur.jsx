import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";


import Sidebar from "../../components/Sidebar/Sidebar";
import NavigationHeader from "../../components/Navigation,Pageheader/NavigationHeader";
import ReportTabs from "../../components/Report/ReportTabs";
import MonthPicker from "../../components/Report/MonthPicker";
import Button from "../../components/Button/Button";
import Download from "../../assets/telecharger.svg";
import CardZakatSummary from "../../components/Report/CardZakatSummary";
import HeaderRapport from "../../components/Report/HeaderRapport";
import StatusCard  from  "../../components/Report/ReportBadge";
import ReportVisitsNutrition from "../../components/Report/ReportVisitsNutrition";
import DistributionItem from "../../components/Report/DistributionItem";
import TextArea  from "../../components/Containers/Textarea";
import PhotoTerrain from "../../assets/photo terrain.png";

const RapportBilan  = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [rapport, setRapport] = useState(null);
  const [isSent, setIsSent] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const terrainPhotos = [
  PhotoTerrain,
  PhotoTerrain,
  PhotoTerrain,
];
   const [narrativeMessage, setNarrativeMessage] = useState("");
  const handleMonthChange = async (value) => {
  setSelectedMonth(value);

  console.log("Mois sélectionné :", value);

  // Quand ton backend sera prêt :
  //
  // const response = await axios.get("/api/reports/monthly", {
  //   params: {
  //     month: value.month,
  //     year: value.year,
  //   },
  // });
  //
  // setRapport(response.data);
};

  const products = [
  {
    product: "Lait",
    quantity: 38,
    unit: "boîtes",
  },
  {
    product: "Céréales",
    quantity: 38,
    unit: "Kg",
  },
  {
    product: "Huile",
    quantity: 6,
    unit: "Litres",
  },
  {
    product: "Sucre",
    quantity: 38,
    unit: "Kg",
  },
  {
    product: "Sel iodé",
    quantity: 7,
    unit: "Kg",
  },
];

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar role="admin" />

      <main className="flex-1 h-screen overflow-hidden px-5 pt-18 md:pt-0 pb-8 lg:p-10">
       <div className={`${showPreview ? "hidden" : "block"} xl:block`}>
         <NavigationHeader
          title="Rapports"
         />
       </div>

     
        <div className={`mt-6 ${showPreview ? "hidden" : "block"} xl:block`}>
          <ReportTabs />
        </div>

        {/* Contenu */}
     <div className="mt-8 flex flex-col xl:flex-row items-start gap-8 h-[calc(100%-120px)]">

{/* Partie gauche  */}
 <div
  className={`
    ${showPreview ? "flex" : "hidden"}
    xl:flex
    flex-1
    h-full
    w-full
    flex-col
    gap-8
    overflow-y-auto
    scrollbar-hide
  `}
>

  <button
    type="button"
    onClick={() => setShowPreview(false)}
    className="flex items-center gap-2 text-[#202124] font-medium xl:hidden"
  >
    <X size={18} />
    Revenir
  </button>

  {/* ===================== PAGE 1 : Bilan (bloc bleu) ===================== */}
  <div
    className="
      rounded-[15px]
      bg-[#F8FBFC]
      p-4
      md:p-6
      flex
      flex-col
      gap-8
    "
  >
    <div className="mt-4">
      <HeaderRapport
        selectedMonth={selectedMonth}
        title="Bilan donateurs"
      />
    </div>

    <div className="flex justify-center">
      <div className="w-full max-w-[720px] min-w-0">
        <h2 className="text-[18px] font-semibold text-[#202124] mb-2">
          Cher donateur,
        </h2>
        <p className="text-[14px] leading-6 whitespace-pre-wrap break-words text-[#5F6368]">
          {narrativeMessage}
        </p>
      </div>
    </div>

    <div className="flex flex-col items-center">
      <div className="w-full max-w-[720px]">
        <h2 className="text-[18px] font-semibold text-[#202124] mb-3">
          États des familles
        </h2>

        <div className="flex w-full gap-3">
          <StatusCard value={38} label="Actives" type="active" />
          <StatusCard value={1} label="Alertées" type="alert" />
          <StatusCard value={5} label="Sorties" type="sortie" />
        </div>
      </div>
    </div>

    <div className="flex justify-center">
      <div className="w-full max-w-[720px]">
        <ReportVisitsNutrition
          realised={9}
          planned={21}
          compliance={43}
          normal={65}
          mam={25}
          mas={10}
        />
      </div>
    </div>

    <div className="flex justify-center">
      <div className="w-full max-w-[720px]">
        <h2 className="text-[18px] font-semibold text-[#202124] mb-4">
          Distributions ce mois
        </h2>

        <div className="space-y-3">
          {products.map((item, index) => (
            <DistributionItem
              key={index}
              product={item.product}
              quantity={item.quantity}
              unit={item.unit}
            />
          ))}
        </div>
      </div>
    </div>

    <div className="flex items-center justify-center">
      <CardZakatSummary
        montant="2,450,000 MRU"
        familles={32}
      />
    </div>
  </div>
  {/* ===================== FIN PAGE 1 ===================== */}


  {/* ===================== PAGE 2 : Photos de terrain ===================== */}
  <div
    className="
      rounded-[15px]
      bg-[#F8FBFC]
      p-4
      md:p-6
      flex
      flex-col
      gap-8
    "
  >
    <HeaderRapport
      selectedMonth={selectedMonth}
      title="Bilan donateurs"
    />

    <div className="space-y-6">
      {terrainPhotos.map((photo, index) => (
        <img
          key={index}
          src={photo}
          alt={`Photo terrain ${index + 1}`}
       className="w-[85%] mx-auto rounded-[10px] object-cover"
        />
      ))}
    </div>
  </div>
  {/* ===================== FIN PAGE 2 ===================== */}

</div>



 
{/* Partie droite  */}
 <div
  className={`
    ${showPreview ? "hidden" : "flex"}
    xl:flex
    w-full
    h-full
    xl:w-[420px]
    2xl:w-[540px]
    xl:min-w-[380px]
    2xl:min-w-[540px]
    flex-col
    overflow-y-auto
    scrollbar-hide
  `}
>

  <div
  className="
    min-h-[44px] sm:min-h-[48px]
    rounded-[15px]
    border
    flex items-center justify-center
    text-center
    px-3
    py-2
    text-sm sm:text-base
    leading-tight
    font-semibold
  "
  style={{
    backgroundColor: isSent ? "#B5ECC926" : "#F8F8F8",
    borderColor: isSent ? "#22C55E" : "#818181",
    color: isSent ? "#22C55E" : "#818181",
  }}
>
  {isSent ? "Envoyé" : "En attente de vérification"}
</div>

<div className="mt-8">
  <TextArea
    label="Message narratif"
    value={narrativeMessage}
    onChange={(e) => setNarrativeMessage(e.target.value)}
    height="h-[140px]"
  />
</div>
  {/* MonthPicker */}
  <div className="mt-6 w-full">
    <MonthPicker onChange={handleMonthChange} />
  </div>

  {/* Boutons */}
<div className="mt-6 flex flex-col sm:flex-row xl:flex-col gap-2 w-full">

    <div className="xl:hidden">
      <Button
        title="Prévoir le rapport"
        variant="telecharger"
        onClick={() => setShowPreview(true)}
        noPadding
      />
    </div>

    <Button
      title="Télécharger PDF"
      icon={Download}
      iconPosition="left"
      variant="telecharger"
       noPadding
    />
 

 {!isSent && (
  <Button
    title="Confirmer et envoyer"
    variant="primary"
    noPadding
    onClick={() => {
      // Ici tu pourras appeler ton API
      setIsSent(true);
    }}
  />
)}
 
</div>
</div>
        </div>
      </main>
    </div>
  );
};

export default RapportBilan;



