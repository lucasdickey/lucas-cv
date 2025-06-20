"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

interface AudioPlayerProps {
  audioSrc: string
  title: string
  description: string
}

export default function AudioPlayer({ audioSrc, title, description }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const setAudioData = () => {
      setDuration(audio.duration)
      setCurrentTime(audio.currentTime)
      setIsLoaded(true)
    }

    const setAudioTime = () => setCurrentTime(audio.currentTime)

    audio.addEventListener('loadeddata', setAudioData)
    audio.addEventListener('timeupdate', setAudioTime)

    return () => {
      audio.removeEventListener('loadeddata', setAudioData)
      audio.removeEventListener('timeupdate', setAudioTime)
    }
  }, [])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.muted = !audio.muted
    setIsMuted(!isMuted)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = (parseFloat(e.target.value) / 100) * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="border border-[#cccccc] bg-[#f0f0e0] p-4 rounded-md shadow-sm">
      <audio ref={audioRef} src={audioSrc} />
      
      <div className="mb-3">
        <div className="text-[#8b0000] font-bold mb-1">{title}</div>
        <div className="text-[#666666] text-sm">{description}</div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={togglePlayPause}
          disabled={!isLoaded}
          className="flex items-center justify-center w-10 h-10 bg-[#e8e8d0] border border-[#cccccc] rounded hover:bg-[#e0e0d0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPlaying ? (
            <Pause size={18} className="text-[#333333]" />
          ) : (
            <Play size={18} className="text-[#333333] ml-0.5" />
          )}
        </button>

        <div className="flex-1 flex items-center gap-2">
          <span className="text-[#666666] text-sm font-mono min-w-[40px]">
            {formatTime(currentTime)}
          </span>
          
          <div className="flex-1 relative">
            <input
              type="range"
              min="0"
              max="100"
              value={progressPercentage}
              onChange={handleSeek}
              disabled={!isLoaded}
              className="w-full h-2 bg-[#cccccc] rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(to right, #8b0000 0%, #8b0000 ${progressPercentage}%, #cccccc ${progressPercentage}%, #cccccc 100%)`
              }}
            />
          </div>
          
          <span className="text-[#666666] text-sm font-mono min-w-[40px]">
            {isLoaded ? formatTime(duration) : '0:00'}
          </span>
        </div>

        <button
          onClick={toggleMute}
          disabled={!isLoaded}
          className="flex items-center justify-center w-8 h-8 hover:bg-[#e0e0d0] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isMuted ? (
            <VolumeX size={16} className="text-[#666666]" />
          ) : (
            <Volume2 size={16} className="text-[#666666]" />
          )}
        </button>
      </div>

      {!isLoaded && (
        <div className="text-[#666666] text-sm mt-2">Loading audio...</div>
      )}
    </div>
  )
}