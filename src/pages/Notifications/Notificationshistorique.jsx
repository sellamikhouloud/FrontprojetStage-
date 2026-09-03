import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";

import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
import Sidebar from "../../components/Sidebar/Sidebar";
import NotificationCard from "../../components/AlertComposant/NotificationCard";
import Spinner from "../../components/Spinner";
import { TypeFilter } from "../../components/Filter/StatusFilter";

import Share from "../../assets/Share.svg";

import {
  getHistoriqueAlertes,
  exportHistoriqueAlertes,
} from "@/lib/api/Notifications";

const HistoriqueNotificationsPage = () => {
  const navigate = useNavigate();

  const [typeFilter, setTypeFilter] = useState("all");

    const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["historique-alertes", "infinite", typeFilter],

    queryFn: async ({ pageParam = 1 }) => {
      const params =
        typeFilter === "all"
          ? { page: pageParam }
          : {
              type: typeFilter,
              page: pageParam,
            };

      const res = await getHistoriqueAlertes(params);
      return res.data;
    },

  getNextPageParam: (lastPage, allPages) => {
  const results = Array.isArray(lastPage) ? lastPage : lastPage?.results ?? [];
  if (!lastPage?.next || results.length === 0) return undefined;

  const previousPage = allPages[allPages.length - 1];
  const previousResults = Array.isArray(previousPage) ? previousPage : previousPage?.results ?? [];
  if (allPages.length > 1 && results[0]?.id === previousResults[0]?.id) return undefined;

  return allPages.length + 1;
},

initialPageParam: 1,
  });

  const historique = (data?.pages ?? []).flatMap((page) =>
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
      const params =
        typeFilter === "all"
          ? {}
          : {
              type: typeFilter,
            };

      const response = await exportHistoriqueAlertes(params);

      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "Historique_Alertes.csv";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Erreur lors de l'export de l'historique :",
        error
      );
    }
  };

  const getHistoriqueMessage = (notification) => {
    const message = notification.message || "";

    if (
      (notification.type === "visite_retard" ||
        notification.type === "malnutrition") &&
      notification.famille
    ) {
      return `${message} (Code famille : ${notification.famille})`;
    }

    return message;
  };

    const formatDateResolution = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getResoluePar = (notification) => {
    if (!notification.resolue_par) return "";
    return `${notification.resolue_par.nom ?? ""} ${notification.resolue_par.prenom ?? ""}`.trim();
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <Sidebar hideOnMobile />

      <main
        className="
          flex-1
          min-w-0
          h-screen
          overflow-y-auto
          bg-white

          px-4
          sm:px-5
          md:px-6
          lg:px-8
          xl:px-10

          pt-8
          sm:pt-9
          lg:pt-8

          pb-8
        "
      >
      {/* Conteneur Header + Bouton Exporter */}
<div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
  <PageHeader
    leftTitle="Fermer"
    showRight={false}
    onBack={() => navigate("/Notifications")}
  />

  {/* Bouton Exporter */}
  <button
    type="button"
    onClick={handleExport}
    className="
      /* STYLES MOBILE : Bouton vert pleine largeur sous 'Fermer' */
      w-full
      flex
      items-center
      justify-center
      gap-2
      rounded-2xl
      border-2
      border-[#4E9F8A]
      bg-[#C4DFD8]
      px-4
      py-2.5
      text-[15px]
      font-medium
      text-[#1E1E1E]
      cursor-pointer
      transition-all
      duration-150
      active:scale-95

      /* STYLES DESKTOP : Format lien aligné à droite */
      sm:w-auto
      sm:border-0
      sm:bg-transparent
      sm:p-0
      sm:rounded-none
      sm:text-[18px]
      sm:hover:opacity-70

      shrink-0
    "
  >
    <span className="leading-tight text-center sm:text-right break-words line-clamp-1 sm:line-clamp-2">
      Exporter la liste des alertes résolues
    </span>

    <img
      src={Share}
      alt="Exporter"
      className="
        w-4
        h-4
        sm:w-6
        sm:h-6
        flex-shrink-0
      "
    />
  </button>
</div>
 

        <h1
          className="
            w-full
            text-[20px]
            sm:text-[24px]
            md:text-[26px]
            lg:text-[28px]

            font-bold
            text-[#1E1E1E]

            text-center
            leading-tight

            break-words
            px-2

            mt-5
            sm:mt-6

            mb-4
            sm:mb-5
          "
        >
          Historique des Alerts.
        </h1>

        {/* Filtre par type */}
        <div className="w-full flex justify-start mb-4 sm:mb-5">
          <TypeFilter
            value={typeFilter}
            onChange={setTypeFilter}
          />
        </div>

        <div
          className="
            w-full
            flex
            flex-col
            gap-1.5
            sm:gap-2
          "
        >
          {/* Chargement */}
          {isLoading && (
            <div className="flex justify-center py-10">
              <Spinner />
            </div>
          )}

          {/* Erreur */}
          {isError && (
            <div
              className="
                p-6
                text-center
                text-red-500
                text-sm
                sm:text-base
              "
            >
              Erreur lors du chargement de
              l'historique des notifications.
            </div>
          )}

          {/* Historique */}
                   {!isLoading &&
            !isError &&
            historique?.length > 0 &&
            historique.map((notification) => (
             <NotificationCard
  key={notification.id}
  type={notification.type}
  message={getHistoriqueMessage(notification)}
  showArrow={false}
  dateResolution={formatDateResolution(
    notification.date_resolution
  )}
  resoluePar={getResoluePar(notification)}
/>
            ))}

             {!isLoading && !isError && historique?.length > 0 && (
            <div ref={observerTarget} className="h-1" />
          )}

          {isFetchingNextPage && (
            <div className="flex justify-center py-4">
              <Spinner />
            </div>
          )}

          {/* Aucun résultat */}
          {!isLoading &&
            !isError &&
            (!historique || historique.length === 0) && (
              <div
                className="
                  p-6
                  text-center
                  text-gray-500
                  text-sm
                  sm:text-base
                "
              >
                Aucun historique des Alerts.
              </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default HistoriqueNotificationsPage;

