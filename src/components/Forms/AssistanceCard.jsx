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

      <div className="rounded-[15px] overflow-hidden bg-[#F8FBFC] border border-[#BEC9C5]/30">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isLast = index === items.length - 1;

          return (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`
                w-full
                flex items-center justify-between gap-3
                px-4 py-3
                ${!isLast ? "border-b border-[#BEC9C5]/30" : ""}
              `}
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
