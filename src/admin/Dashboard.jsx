import Sidebar from "../components/Sidebar";

import WelcomeCard from "../components/WelcomeCard";
import AlertBanner from "../components/AlertBanner";

import FamilyStatusCard from "../components/FamilyStatusCard";
import VisitsCard from "../components/VisitsCard";
import NutritionCard from "../components/NutritionCard";
import DistributionCard from "../components/DistributionCard";
import CoordinatorCard from "../components/CoordinatorCard";
import ZakatCard from "../components/ZakatCard";
import DonorCard from "../components/DonorCard";

import AttentionIcon from "../assets/Attention.svg";
import RetardIcon from "../assets/retard.svg";

const Dashboard = () => {
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
    subtitle: "Produits",
    cpt: 3,
    bgColor: "#FFF7F7",
    iconBgColor: "#FDE8E8",
    borderColor: "#EB5757",
    leftborder: "#EB5757",
  },
  {
    id: 2,
    icon: AttentionIcon,
    title: "Malnutrition aiguë sévère",
    subtitle: "Nourrissons",
    cpt: 5,
    bgColor: "#FFF7F7",
    iconBgColor: "#FDE8E8",
    borderColor: "#EB5757",
    leftborder: "#EB5757",
  },
  {
    id: 3,
    icon: RetardIcon,
    title: "Visites en retard",
    subtitle: "Visites",
    cpt: 8,
    bgColor: "#FFFBF1",
    iconBgColor: "#FFF0CC",
    borderColor: "#F2B94B",
    leftborder: "#F2B94B",
  },
];

/* ==========================
    Family Status
========================== */

const familyStatusTitle = "Statut des familles";

const familyStats = [
  {
    id: 1,
    value: 98,
    label: "Active",
    color: "#4E9F8A",
    borderColor: "#4E9F8A",
  },
  {
    id: 2,
    value: 26,
    label: "En attente",
    color: "#F2B94B",
    borderColor: "#F2B94B",
  },
  {
    id: 3,
    value: 9,
    label: "Inactive",
    color: "#EB5757",
    borderColor: "#EB5757",
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
  /* ==========================
      Handlers
  ========================== */

  const handleNotifications = () => {};

  const handleSettings = () => {};

  const handleAlertClick = (alert) => {
    console.log(alert);
  };

  return (
  <div className="min-h-screen">

    <div
      className="
        flex
        flex-col
        lg:flex-row
        gap-[30px]
        p-[18px]
        pt-[32px]
      "
    >

      <Sidebar role="admin" />


      <main
        className="
          flex-1
          flex
          flex-col
          gap-[25px]
        "
      >


        {/* ================= MOBILE HEADER ================= */}

        <div className="lg:hidden">
          <WelcomeCard
            userName={userName}
            subtitle={subtitle}
            NotificationCount={notificationCount}
            onNotificationClick={handleNotifications}
            onSettingsClick={handleSettings}
          />
        </div>



        {/* ================= DESKTOP WELCOME ================= */}

        <div className="hidden lg:block">

          <WelcomeCard
            userName={userName}
            subtitle={subtitle}
            NotificationCount={notificationCount}
            onNotificationClick={handleNotifications}
            onSettingsClick={handleSettings}
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
          "
        >

          {alerts.map((alert)=>(
            <AlertBanner
              key={alert.id}
              icon={alert.icon}
              title={alert.title}
              subtitle={alert.subtitle}
              bgColor={alert.bgColor}
              iconBgColor={alert.iconBgColor}
              borderColor={alert.borderColor}
              leftborder={alert.leftborder}
              cpt={alert.cpt}
              onClick={()=>handleAlertClick(alert)}
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
            onClick={()=>console.log("Family")}
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
            onClick={()=>console.log("Distribution")}
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
            title={zakatTitle}
            remainingBalanceMRU={remainingBalanceMRU}
            remainingBalanceEUR={remainingBalanceEUR}
            monthlyDistributedMRU={monthlyDistributedMRU}
            monthlyDistributedEUR={monthlyDistributedEUR}
            beneficiaryFamilies={beneficiaryFamilies}
            exchangeRate={exchangeRate}
            onClick={()=>console.log("Zakat")}
          />



          <DonorCard
            title={donorTitle}
            totalDonors={totalDonors}
            activeDonors={activeDonors}
            newDonorsThisMonth={newDonorsThisMonth}
            onClick={()=>console.log("Donors")}
          />



          <CoordinatorCard
            title={coordinatorTitle}
            manageText={manageCoordinatorText}
            coordinatorCount={coordinatorCount}
            coordinatorLabel={coordinatorLabel}
            lastConnection={lastConnection}
            lastConnectionLabel={lastConnectionLabel}
            valueColor="#69B89C"
            onClick={()=>console.log("Coordinator")}
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
              onClick={()=>console.log("Family")}
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
              onClick={()=>console.log("Distribution")}
            />


            <CoordinatorCard
              title={coordinatorTitle}
              manageText={manageCoordinatorText}
              coordinatorCount={coordinatorCount}
              coordinatorLabel={coordinatorLabel}
              lastConnection={lastConnection}
              lastConnectionLabel={lastConnectionLabel}
              valueColor="#69B89C"
              onClick={()=>console.log("Coordinator")}
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
              title={zakatTitle}
              remainingBalanceMRU={remainingBalanceMRU}
              remainingBalanceEUR={remainingBalanceEUR}
              monthlyDistributedMRU={monthlyDistributedMRU}
              monthlyDistributedEUR={monthlyDistributedEUR}
              beneficiaryFamilies={beneficiaryFamilies}
              exchangeRate={exchangeRate}
              onClick={()=>console.log("Zakat")}
            />


            <DonorCard
              title={donorTitle}
              totalDonors={totalDonors}
              activeDonors={activeDonors}
              newDonorsThisMonth={newDonorsThisMonth}
              onClick={()=>console.log("Donors")}
            />


          </div>

        </div>


      </main>

    </div>

  </div>
);
};

export default Dashboard;