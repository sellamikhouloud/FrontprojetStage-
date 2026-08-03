import Sidebar from "../components/Sidebar/Sidebar";
import PageHeader from "../components/Navigation,Pageheader/PageHeader";
import Card from "../components/Cards/Card";
import CardPopup from "../components/Cards/Card2";
import OptionsMenu from "../components/Containers/OptionsMenu";
import SelectorWithAction from "../components/Forms/SelectorWithAction";
import { useState } from "react";
import AlertBox from "../components/AlertComposant/AlertBox";
import MesureInput from "../components/Containers/MesureInput";
import TextArea from "../components/Containers/Textarea";
import SelectInput from "../components/Containers/ChoiceContainer";
import ErrorMessage from "../components/Forms/ErrorMessage";
import StatusBadge from "../components/Cards/Badge";
import ZScoreBox from "../components/Containers/ZScoreBox";

import { useNavigate } from "react-router-dom";
import DateContainer from "../components/Containers/DateContainer";
import Button from "../components/Button/Button";

import PopupListeFamilles from "../components/Popups/PopupListeFamilles";

import Popup from "../components/Popups/SuccessPopup";
import SuccessImage from "../assets/Success.svg";
import { useLocation } from "react-router-dom";

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


  const handleSave = () => {
    if (!validateForm()) return;

    // 🔧 DONNÉES FACTICES POUR TEST UI — à retirer une fois l'API branchée
    setResultatVisite({
      zScores: { pa: -0.8, ta: -2.4, pt: -2.1 },
      statutNourrisson: { type: "mam", label: "MAM nourrisson" },
      statutMere: { type: "mereNormal", label: "Mère normale" },
    });
    setShowSuccessPopup(true);
  };

 

  // --- Handlers qui nettoient l'erreur au fur et à mesure ---
  const handleMoisChange = (value) => {
    setMois(value);
    setErrors((prev) => ({ ...prev, mois: false }));
  };

  const handleNumeroCycleChange = (value) => {
    setNumeroCycle(value);
    if (value) setErrors((prev) => ({ ...prev, numeroCycle: false }));
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

  const listeDesFamilles = [
    {
      id: 1,
      enfant: "Aïcha Mint Mohamed",
      sexe: "Fille",
      region: "Lexeiba",
      naissance: "12 mars 2026",
      code: "GDK-2026-003",
      badges: [
        { type: "mam", text: "MAM nourrisson" },
        { type: "mere", text: "Mère normale" },
        { type: "retard", text: "Visite en retard" },
      ],
    },
    {
      id: 2,
      enfant: "Aïcha Mint Mohamed",
      sexe: "Garçon",
      region: "Lexeiba",
      naissance: "22 mars 2025",
      code: "GDK-2026-003",
      badges: [
        { type: "mas", text: "MAS nourrisson" },
        { type: "mere", text: "Mère normale" },
        { type: "retard", text: "Visite en retard" },
      ],
    },
    {
      id: 3,
      enfant: "Aïcha Mint Mohamed",
      sexe: "Fille",
      region: "Lexeiba",
      naissance: "12 mars 2026",
      code: "GDK-2026-003",
      badges: [
        { type: "mam", text: "MAM nourrisson" },
        { type: "mere", text: "Mère normale" },
      ],
    },
  ];

  const [openFamilles, setOpenFamilles] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);

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
          },
        },
      });
    }
  };

  return (
  <div className="min-h-screen bg-white lg:flex">
  {/* Desktop sidebar — in flex flow, but pinned via sticky */}
  <div
    className="
      hidden
      lg:flex
      lg:sticky
      lg:top-0
      lg:h-screen
      lg:items-center
      lg:py-0
      lg:pl-0
      lg:shrink-0
    "
  >
    <Sidebar role="coordinator" />
  </div>

  {/* Mobile sidebar (hamburger) — unchanged */}
  <div className="lg:hidden">
    <Sidebar role="coordinator" />
  </div>

  {/* Mobile fixed white header — unchanged */}
  <div
    className="
      fixed
      top-0
      left-0
      right-0
      h-20
      bg-white
      z-40
      lg:hidden
    "
  />

  {/* Page content */}
  <main
    className="
      flex-1
      overflow-y-auto
      bg-white

      pt-20
      lg:pt-4

      px-4
      lg:px-10

      pb-8
      lg:pb-2
    "
  >
        {/* Header */}
        <div className="mb-3 lg:mb-6">
          <PageHeader
            leftTitle="Annuler"
            showRight={false}
            onBack={() => window.history.back()}
          />
        </div>

        <div className="mb-4">
          {selectedFamille?.badges?.some((b) => b.type === "retard") && (
           <AlertBox variant="warning">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-0 sm:gap-0">
    <span className="font-bold text-[#78350F]">Visite en retard</span>
    <span className="text-[13px] text-[#92400E]">
      Dernière visite le 15/05/2026 (il y a 36 jours).
    </span>
  </div>
</AlertBox>
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
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
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

              <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-2 items-start">
                {/* Numero de cycle - saisie numerique */}
                <div className="flex flex-col gap-1 w-full">
                  <div
                    className={`
                      h-[45px]
                      w-full
                      rounded-[15px]
                      border
                      ${numeroCycle ? "border-[#4E9F8A]" : "border-[#E5E7EB]"}
                      bg-white
                      px-4
                      flex
                      items-center
                      gap-2
                    `}
                  >
                    <span
                      className="
                        text-[14px]
                        leading-[20px]
                        font-medium
                        text-[#4E9F8A]
                        select-none
                        shrink-0
                      "
                    >
                      Cycle N°
                    </span>

                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="--"
                      value={numeroCycle}
                      onChange={(e) => handleNumeroCycleChange(e.target.value)}
                      className="
                        flex-1
                        w-full
                        min-w-0
                        bg-transparent
                        text-[14px]
                        leading-[20px]
                        text-[#374151]
                        placeholder:text-[#9CA3AF]
                        outline-none
                        [appearance:textfield]
                        [&::-webkit-outer-spin-button]:appearance-none
                        [&::-webkit-inner-spin-button]:appearance-none
                      "
                    />
                  </div>
                  <ErrorMessage
                    message={
                      errors.numeroCycle ? "Veuillez saisir le numéro de cycle" : null
                    }
                  />
                </div>

                {/* Visite numero - affichage seulement */}
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
                      Visite numero 03
                    </p>
                  </div>
                </div>
              </div>
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
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="flex flex-col gap-1">
                  <MesureInput
                    label="Poids"
                    unit="g"
                    value={poidsMere}
                    onChange={(e) => handlePoidsMereChange(e.target.value)}
                  />
                  <ErrorMessage message={errors.poidsMere ? "Requis" : null} />
                </div>
                <div className="flex flex-col gap-1">
                  <MesureInput
                    label="Taille"
                    unit="cm"
                    value={tailleMere}
                    onChange={(e) => handleTailleMereChange(e.target.value)}
                  />
                  <ErrorMessage message={errors.tailleMere ? "Requis" : null} />
                </div>
                <div className="flex flex-col gap-1">
                  <MesureInput
                    label="MUAC"
                    unit="mm"
                    value={muacMere}
                    onChange={(e) => handleMuacMereChange(e.target.value)}
                  />
                  <ErrorMessage message={errors.muacMere ? "Requis" : null} />
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
                height="h-[110px]"
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
                height="h-[115px]"
                bgColor="bg-white"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="mt-2">
          <Button
            title="Enregistrer"
            variant="save"
            noPadding
            onClick={handleSave}
          />
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
      </main>

      <PopupListeFamilles
        open={openFamilles}
        onClose={() => setOpenFamilles(false)}
        familles={listeDesFamilles}
        onSelectFamille={(famille) => {
          setSelectedFamille(famille);
          setOpenFamilles(false);
          setErrors((prev) => ({ ...prev, famille: false }));
        }}
      />
    </div>
  );
}
