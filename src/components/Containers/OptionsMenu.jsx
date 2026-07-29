import { AnimatePresence, motion } from "framer-motion";
import Options from "./Options";

/**
 * Small anchored dropdown menu — no backdrop, no blur.
 * Fully generic: pass whatever `options` + `onSelect` you need.
 * Must be rendered inside a `relative` wrapper around whatever it should
 * anchor to (a card, a button, an avatar, etc).
 *
 * Props:
 * - open        : boolean, controls visibility
 * - onClose     : called on outside click or after an option is selected
 * - options     : [{ label, value }]  (passed straight to <Options />)
 * - onSelect    : (value) => void
 * - position    : Tailwind classes for anchor placement (default: top-right corner)
 * - width       : Tailwind width class (default: "w-[220px]")
 * - className   : extra classes appended to the menu panel
 */
const OptionsMenu = ({
  open,
  onClose,
  options = [],
  onSelect,
  position = "top-3 right-3",
  width = "w-[220px]",
  className = "",
}) => {
  const handleSelect = (value) => {
    onSelect(value);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* invisible click-catcher to close on outside click — no bg, no blur */}
          <div className="fixed inset-0 z-40" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className={`
              absolute
              ${position}
              z-50

              ${width}

              bg-white
              rounded-[14px]
              shadow-[0_4px_20px_rgba(0,0,0,0.12)]
              border
              border-[#E5E7EB]

              overflow-hidden

              ${className}
            `}
          >
            <Options options={options} handleSelect={handleSelect} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OptionsMenu;