import { useState } from "react";

import Sidebar from "../components/Sidebar/Sidebar.jsx";
import PageHeader from "../components/Navigation,Pageheader/PageHeader.jsx";
import Input from "../components/Containers/ContainerEcriture.jsx";
import DateContainer from "../components/Containers/DateContainer.jsx";
import ChoiceContainer from "../components/Containers/ChoiceContainer";
import StepIndicator from "../components/Progress/StepIndicator.jsx";
import Navigation from "../components/Navigation,Pageheader/Navigation.jsx";

import CounterInput from "../components/Forms/CounterInput.jsx";
import ErrorMessage from "../components/Forms/ErrorMessage.jsx";

import motherbaby from "../assets/images/motherbaby.png";
import { useNavigate } from "react-router-dom";


export default function InformationMere() {

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [dateNaissance, setDateNaissance] = useState(null);
  const [situation, setSituation] = useState("");
  const [enfants, setEnfants] = useState(0);
  const [referent, setReferent] = useState("");
  const [observation, setObservation] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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

    if (!nom.trim()) newErrors.nom = "Veuillez saisir le nom";
    if (!prenom.trim()) newErrors.prenom = "Veuillez saisir le prénom";
    if (!dateNaissance) newErrors.dateNaissance = "Veuillez sélectionner la date de naissance";
    if (!situation.trim()) newErrors.situation = "Veuillez choisir la situation familiale";
    if (enfants === 0) newErrors.enfants = "Veuillez indiquer le nombre d'enfants";

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
      <div className="hidden md:block">
       <Sidebar role={role} />
      </div>

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
              value={nom}
              onChange={(e) => {
                setNom(e.target.value);
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
              value={prenom}
              onChange={(e) => {
                setPrenom(e.target.value);
                clearError("prenom");
              }}
              noPadding
            />
            <ErrorMessage message={errors.prenom} />
          </div>

          <div className="flex flex-col gap-1">
            <DateContainer
              label="Date de naissance"
              value={dateNaissance}
              onChange={(date) => {
                setDateNaissance(date);
                clearError("dateNaissance");
              }}
              noPadding
              defaultToToday={false}
            />
            <ErrorMessage message={errors.dateNaissance} />
          </div>

          <div className="flex flex-col gap-1">
            <Input
              label="Numéro de téléphone"
              placeholder="Saisir le numéro de téléphone"
              value={telephone}
              onChange={(e) => {
                setTelephone(e.target.value);
                clearError("telephone");
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
              value={situation}
              onChange={(value) => {
                setSituation(value);
                clearError("situation");
              }}
              noPadding
            />
            <ErrorMessage message={errors.situation} />
          </div>

        
            <Input
              label=""
              placeholder="Entrez le Référent médical"
              value={referent}
              onChange={(e) => {
                setReferent(e.target.value);
                
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
                  value={enfants}
                  mobileWidth="w-[80px]"
                  desktopWidth="lg:w-[200px]"
                  onIncrement={() => {
                    setEnfants((prev) => prev + 1);
                    clearError("enfants");
                  }}
                  onDecrement={() =>
                    setEnfants((prev) => Math.max(0, prev - 1))
                  }
                />
              </div>
            </div>
            <ErrorMessage message={errors.enfants} />
          </div>

          <Input
            label="Informations complémentaires"
            placeholder="Entrez les informations complémentaires ici"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
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
