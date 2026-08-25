import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

import EditableInfoCard from "../Containers/ModifierContainer";
import Button from "../Button/Button";
import SuccessBanner from "./SuccessBanner";
import ErrorMessage from "../Forms/ErrorMessage";
import BackendErrorMessage from "../Forms/BackendErrorMessage";


import quitter from "../../assets/quitter.svg";

import { diffPatch, isEmptyPatch } from "@/lib/diff";
import { updateVersementSolde } from "@/lib/api/zakat";

const formatDate = (date) => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isFutureDate = (date) => {
  if (!date) return false;

  const selected = new Date(date);
  selected.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selected > today;
};

function extractEditableVersementFields(versement) {
  return {
    date_versement: versement?.date_versement ?? null,
    montant: versement?.montant ?? "",
    note: versement?.note ?? "",
  };
}

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

const PopupModifierVersement = ({ open, onClose, versement, onSave }) => {
  const [form, setForm] = useState(null);

  const [errors, setErrors] = useState({});

  const [showBanner, setShowBanner] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [dateDisplay, setDateDisplay] = useState(null);

  const baseline = useMemo(
    () => (versement ? extractEditableVersementFields(versement) : null),
    [versement]
  );


  useEffect(() => {
  if (baseline) {
    setForm(baseline);
    setDateDisplay(
      baseline.date_versement ? new Date(baseline.date_versement) : null
    );
    setErrors({});
    setErrorMessage(null);
    setShowBanner(false);
  }
}, [baseline]);

  const patch = useMemo(
    () => (baseline && form ? diffPatch(baseline, form) : {}),
    [baseline, form]
  );

  const nothingChanged = isEmptyPatch(patch);

  if (!open || !versement || !form) {
    return null;
  }

  const creePar = versement.cree_par?.nom || "-";
  const modifiePar = versement.modifie_par?.nom || "-";

  // Taux stocké lors du versement (pas le taux du jour)
  const tauxUtiliseNum =
    versement.taux_utilise !== null && versement.taux_utilise !== undefined
      ? parseFloat(versement.taux_utilise)
      : null;

  const montantEuroPreview =
    form.montant !== "" && !Number.isNaN(Number(form.montant)) && tauxUtiliseNum !== null
      ? (Number(form.montant) * tauxUtiliseNum).toFixed(2)
      : null;

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMontantChange = (value) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      handleChange("montant", value);
      setErrors((prev) => ({ ...prev, montant: false }));
    }
  };
const handleInfoChange = (index, value) => {
  // Seul l'index 0 (Date) est éditable dans cette carte
  if (index === 0) {
    handleChange("date_versement", formatDate(value));
    setDateDisplay(value);

    if (isFutureDate(value)) {
      setErrors((prev) => ({
        ...prev,
        date_versement: "La date ne peut pas être une date future.",
      }));
    } else {
      setErrors((prev) => {
        if (!prev.date_versement) return prev;
        const updated = { ...prev };
        delete updated.date_versement;
        return updated;
      });
    }
  }
};

  const handleSave = async () => {

    if (isFutureDate(dateDisplay)) {
    setErrors((prev) => ({
      ...prev,
      date_versement: "La date ne peut pas être une date future.",
    }));
    return;
  }
    if (form.montant === "" || form.montant === null) {
      setErrors((prev) => ({ ...prev, montant: true }));
      return;
    }

    if (Number.isNaN(Number(form.montant))) {
      setErrors((prev) => ({ ...prev, montant: true }));
      return;
    }

    if (nothingChanged) {
      setErrorMessage("Aucune modification à enregistrer.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage(null);
      setErrors({});

      const response = await updateVersementSolde(versement.id, patch);

      const updatedVersement = response?.data ?? response;

      setShowBanner(true);

      setTimeout(() => {
        setShowBanner(false);
        onSave?.(updatedVersement);
        onClose();
      }, 1500);
    } catch (error) {
      console.error(
        "Erreur modification versement :",
        error?.response?.data || error
      );

      setErrorMessage(extractErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };
const infos = [
  {
    label: "Date",
    value: dateDisplay,
    type: "date",
  },
  {
    label: "Enregistré par",
    value: creePar,
    editable: false,
  },
  {
    label: "Modifié par",
    value: modifiePar,
    editable: false,
  },
];

  return (
    <AnimatePresence>
      <div
        className="
          fixed inset-0 z-[70]
          bg-transparent sm:bg-black/40
          flex items-start sm:items-center justify-center
          overflow-y-auto
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
            sm:w-[820px]
            sm:max-h-[90vh]
            overflow-y-auto
            scrollbar-hide
            bg-white
            rounded-none
            sm:rounded-[20px]
            border-0
            sm:border
            p-4
            sm:p-6
          "
          style={{ borderColor: "#4E9F8A" }}
        >
          <div className="mb-4">
            <button
              onClick={onClose}
              className="
                flex
                items-center
                gap-2
                text-[17px]
                hover:opacity-70
                transition
              "
            >
              <img src={quitter} alt="" className="w-5 h-5" />
              Fermer
            </button>

            <h2 className="mt-3 text-center text-[20px] font-bold">
              Detail versement
            </h2>
          </div>

          {/* Erreurs backend (dont l'erreur 400 solde < 0) juste après le titre */}
          <BackendErrorMessage message={errorMessage} className="mt-2" />

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-[58%_40%]
              gap-5
              mt-4
            "
          >
            <div className="space-y-4">
              <EditableInfoCard
  title="Informations générales"
  data={infos}
  editable={true}
  onChange={handleInfoChange}
/>
<BackendErrorMessage message={errors.date_versement} />

              <div className="w-full">
                <label
                  className="
                    font-semibold
                    text-[14px]
                    sm:text-[15px]
                    lg:text-[16px]
                  "
                >
                  Montant (MRU)
                </label>

                <div className="relative mt-2">
                  <input
                    type="number"
                    min="0"
                    value={form.montant}
                    onChange={(e) => handleMontantChange(e.target.value)}
                    placeholder="0"
                    className={`
                      w-full
                      h-[45px]

                      border-2
                      border-dashed

                      ${
                        errors.montant
                          ? "border-[#EF4444]"
                          : "border-[#84D6D0]"
                      }

                      rounded-[15px]

                      px-4
                      pr-20

                      text-[15px]
                      sm:text-[16px]

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
                      text-[17px]
                      sm:text-[18px]
                    "
                  >
                    MRU
                  </span>
                </div>

                {!errors.montant && montantEuroPreview !== null && (
                  <p className="text-[#6B7280] text-[12px] mt-1 ml-3">
                    ≈ {montantEuroPreview} EUR (Réf. taux utilisé lors du
                    versement)
                  </p>
                )}

                {!errors.montant && montantEuroPreview === null && (
                  <p className="text-[#6B7280] text-[12px] mt-1 ml-3">
                    Taux de change non disponible pour ce versement.
                  </p>
                )}

                <div className="mt-1">
                  <ErrorMessage
                    message={
                      errors.montant
                        ? "Veuillez saisir un montant valide"
                        : null
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="w-full">
                <label
                  className="
                    font-semibold
                    text-[#4E9F8A] 
                    sm:text-[15px]
                    lg:text-[16px]
                  "
                >
                  Note
                </label>

                <textarea
                 value={form.note}   
                  onChange={(e) => handleChange("note", e.target.value)}
                  placeholder="Entrez une note pour ce versement"
                  className="
                    mt-2
                    w-full
                    min-h-[60px]

                    border-2
                    border-dashed
                    border-[#84D6D0]

                    rounded-[15px]

                    px-4
                    py-3

                    text-[15px]
                    sm:text-[16px]

                    outline-none
                    focus:border-[#4E9F8A]

                    resize-none
                  "
                />
              </div>
              
                <div>
                  <p className="text-[#4E9F8A] font-medium mb-2">
                    Taux de change utilisé :
                  </p>

                  <div
                    className="
                      border
                      border-[#84D6D0]
                      rounded-[15px]

                      px-4
                      py-3
                    "
                  >
                    <p className="text-[#7B7B7B]">{versement.taux_utilise ?? "-"}</p>
                  </div>
                </div>


              <div className="mt-4">
                {showBanner && (
                  <SuccessBanner text="Enregistré avec succès" />
                )}
                <div className="mt-3">

                <Button
                  title={isSaving ? "Enregistrement..." : "Enregistrer"}
                  variant="modifier"
                  noWrapperPadding
                  onClick={handleSave}
                  disabled={isSaving}
                />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PopupModifierVersement;