import CloseIcon from "../assets/Refuse.svg"; 

const NewProductCard = ({
  product,
  setProduct,
  onClose,
}) => {
  return (
    <div
  className="
    mt-4
    border
    border-dashed
    border-[#52525299]
    rounded-[20px]
    bg-white
    p-5
  "
>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[18px] font-semibold text-[#4E9F8A]">
          Nouveau produit
        </h3>

        <button onClick={onClose}>
          <img
            src={CloseIcon}
            alt="Fermer"
            className="w-6 h-6"
          />
        </button>
      </div>

      {/* Nom du produit */}
      <input
        type="text"
        placeholder="Nom de produit"
        value={product.name}
        onChange={(e) =>
          setProduct({
            ...product,
            name: e.target.value,
          })
        }
        className="
  w-full
  h-[44px]
  rounded-[18px]
  border
  border-[#4E9F8A]
  px-5
  text-[18px]
  outline-none
  bg-white
  placeholder:text-[#6E7976]
"
      />

      {/* Unité + Valeur */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <input
          type="text"
          placeholder="Unité"
          value={product.unit}
          onChange={(e) =>
            setProduct({
              ...product,
              unit: e.target.value,
            })
          }
        className="
  h-[44px]
  rounded-[18px]
  border
  border-[#4E9F8A]
  px-5
  text-[18px]
  outline-none
  bg-white
  placeholder:text-[#6E7976]
"
        />

        <input
          type="number"
          placeholder="Valeur"
          value={product.quantity}
          onChange={(e) =>
            setProduct({
              ...product,
              quantity: e.target.value,
            })
          }
          className="
            h-[44px]
            rounded-[18px]
            border
            border-[#4E9F8A]
            px-5
            text-[18px]
            outline-none
            bg-white
            placeholder:text-[#6E7976]
          "
        />
      </div>
    </div>
  );
};

export default NewProductCard;