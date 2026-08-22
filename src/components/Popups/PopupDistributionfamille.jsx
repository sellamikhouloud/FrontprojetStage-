import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import quitter from "../../assets/quitter.svg";
import { useNavigate } from "react-router-dom";
import CardPopupDistribution from "../Cards/cardDistribution";
import PopupDetailDistribution from "./PopupdetailsDistributions";
import VDZStatusFilter from "../Filter/VDZStatusFilter";
import { annulerDistribution } from "@/lib/api/distributions";

import Spinner from "../Spinner";

const PopupDistributionfamille = ({
  open,
  onClose,
  Distribution, // { actives: [...], annulees: [...] }
  famille,
  isLoading = false,
 
  onDistributionAnnulee,
}) => {
  const navigate = useNavigate();
  const [selectedDistribution, setSelectedDistribution] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [statusFilter, setStatusFilter] = useState("active");

  const distributionsActives = Distribution?.actives ?? [];
  const distributionsAnnulees = Distribution?.annulees ?? [];

  const distributionsBrutes =
    statusFilter === "active" ? distributionsActives : distributionsAnnulees;

  const distributionsTriees = useMemo(() => {
    return distributionsBrutes.map((item, index) => ({
      ...item,
      numeroDistribution: index + 1,
   
      annulee: item.annulee ?? statusFilter !== "active",
    }));
  }, [distributionsBrutes, statusFilter]);

  const mapDistributionToEditData = (distribution) => {
    const produits = distribution?.produits || [];

    const products = produits
      .filter(
        (p) =>
          p.produit?.type_produit !== "lait" &&
          !p.produit?.nom?.toLowerCase().includes("lait")
      )
      .map((p, index) => ({
        id: p.produit?.id ?? index + 1,
        title: p.produit?.nom ?? "-",
        quantity: Number(p.quantite ?? 0),
        unit: p.produit?.unite ?? "",
        maxQuantity: Number(p.quantite ?? 0),
        icon: null,
      }));

    const produitLait = produits.find(
      (p) =>
        p.produit?.type_produit === "lait" ||
        p.produit?.nom?.toLowerCase().includes("lait")
    );

    const boxes = produitLait ? Number(produitLait.quantite ?? 0) : 0;

    const grammage = produitLait?.produit?.grammage_boite
      ? String(produitLait.produit.grammage_boite)
      : "";

    const laitType = produitLait?.produit?.nom
      ? produitLait.produit.nom.replace(/\s*\d+\s*g\b/i, "").trim()
      : null;

    return {
      products,
      laitType,
      grammage,
      boxes,
    };
  };

  const handleAnnulerDistribution = async (distribution) => {
    try {
      await annulerDistribution(distribution.id);

    
      setOpenDetail(false);
      setSelectedDistribution(null);

    
      onDistributionAnnulee?.(distribution);
    } catch (error) {
      console.error(
        "Erreur lors de l'annulation de la distribution :",
        error?.response?.data || error
      );
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          key="distribution-overlay"
          className="
            fixed inset-0 z-50
            bg-transparent sm:bg-black/30
            flex items-start sm:items-center
            justify-center
            overflow-y-auto
            scrollbar-hide
          "
          onClick={onClose}
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
              sm:max-w-[620px]

              bg-white

              rounded-none
              sm:rounded-[18px]

              border-0
              sm:border
              sm:border-[#DCE5EC]

              shadow-none
              sm:shadow-2xl

              overflow-y-auto
              scrollbar-hide
            "
          >
            {/* Header */}
            <div className="px-5 sm:px-6 pt-5">
              <button
                onClick={onClose}
                className="
                  flex items-center gap-2
                  text-[16px] sm:text-[17px]
                  hover:opacity-70
                  transition
                "
              >
                <img src={quitter} alt="Fermer" className="w-5 h-5" />
                Fermer
              </button>

              <h2
                className="
                  mt-5
                  text-center
                  text-[22px] sm:text-[24px]
                  font-semibold
                  text-[#1E1E1E]
                "
              >
                Distributions
              </h2>
            </div>

            {/* Filtre statut */}
            <div className="px-5 sm:px-6 mt-4">
              <VDZStatusFilter value={statusFilter} onChange={setStatusFilter} />
            </div>

            {/* Cartes */}
            <div
              className="
                px-5 sm:px-6
                pb-6
                mt-5
                space-y-4

                sm:max-h-[420px]
                sm:overflow-y-auto
                scrollbar-hide
              "
            >
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Spinner />
                </div>
              ) : distributionsTriees.length ? (
                distributionsTriees.map((item, index) => (
                  <CardPopupDistribution
                    key={item.id || `distribution-${index}`}
                    distribution={`Distribution ${item.numeroDistribution}`}
                    date={
                      item.date_distribution
                        ? new Date(item.date_distribution).toLocaleDateString(
                            "fr-FR"
                          )
                        : "-"
                    }
                    produits={(item.produits || []).map((prod) => ({
                      nom: prod.produit?.nom ?? "-",
                      quantite: `${Number(prod.quantite ?? 0)} ${
                        prod.produit?.unite === "boite"
                          ? "boîtes"
                          : prod.produit?.unite ?? ""
                      }`.trim(),
                    }))}
                    onClick={() => {
                      setSelectedDistribution(item);
                      setOpenDetail(true);
                    }}
                  />
                ))
              ) : (
                <div className="py-10 text-center text-gray-500">
                  {statusFilter === "active"
                    ? "Aucune distribution active."
                    : "Aucune distribution annulée."}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      <PopupDetailDistribution
        key="distribution-detail"
        open={openDetail}
        onClose={() => {
          setOpenDetail(false);
          setSelectedDistribution(null);
        }}
        distribution={selectedDistribution}
        famille={famille}
        onDelete={handleAnnulerDistribution}
        onEdit={(distribution) => {
          setOpenDetail(false);

          const { products, laitType, grammage, boxes } =
            mapDistributionToEditData(distribution);

          navigate("/ajout-distribution", {
            state: {
              distributionAModifier: {
                ...distribution,

                selectedFamille: {
                  id: famille?.id,

                  mere: famille?.mere
                    ? `${famille.mere.nom || ""} ${
                        famille.mere.prenom || ""
                      }`.trim()
                    : "",

                  enfant: famille?.nourrisson?.prenom || "",

                  sexe:
                    famille?.nourrisson?.sexe === "M"
                      ? "Fils"
                      : famille?.nourrisson?.sexe === "F"
                      ? "Fille"
                      : "-",

                  region: famille?.mere?.village?.nom,

                  naissance: famille?.nourrisson?.date_naissance,

                  code: famille?.id,

                  badges: [],
                },

                products,
                laitType,
                grammage,
                boxes,

                confirmed: true,
              },
            },
          });
        }}
      />
    </AnimatePresence>
  );
};

export default PopupDistributionfamille;
