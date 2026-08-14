import { useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader.jsx";
import Input from "../../components/Containers/ContainerEcriture.jsx";
import DateContainer from "../../components/Containers/DateContainer.jsx";
import ChoiceContainer from "../../components/Containers/ChoiceContainer";
import StepIndicator from "../../components/Progress/StepIndicator.jsx";
import Navigation from "../../components/Navigation,Pageheader/Navigation.jsx";

import CounterInput from "../../components/Forms/CounterInput.jsx";
import ErrorMessage from "../../components/Forms/ErrorMessage.jsx";

import motherbaby from "../../assets/images/motherbaby.png";
import { useNavigate } from "react-router-dom";
import { useFamilyForm } from "../../context/FamilyFormContext";


export default function InformationMere() {


  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { formData, updateMere } = useFamilyForm();

  const mere = formData.mere;

  // Efface l'erreur d'un champ précis
  const clearError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const handleNext = () => {
  const newErrors = {};

  if (!mere.nom?.trim()) {
    newErrors.nom = "Veuillez saisir le nom";
  }

  if (!mere.prenom?.trim()) {
    newErrors.prenom = "Veuillez saisir le prénom";
  }

  if (!mere.date_naissance) {
    newErrors.dateNaissance =
      "Veuillez sélectionner la date de naissance";
  }

  if (!mere.statut_matrimonial?.trim()) {
    newErrors.situation =
      "Veuillez choisir la situation familiale";
  }

  if (!mere.nb_enfants || mere.nb_enfants === 0) {
    newErrors.enfants =
      "Veuillez indiquer le nombre d'enfants";
  }

  if (!mere.village) {
    newErrors.village =
      "Veuillez choisir le village";
  }

  if (!mere.motif_prise_en_charge?.trim()) {
    newErrors.motifPriseEnCharge =
      "Veuillez saisir le motif de prise en charge";
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
    navigate("/information-nourrisson");
  }
};
    // Simulation du rôle — à remplacer plus tard par le vrai contexte d'auth
const role = "admin";
// const role = "coordinateur"; 
const isAdmin = role === "admin";

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
    
       <Sidebar role={role} />
    

      {/* Main Content */}
      <main
        className="
          flex-1
          overflow-y-auto
          px-5
          pt-5
          pb-8
          lg:p-10
          bg-white
        "
      >
        <div className="flex flex-col gap-[14px] lg:gap-[18px]">
          {/* Header */}
          <PageHeader
            leftTitle="Annuler"
            showRight={false}
            onBack={() => navigate("/liste-famille")}
          />

          {/* Page Title */}
          <h1
            className="
              text-[20px]
              lg:text-[24px]
              font-bold
              text-black
              font-jakarta
              text-center
            "
          >
            Information sur la mère
          </h1>

          {/* Illustration */}
          <div className="flex justify-center">
            <img
              src={motherbaby}
              alt="Illustration mère et bébé"
              className="
                w-[90px]
                h-[126px]
                lg:w-[140px]
                lg:h-[196px]
              "
            />
          </div>

          {/* Informations sur la mère */}

          <div className="flex flex-col gap-1">
            <Input
              label="Nom"
              placeholder="Saisir le nom"
              value={mere.nom || ""}
              onChange={(e) => {
              updateMere({
              nom: e.target.value,
             });
             clearError("nom");
            }}
              noPadding
            />
            <ErrorMessage message={errors.nom} />
          </div>

          <div className="flex flex-col gap-1">
            <Input
              label="Prénom"
              placeholder="Saisir le prénom"
             value={mere.prenom || ""}
onChange={(e) => {
  updateMere({
    prenom: e.target.value,
  });
  clearError("prenom");
}}
              noPadding
            />
            <ErrorMessage message={errors.prenom} />
          </div>

          <div className="flex flex-col gap-1">
            <DateContainer
              label="Date de naissance"
             value={mere.date_naissance || null}
onChange={(date) => {
  updateMere({
    date_naissance: date,
  });
  clearError("dateNaissance");
}}
              noPadding
              defaultToToday={false}
            />
            <ErrorMessage message={errors.dateNaissance} />
          </div>

          <div className="flex flex-col gap-1">
  <ChoiceContainer
    label="Village"
    placeholder="Tapez pour choisir le village"
    options={[
      "Village 1",
      "Village 2",
      "Village 3",
      "Village 4",
    ]}
   value={mere.village || ""}
onChange={(value) => {
  updateMere({
    village: value,
  });
  clearError("village");
}}
    noPadding
  />

  <ErrorMessage message={errors.village} />
</div>

          <div className="flex flex-col gap-1">
            <Input
              label="Numéro de téléphone"
              placeholder="Saisir le numéro de téléphone"
             value={mere.telephone || ""}
onChange={(e) => {
  updateMere({
    telephone: e.target.value,
  });
}}
              noPadding
            />
            
          </div>

          <div className="flex flex-col gap-1">
            <ChoiceContainer
              label="Situation familiale"
              placeholder="Tapez pour choisir le status matrimonial"
              options={[
                "Mariée",
                "Célibataire",
                "Divorcée",
                "Veuve",
              ]}
              value={mere.statut_matrimonial || ""}
onChange={(value) => {
  updateMere({
    statut_matrimonial: value,
  });
  clearError("situation");
}}
              noPadding
            />
            <ErrorMessage message={errors.situation} />
          </div>
          <div className="flex flex-col gap-1">
  <Input
    label="Motif de prise en charge"
    placeholder="Entrez le motif de prise en charge"
   value={mere.motif_prise_en_charge || ""}
onChange={(e) => {
  updateMere({
    motif_prise_en_charge: e.target.value,
  });
  clearError("motifPriseEnCharge");
}}
    noPadding
  />

  <ErrorMessage message={errors.motifPriseEnCharge} />
</div>

        
            <Input
              label=""
              placeholder="Entrez le Référent médical"
             value={mere.referent_medical || ""}
onChange={(e) => {
  updateMere({
    referent_medical: e.target.value,
  });
}}
              noPadding
            />
       

          <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-2">
              <label
                className="
                  text-[14px]
                  lg:text-[16px]
                  font-semibold
                  text-black
                "
              >
                Nombre d'enfants à saisir
              </label>

              <div className="flex justify-center">
                <CounterInput
                  value={mere.nb_enfants || 0}
                  mobileWidth="w-[80px]"
                  desktopWidth="lg:w-[200px]"
                 onIncrement={() => {
  updateMere({
    nb_enfants: (mere.nb_enfants || 0) + 1,
  });
  clearError("enfants");
}}
                  onDecrement={() => {
  updateMere({
    nb_enfants: Math.max(0, (mere.nb_enfants || 0) - 1),
  });
}}
                />
              </div>
            </div>
            <ErrorMessage message={errors.enfants} />
          </div>

          <Input
            label="Informations complémentaires"
            placeholder="Entrez les informations complémentaires ici"
            value={mere.informations_complementaires || ""}
onChange={(e) => {
  updateMere({
    informations_complementaires: e.target.value,
  });
}}
            noPadding
          />

          <StepIndicator
            totalSteps={3}
            currentStep={1}
          />

          <Navigation
            showBack={false}
            nextText="Suivant"
            onNext={handleNext}
          />
        </div>
      </main>
    </div>
  );
}
