import ListeFamille from "./Famille/Listefamille";
import Login from "./Login/Login";
 import Dashboard from "./Dashbord/Dashboard";
 import FamilyProfile from "./Famille/Afficherinfofamille";
 import { BrowserRouter, Routes, Route } from "react-router-dom";
 import Modifyfamilly from "./Famille/Modifierfamille";
 import InformationMere from "./Famille/InformationMere";
import InformationNourrisson from "./Famille/InformationNourrisson";
import PhotoConfirmation from "./Famille/PhotoConfirmation";
import ListeCoordinateurs from "./Coordinateurs/ListeCoordinateur";
import AjoutCoordinateur from "./Coordinateurs/AjoutCoordinateur";
import  ListeDonateur from "./Donateurs/ListeDonateur";
import ModifierCoordinateur from "./Coordinateurs/FicheCoordinateur";
import AjoutDonateur from "./Donateurs/AjoutDonateur";
import FicheDonateur from "./Donateurs/FicheDonateur";
import AjoutDistribution from "./Distributions/AjoutDistribution";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/liste-famille" element={<ListeFamille />} />

        {/* Family */}
        <Route path="/famille/:id" element={<FamilyProfile />} />
        <Route path="/famille/:id/modifier" element={<Modifyfamilly />} />

        {/* Add Family */}
        <Route
          path="/information-mere"
          element={<InformationMere />}
        />
        <Route
          path="/information-nourrisson"
          element={<InformationNourrisson />}
        />
        <Route
          path="/photo-confirmation"
          element={<PhotoConfirmation />}
        />


        {/* Coordinateur */}
         <Route
          path="/liste-coordinateurs" element={<ListeCoordinateurs />}
        />
         <Route
          path="/ajout-coordinateur" element={<AjoutCoordinateur />}
        />
        <Route  path="/fiche-coordinateur"  element={<ModifierCoordinateur />} />

         {/* Donateur */}
         <Route
          path="/liste-Donateurs" element={<ListeDonateur />}
        />
         <Route
          path="/ajout-donateur" element={<AjoutDonateur />}
        />
        <Route 
          path="/fiche-donateur" element={<FicheDonateur />}
        />

        <Route
          path="/ajout-distribution" element={<AjoutDistribution />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;