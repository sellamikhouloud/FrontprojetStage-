import React from "react";
import PopupPhoto from "./components/PopupPhoto";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <PopupPhoto
        title="Ajouter une photo"
        onClose={() => {
          console.log("Popup closed");
        }}
      />
    </div>
  );
}

export default App;
