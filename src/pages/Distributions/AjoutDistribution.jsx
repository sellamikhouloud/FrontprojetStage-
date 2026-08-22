import Sidebar from "../../components/Sidebar/Sidebar";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
import { useAuth } from "../../components/providers/AuthProvider";
import Card from "../../components/Cards/Card";
import CardPopup from "../../components/Cards/Card2";
import OptionsMenu from "../../components/Containers/OptionsMenu";
import SelectorWithAction from "../../components/Forms/SelectorWithAction";
import LaitInfantile from "../../components/Distribution/LaitInfantile";

import ColisAlimentaire from "../../components/Distribution/ColisAlimentaire";
import { useState } from "react";

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

import Popup from "../../components/Popups/SuccessPopup";
import SuccessImage from "../../assets/Success.svg";
import { useLocation } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { listProduits } from "@/lib/api/stock";

import { listFamilles } from "@/lib/api/familles";
import { createDistribution, getPreCreationDistribution } from "@/lib/api/distributions";



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

  // Produits classiques disponibles — chargés seulement une fois la famille choisie
  const {
    data: produitsResponse,
    isLoading: produitsLoading,
    isError: produitsError,
  } = useQuery({
    queryKey: ["produits-list", selectedFamille?.code],
    queryFn: () => listProduits().then((r) => r.data),
    enabled: !!selectedFamille?.code,
  });

  const stockProducts = (produitsResponse?.results || [])
    .filter((p) => p.validee && p.type_produit !== "lait" && !p.nom?.toLowerCase().includes("lait"))
    .map((p) => ({
      id: p.id,
      icon: iconByNom[p.nom] || DEFAULT_STOCK_ICON,
      title: p.nom,
      quantity: Number(p.stock_courant),
      unit: p.unite === "boite" ? "boîtes" : p.unite === "kg" ? "kg" : p.unite,
    }));

  const [products, setProducts] = useState(withDefaultIcon(source?.products));
const [date, setDate] = useState(
  source?.date ? parseDateFR(source.date) || new Date() : new Date()
);
  const [confirmed, setConfirmed] = useState(source?.confirmed || false);

  // --- Lait infantile ---
  // type : "1er_age" | "2eme_age"
  // selectedLaitOption : { id, grammage, nb_boites } correspondant au grammage choisi
  const [laitType, setLaitType] = useState(source?.laitType || null);
  const [selectedLaitOption, setSelectedLaitOption] = useState(source?.selectedLaitOption || null);
  const [showLaitPopup, setShowLaitPopup] = useState(false);
  const [boxes, setBoxes] = useState(source?.boxes ?? 0);

  // Pré-création : donne le détail des grammages dispo (avec nb_boites) par type de lait
  const {
    data: preCreationData,
    isFetching: preCreationLoading,
  } = useQuery({
    queryKey: ["distribution-pre-creation", selectedFamille?.code],
    queryFn: () => getPreCreationDistribution(selectedFamille.code).then((r) => r.data),
    enabled: !!selectedFamille?.code,
  });

  // Grammages disponibles pour le type de lait actuellement sélectionné
  const laitOptions = preCreationData?.lait?.[laitType] || [];

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

    if (!data) {
      return error.message || "Une erreur est survenue lors de l'enregistrement de la distribution.";
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

    return "Une erreur est survenue lors de l'enregistrement de la distribution.";
  };

  try {
    if (isEditMode) {
      // TODO: appel API réel — PUT /distributions/:id (à faire plus tard)
      console.log("Modification distribution", distributionAModifier.id, payload);
    } else {
      await createDistribution(payload);
    }

    setShowSuccessPopup(true);
  } catch (error) {
    console.error(
      "❌ Erreur lors de la création de la distribution :",
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
      <Sidebar role={role} />

      <main className="relative flex-1 min-h-0 overflow-hidden bg-white">
       

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

        {/* Main content */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-4">
            {selectedFamille && (
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
  {saveError && <ErrorMessage message={saveError} />}
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
