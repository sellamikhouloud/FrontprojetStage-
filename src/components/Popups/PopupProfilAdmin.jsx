import PageHeader from "../Navigation,Pageheader/PageHeader";
import ProfilInfoBlock, { CHAMPS_DEFAUT } from "../Forms/Profilinfoblock";

/**
 * Popup Profil Admin — affiche la carte profil + infos de contact + actions.
 * "Modifier le profil" bascule la popup en mode édition inline (pas de navigation).
 *
 * Tout l'état (formulaire, avatar, mode édition) est géré par ProfilInfoBlock,
 * cette popup ne s'occupe que du chrome de la modale (overlay, header, fermeture).
 *
 * admin: {
 *   nom, id, role, avatarUrl,
 *   email, telephone, structure,
 * }
 *
 * onSave(updatedFields) est appelé au clic sur "Sauvegarder" avec
 * { nom, email, telephone, structure, avatarFile, avatarUrl } — à toi de persister ça côté parent (API, state...).
 */
export default function PopupProfilAdmin({
  open,
  admin,
  onClose,
  onSave,
  onDeconnexion,
}) {
  if (!open || !admin) return null;

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
              onDeconnexion={onDeconnexion}
            />
          </div>
        </div>
      </div>
    </div>
  );
}