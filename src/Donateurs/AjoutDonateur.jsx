import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import PageHeader from "../components/Navigation,Pageheader/PageHeader";
import Input from "../components/Containers/ContainerEcriture";
import ChoiceContainer from "../components/Containers/ChoiceContainer";
import Button from "../components/Button/Button";
import DateContainer from "../components/Containers/DateContainer";

import Donateur from "../assets/images/Donateur.svg";

import Popup from "../components/Popups/SuccessPopup";
import SuccessImage from "../assets/Success.svg";

export default function AjoutDonateur() {
  const navigate = useNavigate();

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
const [dateAdhesion, setDateAdhesion] = useState(null);
  const [statut, setStatut] = useState("Active");

  const handleSave = () => {
    console.log("Donateur enregistré");
    setShowSuccessPopup(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar role="admin" />
      </div>

      {/* Main */}
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

          <PageHeader
            leftTitle="Annuler"
            showRight={false}
            onBack={() => window.history.back()}
          />

          <h1
            className="
              text-[20px]
              lg:text-[24px]
              font-bold
              text-black
              text-center
            "
          >
            Nouveau Donateur
          </h1>

          {/* Illustration */}
          <div className="flex justify-center">
            <img
              src={Donateur}
              alt="Donateur"
              className="
                w-[120px]
                h-[120px]
                lg:w-[160px]
                lg:h-[160px]
              "
            />
          </div>

          <Input
            label="Nom"
            placeholder="Entrez le nom ici"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            noPadding
          />

          <Input
            label="Prénom"
            placeholder="Entrez le prénom ici"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            noPadding
          />

          <Input
            label="Email"
            placeholder="Entrez l'email ici"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            noPadding
          />

        <DateContainer
  label="Date d'adhésion"
  value={dateAdhesion}
  onChange={setDateAdhesion}
  noPadding
/>

          <ChoiceContainer
            label="Statut"
            placeholder="Choisir le statut"
            value={statut}
            onChange={setStatut}
            options={["Active", "Inactive"]}
            noPadding
          />

          {/* Button */}
          <div className="flex flex-col gap-0">
            <Button
              title="Enregistrer"
              variant="primary"
              noPadding
              onClick={handleSave}
            />
          </div>

          {showSuccessPopup && (
            <Popup
              title="Enregistrer avec succès"
              image={SuccessImage}
              id="DON-001"
              primaryButtonText="Voir le profil du donateur"
              secondaryButtonText="Revenir à l'accueil"
              onPrimaryClick={() => {
                setShowSuccessPopup(false);
                navigate("/fiche-donateur");
              }}
              onSecondaryClick={() => {
                setShowSuccessPopup(false);
                navigate("/dashboard");
              }}
            />
          )}

        </div>
      </main>
    </div>
  );
}