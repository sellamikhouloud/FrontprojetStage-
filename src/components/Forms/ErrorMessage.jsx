import { AiOutlineInfoCircle } from "react-icons/ai";

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="pl-4 flex items-center gap-2 text-[#EF4444]">
      <AiOutlineInfoCircle className="text-[20px] shrink-0" />
      <p className="text-[14px] font-bold">{message}</p>
    </div>
  );
};

export default ErrorMessage;