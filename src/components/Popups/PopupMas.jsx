import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import quitter from "../../assets/quitter.svg";
import CardPopup from "../Cards/Card2";
import { useNavigate } from "react-router-dom";
import { listFamilles } from "@/lib/api/familles";

const PopupMas = ({
  open,
  onClose,
  familleMas = [],
}) => {
  const [familles, setFamilles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // =========================================================
  // GET ALL FAMILLES - HANDLE DRF PAGINATION
  // =========================================================

  const fetchAllFamilles = async () => {
    let allFamilles = [];
    let page = 1;

    while (true) {
      const response = await listFamilles({ page });
      const data = response?.data;

      const pageFamilles = Array.isArray(data?.results)
        ? data.results
        : Array.isArray(data)
        ? data
        : [];

      allFamilles = [
        ...allFamilles,
        ...pageFamilles,
      ];

      // DRF pagination
      if (!data?.next) {
        break;
      }

      page += 1;
    }

    return allFamilles;
  };

  // =========================================================
  // LOAD MAS FAMILLES
  // =========================================================

  useEffect(() => {
    if (!open) {
      setFamilles([]);
      return;
    }

    if (
      !Array.isArray(familleMas) ||
      familleMas.length === 0
    ) {
      setFamilles([]);
      return;
    }

    const loadFamilles = async () => {
      setLoading(true);

      try {
        // =====================================================
        // GET UNIQUE FAMILY IDS FROM ALERTS
        // =====================================================

        const uniqueIds = [
          ...new Set(
            familleMas
              .map((alert) => alert?.famille)
              .filter(Boolean)
          ),
        ];

        // =====================================================
        // GET ALL FAMILLES FROM ALL PAGES
        // =====================================================

        const allFamilles = await fetchAllFamilles();

        // =====================================================
        // KEEP ONLY FAMILLES PRESENT IN MAS ALERTS
        // =====================================================

        const masFamilles = allFamilles.filter((famille) =>
          uniqueIds.includes(famille.id)
        );

        setFamilles(masFamilles);
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

  // =========================================================
  // FORMAT FAMILLE FOR CARD
  // =========================================================

  const formatFamilleForCard = (famille) => {
    const mere = famille?.mere || {};
    const nourrisson = famille?.nourrisson || {};

    // =======================================================
    // SEXE
    // =======================================================

    let sexe = "-";

    if (nourrisson.sexe === "M") {
      sexe = "Garçon";
    } else if (nourrisson.sexe === "F") {
      sexe = "Fille";
    }

    // =======================================================
    // VILLAGE
    // =======================================================

    let region = "-";

    if (
      mere.village &&
      typeof mere.village === "object"
    ) {
      region = mere.village.nom || "-";
    } else if (mere.village) {
      region = String(mere.village);
    }

    // =======================================================
    // NOM COMPLET MERE
    // =======================================================

    const nomMere = [
      mere.nom,
      mere.prenom,
    ]
      .filter(Boolean)
      .join(" ");

    // =======================================================
    // BADGES
    // =======================================================

    const badges = [];

    // MAS bébé
    if (
      famille.statut_nutritionnel_bebe === "mas"
    ) {
      badges.push({
        type: "mas",
        text: "MAS nourrisson",
      });
    }

    // Statut nutritionnel mère
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
      enfant: nourrisson.prenom || "-",
      region,
      naissance:
        nourrisson.date_naissance || "-",
      code: famille.id || "-",
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
            {/* Header */}

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

            {/* Liste */}

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
                    formatFamilleForCard(famille);

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
                        onClose();
                        navigate(`/famille/${famille.id}`);
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
