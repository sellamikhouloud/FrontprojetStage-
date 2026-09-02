import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../../components/Providers/AuthProvider";

import { getDashboard } from "@/lib/api/dashboard";

import Sidebar from "../../components/Sidebar/Sidebar";

import Spinner from "../../components/Spinner";

import PopupStockBas from "../../components/Popups/PopupStockBas";
import PopupRetard from "../../components/Popups/Popupvisiteretard";
import PopupMas from "../../components/Popups/PopupMas";
import PopupDistribution from "../../components/Popups/Popupdistributions";

import WelcomeCard from "../../components/DashbordCard/WelcomeCard";
import FamilyStatusCard from "../../components/DashbordCard/FamilyStatusCard";
import VisitsCard from "../../components/DashbordCard/VisitsCard";
import NutritionCard from "../../components/DashbordCard/NutritionCard";
import DistributionCard from "../../components/DashbordCard/DistributionCard";
import CoordinatorCard from "../../components/DashbordCard/CoordinatorCard";
import ZakatCard from "../../components/DashbordCard/ZakatCard";
import DonorCard from "../../components/DashbordCard/DonorCard";

import AlertBanner from "../../components/AlertComposant/AlertBanner";

import { getNotifications } from "@/lib/api/Notifications";

import AttentionIcon from "../../assets/Attention.svg";
import RetardIcon from "../../assets/retard.svg";

const Dashboard = () => {
  const navigate = useNavigate();

  const { user, ready } = useAuth();

  // =========================================================
  // POPUPS
  // =========================================================

  const [showHistorique, setShowHistorique] = useState(false);
  const [showBas, setShowBas] = useState(false);
  const [showRetard, setShowRetard] = useState(false);
  const [showMas, setShowMas] = useState(false);

  // =========================================================
  // USER INFORMATION
  // =========================================================

  const userName =
    [user?.prenom, user?.nom].filter(Boolean).join(" ") ||
    user?.username ||
    "Utilisateur";

  const subtitle =
    "Voici un aperçu des activités de votre association.";

    const {
      data: notifications = [],
    } = useQuery({
      queryKey: ["notifications"],
      queryFn: () =>
        getNotifications().then((res) => res.data),
      enabled: ready && !!user,
    });

    const notificationCount = notifications.length;

  // =========================================================
  // DASHBOARD API
  // =========================================================

  const {
    data: dashboardData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await getDashboard();

      console.log(
        "Dashboard admin response :",
        response.data
      );

      return response.data;
    },
    enabled: ready && !!user,
    retry: 1,
  });

  // =========================================================
  // LOADING
  // =========================================================

  if (!ready || isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-white">
        <Sidebar
          role={user?.role || "admin"}
          user={user}
        />

        <main className="flex-1 flex items-center justify-center bg-white px-5">
          <div className="flex flex-col items-center gap-3 text-center">
            <Spinner />

            <p className="text-gray-500 text-sm">
              Chargement du tableau de bord...
            </p>
          </div>
        </main>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (isError || !dashboardData) {
    const backendError =
      error?.response?.data?.detail ||
      error?.response?.data?.message;

    return (
      <div className="flex h-screen overflow-hidden bg-white">
        <Sidebar
          role={user?.role || "admin"}
          user={user}
        />

        <main className="flex-1 flex items-center justify-center bg-white px-5">
          <div className="flex flex-col items-center gap-4 text-center max-w-md">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
              <img
                src={AttentionIcon}
                alt="Erreur"
                className="w-7 h-7"
              />
            </div>

            <p className="text-red-500 font-medium">
              {backendError ||
                "Impossible de charger le tableau de bord."}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="
                px-5
                py-2
                rounded-lg
                bg-[#69B89C]
                text-white
                text-sm
                font-medium
                hover:opacity-90
                transition
              "
            >
              Réessayer
            </button>
          </div>
        </main>
      </div>
    );
  }

  // =========================================================
  // BACKEND DATA
  // =========================================================

  const alertes = dashboardData?.alertes || {};

  const stockAlerts =
    alertes?.stock?.alertes || [];

  const malnutritionAlerts =
    alertes?.malnutrition?.alertes || [];

  const retardAlerts =
    alertes?.visite_retard?.alertes || [];

  const stockAlertCount =
    alertes?.stock?.nb_alertes || 0;

  const malnutritionAlertCount =
    alertes?.malnutrition?.nb_alertes || 0;

  const retardAlertCount =
    alertes?.visite_retard?.nb_alertes || 0;

  const familles =
    dashboardData?.familles || {};

  const nutritionStatuses =
    dashboardData?.statut_nutritionnel || [];

  const visites =
    dashboardData?.visites || {};

  const distributions =
    dashboardData?.distributions || {};

  const zakat =
    dashboardData?.zakat || {};

  const coordinateurs =
    dashboardData?.coordinateurs || {};

  const donateurs =
    dashboardData?.donateurs || {};

  // =========================================================
  // ALERTS
  // =========================================================

  const allAlerts = [
    {
      id: 1,
      icon: AttentionIcon,
      title: "Stock bas",
      subtitle: "produits à vérifier",
      count: stockAlertCount,
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
      count: malnutritionAlertCount,
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
      count: retardAlertCount,
      bgColor: "#FFFBF1",
      iconBgColor: "#FFF0CC",
      borderColor: "#F2B94B",
      hasLeftBorder: false,
    },
  ];

  // =========================================================
  // ONLY SHOW ALERTS WITH COUNT > 0
  // =========================================================

  const alerts = allAlerts.filter(
    (alert) => alert.count > 0
  );

  // =========================================================
  // FAMILY STATUS
  // =========================================================

  const familyStats = [
    {
      id: 1,
      value: familles?.nb_actives || 0,
      label: "Actives",
      color: "#22C55E",
      borderColor: "#22C55E",
    },

    {
      id: 2,
      value: familles?.nb_alertees || 0,
      label: "Alertées",
      color: "#F59E0B",
      borderColor: "#F59E0B",
    },

    {
      id: 3,
      value: familles?.nb_sortie || 0,
      label: "Sorties",
      color: "#6D6D6D",
      borderColor: "#6D6D6D",
    },
  ];

  // =========================================================
  // VISITS
  // =========================================================

  const completedVisits =
    visites?.nb_realisees || 0;

  const expectedVisits =
    visites?.nb_prevus || 0;

  const compliancePercentage =
    expectedVisits > 0
      ? Math.round(
          (completedVisits / expectedVisits) * 100
        )
      : 0;

  // =========================================================
  // NUTRITION
  // =========================================================

  const normalPercentage = Number(
    nutritionStatuses.find(
      (item) => item?.statut === "normale"
    )?.pourcentage || 0
  );

  const mamPercentage = Number(
    nutritionStatuses.find(
      (item) => item?.statut === "mam"
    )?.pourcentage || 0
  );

  const masPercentage = Number(
    nutritionStatuses.find(
      (item) => item?.statut === "mas"
    )?.pourcentage || 0
  );

  // =========================================================
  // DISTRIBUTION
  // =========================================================

  const products = Object.entries(
    distributions || {}
  ).map(([name, data], index) => ({
    id: index + 1,
    name,
    quantity: data?.quantite ?? 0,
    unit: data?.unite || "",
  }));

  const distributionHistory =
    Object.entries(distributions || {}).map(
      ([name, data], index) => ({
        id: index + 1,
        name,
        value: data?.quantite ?? 0,
        unit: data?.unite || "",
      })
    );

  // =========================================================
  // LOW STOCK
  // =========================================================

  const lowStockProducts = stockAlerts.map(
    (alert, index) => ({
      id: alert?.id || index + 1,
      name: alert?.message || "Produit",
      quantity: alert?.quantite ?? "",
      unit: alert?.unite || "",
    })
  );

  // =========================================================
  // COORDINATORS
  // =========================================================

  const coordinatorCount =
    coordinateurs?.nb_coordinateur || 0;

  const lastConnection =
    coordinateurs?.derniere_connexion?.last_login
      ? new Date(
          coordinateurs.derniere_connexion.last_login
        ).toLocaleString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Aucune connexion";

 // =====================================================
// ZAKAT
// =====================================================

const zakatTitle = "Zakat";

const exchangeRate = zakat?.taux_change_actuel ?? 0;

// Solde restant
const remainingBalanceMRUValue = Number(
  zakat?.solde_restant ?? 0
);

const remainingBalanceEURValue =
  remainingBalanceMRUValue * Number(exchangeRate);

// Montant versé ce mois
const monthlyDistributedMRUValue = Number(
  zakat?.montant_total_verse_ce_mois ?? 0
);

const monthlyDistributedEURValue =
  monthlyDistributedMRUValue * Number(exchangeRate);

const remainingBalanceMRU = `${remainingBalanceMRUValue.toFixed(2)} MRU`;

const remainingBalanceEUR =
  `${remainingBalanceEURValue.toFixed(2)} EUR`;

const monthlyDistributedMRU =
  `${monthlyDistributedMRUValue.toFixed(2)} MRU`;

const monthlyDistributedEUR =
  `${monthlyDistributedEURValue.toFixed(2)} EUR`;

const beneficiaryFamilies =
  zakat?.nb_familles_ce_mois ?? 0;

const exchangeRateValue =
  zakat?.taux_change_actuel ?? "";

  // =========================================================
  // DONORS
  // =========================================================

  const totalDonors =
    donateurs?.nb_total || 0;

  const activeDonors =
    donateurs?.nb_actifs || 0;

  const newDonorsThisMonth =
    donateurs?.nb_nouveaux_ce_mois || 0;

  // =========================================================
  // POPUP MAS
  // =========================================================

  const familleMas = malnutritionAlerts.map(
    (alert, index) => ({
      id: alert?.id || index + 1,
      famille: alert?.famille,
      visite: alert?.visite,
      ...alert,
    })
  );

  // =========================================================
  // POPUP VISITES EN RETARD
  // =========================================================

  const familleRetard = retardAlerts.map(
    (alert, index) => ({
      id: alert?.id || index + 1,
      famille: alert?.famille,
      visite: alert?.visite,
      ...alert,
    })
  );

  // =========================================================
  // HANDLERS
  // =========================================================

  const handleAlertClick = (alert) => {
    switch (alert.id) {
      case 1:
        if (stockAlerts.length > 0) {
          setShowBas(true);
        }
        break;

      case 2:
        if (malnutritionAlerts.length > 0) {
          setShowMas(true);
        }
        break;

      case 3:
        if (retardAlerts.length > 0) {
          setShowRetard(true);
        }
        break;

      default:
        break;
    }
  };

  // =========================================================
  // COMMON CARDS
  // =========================================================

  const familyStatusCard = (
    <FamilyStatusCard
      title="Statut des familles"
      stats={familyStats}
      onClick={() =>
        navigate("/liste-famille")
      }
    />
  );

  const nutritionCard = (
    <NutritionCard
      title="État nutritionnel"
      normalPercentage={normalPercentage}
      mamPercentage={mamPercentage}
      masPercentage={masPercentage}
      normalColor="#69B89C"
      mamColor="#F4B860"
      masColor="#EB5757"
      trackColor="#E8ECEF"
      onClick={() =>
        console.log("Nutrition")
      }
    />
  );

  const distributionCard = (
    <DistributionCard
      title="Distribution"
      products={products}
      dividerColor="#4E9F8A"
      viewAllText="Voir tous"
      onClick={() =>
        navigate("/liste-distributions")
      }
      onViewAllClick={() =>
        setShowHistorique(true)
      }
    />
  );

  const visitsCard = (
    <VisitsCard
      title="Visites"
      completedVisits={completedVisits}
      expectedVisits={expectedVisits}
      compliancePercentage={compliancePercentage}
      progressValue={compliancePercentage}
      progressMax={100}
      fillColor="#69B89C"
      trackColor="#E8ECEF"
      onClick={() =>
        navigate("/liste-visite")
      }
    />
  );

  const zakatCard = (
    <ZakatCard
      variant="admin"
      title="Zakat"
      remainingBalanceMRU={remainingBalanceMRU}
      remainingBalanceEUR={remainingBalanceEUR}
      monthlyDistributedMRU={monthlyDistributedMRU}
      monthlyDistributedEUR={monthlyDistributedEUR}
      beneficiaryFamilies={beneficiaryFamilies}
      exchangeRate={exchangeRate}
      onClick={() =>
        navigate(
          "/zakat"
          )
      }
    />
  );

  const donorCard = (
    <DonorCard
      title="Donateurs"
      totalDonors={totalDonors}
      activeDonors={activeDonors}
      newDonorsThisMonth={newDonorsThisMonth}
      onClick={() =>
        navigate("/liste-Donateurs")
      }
    />
  );

  const coordinatorCard = (
    <CoordinatorCard
      title="Coordinateurs"
      manageText="Gérer les utilisateurs"
      coordinatorCount={
        dashboardData?.coordinateurs?.nb_coordinateur ?? 0
      }
      coordinatorLabel="Coordinateurs"
      chefCoordinatorCount={
        dashboardData?.coordinateurs?.nb_chef_coordinateur ?? 0
      }
      chefCoordinatorLabel="Chefs coordinateurs"
      Color="#69B89C"
      onClick={() => navigate("/liste-coordinateurs")}
    />
  );


  return (
    <div className="flex h-screen overflow-hidden bg-white">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar
        role={user?.role || "admin"}
        user={user}
      />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className="
          flex-1
          min-w-0
          overflow-y-auto
          bg-white
          px-5
          pt-[72px]
          pb-8
          md:px-6
          md:pt-0
          md:pb-8
          lg:px-10
          lg:py-10
        "
      >

        {/* ===================================================
            WELCOME
        =================================================== */}

        <div className="hidden md:block">
          <WelcomeCard
            userName={userName}
            subtitle={subtitle}
            notificationCount={notificationCount}
            onNotificationClick={() =>
              navigate("/notifications")
            }
            onSettingsClick={() =>
              navigate("/parametres")
            }
          />
        </div>

{/* ===================================================
    ALERTS
=================================================== */}

{alerts.length > 0 && (
  <div
    className={`
      grid
      w-full
      gap-[8px]
      pt-3
      pb-3
      ${
        alerts.length === 1
          ? "grid-cols-1"
          : alerts.length === 2
            ? "grid-cols-2"
            : "grid-cols-3"
      }
      md:gap-3
      lg:gap-[18px]
    `}
  >
    {alerts.map((alert) => (
      <div
        key={alert.id}
        className="w-full min-w-0"
      >
        <AlertBanner
          icon={alert.icon}
          title={alert.title}
          subtitle={alert.subtitle}
          count={alert.count}
          bgColor={alert.bgColor}
          iconBgColor={alert.iconBgColor}
          borderColor={alert.borderColor}
          hasLeftBorder={alert.hasLeftBorder}
          onClick={() =>
            handleAlertClick(alert)
          }
        />
      </div>
    ))}
  </div>
)}


        {/* ===================================================
            MOBILE
            < 768px
        =================================================== */}

        <div
          className="
            flex
            flex-col
            gap-[18px]
            md:hidden
          "
        >
          {familyStatusCard}
          {nutritionCard}
          {distributionCard}
          {visitsCard}
          {zakatCard}
          {donorCard}
          {coordinatorCard}
        </div>

        {/* ===================================================
            TABLET + DESKTOP
            >= 768px
        =================================================== */}

        <div
          className="
            hidden
            md:grid
            grid-cols-1
            gap-[18px]
            lg:grid-cols-[1.2fr_1fr]
          "
        >

          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <div className="flex flex-col gap-[18px]">
            {familyStatusCard}
            {nutritionCard}
            {distributionCard}
            {coordinatorCard}
          </div>

          {/* =================================================
              RIGHT COLUMN
          ================================================= */}

          <div className="flex flex-col gap-[18px]">
            {visitsCard}
            {zakatCard}
            {donorCard}
          </div>
        </div>
      </main>

      {/* =====================================================
          DISTRIBUTION POPUP
      ===================================================== */}

      {showHistorique && (
        <PopupDistribution
          title="Distributions ce mois"
          items={distributionHistory}
          onClose={() =>
            setShowHistorique(false)
          }
        />
      )}

      {/* =====================================================
          VISITES EN RETARD POPUP
      ===================================================== */}

      <PopupRetard
        open={showRetard}
        onClose={() =>
          setShowRetard(false)
        }
        familleretard={familleRetard}
      />

      {/* =====================================================
          MALNUTRITION AIGUË SÉVÈRE POPUP
      ===================================================== */}

      <PopupMas
        open={showMas}
        onClose={() =>
          setShowMas(false)
        }
        familleMas={familleMas}
      />

      {/* =====================================================
          STOCK BAS POPUP
      ===================================================== */}

      <PopupStockBas
        isOpen={showBas}
        onClose={() =>
          setShowBas(false)
        }
        products={lowStockProducts}
        onGoToStock={() => {
          setShowBas(false);
          navigate("/stock");
        }}
      />
    </div>
  );
};

export default Dashboard;
