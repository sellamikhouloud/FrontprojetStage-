import { useState } from "react";
import { useEffect } from "react";
import PageHeader from "../components/Navigation,Pageheader/PageHeader";
import Sidebar from "../components/Sidebar/Sidebar";
import NavigationHeader from "../components/Navigation,Pageheader/NavigationHeader";
import SearchBar from "../components/Filter/Searchbar";
import Button from "../components/Button/Button";
import FilterTag from "../components/Filter/FilterTag";
import CardListZakat from "../components/Cards/CarteListeZakat";
import SelectInput  from "../components/Containers/ChoiceContainer";
import NoResultImage from "../assets/no result picture.svg";
import { useNavigate } from "react-router-dom";

export default function ZakatPage() {
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showStockPopup, setShowStockPopup] = useState(false);
  const navigate = useNavigate();
const [filters, setFilters] = useState({
  motif: "",
 
});

const [appliedFilters, setAppliedFilters] = useState({
  motif: "",
  
});
const motifOptions = [
  "Tous",
  "Naissance",
  "Décès",
  "Déménagement",
  "Autre",
];
 const zakats = [
  {
    id: 1,
    nom: "Aïcha Mint Mohamed",
    code: "GDK-2026-003",
    sexe: "Garçon",
    motif: "Naissance",
    zakat: "Zakat 1",
    date: "12/06/2026",
    montant: "Montant",
    valeur: "1500 MRU / 420 Euros",
  },
  {
    id: 2,
    nom: "Aïcha Mint Mohamed",
    code: "GDK-2026-004",
    sexe: "Fille",
    motif: "Décès",
    zakat: "Zakat 2",
    date: "12/06/2026",
    montant: "Montant",
    valeur: "1500 MRU / 420 Euros",
  },
  {
    id: 3,
    nom: "Mohamed Ould Ahmed",
    code: "GDK-2026-005",
    sexe: "Garçon",
    motif: "Déménagement",
    zakat: "Zakat 3",
    date: "17/05/2026",
    montant: "Montant",
    valeur: "2000 MRU / 470 Euros",
  },
  {
    id: 4,
    nom: "Fatimata Mint Sidi",
    code: "GDK-2026-006",
    sexe: "Garçon",
    motif: "Autre",
    zakat: "Zakat 4",
    date: "12/06/2026",
    montant: "Montant",
    valeur: "3500 MRU / 700 Euros",
  },
  {
    id: 5,
    nom: "Meriem Mint Ahmed",
    code: "GDK-2026-007",
    sexe: "Fille",
    motif: "Naissance",
    zakat: "Zakat 5",
    date: "12/09/2025",
    montant: "Montant",
    valeur: "5500 MRU / 1000 Euros",
  },
];
const filtered = zakats.filter((item) => {
  const keyword = search.toLowerCase();

  const matchSearch =
    item.nom.toLowerCase().includes(keyword) ||
    item.code.toLowerCase().includes(keyword);

 
  

 const matchMotif =
  !appliedFilters.motif ||
  appliedFilters.motif === "Tous" ||
  item.motif === appliedFilters.motif;

return matchSearch && matchMotif;
  
});

const filterTagsContent = (
  <div className="flex flex-wrap gap-2 my-4">
    {appliedFilters.motif && (
      <FilterTag
        text={`Motif : ${appliedFilters.motif}`}
        onRemove={() =>
          setAppliedFilters((prev) => ({
            ...prev,
            motif: "",
          }))
        }
      />
    )}
  </div>
);

const [isMobile, setIsMobile] = useState(
  window.innerWidth < 768
);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  window.addEventListener("resize", handleResize);

  return () =>
    window.removeEventListener(
      "resize",
      handleResize
    );
}, []);
const filtersContent = (
  <div className="space-y-4">
    <div className="w-full">
  <SelectInput
  label="Motif"
  placeholder="Tapez pour choisir la cause principale"
  value={filters.motif}
  options={motifOptions}
  noPadding
  onChange={(value) =>
    setFilters((prev) => ({
      ...prev,
      motif: value,
    }))
  }
/>
</div>

    <div className="mt-3 space-y-2">
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
          setFilters({ motif: "" });
          setAppliedFilters({ motif: "" });
        }}
      />
    </div>
  </div>
);

if (isFilterOpen && isMobile) {
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

    {appliedFilters.motif && filterTagsContent}

      <div className="mt-6">
        {filtersContent}
      </div>
    </div>
  );
}
  return (
    <div className="flex h-screen bg-white overflow-hidden">

      <Sidebar role="admin" />

      <main className="flex-1 overflow-y-auto px-5 pt-18 md:pt-0 pb-8 lg:p-10 bg-white">
       

 

<NavigationHeader
  title="Liste des Zakat"

  type="share"
  actionTitle="Exporter la liste des Zakat"
  onAction={() => console.log("Exporter")}

  secondType="add"
  secondActionTitle="Ajouter une distribution"
  onSecondAction={() => navigate("")}
/>
        <div className="my-6">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFilterClick={() => setIsFilterOpen(!isFilterOpen)}
            maxWidth="max-w-full"
          />
        </div>
{appliedFilters.motif && filterTagsContent}

{filtered.length === 0 && (
  <div className="flex-1 flex flex-col items-center justify-center py-10 md:py-20 px-4">
    <img
      src={NoResultImage}
      alt="Aucun résultat"
      className="w-56 sm:w-72 md:w-96 h-auto"
    />
  </div>
)}
        <div className="flex gap-6">

          {/* Liste */}

          <div className="flex-1 space-y-3">

            {filtered.map((item) => (
            <CardListZakat
  nom={item.nom}
  code={item.code}
  sexe={item.sexe}
  zakat={item.zakat}
  date={item.date}
  montant={item.montant}
  valeur={item.valeur}
/>
            ))}

          </div>

          {/* Filtres */}
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
