export default function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`
        relative
        w-[44px]
        h-[24px]
        shrink-0
        rounded-full
        transition-colors
        duration-200
        ${checked ? "bg-[#67A7A3]" : "bg-[#D7DEDC]"}
      `}
    >
      <span
        className={`
          absolute
          top-[3px]
          left-[3px]
          w-[18px]
          h-[18px]
          rounded-full
          bg-white
          shadow
          transition-transform
          duration-200
          ${checked ? "translate-x-[20px]" : "translate-x-0"}
        `}
      />
    </button>
  );
}
