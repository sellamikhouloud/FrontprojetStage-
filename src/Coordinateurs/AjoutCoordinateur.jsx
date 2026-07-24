import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import PageHeader from "../components/Navigation,Pageheader/PageHeader";
import Input from "../components/Containers/ContainerEcriture";
import ChoiceContainer from "../components/Containers/ChoiceContainer";
import Button from "../components/Button/Button";

import Coordinator from "../assets/images/Coordinator.svg";
import { AiOutlineInfoCircle } from "react-icons/ai";

import Popup from "../components/Popups/SuccessPopup";
import SuccessImage from "../assets/Success.svg";

export default function AjoutCoordinateur() {
  const navigate = useNavigate();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statut, setStatut] = useState("Active");

  const [emailSent, setEmailSent] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSendEmail = () => {
    // API ici plus tard
    setEmailSent(true);
    setShowError(false);
  };

  const handleSave = () => {
  if (!emailSent) {
    setShowError(true);
    return;
  }

  setShowError(false);

  // API Ajouter Coordinateur
  console.log("Coordinateur enregistré");

  // Show popup
  setShowSuccessPopup(true);
};

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar role="admin" />
      </div>

      {/* Contenu */}
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
            Nouveau Coordinateur
          </h1>

          {/* Photo */}
          <div className="flex justify-center">
            <img
              src={Coordinator}
              alt="Coordinateur"
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

          <Input
            label="Mot de passe"
            placeholder="Entrez le mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

         {/* Boutons */}
<div className="flex flex-col gap-[0px]">
  <Button
    title={
      emailSent
        ? "Email envoyé avec succès"
        : "Partager un mail du mot de passe au coordinateur"
    }
   variant={emailSent ? "success" : "email"}
    noPadding
    onClick={handleSendEmail}
  />

  <Button
    title="Enregistrer"
    variant="primary"
    noPadding
    onClick={handleSave}
  />
  
{/* Message d'erreur */}
{showError && (
  <div className="mt-4 flex items-center justify-center gap-2 text-[#EF4444]">
    <AiOutlineInfoCircle className="text-[20px] shrink-0" />
    <p className="text-sm font-bold">
      Veuillez envoyer le mail au coordinateur avant de confirmer.
    </p>
  </div>
)}
</div>
{showSuccessPopup && (
  <Popup
    title="Enregistrer avec succès"
    image={SuccessImage}
    id="COORD-001" // replace later with the id returned by the API
    primaryButtonText="Voir le profil du coordinateur"
    secondaryButtonText="Revenir à l'accueil"
    onPrimaryClick={() => {
      setShowSuccessPopup(false);
      navigate("/profil-coordinateur");
    }}
    onSecondaryClick={() => {
      setShowSuccessPopup(false);
      navigate("/");
    }}
  />
)}


        </div>
      </main>
    </div>
  );
}