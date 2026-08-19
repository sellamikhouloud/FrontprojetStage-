import Users from "../../assets/Users.svg";
import Location3 from "../../assets/Location3.svg";
import Icon11 from "../../assets/Icon11.svg";

const CardCoordinateur = ({
  name,
  village,
  familles,
  status = "Actif",
  username,
  creePar,
}) => {
  return (
    <div
      className="
        w-full
        min-h-[100px]
        rounded-[15px]
        border
        border-[#E2E8F0]
        bg-[#F8FBFC]
        px-[15px]
        py-[15px]
        transition
        hover:shadow-sm
      "
    >
      <div className="flex items-center justify-between gap-3">

        {/* GAUCHE */}
        <div className="flex items-center gap-2 flex-1 min-w-0">

          <div className="min-w-0">

            {/* Première ligne : Nom + statut */}
            <div className="flex items-center gap-2 min-w-0">
              <h2
                className="
                  text-[20px]
                  font-bold
                  text-[#111827]
                  truncate
                "
              >
                {name}
              </h2>

              <span
                className="
                  text-[#94A3B8]
                  text-[18px]
                  shrink-0
                "
              >
                •
              </span>

              <span
                className="
                  text-[17px]
                  font-semibold
                  text-[#528583]
                  shrink-0
                "
              >
                {status}
              </span>
            </div>

            {/* Deuxième ligne : Village + Familles */}
            <div
              className="
                mt-3
                flex
                items-center
                flex-wrap
                gap-3
                text-[15px]
                text-[#374151]
              "
            >
              {/* Village */}
              <div className="flex items-center gap-1">
                <img
                  src={Location3}
                  alt="Village"
                  className="w-4 h-4"
                />

                <span>{village}</span>
              </div>

              <span className="text-[#84D6D0] font-medium">
                |
              </span>

              {/* Familles */}
              <div className="flex items-center gap-1">
                <img
                  src={Users}
                  alt="Familles"
                  className="w-4 h-4"
                />

                <span>
                  {familles} familles
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* DROITE */}
        <div
          className="
            flex
            flex-col
            items-end
            shrink-0
            gap-2
          "
        >

          {/* Username */}
          <div
            className="
              text-[15px]
              sm:text-[16px]
              md:text-[18px]
              text-[#1E1E1E]
              whitespace-nowrap
            "
          >
            <span className="font-medium">
              Username:
            </span>{" "}
            <span>
              {username || "/"}
            </span>
          </div>

          {/* Créé par */}
          <div
            className="
              flex
              items-center
              gap-1
              text-[15px]
              text-[#393939]
              whitespace-nowrap
            "
          >
            <img
              src={Icon11}
              alt="Créé par"
              className="
                w-[16px]
                h-[16px]
                object-contain
              "
            />

            <span>Créé par</span>

            <span>
              {creePar || "/"}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CardCoordinateur;
