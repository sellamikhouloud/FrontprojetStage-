const Button = ({
  title,
  icon,
  iconPosition = "left",
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  fullWidth = true,
  noPadding = false,
}) => {
  const variants = {
    // Enregistrer
    primary: `
      bg-[#4E9F8A]
      text-white
      hover:bg-[#458f7b]
    `,

    // Historique
    secondary: `
      bg-[#B5C8C7]
      text-white
      hover:bg-[#a7bdbc]
    `,

    // Modifier Image
    modifier: `
      bg-[#7BC8C4]
      text-white
    `,

    // Supprimer Image
    supprimer: `
      bg-[#FFFFFF]
      text-[#EF4444]
      border
      border-[#EF4444]
    `,

    // Filtrer
    filter: `
      bg-[#4E9F8A]
      text-[#FBFDFF]
      border
      border-[#4E9F8A]
      hover:bg-[#458f7b]
    `,

    // Annuler les filtres
    outline: `
      bg-[#F2FAFA]
      text-[#4E9F8A]
      border
      border-[#4E9F8A]
      hover:bg-[#EAF7F7]
    `,

    // Toutes
    all: `
      bg-[#4E9F8A]
      text-white
    `,

    // Validées
    validated: `
      bg-[#E8F7EF]
      text-[#22C55E]
      border
      border-[#22C55E]
    `,

    // En attente
    EnAttente: `
      bg-[#FFF4D8]
      text-[#F59E0B]
      border
      border-[#F59E0B]
    `,

    // Refusées
    refused: `
      bg-[#FDECEC]
      text-[#E85D5D]
      border
      border-[#E85D5D]
    `,

    // Confirmer
    confirm: `
      bg-[#4E9F8A]
      text-white
      hover:bg-[#458f7b]
    `,

    // Changer
    changer: `
      bg-[#B5ECC9]
      text-[#22C55E]
      border
      border-[#22C55E]
      rounded-[24px]
      h-[39px]
    `,

    // Photo refusée
    refusee: `
      bg-[#FAC1C1]
      text-[#EF4444]
      border
      border-[#E85D5D]
      rounded-[24px]
      h-[39px]
    `,

    // Ajouter Produit
    ajouter: `
      bg-white
      text-[#525252]
      text-[16px]
      leading-[20px]
      font-bold
      border
      border-dashed
      border-[#52525299]
      hover:bg-[#F8F8F8]
    `,

    // Enregistrer les modifications
    save: `
      bg-[#4E9F8A]
      text-white
      hover:bg-[#458f7b]
    `,
  };

  const wrapper =
    variant === "changer"
      ? "inline-block"
      : variant === "confirm"
      ? `
          w-full
          py-2
        `
      : noPadding
      ? `
          w-full
          py-2
        `
      : variant === "primary" ||
        variant === "secondary" ||
        variant === "ajouter" ||
        variant === "save"
      ? `
          flex
          items-center
          w-full
          px-4
          lg:pl-50
          lg:pr-5
          py-2
        `
      : `
          flex
          items-center
          w-full
          pr-[15px]
          pl-[15px]
        `;

  return (
    <div className={wrapper}>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`
          ${fullWidth ? "w-full" : "inline-flex"}

          flex
          items-center
          justify-center
          gap-2

         px-3
sm:px-4
lg:px-5

h-[38px]
sm:h-[42px]
lg:h-[45px]

rounded-[12px]
sm:rounded-[14px]
lg:rounded-[15px]

font-semibold
text-[12px]
sm:text-[14px]
lg:text-[16px]

          shadow-md

          transition-all
          duration-200
          ease-in-out

          hover:brightness-95
          active:scale-[0.99]
          active:brightness-90

          disabled:opacity-50
          disabled:cursor-not-allowed
          disabled:hover:scale-100
          disabled:active:scale-100

          whitespace-nowrap

          ${variants[variant]}
        `}
      >
        {iconPosition === "left" && icon && (
  <img
    src={icon}
    alt=""
    className="w-4 h-4 object-contain"
  />
)}

<span>{title}</span>

{iconPosition === "right" && icon && (
  <img
    src={icon}
    alt=""
    className="w-4 h-4 object-contain"
  />
)}
      </button>
    </div>
  );
};

export default Button;
