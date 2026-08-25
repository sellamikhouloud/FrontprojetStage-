import { useEffect, useState } from "react";

import ContainerEcriture from "../Containers/ContainerEcriture";
import ChoiceContainer from "../Containers/ChoiceContainer";
import Button from "../Button/Button";
import ImagePreview from "../PhotoComposant/ImagePreview";

import quitter from "../../assets/quitter.svg";
import Pending from "../../assets/EnAttente.svg";
import Verified from "../../assets/Verified.svg";

import { updatePhoto, listVillages } from "@/lib/api/galerie";

const ModifierPhoto = ({
  photo,
  onClose = () => {},
  onSave = () => {},
}) => {
  // FORM STATE

  const [title, setTitle] = useState("");
  const [villageId, setVillageId] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  // VILLAGES

  const [villages, setVillages] = useState([]);
  const [loadingVillages, setLoadingVillages] = useState(false);
  const [villageError, setVillageError] = useState("");

  // SAVE / ERROR

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // INITIAL PHOTO DATA

  useEffect(() => {
    if (!photo) return;

    setTitle(photo.titre || photo.title || "");
    setDescription(photo.legende || photo.description || "");
    setDate(photo.date_prise || photo.date || "");
    setImage(photo.image || null);

    if (photo.village !== undefined && photo.village !== null) {
      setVillageId(String(photo.village));
    }
  }, [photo]);

  // LOAD VILLAGES

  useEffect(() => {
    const fetchVillages = async () => {
      try {
        setLoadingVillages(true);
        setVillageError("");

        const response = await listVillages();

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.results || [];

        setVillages(data);
      } catch (err) {
        console.error(
          "Erreur lors de la récupération des villages :",
          err
        );

        setVillageError("Impossible de récupérer les villages.");
      } finally {
        setLoadingVillages(false);
      }
    };

    fetchVillages();
  }, []);

  // SAVE

  const handleSave = async () => {
    if (!photo?.id) {
      setError("Impossible de modifier cette photo.");
      return;
    }

    if (!title.trim()) {
      setError("Veuillez entrer un titre.");
      return;
    }

    if (!villageId) {
      setError("Veuillez choisir un village.");
      return;
    }

    setError("");
    setIsSaving(true);

    try {

      const patch = {
        titre: title.trim(),
        legende: description.trim(),
        village: Number(villageId),
      };

      const response = await updatePhoto(photo.id, patch);
      const updatedPhoto = response.data;

      const resolvedVillageName =
        villages.find(
          (item) =>
            String(item.id) === String(updatedPhoto.village)
        )?.nom || "";

      onSave({
        ...photo,
        ...updatedPhoto,

        id: updatedPhoto.id ?? photo.id,

        title: updatedPhoto.titre ?? title,

        village: updatedPhoto.village ?? photo.village,

        villageName: resolvedVillageName,

        date: updatedPhoto.date_prise ?? date,

        description: updatedPhoto.legende ?? description,

        image: updatedPhoto.image ?? image,

        status: updatedPhoto.statut ?? photo.status,
      });

      onClose();
    } catch (err) {
      console.error(
        "Erreur lors de la modification de la photo :",
        err
      );

      if (err.response?.data) {
        const backendError = err.response.data;

        if (typeof backendError === "object") {
          const messages = Object.entries(backendError)
            .map(([field, value]) => {
              if (Array.isArray(value)) {
                return `${field}: ${value.join(", ")}`;
              }
              return `${field}: ${value}`;
            })
            .join("\n");

          setError(
            messages || "Une erreur est survenue lors de la modification."
          );
        } else {
          setError("Une erreur est survenue lors de la modification.");
        }
      } else {
        setError("Impossible de contacter le serveur.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="
        w-full
        max-h-screen
        overflow-y-auto

        lg:w-[900px]
        lg:h-[580px]
        lg:max-h-none
        lg:overflow-hidden

        bg-white

        lg:rounded-[20px]
        lg:shadow-xl

        flex
        flex-col
        lg:flex-row
      "
    >
      {/* ================= MOBILE HEADER ================= */}

      <div className="lg:hidden px-5 pt-5 pb-3">
        <button
          onClick={onClose}
          disabled={isSaving}
          className="
            flex
            items-center
            gap-2
            text-[15px]
            font-medium
            disabled:opacity-50
          "
        >
          <img src={quitter} alt="Fermer" className="w-4 h-4" />
          Fermer
        </button>
      </div>

      {/* ================= IMAGE ================= */}

      <div
        className="
          order-1
          lg:order-2

          w-full
          h-[320px]

          lg:flex-1
          lg:h-full

          flex-shrink-0
        "
      >
        <ImagePreview
          image={image}
          buttonTitle={
            photo?.status === "validated" ? "Validée" : "En attente"
          }
          buttonIcon={
            photo?.status === "validated" ? Verified : Pending
          }
          buttonVariant={
            photo?.status === "validated" ? "changer" : "EnAttente"
          }
        />
      </div>

      {/* ================= FORM ================= */}

      <div
        className="
          order-2
          lg:order-1

          w-full
          lg:w-[420px]

          flex
          flex-col

          px-5
          pt-8
          pb-5
          lg:p-6
        "
      >
        {/* Desktop Close */}

        <button
          onClick={onClose}
          disabled={isSaving}
          className="
            hidden
            lg:flex
            items-center
            gap-[10px]
            text-[16px]
            font-medium
            mb-6
            disabled:opacity-50
          "
        >
          <img src={quitter} alt="Fermer" className="w-5 h-5" />
          Fermer
        </button>

        {/* ================= ERROR ================= */}

        {error && (
          <div
            className="
              mb-4
              p-3
              rounded-lg
              bg-red-50
              border
              border-red-200
              text-red-700
              text-sm
              whitespace-pre-line
            "
          >
            {error}
          </div>
        )}

        {/* ================= VILLAGE ERROR ================= */}

        {villageError && (
          <div
            className="
              mb-4
              p-3
              rounded-lg
              bg-red-50
              border
              border-red-200
              text-red-700
              text-sm
            "
          >
            {villageError}
          </div>
        )}

        {/* ================= TITLE ================= */}

        <ContainerEcriture
          noPadding
          label="Titre"
          variant="dashed"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* ================= VILLAGE ================= */}
        
        <ChoiceContainer
          noPadding
          label="Village"
          placeholder={
            loadingVillages
              ? "Chargement des villages..."
              : "Choisir un village"
          }
          options={villages.map((villageItem) => villageItem.nom)}
          value={
            villages.find(
              (villageItem) =>
                String(villageItem.id) === String(villageId)
            )?.nom || ""
          }
          onChange={(selectedName) => {
            const selectedVillage = villages.find(
              (villageItem) => villageItem.nom === selectedName
            );

            setVillageId(
              selectedVillage
                ? String(selectedVillage.id)
                : ""
            );
          }}
        />

        {/* ================= DATE ================= */}

        <ContainerEcriture noPadding label="Date" value={date} readOnly />

        {/* ================= DESCRIPTION ================= */}

        <ContainerEcriture
          noPadding
          label="Légende"
          variant="dashed"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* ================= SAVE ================= */}

        <div className="mt-8 lg:mt-auto pt-5">
          <Button
            noPadding
            title={isSaving ? "Modification..." : "Appliquer les modifications"}
            variant="modifier"
            onClick={handleSave}
          />
        </div>
      </div>
    </div>
  );
};

export default ModifierPhoto;