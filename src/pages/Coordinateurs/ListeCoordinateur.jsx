import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar/Sidebar";
import NavigationHeader from "../../components/Navigation,Pageheader/NavigationHeader";
import SearchBar from "../../components/Filter/Searchbar";
import CardCoordinateur from "../../components/Cards/carteCoordinateur";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
import NoResultImage from "../../assets/no result picture.svg";

export default function ListeCoordinateurs() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

 const [coordinateurs] = useState([
  {
    id: 1,
    name: "Amadou Ba",
    village: "Lexeiba",
    familles: 12,
    code: "GDK-2026-003",
    status: "Actif",
  },
  {
    id: 2,
    name: "Fatima Ahmed",
    village: "Rosso",
    familles: 8,
    code: "GDK-2026-004",
    status: "Actif",
  },
  {
    id: 3,
    name: "Mohamed Ali",
    village: "Kaédi",
    familles: 20,
    code: "GDK-2026-005",
    status: "Inactif",
  },
]);
const filteredCoordinateurs = coordinateurs.filter((item) => {
  const keyword = search.trim().toLowerCase();

  return (
    item.name.toLowerCase().includes(keyword) ||
    item.code.toLowerCase().includes(keyword) ||
    item.village.toLowerCase().includes(keyword) ||
    item.familles.toString().includes(keyword) ||
    item.status.toLowerCase() === keyword
  );
});

  return (
    <div className="flex h-screen overflow-hidden bg-white">
  {/* Sidebar */}
 
    <Sidebar role="admin" />


  {/* Contenu */}
  <main className="flex-1 overflow-y-auto px-5 pt-18 md:pt-0 pb-8 lg:p-10 bg-white">
<PageHeader
  leftTitle="Revenir"
  showRight={false}
  onBack={() => navigate("/liste-famille")}
/>
         <NavigationHeader
  title="Liste des coordinateurs"
  type="share"
  actionTitle="Exporter la liste des coordinateurs"
  onAction={() => {
    // Fonction d'export
  }}
  secondType="add"
  secondActionTitle="Ajouter un coordinateur"
  onSecondAction={() => navigate("/ajout-coordinateur")}
/>

          <div className="my-6">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              showFilter={false}
              maxWidth="max-w-full"
              placeholder="Entrer ici pour chercher"
            />
          </div>

        {filteredCoordinateurs.length === 0 && (
  <div className="flex-1 flex flex-col items-center justify-center py-10 md:py-20 px-4">
    <img
      src={NoResultImage}
      alt="Aucun résultat"
      className="w-56 sm:w-72 md:w-96 h-auto"
    />
  </div>
)}

{filteredCoordinateurs.length > 0 && (
  <div className="space-y-3">
    {filteredCoordinateurs.map((coordinateur) => (
      <div
    key={coordinateur.id}
    onClick={() => navigate("/fiche-coordinateur")}
    className="cursor-pointer"
  >
     <CardCoordinateur
  name={coordinateur.name}
  village={coordinateur.village}
  familles={coordinateur.familles}
  code={coordinateur.code}
  status={coordinateur.status}
/>
      </div>
    ))}
  </div>
)}

        </main>
      </div>
  
  );
}
