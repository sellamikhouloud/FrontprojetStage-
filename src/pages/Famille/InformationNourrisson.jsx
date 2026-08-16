import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader.jsx";
import DateContainer from "../../components/Containers/DateContainer.jsx";
import ChoiceContainer from "../../components/Containers/ChoiceContainer.jsx";
import StepIndicator from "../../components/Progress/StepIndicator.jsx";
import Navigation from "../../components/Navigation,Pageheader/Navigation.jsx";
import ErrorMessage from "../../components/Forms/ErrorMessage.jsx";
import Input from "../../components/Containers/ContainerEcriture.jsx";

import bunny from "../../assets/images/bunny.svg";
import { useFamilyForm } from "../../context/FamilyFormContext";

export default function InformationNourrisson() {
  const [errors, setErrors] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { formData, updateNourrisson } = useFamilyForm();
 if (!formData) return null;

const nourrissons = Array.isArray(formData.nourrissons) && formData.nourrissons.length
  ? formData.nourrissons
  : [{}];

  
  const total = nourrissons.length;
  const nourrisson = nourrissons[currentIndex] || {};

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

    if (!nourrisson.prenom?.trim()) {
      newErrors.prenom = "Veuillez saisir le prénom";
    }
    if (!nourrisson.poids_naissance?.trim()) {
      newErrors.poids_naissance = "Veuillez saisir le poids de naissance";
    }
    if (!nourrisson.sexe?.trim()) {
      newErrors.sexe = "Veuillez choisir le sexe";
    }
    if (!nourrisson.taille_naissance?.trim()) {
      newErrors.taille_naissance = "Veuillez saisir la taille de naissance";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (currentIndex < total - 1) {
      // Encore des enfants à saisir : on reste sur cette page, enfant suivant
      setCurrentIndex((i) => i + 1);
      setErrors({});
    } else {
      navigate("/photo-confirmation");
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setErrors({});
    } else {
      window.history.back();
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

          {total > 1 && (
            <p className="text-[14px] lg:text-[16px] font-medium text-[#4E9F8A] text-center">
              Enfant {currentIndex + 1} sur {total}
            </p>
          )}

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

          <div className="flex flex-col gap-1">
            <Input
              label="Prénom"
              placeholder="Saisir le prénom"
              value={nourrisson.prenom || ""}
              onChange={(e) => {
                updateNourrisson(currentIndex, { prenom: e.target.value });
                clearError("prenom");
              }}
              noPadding
            />
            <ErrorMessage message={errors.prenom} />
          </div>

          {/* Date */}
          <DateContainer
            label="Date de naissance"
            value={nourrisson.date_naissance || null}
            onChange={(date) => {
              updateNourrisson(currentIndex, { date_naissance: date });
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
                      value={nourrisson.poids_naissance || ""}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (/^\d*$/.test(raw)) {
                          updateNourrisson(currentIndex, { poids_naissance: raw });
                          clearError("poids_naissance");
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
            <ErrorMessage message={errors.poids_naissance} />
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-1">
            <ChoiceContainer
              label="Sexe"
              placeholder="Tapez pour choisir le sexe"
              options={[
                { label: "Masculin", value: "M" },
                { label: "Féminin", value: "F" },
              ]}
              value={nourrisson.sexe || ""}
              onChange={(value) => {
                updateNourrisson(currentIndex, { sexe: value });
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
                      value={nourrisson.taille_naissance || ""}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (/^\d*$/.test(raw)) {
                          updateNourrisson(currentIndex, { taille_naissance: raw });
                          clearError("taille_naissance");
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
            <ErrorMessage message={errors.taille_naissance} />
          </div>

          {/* Step Indicator */}
          <StepIndicator totalSteps={3} currentStep={2} />

          {/* Navigation */}
          <Navigation
            showBack
            nextText={currentIndex < total - 1 ? "Enfant suivant" : "Suivant"}
            onBack={handleBack}
            onNext={handleNext}
          />
        </div>
      </main>
    </div>
  );
}
