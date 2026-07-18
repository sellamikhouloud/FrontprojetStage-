import Plus from "../../assets/Plus.svg";
import Moins from "../../assets/Moins.svg";

const QuantitySelector = ({
    value,
    onChange
}) => {
    const decrease = () => {
        if(value > 0){
            onChange(value - 1)
        }
    }
    const increase = () => {
        if(value > 0){
            onChange(value + 1)
        }
    }
    return(
        <div className="
        flex
        gap-[17px]
        ">
           <button onClick={decrease}
            className="
                w-[40px]
                h-[40px]
                bg-[#7BC8C4]
                rounded-[18px]
                flex 
                justify-center
                items-center
            "
        >
               <img
               src={Moins}
               alt=""
               className="w-[14px] h-[2px]"
               />
           </button>
           <div className="
               w-[80px]
               h-[40px]
               rounded-[16px]
               p-3
               border
               border-[#00685C]
               flex 
               justify-center
               items-center
           ">
               {value}
           </div>
           <button onClick={increase}
           className="
                w-[40px]
                h-[40px]
                bg-[#7BC8C4]
                rounded-[18px]
                flex 
                justify-center
                items-center
            "
                >
               <img
               src={Plus}
               alt=""
               className="w-[14px] h-[14px]"
               />
           </button>
        </div>
    )
}

export default QuantitySelector