import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

import TextareaModifier from "../Containers/TextAreaModifier";
import Card from "../Cards/Card";
import EditableInfoCard from "../Containers/ModifierContainer";
import Button from "../Button/Button";
import SuccessBanner from "./SuccessBanner";
import ErrorMessage from "../Forms/ErrorMessage";
import BackendErrorMessage from "../Forms/BackendErrorMessage";

import quitter from "../../assets/quitter.svg";

import { diffPatch, isEmptyPatch } from "@/lib/diff";
import { updateAideZakat } from "@/lib/api/zakat";

function extractEditableZakatFields(zakat) {
  return {
    date_versement: zakat?.date_versement ?? null,
    montant: zakat?.montant ?? "",
    mode_remise: zakat?.mode_remise ?? "",
    cause_principale: zakat?.cause_principale ?? "",
    precisions: zakat?.precisions ?? "",
    observation: zakat?.observation ?? "",
  };
}

function toApiDateString(value) {
  if (!value) return value;

  if (typeof value === "string") {
    return value.includes("T") ? value.slice(0, 10) : value;
  }

  if (value instanceof Date && !isNaN(value.getTime())) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return value;
}

const isFutureDate = (date) => {
  if (!date) return false;

  const selected = new Date(date);
  selected.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selected > today;
};

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

const PopupModifierZakat = ({
  open,
  onClose,
  zakat,
  famille,
  onSave,
}) => {
  const [form, setForm] = useState(null);

  const [confirmed, setConfirmed] = useState(false);
  const [confirmationError, setConfirmationError] = useState(false);
  const [dateError, setDateError] = useState(false);

  const [showBanner, setShowBanner] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const baseline = useMemo(
    () => (zakat ? extractEditableZakatFields(zakat) : null),
    [zakat]
  );

  useEffect(() => {
    if (baseline) {
      setForm(baseline);

      setConfirmed(true);

      setConfirmationError(false);
      setDateError(false);
      setErrorMessage(null);
      setShowBanner(false);
    }
  }, [baseline]);

  
  const tauxUtilise =
    zakat?.taux_utilise != null && !Number.isNaN(parseFloat(zakat.taux_utilise))
      ? parseFloat(zakat.taux_utilise)
      : null;

  const montantEuro =
    form?.montant === ""
      ? "0.00"
      : tauxUtilise !== null
      ? (Number(form?.montant) * tauxUtilise).toFixed(2)
      : zakat?.montant_eur ?? null;

  const patch = useMemo(() => {
  if (!baseline || !form) return {};

  const rawPatch = diffPatch(baseline, form);

  if ("date_versement" in rawPatch) {
    rawPatch.date_versement = toApiDateString(
      rawPatch.date_versement
    );
  }

  return rawPatch;
}, [baseline, form]);

  const nothingChanged = isEmptyPatch(patch);

  if (!open || !zakat || !form) {
    return null;
  }
const familleData = famille || zakat?.famille_info;

const enfant =
  familleData?.nourrisson?.prenom ||
  familleData?.enfant_prenom ||
  "-";

const mere = [
  familleData?.mere?.nom || familleData?.mere_nom,
  familleData?.mere?.prenom || familleData?.mere_prenom,
]
  .filter(Boolean)
  .join(" ") || "-";

const sexe =
  familleData?.nourrisson?.sexe === "M"
    ? "Fils"
    : familleData?.nourrisson?.sexe === "F"
    ? "Fille"
    : familleData?.enfant_sexe === "M"
    ? "Fils"
    : familleData?.enfant_sexe === "F"
    ? "Fille"
    : "-";

const region =
  familleData?.mere?.village?.nom ||
  familleData?.village ||
  "-";

const dateNaissance =
  familleData?.nourrisson?.date_naissance ||
  familleData?.enfant_date_naissance
    ? new Date(
        familleData?.nourrisson?.date_naissance ||
        familleData?.enfant_date_naissance
      ).toLocaleDateString("fr-FR")
    : "-";

const code =
  familleData?.id ||
  zakat?.famille ||
  "-";

  const causePrincipaleOptions = [
    {
      value: "veuvage",
      label: "Veuvage",
    },
    {
      value: "urgence",
      label: "Situation d'urgence",
    },
    {
      value: "vulnerabilite",
      label: "Vulnérabilité extrême",
    },
    {
      value: "autre",
      label: "Autre",
    },
  ];

  const modeRemiseOptions = [
    {
      value: "espece",
      label: "Espèce",
    },
    {
      value: "transfert_mobile",
      label: "Transfert mobile",
    },
    {
      value: "autre",
      label: "Autre",
    },
  ];

 
  const causePrincipaleLabel =
    causePrincipaleOptions.find(
      (opt) => opt.value === form.cause_principale
    )?.label || form.cause_principale;

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

 
  const handleCausePrincipaleChange = (value) => {
    const match = causePrincipaleOptions.find(
      (opt) => opt.label === value || opt.value === value
    );

    setForm((prev) => ({
      ...prev,
      cause_principale: match ? match.value : value,
    }));
  };

  const handleConfirmationChange = (e) => {
    const checked = e.target.checked;

    setConfirmed(checked);

    if (checked) {
      setConfirmationError(false);
    }
  };

  const handleSave = async () => {
    if (!confirmed) {
      setConfirmationError(true);
      return;
    }

    if (isFutureDate(form.date_versement)) {
      setDateError(true);
      return;
    }

    if (nothingChanged) {
      setErrorMessage(
        "Aucune modification à enregistrer."
      );
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage(null);

      const payload = {
        ...patch,
        confirmation: true,
      };

      console.log(
        "PATCH ZAKAT :",
        payload
      );

      const response = await updateAideZakat(
        zakat.id,
        payload
      );

      const updatedZakat =
        response?.data ?? response;

      console.log(
        "Zakat modifiée :",
        updatedZakat
      );

      setShowBanner(true);

      setTimeout(() => {
        setShowBanner(false);

        onSave?.(updatedZakat);

        onClose();
      }, 1500);

    } catch (error) {
      console.error(
        "Erreur modification Zakat :",
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
      value: form.date_versement
        ? new Date(form.date_versement)
        : null,
      type: "date",
    },

    {
      label: "Zakat n°",
      value: zakat.numero_zakat ?? "-",
      editable: false,
    },

    {
      label: "Montant versé",
      value: form.montant,
      type: "number",
      unit: "MRU",
    },

   {
  label: "Mode de paiement",
  value:
    modeRemiseOptions.find((opt) => opt.value === form.mode_remise)?.label ||
    "",
  options: modeRemiseOptions,
},

    {
        label: "Créé par",
      value: zakat.cree_par?.nom || "-",
      editable: false,
    },

    {
      label: "Date de creation ",
      value: zakat.date_creation
        ? new Date(
            zakat.date_creation
          ).toLocaleDateString("fr-FR")
        : "-",
      editable: false,
    },

    {
      label: "Modifié par",
      value: zakat.modifie_par?.nom || "-",
      editable: false,
    },

    {
      label: "Date de modification",
      value: zakat.date_modification
        ? new Date(
            zakat.date_modification
          ).toLocaleDateString("fr-FR")
        : "-",
      editable: false,
    },
  ];

  const handleInfoChange = (index, value) => {
  const fieldMap = [
    "date_versement",
    "numero_zakat",
    "montant",
    "mode_remise",
  ];

  const field = fieldMap[index];

  if (!field || field === "numero_zakat") {
    return;
  }

  let finalValue = value;

  if (field === "mode_remise") {
    const match = modeRemiseOptions.find(
      (opt) => opt.label === value || opt.value === value
    );
    finalValue = match ? match.value : value;
  }

  if (field === "date_versement") {
    setDateError(isFutureDate(finalValue));
  }

  setForm((prev) => ({
    ...prev,
    [field]: finalValue,
  }));
};
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
            sm:w-[952px]
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
          style={{
            borderColor: "#4E9F8A",
          }}
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
              <img
                src={quitter}
                alt=""
                className="w-5 h-5"
              />

              Annuler
            </button>

            <h2
              className="
                mt-3
                text-center
                text-[22px]
                font-bold
              "
            >
              Détail du zakat{" "}
              {zakat.numero_zakat}
            </h2>
          </div>

          <Card
            mere={mere}
            enfant={enfant}
            sexe={sexe}
            region={region}
            naissance={dateNaissance}
            code={code}
            badges={[]}
          />

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

              <ErrorMessage
                message={
                  dateError
                    ? "La date ne peut pas être une date future."
                    : null
                }
              />

              <div>
                {form.montant !== "" && montantEuro !== null && (
                  <p className="text-[#6B7280] text-[12px] mt-1 ml-3">
                    ≈ {montantEuro} EUR (Taux utilisé lors du versement)
                  </p>
                )}

                {form.montant !== "" && montantEuro === null && (
                  <p className="text-[#6B7280] text-[12px] mt-1 ml-3">
                    Taux de change non disponible pour cette zakat.
                  </p>
                )}
              </div>

              <TextareaModifier
                label="Observations complémentaires"
                value={form.observation}
                onChange={(e) =>
                  handleChange(
                    "observation",
                    e.target.value
                  )
                }
                 placeholder="des observations complémentaires"
                height="h-[60px]"
              />

            </div>

            <div className="space-y-4">

              <h2 className="text-[18px] font-semibold">
                Motif de sélection
              </h2>

              <TextareaModifier
                label="Cause principale :"
                value={causePrincipaleLabel}
                onChange={(e) =>
                  handleCausePrincipaleChange(e.target.value)
                }
                placeholder="Saisir la cause principale"
                height="h-[50px]"
                options={causePrincipaleOptions}
              />

              <TextareaModifier
                label="Précisions :"
                value={form.precisions}
                onChange={(e) =>
                  handleChange(
                    "precisions",
                    e.target.value
                  )
                }
                  placeholder="des précisions"
                height="h-[80px]"
              />

              <div className="mt-2">

                <label
                  className="
                    flex
                    items-start
                    gap-3
                    cursor-pointer
                    select-none
                  "
                >
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={
                      handleConfirmationChange
                    }
                    className="
                      w-[18px]
                      h-[18px]
                      cursor-pointer
                      accent-blue-500
                      mt-[2px]
                    "
                  />

                  <span
                    className="
                      text-[15px]
                      sm:text-[16px]
                      text-[#202124]
                      leading-6
                    "
                  >
                    Je confirme la remise du Zakat
                  </span>
                </label>

                <ErrorMessage
                  message={
                    confirmationError
                      ? "Veuillez confirmer la remise avant d'enregistrer."
                      : null
                  }
                />

              </div>

             <BackendErrorMessage message={errorMessage} />

              <div className="mt-4">

                {showBanner && (
                  <SuccessBanner
                    text="Enregistré avec succès"
                  />
                )}

                <Button
                  title={
                    isSaving
                      ? "Enregistrement..."
                      : "Enregistrer"
                  }
                  variant="modifier"
                  noWrapperPadding
                  onClick={handleSave}
                  disabled={isSaving}
                />

              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PopupModifierZakat;

