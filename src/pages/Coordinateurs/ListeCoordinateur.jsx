import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import StatusFilter from "../../components/Filter/StatusFilter";
import Sidebar from "../../components/Sidebar/Sidebar";
import NavigationHeader from "../../components/Navigation,Pageheader/NavigationHeader";
import SearchBar from "../../components/Filter/Searchbar";
import CardCoordinateur from "../../components/Cards/carteCoordinateur";
import NoResultImage from "../../assets/no result picture.svg";
import Spinner from "../../components/Spinner";

import { listCoordinateurs } from "../../lib/api/coordinateurs";

export default function ListeCoordinateurs() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: coordinateurs = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    
    queryKey: ["coordinateurs", search, statusFilter],

    queryFn: async () => {
      const params = {};

    
      const trimmedSearch = search.trim();

      if (trimmedSearch) {
        params.search = trimmedSearch;
      }

    

      // Actif
      if (statusFilter === "active") {
        params.is_active = true;
      }

      // Inactif
      if (statusFilter === "inactive") {
        params.is_active = false;
      }

     

      const response = await listCoordinateurs(params);

      const data = response?.data;

     
      if (Array.isArray(data)) {
        return data;
      }

     
      if (Array.isArray(data?.results)) {
        return data.results;
      }

      return [];
    },

    keepPreviousData: true,
    retry: 1,
  });

  return (
    <div className="flex h-screen overflow-hidden bg-white">

      {/* Sidebar */}
      <Sidebar />

      {/* Contenu */}
      <main className="flex-1 overflow-y-auto px-5 pt-18 md:pt-0 pb-8 lg:p-10 bg-white">

        <NavigationHeader
          title="Liste des coordinateurs"

          type="share"
          actionTitle="Exporter la liste des coordinateurs"
          onAction={() => {
            // Fonction d'export
          }}

          secondType="add"
          secondActionTitle="Ajouter un coordinateur"
          onSecondAction={() =>
            navigate("/ajout-coordinateur")
          }
        />

       
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
          <StatusFilter
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>

     
        {isLoading && (
          <div className="flex justify-center items-center py-10 md:py-20">
            <Spinner />
          </div>
        )}

      
        {isError && (
          <div className="flex justify-center py-10 md:py-20">
            <p className="text-red-500">
              {error?.response?.data?.detail ||
                "Impossible de charger la liste des coordinateurs."}
            </p>
          </div>
        )}

        {!isLoading &&
          !isError &&
          coordinateurs.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center py-10 md:py-20 px-4">
              <img
                src={NoResultImage}
                alt="Aucun résultat"
                className="w-56 sm:w-72 md:w-96 h-auto"
              />
            </div>
          )}

      
        {!isLoading &&
          !isError &&
          coordinateurs.length > 0 && (
            <div className="space-y-3">

              {coordinateurs.map((coordinateur) => (
                <div
                  key={coordinateur.id}
                  onClick={() =>
                    navigate(
                      `/fiche-coordinateur/${coordinateur.id}`
                    )
                  }
                  className="cursor-pointer"
                >
                  <CardCoordinateur
                    name={`${coordinateur.nom ?? ""} ${
                      coordinateur.prenom ?? ""
                    }`.trim()}

                    village={
                      coordinateur.village?.nom || ""
                    }

                    familles={
                      coordinateur.nb_familles ?? 0
                    }

                    status={
                      coordinateur.is_active
                        ? "Actif"
                        : "Inactif"
                    }

                    username={
                      coordinateur.username || "/"
                    }

                    creePar={
                      coordinateur.cree_par
                        ? `${coordinateur.cree_par.nom ?? ""} ${
                            coordinateur.cree_par.prenom ?? ""
                          }`.trim()
                        : "/"
                    }
                  />
                </div>
              ))}

            </div>
          )}

      </main>
    </div>
  );
}
