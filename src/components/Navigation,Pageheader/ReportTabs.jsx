import { useState } from "react";

const tabs = [
  "Rapport mensuel de nutrition",
  "Bilan donateurs",
  "Rapport annuel",
];

const ReportTabs = () => {
  const [activeTab, setActiveTab] = useState(0);

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
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
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
                activeTab === index
                  ? "bg-[#7BC8C4] text-white"
                  : "bg-transparent text-[#202124] hover:bg-white"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReportTabs;