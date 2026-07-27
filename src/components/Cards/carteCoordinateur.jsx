import Users from "../../assets/Users.svg";
import Location3 from "../../assets/Location3.svg";

const CardCoordinateur = ({
  name,
  code,
  village,
  familles,
  status = "Actif",
}) => {
  return (
    <div className="w-full min-h-[100px] rounded-[15px] border border-[#E2E8F0] bg-[#F8FBFC] px-[15px] py-[15px] transition hover:shadow-sm">
      {/* Première ligne */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <h2 className="text-[20px] font-bold text-[#111827] truncate">
            {name}
          </h2>

          <span className="text-[#94A3B8] text-[18px] shrink-0">
            •
          </span>

         <span className="text-[17px] font-semibold text-[#528583] shrink-0">
            {status}
          </span>
        </div>

        <span className="text-[18px] font-semibold text-[#111827] shrink-0">
          {code}
        </span>
      </div>

      {/* Deuxième ligne */}
      <div className="mt-3 flex items-center gap-3 text-[15px] text-[#374151]">
        <div className="flex items-center gap-1">
          <img
            src={Location3}
            alt="Village"
            className="w-4 h-4"
          />
          <span>{village}</span>
        </div>

        <span className="text-[#84D6D0] font-medium">|</span>

        <div className="flex items-center gap-1">
          <img
            src={Users}
            alt="Familles"
            className="w-4 h-4"
          />
          <span>{familles} familles</span>
        </div>
      </div>
    </div>
  );
};

export default CardCoordinateur;