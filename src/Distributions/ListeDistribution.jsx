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

import CardListDistribution from "../components/Cards/CarteListeDistribution";
import StockCard from "../components/Cards/StockCard";
import StockPopup from "../components/Popups/StockPopup";
import PopupValidationProduit from "../components/Popups/PopupValidationProduit";
import PopupHistoriqueProduit from "../components/Popups/Popuphistoriqueproduit";
import NoResultImage from "../assets/no result picture.svg";
import { useNavigate } from "react-router-dom";

export default function DistributionPage() {
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showStockPopup, setShowStockPopup] = useState(false);
  const navigate = useNavigate();
  const [showValidation, setShowValidation] = useState(false);
const [produitSelectionne, setProduitSelectionne] = useState(null);
const [showHistorique, setShowHistorique] = useState(false);
const [produitHistorique, setProduitHistorique] = useState(null);
const [filters, setFilters] = useState({
  
  dateDebut: null,
  dateFin: null,
});

const [appliedFilters, setAppliedFilters] = useState({
 
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
const [products, setProducts] = useState([
  {
    nom: "Lait",
    quantity: 38,
    unite: "boîtes",
    threshold: 1,
    statut: "valide",

  },
  {
    nom: "Céréales",
    quantity: 38,
    unite: "Kg",
    threshold: 1,
    statut: "en_attente",
    date: "12/06/2026",
    enregistrePar: "nom Coor",
  },
  {
    nom: "Huile",
    quantity: 38,
    unite: "Litres",
    threshold: 1,
    statut: "valide",
  },
  {
    nom: "Sucre",
    quantity: 38,
    unite: "Kg",
    threshold: 1,
    statut: "valide",
  },
  {
    nom: "Sel iodé",
    quantity: 38,
    unite: "Kg",
    threshold: 1,
    statut: "en_attente",
    date: "12/06/2026",
    enregistrePar: "nom Coor",
  },
  {
    nom: "Légumineuses",
    quantity: 38,
    unite: "Kg",
    threshold: 1,
    statut: "valide",
  },
  {
    nom: "Lait",
    quantity: 38,
    unite: "boîtes",
    threshold: 1,
    statut: "valide",
  },
  {
    nom: "Légumineuses",
    quantity: 38,
    unite: "Kg",
    threshold: 1,
    statut: "en_attente",
    date: "12/06/2026",
    enregistrePar: "nom Coor",
  },
  {
    nom: "Huile",
    quantity: 38,
    unite: "Litres",
    threshold: 1,
    statut: "valide",
  },
]);

// Mock — à remplacer plus tard par un vrai fetch backend
const historiqueParProduit = {
  "Lait": [
    { id: 1, type: "ajout", quantite: 20, unite: "boîtes", par: "Coordinateur Ahmed", date: "10/06/2026" },
    { id: 2, type: "retrait", quantite: 5, unite: "boîtes", par: "Coordinateur sarah", date: "12/06/2026" },
    { id: 3, type: "ajout", quantite: 23, unite: "boîtes", par: "Coordinateur Ahmed", date: "18/06/2026" },
  ],
  "Céréales": [
    { id: 1, type: "ajout", quantite: 40, unite: "Kg", par: "Coordinateur Sarah", date: "05/06/2026" },
    { id: 2, type: "retrait", quantite: 2, unite: "Kg", par: "Coordinateur ahmed", date: "08/06/2026" },
  ],
  "Huile": [
    { id: 1, type: "ajout", quantite: 38, unite: "Litres", par: "Coordinateur Ahmed", date: "01/06/2026" },
  ],
  "Sucre": [
    { id: 1, type: "ajout", quantite: 30, unite: "Kg", par: "Coordinateur Sarah", date: "03/06/2026" },
    { id: 2, type: "retrait", quantite: 8, unite: "Kg", par: "Coordinateur ahmed", date: "09/06/2026" },
    { id: 3, type: "ajout", quantite: 16, unite: "Kg", par: "Coordinateur Sarah", date: "15/06/2026" },
    { id: 1, type: "ajout", quantite: 30, unite: "Kg", par: "Coordinateur Sarah", date: "03/06/2026" },
    { id: 2, type: "retrait", quantite: 8, unite: "Kg", par: "Coordinateur ahmed", date: "09/06/2026" },
    { id: 3, type: "ajout", quantite: 16, unite: "Kg", par: "Coordinateur Sarah", date: "15/06/2026" },
  ],
  "Sel iodé": [
    { id: 1, type: "ajout", quantite: 38, unite: "Kg", par: "Coordinateur Ahmed", date: "12/06/2026" },
  ],
  "Légumineuses": [
    { id: 1, type: "ajout", quantite: 25, unite: "Kg", par: "Coordinateur Sarah", date: "02/06/2026" },
    { id: 2, type: "retrait", quantite: 3, unite: "Kg", par: "Coordinateur Sarah", date: "07/06/2026" },
    { id: 3, type: "ajout", quantite: 16, unite: "Kg", par: "Coordinateur Ahmed", date: "14/06/2026" },
  ],
};

const handleCardClick = (item, index) => {
  if (item.statut === "en_attente") {
    if (role === "admin") {
      setProduitSelectionne({
        id: index,
        nom: item.nom,
        quantite: item.quantity,
        unite: item.unite,
        date: item.date,
        enregistrePar: item.enregistrePar,
      });
      setShowValidation(true);
    }
  } else {
    setProduitHistorique({
      nom: item.nom,
      unite: item.unite,
      mouvements: historiqueParProduit[item.nom] || [],
    });
    setShowHistorique(true);
  }
};
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
      placeholder="Tapez pour choisir la date debut d'une periode"
      value={filters.dateDebut}
      onChange={(date) =>
        setFilters({
          ...filters,
          dateDebut: date,
        })
      }
    />

    <DateSelect
      placeholder="Tapez pour choisir la date de fin d'une periode "
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

// Transforme les données "plates" d'une distribution existante
// vers le format attendu par AjoutDistribution (products, laitType, grammage, boxes...)
const mapDistributionToEditData = (distribution) => {
  // Produits (colis alimentaire) : "5 kg" → { quantity: 5, unit: "kg" }
  const products = (distribution.produits || [])
    .filter((p) => !p.nom?.toLowerCase().includes("lait")) // le lait est géré séparément
    .map((p, index) => {
      const match = p.quantite?.match(/([\d.]+)\s*([a-zA-Zé]+)/);
      const quantity = match ? parseFloat(match[1]) : 0;
      const unit = match ? match[2] : "";

      return {
        id: index + 1, // ⚠️ idéalement un vrai id backend, pas un index généré
        title: p.nom,
        quantity,
        unit,
        maxQuantity: quantity, // pas de vraie limite de stock connue ici
        icon: null, // ⚠️ pas d'icône disponible depuis ces données — à mapper si tu as un stock avec icônes
      };
    });

  // Lait infantile
  const boxesMatch = distribution.nombreBoites?.match(/(\d+)/);
  const boxes = boxesMatch ? parseInt(boxesMatch[1], 10) : 0;

  const poidsTotalMatch = distribution.poidsTotal?.match(/([\d.]+)/);
const poidsTotal = poidsTotalMatch ? parseFloat(poidsTotalMatch[1]) : 0;

const grammage =
  boxes > 0 && poidsTotal > 0
    ? String(Math.round(poidsTotal / boxes))
    : "";

  const laitType = distribution.typeLait || null;

  return { products, laitType, grammage, boxes };
};


   // Simulation du rôle
  const role = "admin";
  //const role = "coordinateur";

  const isAdmin = role === "admin";

  return (
    <div className="flex h-screen bg-white overflow-hidden">

      <Sidebar  role={role} />

      <main className="flex-1 overflow-y-auto px-5 pt-18 md:pt-0 pb-8 lg:p-10 bg-white">
        <NavigationHeader
          title="Stock de produit"
          type="add"
          actionTitle="ajuster le stock et voir tous "
          onAction={() => setShowStockPopup(true)}
        />
       

         {/* Stock cards */}
 <div className="mt-6 mb-5 w-full overflow-x-auto scrollbar-hide">
  <div className="flex gap-[4px] md:gap-[10px] w-max">
   {products.map((item, index) => (
  <StockCard
    key={index}
    nom={item.nom}
    quantity={item.quantity}
    unite={item.unite}
    statut={item.statut}
    showStatusColor={isAdmin}
    onClick={() => handleCardClick(item, index)}
  />
))}
  </div>
</div>

       <NavigationHeader
  title="Liste des distributions"

  type="share"
  actionTitle="Exporter la liste des distributions"
  onAction={() => console.log("Exporter")}

  secondType="add"
  secondActionTitle="Ajouter une distribution"
  onSecondAction={() => navigate("/ajout-distribution")}
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
  setIsPopupOpen(false);

  const { products, laitType, grammage, boxes } = mapDistributionToEditData(distribution);

  navigate("/ajout-distribution", {
    state: {
      distributionAModifier: {
        ...distribution,
        selectedFamille: {
          id: distribution.id,
          enfant: distribution.enfant,
          mere: distribution.mere,
          sexe: distribution.sexe,
          region: distribution.region,
          naissance: distribution.dateNaissance,
          code: distribution.code,
          badges: distribution.badges || [],
        },
        products,
        laitType,
        grammage,
        boxes,
        confirmed: true, // une distribution déjà enregistrée était forcément confirmée
      },
    },
  });
}}
  onDelete={(distribution) => {
    console.log("Supprimer", distribution);
    setIsPopupOpen(false);
  }}
/>

     
{showStockPopup && (
  <StockPopup
    onClose={() => setShowStockPopup(false)}
    initialProducts={products}
    onSaveProducts={setProducts}
  />
)}

<PopupValidationProduit
  open={showValidation}
  produit={produitSelectionne}
  onClose={() => {
    setShowValidation(false);
    setProduitSelectionne(null);
  }}
  onValider={({ id, quantite }) => {
    setProducts((prev) =>
      prev.map((p, i) =>
        i === id
          ? { ...p, statut: "valide", quantity: quantite || p.quantity }
          : p
      )
    );
    setProduitSelectionne(null);
  }}
  onRefuser={({ id }) => {
    setProducts((prev) =>
      prev.map((p, i) => (i === id ? { ...p, statut: "refuse" } : p))
    );
    setProduitSelectionne(null);
  }}
/>
<PopupHistoriqueProduit
  open={showHistorique}
  produit={produitHistorique}
  historique={produitHistorique?.mouvements || []}
  onClose={() => {
    setShowHistorique(false);
    setProduitHistorique(null);
  }}
/>
      </main>
     
  
    </div>
   
  );
}
