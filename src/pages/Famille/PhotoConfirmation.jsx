import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
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
import { saveDraft, deleteDraft } from "@/lib/offlineDrafts";



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

const isFutureDate = (date) => {
  if (!date) return false;

  const selected = new Date(date);
  selected.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selected > today;
};


export default function PhotoConfirmation() {

  

 const [createdFamilleIds, setCreatedFamilleIds] = useState([]);
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

 const [offlinePending, setOfflinePending] = useState(false);

const handleSave = async () => {
  const newErrors = {};

   if (isFutureDate(formData.date_entree)) {
    newErrors.date_entree = "La date d'entrée ne peut pas être une date future";
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) return;

  setSaving(true);
  setSaveError(null);
  setOfflinePending(false);

  try {
    const nourrissons = formData.nourrissons?.length
      ? formData.nourrissons
      : [formData.nourrisson];

    const resultats = [];

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

      const response = await createFamille(payload);

      resultats.push(response.data);

      // =====================================================
      // 5️⃣ SI ON VIENT DE CRÉER UNE NOUVELLE MÈRE
      // =====================================================
    

      if (!currentIdMere) {

        const searchAfterCreate =
          await searchMere({
            nom: formData.mere.nom,
            prenom: formData.mere.prenom,
            date_naissance:
              formData.mere.date_naissance,
          });


        const newIdMere =
          searchAfterCreate.data?.id ?? null;

        if (newIdMere) {

          currentIdMere = newIdMere;

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
  setCreatedFamilleIds(resultats.map((r) => r?.id).filter(Boolean));

    
    if (formData.sourceDraftClientId) {
      await deleteDraft(formData.sourceDraftClientId);
    }

    setShowPopup(true);

    resetFamilyForm();

 } catch (error) {

  if (!error.response) {
    try {
     const nourrissonsDraft = formData.nourrissons?.length
  ? formData.nourrissons
  : [formData.nourrisson];

const { photo, ...mereSansPhoto } = formData.mere || {};

// Toujours hors ligne : on remplace l'ancien brouillon par le nouveau,
// plutôt que de garder les deux (éviter les doublons).
if (formData.sourceDraftClientId) {
  await deleteDraft(formData.sourceDraftClientId);
}

await saveDraft(
  "famille",
  {
    mere: mereSansPhoto,
    nourrissons: nourrissonsDraft,
   
    nourrissonClientIds: nourrissonsDraft.map(() => crypto.randomUUID()),
    date_entree: formData.date_entree,
    statut: formData.statut,
    date_sortie: formData.date_sortie,
    motif_sortie: formData.motif_sortie,
    coordinateur: formData.coordinateur,
  },
  photo instanceof File ? { photo } : undefined
);

      setCreatedFamilleIds([]);
      setOfflinePending(true);
      setShowPopup(true);
      resetFamilyForm();
    } catch (draftError) {
      console.error("❌ Impossible d'enregistrer le brouillon de famille :", draftError);
      setSaveError(
        "Impossible d'enregistrer la famille, même hors ligne. Veuillez réessayer."
      );
    }
    setSaving(false);
    return;
  }

  // Le serveur a répondu avec une erreur — inchangé.
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

const [searchCoordinateur, setSearchCoordinateur] = useState("");


const {
  data: coordinateursResponse,
  isLoading: coordinateursLoading,
  isError: coordinateursIsError,
  fetchNextPage: fetchNextCoordinateursPage,
  hasNextPage: hasNextCoordinateursPage,
  isFetchingNextPage: isFetchingNextCoordinateursPage,
} = useInfiniteQuery({
  queryKey: ["coordinateurs", "infinite", searchCoordinateur],

  queryFn: async ({ pageParam = 1 }) => {
    const params = { page: pageParam, is_active: true };

    const trimmedSearch = searchCoordinateur.trim();
    if (trimmedSearch) {
      params.search = trimmedSearch;
    }

    const response = await listUsers(params);
    return response.data;
  },

  getNextPageParam: (lastPage, allPages) =>
    lastPage?.next ? (allPages?.length ?? 0) + 1 : undefined,

  initialPageParam: 1,
  keepPreviousData: true,
  enabled: isAdmin,
});
const coordinateursData = (coordinateursResponse?.pages ?? []).flatMap((page) =>
  Array.isArray(page) ? page : page?.results ?? []
);

const coordinateurs = coordinateursData
  .filter((c) => c.is_active && (c.role === "coordinator" || c.role === "chef_coordinator"))
  .map((c) => ({
    id: c.id,
    nom: c.nom,
    prenom: c.prenom,
    name: `${c.nom} ${c.prenom}`,
    code: String(c.id),
    village: c.village?.nom ?? "",
    familles: c.nb_familles ?? 0,
    status: c.is_active ? "Actif" : "Inactif",
    username: c.username ?? "/",
    creePar: c.created_by
      ? `${c.created_by.nom ?? ""} ${c.created_by.prenom ?? ""}`.trim()
      : "/",
  }));

const coordinateursObserverTarget = useRef(null);

useEffect(() => {
  if (!coordinateursObserverTarget.current || !openCoordinateurs) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (
        entries[0].isIntersecting &&
        hasNextCoordinateursPage &&
        !isFetchingNextCoordinateursPage
      ) {
        fetchNextCoordinateursPage();
      }
    },
    { threshold: 1 }
  );

  observer.observe(coordinateursObserverTarget.current);

  return () => observer.disconnect();
}, [
  openCoordinateurs,
  hasNextCoordinateursPage,
  isFetchingNextCoordinateursPage,
  fetchNextCoordinateursPage,
]);


  const selectedCoordinateur = coordinateurs.find(
  (coordinateur) => coordinateur.id === formData.coordinateur
);



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
           onBack={() => {
           resetFamilyForm();
           navigate(formData.returnTo || "/liste-famille");
           }}
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
                       
          <div className="flex flex-col gap-1">
            <DateContainer 
              label="Date d'entrée dans le programme"
              value={formData.date_entree || null}
              onChange={(date) => {
                updateFamilyData({
                  date_entree: date,
                });

                if (isFutureDate(date)) {
                  setErrors((prev) => ({
                    ...prev,
                    date_entree: "La date d'entrée ne peut pas être une date future",
                  }));
                } else {
                  clearError("date_entree");
                }
              }}
              noPadding
            />
            <ErrorMessage message={errors.date_entree} />

          </div>

         

        {/* Coordinator — réservé à l'admin, optionnel */}
{isAdmin && (
  <div className="flex flex-col gap-1">
   <CoordinateurSelector 
  selectedCoordinateur={selectedCoordinateur}
  onOpenPopup={() => setOpenCoordinateurs(true)}
/>
       <ErrorMessage message={errors.coordinateur} />
    {coordinateursIsError && (
      <ErrorMessage message="Impossible de charger la liste des coordinateurs." />
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
    title={
      offlinePending
        ? "Famille enregistrée en brouillon hors ligne — à valider depuis « Brouillons hors ligne »"
        : "Enregistrer avec succès"
    }
    image={offlinePending ? null : successImage}
    id={
      !offlinePending && createdFamilleIds.length === 1
        ? createdFamilleIds[0]
        : null
    }
   extraContent={
  !offlinePending && createdFamilleIds.length > 1 ? (
    <div className="flex flex-col gap-2 border-t border-[#E5E7EB] pt-4 w-full">
      <p className="text-[18px] font-bold text-[#202124]">
        Codes des familles créées
      </p>
      <div className="grid grid-cols-2 gap-2">
        {createdFamilleIds.map((id, i) => (
          <span
            key={id ?? i}
            className="text-[18px] font-semibold text-[#3B5BA9] bg-[#EEF3FF] rounded-full px-3 py-1 text-center"
          >
            {`${id}`}
          </span>
        ))}
      </div>
    </div>
  ) : null
}
    primaryButtonText={
      offlinePending ? "Voir les brouillons hors ligne" : "Ajouter une visite"
    }
    secondaryButtonText="Revenir à l'accueil"
    onPrimaryClick={() => {
      setShowPopup(false);
     if (offlinePending) {
    navigate("/brouillons-hors-ligne");
  } else {
    navigate("/ajout-visite", {
      state: {
        newlyCreatedFamilleIds: createdFamilleIds,
      },
    });
  }
      setOfflinePending(false);
    }}
    onSecondaryClick={() => {
      setShowPopup(false);
      setOfflinePending(false);
      navigate("/dashboard");
    }}
  />
)}

<PopupListeCoordinateurs
  open={openCoordinateurs}
  onClose={() => setOpenCoordinateurs(false)}
  coordinateurs={coordinateurs}
  loading={coordinateursLoading}
  isError={coordinateursIsError}
  search={searchCoordinateur}
  onSearchChange={setSearchCoordinateur}
  observerTarget={coordinateursObserverTarget}
  isFetchingNextPage={isFetchingNextCoordinateursPage}
  onSelectCoordinateur={(coordinateur) => {
    updateFamilyData({ coordinateur: coordinateur.id });
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
