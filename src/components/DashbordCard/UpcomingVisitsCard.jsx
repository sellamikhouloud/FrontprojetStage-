// import { useMemo, useState } from "react";
// import { MapPin } from "lucide-react";

// const visits = [
//   {
//     id: 1,
//     date: "2026-08-02",
//     family: "Famille de Aïcha Mint Mohamed",
//     village: "Lexeiba",
//     code: "GDK-2026-003",
//   },
//   {
//     id: 2,
//     date: "2026-08-03",
//     family: "Famille de Mohamed Ould Ahmed",
//     village: "Rosso",
//     code: "GDK-2026-004",
//   },
//   {
//     id: 3,
//     date: "2026-08-04",
//     family: "Famille de Fatima Mint Ali",
//     village: "Kaédi",
//     code: "GDK-2026-005",
//   },
//   {
//     id: 4,
//     date: "2026-08-06",
//     family: "Famille de Aïcha Mint Mohamed",
//     village: "Lexeiba",
//     code: "GDK-2026-006",
//   },
//   {
//     id: 5,
//     date: "2026-08-06",
//     family: "Famille de Mohamed",
//     village: "Lexeiba",
//     code: "GDK-2026-007",
//   },
// ];

// const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

// export default function UpcomingVisits() {
//   const today = new Date();

//   const [selectedDate, setSelectedDate] = useState(today);

//   // Current month
//   const month = selectedDate.toLocaleDateString("fr-FR", {
//     month: "long",
//   });

//   const monthLabel =
//     month.charAt(0).toUpperCase() + month.slice(1);

//   // Sunday of current week
//   const startOfWeek = new Date(today);
//   startOfWeek.setDate(today.getDate() - today.getDay());

//   const week = useMemo(() => {
//     return Array.from({ length: 7 }, (_, index) => {
//       const date = new Date(startOfWeek);
//       date.setDate(startOfWeek.getDate() + index);

//       return {
//         date,
//         day: dayNames[index],
//         number: date.getDate(),
//       };
//     });
//   }, []);

//   const selectedVisits = visits.filter(
//     (visit) =>
//       visit.date === selectedDate.toISOString().split("T")[0]
//   );

//   return (
//     <div className="w-full rounded-[30px] border border-[#E2E8F0] bg-[#F8FAFC] p-6 shadow-sm">

//       {/* Header */}

//       <div className="mb-6 flex items-center justify-between">
//         <h2 className="text-[24px] font-bold leading-[20px]">
//           Visites à venir
//         </h2>

//         <div className="rounded-full bg-[#E6E6E6] px-[24px] py-[8px] text-[16px] font-medium text-[#484848]">
//           {monthLabel}
//         </div>
//       </div>

//       {/* Week */}

//       <div className="mb-6 flex gap-[7px] overflow-x-auto pb-2 scrollbar-hide">
//         {week.map((item) => {
//           const selected =
//             item.date.toDateString() ===
//             selectedDate.toDateString();

//           return (
//             <button
//               key={item.date}
//               onClick={() => setSelectedDate(item.date)}
//               className={`
//                 flex
//                 h-[86px]
//                 w-[64px]
//                 flex-shrink-0
//                 flex-col
//                 items-center
//                 justify-center
//                 rounded-[30px]
//                 border
//                 transition-all
//                 duration-200
//                 ${
//                   selected
//                     ? "border-[#4E9F8A]"
//                     : "border-[#B5B5B5] hover:border-[#4E9F8A]"
//                 }
//               `}
//             >
//               <span className="text-[16px] font-medium">
//                 {item.day}
//               </span>

//               <div
//                 className={`
//                   mt-2
//                   flex
//                   h-10
//                   w-10
//                   items-center
//                   justify-center
//                   rounded-[20px]
//                   text-[16px]
//                   font-bold
//                   ${
//                     selected
//                       ? "bg-[#4E9F8A] text-white"
//                       : "bg-[#B5B5B5] text-white hover:bg-[#4E9F8A]"
//                   }
//                 `}
//               >
//                 {item.number}
//               </div>
//             </button>
//           );
//         })}
//       </div>

//       {/* Visits */}

//       <div className="space-y-4">
//         {selectedVisits.length > 0 ? (
//           selectedVisits.map((visit) => (
//             <div
//               key={visit.id}
//               className="flex items-center justify-between rounded-[20px] bg-white px-5 py-4 shadow-sm transition hover:shadow-md"
//             >
//               <div>
//                 <h3 className="text-[16px] font-bold">
//                   {visit.family}
//                 </h3>

//                 <div className="mt-2 flex items-center gap-[5px] text-[14px] font-medium ">
//                   <MapPin
//                     size={16}
//                     className="text-[#528583]"
//                   />

//                   {visit.village}
//                 </div>
//               </div>

//               <span className="font-bold text-[#528583] text-[14px] self-start">
//                 {visit.code}
//               </span>
//             </div>
//           ))
//         ) : (
//           <div className="rounded-3xl bg-white py-10 text-center text-gray-500 shadow-sm">
//             Aucune visite prévue pour cette journée.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

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
   *
   * Le dashboard donne :
   *
   * {
   *   famille: "GDK-2026-001",
   *   date_visite: "2026-09-05"
   * }
   *
   * On utilise ensuite getFamille() pour récupérer :
   * - mere.nom
   * - mere.prenom
   * - mere.village.nom
   */
  useEffect(() => {
    const loadUpcomingVisits = async () => {
      try {
        setLoading(true);

        const dashboardResponse = await getDashboard();

        const upcoming =
          dashboardResponse?.data?.visites_a_venir || [];

        /*
         * On récupère les informations détaillées
         * de chaque famille.
         */
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

              /*
               * Même si le détail d'une famille échoue,
               * on garde la visite avec les informations
               * que le dashboard possède déjà.
               */
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
   *
   * Dimanche = début de semaine
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
   *
   * On évite toISOString() car il peut provoquer
   * des problèmes de décalage horaire.
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
    <div className="w-full rounded-[30px] border border-[#E2E8F0] bg-[#F8FAFC] p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[24px] font-bold leading-[20px]">
          Visites à venir
        </h2>

        <div className="rounded-full bg-[#E6E6E6] px-[24px] py-[8px] text-[16px] font-medium text-[#484848]">
          {monthLabel}
        </div>
      </div>

      {/* Week */}
      <div className="mb-6 flex gap-[7px] overflow-x-auto pb-2 scrollbar-hide">
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
                flex-shrink-0
                flex-col
                items-center
                justify-center
                rounded-[30px]
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
              <span className="text-[16px] font-medium">
                {item.day}
              </span>

              <div
                className={`
                  mt-2
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-[20px]
                  text-[16px]
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

      {/* Visits */}
      <div className="space-y-4">
        {loading ? (
          <div className="rounded-3xl bg-white py-10 text-center text-gray-500 shadow-sm">
            Chargement des visites...
          </div>
        ) : selectedVisits.length > 0 ? (
          selectedVisits.map((visit) => (
            <div
              key={`${visit.code}-${visit.date}`}
              className="flex items-center justify-between rounded-[20px] bg-white px-5 py-4 shadow-sm transition hover:shadow-md"
            >
              <div>
                {/* Nom de la famille */}
                <h3 className="text-[16px] font-bold">
                  {visit.family}
                </h3>

                {/* Village */}
                <div className="mt-2 flex items-center gap-[5px] text-[14px] font-medium">
                  <MapPin
                    size={16}
                    className="text-[#528583]"
                  />

                  {visit.village}
                </div>
              </div>

              {/* Code famille */}
              <span className="self-start text-[14px] font-bold text-[#528583]">
                {visit.code}
              </span>
            </div>
          ))
        ) : (
          <div className="rounded-3xl bg-white py-10 text-center text-gray-500 shadow-sm">
            Aucune visite prévue pour cette journée.
          </div>
        )}
      </div>
    </div>
  );
}