import { HelpCircle, FileText, ShieldCheck, ChevronRight } from "lucide-react";

/**
 * AssistanceCard — bloc "Assistance" (Centre d'aide, Conditions d'utilisation, Politique de confidentialité).
 *
 * onCentreAide / onConditions / onPolitique : callbacks optionnels au clic sur chaque ligne
 */
export default function AssistanceCard({ onCentreAide, onConditions, onPolitique }) {
  const items = [
    { icon: HelpCircle, label: "Centre d'aide", onClick: onCentreAide },
    { icon: FileText, label: "Conditions d'utilisation", onClick: onConditions },
    { icon: ShieldCheck, label: "Politique de confidentialité", onClick: onPolitique },
  ];

  return (
    <div className="mt-6">
      <p className="text-[15px] font-bold text-[#202124] mb-3">Assistance</p>

      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.onClick}
              className="
                flex items-center justify-between gap-3
                rounded-[15px]
                border border-[#E5E7EB]
                px-4 py-3
              "
              style={{ backgroundColor: "#F8FBFC" }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#E6F5F4", color: "#4FA18F" }}
                >
                  <Icon size={16} strokeWidth={2.5} />
                </div>
                <span className="text-[14px] font-semibold text-[#202124] truncate">
                  {item.label}
                </span>
              </div>

              <ChevronRight size={18} className="text-[#6E7976] shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}