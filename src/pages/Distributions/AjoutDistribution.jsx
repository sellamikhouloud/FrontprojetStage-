import Sidebar from "../../components/Sidebar/Sidebar";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
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
import { createDistribution } from "@/lib/api/distributions";


// Utilitaire — parse une date au format "JJ/MM/AAAA" en objet Date valide
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



export default function AjoutDistribution() {

 const iconByNom = {
  "Céréales": Cereales,
  "Légumineuses": Legumineuses,
  "Huile alimentaire": Huile,
  "Huile": Huile,
  "Sucre": Sucre,
  "Sel": Sel,
  "Sel iodé": Sel,
};
const DEFAULT_STOCK_ICON = Sucre; // fallback si le nom n'est pas mappé

const {
  data: produitsResponse,
  isLoading: produitsLoading,
  isError: produitsError,
} = useQuery({
  queryKey: ["produits-list"],
  queryFn: () => listProduits().then((r) => r.data),
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
  // (ex: produit reconstitué depuis la page détail, icon: null)
  const DEFAULT_ICON = Sucre;

  const withDefaultIcon = (list) =>
    (list || []).map((p) => ({
      ...p,
      icon: p.icon || DEFAULT_ICON,
    }));

  const [selectedFamille, setSelectedFamille] = useState(source?.selectedFamille || null);
  const [products, setProducts] = useState(withDefaultIcon(source?.products));
const [date, setDate] = useState(
  source?.date ? parseDateFR(source.date) || new Date() : new Date()
);
  const [confirmed, setConfirmed] = useState(source?.confirmed || false);

  // Lait infantile - état remonté ici pour permettre la validation
  const [laitType, setLaitType] = useState(source?.laitType || null);
  const [grammage, setGrammage] = useState(source?.grammage || "");
  const [boxes, setBoxes] = useState(source?.boxes ?? 0);

  const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState({
    name: "",
    unit: "",
    quantity: "",
  });
  const [showStockPopup, setShowStockPopup] = useState(false);

  // --- ERROR HANDLING (meme principe que AjoutZakat) ---
  const [errors, setErrors] = useState({
    famille: false,
    laitType: false,
    grammage: false,
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

    const newErrors = {
      famille: !selectedFamille,
      laitType: boxes > 0 && !laitType,
      grammage: boxes > 0 && (!grammage || parseFloat(grammage) <= 0),
      confirmed: !confirmed,
      distribution: products.length === 0 && boxes === 0,
      produits: produitsErrors,
    };
    setErrors(newErrors);

    const hasFieldError = [
      newErrors.famille,
      newErrors.laitType,
      newErrors.grammage,
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

  const payload = {
    famille: selectedFamille?.code, // ex: "GDK-2026-003"
    reception_confirmee: confirmed,
    date_distribution: formatDateYYYYMMDD(date),
    produits: products.map((p) => ({
      produit: p.id,
      quantite: Number(p.quantity),
    })),
    // TODO: ajouter le produit lait ici plus tard
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
    setSaveError(
      error.response?.data?.detail ||
        "Une erreur est survenue lors de l'enregistrement de la distribution."
    );
  } finally {
    setSaving(false);
  }
};

  const handleLaitTypeChange = (value) => {
    setLaitType(value);
    setErrors((prev) => ({ ...prev, laitType: false }));
  };

  const handleGrammageChange = (raw) => {
    setGrammage(raw);
    if (raw && parseFloat(raw) > 0) {
      setErrors((prev) => ({ ...prev, grammage: false }));
    }
  };

  const handleConfirmedChange = (e) => {
    const isChecked = e.target.checked;
    setConfirmed(isChecked);
    if (isChecked) {
      setErrors((prev) => ({ ...prev, confirmed: false }));
    }
  };

  const handleDecrementBoxes = () => {
    setBoxes((v) => {
      const newValue = Math.max(0, v - 1);
      if (newValue === 0) {
        // Pas de boîte = pas besoin de type de lait ni de grammage
        setErrors((prev) => ({ ...prev, laitType: false, grammage: false }));
      }
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
          draft: { selectedFamille, products, date, confirmed, laitType, grammage, boxes },
          // Si on était déjà en mode modification, on garde le contexte au retour
          distributionAModifier: isEditMode ? distributionAModifier : undefined,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-white lg:flex">
      <div
        className="
          hidden
          lg:flex
          lg:sticky
          lg:top-0
          lg:h-screen
          lg:items-center
          lg:py-0
          lg:pl-0
          lg:shrink-0
        "
      >
        <Sidebar role="admin" />
      </div>

      {/* Mobile sidebar (hamburger) */}
      <div className="lg:hidden">
        <Sidebar role="admin" />
      </div>

      {/* Mobile fixed white header */}
      <div
        className="
          fixed
          top-0
          left-0
          right-0
          h-20
          bg-white
          z-40
          lg:hidden
        "
      />

      {/* Page content */}
      <main
        className="
          flex-1
          overflow-y-auto
          bg-white

          pt-20
          lg:pt-4

          px-4
          lg:px-10

          pb-8
          lg:pb-2
        "
      >
        {/* Header */}
        <div className="mb-3 lg:mb-6">
          <PageHeader
            leftTitle="Annuler"
            showRight={false}
            onBack={() => window.history.back()}
          />
        </div>

       

        {!selectedFamille && (
          <div className="flex flex-col gap-2">
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
              <InfoHeader title="Dernière distribution" value="15/05/2026" />
            )}

            {/* Date + Distribution number */}
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
                  ${selectedFamille ? "lg:grid-cols-2" : "lg:grid-cols-1"}
                  gap-3
                  lg:gap-2
                  items-end
                `}
              >
                <DateContainer value={date} onChange={setDate} noPadding />

                {selectedFamille && (
                  <div className="w-full">
                    <div
                      className="
                        h-[45px]
                        rounded-[15px]
                        border
                        border-[#4E9F8A]
                        bg-white
                        px-4
                        pr-12
                        flex
                        items-center
                      "
                    >
                      <p className="text-[14px] leading-[20px] text-[#374151]">
                        Distribution numéro 03
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Milk */}
            <LaitInfantile
              type={laitType}
              onTypeChange={handleLaitTypeChange}
              grammage={grammage}
              onGrammageChange={handleGrammageChange}
              boxes={boxes}
              onIncrement={() => {
                setBoxes((v) => v + 1);
                setErrors((prev) => ({ ...prev, distribution: false }));
              }}
              onDecrement={handleDecrementBoxes}
              errors={errors}
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
