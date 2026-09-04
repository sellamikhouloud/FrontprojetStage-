import { createContext, useContext, useState } from "react";

const FamilyFormContext = createContext(null);

export function FamilyFormProvider({ children }) {
  const [formData, setFormData] = useState({
    mere: {},
    nourrissons: [{}], // un objet par enfant — dimensionné selon mere.nb_enfants
    date_entree: null,
    statut: "active",
    date_sortie: null,
    motif_sortie: null,
    id_mere: null,
    coordinateur: null,
  // Rempli uniquement quand on édite un brouillon existant 
    sourceDraftClientId: null,
  });

  const updateMere = (data) => {
    setFormData((prev) => ({
      ...prev,
      mere: { ...prev.mere, ...data },
    }));
  };

 
  const updateNourrisson = (index, data) => {
    setFormData((prev) => {
      const nourrissons = [...prev.nourrissons];
      nourrissons[index] = { ...(nourrissons[index] || {}), ...data };
      return { ...prev, nourrissons };
    });
  };


  const setNourrissonsCount = (count) => {
    const safeCount = Math.max(1, Number(count) || 1);
    setFormData((prev) => {
      const current = prev.nourrissons || [];
      const next = Array.from({ length: safeCount }, (_, i) => current[i] || {});
      return { ...prev, nourrissons: next };
    });
  };

  const updateFamilyData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetFamilyForm = () => {
    setFormData({
      mere: {},
      nourrissons: [{}],
      date_entree: null,
      statut: "active",
      date_sortie: null,
      motif_sortie: null,
      id_mere: null,
      coordinateur: null,
      sourceDraftClientId: null,
    });
  };

  return (
    <FamilyFormContext.Provider
      value={{
        formData,
        updateMere,
        updateNourrisson,
        setNourrissonsCount,
        updateFamilyData,
        resetFamilyForm,
      }}
    >
      {children}
    </FamilyFormContext.Provider>
  );
}

export function useFamilyForm() {
  const context = useContext(FamilyFormContext);
  if (!context) {
    throw new Error(
      "useFamilyForm doit être utilisé à l'intérieur de FamilyFormProvider"
    );
  }
  return context;
}
