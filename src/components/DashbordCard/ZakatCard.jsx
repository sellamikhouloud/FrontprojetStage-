import ZakatInfoRow from "../ZakatInfoRow";

const ZakatCard = ({
  variant = "admin",
  title,
  remainingBalanceMRU,
  remainingBalanceEUR,
  monthlyDistributedMRU,
  monthlyDistributedEUR,
  beneficiaryFamilies,
  exchangeRate,
  onClick,
}) => {
  const isCoordinator = variant === "coordinator";
  const isAdmin = variant === "admin";

  return (
    <div className="w-full">
      {/* =====================================================
          MOBILE TITLE + VOIR LISTE
      ===================================================== */}

      <div className="md:hidden flex justify-between items-center mb-[7px]">
        <h2 className="text-[16px] leading-[18px] font-semibold text-[#171D1A]">
          {title}
        </h2>

        {(isCoordinator || isAdmin) && (
          <button
            type="button"
            onClick={onClick}
            className="
              flex
              items-center
              gap-[5px]
              text-[#5E6064]
              text-[13px]
              font-medium
              hover:text-[#69B89C]
              transition-colors
              cursor-pointer
            "
          >
            Voir liste des aides zakats
          </button>
        )}
      </div>

      {/* =====================================================
          MAIN CARD
      ===================================================== */}

      <div
        className={`
          w-full
          text-left
          ${
            isCoordinator
              ? `
                rounded-none
                border-0
                bg-transparent
                p-0
                shadow-none

                md:rounded-[24px]
                md:border
                md:border-[#DDE7EE]
                md:bg-[#F8FAFC]
                md:p-6
                md:shadow-sm
              `
              : `
                rounded-[24px]
                border
                border-[#DDE7EE]
                bg-[#F8FAFC]
                p-6
                shadow-sm

                max-md:rounded-[12px]
                max-md:border
                max-md:border-[#DDE7EE]
                max-md:bg-[#F8FAFC]
                max-md:p-[10px]
                max-md:shadow-none
              `
          }
        `}
      >
        {/* =====================================================
            DESKTOP HEADER
        ===================================================== */}

        <div
          className={`
            hidden
            md:flex
            items-center
            justify-between
            ${isCoordinator ? "mb-0" : "mb-5"}
          `}
        >
          <h2 className="text-[24px] leading-[28px] font-semibold text-[#171D1A]">
            {title}
          </h2>

          {(isCoordinator || isAdmin) && (
            <button
              type="button"
              onClick={onClick}
              className="
                flex
                items-center
                text-[#5E6064]
                text-[18px]
                font-medium
                hover:text-[#69B89C]
                transition-colors
                cursor-pointer
              "
            >
              Voir liste des aides zakats
            </button>
          )}
        </div>

        {/* =====================================================
            COORDINATOR DESKTOP
        ===================================================== */}

        {isCoordinator && (
          <div className="hidden md:flex justify-end">
            <div className="text-right">
              <span className="text-[34px] font-bold text-[#346A5C]">
                {remainingBalanceMRU}
              </span>

              <span className="text-[28px] font-bold text-[#346A5C]">
                {" / "}
                {remainingBalanceEUR}
              </span>
            </div>
          </div>
        )}

        {/* =====================================================
            COORDINATOR MOBILE
        ===================================================== */}

        {isCoordinator && (
          <div className="block md:hidden">
            <div
              className="
                w-full
                h-[49px]
                rounded-[12px]
                border
                border-[#8BC9C9]
                bg-[#A8DADA]
                flex
                flex-col
                items-center
                justify-center
              "
            >
              <span className="text-[13px] font-medium leading-[16px] text-[#171D1A]">
                Total amount
              </span>

              <div className="flex items-center justify-center">
                <span className="text-[15px] font-bold text-[#346A5C]">
                  {remainingBalanceMRU}
                </span>

                <span className="text-[13px] font-bold text-[#346A5C]">
                  {" / "}
                  {remainingBalanceEUR}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            ADMIN CONTENT
        ===================================================== */}

        {isAdmin && (
          <div className="flex flex-col gap-[16px]">
            <ZakatInfoRow
              label="Solde restant"
              value={
                <>
                  <span className="text-[24px] font-extrabold">
                    {remainingBalanceMRU}
                  </span>

                  <span className="text-[22px] font-bold">
                    {" / "}
                    {remainingBalanceEUR}
                  </span>
                </>
              }
            />

            <ZakatInfoRow
              label="Montant total versé ce mois"
              value={
                <>
                  <span className="text-[18px] font-semibold">
                    {monthlyDistributedMRU}
                  </span>

                  <span className="text-[16px] font-semibold">
                    {" / "}
                    {monthlyDistributedEUR}
                  </span>
                </>
              }
            />

            <ZakatInfoRow
              label="Familles bénéficiaires ce mois"
              value={beneficiaryFamilies}
            />

            <ZakatInfoRow
              label="Taux de change actuel"
              value={exchangeRate}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ZakatCard;