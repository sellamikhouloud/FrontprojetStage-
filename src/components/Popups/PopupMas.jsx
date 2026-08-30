// import React from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import quitter from "../../assets/quitter.svg";
// import CardPopup from "../Cards/Card2";

// const PopupMas = ({
//   open,
//   onClose,
//   familleMas = [],
// }) => {
//   return (
//     <AnimatePresence>
//       {open && (
//         <div
//           className="
//             fixed
//             inset-0
//             z-50

//             bg-[#9A9A9A]/60

//             flex
//             items-start
//             sm:items-center

//             justify-center

//             overflow-y-auto
//           "
//         >
//           <motion.div
//             initial={{ opacity: 0, scale: 0.96 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.96 }}
//             transition={{ duration: 0.2 }}
//             onClick={(e) => e.stopPropagation()}
//             className="
//               w-full

//               min-h-screen

//               sm:min-h-0
//               sm:w-[760px]
//               sm:max-h-[90vh]

//               overflow-y-auto

//               bg-white

//               rounded-none
//               sm:rounded-[18px]

//               border-0
//               sm:border
//               sm:border-[#DCE5EC]

//               shadow-none
//               sm:shadow-2xl
//             "
//           >
//             {/* Header */}
//             <div className="px-5 sm:px-6 pt-5 pb-3">
//               <button
//                 onClick={onClose}
//                 className="
//                   flex
//                   items-center
//                   gap-2
//                   text-[16px]
//                   sm:text-[18px]
//                   font-medium
//                   transition
//                 "
//               >
//                 <img
//                   src={quitter}
//                   alt="Fermer"
//                   className="w-5 h-5"
//                 />
//                 Fermer
//               </button>

//               <h2
//                 className="
//                   mt-5
//                   text-center
//                   text-[22px]
//                   sm:text-[28px]
//                   font-semibold
//                   text-[#1E1E1E]
//                 "
//               >
//                 Malnutrition Aiguë Sévère (MAS)
//               </h2>
//             </div>

//             {/* Liste */}
//             <div
//               className="
//                 px-5
//                 sm:px-6

//                 pb-6

//                 mt-4

//                 flex-1

//                 max-h-none
//                 sm:max-h-[60vh]

//                 overflow-y-auto

//                 space-y-4
//               "
//             >
//               {familleMas.length > 0 ? (
//                 familleMas.map((item) => (
//                   <CardPopup
//                     key={item.id}
//                     sexe={item.sexe}
//                     enfant={item.enfant}
//                     region={item.region}
//                     naissance={item.naissance}
//                     code={item.code}
//                     badges={item.badges}
//                     onClick={() => console.log(item)}
//                   />
//                 ))
//               ) : (
//                 <div className="py-10 text-center text-gray-500 text-[16px]">
//                   Aucune alerte MAS.
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default PopupMas;

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import quitter from "../../assets/quitter.svg";
import CardPopup from "../Cards/Card2";

import { getFamille } from "@/lib/api/familles";

const PopupMas = ({
  open,
  onClose,
  familleMas = [],
}) => {
  const [familles, setFamilles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setFamilles([]);
      return;
    }

    if (!Array.isArray(familleMas) || familleMas.length === 0) {
      setFamilles([]);
      return;
    }

    const loadFamilles = async () => {
      setLoading(true);

      try {
        /**
         * Le dashboard peut contenir plusieurs alertes
         * pour la même famille.
         *
         * On récupère uniquement les IDs uniques.
         */
        const uniqueIds = [
          ...new Set(
            familleMas
              .map((alert) => alert?.famille)
              .filter(Boolean)
          ),
        ];

        const responses = await Promise.all(
          uniqueIds.map(async (id) => {
            try {
              const response = await getFamille(id);

              return response.data;
            } catch (error) {
              console.error(
                `Erreur lors du chargement de la famille ${id}:`,
                error
              );

              return null;
            }
          })
        );

        setFamilles(
          responses.filter(Boolean)
        );
      } catch (error) {
        console.error(
          "Erreur lors du chargement des familles MAS:",
          error
        );

        setFamilles([]);
      } finally {
        setLoading(false);
      }
    };

    loadFamilles();
  }, [open, familleMas]);

  /**
   * Transforme une famille API en props
   * utilisables par CardPopup.
   */
  const formatFamilleForCard = (famille) => {
    const mere = famille?.mere || {};
    const nourrisson = famille?.nourrisson || {};

    /**
     * Sexe
     */
    let sexe = "-";

    if (nourrisson.sexe === "M") {
      sexe = "Garçon";
    } else if (nourrisson.sexe === "F") {
      sexe = "Fille";
    }

    /**
     * Village
     */
    let region = "-";

    if (
      mere.village &&
      typeof mere.village === "object"
    ) {
      region = mere.village.nom || "-";
    } else if (mere.village) {
      region = String(mere.village);
    }

    /**
     * Nom complet de la mère
     */
    const nomMere = [
      mere.nom,
      mere.prenom,
    ]
      .filter(Boolean)
      .join(" ");

    /**
     * Badges
     */
    const badges = [];

    /**
     * MAS bébé
     */
    if (
      famille.statut_nutritionnel_bebe === "mas"
    ) {
      badges.push({
        type: "mas",
        text: "MAS",
      });
    }

    /**
     * Statut nutritionnel mère
     */
    if (famille.statut_nutritionnel_mere) {
      badges.push({
        type: famille.statut_nutritionnel_mere,
        text: famille.statut_nutritionnel_mere,
      });
    }

    return {
      id: famille.id,

      sexe,

      mere: nomMere || "-",

      enfant:
        nourrisson.prenom || "-",

      region,

      naissance:
        nourrisson.date_naissance || "-",

      code:
        famille.id || "-",

      badges,
    };
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="
            fixed
            inset-0
            z-50
            bg-[#9A9A9A]/60
            flex
            items-start
            sm:items-center
            justify-center
            overflow-y-auto
          "
          onClick={onClose}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
            }}
            transition={{
              duration: 0.2,
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
            className="
              w-full
              min-h-screen
              sm:min-h-0
              sm:w-[760px]
              sm:max-h-[90vh]
              overflow-y-auto
              bg-white
              rounded-none
              sm:rounded-[18px]
              border-0
              sm:border
              sm:border-[#DCE5EC]
              shadow-none
              sm:shadow-2xl
            "
          >
            {/* =========================
                Header
                ========================= */}
            <div className="px-5 sm:px-6 pt-5 pb-3">
              <button
                onClick={onClose}
                className="
                  flex
                  items-center
                  gap-2
                  text-[16px]
                  sm:text-[18px]
                  font-medium
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
                  sm:text-[28px]
                  font-semibold
                  text-[#1E1E1E]
                "
              >
                Malnutrition Aiguë Sévère (MAS)
              </h2>
            </div>

            {/* =========================
                Liste
                ========================= */}
            <div
              className="
                px-5
                sm:px-6
                pb-6
                mt-4
                flex-1
                max-h-none
                sm:max-h-[60vh]
                overflow-y-auto
                space-y-4
              "
            >
              {loading ? (
                <div
                  className="
                    py-10
                    text-center
                    text-gray-500
                    text-[16px]
                  "
                >
                  Chargement des familles...
                </div>
              ) : familles.length > 0 ? (
                familles.map((famille) => {
                  const cardData =
                    formatFamilleForCard(
                      famille
                    );

                  return (
                    <CardPopup
                      key={famille.id}
                      sexe={cardData.sexe}
                      mere={cardData.mere}
                      enfant={cardData.enfant}
                      region={cardData.region}
                      naissance={cardData.naissance}
                      code={cardData.code}
                      badges={cardData.badges}
                      onClick={() => {
                        console.log(
                          "Famille MAS sélectionnée:",
                          famille
                        );
                      }}
                    />
                  );
                })
              ) : (
                <div
                  className="
                    py-10
                    text-center
                    text-gray-500
                    text-[16px]
                  "
                >
                  Aucune alerte MAS.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PopupMas;