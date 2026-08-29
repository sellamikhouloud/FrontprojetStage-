import { X } from "lucide-react";
import userIcon from "../../assets/user.svg"; // ← adaptez le chemin

/**
 * UserCard — carte profil utilisateur (avatar + nom/id + badge rôle)
 *
 * props:
 *   nom       : string
 *   id        : string   -> non éditable, toujours affiché tel quel
 *   role      : string
 *   avatarUrl?: string   -> si fourni, affiche une vraie image au lieu de l'icône par défaut
 *   editing?  : boolean  -> true = bordure pointillée (mode édition)
 *   onAvatarClick?: () => void -> appelé au clic sur l'avatar (uniquement actif si editing=true)
 *   onRemovePhoto?: () => void -> appelé au clic sur le bouton de suppression (uniquement si avatarUrl existe et editing=true)
 */
export default function UserCard({
  nom,
  role,
  avatarUrl,
  editing = false,
  onAvatarClick,
  onRemovePhoto,
}) {
  return (
    <div
      className={`
        flex
        items-center
        rounded-2xl
        border
        gap-8
        py-[16px]
        sm:py-[11px]
        px-[20px]
        ${editing ? "border-dashed" : "border-solid"}
      `}
      style={{
        backgroundColor: "#E6F5F4",
        borderColor: "#4E9F8A",
      }}
    >
      {/* Avatar */}
      <div
        className={`
          relative
          shrink-0
          rounded-full
          group
          ${editing ? "p-[3px] border-2 border-dashed cursor-pointer" : ""}
        `}
        style={editing ? { borderColor: "#4E9F8A" } : undefined}
      >
        <button
          type="button"
          onClick={editing ? onAvatarClick : undefined}
          disabled={!editing}
          className="relative block"
        >
          <div
            className="
              w-[94px] h-[94px]
              rounded-full
              flex
              items-center
              justify-center
              overflow-hidden
            "
            style={{ backgroundColor: "#9AD1C2" }}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={nom}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={userIcon}
                alt="Avatar par défaut"
                className="w-14 h-14 translate-y-[4px]"
              />
            )}
          </div>

          {/* Overlay "Modifier" au survol — visible seulement en édition */}
          {editing && (
            <span
              className="
                absolute
                inset-0
                rounded-full
                bg-black/0
                group-hover:bg-black/20
                transition-colors
                flex
                items-center
                justify-center
              "
            >
              <span
                className="
                  opacity-0
                  group-hover:opacity-100
                  text-white
                  text-[12px]
                  font-medium
                  transition-opacity
                "
              >
                Modifier
              </span>
            </span>
          )}
        </button>

        {/* Bouton suppression — même style que Fiche/Ajout coordinateur : X noir simple, sans fond */}
        {editing && avatarUrl && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemovePhoto?.();
            }}
            className="absolute -top-0.5 -right-0.5"
            aria-label="Supprimer la photo"
          >
            <X size={18} color="#202124" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Bloc droit : nom/id + badge rôle */}
      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          flex-1
          min-w-0
          gap-3
          sm:gap-8
        "
      >
        <div className="flex flex-col justify-center min-w-0">
          <p className="text-[20px] font-extrabold text-black leading-tight truncate">
            {nom}
          </p>
        </div>

        <div
          className="
            self-start
            sm:self-auto
            sm:ml-auto
            rounded-full
            border
            px-4
            py-[6px]
            mt-1
            sm:mt-0
            shrink-0
            whitespace-nowrap
          "
          style={{
            backgroundColor: "#E8F7EF",
            borderColor: "#22C55E",
            color: "#22C55E",
          }}
        >
          <span className="text-[15px] font-bold">{role}</span>
        </div>
      </div>
    </div>
  );
}
