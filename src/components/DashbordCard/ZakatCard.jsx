import ZakatInfoRow from "../ZakatInfoRow";

const ZakatCard = ({
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
      className="
        w-full
        bg-[#F8FBFC]
        rounded-[20px]
        px-[15px]
        py-[18px]
        shadow-sm
        hover:shadow-md
        hover:scale-[1.01]
        transition-all
        duration-200
        cursor-pointer
        text-left
        border
        border-[#BCCAC14D]
      "
    >
      {/* Header */}
      <h2
        className="
          text-[24px]
          font-semibold
          leading-[28px]
          mb-[20px]
        "
      >
        {title}
      </h2>

      {/* Content */}
      <div className="flex flex-col gap-[20px]">

        <ZakatInfoRow
          label="Solde restant"
          value={
            <>
              <span className="text-[28px] font-extrabold">
                {remainingBalanceMRU}
              </span>

              <span className="text-[24px] font-bold leading-[30px]">
                {" /"}
                {remainingBalanceEUR}
              </span>
            </>
          }
        />

        <ZakatInfoRow
          label="Montant total versé ce mois"
          value={
            <>
              <span className="text-[18px] font-semibold leading-[30px]">
                {monthlyDistributedMRU}
              </span>

              <span className="text-[16px] font-semibold leading-[30px]">
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
    </button>
  );
};

export default ZakatCard;