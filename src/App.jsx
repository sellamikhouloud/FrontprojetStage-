// 

import Button from "./components/Button";
import All from "./assets/Toutes.svg";
import valide from "./assets/valide.svg";
import EnAtt from "./assets/EnAttente.svg";
import ref from "./assets/refuse.svg";


function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-8 p-8">
      {/* Existing Buttons */}
      <div className="w-[350px] space-y-4">
        <Button title="Enregistrer" variant="primary" />
        <Button title="Historique" variant="secondary" />
        <Button title="Filtrer" variant="filter" />
        <Button title="Annuler les filtres" variant="outline" />
      </div>

      {/* Status Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <Button
          title="Toutes"
          icon={All}
          variant="all"
          fullWidth={false}
        />

        <Button
          title="Validées"
          icon={valide}
          variant="validated"
          fullWidth={false}
        />

        <Button
          title="En attente"
          icon={EnAtt}
          variant="EnAttente"
          fullWidth={false}
        />

        <Button
          title="Refusées"
          icon={ref}
          variant="refused"
          fullWidth={false}
        />
      </div>
    </div>
  );
}

export default App;