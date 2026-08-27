import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import StatusFilter from "../../components/Filter/StatusFilter";
import Sidebar from "../../components/Sidebar/Sidebar";
import NavigationHeader from "../../components/Navigation,Pageheader/NavigationHeader";
import SearchBar from "../../components/Filter/Searchbar";
import CardDonateur from "../../components/Cards/carteDonateur";
import PopupImportDonateurs from "../../components/Popups/Popupimportdonateurs";
import PopupImportResult from "../../components/Popups/PopupImportResult";
import NoResultImage from "../../assets/no result picture.svg";
import Spinner from "../../components/Spinner";

import { listDonateurs, importDonateurs, exportDonateurs } from "@/lib/api/donateurs";

export default function ListeDonateur() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showImportPopup, setShowImportPopup] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [showResultPopup, setShowResultPopup] = useState(false);

  const {
    data: donateurs = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["donateurs", search, statusFilter],
    queryFn: async () => {
      const params = {};

      const trimmedSearch = search.trim();
      if (trimmedSearch) {
        params.search = trimmedSearch;
      }

      if (statusFilter === "active") {
        params.is_active = true;
      } else if (statusFilter === "inactive") {
        params.is_active = false;
      }

      const response = await listDonateurs(params);

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

  const handleImportDonateurs = async (file) => {
    setIsImporting(true);
    try {
      const response = await importDonateurs(file);

      await queryClient.invalidateQueries({ queryKey: ["donateurs"] });

      setImportResult(response.data);
      setShowImportPopup(false);
      setShowResultPopup(true);
    } catch (err) {
      console.error("Erreur lors de l'import des donateurs :", err.response?.data || err);
      
      throw err;
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await exportDonateurs();

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "Liste-donateurs.xlsx";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Erreur lors de l'export de la liste des donateurs :",
        error
      );
    }
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
          onAction={handleExport}
          secondType="add"
          secondActionTitle="Ajouter un donateur"
          onSecondAction={() => navigate("/ajout-donateur")}
          thirdType="export"
          thirdActionTitle="Importer un fichier"
          onThirdAction={() => setShowImportPopup(true)}
        />

        {/* Recherche */}
        <div className="my-6">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            showFilter={false}
            maxWidth="max-w-full"
            placeholder="Rechercher par informations du donateur"
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

      {/* Popup d'import de donateurs */}
      <PopupImportDonateurs
        open={showImportPopup}
        onClose={() => setShowImportPopup(false)}
        onImport={handleImportDonateurs}
        isLoading={isImporting}
      />

      {/* Popup des résultats de l'import */}
      <PopupImportResult
        open={showResultPopup}
        onClose={() => setShowResultPopup(false)}
        result={importResult}
      />
    </div>
  );
}
