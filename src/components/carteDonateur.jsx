const CardDonateur = ({
  name,
  email,
  date,
  code,
  status = "Actif",
}) => {
  return (
    <div
      className="
        w-full
        rounded-2xl
        border
        bg-[#F8FBFC]
        border-[#E2E8F0]
        px-4
        py-4
      "
    >
      {/* Première ligne */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Nom + statut */}
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#111827]">
            {name}
          </h2>

          <span className="text-[#94A3B8]">•</span>

          <span
            className="text-base sm:text-lg md:text-xl font-semibold"
            style={{ color: "#528583" }}
          >
            {status}
          </span>
        </div>

        {/* Code */}
        <span className="text-base sm:text-lg md:text-xl font-semibold text-[#111827]">
          {code}
        </span>
      </div>

      {/* Deuxième ligne */}
     <div className="mt-2 text-sm sm:text-base md:text-lg text-[#374151]">
  <p className="break-all">{email}</p>

  <p className="mt-1">{date}</p>
</div>
    </div>
  );
};

export default CardDonateur;
