import Sidebar from "../../components/Sidebar/Sidebar";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
import Card from "../../components/Cards/Card";
import CardPopup from "../../components/Cards/Card2";
import OptionsMenu from "../../components/Containers/OptionsMenu";
import SelectorWithAction from "../../components/Forms/SelectorWithAction";
import { useState, useEffect } from "react";
import AlertBox from "../../components/AlertComposant/AlertBox";
import MesureInput from "../../components/Containers/MesureInput";
import TextArea from "../../components/Containers/Textarea";
import SelectInput from "../../components/Containers/ChoiceContainer";
import ErrorMessage from "../../components/Forms/ErrorMessage";
import StatusBadge from "../../components/Cards/Badge";
import ZScoreBox from "../../components/Containers/ZScoreBox";

import { useNavigate } from "react-router-dom";
import DateContainer from "../../components/Containers/DateContainer";
import Button from "../../components/Button/Button";

import PopupListeFamilles from "../../components/Popups/PopupListeFamilles";

import Popup from "../../components/Popups/SuccessPopup";
import SuccessImage from "../../assets/Success.svg";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listFamilles } from "@/lib/api/familles";


import { createVisite, getPreCreationVisite } from "../../lib/api/visites";

const MOIS_OPTIONS = [
  { label: "Janvier", value: "janvier" },
  { label: "Février", value: "fevrier" },
  { label: "Mars", value: "mars" },
  { label: "Avril", value: "avril" },
  { label: "Mai", value: "mai" },
  { label: "Juin", value: "juin" },
  { label: "Juillet", value: "juillet" },
  { label: "Août", value: "aout" },
  { label: "Septembre", value: "septembre" },
  { label: "Octobre", value: "octobre" },
  { label: "Novembre", value: "novembre" },
  { label: "Décembre", value: "decembre" },
];

const POSITION_OPTIONS = ["Debout", "Couché"];

const STATUT_BEBE_MAP = {
  mas: { type: "mas", label: "MAS nourrisson" },
  mam: { type: "mam", label: "MAM nourrisson" },
  normale: { type: "mere", label: "Bébé normal" },
};

const STATUT_MERE_MAP = {
  a_risque: { type: "risque", label: "Mère à risque" },
  normale: { type: "mere", label: "Mère normale" },
  malnutrition: { type: "mas", label: "Mère malnutrie" },
};

// "YYYY-MM-DD" -> "DD/MM/YYYY"
const formatDateFr = (isoDate) => {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-");
  if (!y || !m || !d) return isoDate;
  return `${d}/${m}/${y}`;
};

export default function AjoutVisite() {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const location = useLocation();
  const draft = location.state?.draft;

  const [selectedFamille, setSelectedFamille] = useState(
    draft?.selectedFamille || null
  );
  const [date, setDate] = useState(draft?.date ? new Date(draft.date) : new Date());
  const [mois, setMois] = useState(draft?.mois || null);
  const [openMois, setOpenMois] = useState(false);
  const [numeroCycle, setNumeroCycle] = useState(draft?.numeroCycle || "");

  // --- Mesures nourrisson ---
  const [poidsNourrisson, setPoidsNourrisson] = useState(draft?.poidsNourrisson || "");
  const [tailleNourrisson, setTailleNourrisson] = useState(draft?.tailleNourrisson || "");
  const [muacNourrisson, setMuacNourrisson] = useState(draft?.muacNourrisson || "");
  const [observationsNourrisson, setObservationsNourrisson] = useState(
    draft?.observationsNourrisson || ""
  );
  const [positionNourrisson, setPositionNourrisson] = useState(
    draft?.positionNourrisson !== undefined ? draft.positionNourrisson : null
  );

  // --- Mesures mère ---
  const [poidsMere, setPoidsMere] = useState(draft?.poidsMere || "");
  const [tailleMere, setTailleMere] = useState(draft?.tailleMere || "");
  const [muacMere, setMuacMere] = useState(draft?.muacMere || "");
  const [observationsMere, setObservationsMere] = useState(
    draft?.observationsMere || ""
  );

  const [evaluationVisuelle, setEvaluationVisuelle] = useState(
    draft?.evaluationVisuelle || ""
  );

  // --- Hémoglobine (nécessaire pour le payload de l'API) ---
  const [hemoglobine, setHemoglobine] = useState(draft?.hemoglobine || "");

  // --- Résultat renvoyé par le backend après enregistrement ---
  // (statuts MAS/MAM/Normal, Mère normale/à risque, et z-scores : calculés côté backend, pas côté front)
  // Forme attendue : { zScores: { pa, ta, pt }, statutNourrisson: { type, label }, statutMere: { type, label } }
  const [resultatVisite, setResultatVisite] = useState(null);

  const successExtraContent = resultatVisite && (
    <div className="flex flex-col gap-4 border-t border-[#E5E7EB] pt-4 w-full">
      {/* Z-scores nourrisson */}
      <div>
        <p className="text-[13px] font-semibold text-[#202124] mb-2">
          Z-scores nourrisson
        </p>
        <div className="flex gap-2">
          <ZScoreBox label="P/A" value={resultatVisite.zScores?.pa} />
          <ZScoreBox label="T/A" value={resultatVisite.zScores?.ta} />
          <ZScoreBox label="P/T" value={resultatVisite.zScores?.pt} />
        </div>
      </div>

      {/* Statuts nourrisson + mère, côte à côte */}
      <div className="flex gap-4">
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-[#202124] mb-2">
            Statut nourrisson
          </p>
          <div className="flex flex-wrap gap-2">
            {resultatVisite.statutNourrisson && (
              <StatusBadge
                type={resultatVisite.statutNourrisson.type}
                text={resultatVisite.statutNourrisson.label}
              />
            )}
          </div>
        </div>

        <div className="flex-1">
          <p className="text-[13px] font-semibold text-[#202124] mb-2">
            Statut mère
          </p>
          <div className="flex flex-wrap gap-2">
            {resultatVisite.statutMere && (
              <StatusBadge
                type={resultatVisite.statutMere.type}
                text={resultatVisite.statutMere.label}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // --- ERROR HANDLING ---
  const [errors, setErrors] = useState({
    famille: false,
    mois: false,
    numeroCycle: false,
    poidsNourrisson: false,
    tailleNourrisson: false,
    muacNourrisson: false,
    positionNourrisson: false,
    poidsMere: false,
    tailleMere: false,
    muacMere: false,
  });

  const validateForm = () => {
    const newErrors = {
      famille: !selectedFamille,
      mois: !mois,
      numeroCycle: !numeroCycle,
      poidsNourrisson: !poidsNourrisson,
      tailleNourrisson: !tailleNourrisson,
      muacNourrisson: !muacNourrisson,
      positionNourrisson: positionNourrisson === null,
      poidsMere: !poidsMere,
      tailleMere: !tailleMere,
      muacMere: !muacMere,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  // --- État de sauvegarde (appel API) ---
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Convertit une date (Date ou string) en format "YYYY-MM-DD"
  const formatDate = (d) => {
    const dt = d instanceof Date ? d : new Date(d);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(
      dt.getDate()
    ).padStart(2, "0")}`;
  };


  const extractErrorMessage = (error) => {
    const data = error.response?.data;

    if (!data) {
      return error.message || "Une erreur est survenue lors de l'enregistrement de la visite.";
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

    if (typeof data === "object" && !Array.isArray(data)) {
      const messages = [];

      Object.entries(data).forEach(([field, value]) => {
        const values = Array.isArray(value) ? value : [value];

        values.forEach((msg) => {
          if (typeof msg !== "string") return;
          if (field === "non_field_errors" || field === "detail") {
            messages.push(msg);
          } else {
            messages.push(`${field} : ${msg}`);
          }
        });
      });

      if (messages.length > 0) {
        return messages.join(" — ");
      }
    }

    return "Une erreur est survenue lors de l'enregistrement de la visite.";
  };



  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setSaveError(null);

    // "mois" (dropdown) -> numéro 1-12 pour le champ "month" attendu par l'API
    const monthIndex = MOIS_OPTIONS.findIndex((m) => m.value === mois) + 1;
    const monthNumber = monthIndex > 0 ? monthIndex : null;

    const payload = {
      famille: selectedFamille?.code, // ex: "GDK-2026-008"
      date_visite: formatDate(date),
      cycle: numeroCycle ? Number(numeroCycle) : null,

      poids_bebe: Number(poidsNourrisson),
      taille_bebe: Number(tailleNourrisson),
      muac_bebe: Number(muacNourrisson),

      poids_mere: Number(poidsMere),
      taille_mere: Number(tailleMere),
      muac_mere: Number(muacMere),

      observations_cliniques_bebe: observationsNourrisson,
      observations_cliniques_mere: observationsMere,
      evaluation_famille: evaluationVisuelle,

      // positionNourrisson === true  -> "Debout"
      // positionNourrisson === false -> "Couché" => mesure_couchee = true
      mesure_couchee: positionNourrisson === false,

      month: monthNumber,
      hemoglobine: hemoglobine || null,
    };

   try {
  const response = await createVisite(payload);

  console.log("✅ Réponse backend complète :", JSON.stringify(response.data, null, 2));

  const data = response.data;

  setResultatVisite({
    zScores: {
      pa: data?.score_z_pa,
      ta: data?.score_z_ta,
      pt: data?.score_z_pt,
    },
    statutNourrisson: STATUT_BEBE_MAP[data?.statut_bebe] ?? null,
    statutMere: STATUT_MERE_MAP[data?.statut_mere] ?? null,
  });

  setShowSuccessPopup(true);
} catch (error) {
  console.error(
    "❌ Erreur lors de la création de la visite :",
    error.response?.data || error.message
  );

  setSaveError(extractErrorMessage(error));
} finally {
  setSaving(false);
}
  };

  // --- Handlers qui nettoient l'erreur au fur et à mesure ---
  const handleMoisChange = (value) => {
    setMois(value);
    setErrors((prev) => ({ ...prev, mois: false }));
  };

  const handlePoidsNourrissonChange = (value) => {
    setPoidsNourrisson(value);
    if (value) setErrors((prev) => ({ ...prev, poidsNourrisson: false }));
  };

  const handleTailleNourrissonChange = (value) => {
    setTailleNourrisson(value);
    if (value) setErrors((prev) => ({ ...prev, tailleNourrisson: false }));
  };

  const handleMuacNourrissonChange = (value) => {
    setMuacNourrisson(value);
    if (value) setErrors((prev) => ({ ...prev, muacNourrisson: false }));
  };

  const handlePositionNourrissonChange = (selected) => {
    setPositionNourrisson(selected === "Debout");
    setErrors((prev) => ({ ...prev, positionNourrisson: false }));
  };

  const handlePoidsMereChange = (value) => {
    setPoidsMere(value);
    if (value) setErrors((prev) => ({ ...prev, poidsMere: false }));
  };

  const handleTailleMereChange = (value) => {
    setTailleMere(value);
    if (value) setErrors((prev) => ({ ...prev, tailleMere: false }));
  };

  const handleMuacMereChange = (value) => {
    setMuacMere(value);
    if (value) setErrors((prev) => ({ ...prev, muacMere: false }));
  };

  const navigate = useNavigate();

  const [openFamilles, setOpenFamilles] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);

  // --- Récupération des vraies familles depuis l'API ---
  const {
    data: famillesData,
    isLoading: famillesLoading,
    isError: famillesError,
    refetch: refetchFamilles,
  } = useQuery({
    queryKey: ["familles-popup"],
    queryFn: () => listFamilles().then((r) => r.data),
    enabled: openFamilles, // 👈 ne fetch que quand le popup s'ouvre (optionnel, tu peux retirer si tu veux précharger)
  });

  const famillesBrutes = famillesData?.results ?? famillesData ?? [];

  // Mapping vers le format attendu par le popup / les cartes
  // (même logique que dans la page "Liste des familles")
  const listeDesFamilles = famillesBrutes.map((famille) => ({
    id: famille.id,
    enfant: famille.nourrisson?.prenom,
    mere: `${famille.mere?.nom ?? ""} ${famille.mere?.prenom ?? ""}`,
    sexe:
      famille?.nourrisson?.sexe === "M"
        ? "Fils"
        : famille?.nourrisson?.sexe === "F"
        ? "Fille"
        : "-",
    region: famille.mere?.village?.nom ?? "-",
    naissance: famille.nourrisson?.date_naissance,
    code: famille.id,
    badges: [
      famille?.statut_nutritionnel_bebe === "mam" && {
        type: "mam",
        text: "MAM nourrisson",
      },
      famille?.statut_nutritionnel_bebe === "mas" && {
        type: "mas",
        text: "MAS nourrisson",
      },
      famille?.statut_nutritionnel_bebe === "normale" && {
        type: "mere",
        text: "Bébé normal",
      },
      famille?.statut_nutritionnel_mere === "normale" && {
        type: "mere",
        text: "Mère normale",
      },
      famille?.statut_nutritionnel_mere === "a_risque" && {
        type: "risque",
        text: "Mère à risque",
      },
      famille?.statut_nutritionnel_mere === "malnutrition" && {
        type: "mas",
        text: "Mère malnutrie",
      },
      famille.est_visite_en_retard && {
        type: "retard",
        text: "Visite en retard",
      },
    ].filter(Boolean),
  }));


  const familyOptions = [
    { label: "Changer la famille", value: "changer" },
    { label: "Voir la fiche famille", value: "voir" },
  ];

  const handleSearch = () => {
    setOpenFamilles(true);
  };

  const handleOptionSelect = (value) => {
    if (value === "changer") {
      setOpenFamilles(true);
    } else if (value === "voir") {
      navigate(`/famille/${selectedFamille.id}`, {
        state: {
          from: "/ajout-visite",
          draft: {
            selectedFamille,
            date,
            mois,
            numeroCycle,
            poidsNourrisson,
            tailleNourrisson,
            muacNourrisson,
            positionNourrisson,
            observationsNourrisson,
            poidsMere,
            tailleMere,
            muacMere,
            observationsMere,
            evaluationVisuelle,
            hemoglobine,
          },
        },
      });
    }
  };

  // --- Pré-création : appelée dès qu'une famille est sélectionnée ---
  // GET /api/visites/pre_creation/?famille=<code>
  // -> { date_visite, date_derniere_visite, est_visite_retard, nb_jours, numero_visite, cycle }
  const {
    data: preCreationData,
    isFetching: preCreationLoading,
    isError: preCreationError,
  } = useQuery({
    queryKey: ["visite-pre-creation", selectedFamille?.code],
    queryFn: () =>
      getPreCreationVisite(selectedFamille.code).then((r) => {
        console.log("📋 Réponse pre_creation :", r.data);
        return r.data;
      }),
    enabled: !!selectedFamille?.code,
  });

  useEffect(() => {
    if (preCreationError) {
      console.error("❌ Erreur lors de l'appel pre_creation pour", selectedFamille?.code);
    }
  }, [preCreationError, selectedFamille?.code]);

  // Dès que la pré-création répond, on pré-remplit le numéro de cycle
  // (sauf si on revient sur un brouillon qui avait déjà une valeur saisie)
  useEffect(() => {
    if (preCreationData && !draft?.numeroCycle) {
      setNumeroCycle(
        preCreationData.cycle !== undefined && preCreationData.cycle !== null
          ? String(preCreationData.cycle)
          : ""
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preCreationData]);

  return (
  <div className="flex h-screen bg-white overflow-hidden">

    <Sidebar role="coordinator" />
  

  <main className="relative flex-1 min-h-0 overflow-hidden bg-white">
     
    
      {/* Zone scrollable UNIQUE */}
      <div
        className="
          h-full
          overflow-y-auto

          pt-20
          lg:pt-4

          px-4
          lg:px-10

          pb-8
          lg:pb-2
        "
      >
<div className="min-h-full flex flex-col justify-center">

  <div className="mb-2 lg:mb-2">
            <PageHeader
              leftTitle="Annuler"
              showRight={false}
              onBack={() => window.history.back()}
            />
          </div>
      
      

      <div className=" mb-0 lg:mb-4">
  {/* Basé sur la réponse réelle du backend (pre_creation), pas sur les badges de la liste */}
  {preCreationData?.date_derniere_visite && (
    preCreationData?.est_visite_retard ? (
      <AlertBox variant="warning">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-0 sm:gap-0">
          <span className="font-bold text-[#78350F]">Visite en retard</span>
          <span className="text-[13px] text-[#92400E]">
            Dernière visite le {formatDateFr(preCreationData.date_derniere_visite)}
            {preCreationData.nb_jours != null &&
              ` (il y a ${preCreationData.nb_jours} jour${
                preCreationData.nb_jours > 1 ? "s" : ""
              })`}
            .
          </span>
        </div>
      </AlertBox>
    ) : (
      <AlertBox variant="notice">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-0 sm:gap-0">
          <span className="font-bold text-[#1E3A8A]">Dernière visite</span>
          <span className="text-[13px] text-[#1E3A8A]">
            Le {formatDateFr(preCreationData.date_derniere_visite)}
            {preCreationData.nb_jours != null &&
              ` (il y a ${preCreationData.nb_jours} jour${
                preCreationData.nb_jours > 1 ? "s" : ""
              })`}
            .
          </span>
        </div>
      </AlertBox>
    )
  )}
</div>

        {!selectedFamille && (
          <div className="flex flex-col gap-2">
            <SelectorWithAction
              label="Choisir la famille concerne"
              description="Cliquer pour rechercher la famille concerne par la distribution"
              onAction={handleSearch}
            />
            <ErrorMessage
              message={errors.famille ? "Veuillez sélectionner une famille" : null}
            />
          </div>
        )}

        {/* Family Card */}
        {selectedFamille && (
          <>
            {/* Mobile */}
            <div className="relative block lg:hidden mt-4">
              <div
                className="cursor-pointer"
                onClick={() => setOpenOptions((prev) => !prev)}
              >
                <CardPopup
                  enfant={selectedFamille.enfant}
                  mere={selectedFamille.mere} 
                  sexe={selectedFamille.sexe}
                  region={selectedFamille.region}
                  naissance={selectedFamille.naissance}
                  code={selectedFamille.code}
                  badges={selectedFamille.badges}
                />
              </div>

              <OptionsMenu
                open={openOptions}
                onClose={() => setOpenOptions(false)}
                options={familyOptions}
                onSelect={handleOptionSelect}
              />
            </div>

            {/* Desktop */}
            <div className="relative hidden lg:block">
              <div
                className="cursor-pointer"
                onClick={() => setOpenOptions((prev) => !prev)}
              >
                <Card
                  enfant={selectedFamille.enfant}
                  mere={selectedFamille.mere}
                  sexe={selectedFamille.sexe}
                  region={selectedFamille.region}
                  naissance={selectedFamille.naissance}
                  code={selectedFamille.code}
                  badges={selectedFamille.badges}
                />
              </div>

              <OptionsMenu
                open={openOptions}
                onClose={() => setOpenOptions(false)}
                options={familyOptions}
                onSelect={handleOptionSelect}
              />
            </div>
          </>
        )}

        {/* Main content */}
   <div className="mt-5 grid grid-cols-1 lg:grid-cols-[11fr_9fr] gap-6">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-4">
            {/* Date + Visite number */}
            <div className="flex flex-col gap-0">
              <h3
                className="
                  text-[16px]
                  lg:text-[18px]
                  font-semibold
                  text-[#202124]
                "
              >
                Date de la visite
              </h3>

              <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-2 items-start">
                <div className="flex flex-col gap-1">
                  <DateContainer value={date} onChange={setDate} noPadding hideLabelSpace />
                </div>

                {/* Mois - dropdown */}
                <div className="flex flex-col gap-1">
                  <div className="relative w-full">
                    <button
                      type="button"
                      onClick={() => setOpenMois((prev) => !prev)}
                      className={`
                        h-[45px]
                        w-full
                        rounded-[15px]
                        border
                        ${mois ? "border-[#4E9F8A]" : "border-[#E5E7EB]"}
                        bg-white
                        px-4
                        flex
                        items-center
                        justify-between
                        text-left
                      `}
                    >
                      <span
                        className={`text-[14px] leading-[20px] ${
                          mois ? "text-[#374151]" : "text-[#9CA3AF]"
                        }`}
                      >
                        {mois
                          ? MOIS_OPTIONS.find((m) => m.value === mois)?.label
                          : "Selectionner le MOIS"}
                      </span>
                    </button>

                    <OptionsMenu
                      open={openMois}
                      onClose={() => setOpenMois(false)}
                      options={MOIS_OPTIONS}
                      onSelect={handleMoisChange}
                      position="top-[52px] left-0"
                      width="w-full"
                      maxHeight="200px"
                    />
                  </div>
                  <ErrorMessage
                    message={errors.mois ? "Veuillez sélectionner un mois" : null}
                  />
                </div>
              </div>

               {selectedFamille && (
              <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-2 items-start">
                {/* Numero de cycle - renvoyé par pre_creation, affichage seulement (non modifiable) */}
                <div className="w-full">
                  <div
                    className="
                      h-[45px]
                      w-full
                      rounded-[15px]
                      border
                      border-[#4E9F8A]
                      bg-white
                      px-4
                      flex
                      items-center
                    "
                  >
                    <p className="text-[14px] leading-[20px] text-[#374151]">
                      Cycle N°{" "}
                      {preCreationLoading ? "..." : numeroCycle || "-"}
                    </p>
                  </div>
                </div>

                {/* Visite numero - renvoyé par pre_creation, affichage seulement */}
                <div className="w-full">
                  <div
                    className="
                      h-[45px]
                      rounded-[15px]
                      border
                      border-[#4E9F8A]
                      bg-white
                      px-4
                      pr-12
                      flex
                      items-center
                    "
                  >
                    <p className="text-[14px] leading-[20px] text-[#374151]">
                      Visite N°{" "}
                      {preCreationLoading
                        ? "..."
                        : preCreationData?.numero_visite ?? "-"}
                    </p>
                  </div>
                </div>
              </div>
            )}
            </div>

            {/* Mesures + Observations nourrisson */}
            <div
              className="
                rounded-[20px]
                border
                border-[#E5E7EB]
                bg-[#F9FAFB]
                px-4
                py-4
              "
            >
              <h2 className="text-[18px] font-bold text-[#202124] mb-4">
                Mesures nourrisson
              </h2>

              {/* Champs de saisie */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="flex flex-col gap-1">
                  <MesureInput
                    label="Poids"
                    unit="g"
                    value={poidsNourrisson}
                    onChange={(e) => handlePoidsNourrissonChange(e.target.value)}
                  />
                  <ErrorMessage message={errors.poidsNourrisson ? "Requis" : null} />
                </div>
                <div className="flex flex-col gap-1">
                  <MesureInput
                    label="Taille"
                    unit="cm"
                    value={tailleNourrisson}
                    onChange={(e) => handleTailleNourrissonChange(e.target.value)}
                  />
                  <ErrorMessage message={errors.tailleNourrisson ? "Requis" : null} />
                </div>
                <div className="flex flex-col gap-1">
                  <MesureInput
                    label="MUAC"
                    unit="mm"
                    value={muacNourrisson}
                    onChange={(e) => handleMuacNourrissonChange(e.target.value)}
                  />
                  <ErrorMessage message={errors.muacNourrisson ? "Requis" : null} />
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-1">
                <SelectInput
                  label=""
                  placeholder="Position lors de la prise des mesures"
                  options={POSITION_OPTIONS}
                  value={
                    positionNourrisson === null
                      ? ""
                      : positionNourrisson
                      ? "Debout"
                      : "Couché"
                  }
                  onChange={handlePositionNourrissonChange}
                  error={errors.positionNourrisson}
                  noPadding
                />
                <ErrorMessage
                  message={
                    errors.positionNourrisson
                      ? "Veuillez préciser la position lors de la prise des mesures"
                      : null
                  }
                />
              </div>

              <h2 className="text-[18px] font-semibold text-[#000000] mb-2 mt-6">
                Observations cliniques nourrisson
              </h2>

              <TextArea
                label=""
                placeholder="Tapez ici si il y a des observations"
                value={observationsNourrisson}
                onChange={(e) => setObservationsNourrisson(e.target.value)}
                height="h-[98px]"
                bgColor="bg-white"
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4">
            {/* MesuresMere et observation */}
            <div
              className="
                rounded-[20px]
                border
                border-[#E5E7EB]
                bg-[#F9FAFB]
                px-4
                py-4
              "
            >
              <h2 className="text-[18px] font-bold text-[#000000] mb-4">
                Mesures mère
              </h2>

              {/* Champs de saisie */}
              <div className="grid grid-cols-2 gap-1 sm:gap-2">
                <div className="flex flex-col gap-0">
                  <MesureInput
                    label="Poids"
                    unit="Kg"
                    value={poidsMere}
                    onChange={(e) => handlePoidsMereChange(e.target.value)}
                  />
                  <ErrorMessage message={errors.poidsMere ? "Requis" : null} />
                </div>
                <div className="flex flex-col gap-0">
                  <MesureInput
                    label="Taille"
                    unit="m"
                    value={tailleMere}
                    onChange={(e) => handleTailleMereChange(e.target.value)}
                  />
                  <ErrorMessage message={errors.tailleMere ? "Requis" : null} />
                </div>
                <div className="flex flex-col gap-0">
                  <MesureInput
                    label="MUAC"
                    unit="cm"
                    value={muacMere}
                    onChange={(e) => handleMuacMereChange(e.target.value)}
                  />
                  <ErrorMessage message={errors.muacMere ? "Requis" : null} />
                </div>
                <div className="flex flex-col gap-0">
                  <MesureInput
                    label="Hémoglobine"
                    unit="g/dL"
                    value={hemoglobine}
                    onChange={(e) => setHemoglobine(e.target.value)}
                  />
                </div>
              </div>

             

              <h2 className="text-[18px] font-semibold text-[#000000] mb-2 mt-6">
                Observations cliniques mère
              </h2>

              <TextArea
                label=""
                placeholder="Tapez ici si il y a des observations"
                value={observationsMere}
                onChange={(e) => setObservationsMere(e.target.value)}
                height="h-[70px]"
                bgColor="bg-white"
              />
            </div>

            {/* Evaluation visuelle */}
            <div
              className="
                rounded-[20px]
                border
                border-[#E5E7EB]
                bg-[#F9FAFB]
                px-4
                py-4
              "
            >
              <h2 className="text-[18px] font-bold text-[#000000] mb-2">
                Evaluation visuelle de la situation familiale
              </h2>

              <TextArea
                label=""
                placeholder="Tapez ici si il y a des observations"
                value={evaluationVisuelle}
                onChange={(e) => setEvaluationVisuelle(e.target.value)}
                height="h-[70px]"
                bgColor="bg-white"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="mt-2">
          <Button
            title={saving ? "Enregistrement..." : "Enregistrer"}
            variant="save"
            noPadding
            onClick={handleSave}
            disabled={saving}
          />
          {saveError && <ErrorMessage message={saveError} />}
        </div>

        {showSuccessPopup && (
          <Popup
            title="Visite enregistrée avec succès"
            image={SuccessImage}
            extraContent={successExtraContent}
            primaryButtonText="Ajouter une distribution"
            secondaryButtonText="Revenir à l'accueil"
            onPrimaryClick={() => {
              setShowSuccessPopup(false);
              setResultatVisite(null);
              navigate("/ajout-distribution");
            }}
            onSecondaryClick={() => {
              setShowSuccessPopup(false);
              setResultatVisite(null);
              navigate("/dashboard");
            }}
          />
        )}
        </div>

        </div>

        {/* Espace blanc FIXE en bas */}
      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          h-4
          bg-white
          z-20
        "
      />
    </main>

    <PopupListeFamilles
  open={openFamilles}
  onClose={() => setOpenFamilles(false)}
  familles={listeDesFamilles}
  loading={famillesLoading}
  error={famillesError}
  onRetry={refetchFamilles}
  onSelectFamille={(famille) => {
    setSelectedFamille(famille);
    setOpenFamilles(false);
    setErrors((prev) => ({ ...prev, famille: false }));
  }}
/>
    </div>
  );
}
