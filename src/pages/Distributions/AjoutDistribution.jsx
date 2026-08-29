import Sidebar from "../../components/Sidebar/Sidebar";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
import { useAuth } from "../../components/Providers/AuthProvider";
import Card from "../../components/Cards/Card";
import CardPopup from "../../components/Cards/Card2";
import OptionsMenu from "../../components/Containers/OptionsMenu";
import SelectorWithAction from "../../components/Forms/SelectorWithAction";
import LaitInfantile from "../../components/Distribution/LaitInfantile";

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

import { useQuery } from "@tanstack/react-query";


import { listFamilles } from "@/lib/api/familles";
import { createDistribution, getPreCreationDistribution, updateDistribution } from "@/lib/api/distributions";
import { diffPatch, isEmptyPatch } from "@/lib/diff";


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


const areProduitsEqual = (a = [], b = []) => {
  if (a.length !== b.length) return false;

  const normalize = (list) =>
    [...list]
      .map((p) => `${p.produit}:${Number(p.quantite ?? 0)}`)
      .sort(); // insensible à l'ordre

  const na = normalize(a);
  const nb = normalize(b);

  return na.every((val, i) => val === nb[i]);
};
const detectLaitTypeValue = (nomProduitLait = "") => {
  const nom = nomProduitLait.toLowerCase();
  if (nom.includes("1er")) return "1er_age";
  if (nom.includes("2eme") || nom.includes("2ème") || nom.includes("2 eme")) return "2eme_age";
  return null;
};

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

  const location = useLocation();
  const draft = location.state?.draft;
  // Distribution existante passée depuis la page de détail (mode modification)
  const distributionAModifier = location.state?.distributionAModifier;

  // Mode modification si une distribution existante a été transmise
  const isEditMode = !!distributionAModifier;
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

// État "avant modification", figé une seule fois au montage — sert de baseline
// pour diffPatch() lors de la sauvegarde en mode édition.
const baselineRef = useRef(
  isEditMode
    ? {
        produits: (distributionAModifier?.produits || []).map((p) => ({
          produit: p.produit?.id,
          quantite: Number(p.quantite ?? 0),
        })),
        date_distribution: distributionAModifier?.date_distribution ?? null,
        reception_confirmee: Boolean(distributionAModifier?.reception_confirmee),
      }
    : null
);

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

  // Pré-création : donne le détail des grammages dispo (avec nb_boites) par type de lait
  const {
  data: preCreationData,
  isFetching: preCreationLoading,
  isError: preCreationError,
} = useQuery({
  queryKey: ["distribution-pre-creation", selectedFamille?.code],
  queryFn: () => getPreCreationDistribution(selectedFamille.code).then((r) => r.data),
  enabled: !!selectedFamille?.code,
});



const stockProducts = (preCreationData?.produits || [])
  .filter((p) => !p.nom?.toLowerCase().includes("lait"))
  .map((p) => ({
    id: p.id,
    icon: iconByNom[p.nom] || DEFAULT_STOCK_ICON,
    title: p.nom,
    quantity: Number(p.stock),
    unit: p.unite === "boite" ? "boîtes" : p.unite === "kg" ? "kg" : p.unite,
  }));


  // Grammages disponibles pour le type de lait actuellement sélectionné
  const laitOptions = preCreationData?.lait?.[laitType] || [];

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
  const currentPayload = {
    produits: produitsPayload,
    date_distribution: payload.date_distribution,
    reception_confirmee: payload.reception_confirmee,
  };

  const patch = diffPatch(baselineRef.current, currentPayload);

  if (
    "produits" in patch &&
    areProduitsEqual(baselineRef.current.produits, currentPayload.produits)
  ) {
    delete patch.produits;
  }

  if (isEmptyPatch(patch)) {
    setSaveError("Aucune modification à enregistrer.");
    setSaving(false);
    return;
  }

  await updateDistribution(distributionAModifier.id, patch);

} else {
  await createDistribution(payload);
}

setShowSuccessPopup(true);
    } catch (error) {
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
    if (!selectedFamille) {
      setErrors((prev) => ({ ...prev, famille: true }));
      return;
    }
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

   const [openFamilles, setOpenFamilles] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);

  const {
  data: famillesData,
  isLoading: famillesLoading,
  isError: famillesError,
  refetch: refetchFamilles,
} = useQuery({
  queryKey: ["familles-popup"],
  queryFn: () => listFamilles().then((r) => r.data),
  enabled: openFamilles,
});

const famillesBrutes = famillesData?.results ?? famillesData ?? [];



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
              label="Choisir la famille concerne"
              description="Cliquer pour rechercher la famille concerne par la distribution"
              onAction={handleSearch}
            />
            <ErrorMessage
              message={errors.famille ? "Veuillez sélectionner une famille" : null}
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
    preCreationLoading
      ? "Chargement..."
      : preCreationData?.date_derniere_distribution
        ? preCreationData.date_derniere_distribution
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
              optionsLoading={preCreationLoading}
              selectedOption={selectedLaitOption}
              onSelectOption={handleSelectLaitOption}
              showPopup={showLaitPopup}
              onOpenPopup={handleOpenLaitPopup}
              onClosePopup={() => setShowLaitPopup(false)}
              boxes={boxes}
              onIncrement={handleIncrementBoxes}
              onDecrement={handleDecrementBoxes}
              errors={errors}
              hasFamille={!!selectedFamille}
              onRequireFamille={() => setErrors((prev) => ({ ...prev, famille: true }))}
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
  if (!selectedFamille) {
    setErrors((prev) => ({ ...prev, famille: true }));
    return;
  }
  if (!preCreationLoading) setShowStockPopup(true);
}}
    onUpdateQuantity={handleUpdateQuantity}
    onRemoveProduct={handleRemoveProduct}
    errors={errors.produits}
  />
  {preCreationError && (
  <p className="text-red-500 text-sm mt-1">Impossible de charger le stock disponible.</p>
)}
             <ErrorMessage
    message={
      errors.famille
        ? "Veuillez d'abord choisir une famille"
        : errors.distribution
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
              isEditMode
                ? "Distribution modifiée avec succès"
                : "Distribution enregistrée avec succès"
            }
            image={SuccessImage}
            primaryButtonText="Voir la fiche famille"
            secondaryButtonText="Revenir à l'accueil"
            onPrimaryClick={() => {
              setShowSuccessPopup(false);
              navigate(`/famille/${selectedFamille?.id}`);
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

     <PopupListeFamilles
  open={openFamilles}
  onClose={() => setOpenFamilles(false)}
  familles={listeDesFamilles}
  loading={famillesLoading}
  error={famillesError}
  onRetry={refetchFamilles}
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
