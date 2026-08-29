import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import ProfilInfoBlock, { CHAMPS_COORDINATEUR, logoutIcon } from "../../components/Forms/Profilinfoblock";
import ParametresCard from "../../components/Forms/ParametresCard";
import AssistanceCard from "../../components/Forms/AssistanceCard";
import Button from "../../components/Button/Button";
import ConfirmDialog from "../../components/Popups/ConfirmdialogPopup";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
import BackendErrorMessage from "../../components/Forms/BackendErrorMessage";

import { useAuth } from "../../components/Providers/AuthProvider";


const API_BASE_URL = "http://127.0.0.1:8000"; 

export const resolvePhotoUrl = (photo) => {
  if (!photo) return null;
  if (photo.startsWith("http://") || photo.startsWith("https://")) {
    return photo; // déjà une URL complète
  }
  return `${API_BASE_URL}${photo}`;
};

export default function PageProfilCoordinateur() {
  const { user, logout ,updateUser} = useAuth();
  

const coordinateur = {
  nom: user?.nom || "",
  prenom: user?.prenom || "",
  username: user?.username,
  id: user?.id ? `id – ${user.id}` : "id – coordinateur",
  role: user?.role === "chef_coordinator" ? "Chef Coordinateur" : "Coordinateur",
  avatarUrl: resolvePhotoUrl(user?.photo),
  email: user?.email,
  telephone: user?.telephone,
  village: user?.village, 
};



  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  

  const [erreurDeconnexion, setErreurDeconnexion] = useState("");


const handleSave = async (updatedFields) => {
  try {
    await updateUser(updatedFields);
    return null; // succès, pas d'erreur
  } catch (err) {
    return err.response?.data || { non_field_errors: ["Impossible de mettre à jour le profil."] };
  }
};
const handleDeconnexion = async () => {
  setShowLogoutConfirm(false);
  setErreurDeconnexion("");
  try {
    await logout();
    navigate("/");
  } catch (error) {
    console.error("Échec de la déconnexion :", error);
    setErreurDeconnexion(
      error?.response?.data?.detail ||
      error?.message ||
      "Échec de la déconnexion. Veuillez réessayer."
    );
  }
};

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar hideOnMobile />

     <main
  className="
    relative
    flex-1
    min-h-0
    flex
    flex-col
    overflow-hidden
    bg-white
  "
>

  <div
    className="
      absolute
      top-0
      left-0
      right-0
      h-[15px]
      bg-white
      z-20
      pointer-events-none
    "
  />
  
  

  {/* Zone scrollable — les bandes ne masquent QUE ce qui défile ici */}
  <div className="relative flex-1 min-h-0">
    <div
      className="
        absolute
        top-0
        left-0
        right-0
        h-[15px]
        bg-white
        z-20
        pointer-events-none
      "
    />

    <div className="h-full overflow-y-auto px-5 pb-8 lg:px-10 lg:py-4">
      <div className="min-h-full flex flex-col justify-center">
        <div className="mt-3 mb-3 ">
        <PageHeader
      leftTitle="Fermer"
      showRight={false}
      onBack={() => navigate("/dashboard")}
    />
    </div>
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
                 <div className="mt-0 lg:mt-8">

                <AssistanceCard
                  onCentreAide={() => console.log("Centre d'aide")}
                  onConditions={() => console.log("Conditions d'utilisation")}
                  onPolitique={() => console.log("Politique de confidentialité")}
                />
                </div>
              </div>
            </div>
            <div className="mt-2">
  {erreurDeconnexion && (
    <div className="mb-3">
      <BackendErrorMessage message={erreurDeconnexion} />
    </div>
  )}

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
    

    <div
      className="
        absolute
        bottom-0
        left-0
        right-0
        h-[15px]
        bg-white
        z-20
        pointer-events-none
      "
    />
  </div>
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
