import { useState, useEffect, useRef } from "react";
import { listAidesZakat ,createVersementSolde,exportAidesZakat , annulerAideZakat, getZakatDashboard , listVersementsSolde , getVersementSolde , updateVersementSolde} from "@/lib/api/zakat";
import { useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
import Sidebar from "../../components/Sidebar/Sidebar";
import NavigationHeader from "../../components/Navigation,Pageheader/NavigationHeader";
import SearchBar from "../../components/Filter/Searchbar";
import Button from "../../components/Button/Button";
import FilterTag from "../../components/Filter/FilterTag";
import CardListZakat from "../../components/Cards/CarteListeZakat";
import SelectInput2 from "../../components/Containers/ChoiceContainer2";
import DateSelect from "../../components/Containers/DateSelect.jsx";
import PopupDetailZakat from "../../components/Popups/PopupdetailsZakat";
import PopupModifierZakat from "../../components/Popups/PopupdetailsZakatModifier";
import PopupAlimenterSolde from "../../components/Popups/PopupAlimenterSolde";
import SoldeCard from "../../components/Cards/SoldeCard";
import RepartitionAides from "../../components/Cards/RepartitionAides";
import NoResultImage from "../../assets/no result picture.svg";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import PopupHistoriqueVersements from "../../components/Popups/PopupHistoriqueVersements";
import PopupDetailVersement from "../../components/Popups/PopupDetailVersement";
import PopupModifierVersement from "../../components/Popups/PopupModifierVersement";
import { useAuth } from "../../components/Providers/AuthProvider";

export default function ZakatPage() {

  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showStockPopup, setShowStockPopup] = useState(false);
  const [showHistoriqueVersements, setShowHistoriqueVersements] = useState(false);
  const [showDetailVersementPopup, setShowDetailVersementPopup] = useState(false);
  const [selectedVersementId, setSelectedVersementId] = useState(null);
  const [openModifierVersement, setOpenModifierVersement] = useState(false);

  const navigate = useNavigate();
  

const queryClient = useQueryClient();
 
  const causePrincipaleOptions = [
    { value: "veuvage", label: "Veuvage" },
    { value: "urgence", label: "Situation d'urgence" },
    { value: "vulnerabilite", label: "Vulnérabilité extrême" },
    { value: "autre", label: "Autre" },
  ];

  
  const [filters, setFilters] = useState({
    causePrincipale: "",
    dateVersement: null,
  });

  const [appliedFilters, setAppliedFilters] = useState({
    causePrincipale: "",
    dateVersement: null,
  });

  // Le backend attend  JJ/MM/AAAA (pas de format ISO, pas d'objet Date brut)
  function formatDateJJMMAAAA(date) {
    if (!date) return undefined;
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  }

  function formatNombre(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return "-";
  return Number(n).toLocaleString("fr-FR");
}

 const {
  data,
  isLoading,
  isError,
  refetch,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ["zakats", search, appliedFilters],

  queryFn: async ({ pageParam = 1 }) => {
    const params = { page: pageParam };

    const trimmedSearch = search.trim();

    if (trimmedSearch) {
      params.search = trimmedSearch;
    }

    if (appliedFilters.causePrincipale) {
      params.cause_principale = appliedFilters.causePrincipale;
    }

    if (appliedFilters.dateVersement) {
      params.date_versement = formatDateJJMMAAAA(
        appliedFilters.dateVersement
      );
    }

    const response = await listAidesZakat(params);
    return response.data;
  },

   getNextPageParam: (lastPage, allPages) =>
    lastPage?.next ? (allPages?.length ?? 0) + 1 : undefined,

  initialPageParam: 1,
  keepPreviousData: true,
  retry: 1,
});

  const zakats = (data?.pages ?? []).flatMap((page) =>
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



  const {
  data: dashboardData,
  isLoading: dashboardLoading,
  isError: dashboardError,
  refetch: refetchDashboard,
} = useQuery({
  queryKey: ["zakat-dashboard"],
  queryFn: () => getZakatDashboard().then((r) => r.data),
  enabled: isAdmin,
});


 const {
  data: versementsData,
  isLoading: versementsLoading,
  isError: versementsError,
  refetch: refetchVersements,
  fetchNextPage: fetchNextVersementsPage,
  hasNextPage: hasNextVersementsPage,
  isFetchingNextPage: isFetchingNextVersementsPage,
} = useInfiniteQuery({
  queryKey: ["versements-solde", "infinite"],

  queryFn: ({ pageParam = 1 }) =>
    listVersementsSolde({ page: pageParam }).then((r) => r.data),

  getNextPageParam: (lastPage, allPages) =>
    lastPage?.next ? (allPages?.length ?? 0) + 1 : undefined,

  initialPageParam: 1,
  enabled: isAdmin && showHistoriqueVersements,
});

const versementsObserverTarget = useRef(null);

useEffect(() => {
  if (!versementsObserverTarget.current) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (
        entries[0].isIntersecting &&
        hasNextVersementsPage &&
        !isFetchingNextVersementsPage
      ) {
        fetchNextVersementsPage();
      }
    },
    { threshold: 1 }
  );

  observer.observe(versementsObserverTarget.current);

  return () => observer.disconnect();
}, [hasNextVersementsPage, isFetchingNextVersementsPage, fetchNextVersementsPage]);

const {
  data: versementDetail,
  isLoading: versementDetailLoading,
  isError: versementDetailError,
} = useQuery({
  queryKey: ["versement-solde", selectedVersementId],
  queryFn: () => getVersementSolde(selectedVersementId).then((r) => r.data),
  enabled: isAdmin && showDetailVersementPopup && !!selectedVersementId,
});

const versementsBruts = (versementsData?.pages ?? []).flatMap((page) =>
  Array.isArray(page) ? page : page?.results ?? []
);

const versements = versementsBruts.map((v) => ({
  id: v.id,
  date: v.date_versement ? new Date(v.date_versement).toLocaleDateString("fr-FR") : "-",
  commentaire: v.note ?? "",
  montantMRU: v.montant,
  montantEUR: v.montant_eur,
}));

  const causePrincipaleLabel = (value) =>
    causePrincipaleOptions.find((o) => o.value === value)?.label ?? value;

  const filterTagsContent = (
    <div className="flex flex-wrap gap-2 my-4">
      {appliedFilters.causePrincipale && (
        <FilterTag
          text={`Cause : ${causePrincipaleLabel(appliedFilters.causePrincipale)}`}
          onRemove={() => {
            setAppliedFilters((prev) => ({ ...prev, causePrincipale: "" }));
            setFilters((prev) => ({ ...prev, causePrincipale: "" }));
          }}
        />
      )}

      {appliedFilters.dateVersement && (
        <FilterTag
          text={`Date : ${appliedFilters.dateVersement.toLocaleDateString("fr-FR")}`}
          onRemove={() => {
            setAppliedFilters((prev) => ({ ...prev, dateVersement: null }));
            setFilters((prev) => ({ ...prev, dateVersement: null }));
          }}
        />
      )}
    </div>
  );
const handleAlimenterSolde = async (data) => {
  try {
    const response = await createVersementSolde(data);

    console.log("Versement solde créé :", response.data);

   
    await queryClient.invalidateQueries({
      queryKey: ["versements-solde"],
    });

     await queryClient.invalidateQueries({
      queryKey: ["zakat-dashboard"],
    });

    return response.data;

  } catch (error) {
    console.error(
      "Erreur lors de l'alimentation du solde :",
      error.response?.data || error
    );

    // Permet au PopupAlimenterSolde de savoir que l'API a échoué
    throw error;
  }
};
const handleDeleteZakat = async (zakat) => {
  try {
    console.log("Annulation de la Zakat :", zakat.id);

    // Appel API
    const response = await annulerAideZakat(zakat.id);

    console.log("Zakat annulée :", response.data);

    // Fermer le popup détail
    setShowDetailPopup(false);

    // Nettoyer la sélection
    setSelectedZakat(null);

    // Recharger la liste des zakats
    await queryClient.invalidateQueries({
      queryKey: ["zakats"],
    });

    await queryClient.invalidateQueries({
      queryKey: ["zakat-dashboard"],
    });

  } catch (error) {
    console.error(
      "Erreur lors de l'annulation de la Zakat :",
      error.response?.data || error
    );
    throw error;
  }
};


const handleExportZakat = async () => {
  try {
    const params = {};

    const trimmedSearch = search.trim();
    if (trimmedSearch) {
      params.search = trimmedSearch;
    }

    if (appliedFilters.causePrincipale) {
      params.cause_principale = appliedFilters.causePrincipale;
    }

    if (appliedFilters.dateVersement) {
      params.date_versement = formatDateJJMMAAAA(appliedFilters.dateVersement);
    }

    const response = await exportAidesZakat(params);

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Liste_zakat.xlsx";

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(
      "Erreur lors de l'export des zakats :",
      error.response?.data || error
    );
  }
};
  const [selectedZakat, setSelectedZakat] = useState(null);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [openModifier, setOpenModifier] = useState(false);
  const [openAlimenterSolde, setOpenAlimenterSolde] = useState(false);
  const [isSavingSolde, setIsSavingSolde] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filtersContent = (
    <div className="space-y-4">
      <div className="w-full">
        <SelectInput2
          label="Cause principale"
          placeholder="Toutes les causes"
          options={causePrincipaleOptions}
          value={filters.causePrincipale}
          onChange={(option) =>
            setFilters((prev) => ({ ...prev, causePrincipale: option.value }))
          }
          noPadding
        />
      </div>

      <DateSelect
        placeholder="Tapez pour choisir la date de versement"
        value={filters.dateVersement}
        onChange={(date) => setFilters((prev) => ({ ...prev, dateVersement: date }))}
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
            const empty = { causePrincipale: "", dateVersement: null };
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
        <PageHeader leftTitle="Revenir" showRight={false} onBack={() => setIsFilterOpen(false)} />

        <div className="mt-6">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFilterClick={() => {}}
            maxWidth="max-w-full"
          />
        </div>

        {(appliedFilters.causePrincipale || appliedFilters.dateVersement) && filterTagsContent}

        <div className="mt-6">{filtersContent}</div>
      </div>
    );
  }

 

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />

      <main className="relative flex-1 min-h-0 overflow-hidden bg-white">

         {/* Espace blanc FIXE en haut — desktop only */}
   <div
     className="
       hidden
       lg:block
       lg:absolute
       lg:top-0
       lg:left-0
       lg:right-0
       lg:h-4
       bg-white
       z-20
     "
   />
   
        <div className="h-full overflow-y-auto px-5 pt-18 md:pt-0 lg:p-8 pb-[50px]">
      {user?.role === "admin" && (
  <NavigationHeader
    title="Statistiques des zakats"
    type="historique"
    actionTitle="Voir l'historique des versements"
    onAction={() => setShowHistoriqueVersements(true)}
    secondType="add"
    secondActionTitle="Alimenter le solde"
    onSecondAction={() => setOpenAlimenterSolde(true)}
  />
)}


{user?.role === "admin" && (
  <div className="mb-4 grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-4">
    {dashboardLoading ? (
      <div className="col-span-full flex justify-center items-center py-10">
        <Spinner />
      </div>
    ) : dashboardError ? (
      <div className="col-span-full text-center text-red-500 py-6">
        <p>Impossible de charger les statistiques.</p>
        <button onClick={() => refetchDashboard()} className="mt-2 underline">
          Réessayer
        </button>
      </div>
    ) : (
      <>
        <SoldeCard
          soldeDisponible={formatNombre(dashboardData?.solde_disponible?.montant)}
          soldeEnEuros={formatNombre(dashboardData?.solde_disponible?.montant_eur)}
          entreesMois={formatNombre(dashboardData?.entrees_ce_mois?.montant)}
          entreesMoisEnEuros={formatNombre(dashboardData?.entrees_ce_mois?.montant_eur)}
          sortiesMois={formatNombre(dashboardData?.sorties_ce_mois?.montant)}
          sortiesMoisEnEuros={formatNombre(dashboardData?.sorties_ce_mois?.montant_eur)}
          famillesAidees={dashboardData?.familles_aidees ?? "-"}
          versementsRealises={dashboardData?.versements_realises ?? "-"}
          tauxActuel={dashboardData?.taux_actuel ?? "-"}
        />

        <RepartitionAides
          data={(dashboardData?.repartition_aides ?? []).map((r) => ({
            label: causePrincipaleLabel(r.cause),
            percentage: r.pourcentage,
          }))}
        />
      </>
    )}
  </div>
)}


    <NavigationHeader
  title="Liste des Zakat"
  {...(isAdmin && {
    type: "share",
    actionTitle: "Exporter la liste des Zakat",
    onAction: handleExportZakat,
    secondType: "add",
    secondActionTitle: "Ajouter une zakat",
    onSecondAction: () => navigate("/ajout-zakat"),
  })}
/>
          <div className="my-6">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFilterClick={() => setIsFilterOpen((prev) => !prev)}
              maxWidth="max-w-full"
            />
          </div>



          {(appliedFilters.causePrincipale || appliedFilters.dateVersement) && filterTagsContent}

 {/* Chargement */}
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Spinner />
          </div>
        )}

          {isError && (
            <div className="text-center text-red-500 py-6">
              <p>Impossible de charger les zakats.</p>
              <button onClick={() => refetch()} className="mt-2 underline">
                Réessayer
              </button>
            </div>
          )}

        {!isLoading && !isError && zakats.length === 0 && (
  <div className="flex-1 flex flex-col items-center justify-center py-10 md:py-20 px-4">
    <img
      src={NoResultImage}
      alt="Aucun résultat"
      className="w-56 sm:w-72 md:w-96 h-auto"
    />
  </div>
)}
{!isLoading && !isError && zakats.length > 0 && (
  <div className="flex gap-6">
    {/* Liste des Zakat */}
    <div className="flex-1 space-y-3">
      {zakats.map((item, index) => {
        const famille = item.famille_info ?? {};

        const nomMere = famille.mere_nom || "-";
        const codeFamille = item.famille || "-";

        const sexe =
          famille.enfant_sexe === "M"
            ? "Garçon"
            : famille.enfant_sexe === "F"
            ? "Fille"
            : "-";

        const numeroZakat = item.numero_zakat ?? "-";

        const dateVersement = item.date_versement
          ? new Date(item.date_versement).toLocaleDateString("fr-FR")
          : "-";

        const montant = item.montant ?? "0";
        const montantEuro = item.montant_eur ?? "0";

        return (
          <CardListZakat
            key={item.id ?? `zakat-${index}`}
            nom={nomMere}
            code={codeFamille}
            sexe={sexe}
            zakat={`Zakat ${numeroZakat}`}
            date={dateVersement}
            montant="Montant"
            valeur={`${montant} MRU / ${montantEuro} Euros`}
            onClick={() => {
              setSelectedZakat(item);
              setShowDetailPopup(true);
            }}
          />
        );
            })}

      <div ref={observerTarget} className="h-1" />

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      )}
    </div>

    {/* Filtres desktop */}

    {/* Filtres desktop */}
    {isFilterOpen && !isMobile && (
      <div className="w-[320px] shrink-0">
        {filtersContent}
      </div>
    )}
  </div>
)}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[15px] bg-white z-20" />
      </main>

     <PopupDetailZakat
  open={showDetailPopup}
  zakat={selectedZakat}
  famille={selectedZakat?.famille_info}
  onClose={() => setShowDetailPopup(false)}
  onEdit={(zakat) => {
    setShowDetailPopup(false);
    setSelectedZakat(zakat);
    setOpenModifier(true);
  }}
  onDelete={handleDeleteZakat}
/>

      <PopupModifierZakat
        open={openModifier}
        zakat={selectedZakat}
        famille={selectedZakat?.famille_info}
        onClose={() => {
          setOpenModifier(false);
          setShowDetailPopup(true);
        }}
        onSave={(updated) => {
          console.log("Zakat modifié :", updated);
          setSelectedZakat(updated);
          setOpenModifier(false);
          setShowDetailPopup(true);
        }}
      />

     <PopupAlimenterSolde
  open={isAdmin && openAlimenterSolde}
  onClose={() => setOpenAlimenterSolde(false)}
  onSave={handleAlimenterSolde}
/>

     <PopupHistoriqueVersements
  open={isAdmin && showHistoriqueVersements}
  onClose={() => setShowHistoriqueVersements(false)}
  versements={versements}
  loading={versementsLoading}
  error={versementsError}
  onRetry={refetchVersements}
  onVersementClick={(v) => {
    setShowHistoriqueVersements(false);
    setSelectedVersementId(v.id);
    setShowDetailVersementPopup(true);
  }}
  observerTarget={versementsObserverTarget}
  isFetchingNextPage={isFetchingNextVersementsPage}
/>

<PopupDetailVersement
  open={isAdmin && showDetailVersementPopup}
  onClose={() => {
    setShowDetailVersementPopup(false);
    setSelectedVersementId(null);
    setShowHistoriqueVersements(true);
  }}
  versement={versementDetail}
  loading={versementDetailLoading}
  error={versementDetailError}
  onEdit={() => {
    setShowDetailVersementPopup(false);
    setOpenModifierVersement(true); 
  }}
/>
<PopupModifierVersement
  open={isAdmin && openModifierVersement}
  versement={versementDetail}
  onClose={() => {
    setOpenModifierVersement(false);
    setShowDetailVersementPopup(true); // back to detail view
  }}
  onSave={async () => {
    // refresh the detail (id-based query) and the list behind it
    await queryClient.invalidateQueries({
      queryKey: ["versement-solde", selectedVersementId],
    });
    await queryClient.invalidateQueries({
      queryKey: ["versements-solde"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["zakat-dashboard"], // solde may have changed if montant changed
    });

    setOpenModifierVersement(false);
    setShowDetailVersementPopup(true);
  }}
/>

    </div>
  );
}
