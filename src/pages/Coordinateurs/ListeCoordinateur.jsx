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
import { useAuth } from "../../components/Providers/AuthProvider";
import { listUsers } from "../../lib/api/users";

export default function ListeCoordinateur() {
  const navigate = useNavigate();
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";
  const [role, setRole] = useState("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery({
   
    queryKey: ["users", search, statusFilter, role],

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

      if (role !== "all") {
        params.role = role;
      }

      const response = await listUsers(params);
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
      <Sidebar />

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
          onSecondAction={() => navigate("/ajout-coordinateur")}
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
  showRoleFilter={isAdmin}
  roleValue={role}
  onRoleChange={setRole}
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

        {!isLoading && !isError && users.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-10 md:py-20 px-4">
            <img
              src={NoResultImage}
              alt="Aucun résultat"
              className="w-56 sm:w-72 md:w-96 h-auto"
            />
          </div>
        )}

        {!isLoading && !isError && users.length > 0 && (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => navigate(`/fiche-coordinateur/${user.id}`)}
                className="cursor-pointer"
              >
                <CardCoordinateur
                  name={`${user.nom ?? ""} ${user.prenom ?? ""}`.trim()}
                  village={user.village?.nom || ""}
                  familles={user.nb_familles ?? 0}
                  status={user.is_active ? "Actif" : "Inactif"}
                  username={user.username || "/"}
                  creePar={
  user.created_by
    ? `${user.created_by.nom} ${user.created_by.prenom}`
    : "/"
}
                  isChef={user.role === "chef_coordinator"}
                />
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
