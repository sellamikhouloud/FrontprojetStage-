import { useEffect, useState } from "react";

import ContainerEcriture from "./ContainerEcriture";
import Button from "./Button";
import ImagePreview from "./ImagePreview";
import PopupPhoto from "./PopupPhoto";

import quitter from "../assets/quitter.svg";
import Supprimer from "../assets/Delete.svg";
import Verified from "../assets/Verified.svg";

const ModifierPhoto = ({
  photo,
  onClose = () => {},
  onSave = () => {},
  onDelete = () => {},
}) => {
  const [titre, setTitre] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [showPopupPhoto, setShowPopupPhoto] = useState(false);

  // Fill the form when a photo is received
  useEffect(() => {
    if (!photo) return;
    
    setTitre(photo.titre || "");
    setDate(photo.date || "");
    setDescription(photo.description || "");
    setImage(photo.image || "");
  }, [photo]);

  const handleImageSelected = (file) => {
    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
  };

  const handleSave = () => {
    onSave({
      ...photo,
      titre,
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
        {/* LEFT */}
        <div
          className="
            w-[420px]
            h-full
            flex
            flex-col
            p-6
          "
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="
              flex items-center gap-[10px]
              text-[16px]
              font-medium
              mb-6
            "
          >
            <img
              src={quitter}
              alt=""
              className="w-5 h-5"
            />
            Fermer
          </button>

          {/* Title */}
          <ContainerEcriture
            noPadding
            variant="dashed"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
          />

          {/* Date */}
          <ContainerEcriture
            noPadding
            variant="dashed"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          {/* Description */}
          <ContainerEcriture
            noPadding
            variant="dashed"
            multiline
            rows={4}
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          {/* Buttons */}
          <div>
            <Button
              noPadding
              title="Appliquer les modifications"
              variant="modifier"
              onClick={handleSave}
            />

            <Button
              noPadding
              title="Supprimer"
              variant="supprimer"
              icon={Supprimer}
              onClick={() => onDelete(photo)}
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 h-full">
            <ImagePreview
              image={image}
              buttonTitle="Validée"
              buttonIcon={Verified}
              buttonVariant="changer"
            />
        </div>
      </div>
    </>
  );
};

export default ModifierPhoto;