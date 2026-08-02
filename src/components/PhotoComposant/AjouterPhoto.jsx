import { useEffect, useState } from "react";

import AlertBox from "../AlertComposant/AlertBox";
import ContainerEcriture from "../Containers/ContainerEcriture";
import ChoiceContainer from "../Containers/ChoiceContainer";
import DateContainer from "../Containers/DateContainer";
import Button from "../Button/Button";
import ImagePreview from "../PhotoComposant/ImagePreview";
import PopupPhoto from "../Popups/PopupPhoto";

import quitter from "../../assets/quitter.svg";
import testImage from "../../assets/Icon.svg";
import GreenCamera from "../../assets/GreenCamera.svg";

const AjouterPhoto = ({
  initialImage,
  onClose = () => {},
  onSave = () => {},
}) => {
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

  // FIX DATE
  const [date, setDate] = useState(null);

  const [image, setImage] = useState(
    initialImage || testImage
  );

  const [showPopupPhoto, setShowPopupPhoto] =
    useState(false);


  useEffect(() => {
    if (initialImage) {
      setImage(initialImage);
    }
  }, [initialImage]);


  const handleImageSelected = (file) => {
    setImage(URL.createObjectURL(file));
  };


  const handleSave = () => {
    const newPhoto = {
      title: titre,
      village,
      date,
      description,
      image,
      status: "pending",
    };

    onSave(newPhoto);
  };


  return (
    <>
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

        {/* IMAGE */}
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
            buttonTitle="Changer"
            buttonIcon={GreenCamera}
            buttonVariant="changer"
            onButtonClick={() =>
              setShowPopupPhoto(true)
            }
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

            p-5
            lg:p-6

            flex-1
          "
        >

          {/* Close */}
          <button
            onClick={onClose}
            className="
              flex
              items-center
              gap-2

              text-[15px]
              lg:text-[16px]

              font-medium

              mb-4
              lg:mb-5
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
              message="
              Aucune photo de nourrisson. Les photos illustrent le programme dans sa globalité et jamais un bénéficiaire identifiable.
              "
            />
          </div>


          {/* Title */}
          <ContainerEcriture
            noPadding
            label="Titre de la photo"
            placeholder="Entrer le titre"
            value={titre}
            onChange={(e) =>
              setTitre(e.target.value)
            }
          />


          {/* Village */}
          <ChoiceContainer
            noPadding
            label="Village"
            placeholder="Choisir un village"
            options={villages}
            value={village}
            onChange={setVillage}
          />


          {/* Date */}
          <DateContainer
            noPadding
            label="Date"
            value={date}
            onChange={setDate}
          />


          {/* Description */}
          <ContainerEcriture
            noPadding
            label="Description"
            placeholder="Entrer une description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />


          {/* Save */}
          <div className="mt-8 lg:mt-auto pt-5">
            <Button
              noPadding
              title="Enregistrer"
              variant="primary"
              onClick={handleSave}
            />
          </div>

        </div>

      </div>


      {showPopupPhoto && (
        <PopupPhoto
          title="Changer la photo"
          onClose={() =>
            setShowPopupPhoto(false)
          }
          onImageSelected={handleImageSelected}
        />
      )}
    </>
  );
};

export default AjouterPhoto;