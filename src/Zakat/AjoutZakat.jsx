import Sidebar from "../components/Sidebar/Sidebar";
import PageHeader from "../components/Navigation,Pageheader/PageHeader";
import Card from "../components/Cards/Card";
import CardPopup from "../components/Cards/Card2";
import OptionsMenu from "../components/Containers/OptionsMenu";
import SelectorWithAction from "../components/Forms/SelectorWithAction";
import { useState } from "react";

import SelectInput from "../components/Containers/ChoiceContainer";
import TextArea from "../components/Containers/Textarea";
import ErrorMessage from "../components/Forms/ErrorMessage";

// import MotifSelection from "../components/Zakat/MotifSelection";

import { useNavigate } from "react-router-dom";
import DateContainer from "../components/Containers/DateContainer";
import InfoHeader from "../components/Containers/InfoBanner";
import Button from "../components/Button/Button";

import PopupListeFamilles from "../components/Popups/PopupListeFamilles";

import ConfirmationForm from "../components/Forms/ConfirmationForm";

import Popup from "../components/Popups/SuccessPopup";
import SuccessImage from "../assets/Success.svg";
import { useLocation } from "react-router-dom";

export default function AjoutZakat() {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const location = useLocation();
  const draft = location.state?.draft;

  const [selectedFamille, setSelectedFamille] = useState(
    draft?.selectedFamille || null
  );
  const [date, setDate] = useState(draft?.date ? new Date(draft.date) : new Date());
  const [confirmed, setConfirmed] = useState(draft?.confirmed || false);

  const [montant, setMontant] = useState(draft?.montant || "");
  const [modePaiement, setModePaiement] = useState(draft?.modePaiement || null);

  const TAUX_MRU_EUR = 0.0249; // from database apres
  const montantEnEur = montant
    ? (parseFloat(montant) * TAUX_MRU_EUR).toFixed(2)
    : "0.00";

  const [causePrincipale, setCausePrincipale] = useState(draft?.causePrincipale || null);
  const [precisions, setPrecisions] = useState(draft?.precisions || "");
  const [observations, setObservations] = useState(draft?.observations || "");

  // --- ERROR HANDLING ---
  const [errors, setErrors] = useState({
    famille: false,
    montant: false,
    modePaiement: false,
    causePrincipale: false,
    confirmed: false, 
  });

  const validateForm = () => {
    const newErrors = {
      famille: !selectedFamille,
      montant: !montant || parseFloat(montant) <= 0,
      modePaiement: !modePaiement,
      causePrincipale: !causePrincipale,
      confirmed: !confirmed,  
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSave = () => {
    if (!validateForm()) return;
    setShowSuccessPopup(true);
  };

  // Chaque onChange nettoie son propre message d'erreur immediatement
  const handleMontantChange = (raw) => {
    if (/^\d*$/.test(raw)) {
      setMontant(raw);
      if (raw && parseFloat(raw) > 0) {
        setErrors((prev) => ({ ...prev, montant: false }));
      }
    }
  };

  const handleModePaiementChange = (value) => {
    setModePaiement(value);
    setErrors((prev) => ({ ...prev, modePaiement: false }));
  };

  const handleCausePrincipaleChange = (value) => {
    setCausePrincipale(value);
    setErrors((prev) => ({ ...prev, causePrincipale: false }));
  };

  const handleConfirmedChange = (e) => {
  const isChecked = e.target.checked;
  setConfirmed(isChecked);
  if (isChecked) {
    setErrors((prev) => ({ ...prev, confirmed: false }));
  }
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
          from: "/ajout-zakat",
          draft: { selectedFamille, date, confirmed },
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop fixed sidebar */}
      <div
        className="
          hidden
          lg:flex
          fixed
          inset-y-0
          left-4
          items-center
          z-50
        "
      >
        <Sidebar role="admin" />
      </div>

      {/* Mobile sidebar (hamburger) */}
      <div className="lg:hidden">
        <Sidebar role="admin" />
      </div>

      {/* Mobile fixed white header */}
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

          lg:ml-24
        "
      >
        {/* Header */}
        <div className="mb-0 lg:mb-6">
          <PageHeader
            leftTitle="Annuler"
            showRight={false}
            onBack={() => window.history.back()}
          />
        </div>

        {!selectedFamille && (
          <>
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
          </>
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
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-4">
            {selectedFamille && (
          <>
            
            <InfoHeader title="Dernière zakat" value="15/05/2026" />
          </>
          )}
            {/* Date + Zakat number */}
            <div className="flex flex-col gap-0">
              <h3
                className="
                  text-[16px]
                  lg:text-[18px]
                  font-semibold
                  text-[#202124]
                "
              >
                Date Zakat
              </h3>

              <div
  className={`
    grid
    grid-cols-1
    ${selectedFamille ? "lg:grid-cols-2" : "lg:grid-cols-1"}
    gap-3
    lg:gap-2
    items-end
  `}
>
                <DateContainer value={date} onChange={setDate} noPadding />
{selectedFamille && (
          <>
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
                      Zakat numero 03
                    </p>

                  </div>
                </div>
                </>
                )}
              </div>
            </div>

            {/* Informations du versement */}
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
              {/* Title */}
              <h2 className="text-[20px] font-bold text-[#346A5C] mb-2">
                Informations du versement
              </h2>

              {/* Montant */}
              
              <div className="mb-1">
                <label className="block mb-2 text-[16px] font-medium text-[#000000]">
                  Montant (MRU)
                </label>

                <div className="w-full flex">
                  <div className="flex-1">
                    <div className="flex flex-col gap-2">
                    <div
                      className={`
                        w-full
                        h-[45px]
                        rounded-[15px]
                        border
                        bg-white
                        px-4
                        flex
                        items-center
                        gap-2
                        ${errors.montant ? "border-[#EF4444]" : "border-[#4E9F8A]"}
                      `}
                    >
                       
                      <input
                        type="text"
                        inputMode="numeric"
                        value={montant}
                        onChange={(e) => handleMontantChange(e.target.value)}
                        placeholder="Ex : 5000"
                        className="
                          flex-1
                          w-full
                          text-[14px]
                          sm:text-[15px]
                          lg:text-[16px]
                          text-black
                          placeholder:text-gray-400
                          bg-transparent
                          focus:outline-none
                        "
                      />
                      <span
                        className="
                          text-[14px]
                          sm:text-[15px]
                          lg:text-[16px]
                          font-medium
                          text-[#4E9F8A]
                          select-none
                        "
                      >
                        MRU
                      </span>
                    </div>

                    {!errors.montant && (
                      <p className="mt-1 text-[12px] text-gray-400">
                        ≈ {montantEnEur} EUR (Taux du jour)
                      </p>
                    )}
                    <ErrorMessage
                      message={errors.montant ? "Veuillez saisir un montant valide" : null}
                    />
                    </div>
                     
                  </div>
                </div>
              </div>

              {/* Mode de paiement */}
              <div className="mt-3">
                <label className="block mb-0 text-[16px] font-medium text-[#000000]">
                  Mode de paiement
                </label>

                <div className="w-full flex">
                  <div className="flex-1">
                    <div className="flex flex-col gap-2">
                    <SelectInput
                      noPadding
                      value={modePaiement}
                      onChange={handleModePaiementChange}
                      placeholder="Tapez pour choisir le mode de paiment"
                      error={errors.modePaiement}
                      options={[
                        { value: "especes", label: "Espèces" },
                        { value: "bankily", label: "Transfert mobile (Bankily)" },
                      ]}
                    />
                    <ErrorMessage
                      message={
                        errors.modePaiement ? "Veuillez choisir un mode de paiement" : null
                      }
                    />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Temporary confirmation */}
            <div className="hidden lg:block">
             <ConfirmationForm
  checked={confirmed}
  onChange={handleConfirmedChange}
  error={errors.confirmed}
  errorMessage="Veuillez confirmer la remise avant d'enregistrer"
/>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4">
            {/* Motif de selection */}
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
              {/* Title */}
              <h2 className="text-[20px] font-bold text-[#346A5C] mb-2">
                Motif de sélection
              </h2>

              {/* Cause principale */}
              <div className="mb-4">
                <label className="block mb-0 text-[16px] font-medium text-[#000000]">
                  Cause principale
                </label>

                <div className="w-full flex">
                  <div className="flex-1">
                    <div className="flex flex-col gap-2">
                    <SelectInput
                      noPadding
                      value={causePrincipale}
                      onChange={handleCausePrincipaleChange}
                      placeholder="Tapez pour choisir la cause principale"
                      error={errors.causePrincipale}
                      options={[
                        { value: "veuvage", label: "Veuvage" },
                        { value: "urgence", label: "Situation d'urgence" },
                        { value: "vulnerabilite", label: "Vulnérabilité extrême" },
                        { value: "autre", label: "Autre" },
                      ]}
                    />
                    <ErrorMessage
                      message={
                        errors.causePrincipale ? "Veuillez choisir une cause principale" : null
                      }
                    />
                    </div>
                  </div>
                </div>
              </div>

              {/* Precisions */}
              <TextArea
                label="Précisions (optionnel)"
                placeholder="Tapez ici si il y a des précisions"
                value={precisions}
                onChange={(e) => setPrecisions(e.target.value)}
                height="h-[99px]"
              />
            </div>

            {/* Observations complementaires */}
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
              <h2 className="text-[20px] font-bold text-[#346A5C] mb-2">
                Observations complémentaires
              </h2>

              <TextArea
                label=""
                placeholder="Tapez ici si il y a des observations complémentaires"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                height="h-[98px]"
              />
            </div>

            {/* Mobile only */}
            <div className="mt-4 lg:hidden">
             <ConfirmationForm
  checked={confirmed}
  onChange={handleConfirmedChange}
  error={errors.confirmed}
  errorMessage="Veuillez confirmer la remise avant d'enregistrer"
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
            title="Zakat enregistrée avec succès"
            image={SuccessImage}
            primaryButtonText="Voir la fiche famille"
            secondaryButtonText="Revenir à l'accueil"
            onPrimaryClick={() => {
              setShowSuccessPopup(false);
              navigate(`/famille/${selectedFamille?.id}`);
            }}
            onSecondaryClick={() => {
              setShowSuccessPopup(false);
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
