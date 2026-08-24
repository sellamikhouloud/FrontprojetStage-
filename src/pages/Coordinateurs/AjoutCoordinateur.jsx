
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import Sidebar from "../../components/Sidebar/Sidebar";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
import Input from "../../components/Containers/ContainerEcriture";
import ChoiceContainer from "../../components/Containers/ChoiceContainer";
import SelectInput2 from "../../components/Containers/ChoiceContainer2";
import Button from "../../components/Button/Button";
import ErrorMessage from "../../components/Forms/ErrorMessage";
import PopupPhoto from "../../components/Popups/PopupPhoto";

import Coordinator from "../../assets/images/Coordinator.svg";

import Popup from "../../components/Popups/SuccessPopup";
import SuccessImage from "../../assets/Success.svg";

import { createUser } from "../../lib/api/coordinateurs";
import { listVillages } from "../../lib/api/Parametres";
import { checkUsernameExists } from "../../lib/api/users";

import { useAuth } from "../../components/Providers/AuthProvider";
import BackendErrorMessage from "../../components/Forms/BackendErrorMessage";

const KNOWN_FIELDS = ["username", "nom", "prenom", "email", "village", "password", "role"];

function parseBackendErrors(data) {
  if (!data) return { fieldErrors: {}, generalMessage: null };

  if (typeof data === "string") {
    return { fieldErrors: {}, generalMessage: data };
  }

  if (Array.isArray(data)) {
    const messages = data.filter((m) => typeof m === "string");
    return { fieldErrors: {}, generalMessage: messages.join(" — ") || null };
  }

  if (data.detail) {
    return { fieldErrors: {}, generalMessage: data.detail };
  }

  if (typeof data.code === "string" && typeof data.message === "string") {
    return { fieldErrors: {}, generalMessage: data.message };
  }

  if (typeof data === "object") {
    const fieldErrors = {};
    const generalMessages = [];

    Object.entries(data).forEach(([field, messages]) => {
      const text = Array.isArray(messages) ? messages.join(" ") : String(messages);

      if (KNOWN_FIELDS.includes(field)) {
        fieldErrors[field] = text;
      } else if (field === "non_field_errors") {
        generalMessages.push(text);
      } else {
        generalMessages.push(`${field} : ${text}`);
      }
    });

    return {
      fieldErrors,
      generalMessage: generalMessages.length ? generalMessages.join(" — ") : null,
    };
  }

  return { fieldErrors: {}, generalMessage: "Une erreur est survenue." };
}


export default function AjoutCoordinateur() {
  const navigate = useNavigate();

  const [role, setRole] = useState(null); 
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";
 
  const [createdCoordinatorId, setCreatedCoordinatorId] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [checkingUsername, setCheckingUsername] = useState(false);

  const [showPhotoPopup, setShowPhotoPopup] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [username, setUsername] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [statut, setStatut] = useState("Active");
  const [village, setVillage] = useState("");

  const [errors, setErrors] = useState({});

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [backendError, setBackendError] = useState(null);

  useEffect(() => {
  const trimmed = username.trim();

  if (!trimmed) {
    setCheckingUsername(false);
    return;
  }

  setCheckingUsername(true);

 const timeoutId = setTimeout(async () => {
  try {
    const { data } = await checkUsernameExists(trimmed);

    const taken = Boolean(data?.message);

    if (taken) {
      setErrors((prev) => ({
        ...prev,
        username: data.message,
      }));
    } else {
      clearError("username");
    }
  } catch (err) {
    console.error(
      "Erreur lors de la vérification du nom d'utilisateur :",
      err.response?.data || err.message
    );
  } finally {
    setCheckingUsername(false);
  }
}, 100); 

  return () => clearTimeout(timeoutId);
   }, [username]);

  // Liste réelle des villages 
  const {
    data: villagesData,
    isLoading: villagesLoading,
    isError: villagesError,
  } = useQuery({
    queryKey: ["villages"],
    queryFn: () => listVillages().then((r) => r.data),
  });

  const villages = villagesData?.results ?? villagesData ?? [];

  const villageOptions = villages.map((v) => ({
    label: v.nom,
    value: v.id,
  }));

  const clearError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };


 const handleSave = async () => {

    const newErrors = {};

   if (!username.trim()) {
  newErrors.username = "Veuillez saisir un nom d'utilisateur";
} else if (errors.username) {
  // Conserve une erreur d'unicité déjà détectée en temps réel
  newErrors.username = errors.username;
}
    if (!nom.trim()) newErrors.nom = "Veuillez saisir le nom";
    if (!prenom.trim()) newErrors.prenom = "Veuillez saisir le prénom";
    if (isAdmin && !role) newErrors.role = "Veuillez choisir un rôle";
    if (!email.trim()) newErrors.email = "Veuillez saisir l'email";
    if (!password) newErrors.password = "Veuillez saisir un mot de passe";
    if (!village) newErrors.village = "Veuillez choisir un village";

   setErrors(newErrors);
setBackendError(null);

if (Object.keys(newErrors).length > 0) return;

setSaving(true);
setSaveError(null);

try {
  const payload = {
    username,
    email,
    nom,
    prenom,
    role: isAdmin ? role : "coordinator",
    is_active: statut === "Active",
    village,
    password,
  };

  if (photoFile) {
    payload.photo = photoFile;
  }

  console.log("📦 Payload création coordinateur :", payload);

  const response = await createUser(payload);

  console.log("✅ Coordinateur créé :", response.data);

  setCreatedCoordinatorId(response.data.id);
  setShowSuccessPopup(true);
} catch (error) {
  console.error(
    "❌ Erreur lors de la création du coordinateur :",
    error.response?.data || error.message
  );

  const { fieldErrors, generalMessage } = parseBackendErrors(error.response?.data);

  if (Object.keys(fieldErrors).length > 0) {
    setErrors((prev) => ({ ...prev, ...fieldErrors }));
  }

  if (generalMessage) {
    setBackendError(generalMessage);
  } else if (Object.keys(fieldErrors).length === 0) {
    setSaveError("Une erreur est survenue lors de la création du coordinateur.");
  }
} finally {
  setSaving(false);
}
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      
        <Sidebar role={role} />

        <main className="relative flex-1 min-h-0 overflow-hidden bg-white">

           {/* Espace blanc FIXE en haut — desktop only, mobile déjà géré par Sidebar */}
        <div
          className="
            hidden
            lg:block
            lg:absolute
            lg:top-0
            lg:left-0
            lg:right-0
            lg:h-4
            bg-white
            z-20
          "
        />
          
          

           {/* Zone scrollable UNIQUE */}
        <div
          className="
            h-full
            overflow-y-auto

            pt-20
            lg:pt-4

            px-4
            lg:px-10

            pb-8
            lg:pb-2
          "
        >
       
      

    
        <div className="flex flex-col gap-[14px] lg:gap-[18px]">

          <PageHeader
            leftTitle="Annuler"
            showRight={false}
            onBack={() => window.history.back()}
          />

          <h1
            className="
              text-[20px]
              lg:text-[24px]
              font-bold
              text-black
              text-center
            "
          >
            Nouveau Coordinateur
          </h1>

         <BackendErrorMessage message={backendError || saveError} className="mt-2" />

                   {/* Photo */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setShowPhotoPopup(true)}
              className="relative group"
            >
              <img
                src={photoPreview || Coordinator}
                alt="Coordinateur"
                className="
                  w-[120px]
                  h-[120px]
                  lg:w-[160px]
                  lg:h-[160px]
                  rounded-full
                  object-cover
                "
              />
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
                    text-[13px]
                    font-medium
                    transition-opacity
                  "
                >
                  Modifier
                </span>
              </span>
            </button>
          </div>

          <PopupPhoto
            open={showPhotoPopup}
            title="Photo du coordinateur"
            onClose={() => setShowPhotoPopup(false)}
            onImageSelected={(file) => {
              setPhotoFile(file);
              setPhotoPreview(URL.createObjectURL(file));
            }}
          />

          <div className="flex flex-col gap-1">
  <Input
    label="Nom d'utilisateur"
    placeholder="Entrez le nom d'utilisateur ici"
    value={username}
    onChange={(e) => {
      setUsername(e.target.value);
      clearError("username");
    }}
    noPadding
  />
  {checkingUsername && (
    <p className="text-[12px] text-gray-400 ml-3">Vérification...</p>
  )}
  <ErrorMessage message={errors.username} />
</div>
          <div className="flex flex-col gap-1">
            <Input
              label="Nom"
              placeholder="Entrez le nom ici"
              value={nom}
              onChange={(e) => {
                setNom(e.target.value);
                clearError("nom");
              }}
              noPadding
            />
            <ErrorMessage message={errors.nom} />
          </div>

                    <div className="flex flex-col gap-1">
            <Input
              label="Prénom"
              placeholder="Entrez le prénom ici"
              value={prenom}
              onChange={(e) => {
                setPrenom(e.target.value);
                clearError("prenom");
              }}
              noPadding
            />
            <ErrorMessage message={errors.prenom} />
          </div>

          {isAdmin && (
            <div className="flex flex-col gap-1">
              <SelectInput2
                label="Rôle"
                placeholder="Tapez pour choisir le rôle"
                options={[
                  { label: "Coordinateur", value: "coordinator" },
                  { label: "Chef coordinateur", value: "chef_coordinator" },
                ]}
                value={role}
                onChange={(selected) => {
                  setRole(selected.value);
                  clearError("role");
                }}
                noPadding
              />
              <ErrorMessage message={errors.role} />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <SelectInput2
              label="Village"
              placeholder={
                villagesLoading
                  ? "Chargement des villages..."
                  : "Tapez pour choisir le village"
              }
              options={villageOptions}
              value={village}
              onChange={(selected) => {
                setVillage(selected.value);
                clearError("village");
              }}
              noPadding
            />
            <ErrorMessage message={errors.village} />
            {villagesError && (
              <ErrorMessage message="Impossible de charger la liste des villages." />
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Input
              label="Email"
              placeholder="Entrez l'email ici"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError("email");
              }}
              noPadding
            />
            <ErrorMessage message={errors.email} />
          </div>

          {/* Mot de passe — champ local avec bascule œil affiché/masqué,
              même logique que Login.jsx (icône Eye = visible, EyeOff = masqué) */}
          <div className="flex flex-col gap-1">
            <label className="text-[14px] lg:text-[16px] font-semibold text-black">
              Mot de passe
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Entrez le mot de passe"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError("password");
                }}
                 autoComplete="new-password"
                 name="new-coordinator-password"
                className="
                  w-full
                  h-[45px]
                  rounded-[15px]
                  border
                  border-[#4E9F8A]
                  bg-white
                  px-4
                  pr-10
                  text-[14px]
                  sm:text-[15px]
                  lg:text-[16px]
                  text-black
                  placeholder:text-gray-400
                  focus:outline-none
                "
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                "
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            <ErrorMessage message={errors.password} />
          </div>

                 {/* Bouton */}
<div className="flex flex-col gap-[0px]">
  <Button
    title={saving ? "Enregistrement..." : "Enregistrer"}
    variant="primary"
    noPadding
    onClick={handleSave}
    disabled={saving}
  />

</div>


{showSuccessPopup && (
  <Popup
    title="Enregistrer avec succès"
    image={SuccessImage}
    id={createdCoordinatorId}
    primaryButtonText="Voir le profil du coordinateur"
    secondaryButtonText="Revenir au tableau de bord"
    onPrimaryClick={() => {
      setShowSuccessPopup(false);
      navigate(`/fiche-coordinateur/${createdCoordinatorId}`);
    }}
    onSecondaryClick={() => {
      setShowSuccessPopup(false);
      navigate("/dashboard");
    }}
  />
)}

 </div>
        </div>
        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            h-4
            bg-white
            z-20
          "
        />
      </main>
    </div>
  );
}
