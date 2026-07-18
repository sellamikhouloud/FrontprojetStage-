import { useState } from "react";

import Sidebar from "../components/Sidebar.jsx";
import PageHeader from "../components/PageHeader.jsx";
import DateContainer from "../components/DateContainer.jsx";
import Input from "../components/ContainerEcriture.jsx";
import ChoiceContainer from "../components/ChoiceContainer.jsx";
import StepIndicator from "../components/StepIndicator.jsx";
import Button from "../components/Button.jsx";
import { useNavigate } from "react-router-dom";
import Popup from "../components/SuccessPopup.jsx";

import successImage from "../assets/Success.svg"; 
import blackCamera from "../assets/blackCamera.svg";
import warning from "../assets/warning.svg";
import ArrowRight from "../assets/right-arrow.png";


export default function PhotoConfirmation() {
  const [dateProgramme, setDateProgramme] = useState(null);
  const [coordinateur, setCoordinateur] = useState("");
  const [relecture, setRelecture] = useState("");
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

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
              text-center
            "
          >
            Photo & confirmation
          </h1>

          {/* Photo Area */}
          <div
            className="
              w-full
              h-[180px]
              lg:h-[200px]

              border
              border-dashed
              border-[#89BFB1]

              rounded-[20px]

              flex
              flex-col
              items-center
              justify-center

              gap-3
              cursor-pointer
            "
          >
            <img
              src={blackCamera}
              alt="Camera"
              className="
                w-[45px]
                h-[45px]
                lg:w-[55px]
                lg:h-[55px]
              "
            />

            <span
              className="
                text-[16px]
                font-medium
                text-black
              "
            >
              Tapez pour prendre une photo
            </span>
          </div>

       
         {/* Warning */}
<div
  className="
    flex
    flex-col
    sm:flex-row
    items-center
    justify-center
    gap-2
  "
>
  <img
    src={warning}
    alt="Warning"
    className="w-[16px] h-[16px] lg:w-[20px] lg:h-[20px]"
  />

  <p
    className="
      text-[12px]
      lg:text-[16px]
      font-medium
      text-[#CC8409]
      text-center
      sm:text-left
    "
  >
    Aucune photo du nourrisson ne doit être prise ou stockée.
  </p>
</div>

          {/* Date */}
          <DateContainer
            label="Date d'entrée dans le programme"
            value={dateProgramme}
            onChange={setDateProgramme}
            noPadding
          />

          {/* Coordinator */}
          <Input
            label="Coordinateur à affecter"
            placeholder="Saisir l'identifiant du coordinateur"
            value={coordinateur}
            onChange={(e) => setCoordinateur(e.target.value)}
            noPadding
          />

          {/* Review */}
         <div
 
    onClick={() => navigate("/information-mere")}
  className="
    w-full
    h-[46px]
    border
    border-[#89BFB1]
    rounded-[15px]
    bg-white

    flex
    items-center
    justify-between

    px-4
    cursor-pointer

    transition-all
    duration-200
    hover:bg-[#F8FDFC]
  "
>
  <span
    className="
      text-[14px]
      lg:text-[16px]
      font-medium
      text-black
    "
  >
    Relecture des informations saisies
  </span>

  <img
    src={ArrowRight}
    alt="Arrow Right"
    className="w-[8px] h-[12px]"
  />
</div>

          {/* Steps */}
          <StepIndicator
            totalSteps={3}
            currentStep={3}
          />

          {/* Save Button */}
        <Button
  title="Enregistrer"
  variant="primary"
  noWrapperPadding
  onClick={() => setShowPopup(true)}
/>
{showPopup && (
  <Popup
    title="Enregistrer avec succès"
    image={successImage}
    id="GDK-2026-003"
    primaryButtonText="Voir la fiche de la famille"
    secondaryButtonText="Revenir à l'accueil"
    onPrimaryClick={() => navigate("/family")}
    onSecondaryClick={() => navigate("/")}
  />
)}
        </div>
      </main>
    </div>
  );
}