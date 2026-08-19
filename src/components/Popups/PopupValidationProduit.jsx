import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import SuccessBanner from "./SuccessBanner";
import PageHeader from "../Navigation,Pageheader/PageHeader";
import Button from "../Button/Button";
import trash from "../../assets/Delete.svg";
import quitter from "../../assets/quitter.svg";

export default function PopupValidationProduit({
  open,
  produit, 
  onClose,
  onValider, 
  onRefuser, // (data) => void  — data = { id }
}) {
  const [quantite, setQuantite] = useState("");
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");

  // Réinitialise le champ à chaque ouverture avec un nouveau produit
  useEffect(() => {
    if (open && produit) {
      setQuantite("");
    }
  }, [open, produit]);

  if (!open || !produit) return null;

  const handleQuantiteChange = (value) => {
    // n'autorise que des chiffres
    if (/^\d*$/.test(value)) {
      setQuantite(value);
    }
  };

  const handleClose = () => {
    setQuantite("");
    onClose?.();
  };

      const handleValider = async () => {
    // Si l'admin n'a pas touché le champ, on garde la valeur actuelle du produit
    const quantiteFinale =
      quantite === "" ? Number(produit.quantite) : Number(quantite);

    const data = {
      id: produit.id,
      quantite: quantiteFinale,
    };
    try {
      await onValider?.(data);
      setBannerMessage("Le produit a été validé avec succès.");
      setShowBanner(true);
      setTimeout(() => {
        setShowBanner(false);
        handleClose();
      }, 1500);
    } catch (err) {
      console.error("Erreur validation:", err);
      // pas de bannière succès, le popup reste ouvert pour réessayer
    }
  };

  const handleRefuser = () => {
    const data = { id: produit.id };

    setBannerMessage("Le produit a été refusé.");
    setShowBanner(true);

    setTimeout(() => {
      setShowBanner(false);
      onRefuser?.(data);
      handleClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div
        className="
          fixed inset-0 z-[70]
          bg-transparent sm:bg-black/40

          flex items-start sm:items-center
          justify-center

          overflow-y-auto
        "
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="
            w-full
            min-h-screen

            sm:min-h-0
            sm:w-[560px]
            sm:max-h-[90vh]

            overflow-y-auto
            scrollbar-hide

            bg-white

            rounded-none
            sm:rounded-[20px]

            border-0
            sm:border

            p-4
            sm:px-[30px]
            sm:py-[26px]
          "
          style={{
            borderColor: "#4E9F8A",
          }}
        >
       

           {/* Header */}
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
      
                        font-bold
                        text-[#000000]
                      "
                    >
                      Validation de Produit
                    </h2>
                  </div>

          {/* Bloc produit : nom + date + enregistré par */}
          <div
            className="
              mt-5
              rounded-[15px]
              border
              border-[#E5E7EB]
              bg-[#F9FAFB]
              px-4
              py-3
            "
          >
            <div className="flex items-center justify-between">
              <p className="text-[18px] font-bold text-[#000000]">
                {produit.nom}
              </p>
              {produit.date && (
                <p className="text-[14px] font-medium text-[#000000]">
                  {produit.date}
                </p>
              )}
            </div>

            {produit.enregistrePar && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[14px] font-semibold text-[#4E9F8A]">
                  enregistré par
                </span>
                <span className="text-[14px] text-[#000000]">
                  {produit.enregistrePar}
                </span>
              </div>
            )}
          </div>

          {/* Quantité — modifiable, optionnelle (défaut envoyé au backend : 0) */}
          <div className="mt-5">
            <label className="font-semibold text-[16px] text-black">
              Quantité
            </label>

            <div className="relative mt-2">
              <input
                type="text"
                inputMode="numeric"
                value={quantite}
                onChange={(e) => handleQuantiteChange(e.target.value)}
                placeholder={produit.quantite?.toString() || "0"}
                className="
                  w-full
                  h-[45px]
                  border
                  border-[#4E9F8A]
                  rounded-[15px]
                  px-4
                  pr-16
                  text-[16px]
                  font-semibold
                  outline-none
                  focus:border-[#4E9F8A]
                "
              />

              {produit.unite && (
                <span
                  className="
                    absolute
                    right-5
                    top-1/2
                    -translate-y-1/2
                    text-[#4E9F8A]
                    font-bold
                    text-[16px]
                  "
                >
                  {produit.unite}
                </span>
              )}
            </div>
          </div>

          {/* Banner succès */}
          {showBanner && (
            <div className="mt-5">
              <SuccessBanner message={bannerMessage} />
            </div>
          )}

          {/* Boutons — via Button component */}
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Button
                title="Supprimer"
                variant="supprimer"
                icon={trash}
                iconPosition="left"
                fullWidth
                noPadding
                onClick={handleRefuser}
              />
            </div>

            <div className="flex-1">
              <Button
                title="Valider"
                variant="success"
                fullWidth
                noPadding
                onClick={handleValider}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
