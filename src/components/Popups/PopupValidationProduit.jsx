import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import SuccessBanner from "./SuccessBanner";

import Button from "../Button/Button";

import quitter from "../../assets/quitter.svg";
import ErrorMessage from "../Forms/ErrorMessage";
import BackendErrorMessage from "../Forms/BackendErrorMessage";

const KNOWN_FIELDS = ["stock_initial"];

const FIELD_KEY_MAP = {
  stock_initial: "quantite",
};

function parseBackendErrors(data, status) {
  if (!data) return { fieldErrors: {}, generalMessage: null };

  if (typeof data === "string" && /<html[\s>]/i.test(data)) {
    if (status === 404) {
      return {
        fieldErrors: {},
        generalMessage: "Le service demandé est introuvable. Veuillez réessayer plus tard ou contacter le support.",
      };
    }
    return {
      fieldErrors: {},
      generalMessage: "Une erreur inattendue est survenue côté serveur. Veuillez réessayer plus tard.",
    };
  }

  if (typeof data === "string") {
    return { fieldErrors: {}, generalMessage: data };
  }

  if (Array.isArray(data)) {
    const messages = data.filter((m) => typeof m === "string");
    return { fieldErrors: {}, generalMessage: messages.join(" — ") || null };
  }

  if (data.detail) {
    return { fieldErrors: {}, generalMessage: data.detail };
  }

  if (typeof data.code === "string" && typeof data.message === "string") {
    return { fieldErrors: {}, generalMessage: data.message };
  }

  if (typeof data === "object") {
    const fieldErrors = {};
    const generalMessages = [];

    Object.entries(data).forEach(([field, messages]) => {
      const text = Array.isArray(messages) ? messages.join(" ") : String(messages);

      if (KNOWN_FIELDS.includes(field)) {
        fieldErrors[field] = text;
      } else if (field === "non_field_errors") {
        generalMessages.push(text);
      } else {
        generalMessages.push(`${field} : ${text}`);
      }
    });

    return {
      fieldErrors,
      generalMessage: generalMessages.length ? generalMessages.join(" — ") : null,
    };
  }

  return { fieldErrors: {}, generalMessage: "Une erreur est survenue." };
}

export default function PopupValidationProduit({
  open,
  produit, 
  onClose,
  onValider, 
  
}) {
  const [quantite, setQuantite] = useState("");
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");
  


const [saving, setSaving] = useState(false);
const [backendFieldErrors, setBackendFieldErrors] = useState({});
const [backendGeneralError, setBackendGeneralError] = useState(null);

  // Réinitialise le champ à chaque ouverture avec un nouveau produit
   useEffect(() => {
  if (open && produit) {
    setQuantite("");
    setBackendFieldErrors({});
    setBackendGeneralError(null);
    setSaving(false);
  }
}, [open, produit]);

  if (!open || !produit) return null;
  
 


 const handleQuantiteChange = (value) => {
  if (/^\d*$/.test(value)) {
    setQuantite(value);
    if (backendFieldErrors.quantite) {
      setBackendFieldErrors((prev) => ({ ...prev, quantite: null }));
    }
  }
};

  const handleClose = () => {
  setQuantite("");
  setBackendFieldErrors({});
  setBackendGeneralError(null);
  onClose?.();
};

    const handleValider = async () => {
  const quantiteFinale =
    quantite === "" ? Number(produit.quantite) : Number(quantite);

  const data = {
    id: produit.id,
    quantite: quantiteFinale,
  };

  setSaving(true);
  setBackendFieldErrors({});
  setBackendGeneralError(null);

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

    const { fieldErrors, generalMessage } = parseBackendErrors(
      err.response?.data,
      err.response?.status
    );

    const mappedFieldErrors = {};
    Object.entries(fieldErrors).forEach(([backendField, message]) => {
      const localKey = FIELD_KEY_MAP[backendField] || backendField;
      mappedFieldErrors[localKey] = message;
    });

    setBackendFieldErrors(mappedFieldErrors);
    setBackendGeneralError(
      generalMessage ||
        (Object.keys(mappedFieldErrors).length
          ? null
          : "Une erreur est survenue lors de la validation du produit.")
    );
  } finally {
    setSaving(false);
  }
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

          {backendGeneralError && (
                 <div className="mt-3">
                 <BackendErrorMessage message={backendGeneralError} />
                   </div>
            )}

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
            <ErrorMessage message={backendFieldErrors.quantite || null} />
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
    title={saving ? "Validation..." : "Valider"}
    variant="success"
    fullWidth
    noPadding
    onClick={handleValider}
    disabled={saving}
  />

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
