import { X, Trash2 } from "lucide-react";

/**
 * ListManagerDialog — modal générique listant des éléments avec option de suppression.
 * Réutilisable pour n'importe quelle liste (régions, emails destinataires, etc.).
 *
 * props:
 *   open          : boolean
 *   title         : string                 -> ex: "Toutes les régions"
 *   items         : { id, label }[]         -> éléments à afficher
 *   onDelete      : (id) => void            -> appelé au clic sur la corbeille
 *   onClose       : () => void
 *   emptyMessage? : string                  -> texte affiché si items est vide
 */
export default function ListManagerDialog({
  open,
  title,
  items = [],
  onDelete,
  onClose,
  emptyMessage = "Aucun élément pour l'instant.",
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(15, 23, 22, 0.45)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full
          max-w-[440px]
          max-h-[80vh]

          flex
          flex-col

          bg-white
          rounded-2xl
          shadow-xl
          overflow-hidden
        "
      >
        {/* Header — fixe */}
        <div
          className="
            shrink-0
            flex
            items-center
            justify-between
            gap-3

            px-5
            py-4

            border-b
            border-[#E5E7EB]
          "
        >
          <p className="text-[17px] font-bold text-[#000000] ">
            {title}
          </p>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="
              shrink-0
              w-8 h-8
              rounded-full
              flex
              items-center
              justify-center
              text-[#6E7976]
              hover:bg-[#F3F4F6]
              transition
            "
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Liste — scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-2">
          {items.length === 0 ? (
            <p className="py-8 text-center text-[14px] text-[#6E7976]">
              {emptyMessage}
            </p>
          ) : (
            items.map((item, index) => (
              <div
                key={item.id}
                className={`
                  flex items-center justify-between gap-3
                  py-3
                  ${index !== items.length - 1 ? "border-b border-[#F0F2F1]" : ""}
                `}
              >
                <span className="text-[14px] font-semibold text-[#000000] min-w-0">
                  {item.label}
                </span>

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
                  <Trash2 size={16} strokeWidth={2.25} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
