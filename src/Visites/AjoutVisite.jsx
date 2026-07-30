import Sidebar from "../components/Sidebar/Sidebar";
import PageHeader from "../components/Navigation,Pageheader/PageHeader";
import Card from "../components/Cards/Card";
import CardPopup from "../components/Cards/Card2";
import OptionsMenu from "../components/Containers/OptionsMenu";
import SelectorWithAction from "../components/Forms/SelectorWithAction";
import { useState } from "react";
import AlertBox from "../components/AlertComposant/AlertBox"

// A creer plus tard : composants specifiques a la visite
// import AlerteVisiteEnRetard from "../components/Visite/AlerteVisiteEnRetard";

// import StatutCalcule from "../components/Visite/StatutCalcule";
// import MesuresNourrisson from "../components/Visite/MesuresNourrisson";
// import MesuresMere from "../components/Visite/MesuresMere";
// import ObservationsCliniquesNourrisson from "../components/Visite/ObservationsCliniquesNourrisson";
// import ObservationsCliniquesMere from "../components/Visite/ObservationsCliniquesMere";
// import EvaluationVisuelle from "../components/Visite/EvaluationVisuelle";

import { useNavigate } from "react-router-dom";
import DateContainer from "../components/Containers/DateContainer";
import Button from "../components/Button/Button";

import PopupListeFamilles from "../components/Popups/PopupListeFamilles";

import Popup from "../components/Popups/SuccessPopup";
import SuccessImage from "../assets/Success.svg";
import { useLocation } from "react-router-dom";

export default function AjoutVisite() {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const location = useLocation();
  const draft = location.state?.draft;

  const [selectedFamille, setSelectedFamille] = useState(
    draft?.selectedFamille || null
  );
  const [date, setDate] = useState(draft?.date ? new Date(draft.date) : new Date());

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
          from: "/ajout-visite",
          draft: { selectedFamille, date },
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

        {/* TODO: composant "Alerte visite en retard" (bandeau orange, specifique a cette page) */}
        {/* <AlerteVisiteEnRetard derniereVisite="15/05/2026" /> */}
        <AlertBox variant="warning">
  <div className="flex items-center justify-between w-full">
    <span className="font-semibold text-[#CC8409]">Visite en retard</span>
    <span className="text-[13px] text-[#CC8409]">
      Dernière visite le 15/05/2026 (il y a 36 jours).
    </span>
  </div>
</AlertBox>

        
        {/* Main content */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-4">
            {!selectedFamille && (
          <SelectorWithAction
            label="Choisir la famille concerne"
            description="Cliquer pour rechercher la famille concerne par la distribution"
            onAction={handleSearch}
          />
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-2 items-end">
                <DateContainer value={date} onChange={setDate} noPadding />

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

            {/* TODO: composant "Mesures nourrisson" (Poids / Taille / MUAC + badges P/A, T/A, P/T) */}
            {/* <MesuresNourrisson /> */}

            {/* TODO: composant "Observations cliniques nourrisson" */}
            {/* <ObservationsCliniquesNourrisson /> */}
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4">
            {/* TODO: composant "Statut calcule" (badges MAM nourrisson / Mere normale) */}
            {/* <StatutCalcule /> */}

            {/* TODO: composant "Mesures mere" (Poids / MUAC) */}
            {/* <MesuresMere /> */}

            {/* TODO: composant "Observations cliniques mere" */}
            {/* <ObservationsCliniquesMere /> */}

            {/* TODO: composant "Evaluation visuelle de la situation familiale" */}
            {/* <EvaluationVisuelle /> */}
          </div>
        </div>

        {/* Save button */}
        <div className="mt-2">
          <Button
            title="Enregistrer"
            variant="save"
            noPadding
            onClick={() => setShowSuccessPopup(true)}
          />
        </div>

        {showSuccessPopup && (
          <Popup
            title="Visite enregistrée avec succès"
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
        }}
      />
    </div>
  );
}