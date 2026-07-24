import { AiOutlineInfoCircle } from "react-icons/ai";

const ConfirmationForm = ({
  checked,
  onChange,
  error = false,
  errorMessage = "",
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="
          h-[53px]
          rounded-[20px]
          border
          border-[#91A09F]
          bg-white
          flex
          items-center
          px-4
        "
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="mr-3"
        />

        <span className="font-semibold text-[16px] text-[#202124]">
          Je confirme la remise de cette distribution à la famille
        </span>
      </div>

      {error && (
        <div className="pl-4 flex items-center gap-2 text-[#EF4444]">
          <AiOutlineInfoCircle className="text-[20px] shrink-0" />
          <p className="text-[14px] font-bold">
            {errorMessage}
          </p>
        </div>
      )}
    </div>
  );
};

export default ConfirmationForm;