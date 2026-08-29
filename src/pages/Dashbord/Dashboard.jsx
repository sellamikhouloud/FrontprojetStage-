import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/providers/AuthProvider";
import { getDashboard } from "@/lib/api/dashboard";

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
import PopupDistribution from "../../components/Popups/Popupdistributions";

import AttentionIcon from "../../assets/Attention.svg";
import RetardIcon from "../../assets/retard.svg";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // =========================================================
  // DASHBOARD API DATA
  // =========================================================

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // POPUPS
  // =========================================================

  const [showHistorique, setShowHistorique] = useState(false);
  const [showBas, setShowBas] = useState(false);
  const [showRetard, setShowRetard] = useState(false);
  const [showMas, setShowMas] = useState(false);

  // =========================================================
  // LOW STOCK COUNT
  // =========================================================

  const [lowStockCount, setLowStockCount] = useState(0);

  // =========================================================
  // USER INFORMATION
  // =========================================================

  const userName =
    [user?.prenom, user?.nom].filter(Boolean).join(" ") ||
    "Utilisateur";

  const subtitle =
    "Voici un aperçu des activités de votre association.";

  const notificationCount = 2;

  // =========================================================
  // GET DASHBOARD DATA
  // =========================================================

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getDashboard();

        setDashboardData(response.data);
      } catch (err) {
        console.error(
          "Erreur lors de la récupération du dashboard :",
          err
        );

        setError(
          err?.response?.data?.detail ||
            "Impossible de récupérer les données du tableau de bord."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-white">
        <Sidebar
          role={user?.role || "admin"}
          user={user}
        />

        <main className="flex-1 flex items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#69B89C] border-t-transparent rounded-full animate-spin" />

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

  if (error || !dashboardData) {
    return (
      <div className="flex h-screen overflow-hidden bg-white">
        <Sidebar
          role={user?.role || "admin"}
          user={user}
        />

        <main className="flex-1 flex items-center justify-center bg-white px-5">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
              <img
                src={AttentionIcon}
                alt="Erreur"
                className="w-7 h-7"
              />
            </div>

            <p className="text-red-500 font-medium">
              {error ||
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

  const alertes = dashboardData.alertes || {};

  const stockAlerts =
    alertes.stock?.alertes || [];

  const malnutritionAlerts =
    alertes.malnutrition?.alertes || [];

  const retardAlerts =
    alertes.visite_retard?.alertes || [];

  const malnutritionAlertCount =
    alertes.malnutrition?.nb_alertes || 0;

  const retardAlertCount =
    alertes.visite_retard?.nb_alertes || 0;

  const familles =
    dashboardData.familles || {};

  const nutritionStatuses =
    dashboardData.statut_nutritionnel || [];

  const visites =
    dashboardData.visites || {};

  const distributions =
    dashboardData.distributions || {};

  const zakat =
    dashboardData.zakat || {};

  const coordinateurs =
    dashboardData.coordinateurs || {};

  const donateurs =
    dashboardData.donateurs || {};

  // =========================================================
  // ALERTS
  // =========================================================

  const alerts = [
    {
      id: 1,
      icon: AttentionIcon,
      title: "Stock bas",
      subtitle: "produits à vérifier",
      count: lowStockCount,
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
  // FAMILY STATUS
  // =========================================================

  const familyStats = [
    {
      id: 1,
      value: familles.nb_actives || 0,
      label: "Actives",
      color: "#22C55E",
      borderColor: "#22C55E",
    },
    {
      id: 2,
      value: familles.nb_alertees || 0,
      label: "Alertées",
      color: "#F59E0B",
      borderColor: "#F59E0B",
    },
    {
      id: 3,
      value: familles.nb_sortie || 0,
      label: "Sorties",
      color: "#6D6D6D",
      borderColor: "#6D6D6D",
    },
  ];

  // =========================================================
  // VISITS
  // =========================================================

  const completedVisits =
    visites.nb_realisees || 0;

  const expectedVisits =
    visites.nb_prevus || 0;

  const compliancePercentage =
    expectedVisits > 0
      ? Math.round(
          (completedVisits / expectedVisits) * 100
        )
      : 0;

  // =========================================================
  // NUTRITION
  // =========================================================

  const normalPercentage =
    nutritionStatuses.find(
      (item) => item.statut === "normale"
    )?.pourcentage || 0;

  const mamPercentage =
    nutritionStatuses.find(
      (item) => item.statut === "mam"
    )?.pourcentage || 0;

  const masPercentage =
    nutritionStatuses.find(
      (item) => item.statut === "mas"
    )?.pourcentage || 0;

  // =========================================================
  // DISTRIBUTION
  // =========================================================

  const products =
    Object.entries(distributions).map(
      ([name, data], index) => ({
        id: index + 1,
        name,
        quantity: `${data.quantite} ${data.unite}`,
      })
    );

  const distributionHistory =
    Object.entries(distributions).map(
      ([name, data], index) => ({
        id: index + 1,
        name,
        value: data.quantite,
        unit: data.unite,
      })
    );

  // =========================================================
  // LOW STOCK
  // =========================================================

  const lowStockProducts =
    stockAlerts.map((alert) => ({
      id: alert.id,
      name: alert.message,
      quantity: "",
      unit: "",
    }));

  // =========================================================
  // COORDINATORS
  // =========================================================

  const coordinatorCount =
    coordinateurs.nb_coordinateur || 0;

  const lastConnection =
    coordinateurs.derniere_connexion?.last_login
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

  // =========================================================
  // ZAKAT
  // =========================================================

  const remainingBalanceMRU =
    `${zakat.solde_restant || "0.00"} MRU`;

  const monthlyDistributedMRU =
    `${zakat.montant_total_verse_ce_mois || "0.00"} MRU`;

  const monthlyDistributedEUR =
    `${zakat.montant_total_verse_ce_mois || "0.00"} EUR`;

  const remainingBalanceEUR =
    zakat.taux_change_actuel
      ? `Taux: ${zakat.taux_change_actuel}`
      : "0.00 EUR";

  const beneficiaryFamilies =
    zakat.nb_familles_ce_mois || 0;

  const exchangeRate =
    zakat.taux_change_actuel || "0.00";

  // =========================================================
  // DONORS
  // =========================================================

  const totalDonors =
    donateurs.nb_total || 0;

  const activeDonors =
    donateurs.nb_actifs || 0;

  const newDonorsThisMonth =
    donateurs.nb_nouveaux_ce_mois || 0;

  // =========================================================
  // MAS POPUP
  // =========================================================

  const familleMas =
    malnutritionAlerts.map((alert) => ({
      id: alert.id,
      sexe: "—",
      enfant: "Enfant",
      region: "—",
      naissance: "—",
      code: alert.famille || "—",
      badges: [
        {
          type: "mas",
          text: "MAS sévère",
        },
      ],
    }));

  // =========================================================
  // RETARD POPUP
  // =========================================================

  const familleRetard =
    retardAlerts.map((alert) => ({
      id: alert.id,
      sexe: "—",
      enfant: "Enfant",
      region: "—",
      naissance: "—",
      code: alert.famille || "—",
      badges: [
        {
          type: "retard",
          text: "Visite en retard",
        },
      ],
    }));

  // =========================================================
  // HANDLERS
  // =========================================================

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
        break;
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="flex h-screen overflow-hidden bg-white">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar
        role={user?.role || "admin"}
        user={user}
      />

      <main
        className="
          flex-1
          overflow-y-auto
          px-5
          pt-18
          md:pt-0
          pb-8
          md:p-8
          lg:p-10
          bg-white
        "
      >

        {/* ===================================================
            WELCOME
            Visible à partir de md
        =================================================== */}

        <div className="hidden md:block">
          <WelcomeCard
            userName={userName}
            subtitle={subtitle}
            NotificationCount={notificationCount}
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
            Mobile : vertical
            Tablet/Desktop : 3 colonnes
        =================================================== */}

        <div
          className="
            flex flex-col
            gap-[8px]
            md:grid
            md:grid-cols-3
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
              onClick={() =>
                handleAlertClick(alert)
              }
            />
          ))}
        </div>

        {/* ===================================================
            MOBILE ONLY
            IMPORTANT :
            md:hidden = uniquement téléphone
        =================================================== */}

        <div
          className="
            flex
            flex-col
            gap-[18px]
            md:hidden
          "
        >
          <FamilyStatusCard
            title="Statut des familles"
            stats={familyStats}
            onClick={() =>
              navigate("/liste-famille")
            }
          />

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
              console.log("Visits")
            }
          />

          <ZakatCard
            variant="admin"
            title="Zakat"
            remainingBalanceMRU={remainingBalanceMRU}
            remainingBalanceEUR={remainingBalanceEUR}
            monthlyDistributedMRU={monthlyDistributedMRU}
            monthlyDistributedEUR={monthlyDistributedEUR}
            beneficiaryFamilies={beneficiaryFamilies}
            exchangeRate={exchangeRate}
          />

          <DonorCard
            title="Donateurs"
            totalDonors={totalDonors}
            activeDonors={activeDonors}
            newDonorsThisMonth={newDonorsThisMonth}
            onClick={() =>
              navigate("/liste-Donateurs")
            }
          />

          <CoordinatorCard
            title="Coordinateurs"
            manageText="Gerer les coordinateurs"
            coordinatorCount={coordinatorCount}
            coordinatorLabel="Coordinateurs"
            lastConnection={lastConnection}
            lastConnectionLabel="Dernière connexion"
            valueColor="#69B89C"
            onClick={() =>
              navigate("/liste-coordinateurs")
            }
          />
        </div>

        {/* ===================================================
            TABLET + DESKTOP
            md:grid = à partir de 768px
        =================================================== */}

        <div
          className="
            hidden
            md:grid
            grid-cols-1
            lg:grid-cols-[1.2fr_1fr]
            gap-[18px]
          "
        >

          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <div className="flex flex-col gap-[18px]">

            <FamilyStatusCard
              title="Statut des familles"
              stats={familyStats}
              onClick={() =>
                navigate("/liste-famille")
              }
            />

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

            <CoordinatorCard
              title="Coordinateurs"
              manageText="Gerer les coordinateurs"
              coordinatorCount={coordinatorCount}
              coordinatorLabel="Coordinateurs"
              lastConnection={lastConnection}
              lastConnectionLabel="Dernière connexion"
              valueColor="#69B89C"
              onClick={() =>
                navigate("/liste-coordinateurs")
              }
            />
          </div>

          {/* =================================================
              RIGHT COLUMN
          ================================================= */}

          <div className="flex flex-col gap-[18px]">

            <VisitsCard
              title="Visites"
              completedVisits={completedVisits}
              expectedVisits={expectedVisits}
              compliancePercentage={compliancePercentage}
              progressValue={compliancePercentage}
              progressMax={100}
              fillColor="#7BC8C4"
              trackColor="#E8ECEF"
              onClick={() =>
                console.log("Visits")
              }
            />

            <ZakatCard
              variant="admin"
              title="Zakat"
              remainingBalanceMRU={remainingBalanceMRU}
              remainingBalanceEUR={remainingBalanceEUR}
              monthlyDistributedMRU={monthlyDistributedMRU}
              monthlyDistributedEUR={monthlyDistributedEUR}
              beneficiaryFamilies={beneficiaryFamilies}
              exchangeRate={exchangeRate}
            />

            <DonorCard
              title="Donateurs"
              totalDonors={totalDonors}
              activeDonors={activeDonors}
              newDonorsThisMonth={newDonorsThisMonth}
              onClick={() =>
                navigate("/liste-Donateurs")
              }
            />
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
          RETARD POPUP
      ===================================================== */}

      <PopupRetard
        open={showRetard}
        onClose={() =>
          setShowRetard(false)
        }
        familleretard={familleRetard}
      />

      {/* =====================================================
          MAS POPUP
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
        onLowStockCountChange={
          setLowStockCount
        }
        onGoToStock={() => {
          setShowBas(false);
          navigate("/stock");
        }}
      />
    </div>
  );
};

export default Dashboard;
