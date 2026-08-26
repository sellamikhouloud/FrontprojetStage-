import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
import Sidebar from "../../components/Sidebar/Sidebar";
import NotificationCard from "../../components/AlertComposant/NotificationCard";
import Spinner from "../../components/Spinner";

import Share from "../../assets/Share.svg";

import {  getHistoriqueAlertes, exportHistoriqueAlertes } from "@/lib/api/Notifications";

const HistoriqueNotificationsPage = () => {
  const navigate = useNavigate();

  const {
    data: historique,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["historique-alertes"],
    queryFn: async () => {
      const res = await getHistoriqueAlertes();


      return res.data.results || [];
    },
  });

  

 
  const handleExport = async () => {
    try {
      const response = await exportHistoriqueAlertes();

      // Création du fichier à partir du Blob
      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "historique_notifications.csv";

      document.body.appendChild(link);
      link.click();

      // Nettoyage
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
    onBack={() => navigate("/Notifications")}
  />

        
        <button
  type="button"
  onClick={handleExport}
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
    Exporter la liste des alertes résolues
  </span>

  <img
    src={Share}
    alt="Exporter"
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
        <div
          className="
            w-full
            flex
            flex-col
            gap-1.5
            sm:gap-2
          "
        >

       
          {isLoading && (
            <div className="flex justify-center py-10">
              <Spinner />
            </div>
          )}

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

        
         {!isLoading &&
  !isError &&
  historique?.length > 0 &&
  historique.map((notification) => (
    <NotificationCard
      key={notification.id}
      type={notification.type}
      message={getHistoriqueMessage(notification)}
      showArrow={false}
    />
  ))}

        
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
