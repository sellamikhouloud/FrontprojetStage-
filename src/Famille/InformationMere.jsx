import { useState } from "react";

import Sidebar from "../components/Sidebar/Sidebar.jsx";
import PageHeader from "../components/Navigation,Pageheader/PageHeader.jsx";
import Input from "../components/Containers/ContainerEcriture.jsx";
import DateContainer from "../components/Containers/DateContainer.jsx";
import ChoiceContainer from "../components/Containers/ChoiceContainer";
import StepIndicator from "../components/Progress/StepIndicator.jsx";
import Navigation from "../components/Navigation,Pageheader/Navigation.jsx";

import CounterInput from "../components/Forms/CounterInput.jsx";

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
const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden bg-white">
  {/* Sidebar */}
    <div className="hidden md:block">
       <Sidebar role="admin" />
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
        onBack={() => window.history.back()}
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

<Input
  label="Nom"
  placeholder="Saisir le nom"
  value={nom}
  onChange={(e) => setNom(e.target.value)}
  noPadding
/>

<Input
  label="Prénom"
  placeholder="Saisir le prénom"
  value={prenom}
  onChange={(e) => setPrenom(e.target.value)}
  noPadding
/>


<DateContainer
  label="Date de naissance"
  value={dateNaissance}
  onChange={setDateNaissance}
  noPadding
/>

<Input
  label="Numéro de téléphone"
  placeholder="Saisir le numéro de téléphone"
  value={telephone}
  onChange={(e) => setTelephone(e.target.value)}
  noPadding
/>
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
  onChange={setSituation}
  noPadding
/>
<Input
  label=""
  placeholder="Entrez le Référent médical"
  value={referent}
  onChange={(e) => setReferent(e.target.value)}
  noPadding
/>
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
      onIncrement={() => setEnfants((prev) => prev + 1)}
      onDecrement={() => setEnfants((prev) => Math.max(0, prev - 1))}
    />
  </div>
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
  onNext={() => navigate("/information-nourrisson")}
/>
  </div>
</main>
    </div>
  );
}