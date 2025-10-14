'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiSkipBack,
  FiSkipForward,
  FiDownload,
  FiRepeat,
  FiGift
} from 'react-icons/fi'
import GlassmorphicCard from '@/components/ui/GlassmorphicCard'

interface AudioPlayerProps {
  audioUrl: string
  title: string
  brand?: string
  duration?: number
  offerTimestamp?: number | null
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  className?: string
}

export default function AudioPlayer({
  audioUrl,
  title,
  brand,
  duration: initialDuration,
  offerTimestamp,
  onPlay,
  onPause,
  onEnded,
  className = ''
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(initialDuration || 0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isLooping, setIsLooping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [frequencyData, setFrequencyData] = useState<number[]>(new Array(32).fill(0))

  useEffect(() => {
    if (!audioRef.current) return

    const audio = audioRef.current

    // Setup audio context and analyser for visualizer
    if (!audioContextRef.current) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 64

      const source = audioContext.createMediaElementSource(audio)
      source.connect(analyser)
      analyser.connect(audioContext.destination)

      audioContextRef.current = audioContext
      analyserRef.current = analyser
    }

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => {
      setIsPlaying(false)
      onEnded?.()
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [onEnded])

  // Update visualizer
  useEffect(() => {
    if (!isPlaying || !analyserRef.current) return

    const analyser = analyserRef.current
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const updateVisualizer = () => {
      analyser.getByteFrequencyData(dataArray)
      const normalizedData = Array.from(dataArray.slice(0, 32)).map(value => value / 255)
      setFrequencyData(normalizedData)
      animationFrameRef.current = requestAnimationFrame(updateVisualizer)
    }

    updateVisualizer()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isPlaying])

  const togglePlay = async () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      onPause?.()
    } else {
      // Resume audio context if suspended
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume()
      }
      audioRef.current.play()
      setIsPlaying(true)
      onPlay?.()
    }
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    const newMuted = !isMuted
    audioRef.current.muted = newMuted
    setIsMuted(newMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    if (newVolume === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate)
    if (audioRef.current) {
      audioRef.current.playbackRate = rate
    }
  }

  const toggleLoop = () => {
    setIsLooping(!isLooping)
    if (audioRef.current) {
      audioRef.current.loop = !isLooping
    }
  }

  const skipToOffer = () => {
    if (!audioRef.current || !offerTimestamp) return
    audioRef.current.currentTime = offerTimestamp
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const skip = (seconds: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <GlassmorphicCard className="p-8">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Frequency Visualizer */}
      <div className="mb-8 h-32 flex items-end justify-center gap-1">
        {frequencyData.map((value, index) => (
          <motion.div
            key={index}
            className="flex-1 rounded-t-full bg-gradient-to-t from-[#00d4ff] via-[#00ff88] to-[#00d4ff]"
            animate={{
              height: `${Math.max(8, value * 100)}%`,
              opacity: isPlaying ? 0.8 : 0.3
            }}
            transition={{
              duration: 0.1,
              ease: 'easeOut'
            }}
            style={{
              maxWidth: '8px',
              boxShadow: isPlaying ? `0 0 ${10 + value * 20}px rgba(0, 212, 255, ${value})` : 'none'
            }}
          />
        ))}
      </div>

      {/* Track Info */}
      <div className="text-center mb-6">
        <motion.h3
          className="text-2xl font-bold text-white mb-2"
          animate={{
            scale: isPlaying ? [1, 1.02, 1] : 1
          }}
          transition={{
            duration: 2,
            repeat: isPlaying ? Infinity : 0
          }}
        >
          {title}
        </motion.h3>
        {brand && (
          <p className="text-[#94a3b8] text-sm">
            {brand}
          </p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10"
          style={{
            background: `linear-gradient(to right,
              #00d4ff 0%,
              #00d4ff ${(currentTime / duration) * 100}%,
              rgba(255,255,255,0.1) ${(currentTime / duration) * 100}%,
              rgba(255,255,255,0.1) 100%)`
          }}
        />
        <div className="flex justify-between text-sm text-[#94a3b8] mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mb-6">
        {/* Skip Back */}
        <motion.button
          onClick={() => skip(-10)}
          className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiSkipBack className="text-xl" />
        </motion.button>

        {/* Play/Pause */}
        <motion.button
          onClick={togglePlay}
          className="relative p-6 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88] text-white shadow-2xl shadow-[#00d4ff]/50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            boxShadow: isPlaying
              ? [
                  '0 0 20px rgba(0, 212, 255, 0.5)',
                  '0 0 40px rgba(0, 212, 255, 0.8)',
                  '0 0 20px rgba(0, 212, 255, 0.5)',
                ]
              : '0 0 20px rgba(0, 212, 255, 0.3)'
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="pause"
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 180, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FiPause className="text-3xl" />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 180, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FiPlay className="text-3xl" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Skip Forward */}
        <motion.button
          onClick={() => skip(10)}
          className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiSkipForward className="text-xl" />
        </motion.button>

        {/* Skip to Offer */}
        {offerTimestamp && (
          <motion.button
            onClick={skipToOffer}
            className="p-3 rounded-full bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-white hover:opacity-90 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Skip to offer"
          >
            <FiGift className="text-xl" />
          </motion.button>
        )}

        {/* Download */}
        <motion.a
          href={audioUrl}
          download
          className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiDownload className="text-xl" />
        </motion.a>
      </div>

      {/* Additional Controls */}
      <div className="flex items-center justify-between gap-4 mb-6">
        {/* Playback Speed */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#94a3b8]">Speed:</span>
          <div className="flex gap-1">
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
              <motion.button
                key={rate}
                onClick={() => handlePlaybackRateChange(rate)}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  playbackRate === rate
                    ? 'bg-[#00d4ff] text-white'
                    : 'bg-white/10 text-[#94a3b8] hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {rate}x
              </motion.button>
            ))}
          </div>
        </div>

        {/* Loop Toggle */}
        <motion.button
          onClick={toggleLoop}
          className={`p-2 rounded-full transition-all ${
            isLooping
              ? 'bg-[#00ff88] text-white'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={isLooping ? 'Loop enabled' : 'Loop disabled'}
        >
          <FiRepeat className="text-lg" />
        </motion.button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-4">
        <motion.button
          onClick={toggleMute}
          className="p-2 rounded-full text-white hover:bg-white/10 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMuted || volume === 0 ? (
            <FiVolumeX className="text-xl" />
          ) : (
            <FiVolume2 className="text-xl" />
          )}
        </motion.button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right,
              #00d4ff 0%,
              #00d4ff ${volume * 100}%,
              rgba(255,255,255,0.1) ${volume * 100}%,
              rgba(255,255,255,0.1) 100%)`
          }}
        />
      </div>
    </GlassmorphicCard>
  )
}
