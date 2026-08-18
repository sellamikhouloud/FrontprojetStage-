import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";

import Sidebar from "../../components/Sidebar/Sidebar";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
import Input from "../../components/Containers/ContainerEcriture";
import ChoiceContainer from "../../components/Containers/ChoiceContainer";
import SelectInput2 from "../../components/Containers/ChoiceContainer2";
import Button from "../../components/Button/Button";
import ErrorMessage from "../../components/Forms/ErrorMessage";

import Coordinator from "../../assets/images/Coordinator.svg";
import { AiOutlineInfoCircle } from "react-icons/ai";

import Popup from "../../components/Popups/SuccessPopup";
import SuccessImage from "../../assets/Success.svg";

import { createUser } from "../../lib/api/coordinateurs";
import { listVillages } from "../../lib/api/Parametres";

export default function AjoutCoordinateur() {
  const navigate = useNavigate();
  const [createdCoordinatorId, setCreatedCoordinatorId] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [username, setUsername] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [statut, setStatut] = useState("Active");
  const [village, setVillage] = useState("");

  const [errors, setErrors] = useState({});

  const [emailSent, setEmailSent] = useState(false);
  const [showError, setShowError] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Liste réelle des villages (même source que InformationMere.jsx / FamiliesPage.jsx)
  const {
    data: villagesData,
    isLoading: villagesLoading,
    isError: villagesError,
  } = useQuery({
    queryKey: ["villages"],
    queryFn: () => listVillages().then((r) => r.data),
  });

  const villages = villagesData?.results ?? villagesData ?? [];

  const villageOptions = villages.map((v) => ({
    label: v.nom,
    value: v.id,
  }));

  const clearError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const handleSendEmail = () => {
    // API ici plus tard
    setEmailSent(true);
    setShowError(false);
  };

  const handleSave = async () => {
    if (!emailSent) {
      setShowError(true);
      return;
    }

    setShowError(false);

    const newErrors = {};

    if (!username.trim()) newErrors.username = "Veuillez saisir un nom d'utilisateur";
    if (!nom.trim()) newErrors.nom = "Veuillez saisir le nom";
    if (!prenom.trim()) newErrors.prenom = "Veuillez saisir le prénom";
    if (!email.trim()) newErrors.email = "Veuillez saisir l'email";
    if (!password) newErrors.password = "Veuillez saisir un mot de passe";
    if (!village) newErrors.village = "Veuillez choisir un village";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSaving(true);
    setSaveError(null);

    try {
      const payload = {
        username,
        email,
        nom,
        prenom,
        role: "coordinator", // cette page ne crée que des coordinateurs (maybe we will add chef coordinator for the ad;in after )
        is_active: statut === "Active",
        village,
        password,
      };

      console.log("📦 Payload création coordinateur :", payload);

      const response = await createUser(payload);

      console.log("✅ Coordinateur créé :", response.data);

      setCreatedCoordinatorId(response.data.id); 

      setShowSuccessPopup(true);
    } catch (error) {
      const backendErrors = error.response?.data;

      console.error(
        "❌ Erreur lors de la création du coordinateur :",
        backendErrors || error.message
      );

      if (backendErrors && typeof backendErrors === "object") {
        // DRF renvoie généralement { champ: ["message1", "message2"] }
        // On affiche chaque erreur sous le champ concerné plutôt qu'un
        // message générique.
        const fieldErrors = {};

        Object.entries(backendErrors).forEach(([field, messages]) => {
          fieldErrors[field] = Array.isArray(messages)
            ? messages.join(" ")
            : String(messages);
        });

        setErrors((prev) => ({ ...prev, ...fieldErrors }));

        // Si le backend a renvoyé un detail global (ex: erreur serveur),
        // on le garde aussi comme message général
        if (backendErrors.detail) {
          setSaveError(backendErrors.detail);
        }
      } else {
        setSaveError(
          "Une erreur est survenue lors de la création du coordinateur."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      
        <Sidebar role="admin" />
      

      {/* Contenu */}
      <main
        className="
          flex-1
          overflow-y-auto
          px-5
          pt-5
          pb-8
          lg:p-10
          bg-white
        "
      >
        <div className="flex flex-col gap-[14px] lg:gap-[18px]">

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
            Nouveau Coordinateur
          </h1>

          {/* Photo */}
          <div className="flex justify-center">
            <img
              src={Coordinator}
              alt="Coordinateur"
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
              label="Nom d'utilisateur"
              placeholder="Entrez le nom d'utilisateur ici"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                clearError("username");
              }}
              noPadding
            />
            <ErrorMessage message={errors.username} />
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

          {/* Mot de passe — champ local avec bascule œil affiché/masqué,
              même logique que Login.jsx (icône Eye = visible, EyeOff = masqué) */}
          <div className="flex flex-col gap-1">
            <label className="text-[14px] lg:text-[16px] font-semibold text-black">
              Mot de passe
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Entrez le mot de passe"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError("password");
                }}
                className="
                  w-full
                  h-[45px]
                  rounded-[15px]
                  border
                  border-[#4E9F8A]
                  bg-white
                  px-4
                  pr-10
                  text-[14px]
                  sm:text-[15px]
                  lg:text-[16px]
                  text-black
                  placeholder:text-gray-400
                  focus:outline-none
                "
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                "
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            <ErrorMessage message={errors.password} />
          </div>

          <div className="flex flex-col gap-1">
            <SelectInput2
              label="Village"
              placeholder={
                villagesLoading
                  ? "Chargement des villages..."
                  : "Tapez pour choisir le village"
              }
              options={villageOptions}
              value={village}
              onChange={(selected) => {
                setVillage(selected.value);
                clearError("village");
              }}
              noPadding
            />
            <ErrorMessage message={errors.village} />
            {villagesError && (
              <ErrorMessage message="Impossible de charger la liste des villages." />
            )}
          </div>

          <ChoiceContainer
            label="Statut"
            placeholder="Choisir le statut"
            value={statut}
            onChange={setStatut}
            options={["Active", "Inactive"]}
            noPadding
          />

         {/* Boutons */}
<div className="flex flex-col gap-[0px]">
  <Button
    title={
      emailSent
        ? "Email envoyé avec succès"
        : "Partager un mail du mot de passe au coordinateur"
    }
   variant={emailSent ? "success" : "email"}
    noPadding
    onClick={handleSendEmail}
  />

  <Button
    title={saving ? "Enregistrement..." : "Enregistrer"}
    variant="primary"
    noPadding
    onClick={handleSave}
    disabled={saving}
  />
  
{/* Message d'erreur */}
{showError && (
  <div className="mt-4 flex items-center justify-center gap-2 text-[#EF4444]">
    <AiOutlineInfoCircle className="text-[20px] shrink-0" />
    <p className="text-sm font-bold">
      Veuillez envoyer le mail au coordinateur avant de confirmer.
    </p>
  </div>
)}
{saveError && <ErrorMessage message={saveError} />}
</div>
{showSuccessPopup && (
  <Popup
    title="Enregistrer avec succès"
    image={SuccessImage}
    id={createdCoordinatorId}
    primaryButtonText="Voir le profil du coordinateur"
    secondaryButtonText="Revenir au tableau de bord"
    onPrimaryClick={() => {
      setShowSuccessPopup(false);
      navigate(`/fiche-coordinateur/${createdCoordinatorId}`);
    }}
    onSecondaryClick={() => {
      setShowSuccessPopup(false);
      navigate("/dashboard");
    }}
  />
)}


        </div>
      </main>
    </div>
  );
}
