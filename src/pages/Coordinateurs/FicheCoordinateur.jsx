import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { useNavigate, useParams, useLocation } from "react-router-dom";

import { Eye, EyeOff } from "lucide-react";


import Sidebar from "../../components/Sidebar/Sidebar";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
import Input from "../../components/Containers/ContainerEcriture";
import ContainerEcritureModifier from "../../components/Containers/ContainerEcritureModifier";
import ChoiceContainerModifier from "../../components/Containers/ChoiceContainerModifier";
import SelectInput2 from "../../components/Containers/ChoiceContainer2";
import DateContainer from "../../components/Containers/DateContainer";
import Button from "../../components/Button/Button";
import { AiOutlineInfoCircle } from "react-icons/ai";
import SuccessBanner from "../../components/Popups/SuccessBanner";
import ErrorMessage from "../../components/Forms/ErrorMessage";
import BackendErrorMessage from "../../components/Forms/BackendErrorMessage";
import PopupPhoto from "../../components/Popups/PopupPhoto";
import Coordinator from "../../assets/images/Coordinator.svg";


import {
  updateCoordinateur,
  activateCoordinateur,
  deactivateCoordinateur,
} from "../../lib/api/coordinateurs";
import {checkUsernameExists , getUserById} from "../../lib/api/users";


import { listVillages } from "../../lib/api/Parametres";

import { useAuth } from "../../components/Providers/AuthProvider";


const KNOWN_FIELDS = ["username", "nom", "prenom", "email", "telephone", "village", "password", "photo"];

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

export default function ModifierCoordinateur() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [backendError, setBackendError] = useState(null);
  const [errors, setErrors] = useState({});

  const [checkingUsername, setCheckingUsername] = useState(false);

  const [showPhotoPopup, setShowPhotoPopup] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);


  const clearError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const [showBanner, setShowBanner] = useState(false);


  // Champs du formulaire
 
  const [username, setUsername] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [statut, setStatut] = useState("Active");
  const [dateEntree, setDateEntree] = useState(null);
  const [password, setPassword] = useState("");
  const [village, setVillage] = useState("");
  const [familles, setFamilles] = useState(0);
  const [telephone, setTelephone] = useState("");
  const [creePar, setCreePar] = useState("");
  const [modifiePar, setModifiePar] = useState("");
  const [dateModification, setDateModification] = useState(null);
  const [showPassword, setShowPassword] = useState(false);


  // Statut original pour ne PAS appeler activate/deactivate si rien n'a changé
  const [statutOriginal, setStatutOriginal] = useState("Active");

 const passedCoordinateur = location.state?.coordinateur;
const hasPassedMatch =
  passedCoordinateur && String(passedCoordinateur.id) === String(id);

const {
  data: found,
  isLoading: userLoading,
  isError: userError,
  error: userErrorObj,
} = useQuery({
  queryKey: ["user", id],
  queryFn: () => getUserById(id).then((r) => r.data),
  initialData: hasPassedMatch ? passedCoordinateur : undefined,
  enabled: !!id,
});

const loading = userLoading && !found;
const loadError = userError
  ? userErrorObj?.response?.data?.detail || "Coordinateur introuvable."
  : null;

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
  const [roleCoordinateur, setRoleCoordinateur] = useState("coordinator");

  const villageOptions = villages.map((v) => ({
    label: v.nom,
    value: v.id,
  }));


useEffect(() => {
  if (!found) return;

 
  setUsername(found.username || "");
  setNom(found.nom || "");
  setPrenom(found.prenom || "");
  setEmail(found.email || "");
  setTelephone(found.telephone || "");
  setFamilles(found.nb_familles ?? 0);

  // created_by / updated_by arrivent déjà résolus en {nom, prenom}
  setCreePar(
    found.created_by
      ? `${found.created_by.nom} ${found.created_by.prenom}`
      : "—"
  );
  setModifiePar(
  found.updated_by
    ? `${found.updated_by.nom} ${found.updated_by.prenom}`
    : null
);
setDateModification(
  found.updated_by && found.updated_at ? new Date(found.updated_at) : null
);
  setDateEntree(found.created_at ? new Date(found.created_at) : null);

  const currentStatut = found.is_active ? "Active" : "Inactive";
  setStatut(currentStatut);
  setStatutOriginal(currentStatut);

  setVillage(found.village?.id ?? "");
  setRoleCoordinateur(found.role || "");
  setPhotoPreview(found.photo || null);
  setPhotoFile(null);

  //  On ne préremplit JAMAIS le vrai mot de passe.
  setPassword("");
}, [found]);

useEffect(() => {
  const trimmed = username.trim();

  if (!trimmed || !found) {
    setCheckingUsername(false);
    return;
  }

  // Pas de vérification si l'utilisateur n'a pas changé son propre username
  if (trimmed === found.username) {
    setCheckingUsername(false);
    clearError("username");
    return;
  }

  setCheckingUsername(true);

const timeoutId = setTimeout(async () => {
  try {
    await checkUsernameExists(trimmed);
    // Si la requête réussit (200), le username est disponible
    clearError("username");
  } catch (err) {
    const message = err.response?.data?.erreur;

    if (err.response?.status === 400 && message) {
      // Username déjà pris — le backend renvoie 400 + { erreur: "..." }
      setErrors((prev) => ({
        ...prev,
        username: message,
      }));
    } else {
      console.error(
        "Erreur lors de la vérification du nom d'utilisateur :",
        err.response?.data || err.message
      );
      // Erreur réseau/autre — on ne bloque pas l'utilisateur
    }
  } finally {
    setCheckingUsername(false);
  }
}, 100);

  return () => clearTimeout(timeoutId);
}, [username, found]);

const handleSave = async () => {
  const newErrors = {};

  if (!username.trim()) {
  newErrors.username = "Veuillez saisir le nom d'utilisateur";
} else if (errors.username) {
  newErrors.username = errors.username;
}
  if (!nom.trim()) newErrors.nom = "Veuillez saisir le nom";
  if (!prenom.trim()) newErrors.prenom = "Veuillez saisir le prénom";

  if (!email.trim()) {
    newErrors.email = "Veuillez saisir l'email";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    newErrors.email = "Format d'email invalide";
  }

  if (!telephone.trim()) newErrors.telephone = "Veuillez saisir le téléphone";

  if (!village) newErrors.village = "Veuillez choisir un village";

  if (password && password.length < 8) {
    newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
  }

  setErrors(newErrors);
  setBackendError(null);

  if (Object.keys(newErrors).length > 0) return;

  setSaving(true);
  setSaveError(null);

  try {
    if (statut !== statutOriginal) {
      if (statut === "Active") {
        await activateCoordinateur(id);
      } else {
        await deactivateCoordinateur(id);
      }
      setStatutOriginal(statut);
    }

   let payload;

if (photoFile) {
  payload = new FormData();
  payload.append("username", username);
  payload.append("nom", nom);
  payload.append("prenom", prenom);
  payload.append("email", email);
  payload.append("telephone", telephone);
  payload.append("village", village);

  if (isAdmin) {
    payload.append("role", roleCoordinateur);
  }
  if (password.trim()) {
    payload.append("password", password);
  }

  payload.append("photo", photoFile);
} else {
  payload = { username, nom, prenom, email, telephone, village };

  if (isAdmin) {
    payload.role = roleCoordinateur;
  }
  if (password.trim()) {
    payload.password = password;
  }
}

await updateCoordinateur(id, payload);

    // Succès réel uniquement
    setShowBanner(true);
    setTimeout(() => {
      navigate("/liste-coordinateurs");
    }, 1500);
  } catch (err) {
    console.error(
      "Erreur lors de l'enregistrement :",
      err.response?.data || err.message
    );

    const { fieldErrors, generalMessage } = parseBackendErrors(err.response?.data);

    if (Object.keys(fieldErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
    }

    if (generalMessage) {
      setBackendError(generalMessage);
    } else if (Object.keys(fieldErrors).length === 0) {
      setSaveError("Une erreur est survenue lors de l'enregistrement.");
    }
  } finally {
    setSaving(false);
  }
};


  return (
     <div className="flex h-screen bg-white overflow-hidden">
         {/* Sidebar */}
         
          <Sidebar 
            showTopBarIcons={false} 
            showTopBarAvatar={false}
             />

      {/* Contenu */}

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
           onBack={() => navigate("/liste-coordinateurs")}
          />

          <h1 className="text-[20px] lg:text-[24px] font-bold text-center">
            Fiche Coordinateur
          </h1>

         

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
<BackendErrorMessage message={errors.photo} />

<PopupPhoto
  open={showPhotoPopup}
  title="Photo du coordinateur"
  onClose={() => setShowPhotoPopup(false)}
  onImageSelected={(file) => {
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    clearError("photo");
  }}
/>

          {loading && (
            <p className="text-center text-gray-500">Chargement...</p>
          )}

           {!loading && loadError && (
            <BackendErrorMessage message={loadError} />
          )}

          

          <BackendErrorMessage message={backendError || saveError} className="mt-2" />

          {!loading && !loadError && (
            <>

              {/* Nom d'utilisateur */}
              <div className="flex flex-col gap-1">
                <ContainerEcritureModifier
                  label="Nom d'utilisateur"
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

              {/* Nom */}
              <div className="flex flex-col gap-1">
                <ContainerEcritureModifier
                  label="Nom"
                  value={nom}
                  onChange={(e) => {
                    setNom(e.target.value);
                    clearError("nom");
                  }}
                  noPadding
                />
                <ErrorMessage message={errors.nom} />
              </div>

              {/* Prénom */}
              <div className="flex flex-col gap-1">
                <ContainerEcritureModifier
                  label="Prénom"
                  value={prenom}
                  onChange={(e) => {
                    setPrenom(e.target.value);
                    clearError("prenom");
                  }}
                  noPadding
                />
                <ErrorMessage message={errors.prenom} />
              </div>

               {/* Village */}
              <div className="flex flex-col gap-1">
                <ChoiceContainerModifier
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

              {/* Rôle */}
<div className="flex flex-col gap-1">
  {isAdmin ? (
    <ChoiceContainerModifier
      label="Rôle"
      value={roleCoordinateur}
      onChange={(selected) => {
        setRoleCoordinateur(selected.value);
        clearError("role");
      }}
      options={[
        { label: "Chef coordinateur", value: "chef_coordinator" },
        { label: "Coordinateur", value: "coordinator" },
      ]}
      noPadding
    />
  ) : (
    <Input
      label="Rôle"
      value={
        roleCoordinateur === "chef_coordinator"
          ? "Chef coordinateur"
          : "Coordinateur"
      }
      disabled
      readOnly
      noPadding
    />
  )}
  <ErrorMessage message={errors.role} />
</div>

{/* Téléphone */}
<div className="flex flex-col gap-1">
  <ContainerEcritureModifier
    label="Téléphone"
    value={telephone}
    onChange={(e) => {
      setTelephone(e.target.value);
      clearError("telephone");
    }}
    noPadding
  />
  <ErrorMessage message={errors.telephone} />
</div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <ContainerEcritureModifier
                  label="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError("email");
                  }}
                  noPadding
                />
                <ErrorMessage message={errors.email} />
              </div>

             

              {/* Date d'entrée (non modifiable) */}
              <DateContainer
                label="Date d'entrée"
                value={dateEntree}
                disabled
                readOnly
                noPadding
              />

             

              {/* Créé par  */}
              <Input label="Créé par" value={creePar} disabled readOnly noPadding />


               {modifiePar && (
                 <>

              {/* Modifié par (non modifiable) */}
              <Input label="Modifié par" value={modifiePar} disabled readOnly noPadding />

              {/* Date de modification (non modifiable) */}
              <DateContainer
                label="Date de modification"
                value={dateModification}
                disabled
                readOnly
                noPadding
              />
               </>
               )}

             <div className="flex flex-col gap-1">
  <label className="text-[14px] lg:text-[16px] font-semibold text-black">
    Mot de passe
  </label>
  <div className="relative w-full">
    <input
      type={showPassword ? "text" : "password"}
      placeholder="Laisser vide pour ne pas modifier"
      value={password}
      onChange={(e) => {
        setPassword(e.target.value);
        clearError("password");
      }}
      autoComplete="new-password"
      name="modifier-coordinator-password"
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

  <div className="mt-1 flex items-center gap-1 text-[#F59E0B]">
    <AiOutlineInfoCircle className="text-[16px] shrink-0" />
    <p className="text-[13px] font-medium leading-4">
      Toute modification du mot de passe sera automatiquement envoyée au
      coordinateur par e-mail après l'enregistrement.
    </p>
  </div>
</div>
              {/* Statut */}
          
<ChoiceContainerModifier
  label="Statut"
  value={statut}
  onChange={(selected) => setStatut(selected.value)}
  options={[
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ]}
  noPadding
/>

              
      {showBanner && <SuccessBanner text="Enregistrer avec succès" />}
              {/* Boutons */}
              <div className="flex flex-col gap-[0px]">
                <Button
                  title={saving ? "Enregistrement..." : "Sauvegarder les modifications"}
                  variant="primary"
                  noPadding
                  onClick={handleSave}
                  disabled={saving}
                />

                

            
              </div>
            </>
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
