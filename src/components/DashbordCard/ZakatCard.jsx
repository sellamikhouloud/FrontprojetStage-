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
      className="w-full rounded-[24px] border border-[#DDE7EE] bg-[#F8FAFC] p-6 text-left shadow-sm"
    >
      {/* Header */}

      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[24px] font-semibold leading-[28px] text-[#171D1A]">
          {title}
        </h2>

        {/* Coordinator */}
        {variant === "coordinator" && (
          <div className="text-right">
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