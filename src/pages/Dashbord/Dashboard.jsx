import Sidebar from "../../components/Sidebar/Sidebar";

import PopupStockBas from "../../components/Popups/PopupStockBas";

import WelcomeCard from "../../components/DashbordCard/WelcomeCard";
import AlertBanner from "../../components/AlertComposant/AlertBanner";

import FamilyStatusCard from "../../components/DashbordCard/FamilyStatusCard";
import VisitsCard from "../../components/DashbordCard/VisitsCard";
import NutritionCard from "../../components/DashbordCard/NutritionCard";
import DistributionCard from "../../components/DashbordCard/DistributionCard";
import CoordinatorCard from "../../components/DashbordCard/CoordinatorCard";
import ZakatCard from "../../components/DashbordCard/ZakatCard";
import DonorCard from "../../components/DashbordCard/DonorCard";
import PopupRetard from "../../components/Popups/Popupvisiteretard";
import PopupMas from "../../components/Popups/PopupMas";

import AttentionIcon from "../../assets/Attention.svg";
import RetardIcon from "../../assets/retard.svg";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PopupDistribution from "../../components/Popups/Popupdistributions";

const Dashboard = () => {
     const navigate = useNavigate();
     const [showHistorique, setShowHistorique] = useState(false);
     
    
  /* ==========================
    Welcome
========================== */

const userName = "Mohammed";
const subtitle = "Voici un aperçu des activités de votre association.";
const notificationCount = 2;

/* ==========================
    Alerts
========================== */

const alerts = [
  {
    id: 1,
    icon: AttentionIcon,
    title: "Stock bas",
    subtitle: "produits à vérifier",
    count: 3,
    bgColor: "#FFF7F7",
    iconBgColor: "#FDE8E8",
    borderColor: "#EB5757",
    hasLeftBorder: true,
  },
  {
    id: 2,
    icon: AttentionIcon,
    title: "Malnutrition Aiguë Sévère",
    subtitle: "nourrissons",
    count: 2,
    bgColor: "#FFF7F7",
    iconBgColor: "#FDE8E8",
    borderColor: "#EB5757",
    hasLeftBorder: false,
  },
  {
    id: 3,
    icon: RetardIcon,
    title: "Visites en retard",
    subtitle: "visites en retard",
    count: 5,
    bgColor: "#FFFBF1",
    iconBgColor: "#FFF0CC",
    borderColor: "#F2B94B",
    hasLeftBorder: false,
  },
];

const [showBas, setShowBas] = useState(false);

/* ==========================
    Family Status
========================== */

const familyStatusTitle = "Statut des familles";

const familyStats = [
  {
      id: 1,
      value: 38,
      label: "Actives",
      color: "#22C55E",
      borderColor: "#22C55E",
    },
    {
      id: 2,
      value: 1,
      label: "Alertées",
      color: "#F59E0B",
      borderColor: "#F59E0B",
    },
    {
      id: 3,
      value: 5,
      label: "Sorties",
      color: "#6D6D6D",
      borderColor: "#6D6D6D",
    },
];

/* ==========================
    Visits
========================== */

const visitsTitle = "Visites";

const completedVisits = 58;
const expectedVisits = 70;
const compliancePercentage = 83;

/* ==========================
    Nutrition
========================== */

const nutritionTitle = "État nutritionnel";

const normalPercentage = 72;
const mamPercentage = 18;
const masPercentage = 10;

/* ==========================
    Distribution
========================== */

const distributionTitle = "Distribution";

const products = [
  {
    id: 1,
    name: "Farine",
    quantity: "250 Kg",
  },
  {
    id: 2,
    name: "Huile",
    quantity: "180 L",
  },
  {
    id: 3,
    name: "Sucre",
    quantity: "320 Kg",
  },
  {
    id: 4,
    name: "Riz",
    quantity: "150 Kg",
  },
];

const lowStockProducts = [
  {
    id: 1,
    name: "Farine",
    quantity: 25,
    unit: "Kg",
  },
  {
    id: 2,
    name: "Huile",
    quantity: 18,
    unit: "L",
  },
  {
    id: 3,
    name: "Sucre",
    quantity: 12,
    unit: "Kg",
  },
  {
    id: 4,
    name: "Riz",
    quantity: 15,
    unit: "Kg",
  },
];

 const distributionHistory = [
  {
    id: 1,
    enfant: "Aïcha Mint Mohamed",
    code: "GDK-2026-003",
    distribution: "Distribution numéro 02",
    date: "15/05/2026",
    produits: products,
  },
];

/* ==========================
    Coordinators
========================== */

const coordinatorTitle = "Coordinateurs";

const coordinatorCount = 12;
const coordinatorLabel = "Coordinateurs";

const lastConnection = "Aujourd'hui";
const lastConnectionLabel = "Dernière connexion";

const manageCoordinatorText = "Gérer";

/* ==========================
    Zakat
========================== */

const zakatTitle = "Zakat";

const remainingBalanceMRU = "52 000";
const remainingBalanceEUR = "/500 Euros";

const monthlyDistributedMRU = "18 500";
const monthlyDistributedEUR = "/180 Euros";

const beneficiaryFamilies = "38";

const exchangeRate = "1€ = 103.5 MRU";

/* ==========================
    Donors
========================== */

const donorTitle = "Donateurs";

const totalDonors = 185;
const activeDonors = 134;
const newDonorsThisMonth = 18;


const [showRetard, setShowRetard] = useState(false);

const familleRetard = [
  {
    id: 1,
    sexe: "Fille",
    enfant: "Aïcha Mint Mohamed",
    region: "Lexeiba",
    naissance: "12 mars 2026",
    code: "GDK-2026-003",
    badges: [
      { type: "mam", text: "MAM nourrisson" },
      { type: "mere", text: "Mère normale" },
      { type: "retard", text: "Visite en retard" },
    ],
  },
  
];

const [showMas, setShowMas] = useState(false); 

const familleMas = [
  {
    id: 1,
    sexe: "Fille",
    enfant: "Aïcha Mint Mohamed",
    region: "Lexeiba",
    naissance: "12 mars 2026",
    code: "GDK-2026-003",
    badges: [
      { type: "mas", text: "MAS sévère" },
      { type: "mere", text: "Mère normale" },
    ],
  },
];

  /* ==========================
      Handlers
  ========================== */

  const handleNotifications = () => {};

  const handleSettings = () => {};
const handleAlertClick = (alert) => {
  switch (alert.id) {
    case 1:
      setShowBas(true);
      break;

    case 2:
      setShowMas(true);
      break;

    case 3:
      setShowRetard(true);
      break;

    default:
      console.log(alert);
      break;
  }
};

  return (
    <div className="flex h-screen overflow-hidden bg-white">
        {/* Sidebar */}
      
         <Sidebar
  role="admin"
  user={{
    nom: "Ahmed Mohamed",
    id: "admin",
    email: "ahmed.mohamed@gmail.com",
    telephone: "+222 00 00 00 00",
    profilePicture: "",
  }}
/>
      

      <main className="flex-1 overflow-y-auto px-5 pt-18 md:pt-0 pb-8 lg:p-10 bg-white">


        {/* ================= DESKTOP WELCOME ================= */}

        <div className="hidden lg:block">

          <WelcomeCard
            userName={userName}
            subtitle={subtitle}
            NotificationCount={notificationCount}
            onNotificationClick={handleNotifications}
            onSettingsClick={() => navigate("/parametres")}
          />

        </div>



        {/* ================= ALERTS ================= */}

        <div
          className="
            flex
            flex-col
            gap-[8px]
            lg:grid
            lg:grid-cols-3
            pt-3
            pb-3
          "
        >

          {alerts.map((alert) => (
            <AlertBanner
              key={alert.id}
              icon={alert.icon}
              title={alert.title}
              subtitle={alert.subtitle}
              count={alert.count}
              bgColor={alert.bgColor}
              iconBgColor={alert.iconBgColor}
              borderColor={alert.borderColor}
              hasLeftBorder={alert.hasLeftBorder}
              onClick={() => handleAlertClick(alert)}
            />
          ))}

        </div>




        {/* ================= MOBILE ORDER ================= */}

        <div
          className="
            flex
            flex-col
            gap-[18px]
            lg:hidden
          "
        >


          <FamilyStatusCard
              title={familyStatusTitle}
              stats={familyStats}
             onClick={() => navigate(`/famille/${id}`, { state: { from: "/dashboard" } })}
           />


          <NutritionCard
            title={nutritionTitle}
            normalPercentage={normalPercentage}
            mamPercentage={mamPercentage}
            masPercentage={masPercentage}
            normalColor="#69B89C"
            mamColor="#F4B860"
            masColor="#EB5757"
            trackColor="#E8ECEF"
            onClick={()=>console.log("Nutrition")}
          />

          <DistributionCard
            title={distributionTitle}
            products={products}
            dividerColor="#73C8C5"
            viewAllText="Voir tous"
            onClick={() => navigate("/liste-distributions")}
            onViewAllClick={() => setShowHistorique(true)}
          />


          <VisitsCard
            title={visitsTitle}
            completedVisits={completedVisits}
            expectedVisits={expectedVisits}
            compliancePercentage={compliancePercentage}
            progressValue={compliancePercentage}
            progressMax={100}
            fillColor="#69B89C"
            trackColor="#E8ECEF"
            onClick={()=>console.log("Visits")}
          />


          <ZakatCard
            variant="admin"
            title="Zakat aid"
            remainingBalanceMRU="34 000,00 MRU"
            remainingBalanceEUR="500 Euros"
            monthlyDistributedMRU="15 000 MRU"
            monthlyDistributedEUR="220 Euros"
            beneficiaryFamilies="42"
            exchangeRate="1 € = 68 MRU"
          />


          <DonorCard
            title={donorTitle}
            totalDonors={totalDonors}
            activeDonors={activeDonors}
            newDonorsThisMonth={newDonorsThisMonth}
           onClick={() => navigate("/liste-Donateurs")}
          />



          <CoordinatorCard
            title={coordinatorTitle}
            manageText={manageCoordinatorText}
            coordinatorCount={coordinatorCount}
            coordinatorLabel={coordinatorLabel}
            lastConnection={lastConnection}
            lastConnectionLabel={lastConnectionLabel}
            valueColor="#69B89C"
            onClick={() => navigate("/liste-coordinateurs")}
          />

        </div>





        {/* ================= DESKTOP GRID ================= */}

        <div
          className="
            hidden
            lg:grid
            grid-cols-[1.2fr_1fr]
            gap-[18px]
          "
        >


          <div className="flex flex-col gap-[18px]">

            <FamilyStatusCard
              title={familyStatusTitle}
              stats={familyStats}
              onClick={() => navigate("/liste-famille")}
            />


            <NutritionCard
              title={nutritionTitle}
              normalPercentage={normalPercentage}
              mamPercentage={mamPercentage}
              masPercentage={masPercentage}
              normalColor="#69B89C"
              mamColor="#F4B860"
              masColor="#EB5757"
              trackColor="#E8ECEF"
              onClick={()=>console.log("Nutrition")}
            />


          <DistributionCard
           title={distributionTitle}
            products={products}
            dividerColor="#73C8C5"
            viewAllText="Voir tous"
            onClick={() => navigate("/liste-distributions")}
            onViewAllClick={() => setShowHistorique(true)}
          />


            <CoordinatorCard
              title={coordinatorTitle}
              manageText={manageCoordinatorText}
              coordinatorCount={coordinatorCount}
              coordinatorLabel={coordinatorLabel}
              lastConnection={lastConnection}
              lastConnectionLabel={lastConnectionLabel}
              valueColor="#69B89C"
               onClick={() => navigate("/liste-coordinateurs")}
            />

          </div>



          <div className="flex flex-col gap-[18px]">


            <VisitsCard
              title={visitsTitle}
              completedVisits={completedVisits}
              expectedVisits={expectedVisits}
              compliancePercentage={compliancePercentage}
              progressValue={compliancePercentage}
              progressMax={100}
              fillColor="#69B89C"
              trackColor="#E8ECEF"
              onClick={()=>console.log("Visits")}
            />


            <ZakatCard
              variant="admin"
              title="Zakat aid"
              remainingBalanceMRU="34 000,00 MRU"
              remainingBalanceEUR="500 Euros"
              monthlyDistributedMRU="15 000 MRU"
              monthlyDistributedEUR="220 Euros"
              beneficiaryFamilies="42"
              exchangeRate="1 € = 68 MRU"
            />


            <DonorCard
              title={donorTitle}
              totalDonors={totalDonors}
              activeDonors={activeDonors}
              newDonorsThisMonth={newDonorsThisMonth}
              onClick={() => navigate("/liste-Donateurs")}
            />


          </div>

        </div>


      </main>

    {showHistorique && (
  <PopupDistribution
    title="Distributions ce mois"
    items={[
      { name: "Farine", value: 250, unit: "Kg" },
      { name: "Huile", value: 180, unit: "L" },
      { name: "Sucre", value: 320, unit: "Kg" },
      { name: "Riz", value: 150, unit: "Kg" },
      { name: "Riz", value: 150, unit: "Kg" },
      { name: "Huile", value: 180, unit: "L" },
      { name: "Huile", value: 180, unit: "L" },
    ]}
    onClose={() => setShowHistorique(false)}
  />
)}
<PopupRetard
  open={showRetard}
  onClose={() => setShowRetard(false)}
  familleretard={familleRetard}
/>
<PopupMas
  open={showMas}
  onClose={() => setShowMas(false)}
  familleMas={familleMas}
/>

<PopupStockBas
  isOpen={showBas}
  onClose={() => setShowBas(false)}
  products={lowStockProducts}
  onGoToStock={() => {
    setShowBas(false);
  }}
/>

  </div>
);
};

export default Dashboard;
