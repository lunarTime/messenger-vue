import messageSoundUrl from "@/shared/assets/sounds/message_sound.mp3";

const THROTTLE_MS = 2000;

let audio: HTMLAudioElement | null = null;
let lastPlayedAt = 0;
let unlocked = false;
let unlockListenersAttached = false;

function getAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio(messageSoundUrl);
    audio.preload = "auto";
    audio.volume = 0.6;
  }

  return audio;
}

function unlockAudio(): void {
  if (unlocked) return;

  unlocked = true;

  try {
    const el = getAudio();

    el.muted = true;

    const promise = el.play();

    if (promise && typeof promise.then === "function") {
      promise
        .then(() => {
          el.pause();

          el.currentTime = 0;
          el.muted = false;
        })
        .catch(() => {
          el.muted = false;
          unlocked = false;
        });
    } else {
      el.pause();

      el.currentTime = 0;
      el.muted = false;
    }
  } catch {
    unlocked = false;
  }

  detachUnlockListeners();
}

function attachUnlockListeners(): void {
  if (unlockListenersAttached || typeof window === "undefined") return;

  unlockListenersAttached = true;

  window.addEventListener("pointerdown", unlockAudio, { once: false });
  window.addEventListener("keydown", unlockAudio, { once: false });
  window.addEventListener("touchstart", unlockAudio, {
    once: false,
    passive: true,
  });
}

function detachUnlockListeners(): void {
  if (!unlockListenersAttached || typeof window === "undefined") return;

  unlockListenersAttached = false;

  window.removeEventListener("pointerdown", unlockAudio);
  window.removeEventListener("keydown", unlockAudio);
  window.removeEventListener("touchstart", unlockAudio);
}

attachUnlockListeners();

export function playIncomingMessageSound(): void {
  const now = Date.now();

  if (now - lastPlayedAt < THROTTLE_MS) return;

  lastPlayedAt = now;

  try {
    const el = getAudio();

    el.currentTime = 0;

    const promise = el.play();

    if (promise && typeof promise.catch === "function") {
      promise.catch(() => {
        unlocked = false;

        attachUnlockListeners();
      });
    }
  } catch {
    console.log("Error sound play");
  }
}
