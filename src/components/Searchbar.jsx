import Searchloop from "../assets/Search.png";
import FilterIcon from "../assets/Filter.png";

const SearchBar = ({
  placeholder = "Entrer un nom ou un identifiant",
  value,
  onChange,
  onFilterClick,
  showFilter = true,

  // Props
  width = "w-full",
  maxWidth = "max-w-[500px]",
  height = "h-[45px]",
  className = "",
}) => {
  return (
    <div
      className={`
        flex items-center
        gap-[10px]
        ${width}
        ${maxWidth}
        ${className}
      `}
    >
      {/* Input */}
      <div className="relative flex-1 min-w-0">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`
            w-full
            ${height}
            rounded-[15px]
            border
            border-black
            bg-white
            pl-5
            pr-10
            text-[14px]
            sm:text-[15px]
            md:text-[16px]
            font-normal
            text-[#484848]
            placeholder:text-[#484848]
            focus:outline-none
            focus:ring-0
            focus:border-black
          `}
        />

        <img
          src={Searchloop}
          alt="Recherche"
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            w-4
            h-4
          "
        />
      </div>

      {/* Bouton filtre */}
      {showFilter && (
        <button
          onClick={onFilterClick}
          className={`
            ${height}
            w-[45px]
            sm:w-[50px]
            rounded-[15px]
            bg-[#57B29D]
            flex
            items-center
            justify-center
            cursor-pointer
            shadow-sm
            hover:bg-[#4DA38F]
            active:scale-95
            transition-all
            shrink-0
          `}
        >
          <img
            src={FilterIcon}
            alt="Filtre"
            className="w-5 h-5"
          />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
