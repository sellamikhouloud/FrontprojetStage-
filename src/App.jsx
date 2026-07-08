import ColisAlimentaire from "./components/ColisAlimentaire";

import Cereales from "./assets/Cereales.svg";
import Legumineuses from "./assets/Legumineuses.svg";
import Huile from "./assets/Huile.svg";
import Sel from "./assets/Sel.svg";
import Sucre from "./assets/Sucre.svg";

function App() {
  // Simulation d'une distribution récupérée depuis le backend
  const distribution = {
    id: 1,
    beneficiaire: "Ahmed Mohamed",
    produits: [
      {
        id: 1,
        icon: Cereales,
        title: "Céréales",
        quantity: 5,
        unit: "kg",
      },
      {
        id: 2,
        icon: Legumineuses,
        title: "Légumineuses",
        quantity: 3,
        unit: "kg",
      },
      {
        id: 3,
        icon: Huile,
        title: "Huile",
        quantity: 2,
        unit: "L",
      },
      {
        id: 4,
        icon: Sel,
        title: "Sel",
        quantity: 1,
        unit: "kg",
      },
      {
        id: 5,
        icon: Sucre,
        title: "Sucre",
        quantity: 2,
        unit: "kg",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex justify-center items-center p-10">
      <div
        className="
          w-[620px]
          bg-white
          rounded-[20px]
          shadow-lg
          p-8
        "
      >
        <h2 className="text-[24px] font-bold mb-6">
          Colis alimentaire
        </h2>

        <ColisAlimentaire
          products={distribution.produits}
          onAddProduct={() =>
            console.log("Ajouter un produit")
          }
        />
      </div>
    </div>
  );
}

export default App;