const SoldeCard = ({
  soldeDisponible = "",
  soldeEnEuros = "",
  entreesMois = "",
  entreesMoisEnEuros = "",
  sortiesMois = "",
  sortiesMoisEnEuros = "",
  famillesAidees = "",
  versementsRealises = "",
  tauxActuel = "",
}) => {
  return (
    <div
      className="
        w-full
        rounded-[20px]
        border
        border-[#BEC9C5]
        bg-white

        pt-5
        pb-0
        px-5
      "
    >
      {/* Solde disponible */}
      <p
        className="text-[14px] leading-[18px] font-medium tracking-wide uppercase"
        style={{ color: "#3E4946" }}
      >
        Solde disponible
      </p>

      <div className="mt-3 flex items-baseline gap-2">
        <span
          className="text-[32px] sm:text-[42px] font-bold leading-none"
          style={{ color: "#4E9F8A" }}
        >
          {soldeDisponible}
        </span>
        <span
          className="text-[20px] font-bold"
          style={{ color: "#418573", opacity: 0.7 }}
        >
          MRU
        </span>
      </div>

      <p className="mt-2 text-[16px] font-semibold" style={{ color: "#3E4946", opacity: 0.7  }}>
        ≈ {soldeEnEuros} Euros
      </p>

      {/* Divider */}
      <div className="mt-3 mb-3 border-t border-[#E5E7EB]" />

      {/* 4 blocs : titre + nombre */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {/* Entrées ce mois */}
        <div>
          <p
            className="text-[14px] font-bold mb-1"
            style={{ color: "#346A5C" }}
          >
            Entrées ce mois
          </p>
          <p className="text-[20px] font-bold" style={{ color: "#000000" }}>
            {entreesMois}
           <span
      className="text-[14px] font-bold ml-1"
      style={{ color: "#000000", opacity: 0.6 }}
    >
      MRU
    </span>
          </p>
          <p className="text-[14px] font-semibold mt-0.5" style={{ color: "#3E4946", opacity: 0.6 }}>
            ≈ {entreesMoisEnEuros} Euros
          </p>
        </div>


        {/* Sorties ce mois */}
        <div>
  <p
    className="text-[14px] font-bold mb-1"
    style={{ color: "#346A5C" }}
  >
    Sorties ce mois
  </p>
  <p className="text-[20px] font-bold" style={{ color: "#000000" }}>
    {sortiesMois}
    <span
      className="text-[14px] font-bold ml-1"
      style={{ color: "#000000", opacity: 0.6 }}
    >
      MRU
    </span>
  </p>
  <p className="text-[14px] font-semibold mt-0.5" style={{ color: "#3E4946" , opacity: 0.6}}>
    ≈ {sortiesMoisEnEuros} Euros
  </p>
</div>

        {/* Familles aidées */}
        <div>
          <p
            className="text-[14px] font-bold mb-1"
            style={{ color: "#346A5C" }}
          >
            Familles aidées
          </p>
          <p className="text-[20px] font-bold" style={{ color: "#000000" }}>
            {famillesAidees}
          </p>
        </div>

        {/* Versements réalisés */}
        <div>
          <p
            className="text-[14px] font-bold mb-1"
            style={{ color: "#346A5C" }}
          >
            Versements réalisés
          </p>
          <p className="text-[20px] font-bold" style={{ color: "#000000" }}>
            {versementsRealises}
          </p>
        </div>
      </div>

      {/* Taux actuel */}
      <p
        className="mt-[6px] mb-3 text-[16px] text-right font-semibold"
        style={{ color: "#3E4946" }}
      >
        Taux actuel : 1 Ouguiya = {tauxActuel} Euro
      </p>
    </div>
  );
};

export default SoldeCard;
