import { AlertTriangle } from "lucide-react";

/**
 * ConfirmDialog — boîte de dialogue de confirmation générique.
 *
 * props:
 *   open        : boolean   -> affiche ou non le modal
 *   title       : string
 *   message     : string
 *   confirmLabel?: string   -> défaut "Confirmer"
 *   cancelLabel? : string   -> défaut "Annuler"
 *   onConfirm   : () => void
 *   onCancel    : () => void
 */
export default function ConfirmDialog({
  open,
  title = "Confirmer l'action",
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(15, 23, 22, 0.45)" }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-[400px] rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#FDECEC", color: "#EF4444" }}
          >
            <AlertTriangle size={18} strokeWidth={2.5} />
          </div>
          <p className="text-[17px] font-extrabold text-[#202124]">{title}</p>
        </div>

        {message && (
          <p className="text-[14px] text-[#6E7976] leading-relaxed mb-6">
            {message}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border px-4 py-[11px] text-[14px] font-semibold transition-colors hover:bg-[#F9FAFB]"
            style={{ color: "#4B5563", borderColor: "#D1D5DB", backgroundColor: "transparent" }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl px-4 py-[11px] text-[14px] font-semibold text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: "#EF4444" }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}