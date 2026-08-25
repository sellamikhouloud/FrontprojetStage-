import { useEffect, useState } from "react";

import AlertBox from "../AlertComposant/AlertBox";
import ContainerEcriture from "../Containers/ContainerEcriture";
import ChoiceContainer from "../Containers/ChoiceContainer";
import Button from "../Button/Button";
import ImagePreview from "../PhotoComposant/ImagePreview";

import quitter from "../../assets/quitter.svg";
import testImage from "../../assets/Icon.svg";
import EnAttente from "../../assets/EnAttente.svg";

import { createPhoto, listVillages } from "../../lib/api/galerie";

const AjouterPhoto = ({
  initialImage,
  initialImageFile,
  onClose = () => {},
  onSave = () => {},
}) => {
  // VILLAGES

  const [villages, setVillages] = useState([]);
  const [loadingVillages, setLoadingVillages] = useState(true);
  const [villageError, setVillageError] = useState("");

  // FORM STATE

  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [village, setVillage] = useState("");
  const [date, setDate] = useState(null);

  // IMAGE

  const [image, setImage] = useState(
    initialImage || testImage
  );

  const [imageFile, setImageFile] = useState(
    initialImageFile || null
  );

  // LOADING / ERROR

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // GET VILLAGES

  useEffect(() => {
    const fetchVillages = async () => {
      try {
        setLoadingVillages(true);
        setVillageError("");

        const response = await listVillages();

        setVillages(response.data);

      } catch (err) {
        console.error(
          "Erreur lors de la récupération des villages :",
          err
        );

        setVillageError(
          "Impossible de récupérer les villages."
        );

      } finally {
        setLoadingVillages(false);
      }
    };

    fetchVillages();
  }, []);

  // INITIAL IMAGE / FILE

  useEffect(() => {
    if (initialImage) {
      setImage(initialImage);
    }

    if (initialImageFile) {
      setImageFile(initialImageFile);
    }
  }, [initialImage, initialImageFile]);

  // SAVE

  const handleSave = async () => {
    setError("");

    // VALIDATION

    if (!titre.trim()) {
      setError("Veuillez entrer un titre.");
      return;
    }

    if (!village) {
      setError("Veuillez choisir un village.");
      return;
    }

    if (!imageFile) {
      setError("Veuillez sélectionner une photo.");
      return;
    }

    // FORMDATA

    const formData = new FormData();

    formData.append(
      "titre",
      titre.trim()
    );

    formData.append(
      "legende",
      description.trim()
    );

    formData.append(
      "village",
      village
    );

    formData.append(
      "image",
      imageFile
    );

    try {
      setIsSaving(true);

      // API CALL

      const response = await createPhoto(formData);

      const createdPhoto = response.data;

      console.log(
        "Photo créée avec succès :",
        createdPhoto
      );

      // SEND RESULT TO PARENT

      onSave(createdPhoto);

      onClose();

    } catch (err) {
      console.error(
        "Erreur lors de l'ajout de la photo :",
        err
      );

      // ERROR MESSAGE

      if (err.response?.data) {
        const backendError = err.response.data;

        if (
          typeof backendError === "object"
        ) {
          const messages = Object.entries(
            backendError
          )
            .map(([field, value]) => {
              if (Array.isArray(value)) {
                return `${field}: ${value.join(", ")}`;
              }

              return `${field}: ${value}`;
            })
            .join("\n");

          setError(
            messages ||
              "Une erreur est survenue lors de l'ajout de la photo."
          );

        } else {
          setError(
            "Une erreur est survenue lors de l'ajout de la photo."
          );
        }

      } else {
        setError(
          "Impossible de contacter le serveur."
        );
      }

    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="
        w-full
        h-screen

        lg:w-[900px]
        lg:h-[580px]

        bg-white

        rounded-none
        lg:rounded-[20px]

        shadow-none
        lg:shadow-xl

        flex
        flex-col
        lg:flex-row

        overflow-y-auto
        lg:overflow-hidden
      "
    >

      {/* ======================================
          IMAGE
      ====================================== */}

      <div
        className="
          order-1
          lg:order-2

          w-full
          lg:flex-1

          h-[280px]
          lg:h-full

          shrink-0
        "
      >
        <ImagePreview
          image={image}
          buttonTitle="En attente"
          buttonIcon={EnAttente}
          buttonVariant="EnAttente"
        />
      </div>

      {/* ======================================
          FORM
      ====================================== */}

      <div
        className="
          order-2
          lg:order-1

          w-full
          lg:w-[420px]

          flex
          flex-col

          p-5
          lg:p-6

          flex-1
        "
      >

        {/* ====================================
            CLOSE
        ==================================== */}

        <button
          onClick={onClose}
          disabled={isSaving}
          className="
            flex
            items-center
            gap-2

            text-[15px]
            lg:text-[16px]

            font-medium

            mb-4
            lg:mb-5

            disabled:opacity-50
          "
        >
          <img
            src={quitter}
            alt="Fermer"
            className="w-5 h-5"
          />

          Fermer
        </button>

        {/* ====================================
            ALERT
        ==================================== */}

        <div className="mb-5">
          <AlertBox
            variant="success"
            message="
              Aucune photo de nourrisson. Les photos
              illustrent le programme dans sa globalité
              et jamais un bénéficiaire identifiable.
            "
          />
        </div>

        {/* ====================================
            ERROR
        ==================================== */}

        {error && (
          <div
            className="
              mb-5
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

        {/* ====================================
            VILLAGE ERROR
        ==================================== */}

        {villageError && (
          <div
            className="
              mb-5
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

        {/* ====================================
            TITLE
        ==================================== */}

        <ContainerEcriture
          noPadding
          label="Titre de la photo"
          placeholder="Entrer le titre"
          value={titre}
          onChange={(e) =>
            setTitre(e.target.value)
          }
        />

        {/* ====================================
            VILLAGE
        ==================================== */}

        <ChoiceContainer
          noPadding
          label="Village"
          placeholder={
            loadingVillages
              ? "Chargement des villages..."
              : "Choisir un village"
          }

          options={villages.map(
            (villageItem) =>
              villageItem.nom
          )}

          value={
            villages.find(
              (villageItem) =>
                String(villageItem.id) ===
                String(village)
            )?.nom || ""
          }

          onChange={(selectedName) => {
            const selectedVillage =
              villages.find(
                (villageItem) =>
                  villageItem.nom ===
                  selectedName
              );

            setVillage(
              selectedVillage
                ? String(selectedVillage.id)
                : ""
            );
          }}
        />

        {/* ====================================
            DESCRIPTION
        ==================================== */}

        <ContainerEcriture
          noPadding
          label="Description"
          placeholder="Entrer une description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        {/* ====================================
            SAVE
        ==================================== */}

        <div
          className="
            mt-8
            lg:mt-auto
            pt-5
          "
        >
          <Button
            noPadding
            title={
              isSaving
                ? "Enregistrement..."
                : "Enregistrer"
            }
            variant="primary"
            onClick={handleSave}
          />
        </div>

      </div>
    </div>
  );
};

export default AjouterPhoto;