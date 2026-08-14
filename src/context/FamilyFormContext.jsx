import { createContext, useContext, useState } from "react";

const FamilyFormContext = createContext(null);

export function FamilyFormProvider({ children }) {
    
  const [formData, setFormData] = useState({
    mere: {},
    nourrisson: {},
    date_entree: null,
    statut: "active",
    date_sortie: null,
    motif_sortie: null,
    id_mere: null,
    coordinateur: null,
  });

  const updateMere = (data) => {
    setFormData((prev) => ({
      ...prev,
      mere: {
        ...prev.mere,
        ...data,
      },
    }));
  };

  const updateNourrisson = (data) => {
    setFormData((prev) => ({
      ...prev,
      nourrisson: {
        ...prev.nourrisson,
        ...data,
      },
    }));
  };

  const updateFamilyData = (data) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const resetFamilyForm = () => {
    setFormData({
      mere: {},
      nourrisson: {},
      date_entree: null,
      statut: "active",
      date_sortie: null,
      motif_sortie: null,
      id_mere: null,
      coordinateur: null,
    });
  };

  return (
    <FamilyFormContext.Provider
      value={{
        formData,
        updateMere,
        updateNourrisson,
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