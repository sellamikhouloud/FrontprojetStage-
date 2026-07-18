import { useState } from "react";

import AlertBox from "../AlertComposant/AlertBox";
import ContainerEcriture from "./ContainerEcriture";
import ChoiceContainer from "./ChoiceContainer";
import DateContainer from "./DateContainer";
import Button from "../Button";
import ImagePreview from "../ImagePreview";
import PopupPhoto from "./PopupPhoto";

import quitter from "../assets/quitter.svg";
import testImage from "../assets/icon.svg";
import GreenCamera from "../assets/GreenCamera.svg";

const AjouterPhoto = ({ onClose = () => {} }) => {
  const villages = [
    "Danguérémou (Chiteybeu)",
    "Niéléba (Awoycheu)",
    "Sélibaby",
    "Hassi Chaggar",
    "Diaguily",
    "Badiam",
    "Ajar",
  ];

  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [village, setVillage] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(testImage);
  const [showPopupPhoto, setShowPopupPhoto] = useState(false);

  const handleImageSelected = (file) => {
    setImage(URL.createObjectURL(file));
  };

  const handleSave = () => {
    console.log({
      titre,
      village,
      date,
      description,
      image,
    });
  };

  return (
    <>
      <div
        className="
          w-[900px]
          h-[580px]
          bg-white
          rounded-[20px]
          shadow-xl
          flex
          overflow-hidden
        "
      >
        {/* LEFT SIDE */}
        <div
          className="
            w-[420px]
            h-full
            flex
            flex-col
            p-6
          "
        >
          {/* Fermer */}
          <button
            onClick={onClose}
            className="
              flex
              items-center
              gap-[10px]
              text-[16px]
              font-medium
              mb-2
            "
          >
            <img
              src={quitter}
              alt="Fermer"
              className="w-5 h-5"
            />

            Fermer
          </button>

          {/* Alert */}
          <div className="mb-5">
            <AlertBox
              variant="success"
              message="Aucune photo de nourrisson. Les photos illustrent le programme dans sa globalité et jamais un bénéficiaire identifiable."
            />
          </div>

          {/* Form */}
          <ContainerEcriture
            noPadding
            label="Titre de la photo"
            placeholder="Entrer le titre"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
          />

          <ChoiceContainer
            noPadding
            label="Village"
            placeholder="Choisir un village"
            options={villages}
            value={village}
            onChange={setVillage}
          />

          <DateContainer
            noPadding
            label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <ContainerEcriture
            noPadding
            label="Description"
            placeholder="Entrer une description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Save */}
          <div className="mt-auto pt-5">
            <Button
              noPadding
              title="Enregistrer"
              variant="primary"
              onClick={handleSave}
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 h-full">
          <ImagePreview
            image={image}
            buttonTitle="Changer"
            buttonIcon={GreenCamera}
            buttonVariant="changer"
            onButtonClick={() => setShowPopupPhoto(true)}
          />
        </div>
      </div>

      {/* Popup */}
      {showPopupPhoto && (
        <PopupPhoto
          title="Changer la photo"
          onClose={() => setShowPopupPhoto(false)}
          onImageSelected={handleImageSelected}
        />
      )}
    </>
  );
};

export default AjouterPhoto;