import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar.jsx";
import PageHeader from "../components/Navigation,Pageheader/PageHeader.jsx";
import DateContainer from "../components/Containers/DateContainer.jsx";
import ChoiceContainer from "../components/Containers/ChoiceContainer.jsx";
import StepIndicator from "../components/Progress/StepIndicator.jsx";
import Navigation from "../components/Navigation,Pageheader/Navigation.jsx";
import ErrorMessage from "../components/Forms/ErrorMessage.jsx";

import bunny from "../assets/images/bunny.svg";

export default function InformationNourrisson() {
  const [dateNaissance, setDateNaissance] = useState(null);
  const [poids, setPoids] = useState("");
  const [sexe, setSexe] = useState("");
  const [taille, setTaille] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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

    
    if (!poids.trim()) newErrors.poids = "Veuillez saisir le poids de naissance";
    if (!sexe.trim()) newErrors.sexe = "Veuillez choisir le sexe";
    if (!taille.trim()) newErrors.taille = "Veuillez saisir la taille de naissance";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      navigate("/photo-confirmation");
    }
  };

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
            onBack={() => navigate("/liste-famille")}
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
              onChange={(date) => {
                setDateNaissance(date);
                clearError("dateNaissance");
              }}
              noPadding
            />
           
          

          {/* Weight */}
          <div className="flex flex-col gap-1">
            <div>
              <label className="block mb-2 text-[16px] font-medium text-[#202124]">
                Poids de naissance en grammes
              </label>

              <div className="w-full flex">
                <div className="flex-1">
                  <div
                    className="
                      w-full
                      h-[45px]
                      rounded-[15px]
                      border
                      border-[#4E9F8A]
                      bg-white
                      px-4
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <input
                      type="text"
                      inputMode="numeric"
                      value={poids}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (/^\d*$/.test(raw)) {
                          setPoids(raw);
                          clearError("poids");
                        }
                      }}
                      placeholder="Ex : 3200"
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
                      g
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <ErrorMessage message={errors.poids} />
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-1">
            <ChoiceContainer
              label="Sexe"
              placeholder="Tapez pour choisir le sexe"
              options={[
                "Masculin",
                "Féminin",
              ]}
              value={sexe}
              onChange={(value) => {
                setSexe(value);
                clearError("sexe");
              }}
              noPadding
            />
            <ErrorMessage message={errors.sexe} />
          </div>

          {/* Height */}
          <div className="flex flex-col gap-1">
            <div>
              <label className="block mb-2 text-[16px] font-medium text-[#202124]">
                Taille de naissance en cm
              </label>

              <div className="w-full flex">
                <div className="flex-1">
                  <div
                    className="
                      w-full
                      h-[45px]
                      rounded-[15px]
                      border
                      border-[#4E9F8A]
                      bg-white
                      px-4
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <input
                      type="text"
                      inputMode="numeric"
                      value={taille}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (/^\d*$/.test(raw)) {
                          setTaille(raw);
                          clearError("taille");
                        }
                      }}
                      placeholder="Ex : 50"
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
                      cm
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <ErrorMessage message={errors.taille} />
          </div>

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
            onNext={handleNext}
          />
        </div>
      </main>
    </div>
  );
}
