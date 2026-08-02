import validatedIcon from "../../assets/WhiteValide.svg";
import pendingIcon from "../../assets/WhiteEnAttente.svg";
import refusedIcon from "../../assets/WhiteRefuse.svg";
import Point from "../../assets/WhitePoint.svg";

const styles = {
  validated: {
    bg: "bg-[#22C55E]",
    icon: validatedIcon,
  },

  pending: {
    bg: "bg-[#F59E0B]",
    icon: pendingIcon,
  },

  refused: {
    bg: "bg-[#EF4444]",
    icon: refusedIcon,
  },
};

const StatusBadge = ({ status }) => {
  const badge = styles[status];

  if (!badge) return null;

  return (
    <div
      className={`
        w-[45px]
        h-[30px]
        rounded-full
        ${badge.bg}
        flex
        items-center
        justify-center
        shadow-sm
      `}
    >
      <div className="
        flex
        justify-between
        items-center
        gap-1
      ">
        <img
            src={badge.icon}
            alt={status}
            className="w-[15px] h-[15px]"
        />
        <img
            src={Point}
            alt=""
            className="w-[6px] h-[6px]"
        />
      </div>
    </div>
  );
};

export default StatusBadge;