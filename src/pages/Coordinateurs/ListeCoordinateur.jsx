import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";

import StatusFilter from "../../components/Filter/StatusFilter";
import Sidebar from "../../components/Sidebar/Sidebar";
import NavigationHeader from "../../components/Navigation,Pageheader/NavigationHeader";
import SearchBar from "../../components/Filter/Searchbar";
import CardCoordinateur from "../../components/Cards/carteCoordinateur";
import NoResultImage from "../../assets/no result picture.svg";
import Spinner from "../../components/Spinner";
import { useAuth } from "../../components/Providers/AuthProvider";
import { listUsers   } from "../../lib/api/users";
import {  exportUsers } from "../../lib/api/coordinateurs";

export default function ListeCoordinateur() {
  const navigate = useNavigate();
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";

  const [role, setRole] = useState("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

    const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["users", "infinite", search, statusFilter, role],

    queryFn: async ({ pageParam = 1 }) => {
      const params = { page: pageParam };

      const trimmedSearch = search.trim();
      if (trimmedSearch) {
        params.search = trimmedSearch;
      }

      if (statusFilter === "active") {
        params.is_active = true;
      }

      if (statusFilter === "inactive") {
        params.is_active = false;
      }

      if (role !== "all") {
        params.role = role;
      }

      const response = await listUsers(params);
      return response.data;
    },

    getNextPageParam: (lastPage, allPages) =>
      lastPage?.next ? (allPages?.length ?? 0) + 1 : undefined,

    initialPageParam: 1,
    keepPreviousData: true,
    retry: 1,
  });

  const users = (data?.pages ?? []).flatMap((page) =>
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

const handleExport = async () => {
  try {
    const params = {};

    const trimmedSearch = search.trim();
    if (trimmedSearch) {
      params.search = trimmedSearch;
    }

    if (statusFilter === "active") {
      params.is_active = true;
    }

    if (statusFilter === "inactive") {
      params.is_active = false;
    }

    if (role !== "all") {
      params.role = role;
    }

    const response = await exportUsers(params);

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Liste-coordinateurs.xlsx";

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(
      "Erreur lors de l'export de la liste des coordinateurs :",
      error
    );
  }
};

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-5 pt-18 md:pt-0 pb-8 lg:p-10 bg-white">

       {isAdmin ? (
  <NavigationHeader
    title="Liste des coordinateurs"
    type="share"
    actionTitle="Exporter la liste des coordinateurs"
    onAction={handleExport}
    secondType="add"
    secondActionTitle="Ajouter un coordinateur"
    onSecondAction={() => navigate("/ajout-coordinateur")}
  />
) : (
  <NavigationHeader
    title="Liste des coordinateurs"
  />
)}

        <div className="my-6">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            showFilter={false}
            maxWidth="max-w-full"
            placeholder="Rechercher par informations du coordinateur"
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
           <div ref={observerTarget} className="h-1" />

            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <Spinner />
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

