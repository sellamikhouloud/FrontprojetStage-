import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { listDistributions } from "@/lib/api/distributions";
import { useAuth } from "../../components/providers/AuthProvider";

export default function DistributionPage() {
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showStockPopup, setShowStockPopup] = useState(false);
  const navigate = useNavigate();
  const [showValidation, setShowValidation] = useState(false);
  const [produitSelectionne, setProduitSelectionne] = useState(null);
  const [showHistorique, setShowHistorique] = useState(false);
  const [produitHistorique, setProduitHistorique] = useState(null);
const { user } = useAuth();
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
    : distributionsResponse?.results ||
      (distributionsResponse ? [distributionsResponse] : []);

  // ==================== STOCK (mock, inchangé) ====================
  const [products, setProducts] = useState([
    { nom: "Lait", quantity: 38, unite: "boîtes", threshold: 1, statut: "valide" },
    {
      nom: "Céréales",
      quantity: 38,
      unite: "Kg",
      threshold: 1,
      statut: "en_attente",
      date: "12/06/2026",
      enregistrePar: "nom Coor",
    },
    { nom: "Huile", quantity: 38, unite: "Litres", threshold: 1, statut: "valide" },
    { nom: "Sucre", quantity: 38, unite: "Kg", threshold: 1, statut: "valide" },
    {
      nom: "Sel iodé",
      quantity: 38,
      unite: "Kg",
      threshold: 1,
      statut: "en_attente",
      date: "12/06/2026",
      enregistrePar: "nom Coor",
    },
    { nom: "Légumineuses", quantity: 38, unite: "Kg", threshold: 1, statut: "valide" },
    { nom: "Lait", quantity: 38, unite: "boîtes", threshold: 1, statut: "valide" },
    {
      nom: "Légumineuses",
      quantity: 38,
      unite: "Kg",
      threshold: 1,
      statut: "en_attente",
      date: "12/06/2026",
      enregistrePar: "nom Coor",
    },
    { nom: "Huile", quantity: 38, unite: "Litres", threshold: 1, statut: "valide" },
  ]);

  const historiqueParProduit = {
    Lait: [
      { id: 1, type: "ajout", quantite: 20, unite: "boîtes", par: "Coordinateur Ahmed", date: "10/06/2026" },
      { id: 2, type: "retrait", quantite: 5, unite: "boîtes", par: "Coordinateur sarah", date: "12/06/2026" },
      { id: 3, type: "ajout", quantite: 23, unite: "boîtes", par: "Coordinateur Ahmed", date: "18/06/2026" },
    ],
    Céréales: [
      { id: 1, type: "ajout", quantite: 40, unite: "Kg", par: "Coordinateur Sarah", date: "05/06/2026" },
      { id: 2, type: "retrait", quantite: 2, unite: "Kg", par: "Coordinateur ahmed", date: "08/06/2026" },
    ],
    Huile: [
      { id: 1, type: "ajout", quantite: 38, unite: "Litres", par: "Coordinateur Ahmed", date: "01/06/2026" },
    ],
    Sucre: [
      { id: 1, type: "ajout", quantite: 30, unite: "Kg", par: "Coordinateur Sarah", date: "03/06/2026" },
      { id: 2, type: "retrait", quantite: 8, unite: "Kg", par: "Coordinateur ahmed", date: "09/06/2026" },
      { id: 3, type: "ajout", quantite: 16, unite: "Kg", par: "Coordinateur Sarah", date: "15/06/2026" },
    ],
    "Sel iodé": [
      { id: 1, type: "ajout", quantite: 38, unite: "Kg", par: "Coordinateur Ahmed", date: "12/06/2026" },
    ],
    Légumineuses: [
      { id: 1, type: "ajout", quantite: 25, unite: "Kg", par: "Coordinateur Sarah", date: "02/06/2026" },
      { id: 2, type: "retrait", quantite: 3, unite: "Kg", par: "Coordinateur Sarah", date: "07/06/2026" },
      { id: 3, type: "ajout", quantite: 16, unite: "Kg", par: "Coordinateur Ahmed", date: "14/06/2026" },
    ],
  };

  const role = user?.role;
const isAdmin = role === "admin";

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

 

  const [selectedDistribution, setSelectedDistribution] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
                  numeroDistribution: distribution.numeroDistribution,

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
                i === id ? { ...p, statut: "valide", quantity: quantite || p.quantity } : p
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

