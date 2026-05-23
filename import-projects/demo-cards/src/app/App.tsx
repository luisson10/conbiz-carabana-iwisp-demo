import svgPaths from "@/imports/IPhone173/svg-plenufmjd4";

interface Recording {
  id: number;
  title: string;
  description: string;
  tags: string[];
  duration: string;
  date: string;
}

const recordings: Recording[] = [
  {
    id: 1,
    title: "Notificación de incidencias másivas",
    description:
      "Cuando hay alguna falla, el agente puede proporcionar información respecto a una caida de servicio por zona.",
    tags: ["transferencia", "Creación ticket"],
    duration: "1:00",
    date: "Hoy, 10:24 AM",
  },
  {
    id: 2,
    title: "Proceso de transferencia de llamada",
    description:
      "Guía paso a paso para transferir una llamada al departamento correcto según el tipo de solicitud del cliente.",
    tags: ["transferencia"],
    duration: "2:15",
    date: "Hoy, 9:08 AM",
  },
  {
    id: 3,
    title: "Creación de tickets de soporte",
    description:
      "Instrucciones para abrir un ticket de soporte técnico cuando el cliente reporta un problema no resuelto.",
    tags: ["Creación ticket", "soporte"],
    duration: "0:47",
    date: "Ayer, 4:55 PM",
  },
  {
    id: 4,
    title: "Actualización de datos del cliente",
    description:
      "Procedimiento para verificar y actualizar información de contacto en el sistema CRM durante la llamada.",
    tags: ["actualización", "CRM"],
    duration: "1:33",
    date: "Ayer, 2:12 PM",
  },
  {
    id: 5,
    title: "Escalamiento a segundo nivel",
    description:
      "Cuando el problema supera el primer nivel de atención, este flujo explica cómo escalar correctamente.",
    tags: ["escalamiento", "transferencia"],
    duration: "3:02",
    date: "22 may, 11:40 AM",
  },
];

function ArchiveIcon() {
  return (
    <div className="relative shrink-0 size-[28px]">
      <svg
        className="absolute block inset-0 size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 28 28"
      >
        <path d={svgPaths.pfdc0c00} fill="#686868" />
      </svg>
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <div className="relative bg-[#ffefec] rounded-[5px] shrink-0">
      <div className="flex items-center justify-center px-[10px] py-[5px]">
        <span
          className="font-semibold text-[#ff7e6f] text-[10px] whitespace-nowrap leading-[10px]"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {label}
        </span>
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 border border-[#ffdad5] rounded-[5px] pointer-events-none"
      />
    </div>
  );
}

const waveformBars = [18, 12, 6, 18, 12, 18, 6, 18, 12, 6, 18, 12, 18, 6, 18, 12, 6, 18, 12, 18, 6, 18, 12, 6, 18, 12, 18, 6, 18, 12, 6, 18, 12, 18];
const playedCount = 4;

function Waveform() {
  return (
    <div className="bg-white flex-1 h-[30px] relative rounded-[5px]">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="flex gap-[2px] items-center px-[5px] py-[5px] size-full">
          {waveformBars.map((h, i) => (
            <div
              key={i}
              className="rounded-[6px] shrink-0 w-[2px]"
              style={{
                height: h,
                backgroundColor: i < playedCount ? "#ff9156" : "#d9d9d9",
                marginTop: (18 - h) / 2,
              }}
            />
          ))}
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 border border-[#d9d9d9] rounded-[5px] pointer-events-none"
      />
      {/* Playhead */}
      <div className="absolute top-1/2 -translate-y-1/2 bg-[#686868] rounded-[6px] w-[3px] h-[37px]" style={{ left: 34 }} />
    </div>
  );
}

function PlayButton() {
  return (
    <div className="relative shrink-0 size-[30px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
        <rect fill="white" height="29" rx="4.5" width="29" x="0.5" y="0.5" />
        <rect height="29" rx="4.5" stroke="#D9D9D9" width="29" x="0.5" y="0.5" />
        <path d={svgPaths.p207a8a00} fill="#FF7E6F" />
      </svg>
    </div>
  );
}

function PlayerSection({ duration }: { duration: string }) {
  return (
    <div className="relative w-full">
      <div className="flex flex-row items-center">
        <div className="flex gap-[5px] items-center p-[10px] w-full">
          <PlayButton />
          <Waveform />
          <span
            className="font-semibold text-[#878787] text-[10px] whitespace-nowrap shrink-0"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {duration}
          </span>
        </div>
      </div>
    </div>
  );
}

function RecordingCard({ recording }: { recording: Recording }) {
  return (
    <div className="relative bg-[rgba(244,244,244,0.97)] rounded-[10px] w-full">
      <div className="flex flex-col overflow-clip rounded-[inherit]">
        {/* Info section */}
        <div className="bg-white rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] w-full">
          <div className="flex flex-col gap-[5px] p-[10px]">
            <div className="flex items-start justify-between">
              <ArchiveIcon />
              <span
                className="text-[10px] text-[#b0b0b0] font-medium mt-[2px]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {recording.date}
              </span>
            </div>
            <p
              className="font-bold text-[12px] text-black leading-[14.09px]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {recording.title}
            </p>
            <p
              className="font-medium text-[12px] text-[#686868] leading-[14.09px]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {recording.description}
            </p>
            <div className="flex flex-wrap gap-[5px] py-[2px]">
              {recording.tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>
          </div>
        </div>
        {/* Player section */}
        <PlayerSection duration={recording.duration} />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 border-[#d0d0d0] border-[0.705px] rounded-[10px] pointer-events-none"
      />
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#f0f0f0] flex items-start justify-center py-10">
      {/* Mobile frame */}
      <div
        className="bg-white rounded-[40px] shadow-[0_30px_80px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col"
        style={{ width: 390, minHeight: 720 }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-7 pt-4 pb-2 shrink-0">
          <span
            className="text-[13px] font-semibold text-black"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            9:41
          </span>
          <div className="flex items-center gap-[5px]">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <rect x="0" y="4" width="3" height="8" rx="1" fill="#000" />
              <rect x="4.5" y="2.5" width="3" height="9.5" rx="1" fill="#000" />
              <rect x="9" y="1" width="3" height="11" rx="1" fill="#000" />
              <rect x="13.5" y="0" width="2.5" height="12" rx="1" fill="#000" opacity="0.3" />
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M8 2.5C10.2 2.5 12.2 3.4 13.6 4.9L15 3.5C13.2 1.6 10.7 0.5 8 0.5C5.3 0.5 2.8 1.6 1 3.5L2.4 4.9C3.8 3.4 5.8 2.5 8 2.5Z" fill="#000" />
              <path d="M8 5.5C9.5 5.5 10.9 6.1 11.9 7.1L13.3 5.7C11.9 4.3 10 3.5 8 3.5C6 3.5 4.1 4.3 2.7 5.7L4.1 7.1C5.1 6.1 6.5 5.5 8 5.5Z" fill="#000" />
              <circle cx="8" cy="10" r="1.5" fill="#000" />
            </svg>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
              <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="#000" strokeOpacity="0.35" />
              <rect x="2" y="2" width="16" height="8" rx="2" fill="#000" />
              <path d="M23 4.5V7.5C23.8 7.2 24.5 6.7 24.5 6C24.5 5.3 23.8 4.8 23 4.5Z" fill="#000" fillOpacity="0.4" />
            </svg>
          </div>
        </div>

        {/* Header */}
        <div className="px-5 pb-3 shrink-0">
          <h1
            className="text-[20px] font-bold text-black"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Grabaciones
          </h1>
          <p
            className="text-[12px] text-[#9a9a9a] font-medium mt-[2px]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {recordings.length} grabaciones guardadas
          </p>
        </div>

        {/* Cards list */}
        <div className="flex-1 overflow-y-auto px-5 pb-8">
          <div className="flex flex-col gap-[14px]">
            {recordings.map((rec) => (
              <RecordingCard key={rec.id} recording={rec} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
