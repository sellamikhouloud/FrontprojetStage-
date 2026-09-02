import { useEffect, useMemo, useState } from "react";

import { MapPin } from "lucide-react";

import { getDashboard } from "@/lib/api/dashboard";
import { getFamille } from "@/lib/api/familles";

const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

export default function UpcomingVisits() {
  
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);

  /*
   * ---------------------------------------------------------
   * Récupération des visites à venir
   * ---------------------------------------------------------
   */
  useEffect(() => {
    const loadUpcomingVisits = async () => {
      try {
        setLoading(true);

        const dashboardResponse = await getDashboard();

        const upcoming =
          dashboardResponse?.data?.visites_a_venir || [];

        const detailedVisits = await Promise.all(
          upcoming.map(async (visit, index) => {
            try {
              const familleResponse = await getFamille(
                visit.famille
              );

              const famille = familleResponse?.data;

              return {
                id: index + 1,
                date: visit.date_visite,

                family: famille?.mere
                  ? `Famille de ${famille.mere.prenom || ""} ${
                      famille.mere.nom || ""
                    }`.trim()
                  : `Famille ${visit.famille}`,

                village:
                  famille?.mere?.village?.nom ||
                  "Village non renseigné",

                code: famille?.id || visit.famille,
              };
            } catch (error) {
              console.error(
                `Erreur lors de la récupération de la famille ${visit.famille}:`,
                error
              );

              return {
                id: index + 1,
                date: visit.date_visite,
                family: `Famille ${visit.famille}`,
                village: "Village non renseigné",
                code: visit.famille,
              };
            }
          })
        );

        setVisits(detailedVisits);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des visites à venir :",
          error
        );

        setVisits([]);
      } finally {
        setLoading(false);
      }
    };

    loadUpcomingVisits();
  }, []);

  /*
   * ---------------------------------------------------------
   * Mois actuellement sélectionné
   * ---------------------------------------------------------
   */
  const month = selectedDate.toLocaleDateString("fr-FR", {
    month: "long",
  });

  const monthLabel =
    month.charAt(0).toUpperCase() + month.slice(1);

  /*
   * ---------------------------------------------------------
   * Début de la semaine
   * ---------------------------------------------------------
   */
  const startOfWeek = useMemo(() => {
    const date = new Date(today);

    date.setHours(0, 0, 0, 0);

    date.setDate(today.getDate() - today.getDay());

    return date;
  }, []);

  /*
   * ---------------------------------------------------------
   * Les 7 jours de la semaine
   * ---------------------------------------------------------
   */
  const week = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(startOfWeek);

      date.setDate(startOfWeek.getDate() + index);

      return {
        date,
        day: dayNames[index],
        number: date.getDate(),
      };
    });
  }, [startOfWeek]);

  /*
   * ---------------------------------------------------------
   * Format date YYYY-MM-DD
   * ---------------------------------------------------------
   */
  const formatDate = (date) => {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(
      2,
      "0"
    );

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /*
   * ---------------------------------------------------------
   * Visites du jour sélectionné
   * ---------------------------------------------------------
   */
  const selectedVisits = visits.filter(
    (visit) => visit.date === formatDate(selectedDate)
  );

  return (
    <div
      className="
        w-full
        rounded-[30px]
        max-md:rounded-[18px]
        border
        border-[#E2E8F0]
        bg-[#F8FAFC]
        p-6
        max-md:p-[12px]
        shadow-sm
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div
        className="
          mb-6
          max-md:mb-[12px]
          flex
          items-center
          justify-between
          gap-2
        "
      >
        <h2
          className="
            text-[24px]
            max-md:text-[16px]
            font-bold
            leading-[20px]
            max-md:leading-[18px]
          "
        >
          Visites à venir
        </h2>

        <div
          className="
            rounded-full
            bg-[#E6E6E6]
            px-[24px]
            py-[8px]
            max-md:px-[12px]
            max-md:py-[5px]
            text-[16px]
            max-md:text-[11px]
            font-medium
            text-[#484848]
            whitespace-nowrap
          "
        >
          {monthLabel}
        </div>
      </div>

      {/* =====================================================
          WEEK
      ====================================================== */}
      <div
        className="
          mb-6
          max-md:mb-[12px]
          flex
          gap-[7px]
          max-md:gap-[5px]
          overflow-x-auto
          pb-2
          max-md:pb-[5px]
          scrollbar-hide
        "
      >
        {week.map((item) => {
          const selected =
            item.date.toDateString() ===
            selectedDate.toDateString();

          return (
            <button
              key={item.date.toISOString()}
              type="button"
              onClick={() => setSelectedDate(item.date)}
              className={`
                flex
                h-[86px]
                w-[64px]
                max-md:h-[65px]
                max-md:w-[48px]
                flex-shrink-0
                flex-col
                items-center
                justify-center
                rounded-[30px]
                max-md:rounded-[18px]
                border
                transition-all
                duration-200

                ${
                  selected
                    ? "border-[#4E9F8A]"
                    : "border-[#B5B5B5] hover:border-[#4E9F8A]"
                }
              `}
            >
              <span
                className="
                  text-[16px]
                  max-md:text-[11px]
                  font-medium
                "
              >
                {item.day}
              </span>

              <div
                className={`
                  mt-2
                  max-md:mt-[5px]
                  flex
                  h-10
                  w-10
                  max-md:h-[27px]
                  max-md:w-[27px]
                  items-center
                  justify-center
                  rounded-[20px]
                  max-md:rounded-full
                  text-[16px]
                  max-md:text-[11px]
                  font-bold

                  ${
                    selected
                      ? "bg-[#4E9F8A] text-white"
                      : "bg-[#B5B5B5] text-white hover:bg-[#4E9F8A]"
                  }
                `}
              >
                {item.number}
              </div>
            </button>
          );
        })}
      </div>

      {/* =====================================================
          VISITS
      ====================================================== */}
      <div
        className="
          space-y-4
          max-md:space-y-[8px]
        "
      >
        {loading ? (
          <div
            className="
              rounded-3xl
              max-md:rounded-[14px]
              bg-white
              py-10
              max-md:py-6
              text-center
              text-gray-500
              text-sm
              max-md:text-[11px]
              shadow-sm
            "
          >
            Chargement des visites...
          </div>
        ) : selectedVisits.length > 0 ? (
          selectedVisits.map((visit) => (
            <div
              key={`${visit.code}-${visit.date}`}
              className="
                flex
                items-center
                justify-between
                gap-3
                rounded-[20px]
                max-md:rounded-[13px]
                bg-white
                px-5
                py-4
                max-md:px-[10px]
                max-md:py-[9px]
                shadow-sm
                transition
                hover:shadow-md
                min-w-0
              "
            >
              {/* Family information */}
              <div className="min-w-0 flex-1">
                <h3
                  className="
                    text-[16px]
                    max-md:text-[12px]
                    font-bold
                    leading-5
                    max-md:leading-[15px]
                    truncate
                  "
                >
                  {visit.family}
                </h3>

                {/* Village */}
                <div
                  className="
                    mt-2
                    max-md:mt-[5px]
                    flex
                    items-center
                    gap-[5px]
                    max-md:gap-[3px]
                    text-[14px]
                    max-md:text-[10px]
                    font-medium
                  "
                >
                  <MapPin
                    size={16}
                    className="
                      text-[#528583]
                      max-md:w-[12px]
                      max-md:h-[12px]
                      flex-shrink-0
                    "
                  />

                  <span className="truncate">
                    {visit.village}
                  </span>
                </div>
              </div>

              {/* Family code */}
              <span
                className="
                  self-start
                  flex-shrink-0
                  text-[14px]
                  max-md:text-[10px]
                  font-bold
                  text-[#528583]
                  max-md:pt-[1px]
                "
              >
                {visit.code}
              </span>
            </div>
          ))
        ) : (
          <div
            className="
              rounded-3xl
              max-md:rounded-[14px]
              bg-white
              py-10
              max-md:py-6
              px-3
              text-center
              text-gray-500
              text-sm
              max-md:text-[11px]
              shadow-sm
            "
          >
            Aucune visite prévue pour cette journée.
          </div>
        )}
      </div>
    </div>
  );
}