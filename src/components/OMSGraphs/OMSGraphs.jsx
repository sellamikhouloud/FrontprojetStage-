import { useState } from "react";
import quitter from "../../assets/quitter.svg";

export default function OMSGraphs({ graphs = [] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className="
            text-[16px]
            lg:text-[18px]
            font-semibold
            text-black
          "

        >
          Courbes OMS
        </h2>

        <button
  onClick={() => graphs.length > 0 && setOpen(true)}
  className="text-[14px] text-gray-600 hover:underline"
>
  Voir tous
</button>
      </div>

      {/* Desktop */}
      <div className="hidden lg:grid grid-cols-2 gap-3">
       {graphs.slice(0, 2).map((graph) => (
  <div key={graph.id} className="w-full">
    {graph.component}
  </div>
))}
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <div className="w-full">
  {graphs[0]?.component}
</div>
      </div>

      {/* Popup */}
      {open && (
        <div
          className="
            fixed inset-0 z-[60]
            bg-transparent sm:bg-black/40
            flex items-start sm:items-center justify-center
            overflow-y-auto
          "
          onClick={() => setOpen(false)}
        >
         <div
  onClick={(e) => e.stopPropagation()}
  className="
    w-full
    min-h-screen

    sm:min-h-0
    sm:w-[952px]
    sm:max-h-[90vh]

    overflow-y-auto
    scrollbar-hide

    bg-white

    rounded-none
    sm:rounded-[20px]

    border-0
    sm:border

    p-4
    sm:p-6
  "
    style={{
            borderColor: "#4E9F8A",
          }}
>
            {/* Header */}
            <div className="mb-6">
              <button
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-[17px] text-[#202124]"
              >
                <img
                  src={quitter}
                  alt="Fermer"
                  className="w-5 h-5"
                />
                Fermer
              </button>

            
            </div>

            {/* Desktop popup */}
            <div className="hidden lg:grid grid-cols-2 gap-3 justify-items-center">
             {graphs.map((graph) => (
  <div key={graph.id} className="w-full">
    {graph.component}
  </div>
))}
            </div>

            {/* Mobile popup */}
            <div className="lg:hidden flex flex-col gap-4">
              {graphs.map((graph) => (
  <div key={graph.id}>
    {graph.component}
  </div>
))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}