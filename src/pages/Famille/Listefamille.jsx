import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../components/providers/AuthProvider";
import { listFamilles } from "@/lib/api/familles";
import { listVillages } from "@/lib/api/Parametres";
import Spinner from "../../components/Spinner";
import Sidebar from "../../components/Sidebar/Sidebar";
import NavigationHeader from "../../components/Navigation,Pageheader/NavigationHeader";
import SearchBar from "../../components/Filter/Searchbar";
import Card from "../../components/Cards/card";
import Button from "../../components/Button/Button";
import SelectInput2 from "../../components/Containers/ChoiceContainer2";
import CardPopup from "../../components/Cards/card2";
import NoResultImage from "../../assets/no result picture.svg";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
import FilterTag from "../../components/Filter/FilterTag";
import { useNavigate } from "react-router-dom";


export default function FamiliesPage() {
    const { user, ready } = useAuth();
  const [search, setSearch] = useState("");
 const [selectedVillage, setSelectedVillage] = useState("");
const [selectedStatut, setSelectedStatut] = useState("");
const [selectedMois, setSelectedMois] = useState("");
 const [isFilterOpen, setIsFilterOpen] = useState(false);
const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
const navigate = useNavigate();
const moisOptions = [
  { label: "Janvier", value: 1 },
  { label: "Février", value: 2 },
  { label: "Mars", value: 3 },
  { label: "Avril", value: 4 },
  { label: "Mai", value: 5 },
  { label: "Juin", value: 6 },
  { label: "Juillet", value: 7 },
  { label: "Août", value: 8 },
  { label: "Septembre", value: 9 },
  { label: "Octobre", value: 10 },
  { label: "Novembre", value: 11 },
  { label: "Décembre", value: 12 },
];

   

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);
const [appliedFilters, setAppliedFilters] = useState({
  village: "",
  villageLabel: "",
  statut: "",
  statutLabel: "",
  mois_entree: "",
  moisLabel: "",
});

 const [filters, setFilters] = useState({
  village: "",
  villageLabel: "",
  statut: "",
  statutLabel: "",
  mois_entree: "",
  moisLabel: "",
});

 const {
    data: villagesData,
    isLoading: villagesLoading,
    isError: villagesError,
  } = useQuery({
    queryKey: ["villages"],
    queryFn: () => listVillages().then((r) => r.data),
  });
 const villages = villagesData?.results ?? [];

const villageOptions = villages.map((village) => ({
  label: village.nom,
  value: village.id,
}));

   const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["familles", appliedFilters],
    queryFn: () => listFamilles(appliedFilters).then((r) => r.data),
  });
const familles = data?.results ?? data ?? [];

if (isLoading) {
  return (
    <div className="min-h-screen grid place-items-center">
      <Spinner />
    </div>
  );
}
if (isError) {
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center text-red-500">
        <p>Impossible de charger les familles.</p>

        <button
          onClick={refetch}
          className="mt-2 underline"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}



const filtersContent = (
  <div className="space-y-2">
    <SelectInput2
      label="Village"
      placeholder="Tapez pour choisir un village"
      value={filters.village}
      onChange={(village) =>
        setFilters((prev) => ({
          ...prev,
          village: village.value,
          villageLabel: village.label,
        }))
      }
      options={villageOptions}
      noPadding
    />

    <SelectInput2
      label="Statut"
      placeholder="Choisir un statut"
      value={filters.statut}
      onChange={(selected) => {
        setFilters((prev) => ({
          ...prev,
          statut: selected.value,
        }));
      }}
      options={[
        { label: "Active", value: "active" },
        { label: "Sortie", value: "sortie" },
      ]}
      noPadding
    />

    <SelectInput2
      label="Mois d'entrée"
      placeholder="Choisir un mois"
      value={filters.mois_entree}
     onChange={(selected) => {
  setFilters((prev) => ({
    ...prev,
    mois_entree: selected.value,
    moisLabel: selected.label,
  }));
}}
     options={moisOptions}
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
          villageLabel: "",
          statut: "",
          mois_entree: "",
        };
        setFilters(empty);
        setAppliedFilters(empty);
      }}
    />
  </div>
);
const filterTagsContent = (
  <div className="flex flex-wrap gap-2 my-4">
   {appliedFilters.mois_entree && (
  <FilterTag
    text={appliedFilters.moisLabel}
    onRemove={() =>
      setAppliedFilters((prev) => ({
        ...prev,
        mois_entree: "",
        moisLabel: "",
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

 
  </div>
);
 

 const filteredFamilies = familles.filter((famille) => {
  const keyword = search.trim().toLowerCase();

  if (!keyword) return true;

  const normalizedKeyword = keyword.replace(/^0/, "");

  const enfant =
    famille.nourrisson?.prenom?.toLowerCase() ?? "";

  const mere =
    `${famille.mere?.prenom ?? ""} ${famille.mere?.nom ?? ""}`
      .toLowerCase();

  const code =
    famille.id?.toLowerCase() ?? "";
const sexeCode =
  famille.nourrisson?.sexe?.toLowerCase() ?? "";

const sexe =
  sexeCode === "m"
    ? "m masculin fils"
    : sexeCode === "f"
    ? "f feminin féminin fille"
    : "";


 const village =
  famille.mere?.village?.nom?.toLowerCase() ?? "";

  // Date venant du backend : "2025-04-05"
  const dateNaissance =
    famille.nourrisson?.date_naissance ?? "";

  let matchDate = false;

  if (dateNaissance) {
    const date = new Date(dateNaissance);

    if (!isNaN(date.getTime())) {
      const jour = String(date.getDate()).padStart(2, "0");
      const jourSansZero = String(date.getDate());

      const mois = date.toLocaleDateString("fr-FR", {
        month: "long",
      });

      const annee = String(date.getFullYear());

      matchDate = [
        dateNaissance.toLowerCase(),        // 2025-04-05
        `${jour} ${mois} ${annee}`,         // 05 avril 2025
        `${jourSansZero} ${mois} ${annee}`, // 5 avril 2025
        jour,                               // 05
        jourSansZero,                       // 5
        mois,                               // avril
        annee,                              // 2025
        `${jour} ${mois}`,                  // 05 avril
        `${jourSansZero} ${mois}`,          // 5 avril
      ].some((value) =>
        value.toLowerCase().includes(normalizedKeyword)
      );
    }
  }

  return (
    enfant.includes(normalizedKeyword) ||
    mere.includes(normalizedKeyword) ||
    code.includes(normalizedKeyword) ||
    sexe.includes(normalizedKeyword) ||
    village.includes(normalizedKeyword) ||
    matchDate
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
  appliedFilters.mois_entree ) && filterTagsContent}

      <div className="mt-6">
    {filtersContent}
</div>
    </div>
  );
}
  return (
     <div className="flex h-screen overflow-hidden bg-white">
    {/* Sidebar */}
   
     <Sidebar  />
   

  <main className="flex-1 overflow-y-auto px-5 pt-18 md:pt-0 pb-8 lg:p-10 bg-white">
     {user?.role === "admin" ? (
  <NavigationHeader
    title="Liste des familles"
    type="share"
    actionTitle="Exporter la liste des familles"
    onAction={() => {}}
    secondType="add"
    secondActionTitle="Ajouter une famille"
    onSecondAction={() => {
      navigate("/information-mere");
    }}
  />
) : (
  <NavigationHeader
    title="Liste des familles"
  />
)}

          <div className="my-6">
            <SearchBar
  value={search}
   onChange={(e) => {
    setSearch(e.target.value);
    setIsFilterOpen(false);
  }}
  onFilterClick={() => setIsFilterOpen((prev) => !prev)}
  maxWidth="max-w-full"
/>

{(appliedFilters.village ||
  appliedFilters.statut ||
  appliedFilters.mois_entree) && filterTagsContent}


          </div>

         

         {isError && (
  <div className="text-center text-red-500 py-6">
    <p>Impossible de charger les familles.</p>

    <button
      onClick={() => refetch()}
      className="mt-2 underline"
    >
      Réessayer
    </button>
  </div>
)}

      {!isError && filteredFamilies.length === 0 && (
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
  state: { from: "/liste-famille" },
})
  }
>
  <Card
  enfant={famille.nourrisson?.prenom}
  mere={`${famille.mere?.prenom ?? ""} ${famille.mere?.nom ?? ""}`}
  sexe={
    famille.nourrisson?.sexe === "M"
      ? "Fils"
      : "Fille"
  }
  region={famille.mere?.village?.nom ?? "-"}
  naissance={famille.nourrisson?.date_naissance}
  code={famille.id}
  badges={[
    // =========================
    // STATUT NUTRITIONNEL BÉBÉ
    // =========================

    famille.statut_nutritionnel_bebe === "mam" && {
      type: "mam",
      text: "MAM nourrisson",
    },

    famille.statut_nutritionnel_bebe === "mas" && {
      type: "mas",
      text: "MAS nourrisson",
    },

    famille.statut_nutritionnel_bebe === "normale" && {
      type: "mereNormal",
      text: "Bébé normal",
    },

    // =========================
    // STATUT NUTRITIONNEL MÈRE
    // =========================

    famille.statut_nutritionnel_mere === "normale" && {
      type: "mereNormal",
      text: "Mère normale",
    },

    famille.statut_nutritionnel_mere === "a_risque" && {
      type: "mereActive",
      text: "Mère à risque",
    },

    famille.statut_nutritionnel_mere === "malnutrition" && {
      type: "mas",
      text: "Mère malnutrie",
    },

   
    // =========================
    // VISITE EN RETARD
    // =========================

    famille.est_visite_en_retard && {
      type: "retard",
      text: "Visite en retard",
    },
  ].filter(Boolean)}
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
  enfant={famille.nourrisson?.prenom}
  sexe={famille.nourrisson?.sexe === "M" ? "Fils" : "Fille"}
  region={famille.mere?.village?.nom ?? "-"}
  naissance={famille.nourrisson?.date_naissance}
  code={famille.id}
  badges={[
    // =========================
    // STATUT NUTRITIONNEL BÉBÉ
    // =========================

    famille.statut_nutritionnel_bebe === "mam" && {
      type: "mam",
      text: "MAM nourrisson",
    },

    famille.statut_nutritionnel_bebe === "mas" && {
      type: "mas",
      text: "MAS nourrisson",
    },

    famille.statut_nutritionnel_bebe === "normale" && {
      type: "mereNormal",
      text: "Bébé normal",
    },

    // =========================
    // STATUT NUTRITIONNEL MÈRE
    // =========================

    famille.statut_nutritionnel_mere === "normale" && {
      type: "mereNormal",
      text: "Mère normale",
    },

    famille.statut_nutritionnel_mere === "a_risque" && {
      type: "mereRisque",
      text: "Mère à risque",
    },

    famille.statut_nutritionnel_mere === "malnutrition" && {
      type: "mereMalnutrition",
      text: "Mère malnutrie",
    },

   

    // =========================
    // VISITE EN RETARD
    // =========================

    famille.est_visite_en_retard && {
      type: "retard",
      text: "Visite en retard",
    },
  ].filter(Boolean)}
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
