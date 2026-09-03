import Sidebar from "../../components/Sidebar/Sidebar";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
import Card from "../../components/Cards/Card";
import CardPopup from "../../components/Cards/Card2";
import OptionsMenu from "../../components/Containers/OptionsMenu";
import SelectorWithAction from "../../components/Forms/SelectorWithAction";
import { useState, useEffect, useRef } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

import SelectInput2 from "../../components/Containers/ChoiceContainer2";
import TextArea from "../../components/Containers/Textarea";
import ErrorMessage from "../../components/Forms/ErrorMessage";
import BackendErrorMessage from "../../components/Forms/BackendErrorMessage";


import { useNavigate } from "react-router-dom";
import DateContainer from "../../components/Containers/DateContainer";
import InfoHeader from "../../components/Containers/InfoBanner";
import Button from "../../components/Button/Button";

import PopupListeFamilles from "../../components/Popups/PopupListeFamilles";

import ConfirmationForm from "../../components/Forms/ConfirmationForm";

import Popup from "../../components/Popups/SuccessPopup";
import SuccessImage from "../../assets/Success.svg";
import { useLocation } from "react-router-dom";

import { useAuth } from "../../components/Providers/AuthProvider";
import { listFamilles } from "@/lib/api/familles";
import { getTauxDeChange } from "@/lib/api/parametres";
import { getSoldeActuel , createAideZakat , getDerniereZakatFamille,} from "@/lib/api/zakat";
import { enqueue } from "@/lib/offlineQueue";




const isFutureDate = (date) => {
  if (!date) return false;

  const selected = new Date(date);
  selected.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selected > today;
};
const formatDateFR = (isoDate) => {
  if (!isoDate) return null;
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y}`;
};


const formatDateYYYYMMDD = (d) => {
  const dt = d instanceof Date ? d : new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(
    dt.getDate()
  ).padStart(2, "0")}`;
};

const KNOWN_FIELDS = [
  "famille",
  "date_versement",
  "montant",
  "cause_principale",
  "precisions",
  "observation",
  "mode_remise",
  "confirmation",
];

// Mappe les noms de champs backend vers les clés locales utilisées dans errors/backendFieldErrors
const FIELD_KEY_MAP = {
  famille: "famille",
  date_versement: "date",
  montant: "montant",
  cause_principale: "causePrincipale",
  precisions: "precisions",
  observation: "observations",
  mode_remise: "modePaiement",
  confirmation: "confirmed",
};

function parseBackendErrors(data) {

  if (!data) return { fieldErrors: {}, generalMessage: null };

  // Réponse HTML (404/500 Django, mauvaise route, serveur down, etc.)
  if (typeof data === "string" && /<html[\s>]/i.test(data)) {
    if (status === 404) {
      return {
        fieldErrors: {},
        generalMessage: "Le service demandé est introuvable. Veuillez réessayer plus tard ou contacter le support.",
      };
    }
    return {
      fieldErrors: {},
      generalMessage: "Une erreur inattendue est survenue côté serveur. Veuillez réessayer plus tard.",
    };
  }



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



export default function AjoutZakat() {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [saving, setSaving] = useState(false);
  
  const [backendFieldErrors, setBackendFieldErrors] = useState({});
  const [backendGeneralError, setBackendGeneralError] = useState(null);
  const [offlinePending, setOfflinePending] = useState(false);

  const location = useLocation();
  const draft = location.state?.draft;

  const [selectedFamille, setSelectedFamille] = useState(
    draft?.selectedFamille || null
  );
  const [date, setDate] = useState(draft?.date ? new Date(draft.date) : new Date());
  const [confirmed, setConfirmed] = useState(draft?.confirmed || false);

  const [montant, setMontant] = useState(draft?.montant || "");
  const [modePaiement, setModePaiement] = useState(draft?.modePaiement || null);


  const { user } = useAuth();
  const role = user?.role ?? null;
  const isAdmin = role === "admin";

  // Taux de change — récupéré une seule fois à l'ouverture du formulaire
const { data: tauxData, isLoading: tauxLoading } = useQuery({
  queryKey: ["taux-change"],
  queryFn: () => getTauxDeChange().then((r) => r.data),
  staleTime: Infinity,
});


const {
  data: derniereZakatData,
  isLoading: derniereZakatLoading,
  isError: derniereZakatIsError,
  error: derniereZakatError,
} = useQuery({
  queryKey: ["derniere-zakat", selectedFamille?.code],
  queryFn: () =>
    getDerniereZakatFamille({ famille: selectedFamille.code }).then((r) => r.data),
  enabled: !!selectedFamille?.code,
});

const aDejaUneZakat = !!derniereZakatData?.numero_zakat;
const derniereZakatDateAffichee = formatDateFR(derniereZakatData?.date_versement);
const prochainNumeroZakat = (derniereZakatData?.numero_zakat ?? 0) + 1;


// Solde disponible — récupéré une seule fois à l'ouverture du formulaire
const { data: soldeData, isLoading: soldeLoading } = useQuery({
  queryKey: ["solde-actuel"],
  queryFn: () => getSoldeActuel().then((r) => r.data),
  staleTime: Infinity,
});

const soldeDisponible = soldeData?.montant ? parseFloat(soldeData.montant) : null;

const tauxMruEur = tauxData?.valeur ? parseFloat(tauxData.valeur) : null;

const montantEnEur =
  montant && tauxMruEur
    ? (parseFloat(montant) * tauxMruEur).toFixed(2)
    : "0.00";

  const [causePrincipale, setCausePrincipale] = useState(draft?.causePrincipale || null);
  const [precisions, setPrecisions] = useState(draft?.precisions || "");
  const [observations, setObservations] = useState(draft?.observations || "");

  // --- ERROR HANDLING ---
  const [errors, setErrors] = useState({
    famille: false,
    date: false,
    montant: false,
    modePaiement: false,
    causePrincipale: false,
    confirmed: false, 
  });

  const validateForm = () => {
    const montantValue = parseFloat(montant);
    const montantInvalide = !montant || montantValue <= 0;
    const montantDepasseSolde =
      !montantInvalide && soldeDisponible !== null && montantValue > soldeDisponible;

    const newErrors = {
      famille: !selectedFamille,
      date: isFutureDate(date),
      montant: montantInvalide || montantDepasseSolde,
      modePaiement: !modePaiement,
      causePrincipale: !causePrincipale,
      confirmed: !confirmed,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };
  // Extrait un message d'erreur lisible depuis une réponse API
const extractErrorMessage = (error) => {
  const data = error.response?.data;

  if (!data) {
    return error.message || "Une erreur est survenue lors de l'enregistrement de la zakat.";
  }

  if (typeof data === "string") {
    return data;
  }

  if (Array.isArray(data)) {
    const messages = data.filter((m) => typeof m === "string");
    if (messages.length > 0) {
      return messages.join(" — ");
    }
  }

  if (data?.detail) {
    return data.detail;
  }

  if (typeof data === "object" && !Array.isArray(data)) {
    const messages = [];

    Object.entries(data).forEach(([field, value]) => {
      const values = Array.isArray(value) ? value : [value];

      values.forEach((msg) => {
        if (typeof msg !== "string") return;
        if (field === "non_field_errors" || field === "detail") {
          messages.push(msg);
        } else {
          messages.push(`${field} : ${msg}`);
        }
      });
    });

    if (messages.length > 0) {
      return messages.join(" — ");
    }
  }

  return "Une erreur est survenue lors de l'enregistrement de la zakat.";
};

 const handleSave = async () => {
  if (!validateForm()) return;

  setSaving(true);
  setBackendFieldErrors({});
  setBackendGeneralError(null);
  setOfflinePending(false);

  const payload = {
    famille: selectedFamille?.code,
    date_versement: formatDateYYYYMMDD(date),
    montant: Number(montant),
    cause_principale: causePrincipale,
    precisions: precisions || "",
    observation: observations || "",
    mode_remise: modePaiement,
    confirmation: confirmed,
  };

  try {
    await createAideZakat(payload);
    setShowSuccessPopup(true);
  } catch (error) {
    if (!error.response) {
      try {
        await enqueue("/api/zakat/aides/", payload);
        setOfflinePending(true);
        setShowSuccessPopup(true);
      } catch (queueError) {
        console.error("❌ Impossible de mettre la zakat en attente hors ligne :", queueError);
        setBackendGeneralError(
          "Impossible d'enregistrer la zakat, même hors ligne. Veuillez réessayer."
        );
      }
      setSaving(false);
      return;
    }

    console.error(
      "❌ Erreur lors de la création de la zakat :",
      error.response?.data || error.message
    );

    const { fieldErrors, generalMessage } = parseBackendErrors(
      error.response?.data,
      error.response?.status
    );

    const mappedFieldErrors = {};
    Object.entries(fieldErrors).forEach(([backendField, message]) => {
      const localKey = FIELD_KEY_MAP[backendField] || backendField;
      mappedFieldErrors[localKey] = message;
    });

    setBackendFieldErrors(mappedFieldErrors);
    setBackendGeneralError(
      generalMessage || (Object.keys(mappedFieldErrors).length ? null : "Une erreur est survenue lors de l'enregistrement de la zakat.")
    );
  } finally {
    setSaving(false);
  }
};

  // Chaque onChange nettoie son propre message d'erreur immediatement
 const handleMontantChange = (raw) => {
    if (/^\d*$/.test(raw)) {
      setMontant(raw);
      const value = parseFloat(raw);
      const depasseSolde =
        soldeDisponible !== null && value > soldeDisponible;

      if (raw && value > 0 && !depasseSolde) {
        setErrors((prev) => ({ ...prev, montant: false }));
      } else if (depasseSolde) {
        setErrors((prev) => ({ ...prev, montant: true }));
      }
    }
  };

  const handleModePaiementChange = (selected) => {
  setModePaiement(selected.value);
  setErrors((prev) => ({ ...prev, modePaiement: false }));
};

  const handleCausePrincipaleChange = (selected) => {
  setCausePrincipale(selected.value);
  setErrors((prev) => ({ ...prev, causePrincipale: false }));
};

  const handleConfirmedChange = (e) => {
  const isChecked = e.target.checked;
  setConfirmed(isChecked);
  if (isChecked) {
    setErrors((prev) => ({ ...prev, confirmed: false }));
  }
};

  const navigate = useNavigate();

  const [openFamilles, setOpenFamilles] = useState(false);
const [openOptions, setOpenOptions] = useState(false);
const [searchFamille, setSearchFamille] = useState("");

const {
  data: famillesResponse,
  isLoading: famillesLoading,
  isError: famillesError,
  refetch: refetchFamilles,
  fetchNextPage: fetchNextFamillesPage,
  hasNextPage: hasNextFamillesPage,
  isFetchingNextPage: isFetchingNextFamillesPage,
} = useInfiniteQuery({
  queryKey: ["familles-popup", "infinite", searchFamille],

  queryFn: async ({ pageParam = 1 }) => {
    const params = { page: pageParam };

    const trimmedSearch = searchFamille.trim();
    if (trimmedSearch) {
      params.search = trimmedSearch;
    }

    const response = await listFamilles(params);
    return response.data;
  },

  getNextPageParam: (lastPage, allPages) =>
    lastPage?.next ? (allPages?.length ?? 0) + 1 : undefined,

  initialPageParam: 1,
  keepPreviousData: true,
  enabled: openFamilles,
});

const famillesBrutes = (famillesResponse?.pages ?? []).flatMap((page) =>
  Array.isArray(page) ? page : page?.results ?? []
);

const famillesObserverTarget = useRef(null);

useEffect(() => {
  if (!famillesObserverTarget.current || !openFamilles) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (
        entries[0].isIntersecting &&
        hasNextFamillesPage &&
        !isFetchingNextFamillesPage
      ) {
        fetchNextFamillesPage();
      }
    },
    { threshold: 1 }
  );

  observer.observe(famillesObserverTarget.current);

  return () => observer.disconnect();
}, [openFamilles, hasNextFamillesPage, isFetchingNextFamillesPage, fetchNextFamillesPage]);

  // Mapping vers le format attendu par le popup / les cartes
  // (même logique que dans "Liste des familles" et "Ajout Visite")
  const listeDesFamilles = famillesBrutes.map((famille) => ({
    id: famille.id,
    enfant: famille.nourrisson?.prenom,
    mere: `${famille.mere?.nom ?? ""} ${famille.mere?.prenom ?? ""}`,
    sexe:
      famille?.nourrisson?.sexe === "M"
        ? "Fils"
        : famille?.nourrisson?.sexe === "F"
        ? "Fille"
        : "-",
    region: famille.mere?.village?.nom ?? "-",
    naissance: famille.nourrisson?.date_naissance,
    code: famille.id,
    badges: [
      famille?.statut_nutritionnel_bebe === "mam" && {
        type: "mam",
        text: "MAM nourrisson",
      },
      famille?.statut_nutritionnel_bebe === "mas" && {
        type: "mas",
        text: "MAS nourrisson",
      },
      famille?.statut_nutritionnel_bebe === "normale" && {
        type: "mere",
        text: "Bébé normal",
      },
      famille?.statut_nutritionnel_mere === "normale" && {
        type: "mere",
        text: "Mère normale",
      },
      famille?.statut_nutritionnel_mere === "a_risque" && {
        type: "risque",
        text: "Mère à risque",
      },
      famille?.statut_nutritionnel_mere === "malnutrition" && {
        type: "mas",
        text: "Mère malnutrie",
      },
      famille.est_visite_en_retard && {
        type: "retard",
        text: "Visite en retard",
      },
    ].filter(Boolean),
  }));

  const familyOptions = [
    { label: "Changer la famille", value: "changer" },
    { label: "Voir la fiche famille", value: "voir" },
  ];

  const handleSearch = () => {
    setOpenFamilles(true);
  };

  const handleOptionSelect = (value) => {
    if (value === "changer") {
      setOpenFamilles(true);
    } else if (value === "voir") {
      navigate(`/famille/${selectedFamille.id}`, {
        state: {
          from: "/ajout-zakat",
          draft: { selectedFamille, date, confirmed },
        },
      });
    }
  };

  return (
      
      <div className="flex h-screen bg-white overflow-hidden">
  
          <Sidebar />
  

  
  



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

         
        {/* Header */}
        <div className="mb-0 lg:mb-3">
          <PageHeader
            leftTitle="Annuler"
            showRight={false}
            onBack={() => window.history.back()}
          />
        </div>

        {!selectedFamille && (
          <>
          <div className="flex flex-col gap-2 mt-2 ">
            <SelectorWithAction
              label="Choisir la famille concerne"
              description="Cliquer pour rechercher la famille concerne par la distribution"
              onAction={handleSearch}
            />
            <ErrorMessage
  message={
    errors.famille
      ? "Veuillez sélectionner une famille"
      : backendFieldErrors.famille || null
  }
/>
            </div>
          </>
        )}

        {/* Family Card */}
        {selectedFamille && (
          <>
            {/* Mobile */}
            <div className="relative block lg:hidden mt-4">
              <div
                className="cursor-pointer"
                onClick={() => setOpenOptions((prev) => !prev)}
              >
                <CardPopup
                  enfant={selectedFamille.enfant}
                  sexe={selectedFamille.sexe}
                  region={selectedFamille.region}
                  naissance={selectedFamille.naissance}
                  code={selectedFamille.code}
                  badges={selectedFamille.badges}
                />
              </div>

              <OptionsMenu
                open={openOptions}
                onClose={() => setOpenOptions(false)}
                options={familyOptions}
                onSelect={handleOptionSelect}
              />
            </div>

            {/* Desktop */}
            <div className="relative hidden lg:block">
              <div
                className="cursor-pointer"
                onClick={() => setOpenOptions((prev) => !prev)}
              >
                <Card
                  enfant={selectedFamille.enfant}
                  mere={selectedFamille.mere}
                  sexe={selectedFamille.sexe}
                  region={selectedFamille.region}
                  naissance={selectedFamille.naissance}
                  code={selectedFamille.code}
                  badges={selectedFamille.badges}
                />
              </div>

              <OptionsMenu
                open={openOptions}
                onClose={() => setOpenOptions(false)}
                options={familyOptions}
                onSelect={handleOptionSelect}
              />
            </div>
          </>
        )}
            {backendGeneralError && (
  <div className="mt-2">
    <BackendErrorMessage message={backendGeneralError} />
  </div>
)}

        {/* Main content */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-3.5">
          {selectedFamille && !derniereZakatLoading && (
  <InfoHeader
    title="Dernière zakat"
    value={aDejaUneZakat ? derniereZakatDateAffichee : "Aucune"}
  />
)}
            {/* Date + Zakat number */}

            <div className="flex flex-col gap-0 ">
              <h3
                className="
                  text-[16px]
                  lg:text-[18px]
                  font-semibold
                  text-[#202124]
                "
              >
                Date Zakat
              </h3>

              <div
  className={`
    grid
    grid-cols-1
    ${selectedFamille ? "lg:grid-cols-2" : "lg:grid-cols-1"}
    gap-3
    lg:gap-2
    items-end
  `}
>
                 <DateContainer
                 value={date}
                 onChange={(newDate) => {
                 setDate(newDate);

                 setErrors((prev) => ({
                 ...prev,
                 date: isFutureDate(newDate),
                     } ));
                  }}
                 noPadding
                />

              
{selectedFamille && !derniereZakatLoading && (
  <div className="w-full">
    <div className="h-[45px] rounded-[15px] border border-[#4E9F8A] bg-white px-4 pr-12 flex items-center">
      <p className="text-[14px] leading-[20px] text-[#374151]">
        {`Zakat N° ${prochainNumeroZakat}`}
      </p>
    </div>
  </div>
)}
                 
              </div>
             <div className="
                mt-2
              "
            >

               <ErrorMessage
  message={
    errors.date
      ? "La date de zakat ne peut pas être supérieure à la date d'aujourd'hui."
      : backendFieldErrors.date || null
  }
/>

                </div>

             
            </div>
            
            {/* Informations du versement */}
            <div
              className="
                rounded-[20px]
                border
                border-[#E5E7EB]
                bg-[#F9FAFB]
                px-4
                py-4
              "
            >
              {/* Title */}
              <h2 className="text-[20px] font-bold text-[#346A5C] mb-2">
                Informations du versement
              </h2>

              {/* Montant */}
              
              <div className="mb-1">
                <label className="block mb-2 text-[16px] font-medium text-[#000000]">
                  Montant (MRU)
                </label>

                <div className="w-full flex">
                  <div className="flex-1">
                    <div className="flex flex-col gap-2">
                    <div
                      className={`
                        w-full
                        h-[45px]
                        rounded-[15px]
                        border
                        bg-white
                        px-4
                        flex
                        items-center
                        gap-2
                        ${errors.montant ? "border-[#EF4444]" : "border-[#4E9F8A]"}
                      `}
                    >
                       
                      <input
                        type="text"
                        inputMode="numeric"
                        value={montant}
                        onChange={(e) => handleMontantChange(e.target.value)}
                        placeholder="Ex : 5000"
                        className="
                          flex-1
                          w-full
                          text-[14px]
                          sm:text-[15px]
                          lg:text-[16px]
                          text-black
                          placeholder:text-gray-400
                          bg-transparent
                          focus:outline-none
                        "
                      />
                      <span
                        className="
                          text-[14px]
                          sm:text-[15px]
                          lg:text-[16px]
                          font-medium
                          text-[#4E9F8A]
                          select-none
                        "
                      >
                        MRU
                      </span>
                    </div>

                   {!errors.montant && (
  <p className="mt-1 text-[12px] text-gray-400">
    {tauxLoading
      ? "Chargement du taux..."
      : tauxMruEur
      ? `≈ ${montantEnEur} EUR (Taux du jour)`
      : "Taux de change indisponible"}
  </p>
)}
                 <ErrorMessage
  message={
    errors.montant
      ? !montant || parseFloat(montant) <= 0
        ? "Veuillez saisir un montant valide"
        : `Le montant dépasse le solde disponible (${soldeDisponible?.toLocaleString("fr-FR")} MRU)`
      : backendFieldErrors.montant || null
  }
/>
                    </div>
                     
                  </div>
                </div>
              </div>

              {/* Mode de paiement */}
              <div className="mt-3">
                <label className="block mb-0 text-[16px] font-medium text-[#000000]">
                  Mode de paiement
                </label>

                <div className="w-full flex">
                  <div className="flex-1">
                    <div className="flex flex-col gap-2">
                  <SelectInput2
                   noPadding
                    value={modePaiement}
                    onChange={handleModePaiementChange}
                    placeholder="Tapez pour choisir le mode de paiement"
                    options={[
                     { value: "espece", label: "Espèces" },
                     { value: "transfert_mobile", label: "Transfert mobile (Bankily)" },
                     { value: "autre", label: "Autre" },
                     ]}
                     />
                    <ErrorMessage
  message={
    errors.modePaiement
      ? "Veuillez choisir un mode de paiement"
      : backendFieldErrors.modePaiement || null
  }
/>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Temporary confirmation */}
            <div className="hidden lg:block">
             <ConfirmationForm
  checked={confirmed}
  onChange={handleConfirmedChange}
  error={errors.confirmed}
  errorMessage="Veuillez confirmer la remise avant d'enregistrer"
/>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4">
            {/* Motif de selection */}
            <div
              className="
                rounded-[20px]
                border
                border-[#E5E7EB]
                bg-[#F9FAFB]
                px-4
                py-4
              "
            >
              {/* Title */}
              <h2 className="text-[20px] font-bold text-[#346A5C] mb-2">
                Motif de sélection
              </h2>

              {/* Cause principale */}
              <div className="mb-4">
                <label className="block mb-0 text-[16px] font-medium text-[#000000]">
                  Cause principale
                </label>

                <div className="w-full flex">
                  <div className="flex-1">
                    <div className="flex flex-col gap-2">
                   <SelectInput2
  noPadding
  value={causePrincipale}
  onChange={handleCausePrincipaleChange}
  placeholder="Tapez pour choisir la cause principale"
  options={[
    { value: "veuvage", label: "Veuvage" },
    { value: "urgence", label: "Situation d'urgence" },
    { value: "vulnerabilite", label: "Vulnérabilité extrême" },
    { value: "autre", label: "Autre" },
  ]}
/>
                    <ErrorMessage
  message={
    errors.causePrincipale
      ? "Veuillez choisir une cause principale"
      : backendFieldErrors.causePrincipale || null
  }
/>
                    </div>
                  </div>
                </div>
              </div>

              {/* Precisions */}
              <TextArea
                label="Précisions (optionnel)"
                placeholder="Tapez ici si il y a des précisions"
                value={precisions}
                onChange={(e) => setPrecisions(e.target.value)}
                height="h-[99px]"
              />
            </div>

            {/* Observations complementaires */}
            <div
              className="
                rounded-[20px]
                border
                border-[#E5E7EB]
                bg-[#F9FAFB]
                px-4
                py-4
              "
            >
              <h2 className="text-[20px] font-bold text-[#346A5C] mb-2">
                Observations complémentaires
              </h2>

              <TextArea
                label=""
                placeholder="Tapez ici si il y a des observations complémentaires"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                height="h-[106px]"
              />
            </div>

            {/* Mobile only */}
            <div className="mt-4 lg:hidden">
             <ConfirmationForm
  checked={confirmed}
  onChange={handleConfirmedChange}
  error={errors.confirmed}
  errorMessage="Veuillez confirmer la remise avant d'enregistrer"
/>
            </div>
          </div>
        </div>

       
       {/* Save button */}
        <div className="mt-2">
          <Button
            title={saving ? "Enregistrement..." : "Enregistrer"}
            variant="save"
            noPadding
            onClick={handleSave}
            disabled={saving}
          />
     
        </div>

        {showSuccessPopup && (
  <Popup
    title={
      offlinePending
        ? "Zakat enregistrée hors ligne — sera synchronisée"
        : "Zakat enregistrée avec succès"
    }
    image={offlinePending ? null : SuccessImage}
    primaryButtonText="Voir la fiche famille"
    secondaryButtonText="Revenir à l'accueil"
    onPrimaryClick={() => {
      setShowSuccessPopup(false);
      setOfflinePending(false);
      navigate(`/famille/${selectedFamille?.id}`);
    }}
    onSecondaryClick={() => {
      setShowSuccessPopup(false);
      setOfflinePending(false);
      navigate(
        role === "chef_coordinator"
          ? "/dashboardChef"
          : role === "coordinator"
          ? "/dashboardCoor"
          : "/dashboard"
      );    
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

   <PopupListeFamilles
  open={openFamilles}
  onClose={() => setOpenFamilles(false)}
  familles={listeDesFamilles}
  loading={famillesLoading}
  isError={famillesError}
  onRetry={refetchFamilles}
  search={searchFamille}
  onSearchChange={setSearchFamille}
  observerTarget={famillesObserverTarget}
  isFetchingNextPage={isFetchingNextFamillesPage}
  onSelectFamille={(famille) => {
    setSelectedFamille(famille);
    setOpenFamilles(false);
    setErrors((prev) => ({ ...prev, famille: false }));
  }}
/>
    </div>
  );
}
