import { useState } from "react";
import { useEffect } from "react";
import PageHeader from "../components/Navigation,Pageheader/PageHeader";
import Sidebar from "../components/Sidebar/Sidebar";
import NavigationHeader from "../components/Navigation,Pageheader/NavigationHeader";
import SearchBar from "../components/Filter/Searchbar";
import Button from "../components/Button/Button";
import FilterTag from "../components/Filter/FilterTag";
import DateSelect from "../components/Containers/DateSelect.jsx";
import PopupDetailDistribution from "../components/Popups/PopupdetailsDistributions";
import PopupDetailDistributionModifier from "../components/Popups/PopupdetailsDistributionsModifier";
import CardListDistribution from "../components/Cards/CarteListeDistribution";

export default function DistributionPage() {
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
const [filters, setFilters] = useState({
  statutZakat: "",
  dateDebut: null,
  dateFin: null,
});

const [appliedFilters, setAppliedFilters] = useState({
  statutZakat: "",
  dateDebut: null,
  dateFin: null,
});
 const distributions = [
  {
    id: 1,
    nom: "Aïcha Mint Mohamed",
    code: "GDK-2026-003",
    sexe: "Fille",

    distribution: "Distribution 1",
    numeroDistribution: 1,
    date: "15/05/2026",

    enfant: "Aïcha Mint Mohamed",
    mere: "Meriem Mint Ahmed",
    region: "Lexeiba",
    dateNaissance: "12 mars 2025",

    enregistrePar: "Coordinateur",

    typeLait: "2ème âge (6–12 mois)",
    nombreBoites: "2 boîtes",
    poidsTotal: "1600 g",
 produits: [
    { nom: "Lait thérapeutique", quantite: "2 boîtes" },
    { nom: "Riz", quantite: "5 kg" },
    { nom: "Huile", quantite: "1 L" },
  ],

    colisAlimentaire: [
      { label: "Riz", value: "5 kg" },
      { label: "Huile", value: "1 L" },
      { label: "Sucre", value: "2 kg" },
      { label: "Farine", value: "3 kg" },
    ],
  },
];
const filtered = distributions.filter((item) => {
  const keyword = search.toLowerCase();

  const matchSearch =
    item.nom.toLowerCase().includes(keyword) ||
    item.code.toLowerCase().includes(keyword);

  const itemDate = new Date(
    item.date.split("/").reverse().join("-")
  );

  const matchDateDebut =
    !appliedFilters.dateDebut ||
    itemDate >= appliedFilters.dateDebut;

  const matchDateFin =
    !appliedFilters.dateFin ||
    itemDate <= appliedFilters.dateFin;

  return (
    matchSearch &&
    matchDateDebut &&
    matchDateFin
  );
});
const [selectedDistribution, setSelectedDistribution] = useState(null);
const [isPopupOpen, setIsPopupOpen] = useState(false);
const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
const filterTagsContent = (
  <div className="flex flex-wrap gap-2 my-4">
    {appliedFilters.dateDebut && (
      <FilterTag
        text={`Début : ${appliedFilters.dateDebut.toLocaleDateString("fr-FR")}`}
        onRemove={() =>
          setAppliedFilters((prev) => ({
            ...prev,
            dateDebut: null,
          }))
        }
      />
    )}

    {appliedFilters.dateFin && (
      <FilterTag
        text={`Fin : ${appliedFilters.dateFin.toLocaleDateString("fr-FR")}`}
        onRemove={() =>
          setAppliedFilters((prev) => ({
            ...prev,
            dateFin: null,
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

    <DateSelect
      placeholder="Tapez pour choisir la date debut"
      value={filters.dateDebut}
      onChange={(date) =>
        setFilters({
          ...filters,
          dateDebut: date,
        })
      }
    />

    <DateSelect
      placeholder="Tapez pour choisir la date fin"
      value={filters.dateFin}
      onChange={(date) =>
        setFilters({
          ...filters,
          dateFin: date,
        })
      }
    />

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
          const empty = {
            dateDebut: null,
            dateFin: null,
          };

          setFilters(empty);
          setAppliedFilters(empty);
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

      {(appliedFilters.dateDebut ||
        appliedFilters.dateFin) &&
        filterTagsContent}

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
          title="Stock de produit"
          type="add"
          actionTitle="ajuster le stock et voir tous "
        />

        <NavigationHeader
          title="Liste des distributions"
          type="add"
          actionTitle="Ajouter une distribution"
        />

        <div className="my-6">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFilterClick={() => setIsFilterOpen(!isFilterOpen)}
            maxWidth="max-w-full"
          />
        </div>
{(appliedFilters.dateDebut || appliedFilters.dateFin) &&
  filterTagsContent}
        <div className="flex gap-6">

          {/* Liste */}

          <div className="flex-1 space-y-3">

            {filtered.map((item) => (
             <CardListDistribution
  key={item.id}
  sexe={item.sexe}
  nom={item.nom}
  code={item.code}
  distribution={item.distribution}
  date={item.date}
  produits={item.produits}
 onClick={() => {
  setSelectedDistribution(item);
  setIsPopupOpen(true);
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
<PopupDetailDistribution
  open={isPopupOpen}
  distribution={selectedDistribution}
  onClose={() => {
    setIsPopupOpen(false);
    setSelectedDistribution(null);
  }}
 onEdit={(distribution) => {
  setSelectedDistribution(distribution);

  setIsPopupOpen(false);

  setIsEditPopupOpen(true);
}}
  onDelete={(distribution) => {
    console.log("Supprimer", distribution);
    setIsPopupOpen(false);
  }}
/>

<PopupDetailDistributionModifier
  open={isEditPopupOpen}
  distribution={selectedDistribution}
  onClose={() => {
    setIsEditPopupOpen(false);
  }}
  onEdit={(updatedDistribution) => {
    console.log(updatedDistribution);

    // ici plus tard API
    setIsEditPopupOpen(false);
  }}
/>
      </main>

    </div>
  );
}
