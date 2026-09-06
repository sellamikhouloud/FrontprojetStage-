import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import quitter from "../../assets/quitter.svg";
import CardPopup from "../Cards/Card2";

import { getFamille } from "@/lib/api/familles";

const PopupRetard = ({
  open,
  onClose,
  familleretard = [],
}) => {
  const [familles, setFamilles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      setFamilles([]);
      return;
    }

    if (
      !Array.isArray(familleretard) ||
      familleretard.length === 0
    ) {
      setFamilles([]);
      return;
    }

    const loadFamilles = async () => {
      setLoading(true);

      try {
        /*
         * Le dashboard nous donne les familles
         * concernées par un retard.
         *
         * Exemple :
         *
         * [
         *   {
         *     famille: "GDK-2026-008",
         *     ...
         *   }
         * ]
         */

        const uniqueIds = [
          ...new Set(
            familleretard
              .map((item) => item?.famille)
              .filter(Boolean)
          ),
        ];

        const results = await Promise.all(
          uniqueIds.map(async (familleId) => {
            try {
              const response =
                await getFamille(familleId);

              return response.data;
            } catch (error) {
              console.error(
                `Erreur lors du chargement de la famille ${familleId}:`,
                error
              );

              return null;
            }
          })
        );

        setFamilles(
          results.filter(Boolean)
        );
      } catch (error) {
        console.error(
          "Erreur lors du chargement des familles en retard:",
          error
        );

        setFamilles([]);
      } finally {
        setLoading(false);
      }
    };

    loadFamilles();
  }, [open, familleretard]);

  /**
   * Transforme une famille venant de l'API
   * en données compatibles avec CardPopup.
   */
  const formatFamilleForCard = (famille) => {
    const mere = famille?.mere || {};
    const nourrisson =
      famille?.nourrisson || {};

    /* =========================
       Sexe
       ========================= */

    let sexe = "-";

    if (nourrisson.sexe === "M") {
      sexe = "Garçon";
    } else if (nourrisson.sexe === "F") {
      sexe = "Fille";
    }

    /* =========================
       Nom mère
       ========================= */

    const nomMere = [
      mere.nom,
      mere.prenom,
    ]
      .filter(Boolean)
      .join(" ");

    /* =========================
       Village
       ========================= */

    let region = "-";

    if (
      mere.village &&
      typeof mere.village === "object"
    ) {
      region = mere.village.nom || "-";
    } else if (mere.village) {
      region = String(mere.village);
    }

    /* =========================
       Badges
       ========================= */

    const badges = [];
    /*
     * STATUT NUTRITIONNEL DU BÉBÉ
     */
    if (famille.statut_nutritionnel_bebe === "normale") {
      badges.push({
        type: "mereNormal",
        text: "Nourrisson normal",
      });
    }

    if (famille.statut_nutritionnel_bebe === "mam") {
      badges.push({
        type: "mam",
        text: "MAM nourrisson",
      });
    }

    if (famille.statut_nutritionnel_bebe === "mas") {
      badges.push({
        type: "mas",
        text: "MAS nourrisson",
      });
    }

    /*
     * STATUT NUTRITIONNEL DE LA MÈRE
     */
    if (famille.statut_nutritionnel_mere === "normale") {
      badges.push({
        type: "mereNormal",
        text: "Mère normale",
      });
    }

    if (famille.statut_nutritionnel_mere === "a_risque") {
      badges.push({
        type: "risque",
        text: "Mère à risque",
      });
    }

    if (famille.statut_nutritionnel_mere === "malnutrition") {
      badges.push({
        type: "mas",
        text: "Mère malnutrie",
      });
    }

    /*
     * IMC DE LA MÈRE
     */
    if (famille.statut_imc_mere === "sous_poids") {
      badges.push({
        type: "mas",
        text: "Mère sous-poids",
      });
    }

    if (famille.statut_imc_mere === "sur_poids") {
      badges.push({
        type: "mas",
        text: "Mère en surpoids",
      });
    }

    /*
     * HÉMOGLOBINE DE LA MÈRE
     */
    if (famille.statut_hemoglobine_mere === "anemie") {
      badges.push({
        type: "mas",
        text: "Mère anémiée",
      });
    }

    return {
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
            {/* =========================
                HEADER
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
                Visites en retard
              </h2>
            </div>

            {/* =========================
                LISTE
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
                  Aucune visite en retard.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PopupRetard;