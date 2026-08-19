import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import StatusFilter from "../../components/Filter/StatusFilter";
import Sidebar from "../../components/Sidebar/Sidebar";
import NavigationHeader from "../../components/Navigation,Pageheader/NavigationHeader";
import SearchBar from "../../components/Filter/Searchbar";
import CardDonateur from "../../components/Cards/carteDonateur";
import NoResultImage from "../../assets/no result picture.svg";
import Spinner from "../../components/Spinner";
import { listDonateurs } from "@/lib/api/donateurs";

export default function ListeDonateur() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: donateurs = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["donateurs", search, statusFilter],
    queryFn: async () => {
      // On ne construit que les params réellement nécessaires,
      // pour éviter d'envoyer des valeurs vides ou mal typées au backend.
      const params = {};

      const trimmedSearch = search.trim();
      if (trimmedSearch) {
        params.search = trimmedSearch;
      }

      // Actif / Inactif : on n'ajoute is_active QUE si un filtre est choisi.
      // ⚠️ Si le backend attend un booléen réel (et non la string "true"/"false"),
      // c'est une cause fréquente d'erreur 500. Vérifie côté API comment
      // ce paramètre est parsé (ex: Django DRF avec BooleanField/BooleanFilter,
      // FastAPI avec `is_active: bool = None`, etc.).
      if (statusFilter === "active") {
        params.is_active = true;
      } else if (statusFilter === "inactive") {
        params.is_active = false;
      }

      const response = await listDonateurs(params);

      // Défense supplémentaire : garantir un tableau même si l'API
      // renvoie un format inattendu (objet paginé, null, etc.)
      const data = response?.data;
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.results)) return data.results;
      return [];
    },
    keepPreviousData: true,
    retry: 1,
  });

  const formatDate = (date) => {
    if (!date) return "";

    const parts = date.split("-");
    if (parts.length !== 3) return date;

    const [annee, mois, jour] = parts;
    return `${jour}/${mois}/${annee}`;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenu */}
      <main className="flex-1 overflow-y-auto px-5 pt-18 md:pt-0 pb-8 lg:p-10 bg-white">
        <NavigationHeader
          title="Liste des donateurs"
          type="share"
          actionTitle="Exporter la liste des donateurs"
          onAction={() => console.log("Exporter")}
          secondType="add"
          secondActionTitle="Ajouter un donateur"
          onSecondAction={() => navigate("/ajout-donateur")}
          thirdType="export"
          thirdActionTitle="Importer un fichier"
          onThirdAction={() => console.log("Importer")}
        />

        {/* Recherche */}
        <div className="my-6">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            showFilter={false}
            maxWidth="max-w-full"
            placeholder="Entrer ici pour chercher"
          />
        </div>

        <div className="my-6">
          <StatusFilter value={statusFilter} onChange={setStatusFilter} />
        </div>

        {/* Chargement */}
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Spinner />
          </div>
        )}

        {/* Erreur */}
        {isError && (
          <div className="flex justify-center py-10">
            <p className="text-red-500">
              {error?.response?.data?.detail ||
                "Erreur lors du chargement des donateurs."}
            </p>
          </div>
        )}

        {/* Aucun résultat */}
        {!isLoading && !isError && donateurs.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-10 md:py-20 px-4">
            <img
              src={NoResultImage}
              alt="Aucun résultat"
              className="w-56 sm:w-72 md:w-96 h-auto"
            />
          </div>
        )}

        {/* Liste */}
        {!isLoading && !isError && donateurs.length > 0 && (
          <div className="space-y-3">
            {donateurs.map((donateur) => (
              <div
                key={donateur.id}
                className="cursor-pointer"
                onClick={() => navigate(`/fiche-donateur/${donateur.id}`)}
              >
                <CardDonateur
                  name={`${donateur.nom ?? ""} ${donateur.prenom ?? ""}`.trim()}
                  email={donateur.email}
                  date={formatDate(donateur.date_adhesion)}
                  status={donateur.is_active ? "Actif" : "Inactif"}
                  creePar={donateur.cree_par}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
