import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar/Sidebar";
import NavigationHeader from "../components/Navigation,Pageheader/NavigationHeader";
import SearchBar from "../components/Filter/Searchbar";
import Card from "../components/Cards/card";
import Button from "../components/Button/Button";
import SelectInput from "../components/Containers/ChoiceContainer";
import CardPopup from "../components/Cards/card2";
import NoResultImage from "../assets/no result picture.svg";
import PageHeader from "../components/Navigation,Pageheader/PageHeader";
import FilterTag from "../components/Filter/FilterTag";
import { useNavigate } from "react-router-dom";


export default function FamiliesPage() {
  const [search, setSearch] = useState("");
  const [familles, setFamilles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 const [isFilterOpen, setIsFilterOpen] = useState(false);
const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
const navigate = useNavigate();

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);
  const [appliedFilters, setAppliedFilters] = useState({
  village: "",
  statut: "",
  mois: "",
  statutZakat: "",
});
  

  const [filters, setFilters] = useState({
  village: "",
  statut: "",
  mois: "",
  statutZakat: "",
});



const filtersContent = (
  <div className="space-y-2">
    <SelectInput
      label="Village"
      placeholder="Tapez pour choisir un village"
      value={filters.village}
      onChange={(value) =>
        setFilters({
          ...filters,
          village: value,
        })
      }
      options={[
        "Lexeiba",
        "Rosso",
        "Kaédi",
        "Atar",
      ]}
      noPadding
    />

    <SelectInput
      label="Statut"
      placeholder="Tapez pour choisir le statut"
      value={filters.statut}
      onChange={(value) =>
        setFilters({
          ...filters,
          statut: value,
        })
      }
      options={[
        "En attente",
        "Suivie",
        "Terminée",
      ]}
      noPadding
    />

    <SelectInput
      label="Mois d'entrée"
      placeholder="Tapez pour choisir le mois d'entrée"
      value={filters.mois}
      onChange={(value) =>
        setFilters({
          ...filters,
          mois: value,
        })
      }
      options={[
        "Janvier",
        "Février",
        "Mars",
        "Avril",
      ]}
      noPadding
    />

    <SelectInput
      label="Statut Zakat"
      placeholder="Tapez pour choisir le statut zakat"
      value={filters.statutZakat}
      onChange={(value) =>
        setFilters({
          ...filters,
          statutZakat: value,
        })
      }
      options={[
        "Oui",
        "Non",
      ]}
      noPadding
    />

    <Button
      title="Filtrer"
      variant="filter"
      noPadding
      onClick={() => {
        setAppliedFilters(filters);

       setIsFilterOpen(false);
      }}
    />

    <Button
      title="Annuler les filtres"
      variant="outline"
      noPadding
      onClick={() => {
        const empty = {
          village: "",
          statut: "",
          mois: "",
          statutZakat: "",
        };

        setFilters(empty);
        setAppliedFilters(empty);
      }}
    />
  </div>
);
const filterTagsContent = (
  <div className="flex flex-wrap gap-2 my-4">
    {appliedFilters.mois && (
      <FilterTag
        text={appliedFilters.mois}
        onRemove={() =>
          setAppliedFilters((prev) => ({
            ...prev,
            mois: "",
          }))
        }
      />
    )}

    {appliedFilters.statut && (
      <FilterTag
        text={appliedFilters.statut}
        onRemove={() =>
          setAppliedFilters((prev) => ({
            ...prev,
            statut: "",
          }))
        }
      />
    )}

    {appliedFilters.village && (
      <FilterTag
        text={appliedFilters.village}
        onRemove={() =>
          setAppliedFilters((prev) => ({
            ...prev,
            village: "",
          }))
        }
      />
    )}

    {appliedFilters.statutZakat && (
      <FilterTag
        text={appliedFilters.statutZakat}
        onRemove={() =>
          setAppliedFilters((prev) => ({
            ...prev,
            statutZakat: "",
          }))
        }
      />
    )}
  </div>
);
  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setFamilles([
        {
          id: 1,
          enfant: "Aïcha Mint Mohamed",
          mere: "Meriem",
          sexe: "Fille",
          region: "Lexeiba",
          naissance: "12 mars 2026",
          code: "GDK-2026-003",
          badges: [
            { type: "mam", text: "MAM nourrisson" },
            { type: "mere", text: "Mère normale" },
            { type: "retard", text: "Visite en retard" },
          ],
        },
        {
          id: 2,
          enfant: "Mohamed Ahmed",
          mere: "Fatima",
          sexe: "Fils",
          region: "Nouakchott",
          naissance: "05 avril 2025",
          code: "GDK-2026-004",
          badges: [
            { type: "mam", text: "MAM nourrisson" },
            { type: "mere", text: "Mère normale" },
          ],
        },
        {
          id: 3,
          enfant: "Salma Mohamed",
          mere: "Khadija",
          sexe: "Fille",
          region: "Rosso",
          naissance: "15 janvier 2026",
          code: "GDK-2026-005",
          badges: [
            { type: "mas", text: "MAS nourrisson" },
            { type: "mere", text: "Mère normale" },
          ],
        },
        {
          id: 4,
          enfant: "Youssef Ali",
          mere: "Amina",
          sexe: "Fils",
          region: "Atar",
          naissance: "20 février 2025",
          code: "GDK-2026-006",
          badges: [
            { type: "mam", text: "MAM nourrisson" },
            { type: "mere", text: "Mère normale" },
            { type: "retard", text: "Visite en retard" },
          ],
        },
        {
          id: 5,
          enfant: "Mariem Ould Ahmed",
          mere: "Zeinab",
          sexe: "Fille",
          region: "Kaédi",
          naissance: "08 août 2025",
          code: "GDK-2026-007",
          badges: [
            { type: "mas", text: "MAS nourrisson" },
            { type: "mere", text: "Mère normale" },
          ],
        },

         {
          id: 5,
          enfant: "Mariem Ould Ahmed",
          mere: "Zeinab",
          sexe: "Fille",
          region: "Kaédi",
          naissance: "08 août 2025",
          code: "GDK-2026-007",
          badges: [
            { type: "mas", text: "MAS nourrisson" },
            { type: "mere", text: "Mère normale" },
          ],
        },

         {
          id: 5,
          enfant: "Mariem Ould Ahmed",
          mere: "Zeinab",
          sexe: "Fille",
          region: "Kaédi",
          naissance: "08 août 2025",
          code: "GDK-2026-007",
          badges: [
            { type: "mas", text: "MAS nourrisson" },
            { type: "mere", text: "Mère normale" },
          ],
        },
      ]);

      setLoading(false);
    }, 500);
  }, []);

  const filteredFamilies = familles.filter((famille) => {
    const keyword = search.toLowerCase();

    return (
      famille.enfant.toLowerCase().includes(keyword) ||
      famille.code.toLowerCase().includes(keyword)
    );
  });
if  (isFilterOpen && isMobile)  {
  return (
    <div className="min-h-screen bg-white p-6 md:hidden">
      <PageHeader
        leftTitle="Revenir"
        showRight={false}
        onBack={() => setIsFilterOpen(false)}
      />

      <div className="mt-6">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFilterClick={() => {}}
          maxWidth="max-w-full"
        />
      </div>


      {(appliedFilters.village ||
  appliedFilters.statut ||
  appliedFilters.mois ||
  appliedFilters.statutZakat) && filterTagsContent}

      <div className="mt-6">
    {filtersContent}
</div>
    </div>
  );
}
  return (
     <div className="flex h-screen overflow-hidden bg-white">
    {/* Sidebar */}
   
      <Sidebar role="admin" />
   

  <main className="flex-1 overflow-y-auto px-5 pt-18 md:pt-0 pb-8 lg:p-10 bg-white">
        <NavigationHeader
  title="Liste des familles"
  type="add"
  actionTitle="Ajouter une famille"
  onAction={() => {
    console.log("Button clicked");
    navigate("/information-mere");
  }}
/>

          <div className="my-6">
            <SearchBar
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  onFilterClick={() => setIsFilterOpen((prev) => !prev)}
  maxWidth="max-w-full"
/>

{(appliedFilters.village ||
  appliedFilters.statut ||
  appliedFilters.mois ||
  appliedFilters.statutZakat) && filterTagsContent}


          </div>

          {loading && (
            <p className="text-center text-gray-500">
              Chargement...
            </p>
          )}

          {error && (
            <p className="text-center text-red-500">
              {error}
            </p>
          )}

         {!loading && filteredFamilies.length === 0 && (
  <div className="flex-1 flex flex-col items-center justify-center py-10 md:py-20 px-4">
    <img
      src={NoResultImage}
      alt="Aucun résultat"
      className="w-56 sm:w-72 md:w-96 h-auto"
    />

    
  </div>
)}
          <div className="flex gap-6">
           <div className="flex-1 space-y-4">
 {filteredFamilies.length > 0 && (
  <div className="w-full flex-1 space-y-3">
    {filteredFamilies.map((famille) => (
      <div key={famille.id}>
        {/* Desktop */}
       <div
  className="hidden md:block cursor-pointer"
  onClick={() =>
    navigate(`/famille/${famille.id}`, {
      state: famille,
    })
  }
>
  <Card
    enfant={famille.enfant}
    mere={famille.mere}
    sexe={famille.sexe}
    region={famille.region}
    naissance={famille.naissance}
    code={famille.code}
    badges={famille.badges}
  />
</div>

        {/* Mobile */}
       <div
  className="block md:hidden cursor-pointer"
  onClick={() =>
    navigate(`/famille/${famille.id}`, {
      state: famille,
    })
  }
>
  <CardPopup
    enfant={famille.enfant}
    sexe={famille.sexe}
    region={famille.region}
    naissance={famille.naissance}
    code={famille.code}
    badges={famille.badges}
  />
</div>
      </div>
    ))}
  </div>
)}
</div>

{isFilterOpen && !isMobile && (
  <div className="w-[320px] shrink-0">
    {filtersContent}
  </div>
)}
          </div>
        </main>
      </div>
    
  );
}
