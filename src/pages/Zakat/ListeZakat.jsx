import { useState, useEffect } from "react";
import { listAidesZakat ,createVersementSolde,exportAidesZakat , annulerAideZakat, } from "@/lib/api/zakat";
import { useQuery ,useQueryClient } from "@tanstack/react-query";
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
import { useAuth } from "../../components/providers/AuthProvider";

export default function ZakatPage() {

  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showStockPopup, setShowStockPopup] = useState(false);
  const [showHistoriqueVersements, setShowHistoriqueVersements] = useState(false);

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

 const { data, isLoading, isError, refetch } = useQuery({
  queryKey: ["zakats", search, appliedFilters],

  queryFn: async () => {
    const params = {};

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

    const responseData = response?.data;

    if (Array.isArray(responseData)) {
      return responseData;
    }

    if (Array.isArray(responseData?.results)) {
      return responseData.results;
    }

    return [];
  },

  keepPreviousData: true,
  retry: 1,
});

  const zakats = data?.results ?? data ?? [];

  const versements = [
    { id: 1, date: "04/08/2026", commentaire: "Ce mantant était a cause de l'aid", montantMRU: 100, montantEUR: 47 },
    { id: 2, date: "04/08/2026", commentaire: "", montantMRU: 100, montantEUR: 47 },
    { id: 3, date: "04/08/2027", montantMRU: 23000, montantEUR: 4744, commentaire: "Ce mantant était a cause de l'aid" },
    { id: 4, date: "04/04/2027", commentaire: "", montantMRU: 500, montantEUR: 25 },
    { id: 5, date: "04/04/2027", commentaire: "", montantMRU: 500, montantEUR: 25 },
    { id: 6, date: "04/04/2027", commentaire: "", montantMRU: 500, montantEUR: 25 },
    { id: 7, date: "04/04/2027", commentaire: "", montantMRU: 500, montantEUR: 25 },
  ];

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
    const response = await exportAidesZakat();

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "zakat.xlsx";

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
          )}

      <NavigationHeader
  title="Liste des Zakat"
  {...(user?.role === "admin" && {
    type: "share",
    actionTitle: "Exporter la liste des Zakat",
    onAction: handleExportZakat,
  })}
  secondType="add"
  secondActionTitle="Ajouter une zakat"
  onSecondAction={() => navigate("/ajout-zakat")}
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
    </div>

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
      />
    </div>
  );
}
