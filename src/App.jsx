import ListeFamille from "./Famille/Listefamille";
import Login from "./Famille/Login";
 import Dashboard from "./Famille/Dashboard";
 import FamilyProfile from "./Famille/Afficherinfofamille";
 import { BrowserRouter, Routes, Route } from "react-router-dom";
 import Modifyfamilly from "./Famille/Modifierfamille";
 import InformationMere from "./Famille/InformationMere";
import InformationNourrisson from "./Famille/InformationNourrisson";
import PhotoConfirmation from "./Famille/PhotoConfirmation";
import ListeCoordinateurs from "./Coordinateurs/ListeCoordinateur";
import  ListeDonateur from "./Donateurs/ListeDonateur";

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

         {/* Donateur */}
         <Route
          path="/liste-Donateurs" element={<ListeDonateur />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

