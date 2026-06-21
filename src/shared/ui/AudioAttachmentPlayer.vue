<script setup lang="ts">
import { computed, ref } from "vue";
import type { MessageAttachment } from "@/shared/types/message";

const props = defineProps<{
  attachment: MessageAttachment;
  isOutgoing: boolean;
}>();

const emit = defineEmits<{
  download: [attachment: MessageAttachment];
}>();

const audio = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(1);
let previousVolume = 1;

const progress = computed(() =>
  duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0,
);

const progressStyle = computed(() => ({
  "--audio-progress": `${progress.value}%`,
}));

const volumeStyle = computed(() => ({
  "--audio-volume": `${volume.value * 100}%`,
}));

const volumeIcon = computed(() => {
  if (volume.value === 0) return "pi-volume-off";
  if (volume.value < 0.5) return "pi-volume-down";

  return "pi-volume-up";
});

function formatTime(value: number): string {
  if (!Number.isFinite(value) || value < 0) return "0:00";

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

async function togglePlayback() {
  if (!audio.value) return;

  if (audio.value.paused) {
    try {
      await audio.value.play();
    } catch (error) {
      console.error("Audio playback failed:", error);
    }
  } else {
    audio.value.pause();
  }
}

function updateMetadata() {
  duration.value = audio.value?.duration ?? 0;
}

function updateTime() {
  currentTime.value = audio.value?.currentTime ?? 0;
}

function seek(event: Event) {
  const target = event.target as HTMLInputElement;
  const nextTime = Number(target.value);

  if (!audio.value || !Number.isFinite(nextTime)) return;

  audio.value.currentTime = nextTime;
  currentTime.value = nextTime;
}

function setVolume(event: Event) {
  const target = event.target as HTMLInputElement;
  const nextVolume = Number(target.value);

  if (!audio.value || !Number.isFinite(nextVolume)) return;

  volume.value = nextVolume;
  audio.value.volume = nextVolume;

  if (nextVolume > 0) previousVolume = nextVolume;
}

function toggleMute() {
  if (!audio.value) return;

  if (volume.value > 0) {
    previousVolume = volume.value;
    volume.value = 0;
  } else {
    volume.value = previousVolume || 1;
  }

  audio.value.volume = volume.value;
}

function finishPlayback() {
  isPlaying.value = false;
  currentTime.value = 0;
}
</script>

<template>
  <div
    data-message-gesture-ignore
    class="audio-player w-full max-w-sm rounded-2xl px-3 py-2.5"
    :class="
      isOutgoing
        ? 'bg-white/12 dark:text-white'
        : 'bg-(--p-primary-color)/10 text-(--p-text-color)'
    "
  >
    <audio
      ref="audio"
      :src="attachment.url"
      preload="metadata"
      @loadedmetadata="updateMetadata"
      @durationchange="updateMetadata"
      @timeupdate="updateTime"
      @play="isPlaying = true"
      @pause="isPlaying = false"
      @ended="finishPlayback"
    />

    <div class="flex items-center gap-3">
      <button
        type="button"
        class="flex size-11 shrink-0 items-center justify-center rounded-full bg-(--p-primary-color) text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
        :aria-label="isPlaying ? 'Пауза' : 'Воспроизвести'"
        @click="togglePlayback"
      >
        <i :class="['pi text-sm', isPlaying ? 'pi-pause' : 'pi-play ml-0.5']" />
      </button>

      <div class="min-w-0 flex-1">
        <div class="mb-1.5 flex items-center gap-2">
          <span
            class="min-w-0 flex-1 truncate text-sm font-medium"
            :title="attachment.name"
          >
            {{ attachment.name }}
          </span>
          <button
            type="button"
            class="flex size-7 shrink-0 items-center justify-center rounded-full opacity-65 transition hover:bg-black/10 hover:opacity-100 dark:hover:bg-white/10"
            aria-label="Скачать аудиофайл"
            title="Скачать"
            @click="emit('download', attachment)"
          >
            <i class="pi pi-download text-xs" />
          </button>
        </div>

        <input
          class="audio-progress block w-full cursor-pointer"
          type="range"
          min="0"
          :max="duration || 0"
          step="0.1"
          :value="currentTime"
          :style="progressStyle"
          aria-label="Позиция воспроизведения"
          @input="seek"
        />

        <div
          class="mt-1 flex items-center text-[0.65rem] tabular-nums opacity-60"
        >
          <span>{{ formatTime(currentTime) }}</span>
          <div class="mx-auto flex items-center gap-1.5">
            <button
              type="button"
              class="flex size-5 items-center justify-center rounded-full transition hover:bg-black/10 dark:hover:bg-white/10"
              :aria-label="volume === 0 ? 'Включить звук' : 'Выключить звук'"
              @click="toggleMute"
            >
              <i :class="['pi text-[0.65rem]', volumeIcon]" />
            </button>
            <input
              class="volume-progress w-16 cursor-pointer"
              type="range"
              min="0"
              max="1"
              step="0.05"
              :value="volume"
              :style="volumeStyle"
              aria-label="Громкость"
              @input="setVolume"
            />
          </div>
          <span>{{ formatTime(duration) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.audio-progress {
  height: 0.3rem;
  appearance: none;
  border-radius: 9999px;
  background: linear-gradient(
    to right,
    var(--p-primary-color) 0 var(--audio-progress),
    color-mix(in srgb, currentColor 18%, transparent) var(--audio-progress) 100%
  );
}

.audio-progress::-webkit-slider-thumb {
  width: 0.8rem;
  height: 0.8rem;
  appearance: none;
  border: 2px solid white;
  border-radius: 9999px;
  background: var(--p-primary-color);
  box-shadow: 0 1px 4px rgb(0 0 0 / 25%);
}

.audio-progress::-moz-range-thumb {
  width: 0.65rem;
  height: 0.65rem;
  border: 2px solid white;
  border-radius: 9999px;
  background: var(--p-primary-color);
  box-shadow: 0 1px 4px rgb(0 0 0 / 25%);
}

.volume-progress {
  height: 0.2rem;
  appearance: none;
  border-radius: 9999px;
  background: linear-gradient(
    to right,
    currentColor 0 var(--audio-volume),
    color-mix(in srgb, currentColor 18%, transparent) var(--audio-volume) 100%
  );
}

.volume-progress::-webkit-slider-thumb {
  width: 0.6rem;
  height: 0.6rem;
  appearance: none;
  border: 1px solid white;
  border-radius: 9999px;
  background: var(--p-primary-color);
}

.volume-progress::-moz-range-thumb {
  width: 0.5rem;
  height: 0.5rem;
  border: 1px solid white;
  border-radius: 9999px;
  background: var(--p-primary-color);
}
</style>
