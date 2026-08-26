import { useState, useEffect, useRef } from "react";
import { User, Mail, Phone, Building2, MapPin, AtSign } from "lucide-react";
import UserCard from "../Cards/UserCard";
import Button from "../Button/Button";

// Icône flèche de sortie (rouge), encodée en SVG inline — pas besoin de fichier asset séparé
export const logoutIcon =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  `);

export const CHAMPS_DEFAUT = [
  { key: "prenom", icon: User, label: "Prénom" },
  { key: "nom", icon: User, label: "Nom" },
  { key: "username", icon: AtSign, label: "Nom d'utilisateur" },
  { key: "email", icon: Mail, label: "Email" },
  { key: "telephone", icon: Phone, label: "Téléphone" },
  { key: "structure", icon: Building2, label: "Structure" },
];

// Champs pour un profil coordinateur (ajoute "Région")
export const CHAMPS_COORDINATEUR = [
  { key: "prenom", icon: User, label: "Prénom" },
  { key: "nom", icon: User, label: "Nom" },
  { key: "username", icon: AtSign, label: "Nom d'utilisateur" },
  { key: "email", icon: Mail, label: "Email" },
  { key: "telephone", icon: Phone, label: "Téléphone" },
  { key: "region", icon: MapPin, label: "Région" },
  { key: "structure", icon: Building2, label: "Structure" },
];

/**
 * ProfilInfoBlock — carte profil + informations du compte + actions (Modifier / Sauvegarder / Déconnexion).
 * Utilisé à la fois dans PopupProfilAdmin (dans une modale) et dans une page pleine (coordinateur).
 *
 * admin: { nom, id, role, avatarUrl, email, telephone, structure, region? }
 * champs: liste des champs éditables affichés (par défaut CHAMPS_DEFAUT)
 * onSave(updatedFields) : appelé au clic sur "Sauvegarder"
 * onDeconnexion() : appelé au clic sur "Déconnexion"
 * showDeconnexion: affiche ou non le bouton "Déconnexion" (par défaut true)
 */
export default function ProfilInfoBlock({
  admin,
  champs = CHAMPS_DEFAUT,
  onSave,
  onDeconnexion,
  showDeconnexion = true,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (admin) {
      const initial = {};
      champs.forEach((c) => {
        initial[c.key] = admin[c.key] || (c.key === "structure" ? "Nutrigest Mauritanie" : "");
      });
      setFormData(initial);
    }
    setIsEditing(false);
    setAvatarPreview(null);
    setAvatarFile(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin]);

  if (!admin) return null;

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSauvegarder = () => {
    onSave?.({ ...formData, avatarFile, avatarUrl: avatarPreview || admin.avatarUrl });
    setIsEditing(false);
  };

  // Nom complet affiché dans la carte, recalculé à partir de prénom + nom
  // (reste indépendant du champ "nom" qui est maintenant le nom de famille seul)
  const source = isEditing ? formData : admin;
  const nomComplet =
    `${source.prenom ?? ""} ${source.nom ?? ""}`.trim() ||
    admin.username ||
    "Utilisateur";

  // Mode édition : chaque champ (y compris prénom / nom) reste séparé.
  // Mode lecture : prénom + nom sont fusionnés sur une seule ligne "Nom".
  const rows = isEditing
    ? champs.map((champ) => ({
        ...champ,
        value: formData[champ.key],
      }))
    : (() => {
        const result = [];

        champs.forEach((champ) => {
          if (champ.key === "prenom") return; // fusionné avec "nom" ci-dessous

          if (champ.key === "nom") {
            const valeur = `${admin.prenom ?? ""} ${admin.nom ?? ""}`.trim();
            if (valeur) {
              result.push({ ...champ, label: "Nom", value: valeur });
            }
            return;
          }

          const valeur =
            admin[champ.key] || (champ.key === "structure" ? "Nutrigest Mauritanie" : "");
          if (valeur) {
            result.push({ ...champ, value: valeur });
          }
        });

        return result;
      })();

  return (
    <div>
      <UserCard
        nom={nomComplet}
        id={admin.id}
        role={admin.role}
        avatarUrl={isEditing ? avatarPreview || admin.avatarUrl : admin.avatarUrl}
        editing={isEditing}
        onAvatarClick={handleAvatarClick}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
        className="hidden"
      />

      <p className="mt-5 text-[15px] font-bold text-[#202124]">
        Informations du compte
      </p>

      {rows.length > 0 && (
        <div
          className={`
            mt-3 rounded-[15px] overflow-hidden bg-[#F8FBFC]
            ${isEditing ? "border border-dashed border-[#686868]" : "border border-[#BEC9C5]/30"}
          `}
        >
          {rows.map((row, index) => {
            const Icon = row.icon;
            return (
              <div
                key={row.key}
                className={`
                  flex items-center gap-3
                  px-4 py-3
                  ${index !== rows.length - 1 ? "border-b border-solid border-[#BEC9C5]/30" : ""}
                `}
              >
                <div
                  className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#E6F5F4", color: "#4FA18F" }}
                >
                  <Icon size={16} strokeWidth={2.5} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-[#6E7976]">{row.label}</p>

                  {isEditing ? (
                    <input
                      type="text"
                      value={formData[row.key]}
                      onChange={(e) => handleChange(row.key, e.target.value)}
                      placeholder={row.label}
                      className="w-full bg-transparent text-[14px] font-semibold text-[#202124] outline-none"
                    />
                  ) : (
                    <p className="text-[14px] font-semibold text-[#202124] truncate">
                      {row.value}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-0">
        {isEditing ? (
          <Button title="Sauvegarder" variant="sauvegarder" noPadding onClick={handleSauvegarder} />
        ) : (
          <>
            <Button title="Modifier" variant="modifier" noPadding onClick={() => setIsEditing(true)} />
            {showDeconnexion && (
              <Button title="Déconnexion" variant="deconnexion" icon={logoutIcon} noPadding onClick={onDeconnexion} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
