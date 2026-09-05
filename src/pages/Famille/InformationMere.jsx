
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader.jsx";
import Input from "../../components/Containers/ContainerEcriture.jsx";
import DateContainer from "../../components/Containers/DateContainer.jsx";
import SelectInput2 from "../../components/Containers/ChoiceContainer2";
import StepIndicator from "../../components/Progress/StepIndicator.jsx";
import Navigation from "../../components/Navigation,Pageheader/Navigation.jsx";

import CounterInput from "../../components/Forms/CounterInput.jsx";
import ErrorMessage from "../../components/Forms/ErrorMessage.jsx";

import motherbaby from "../../assets/images/motherbaby.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useFamilyForm } from "../../context/FamilyFormContext";
import { searchMere } from "../../lib/api/familles";
import { listVillages } from "../../lib/api/Parametres";
import { loadCache } from "@/lib/offlineCache";
import { useAuth } from "../../components/Providers/AuthProvider";



const isFutureDate = (date) => {
  if (!date) return false;

  const selected = new Date(date);
  selected.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selected > today;
};


export default function InformationMere() {


  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
  formData,
  updateMere,
  updateNourrisson,
  updateFamilyData,
  setNourrissonsCount,
  resetFamilyForm,
} = useFamilyForm();

const { user, ready } = useAuth();
const role = user?.role ?? null;
const isCoordinateur = role === "coordinator" || role === "chef_coordinator";

const mere = formData.mere;
const draftFamille = location.state?.draftFamille;
const hydratedDraftRef = useRef(false);

useEffect(() => {
  if (hydratedDraftRef.current) return;

  // CAS 1 : brouillon → ne dépend pas du rôle
  if (draftFamille) {
    hydratedDraftRef.current = true;

    const payload = draftFamille.payload || {};

    resetFamilyForm();

    updateMere({
      ...(payload.mere || {}),
      photo: draftFamille.files?.photo ?? null,
    });

    updateFamilyData({
      date_entree: payload.date_entree ?? null,
      statut: payload.statut ?? "active",
      date_sortie: payload.date_sortie ?? null,
      motif_sortie: payload.motif_sortie ?? null,
      id_mere: payload.id_mere ?? null,
      coordinateur: payload.coordinateur ?? null,
      sourceDraftClientId: draftFamille.clientId,
      returnTo: location.state?.returnTo || "/liste-famille",
    });

    setNourrissonsCount(
      payload.nourrissons?.length ||
      payload.mere?.nb_enfants ||
      1
    );

    (payload.nourrissons || []).forEach((nourrisson, index) => {
      updateNourrisson(index, nourrisson);
    });

    return;
  }

  // ── CAS 2 : entrée directe → dépend du rôle, attendre useAuth ─────
  if (!ready) return; 

  hydratedDraftRef.current = true;

  updateFamilyData({
    returnTo: isCoordinateur ? "/dashboard" : "/liste-famille",
  });
}, [
  draftFamille,
  ready,
  isCoordinateur,
  resetFamilyForm,
  updateMere,
  updateNourrisson,
  updateFamilyData,
  setNourrissonsCount,
]);

const {
  data: villagesData,
  isLoading: villagesLoading,
  isError: villagesError,
} = useQuery({
  queryKey: ["villages"],
  networkMode: "always",
  queryFn: async () => {
    try {
      const response = await listVillages();
      return response.data;
    } catch (error) {
      const cached = loadCache("villages");

      if (cached?.data) {
        console.log("📦 Villages chargés depuis le cache (fallback)");
        return cached.data;
      }

      throw error;
    }
  },
});

  const villages = villagesData?.results ?? villagesData ?? [];

  const villageOptions = villages.map((village) => ({
    label: village.nom,
    value: village.id,
  }));

  const situationOptions = [
    { label: "Mariée", value: "mariee" },
    { label: "Célibataire", value: "celibataire" },
    { label: "Divorcée", value: "divorcee" },
    { label: "Veuve", value: "veuve" },
  ];

  // Efface l'erreur d'un champ précis
  const clearError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

 const handleNext = async () => {
  const newErrors = {};

  if (!mere.nom?.trim()) {
    newErrors.nom = "Veuillez saisir le nom";
  }

  if (!mere.prenom?.trim()) {
    newErrors.prenom = "Veuillez saisir le prénom";
  }

    if (!mere.date_naissance) {
    newErrors.dateNaissance =
      "Veuillez sélectionner la date de naissance";
  } else if (isFutureDate(mere.date_naissance)) {
    newErrors.dateNaissance =
      "La date de naissance ne peut pas être une date future";
  }

  if (!mere.statut_matrimonial?.trim()) {
    newErrors.situation =
      "Veuillez choisir la situation familiale";
  }

  if (!mere.nb_enfants || mere.nb_enfants === 0) {
    newErrors.enfants =
      "Veuillez indiquer le nombre d'enfants";
  }

  

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) return;

  try {
    const response = await searchMere({
      nom: mere.nom,
      prenom: mere.prenom,
      date_naissance: mere.date_naissance,
    });

    console.log("🔎 Résultat recherche mère :", response.data);

    const idMere = response.data?.id ?? null;

    console.log("🆔 ID mère trouvé :", idMere);

    // IMPORTANT :
    // On garde l'ID dans formData, PAS dans formData.mere
    updateFamilyData({
      id_mere: idMere,
    });

    console.log(
      "📦 formData.id_mere enregistré :",
      idMere
    );

    setNourrissonsCount(mere.nb_enfants);

    navigate("/information-nourrisson");

   } catch (error) {
    // Pas de réponse du tout = hors ligne. On ne peut pas vérifier si la
    // mère existe déjà, mais on ne bloque pas l'utilisateur : on continue
    // avec id_mere = null. Le flux d'enregistrement (PhotoConfirmation)
    // retentera la recherche, et à défaut sauvegardera un brouillon.
    if (!error.response) {
      console.warn("🔌 Hors ligne : recherche de la mère impossible, on continue sans id_mere.");
      updateFamilyData({ id_mere: null });
      setNourrissonsCount(mere.nb_enfants);
      navigate("/information-nourrisson");
      return;
    }

    // Le serveur a répondu avec une erreur — comportement inchangé.
    console.error(
      "Erreur lors de la recherche de la mère :",
      error.response?.data || error
    );
    setErrors({
      global: "Une erreur est survenue, veuillez réessayer.",
    });
  }
};
    


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

          <div className="min-h-full flex flex-col justify-center">
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

          {/* Page Title */}
          <h1
            className="
              text-[20px]
              lg:text-[24px]
              font-bold
              text-black
              font-jakarta
              text-center
            "
          >
            Information sur la mère
          </h1>

          {/* Illustration */}
          <div className="flex justify-center">
            <img
              src={motherbaby}
              alt="Illustration mère et bébé"
              className="
                w-[90px]
                h-[126px]
                lg:w-[140px]
                lg:h-[196px]
              "
            />
          </div>

          {/* Informations sur la mère */}

          <div className="flex flex-col gap-1">
            <Input
              label="Nom"
              placeholder="Saisir le nom"
              value={mere.nom || ""}
              onChange={(e) => {
              updateMere({
              nom: e.target.value,
             });
             clearError("nom");
            }}
              noPadding
            />
            <ErrorMessage message={errors.nom} />
          </div>

          <div className="flex flex-col gap-1">
            <Input
              label="Prénom"
              placeholder="Saisir le prénom"
             value={mere.prenom || ""}
onChange={(e) => {
  updateMere({
    prenom: e.target.value,
  });
  clearError("prenom");
}}
              noPadding
            />
            <ErrorMessage message={errors.prenom} />
          </div>

                  <div className="flex flex-col gap-1">
            <DateContainer
              label="Date de naissance"
             value={mere.date_naissance || null}
onChange={(date) => {
  updateMere({
    date_naissance: date,
  });

  if (isFutureDate(date)) {
    setErrors((prev) => ({
      ...prev,
      dateNaissance: "La date de naissance ne peut pas être une date future",
    }));
  } else {
    clearError("dateNaissance");
  }
}}
              noPadding
              defaultToToday={false}
            />
            <ErrorMessage message={errors.dateNaissance} />
          </div>

          <div className="flex flex-col gap-1">
            <SelectInput2
              label="Village"
              placeholder={
                villagesLoading
                  ? "Chargement des villages..."
                  : "Tapez pour choisir le village"
              }
              options={villageOptions}
              value={mere.village || ""}
              onChange={(village) => {
                updateMere({ village: village.value });
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
              label="Numéro de téléphone"
              placeholder="Saisir le numéro de téléphone"
             value={mere.telephone || ""}
onChange={(e) => {
  updateMere({
    telephone: e.target.value,
  });
}}
              noPadding
            />
            
          </div>

          <div className="flex flex-col gap-1">
            <SelectInput2
              label="Situation familiale"
              placeholder="Tapez pour choisir le statut matrimonial"
              options={situationOptions}
              value={mere.statut_matrimonial || ""}
              onChange={(selected) => {
                updateMere({
                  statut_matrimonial: selected.value,
                });
                clearError("situation");
              }}
              noPadding
            />
            <ErrorMessage message={errors.situation} />
          </div>
          <div className="flex flex-col gap-1">
  <Input
    label="Motif de prise en charge"
    placeholder="Entrez le motif de prise en charge"
   value={mere.motif_prise_en_charge || ""}
onChange={(e) => {
  updateMere({
    motif_prise_en_charge: e.target.value,
  });
  clearError("motifPriseEnCharge");
}}
    noPadding
  />

  <ErrorMessage message={errors.motifPriseEnCharge} />
</div>

        
            <Input
              label=""
              placeholder="Entrez le Référent médical"
             value={mere.referent_medical || ""}
onChange={(e) => {
  updateMere({
    referent_medical: e.target.value,
  });
}}
              noPadding
            />
       

          <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-2">
              <label
                className="
                  text-[14px]
                  lg:text-[16px]
                  font-semibold
                  text-black
                "
              >
                Nombre d'enfants à saisir
              </label>

              <div className="flex justify-center">
                <CounterInput
                  value={mere.nb_enfants || 0}
                  mobileWidth="w-[80px]"
                  desktopWidth="lg:w-[200px]"
                 onIncrement={() => {
  updateMere({
    nb_enfants: (mere.nb_enfants || 0) + 1,
  });
  clearError("enfants");
}}
                  onDecrement={() => {
  updateMere({
    nb_enfants: Math.max(0, (mere.nb_enfants || 0) - 1),
  });
}}
                />
              </div>
            </div>
            <ErrorMessage message={errors.enfants} />
          </div>

          <Input
            label="Informations complémentaires"
            placeholder="Entrez les informations complémentaires ici"
            value={mere.informations_complementaires || ""}
onChange={(e) => {
  updateMere({
    informations_complementaires: e.target.value,
  });
}}
            noPadding
          />

          <StepIndicator
            totalSteps={3}
            currentStep={1}
          />

          <Navigation
            showBack={false}
            nextText="Suivant"
            onNext={handleNext}
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
