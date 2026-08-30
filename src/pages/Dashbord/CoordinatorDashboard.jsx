// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import Sidebar from "../../components/Sidebar/Sidebar";

// import CoordinatorWelcomeCard from "../../components/DashbordCard/CoordinatorWelcomeCard";
// import AlertBanner from "../../components/AlertComposant/AlertBanner";
// import FamilyStatusCard from "../../components/DashbordCard/FamilyStatusCard";
// import VisitsCard from "../../components/DashbordCard/VisitsCard";
// import NutritionCard from "../../components/DashbordCard/NutritionCard";
// import DistributionCard from "../../components/DashbordCard/DistributionCard";
// import ZakatCard from "../../components/DashbordCard/ZakatCard";
// import UpcomingVisitsCard from "../../components/DashbordCard/UpcomingVisitsCard";

// import PopupRetard from "../../components/Popups/Popupvisiteretard";
// import PopupMas from "../../components/Popups/PopupMas";
// import PopupDistribution from "../../components/Popups/Popupdistributions";

// import AttentionIcon from "../../assets/Attention.svg";
// import RetardIcon from "../../assets/retard.svg";

// import { getDashboard } from "../../lib/api/dashboard";
// import { useAuth } from "../../components/providers/AuthProvider";

// const CoordinatorDashboard = () => {
//   const navigate = useNavigate();

//   // =====================================================
//   // AUTHENTICATED USER
//   // =====================================================

//   const { user, ready } = useAuth();

//   // =====================================================
//   // STATES
//   // =====================================================

//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [showHistorique, setShowHistorique] = useState(false);
//   const [showRetard, setShowRetard] = useState(false);
//   const [showMas, setShowMas] = useState(false);

//   // =====================================================
//   // FETCH DASHBOARD
//   // =====================================================

//   useEffect(() => {
//     // Wait for AuthProvider
//     if (!ready) {
//       return;
//     }

//     // No authenticated user
//     if (!user) {
//       setLoading(false);
//       setError("Utilisateur non authentifié.");
//       return;
//     }

//     const fetchDashboard = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response = await getDashboard();

//         console.log("Coordinator dashboard response :", response.data);

//         setDashboardData(response.data);
//       } catch (err) {
//         console.error(
//           "Erreur lors du chargement du dashboard :",
//           err
//         );

//         const backendError =
//           err?.response?.data?.detail ||
//           err?.response?.data?.message;

//         setError(
//           backendError ||
//             "Impossible de récupérer les données du dashboard."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboard();
//   }, [ready, user]);

//   // =====================================================
//   // LOADING
//   // =====================================================

//   if (!ready || loading) {
//     return (
//       <div className="flex h-screen bg-white">
//         <Sidebar role="coordinator" />

//         <main className="flex-1 flex items-center justify-center bg-white">
//           <div className="text-center">
//             <div className="w-10 h-10 border-4 border-[#69B89C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />

//             <p className="text-gray-500 text-[16px]">
//               Chargement du dashboard...
//             </p>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   // =====================================================
//   // ERROR
//   // =====================================================

//   if (error || !dashboardData) {
//     return (
//       <div className="flex h-screen bg-white">
//         <Sidebar role="coordinator" />

//         <main className="flex-1 flex items-center justify-center bg-white px-5">
//           <div className="text-center">
//             <p className="text-red-500 text-[16px] font-medium mb-4">
//               {error || "Impossible de charger le dashboard."}
//             </p>

//             <button
//               onClick={() => window.location.reload()}
//               className="
//                 px-5
//                 py-2
//                 rounded-lg
//                 bg-[#69B89C]
//                 text-white
//                 font-medium
//                 hover:opacity-90
//                 transition
//               "
//             >
//               Réessayer
//             </button>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   // =====================================================
//   // API DATA
//   // =====================================================

//   const {
//     alertes = {},
//     familles = {},
//     statut_nutritionnel = [],
//     visites = {},
//     distributions = {},
//     zakat = {},
//     visites_a_venir = [],
//   } = dashboardData;

//   // =====================================================
//   // WELCOME
//   // =====================================================

//   const greeting = "Bonjour";

//   const userName =
//     user?.prenom ||
//     user?.nom ||
//     user?.username ||
//     "Utilisateur";

//   const message = "Bonne journée !";

//   // =====================================================
//   // ALERTS
//   // =====================================================

//   /*
//    * Backend coordinator response:
//    *
//    * alertes: {
//    *   malnutrition: {
//    *     nb_alertes: 2,
//    *     alertes: [...]
//    *   },
//    *   visite_retard: {
//    *     nb_alertes: 0,
//    *     alertes: []
//    *   }
//    * }
//    */

//   const malnutritionAlerts =
//     alertes?.malnutrition?.alertes || [];

//   const retardAlerts =
//     alertes?.visite_retard?.alertes || [];

//   const alerts = [
//     {
//       id: 2,
//       icon: AttentionIcon,
//       title: "Malnutrition Aiguë Sévère",
//       subtitle: "nourrissons",
//       count: alertes?.malnutrition?.nb_alertes || 0,
//       bgColor: "#FFF7F7",
//       iconBgColor: "#FDE8E8",
//       borderColor: "#EB5757",
//       hasLeftBorder: true,
//     },

//     {
//       id: 3,
//       icon: RetardIcon,
//       title: "Visites en retard",
//       subtitle: "visites en retard",
//       count: alertes?.visite_retard?.nb_alertes || 0,
//       bgColor: "#FFFBF1",
//       iconBgColor: "#FFF0CC",
//       borderColor: "#F2B94B",
//       hasLeftBorder: true,
//     },
//   ];

//   // =====================================================
//   // FAMILY STATUS
//   // =====================================================

//   const familyStatusTitle = "Statut des familles";

//   const familyStats = [
//     {
//       id: 1,
//       value: familles?.nb_actives || 0,
//       label: "Actives",
//       color: "#22C55E",
//       borderColor: "#22C55E",
//     },

//     {
//       id: 2,
//       value: familles?.nb_alertees || 0,
//       label: "Alertées",
//       color: "#F59E0B",
//       borderColor: "#F59E0B",
//     },

//     {
//       id: 3,
//       value: familles?.nb_sortie || 0,
//       label: "Sorties",
//       color: "#6D6D6D",
//       borderColor: "#6D6D6D",
//     },
//   ];

//   // =====================================================
//   // VISITS
//   // =====================================================

//   const visitsTitle = "Nombre de visites";

//   const completedVisits =
//     visites?.nb_realisees || 0;

//   const expectedVisits =
//     visites?.nb_prevus || 0;

//   const compliancePercentage =
//     expectedVisits > 0
//       ? Math.round(
//           (completedVisits / expectedVisits) * 100
//         )
//       : 0;

//   // =====================================================
//   // NUTRITION
//   // =====================================================

//   const nutritionTitle = "État nutritionnel";

//   /*
//    * Backend example:
//    *
//    * [
//    *   { statut: "mas", pourcentage: 14.29 },
//    *   { statut: null, pourcentage: 57.14 },
//    *   { statut: "normale", pourcentage: 28.57 }
//    * ]
//    *
//    * We only display the statuses required by the card:
//    * normale / mam / mas
//    */

//   const getNutritionPercentage = (status) => {
//     const item = statut_nutritionnel.find(
//       (nutrition) =>
//         nutrition?.statut === status
//     );

//     return Number(item?.pourcentage || 0);
//   };

//   const normalPercentage =
//     getNutritionPercentage("normale");

//   const mamPercentage =
//     getNutritionPercentage("mam");

//   const masPercentage =
//     getNutritionPercentage("mas");

//   // =====================================================
//   // DISTRIBUTIONS
//   // =====================================================

//   const distributionTitle = "Distributions ce mois";

//   /*
//    * Backend example:
//    *
//    * distributions: {
//    *   "Lait 1er age 400g": {
//    *      quantite: 4,
//    *      unite: "boite"
//    *   },
//    *   Riz: {
//    *      quantite: 8,
//    *      unite: "kg"
//    *   }
//    * }
//    *
//    * Coordinator currently receives:
//    * distributions: {}
//    *
//    * So this safely produces an empty array.
//    */

//   const products = Object.entries(
//     distributions || {}
//   ).map(([name, data], index) => ({
//     id: index + 1,
//     name,
//     quantity: `${data?.quantite ?? 0} ${
//       data?.unite || ""
//     }`.trim(),
//   }));

//   // =====================================================
//   // DISTRIBUTION HISTORY
//   // =====================================================

//   const distributionHistory = products.map(
//     (product) => ({
//       name: product.name,
//       value: product.quantity,
//       unit: "",
//     })
//   );

//   // =====================================================
//   // ZAKAT
//   // =====================================================

//   const zakatTitle = "Zakat";

//   /*
//    * Coordinator backend:
//    *
//    * {
//    *   montant_total_verse_ce_mois: "0.00",
//    *   montant_total_verse_ce_mois_eur: "0.00"
//    * }
//    *
//    * The coordinator response does NOT contain:
//    * - solde_restant
//    * - nb_familles_ce_mois
//    * - taux_change_actuel
//    *
//    * Therefore we keep safe empty/default values.
//    */

//   const remainingBalanceMRU =
//     zakat?.solde_restant !== undefined
//       ? `${zakat.solde_restant} MRU`
//       : "0.00 MRU";

//   const remainingBalanceEUR =
//     zakat?.solde_restant_eur !== undefined
//       ? `${zakat.solde_restant_eur} EUR`
//       : "";

//   const monthlyDistributedMRU =
//     zakat?.montant_total_verse_ce_mois !== undefined
//       ? `${zakat.montant_total_verse_ce_mois} MRU`
//       : "0.00 MRU";

//   const monthlyDistributedEUR =
//     zakat?.montant_total_verse_ce_mois_eur !== undefined
//       ? `${zakat.montant_total_verse_ce_mois_eur} EUR`
//       : "";

//   const beneficiaryFamilies =
//     zakat?.nb_familles_ce_mois !== undefined
//       ? zakat.nb_familles_ce_mois
//       : "";

//   const exchangeRate =
//     zakat?.taux_change_actuel !== undefined
//       ? zakat.taux_change_actuel
//       : "";

//   // =====================================================
//   // UPCOMING VISITS
//   // =====================================================

//   const formatUpcomingVisitDay = (dateString) => {
//     if (!dateString) {
//       return "";
//     }

//     const visitDate = new Date(
//       `${dateString}T00:00:00`
//     );

//     if (Number.isNaN(visitDate.getTime())) {
//       return dateString;
//     }

//     const today = new Date();

//     today.setHours(0, 0, 0, 0);

//     const tomorrow = new Date(today);

//     tomorrow.setDate(
//       today.getDate() + 1
//     );

//     const visit = new Date(visitDate);

//     visit.setHours(0, 0, 0, 0);

//     if (
//       visit.getTime() === today.getTime()
//     ) {
//       return "Aujourd'hui";
//     }

//     if (
//       visit.getTime() === tomorrow.getTime()
//     ) {
//       return "Demain";
//     }

//     return visit.toLocaleDateString(
//       "fr-FR",
//       {
//         weekday: "long",
//       }
//     );
//   };

//   const upcomingVisits = (
//     visites_a_venir || []
//   ).map((visit, index) => ({
//     id: index + 1,

//     day: formatUpcomingVisitDay(
//       visit?.date_visite
//     ),

//     family:
//       visit?.famille || "Famille",

//     village: "",

//     date:
//       visit?.date_visite || "",
//   }));

//   // =====================================================
//   // POPUP - MALNUTRITION
//   // =====================================================

//   const familleMas =
//     malnutritionAlerts.map(
//       (alert, index) => ({
//         id:
//           alert?.id ||
//           index + 1,

//         sexe: "—",

//         enfant: "Enfant",

//         region: "—",

//         naissance: "—",

//         code:
//           alert?.famille ||
//           "—",

//         badges: [
//           {
//             type: "mas",
//             text: "MAS sévère",
//           },
//         ],
//       })
//     );

//   // =====================================================
//   // POPUP - VISITES EN RETARD
//   // =====================================================

//   const familleRetard =
//     retardAlerts.map(
//       (alert, index) => ({
//         id:
//           alert?.id ||
//           index + 1,

//         sexe: "—",

//         enfant: "Famille",

//         region: "—",

//         naissance: "—",

//         code:
//           alert?.famille ||
//           "—",

//         badges: [
//           {
//             type: "retard",
//             text: "Visite en retard",
//           },
//         ],
//       })
//     );

//   // =====================================================
//   // HANDLERS
//   // =====================================================

//   const handleNotifications = () => {
//     // À implémenter si nécessaire
//   };

//   const handleSettings = () => {
//     navigate("/parametres");
//   };

//   const handleAlertClick = (alert) => {
//     switch (alert.id) {
//       case 2:
//         if (malnutritionAlerts.length > 0) {
//           setShowMas(true);
//         }
//         break;

//       case 3:
//         if (retardAlerts.length > 0) {
//           setShowRetard(true);
//         }
//         break;

//       default:
//         break;
//     }
//   };

//   // =====================================================
//   // RETURN
//   // =====================================================

//   return (
//     <div className="flex h-screen overflow-hidden bg-white">

//       {/* =====================================================
//           SIDEBAR
//       ===================================================== */}

//       <Sidebar role="coordinator" />

//       {/* =====================================================
//           MAIN
//       ===================================================== */}

//       <main
//         className="
//           flex-1
//           overflow-y-auto
//           bg-white
//           px-[15px]
//           pt-18
//           pb-8
//           md:px-[20px]
//           md:pt-0
//           lg:px-10
//           lg:pt-10
//           lg:pb-10
//         "
//       >
//         <div className="w-full">

//           {/* =====================================================
//               WELCOME
//           ===================================================== */}

//           <div className="hidden lg:block w-full">
//             <CoordinatorWelcomeCard
//               greeting={greeting}
//               userName={userName}
//               message={message}
//             />
//           </div>

//           {/* =====================================================
//               ALERTS TITLE
//           ===================================================== */}

//           <h3
//             className="
//               w-full
//               mt-2
//               mb-1
//               text-[20px]
//               font-bold
//               leading-[20px]
//             "
//           >
//             Alertes prioritaires
//           </h3>

//           {/* =====================================================
//               ALERTS
//           ===================================================== */}

//           <div
//             className="
//               w-full
//               flex
//               flex-col
//               gap-[8px]
//               pt-2
//               pb-3
//               lg:grid
//               lg:grid-cols-2
//             "
//           >
//             {alerts.map((alert) => (
//               <AlertBanner
//                 key={alert.id}
//                 icon={alert.icon}
//                 title={alert.title}
//                 subtitle={alert.subtitle}
//                 count={alert.count}
//                 bgColor={alert.bgColor}
//                 iconBgColor={
//                   alert.iconBgColor
//                 }
//                 borderColor={
//                   alert.borderColor
//                 }
//                 hasLeftBorder={
//                   alert.hasLeftBorder
//                 }
//                 onClick={() =>
//                   handleAlertClick(alert)
//                 }
//               />
//             ))}
//           </div>

//           {/* =====================================================
//               KEY INDICATIONS TITLE
//           ===================================================== */}

//           <h3
//             className="
//               w-full
//               mb-4
//               text-[20px]
//               font-bold
//               leading-[20px]
//             "
//           >
//             Indications clés
//           </h3>

//           {/* =====================================================
//               MOBILE
//           ===================================================== */}

//           <div
//             className="
//               w-full
//               flex
//               flex-col
//               gap-[18px]
//               lg:hidden
//             "
//           >

//             {/* FAMILY STATUS */}

//             <FamilyStatusCard
//               title={familyStatusTitle}
//               stats={familyStats}
//               onClick={() =>
//                 navigate("/liste-famille")
//               }
//             />

//             {/* VISITS */}

//             <VisitsCard
//               title={visitsTitle}
//               completedVisits={
//                 completedVisits
//               }
//               expectedVisits={
//                 expectedVisits
//               }
//               compliancePercentage={
//                 compliancePercentage
//               }
//               progressValue={
//                 compliancePercentage
//               }
//               progressMax={100}
//               fillColor="#69B89C"
//               trackColor="#E8ECEF"
//               onClick={() =>
//                 navigate("/liste-visite")
//               }
//             />

//             {/* UPCOMING VISITS */}

//             <UpcomingVisitsCard
//               visits={upcomingVisits}
//               onClick={() =>
//                 navigate("/liste-visite")
//               }
//             />

//             {/* NUTRITION */}

//             <NutritionCard
//               title={nutritionTitle}
//               normalPercentage={
//                 normalPercentage
//               }
//               mamPercentage={
//                 mamPercentage
//               }
//               masPercentage={
//                 masPercentage
//               }
//               normalColor="#22C55E"
//               mamColor="#F59E0B"
//               masColor="#EF4444"
//               trackColor="#E8ECEF"
//               onClick={() =>
//                 console.log("Nutrition")
//               }
//             />

//             {/* DISTRIBUTION */}

//             <DistributionCard
//               title={distributionTitle}
//               products={products}
//               dividerColor="#4E9F8A"
//               viewAllText="Voir tous"
//               onClick={() =>
//                 navigate(
//                   "/liste-distributions"
//                 )
//               }
//               onViewAllClick={() =>
//                 setShowHistorique(true)
//               }
//             />

//             {/* ZAKAT */}

//             <ZakatCard
//               variant="coordinator"
//               title={zakatTitle}
//               remainingBalanceMRU={
//                 remainingBalanceMRU
//               }
//               remainingBalanceEUR={
//                 remainingBalanceEUR
//               }
//               monthlyDistributedMRU={
//                 monthlyDistributedMRU
//               }
//               monthlyDistributedEUR={
//                 monthlyDistributedEUR
//               }
//               beneficiaryFamilies={
//                 beneficiaryFamilies
//               }
//               exchangeRate={
//                 exchangeRate
//               }
//             />
//           </div>

//           {/* =====================================================
//               DESKTOP
//           ===================================================== */}

//           <div
//             className="
//               hidden
//               lg:grid
//               w-full
//               grid-cols-[1.15fr_1fr]
//               gap-[18px]
//               items-start
//             "
//           >

//             {/* =====================================================
//                 LEFT COLUMN
//             ===================================================== */}

//             <div
//               className="
//                 w-full
//                 min-w-0
//                 flex
//                 flex-col
//                 gap-[18px]
//               "
//             >

//               {/* FAMILY STATUS */}

//               <FamilyStatusCard
//                 title={familyStatusTitle}
//                 stats={familyStats}
//                 onClick={() =>
//                   navigate(
//                     "/liste-famille"
//                   )
//                 }
//               />

//               {/* NUTRITION */}

//               <NutritionCard
//                 title={nutritionTitle}
//                 normalPercentage={
//                   normalPercentage
//                 }
//                 mamPercentage={
//                   mamPercentage
//                 }
//                 masPercentage={
//                   masPercentage
//                 }
//                 normalColor="#22C55E"
//                 mamColor="#F59E0B"
//                 masColor="#EF4444"
//                 trackColor="#E8ECEF"
//                 onClick={() =>
//                   console.log(
//                     "Nutrition"
//                   )
//                 }
//               />

//               {/* DISTRIBUTION */}

//               <DistributionCard
//                 title={distributionTitle}
//                 products={products}
//                 dividerColor="#4E9F8A"
//                 viewAllText="Voir tous"
//                 onClick={() =>
//                   navigate(
//                     "/liste-distributions"
//                   )
//                 }
//                 onViewAllClick={() =>
//                   setShowHistorique(
//                     true
//                   )
//                 }
//               />

//               {/* ZAKAT */}

//               <ZakatCard
//                 variant="coordinator"
//                 title={zakatTitle}
//                 remainingBalanceMRU={
//                   remainingBalanceMRU
//                 }
//                 remainingBalanceEUR={
//                   remainingBalanceEUR
//                 }
//                 monthlyDistributedMRU={
//                   monthlyDistributedMRU
//                 }
//                 monthlyDistributedEUR={
//                   monthlyDistributedEUR
//                 }
//                 beneficiaryFamilies={
//                   beneficiaryFamilies
//                 }
//                 exchangeRate={
//                   exchangeRate
//                 }
//               />
//             </div>

//             {/* =====================================================
//                 RIGHT COLUMN
//             ===================================================== */}

//             <div
//               className="
//                 w-full
//                 min-w-0
//                 flex
//                 flex-col
//                 gap-[18px]
//               "
//             >

//               {/* VISITS */}

//               <VisitsCard
//                 title={visitsTitle}
//                 completedVisits={
//                   completedVisits
//                 }
//                 expectedVisits={
//                   expectedVisits
//                 }
//                 compliancePercentage={
//                   compliancePercentage
//                 }
//                 progressValue={
//                   compliancePercentage
//                 }
//                 progressMax={100}
//                 fillColor="#7BC8C4"
//                 trackColor="#E8ECEF"
//                 onClick={() =>
//                   navigate(
//                     "/liste-visite"
//                   )
//                 }
//               />

//               {/* UPCOMING VISITS */}

//               <UpcomingVisitsCard
//                 visits={upcomingVisits}
//                 onClick={() =>
//                   navigate(
//                     "/liste-visite"
//                   )
//                 }
//               />
//             </div>
//           </div>

//           {/* =====================================================
//               POPUP DISTRIBUTION
//           ===================================================== */}

//           {showHistorique && (
//             <PopupDistribution
//               title="Distributions ce mois"
//               items={distributionHistory}
//               onClose={() =>
//                 setShowHistorique(
//                   false
//                 )
//               }
//             />
//           )}

//           {/* =====================================================
//               POPUP RETARD
//           ===================================================== */}

//           <PopupRetard
//             open={showRetard}
//             onClose={() =>
//               setShowRetard(false)
//             }
//             familleretard={
//               familleRetard
//             }
//           />

//           {/* =====================================================
//               POPUP MAS
//           ===================================================== */}

//           <PopupMas
//             open={showMas}
//             onClose={() =>
//               setShowMas(false)
//             }
//             familleMas={familleMas}
//           />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default CoordinatorDashboard;

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

import PopupRetard from "../../components/Popups/Popupvisiteretard";
import PopupMas from "../../components/Popups/PopupMas";
import PopupDistribution from "../../components/Popups/Popupdistributions";

import AttentionIcon from "../../assets/Attention.svg";
import RetardIcon from "../../assets/retard.svg";

import { getDashboard } from "../../lib/api/dashboard";
import { useAuth } from "../../components/providers/AuthProvider";

const CoordinatorDashboard = () => {
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
          "Coordinator dashboard response :",
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
  // LOADING
  // =====================================================

  if (!ready || loading) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar role="coordinator" />

        <main className="flex-1 flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-[#69B89C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />

            <p className="text-gray-500 text-[16px]">
              Chargement du dashboard...
            </p>
          </div>
        </main>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !dashboardData) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar role="coordinator" />

        <main className="flex-1 flex items-center justify-center bg-white px-5">
          <div className="text-center">
            <p className="text-red-500 text-[16px] font-medium mb-4">
              {error || "Impossible de charger le dashboard."}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="
                px-5
                py-2
                rounded-lg
                bg-[#69B89C]
                text-white
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
  } = dashboardData;

  // =====================================================
  // WELCOME
  // =====================================================

  const greeting = "Bonjour";

  const userName =
    user?.prenom ||
    user?.nom ||
    user?.username ||
    "Utilisateur";

  const message = "Bonne journée !";

  // =====================================================
  // ALERTS
  // =====================================================

  const malnutritionAlerts =
    alertes?.malnutrition?.alertes || [];

  const retardAlerts =
    alertes?.visite_retard?.alertes || [];

  const alerts = [
    {
      id: 2,
      icon: AttentionIcon,
      title: "Malnutrition Aiguë Sévère",
      subtitle: "nourrissons",
      count: alertes?.malnutrition?.nb_alertes || 0,
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
      count: alertes?.visite_retard?.nb_alertes || 0,
      bgColor: "#FFFBF1",
      iconBgColor: "#FFF0CC",
      borderColor: "#F2B94B",
      hasLeftBorder: true,
    },
  ];

  // =====================================================
  // FAMILY STATUS
  // =====================================================

  const familyStatusTitle = "Statut des familles";

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
  // NUTRITION
  // =====================================================

  const nutritionTitle = "État nutritionnel";

  const getNutritionPercentage = (status) => {
    const item = statut_nutritionnel.find(
      (nutrition) => nutrition?.statut === status
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

  const distributionTitle = "Distributions ce mois";

  const products = Object.entries(
    distributions || {}
  ).map(([name, data], index) => ({
    id: index + 1,
    name,
    quantity: `${data?.quantite ?? 0} ${
      data?.unite || ""
    }`.trim(),
  }));

  // =====================================================
  // DISTRIBUTION HISTORY
  // =====================================================

  const distributionHistory = products.map(
    (product) => ({
      name: product.name,
      value: product.quantity,
      unit: "",
    })
  );

  // =====================================================
  // ZAKAT
  // =====================================================

  const zakatTitle = "Zakat";

  const remainingBalanceMRU =
    zakat?.solde_restant !== undefined
      ? `${zakat.solde_restant} MRU`
      : "0.00 MRU";

  const remainingBalanceEUR =
    zakat?.solde_restant_eur !== undefined
      ? `${zakat.solde_restant_eur} EUR`
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
  // UPCOMING VISITS
  // =====================================================

  const formatUpcomingVisitDay = (dateString) => {
    if (!dateString) {
      return "";
    }

    const visitDate = new Date(
      `${dateString}T00:00:00`
    );

    if (Number.isNaN(visitDate.getTime())) {
      return dateString;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(
      today.getDate() + 1
    );

    const visit = new Date(visitDate);
    visit.setHours(0, 0, 0, 0);

    if (
      visit.getTime() === today.getTime()
    ) {
      return "Aujourd'hui";
    }

    if (
      visit.getTime() === tomorrow.getTime()
    ) {
      return "Demain";
    }

    return visit.toLocaleDateString(
      "fr-FR",
      {
        weekday: "long",
      }
    );
  };

  const upcomingVisits = (
    visites_a_venir || []
  ).map((visit, index) => ({
    id: index + 1,

    day: formatUpcomingVisitDay(
      visit?.date_visite
    ),

    family:
      visit?.famille ||
      "Famille",

    village:
      visit?.village ||
      "",

    date:
      visit?.date_visite ||
      "",
  }));

  // =====================================================
  // POPUP - MALNUTRITION MAS
  // =====================================================

  /*
   * IMPORTANT :
   * PopupMas reçoit les alertes originales du dashboard.
   *
   * Chaque alerte doit contenir :
   *
   * {
   *   id: ...,
   *   famille: "GDK-2026-008",
   *   ...
   * }
   *
   * PopupMas utilise ensuite famille pour appeler
   * getFamille(famille).
   */

  const familleMas =
    malnutritionAlerts
      .filter((alert) => alert?.famille)
      .map((alert, index) => ({
        id:
          alert?.id ||
          index + 1,

        famille:
          alert?.famille,

        visite:
          alert?.visite ||
          alert?.visite_id ||
          null,

        date_visite:
          alert?.date_visite ||
          null,

        badges: [
          {
            type: "mas",
            text: "MAS sévère",
          },
        ],
      }));

  // =====================================================
  // POPUP - VISITES EN RETARD
  // =====================================================

  /*
   * IMPORTANT :
   *
   * On garde le code famille fourni par le backend.
   *
   * PopupRetard va utiliser ce code pour récupérer
   * les informations complètes de la famille :
   *
   * - mère
   * - nourrisson
   * - sexe
   * - village
   * - date de naissance
   *
   * via :
   *
   * getFamille(famille)
   */

  const familleRetard =
    retardAlerts
      .filter((alert) => alert?.famille)
      .map((alert, index) => ({
        id:
          alert?.id ||
          index + 1,

        famille:
          alert?.famille,

        visite:
          alert?.visite ||
          alert?.visite_id ||
          null,

        date_visite:
          alert?.date_visite ||
          null,

        badges: [
          {
            type: "retard",
            text: "Visite en retard",
          },
        ],
      }));

  // =====================================================
  // HANDLERS
  // =====================================================

  const handleNotifications = () => {
    // À implémenter si nécessaire
  };

  const handleSettings = () => {
    navigate("/parametres");
  };

  const handleAlertClick = (alert) => {
    switch (alert.id) {
      // -------------------------------------------------
      // MAS
      // -------------------------------------------------

      case 2:
        if (malnutritionAlerts.length > 0) {
          setShowMas(true);
        }
        break;

      // -------------------------------------------------
      // VISITES EN RETARD
      // -------------------------------------------------

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

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar role="coordinator" />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className="
          flex-1
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

          {/* =====================================================
              WELCOME
          ===================================================== */}

          <div className="hidden lg:block w-full">
            <CoordinatorWelcomeCard
              greeting={greeting}
              userName={userName}
              message={message}
            />
          </div>

          {/* =====================================================
              ALERTS TITLE
          ===================================================== */}

          <h3
            className="
              w-full
              mt-2
              mb-1
              text-[20px]
              font-bold
              leading-[20px]
            "
          >
            Alertes prioritaires
          </h3>

          {/* =====================================================
              ALERTS
          ===================================================== */}

          <div
            className="
              w-full
              flex
              flex-col
              gap-[8px]
              pt-2
              pb-3
              lg:grid
              lg:grid-cols-2
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

          {/* =====================================================
              KEY INDICATIONS TITLE
          ===================================================== */}

          <h3
            className="
              w-full
              mb-4
              text-[20px]
              font-bold
              leading-[20px]
            "
          >
            Indications clés
          </h3>

          {/* =====================================================
              MOBILE
          ===================================================== */}

          <div
            className="
              w-full
              flex
              flex-col
              gap-[18px]
              lg:hidden
            "
          >

            {/* FAMILY STATUS */}

            <FamilyStatusCard
              title={familyStatusTitle}
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
              title={nutritionTitle}
              normalPercentage={
                normalPercentage
              }
              mamPercentage={
                mamPercentage
              }
              masPercentage={
                masPercentage
              }
              normalColor="#22C55E"
              mamColor="#F59E0B"
              masColor="#EF4444"
              trackColor="#E8ECEF"
              onClick={() =>
                console.log("Nutrition")
              }
            />

            {/* DISTRIBUTION */}

            <DistributionCard
              title={distributionTitle}
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
              exchangeRate={
                exchangeRate
              }
            />
          </div>

          {/* =====================================================
              DESKTOP
          ===================================================== */}

          <div
            className="
              hidden
              lg:grid
              w-full
              grid-cols-[1.15fr_1fr]
              gap-[18px]
              items-start
            "
          >

            {/* =====================================================
                LEFT COLUMN
            ===================================================== */}

            <div
              className="
                w-full
                min-w-0
                flex
                flex-col
                gap-[18px]
              "
            >

              {/* FAMILY STATUS */}

              <FamilyStatusCard
                title={familyStatusTitle}
                stats={familyStats}
                onClick={() =>
                  navigate(
                    "/liste-famille"
                  )
                }
              />

              {/* NUTRITION */}

              <NutritionCard
                title={nutritionTitle}
                normalPercentage={
                  normalPercentage
                }
                mamPercentage={
                  mamPercentage
                }
                masPercentage={
                  masPercentage
                }
                normalColor="#22C55E"
                mamColor="#F59E0B"
                masColor="#EF4444"
                trackColor="#E8ECEF"
                onClick={() =>
                  console.log("Nutrition")
                }
              />

              {/* DISTRIBUTION */}

              <DistributionCard
                title={distributionTitle}
                products={products}
                dividerColor="#4E9F8A"
                viewAllText="Voir tous"
                onClick={() =>
                  navigate(
                    "/liste-distributions"
                  )
                }
                onViewAllClick={() =>
                  setShowHistorique(
                    true
                  )
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
                exchangeRate={
                  exchangeRate
                }
              />
            </div>

            {/* =====================================================
                RIGHT COLUMN
            ===================================================== */}

            <div
              className="
                w-full
                min-w-0
                flex
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
                fillColor="#7BC8C4"
                trackColor="#E8ECEF"
                onClick={() =>
                  navigate(
                    "/liste-visite"
                  )
                }
              />

              {/* UPCOMING VISITS */}

              <UpcomingVisitsCard
                visits={upcomingVisits}
                onClick={() =>
                  navigate(
                    "/liste-visite"
                  )
                }
              />
            </div>
          </div>

          {/* =====================================================
              POPUP DISTRIBUTION
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
              POPUP VISITES EN RETARD
          ===================================================== */}

          <PopupRetard
            open={showRetard}
            onClose={() =>
              setShowRetard(false)
            }
            familleretard={
              familleRetard
            }
          />

          {/* =====================================================
              POPUP MAS
          ===================================================== */}

          <PopupMas
            open={showMas}
            onClose={() =>
              setShowMas(false)
            }
            familleMas={
              familleMas
            }
          />
        </div>
      </main>
    </div>
  );
};

export default CoordinatorDashboard;