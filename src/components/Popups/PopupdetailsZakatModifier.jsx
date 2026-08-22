import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

import TextareaModifier from "../Containers/TextAreaModifier";
import Card from "../Cards/Card";
import EditableInfoCard from "../Containers/ModifierContainer";
import Button from "../Button/Button";
import SuccessBanner from "./SuccessBanner";

import quitter from "../../assets/quitter.svg";

import { diffPatch, isEmptyPatch } from "@/lib/diff";
import { updateAideZakat } from "@/lib/api/zakat";
import { getTauxDeChange } from "@/lib/api/parametres";

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

  const [showBanner, setShowBanner] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [tauxEuro, setTauxEuro] = useState(null);
  const [loadingTaux, setLoadingTaux] = useState(false);
  const [tauxError, setTauxError] = useState("");

  const baseline = useMemo(
    () => (zakat ? extractEditableZakatFields(zakat) : null),
    [zakat]
  );

  useEffect(() => {
    if (baseline) {
      setForm(baseline);

      setConfirmed(true);

      setConfirmationError(false);
      setErrorMessage(null);
      setShowBanner(false);
    }
  }, [baseline]);

  useEffect(() => {
    if (!open) return;

    const fetchTaux = async () => {
      try {
        setLoadingTaux(true);
        setTauxError("");

        const response = await getTauxDeChange();

        console.log("Réponse taux de change :", response);

        const valeur = parseFloat(response?.data?.valeur);

        if (Number.isNaN(valeur)) {
          throw new Error("Taux de change invalide");
        }

        console.log("Taux EUR récupéré :", valeur);

        setTauxEuro(valeur);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du taux de change :",
          error?.response?.data || error
        );

        setTauxEuro(null);
        setTauxError(
          "Impossible de récupérer le taux de change."
        );
      } finally {
        setLoadingTaux(false);
      }
    };

    fetchTaux();
  }, [open]);

  const montantEuro =
    form?.montant === "" || tauxEuro === null
      ? "0.00"
      : (Number(form?.montant) * tauxEuro).toFixed(2);

  const patch = useMemo(
    () =>
      baseline && form
        ? diffPatch(baseline, form)
        : {},
    [baseline, form]
  );

  const nothingChanged = isEmptyPatch(patch);

  if (!open || !zakat || !form) {
    return null;
  }

  const enfant = famille?.enfant_prenom || "-";
  const mere = famille?.mere_nom || "-";

  const sexe =
    famille?.enfant_sexe === "M"
      ? "Fils"
      : famille?.enfant_sexe === "F"
      ? "Fille"
      : "-";

  const region = famille?.village || "-";

  const dateNaissance = famille?.enfant_date_naissance
    ? new Date(
        famille.enfant_date_naissance
      ).toLocaleDateString("fr-FR")
    : "-";

  const code = zakat.famille || "-";

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

      setErrorMessage(
        error?.response?.data?.detail ||
        "Une erreur est survenue lors de la modification."
      );

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
      label: "Enregistrée par",
      value: zakat.cree_par?.nom || "-",
      editable: false,
    },

    {
      label: "Date d'enregistrement",
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

              <div>
                {loadingTaux && (
                  <p className="text-[#6B7280] text-[12px] mt-1 ml-3">
                    Récupération du taux de change...
                  </p>
                )}

                {tauxError && (
                  <p className="text-red-500 text-[12px] mt-1 ml-3">
                    {tauxError}
                  </p>
                )}

                {!loadingTaux &&
                  !tauxError &&
                  form.montant !== "" && (
                    <p className="text-[#6B7280] text-[12px] mt-1 ml-3">
                      ≈ {montantEuro} EUR (Réf. taux du jour)
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

                {confirmationError && (
                  <p
                    className="
                      mt-2
                      ml-8
                      text-[13px]
                      text-red-500
                    "
                  >
                    Veuillez confirmer la remise
                    avant d'enregistrer.
                  </p>
                )}

              </div>

              {errorMessage && (
                <div
                  className="
                    rounded-[10px]
                    border
                    border-red-300
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-600
                  "
                >
                  {errorMessage}
                </div>
              )}

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
