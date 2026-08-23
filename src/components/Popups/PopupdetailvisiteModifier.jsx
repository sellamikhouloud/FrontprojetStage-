import Card from "../Cards/Card";
import StatusBadge from "../Cards/Badge";
import EditableInfoCard from "../Containers/ModifierContainer";
import ModifierMesure from "../Containers/ModifierMesure";
import AfficherMesure from "../Containers/AfficherMesure";
import TextareaModifier from "../Containers/TextAreaModifier";
import Button from "../Button/Button";
import ErrorMessage from "../Forms/ErrorMessage";
import BackendErrorMessage from "../Forms/BackendErrorMessage";

import { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

import quitter from "../../assets/quitter.svg";
import EditIcon from "../../assets/Container.svg";

import SuccessBanner from "./SuccessBanner";

import { diffPatch, isEmptyPatch } from "@/lib/diff";
import { updateVisite } from "@/lib/api/visites";

function extractEditableVisiteFields(visite) {
  return {
    date_visite: visite?.date_visite ?? null,

    poids_bebe: visite?.poids_bebe ?? "",
    taille_bebe: visite?.taille_bebe ?? "",
    muac_bebe: visite?.muac_bebe ?? "",

    poids_mere: visite?.poids_mere ?? "",
    taille_mere: visite?.taille_mere ?? "",
    muac_mere: visite?.muac_mere ?? "",

    observations_cliniques_bebe:
      visite?.observations_cliniques_bebe ?? "",
    observations_cliniques_mere:
      visite?.observations_cliniques_mere ?? "",
    evaluation_famille: visite?.evaluation_famille ?? "",
  };
}

// Convertit un objet Date (ou une string) en "YYYY-MM-DD"
function toApiDateString(value) {
  if (!value) return value;

  if (typeof value === "string") {
    return value.includes("T") ? value.slice(0, 10) : value;
  }

  if (value instanceof Date && !isNaN(value)) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, "0");
    const d = String(value.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
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

// Même logique que PopupFinSuivi.jsx — gère aussi le format backend { code, message }.
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

const PopupDetailVisiteModifier = ({
  open,
  onClose,
  visite,
  onSave,
  famille,
}) => {
  // =====================================================
  // ÉTATS
  // =====================================================

  const queryClient = useQueryClient();

  const baseline = useMemo(
    () => (visite ? extractEditableVisiteFields(visite) : null),
    [visite]
  );

  const [form, setForm] = useState(null);

  const [showBanner, setShowBanner] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [dateError, setDateError] = useState(false);

  useEffect(() => {
    if (baseline) {
      setForm(baseline);
      setErrorMessage(null);
      setDateError(false);
      setShowBanner(false);
    }
  }, [baseline]);

  const patch = useMemo(() => {
    if (!baseline || !form) return {};
    const rawPatch = diffPatch(baseline, form);
    // La date doit être envoyée au format YYYY-MM-DD
    if ("date_visite" in rawPatch) {
      rawPatch.date_visite = toApiDateString(rawPatch.date_visite);
    }
    return rawPatch;
  }, [baseline, form]);

  const nothingChanged = isEmptyPatch(patch);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return date;
    return parsedDate.toLocaleDateString("fr-FR");
  };

 

  const handleSave = async () => {
    setErrorMessage(null);

    if (isFutureDate(form.date_visite)) {
      setDateError(true);
      return;
    }

    if (nothingChanged) {
      setErrorMessage("Aucune modification à enregistrer.");
      return;
    }

    try {
      setIsSaving(true);

      const response = await updateVisite(visite.id, patch);
      const updatedVisite = response?.data ?? response;

    
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["visites", famille?.id],
        }),
        queryClient.invalidateQueries({
          queryKey: ["famille", famille?.id],
        }),
      ]);

      setShowBanner(true);

      setTimeout(() => {
        setShowBanner(false);
        onSave?.(updatedVisite);
        onClose();
      }, 1500);
    } catch (error) {
      console.error(
        "Erreur lors de la modification de la visite :",
        error?.response?.data || error
      );

      setErrorMessage(extractErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  if (!open || !visite || !form) return null;

 
  const enfant = famille?.nourrisson?.prenom || "-";

  const mere =
    `${famille?.mere?.nom ?? ""} ${famille?.mere?.prenom ?? ""}`.trim() ||
    "-";

  const sexe =
    famille?.nourrisson?.sexe === "M"
      ? "Fils"
      : famille?.nourrisson?.sexe === "F"
      ? "Fille"
      : "-";

  const region = famille?.mere?.village?.nom || "-";
  const dateNaissance = famille?.nourrisson?.date_naissance || "-";
  const code = famille?.id || "-";

  

  const numeroVisite =
    visite.numero_visite !== undefined && visite.numero_visite !== null
      ? visite.numero_visite
      : "-";

  const dateEnregistrement = formatDate(visite.date_creation);

 

  const infosGenerales = [
    {
      key: "date_visite",
      label: "Date",
      value: form.date_visite ? new Date(form.date_visite) : null,
      type: "date",
    },
    {
      key: "numero_visite",
      label: "Visite n°",
      value: numeroVisite,
      editable: false,
    },
    {
      key: "enregistre_par",
      label: "Enregistrée par",
      value: visite.audit?.cree_par
        ? `${visite.audit.cree_par.nom} ${visite.audit.cree_par.prenom}`
        : "-",
      editable: false,
    },
    {
      key: "date_enregistrement",
      label: "Date d'enregistrement",
      value: dateEnregistrement,
      editable: false,
    },
    {
      key: "modifie_par",
      label: "Modifié par",
      value: visite.audit?.modifie_par
        ? `${visite.audit.modifie_par.nom} ${visite.audit.modifie_par.prenom}`
        : "-",
      editable: false,
    },
    {
      key: "date_modification",
      label: "Date de modification",
      value: formatDate(visite.date_modification),
      editable: false,
    },
  ];

  const handleInfosGeneralesChange = (index, value) => {
    const field = infosGenerales[index];
    if (!field || field.editable === false) return;

    if (field.key === "date_visite") {
      setDateError(isFutureDate(value));
      setForm((prev) => ({ ...prev, date_visite: value }));
    }
  };


  const statutBadges = [
    visite?.statut_nutritionnel === "mam" && {
      type: "mam",
      text: "MAM nourrisson",
    },
    visite?.statut_nutritionnel === "mas" && {
      type: "mas",
      text: "MAS nourrisson",
    },
    visite?.statut_nutritionnel === "normale" && {
      type: "mere",
      text: "Bébé normal",
    },
    visite?.statut_nutritionnel_mere === "normale" && {
      type: "mere",
      text: "Mère normale",
    },
    visite?.statut_nutritionnel_mere === "a_risque" && {
      type: "risque",
      text: "Mère à risque",
    },
    visite?.statut_nutritionnel_mere === "malnutrition" && {
      type: "mas",
      text: "Mère malnutrie",
    },
  ].filter(Boolean);

  const StatutCalculeBlock = () => (
    <div className="w-full rounded-[20px] border border-[#E6ECEA] bg-[#F8FBFC] px-[15px] py-3 flex flex-col">
      <h3 className="text-[18px] font-semibold text-center text-[#202124] mb-3">
        Statut calculé
      </h3>

      <div className="flex flex-wrap sm:flex-nowrap justify-center items-center gap-3">
        {statutBadges.map((badge, index) => (
          <StatusBadge
            key={`${badge.type}-${index}`}
            type={badge.type}
            text={badge.text}
            className="h-[44px] sm:h-[50px] flex-1 sm:flex-none min-w-0 sm:min-w-[190px] rounded-[18px] text-[14px] sm:text-[16px] font-semibold px-4 sm:px-6"
          />
        ))}
      </div>
    </div>
  );

 

  const SaveButtonBlock = () => (
    <div className="w-full">
      {showBanner && <SuccessBanner text="Enregistré avec succès" />}

     <BackendErrorMessage message={errorMessage} className="mb-2" />
      <Button
        title={isSaving ? "Enregistrement..." : "Enregistrer"}
        variant="primary"
        icon={EditIcon}
        noWrapperPadding
        onClick={handleSave}
        disabled={isSaving}
      />
    </div>
  );

 
  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[70] bg-transparent sm:bg-black/40 flex items-start sm:items-center justify-center overflow-y-auto scrollbar-hide"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full min-h-screen sm:min-h-0 sm:w-[952px] sm:max-h-[90vh] overflow-y-auto scrollbar-hide bg-white rounded-none sm:rounded-[20px] border-0 sm:border p-4 sm:p-6"
          style={{ borderColor: "#4E9F8A" }}
        >
          <div className="mb-4">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-[17px] text-[#202124] hover:opacity-70 transition"
            >
              <img src={quitter} alt="Fermer" className="w-5 h-5" />
              Annuler
            </button>

            <h2 className="mt-3 text-center text-[20px] font-bold text-[#202124]">
              Détail de la visite n°{numeroVisite}
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

          {/* DESKTOP */}
          <div className="hidden sm:grid sm:grid-cols-2 gap-4 mt-4">
            <div className="space-y-3">
              <EditableInfoCard
                title="Informations générales"
                data={infosGenerales}
                editable={true}
                onChange={handleInfosGeneralesChange}
              />

              <ErrorMessage
                message={
                  dateError
                    ? "La date ne peut pas être une date future."
                    : null
                }
              />

              <ModifierMesure
                title="Mesure nourrisson"
                poids={form.poids_bebe}
                taille={form.taille_bebe}
                muac={form.muac_bebe}
                setPoids={(v) =>
                  setForm((prev) => ({ ...prev, poids_bebe: v }))
                }
                setTaille={(v) =>
                  setForm((prev) => ({ ...prev, taille_bebe: v }))
                }
                setMuac={(v) =>
                  setForm((prev) => ({ ...prev, muac_bebe: v }))
                }
              />

              <TextareaModifier
                label="Observations cliniques nourrisson"
                value={form.observations_cliniques_bebe}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    observations_cliniques_bebe: e.target.value,
                  }))
                }
                height="h-[100px]"
              />

              <div className="mt-4">
                <SaveButtonBlock />
              </div>
            </div>

            <div className="space-y-3">
              <StatutCalculeBlock />

             <ModifierMesure
  title="Mesure mère"
  variant="mere"
  poids={form.poids_mere}
  taille={form.taille_mere}
  muac={form.muac_mere}
  setPoids={(v) =>
    setForm((prev) => ({
      ...prev,
      poids_mere: v,
    }))
  }
  setTaille={(v) =>
    setForm((prev) => ({
      ...prev,
      taille_mere: v,
    }))
  }
  setMuac={(v) =>
    setForm((prev) => ({
      ...prev,
      muac_mere: v,
    }))
  }
/>

              <AfficherMesure
                title="Informations complémentaires"
                variant="complement"
                statutImc={visite.statut_imc}
                statutHemoglobine={visite.statut_hemoglobine}
              />

              <TextareaModifier
                label="Observations cliniques mère"
                value={form.observations_cliniques_mere}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    observations_cliniques_mere: e.target.value,
                  }))
                }
                height="h-[100px]"
              />

              <TextareaModifier
                label="Évaluation visuelle de la situation familiale"
                value={form.evaluation_famille}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    evaluation_famille: e.target.value,
                  }))
                }
                height="h-[100px]"
              />
            </div>
          </div>

          {/* MOBILE */}
          <div className="flex sm:hidden flex-col gap-4 mt-4">
            <EditableInfoCard
              title="Informations générales"
              data={infosGenerales}
              editable={true}
              onChange={handleInfosGeneralesChange}
            />

            <ErrorMessage
              message={
                dateError
                  ? "La date ne peut pas être une date future."
                  : null
              }
            />

            <StatutCalculeBlock />

            <ModifierMesure
              title="Mesure nourrisson"
              poids={form.poids_bebe}
              taille={form.taille_bebe}
              muac={form.muac_bebe}
              setPoids={(v) =>
                setForm((prev) => ({ ...prev, poids_bebe: v }))
              }
              setTaille={(v) =>
                setForm((prev) => ({ ...prev, taille_bebe: v }))
              }
              setMuac={(v) =>
                setForm((prev) => ({ ...prev, muac_bebe: v }))
              }
            />

            <TextareaModifier
              label="Observations cliniques nourrisson"
              value={form.observations_cliniques_bebe}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  observations_cliniques_bebe: e.target.value,
                }))
              }
              height="h-[55px]"
            />

           <ModifierMesure
  title="Mesure mère"
  variant="mere"
  poids={form.poids_mere}
  taille={form.taille_mere}
  muac={form.muac_mere}
  setPoids={(v) =>
    setForm((prev) => ({
      ...prev,
      poids_mere: v,
    }))
  }
  setTaille={(v) =>
    setForm((prev) => ({
      ...prev,
      taille_mere: v,
    }))
  }
  setMuac={(v) =>
    setForm((prev) => ({
      ...prev,
      muac_mere: v,
    }))
  }
/>

            <AfficherMesure
              title="Informations complémentaires"
              variant="complement"
              statutImc={visite.statut_imc}
              statutHemoglobine={visite.statut_hemoglobine}
            />

            <TextareaModifier
              label="Observations cliniques mère"
              value={form.observations_cliniques_mere}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  observations_cliniques_mere: e.target.value,
                }))
              }
              height="h-[55px]"
            />

            <TextareaModifier
              label="Évaluation visuelle de la situation familiale"
              value={form.evaluation_famille}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  evaluation_famille: e.target.value,
                }))
              }
              height="h-[55px]"
            />

            <div className="mt-2">
              <SaveButtonBlock />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PopupDetailVisiteModifier;
