import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../Navigation,Pageheader/PageHeader";
import ProfilInfoBlock, { CHAMPS_DEFAUT } from "../Forms/Profilinfoblock";
import ConfirmDialog from "../Popups/ConfirmdialogPopup";
import { useAuth } from "../Providers/AuthProvider";

export default function PopupProfilAdmin({
  open,
  admin,
  onClose,
  onSave,
}) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [erreurDeconnexion, setErreurDeconnexion] = useState(""); 

  const { logout } = useAuth();
  const navigate = useNavigate();

  if (!open || !admin) return null;

 const handleConfirmDeconnexion = async () => {
    setShowLogoutConfirm(false);
    setErreurDeconnexion(""); 
    try {
      await logout();
      onClose?.();
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
    <div
      className="
        fixed inset-0 z-[70]
        bg-transparent sm:bg-black/40

        flex items-start sm:items-center
        justify-center

        overflow-y-auto
      "
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full
          h-screen

          sm:h-auto
          sm:w-[600px]
          sm:max-h-[90vh]

          flex
          flex-col

          bg-white

          rounded-none
          sm:rounded-[20px]

          border-0
          sm:border

          overflow-hidden
        "
        style={{
          borderColor: "#4E9F8A",
        }}
      >
        {/* Fermer + Titre — fixes, ne scrollent pas */}
        <div
          className="
            shrink-0
            p-4
            sm:px-[30px]
            sm:pt-[18px]
            sm:pb-[0px]
          "
        >
          <PageHeader
            leftTitle="Fermer"
            showRight={false}
            onBack={onClose}
          />

          <h2 className="text-center text-[20px] sm:text-[22px] font-bold mt-0">
            Profil
          </h2>
        </div>

        {/* Contenu scrollable — délégué à ProfilInfoBlock */}
        <div
          className="
            flex-1
            overflow-y-auto
            scrollbar-hide

            px-4
            sm:px-[30px]
            pb-4
            sm:pb-[18px]
          "
        >
          <div className="mt-3">
            <ProfilInfoBlock
              admin={admin}
              champs={CHAMPS_DEFAUT}
              onSave={onSave}
              onDeconnexion={() => setShowLogoutConfirm(true)}
              erreurDeconnexion={erreurDeconnexion}
            />
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showLogoutConfirm}
        title="Se déconnecter ?"
        message="Vous devrez vous reconnecter avec vos identifiants pour accéder de nouveau à votre compte."
        confirmLabel="Déconnexion"
        cancelLabel="Annuler"
        onConfirm={handleConfirmDeconnexion}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}
