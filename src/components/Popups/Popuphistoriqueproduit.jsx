import { Plus, Minus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import quitter from "../../assets/quitter.svg";

/**
 * Popup Historique d'un produit — liste des mouvements +/- de quantité.
 *
 * historique: [
 *   { id, type: "ajout" | "retrait", quantite, unite, par, date }
 * ]
 */
export default function PopupHistoriqueProduit({
  open,
  produit, // { nom, unite }
  historique = [],
  onClose,
}) {
  if (!produit) return null;

  return (
    <AnimatePresence>
      {open && (
        <div
          className="
            fixed inset-0 z-[70]

            bg-transparent
            sm:bg-black/40

            flex
            items-start
            sm:items-center
            justify-center

            overflow-y-auto
          "
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="
              w-full

              min-h-screen

              sm:min-h-0
              sm:w-[480px]
              sm:max-h-[85vh]

              overflow-hidden

              bg-white

              rounded-none
              sm:rounded-[18px]

              border-0
              sm:border
              sm:border-[#DCE5EC]

              shadow-none
              sm:shadow-2xl

              p-4
              sm:p-6

              flex
              flex-col
            "
          >
            {/* Header — fixe, ne scroll pas */}
            <div className="mb-5 shrink-0">
              <button
                onClick={onClose}
                className="
                  flex
                  items-center
                  gap-2

                  text-[16px]
                  sm:text-[17px]

                  hover:opacity-70
                  transition
                "
              >
                <img
                  src={quitter}
                  alt="Fermer"
                  className="w-5 h-5"
                />
                Fermer
              </button>

              <h2
                className="
                  mt-5
                  text-center

                  text-[22px]
                  sm:text-[24px]

                  font-semibold
                  text-[#1E1E1E]
                "
              >
                Historique — {produit.nom}
              </h2>
            </div>

            {/* Liste des mouvements — seule cette partie scroll */}
            <div
              className="
                space-y-3

                flex-1
                min-h-0

                sm:max-h-[55vh]
                overflow-y-auto

                scrollbar-hide

                pb-2
                pr-1
              "
            >
              {historique.length === 0 ? (
                <p className="text-center text-[14px] text-[#6B7280] py-10">
                  Aucun mouvement enregistré pour ce produit.
                </p>
              ) : (
                historique.map((mvt) => {
                  const isAjout = mvt.type === "ajout";

                  return (
                    <div
                      key={mvt.id}
                      className="
                        flex
                        items-center
                        justify-between
                        gap-3

                        rounded-[15px]
                        border
                        border-[#E5E7EB]
                        bg-[#F9FAFB]

                        px-4
                        py-3
                      "
                    >
                      {/* Icône +/- */}
                      <div
                        className="
                          w-9 h-9
                          shrink-0
                          rounded-full
                          flex
                          items-center
                          justify-center
                        "
                        style={{
                          backgroundColor: isAjout ? "#DCFCE7" : "#FEE2E2",
                          color: isAjout ? "#22C55E" : "#EF4444",
                        }}
                      >
                        {isAjout ? (
                          <Plus size={18} strokeWidth={3} />
                        ) : (
                          <Minus size={18} strokeWidth={3} />
                        )}
                      </div>

                      {/* Détails */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-[#202124]">
                          {mvt.par}
                        </p>
                        <p className="text-[12px] text-[#6B7280]">
                          {mvt.date}
                        </p>
                      </div>

                      {/* Quantité */}
                      <p
                        className="text-[15px] font-bold shrink-0 flex items-center gap-0.5"
                        style={{ color: isAjout ? "#22C55E" : "#EF4444" }}
                      >
                        {isAjout ? (
                          <Plus size={14} strokeWidth={3} />
                        ) : (
                          <Minus size={14} strokeWidth={3} />
                        )}
                        {mvt.quantite} {mvt.unite || produit.unite}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}