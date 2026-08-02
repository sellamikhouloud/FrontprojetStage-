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
import PopupDetailZakat from "../components/Popups/PopupdetailsZakat";
import PopupModifierZakat from "../components/Popups/PopupdetailsZakatModifier";
import  PopupAlimenterSolde from "../components/Popups/PopupAlimenterSolde";
import  SoldeCard from "../components/Cards/SoldeCard";
import  RepartitionAides from "../components/Cards/RepartitionAides";
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
  "Veuvage",
  "Situation d'urgence",
  "Vulnérabilité extreme",
  "Autre",
];
 const zakats = [
{
  id: 1,
  numero: "001",

  enfant: "Aïcha Mint Mohamed",
  mere: "Fatimetou Mint Ahmed",

  nom: "Aïcha Mint Mohamed",
  code: "GDK-2026-003",
  sexe: "Garçon",

  region: "Nouakchott",
  dateNaissance: "12/05/2023",

  causePrincipale: "Vulnérabilité extrême",

  zakat: "Zakat 1",

  date: "12/06/2026",

  montant: "1500",
  euro: "42 Euros",

  modePaiement: "Espèces",
  enregistrePar: "Administrateur",

  observations: "Aucune observation.",
  precisions: "Distribution effectuée."
}
];
const filtered = zakats.filter((item) => {
  const keyword = search.toLowerCase();

  const matchSearch =
    item.nom.toLowerCase().includes(keyword) ||
    item.code.toLowerCase().includes(keyword);

 
  

 
 const matchMotif =
  !appliedFilters.motif ||
  appliedFilters.motif === "Tous" ||
  item.causePrincipale === appliedFilters.motif;

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

const [selectedZakat, setSelectedZakat] = useState(null);
const [showDetailPopup, setShowDetailPopup] = useState(false);

const [openModifier, setOpenModifier] = useState(false);
 const [openAlimenterSolde, setOpenAlimenterSolde] = useState(false);
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
  title="Statistiques des zakats"
  secondType="add"
  secondActionTitle="Alimenter le solde"
  onSecondAction={() => setOpenAlimenterSolde(true)}
/>
 <div className="mb-4 grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-4">
  <SoldeCard
    soldeDisponible="34 000"
    soldeEnEuros="850"
    entreesMois="52 000"
    entreesMoisEnEuros="1 300"
    sortiesMois="18 000"
    sortiesMoisEnEuros="450"
    famillesAidees="12"
    versementsRealises="35"
    tauxActuel="0.022"
  />

  <RepartitionAides
    data={[
      { label: "Veuvage", percentage: 45 },
      { label: "Urgence", percentage: 25 },
      { label: "Vulnérabilité", percentage: 20 },
      { label: "Autre", percentage: 10 },
    ]}
  />
</div>

<NavigationHeader
  title="Liste des Zakat"

  type="share"
  actionTitle="Exporter la liste des Zakat"
  onAction={() => console.log("Exporter")}

  secondType="add"
  secondActionTitle="Ajouter une zakat"
  onSecondAction={() => navigate("/ajout-zakat")}
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
  montant="Montant"
  valeur={`${item.montant} MRU / ${item.euro}`}
  onClick={() => {
    setSelectedZakat(item);
    setShowDetailPopup(true);
  }}
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
     
 <PopupDetailZakat
    open={showDetailPopup}
    zakat={selectedZakat}
    onClose={() => setShowDetailPopup(false)}
    onEdit={(zakat) => {
        setShowDetailPopup(false);
        setSelectedZakat(zakat);
        setOpenModifier(true);
    }}
/>

<PopupModifierZakat
    open={openModifier}
    zakat={selectedZakat}
    onClose={() => {
        setOpenModifier(false);
        setShowDetailPopup(true);
    }}
    onSave={(updated) => {
        console.log(updated);
        setOpenModifier(false);
        setShowDetailPopup(true);
    }}
/>

<PopupAlimenterSolde
  open={openAlimenterSolde}
  onClose={() => setOpenAlimenterSolde(false)}
  onSave={(data) => {
    console.log(data);

    setOpenAlimenterSolde(false);
  }}
/>
    </div>
   
  );
}
