import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import DateContainer from "../Containers/DateContainer";
import TextArea from "../Containers/TextArea";
import Button from "../Button/Button";
import SuccessBanner from "./SuccessBanner";
import ErrorMessage from "../Forms/ErrorMessage";
import quitter from "../../assets/quitter.svg";

const TAUX_EUR = 40.16; // 1 EUR = 40.16 MRU

export default function PopupAlimenterSolde({
  open,
  onClose,
  onSave,
}) {
  const [date, setDate] = useState(new Date());
  const [montant, setMontant] = useState("");
  const [note, setNote] = useState("");
  const [showBanner, setShowBanner] = useState(false);

  // --- ERROR HANDLING ---
  const [errors, setErrors] = useState({
    montant: false,
  });

  if (!open) return null;

  const euro =
    montant === ""
      ? "0.00"
      : (Number(montant) / TAUX_EUR).toFixed(2);

  const handleMontantChange = (value) => {
    setMontant(value);
    if (value && Number(value) > 0) {
      setErrors((prev) => ({ ...prev, montant: false }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      montant: !montant || Number(montant) <= 0,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const data = {
      date,
      montant: Number(montant),
      note,
      euro,
    };

    setShowBanner(true);

    setTimeout(() => {
      setShowBanner(false);
      onSave?.(data);
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    setMontant("");
    setNote("");
    setErrors({ montant: false });
    onClose();
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
          initial={{ opacity: 0, scale: .95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: .95 }}
          transition={{ duration: .2 }}
          onClick={(e) => e.stopPropagation()}
          className="
            w-full
            min-h-screen

            sm:min-h-0
            sm:w-[833px]
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
          <button
            onClick={handleClose}
            className="flex items-center gap-2 text-[18px]"
          >
            <img src={quitter} alt="" />
            Fermer
          </button>

          <h2 className="text-center text-[24px] font-bold mt-2">
            Alimenter le Solde
          </h2>

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-4
              sm:gap-[18px]
              mt-6
              items-start
            "
          >
            <DateContainer
              label="Date"
              value={date}
              onChange={setDate}
              noPadding
            />

            <div className="w-full">
              <label className="font-semibold text-[16px]">
                Montant (MRU)
              </label>

              <div className="relative mt-2">
                <input
                  type="number"
                  value={montant}
                  onChange={(e) => handleMontantChange(e.target.value)}
                  placeholder="0"
                  className={`
                    w-full
                    h-[45px]
                    border
                    ${errors.montant ? "border-[#EF4444]" : "border-[#4E9F8A]"}
                    rounded-[15px]
                    px-4
                    pr-20
                    text-[16px]
                    font-semibold
                    outline-none
                    focus:border-[#4E9F8A]
                  `}
                />

                <span
                  className="
                    absolute
                    right-5
                    top-1/2
                    -translate-y-1/2
                    text-[#4E9F8A]
                    font-bold
                    text-[18px]
                  "
                >
                  MRU
                </span>
              </div>

              {!errors.montant && (
                <p className="text-[#6B7280] text-[12px] mt-1 ml-3">
                  ≈ {euro} EUR (Réf. taux du jour)
                </p>
              )}

              <div className="mt-1">
                <ErrorMessage
                  message={errors.montant ? "Veuillez saisir un montant valide" : null}
                />
              </div>
            </div>
          </div>

          <div className="mt-5">
            <TextArea
              label="Note (optionnel)"
              placeholder="Tapez ici s'il y a des précisions"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              height="h-[70px]"
            />
          </div>

          <div className="mt-6 grid grid-cols-1">
            {showBanner && (
              <div className="mb-4 w-full">
                <SuccessBanner
                  message="Le solde a été alimenté avec succès."
                />
              </div>
            )}

            <div className="mt-6">
              <Button
                title="Enregistrer"
                variant="primary"
                noWrapperPadding
                onClick={handleSave}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}