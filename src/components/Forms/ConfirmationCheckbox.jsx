const ConfirmationCheckbox = ({
    checked,
    onChange,
    label
}) => {
    return(
        <div className="
        w-[639px]
        h-[53px]
        rounded-[20px]
        border
        border-[#91A09F]
        text-[16px]
        leading-[17.5px]
        font-bold
        pt-[10px]
        px-[15px]
        py-[15px]
        pb-[10px]
        gap-4
        bg-white
        flex
        items-center
        ">
          <input type="checkbox" value={checked} onChange= {(e) => onChange(e.target.checked)}  className="w-[25px] h-[25px]"/>
          <span>{label}</span>
        </div>
    );
};

export default ConfirmationCheckbox;