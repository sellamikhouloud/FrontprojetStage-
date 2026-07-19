import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import NavigationHeader from "../components/Navigation,Pageheader/NavigationHeader";
import SearchBar from "../components/Filter/Searchbar";
import CardDonateur from "../components/Cards/carteDonateur";
import PageHeader from "../components/Navigation,Pageheader/PageHeader";
import NoResultImage from "../assets/no result picture.svg";

export default function ListeDonateur() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [coordinateurs] = useState([
    {
      id: 1,
      name: "Amadou Ba",
      email: "amadouba@gmail.com",
      date: "12/05/2025",
      code: "GDK-2026-003",
      status: "Actif",
    },
    {
      id: 2,
      name: "Fatima Ahmed",
      email: "fatima@gmail.com",
      date: "10/05/2025",
      code: "GDK-2026-004",
      status: "Actif",
    },
    {
      id: 3,
      name: "Mohamed Ali",
      email: "mohamed@gmail.com",
      date: "08/05/2025",
      code: "GDK-2026-005",
      status: "Inactif",
    },


    

    

     
  ]);

  const filteredCoordinateurs = coordinateurs.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.name.toLowerCase().includes(keyword) ||
      item.code.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="flex h-screen overflow-hidden bg-white">
  {/* Sidebar */}
 
    <Sidebar role="admin" />
 

  {/* Contenu */}
 <main className="flex-1 overflow-y-auto px-5 pt-18 md:pt-0 pb-8 lg:p-10 bg-white">

         <NavigationHeader
  title="Liste des donateurs"
  type="add"
  actionTitle="Ajouter un donateur"
  onAction={() => navigate("/ajout-donateur")}

  secondType="export"
  secondActionTitle="Importer un fichier"
  onSecondAction={() => console.log("Importer")}
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
   <div className="space-y-4">
    {filteredCoordinateurs.map((coordinateur) => (
      <div
  key={coordinateur.id}
  className="cursor-pointer"
 onClick={() => navigate("/fiche-donateur")}
>
        <CardDonateur
          name={coordinateur.name}
          email={coordinateur.email}
          date={coordinateur.date}
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
