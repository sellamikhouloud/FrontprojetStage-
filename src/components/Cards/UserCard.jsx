import { User, Camera } from "lucide-react";

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
 */
export default function UserCard({
  nom,
  role,
  avatarUrl,
  editing = false,
  onAvatarClick,
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
          ${editing ? "p-[3px] border-2 border-dashed cursor-pointer" : ""}
        `}
        style={editing ? { borderColor: "#4E9F8A" } : undefined}
        onClick={editing ? onAvatarClick : undefined}
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
            <User
              size={64}
              color="#EAF6F2"
              fill="#EAF6F2"
              strokeWidth={0}
              style={{ transform: "translateY(4px)" }}
            />
          )}
        </div>

        {/* Badge caméra — visible uniquement en mode édition */}
        {editing && (
          <div
            className="
              absolute
              bottom-0
              right-0
              w-8 h-8
              rounded-full
              flex
              items-center
              justify-center
              border-2
              border-white
            "
            style={{ backgroundColor: "#4E9F8A" }}
          >
            <Camera size={15} color="#FFFFFF" strokeWidth={2.5} />
          </div>
        )}
      </div>

      {/*
        Bloc droit : contient le nom/id ET le badge rôle.
        - Mobile (par défaut) : flex-col -> le badge tombe SOUS le nom/id.
        - >= sm : flex-row -> on retrouve la mise en page originale,
          nom/id à gauche, badge poussé à droite via sm:ml-auto.
      */}
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
        {/* Nom + id */}
        {/* Nom */}
<div className="flex flex-col justify-center min-w-0">
  <p className="text-[20px] font-extrabold text-black leading-tight truncate">
    {nom}
  </p>
</div>

        {/* Badge rôle */}
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
