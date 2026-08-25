import { useState } from "react";
import { Clock, Trash2 } from "lucide-react";
import quitter from "../../assets/quitter.svg";
import SearchBar from "../Filter/Searchbar";

/**
 * ListManagerDialog — modal générique listant des éléments avec option de suppression.
 *
 * props (nouveau) :
 *   filters?      : { value, label, selected, unselected }[]  -> pastilles de filtre (optionnel)
 *   filterValue?  : string                                    -> valeur sélectionnée
 *   onFilterChange?: (value) => void
 *   filterField?  : string  -> champ de l'item à comparer (défaut: "type")
 */


export default function ListManagerDialog({
   open,
  title,
  items = [],
  onDelete,
  onClose,
  searchPlaceholder = "Entrer le nom ici",
  emptyMessage = "Aucun élément trouvé.",
  showDelete = true,
  filters = null,
  filterValue = "all",
  onFilterChange,
  filterField = "type",
}) {
  const [search, setSearch] = useState("");

  if (!open) return null;

  const filtered = items
    .filter((item) => item.label?.toLowerCase().includes(search.toLowerCase()))
    .filter((item) =>
      !filters || filterValue === "all" ? true : item[filterField] === filterValue
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
          sm:w-[640px]

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
              text-[#000000]
              hover:opacity-70
              transition
            "
          >
            <img src={quitter} alt="Fermer" className="w-7 h-7" />
          </button>

          <h2 className="mt-3 text-center text-[19px] sm:text-[20px] font-bold text-black">
            {title}
          </h2>

          {/* Recherche */}
          <div className="mt-5">
            <SearchBar
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              showFilter={false}
              maxWidth="max-w-none"
            />
          </div>

          {/* Pastilles de filtre — affichées seulement si `filters` est fourni */}
          {filters && (
            <div className="mt-3 flex flex-wrap gap-2">
              {filters.map((option) => {
                const isSelected = filterValue === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onFilterChange?.(option.value)}
                    className={`
                      h-9
                      px-4
                      rounded-[10px]
                      border
                      text-[13px]
                      font-semibold
                      transition-all
                      duration-200
                      hover:opacity-90
                      active:scale-[0.98]
                      ${isSelected ? option.selected : option.unselected}
                    `}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
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
          <div className="flex flex-col gap-1.5 pb-2">
            {filtered.length === 0 ? (
              <p className="text-center text-[14px] text-[#6B7280] py-8">
                {emptyMessage}
              </p>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  className="
                    flex flex-col
                    sm:flex-row sm:items-center sm:justify-between
                    gap-1.5 sm:gap-3
                    rounded-[15px]
                    border
                    border-[#A7DAD8]
                    bg-white
                    px-4
                    py-2
                    sm:py-2
                  "
                >
                  <span className="text-[16px] font-semibold text-black min-w-0 truncate">
                    {item.label}
                  </span>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                   {item.date && (
                   <div className="flex items-center gap-1.5 whitespace-nowrap">
                   <Clock size={16} className="text-[#4E9F8A]" />
                   <span className="text-[14px] font-medium text-[#393939]">
                   {item.date}
                   </span>
                   </div>
                   )}

                    {showDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete?.(item.id)}
                        aria-label={`Supprimer ${item.label}`}
                        className="
                          shrink-0
                          w-8 h-8
                          rounded-full
                          flex
                          items-center
                          justify-center
                          text-[#EF4444]
                          hover:bg-[#FDECEC]
                          transition
                        "
                      >
                        <Trash2 size={17} strokeWidth={2.25} />
                      </button>
                    )}
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
