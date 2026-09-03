import Sidebar from "../../components/Sidebar/Sidebar";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
import { useAuth } from "../../components/Providers/AuthProvider";
import Card from "../../components/Cards/Card";
import CardPopup from "../../components/Cards/Card2";
import OptionsMenu from "../../components/Containers/OptionsMenu";
import SelectorWithAction from "../../components/Forms/SelectorWithAction";
import LaitInfantile from "../../components/Distribution/LaitInfantile";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import ColisAlimentaire from "../../components/Distribution/ColisAlimentaire";
import { useState, useEffect, useRef } from "react";

import Cereales from "../../assets/Cereales.svg";
import Legumineuses from "../../assets/Legumineuses.svg";
import Huile from "../../assets/Huile.svg";
import Sucre from "../../assets/Sucre.svg";
import Sel from "../../assets/Sel.svg";

import { useNavigate } from "react-router-dom";
import DateContainer from "../../components/Containers/DateContainer";
import InfoHeader from "../../components/Containers/InfoBanner";
import Button from "../../components/Button/Button";

import PopupListeFamilles from "../../components/Popups/PopupListeFamilles";

import ConfirmationForm from "../../components/Forms/ConfirmationForm";
import SelectProductsPopup from "../../components/Popups/SelectProductsPopup";
import ErrorMessage from "../../components/Forms/ErrorMessage";
import BackendErrorMessage from "../../components/Forms/BackendErrorMessage";

import Popup from "../../components/Popups/SuccessPopup";
import SuccessImage from "../../assets/Success.svg";
import { useLocation } from "react-router-dom";




import { listFamilles , getFamille } from "@/lib/api/familles";
import {
  createDistribution,
  updateDistribution,
  getPreCreationProduits,
  getPreCreationDate,
} from "@/lib/api/distributions";
import { saveDraft } from "@/lib/offlineDrafts";
import { saveCache, loadCache } from "@/lib/offlineCache";



const parseDateFR = (str) => {
  if (!str) return null;
  const [day, month, year] = str.split("/").map(Number);
  if (!day || !month || !year) return null;
  const parsed = new Date(year, month - 1, day);
  return isNaN(parsed.getTime()) ? null : parsed;
};

const formatDateYYYYMMDD = (d) => {
  const dt = d instanceof Date ? d : new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(
    dt.getDate()
  ).padStart(2, "0")}`;
};

const isFutureDate = (date) => {
  if (!date) return false;

  const selected = new Date(date);
  selected.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selected > today;
};


const detectLaitTypeValue = (nomProduitLait = "") => {
  const nom = nomProduitLait.toLowerCase();
  if (nom.includes("1er")) return "1er_age";
  if (nom.includes("2eme") || nom.includes("2ème") || nom.includes("2 eme")) return "2eme_age";
  return null;
};

// Approximates the backend's search, client-side, against the family list
// already cached by the dashboard prefetch — used only when offline and
// the real search can't run.
function filterCachedFamilles(cachedData, searchTerm) {
  const list = Array.isArray(cachedData) ? cachedData : cachedData?.results ?? [];

  if (!searchTerm) return cachedData;

  const term = searchTerm.trim().toLowerCase();
  if (!term) return cachedData;

  const filtered = list.filter((f) => {
    const haystack = [
      f?.mere?.nom,
      f?.mere?.prenom,
      f?.nourrisson?.prenom,
      String(f?.id ?? ""),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(term);
  });

  return Array.isArray(cachedData)
    ? filtered
    : { ...cachedData, results: filtered, next: null };
}

export default function AjoutDistribution() {
  const { user, ready } = useAuth();
  const role = user?.role ?? null;
  const isAdmin = role === "admin" || role === "chef_coordinator";
  
 

 const iconByNom = {
  "Céréales": Cereales,
  "Légumineuses": Legumineuses,
  "Huile alimentaire": Huile,
  "Huile": Huile,
  "Sucre": Sucre,
  "Sel": Sel,
  "Sel iodé": Sel,
};
const DEFAULT_STOCK_ICON = Sucre; //  si le nom n'est pas mappé

  const [showNewProduct, setShowNewProduct] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [offlinePending, setOfflinePending] = useState(false); 

  const location = useLocation();
  const draft = location.state?.draft;
  // Distribution existante passée depuis la page de détail (mode modification)
  const distributionAModifier = location.state?.distributionAModifier;

  // Mode modification si une distribution existante a été transmise
  const isEditMode = !!distributionAModifier;
  const initialEditDataRef = useRef(null);
// En mode édition, mapDistributionToEditData() ne renvoie pas selectedLaitOption
// (il faut le grammage exact) — on retrouve donc le produit lait brut ici,
// directement depuis distribution.produits (présent car on spread ...distribution).
const produitLaitSource = isEditMode
  ? (distributionAModifier?.produits || []).find(
      (p) =>
        p.produit?.type_produit === "lait" ||
        p.produit?.nom?.toLowerCase().includes("lait")
    )
  : null;

 // Source des données : distribution existante (édition) > brouillon (retour "voir la fiche") > vide (ajout)
  const source = distributionAModifier || draft;

  // Icône utilisée par défaut quand un produit n'a pas d'icône
  const DEFAULT_ICON = Sucre;

  const withDefaultIcon = (list) =>
    (list || []).map((p) => ({
      ...p,
      icon: p.icon || DEFAULT_ICON,
    }));
   

  const [selectedFamille, setSelectedFamille] = useState(source?.selectedFamille || null);

 

  const [products, setProducts] = useState(withDefaultIcon(source?.products));
const [date, setDate] = useState(() => {
  // Depuis "voir la fiche" (draft) : déjà un objet Date
  if (source?.date instanceof Date) return source.date;

  // Draft sérialisé en string JJ/MM/AAAA
  if (typeof source?.date === "string") {
    return parseDateFR(source.date) || new Date();
  }

  // Mode édition : date_distribution vient du backend en ISO (YYYY-MM-DD)
  if (source?.date_distribution) {
    const parsed = new Date(source.date_distribution);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }

  return new Date();
});



 const [confirmed, setConfirmed] = useState(() => {
  if (isEditMode) return Boolean(distributionAModifier?.reception_confirmee);
  return source?.confirmed || false;
});

  // --- Lait infantile ---
  // type : "1er_age" | "2eme_age"
  // selectedLaitOption : { id, grammage, nb_boites } correspondant au grammage choisi
  const [laitType, setLaitType] = useState(() => {
  if (isEditMode && produitLaitSource) {
    return detectLaitTypeValue(produitLaitSource.produit?.nom) || null;
  }
  return source?.laitType || null; // draft ("voir la fiche") : déjà la bonne valeur
});
const [selectedLaitOption, setSelectedLaitOption] = useState(source?.selectedLaitOption || null);
const [showLaitPopup, setShowLaitPopup] = useState(false);
const [boxes, setBoxes] = useState(() => {
  if (isEditMode && produitLaitSource) {
    return Number(produitLaitSource.quantite ?? 0);
  }
  return source?.boxes ?? 0;
});

  // ---------------------------------------------------------------------
  // Pré-création — désormais DEUX endpoints séparés :
  //
  // 1) Produits + lait : ne dépend PAS de la famille. On le charge dès le
  //    montage de la page (enabled reste true), et on met le résultat en
  //    cache localStorage — exactement le pattern "last known good copy"
  //    utilisé pour les villages/familles. Ça veut dire que le stock est
  //    déjà connu (ou dispo depuis le cache) même avant que l'utilisateur
  //    ait choisi une famille, et même hors ligne si un chargement en
  //    ligne a eu lieu avant.
  //
  // 2) Date de dernière distribution : dépend de la famille (paramètre
  //    ?famille=CODE), donc reste gated par selectedFamille?.code comme
  //    avant. Pas de cache offline ici — c'est une info secondaire, pas
  //    bloquante pour remplir le formulaire.
  // ---------------------------------------------------------------------

   const PRODUITS_CACHE_KEY = "stock-produits";

 

const {
  data: produitsData,
  isFetching: produitsLoading,
  isError: produitsError,
} = useQuery({
  queryKey: ["distribution-pre-creation-produits"],
  queryFn: async () => {
    try {
      const response = await getPreCreationProduits();
      console.log("🌐 Stock distribution chargé depuis le serveur");
      // No saveCache here on purpose — the dashboard prefetch already
      // keeps "stock-produits" warm on every login. Writing here too
      // would just duplicate that, with no real benefit.
      return response.data;
    } catch (error) {
      const cached = loadCache(PRODUITS_CACHE_KEY);
      if (cached?.data) {
        console.log("📦 Stock distribution chargé depuis le cache (fallback)");
        return cached.data;
      }
      throw error;
    }
  },
  networkMode: "always",
  retry: 1,
});
  const {
    data: dateData,
    isFetching: dateLoading,
  } = useQuery({
    queryKey: ["distribution-pre-creation-date", selectedFamille?.code],
    queryFn: () => getPreCreationDate(selectedFamille.code).then((r) => r.data),
    enabled: !!selectedFamille?.code,
  });



const stockProducts = (produitsData?.produits || [])
  .filter((p) => !p.nom?.toLowerCase().includes("lait"))
  .map((p) => ({
    id: p.id,
    icon: iconByNom[p.nom] || DEFAULT_STOCK_ICON,
    title: p.nom,
    quantity: Number(p.stock),
    unit: p.unite === "boite" ? "boîtes" : p.unite === "kg" ? "kg" : p.unite,
  }));


  // Grammages disponibles pour le type de lait actuellement sélectionné
  const laitOptions = produitsData?.lait?.[laitType] || [];

  // laitOptions arrive de façon asynchrone (query liée à selectedFamille) :
// dès qu'il est dispo, on retrouve l'option qui correspond au produit lait
// de la distribution éditée et on la sélectionne.
useEffect(() => {
  if (!isEditMode || !produitLaitSource || selectedLaitOption) return;
  if (!laitOptions.length) return;

  const match = laitOptions.find(
    (option) => option.id === produitLaitSource.produit?.id
  );

  if (match) {
    setSelectedLaitOption(match);
  }
}, [isEditMode, produitLaitSource, laitOptions, selectedLaitOption]);

  const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState({
    name: "",
    unit: "",
    quantity: "",
  });
  const [showStockPopup, setShowStockPopup] = useState(false);

  
  const [errors, setErrors] = useState({
    famille: false,
    date: false,
    laitType: false,
    grammage: false,
    boxes: false,
    laitStock: null,
    confirmed: false,
    distribution: false,
    produits: {},
  });

  const validateForm = () => {
    const produitsErrors = {};
    products.forEach((product) => {
      if (!product.quantity || product.quantity <= 0) {
        produitsErrors[product.id] = "Veuillez indiquer une quantité";
      } else if (
        product.maxQuantity !== undefined &&
        product.quantity > product.maxQuantity
      ) {
        produitsErrors[product.id] = `Quantité supérieure au stock disponible (${product.maxQuantity} ${product.unit || ""})`;
      }
    });

    // Le lait n'est pas obligatoire, mais dès qu'un type est choisi,
    // il faut aller jusqu'au bout (grammage + au moins 1 boîte).
    const milkStarted = !!laitType;
    const milkGrammageMissing = milkStarted && !selectedLaitOption;
    const milkBoxesMissing = milkStarted && selectedLaitOption && boxes <= 0;
    const milkComplete = milkStarted && selectedLaitOption && boxes > 0;

    const newErrors = {
      famille: !selectedFamille,
      date: isFutureDate(date),
      laitType: false,
      grammage: milkGrammageMissing,
      boxes: milkBoxesMissing,
      laitStock: null,
      confirmed: !confirmed,
      
      distribution: products.length === 0 && !milkStarted && !milkComplete,
      produits: produitsErrors,
    };
    setErrors(newErrors);

    const hasFieldError = [
      newErrors.famille,
      newErrors.date,
      newErrors.grammage,
      newErrors.boxes,
      newErrors.confirmed,
      newErrors.distribution,
    ].some(Boolean);
    const hasProduitError = Object.keys(produitsErrors).length > 0;

    return !hasFieldError && !hasProduitError;
  };

 const handleSave = async () => {
  if (!validateForm()) return;

  setSaving(true);
  setSaveError(null);
  setOfflinePending(false);

  const produitsPayload = products.map((p) => ({
    produit: p.id,
    quantite: Number(p.quantity),
  }));

  // produit: id_du_lait, quantite: nb_boites 
  if (boxes > 0 && selectedLaitOption) {
    produitsPayload.push({
      produit: selectedLaitOption.id,
      quantite: Number(boxes),
    });
  }

  const payload = {
    famille: selectedFamille?.code, 
    reception_confirmee: confirmed,
    date_distribution: formatDateYYYYMMDD(date),
    produits: produitsPayload,
  };

  // Extrait un message d'erreur lisible depuis une réponse API (from the backend)
 const extractErrorMessage = (error) => {
  const data = error.response?.data;
  const contentType = error.response?.headers?.["content-type"] || "";

  const messageGenerique = "Une erreur est survenue lors de l'enregistrement de la distribution.";

  // Si la réponse est du HTML (page d'erreur Django/serveur) plutôt que du JSON,
  // on ne tente même pas de l'analyser — on affiche un message générique.
  if (contentType.includes("text/html")) {
    return messageGenerique;
  }

  if (!data) {
    return error.message || messageGenerique;
  }

  if (typeof data === "string") {
    // Sécurité supplémentaire : si jamais c'est une string mais qu'elle contient du HTML
    if (data.trim().startsWith("<!DOCTYPE") || data.trim().startsWith("<html")) {
      return messageGenerique;
    }
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

  return messageGenerique;
};

   try {
   if (isEditMode) {
  const initialData = initialEditDataRef.current;

  if (!initialData) {
    setSaveError("Impossible de vérifier les modifications.");
    setSaving(false);
    return;
  }

  // Produits actuels
  const currentProducts = produitsPayload
    .map((p) => ({
      id: Number(p.produit),
      quantity: Number(p.quantite),
    }))
    .sort((a, b) => a.id - b.id);

  // Produits initiaux
  const initialProducts = (initialData.produits || [])
    .map((p) => ({
      id: Number(p.id),
      quantity: Number(p.quantity),
    }))
    .sort((a, b) => a.id - b.id);

  // Comparaison produits
  const produitsChanged =
    JSON.stringify(currentProducts) !==
    JSON.stringify(initialProducts);

  // Comparaison date
  const currentDate = String(payload.date_distribution).slice(0, 10);
  const initialDate = String(
    initialData.date_distribution || ""
  ).slice(0, 10);

  const dateChanged = currentDate !== initialDate;

  // Comparaison confirmation
  const confirmationChanged =
    Boolean(payload.reception_confirmee) !==
    Boolean(initialData.reception_confirmee);

  const hasChanges =
    produitsChanged ||
    dateChanged ||
    confirmationChanged;

  if (!hasChanges) {
    setSaveError("Aucune modification à enregistrer.");
    setSaving(false);
    return;
  }

  const patch = {
    produits: produitsPayload,
    date_distribution: payload.date_distribution,
    reception_confirmee: payload.reception_confirmee,
  };

  console.log("========== MODE MODIFICATION ==========");
  console.log("ID distribution :", distributionAModifier.id);
  console.log("PATCH FINAL :", patch);
  console.log("Nombre de produits envoyés :", patch.produits.length);
  console.log("Produits envoyés :", patch.produits);

  await updateDistribution(distributionAModifier.id, patch);
} else {
  await createDistribution(payload);
}

setShowSuccessPopup(true);
   } catch (error) {
  // Offline queueing only applies to brand-new distributions (CREATE) —
  // edits stay online-only, per scope.
  if (!isEditMode && !error.response) {
    try {
      // Saved as a draft, not auto-queued: nothing syncs on its own.
      // The coordinator reviews it from "Brouillons hors ligne" and
      // explicitly clicks "ajouter" once back online.
      await saveDraft("distribution", payload);
      setOfflinePending(true);
      setShowSuccessPopup(true);
    } catch (draftError) {
      console.error("❌ Impossible d'enregistrer le brouillon de distribution :", draftError);
      setSaveError("Impossible d'enregistrer la distribution, même hors ligne. Veuillez réessayer.");
    }
    setSaving(false);
    return;
  }

  console.error(
    isEditMode
      ? " Erreur lors de la modification de la distribution :"
      : " Erreur lors de la création de la distribution :",
    error.response?.data || error.message
  );
  setSaveError(extractErrorMessage(error));
} finally {
  setSaving(false);
}
};

  const handleLaitTypeChange = (option) => {
    
    setLaitType(option?.value ?? null);
    // Si  On change de type le grammage précédemment choisi n'est plus valide
    setSelectedLaitOption(null);
    setBoxes(0);
    setErrors((prev) => ({
      ...prev,
      laitType: false,
      grammage: false,
      boxes: false,
      laitStock: null,
    }));
  };

  const handleOpenLaitPopup = () => {
    if (!laitType) {
      setErrors((prev) => ({ ...prev, laitType: true }));
      return;
    }
    setShowLaitPopup(true);
  };

  const handleSelectLaitOption = (option) => {
    setSelectedLaitOption(option);
    setBoxes(0);
    setShowLaitPopup(false);
    setErrors((prev) => ({ ...prev, grammage: false, boxes: false, laitStock: null }));
  };

  const handleConfirmedChange = (e) => {
    const isChecked = e.target.checked;
    setConfirmed(isChecked);
    if (isChecked) {
      setErrors((prev) => ({ ...prev, confirmed: false }));
    }
  };

  const handleIncrementBoxes = () => {
    if (!laitType) {
      setErrors((prev) => ({ ...prev, laitType: true }));
      return;
    }
    if (!selectedLaitOption) {
      setErrors((prev) => ({ ...prev, grammage: true }));
      return;
    }
    setBoxes((v) => {
      const newValue = v + 1;
      if (newValue > selectedLaitOption.nb_boites) {
        setErrors((prev) => ({
          ...prev,
          laitStock: `Stock disponible dépassé (max ${selectedLaitOption.nb_boites} boîtes)`,
        }));
        return v;
      }
      setErrors((prev) => ({ ...prev, laitStock: null, boxes: false }));
      return newValue;
    });
  };

  const handleDecrementBoxes = () => {
    setBoxes((v) => {
      const newValue = Math.max(0, v - 1);
      setErrors((prev) => ({
        ...prev,
        laitStock:
          selectedLaitOption && newValue > selectedLaitOption.nb_boites
            ? prev.laitStock
            : null,
      }));
      return newValue;
    });
  };
 const handleManualFamilleSubmit = (code) => {
  const cached = loadCache("familles-popup");
  const cachedList = cached?.data?.results ?? cached?.data ?? [];
  const match = cachedList.find((f) => String(f.id) === code);

  if (match) {
    setSelectedFamille({
      id: match.id,
      code: match.id,
      enfant: match.nourrisson?.prenom,
      mere: `${match.mere?.nom ?? ""} ${match.mere?.prenom ?? ""}`,
      sexe:
        match?.nourrisson?.sexe === "M"
          ? "Fils"
          : match?.nourrisson?.sexe === "F"
          ? "Fille"
          : "-",
      region: match.mere?.village?.nom ?? "-",
      naissance: match.nourrisson?.date_naissance,
      badges: [],
    });
  } else {
    // Not in cache — accepted anyway, coordinator typed it from memory.
    // Backend validates for real once this draft syncs.
    setSelectedFamille({
      id: code,
      code,
      enfant: undefined,
      mere: undefined,
      sexe: "-",
      region: "-",
      naissance: undefined,
      badges: [{ type: "retard", text: "Code saisi manuellement — non vérifié" }],
    });
  }

  setErrors((prev) => ({ ...prev, famille: false }));
};

  const [openFamilles, setOpenFamilles] = useState(false);
const [openOptions, setOpenOptions] = useState(false);
const [searchFamille, setSearchFamille] = useState("");
const [debouncedSearchFamille, setDebouncedSearchFamille] = useState(""); 
const [familleParCode, setFamilleParCode] = useState(null); 
const [isSearchingByCode, setIsSearchingByCode] = useState(false); 

useEffect(() => { 
  const timer = setTimeout(() => {
    setDebouncedSearchFamille(searchFamille);
  }, 300);
  return () => clearTimeout(timer);
}, [searchFamille]);

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
  const params = { page: pageParam , statut: "active" };

  const trimmedSearch = searchFamille.trim();
  if (trimmedSearch) {
    params.search = trimmedSearch;
  }

  try {
    const response = await listFamilles(params);
    // No saveCache here — same reasoning as the family list page: this
    // popup's own fetch may be filtered, and we don't want a filtered
    // result silently overwriting the general cache the dashboard warms.
    return response.data;
  } catch (error) {
    if (pageParam === 1) {
      const cached = loadCache("familles-popup");
      if (cached?.data) {
        console.log("📦 Familles (popup) chargées depuis le cache (fallback)");
        return filterCachedFamilles(cached.data, trimmedSearch);
      }
    }
    // No cache, or a page beyond what we have — nothing more to offer offline.
    throw error;
  }
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


const mapFamilleToPopupItem = (famille) => ({
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
    famille?.statut_nutritionnel_bebe === "mam" && { type: "mam", text: "MAM nourrisson" },
    famille?.statut_nutritionnel_bebe === "mas" && { type: "mas", text: "MAS nourrisson" },
    famille?.statut_nutritionnel_bebe === "normale" && { type: "mere", text: "Nourrisson normal" },
    famille?.statut_nutritionnel_mere === "normale" && { type: "mere", text: "Mère normale" },
    famille?.statut_nutritionnel_mere === "a_risque" && { type: "risque", text: "Mère à risque" },
    famille?.statut_nutritionnel_mere === "malnutrition" && { type: "mas", text: "Mère malnutrie" },
    famille.est_visite_en_retard && { type: "retard", text: "Visite en retard" },
  ].filter(Boolean),
});

const listeDesFamilles = famillesBrutes.map(mapFamilleToPopupItem);

 const rechercherParCode = async (code) => {
  try {
    setIsSearchingByCode(true);
    const response = await getFamille(code);
    setFamilleParCode(mapFamilleToPopupItem(response.data));
  } catch (error) {
    console.error("Erreur recherche famille par code :", error);
    setFamilleParCode(null);
  } finally {
    setIsSearchingByCode(false);
  }
};
useEffect(() => {
  const value = debouncedSearchFamille.trim();

  if (/^GDK-\d{4}-\d+$/i.test(value)) {
    rechercherParCode(value);
  } else {
    setFamilleParCode(null);
  }
}, [debouncedSearchFamille]);

const displayedFamillesPopup = familleParCode ? [familleParCode] : listeDesFamilles;

  // En mode modification, on ne peut plus changer de famille — seulement la consulter
  const familyOptions = isEditMode
    ? [{ label: "Voir la fiche famille", value: "voir" }]
    : [
        { label: "Changer la famille", value: "changer" },
        { label: "Voir la fiche famille", value: "voir" },
      ];

  const handleSearch = () => {
    setOpenFamilles(true);
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, quantity: newQuantity } : product
      )
    );

    setErrors((prev) => {
      const product = products.find((p) => p.id === id);
      if (!product) return prev;

      const updatedProduits = { ...prev.produits };

      if (!newQuantity || newQuantity <= 0) {
        updatedProduits[id] = "Veuillez indiquer une quantité";
      } else if (
        product.maxQuantity !== undefined &&
        newQuantity > product.maxQuantity
      ) {
        updatedProduits[id] = `Quantité supérieure au stock disponible (${product.maxQuantity} ${product.unit || ""})`;
      } else {
        delete updatedProduits[id];
      }

      return { ...prev, produits: updatedProduits };
    });
  };

  const handleRemoveProduct = (id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
    setErrors((prev) => {
      const updatedProduits = { ...prev.produits };
      delete updatedProduits[id];
      return { ...prev, produits: updatedProduits };
    });
  };

   const handleOptionSelect = (value) => {
    if (value === "changer") {
      setOpenFamilles(true);
    } else if (value === "voir") {
      navigate(`/famille/${selectedFamille.id}`, {
        state: {
          from: "/ajout-distribution",
          draft: {
            selectedFamille,
            products,
            date,
            confirmed,
            laitType,
            selectedLaitOption,
            boxes,
          },
          // Si on était déjà en mode modification, on garde le contexte au retour
          distributionAModifier: isEditMode ? distributionAModifier : undefined,
        },
      });
    }
  };

useEffect(() => {
  if (!isEditMode || !distributionAModifier) return;

  const initialProducts = (distributionAModifier.produits || [])
    .map((p) => ({
      id: Number(p.produit?.id ?? p.produit),
      quantity: Number(p.quantite ?? 0),
    }))
    .sort((a, b) => a.id - b.id);

  initialEditDataRef.current = {
    date_distribution: distributionAModifier.date_distribution
      ? String(distributionAModifier.date_distribution).slice(0, 10)
      : null,

    reception_confirmee: Boolean(
      distributionAModifier.reception_confirmee
    ),

    produits: initialProducts,
  };
}, [isEditMode, distributionAModifier]);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
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
        
        
          <div className="mb-0 lg:mb-3">
            <PageHeader
              leftTitle="Annuler"
              showRight={false}
              onBack={() => window.history.back()}
            />
          </div>
       

       

      {!selectedFamille && (
  <div className="flex flex-col gap-2 mt-2">
    <SelectorWithAction
      label="Choisir la famille concernée"
      description="Cliquer pour rechercher la famille concernée par la distribution"
      onAction={handleSearch}
      manualEntryLabel="Entrer le code famille directement"
      manualEntryPlaceholder="Ex : GDK-2026-059"
      onManualSubmit={handleManualFamilleSubmit}
      manualEntryError={
        errors.famille
          ? "Veuillez sélectionner une famille"
          : null
      }
    />

    <ErrorMessage
      message={
        errors.famille
          ? "Veuillez sélectionner une famille"
          : null
      }
    />
  </div>
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
        {saveError && (
  <div className="mt-3">
    <BackendErrorMessage message={saveError} />
  </div>
)}

        {/* Main content */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-4">
            {selectedFamille && !isEditMode  && (
             <InfoHeader
  title="Dernière distribution"
  value={
    dateLoading
      ? "Chargement..."
      : dateData?.derniere_distribution
        ? dateData.derniere_distribution
            .split("-")
            .reverse()
            .join("/")
        : "Aucune"
  }
/>
            )}

            {/* Date */}
            <div className="flex flex-col gap-0">
              <h3
                className="
                  text-[16px]
                  lg:text-[18px]
                  font-semibold
                  text-[#202124]
                "
              >
                Date de la distribution
              </h3>

              <div
                className={`
                  grid
                  grid-cols-1
                  lg:grid-cols-1
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

                <ErrorMessage
                   message={
                   errors.date
                   ? "La date de distribution ne peut pas être supérieure à la date d'aujourd'hui."
                   : null
                  }
                />

              
              </div>
            </div>

            {/* Milk */}
            <LaitInfantile
              type={laitType}
              onTypeChange={handleLaitTypeChange}
              options={laitOptions}
              optionsLoading={produitsLoading}
              selectedOption={selectedLaitOption}
              onSelectOption={handleSelectLaitOption}
              showPopup={showLaitPopup}
              onOpenPopup={handleOpenLaitPopup}
              onClosePopup={() => setShowLaitPopup(false)}
              boxes={boxes}
              onIncrement={handleIncrementBoxes}
              onDecrement={handleDecrementBoxes}
              errors={{ ...errors, famille: false }}
              hasFamille={true}
              onRequireFamille={() => {}}
            />

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
          <div>
            <ColisAlimentaire
    products={products}
   onAddProduct={() => {
  if (!produitsLoading) setShowStockPopup(true);
}}
    onUpdateQuantity={handleUpdateQuantity}
    onRemoveProduct={handleRemoveProduct}
    errors={errors.produits}
  />
  {produitsError && (
  <p className="text-red-500 text-sm mt-1">Impossible de charger le stock disponible.</p>
)}
             <ErrorMessage
    message={
      errors.distribution
        ? "Veuillez ajouter au moins un colis alimentaire ou du lait infantile"
        : null
    }
  />
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
    title={
      saving
        ? "Enregistrement..."
        : isEditMode
        ? "Enregistrer les modifications"
        : "Enregistrer"
    }
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
        ? "Distribution enregistrée en brouillon hors ligne — à valider depuis « Brouillons hors ligne »"
        : isEditMode
        ? "Distribution modifiée avec succès"
        : "Distribution enregistrée avec succès"
    }
    image={offlinePending ? null : SuccessImage}
    primaryButtonText={
      offlinePending
        ? "Voir les brouillons hors ligne"
        : "Voir la fiche famille"
    }
    secondaryButtonText="Revenir à l'accueil"
    onPrimaryClick={() => {
      setShowSuccessPopup(false);

      if (offlinePending) {
        navigate("/brouillons-hors-ligne");
      } else {
        navigate(`/famille/${selectedFamille?.id}`);
      }

      setOfflinePending(false);
    }}
    onSecondaryClick={() => {
      setShowSuccessPopup(false);
      setOfflinePending(false);
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

  <PopupListeFamilles
  open={openFamilles}
  onClose={() => setOpenFamilles(false)}
  familles={displayedFamillesPopup} // ← changé
  loading={famillesLoading || (isSearchingByCode && listeDesFamilles.length === 0)} // ← changé
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

   {showStockPopup && (
  <SelectProductsPopup
    stockProducts={stockProducts.filter(
      (stockProduct) => !products.some((p) => p.id === stockProduct.id)
    )}
    onClose={() => setShowStockPopup(false)}
    onConfirm={(selected) => {
      setProducts((prev) => [
        ...prev,
        ...selected.map((p) => ({ ...p, maxQuantity: p.quantity, quantity: 0 })),
      ]);
      setErrors((prev) => ({ ...prev, distribution: false }));
    }}
  />
)}
    </div>
  );
}
