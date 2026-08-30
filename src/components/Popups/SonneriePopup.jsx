import { useState } from "react";
import { AVAILABLE_SOUNDS, previewNotificationSound } from "../../lib/notificationSound";
import quitter from "../../assets/quitter.svg";
import { AiOutlinePlayCircle, AiOutlinePauseCircle } from "react-icons/ai";

export default function SonneriePopup({ currentValue, onSelect, onClose }) {
  const [playingValue, setPlayingValue] = useState(null);

  const handlePreview = (soundValue) => {
    setPlayingValue(soundValue);
    previewNotificationSound(soundValue, () => {
      setPlayingValue((prev) => (prev === soundValue ? null : prev));
    });
  };

  return (
    <div
      className="
        fixed inset-0 z-[70]
        bg-transparent sm:bg-black/40
        flex items-start sm:items-center
        justify-center
        overflow-y-auto
      "
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full
          min-h-screen

          sm:min-h-0
          sm:w-[420px]

          bg-white
          rounded-none sm:rounded-[20px]
          border-0 sm:border
          overflow-hidden
        "
        style={{ borderColor: "#4E9F8A" }}
      >
        <div className="p-5">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-[16px] font-medium mb-4"
          >
            <img src={quitter} alt="Fermer" className="w-5 h-5" />
            Fermer
          </button>

          <h2 className="text-center text-[20px] font-bold mb-4">
            Choisir une sonnerie
          </h2>

          <div className="flex flex-col gap-2">
            {AVAILABLE_SOUNDS.map((sound) => {
              const isSelected = sound.value === currentValue;
              return (
                <div
                  key={sound.value}
                  className={`
                    flex items-center justify-between
                    rounded-[12px] border px-4 py-3
                    cursor-pointer
                    ${isSelected ? "border-[#4E9F8A] bg-[#EAF7F3]" : "border-[#E5EAE8] bg-white"}
                  `}
                  onClick={() => onSelect(sound.value)}
                >
                  <span className={`text-[15px] font-medium ${isSelected ? "text-[#4E9F8A]" : "text-[#3E4946]"}`}>
                    {sound.label}
                  </span>

                                   <button
                    type="button"
                    aria-label={`Écouter ${sound.label}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview(sound.value);
                    }}
                    className="text-[#4E9F8A] hover:opacity-70"
                  >
                    {playingValue === sound.value ? (
                      <AiOutlinePauseCircle size={22} />
                    ) : (
                      <AiOutlinePlayCircle size={22} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}