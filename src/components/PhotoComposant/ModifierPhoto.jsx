import { useEffect, useState } from "react";

import ContainerEcriture from "../Containers/ContainerEcriture";
import Button from "../Button/Button";
import ImagePreview from "../PhotoComposant/ImagePreview";
import PopupPhoto from "../Popups/PopupPhoto";

import quitter from "../../assets/quitter.svg";
import Supprimer from "../../assets/Delete.svg";
import GreenCamera from "../../assets/GreenCamera.svg";

const ModifierPhoto = ({
  photo,
  onClose = () => {},
  onSave = () => {},
  onDelete = () => {},
}) => {
  const [title, setTitle] = useState("");
  const [village, setVillage] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const [showPopupPhoto, setShowPopupPhoto] = useState(false);

  useEffect(() => {
    if (!photo) return;

    setTitle(photo.title || "");
    setVillage(photo.village || "");
    setDate(photo.date || "");
    setDescription(photo.description || "");
    setImage(photo.image || "");
  }, [photo]);

  const handleImageSelected = (file) => {
    setImage(URL.createObjectURL(file));
  };

  const handleSave = () => {
    onSave({
      ...photo,
      title,
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
    w-screen
    h-screen

    lg:w-[900px]
    lg:h-[580px]

    bg-white

    lg:rounded-[20px]
    lg:shadow-xl

    flex
    flex-col
    lg:flex-row

    overflow-hidden
  "
>
  {/* ================= MOBILE HEADER ================= */}
  <div
    className="
      lg:hidden
      flex
      items-center
      gap-[10px]
      px-5
      pt-5
      pb-4
      flex-shrink-0
    "
  >
    <button
      onClick={onClose}
      className="flex items-center gap-[10px] text-[16px] font-medium"
    >
      <img
        src={quitter}
        alt="Fermer"
        className="w-5 h-5"
      />
      Fermer
    </button>
  </div>

  {/* IMAGE */}
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
      buttonTitle="Changer"
      buttonIcon={GreenCamera}
      buttonVariant="changer"
      onButtonClick={() => setShowPopupPhoto(true)}
    />
  </div>

  {/* FORM */}
  <div
    className="
      order-2
      lg:order-1

      w-full
      lg:w-[420px]

      flex
      flex-col

      px-5
      pb-5
      lg:p-6
    "
  >
    {/* Desktop Close */}
    <button
      onClick={onClose}
      className="
        hidden
        lg:flex
        items-center
        gap-[10px]
        text-[16px]
        font-medium
        mb-6
      "
    >
      <img
        src={quitter}
        alt="Fermer"
        className="w-5 h-5"
      />
      Fermer
    </button>

    <ContainerEcriture
      noPadding
      label="Titre"
      variant="dashed"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />

    <ContainerEcriture
      noPadding
      label="Village"
      variant="dashed"
      value={village}
      onChange={(e) => setVillage(e.target.value)}
    />

    <ContainerEcriture
      noPadding
      label="Date"
      variant="dashed"
      value={date}
      onChange={(e) => setDate(e.target.value)}
    />

    <ContainerEcriture
      noPadding
      label="Légende"
      variant="dashed"
      multiline
      rows={4}
      value={description}
      onChange={(e) => setDescription(e.target.value)}
    />

    <div
      className="
        flex
        flex-col
      "
    >
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
</div>

      {/* ================= POPUP PHOTO ================= */}
      {showPopupPhoto && (
        <div
          className="
            fixed
            inset-0
            bg-black/30
            flex
            items-center
            justify-center
            z-50
            p-4
          "
        >
          <PopupPhoto
            title="Changer la photo"
            onClose={() => setShowPopupPhoto(false)}
            onImageSelected={handleImageSelected}
          />
        </div>
      )}
    </>
  );
};

export default ModifierPhoto;