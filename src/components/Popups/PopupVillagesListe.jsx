import { useState } from "react";
import { Trash2, Check, X as XIcon } from "lucide-react";
import quitter from "../../assets/quitter.svg";
import SearchBar from "../Filter/Searchbar";
import modifyBlue from "../../assets/modifyblue.svg";

/**
 * VillageListDialog — popup listant les villages avec édition du nom et suppression.
 *
 * props:
 *   open           : boolean
 *   title          : string
 *   items          : { id, nom, date_affichage, est_modifie }[]
 *   onUpdate       : (id, nouveauNom) 
 *   onDelete       : (id) 
 *   onClose        : () 
 *   searchPlaceholder? : string
 *   emptyMessage?  : string
 *   loading?       : boolean
 *   errorMessage?  : string   -> erreur globale (chargement / suppression)
 */
export default function VillageListDialog({
  open,
  title,
  items = [],
  onUpdate,
  onDelete,
  onClose,
  searchPlaceholder = "Entrer le nom ici",
  emptyMessage = "Aucun village trouvé.",
  loading = false,
  errorMessage = "",
}) {
  const [search, setSearch] = useState("");

  // édition inline
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [editError, setEditError] = useState("");

  if (!open) return null;

  const formaterDate = (isoString) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const filtered = items.filter((item) =>
    item.nom?.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditValue(item.nom);
    setEditError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
    setEditError("");
  };

  const confirmEdit = async (id) => {
    const nom = editValue.trim();
    if (!nom) {
      setEditError("Le nom ne peut pas être vide.");
      return;
    }

    setSavingId(id);
    setEditError("");

    try {
      await onUpdate?.(id, nom);
      setEditingId(null);
      setEditValue("");
    } catch (err) {
      setEditError(
        err?.response?.data?.nom?.[0] ||
          "Impossible de modifier ce village."
      );
    } finally {
      setSavingId(null);
    }
  };

  const handleEditKeyDown = (e, id) => {
    if (e.key === "Enter") {
      e.preventDefault();
      confirmEdit(id);
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

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

          {errorMessage && (
            <p className="mt-2 text-[13px] text-[#EF4444]">{errorMessage}</p>
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
            {loading ? (
              <p className="text-center text-[14px] text-[#6B7280] py-8">
                Chargement...
              </p>
            ) : filtered.length === 0 ? (
              <p className="text-center text-[14px] text-[#6B7280] py-8">
                {emptyMessage}
              </p>
            ) : (
              filtered.map((item) => {
                const isEditing = editingId === item.id;
                const isSaving = savingId === item.id;

                           return (
                  <div
                    key={item.id}
                    className="
                      flex items-center
                      justify-between
                      gap-3
                      rounded-[12px]
                      border
                      border-[#A7DAD8]
                      bg-white
                      px-3
                      py-1
                    "
                  >
                    {/* Colonne gauche : nom + date */}
                    <div className="flex flex-col min-w-0 flex-1  gap-1">
                      {isEditing ? (
                        <input
                          type="text"
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => handleEditKeyDown(e, item.id)}
                          className="
                            flex-1 min-w-0 text-[16px] font-semibold text-black
                            bg-[#F7F9F8] rounded-[8px] px-2 py-1 outline-none
                            border border-[#7BC8C4]
                          "
                        />
                      ) : (
                        <span className="text-[16px] font-semibold text-black min-w-0 truncate">
                          {item.nom}
                        </span>
                      )}

                      <span className="text-[12px] text-[#000000] font-regular">
                        {item.est_modifie ? "Modifié le : " : "Créé le : "}
                        {formaterDate(item.date_affichage)}
                      </span>

                      {isEditing && editError && (
                        <span className="text-[12px] text-[#EF4444] font-medium">
                          {editError}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      {isEditing ? (
                        <>
                          <button type="button" onClick={() => confirmEdit(item.id)} disabled={isSaving}
                            aria-label="Valider"
                            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#4E9F8A] hover:bg-[#EAF7F3] transition disabled:opacity-50">
                            <Check size={17} strokeWidth={2.25} />
                          </button>
                          <button type="button" onClick={cancelEdit} disabled={isSaving}
                            aria-label="Annuler"
                            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:bg-[#F3F4F6] transition disabled:opacity-50">
                            <XIcon size={17} strokeWidth={2.25} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button type="button" onClick={() => startEdit(item)}
                            aria-label={`Modifier ${item.nom}`}
                            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#EAF3FA] transition">
                            <img src={modifyBlue} alt="" className="w-5 h-5" />
                          </button>
                          <button type="button" onClick={() => onDelete?.(item.id)}
                            aria-label={`Supprimer ${item.nom}`}
                            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#EF4444] hover:bg-[#FDECEC] transition">
                            <Trash2 size={17} strokeWidth={2.25} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ESPACE BLANC FIXE */}
        <div className="shrink-0 h-[24px] bg-white" />
      </div>
    </div>
  );
}