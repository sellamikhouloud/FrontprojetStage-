
const Button = ({
  title,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
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
  };

  // Les boutons Enregistrer et Historique gardent leur ancien padding
  const wrapper =
    variant === "primary" || variant === "secondary"
      ? `
        flex items-center

        w-full

        px-4
        lg:pl-50
        lg:pr-5

        py-2
      `
      : `
        flex items-center

        w-full

        px-4
        lg:pl-300
        lg:pr-5

        py-2
      `;

  return (
    <div className={wrapper}>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`
          w-full
          h-[45px]

          rounded-[15px]

          font-semibold

          text-[14px]
          sm:text-[15px]
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

          ${variants[variant]}
        `}
      >
        {title}
      </button>
    </div>
  );
};

export default Button; 
