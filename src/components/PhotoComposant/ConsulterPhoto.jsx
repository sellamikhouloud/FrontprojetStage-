import AlertBox from "../AlertComposant/AlertBox";
import ImagePreview from "../PhotoComposant/ImagePreview";

import quitter from "../../assets/quitter.svg";
import Verified from "../../assets/Verified.svg";
import testImage from "../../assets/icon.svg";

const ConsulterPhoto = ({
  photo,
  onClose = () => {},
}) => {
  const image = photo?.image || testImage;

  return (
    <div
      className="
        w-screen
        h-screen
        bg-white
        flex
        flex-col

        md:w-[900px]
        md:h-[580px]
        md:flex-row
        md:rounded-[20px]
        md:shadow-xl
        md:overflow-hidden
      "
    >
      {/* ================= MOBILE ================= */}
      <div className="md:hidden flex flex-col h-full overflow-y-auto">
        {/* Close */}
        <div className="px-4 pt-5 pb-3">
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

        {/* Image */}
        <div className="px-4">
          <div className="rounded-[24px] overflow-hidden">
            <ImagePreview
              image={image}
              buttonTitle="Validée"
              buttonIcon={Verified}
              buttonVariant="changer"
            />
          </div>
        </div>

        {/* Information */}
        <div className="p-4">
          <AlertBox
            variant="info"
            title={photo?.title || ""}
            location={photo?.village || ""}
            date={photo?.date || ""}
            message={photo?.description || ""}
            padding="p-5"
          />
        </div>
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:flex w-full h-full">
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

          <AlertBox
            variant="info"
            title={photo?.title || ""}
            location={photo?.village || ""}
            date={photo?.date || ""}
            message={photo?.description || ""}
            padding="p-4"
          />
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
    </div>
  );
};

export default ConsulterPhoto;