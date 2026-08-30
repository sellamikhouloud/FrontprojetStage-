// The full list of available sounds. Values must match the CharField values
// stored on PreferenceUtilisateur.sonnerie_notifications on the backend.
export const AVAILABLE_SOUNDS = [
  { value: "defaut", label: "Défaut", file: "/sounds/defaut.mp3" },
  { value: "chime",  label: "Chime",  file: "/sounds/chime.mp3" },
  { value: "bell",   label: "Cloche", file: "/sounds/bell.mp3" },
  { value: "ping",   label: "Notification",   file: "/sounds/notification.mp3" },
];

function getFileForValue(value) {
  const found = AVAILABLE_SOUNDS.find((s) => s.value === value);
  return (found ?? AVAILABLE_SOUNDS[0]).file;
}

let audioEl = null;
let currentSoundValue = "defaut";

function getAudio() {
  if (!audioEl && typeof window !== "undefined") {
    audioEl = new Audio(getFileForValue(currentSoundValue));
    audioEl.volume = 0.7;
    audioEl.preload = "auto";
  }
  return audioEl;
}

// Pre-warm the audio on the first user interaction — browsers block audio
// until the user has clicked/tapped/typed something. On écoute plusieurs
// types d'événements pour maximiser les chances de capturer la toute
// première interaction (clic, touche clavier, tap tactile).
if (typeof window !== "undefined") {
  const warmUpAudio = () => {
    getAudio();
    window.removeEventListener("pointerdown", warmUpAudio);
    window.removeEventListener("keydown", warmUpAudio);
    window.removeEventListener("touchstart", warmUpAudio);
  };

  window.addEventListener("pointerdown", warmUpAudio, { once: true });
  window.addEventListener("keydown", warmUpAudio, { once: true });
  window.addEventListener("touchstart", warmUpAudio, { once: true });
}

export function setNotificationSound(soundValue) {
  currentSoundValue = soundValue;
  if (audioEl) {
    audioEl.src = getFileForValue(soundValue);
    audioEl.load();
  }
}

export function playNotificationSound() {
  try {
    const a = getAudio();
    if (!a) { console.warn("🔇 Pas d'audio disponible"); return; }
    a.currentTime = 0;
    a.play()
      .then(() => console.log("🔊 Son joué avec succès"))
      .catch((err) => console.warn("🔇 Lecture bloquée :", err));
  } catch (e) {
    console.error("🔇 Erreur playNotificationSound:", e);
  }
}

// Accepte un callback optionnel appelé quand la lecture se termine (ou échoue).
export function previewNotificationSound(soundValue, onEnded) {
  try {
    const preview = new Audio(getFileForValue(soundValue));
    preview.volume = 0.7;

    if (onEnded) {
      preview.addEventListener("ended", onEnded);
    }

    preview.play().catch(() => {
      onEnded?.();
    });
  } catch (_) {
    onEnded?.();
  }
}