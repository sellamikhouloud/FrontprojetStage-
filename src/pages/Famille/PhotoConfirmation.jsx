import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader.jsx";
import DateContainer from "../../components/Containers/DateContainer.jsx";
import StepIndicator from "../../components/Progress/StepIndicator.jsx";
import Button from "../../components/Button/Button.jsx";
import { useNavigate } from "react-router-dom";
import Popup from "../../components/Popups/SuccessPopup.jsx";
import CoordinateurSelector from "../../components/Containers/CoordinateurSelector.jsx";
import PopupListeCoordinateurs from "../../components/Popups/PopupListeCoordinateurs.jsx";
import ErrorMessage from "../../components/Forms/ErrorMessage.jsx";
import { useFamilyForm } from "../../context/FamilyFormContext";
import { searchMere, createFamille } from "../../lib/api/familles";
import { listUsers } from "../../lib/api/users";
import { useAuth } from "../../components/Providers/AuthProvider";
import BackendErrorMessage from "../../components/Forms/BackendErrorMessage.jsx";



import successImage from "../../assets/Success.svg"; 
import blackCamera from "../../assets/blackCamera.svg";
import warning from "../../assets/warning.svg";
import ArrowRight from "../../assets/right-arrow.png";

function parseBackendErrors(data, parentLabel = "") {
  if (!data) return [];

  if (typeof data === "string") {
    return [parentLabel ? `${parentLabel} : ${data}` : data];
  }

  if (Array.isArray(data)) {
    return data
      .filter((m) => typeof m === "string")
      .map((m) => (parentLabel ? `${parentLabel} : ${m}` : m));
  }

  if (typeof data === "object") {
    let messages = [];
    Object.entries(data).forEach(([field, value]) => {
      const label = parentLabel ? `${parentLabel} → ${field}` : field;
      messages = messages.concat(parseBackendErrors(value, label));
    });
    return messages;
  }

  return [String(data)];
}


export default function PhotoConfirmation() {

  
  const [relecture, setRelecture] = useState("");
  const [createdFamilleId, setCreatedFamilleId] = useState(null);
  const navigate = useNavigate();
 const {
  formData,
  updateMere,
  updateFamilyData,
  resetFamilyForm,
} = useFamilyForm();
      const [photoPreview, setPhotoPreview] = useState(null);
      const photoInputRef = useRef(null);

useEffect(() => {
  const photo = formData.mere?.photo;

  if (!photo) {
    setPhotoPreview(null);
    return;
  }

  // Si la photo est encore un File
  if (photo instanceof File) {
    const url = URL.createObjectURL(photo);

    setPhotoPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }

  // Si plus tard ton backend renvoie une URL
  if (typeof photo === "string") {
    setPhotoPreview(photo);
  }
}, [formData.mere?.photo]);

const handleRemovePhoto = () => {
  updateMere({ photo: null });
  if (photoInputRef.current) {
    photoInputRef.current.value = ""; 
  }
};

useEffect(() => {
  if (!formData.date_entree) {
    const today = new Date();

    const formattedDate =
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    updateFamilyData({
      date_entree: formattedDate,
    });
  }
}, [formData.date_entree, updateFamilyData]);

  const [showPopup, setShowPopup] = useState(false);
  const [openCoordinateurs, setOpenCoordinateurs] = useState(false);

  const [errors, setErrors] = useState({});

  // Liste réelle des coordinateurs, chargée depuis l'API (remplace le tableau en dur)
  const [coordinateurs, setCoordinateurs] = useState([]);
  const [coordinateursLoading, setCoordinateursLoading] = useState(false);
  const [coordinateursError, setCoordinateursError] = useState(null);

  const selectedCoordinateur = coordinateurs.find(
  (coordinateur) => coordinateur.id === formData.coordinateur
);

  const clearError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

 const [saving, setSaving] = useState(false);
 const [saveError, setSaveError] = useState(null);

const handleSave = async () => {
  const newErrors = {};

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) return;

  setSaving(true);
  setSaveError(null);

  try {
    const nourrissons = formData.nourrissons?.length
      ? formData.nourrissons
      : [formData.nourrisson];

    const resultats = [];

    /*
     * IMPORTANT :
     *
     * On garde l'id dans une variable locale.
     *
     * On ne fait PAS :
     *
     * updateFamilyData({ id_mere: ... })
     *
     * puis formData.id_mere immédiatement après,
     * car React peut encore avoir l'ancienne valeur.
     */
    let currentIdMere = formData.id_mere || null;

    for (let i = 0; i < nourrissons.length; i++) {

      // =====================================================
      // 1️⃣ SEARCH DE LA MÈRE AVANT CHAQUE CRÉATION
      // =====================================================

      console.log(
        `🔎 Recherche mère avant création enfant ${i + 1}`
      );

      const searchResponse = await searchMere({
        nom: formData.mere.nom,
        prenom: formData.mere.prenom,
        date_naissance: formData.mere.date_naissance,
      });

      console.log(
        "🔎 Résultat recherche mère :",
        searchResponse.data
      );

      const searchedIdMere =
        searchResponse.data?.id ?? null;

      console.log(
        "🆔 ID mère trouvé par search :",
        searchedIdMere
      );

      // =====================================================
      // 2️⃣ SI LA MÈRE EXISTE → ON UTILISE SON ID
      // =====================================================

      if (searchedIdMere) {
        currentIdMere = searchedIdMere;

        console.log(
          "♻️ Mère existante utilisée :",
          currentIdMere
        );

        // On garde aussi l'id dans le contexte
        updateFamilyData({
          id_mere: currentIdMere,
        });
      }

      // =====================================================
      // 3️⃣ CONSTRUCTION DU PAYLOAD
      // =====================================================

           let payload;

      const photo = formData.mere?.photo;
      const isNewPhotoFile = photo instanceof File;

      const baseFields = {
        id_mere: currentIdMere || undefined,
        nourrisson: nourrissons[i],
        date_entree: formData.date_entree,
        statut: formData.statut,
        date_sortie: formData.date_sortie,
        motif_sortie: formData.motif_sortie,
        coordinateur: formData.coordinateur,
      };

      if (isNewPhotoFile) {
        // FormData obligatoire : upload binaire → notation pointée "mere.xxx"
        payload = new FormData();

        Object.entries(formData.mere || {}).forEach(([key, value]) => {
          if (key === "photo") return; // photo gérée séparément ci-dessous
          if (value === null || value === undefined) return;
          payload.append(`mere.${key}`, value);
        });

        payload.append("mere.photo", photo);

        if (currentIdMere) {
          payload.append("id_mere", currentIdMere);
        }

        Object.entries(nourrissons[i] || {}).forEach(([key, value]) => {
         if (value === null || value === undefined) return;
         payload.append(`nourrisson.${key}`, value);
         });
        payload.append("date_entree", formData.date_entree ?? "");
        payload.append("statut", formData.statut ?? "");
        if (formData.date_sortie) payload.append("date_sortie", formData.date_sortie);
        if (formData.motif_sortie) payload.append("motif_sortie", formData.motif_sortie);
        if (formData.coordinateur) payload.append("coordinateur", formData.coordinateur);

      } else {
        // Pas de nouveau fichier : JSON classique (photo reste null ou URL existante)
        payload = {
          mere: { ...formData.mere, photo: photo ?? null },
          ...baseFields,
        };
      }

      console.log("📦 Payload construit :", payload);
      // =====================================================
      // 4️⃣ CRÉATION DE LA FAMILLE
      // =====================================================

      console.log(
        `📦 Création famille enfant ${i + 1}/${nourrissons.length}`
      );
      console.log("📸 PHOTO AVANT ENVOI :", formData.mere.photo);
console.log(
  "📸 EST UN FILE ?",
  formData.mere.photo instanceof File
);

      const response = await createFamille(payload);

      console.log(
        `✅ Famille enfant ${i + 1} créée :`,
        response.data
      );

      resultats.push(response.data);

      // =====================================================
      // 5️⃣ SI ON VIENT DE CRÉER UNE NOUVELLE MÈRE
      // =====================================================
      //
      // On refait un search immédiatement après.
      //
      // Ainsi, pour l'enfant suivant, la mère sera trouvée.
      //

      if (!currentIdMere) {

        console.log(
          "🔎 Nouvelle recherche après création de la mère..."
        );

        const searchAfterCreate =
          await searchMere({
            nom: formData.mere.nom,
            prenom: formData.mere.prenom,
            date_naissance:
              formData.mere.date_naissance,
          });

        console.log(
          "🔎 Mère après création :",
          searchAfterCreate.data
        );

        const newIdMere =
          searchAfterCreate.data?.id ?? null;

        if (newIdMere) {

          currentIdMere = newIdMere;

          console.log(
            "🆔 ID mère récupéré après création :",
            currentIdMere
          );

          updateFamilyData({
            id_mere: currentIdMere,
          });
        }
      }
    }

    console.log(
      "✅ Toutes les familles créées :",
      resultats
    );
    setCreatedFamilleId(resultats[0]?.id ?? null);

    setShowPopup(true);

    resetFamilyForm();

 } catch (error) {
  console.error(
    "❌ Erreur lors de la création :",
    error.response?.data || error.message
  );

  const backendData = error.response?.data;
  const messages = parseBackendErrors(backendData);

  setSaveError(
    messages.length > 0
      ? messages.join(" — ")
      : "Une erreur est survenue lors de l'enregistrement."
  );
} finally {
  setSaving(false);
}
};

 
const { user, ready } = useAuth();
const role = user?.role ?? null;
const isAdmin = role === "admin" || role === "chef_coordinator";

// Charge la liste réelle des coordinateurs dès qu'on sait que l'utilisateur
// est admin/chef_coordinator (donc après que isAdmin soit calculé ci-dessus)

useEffect(() => {
  if (!isAdmin) return;

  let cancelled = false;

  const fetchCoordinateurs = async () => {
    setCoordinateursLoading(true);
    setCoordinateursError(null);

    try {
      const response = await listUsers();
      const raw = response.data;
      const data = Array.isArray(raw) ? raw : raw?.results ?? [];

      const activeOnly = data.filter(
        (c) =>
          c.is_active &&
          (c.role === "coordinator" || c.role === "chef_coordinator")
      );

     const mapped = activeOnly.map((c) => ({
  id: c.id,
  name: `${c.prenom} ${c.nom}`,
  code: String(c.id),
  village: c.village?.nom || "",
  familles: c.nb_familles,
  status: c.is_active ? "Actif" : "Inactif",
  username: c.username || "/",
  creePar: c.created_by ? `${c.created_by.nom} ${c.created_by.prenom}` : "/",
  isChef: c.role === "chef_coordinator",
}));

      if (!cancelled) {
        setCoordinateurs(mapped);
      }
    } catch (error) {
      console.error(
        "Erreur lors du chargement des coordinateurs :",
        error.response?.data || error.message
      );
      if (!cancelled) {
        setCoordinateursError(
          "Impossible de charger la liste des coordinateurs."
        );
      }
    } finally {
      if (!cancelled) {
        setCoordinateursLoading(false);
      }
    }
  };

  fetchCoordinateurs();   

  return () => {
    cancelled = true;
  };
}, [isAdmin]);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
        {/* Sidebar */}
      
         <Sidebar  />
      
  
     
   <main className="relative flex-1 min-h-0 overflow-hidden bg-white">
  
    {/* Espace blanc FIXE en haut — desktop only */}
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
  
            <div className="min-h-full flex flex-col lg:justify-center">
        <div className="flex flex-col gap-[14px] lg:gap-[18px]">
          {/* Header */}
          <PageHeader
            leftTitle="Annuler"
            showRight={false}
            onBack={() => navigate("/liste-famille")}
          />

          {/* Title */}
          <h1
            className="
              text-[20px]
              lg:text-[24px]
              font-bold
              text-center
            "
          >
            Photo & confirmation
          </h1>

    <div className="relative w-full">
  <input
    id="photo-mere"
    ref={photoInputRef}
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e) => {
      const file = e.target.files?.[0];

      if (!file) return;

      console.log("PHOTO SELECTIONNÉE :", file);

      updateMere({
        photo: file,
      });
    }}
  />

   <div
    onClick={() => photoInputRef.current?.click()}
    className={`
      relative
      group
      w-full
      ${photoPreview ? "h-[350px] lg:h-[450px]" : "h-[180px] lg:h-[200px]"}
      border
      border-dashed
      border-[#89BFB1]
      rounded-[20px]
      flex
      flex-col
      items-center
      justify-center
      gap-3
      cursor-pointer
      overflow-hidden
      transition-all
      duration-300
    `}
  >
    {photoPreview ? (
      <>
        <img
          src={photoPreview}
          alt="Photo de la mère"
          className="w-full h-full object-cover"
        />

        <span
          className="
            absolute
            inset-0
            rounded-[20px]
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
              text-[14px]
              font-medium
              transition-opacity
            "
          >
            Modifier
          </span>
        </span>
      </>
    ) : (
      <>
        <img
          src={blackCamera}
          alt="Camera"
          className="
            w-[45px]
            h-[45px]
            lg:w-[55px]
            lg:h-[55px]
          "
        />

        <span className="text-[16px] font-medium text-black">
          Tapez pour prendre une photo
        </span>
      </>
    )}
  </div>

  {photoPreview && (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        handleRemovePhoto();
      }}
      className="
        absolute
        top-3
        right-3
        w-7 h-7
        rounded-full
        bg-white
        shadow-sm
        flex
        items-center
        justify-center
      "
      aria-label="Supprimer la photo"
    >
      <X size={16} color="#202124" strokeWidth={2.5} />
    </button>
  )}
</div>

       
         {/* Warning */}
<div
  className="
    flex
    flex-col
    sm:flex-row
    items-center
    justify-center
    gap-2
  "
>
  <img
    src={warning}
    alt="Warning"
    className="w-[16px] h-[16px] lg:w-[20px] lg:h-[20px]"
  />

  <p
    className="
      text-[12px]
      lg:text-[16px]
      font-medium
      text-[#CC8409]
      text-center
      sm:text-left
    "
  >
    Aucune photo du nourrisson ne doit être prise ou stockée.
  </p>
</div>

          {/* Date */}
          <DateContainer 
  label="Date d'entrée dans le programme"
  value={formData.date_entree || null}
  onChange={(date) => {
    
    updateFamilyData({
      date_entree: date,
    });
  }}
  noPadding
/>

        {/* Coordinator — réservé à l'admin, optionnel */}
{isAdmin && (
  <div className="flex flex-col gap-1">
   <CoordinateurSelector 
  selectedCoordinateur={selectedCoordinateur}
  onOpenPopup={() => setOpenCoordinateurs(true)}
/>
    <ErrorMessage message={errors.coordinateur} />
    {coordinateursError && (
      <ErrorMessage message={coordinateursError} />
    )}

    {!selectedCoordinateur && (
      <div className="flex items-start gap-2 mt-1">
        <img
          src={warning}
          alt="Warning"
          className="w-[16px] h-[16px] mt-[2px] shrink-0"
        />
        <p className="text-[13px] font-medium text-[#CC8409] leading-4">
          Si vous ne choisissez aucun coordinateur, vous serez désigné(e) comme superviseur de cette famille.
        </p>
      </div>
    )}
  </div>
)}

          {/* Review */}
         <div
 
    onClick={() => navigate("/information-mere")}
  className="
    w-full
    h-[46px]
    border
    border-[#89BFB1]
    rounded-[15px]
    bg-white

    flex
    items-center
    justify-between

    px-4
    cursor-pointer

    transition-all
    duration-200
    hover:bg-[#F8FDFC]
  "
>
  <span
    className="
      text-[14px]
      lg:text-[16px]
      font-medium
      text-black
    "
  >
    Relecture des informations saisies
  </span>

  <img
    src={ArrowRight}
    alt="Arrow Right"
    className="w-[8px] h-[12px]"
  />
</div>

          {/* Steps */}
          <StepIndicator
            totalSteps={3}
            currentStep={3}
          />
{saveError && <BackendErrorMessage message={saveError} className="mt-1" />}
          {/* Save Button */}
        <Button
  title={saving ? "Enregistrement..." : "Enregistrer"}
  variant="primary"
  noWrapperPadding
  onClick={handleSave}
  disabled={saving}
/>

{showPopup && (
  <Popup
    title="Enregistrer avec succès"
    image={successImage}
    id={createdFamilleId}
    primaryButtonText="Voir la fiche de la famille"
    secondaryButtonText="Revenir à l'accueil"
    onPrimaryClick={() => navigate(`/famille/${createdFamilleId}`)}
    onSecondaryClick={() => navigate("/dashboard")}
  />
)}
<PopupListeCoordinateurs
  open={openCoordinateurs}
  onClose={() => setOpenCoordinateurs(false)}
  coordinateurs={coordinateurs}
  loading={coordinateursLoading}
 onSelectCoordinateur={(coordinateur) => {
  updateFamilyData({
    coordinateur: coordinateur.id,
  });

  setOpenCoordinateurs(false);
  clearError("coordinateur");
}}
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
            h-4
            bg-white
            z-20
          "
        />

      
      </main>
    </div>
  );
}
