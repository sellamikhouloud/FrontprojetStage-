import AlertBox from "../AlertComposant/AlertBox";
import ImagePreview from "../PhotoComposant/ImagePreview";
import Button from "../Button/Button";

import quitter from "../../assets/quitter.svg";
import Verified from "../../assets/Verified.svg";
import testImage from "../../assets/Icon.svg";
import Edit from "../../assets/Modify.svg"; 

const ConsulterPhoto = ({
  photo,
  role = "coordinator",
  includedInReport = false,
  onToggleReport = () => {},
  onEdit = () => {},
  onClose = () => {},
}) => {
  const image = photo?.image || testImage;

  const creatorRole = photo?.cree_par?.role_affiche || "Créateur";
  const creatorName = photo?.cree_par?.nom || "Nom ID";

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
        <div className="px-4 mt-8 lg:mt-0">
          <AlertBox
            variant="info"
            title={photo?.title || ""}
            location={photo?.villageName || ""}
            date={photo?.date || ""}
            message={photo?.description || ""}
            padding="p-5"
          />

          {/* ================= ADMIN ONLY ================= */}

          {role === "admin" && (
            <>
              <div className="mt-5">
                <p className="text-[16px] font-medium">
                  {creatorRole} :
                  <span className="font-normal">
                    {" "}
                    {creatorName}
                  </span>
                </p>
              </div>

              <button
                onClick={onToggleReport}
                className="
                  mt-5
                  w-full
                  h-[48px]
                  rounded-[14px]
                  border
                  border-[#4E9F8A]
                  flex
                  items-center
                  gap-3
                  px-4
                "
              >
                <div
                  className={`
                    w-5
                    h-5
                    rounded-full
                    border
                    flex
                    items-center
                    justify-center
                    ${
                      includedInReport
                        ? "bg-[#4E9F8A] border-[#4E9F8A]"
                        : "border-[#BDBDBD]"
                    }
                  `}
                >
                  {includedInReport && (
                    <span className="text-white text-xs">
                      ✓
                    </span>
                  )}
                </div>

                <span className="font-medium">
                  Inclure dans le bilan mensuel
                </span>
              </button>

              <div className="mt-4">
                <Button
                  title="Modifier"
                  icon={Edit}
                  variant="primary"
                  onClick={onEdit}
                  noPadding
                />
              </div>
            </>
          )}
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
            location={photo?.villageName || ""}
            date={photo?.date || ""}
            message={photo?.description || ""}
            padding="p-4"
            villageName={photo?.villageName}
          />

          {/* ================= ADMIN ONLY ================= */}

          {role === "admin" && (
            <>
              <div className="mt-6">
                <p className="text-[18px] font-medium text-[#2E2E2E]">
                  {creatorRole} :
                  <span className="font-normal">
                    {" "}
                    {creatorName}
                  </span>
                </p>
              </div>

              <button
                onClick={onToggleReport}
                className="
                  mt-5
                  w-full
                  h-[45px]
                  rounded-[15px]
                  border
                  border-[#6CD894]
                  flex
                  items-center
                  gap-3
                  px-4
                "
              >
                <div
                  className={`
                    w-5
                    h-5
                    rounded-[8px]
                    border
                    flex
                    items-center
                    justify-center
                    ${
                      includedInReport
                        ? "bg-[#4E9F8A] border-[#4E9F8A]"
                        : "border-[#BDBDBD]"
                    }
                  `}
                >
                  {includedInReport && (
                    <span className="text-white text-xs">
                      ✓
                    </span>
                  )}
                </div>

                <span className="font-medium">
                  Inclure dans le bilan mensuel
                </span>
              </button>

              <div className="mt-4">
                <Button
                  title="Modifier"
                  icon={Edit}
                  variant="modifier"
                  onClick={onEdit}
                  noPadding
                />
              </div>
            </>
          )}
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