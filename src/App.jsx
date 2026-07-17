import { BrowserRouter, Routes, Route } from "react-router-dom";

import InformationMere from "./admin/InformationMere";
import InformationNourrisson from "./admin/InformationNourrisson";
import PhotoConfirmation from "./admin/PhotoConfirmation";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default page */}
        <Route path="/" element={<InformationMere />} />

        {/* Mother page */}
        <Route
          path="/information-mere"
          element={<InformationMere />}
        />

        {/* Baby page */}
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