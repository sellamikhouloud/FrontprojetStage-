import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
import Sidebar from "../../components/Sidebar/Sidebar";
import NavigationHeader from "../../components/Navigation,Pageheader/NavigationHeader";
import SearchBar from "../../components/Filter/Searchbar";
import Button from "../../components/Button/Button";
import FilterTag from "../../components/Filter/FilterTag.jsx";
import DateSelect from "../../components/Containers/DateSelect.jsx";
import PopupDetailDistribution from "../../components/Popups/PopupdetailsDistributions";

import CardListDistribution from "../../components/Cards/CarteListeDistribution";
import StockCard from "../../components/Cards/StockCard";
import StockPopup from "../../components/Popups/StockPopup";
import PopupValidationProduit from "../../components/Popups/PopupValidationProduit";
import PopupHistoriqueProduit from "../../components/Popups/Popuphistoriqueproduit";
import NoResultImage from "../../assets/no result picture.svg";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import { listProduits, validerProduit, getHistoriqueProduit } from "@/lib/api/stock";
import { listDistributions , exportDistributions, annulerDistribution } from "@/lib/api/distributions";
import { useAuth } from "../../components/Providers/AuthProvider";


const MOTIF_LABELS = {
  distribution: "Distribution",
  approvisionnement: "Approvisionnement",
  correction: "Correction",
  annulation_distribution: "Annulation distribution",
};

const mapHistorique = (data = []) =>
  data.map((mvt) => ({
    id: mvt.id,
    type: mvt.type === "entree" ? "ajout" : "retrait",
    quantite: Number(mvt.quantite),
    unite:
      mvt.produit?.unite === "boite" ? "boîtes" : mvt.produit?.unite ?? "",
    par: MOTIF_LABELS[mvt.motif] || mvt.motif,
    user: mvt.user || "-", 
    date: mvt.date_mouvement
      ? new Date(mvt.date_mouvement).toLocaleDateString("fr-FR")
      : "-",
  }));

export default function DistributionPage() {
  const { user } = useAuth();
   const isAdmin = user?.role === "admin";
   const canManageStock = user?.role === "admin" || user?.role === "chef_coordinator";
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showStockPopup, setShowStockPopup] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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

  function formatDateYYYYMMDD(date) {
  if (!date) return undefined;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

  
const handleExport = async () => {
  try {
    const response = await exportDistributions({
      search: search.trim() || undefined,

      date_debut: appliedFilters.dateDebut
        ? formatDateYYYYMMDD(appliedFilters.dateDebut)
        : undefined,

      date_fin: appliedFilters.dateFin
        ? formatDateYYYYMMDD(appliedFilters.dateFin)
        : undefined,
    });

    // Création du fichier à télécharger
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Liste_distributions.xlsx";

    document.body.appendChild(link);
    link.click();

    // Nettoyage
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(
      "Erreur lors de l'export des distributions :",
      error?.response?.data || error
    );
  }
};
  
const {
  data: distributionsResponse,
  isLoading: distributionsLoading,
  isError: distributionsError,
  refetch: refetchDistributions,
} = useQuery({
  queryKey: ["distributions-list", search, appliedFilters],

  queryFn: () =>
    listDistributions({
      // Recherche dans search bar 
      search: search.trim() || undefined,

      // Filtre date début
      date_debut: appliedFilters.dateDebut
        ? formatDateYYYYMMDD(appliedFilters.dateDebut)
        : undefined,

      // Filtre date fin
      date_fin: appliedFilters.dateFin
        ? formatDateYYYYMMDD(appliedFilters.dateFin)
        : undefined,
    }).then((r) => r.data),

  keepPreviousData: true,
});
const distributionsData = Array.isArray(distributionsResponse)
  ? distributionsResponse
  : Array.isArray(distributionsResponse?.results)
  ? distributionsResponse.results
  : [];

 const {
  data: produitsResponse,
  isLoading: produitsLoading,
  isError: produitsError,
  refetch: refetchProduits,
} = useQuery({
  queryKey: ["produits-list"],
  queryFn: () => listProduits().then((r) => r.data),
});

const produitsData = produitsResponse?.results || [];

const [products, setProducts] = useState([]);



useEffect(() => {
  if (produitsData.length) {
    setProducts(
      produitsData.map((p) => ({
        id: p.id,
        nom: p.nom,
        quantity: Number(p.stock_courant),
        unite: p.unite === "boite" ? "boîtes" : p.unite === "kg" ? "Kg" : p.unite,
        threshold: Number(p.alerte_seuil),
        statut: p.validee ? "valide" : "en_attente",
        date: p.audit?.date_creation
          ? new Date(p.audit.date_creation).toLocaleDateString("fr-FR")
          : null,
        enregistrePar: p.audit?.cree_par
          ? `${p.audit.cree_par.nom ?? ""} ${p.audit.cree_par.prenom ?? ""}`.trim()
          : null,
      }))
    );
  }
}, [produitsResponse]);
 

const {
  data: historiqueResponse,
  isLoading: historiqueLoading,
  isError: historiqueError,
} = useQuery({
  queryKey: ["produit-historique", produitHistorique?.id],
  queryFn: () =>
    getHistoriqueProduit(produitHistorique.id).then((r) => r.data),
  enabled: showHistorique && !!produitHistorique?.id, // ne fetch que si le popup est ouvert
});

 const historiqueData = Array.isArray(historiqueResponse)
  ? historiqueResponse
  : Array.isArray(historiqueResponse?.results)
  ? historiqueResponse.results
  : Array.isArray(historiqueResponse?.data)
  ? historiqueResponse.data
  : [];

const historiqueMouvements = mapHistorique(historiqueData); 
 

  const handleCardClick = (item, index) => {
    if (!canManageStock) return; 
  if (item.statut === "en_attente") {
    
      setProduitSelectionne({
        id: item.id,
        nom: item.nom,
        quantite: item.quantity,
        unite: item.unite,
        
          date: item.date,            
          enregistrePar: item.enregistrePar,  
      });
      setShowValidation(true);
    
  } else {
    setProduitHistorique({
      id: item.id,      
      nom: item.nom,
      unite: item.unite,
    });
    setShowHistorique(true);
  }
};
 

  const [selectedDistribution, setSelectedDistribution] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);


    const handleAnnulerDistribution = async (distribution) => {
    try {
      await annulerDistribution(distribution.id);

      await queryClient.invalidateQueries({
        queryKey: ["distributions-list"],
      });

      setIsPopupOpen(false);
      setSelectedDistribution(null);
    } catch (error) {
      console.error(
        "Erreur lors de l'annulation de la distribution :",
        error?.response?.data || error
      );
    }
  };


  const filterTagsContent = (
    <div className="flex flex-wrap gap-2 my-4">
      {appliedFilters.dateDebut && (
        <FilterTag
          text={`Début : ${appliedFilters.dateDebut.toLocaleDateString("fr-FR")}`}
          onRemove={() =>
            setAppliedFilters((prev) => ({ ...prev, dateDebut: null }))
          }
        />
      )}

      {appliedFilters.dateFin && (
        <FilterTag
          text={`Fin : ${appliedFilters.dateFin.toLocaleDateString("fr-FR")}`}
          onRemove={() =>
            setAppliedFilters((prev) => ({ ...prev, dateFin: null }))
          }
        />
      )}
    </div>
  );

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filtersContent = (
    <div className="space-y-4">
      <DateSelect
        placeholder="Tapez pour choisir la date debut d'une periode"
        value={filters.dateDebut}
        onChange={(date) => setFilters({ ...filters, dateDebut: date })}
      />

      <DateSelect
        placeholder="Tapez pour choisir la date de fin d'une periode "
        value={filters.dateFin}
        onChange={(date) => setFilters({ ...filters, dateFin: date })}
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
            const empty = { dateDebut: null, dateFin: null };
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

        {(appliedFilters.dateDebut || appliedFilters.dateFin) && filterTagsContent}

        <div className="mt-6">{filtersContent}</div>
      </div>
    );
  }

  // ==================== MAPPING POUR L'ÉDITION (données réelles) ====================
  
  const mapDistributionToEditData = (distribution) => {
    const produitsSource = distribution.produits || [];

    const products = produitsSource
      .filter(
        (p) =>
          p.produit?.type_produit !== "lait" &&
          !p.produit?.nom?.toLowerCase().includes("lait")
      )
      .map((p, index) => ({
        id: p.produit?.id ?? index + 1,
        title: p.produit?.nom ?? "-",
        quantity: Number(p.quantite ?? 0),
        unit: p.produit?.unite ?? "",
        maxQuantity: Number(p.quantite ?? 0),
        icon: null,
      }));

    const produitLait = produitsSource.find(
      (p) =>
        p.produit?.type_produit === "lait" ||
        p.produit?.nom?.toLowerCase().includes("lait")
    );

    const boxes = produitLait ? Number(produitLait.quantite ?? 0) : 0;

    const grammage = produitLait?.produit?.grammage_boite
      ? String(produitLait.produit.grammage_boite)
      : "";

    const laitType = produitLait?.produit?.nom
      ? produitLait.produit.nom.replace(/\s*\d+\s*g\b/i, "").trim()
      : null;

    return { products, laitType, grammage, boxes };
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar  />

      <main className="flex-1 overflow-y-auto px-5 pt-18 md:pt-0 pb-8 lg:p-10 bg-white">
        <NavigationHeader
          title="Stock de produit"
          type="add"
          actionTitle="ajuster le stock "
          onAction={() => setShowStockPopup(true)}
        />

        {/* Stock cards */}
       <div className="mt-6 mb-5 w-full overflow-x-auto scrollbar-hide">
  {produitsLoading && <Spinner />}
  {produitsError && <p className="text-red-500">Impossible de charger le stock.</p>}
  <div className="flex gap-[4px] md:gap-[10px] w-max">
    {products.map((item, index) => (
      <StockCard
        key={item.id ?? index}
        nom={item.nom}
        quantity={item.quantity}
        unite={item.unite}
        statut={item.statut}
        showStatusColor={canManageStock}  
       
        onClick={canManageStock ? () => handleCardClick(item, index) : undefined}
      />
    ))}
  </div>
</div>

         {user?.role === "admin" ? (
  <NavigationHeader
    title="Liste des distributions"
    type="share"
    actionTitle="Exporter la liste des distributions"
    onAction={handleExport}
    secondType="add"
    secondActionTitle="Ajouter une distribution"
    onSecondAction={() => navigate("/ajout-distribution")}
  />
) : (
  <NavigationHeader
    title="Liste des distributions"
    secondType="add"
    secondActionTitle="Ajouter une distribution"
    onSecondAction={() => navigate("/ajout-distribution")}
  />
)}


        <div className="my-6">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFilterClick={() => setIsFilterOpen(!isFilterOpen)}
            maxWidth="max-w-full"
          />
        </div>

        {(appliedFilters.dateDebut || appliedFilters.dateFin) && filterTagsContent}

        {distributionsLoading && (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        )}

        {distributionsError && !distributionsLoading && (
          <div className="text-center text-red-500 py-6">
            <p>Impossible de charger les distributions.</p>
            <button onClick={() => refetchDistributions()} className="mt-2 underline">
              Réessayer
            </button>
          </div>
        )}

      {!distributionsLoading &&
  !distributionsError &&
  distributionsData.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-10 md:py-20 px-4">
            <img
              src={NoResultImage}
              alt="Aucun résultat"
              className="w-56 sm:w-72 md:w-96 h-auto"
            />
          </div>
        )}

        {!distributionsLoading && !distributionsError && (
          <div className="flex gap-6">
            {/* Liste */}
            <div className="flex-1 space-y-3">
             {distributionsData.map((item, index) =>  {
                const merePrenom = item.famille?.mere?.prenom ?? "";
const mereNom = item.famille?.mere?.nom ?? "";
const nomAffiche = `${mereNom} ${merePrenom}`.trim() || "-";

                const sexe =
                  item.famille?.nourrisson?.sexe === "M"
                    ? "Fils"
                    : item.famille?.nourrisson?.sexe === "F"
                    ? "Fille"
                    : "-";

                const produitsAffiches = (item.produits || []).map((p) => ({
                  nom: p.produit?.nom ?? "-",
                  quantite: `${Number(p.quantite ?? 0)} ${
                    p.produit?.unite === "boite" ? "boîtes" : p.produit?.unite ?? ""
                  }`.trim(),
                }));

                return (
                  <CardListDistribution
                    key={item.id}
                    sexe={sexe}
                    nom={nomAffiche}
                    code={item.famille?.id ?? "-"}
                    date={
                      item.date_distribution
                        ? new Date(item.date_distribution).toLocaleDateString("fr-FR")
                        : "-"
                    }
                    produits={produitsAffiches}
                    onClick={() => {
                      // On numérote localement pour l'affichage du détail ("Distribution n°X")
                      setSelectedDistribution({
                        ...item,
                        numeroDistribution: index + 1,
                      });
                      setIsPopupOpen(true);
                    }}
                  />
                );
              })}
            </div>

            {/* Filtres */}
            {isFilterOpen && !isMobile && (
              <div className="w-[320px] shrink-0">{filtersContent}</div>
            )}
          </div>
        )}

        <PopupDetailDistribution
          open={isPopupOpen}
          distribution={selectedDistribution}
          famille={selectedDistribution?.famille}
          onClose={() => {
            setIsPopupOpen(false);
            setSelectedDistribution(null);
          }}
          onEdit={(distribution) => {
            setIsPopupOpen(false);

            const { products, laitType, grammage, boxes } =
              mapDistributionToEditData(distribution);

            const famille = distribution.famille;

            navigate("/ajout-distribution", {
              state: {
                distributionAModifier: {
                  ...distribution,
                 

                  selectedFamille: {
                    id: famille?.id,

                    mere: famille?.mere
    ? `${famille.mere.nom || ""} ${famille.mere.prenom || ""}`.trim()
    : "",

                    enfant: famille?.nourrisson
                      ? `${famille.nourrisson.prenom || ""}`.trim()
                      : "",

                 
                    sexe:
                      famille?.nourrisson?.sexe === "M"
                        ? "Fils"
                        : famille?.nourrisson?.sexe === "F"
                        ? "Fille"
                        : "-",

                    region: famille?.mere?.village?.nom,
                    naissance: famille?.nourrisson?.date_naissance,
                    code: famille?.id,
                    badges: [],
                  },

                  products,
                  laitType,
                  grammage,
                  boxes,
                  confirmed: true,
                },
              },
            });
          }}
            onDelete={handleAnnulerDistribution}
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
  onValider={async ({ id, quantite }) => {
    await validerProduit(id, { stock_initial: String(quantite) });
    await refetchProduits();
    // no more setShowValidation(false) / setProduitSelectionne(null) here —
    // the popup stays open on its own to show the success banner,
    // then calls onClose itself once the banner timeout finishes
  }}
 
/>
         <PopupHistoriqueProduit
  open={showHistorique}
  produit={produitHistorique}
  historique={historiqueMouvements}
  isLoading={historiqueLoading}
  isError={historiqueError}
  onClose={() => {
    setShowHistorique(false);
    setProduitHistorique(null);
  }}
/>
      </main>
    </div>
  );
}

