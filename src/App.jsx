import ListeFamille from "./admin/Listefamille";
import Login from "./admin/Login";
 import Dashboard from "./admin/Dashboard";
 import FamilyProfile from "./admin/Afficherinfofamille";
 import { BrowserRouter, Routes, Route } from "react-router-dom";
 import Modifyfamilly from "./admin/Modifierfamille";
 import InformationMere from "./admin/InformationMere";
import InformationNourrisson from "./admin/InformationNourrisson";
import PhotoConfirmation from "./admin/PhotoConfirmation";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;

