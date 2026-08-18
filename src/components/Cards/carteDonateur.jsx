import Icon11 from "../../assets/Icon11.svg";

const CardDonateur = ({
  name,
  email,
  date,
  status = "Actif",
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

          {/* Nom + statut */}
          <div className="min-w-0">
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
                  shrink-0
                  text-[18px]
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

            {/* Email */}
            <div className="mt-3">
              <span
                className="
                  text-[15px]
                  text-[#374151]
                  break-all
                "
              >
                {email}
              </span>
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
          {/* Date d'adhésion */}
          <span
            className="
              text-[15px]
              font-medium
              text-[#111827]
              whitespace-nowrap
            "
          >
            {date}
          </span>

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

            <span>{creePar || "/"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDonateur;
