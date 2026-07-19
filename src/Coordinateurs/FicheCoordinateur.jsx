import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import PageHeader from "../components/Navigation,Pageheader/PageHeader";
import Input from "../components/Containers/ContainerEcriture";
import ContainerEcritureModifier from "../components/Containers/ContainerEcritureModifier";
import ChoiceContainerModifier from "../components/Containers/ChoiceContainerModifier";
import DateContainer from "../components/Containers/DateContainer";
import Button from "../components/Button/Button";
import { AiOutlineInfoCircle } from "react-icons/ai";
import SuccessBanner from "../components/Popups/SuccessBanner";
import Popup from "../components/Popups/SuccessPopup";

import Coordinator from "../assets/images/Coordinator.svg";
import SuccessImage from "../assets/Confirm.svg";

export default function ModifierCoordinateur() {
  const navigate = useNavigate();

  const [showBanner, setShowBanner] = useState(false);
const [showDeletePopup, setShowDeletePopup] = useState(false);
  // Données (à remplacer par l'API)
  const [identifiant] = useState("COORD-001");
  const [nom, setNom] = useState("Dupont");
  const [prenom, setPrenom] = useState("Sarah");
  const [email, setEmail] = useState("sarah.dupont@gmail.com");
  const [statut, setStatut] = useState("Active");
  const [dateEntree] = useState(new Date("2025-02-12"));
  const [password, setPassword] = useState("Azerty123");


  const handleSave = () => {
  // Later: API call

  setShowBanner(true);

  // Hide automatically after 3 seconds
  setTimeout(() => {
    navigate("/liste-coordinateurs");
  }, 1500);
};



 const handleDelete = () => {
  setShowDeletePopup(true);
};
const confirmDelete = () => {
  // API delete plus tard
  console.log("Coordinateur supprimé");

  setShowDeletePopup(false);

  // Revenir à la liste des coordinateurs
  navigate("/liste-coordinateurs");
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
            onBack={() => navigate(-1)}
          />

          <h1
            className="
              text-[20px]
              lg:text-[24px]
              font-bold
              text-center
            "
          >
            Fiche Coordinateur
          </h1>

          {/* Illustration */}
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

          {/* Identifiant (non modifiable) */}
          <Input
            label="Identifiant"
            value={identifiant}
            disabled
            noPadding
          />

          {/* Nom */}
          <ContainerEcritureModifier
            label="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            noPadding
          />

          {/* Prénom */}
          <ContainerEcritureModifier
            label="Prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            noPadding
          />

          {/* Email */}
          <ContainerEcritureModifier
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            noPadding
          />

          {/* Date d'entrée (non modifiable) */}
          <DateContainer
            label="Date d'entrée"
            value={dateEntree}
            disabled
            noPadding
          />
<div className="flex flex-col gap-1">
  <ContainerEcritureModifier
    label="Mot de passe"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    noPadding
  />

  <div className="mt-1 flex items-center gap-1 text-[#F59E0B]">
  <AiOutlineInfoCircle className="text-[16px] shrink-0" />

  <p className="text-[13px] font-medium leading-4">
    Toute modification du mot de passe sera automatiquement envoyée au
    coordinateur par e-mail après l'enregistrement.
  </p>
</div>
</div>

          {/* Statut */}
          <ChoiceContainerModifier
            label="Statut"
            value={statut}
            onChange={setStatut}
            options={["Active", "Inactive"]}
            noPadding
          />

          {/* Boutons */}
          <div className="flex flex-col gap-[0px]">

            <Button
              title="Sauvegarder les modifications"
              variant="primary"
              noPadding
              onClick={handleSave}
            />
            {/* Success Banner */}
{showBanner && (
  <SuccessBanner text="Enregistrer avec succès" />
)}



            <Button
  title="Supprimer le coordinateur"
  variant="deleteCoordinator"
  noPadding
  onClick={handleDelete}
/>{showDeletePopup && (
  <Popup
    title="Confirmer la suppression"
    image={SuccessImage}
    description="Êtes-vous sûr de vouloir supprimer ce coordinateur ? Cette action est irréversible."
    primaryButtonText="Supprimer"
    secondaryButtonText="Annuler"
    primaryButtonVariant="danger"
    onPrimaryClick={confirmDelete}
    onSecondaryClick={() => setShowDeletePopup(false)}
  />
)}

          </div>


        </div>
      </main>
    </div>
  );
}