import Button from "../Button/Button";
import AlertBox from "../AlertComposant/AlertBox";
import ImagePreview from "../PhotoComposant/ImagePreview";

import quitter from "../../assets/quitter.svg";
import Refused from "../../assets/Refuse.svg";
import testImage from "../../assets/Icon.svg";

const PhotoRefusee = ({
  photo,
  role = "coordinator",
  onClose = () => {},
  onReexamine = () => {},
}) => {
  const image = photo?.image || testImage;

  const creatorRole = photo?.cree_par?.role_affiche || "Créateur";
  const creatorName = photo?.cree_par?.nom || "Nom ID";

  return (
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
          <img src={quitter} alt="Fermer" className="w-4 h-4" />
          Fermer
        </button>
      </div>

      {/* ================= IMAGE ================= */}

{/* ================= MOBILE IMAGE ================= */}
<div className="lg:hidden px-4">
  <div className="rounded-[24px] overflow-hidden">
    <ImagePreview
      image={image}
      buttonTitle="Refusée"
      buttonIcon={Refused}
      buttonVariant="refusee"
    />
  </div>
</div>

{/* ================= DESKTOP IMAGE ================= */}
      
      <div
        className="
          hidden
          lg:block
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
          buttonTitle="Refusée"
          buttonIcon={Refused}
          buttonVariant="refusee"
        />
      </div>

      {/* ================= CONTENT ================= */}

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
          <img src={quitter} alt="Fermer" className="w-5 h-5" />
          Fermer
        </button>

        {/* Informations */}
      <div className="mt-8 lg:mt-0">
        <AlertBox
          variant="info"
          title={photo?.title || ""}
          location={photo?.villageName || ""}
          date={photo?.date || ""}
          message={photo?.description || ""}
          padding="p-4"
          villageName={photo?.villageName}
        />
      </div>
        {/* Coordinateur */}

        {role === "admin" && (
          <div className="mt-6">
            <p className="text-[14px] text-[#5E6064]">
              {creatorRole}
            </p>

            <p className="mt-1 text-[16px] font-semibold text-[#202124]">
              {creatorName}
            </p>
          </div>
        )}

        {/* Motif de refus */}

        <div className="mt-6">
          <AlertBox
            variant="warning"
            title="Motif de refus :"
            titleColor="text-[#8A4D00]"
            message={photo?.motifRefus || ""}
            padding="p-4"
          />
        </div>

        {role === "admin" && (
          <div className="mt-auto pt-6">
            <Button
              noPadding
              title="Réexaminer"
              variant="modifier"
              onClick={onReexamine}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoRefusee;