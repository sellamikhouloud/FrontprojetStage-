import { useState } from "react";

import AlertBox from "../AlertComposant/AlertBox";
import Button from "../Button/Button";
import ImagePreview from "../PhotoComposant/ImagePreview";

import quitter from "../../assets/quitter.svg";
import Pending from "../../assets/EnAttente.svg";
import testImage from "../../assets/icon.svg";
import Coordinator from "../../assets/Coordinatoor.svg";
import Confirmer from "../../assets/Confirmer.svg";
import Warning from "../../assets/Warning.svg";
import Refuser from "../../assets/Refuser.svg";

const PhotoEnAttente = ({
  photo,
  onClose = () => {},
  onApprove = () => {},
  onEdit = () => {},
  onConfirmRefusal = () => {},
}) => {
  const [mode, setMode] = useState("review");
  const [reason, setReason] = useState("");

  const image = photo?.image || testImage;

return (
  <>
    <div
      className="
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

      <div className="lg:hidden px-5 pt-5 pb-3">
        <button
          onClick={onClose}
          className="
            flex
            items-center
            gap-2
            text-[15px]
            font-medium
          "
        >
          <img
            src={quitter}
            alt="Fermer"
            className="w-4 h-4"
          />
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
          buttonTitle="En attente"
          buttonIcon={Pending}
          buttonVariant="EnAttente"
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

        <AlertBox
          variant="info"
          title={photo?.title || ""}
          location={photo?.village || ""}
          date={photo?.date || ""}
          message={photo?.description || ""}
          padding="p-4"
        />

        {mode === "review" ? (
          <>
            <div className="mt-6">
              <Button
                noPadding
                title="Modifier"
                variant="modifier"
                onClick={onEdit}
              />
            </div> 

            <div className="mt-3 flex items-center gap-1">
              
                <img
                    src={Coordinator}
                    alt="Fermer"
                    className="w-[15px] h-[15px]"
                />

              <p className="text-[18px] font-semibold text-[#181C1B]">
                Coordinateur:
              </p>

              <p className="text-[18px] text-[#181C1B]">
                {photo?.coordinator || "nom id"}
              </p>
            </div>

            <div className="flex flex-col pt-3">
              <Button
                noPadding
                icon={Confirmer}
                title="Approuver"
                variant="success"
                onClick={onApprove}
              />

              <Button
                noPadding
                title="Refuser"
                variant="supprimer"
                onClick={() => setMode("refuse")}
              />
            </div>
          </>
        ) : (
          <>
            <div className="mt-6 flex flex-col flex-1">
              <div className="flex items-center gap-1">
              
                <img
                    src={Coordinator}
                    alt="Fermer"
                    className="w-[15px] h-[15px]"
                />

              <p className="text-[18px] font-semibold text-[#181C1B]">
                Coordinateur:
              </p>

              <p className="text-[18px] text-[#181C1B]">
                {photo?.coordinator || "nom id"}
              </p>
            </div>
            <div className="flex items-center gap-1 pt-2">
                <img
                    src={Warning}
                    alt="Fermer"
                    className="w-[16px] h-[14px]"
                />
              <h2
                className="
                  text-[18px]
                  font-semibold
                  text-[#8A4D00]
                "
              >
                Motif de refus
              </h2>
            </div>
              <textarea
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value)
                }
                placeholder="Tapez le motif ici..."
                className="
                  mt-3
                  flex-1
                  min-h-[75px]
                  rounded-[16px]
                  border
                  border-[#3E3E3E]
                  p-3
                  resize-none
                  outline-none
                  text-[15px]
                "
              />

              <div className="mt-3 flex flex-col">
                <Button
                  noPadding
                  icon={Refuser}
                  title="Confirmer le refus"
                  variant="refus"
                  disabled={!reason.trim()}
                  onClick={() =>
                    onConfirmRefusal(reason)
                  }
                />

                <Button
                  noPadding
                  title="Annuler"
                  variant="Annuler"
                  onClick={() => {
                    setReason("");
                    setMode("review");
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  </>
);
}

export default PhotoEnAttente;