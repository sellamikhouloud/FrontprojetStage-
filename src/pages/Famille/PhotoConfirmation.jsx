import { useState, useEffect } from "react";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader.jsx";
import DateContainer from "../../components/Containers/DateContainer.jsx";
import Input from "../../components/Containers/ContainerEcriture.jsx";
import ChoiceContainer from "../../components/Containers/ChoiceContainer.jsx";
import StepIndicator from "../../components/Progress/StepIndicator.jsx";
import Button from "../../components/Button/Button.jsx";
import { useNavigate } from "react-router-dom";
import Popup from "../../components/Popups/SuccessPopup.jsx";
import CoordinateurSelector from "../../components/Containers/CoordinateurSelector.jsx";
import PopupListeCoordinateurs from "../../components/Popups/PopupListeCoordinateurs.jsx";
import ErrorMessage from "../../components/Forms/ErrorMessage.jsx";
import { useFamilyForm } from "../../context/FamilyFormContext";
import { searchMere, createFamille } from "../../lib/api/familles";
import { listCoordinateurs } from "../../lib/api/coordinateurs";
import { useAuth } from "../../components/Providers/AuthProvider";



import successImage from "../../assets/Success.svg"; 
import blackCamera from "../../assets/blackCamera.svg";
import warning from "../../assets/warning.svg";
import ArrowRight from "../../assets/right-arrow.png";


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

  if (isAdmin && !selectedCoordinateur) {
    newErrors.coordinateur =
      "Veuillez sélectionner un coordinateur";
  }

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

      if (currentIdMere) {

        // ---------------------------------------------------
        // MÈRE EXISTANTE
        // ---------------------------------------------------

        payload = {
          mere: formData.mere,
          id_mere: currentIdMere,

          nourrisson: nourrissons[i],

          date_entree: formData.date_entree,
          statut: formData.statut,
          date_sortie: formData.date_sortie,
          motif_sortie: formData.motif_sortie,
          coordinateur: formData.coordinateur,
        };

        console.log(
          "♻️ Payload avec mère existante :",
          payload
        );

      } else {

        // ---------------------------------------------------
        // MÈRE NON TROUVÉE
        // ---------------------------------------------------

        payload = {
          mere: formData.mere,

          nourrisson: nourrissons[i],

          date_entree: formData.date_entree,
          statut: formData.statut,
          date_sortie: formData.date_sortie,
          motif_sortie: formData.motif_sortie,
          coordinateur: formData.coordinateur,
        };

        console.log(
          "🆕 Payload avec nouvelle mère :",
          payload
        );
      }

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

    setSaveError(
      "Une erreur est survenue lors de l'enregistrement."
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
      const { data } = await listCoordinateurs();

      const mapped = data.map((c) => ({
        id: c.id,
        name: `${c.prenom} ${c.nom}`,
        code: c.id,
        village: c.village?.nom || "",
        familles: c.nb_familles,
        status: c.is_active ? "Actif" : "Inactif",
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
    
       <Sidebar role={role} />
     

      {/* Main Content */}
      <main
        className="
          flex-1
          overflow-y-auto
          px-5
          pt-5
          pb-8
          lg:p-10
          bg-white
        "
      >
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

        <label
  htmlFor="photo-mere"
 className={`
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
  <input
  id="photo-mere"
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

  {photoPreview ? (
    <img
      src={photoPreview}
      alt="Photo de la mère"
      className="w-full h-full object-cover"
    />
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

      <span
        className="
          text-[16px]
          font-medium
          text-black
        "
      >
        Tapez pour prendre une photo
      </span>
    </>
  )}
</label>

       
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

         {/* Coordinator — réservé à l'admin */}
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

          {/* Save Button */}
        <Button
  title={saving ? "Enregistrement..." : "Enregistrer"}
  variant="primary"
  noWrapperPadding
  onClick={handleSave}
  disabled={saving}
/>
{saveError && <ErrorMessage message={saveError} />}
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
      </main>
    </div>
  );
}
