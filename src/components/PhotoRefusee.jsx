import { useState } from "react";

import AlertBox from "./AlertBox";
import Button from "./Button";
import ImagePreview from "./ImagePreview";

import quitter from "../assets/quitter.svg";
import testImage from "../assets/icon.svg";
import Supprimer from "../assets/Delete.svg";
import Refused from "../assets/Refuse.svg";

const PhotoRefuse = ({ onClose = () => {} }) => {
  const [image] = useState(testImage);

  return (
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
        {/* Fermer */}
        <button
          onClick={onClose}
          className="
            flex
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

        {/* Photo informations */}
        <div className="mb-6">
          <AlertBox
            variant="info"
            title="Inventaire logistique – Guidikhama"
            date="12 mars 2026"
            message="Contrôle de l'inventaire des fournitures médicales au centre de santé de Guidikhama. Vérification de la disponibilité des médicaments essentiels, des kits de dépistage nutritionnel et du matériel de soins avant les activités communautaires."
          />
        </div>

        {/* Refus */}
        <div className="flex justify-between items-center mb-4">
          <span
            className="
              text-[13px]
              uppercase
              text-[#6F7975]
              font-medium
            "
          >
            Refusée par l'administrateur
          </span>

          <span
            className="
              text-[13px]
              text-[#6F7975]
            "
          >
            20 juin 2026
          </span>
        </div>

        {/* Motif */}
        <div className="mb-6">
          <AlertBox
            variant="warning"
            title="Motif de refus :"
            titleColor = "text-[#8A4D00]"
            message="Visage d'un personnel identifiable en arrière-plan. Veuillez recadrer ou utiliser une autre prise de vue."
          />
        </div>

        {/* Delete button */}
        <div>
          <Button
            noPadding
            title="Supprimer"
            variant="supprimer"
            icon={Supprimer}
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-1 h-full">
        <ImagePreview
          image={image}
          buttonTitle="Refusée"
          buttonIcon={Refused}
          buttonVariant="refusee"
        />
      </div>
    </div>
  );
};

export default PhotoRefuse;