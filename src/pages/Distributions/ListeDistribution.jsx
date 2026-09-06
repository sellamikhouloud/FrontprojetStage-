import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
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
import { useNavigate , useLocation } from "react-router-dom";
import { listProduits, validerProduit, getHistoriqueProduit } from "@/lib/api/stock";
import { listDistributions , exportDistributions, annulerDistribution ,getDistribution } from "@/lib/api/distributions";
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
    const location = useLocation();

     useEffect(() => {
    if (location.state?.openStockPopup) {
      setShowStockPopup(true);
      // on nettoie l'état pour ne pas rouvrir le popup si l'utilisateur navigue en arrière/rafraîchit
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);
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
  fetchNextPage: fetchNextDistributionsPage,
  hasNextPage: hasNextDistributionsPage,
  isFetchingNextPage: isFetchingNextDistributionsPage,
} = useInfiniteQuery({
  queryKey: ["distributions-list", "infinite", search, appliedFilters],

  queryFn: ({ pageParam = 1 }) =>
    listDistributions({
      page: pageParam,

      search: search.trim() || undefined,

      date_debut: appliedFilters.dateDebut
        ? formatDateYYYYMMDD(appliedFilters.dateDebut)
        : undefined,

      date_fin: appliedFilters.dateFin
        ? formatDateYYYYMMDD(appliedFilters.dateFin)
        : undefined,
    }).then((r) => r.data),

  getNextPageParam: (lastPage, allPages) =>
    lastPage?.next ? (allPages?.length ?? 0) + 1 : undefined,

  initialPageParam: 1,
  keepPreviousData: true,
});

const distributionsData = (distributionsResponse?.pages ?? []).flatMap((page) =>
  Array.isArray(page) ? page : page?.results ?? []
);

const distributionsObserverTarget = useRef(null);

useEffect(() => {
  if (!distributionsObserverTarget.current) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (
        entries[0].isIntersecting &&
        hasNextDistributionsPage &&
        !isFetchingNextDistributionsPage
      ) {
        fetchNextDistributionsPage();
      }
    },
    { threshold: 1 }
  );

  observer.observe(distributionsObserverTarget.current);

  return () => observer.disconnect();
}, [hasNextDistributionsPage, isFetchingNextDistributionsPage, fetchNextDistributionsPage]);

useEffect(() => {
    const restoreId = location.state?.restoreDistributionId;

    if (restoreId) {
      getDistribution(restoreId)
        .then((res) => {
          setSelectedDistribution(res.data || res);
          setIsPopupOpen(true);
        })
        .catch((err) => {
          console.error("Erreur lors de la récupération de la distribution :", err);
        });

      // Effacer l'état pour éviter de rouvrir la modale au rechargement de la page
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);


const {
  data: produitsResponse,
  isLoading: produitsLoading,
  isError: produitsError,
  refetch: refetchProduits,
  fetchNextPage: fetchNextProduitsPage,
  hasNextPage: hasNextProduitsPage,
  isFetchingNextPage: isFetchingNextProduitsPage,
} = useInfiniteQuery({
  queryKey: ["produits-list", "infinite"],

  queryFn: ({ pageParam }) => {
    console.log("📡 Demande produits page :", pageParam);

    return listProduits({
      page: pageParam,
    }).then((r) => {
   
      return r.data;
    });
  },

  initialPageParam: 1,

  getNextPageParam: (lastPage) => {
    if (!lastPage?.next) {
      console.log("🏁 Fin de la liste produits");
      return undefined;
    }

    try {
      const url = new URL(
        lastPage.next,
        window.location.origin
      );

      const nextPage = url.searchParams.get("page");

   

      return nextPage ? Number(nextPage) : undefined;
    } catch (error) {
      console.error("Erreur pagination produits :", error);
      return undefined;
    }
  },
});



const produitsData = useMemo(() => {
  return (produitsResponse?.pages ?? []).flatMap((page) =>
    Array.isArray(page) ? page : page?.results ?? []
  );
}, [produitsResponse]);


const produitsScrollRef = useRef(null);

useEffect(() => {
  const container = produitsScrollRef.current;

  if (!container) return;

  const handleScroll = () => {
    const distanceFromRight =
      container.scrollWidth -
      container.scrollLeft -
      container.clientWidth;

    if (
      distanceFromRight <= 150 &&
      hasNextProduitsPage &&
      !isFetchingNextProduitsPage
    ) {
      console.log("➡️ Chargement de la prochaine page produits...");
      fetchNextProduitsPage();
    }
  };

  container.addEventListener("scroll", handleScroll);

  return () => {
    container.removeEventListener("scroll", handleScroll);
  };
}, [
  hasNextProduitsPage,
  isFetchingNextProduitsPage,
  fetchNextProduitsPage,
]);




const [products, setProducts] = useState([]);


useEffect(() => {
const mappedProducts = produitsData.map((p) => {
  const estEnAttente = !p.validee;
  const doitAfficherStockInitial =
    estEnAttente && canManageStock;

  const nomProduit =
    p.type_produit === "lait"
      ? p.nom
          .replace(/\s*\d+\s*g\b/i, "")
          .trim()
          .replace(/Lait 1er age/gi, "Lait 1er âge")
          .replace(/Lait 2eme age/gi, "Lait 2ème âge")
      : p.nom;

  return {
    id: p.id,
    nom: nomProduit,

      type_produit: p.type_produit,
      grammage_boite: p.grammage_boite,

      quantity: Number(
        doitAfficherStockInitial
          ? p.stock_initial
          : p.stock_courant
      ),

      unite:
        p.unite === "boite"
          ? "boîtes"
          : p.unite === "kg"
          ? "Kg"
          : p.unite,

      threshold: Number(p.alerte_seuil),

      statut: p.validee
        ? "valide"
        : "en_attente",

      date: p.audit?.date_creation
        ? new Date(
            p.audit.date_creation
          ).toLocaleDateString("fr-FR")
        : null,

      enregistrePar: p.audit?.cree_par
        ? `${p.audit.cree_par.prenom ?? ""} ${
            p.audit.cree_par.nom ?? ""
          }`.trim()
        : null,

      modifiePar: p.audit?.modifie_par
        ? `${p.audit.modifie_par.prenom ?? ""} ${
            p.audit.modifie_par.nom ?? ""
          }`.trim()
        : null,
    };
  });

  setProducts((previousProducts) => {
    const previous = JSON.stringify(previousProducts);
    const next = JSON.stringify(mappedProducts);

    return previous === next
      ? previousProducts
      : mappedProducts;
  });
}, [produitsData, canManageStock]);
 

const {
  data: historiqueResponse,
  isLoading: historiqueLoading,
  isError: historiqueError,
  fetchNextPage: fetchNextHistoriquePage,
  hasNextPage: hasNextHistoriquePage,
  isFetchingNextPage: isFetchingNextHistoriquePage,
} = useInfiniteQuery({
  queryKey: ["produit-historique", produitHistorique?.id],

  queryFn: ({ pageParam = 1 }) =>
    getHistoriqueProduit(produitHistorique.id, {
      page: pageParam,
    }).then((r) => r.data),

  getNextPageParam: (lastPage) => {
    if (!lastPage?.next) {
      return undefined;
    }

    try {
      const url = new URL(lastPage.next);
      const nextPage = url.searchParams.get("page");

      return nextPage ? Number(nextPage) : undefined;
    } catch (error) {
      console.error("Erreur pagination historique :", error);
      return undefined;
    }
  },

  initialPageParam: 1,

  enabled: showHistorique && !!produitHistorique?.id,
});

const historiqueData = useMemo(() => {
  return (historiqueResponse?.pages ?? []).flatMap((page) =>
    Array.isArray(page) ? page : page?.results ?? []
  );
}, [historiqueResponse]);

const historiqueMouvements = useMemo(
  () => mapHistorique(historiqueData),
  [historiqueData]
);

// Observer pour charger automatiquement la page suivante
const historiqueObserverTarget = useRef(null);

useEffect(() => {
  if (!historiqueObserverTarget.current) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (
        entries[0].isIntersecting &&
        hasNextHistoriquePage &&
        !isFetchingNextHistoriquePage
      ) {
        console.log("➡️ Chargement page suivante historique...");
        fetchNextHistoriquePage();
      }
    },
    {
      threshold: 0.1,
    }
  );

  observer.observe(historiqueObserverTarget.current);

  return () => observer.disconnect();
}, [
  hasNextHistoriquePage,
  isFetchingNextHistoriquePage,
  fetchNextHistoriquePage,
  historiqueMouvements.length,
  showHistorique,
]);




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

    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["distributions-list"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["produits-list"],
      }),
    ]);

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

    {/* DATE DEBUT */}
    {appliedFilters.dateDebut && (
      <FilterTag
        text={`Début : ${appliedFilters.dateDebut.toLocaleDateString("fr-FR")}`}
        onRemove={() => {
      
          setAppliedFilters((prev) => ({
            ...prev,
            dateDebut: null,
          }));

         
          setFilters((prev) => ({
            ...prev,
            dateDebut: null,
          }));
        }}
      />
    )}

    {/* DATE FIN */}
    {appliedFilters.dateFin && (
      <FilterTag
        text={`Fin : ${appliedFilters.dateFin.toLocaleDateString("fr-FR")}`}
        onRemove={() => {
        
          setAppliedFilters((prev) => ({
            ...prev,
            dateFin: null,
          }));

       
          setFilters((prev) => ({
            ...prev,
            dateFin: null,
          }));
        }}
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

    const laitType = produitLait?.produit?.nom ?? null;

    return { products, laitType, grammage, boxes };
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar  />

      <main className="flex-1 overflow-y-auto px-5 pt-18 md:pt-0 pb-8 lg:p-10 bg-white">
        <NavigationHeader
          title="Stock de produit"
          type="add"
          actionTitle={canManageStock ? "ajuster le stock" : "ajouter un produit"}
          onAction={() => setShowStockPopup(true)}
        />

        {/* Stock cards */}
      <div ref={produitsScrollRef} className="mt-6 mb-5 w-full overflow-x-auto scrollbar-hide" >
  {produitsLoading && <Spinner />}
  {produitsError && <p className="text-red-500">Impossible de charger le stock.</p>}
  <div className="flex gap-[4px] md:gap-[10px] w-max">
  {products.map((item, index) => (
<StockCard
  key={item.id ?? index}
  nom={item.nom}
  quantity={item.quantity}
  unite={item.unite}
  grammage={item.grammage_boite}
  statut={item.statut}
  showStatusColor={canManageStock}
  onClick={canManageStock ? () => handleCardClick(item, index) : undefined}
/>
  ))}

  

    {isFetchingNextProduitsPage && (
      <div className="flex items-center justify-center px-4">
        <Spinner />
      </div>
    )}
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
) : user?.role === "chef_coordinator" ? (
  <NavigationHeader
    title="Liste des distributions"
    secondType="add"
    secondActionTitle="Ajouter une distribution"
    onSecondAction={() => navigate("/ajout-distribution")}
  />
) : (
  <NavigationHeader
    title="Liste des distributions"
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
              <div ref={distributionsObserverTarget} className="h-1" />

              {isFetchingNextDistributionsPage && (
                <div className="flex justify-center py-4">
                  <Spinner />
                </div>
              )}
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
          fromFamilyHistory={false}
          onClose={() => {
            setIsPopupOpen(false);
            setSelectedDistribution(null);
          }}
          onEdit={(distribution) => {
  console.log("DISTRIBUTION TO EDIT:", distribution);
  console.log("PRODUITS:", distribution.produits);

  setIsPopupOpen(false);

  const { products, laitType, grammage, boxes } =
    mapDistributionToEditData(distribution);

  console.log("EDIT DATA:", {
    products,
    laitType,
    grammage,
    boxes,
  });

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
    canManageStock={canManageStock}
    currentUserId={user?.id}
    onStockUpdated={refetchProduits}
    fetchNextPage={fetchNextProduitsPage}
    hasNextPage={hasNextProduitsPage}
    isFetchingNextPage={isFetchingNextProduitsPage}
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
  observerTarget={historiqueObserverTarget}
  isFetchingNextPage={isFetchingNextHistoriquePage}
  onClose={() => {
    setShowHistorique(false);
    setProduitHistorique(null);
  }}
/>
      </main>
    </div>
  );
}


