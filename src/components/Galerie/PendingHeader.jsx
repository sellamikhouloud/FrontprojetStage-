import addIcon from "../../assets/Plus.svg";
import Warning from "../../assets/Warning.svg";

import AlertBanner from "../AlertComposant/AlertBanner";
import PageHeader from "../Navigation,Pageheader/PageHeader";

const PendingPhotosHeader = ({
  photosEnAttente = 0,
  onBack,
  onAdd,
}) => {
  return (
    <div
      className="
        w-full
        flex
        flex-col
        gap-4
        px-4
        py-4
        lg:px-8
        lg:py-6
      "
    >
      {/* Top row */}

      <div className="flex items-center justify-between">

        <PageHeader
          leftTitle="Revenir"
          showRight={false}
          onBack={onBack}
        />

        <button
          onClick={onAdd}
          className="
            w-12
            h-12
            lg:w-[52px]
            lg:h-[52px]
            rounded-full
            bg-[#4E9F8A]
            flex
            items-center
            justify-center
            shadow-md
            transition
            hover:bg-[#458F7B]
            active:scale-95
            shrink-0
          "
        >
          <img
            src={addIcon}
            alt="Ajouter"
            className="w-6 h-6"
          />
        </button>

      </div>

      {/* Alert */}

        {photosEnAttente > 0 && (
        <AlertBanner
            height="52px"
            icon={Warning}
            count={photosEnAttente}
            subtitle="photos en attente de validation"
            subtitleColor="#78350F"
            bgColor="#FFFBEB"
            borderColor="#F59E0B"
            hasLeftBorder="#F59E0B"
        />
        )}
    </div>
  );
};

export default PendingPhotosHeader;