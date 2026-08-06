import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";

const visits = [
  {
    id: 1,
    date: "2026-08-02",
    family: "Famille de Aïcha Mint Mohamed",
    village: "Lexeiba",
    code: "GDK-2026-003",
  },
  {
    id: 2,
    date: "2026-08-03",
    family: "Famille de Mohamed Ould Ahmed",
    village: "Rosso",
    code: "GDK-2026-004",
  },
  {
    id: 3,
    date: "2026-08-04",
    family: "Famille de Fatima Mint Ali",
    village: "Kaédi",
    code: "GDK-2026-005",
  },
  {
    id: 4,
    date: "2026-08-06",
    family: "Famille de Aïcha Mint Mohamed",
    village: "Lexeiba",
    code: "GDK-2026-006",
  },
  {
    id: 5,
    date: "2026-08-06",
    family: "Famille de Mohamed",
    village: "Lexeiba",
    code: "GDK-2026-007",
  },
];

const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

export default function UpcomingVisits() {
  const today = new Date();

  const [selectedDate, setSelectedDate] = useState(today);

  // Current month
  const month = selectedDate.toLocaleDateString("fr-FR", {
    month: "long",
  });

  const monthLabel =
    month.charAt(0).toUpperCase() + month.slice(1);

  // Sunday of current week
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

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
  }, []);

  const selectedVisits = visits.filter(
    (visit) =>
      visit.date === selectedDate.toISOString().split("T")[0]
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
              key={item.date}
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
        {selectedVisits.length > 0 ? (
          selectedVisits.map((visit) => (
            <div
              key={visit.id}
              className="flex items-center justify-between rounded-[20px] bg-white px-5 py-4 shadow-sm transition hover:shadow-md"
            >
              <div>
                <h3 className="text-[16px] font-bold">
                  {visit.family}
                </h3>

                <div className="mt-2 flex items-center gap-[5px] text-[14px] font-medium ">
                  <MapPin
                    size={16}
                    className="text-[#528583]"
                  />

                  {visit.village}
                </div>
              </div>

              <span className="font-bold text-[#528583] text-[14px] self-start">
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