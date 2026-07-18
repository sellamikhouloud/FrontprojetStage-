import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar.jsx";
import PageHeader from "../components/Navigation,Pageheader/PageHeader.jsx";
import Input from "../components/Containers/ContainerEcriture.jsx";
import DateContainer from "../components/Containers/DateContainer.jsx";
import ChoiceContainer from "../components/Containers/ChoiceContainer.jsx";
import StepIndicator from "../components/Progress/StepIndicator.jsx";
import Navigation from "../components/Navigation,Pageheader/Navigation.jsx";

import bunny from "../assets/images/bunny.svg"; 

export default function InformationNourrisson() {
  const [dateNaissance, setDateNaissance] = useState(null);
  const [poids, setPoids] = useState("");
  const [sexe, setSexe] = useState("");
  const [taille, setTaille] = useState("");
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

          {/* Title */}
          <h1
            className="
              text-[20px]
              lg:text-[24px]
              font-bold
              text-black
              text-center
            "
          >
            Information sur le nourrisson
          </h1>

          {/* Illustration */}
          <div className="flex justify-center">
            <img
              src={bunny}
              alt="Illustration nourrisson"
              className="
                w-[90px]
                h-[126px]
                lg:w-[140px]
                lg:h-[196px]
              "
            />
          </div>

          {/* Date */}
          <DateContainer
            label="Date de naissance"
            value={dateNaissance}
            onChange={setDateNaissance}
            noPadding
          />

          {/* Weight */}
          <Input
            label="Poids de naissance en grammes"
            placeholder="Entrez le poids de naissance ici"
            value={poids}
            onChange={(e) => setPoids(e.target.value)}
            noPadding
          />

          {/* Gender */}
          <ChoiceContainer
            label="Sexe"
            placeholder="Tapez pour choisir le sexe"
            options={[
              "Masculin",
              "Féminin",
            ]}
            value={sexe}
            onChange={setSexe}
            noPadding
          />

          {/* Height */}
          <Input
            label="Taille de naissance en cm"
            placeholder="Entrez la taille de naissance ici"
            value={taille}
            onChange={(e) => setTaille(e.target.value)}
            noPadding
          />

          {/* Step Indicator */}
          <StepIndicator
            totalSteps={3}
            currentStep={2}
          />

          {/* Navigation */}
         
          <Navigation
          showBack
            nextText="Suivant"
             onBack={() => window.history.back()}
              onNext={() => navigate("/photo-confirmation")}
          />
        </div>
      </main>
    </div>
  );
}