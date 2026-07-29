import { X } from "lucide-react";

const ProductItem = ({
   icon,
   title,
   quantity,
   unit,
   onQuantityChange,
   onRemove,
}) => {
    return(
       <div className="
       w-full
       h-[56px]
       shrink-0
       flex
       items-center
       justify-between
       border
       border-[#4E9F8A]
       rounded-[20px]
       px-4
       bg-white
       ">
        <div className="
        flex
        items-center
        gap-3
        ">
            <img
            src={icon}
            alt=""
            className="w-8 h-8"
            />

            <span className="
            font-bold
            text-[16px]
            leading-[24px]
            text-[#000000]
            ">
                {title}
            </span>
        </div>
        <div className="
        flex
        items-center
        gap-2
        ">
            <input
              type="number"
              min={0}
              value={quantity}
              onFocus={(e) => e.target.select()}
              onChange={(e) => {
                let val = e.target.value;
                val = val.replace(/^0+(?=\d)/, "");
                onQuantityChange?.(val === "" ? 0 : Number(val));
              }}
              className="
                no-spinner
                bg-[#ECF8F7]
                w-[60px]
                h-[32px]
                font-bold
                text-[#4E9F8A]
                text-[16px]
                text-center
                rounded-[8px]
                outline-none
                border
                border-transparent
                focus:border-[#4E9F8A]
              "
            />
            <span
  className="
    w-8
    text-center
    text-[#6E7976]
    text-[16px]
    leading-5
  "
>
  {unit}
</span>

            <button
              type="button"
              onClick={onRemove}
              className="
                w-7
                h-7
                flex
                items-center
                justify-center
                rounded-[8px]
                text-[#EF4444]
                hover:bg-[#FDECEC]
                transition-colors
              "
            >
              <X size={16} />
            </button>
        </div>
       </div> 
    )
};
export default ProductItem;