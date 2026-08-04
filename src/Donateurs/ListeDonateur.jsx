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

  const [Donateurs] = useState([
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
      email: "kohamed@gmail.com",
      date: "08/05/2025",
      code: "GDK-2026-005",
      status: "Inactif",
    },


    

    

     
  ]);

  const filteredDonateurs = Donateurs.filter((item) => {
  const keyword = search.trim().toLowerCase();

  
  const normalizedKeyword = keyword.replace(/^0/, "");

  
  const date = item.date.toLowerCase();

  const [jour, mois, annee] = date.split("/");

  const jourSansZero = jour.replace(/^0/, "");
  const moisSansZero = mois.replace(/^0/, "");

  const matchDate = [
    date,                                // 12/05/2025
    `${jourSansZero}/${mois}/${annee}`,  // 5/05/2025
    `${jour}/${moisSansZero}/${annee}`,  // 05/5/2025
    `${jourSansZero}/${moisSansZero}/${annee}`, // 5/5/2025
    jour,                                // 05
    jourSansZero,                        // 5
    mois,                                // 05
    moisSansZero,                        // 5
    annee,                               // 2025
    `${jour}/${mois}`,                   // 05/05
    `${jourSansZero}/${moisSansZero}`,   // 5/5
  ].some((value) =>
    value.includes(normalizedKeyword)
  );

  return (
    item.name.toLowerCase().includes(normalizedKeyword) ||
    item.email.toLowerCase().includes(normalizedKeyword) ||
    item.code.toLowerCase().includes(normalizedKeyword) ||
    item.status.toLowerCase() === normalizedKeyword ||
    matchDate
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

  type="share"
  actionTitle="Exporter la liste des donateurs"
  onAction={() => console.log("Exporter")}

  secondType="add"
  secondActionTitle="Ajouter un donateur"
  onSecondAction={() => navigate("/ajout-donateur")}

  thirdType="export"
  thirdActionTitle="Importer un fichier"
  onThirdAction={() => console.log("Importer")}
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

        {filteredDonateurs.length === 0 && (
  <div className="flex-1 flex flex-col items-center justify-center py-10 md:py-20 px-4">
    <img
      src={NoResultImage}
      alt="Aucun résultat"
      className="w-56 sm:w-72 md:w-96 h-auto"
    />
  </div>
)}

{filteredDonateurs.length > 0 && (
   <div className="space-y-3">
    {filteredDonateurs.map((coordinateur) => (
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

