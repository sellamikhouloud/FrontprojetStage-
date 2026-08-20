
import { useMemo, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { diffPatch, isEmptyPatch } from "@/lib/diff";
import { getFamille, updateFamille, marquerSortie, getVisites, getDistributions, getFamilleZakat } from "@/lib/api/familles";
import { listVillages } from "@/lib/api/Parametres"; 
import { listCoordinateurs } from "@/lib/api/coordinateurs";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
import NavigationHeader from "../../components/Navigation,Pageheader/NavigationHeader";
import InfoCard from "../../components/Containers/AfficherContainer";
import EditableInfoCard from "../../components/Containers/ModifierContainer";
import Sidebar from "../../components/Sidebar/Sidebar";
import StatusBadge from "../../components/Cards/Badge";
import PopupDistributionfamille from "../../components/Popups/PopupDistributionfamille";
import Popupvisites from "../../components/Popups/Popupvisitefamille";
import PopupZakatFamille from "../../components/Popups/PopupZakatfamille";
import PopupListeCoordinateurs from "../../components/Popups/PopupListeCoordinateurs";
import PopupFinSuivi from "../../components/Popups/PopupFinsuivi";
import Popup from "../../components/Popups/SuccessPopup.jsx";
import Button from "../../components/Button/Button";
import MotherPhoto from "../../assets/photo mere.svg";
import successImage from "../../assets/Success.svg";
import Spinner from "../../components/Spinner";


function extractEditableFields(famille) {
  return {
    date_entree: famille?.date_entree ?? null,

    nourrisson_date_naissance: famille?.nourrisson?.date_naissance ?? null,
    nourrisson_sexe: famille?.nourrisson?.sexe ?? "",
    nourrisson_poids_naissance: famille?.nourrisson?.poids_naissance ?? "",
    nourrisson_taille_naissance: famille?.nourrisson?.taille_naissance ?? "",

    mere_village_id: famille?.mere?.village?.id ?? famille?.mere?.village ?? null,
    mere_telephone: famille?.mere?.telephone ?? "",
    mere_date_naissance: famille?.mere?.date_naissance ?? null,
    mere_statut_matrimonial: famille?.mere?.statut_matrimonial ?? "",
    mere_nb_enfants: famille?.mere?.nb_enfants ?? "",
    motif_prise_en_charge: famille?.mere?.motif_prise_en_charge ?? "", 
    mere_referent_medical: famille?.mere?.referent_medical ?? "",
    mere_informations_complementaires:
      famille?.mere?.informations_complementaires ?? "",

    coordinateur_id: famille?.coordinateur?.id ?? null,

    motif_sortie: famille?.motif_sortie ?? "",
  };
}

// Convertit un objet Date (ou une string) en "YYYY-MM-DD" 
function toApiDateString(value) {
  if (!value) return value; 

  if (typeof value === "string") {
   
    return value.includes("T") ? value.slice(0, 10) : value;
  }

  if (value instanceof Date && !isNaN(value)) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, "0");
    const d = String(value.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  return value;
}
function buildFamillePayload(patch) {
  const payload = {};
  const mere = {};
  const nourrisson = {};

  for (const [key, value] of Object.entries(patch)) {
    switch (key) {
      case "date_entree":
        payload.date_entree = toApiDateString(value);
        break;
         case "coordinateur_id":
        payload.coordinateur = value;
        break;

      case "mere_village_id":
        mere.village = value;
        break;
      case "mere_telephone":
        mere.telephone = value;
        break;
      case "mere_date_naissance":
        mere.date_naissance = toApiDateString(value); 
        break;
      case "mere_statut_matrimonial":
        mere.statut_matrimonial = value;
        break;
      case "mere_nb_enfants":
        mere.nb_enfants = value === "" ? null : value;
        break;
      case "mere_referent_medical":
        mere.referent_medical = value;
        break;
      case "mere_informations_complementaires":
        mere.informations_complementaires = value;
        break;
      case "motif_prise_en_charge":
        mere.motif_prise_en_charge = value;
        break;
      case "nourrisson_date_naissance":
        nourrisson.date_naissance = toApiDateString(value);
        break;
      case "nourrisson_sexe":
        nourrisson.sexe = value;
        break;
      case "nourrisson_poids_naissance":
        nourrisson.poids_naissance = value;
        break;
      case "nourrisson_taille_naissance":
        nourrisson.taille_naissance = value;
        break;
      default:
        payload[key] = value;
    }
  }

  if (Object.keys(mere).length) payload.mere = mere;
  if (Object.keys(nourrisson).length) payload.nourrisson = nourrisson;

  return payload;
}
// Libellés français pour les champs, utilisés dans les messages d'erreur de validation
const FIELD_LABELS = {
  taille_naissance: "Taille de naissance",
  poids_naissance: "Poids de naissance",
  date_naissance: "Date de naissance",
  village: "Village",
  telephone: "Téléphone",
  statut_matrimonial: "Statut matrimonial",
  nb_enfants: "Nombre d'enfants à charge",
  motif_prise_en_charge: "Motif de prise en charge",
  referent_medical: "Référent médical",
  informations_complementaires: "Informations complémentaires",
  sexe: "Sexe",
  date_entree: "Date d'entrée",
  date_sortie: "Date de sortie",
  motif_sortie: "Motif de sortie",
  mere: "Informations mère",
  nourrisson: "Informations nourrisson",
};

// Messages pour les codes d'erreur métier renvoyés par le backend
const ERROR_CODE_MESSAGES = {
  INVALID_EXIT_DATE: "La date de sortie ne peut pas être antérieure à la date d'entrée.",
  EXIT_DATE_REQUIRED: "Veuillez renseigner la date de sortie.",
  EXIT_REASON_REQUIRED: "Veuillez préciser le motif de sortie.",
  FAMILY_ACCESS_DENIED: "Vous n'êtes pas autorisé à modifier cette famille.",
  COORDINATOR_CHANGE_FORBIDDEN: "Vous n'êtes pas autorisé à changer le coordinateur de cette famille.",
  INTERNAL_ERROR: "Une erreur est survenue. Veuillez réessayer plus tard.",
};

// Traduit une erreur DRF générique
function translateFieldError(message) {
  if (typeof message !== "string") return message;

  if (message.includes("no more than 2 decimal places")) {
    return "Ne doit pas contenir plus de 2 chiffres après la virgule.";
  }
  if (message.includes("A valid number is required")) {
    return "Veuillez entrer un nombre valide.";
  }
  if (message.includes("This field may not be blank")) {
    return "Ce champ ne peut pas être vide.";
  }
  if (message.includes("This field is required")) {
    return "Ce champ est requis.";
  }
  return message;
}

// Extrait récursivement les messages d'erreur d'un objet de validation DRF
function collectFieldErrors(data, parentLabel = "") {
  const messages = [];

  for (const [key, value] of Object.entries(data)) {
    const label = FIELD_LABELS[key] || key;
    const fullLabel = parentLabel ? `${parentLabel} > ${label}` : label;

    if (Array.isArray(value)) {
      value.forEach((msg) => {
        messages.push(`${fullLabel} : ${translateFieldError(msg)}`);
      });
    } else if (value && typeof value === "object") {
      messages.push(...collectFieldErrors(value, fullLabel));
    } else if (typeof value === "string") {
      messages.push(`${fullLabel} : ${translateFieldError(value)}`);
    }
  }

  return messages;
}

function getErrorMessage(err) {
  if (!err?.response) {
    return "Erreur réseau. Vérifiez votre connexion.";
  }

  const { status, data } = err.response;

  if (status >= 500) {
    return ERROR_CODE_MESSAGES.INTERNAL_ERROR;
  }

  if (!data) {
    return "Une erreur est survenue.";
  }

  if (data.code && ERROR_CODE_MESSAGES[data.code]) {
    return ERROR_CODE_MESSAGES[data.code];
  }

  if (typeof data.detail === "string") {
    return data.detail;
  }

  if (typeof data === "object") {
    const fieldErrors = collectFieldErrors(data);
    if (fieldErrors.length > 0) {
      return fieldErrors.slice(0, 3).join(" | ");
    }
    return "Certains champs sont invalides.";
  }

  return "Une erreur est survenue.";
}
const STATUT_BEBE = {
  normale: { text: "Bébé normal", type: "mereNormal" },
  mam: { text: "MAM nourrisson", type: "mam" },
  mas: { text: "MAS nourrisson", type: "mas" },
};
const STATUT_MERE = {
  normale: {
    text: "Mère normale",
    type: "mereNormal",
  },

  a_risque: {
    text: "Mère à risque",
    type: "risque",
  },

  malnutrition: {
    text: "Malnutrition",
    type: "mas",
  },
};

const STATUT_MATRIMONIAL_LABELS = {
  mariee: "Mariée",
  celibataire: "Célibataire",
  divorcee: "Divorcée",
  veuve: "Veuve",
  decedee: "Décédée",
};

const STATUT_MATRIMONIAL_REVERSE = {
  Mariée: "mariee",
  Célibataire: "celibataire",
  Divorcée: "divorcee",
  Veuve: "veuve",
  Décédée: "decedee",
};

const Modifyfamilly = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [openZakat, setOpenZakat] = useState(false);
  const [openDistribution, setOpenDistribution] = useState(false);
  const [openVisites, setOpenVisites] = useState(false);
  const [openFinSuivi, setOpenFinSuivi] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openCoordinateur, setOpenCoordinateur] = useState(false);

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);

  const {
    data: famille,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["famille", id],
    queryFn: () => getFamille(id).then((res) => res.data),
    enabled: !!id,
  });

  const { data: visitesResponse, isLoading: visitesLoading  , isError: visitesError, } = useQuery({
    queryKey: ["visites", id],
    queryFn: () => getVisites(id).then((r) => r.data),
    enabled: !!id && openVisites,
  });
  const visitesData = Array.isArray(visitesResponse)
    ? visitesResponse
    : visitesResponse?.results || (visitesResponse ? [visitesResponse] : []);

  const { data: distributionsResponse, isLoading: distributionsLoading , isError: distributionsError, } = useQuery({
    queryKey: ["distributions", id],
    queryFn: () => getDistributions(id).then((res) => res.data),
    enabled: !!id && openDistribution,
  });
  const distributionsData = Array.isArray(distributionsResponse)
    ? distributionsResponse
    : distributionsResponse?.results ||
      (distributionsResponse ? [distributionsResponse] : []);

  const { data: zakatResponse, isLoading: zakatLoading } = useQuery({
    queryKey: ["zakat", id],
    queryFn: () => getFamilleZakat(id).then((res) => res.data),
    enabled: !!id && openZakat,
  });
  const zakatsData = Array.isArray(zakatResponse)
    ? zakatResponse
    : zakatResponse?.results || (zakatResponse ? [zakatResponse] : []);

    const {
  data: villagesData,
  isLoading: villagesLoading,
} = useQuery({
  queryKey: ["villages"],
  queryFn: async () => {
    const response = await listVillages();
    return response.data;
  },
});

const villageOptions = (villagesData || []).map((village) => ({
  value: village.id,
  label: village.nom,
}));

const {
  data: coordinateursData,
  isLoading: coordinateursLoading,
  isError: coordinateursError,
} = useQuery({
  queryKey: ["coordinateurs"],
  queryFn: () => listCoordinateurs().then((res) => res.data),
});
const coordinateurs = (coordinateursData ?? [])
  .filter((coordinateur) => coordinateur.is_active)
  .map((coordinateur) => ({
    id: coordinateur.id,
    nom: coordinateur.nom,
    prenom: coordinateur.prenom,
    name: `${coordinateur.nom} ${coordinateur.prenom}`,
    code: String(coordinateur.id),
    village: coordinateur.village?.nom ?? "",
    familles: coordinateur.nb_familles ?? 0,
    status: coordinateur.is_active ? "Actif" : "Inactif",
  }));
  
  const baseline = useMemo(
    () => (famille ? extractEditableFields(famille) : null),
    [famille]
  );

  
  const [form, setForm] = useState(null);
  useEffect(() => {
    if (baseline && !form) setForm(baseline);
  }, [baseline, form]);

 
  const patch = useMemo(
    () => (baseline && form ? diffPatch(baseline, form) : {}),
    [baseline, form]
  );
  const nothingChanged = isEmptyPatch(patch);

 
  const saveMut = useMutation({
  mutationFn: (patch) =>
    updateFamille(id, buildFamillePayload(patch)).then((r) => r.data),
 onSuccess: (updated) => {
  // =========================
  // VILLAGE
  // =========================
  const villageId =
    typeof updated?.mere?.village === "object"
      ? updated.mere.village?.id
      : updated?.mere?.village;

  const villageMatch = villageOptions.find(
    (opt) => String(opt.value) === String(villageId)
  );

  // =========================
  // COORDINATEUR
  // =========================
  const coordinateurId =
    typeof updated?.coordinateur === "object"
      ? updated.coordinateur?.id
      : updated?.coordinateur ?? form.coordinateur_id;

  const coordinateurMatch = coordinateurs.find(
    (coordinateur) =>
      String(coordinateur.id) === String(coordinateurId)
  );

  // =========================
  // OBJET FINAL
  // =========================
  const fixedUpdated = {
    ...updated,

    coordinateur: coordinateurMatch
      ? {
          id: coordinateurMatch.id,
          nom: coordinateurMatch.nom,
          prenom: coordinateurMatch.prenom,
        }
      : updated?.coordinateur,

    mere: {
      ...updated?.mere,
      village: villageMatch
        ? {
            id: villageMatch.value,
            nom: villageMatch.label,
          }
        : updated?.mere?.village,
    },
  };

  console.log("Coordinateur sélectionné :", coordinateurMatch);
  console.log("Famille finale :", fixedUpdated);

  // Mettre à jour le formulaire
  setForm(extractEditableFields(fixedUpdated));

  // Mettre à jour React Query
  queryClient.setQueryData(
    ["famille", id],
    fixedUpdated
  );

  queryClient.invalidateQueries({
    queryKey: ["familles"],
  });

  setErrors({});
  setErrorMessage(null);
  setOpenSuccess(true);
},
  onError: (err) => {
    const data = err?.response?.data;
    if (data && typeof data === "object" && !data.detail) {
      setErrors(data);
    }
    setErrorMessage(getErrorMessage(err));
  },
});

 
  const handleSave = () => {
    setInfoMessage(null);
    setErrorMessage(null);

    if (nothingChanged) {
      setInfoMessage("Aucune modification à enregistrer.");
      return;
    }
    saveMut.mutate(patch);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Erreur lors du chargement de la famille.
        <br />
        {error?.message}
      </div>
    );
  }

  if (!form) return <Spinner />;

  const programme = [
    {
      key: "date_entree",
      label: "Date d'entrée dans le programme",
      value: form.date_entree ? new Date(form.date_entree) : null,
      type: "date",
    },
    {
      key: "enregistre_par",
      label: "Enregistré par",
      value: famille?.audit?.cree_par
        ? `${famille.audit.cree_par.prenom} ${famille.audit.cree_par.nom}`
        : "/",
      readOnly: true,
    },

  {
  key: "date_creation",
  label: "Date de création",
  value: famille?.date_creation
    ? new Date(famille.date_creation).toLocaleDateString("fr-FR")
    : "/",
  editable: false,
},
  ];

  const nourrisson = [
    {
      key: "nourrisson_date_naissance",
      label: "Date de naissance",
      value: form.nourrisson_date_naissance
        ? new Date(form.nourrisson_date_naissance)
        : null,
      type: "date",
    },
    {
      key: "nourrisson_sexe",
      label: "Sexe",
      value:
        form.nourrisson_sexe === "M"
          ? "Masculin"
          : form.nourrisson_sexe === "F"
          ? "Féminin"
          : form.nourrisson_sexe || "Masculin",
      options: ["Masculin", "Féminin"],
    },
    {
      key: "nourrisson_poids_naissance",
      label: "Poids de naissance",
      value: form.nourrisson_poids_naissance,
      type: "number",
      unit: "g",
    },
    {
      key: "nourrisson_taille_naissance",
      label: "Taille de naissance",
      value: form.nourrisson_taille_naissance,
      type: "number",
      unit: "cm",
    },
  ];

  const mere = [
  
{
  key: "mere_village_id",
  label: "Village",
  value:
    villageOptions.find(
      (opt) => String(opt.value) === String(form.mere_village_id)
    )?.label || "",
  options: villageOptions,
},

    {
      key: "mere_telephone",
      label: "Téléphone",
      value: form.mere_telephone,
      type: "phone",
    },
    {
      key: "mere_date_naissance",
      label: "Date de naissance",
      value: form.mere_date_naissance ? new Date(form.mere_date_naissance) : null,
      type: "date",
    },
    {
      key: "mere_statut_matrimonial",
      label: "Statut matrimonial",
    
      value:
        STATUT_MATRIMONIAL_LABELS[form.mere_statut_matrimonial] ||
        form.mere_statut_matrimonial,
      options: [
    { value: "mariee", label: "Mariée" },
    { value: "celibataire", label: "Célibataire" },
    { value: "divorcee", label: "Divorcée" },
    { value: "veuve", label: "Veuve" },
    { value: "decedee", label: "Décédée" },
  ],
    },
    {
      key: "mere_nb_enfants",
      label: "Nombre d'enfants à charge",
      value: form.mere_nb_enfants,
      type: "number",
    },

    {
  key: "motif_prise_en_charge",
  label: "Motif de prise en charge",
  value: form.motif_prise_en_charge,
  type: "textarea",
},
    {
      key: "mere_referent_medical",
      label: "Référent médical",
      value: form.mere_referent_medical,
    },
    {
      key: "mere_informations_complementaires",
      label: "Informations complémentaires",
      value: form.mere_informations_complementaires,
      type: "textarea",
    },
  ];

  const statutSortie = [
  {
  key: "date_sortie",
  label: "Date de sortie",
  value: famille?.date_sortie
    ? new Date(famille.date_sortie).toLocaleDateString("fr-FR")
    : "/",
  editable: false,
},
    {
      key: "motif_sortie",
      label: "Motif de sortie",
      value: form.motif_sortie,
      type: "textarea",
    },
  ];

  const zakat = [
    { label: "Nombre d'aides", value: famille?.zakat?.nombre ?? 0 },
    { label: "Montant total", value: `${famille?.zakat?.montant_total ?? 0} MRU` },
  ];
  const distributions = [
    { label: "Nombre de distributions", value: famille?.distributions?.nombre ?? 0 },
  ];
  const visites = [
    { label: "Nombre de visites", value: famille?.visites?.nombre ?? 0 },
    {
      label: "Date de la dernière visite",
      value: famille?.visites?.derniere_visite
        ? new Date(famille.visites.derniere_visite).toLocaleDateString("fr-FR")
        : "/",
    },
  ];
  const modification = [
    {
      label: "Modifié par",
      value: famille?.audit?.modifie_par
        ? `${famille.audit.modifie_par.nom} ${famille.audit.modifie_par.prenom}`
        : "/",
    },
    {
      label: "Date de modification",
      value: famille?.audit?.date_modification
        ? new Date(famille.audit.date_modification).toLocaleDateString("fr-FR")
        : "/",
    },
  ];

  const selectedCoordinateur = coordinateurs.find(
  (coordinateur) =>
    String(coordinateur.id) === String(form.coordinateur_id)
);

const coordinateurNom = selectedCoordinateur
  ? selectedCoordinateur.name
  : famille?.coordinateur
  ? `${famille.coordinateur.nom} ${famille.coordinateur.prenom}`
  : "/";

  const statut = famille?.statut;
  const statutBebe = STATUT_BEBE[famille?.statut_nutritionnel_bebe] || null;
  const statutMere = STATUT_MERE[famille?.statut_nutritionnel_mere] || null;

const makeHandler = (fields) => (index, value) => {
  const field = fields[index];
  if (field?.readOnly) return;
  const key = field.key;
  let finalValue = value;

  if (key === "nourrisson_sexe") {
    finalValue = value === "Masculin" ? "M" : "F";
  } else if (key === "mere_statut_matrimonial") {
    finalValue = STATUT_MATRIMONIAL_REVERSE[value] || value;
  } else if (key === "mere_village_id") {
    // Options peut renvoyer soit le label (nom du village), soit déjà l'id
    const match = villageOptions.find(
      (opt) => opt.label === value || String(opt.value) === String(value)
    );
    finalValue = match ? match.value : value;
  }

  setForm((prev) => ({ ...prev, [key]: finalValue }));
};

  const handleProgrammeChange = makeHandler(programme);
  const handleNourrissonChange = makeHandler(nourrisson);
  const handleMereChange = makeHandler(mere);
  const handleStatutSortieChange = makeHandler(statutSortie);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar  />

      <PopupDistributionfamille
        open={openDistribution}
        onClose={() => setOpenDistribution(false)}
        Distribution={distributionsData}
        famille={famille}
        isLoading={distributionsLoading}
      />

      <PopupZakatFamille
        open={openZakat}
        onClose={() => setOpenZakat(false)}
        zakats={zakatsData}
        famille={famille}
        isLoading={zakatLoading}
      />

      <Popupvisites
        open={openVisites}
        onClose={() => setOpenVisites(false)}
        Visites={visitesData}
        famille={famille}
        isLoading={visitesLoading}
      />

      <PopupFinSuivi
        open={openFinSuivi}
        onClose={() => setOpenFinSuivi(false)}
        onConfirm={async (motif, dateSortie) => {
          try {
            await marquerSortie(famille.id, {
              date_sortie: dateSortie,
              motif_sortie: motif,
            });
            setOpenFinSuivi(false);
            queryClient.invalidateQueries({ queryKey: ["famille", id] });
          } catch (err) {
            setErrorMessage(getErrorMessage(err));
          }
        }}
      />

      {openSuccess && (
        <Popup
          title="Modifications enregistrées"
          image={successImage}
          primaryButtonText="Voir la fiche de la famille"
          onPrimaryClick={() => {
            setOpenSuccess(false);
            navigate(`/famille/${id}`, {
              state: { from: location.state?.from, draft: location.state?.draft },
            });
          }}
        />
      )}

      <main className="flex-1 overflow-y-auto px-5 pt-18 md:pt-0 pb-8 lg:p-10 bg-white">
        <PageHeader
          leftTitle="Revenir"
          showRight={false}
          onBack={() => window.history.back()}
        />

        <NavigationHeader
          title="Fiche famille"
          type="save"
          actionTitle={saveMut.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
          onAction={handleSave}
          disabled={nothingChanged || saveMut.isPending}
        />

        {errorMessage && (
          <div className="mb-4 rounded-[10px] border border-red-300 bg-red-50 px-4 py-3 text-red-600 text-sm">
            {errorMessage}
          </div>
        )}
        {infoMessage && (
          <div className="mb-4 rounded-[10px] border border-gray-300 bg-gray-50 px-4 py-3 text-gray-600 text-sm">
            {infoMessage}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[520px_minmax(0,1fr)] gap-6 xl:gap-10 mb-8">
          <div className="w-full lg:w-[520px] h-[220px] sm:h-[260px] md:h-[300px] lg:h-[331px] rounded-[15px] overflow-hidden border border-[#E5E7EB] bg-white shadow-sm">
            <img
              src={famille?.mere?.photo || MotherPhoto}
              alt="Photo de la mère"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="min-h-[331px] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[26px] font-bold text-[#202124]">
                {famille?.mere?.prenom} {famille?.mere?.nom}
              </h2>
              <span className="text-[#67A7A3] text-[18px] font-semibold">
                {famille?.id}
              </span>
            </div>

          
            <div className="flex flex-col gap-2">
              <StatusBadge
                type={statut?.toLowerCase() === "sortie" ? "sortie" : "mereActive"}
                text={statut?.toLowerCase() === "sortie" ? "Sortie" : "Active"}
                className="w-full h-[40px] rounded-[10px]"
              />

              <div className="grid grid-cols-2 gap-1">
                {statutBebe && (
                  <StatusBadge
                    type={statutBebe.type}
                    text={statutBebe.text}
                    className="w-full h-[40px] rounded-[10px]"
                  />
                )}
                {statutMere && (
                  <StatusBadge
                    type={statutMere.type}
                    text={statutMere.text}
                    className="w-full h-[40px] rounded-[10px]"
                  />
                )}
              </div>
            </div>

            <div className="-mt-3">
              <EditableInfoCard
                title="Informations administratives"
                data={programme}
                editable={true}
                onChange={handleProgrammeChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 -mt-3">
              <div className="flex flex-col gap-4">
                <InfoCard
                  title="Zakat aid"
                  action="Voir tous"
                  onActionClick={() => setOpenZakat(true)}
                  data={zakat}
                />
                <InfoCard data={modification} />
              </div>

              <div className="flex flex-col gap-2">
                <InfoCard
                  title="Distributions"
                  action="Voir en détails"
                  onActionClick={() => setOpenDistribution(true)}
                  data={distributions}
                />
                <EditableInfoCard
                  title="Supervisé par"
                  data={[{ label: "Nom du coordinateur", value: coordinateurNom, popup: true }]}
                  editable={true}
                  onChange={() => {}}
                  onPopupClick={() => setOpenCoordinateur(true)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 -mt-3">
          <div className="flex flex-col gap-4">
            <EditableInfoCard
              title="Informations nourrisson"
              data={nourrisson}
              editable={true}
              onChange={handleNourrissonChange}
            />
            <InfoCard
              title="Visites"
              action="Voir tous"
              onActionClick={() => setOpenVisites(true)}
              data={visites}
            />
          </div>

          <div className="flex flex-col gap-4">
            <EditableInfoCard
              title="Informations mère"
              data={mere}
              editable={true}
              onChange={handleMereChange}
            />
          </div>
        </div>

        {statut?.toLowerCase() === "active" && (
          <div className="mt-8 w-full">
            <Button
              title="Sortir du programme"
              variant="primary"
              noPadding
              onClick={() => setOpenFinSuivi(true)}
            />
          </div>
        )}

        {statut?.toLowerCase() === "sortie" && (
          <div className="mt-8">
            <EditableInfoCard
              title="Statut sortie"
              data={statutSortie}
              editable={true}
              onChange={handleStatutSortieChange}
            />
          </div>
        )}

       <PopupListeCoordinateurs
  open={openCoordinateur}
  onClose={() => setOpenCoordinateur(false)}
  coordinateurs={coordinateurs}
  loading={coordinateursLoading}
  onSelectCoordinateur={(coordinateur) => {
    setForm((prev) => ({
      ...prev,
      coordinateur_id: coordinateur.id,
    }));

    setOpenCoordinateur(false);
  }}
/>
      </main>
    </div>
  );
};

export default Modifyfamilly;
