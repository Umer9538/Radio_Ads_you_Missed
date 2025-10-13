import { create } from 'zustand'
import { Howl } from 'howler'

interface AudioState {
  // Current playback state
  currentAdId: string | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  playbackRate: number
  howl: Howl | null

  // Actions
  setCurrentAd: (adId: string, audioUrl: string) => void
  play: () => void
  pause: () => void
  stop: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  setPlaybackRate: (rate: number) => void
  updateCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  cleanup: () => void
}

export const useAudioStore = create<AudioState>((set, get) => ({
  // Initial state
  currentAdId: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  playbackRate: 1,
  howl: null,

  // Set current ad and initialize audio
  setCurrentAd: (adId: string, audioUrl: string) => {
    const state = get()

    // Cleanup previous audio
    if (state.howl) {
      state.howl.unload()
    }

    // Create new Howl instance
    const howl = new Howl({
      src: [audioUrl],
      html5: true,
      volume: state.volume,
      rate: state.playbackRate,
      onplay: () => set({ isPlaying: true }),
      onpause: () => set({ isPlaying: false }),
      onend: () => set({ isPlaying: false, currentTime: 0 }),
      onload: function() {
        set({ duration: this.duration() })
      },
      onloaderror: (id, error) => {
        console.error('Audio load error:', error)
      },
      onplayerror: (id, error) => {
        console.error('Audio play error:', error)
      },
    })

    set({
      currentAdId: adId,
      howl,
      currentTime: 0,
      isPlaying: false,
    })
  },

  play: () => {
    const { howl } = get()
    if (howl) {
      howl.play()
    }
  },

  pause: () => {
    const { howl } = get()
    if (howl) {
      howl.pause()
    }
  },

  stop: () => {
    const { howl } = get()
    if (howl) {
      howl.stop()
      set({ currentTime: 0, isPlaying: false })
    }
  },

  seek: (time: number) => {
    const { howl } = get()
    if (howl) {
      howl.seek(time)
      set({ currentTime: time })
    }
  },

  setVolume: (volume: number) => {
    const { howl } = get()
    if (howl) {
      howl.volume(volume)
    }
    set({ volume })
  },

  setPlaybackRate: (rate: number) => {
    const { howl } = get()
    if (howl) {
      howl.rate(rate)
    }
    set({ playbackRate: rate })
  },

  updateCurrentTime: (time: number) => {
    set({ currentTime: time })
  },

  setDuration: (duration: number) => {
    set({ duration })
  },

  cleanup: () => {
    const { howl } = get()
    if (howl) {
      howl.unload()
    }
    set({
      currentAdId: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      howl: null,
    })
  },
}))
