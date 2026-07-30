import ZakatIcon from "../../assets/Icon (1).svg";
import Decoration from "../../assets/Icon (3).svg";

const CardZakatSummary = ({
  montant = "2,450,000 MRU",
  familles = 32,
}) => {
  return (
    <div className="w-full overflow-x-hidden">
      <div
        className="
          origin-top-left
          scale-[0.75]
          sm:scale-[0.85]
          md:scale-[0.95]
          lg:scale-100
          transition-transform
          duration-300
        "
      >
        <div
          className="
            relative
            w-full
            max-w-[714px]
            h-[120px]
            rounded-[20px]
            bg-[#57A892]
            overflow-hidden
            px-8
            py-5
          "
        >
          {/* Décoration */}
          <img
            src={Decoration}
            alt=""
            className="
              absolute
              right-0
              top-0
              h-full
              opacity-10
              object-contain
              pointer-events-none
              select-none
            "
          />

          <div className="relative z-10 h-full flex flex-col justify-between">
            {/* Titre */}
            <div className="flex items-center gap-2">
              <img
                src={ZakatIcon}
                alt="Zakat"
                className="w-6 h-6"
              />

              <h2
                className="
                  text-white
                  text-[16px]
                  font-normal
                  leading-6
                  tracking-[1.6px]
                "
              >
                Zakat
              </h2>
            </div>

            {/* Informations */}
            <div className="flex justify-between items-end">
              {/* Montant */}
              <div>
                <p className="text-[#CDE4DE] text-[14px]">
                  Montant total versé
                </p>

                <h3 className="mt-[2px] text-white text-[22px] font-bold leading-none">
                  {montant}
                </h3>
              </div>

              {/* Familles */}
              <div className="mr-32">
                <p className="text-[#CDE4DE] text-[14px]">
                  Familles bénéficiaires
                </p>

                <div className="flex items-end gap-2 mt-[2px]">
                  <span className="text-white text-[22px] font-bold leading-none">
                    {familles}
                  </span>

                  <span className="text-[#E5F2EE] text-[16px] leading-none">
                    Familles
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default CardZakatSummary;