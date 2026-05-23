import { useEffect, useRef, useState } from 'react'
import receiptIcon from 'pixelarticons/svg/receipt.svg'
import mapPinIcon from 'pixelarticons/svg/map-pin-home.svg'
import modemIcon from 'pixelarticons/svg/modem.svg'
import warningIcon from 'pixelarticons/svg/warning-diamond.svg'
import calendarIcon from 'pixelarticons/svg/calendar-2-sharp.svg'
import userIcon from 'pixelarticons/svg/user.svg'
import volumeIcon from 'pixelarticons/svg/volume-2.svg'
import megaphoneIcon from 'pixelarticons/svg/megaphone.svg'
import chevronDownIcon from 'pixelarticons/svg/chevron-down.svg'
import './App.css'

type DemoTrack = {
  id: string
  title: string
  description: string
  tags: string[]
  date: string
  audioSrc: string
  icon: string
}

const recordingBase =
  '/assets/recordings/019e3681-fab2-7000-ad91-f1b197497e2d-1779031062241-25cab87b-ec50-4bba-8033-1ef3e3861a1c-mono'

const DEFAULT_EXPANDED = false

const tracks: DemoTrack[] = [
  {
    id: 'payments',
    title: 'Información de próximos pagos',
    description: 'El agente informa montos, fechas límite y opciones de pago sin transferir al cliente.',
    tags: ['pagos', 'autoservicio'],
    date: 'Hoy, 10:24 AM',
    audioSrc: `${recordingBase}-part01.wav`,
    icon: receiptIcon,
  },
  {
    id: 'address',
    title: 'Localización de dirección',
    description: 'Guía al usuario para confirmar cobertura, domicilio y referencias de instalación.',
    tags: ['cobertura', 'instalación'],
    date: 'Hoy, 9:08 AM',
    audioSrc: `${recordingBase}-part02.wav`,
    icon: mapPinIcon,
  },
  {
    id: 'packages',
    title: 'Paquetes de internet',
    description: 'Presenta planes disponibles, velocidad, beneficios y siguiente paso comercial.',
    tags: ['ventas', 'planes'],
    date: 'Ayer, 4:55 PM',
    audioSrc: `${recordingBase}-part03.wav`,
    icon: modemIcon,
  },
  {
    id: 'outage',
    title: 'Notificación de incidencias masivas',
    description: 'Cuando hay alguna falla, el agente puede explicar la caída de servicio por zona.',
    tags: ['incidencia', 'soporte'],
    date: 'Ayer, 2:12 PM',
    audioSrc: `${recordingBase}-part04.wav`,
    icon: warningIcon,
  },
  {
    id: 'appointment',
    title: 'Agenda de visita técnica',
    description: 'Ayuda a coordinar disponibilidad, ventanas de atención y confirmación de cita.',
    tags: ['agenda', 'técnico'],
    date: '22 may, 11:40 AM',
    audioSrc: `${recordingBase}-part05.wav`,
    icon: calendarIcon,
  },
  {
    id: 'identity',
    title: 'Validación de titular',
    description: 'Confirma datos mínimos del cliente antes de revelar información sensible de cuenta.',
    tags: ['seguridad', 'CRM'],
    date: '22 may, 10:15 AM',
    audioSrc: `${recordingBase}-part06.wav`,
    icon: userIcon,
  },
  {
    id: 'service-status',
    title: 'Estado actual del servicio',
    description: 'Consulta y comunica si el servicio se encuentra activo, suspendido o en revisión.',
    tags: ['servicio', 'cuenta'],
    date: '21 may, 5:30 PM',
    audioSrc: `${recordingBase}-part07.wav`,
    icon: volumeIcon,
  },
  {
    id: 'escalation',
    title: 'Escalamiento a soporte',
    description: 'Detecta cuándo hace falta intervención humana y prepara el contexto para soporte.',
    tags: ['soporte', 'transferencia'],
    date: '21 may, 3:05 PM',
    audioSrc: `${recordingBase}-part08.wav`,
    icon: megaphoneIcon,
  },
]

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const remaining = Math.floor(seconds % 60)
  return `${minutes}:${remaining.toString().padStart(2, '0')}`
}

function Tag({ label }: { label: string }) {
  return <span className="tag">{label}</span>
}

const waveformCache = new Map<string, number[]>()

function getAudioContext() {
  const AudioContextConstructor = window.AudioContext ?? window.webkitAudioContext
  return new AudioContextConstructor()
}

function calculatePeaks(buffer: AudioBuffer, barCount = 64) {
  const channelData = Array.from({ length: buffer.numberOfChannels }, (_, channel) =>
    buffer.getChannelData(channel),
  )
  const samplesPerBar = Math.max(1, Math.floor(buffer.length / barCount))
  const peaks = Array.from({ length: barCount }, (_, barIndex) => {
    const start = barIndex * samplesPerBar
    const end = Math.min(start + samplesPerBar, buffer.length)
    let peak = 0

    for (let index = start; index < end; index += 1) {
      for (const channel of channelData) {
        peak = Math.max(peak, Math.abs(channel[index] ?? 0))
      }
    }

    return peak
  })

  const maxPeak = Math.max(...peaks, 0.001)
  return peaks.map((peak) => {
    const normalized = Math.sqrt(peak / maxPeak)
    return Math.max(5, Math.round(normalized * 24))
  })
}

function useAudioPeaks(audioSrc: string) {
  const [peaks, setPeaks] = useState<number[]>(() => waveformCache.get(audioSrc) ?? [])

  useEffect(() => {
    const abortController = new AbortController()

    if (waveformCache.has(audioSrc)) {
      queueMicrotask(() => {
        if (!abortController.signal.aborted) setPeaks(waveformCache.get(audioSrc) ?? [])
      })
      return () => abortController.abort()
    }

    async function loadPeaks() {
      try {
        const response = await fetch(audioSrc, { signal: abortController.signal })
        const arrayBuffer = await response.arrayBuffer()
        const audioContext = getAudioContext()
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
        await audioContext.close()
        const nextPeaks = calculatePeaks(audioBuffer)
        waveformCache.set(audioSrc, nextPeaks)
        if (!abortController.signal.aborted) setPeaks(nextPeaks)
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error(`Could not build waveform for ${audioSrc}`, error)
        }
      }
    }

    void loadPeaks()

    return () => abortController.abort()
  }, [audioSrc])

  return peaks
}

function Waveform({ peaks, progress }: { peaks: number[]; progress: number }) {
  const bars = peaks.length ? peaks : Array.from({ length: 64 }, () => 5)

  return (
    <div className="waveform" aria-hidden="true" data-loaded={peaks.length > 0}>
      {bars.map((height, index) => (
        <span
          key={`${height}-${index}`}
          className={(index + 1) / bars.length <= progress ? 'is-active' : ''}
          style={{ height }}
        />
      ))}
    </div>
  )
}

function AudioCard({
  track,
  activeId,
  setActiveId,
  defaultExpanded = DEFAULT_EXPANDED,
}: {
  track: DemoTrack
  activeId: string | null
  setActiveId: (id: string | null) => void
  defaultExpanded?: boolean
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const progress = duration ? currentTime / duration : 0
  const peaks = useAudioPeaks(track.audioSrc)

  useEffect(() => {
    if (activeId !== track.id && audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }, [activeId, track.id])

  const togglePlayback = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    if (duration && audio.currentTime >= duration) {
      audio.currentTime = 0
      setCurrentTime(0)
    }

    setIsExpanded(true)
    setActiveId(track.id)
    await audio.play()
    setIsPlaying(true)
  }

  const seek = (value: string) => {
    const nextTime = Number(value)
    if (!audioRef.current || Number.isNaN(nextTime)) return
    audioRef.current.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  return (
    <article className={`recording-card ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}>
      <button
        className="recording-summary"
        type="button"
        aria-expanded={isExpanded}
        aria-controls={`details-${track.id}`}
        onClick={() => setIsExpanded((current) => !current)}
      >
        <span className="icon-box">
          <img src={track.icon} alt="" />
        </span>
        <span className="summary-title">{track.title}</span>
        <span className="expand-icon" aria-hidden="true">
          <img src={chevronDownIcon} alt="" />
        </span>
      </button>

      <div className="recording-details" id={`details-${track.id}`} aria-hidden={!isExpanded}>
        <section className="recording-info">
          <div className="card-meta">
            <span className="icon-box" aria-hidden="true">
              <img src={track.icon} alt="" />
            </span>
          </div>

          <h2>{track.title}</h2>
          <p>{track.description}</p>

          <div className="tags" aria-label="Categorías">
            {track.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </section>

        <section className="player-row" aria-label={`Reproductor para ${track.title}`}>
          <button className="play-button" type="button" onClick={togglePlayback} aria-label={isPlaying ? 'Detener audio' : 'Reproducir audio'}>
            <span className={isPlaying ? 'stop-mark' : 'play-mark'} />
          </button>

          <div className="scrubber-wrap">
            <Waveform peaks={peaks} progress={progress} />
            <input
              className="scrubber"
              type="range"
              min="0"
              max={duration || 0}
              step="0.01"
              value={currentTime}
              onChange={(event) => seek(event.target.value)}
              aria-label="Mover posición del audio"
            />
          </div>

          <time className="time" dateTime={`PT${Math.floor(duration || currentTime)}S`}>
            {formatTime(duration || currentTime)}
          </time>
        </section>
      </div>

      <audio
        ref={audioRef}
        src={track.audioSrc}
        preload="metadata"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onEnded={(event) => {
          setIsPlaying(false)
          setCurrentTime(event.currentTarget.duration)
          setActiveId(null)
        }}
      />
    </article>
  )
}

function App() {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <main className="app-shell">
      <section className="phone-frame" aria-label="Grabaciones Conbiz">
        <header className="app-header">
          <div>
            <p className="kicker">Conbiz Voice Agent</p>
            <h1>Grabaciones</h1>
            <p>{tracks.length} grabaciones guardadas</p>
          </div>
        </header>

        <section className="cards" aria-label="Grabaciones de ejemplo">
          {tracks.map((track) => (
            <AudioCard key={track.id} track={track} activeId={activeId} setActiveId={setActiveId} />
          ))}
        </section>
      </section>
    </main>
  )
}

export default App
