import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Sidebar from "../../components/Sidebar/Sidebar";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
import Input from "../../components/Containers/ContainerEcriture";
import ContainerEcritureModifier from "../../components/Containers/ContainerEcritureModifier";
import ChoiceContainerModifier from "../../components/Containers/ChoiceContainerModifier";
import DateContainer from "../../components/Containers/DateContainer";
import Button from "../../components/Button/Button";
import SuccessBanner from "../../components/Popups/SuccessBanner";
import ErrorMessage from "../../components/Forms/ErrorMessage";
import BackendErrorMessage from "../../components/Forms/BackendErrorMessage";

import Donateur from "../../assets/images/Donateur.svg";

import { getDonateur, updateDonateur } from "../../lib/api/donateurs";
import { diffPatch, isEmptyPatch } from "@/lib/diff";

const KNOWN_FIELDS = ["nom", "prenom", "email", "date_adhesion"];

const isFutureDate = (date) => {
  if (!date) return false;

  const selected = new Date(date);
  selected.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selected > today;
};
const normalizeDate = (value) => {
  if (!value) return null;

  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "string") {
    const parsed = new Date(value.trim());
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
};

function parseBackendErrors(data) {
  if (!data) return { fieldErrors: {}, generalMessage: null };

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

export default function FicheDonateur() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [showBanner, setShowBanner] = useState(false);
  const [saving, setSaving] = useState(false);
  const [backendError, setBackendError] = useState(null);
  const [errors, setErrors] = useState({});

  const clearError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const {
    data: donateur,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["donateur", id],
    queryFn: () => getDonateur(id).then((r) => r.data),
    enabled: !!id,
  });

    const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [dateAdhesion, setDateAdhesion] = useState(null);
  const [statut, setStatut] = useState("Active");
  const [statutOriginal, setStatutOriginal] = useState("Active");
  const [dateCreation, setDateCreation] = useState(null);
  const [modifiePar, setModifiePar] = useState("");
  const [dateModification, setDateModification] = useState(null);


   useEffect(() => {
    if (!donateur) return;

    setNom(donateur.nom || "");
    setPrenom(donateur.prenom || "");
    setEmail(donateur.email || "");
    setDateAdhesion(donateur.date_adhesion ? new Date(donateur.date_adhesion) : null);

    const currentStatut = donateur.is_active ? "Active" : "Inactive";
    setStatut(currentStatut);
    setStatutOriginal(currentStatut);

    setDateCreation(donateur.date_creation ? new Date(donateur.date_creation) : null);
    setModifiePar(donateur.modifie_par || "/");
    setDateModification(donateur.date_modification ? new Date(donateur.date_modification) : null);
  }, [donateur]);

  const formatDate = (date) => {
  const d = normalizeDate(date);
  if (!d) return null;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

  const baseline = useMemo(() => {
    if (!donateur) return null;
    return {
      nom: donateur.nom || "",
      prenom: donateur.prenom || "",
      email: donateur.email || "",
      date_adhesion: donateur.date_adhesion ? formatDate(new Date(donateur.date_adhesion)) : "",
    };
  }, [donateur]);

  const current = useMemo(() => ({
    nom,
    prenom,
    email,
    date_adhesion: formatDate(dateAdhesion) || "",
  }), [nom, prenom, email, dateAdhesion]);

  const patch = useMemo(
    () => (baseline && current ? diffPatch(baseline, current) : {}),
    [baseline, current]
  );

  const nothingChanged = isEmptyPatch(patch) && statut === statutOriginal;

  const handleSave = async () => {
    const newErrors = {};

    if (!nom.trim()) newErrors.nom = "Veuillez saisir le nom";
    if (!prenom.trim()) newErrors.prenom = "Veuillez saisir le prénom";

    if (!email.trim()) {
      newErrors.email = "Veuillez saisir l'email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Format d'email invalide";
    }

    if (isFutureDate(dateAdhesion)) {
      newErrors.date_adhesion = "La date ne peut pas être une date future.";
    }

    setErrors(newErrors);
    setBackendError(null);

    if (Object.keys(newErrors).length > 0) return;

    if (nothingChanged) {
      setBackendError("Aucune modification à enregistrer.");
      return;
    }

    setSaving(true);

    try {


    const payload = {
     ...patch,
    };

    // Le statut est géré séparément ici
    if (statut !== statutOriginal) {
    payload.is_active = statut === "Active";
    }

      await updateDonateur(id, payload);

      setStatutOriginal(statut);

      setShowBanner(true);
      setTimeout(() => {
        navigate("/liste-Donateurs");
      }, 1500);
    } catch (err) {
      console.error(
        "Erreur lors de l'enregistrement :",
        err.response?.data || err.message
      );

      const { fieldErrors, generalMessage } = parseBackendErrors(err.response?.data);

      if (Object.keys(fieldErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      }

      setBackendError(generalMessage || "Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  return (
     <div className="flex h-screen bg-white overflow-hidden">
             
               <Sidebar />

     <main className="relative flex-1 min-h-0 overflow-hidden bg-white">

           {/* Espace blanc FIXE en haut — desktop only, mobile déjà géré par Sidebar */}
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

        <div className="flex flex-col gap-[14px] lg:gap-[16px]">
          <PageHeader
            leftTitle="Annuler"
            showRight={false}
            onBack={() => navigate(-1)}
          />

          <h1
            className="
              text-[20px]
              lg:text-[24px]
              font-bold
              text-center
            "
          >
            Fiche donateur
          </h1>

          <div className="flex justify-center">
            <img
              src={Donateur}
              alt="Donateur"
              className="
                w-[140px]
                h-[140px]
                lg:w-[200px]
                lg:h-[200px]
              "
            />
          </div>

          {isLoading && (
            <p className="text-center text-gray-500">Chargement...</p>
          )}

          {!isLoading && isError && (
            <BackendErrorMessage message="Impossible de charger les informations du donateur." />
          )}

       

          {!isLoading && !isError && donateur && (
            <>
              <div className="flex flex-col gap-1">
                <ContainerEcritureModifier
                  label="Nom"
                  value={nom}
                  onChange={(e) => {
                    setNom(e.target.value);
                    clearError("nom");
                  }}
                  noPadding
                />
                <ErrorMessage message={errors.nom} />
              </div>

              <div className="flex flex-col gap-1">
                <ContainerEcritureModifier
                  label="Prénom"
                  value={prenom}
                  onChange={(e) => {
                    setPrenom(e.target.value);
                    clearError("prenom");
                  }}
                  noPadding
                />
                <ErrorMessage message={errors.prenom} />
              </div>

              <div className="flex flex-col gap-1">
                <ContainerEcritureModifier
                  label="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError("email");
                  }}
                  noPadding
                />
                <ErrorMessage message={errors.email} />
              </div>

                           <div className="flex flex-col gap-1">
                <DateContainer
                  label="Date d'adhésion"
                  value={dateAdhesion}
                  onChange={(newDate) => {
                    const parsed = normalizeDate(newDate);
                    setDateAdhesion(parsed);
                    if (parsed && isFutureDate(parsed)) {
                      setErrors((prev) => ({
                        ...prev,
                        date_adhesion: "La date ne peut pas être une date future.",
                      }));
                    } else {
                      clearError("date_adhesion");
                    }
                  }}
                  noPadding
                />
                <ErrorMessage message={errors.date_adhesion} />
              </div>
                
            

              <Input label="Créé par" value={donateur.cree_par || "/"} disabled noPadding />

                <DateContainer
                label="Date de création"
                value={dateCreation}
                disabled
                readOnly
                noPadding
              />

               <Input label="Modifié par" value={modifiePar || "/"} disabled noPadding />

              <DateContainer
                label="Date de modification"
                value={dateModification}
                disabled
                readOnly
                noPadding
              />

              <ChoiceContainerModifier
                label="Statut"
                value={statut}
                onChange={(selected) => setStatut(selected.value)}
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                ]}
                noPadding
              />

              {showBanner && <SuccessBanner text="Enregistrer avec succès" />}
                 <BackendErrorMessage message={backendError} className="mt-2" />

              <Button
                title={saving ? "Enregistrement..." : "Sauvegarder les modifications"}
                variant="primary"
                noPadding
                onClick={handleSave}
                disabled={saving}
              />
            </>
          )}
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
