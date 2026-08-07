import { useState } from "react";
import { Clock, MessageSquare } from "lucide-react";
import quitter from "../../assets/quitter.svg";
import SearchBar from "../Filter/Searchbar";

export default function PopupHistoriqueVersements({
  open,
  versements = [],
  onClose,
}) {
  const [search, setSearch] = useState("");

  if (!open) return null;

  const filtered = versements.filter((v) =>
    v.date?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="
        fixed inset-0 z-[70]
        bg-transparent
        sm:bg-black/40
        flex items-start sm:items-center
        justify-center
        overflow-y-auto
        p-0
        sm:p-4
      "
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full
          sm:w-[560px]

          h-full
          sm:h-[85vh]
          max-h-full
          sm:max-h-[85vh]

          flex
          flex-col

          bg-white
          rounded-none
          sm:rounded-[24px]
          overflow-hidden
          sm:shadow-xl
        "
      >
        {/* Header FIXE */}
        <div className="shrink-0 px-6 pt-6 pb-4">
          <button
            onClick={onClose}
            className="
              flex items-center gap-2
              text-[16px] sm:text-[17px]
              text-[#1E1E1E]
              hover:opacity-70
              transition
            "
          >
            <img
              src={quitter}
              alt="Fermer"
              className="w-7 h-7"
            />
          </button>

          <h2 className="mt-3 text-center text-[19px] sm:text-[24px] font-bold text-black">
            Historique des versements
          </h2>

          {/* Recherche */}
          <div className="mt-5">
            <SearchBar
              placeholder="Entrer la date"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              showFilter={false}
            />
          </div>
        </div>

        {/* LISTE SCROLLABLE */}
        <div
          className="
            flex-1
            min-h-0
            overflow-y-auto
            scrollbar-hide
            px-6
          "
        >
          <div className="flex flex-col gap-3">
            {filtered.length === 0 ? (
              <p className="text-center text-[14px] text-[#6B7280] py-8">
                Aucun versement trouvé.
              </p>
            ) : (
              filtered.map((v) => (
                <div
                  key={v.id}
                  className="
                    flex flex-col
                    sm:flex-row sm:items-center sm:justify-between
                    gap-2 sm:gap-3
                    rounded-[15px]
                    border
                    border-[#E2E8F0]
                    bg-[#F8FBFC]
                    px-4
                    py-2
                  "
                >
                  {/* Date + commentaire */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Clock
                        size={15}
                        className="text-[#4E9F8A] shrink-0"
                      />

                      <span className="text-[16px] font-semibold text-black">
                        {v.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <MessageSquare
                        size={15}
                        className="text-[#4E9F8A] shrink-0"
                      />

                      <span className="text-[14px] font-regular text-[#393939]">
                        {v.commentaire || "/"}
                      </span>
                    </div>
                  </div>

                  {/* Montant */}
                  <div className="flex items-baseline gap-1 shrink-0 whitespace-nowrap">
                    <span className="text-[20px] font-bold text-[#22C55E]">
                      + {v.montantMRU} MRU
                    </span>

                    <span className="text-[16px] font-regular text-black">
                      / {v.montantEUR} Euros
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ESPACE BLANC FIXE */}
        <div className="shrink-0 h-[24px] bg-white" />
      </div>
    </div>
  );
}
