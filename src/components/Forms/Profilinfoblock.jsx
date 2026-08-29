import { useState, useEffect, useRef, useMemo} from "react";
import { User, Mail, Phone, MapPin, AtSign } from "lucide-react";
import UserCard from "../Cards/UserCard";
import Button from "../Button/Button";
import OptionsMenu from "../Containers/OptionsMenu";
import { listVillages } from "../../lib/api/Parametres";
import { AiOutlineDown } from "react-icons/ai";
import { diffPatch, isEmptyPatch } from "@/lib/diff";
import PopupPhoto from "../Popups/PopupPhoto";
import ErrorMessage from "../Forms/ErrorMessage";
import BackendErrorMessage from "../Forms/BackendErrorMessage";
import SuccessBanner from "../Popups/SuccessBanner"; 

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
  const CHAMPS_OPTIONNELS = ["telephone"];

export const CHAMPS_DEFAUT = [
  { key: "username", icon: AtSign, label: "Nom d'utilisateur" },
  { key: "prenom", icon: User, label: "Prénom" },
  { key: "nom", icon: User, label: "Nom" },
  { key: "email", icon: Mail, label: "Email" },
  { key: "telephone", icon: Phone, label: "Téléphone" },
];

export const CHAMPS_COORDINATEUR = [
  { key: "username", icon: AtSign, label: "Nom d'utilisateur" },
  { key: "prenom", icon: User, label: "Prénom" },
  { key: "nom", icon: User, label: "Nom" },
  { key: "email", icon: Mail, label: "Email" },
  { key: "telephone", icon: Phone, label: "Téléphone" },
  { key: "village", icon: MapPin, label: "Village" },
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
 erreurDeconnexion = "",
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [erreurGenerale, setErreurGenerale] = useState("");
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const successTimeoutRef = useRef(null);
  


  const [villages, setVillages] = useState([]);
  const [loadingVillages, setLoadingVillages] = useState(false);
  const [dropdownVillageOuvert, setDropdownVillageOuvert] = useState(false);
  const [showPhotoPopup, setShowPhotoPopup] = useState(false);

  const aChampVillage = champs.some((c) => c.key === "village");

 const baseline = useMemo(() => {
  if (!admin) return null;
  const initial = {};
  champs.forEach((c) => {
    if (c.key === "village") {
      if (admin.village && typeof admin.village === "object") {
        initial.village = admin.village.id ? String(admin.village.id) : "";
      } else if (admin.village) {
        initial.village = String(admin.village);
      } else {
        initial.village = "";
      }
      return;
    }
    initial[c.key] = admin[c.key] || "";
  });
  return initial;
}, [admin, champs]);

const patch = useMemo(
  () => (baseline && formData ? diffPatch(baseline, formData) : {}),
  [baseline, formData]
);

const nothingChanged = isEmptyPatch(patch) && !avatarFile;

  useEffect(() => {
  return () => {
    if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
  };
}, []);

  useEffect(() => {
    if (admin) {
      const initial = {};
      champs.forEach((c) => {
        if (c.key === "village") {
  if (admin.village && typeof admin.village === "object") {
    initial.village = admin.village.id ? String(admin.village.id) : "";
  } else if (admin.village) {
    initial.village = String(admin.village);
  } else {
    initial.village = "";
  }
  return;
}
        initial[c.key] = admin[c.key] || "";
      });
      setFormData(initial);
    }
    setIsEditing(false);
    setAvatarPreview(null);
    setAvatarFile(null);
    setFieldErrors({});
    setErreurGenerale("");
  }, [admin, champs]);

  useEffect(() => {
    if (!aChampVillage) return;

    const fetchVillages = async () => {
      setLoadingVillages(true);
      try {
        const { data } = await listVillages();
        setVillages(data);
      } catch (err) {
        console.error("Impossible de charger la liste des villages:", err);
      } finally {
        setLoadingVillages(false);
      }
    };

    fetchVillages();
  }, [aChampVillage]);

  if (!admin) return null;

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // On efface l'erreur de ce champ dès que l'utilisateur le modifie
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

 const handleAvatarClick = () => setShowPhotoPopup(true);

const handleImageSelected = (file) => {
  if (!file) return;
  if (avatarPreview) URL.revokeObjectURL(avatarPreview);
  setAvatarFile(file);
  setAvatarPreview(URL.createObjectURL(file));

  setFieldErrors((prev) => {
    if (!prev.photo) return prev;
    const next = { ...prev };
    delete next.photo;
    return next;
  });
};


  // Validation front : les champs texte visibles ne doivent pas être vides
const validerChamps = () => {
  const erreurs = {};

  champs.forEach((champ) => {
    if (champ.key === "village") return; // optionnel
    if (CHAMPS_OPTIONNELS.includes(champ.key)) return; // ← ajouter cette ligne

    const valeur = (formData[champ.key] || "").trim();
    if (!valeur) {
      erreurs[champ.key] = "Ce champ ne peut être vide.";
    }
  });

  return erreurs;
};

  const handleSauvegarder = async () => {
     setErreurGenerale("");

  const erreursValidation = validerChamps();
  if (Object.keys(erreursValidation).length > 0) {
    setFieldErrors(erreursValidation);
    return;
  }

  if (nothingChanged) {
    setErreurGenerale("Aucune modification à enregistrer.");
    return;
  }

  const { village, ...patchSansVillage } = patch;

  let payload;

  if (avatarFile) {
    payload = new FormData();
    Object.entries(patchSansVillage).forEach(([key, value]) => {
      payload.append(key, value);
    });

    if (aChampVillage && "village" in patch) {
      payload.append("village", Number(patch.village));
    }

    payload.append("photo", avatarFile);
  } else {
    payload = { ...patchSansVillage };

    if (aChampVillage && "village" in patch) {
      payload.village = Number(patch.village);
    }
  }

  setSaving(true);
  const erreursBackend = await onSave?.(payload);
  setSaving(false);

    if (erreursBackend) {
      // Sépare les erreurs liées à un champ connu de celles qui ne le sont pas
      const nouvelleFieldErrors = {};
      const messagesGeneraux = [];

      Object.entries(erreursBackend).forEach(([cle, valeur]) => {
        const message = Array.isArray(valeur) ? valeur[0] : String(valeur);
        const champConnu = champs.some((c) => c.key === cle);

        if (champConnu) {
          nouvelleFieldErrors[cle] = message;
        } else {
          messagesGeneraux.push(message);
        }
      });

      setFieldErrors(nouvelleFieldErrors);
      if (messagesGeneraux.length > 0) {
        setErreurGenerale(messagesGeneraux.join(" "));
      }
      return; // on reste en mode édition
    }

    // Succès
    setFieldErrors({});
    setErreurGenerale("");
    setIsEditing(false);

if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
setShowSuccess(true);
successTimeoutRef.current = setTimeout(() => setShowSuccess(false), 1000);
  };

  const source = isEditing ? formData : admin;
  const nomComplet =
    `${source.prenom ?? ""} ${source.nom ?? ""}`.trim() ||
    admin.username ||
    "Utilisateur";

  const rows = isEditing
    ? champs.map((champ) => ({
        ...champ,
        value: formData[champ.key],
      }))
    : (() => {
        const result = [];

        champs.forEach((champ) => {
          if (champ.key === "prenom") return;

          if (champ.key === "nom") {
            const valeur = `${admin.prenom ?? ""} ${admin.nom ?? ""}`.trim();
            if (valeur) {
              result.push({ ...champ, label: "Nom", value: valeur });
            }
            return;
          }

          if (champ.key === "village") {
  let valeur;

  if (admin.village && typeof admin.village === "object") {
    // Format objet : { id, nom }
    valeur = admin.village.nom;
  } else if (admin.village) {
    // Format id brut : on cherche le nom dans la liste des villages déjà chargée
    const villageTrouve = villages.find((v) => String(v.id) === String(admin.village));
    valeur = villageTrouve?.nom;
  }

  if (valeur) {
    result.push({ ...champ, value: valeur });
  }
  return;
}

          const valeur = admin[champ.key];
          if (valeur) {
            result.push({ ...champ, value: valeur });
          }
        });

        return result;
      })();

  const nomVillageSelectionne =
    villages.find((v) => String(v.id) === formData.village)?.nom || "Sélectionner un village";

  return (
    <div>
     
     <UserCard
  nom={nomComplet}
  role={admin.role}
  avatarUrl={isEditing ? avatarPreview || admin.avatarUrl : admin.avatarUrl}
  editing={isEditing}
  onAvatarClick={handleAvatarClick}
/>

 

<PopupPhoto
  open={showPhotoPopup}
  title="Photo de profil"
  onClose={() => setShowPhotoPopup(false)}
  onImageSelected={handleImageSelected}
/>

{isEditing && fieldErrors.photo && (
  <div className="mt-2 flex justify-center">
    <ErrorMessage message={fieldErrors.photo} />
  </div>
)}
   

      <p className="mt-5 text-[15px] font-bold text-[#202124]">
        Informations du compte
      </p>

      {rows.length > 0 && (
        <div
          className={`
            mt-3 rounded-[15px] bg-[#F8FBFC]
            ${isEditing
              ? "overflow-visible border border-dashed border-[#686868]"
              : "overflow-hidden border border-[#BEC9C5]/30"
            }
          `}
        >
          {rows.map((row, index) => {
            const Icon = row.icon;
            const estVillage = row.key === "village";
            const erreurChamp = fieldErrors[row.key];

            return (
              <div
                key={row.key}
                className={`
                  flex flex-col
                  px-4 py-3
                  ${index !== rows.length - 1 ? "border-b border-solid border-[#BEC9C5]/30" : ""}
                `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#E6F5F4", color: "#4FA18F" }}
                  >
                    <Icon size={16} strokeWidth={2.5} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-[#6E7976]">{row.label}</p>

                    {isEditing && estVillage ? (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setDropdownVillageOuvert((prev) => !prev)}
                          disabled={loadingVillages}
                          className="w-full flex items-center justify-between text-[14px] font-semibold text-[#202124] bg-transparent outline-none disabled:opacity-50"
                        >
                          <span>{loadingVillages ? "Chargement..." : nomVillageSelectionne}</span>
                          <AiOutlineDown
                            className={`text-[14px] transition-transform ${dropdownVillageOuvert ? "rotate-180" : ""}`}
                          />
                        </button>

                        <OptionsMenu
                          open={dropdownVillageOuvert}
                          onClose={() => setDropdownVillageOuvert(false)}
                          options={villages.map((v) => v.nom)}
                          onSelect={(nomChoisi) => {
                            const villageTrouve = villages.find((v) => v.nom === nomChoisi);
                            if (villageTrouve) {
                              handleChange("village", String(villageTrouve.id));
                            }
                            setDropdownVillageOuvert(false);
                          }}
                          position="bottom-[24px] left-0 right-0"
                          width="w-full"
                        />
                      </div>
                    ) : isEditing ? (
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

                {isEditing && erreurChamp && (
                 
  <div className="mt-1 ml-12">
    <ErrorMessage message={erreurChamp} />
  </div>

                )}
              </div>
            );
          })}
        </div>
      )}

      {showSuccess && (
  <div className=" mt-2">
    <SuccessBanner text="Enregistré avec succès" />
  </div>
)}
{erreurGenerale && (
      <div className="mt-3">
        <BackendErrorMessage message={erreurGenerale} />
      </div>
    )}

    {erreurDeconnexion && (
  <div className="mt-3">
    <BackendErrorMessage message={erreurDeconnexion} />
  </div>
)}

      <div className="mt-3 flex flex-col gap-0">
        {isEditing ? (
          <Button
            title={saving ? "Sauvegarde..." : "Sauvegarder"}
            variant="sauvegarder"
            noPadding
            onClick={handleSauvegarder}
            disabled={saving}
          />
        ) : (
          <>
            <Button title="Modifier" variant="modifier" noPadding onClick={() => setIsEditing(true)} />
            {showDeconnexion && (
              
  <Button
    title="Déconnexion"
    variant="deconnexion"
    icon={logoutIcon}
    noPadding
   onClick={onDeconnexion}
  />

            )}
          </>
        )}
      </div>
    </div>
  );
}
