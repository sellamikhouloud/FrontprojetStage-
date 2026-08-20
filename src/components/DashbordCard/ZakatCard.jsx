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
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left
        ${
          variant === "coordinator"
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
            `
        }
      `}
    >
      {/* Header */}
      <div
        className={`
          flex items-center justify-between
          ${
            variant === "coordinator"
              ? "mb-[8px] md:mb-5"
              : "mb-5"
          }
        `}
      >
        <h2
          className={`
            font-semibold text-[#171D1A]
            ${
              variant === "coordinator"
                ? "text-[16px] leading-[20px] md:text-[24px] md:leading-[28px]"
                : "text-[24px] leading-[28px]"
            }
          `}
        >
          {title}
        </h2>

        {/* Coordinator DESKTOP */}
        {variant === "coordinator" && (
          <div className="hidden text-right md:block">
            <span className="text-[28px] font-bold text-[#346A5C]">
              {remainingBalanceMRU}
            </span>

            <span className="text-[22px] font-bold text-[#346A5C]">
              {" / "}
              {remainingBalanceEUR}
            </span>
          </div>
        )}
      </div>

      {/* Coordinator MOBILE */}
      {variant === "coordinator" && (
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

      {/* Admin Content */}
      {variant === "admin" && (
        <div className="flex flex-col gap-[16px]">
          <ZakatInfoRow
            label="Solde restant"
            value={
              <>
                <span className="text-[26px] font-extrabold">
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
    </button>
  );
};

export default ZakatCard;