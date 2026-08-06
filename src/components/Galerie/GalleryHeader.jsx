import addIcon from "../../assets/Plus.svg";
import SearchBar from "../Filter/SearchBar";
import Button from "../Button/Button";
import Warning from "../../assets/Warning.svg";
import AlertBanner from "../AlertComposant/AlertBanner";
import PageHeader from "../Navigation,Pageheader/PageHeader";

const currentDate = new Date();

const currentMonth = currentDate.toLocaleDateString("fr-FR", {
  month: "long",
});

const currentYear = currentDate.getFullYear();

const GalleryHeader = ({
  role = "coordinator",
  selectionMode = false,
  onAdd,
  onSelection,
  onCancelSelection,
  searchValue,
  setSearchValue,
  photosEnAttente,
  photosSelectionnees = 0,
  onAlertClick,
}) => {

  /* ================= SELECTION HEADER ================= */

  if (selectionMode) {
    return (
      <div
        className="
          flex
          flex-col
          gap-4
          px-4
          pt-5
          pb-4
          lg:px-8
          lg:pt-8
          lg:pb-4
        "
      >
        {/* Top row */}
        <div className="flex items-center gap-[20px]">

          <PageHeader
            leftTitle="Annuler"
            showRight={false}
            onBack={onCancelSelection}
          />

          <div className="flex items-center gap-2">

            <span
              className="
                text-[18px]
                font-bold
              "
            >
              {photosSelectionnees}
            </span>

            <span
              className="
                text-[18px]
                font-bold
              "
            >
              photo{photosSelectionnees > 1 ? "s" : ""} sélectionnée
              {photosSelectionnees > 1 ? "s" : ""} pour le bilan
            </span>

          </div>

        </div>

        {/* Description */}

        <p
          className="
            text-[16px]
            leading-[24px]
          "
        >
          Sélectionnez les images validées qui seront incluses dans le rapport de{" "}
          <span className="capitalize">
           {currentMonth} {currentYear}
          </span>
         . Seules les photos approuvées seront affichées ici.
        </p>

        {/* Search */}

        <SearchBar
          placeholder="Entrer un titre"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          showFilter={false}
          width="w-full"
          maxWidth="max-w-none"
        />
      </div>
    );
  }

  /* ================= NORMAL HEADER ================= */

  return (
    <div
      className="
        flex
        flex-col
        gap-4
        px-4
        pt-5
        pb-4
        lg:px-8
        lg:pt-8
        lg:pb-4
      "
    >
      {/* Top row */}

      <div
        className={`
          flex
          items-center
          ${
            role === "coordinator"
              ? "justify-between"
              : "justify-end"
          }
        `}
      >
        {/* Coordinator title */}

        {role === "coordinator" && (
          <h1
            className="
              hidden
              lg:block
              text-[28px]
              font-bold
              text-[#0C0C0C]
            "
          >
            Galerie
          </h1>
        )}

        {/* Mobile spacer */}

        <div className="lg:hidden" />

        {/* Right buttons */}

        {role === "coordinator" ? (
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
            "
          >
            <img
              src={addIcon}
              alt="Ajouter"
              className="w-6 h-6"
            />
          </button>
        ) : (
          <div className="flex items-center gap-4">

            <div className="flex-1">
              <Button
                title="Sélectionner pour le bilan"
                variant="primary"
                noWrapperPadding
                onClick={onSelection}
              />
            </div>

            <button
              onClick={onAdd}
              className="
                aspect-square
                h-12
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
        )}
      </div>

      {/* Alert */}

      {role === "admin" && photosEnAttente > 0 && (
        <div
            onClick={onAlertClick}
            className="cursor-pointer"
        >
            <AlertBanner
                height="52px"
                icon={Warning}
                subtitle="photos en attente de validation"
                subtitleColor="#78350F"
                count={photosEnAttente}
                bgColor="#FFFBEB"
                borderColor="#F59E0B"
                hasLeftBorder="#F59E0B"
            />
        </div>
      )}

      {/* Search */}

      <div className="w-full">
        <SearchBar
          placeholder="Entrer un nom ou un identifiant"
          value={searchValue}
          onChange={(e) =>
            setSearchValue(e.target.value)
          }
          showFilter={false}
          width="w-full"
          maxWidth="max-w-none"
        />
      </div>

    </div>
  );
};

export default GalleryHeader;