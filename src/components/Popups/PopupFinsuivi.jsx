import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import quitter from "../../assets/quitter.svg";
import DateContainer from "../Containers/DateContainer";
import TextArea from "../Containers/Textarea";
import Button from "../Button/Button";
import ErrorMessage from "../Forms/ErrorMessage";
import BackendErrorMessage from "../Forms/BackendErrorMessage";

function extractErrorMessage(error) {
  const data = error?.response?.data;

  if (!data) {
    return error?.message || "Une erreur est survenue.";
  }

  if (typeof data === "string") {
    return data;
  }

  if (Array.isArray(data)) {
    const messages = data.filter((m) => typeof m === "string");
    if (messages.length > 0) {
      return messages.join(" — ");
    }
  }

    if (data?.detail) {
    return data.detail;
  }

  
  if (typeof data?.code === "string" && typeof data?.message === "string") {
    return data.message;
  }

  if (typeof data === "object" && !Array.isArray(data)) {
    const collect = (obj, parentLabel = "") => {
      const messages = [];
      Object.entries(obj).forEach(([field, value]) => {
        const label = parentLabel ? `${parentLabel} > ${field}` : field;
        if (Array.isArray(value)) {
          value.forEach((msg) => {
            if (typeof msg === "string") messages.push(`${label} : ${msg}`);
          });
        } else if (value && typeof value === "object") {
          messages.push(...collect(value, label));
        } else if (typeof value === "string") {
          messages.push(`${label} : ${value}`);
        }
      });
      return messages;
    };

    const messages = collect(data);
    if (messages.length > 0) {
      return messages.join(" — ");
    }
  }

  return "Une erreur est survenue.";
}

const isFutureDate = (date) => {
  if (!date) return false;

  const selected = new Date(date);
  selected.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selected > today;
};

const PopupFinSuivi = ({
  open,
  title = "Fin de suivi",
  onClose,
  onConfirm, 
}) => {
  const [motif, setMotif] = useState("");
  const [dateSortie, setDateSortie] = useState(new Date());
  const [errors, setErrors] = useState({ date: false, motif: false });
  const [backendError, setBackendError] = useState(null);
  const [saving, setSaving] = useState(false);

 
  useEffect(() => {
    if (open) {
      setMotif("");
      setDateSortie(new Date());
      setErrors({ date: false, motif: false });
      setBackendError(null);
      setSaving(false);
    }
  }, [open]);

  const handleDateChange = (newDate) => {
    setDateSortie(newDate);
    setErrors((prev) => ({ ...prev, date: isFutureDate(newDate) }));
  };

  const handleMotifChange = (e) => {
    const value = e.target.value;
    setMotif(value);
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, motif: false }));
    }
  };

  const handleConfirm = async () => {
    setBackendError(null);

    const dateInFuture = isFutureDate(dateSortie);
    const motifMissing = !motif.trim();

    setErrors({ date: dateInFuture, motif: motifMissing });

    if (dateInFuture || motifMissing) return;

    setSaving(true);
    try {
      await onConfirm?.(motif, dateSortie);
      setMotif("");
    } catch (err) {
      setBackendError(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="
            fixed
            inset-0
            z-50

            bg-white
            sm:bg-black/30

            flex
            items-start
            sm:items-center

            justify-center

            overflow-y-auto
          "
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="
              w-full

              min-h-screen

              sm:min-h-0
              sm:w-[550px]
              sm:max-h-[90vh]

              overflow-y-auto

              bg-white

              rounded-none
              sm:rounded-[20px]

              border-0
              sm:border
              sm:border-[#4E9F8A]

              shadow-none
              sm:shadow-xl

              px-5
              sm:px-8

              py-6
              sm:py-7
            "
          >
            {/* Fermer */}
            <button
              onClick={onClose}
              className="
                flex
                items-center
                gap-2

                text-[16px]
                sm:text-[18px]

                font-medium
                text-black

                transition-opacity
              "
            >
              <img
                src={quitter}
                alt="Fermer"
                className="w-5 h-5"
              />
              Fermer
            </button>

            {/* Titre */}
            <h2
              className="
                mt-6
                mb-6

                text-center

                text-[24px]
                sm:text-[28px]

                font-semibold
                text-[#1F2937]
              "
            >
              {title}
            </h2>

            <BackendErrorMessage message={backendError} className="mb-4" />

            <div className="mt-4">
              <DateContainer
                label="Date de sortie"
                value={dateSortie}
                onChange={handleDateChange}
                noPadding
              />
              <ErrorMessage
                message={
                  errors.date
                    ? "La date de sortie ne peut pas être une date future."
                    : null
                }
              />
            </div>

            {/* TextArea */}
            <div className="mt-4">
              <TextArea
                label="Motif de sortie"
                placeholder="Entrez le motif"
                value={motif}
                onChange={handleMotifChange}
                height="h-[130px]"
              />
              <ErrorMessage
                message={
                  errors.motif ? "Veuillez indiquer le motif de sortie." : null
                }
              />
            </div>

            {/* Bouton */}
            <div className="mt-8">
              <Button
                title={saving ? "Confirmation..." : "Confirmer la sortie"}
                variant="confirm"
                disabled={saving}
                onClick={handleConfirm}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PopupFinSuivi;
