import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import Sidebar from "../../components/Sidebar/Sidebar";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
import NavigationHeader from "../../components/Navigation,Pageheader/NavigationHeader";
import SearchBar from "../../components/Filter/Searchbar";
import FilterTag from "../../components/Filter/FilterTag";
import DateSelect from "../../components/Containers/DateSelect.jsx";
import Button from "../../components/Button/Button";
import CardVisiteListe from "../../components/Cards/Cardvisiteliste";
import NoResultImage from "../../assets/no result picture.svg";
import Spinner from "../../components/Spinner";
import PopupDetailVisite from "../../components/Popups/Popupdetailsvisite";
import PopupDetailVisiteModifier from "../../components/Popups/PopupdetailvisiteModifier";
import { useAuth } from "../../components/Providers/AuthProvider";
import { listVisites, getVisite, annulerVisite } from "../../lib/api/visites";

const getBadgeBebe = (statut) => {
  switch (statut) {
    case "mam":
      return { type: "mam", text: "MAM nourrisson" };
    case "mas":
      return { type: "mas", text: "MAS nourrisson" };
    case "normale":
      return { type: "mere", text: "Bébé normal" };
    default:
      return null;
  }
};

const getBadgeMere = (statut) => {
  switch (statut) {
    case "normale":
      return { type: "mere", text: "Mère normale" };
    case "a_risque":
      return { type: "risque", text: "Mère à risque" };
    case "malnutrition":
      return { type: "mas", text: "Mère malnutrie" };
    default:
      return null;
  }
};

function formatDateYYYYMMDD(date) {
  if (!date) return undefined;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function ListeVisites() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [filters, setFilters] = useState({ dateVisite: null });
  const [appliedFilters, setAppliedFilters] = useState({ dateVisite: null });

  const [selectedVisite, setSelectedVisite] = useState(null);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [openModifier, setOpenModifier] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["visites", "infinite", search, appliedFilters],

    queryFn: async ({ pageParam = 1 }) => {
      const params = { page: pageParam };

      const trimmedSearch = search.trim();
      if (trimmedSearch) {
        params.search = trimmedSearch;
      }

      if (appliedFilters.dateVisite) {
        params.date_visite = formatDateYYYYMMDD(appliedFilters.dateVisite);
      }

      const response = await listVisites(params);
      return response.data;
    },

    getNextPageParam: (lastPage, allPages) =>
      lastPage?.next ? (allPages?.length ?? 0) + 1 : undefined,

    initialPageParam: 1,
    keepPreviousData: true,
    retry: 1,
  });

  // Détection du retour depuis la page Famille
  useEffect(() => {
    const restoreId = location.state?.restoreVisiteId;

    if (restoreId) {
      getVisite(restoreId)
        .then((res) => {
          setSelectedVisite(res.data);
          setShowDetailPopup(true);
        })
        .catch((err) =>
          console.error("Erreur lors du chargement de la visite :", err)
        );

      // On nettoie l'état de navigation pour éviter de réouvrir la popup si l'utilisateur rafraîchit la page
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const visites = (data?.pages ?? []).flatMap((page) =>
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

  const buildFamilleFromVisite = (item) => ({
    id: item.code_famille ?? item.famille ?? "-",
    nourrisson: item.nourrisson ?? null,
    mere: item.mere
      ? {
          nom: item.mere?.nom ?? "",
          prenom: item.mere?.prenom ?? "",
          village: item.mere?.village ?? null,
        }
      : null,
  });

  const handleDeleteVisite = async (visite) => {
    try {
      await annulerVisite(visite.id);

      setShowDetailPopup(false);
      setSelectedVisite(null);

      await queryClient.invalidateQueries({ queryKey: ["visites"] });
    } catch (err) {
      console.error(
        "Erreur lors de la suppression de la visite :",
        err?.response?.data || err
      );
    }
  };

  const filterTagsContent = (
    <div className="flex flex-wrap gap-2 my-4">
      {appliedFilters.dateVisite && (
        <FilterTag
          text={`Date : ${appliedFilters.dateVisite.toLocaleDateString("fr-FR")}`}
          onRemove={() => {
            setAppliedFilters((prev) => ({ ...prev, dateVisite: null }));
            setFilters((prev) => ({ ...prev, dateVisite: null }));
          }}
        />
      )}
    </div>
  );

  const filtersContent = (
    <div className="space-y-4">
      <DateSelect
        placeholder="Tapez pour choisir la date de visite"
        value={filters.dateVisite}
        onChange={(date) =>
          setFilters((prev) => ({ ...prev, dateVisite: date }))
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
            const empty = { dateVisite: null };
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
            placeholder="Rechercher par informations de la famille"
          />
        </div>

        {appliedFilters.dateVisite && filterTagsContent}

        <div className="mt-6">{filtersContent}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-5 pt-18 md:pt-0 pb-8 lg:p-10 bg-white">
        {isAdmin ? (
          <NavigationHeader
            title="Liste des visites"
            secondType="add"
            secondActionTitle="Ajouter une visite"
            onSecondAction={() => navigate("/ajout-visite")}
          />
        ) : (
          <NavigationHeader title="Liste des visites" />
        )}

        <div className="my-6">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFilterClick={() => setIsFilterOpen((prev) => !prev)}
            maxWidth="max-w-full"
            placeholder="Rechercher par informations de la famille"
          />
        </div>

        {appliedFilters.dateVisite && filterTagsContent}

        {isLoading && (
          <div className="flex justify-center items-center py-10 md:py-20">
            <Spinner />
          </div>
        )}

        {isError && (
          <div className="flex justify-center py-10 md:py-20">
            <p className="text-red-500">
              {error?.response?.data?.detail ||
                "Impossible de charger la liste des visites."}
            </p>
          </div>
        )}

        {!isLoading && !isError && visites.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-10 md:py-20 px-4">
            <img
              src={NoResultImage}
              alt="Aucun résultat"
              className="w-56 sm:w-72 md:w-96 h-auto"
            />
          </div>
        )}

        {!isLoading && !isError && visites.length > 0 && (
          <div className="flex gap-6">
            <div className="flex-1 space-y-3">
              {visites.map((item) => {
                const nom =
                  `${item.mere?.nom || ""} ${item.mere?.prenom || ""}`.trim() ||
                  "-";
                const dateVisite = item.date_visite
                  ? new Date(item.date_visite).toLocaleDateString("fr-FR")
                  : "-";

                const badgeBebe = getBadgeBebe(item.statut_nutritionnel);
                const badgeMere = getBadgeMere(item.statut_nutritionnel_mere);

                return (
                  <CardVisiteListe
                    key={item.id}
                    nom={nom}
                    code={item.code_famille || "-"}
                    visite={`Visite ${item.numero_visite ?? "-"}`}
                    date={dateVisite}
                    poids={item.poids_bebe ?? "-"}
                    taille={item.taille_bebe ?? "-"}
                    badgeBebe={badgeBebe}
                    badgeMere={badgeMere}
                    onClick={() => {
                      setSelectedVisite(item);
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

            {isFilterOpen && !isMobile && (
              <div className="w-[320px] shrink-0">{filtersContent}</div>
            )}
          </div>
        )}
      </main>

      {/* Popup détail visite */}
      <PopupDetailVisite
        open={showDetailPopup}
        visite={selectedVisite}
        famille={selectedVisite ? buildFamilleFromVisite(selectedVisite) : null}
        onClose={() => setShowDetailPopup(false)}
        onEdit={(visite) => {
          setShowDetailPopup(false);
          setSelectedVisite(visite);
          setOpenModifier(true);
        }}
        onDelete={handleDeleteVisite}
      />

      {/* Popup modifier visite */}
      <PopupDetailVisiteModifier
        open={openModifier}
        visite={selectedVisite}
        famille={selectedVisite ? buildFamilleFromVisite(selectedVisite) : null}
        onClose={() => {
          setOpenModifier(false);
          setShowDetailPopup(true);
        }}
        onSave={async (updated) => {
          let finalVisite = { ...selectedVisite, ...updated };

          try {
            const response = await getVisite(finalVisite.id);
            finalVisite = response?.data ?? finalVisite;
          } catch (err) {
            console.error(
              "Erreur lors du rechargement de la visite :",
              err.response?.data || err
            );
          }

          setSelectedVisite(finalVisite);
          setOpenModifier(false);
          setShowDetailPopup(true);

          queryClient.invalidateQueries({ queryKey: ["visites"] });
        }}
      />
    </div>
  );
}
