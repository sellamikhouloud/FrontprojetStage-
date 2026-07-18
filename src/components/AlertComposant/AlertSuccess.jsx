import Success from "../assets/Success.svg";

export default function AlertSuccess() {
    return(
      <div className="
      w-[561px]
      h-[442px]
      bg-white
      rounded-[20px]
      px-[67px]
      py-[26px]
      flex
      flex-col
      justify-center
      items-center
      gap-[26px]
      ">
        
      {/* Title */}
      <h1 className="text-[28px] font-bold text-black">
        Enregistrer avec succès
      </h1>

      {/* Illustration */}
      <img
        src={Success}
        alt="Success"
        className="w-[196.08] h-"
      />

      {/* Identifier */}
      <p className="text-[22px] font-semibold text-black">
        L’identifiant effectué : GDK-2026-003
      </p>

      {/* Primary button */}
      <button
        className="
          w-[284.31px]
          h-[60px]
          bg-[#22C55E]
          rounded-[21px]
          text-white
          text-[20px]
          font-semibold
          hover:opacity-90
          transition
        "
      >
        Voir la fiche de la famille
      </button>

      {/* Secondary button */}
      <button
        className="
          w-[284.31px]
          h-[60px]
          border-[#4E9F8A]
          rounded-[21px]
          border-[2px]
          text-[#4E9F8A]
          text-[20px]
          font-semibold
          hover:bg-[#4E9F8A]/5
          transition
        "
      >
        Revenir à l’accueil
      </button>

      </div>
    );
}
