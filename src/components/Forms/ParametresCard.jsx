import { Bell, Info } from "lucide-react";

/**
 * ParametresCard — bloc "Paramètres" (Sonnerie des notifications, Version).
 *
 * onSelectSonnerie: () => void  -> appelé au clic sur "Sélectionner une sonnerie"
 * version: string -> "1.0.0"
 */
export default function ParametresCard({
  onSelectSonnerie,
  version,
}) {
  return (
    <div>
      <p className="text-[15px] font-bold text-[#202124] mb-3">Paramètres</p>

      <div className="rounded-[15px] overflow-hidden bg-[#F8FBFC] border border-[#BEC9C5]/30">
        {/* Sonnerie des notifications */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-b border-[#BEC9C5]/30">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#E6F5F4", color: "#4FA18F" }}
            >
              <Bell size={16} strokeWidth={2.5} />
            </div>

            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-[#4E9F8A]">
                Sonnerie des notifications
              </p>
              <p className="text-[12px] text-[#6E7976]">
                Vous pouvez choisir la sonnerie qui vous convient
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onSelectSonnerie}
            className="
              rounded-full
              px-4
              py-2

              w-full
              sm:w-auto
              shrink-0
              whitespace-nowrap

              bg-[#4FA18F]
              text-white
              text-[13px]
              font-semibold

              hover:bg-[#428E7B]
              transition
            "
          >
            Selectionner une sonnerie
          </button>
        </div>

        {/* Version */}
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#E6F5F4", color: "#4FA18F" }}
            >
              <Info size={16} strokeWidth={2.5} />
            </div>
            <p className="text-[14px] font-semibold text-[#202124]">Version</p>
          </div>

          <span className="text-[14px] text-[#6E7976]">{version}</span>
        </div>
      </div>
    </div>
  );
}
