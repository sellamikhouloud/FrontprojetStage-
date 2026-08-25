import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar/Sidebar";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
import Input from "../../components/Containers/ContainerEcriture";
import ChoiceContainer from "../../components/Containers/ChoiceContainer";
import Button from "../../components/Button/Button";
import DateContainer from "../../components/Containers/DateContainer";
import ErrorMessage from "../../components/Forms/ErrorMessage";
import BackendErrorMessage from "../../components/Forms/BackendErrorMessage";

import Donateur from "../../assets/images/Donateur.svg";

import Popup from "../../components/Popups/SuccessPopup";
import SuccessImage from "../../assets/Success.svg";

import { createDonateur } from "../../lib/api/donateurs";

const KNOWN_FIELDS = ["nom", "prenom", "email", "date_adhesion", "is_active"];

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

// --- Helpers date ---
const isFutureDate = (date) => {
  if (!date) return false;

  const selected = new Date(date);
  selected.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selected > today;
};

// DateContainer envoie soit un objet Date, soit une string ISO "YYYY-MM-DD"
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

// Retourne la date du jour au format "YYYY-MM-DD" (même format que DateContainer)
const todayISO = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function AjoutDonateur() {
  const navigate = useNavigate();

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [createdDonateurId, setCreatedDonateurId] = useState(null);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [dateAdhesion, setDateAdhesion] = useState(todayISO); 
  const [statut, setStatut] = useState("Active");

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [backendError, setBackendError] = useState(null);

  const clearError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const handleDateChange = (value) => {
    setDateAdhesion(value);
    clearError("date_adhesion");

    const parsed = normalizeDate(value);
    if (parsed && isFutureDate(parsed)) {
      setErrors((prev) => ({
        ...prev,
        date_adhesion: "La date d'adhésion ne peut pas être dans le futur",
      }));
    }
  };

  const handleSave = async () => {
    const newErrors = {};

    if (!nom.trim()) newErrors.nom = "Veuillez saisir le nom";
    if (!prenom.trim()) newErrors.prenom = "Veuillez saisir le prénom";
    if (!email.trim()) newErrors.email = "Veuillez saisir l'email";

    const parsedDate = normalizeDate(dateAdhesion);

    if (!dateAdhesion || !parsedDate) {
      newErrors.date_adhesion = "Veuillez choisir une date d'adhésion valide";
    } else if (isFutureDate(parsedDate)) {
      newErrors.date_adhesion = "La date d'adhésion ne peut pas être dans le futur";
    }

    setErrors(newErrors);
    setBackendError(null);

    if (Object.keys(newErrors).length > 0) return;

    setSaving(true);
    setSaveError(null);

    try {
      const payload = {
        nom,
        prenom,
        email,
        date_adhesion: dateAdhesion, 
        is_active: statut === "Active",
      };

      const response = await createDonateur(payload);

      setCreatedDonateurId(response.data.id);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error(
        "❌ Erreur lors de la création du donateur :",
        error.response?.data || error.message
      );

      const { fieldErrors, generalMessage } = parseBackendErrors(error.response?.data);

      if (Object.keys(fieldErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      }

      if (generalMessage) {
        setBackendError(generalMessage);
      } else if (Object.keys(fieldErrors).length === 0) {
        setSaveError("Une erreur est survenue lors de la création du donateur.");
      }
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
            onBack={() => window.history.back()}
          />

          <h1
            className="
              text-[20px]
              lg:text-[24px]
              font-bold
              text-black
              text-center
            "
          >
            Nouveau Donateur
          </h1>

          <BackendErrorMessage message={backendError || saveError} className="mt-2" />

          {/* Illustration */}
          <div className="flex justify-center">
            <img
              src={Donateur}
              alt="Donateur"
              className="
                w-[120px]
                h-[120px]
                lg:w-[160px]
                lg:h-[160px]
              "
            />
          </div>

          <div className="flex flex-col gap-1">
            <Input
              label="Nom"
              placeholder="Entrez le nom ici"
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
            <Input
              label="Prénom"
              placeholder="Entrez le prénom ici"
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
            <Input
              label="Email"
              placeholder="Entrez l'email ici"
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
              onChange={handleDateChange}
              noPadding
            />
            <ErrorMessage message={errors.date_adhesion} />
          </div>

          <ChoiceContainer
            label="Statut"
            placeholder="Choisir le statut"
            value={statut}
            onChange={setStatut}
            options={["Active", "Inactive"]}
            noPadding
          />

          {/* Button */}
          <div className="flex flex-col gap-0">
            <Button
              title={saving ? "Enregistrement..." : "Enregistrer"}
              variant="primary"
              noPadding
              onClick={handleSave}
              disabled={saving}
            />
          </div>

          {showSuccessPopup && (
            <Popup
              title="Enregistrer avec succès"
              image={SuccessImage}
              id={createdDonateurId}
              primaryButtonText="Voir le profil du donateur"
              secondaryButtonText="Revenir à l'accueil"
              onPrimaryClick={() => {
                setShowSuccessPopup(false);
                navigate(`/fiche-donateur/${createdDonateurId}`);
              }}
              onSecondaryClick={() => {
                setShowSuccessPopup(false);
                navigate("/dashboard");
              }}
            />
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
