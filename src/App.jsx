import ListeFamille from "./pages/Famille/Listefamille";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashbord/Dashboard";
import FamilyProfile from "./pages/Famille/Afficherinfofamille";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Modifyfamilly from "./pages/Famille/Modifierfamille";
import InformationMere from "./pages/Famille/InformationMere";
import InformationNourrisson from "./pages/Famille/InformationNourrisson";
import PhotoConfirmation from "./pages/Famille/PhotoConfirmation";
import ListeCoordinateurs from "./pages/Coordinateurs/ListeCoordinateur";
import AjoutCoordinateur from "./pages/Coordinateurs/AjoutCoordinateur";
import ListeDonateur from "./pages/Donateurs/ListeDonateur";
import ModifierCoordinateur from "./pages/Coordinateurs/FicheCoordinateur";
import AjoutDonateur from "./pages/Donateurs/AjoutDonateur";
import FicheDonateur from "./pages/Donateurs/FicheDonateur";
import AjoutDistribution from "./pages/Distributions/AjoutDistribution";
import DistributionPage from "./pages/Distributions/ListeDistribution";
import ZakatPage from "./pages/Zakat/ListeZakat";
import AjoutZakat from "./pages/Zakat/AjoutZakat";
import AjoutVisite from "./pages/Visites/AjoutVisite";
import Galerie from "./pages/Galerie/Galerie";
import RapportMensuel from "./pages/Rapports/RapportMensuelle";
import RapportBilan from "./pages/Rapports/RapportDonateur";
import RapportAnnuel from "./pages/Rapports/RapportAnnuel";
import Parametres from "./pages/Account/Parametres";
import PageProfilCoordinateur from "./pages/Account/Pageprofilcoordinateur";
import CoordinatorDashboard from "./pages/Dashbord/CoordinatorDashboard";
import ListeVisites from "./pages/Visites/Listevisites";
import NotificationsPage from "./pages/Notifications/Notifications";
import HistoriqueNotificationsPage from "./pages/Notifications/Notificationshistorique";
import { AuthProvider, useAuth } from "./components/Providers/AuthProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { FamilyFormProvider } from "./context/FamilyFormContext";


function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin", "chef_coordinator"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboardCoor"
        element={
          <ProtectedRoute allowedRoles={["coordinator"]}>
            <CoordinatorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/liste-famille"
        element={
          <ProtectedRoute>
            <ListeFamille />
          </ProtectedRoute>
        }
      />

      {/* Family */}
      <Route
        path="/famille/:id"
        element={
          <ProtectedRoute>
            <FamilyProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/famille/:id/modifier"
        element={
          <ProtectedRoute>
            <Modifyfamilly />
          </ProtectedRoute>
        }
      />

      {/* Add Family */}
      <Route path="/information-mere" element={<InformationMere />} />
      <Route
        path="/information-nourrisson"
        element={<InformationNourrisson />}
      />
      <Route path="/photo-confirmation" element={<PhotoConfirmation />} />

      {/* Coordinateur */}
      <Route
        path="/liste-coordinateurs"
        element={
          <ProtectedRoute allowedRoles={["admin", "chef_coordinator"]}>
            <ListeCoordinateurs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ajout-coordinateur"
        element={
          <ProtectedRoute allowedRoles={["admin", "chef_coordinator"]}>
            <AjoutCoordinateur />
          </ProtectedRoute>
        }
      />
      <Route
        path="/fiche-coordinateur/:id"
        element={
          <ProtectedRoute allowedRoles={["admin", "chef_coordinator"]}>
            <ModifierCoordinateur />
          </ProtectedRoute>
        }
      />

      {/* Donateur */}
      <Route
        path="/liste-Donateurs"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ListeDonateur />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ajout-donateur"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AjoutDonateur />
          </ProtectedRoute>
        }
      />
      <Route
        path="/fiche-donateur/:id"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <FicheDonateur />
          </ProtectedRoute>
        }
      />

      {/* Distribution */}
      <Route path="/ajout-distribution" element={<AjoutDistribution />} />
      <Route
        path="/liste-distributions"
        element={
          <ProtectedRoute>
            <DistributionPage />
          </ProtectedRoute>
        }
      />

      {/* Zakat */}
      <Route
        path="/zakat"
        element={
          <ProtectedRoute>
            <ZakatPage />
          </ProtectedRoute>
        }
      />
      <Route path="/ajout-zakat" element={<AjoutZakat />} />

      {/* Visite */}
      <Route path="/liste-visite" element={<ListeVisites />} />
      <Route path="/ajout-visite" element={<AjoutVisite />} />

      <Route
        path="/galerie"
        element={
          <ProtectedRoute>
            <Galerie role={user?.role} />
          </ProtectedRoute>
        }
      />

      {/* Rapport : le premier onglet (mensuel) est l'entrée par défaut de /rapports,
          les 2 autres onglets naviguent vers leurs propres sous-routes */}
      <Route
  path="/rapports"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <RapportMensuel />
    </ProtectedRoute>
  }
/>

<Route
  path="/rapports/bilan-donateurs"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <RapportBilan />
    </ProtectedRoute>
  }
/>
       <Route
  path="/rapports/annuel"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <RapportAnnuel />
    </ProtectedRoute>
  }
/>

      {/* Parametres */}
      <Route path="/parametres" element={<Parametres />} />
      <Route path="/profile-coor" element={<PageProfilCoordinateur />} />

      {/* Notifications */}
 <Route
  path="/notifications"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <NotificationsPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/notifications/historique"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <HistoriqueNotificationsPage />
    </ProtectedRoute>
  }
/>

      
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FamilyFormProvider>
          <AppRoutes />
        </FamilyFormProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
