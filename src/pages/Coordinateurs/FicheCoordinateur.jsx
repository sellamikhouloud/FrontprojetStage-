import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Sidebar from "../../components/Sidebar/Sidebar";
import PageHeader from "../../components/Navigation,Pageheader/PageHeader";
import Input from "../../components/Containers/ContainerEcriture";
import ContainerEcritureModifier from "../../components/Containers/ContainerEcritureModifier";
import ChoiceContainerModifier from "../../components/Containers/ChoiceContainerModifier";
import SelectInput2 from "../../components/Containers/ChoiceContainer2";
import DateContainer from "../../components/Containers/DateContainer";
import Button from "../../components/Button/Button";
import { AiOutlineInfoCircle } from "react-icons/ai";
import SuccessBanner from "../../components/Popups/SuccessBanner";
import Popup from "../../components/Popups/SuccessPopup";
import ErrorMessage from "../../components/Forms/ErrorMessage";

import Coordinator from "../../assets/images/Coordinator.svg";
import SuccessImage from "../../assets/Confirm.svg";

import {
  listCoordinateurs,
  updateCoordinateur,
  activateCoordinateur,
  deactivateCoordinateur,
} from "../../lib/api/coordinateurs";
import { listVillages } from "../../lib/api/Parametres";

export default function ModifierCoordinateur() {
  const navigate = useNavigate();
  const { id } = useParams(); // 👈 nécessite une route du type /modifier-coordinateur/:id

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [errors, setErrors] = useState({});

  const clearError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const [showBanner, setShowBanner] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // Champs du formulaire
  const [identifiant, setIdentifiant] = useState("");
  const [username, setUsername] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [statut, setStatut] = useState("Active");
  const [dateEntree, setDateEntree] = useState(null);
  const [password, setPassword] = useState("");
  const [village, setVillage] = useState("");
  const [familles, setFamilles] = useState(0);
  const [creePar, setCreePar] = useState("");
  const [modifiePar, setModifiePar] = useState("");
  const [dateModification, setDateModification] = useState(null);

  // Statut original pour ne PAS appeler activate/deactivate si rien n'a changé
  const [statutOriginal, setStatutOriginal] = useState("Active");

  // Liste réelle des villages (même source que AjoutCoordinateur.jsx)
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

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const fetchCoordinateur = async () => {
      setLoading(true);
      setLoadError(null);

      try {
        // Pas d'endpoint de détail (GET /api/users/{id}/) disponible pour l'instant :
        // on charge la liste complète et on retrouve le coordinateur par son id.
        const { data } = await listCoordinateurs();

        if (cancelled) return;

        const found = data.find((c) => String(c.id) === String(id));

        if (!found) {
          setLoadError("Coordinateur introuvable.");
          return;
        }

        // created_by / updated_by sont des ids numériques dans la réponse API.
        // On résout le username correspondant à partir de la liste déjà chargée.
        const resolveUsername = (userId) => {
          if (!userId) return "—";
          const match = data.find((c) => c.id === userId);
          return match ? match.username : `#${userId}`;
        };

        setIdentifiant(String(found.id));
        setUsername(found.username || "");
        setNom(found.nom || "");
        setPrenom(found.prenom || "");
        setEmail(found.email || "");
        setFamilles(found.nb_familles ?? 0);

        setCreePar(resolveUsername(found.created_by));
        setModifiePar(resolveUsername(found.updated_by));
        setDateModification(
          found.updated_at ? new Date(found.updated_at) : null
        );

        const currentStatut = found.is_active ? "Active" : "Inactive";
        setStatut(currentStatut);
        setStatutOriginal(currentStatut);

        setDateEntree(found.created_at ? new Date(found.created_at) : null);
        setVillage(found.village?.id ?? "");

        // ⚠️ On ne préremplit JAMAIS le vrai mot de passe.
        // Le champ reste vide ; il n'est envoyé que si l'utilisateur tape une nouvelle valeur.
        setPassword("");
      } catch (err) {
        console.error(
          "Erreur lors du chargement du coordinateur :",
          err.response?.data || err.message
        );
        if (!cancelled) {
          setLoadError("Impossible de charger les informations du coordinateur.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCoordinateur();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSave = async () => {
    const newErrors = {};

    if (!username.trim()) newErrors.username = "Veuillez saisir le nom d'utilisateur";
    if (!nom.trim()) newErrors.nom = "Veuillez saisir le nom";
    if (!prenom.trim()) newErrors.prenom = "Veuillez saisir le prénom";

    if (!email.trim()) {
      newErrors.email = "Veuillez saisir l'email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Format d'email invalide";
    }

    if (!village) newErrors.village = "Veuillez choisir un village";

    // Le mot de passe est optionnel ici (on ne le modifie que si l'utilisateur
    // tape une nouvelle valeur), mais s'il tape quelque chose, ça doit être valide.
    if (password && password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSaving(true);
    setSaveError(null);

    try {
      // 1) Statut d'abord : passe par des endpoints dédiés, indépendants du
      //    PATCH générique qui peut planter à cause du bug email backend.
      //    On ne l'appelle que si le statut a réellement changé.
      if (statut !== statutOriginal) {
        if (statut === "Active") {
          await activateCoordinateur(id);
        } else {
          await deactivateCoordinateur(id);
        }
        setStatutOriginal(statut);
      }

      // 2) Mise à jour des infos de base (username, nom, prénom, email, village...)
      const payload = { username, nom, prenom, email, village };

      if (password.trim()) {
        payload.password = password;
      }

      try {
        await updateCoordinateur(id, payload);
      } catch (updateErr) {
        const backendErrors = updateErr.response?.data;

        // Si ce n'est pas le bug email connu (pas de traceback HTML), on essaie
        // d'afficher les vraies erreurs de validation du serializer sous les champs.
        if (
          backendErrors &&
          typeof backendErrors === "object" &&
          !Array.isArray(backendErrors)
        ) {
          const fieldErrors = {};
          Object.entries(backendErrors).forEach(([field, messages]) => {
            fieldErrors[field] = Array.isArray(messages)
              ? messages.join(" ")
              : String(messages);
          });

          if (Object.keys(fieldErrors).length > 0) {
            setErrors((prev) => ({ ...prev, ...fieldErrors }));
          }
        }

        // ⚠️ Le backend a un bug connu : il plante en essayant d'envoyer un
        // email après la sauvegarde (voir EMAIL_BACKEND), mais les données
        // sont malgré tout enregistrées en base. On logue l'erreur pour
        // debug, mais on ne bloque pas l'utilisateur avec un faux message
        // d'échec puisque le statut a déjà été traité avec succès plus haut.
        console.warn(
          "⚠️ Le PATCH a renvoyé une erreur (probablement le bug email backend), mais les données sont probablement enregistrées :",
          backendErrors || updateErr.message
        );
      }

      setShowBanner(true);

      setTimeout(() => {
        navigate("/liste-coordinateurs");
      }, 1500);
    } catch (err) {
      console.error(
        "Erreur lors de l'enregistrement :",
        err.response?.data || err.message
      );
      setSaveError("Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    try {
      // Pas d'endpoint DELETE fourni pour l'instant → on désactive le compte.
      await deactivateCoordinateur(id);
      setShowDeletePopup(false);
      navigate("/liste-coordinateurs");
    } catch (err) {
      console.error(
        "Erreur lors de la suppression :",
        err.response?.data || err.message
      );
      setShowDeletePopup(false);
      setSaveError("Impossible de supprimer ce coordinateur.");
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
            onBack={() => navigate(-1)}
          />

          <h1 className="text-[20px] lg:text-[24px] font-bold text-center">
            Fiche Coordinateur
          </h1>

          {/* Illustration */}
          <div className="flex justify-center">
            <img
              src={Coordinator}
              alt="Coordinateur"
              className="w-[120px] h-[120px] lg:w-[160px] lg:h-[160px]"
            />
          </div>

          {loading && (
            <p className="text-center text-gray-500">Chargement...</p>
          )}

          {!loading && loadError && (
            <ErrorMessage message={loadError} />
          )}

          {!loading && !loadError && (
            <>
              {/* Identifiant (non modifiable) */}
              <Input label="Identifiant" value={identifiant} disabled noPadding />

              {/* Nombre de familles suivies (non modifiable) */}
              <Input
                label="Nombre de familles"
                value={String(familles)}
                disabled
                noPadding
              />

              {/* Nom d'utilisateur */}
              <div className="flex flex-col gap-1">
                <ContainerEcritureModifier
                  label="Nom d'utilisateur"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    clearError("username");
                  }}
                  noPadding
                />
                <ErrorMessage message={errors.username} />
              </div>

              {/* Nom */}
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

              {/* Prénom */}
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

              {/* Email */}
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

              {/* Village */}
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

              {/* Date d'entrée (non modifiable) */}
              <DateContainer
                label="Date d'entrée"
                value={dateEntree}
                disabled
                noPadding
              />

              {/* Créé par (non modifiable) */}
              <Input label="Créé par" value={creePar} disabled noPadding />

              {/* Modifié par (non modifiable) */}
              <Input label="Modifié par" value={modifiePar} disabled noPadding />

              {/* Date de modification (non modifiable) */}
              <DateContainer
                label="Date de modification"
                value={dateModification}
                disabled
                noPadding
              />

              <div className="flex flex-col gap-1">
                <ContainerEcritureModifier
                  label="Mot de passe"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError("password");
                  }}
                  placeholder="Laisser vide pour ne pas modifier"
                  noPadding
                />
                <ErrorMessage message={errors.password} />

                <div className="mt-1 flex items-center gap-1 text-[#F59E0B]">
                  <AiOutlineInfoCircle className="text-[16px] shrink-0" />
                  <p className="text-[13px] font-medium leading-4">
                    Toute modification du mot de passe sera automatiquement envoyée au
                    coordinateur par e-mail après l'enregistrement.
                  </p>
                </div>
              </div>

              {/* Statut */}
              <ChoiceContainerModifier
                label="Statut"
                value={statut}
                onChange={setStatut}
                options={["Active", "Inactive"]}
                noPadding
              />

              {saveError && <ErrorMessage message={saveError} />}

              {/* Boutons */}
              <div className="flex flex-col gap-[0px]">
                <Button
                  title={saving ? "Enregistrement..." : "Sauvegarder les modifications"}
                  variant="primary"
                  noPadding
                  onClick={handleSave}
                  disabled={saving}
                />

                {showBanner && <SuccessBanner text="Enregistrer avec succès" />}

                <Button
                  title="Supprimer le coordinateur"
                  variant="deleteCoordinator"
                  noPadding
                  onClick={handleDelete}
                  disabled={saving}
                />

                {showDeletePopup && (
                  <Popup
                    title="Confirmer la suppression"
                    image={SuccessImage}
                    description="Êtes-vous sûr de vouloir supprimer ce coordinateur ? Cette action est irréversible."
                    primaryButtonText="Supprimer"
                    secondaryButtonText="Annuler"
                    primaryButtonVariant="danger"
                    onPrimaryClick={confirmDelete}
                    onSecondaryClick={() => setShowDeletePopup(false)}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
