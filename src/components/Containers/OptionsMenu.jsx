import { AnimatePresence, motion } from "framer-motion";
import Options from "./Options";

const OptionsMenu = ({
  open,
  onClose,
  options = [],
  onSelect,
  position = "top-3 right-3",
  width = "w-[220px]",
  maxHeight = null,
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
            <div
              className={maxHeight ? "overflow-y-auto" : ""}
              style={maxHeight ? { maxHeight } : undefined}
            >
              <Options options={options} handleSelect={handleSelect} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OptionsMenu;
