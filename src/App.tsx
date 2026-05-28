import { useEffect, useRef, useState } from 'react'
import phoneCallIcon from 'pixelarticons/svg/phone-call.svg'
import mapPinIcon from 'pixelarticons/svg/map-pin-home.svg'
import toolCaseIcon from 'pixelarticons/svg/tool-case.svg'
import modemIcon from 'pixelarticons/svg/modem.svg'
import userPlusIcon from 'pixelarticons/svg/user-plus.svg'
import warningIcon from 'pixelarticons/svg/warning-diamond.svg'
import phoneOutgoingIcon from 'pixelarticons/svg/phone-outgoing.svg'
import cardTextIcon from 'pixelarticons/svg/card-text.svg'
import receiptIcon from 'pixelarticons/svg/receipt.svg'
import shoppingBagIcon from 'pixelarticons/svg/shopping-bag.svg'
import smartphoneIcon from 'pixelarticons/svg/smartphone.svg'
import shieldIcon from 'pixelarticons/svg/shield.svg'
import creditCardIcon from 'pixelarticons/svg/credit-card.svg'
import chevronDownIcon from 'pixelarticons/svg/chevron-down.svg'
import closeIcon from 'pixelarticons/svg/cancel.svg'
import './App.css'

type DemoTrack = {
  id: string
  title: string
  description: string
  tags: string[]
  audioSrc: string
  icon: string
}

const DEFAULT_EXPANDED = false

const recordingBase =
  '/assets/recordings/019e3681-fab2-7000-ad91-f1b197497e2d-1779031062241-25cab87b-ec50-4bba-8033-1ef3e3861a1c-mono'

const audioFor = (part: number) => `${recordingBase}-part${part.toString().padStart(2, '0')}.wav`

const tracks: DemoTrack[] = [
  {
    id: 'automatic-identification',
    title: 'Identificación Automática',
    description: 'Reconoce al cliente por su número telefónico y carga su cuenta antes de iniciar la atención.',
    tags: ['Telefonía SIP', 'iWisp', 'Reconocimiento inteligente', 'Datos de cuenta'],
    audioSrc: audioFor(1),
    icon: phoneCallIcon,
  },
  {
    id: 'real-time-coverage',
    title: 'Cobertura en Tiempo Real',
    description: 'Valida disponibilidad del servicio usando la dirección del cliente y zonas activas de cobertura.',
    tags: ['Geolocalización', 'Cobertura', 'iWisp', 'Direcciones'],
    audioSrc: audioFor(2),
    icon: mapPinIcon,
  },
  {
    id: 'guided-technical-diagnosis',
    title: 'Diagnóstico Técnico Guiado',
    description: 'Guía al cliente paso a paso para resolver fallas comunes de internet y conexión.',
    tags: ['Soporte técnico', 'Troubleshooting', 'Internet', 'Flujo guiado'],
    audioSrc: audioFor(3),
    icon: toolCaseIcon,
  },
  {
    id: 'remote-router-restart',
    title: 'Reinicio Remoto de Routers',
    description: 'Reinicia el router del cliente de forma remota sin intervención manual del usuario.',
    tags: ['MikroTik', 'Router', 'Soporte remoto', 'Automatización'],
    audioSrc: audioFor(4),
    icon: modemIcon,
  },
  {
    id: 'prospect-registration',
    title: 'Registro de Prospectos',
    description: 'Crea prospectos automáticamente cuando un cliente desea contratar un servicio.',
    tags: ['iWisp', 'Ventas', 'Prospectos', 'Instalación'],
    audioSrc: audioFor(5),
    icon: userPlusIcon,
  },
  {
    id: 'zone-outages',
    title: 'Afectaciones de Zona',
    description: 'Detecta eventos masivos en la zona del cliente y evita diagnósticos innecesarios.',
    tags: ['Monitoreo', 'Zonas', 'Eventos masivos', 'Soporte'],
    audioSrc: audioFor(6),
    icon: warningIcon,
  },
  {
    id: 'smart-transfers',
    title: 'Transferencias Inteligentes',
    description: 'Transfiere la llamada a un asesor con contexto y resumen previo de la conversación.',
    tags: ['Warm transfer', 'SIP', 'Resumen', 'Asesor humano'],
    audioSrc: audioFor(7),
    icon: phoneOutgoingIcon,
  },
  {
    id: 'lost-opportunity-tickets',
    title: 'Tickets de Oportunidad Perdida',
    description: 'Registra solicitudes donde aún no hay cobertura para identificar demanda por zona.',
    tags: ['Cobertura', 'Prospectos', 'Históricos', 'Expansión'],
    audioSrc: audioFor(8),
    icon: cardTextIcon,
  },
  {
    id: 'follow-up-tickets',
    title: 'Tickets de Seguimiento',
    description: 'Genera tickets para casos que requieren atención o intervención del equipo interno.',
    tags: ['iWisp', 'Tickets', 'Soporte', 'Seguimiento'],
    audioSrc: audioFor(1),
    icon: receiptIcon,
  },
  {
    id: 'zone-packages',
    title: 'Paquetes por Zona',
    description: 'Recomienda paquetes disponibles según cobertura, zona y necesidades del cliente.',
    tags: ['Paquetes', 'Precios', 'Cobertura', 'Recomendación IA'],
    audioSrc: audioFor(2),
    icon: shoppingBagIcon,
  },
  {
    id: 'whatsapp-integration',
    title: 'Integración con WhatsApp',
    description: 'Envía mensajes de seguimiento por WhatsApp durante el proceso de contratación.',
    tags: ['WhatsApp', 'Gupshup', 'Seguimiento', 'Contratación'],
    audioSrc: audioFor(3),
    icon: smartphoneIcon,
  },
  {
    id: 'operational-guardrails',
    title: 'Guardrails Operativos',
    description: 'Mantiene la conversación dentro del negocio y bloquea intentos de manipulación.',
    tags: ['Seguridad', 'Anti-manipulación', 'Guardrails', 'IA responsable'],
    audioSrc: audioFor(4),
    icon: shieldIcon,
  },
  {
    id: 'payments-self-service',
    title: 'Pagos y Autoservicio',
    description: 'Consulta adeudos y facilita referencias o enlaces de pago por canales digitales.',
    tags: ['Pagos', 'WhatsApp', 'Autoservicio', 'Cuenta cliente'],
    audioSrc: audioFor(5),
    icon: creditCardIcon,
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

          <p>{track.description}</p>
          <p className="feature-heading">Funciones clave</p>

          <div className="tags" aria-label="Funciones clave">
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
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)

  return (
    <main className="app-shell">
      <section className={`phone-frame ${isDemoModalOpen ? 'is-modal-open' : ''}`} aria-label="Grabaciones Conbiz">
        <header className="app-header">
          <a className="brand-link" href="/" aria-label="Conbiz by Assetel">
            <img src="/conbiz-by-assetel.png" alt="Conbiz by Assetel" />
          </a>

          <button className="demo-cta" type="button" onClick={() => setIsDemoModalOpen(true)}>
            Agendar Demo
          </button>
        </header>


        <section className="hero-copy">
          <p className="kicker">Conbiz Voice Agent</p>
          <h1>Grabaciones</h1>
          <p>{tracks.length} grabaciones guardadas</p>
        </section>

        <section className="cards" aria-label="Grabaciones de ejemplo">
          {tracks.map((track) => (
            <AudioCard key={track.id} track={track} activeId={activeId} setActiveId={setActiveId} />
          ))}
        </section>
      </section>

      {isDemoModalOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsDemoModalOpen(false)}>
          <section
            className="demo-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="modal-close" type="button" onClick={() => setIsDemoModalOpen(false)} aria-label="Cerrar modal">
              <img src={closeIcon} alt="" />
            </button>

            <img className="qr-code" src="/whatsapp-lajc.png" alt="QR de WhatsApp para agendar un demo" />
            <h2 id="demo-modal-title">Agenda tu demo</h2>
            <p>Mándanos un mensaje para agendar tu demo y transforma tu negocio con IA</p>
          </section>
        </div>
      )}
    </main>
  )
}

export default App
