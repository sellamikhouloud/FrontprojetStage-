import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import ProfilInfoBlock, { CHAMPS_COORDINATEUR, logoutIcon } from "../../components/Forms/Profilinfoblock";
import ParametresCard from "../../components/Forms/ParametresCard";
import AssistanceCard from "../../components/Forms/AssistanceCard";
import Button from "../../components/Button/Button";
import ConfirmDialog from "../../components/Popups/ConfirmdialogPopup";


export default function PageProfilCoordinateur() {
  // Simulation des données — à remplacer par le vrai coordinateur connecté (context/API)
  const coordinateur = {
    nom: "Ahmed Mohamed",
    id: "id – coordinateur",
    role: "Coordinateur",
    avatarUrl: "",
    email: "ahmed.mohamed@gmail.com",
    telephone: "+220 000 000",
    region: "Lexibia",
    structure: "Nutrigest Mauritanie",
  };

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const handleSave = (updatedFields) => {
    // TODO: appel API pour persister les modifications du coordinateur
    console.log("À sauvegarder :", updatedFields);
  };

  const handleDeconnexion = () => {
    // TODO: logique de déconnexion réelle (clear session/token...)
    setShowLogoutConfirm(false);
    navigate("/");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar role="coordinator" user={coordinateur} />

      <main
        className="
          relative
          flex-1
          min-h-0
          overflow-hidden
          bg-white
        "
      >
        {/* ESPACE BLANC FIXE en haut uniquement, ne scroll pas */}
        <div
          className="
            absolute
            top-0
            left-0
            right-0
            h-[15px]
            bg-white
            z-20
          "
        />

        <div className="h-full overflow-y-auto px-5 pt-18 md:pt-0 pb-8 lg:pt-10 lg:px-10 lg:py-4">
          <div className="min-h-full flex flex-col justify-center">
          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-[1.3fr_1fr]
              gap-[24px]
            "
          >
            {/* Colonne gauche — profil */}
            <div>
              <ProfilInfoBlock
                admin={coordinateur}
                champs={CHAMPS_COORDINATEUR}
                onSave={handleSave}
                showDeconnexion={false}
              />
            </div>

            {/* Colonne droite — paramètres + assistance + déconnexion */}
            <div className="mt-0 lg:mt-16">
              <ParametresCard
                lastSync="Aujourd'hui à 09:42"
                syncStatus="synchronise"
                version="1.0.0"
              />

              <AssistanceCard
                onCentreAide={() => console.log("Centre d'aide")}
                onConditions={() => console.log("Conditions d'utilisation")}
                onPolitique={() => console.log("Politique de confidentialité")}
              />


            </div>

          </div>
           <div className="mt-0">
                <Button
                  title="Déconnexion"
                  variant="deconnexion"
                  icon={logoutIcon}
                  noPadding
                  onClick={() => setShowLogoutConfirm(true)}
                />
              </div>
          </div>
        </div>

        {/* ESPACE BLANC FIXE en bas uniquement, ne scroll pas */}
        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            h-[15px]
            bg-white
            z-20
          "
        />
      </main>

      <ConfirmDialog
        open={showLogoutConfirm}
        title="Se déconnecter ?"
        message="Vous devrez vous reconnecter avec vos identifiants pour accéder de nouveau à votre compte."
        confirmLabel="Déconnexion"
        cancelLabel="Annuler"
        onConfirm={handleDeconnexion}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}
