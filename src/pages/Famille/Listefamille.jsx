import { useEffect, useState, useRef, useCallback } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "../../components/Providers/AuthProvider";
import { listFamilles , exportFamilles } from "@/lib/api/familles";
import { listVillages } from "@/lib/api/Parametres";
import Spinner from "../../components/Spinner";
import Sidebar from "../../components/Sidebar/Sidebar";
import NavigationHeader from "../../components/Navigation,Pageheader/NavigationHeader";
import SearchBar from "../../components/Filter/Searchbar";
import Card from "../../components/Cards/Card";
import Button from "../../components/Button/Button";
import SelectInput2 from "../../components/Containers/ChoiceContainer2";
import CardPopup from "../../components/Cards/Card2";
import NoResultImage from "../../assets/no result picture.svg";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
import FilterTag from "../../components/Filter/FilterTag";
import { useNavigate } from "react-router-dom";


export default function FamiliesPage() {
    const { user, ready } = useAuth();
  const [search, setSearch] = useState("");

    const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);


 const [selectedVillage, setSelectedVillage] = useState("");
const [selectedStatut, setSelectedStatut] = useState("");
const [selectedMois, setSelectedMois] = useState("");
const [selectedSexe, setSelectedSexe] = useState("");
 const [isFilterOpen, setIsFilterOpen] = useState(false);
const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
const navigate = useNavigate();

const handleExport = async () => {
  try {
    const response = await exportFamilles();

    const blob = new Blob(
      [response.data],
      {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Liste_familles.xlsx";

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(
      "Erreur lors de l'export de la liste des familles :",
      error
    );
  }
};

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
  sexe: "",
  sexeLabel: "",
  statut_zakat: "",
  statutZakatLabel: "",
});
const [filters, setFilters] = useState({
  village: "",
  villageLabel: "",
  statut: "",
  statutLabel: "",
  mois_entree: "",
  moisLabel: "",
  sexe: "",
  sexeLabel: "",
  statut_zakat: "",
  statutZakatLabel: "",
});

 const {
    data: villagesData,
    isLoading: villagesLoading,
    isError: villagesError,
  } = useQuery({
    queryKey: ["villages"],
    queryFn: () => listVillages().then((r) => r.data),
  });
 
  const villages = villagesData?.results ?? villagesData ?? [];

const villageOptions = villages.map((village) => ({
  label: village.nom,
  value: village.id,
}));

const {
  data,
  isLoading,
  isError,
  error,
  refetch,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ["familles", search, appliedFilters],

  queryFn: async ({ pageParam = 1 }) => {
    const params = { page: pageParam };

    const trimmedSearch = search.trim();

    if (trimmedSearch) {
      params.search = trimmedSearch;
    }

    if (appliedFilters.village) {
      params.village = appliedFilters.village;
    }

    if (appliedFilters.statut) {
      params.statut = appliedFilters.statut;
    }

    if (appliedFilters.mois_entree) {
      params.mois_entree = appliedFilters.mois_entree;
    }

    if (appliedFilters.sexe) {
      params.sexe = appliedFilters.sexe;
    }

    if (appliedFilters.statut_zakat) {
      params.statut_zakat = appliedFilters.statut_zakat;
    }

    const response = await listFamilles(params);
    return response.data;
  },

  getNextPageParam: (lastPage, allPages) =>
    lastPage?.next ? allPages.length + 1 : undefined,

  initialPageParam: 1,
  keepPreviousData: true,
  retry: 1,
});

const familles = (data?.pages ?? []).flatMap((page) =>
  Array.isArray(page) ? page : page?.results ?? []
);

const observerTarget = useRef(null);

useEffect(() => {
  if (!observerTarget.current) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    { threshold: 1 }
  );

  observer.observe(observerTarget.current);

  return () => observer.disconnect();
}, [hasNextPage, isFetchingNextPage, fetchNextPage]);




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
  label="Sexe"
  placeholder="Choisir un sexe"
  value={filters.sexe}
  onChange={(selected) => {
    setFilters((prev) => ({
      ...prev,
      sexe: selected.value,
      sexeLabel: selected.label,
    }));
  }}
  options={[
    { label: "Masculin", value: "M" },
    { label: "Féminin", value: "F" },
  ]}
  noPadding
/>

<SelectInput2
  label="Statut Zakat"
  placeholder="Choisir un statut"
  value={filters.statut_zakat}
  onChange={(selected) => {
    setFilters((prev) => ({
      ...prev,
      statut_zakat: selected.value,
      statutZakatLabel: selected.label,
    }));
  }}
  options={[
    { label: "A bénéficié", value: "true" },
    { label: "N'a pas bénéficié", value: "false" },
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
    statutLabel: "",
    mois_entree: "",
    moisLabel: "",
    sexe: "",
    sexeLabel: "",
    statut_zakat: "",
    statutZakatLabel: "",
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
            statutLabel: "",
          }))
        }
      />
    )}

     {appliedFilters.sexe && (
      <FilterTag
        text={appliedFilters.sexeLabel}
        onRemove={() =>
          setAppliedFilters((prev) => ({
            ...prev,
            sexe: "",
            sexeLabel: "",
          }))
        }
      />
    )}

    {appliedFilters.statut_zakat && (
  <FilterTag
    text={appliedFilters.statutZakatLabel}
    onRemove={() =>
      setAppliedFilters((prev) => ({
        ...prev,
        statut_zakat: "",
        statutZakatLabel: "",
      }))
    }
  />
)}

   {appliedFilters.village && (
  <FilterTag
    text={appliedFilters.villageLabel || appliedFilters.village}
    onRemove={() =>
      setAppliedFilters((prev) => ({
        ...prev,
        village: "",
        villageLabel: "",
      }))
    }
  />
)}

 
  </div>
);
 


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
              placeholder="Rechercher par informations de la famille"
        />
      </div>

{(appliedFilters.village ||
  appliedFilters.statut ||
  appliedFilters.mois_entree ||
  appliedFilters.sexe ||
  appliedFilters.statut_zakat) &&
  filterTagsContent}

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
  onAction={handleExport}
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
 placeholder="Rechercher par informations de la famille"
/>
{(appliedFilters.village ||
  appliedFilters.statut ||
  appliedFilters.mois_entree ||
  appliedFilters.sexe ||
  appliedFilters.statut_zakat) &&
  filterTagsContent}


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


{isLoading && (
  <div className="flex justify-center items-center py-10 md:py-20">
    <Spinner />
  </div>
)}

{isError && (
  <div className="flex justify-center py-10 md:py-20">
    <p className="text-red-500">
      {error?.response?.data?.detail ||
        "Impossible de charger la liste des familles."}
    </p>
  </div>
)}

       {!isLoading &&
          !isError &&
          familles.length === 0 && (
  <div className="flex-1 flex flex-col items-center justify-center py-10 md:py-20 px-4">
    <img
      src={NoResultImage}
      alt="Aucun résultat"
      className="w-56 sm:w-72 md:w-96 h-auto"
    />

    
  </div>
)}

          {!isLoading && !isError && familles.length > 0 && (
          <div className="flex gap-6">
           <div className="flex-1 space-y-4">
  <div className="w-full flex-1 space-y-3">
    { familles.map((famille) => (
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
   mere={`${famille.mere?.nom ?? ""} ${famille.mere?.prenom ?? ""}`}
  enfant={famille.nourrisson?.prenom}
  
  sexe={
  famille?.nourrisson?.sexe === "M"
    ? "Fils"
    : famille?.nourrisson?.sexe === "F"
    ? "Fille"
    : "-"
}
  region={famille.mere?.village?.nom ?? "-"}
   naissance={famille.nourrisson?.date_naissance ?? "-"}
  code={famille.id}
  badges={[
    // =========================
    // STATUT NUTRITIONNEL BÉBÉ
    // =========================

     famille?.statut_nutritionnel_bebe === "mam" && {
    type: "mam",
    text: "MAM nourrisson",
  },

  famille?.statut_nutritionnel_bebe === "mas" && {
    type: "mas",
    text: "MAS nourrisson",
  },

  famille?.statut_nutritionnel_bebe === "normale" && {
    type: "mere",
    text: "Bébé normal",
  },
    // =========================
    // STATUT NUTRITIONNEL MÈRE
    // =========================

   famille?.statut_nutritionnel_mere === "normale" && {
    type: "mere",
    text: "Mère normale",
  },

  famille?.statut_nutritionnel_mere === "a_risque" && {
    type: "risque",
    text: "Mère à risque",
  },

  famille?.statut_nutritionnel_mere === "malnutrition" && {
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
  mere={`${famille.mere?.nom ?? ""} ${famille.mere?.prenom ?? ""}`}
   enfant={famille.nourrisson?.prenom}
 sexe={
  famille?.nourrisson?.sexe === "M"
    ? "Fils"
    : famille?.nourrisson?.sexe === "F"
    ? "Fille"
    : "-"
}
  region={famille.mere?.village?.nom ?? "-"}
  naissance={famille.nourrisson?.date_naissance ?? "-"}
  code={famille.id}
  badges={[
    // =========================
    // STATUT NUTRITIONNEL BÉBÉ
    // =========================
  famille?.statut_nutritionnel_bebe === "mam" && {
    type: "mam",
    text: "MAM nourrisson",
  },

  famille?.statut_nutritionnel_bebe === "mas" && {
    type: "mas",
    text: "MAS nourrisson",
  },

  famille?.statut_nutritionnel_bebe === "normale" && {
    type: "mere",
    text: "Bébé normal",
  },
    // =========================
    // STATUT NUTRITIONNEL MÈRE
    // =========================

     famille?.statut_nutritionnel_mere === "normale" && {
    type: "mere",
    text: "Mère normale",
  },

  famille?.statut_nutritionnel_mere === "a_risque" && {
    type: "risque",
    text: "Mère à risque",
  },

  famille?.statut_nutritionnel_mere === "malnutrition" && {
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
          </div>
    ))}

    <div ref={observerTarget} className="h-1" />

    {isFetchingNextPage && (
      <div className="flex justify-center py-4">
        <Spinner />
      </div>
    )}
  </div>
</div>

{isFilterOpen && !isMobile && (
  <div className="w-[320px] shrink-0">
    {filtersContent}
  </div>
)}
          </div>
)}
        </main>
      </div>
    
  );
}

