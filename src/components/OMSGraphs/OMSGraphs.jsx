import { useState } from "react";
import quitter from "../../assets/quitter.svg";

export default function OMSGraphs({ graphs = [] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] lg:text-[18px] font-semibold text-black">
          Courbes de croissance 
        </h2>

        <button
          onClick={() => graphs.length > 0 && setOpen(true)}
          className="text-[14px] text-gray-600 hover:underline"
        >
          Voir tous
        </button>
      </div>

      {/* Affichage sur la page principale : 2 courbes côte à côte */}
      <div className="hidden lg:grid grid-cols-2 gap-4">
        {graphs.slice(0, 2).map((graph) => (
          <div key={graph.id} className="w-full min-w-0">
            {graph.component}
          </div>
        ))}
      </div>

      {/* Affichage mobile : 1 seule courbe visible */}
      <div className="lg:hidden">
        <div className="w-full min-w-0">{graphs[0]?.component}</div>
      </div>

      {/* MOBILE : page plein écran (pas de popup) */}
      {open && (
        <div
          className="
            lg:hidden
            fixed inset-0 z-[60]
            bg-white
            overflow-y-auto
            no-scrollbar
          "
        >
          {/* Header fixe type "page" */}
          <div className="sticky top-0 bg-white z-10 flex items-center gap-2 px-4 py-4 border-b border-gray-100">
            <button
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-[15px] font-medium text-gray-700 hover:text-black"
            >
              <img src={quitter} alt="Fermer" className="w-4 h-4" />
              Retour
            </button>
            <h2 className="text-[16px] font-semibold text-black">
              Courbes de croissance
            </h2>
          </div>

          <div className="flex flex-col gap-5 p-4">
            {graphs.map((graph) => (
              <div key={graph.id} className="w-full min-w-0">
                {graph.component}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DESKTOP : modale classique avec overlay */}
      {open && (
        <div
          className="
            hidden
            lg:flex
            fixed inset-0 z-[60]
            bg-black/40
            items-center justify-center p-4
          "
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              w-full
              sm:w-[95vw]
              max-w-[1200px]
              max-h-[92vh]
              bg-white
              rounded-[20px]
              p-6
              overflow-y-auto
              no-scrollbar
              border
              border-[#4E9F8A]
            "
          >
            <div className="mb-4 flex justify-between items-center">
              <button
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-[15px] font-medium text-gray-700 hover:text-black"
              >
                <img src={quitter} alt="Fermer" className="w-4 h-4" />
                Fermer
              </button>
            </div>

            <div className="flex flex-col gap-5">
              {graphs.map((graph) => (
                <div key={graph.id} className="w-full min-w-0">
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
