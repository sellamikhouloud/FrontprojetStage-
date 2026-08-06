import { RefreshCw, Info } from "lucide-react";

/**
 * ParametresCard — bloc "Paramètres" (Synchronisation, Version).
 *
 * lastSync: string -> "Aujourd'hui à 09:42"
 * syncStatus: "synchronise" | "en_cours" | "erreur"
 * version: string -> "1.0.0"
 */
export default function ParametresCard({
  lastSync,
  syncStatus = "synchronise",
  version,
}) {
  const statusConfig = {
    synchronise: { label: "Synchronisé", color: "#22C55E", bg: "#E8F7EF", border: "#22C55E" },
    en_cours: { label: "En cours", color: "#F59E0B", bg: "#FFF4D8", border: "#F59E0B" },
    erreur: { label: "Erreur", color: "#EF4444", bg: "#FDECEC", border: "#EF4444" },
  };
  const status = statusConfig[syncStatus] || statusConfig.synchronise;

  return (
    <div>
      <p className="text-[15px] font-bold text-[#202124] mb-3">Paramètres</p>

      <div
        className="rounded-[15px] border border-[#E5E7EB] overflow-hidden"
        style={{ backgroundColor: "#F8FBFC" }}
      >
        {/* Synchronisation */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#E6F5F4", color: "#4FA18F" }}
            >
              <RefreshCw size={16} strokeWidth={2.5} />
            </div>

            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-[#202124]">Synchronisation</p>
              {lastSync && (
                <p className="text-[12px] text-[#6E7976] truncate">
                  Dernière synchronisation : {lastSync}
                </p>
              )}
            </div>
          </div>

          <div
            className="rounded-full border px-3 py-[4px] shrink-0 whitespace-nowrap"
            style={{ backgroundColor: status.bg, borderColor: status.border, color: status.color }}
          >
            <span className="text-[12px] font-bold">{status.label}</span>
          </div>
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