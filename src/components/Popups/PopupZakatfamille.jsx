import React, { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import quitter from "../../assets/quitter.svg";

import CardListZakat from "../Cards/CarteListeZakat";
import PopupDetailZakat from "./PopupdetailsZakat";
import PopupModifierZakat from "./PopupdetailsZakatModifier";
import Spinner from "../Spinner";
import VDZStatusFilter from "../Filter/VDZStatusFilter";
import { annulerAideZakat } from "@/lib/api/zakat";

const PopupZakatFamille = ({
  open,
  onClose,
  zakats, // { actives: [...], annulees: [...] }
  famille,
  isLoading = false,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
   refetchZakat,
}) => {
  const [selectedZakat, setSelectedZakat] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openModifier, setOpenModifier] = useState(false);
  const [statusFilter, setStatusFilter] = useState("active");

  const [localActives, setLocalActives] = useState(zakats?.actives ?? []);
  const [localAnnulees, setLocalAnnulees] = useState(zakats?.annulees ?? []);

  const queryClient = useQueryClient();

  const selectedFamille = selectedZakat?.famille_info || null;

  useEffect(() => {
    setLocalActives(zakats?.actives ?? []);
    setLocalAnnulees(zakats?.annulees ?? []);
  }, [zakats]);

  const localZakats = statusFilter === "active" ? localActives : localAnnulees;

  const observerTarget = useRef(null);

  useEffect(() => {
    if (!observerTarget.current || !open) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerTarget.current);

    return () => observer.disconnect();
  }, [open, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleDeleteZakat = async (zakat) => {
    try {
      const response = await annulerAideZakat(zakat.id);
      const updatedZakat = response?.data ?? response;

      setLocalActives((prev) => prev.filter((item) => item.id !== zakat.id));

      setOpenDetail(false);
      setSelectedZakat(null);

      await queryClient.invalidateQueries({ queryKey: ["zakat"] });
      await queryClient.invalidateQueries({ queryKey: ["famille"] });

      return updatedZakat;
    } catch (error) {
      console.error(
        "Erreur lors de l'annulation de la Zakat :",
        error?.response?.data || error
      );
      throw error;
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          key="zakat-overlay"
          className="fixed inset-0 z-50 bg-transparent sm:bg-black/30 flex items-start sm:items-center justify-center overflow-y-auto scrollbar-hide"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full min-h-screen sm:min-h-0 sm:max-w-[620px] sm:max-h-[90vh] overflow-y-auto scrollbar-hide bg-white rounded-none sm:rounded-[18px] border-0 sm:border sm:border-[#DCE5EC] shadow-none sm:shadow-2xl"
          >
            <div className="px-5 sm:px-6 pt-5">
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-[16px] sm:text-[17px] hover:opacity-70 transition"
              >
                <img src={quitter} alt="Fermer" className="w-5 h-5" />
                Fermer
              </button>

              <h2 className="mt-5 text-center text-[22px] sm:text-[24px] font-semibold text-[#1E1E1E]">
                Zakat
              </h2>
            </div>

            <div className="px-5 sm:px-6 mt-4">
              <VDZStatusFilter value={statusFilter} onChange={setStatusFilter} />
            </div>

            <div className="px-5 sm:px-6 pb-6 mt-5 flex-1 max-h-none sm:max-h-[420px] overflow-y-auto scrollbar-hide space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Spinner />
                </div>
              ) : localZakats.length ? (
                <>
                  {localZakats.map((item, index) => {
                    const f = item.famille_info || {};
                    const sexe =
                      f.enfant_sexe === "M"
                        ? "Fils"
                        : f.enfant_sexe === "F"
                        ? "Fille"
                        : "-";
                    return (
                      <CardListZakat
                        key={item.id || `zakat-${index}`}
                        sexe={sexe}
                        showNomCode={false}
                        zakat={`Zakat ${item.numero_zakat ?? "-"}`}
                        date={
                          item.date_versement
                            ? new Date(item.date_versement).toLocaleDateString(
                                "fr-FR"
                              )
                            : "-"
                        }
                        montant="Montant"
                        valeur={`${item.montant ?? "0"} MRU / ${
                          item.montant_eur ?? "0"
                        } EUR`}
                        onClick={() => {
                          setSelectedZakat(item);
                          setOpenDetail(true);
                        }}
                      />
                    );
                  })}

                  <div ref={observerTarget} className="h-1" />

                  {isFetchingNextPage && (
                    <div className="flex justify-center py-4">
                      <Spinner />
                    </div>
                  )}
                </>
              ) : (
                <div className="py-10 text-center text-gray-500">
                  {statusFilter === "active"
                    ? "Aucun zakat actif."
                    : "Aucun zakat annulé."}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      <PopupDetailZakat
        key="zakat-detail"
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        zakat={selectedZakat}
        famille={selectedFamille}
        onEdit={() => {
          setOpenDetail(false);
          setOpenModifier(true);
        }}
        onDelete={handleDeleteZakat}
      />

      <PopupModifierZakat
        key="zakat-modifier"
        open={openModifier}
        zakat={selectedZakat}
        famille={selectedFamille}
        onClose={() => {
          setOpenModifier(false);
          setOpenDetail(true);
        }}
      onSave={async (updatedZakat) => {
  

  // 1. Mettre à jour le détail immédiatement
  setSelectedZakat((prev) => ({
    ...prev,
    ...updatedZakat,
  }));

  // 2. Fermer le formulaire de modification
  setOpenModifier(false);

  // 3. Revenir au détail
  setOpenDetail(true);

  // 4. IMPORTANT :
  // récupérer l'ordre directement depuis le backend
  const result = await refetchZakat();

  console.log("🔄 Données récupérées du backend :", result.data);
}}
      />
    </AnimatePresence>
  );
};

export default PopupZakatFamille;
