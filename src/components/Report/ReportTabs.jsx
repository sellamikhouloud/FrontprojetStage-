import { useNavigate, useLocation } from "react-router-dom";

const tabs = [
  { label: "Rapport mensuel de nutrition", path: "/rapports" },
  { label: "Bilan donateurs", path: "/rapports/bilan-donateurs" },
  { label: "Rapport annuel", path: "/rapports/annuel" },
];

const ReportTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-full bg-[#F8FBFC] rounded-[15px] p-[10px]">
      <div
        className="
          flex
          items-center
          gap-5
          overflow-x-auto
          md:overflow-x-visible
          scrollbar-hide
        "
      >
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`
                flex-none
                md:flex-1

                min-w-max
                md:min-w-0

                px-6
                md:px-0

                h-[44px]
                rounded-[15px]

                flex
                items-center
                justify-center

                text-[18px]
                font-medium

                whitespace-nowrap

                transition-all
                duration-300

                ${
                  isActive
                    ? "bg-[#7BC8C4] text-white"
                    : "bg-transparent text-[#202124] hover:bg-white"
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ReportTabs;

