
import { useMemo, useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import ErrorMessage from "../../components/Forms/ErrorMessage";
import { diffPatch, isEmptyPatch } from "@/lib/diff";
import { getFamille, updateFamille, marquerSortie, getVisites, getDistributions, getFamilleZakat } from "@/lib/api/familles";
import { listVillages } from "@/lib/api/Parametres"; 
import { listUsers } from "@/lib/api/users";
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
import { X } from "lucide-react";
import Spinner from "../../components/Spinner";
import { useAuth } from "../../components/Providers/AuthProvider";
import BackendErrorMessage from "../../components/Forms/BackendErrorMessage";


function extractEditableFields(famille) {
  return {
    date_entree: famille?.date_entree ?? null,
    nourrisson_prenom: famille?.nourrisson?.prenom ?? "",
    nourrisson_date_naissance: famille?.nourrisson?.date_naissance ?? null,
    nourrisson_sexe: famille?.nourrisson?.sexe ?? "",
    nourrisson_poids_naissance: famille?.nourrisson?.poids_naissance ?? "",
    nourrisson_taille_naissance: famille?.nourrisson?.taille_naissance ?? "",
    mere_nom: famille?.mere?.nom ?? "", 
    mere_prenom: famille?.mere?.prenom ?? "",
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
  case "nourrisson_prenom":
        nourrisson.prenom = value;
        break;

      case "mere_nom":
        mere.nom = value;
        break;
      case "mere_prenom":
        mere.prenom = value;
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

// Extrait un message d'erreur lisible depuis une réponse API — même logique
// que dans AjoutDistribution.jsx, pour rester cohérent sur toute l'app.
function extractErrorMessage(error) {
  const data = error.response?.data;

  if (!data) {
    return error.message || "Une erreur est survenue.";
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
   
    const collect = (obj, parentLabel = "") => {
      const messages = [];

      Object.entries(obj).forEach(([field, value]) => {
        const label = parentLabel ? `${parentLabel} > ${field}` : field;

        if (Array.isArray(value)) {
          value.forEach((msg) => {
            if (typeof msg === "string") {
              messages.push(`${label} : ${msg}`);
            }
          });
        } else if (value && typeof value === "object") {
          messages.push(...collect(value, label));
        } else if (typeof value === "string") {
          messages.push(`${label} : ${value}`);
        }
      });

      return messages;
    };

    const messages = collect(data);
    if (messages.length > 0) {
      return messages.join(" — ");
    }
  }

  return "Une erreur est survenue.";
}


const isFutureDate = (date) => {
  if (!date) return false;

  const selected = new Date(date);
  selected.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selected > today;
};

const STATUT_BEBE = {
  normale: { text: "Nourrisson normal", type: "mereNormal" },
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
    text: "Mère malnutrie ",
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
    const { user } = useAuth();
  const isCoordinator = user?.role === "coordinator"; 

  const [openZakat, setOpenZakat] = useState(false);
  const [openDistribution, setOpenDistribution] = useState(false);
  const [openVisites, setOpenVisites] = useState(false);
  const [openFinSuivi, setOpenFinSuivi] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openCoordinateur, setOpenCoordinateur] = useState(false);
const [editingNom, setEditingNom] = useState(false);  
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const photoInputRef = useRef(null);

 const {
  data: famille,
  isLoading,
  isError,
  error,
  refetch: refetchFamille,
} = useQuery({
  queryKey: ["famille", id],
  queryFn: () => getFamille(id).then((res) => res.data),
  enabled: !!id,
});

  const {
  data: visitesData,
  isLoading: visitesLoading,
  isError: visitesError,
  fetchNextPage: fetchNextVisitesPage,
  hasNextPage: hasNextVisitesPage,
  isFetchingNextPage: isFetchingNextVisitesPage,
  refetch: refetchVisites,
} = useInfiniteQuery({
    queryKey: ["visites", id],
    queryFn: ({ pageParam = 1 }) =>
      getVisites(id, { page: pageParam }).then((r) => r.data),
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = Boolean(lastPage?.actives?.next) || Boolean(lastPage?.annulees?.next);
      return hasMore ? (allPages?.length ?? 0) + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!id && openVisites,
  });

  const visitesActives = (visitesData?.pages ?? []).flatMap((p) => p?.actives?.results ?? []);
  const visitesAnnulees = (visitesData?.pages ?? []).flatMap((p) => p?.annulees?.results ?? []);

  const {
    data: distributionsData,
    isLoading: distributionsLoading,
    isError: distributionsError,
    fetchNextPage: fetchNextDistributionsPage,
    hasNextPage: hasNextDistributionsPage,
    isFetchingNextPage: isFetchingNextDistributionsPage,
  } = useInfiniteQuery({
    queryKey: ["distributions", id],
    queryFn: ({ pageParam = 1 }) =>
      getDistributions(id, { page: pageParam }).then((r) => r.data),
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = Boolean(lastPage?.actives?.next) || Boolean(lastPage?.annulees?.next);
      return hasMore ? (allPages?.length ?? 0) + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!id && openDistribution,
  });

  const distributionsActives = (distributionsData?.pages ?? []).flatMap((p) => p?.actives?.results ?? []);
  const distributionsAnnulees = (distributionsData?.pages ?? []).flatMap((p) => p?.annulees?.results ?? []);

const {
  data: zakatData,
  isLoading: zakatLoading,
  isError: zakatError,
  fetchNextPage: fetchNextZakatPage,
  hasNextPage: hasNextZakatPage,
  isFetchingNextPage: isFetchingNextZakatPage,
  refetch: refetchZakat,
} = useInfiniteQuery({
  queryKey: ["zakat", id],
  queryFn: ({ pageParam = 1 }) =>
    getFamilleZakat(id, { page: pageParam }).then((r) => r.data),
  getNextPageParam: (lastPage, allPages) => {
    const hasMore =
      Boolean(lastPage?.actives?.next) ||
      Boolean(lastPage?.annulees?.next);

    return hasMore ? (allPages?.length ?? 0) + 1 : undefined;
  },
  initialPageParam: 1,
  enabled: !!id && openZakat,
});

  const zakatActives = (zakatData?.pages ?? []).flatMap((p) => p?.actives?.results ?? []);
  const zakatAnnulees = (zakatData?.pages ?? []).flatMap((p) => p?.annulees?.results ?? []);
 

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
  enabled: !isCoordinator,
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
  if (!coordinateursObserverTarget.current || !openCoordinateur) return;

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
  openCoordinateur,
  hasNextCoordinateursPage,
  isFetchingNextCoordinateursPage,
  fetchNextCoordinateursPage,
]);
  
    const baseline = useMemo(
    () => (famille ? extractEditableFields(famille) : null),
    [famille]
  );

  
  const [form, setForm] = useState(null);
  useEffect(() => {
    if (baseline && !form) setForm(baseline);
  }, [baseline, form]);

  useEffect(() => {
    if (famille) {
      setPhotoPreview(famille?.mere?.photo || null);
      setPhotoFile(null);
      setPhotoRemoved(false);
    }
  }, [famille]);

 
   const patch = useMemo(
    () => (baseline && form ? diffPatch(baseline, form) : {}),
    [baseline, form]
  );
  const nothingChanged = isEmptyPatch(patch) && !photoFile && !photoRemoved;

  const handlePhotoSelected = (file) => {
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoRemoved(false);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoRemoved(true);
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  };

 
   const saveMut = useMutation({
  mutationFn: (patch) => {
    const jsonPayload = buildFamillePayload(patch);

    let finalPayload;

    if (photoFile) {
      // Nouveau fichier photo : FormData avec notation aplatie "mere.xxx"
      finalPayload = new FormData();

      Object.entries(jsonPayload).forEach(([key, value]) => {
        if (key === "mere" || key === "nourrisson") return; // gérés séparément ci-dessous
        if (value === null || value === undefined) return;
        finalPayload.append(key, value);
      });

      Object.entries(jsonPayload.mere || {}).forEach(([key, value]) => {
        if (value === null || value === undefined) return;
        finalPayload.append(`mere.${key}`, value);
      });

      Object.entries(jsonPayload.nourrisson || {}).forEach(([key, value]) => {
        if (value === null || value === undefined) return;
        finalPayload.append(`nourrisson.${key}`, value);
      });

      finalPayload.append("mere.photo", photoFile);

    } else if (photoRemoved) {
      // Suppression de la photo : JSON classique avec mere.photo = null
      finalPayload = {
        ...jsonPayload,
        mere: { ...(jsonPayload.mere || {}), photo: null },
      };
    } else {
      // Pas de changement de photo
      finalPayload = jsonPayload;
    }

    return updateFamille(id, finalPayload).then((r) => r.data);
  },
onSuccess: (updated) => {
  // Récupérer les données précédentes en cache pour ne rien perdre
  const previousFamille = queryClient.getQueryData(["famille", id]);

  const villageId =
    typeof updated?.mere?.village === "object"
      ? updated.mere.village?.id
      : updated?.mere?.village;

  const villageMatch = villageOptions.find(
    (opt) => String(opt.value) === String(villageId)
  );

  const coordinateurId =
    typeof updated?.coordinateur === "object"
      ? updated.coordinateur?.id
      : updated?.coordinateur ?? form.coordinateur_id;

  const coordinateurMatch = coordinateurs.find(
    (coordinateur) =>
      String(coordinateur.id) === String(coordinateurId)
  );

  const fixedUpdated = {
    ...previousFamille, 
    ...updated,          

    coordinateur: coordinateurMatch
      ? {
          id: coordinateurMatch.id,
          nom: coordinateurMatch.nom,
          prenom: coordinateurMatch.prenom,
        }
      : updated?.coordinateur ?? previousFamille?.coordinateur,

    mere: {
      ...previousFamille?.mere, 
      ...updated?.mere,
      village: villageMatch
        ? {
            id: villageMatch.value,
            nom: villageMatch.label,
          }
        : updated?.mere?.village ?? previousFamille?.mere?.village,
    },

    nourrisson: {
      ...previousFamille?.nourrisson, 
      ...updated?.nourrisson,
    },
  };

  // Mettre à jour le formulaire
  setForm(extractEditableFields(fixedUpdated));

  // Mettre à jour l'aperçu photo avec la version confirmée par le backend
  setPhotoPreview(fixedUpdated?.mere?.photo || null);
  setPhotoFile(null);
  setPhotoRemoved(false);

  // Mettre à jour React Query
  queryClient.setQueryData(["famille", id], fixedUpdated);

  queryClient.invalidateQueries({ queryKey: ["familles"] });

  setErrors({});
  setErrorMessage(null);
  setOpenSuccess(true);
},
   onError: (err) => {
    setErrorMessage(extractErrorMessage(err));
  },
});

 
    const handleSave = () => {
    setErrorMessage(null);

    if (errors.date_entree) {
      setErrorMessage("La date d'entrée ne peut pas être une date future.");
      return;
    }

    if (nothingChanged) {
      setErrorMessage("Aucune modification à enregistrer.");
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
      label: "Créé par",
      value: famille?.audit?.cree_par
        ? `${famille.audit.cree_par.prenom} ${famille.audit.cree_par.nom}`
        : "/",
      readOnly: true,
    },

 {
  key: "date_creation",
  label: "Date de création",
  value: famille?.audit?.date_creation
    ? new Date(famille.audit.date_creation).toLocaleDateString("fr-FR")
    : "/",
  editable: false,
},
  ];

  const nourrisson = [

    {
    key: "nourrisson_prenom",
    label: "Prénom",
    value: form.nourrisson_prenom,
},
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
  
  const STATUT_IMC_MERE_LABELS = {
  sous_poids: "Mère sous-poids",
  sur_poids: "Mère en surpoids",
};

const STATUT_HEMOGLOBINE_LABELS = {
  anemie: "Mère anémiée",
};

const buildStatutsMere = () => {
  const nutritionnel = famille?.statut_nutritionnel_mere;
  const imc = famille?.statut_imc_mere;
  const hemoglobine = famille?.statut_hemoglobine_mere;

  const allNull = !nutritionnel && !imc && !hemoglobine;

  if (allNull) {
    return [];
  }

  const isNormal = (v) => !v || v === "normale";

  const allNormal =
    isNormal(nutritionnel) && isNormal(imc) && isNormal(hemoglobine);

  if (allNormal) {
    return [{ text: "Mère normale", type: "mereNormal" }];
  }

  const statuts = [];

  if (nutritionnel && nutritionnel !== "normale" && STATUT_MERE[nutritionnel]) {
    statuts.push({
      text: STATUT_MERE[nutritionnel].text,
      type: STATUT_MERE[nutritionnel].type,
    });
  }

  if (imc && imc !== "normale" && STATUT_IMC_MERE_LABELS[imc]) {
    statuts.push({
      text: STATUT_IMC_MERE_LABELS[imc],
      type: "mas",
    });
  }

  if (hemoglobine && hemoglobine !== "normale" && STATUT_HEMOGLOBINE_LABELS[hemoglobine]) {
    statuts.push({
      text: STATUT_HEMOGLOBINE_LABELS[hemoglobine],
      type: "mas",
    });
  }

  return statuts;
};

const statutsMere = buildStatutsMere();

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

  if (key === "date_entree") {
    setErrors((prev) => ({
      ...prev,
      date_entree: isFutureDate(finalValue),
    }));
  }

  setForm((prev) => ({ ...prev, [key]: finalValue }));
};

  const handleProgrammeChange = makeHandler(programme);
  const handleNourrissonChange = makeHandler(nourrisson);
  const handleMereChange = makeHandler(mere);
  const handleStatutSortieChange = makeHandler(statutSortie);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
     <Sidebar hideOnMobile />

<PopupDistributionfamille
  open={openDistribution}
  onClose={() => setOpenDistribution(false)}
  Distribution={{ actives: distributionsActives, annulees: distributionsAnnulees }}
  famille={famille}
  isLoading={distributionsLoading}
  fetchNextPage={fetchNextDistributionsPage}
  hasNextPage={hasNextDistributionsPage}
  isFetchingNextPage={isFetchingNextDistributionsPage}
/>

<PopupZakatFamille
  open={openZakat}
  onClose={() => setOpenZakat(false)}
  zakats={{
    actives: zakatActives,
    annulees: zakatAnnulees,
  }}
  famille={famille}
  isLoading={zakatLoading}
  fetchNextPage={fetchNextZakatPage}
  hasNextPage={hasNextZakatPage}
  isFetchingNextPage={isFetchingNextZakatPage}
  refetchZakat={refetchZakat}
/>
<Popupvisites
  open={openVisites}
  onClose={() => setOpenVisites(false)}
  Visites={{
    actives: visitesActives,
    annulees: visitesAnnulees
  }}
  famille={famille}
  isLoading={visitesLoading}
  fetchNextPage={fetchNextVisitesPage}
  hasNextPage={hasNextVisitesPage}
  isFetchingNextPage={isFetchingNextVisitesPage}
  refetchVisites={refetchVisites}
/>

<PopupFinSuivi
  open={openFinSuivi}
  onClose={() => setOpenFinSuivi(false)}
  onConfirm={async (motif, dateSortie) => {
    await marquerSortie(famille.id, {
      date_sortie: dateSortie,
      motif_sortie: motif,
    });

    setOpenFinSuivi(false);

    const { data: updated } = await refetchFamille();
    if (updated) {
      setForm(extractEditableFields(updated));
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

     <main className="flex-1 overflow-y-auto px-5 pt-4 md:pt-0 pb-8 lg:p-10 bg-white">
        <PageHeader
          leftTitle="Revenir"
          showRight={false}
          onBack={() => window.history.back()}
        />
 <div className="mt-2">
          <NavigationHeader
          title="Fiche famille"
          type="save"
          actionTitle={saveMut.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
          onAction={handleSave}
          disabled={nothingChanged || saveMut.isPending}
        />
</div>
       <BackendErrorMessage message={errorMessage} className="mb-4" />

        <div className="grid grid-cols-1 xl:grid-cols-[520px_minmax(0,1fr)] gap-6 xl:gap-10 mb-8">
                   <div className="relative w-full lg:w-[520px] h-[220px] sm:h-[260px] md:h-[300px] lg:h-[331px]">
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handlePhotoSelected(e.target.files?.[0])}
            />

            <div
              onClick={() => photoInputRef.current?.click()}
              className="
                relative
                w-full h-full
                rounded-[15px]
                overflow-hidden
                border border-[#E5E7EB]
                bg-white
                shadow-sm
                cursor-pointer
                group
              "
            >
              <img
                src={photoPreview || MotherPhoto}
                alt="Photo de la mère"
                className="w-full h-full object-cover"
              />

              <span
                className="
                  absolute inset-0
                  bg-black/0
                  group-hover:bg-black/20
                  transition-colors
                  flex items-center justify-center
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
            </div>

            {photoPreview && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemovePhoto();
                }}
                className="
                  absolute top-3 right-3
                  w-8 h-8
                  rounded-full
                  bg-white
                  shadow-sm
                  flex items-center justify-center
                "
                aria-label="Supprimer la photo"
              >
                <X size={18} color="#202124" strokeWidth={2.5} />
              </button>
            )}
          </div>

          <div className="min-h-[331px] flex flex-col gap-4">
         <div className="flex items-center justify-between gap-3">
  {editingNom ? (
    <div
      className="flex items-center gap-2 flex-1 min-w-0"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setEditingNom(false);
        }
      }}
    >
      <input
        type="text"
        autoFocus
        value={form.mere_nom}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, mere_nom: e.target.value }))
        }
        placeholder="Nom"
        className="
          text-[26px] font-bold text-[#202124]
          bg-transparent outline-none
          border-b border-[#67A7A3]
          w-[45%] min-w-0
        "
      />
      <input
        type="text"
        value={form.mere_prenom}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, mere_prenom: e.target.value }))
        }
        placeholder="Prénom"
        className="
          text-[26px] font-bold text-[#202124]
          bg-transparent outline-none
          border-b border-[#67A7A3]
          w-[45%] min-w-0
        "
      />
    </div>
  ) : (
    <h2
      onClick={() => setEditingNom(true)}
      className="text-[26px] font-bold text-[#202124] cursor-pointer truncate hover:opacity-80"
      title="Cliquer pour modifier"
    >
      {form.mere_nom} {form.mere_prenom}
    </h2>
  )}
  <span className="text-[#67A7A3] text-[18px] font-semibold whitespace-nowrap">
    {famille?.id}
  </span>
</div>

          
            <div className="flex flex-col gap-2">
              <StatusBadge
                type={statut?.toLowerCase() === "sortie" ? "sortie" : "mereActive"}
                text={statut?.toLowerCase() === "sortie" ? "Sortie" : "Active"}
                className="w-full h-[40px] rounded-[10px]"
              />

            <div className="flex flex-row flex-wrap gap-2">
  {statutBebe && (
    <StatusBadge
      type={statutBebe.type}
      text={statutBebe.text}
      className="flex-1 min-w-[140px] h-[40px] rounded-[10px]"
    />
  )}

  {statutsMere.map((s, idx) => (
    <StatusBadge
      key={idx}
      type={s.type}
      text={s.text}
      className="flex-1 min-w-[140px] h-[40px] rounded-[10px]"
    />
  ))}
</div>
            </div>

           
                         <div className="-mt-3">
              <EditableInfoCard
                title="Informations administratives"
                data={programme}
                editable={true}
                onChange={handleProgrammeChange}
              />
              <ErrorMessage
                message={
                  errors.date_entree
                    ? "La date d'entrée ne peut pas être une date future."
                    : null
                }
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
                               {isCoordinator ? (
                  <InfoCard
                    title="Supervisé par"
                    data={[{ label: "Nom du coordinateur", value: coordinateurNom }]}
                  />
                ) : (
                  <EditableInfoCard
                    title="Supervisé par"
                    data={[{ label: "Nom du coordinateur", value: coordinateurNom, popup: true }]}
                    editable={true}
                    onChange={() => {}}
                    onPopupClick={() => setOpenCoordinateur(true)}
                  />
                )}
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
  isError={coordinateursIsError}
  search={searchCoordinateur}
  onSearchChange={setSearchCoordinateur}
  observerTarget={coordinateursObserverTarget}
  isFetchingNextPage={isFetchingNextCoordinateursPage}
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
