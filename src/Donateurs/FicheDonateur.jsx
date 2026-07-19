import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import PageHeader from "../components/Navigation,Pageheader/PageHeader";
import ContainerEcritureModifier from "../components/Containers/ContainerEcritureModifier";
import ChoiceContainerModifier from "../components/Containers/ChoiceContainerModifier";
import DateContainer from "../components/Containers/DateContainer";
import Button from "../components/Button/Button";
import SuccessBanner from "../components/Popups/SuccessBanner";

import Donateur from "../assets/images/Donateur.svg";

export default function FicheDonateur() {
  const navigate = useNavigate();

  const [showBanner, setShowBanner] = useState(false);

  // Données (API plus tard)
  const [nom, setNom] = useState("Jean-Pierre");
  const [prenom, setPrenom] = useState("Leroy");
  const [email, setEmail] = useState("jean_leroy@gmail.com");
  const [dateAdhesion] = useState(new Date("2026-03-12"));
  const [statut, setStatut] = useState("Active");

 const handleSave = () => {
  console.log("Donateur modifié");

  setShowBanner(true);

  setTimeout(() => {
    navigate("/liste-Donateurs");
  }, 1500);
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
            Fiche donateur
          </h1>

          {/* Illustration */}
          <div className="flex justify-center">
            <img
              src={Donateur}
              alt="Donateur"
              className="
                w-[140px]
                h-[140px]
                lg:w-[200px]
                lg:h-[200px]
              "
            />
          </div>

          <ContainerEcritureModifier
            label="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            noPadding
          />

          <ContainerEcritureModifier
            label="Prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            noPadding
          />

          <ContainerEcritureModifier
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            noPadding
          />

          <DateContainer
            label="Date d'adhésion"
            value={dateAdhesion}
            disabled
            noPadding
          />

          <ChoiceContainerModifier
            label="Statut"
            value={statut}
            onChange={setStatut}
            options={["Active", "Inactive"]}
            noPadding
          />
  {showBanner && (
            <SuccessBanner text="Enregistrer avec succès" />
          )}
          <Button
            title="Sauvegarder les modifications"
            variant="primary"
            noPadding
            onClick={handleSave}
          />


        </div>
      </main>
    </div>
  );
}