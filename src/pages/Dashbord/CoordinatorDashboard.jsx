import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar/Sidebar";

import CoordinatorWelcomeCard from "../../components/DashbordCard/CoordinatorWelcomeCard";
import AlertBanner from "../../components/AlertComposant/AlertBanner";

import FamilyStatusCard from "../../components/DashbordCard/FamilyStatusCard";
import VisitsCard from "../../components/DashbordCard/VisitsCard";
import NutritionCard from "../../components/DashbordCard/NutritionCard";
import DistributionCard from "../../components/DashbordCard/DistributionCard";
import ZakatCard from "../../components/DashbordCard/ZakatCard";

import PopupRetard from "../../components/Popups/Popupvisiteretard";
import PopupMas from "../../components/Popups/PopupMas";
import PopupDistribution from "../../components/Popups/Popupdistributions";

import UpcomingVisitsCard from "../../components/DashbordCard/UpcomingVisitsCard";

import AttentionIcon from "../../assets/Attention.svg";
import RetardIcon from "../../assets/retard.svg";

const CoordinatorDashboard = () => {
  const navigate = useNavigate();

  /* ==========================
        STATES
  ========================== */

  const [showHistorique, setShowHistorique] = useState(false);
  const [showRetard, setShowRetard] = useState(false);
  const [showMas, setShowMas] = useState(false);

  /* ==========================
        WELCOME
  ========================== */

  const userName = "Mohammed";
  const greeting = "Bonjour";
  const message = "Bon journee !";

  /* ==========================
        ALERTS
  ========================== */

  const alerts = [
    {
      id: 2,
      icon: AttentionIcon,
      title: "Malnutrition Aiguë Sévère",
      subtitle: "nourrissons",
      count: 2,
      bgColor: "#FFF7F7",
      iconBgColor: "#FDE8E8",
      borderColor: "#EB5757",
      hasLeftBorder: true,
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
      hasLeftBorder: true,
    },
  ];

  /* ==========================
        FAMILY STATUS
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
        VISITS
  ========================== */

  const visitsTitle = "Nombre de visites";

  const completedVisits = 9;

  const expectedVisits = 21;

  const compliancePercentage = 43;

  /* ==========================
        NUTRITION
  ========================== */

  const nutritionTitle = "État nutritionnel";

  const normalPercentage = 65;

  const mamPercentage = 25;

  const masPercentage = 10;

  /* ==========================
        DISTRIBUTION
  ========================== */

  const distributionTitle = "Distributions ce mois";

  const products = [
    {
      id: 1,
      name: "Lait",
      quantity: "38 Kg",
    },
    {
      id: 2,
      name: "Céréales",
      quantity: "14 Kg",
    },
    {
      id: 3,
      name: "Huile",
      quantity: "8 L",
    },
    {
      id: 4,
      name: "Sucre",
      quantity: "8 Kg",
    },
    {
      id: 5,
      name: "Sélodié",
      quantity: "8 Kg",
    },
    {
      id: 6,
      name: "Légumineuses",
      quantity: "8 Kg",
    },
  ];

  /* ==========================
        ZAKAT
  ========================== */

  const zakatTitle = "Zakat";

  const remainingBalanceMRU = "34 000";

  const remainingBalanceEUR = "/500 Euros";

  const monthlyDistributedMRU = "18 500";

  const monthlyDistributedEUR = "/180 Euros";

  const beneficiaryFamilies = "38";

  const exchangeRate = "1€ = 103.5 MRU";

  /* ==========================
        UPCOMING VISITS
  ========================== */

  const upcomingVisits = [
    {
      day: "Aujourd'hui",
      family: "Famille Mohamed",
      village: "Guidikhama",
    },
    {
      day: "Demain",
      family: "Famille Ahmed",
      village: "Tenali",
    },
    {
      day: "Vendredi",
      family: "Famille Ali",
      village: "Sélibaby",
    },
    {
      day: "Samedi",
      family: "Famille Abdallah",
      village: "Awoycheu",
    },
  ];

  /* ==========================
        DISTRIBUTION HISTORY
  ========================== */

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
        POPUPS
  ========================== */

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
        HANDLERS
  ========================== */

  const handleNotifications = () => {};

  const handleSettings = () => {};

  const handleAlertClick = (alert) => {
    switch (alert.id) {
      case 2:
        setShowMas(true);
        break;

      case 3:
        setShowRetard(true);
        break;

      default:
        break;
    }
  };
    return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <Sidebar role="coordinator" />

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-white px-5 pt-18 pb-8 md:pt-0 lg:p-10">

        {/* ================= MOBILE HEADER ================= */}

        <div className="lg:hidden">
            <CoordinatorWelcomeCard
            greeting={greeting}
            userName={userName}
            message={message}
            />
        </div>

        {/* ================= DESKTOP HEADER ================= */}

        <div className="hidden lg:block">
            <CoordinatorWelcomeCard
            greeting={greeting}
            userName={userName}
            message={message}
            />
        </div>

        {/* ================= ALERTS ================= */}
        <h3 className="mt-2 mb-2 text-[20px] font-bold leading-[20px]">Alertes prioritaires</h3>
        <div
          className="
            flex
            flex-col
            gap-[8px]
            lg:grid
            lg:grid-cols-2
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

        <h3 className=" mb-4 text-[20px] font-bold leading-[20px]">Indications clés</h3>

        {/* ================= MOBILE ================= */}

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
            onClick={() => navigate("/liste-famille")}
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
            onClick={() => navigate("/liste-visites")}
          />

          <UpcomingVisitsCard
            visits={upcomingVisits}
            onClick={() => navigate("/liste-visites")}
          />

          <NutritionCard
            title={nutritionTitle}
            normalPercentage={normalPercentage}
            mamPercentage={mamPercentage}
            masPercentage={masPercentage}
            normalColor="#22C55E"
            mamColor="#F59E0B"
            masColor="#EF4444"
            trackColor="#E8ECEF"
            onClick={() => console.log("Nutrition")}
          />

          <DistributionCard
            title={distributionTitle}
            products={products}
            dividerColor="#4E9F8A"
            viewAllText="Voir tous"
            onClick={() => navigate("/liste-distributions")}
            onViewAllClick={() => setShowHistorique(true)}
          />

            <ZakatCard
            variant="coordinator"
            title="Zakat aid"
            remainingBalanceMRU="34 000,00 MRU"
            remainingBalanceEUR="500 Euros"
            />
        </div>
        {/* ================= DESKTOP GRID ================= */}

        <div
          className="
            hidden
            lg:grid
            grid-cols-[1.15fr_1fr]
            gap-[18px]
          "
        >
          {/* ================= LEFT COLUMN ================= */}

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
              normalColor="#22C55E"
              mamColor="#F59E0B"
              masColor="#EF4444"
              trackColor="#E8ECEF"
              onClick={() => console.log("Nutrition")}
            />

            <DistributionCard
              title={distributionTitle}
              products={products}
              dividerColor="#4E9F8A"
              viewAllText="Voir tous"
              onClick={() => navigate("/liste-distributions")}
              onViewAllClick={() => setShowHistorique(true)}
            />

            <ZakatCard
            variant="coordinator"
            title="Zakat aid"
            remainingBalanceMRU="34 000,00 MRU"
            remainingBalanceEUR="500 Euros"
            />

          </div>

          {/* ================= RIGHT COLUMN ================= */}

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
              onClick={() => navigate("/liste-visites")}
            />

            <UpcomingVisitsCard
              visits={upcomingVisits}
              onClick={() => navigate("/liste-visites")}
            />

          </div>

        </div>
                {/* ================= POPUPS ================= */}

        {showHistorique && (
          <PopupDistribution
            title="Distributions ce mois"
            items={[
              { name: "Lait", value: 38, unit: "Kg" },
              { name: "Céréales", value: 14, unit: "Kg" },
              { name: "Huile", value: 8, unit: "L" },
              { name: "Sucre", value: 8, unit: "Kg" },
              { name: "Sélodié", value: 8, unit: "Kg" },
              { name: "Légumineuses", value: 8, unit: "Kg" },
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

      </main>
    </div>
  );
};

export default CoordinatorDashboard;