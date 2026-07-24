const ProductItem = ({
   icon,
   title,
   quantity,
   unit
}) => {
    return(
       <div className="
       w-full
       h-[56px]
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
            <span className="
            bg-[#ECF8F7]
            w-[60px]
            h-[32px]
            font-bold
            text-[#4E9F8A]
            text-[16px]
            flex
            justify-center
            items-center
            rounded-[8px]
            ">
                {quantity}
            </span>
            <span className="
            text-[#6E7976]
            text-14px
            leading-5
            ">
                {unit}
            </span>
        </div>
       </div> 
    )
};
export default ProductItem;