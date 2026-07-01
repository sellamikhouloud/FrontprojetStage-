import Searchloop from "../assets/Search.png";
import FilterIcon from "../assets/Filter.png";

const SearchBar = ({
  placeholder = "Entrer un nom ou un identifiant",
  value,
  onChange,
  onFilterClick,
}) => {
  return (
    <div
      className="
        flex items-center gap-[10px]

        w-full

        px-4
        lg:pl-20
        lg:pr-5

        py-2
      "
    >
      {/* Input */}
      <div className="relative flex-1">

        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="
            w-full
            h-[45px]

            rounded-[15px]

            border-[1px]
            border-[#000000]

            bg-white

            pl-5
            pr-10

             text-[16px]
    font-normal
    text-[#484848]

    placeholder:text-[#484848]

    focus:outline-none
    focus:ring-0
    focus:border-black
          "
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

      <button
        onClick={onFilterClick}
        className="
          w-[50px]
          h-[45px]

          rounded-[15px]

          bg-[#57B29D]

          flex
          items-center
          justify-center

           cursor-pointer

    shadow-sm
    hover:shadow-md

          hover:bg-[#4DA38F]

           active:scale-95
    active:bg-[#3E8C79]

          transition-all
          duration-200

          shrink-0
        "
      >

        <img
          src={FilterIcon}
          alt="Filtre"
          className="w-5 h-5"
        />

      </button>

    </div>
  );
};

export default SearchBar;