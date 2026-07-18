import { useState } from "react";

import AlertBox from "./AlertBox";
import Button from "../Button/Button";
import ImagePreview from "./ImagePreview";

import quitter from "../assets/quitter.svg";
import testImage from "../assets/icon.svg";
import Modifier from "../assets/Modify.svg";
import Supprimer from "../assets/Delete.svg";
import Verified from "../assets/Verified.svg";


const   ConsulterPhoto = ({ onClose = () => {} }) => {
const [image] = useState(testImage);
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

          {/* Alert */}
          <div className="mb-4">
            <AlertBox
              variant="info"
              title="Distribution kits - Tenadi"
              date="12 mars 2026"
              message="Session de distribution mensuelle réalisée au centre de santé de Tenadi. 45 familles ont reçu des suppléments nutritionnels et des conseils d'hygiène."
              padding="p-4"
            />
          </div>

          {/* Button */}
          <div>
            <Button
              noPadding
              title="Modifier"
              variant="modifier"
              icon={Modifier}
            />
          </div>
          <div>
            <Button
              noPadding
              title="Supprimer"
              variant="supprimer"
              icon={Supprimer}
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
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

export default  ConsulterPhoto;