import addIcon from "../../assets/Plus.svg";
import SearchBar from "../Filter/SearchBar";

const GalleryHeader = ({
  onAdd,
  searchValue,
  setSearchValue,
}) => {
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
        className="
          flex
          items-center
          justify-between
        "
      >
        {/* Title (Desktop only) */}
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


        {/* Spacer for mobile */}
        <div className="lg:hidden" />


        {/* Add Button */}
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
            className="
              w-6
              h-6
            "
          />
        </button>
      </div>


      {/* Search Bar */}
      <div
        className="
          w-full
        "
      >
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