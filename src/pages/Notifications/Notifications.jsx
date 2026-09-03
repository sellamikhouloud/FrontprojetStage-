import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import Sidebar from "../../components/Sidebar/Sidebar";
import NotificationCard from "../../components/AlertComposant/NotificationCard";
import Spinner from "../../components/Spinner";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
import Historique from "../../assets/History.svg";

import { getNotifications } from "@/lib/api/Notifications";

const NotificationsPage = () => {
  const navigate = useNavigate();

  const {
  data,
  isLoading,
  isError,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ["notifications", "infinite"],

  queryFn: ({ pageParam = 1 }) =>
    getNotifications({ page: pageParam }).then((res) => res.data),

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

  const notifications = (data?.pages ?? []).flatMap((page) =>
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
 
  const handleBack = () => {
    navigate(-1);
  };

  
  const handleHistory = () => {
    navigate("/notifications/historique");
  };

 
  const handleNotificationClick = (notification) => {
    console.log("Notification sélectionnée :", notification);

      // Rapport
  if (notification.type === "validation_rapport") {
    const message = notification.message?.toLowerCase() || "";

    
    if (
      message.includes("bilan des donateurs") ||
      message.includes("bilan donateurs")
    ) {
      navigate("/rapports/bilan-donateurs");
      return;
    }

    
    if (message.includes("rapport annuel")) {
      navigate("/rapports/annuel");
      return;
    }

    
    if (message.includes("rapport mensuel")) {
      navigate("/rapports");
      return;
    }

    
    navigate("/rapports");
    return;
  }

 if (notification.type === "stock_faible") {
  navigate("/liste-distributions", { state: { openStockPopup: true } });
  return;
}

 if (notification.type === "malnutrition") {
  navigate(`/famille/${notification.famille}`);
  return;
}

if (notification.type === "visite_retard") {
  navigate(`/famille/${notification.famille}`);
  return;
}

if (notification.type === "verification_taux_change") {
  navigate("/parametres");
  return;
}
   
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

        <div
          className="
            w-full
            flex
            items-center
            justify-between
            gap-4
          "
        >

          <PageHeader
    leftTitle="Fermer"
    showRight={false}
    onBack={() => navigate("/dashboard")}
  />


       
            {/* Historique */}
          <button
            type="button"
            onClick={handleHistory}
            className="
              flex
              items-center
              justify-end
              gap-1.5
              sm:gap-2

              text-[13px]
              xs:text-[14px]
              sm:text-[18px]

              font-medium
              text-[#111111]

              hover:opacity-70
              transition-opacity
              duration-200

              cursor-pointer

              min-w-0
              max-w-[65%]
              sm:max-w-none
            "
          >
            <span
              className="
                leading-5
                text-right
                break-words
                line-clamp-2
              "
            >
               Voir l'historique des Alertes
            </span>

            <img
              src={Historique}
              alt="Historique"
              className="
                w-5
                h-5
                sm:w-6
                sm:h-6
                flex-shrink-0
              "
            />
          </button>
        </div>

       <h1
  className="
    text-[20px]
    xs:text-[22px]
    sm:text-[26px]
    md:text-[28px]
    lg:text-[30px]

    font-bold
    text-[#1E1E1E]

    text-center
    leading-tight

    mt-5
    sm:mt-6

    mb-4
    sm:mb-5
  "
>
  Notifications
</h1>
    
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
              Erreur lors du chargement des notifications.
            </div>
          )}

          {/* Notifications */}
          {!isLoading &&
            !isError &&
            notifications?.length > 0 &&
            notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                type={notification.type}
                message={notification.message}
                onClick={() =>
                  handleNotificationClick(notification)
                }
              />
            ))}

              {!isLoading && !isError && notifications?.length > 0 && (
            <div ref={observerTarget} className="h-1" />
          )}

          {isFetchingNextPage && (
            <div className="flex justify-center py-4">
              <Spinner />
            </div>
          )}

          {/* Aucune notification */}
          {!isLoading &&
            !isError &&
            (!notifications || notifications.length === 0) && (
              <div
                className="
                  p-6
                  text-center
                  text-gray-500
                  text-sm
                  sm:text-base
                "
              >
                Aucune notification.
              </div>
            )}

        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;
