import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar/Sidebar";

import CoordinatorWelcomeCard from "../../components/DashbordCard/CoordinatorWelcomeCard";

import AlertBanner from "../../components/AlertComposant/AlertBanner";

import FamilyStatusCard from "../../components/DashbordCard/FamilyStatusCard";

import VisitsCard from "../../components/DashbordCard/VisitsCard";

import NutritionCard from "../../components/DashbordCard/NutritionCard";

import DistributionCard from "../../components/DashbordCard/DistributionCard";

import ZakatCard from "../../components/DashbordCard/ZakatCard";

import UpcomingVisitsCard from "../../components/DashbordCard/UpcomingVisitsCard";

import CoordinatorCard from "../../components/DashbordCard/CoordinatorCard";

import PopupRetard from "../../components/Popups/Popupvisiteretard";

import PopupMas from "../../components/Popups/PopupMas";

import PopupDistribution from "../../components/Popups/Popupdistributions";

import AttentionIcon from "../../assets/Attention.svg";

import RetardIcon from "../../assets/retard.svg";

import Spinner from "../../components/Spinner";

import { getDashboard } from "../../lib/api/dashboard";

import { useAuth } from "../../components/Providers/AuthProvider";

const ChefCoordinatorDashboard = () => {
  const navigate = useNavigate();

  // =====================================================
  // AUTHENTICATED USER
  // =====================================================

  const { user, ready } = useAuth();

  // =====================================================
  // STATES
  // =====================================================

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showHistorique, setShowHistorique] = useState(false);
  const [showRetard, setShowRetard] = useState(false);
  const [showMas, setShowMas] = useState(false);

  // =====================================================
  // FETCH DASHBOARD
  // =====================================================

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (!user) {
      setLoading(false);
      setError("Utilisateur non authentifié.");
      return;
    }

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getDashboard();

        console.log(
          "CHEF COORDINATOR ZAKAT:",
          response.data?.zakat
        );

        console.log(
          "CHEF COORDINATOR FULL DASHBOARD:",
          response.data
        );

        setDashboardData(response.data);
      } catch (err) {
        console.error(
          "Erreur lors du chargement du dashboard :",
          err
        );

        const backendError =
          err?.response?.data?.detail ||
          err?.response?.data?.message;

        setError(
          backendError ||
            "Impossible de récupérer les données du dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [ready, user]);

  // =====================================================
  // AUTH / USER ERROR
  // =====================================================

  if (!ready) {
    return (
      <div className="flex h-screen overflow-hidden bg-white">
        <Sidebar role="chef_coordinator" user={user} />

        <main className="flex-1 flex items-center justify-center bg-white">
          <Spinner />
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen overflow-hidden bg-white">
        <Sidebar role="chef_coordinator" user={user} />

        <main className="flex-1 flex items-center justify-center bg-white px-5">
          <div className="text-center">
            <p className="mb-4 text-[16px] font-medium text-red-500">
              Utilisateur non authentifié.
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="
                rounded-lg
                bg-[#69B89C]
                px-5
                py-2
                font-medium
                text-white
                transition
                hover:opacity-90
              "
            >
              Réessayer
            </button>
          </div>
        </main>
      </div>
    );
  }

  // =====================================================
  // LOADING / ERROR
  // =====================================================

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-white">
        <Sidebar role="chef_coordinator" user={user} />

        <main className="flex-1 flex items-center justify-center bg-white">
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

  if (error || !dashboardData) {
    return (
      <div className="flex h-screen overflow-hidden bg-white">
        <Sidebar role="chef_coordinator" user={user} />

        <main className="flex-1 flex items-center justify-center bg-white px-5">
          <div className="flex max-w-md flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <img
                src={AttentionIcon}
                alt="Erreur"
                className="h-7 w-7"
              />
            </div>

            <p className="font-medium text-red-500">
              {error ||
                "Impossible de charger le tableau de bord."}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="
                rounded-lg
                bg-[#69B89C]
                px-5
                py-2
                text-sm
                font-medium
                text-white
                transition
                hover:opacity-90
              "
            >
              Réessayer
            </button>
          </div>
        </main>
      </div>
    );
  }

  // =====================================================
  // API DATA
  // =====================================================

  const {
    alertes = {},
    familles = {},
    statut_nutritionnel = [],
    visites = {},
    distributions = {},
    zakat = {},
    visites_a_venir = [],
    coordinateurs = {},
  } = dashboardData || {};

  // =====================================================
  // WELCOME
  // =====================================================

  const greeting = "Bonjour";

  const userName =
    [user?.prenom, user?.nom]
      .filter(Boolean)
      .join(" ") ||
    user?.username ||
    "Utilisateur";

  const message = "Bonne journée !";

  // =====================================================
  // ALERTS
  // =====================================================

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

  const alerts = allAlerts.filter(
    (alert) => alert.count > 0
  );

  // =====================================================
  // FAMILY STATUS
  // =====================================================

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

  // =====================================================
  // VISITS
  // =====================================================

  const visitsTitle = "Nombre de visites";

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

  // =====================================================
  // UPCOMING VISITS
  // =====================================================

  const upcomingVisits = Array.isArray(
    visites_a_venir
  )
    ? visites_a_venir
    : [];

  // =====================================================
  // NUTRITION
  // =====================================================

  const getNutritionPercentage = (status) => {
    const item = statut_nutritionnel.find(
      (nutrition) =>
        nutrition?.statut === status
    );

    return Number(item?.pourcentage || 0);
  };

  const normalPercentage =
    getNutritionPercentage("normale");

  const mamPercentage =
    getNutritionPercentage("mam");

  const masPercentage =
    getNutritionPercentage("mas");

  // =====================================================
  // DISTRIBUTIONS
  // =====================================================

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

  // =====================================================
  // ZAKAT
  // SAME LOGIC AS COORDINATOR
  // =====================================================

  const zakatTitle = "Zakat";

  const remainingBalanceMRU =
    zakat?.montant_total_verse_ce_mois !== undefined
      ? `${zakat.montant_total_verse_ce_mois} MRU`
      : "0.00 MRU";

  const remainingBalanceEUR =
    zakat?.montant_total_verse_ce_mois_eur !== undefined
      ? `${zakat.montant_total_verse_ce_mois_eur} EUR`
      : "";

  const monthlyDistributedMRU =
    zakat?.montant_total_verse_ce_mois !== undefined
      ? `${zakat.montant_total_verse_ce_mois} MRU`
      : "0.00 MRU";

  const monthlyDistributedEUR =
    zakat?.montant_total_verse_ce_mois_eur !== undefined
      ? `${zakat.montant_total_verse_ce_mois_eur} EUR`
      : "";

  const beneficiaryFamilies =
    zakat?.nb_familles_ce_mois !== undefined
      ? zakat.nb_familles_ce_mois
      : "";

  const exchangeRate =
    zakat?.taux_change_actuel !== undefined
      ? zakat.taux_change_actuel
      : "";

  // =====================================================
  // COORDINATORS
  // =====================================================

  const coordinatorCount =
    coordinateurs?.nb_coordinateur || 0;

const lastConnectionData =
  coordinateurs?.derniere_connexion || {};

const lastConnection =
  lastConnectionData?.last_login
    ? new Date(
        lastConnectionData.last_login
      ).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Aucune connexion";

const lastConnectionUsername =
  lastConnectionData?.username ||
  lastConnectionData?.user?.username ||
  "Utilisateur inconnu";

  // =====================================================
  // POPUP MAS
  // =====================================================

  const familleMas = malnutritionAlerts
    .filter((alert) => alert?.famille)
    .map((alert, index) => ({
      id: alert?.id || index + 1,
      famille: alert?.famille,
      visite:
        alert?.visite ||
        alert?.visite_id ||
        null,
      date_visite:
        alert?.date_visite || null,
      badges: [
        {
          type: "mas",
          text: "MAS sévère",
        },
      ],
    }));

  // =====================================================
  // POPUP VISITES EN RETARD
  // =====================================================

  const familleRetard = retardAlerts
    .filter((alert) => alert?.famille)
    .map((alert, index) => ({
      id: alert?.id || index + 1,
      famille: alert?.famille,
      visite:
        alert?.visite ||
        alert?.visite_id ||
        null,
      date_visite:
        alert?.date_visite || null,
      badges: [
        {
          type: "retard",
          text: "Visite en retard",
        },
      ],
    }));

  // =====================================================
  // LOW STOCK POPUP
  // =====================================================

  const lowStockProducts = stockAlerts.map(
    (alert, index) => ({
      id: alert?.id || index + 1,
      name: alert?.message || "Produit",
      quantity: alert?.quantite ?? "",
      unit: alert?.unite || "",
    })
  );

  // =====================================================
  // HANDLERS
  // =====================================================

  const handleAlertClick = (alert) => {
    switch (alert.id) {
      case 1:
        if (stockAlerts.length > 0) {
          navigate("/stock");
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

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="flex h-screen overflow-hidden bg-white">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar
        role="chef_coordinator"
        user={user}
      />

      {/* =================================================
          MAIN
      ================================================= */}

      <main
        className="
          flex-1
          min-w-0
          overflow-y-auto
          bg-white
          px-[15px]
          pt-18
          pb-8
          md:px-[20px]
          md:pt-0
          lg:px-10
          lg:pt-10
          lg:pb-10
        "
      >
        <div className="w-full">

          {/* =================================================
              WELCOME
          ================================================= */}

          <div className="hidden w-full lg:block">
            <CoordinatorWelcomeCard
              greeting={greeting}
              userName={userName}
              message={message}
              onModifyClick={() =>
                navigate("/profile-coor")
              }
            />
          </div>

          {/* =================================================
              ALERTS TITLE
          ================================================= */}

          <h3
            className="
              mt-2
              mb-1
              w-full
              text-[20px]
              font-bold
              leading-[20px]
            "
          >
            Alertes prioritaires
          </h3>

          {/* =================================================
              ALERTS
          ================================================= */}

          {alerts.length > 0 && (
            <div
              className={`
                flex
                w-full
                flex-col
                gap-[8px]
                pt-2
                pb-3
                lg:grid
                ${
                  alerts.length === 1
                    ? "lg:grid-cols-1"
                    : alerts.length === 2
                      ? "lg:grid-cols-2"
                      : "lg:grid-cols-3"
                }
              `}
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
                  hasLeftBorder={
                    alert.hasLeftBorder
                  }
                  onClick={() =>
                    handleAlertClick(alert)
                  }
                />
              ))}
            </div>
          )}

          {/* =================================================
              KEY INDICATIONS TITLE
          ================================================= */}

          <h3
            className="
              mb-4
              w-full
              text-[20px]
              font-bold
              leading-[20px]
            "
          >
            Indications clés
          </h3>

          {/* =================================================
              MOBILE
          ================================================= */}

          <div
            className="
              flex
              w-full
              flex-col
              gap-[18px]
              lg:hidden
            "
          >

            {/* FAMILY STATUS */}

            <FamilyStatusCard
              title="Statut des familles"
              stats={familyStats}
              onClick={() =>
                navigate("/liste-famille")
              }
            />

            {/* VISITS */}

            <VisitsCard
              title={visitsTitle}
              completedVisits={completedVisits}
              expectedVisits={expectedVisits}
              compliancePercentage={
                compliancePercentage
              }
              progressValue={
                compliancePercentage
              }
              progressMax={100}
              fillColor="#69B89C"
              trackColor="#E8ECEF"
              onClick={() =>
                navigate("/liste-visite")
              }
            />

            {/* UPCOMING VISITS */}

            <UpcomingVisitsCard
              visits={upcomingVisits}
              onClick={() =>
                navigate("/liste-visite")
              }
            />

            {/* NUTRITION */}

            <NutritionCard
              title="État nutritionnel"
              normalPercentage={
                normalPercentage
              }
              mamPercentage={
                mamPercentage
              }
              masPercentage={
                masPercentage
              }
              normalColor="#69B89C"
              mamColor="#F4B860"
              masColor="#EB5757"
              trackColor="#E8ECEF"
              onClick={() =>
                console.log("Nutrition")
              }
            />

            {/* DISTRIBUTION */}

            <DistributionCard
              title="Distributions ce mois"
              products={products}
              dividerColor="#4E9F8A"
              viewAllText="Voir tous"
              onClick={() =>
                navigate(
                  "/liste-distributions"
                )
              }
              onViewAllClick={() =>
                setShowHistorique(true)
              }
            />

            {/* ZAKAT */}

            <ZakatCard
              variant="coordinator"
              title={zakatTitle}
              remainingBalanceMRU={
                remainingBalanceMRU
              }
              remainingBalanceEUR={
                remainingBalanceEUR
              }
              monthlyDistributedMRU={
                monthlyDistributedMRU
              }
              monthlyDistributedEUR={
                monthlyDistributedEUR
              }
              beneficiaryFamilies={
                beneficiaryFamilies
              }
              exchangeRate={exchangeRate}
              onClick={() =>
                navigate("/zakat")
              }
            />

            {/* COORDINATORS */}

            <CoordinatorCard
              title="Coordinateurs"
              manageText="Gérer les utilisateurs"
              coordinatorCount={
                coordinatorCount
              }
              coordinatorLabel="Coordinateurs"
              lastConnection={
                lastConnection
              }
              lastConnectionUsername={lastConnectionUsername}
              lastConnectionLabel="Dernière connexion"
              Color="#69B89C"
              onClick={() =>
                navigate(
                  "/liste-coordinateurs"
                )
              }
            />
          </div>

          {/* =================================================
              DESKTOP
          ================================================= */}

          <div
            className="
              hidden
              w-full
                items-stretch
              gap-[18px]
              lg:grid
              lg:grid-cols-[1.15fr_1fr]
            "
          >

            {/* =================================================
                LEFT COLUMN
            ================================================= */}

            <div
              className="
                flex
                w-full
                min-w-0
                flex-col
                gap-[18px]
              "
            >

              {/* FAMILY STATUS */}

              <FamilyStatusCard
                title="Statut des familles"
                stats={familyStats}
                onClick={() =>
                  navigate("/liste-famille")
                }
              />

              {/* NUTRITION */}

              <NutritionCard
                title="État nutritionnel"
                normalPercentage={
                  normalPercentage
                }
                mamPercentage={
                  mamPercentage
                }
                masPercentage={
                  masPercentage
                }
                normalColor="#69B89C"
                mamColor="#F4B860"
                masColor="#EB5757"
                trackColor="#E8ECEF"
                onClick={() =>
                  console.log("Nutrition")
                }
              />

              {/* DISTRIBUTION */}

              <DistributionCard
                title="Distributions ce mois"
                products={products}
                dividerColor="#4E9F8A"
                viewAllText="Voir tous"
                onClick={() =>
                  navigate(
                    "/liste-distributions"
                  )
                }
                onViewAllClick={() =>
                  setShowHistorique(true)
                }
              />

              {/* ZAKAT */}

              <ZakatCard
                variant="coordinator"
                title={zakatTitle}
                remainingBalanceMRU={
                  remainingBalanceMRU
                }
                remainingBalanceEUR={
                  remainingBalanceEUR
                }
                monthlyDistributedMRU={
                  monthlyDistributedMRU
                }
                monthlyDistributedEUR={
                  monthlyDistributedEUR
                }
                beneficiaryFamilies={
                  beneficiaryFamilies
                }
                exchangeRate={exchangeRate}
                onClick={() =>
                  navigate("/zakat")
                }
              />

              {/* COORDINATORS */}

              <CoordinatorCard
                title="Coordinateurs"
                manageText="Gérer les utilisateurs"
                coordinatorCount={
                  coordinatorCount
                }
                coordinatorLabel="Coordinateurs"
                lastConnection={
                  lastConnection
                }
                lastConnectionUsername={lastConnectionUsername}
                lastConnectionLabel="Dernière connexion"
                onClick={() =>
                  navigate(
                    "/liste-coordinateurs"
                  )
                }
              />
            </div>

            {/* =================================================
                RIGHT COLUMN
            ================================================= */}

            <div
              className="
                flex
                w-full
                min-w-0
                flex-col
                gap-[18px]
              "
            >

              {/* VISITS */}

              <VisitsCard
                title={visitsTitle}
                completedVisits={
                  completedVisits
                }
                expectedVisits={
                  expectedVisits
                }
                compliancePercentage={
                  compliancePercentage
                }
                progressValue={
                  compliancePercentage
                }
                progressMax={100}
                fillColor="#69B89C"
                trackColor="#E8ECEF"
                onClick={() =>
                  navigate("/liste-visite")
                }
              />

              {/* UPCOMING VISITS */}

              <div className="flex min-h-0 flex-1">
                <UpcomingVisitsCard
                  visits={upcomingVisits}
                  onClick={() =>
                    navigate("/liste-visite")
                  }
                />
              </div>
              
            </div>
          </div>

          {/* =================================================
              POPUP DISTRIBUTION
          ================================================= */}

          {showHistorique && (
            <PopupDistribution
              title="Distributions ce mois"
              items={distributionHistory}
              onClose={() =>
                setShowHistorique(false)
              }
            />
          )}

          {/* =================================================
              POPUP VISITES EN RETARD
          ================================================= */}

          <PopupRetard
            open={showRetard}
            onClose={() =>
              setShowRetard(false)
            }
            familleretard={familleRetard}
          />

          {/* =================================================
              POPUP MAS
          ================================================= */}

          <PopupMas
            open={showMas}
            onClose={() =>
              setShowMas(false)
            }
            familleMas={familleMas}
          />
        </div>
      </main>
    </div>
  );
};

export default ChefCoordinatorDashboard;
