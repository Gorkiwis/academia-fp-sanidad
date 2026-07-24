import React, { useState } from 'react';
import {
  Video,
  Play,
  Clock,
  BookOpen,
  Filter,
  Search,
  CheckCircle2,
  Download,
  HelpCircle,
  X,
  GraduationCap,
  Sparkles,
  Zap,
  FileText,
  UserCheck
} from 'lucide-react';

const SAMPLE_VIDEOS = [
  {
    id: 'vid_1',
    degreeId: 'tsidmn',
    degreeCode: 'TSIDMN',
    moduleName: 'Radiobiología y Protección Radiológica',
    title: 'Generación de Rayos X y Mecanismos de Frenado (Bremsstrahlung)',
    professor: 'Dr. Marcos G. • Especialista en Radiobiología',
    duration: '24:15',
    topicsCount: 'Tema 1 y 2',
    thumbnailColor: 'from-slate-900 to-blue-900',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    summary: 'Explicación detallada sobre la colisión electrónica en el ánodo de tungsteno, radiación característica vs espectro continuo de frenado y factores de filtración.',
    pdfUrl: '#'
  },
  {
    id: 'vid_2',
    degreeId: 'tsidmn',
    degreeCode: 'TSIDMN',
    moduleName: 'Tomografía Computarizada (TC)',
    title: 'Escala Hounsfield y Reconstrucción Multiplanar (MPR/MIP)',
    professor: 'Dra. Elena V. • Radióloga Docente',
    duration: '31:40',
    topicsCount: 'Tema 3',
    thumbnailColor: 'from-slate-900 to-emerald-900',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    summary: 'Cómo interpretar valores de atenuación en Unidades Hounsfield (HU), ajuste de ventana (Window Width / Level) y algoritmos de reconstrucción en TAC abdominopélvico.',
    pdfUrl: '#'
  },
  {
    id: 'vid_3',
    degreeId: 'tsidmn',
    degreeCode: 'TSIDMN',
    moduleName: 'Resonancia Magnética (RM)',
    title: 'Física de la Relajación T1 vs T2 y Secuencia FLAIR',
    professor: 'Dr. Marcos G. • Especialista en RM',
    duration: '28:50',
    topicsCount: 'Tema 5 y 6',
    thumbnailColor: 'from-slate-900 to-indigo-900',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    summary: 'Diferenciación práctica entre tiempos TR y TE en Spin-Echo. Análisis de imágenes ponderadas en T1, T2 y supresión de líquido cefalorraquídeo en FLAIR.',
    pdfUrl: '#'
  },
  {
    id: 'vid_4',
    degreeId: 'radioterapia',
    degreeCode: 'RTR',
    moduleName: 'Dosimetría Física y Clínica',
    title: 'Cálculo de Distribución de Dosis en Acelerador Lineal (LINAC)',
    professor: 'Prof. Carlos R. • Radiofísico Hospitalario',
    duration: '35:10',
    topicsCount: 'Módulo 1',
    thumbnailColor: 'from-slate-900 to-amber-900',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    summary: 'Curvas de isodosis, rendimiento en profundidad (PDD), factor de campo y simulación virtual 3D para tratamientos oncográficos.',
    pdfUrl: '#'
  },
  {
    id: 'vid_5',
    degreeId: 'laboratorio',
    degreeCode: 'LCB',
    moduleName: 'Bioquímica Clínica',
    title: 'Espectrofotometría y Tinciones Diagnósticas de Hematología',
    professor: 'Dra. Sofía M. • Bióloga Sanitaria',
    duration: '22:30',
    topicsCount: 'Módulo 2',
    thumbnailColor: 'from-slate-900 to-teal-900',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    summary: 'Leyes de Beer-Lambert en autoanalizadores de laboratorio, análisis de ionogramas y tinción Giemsa en frotis sanguíneo.',
    pdfUrl: '#'
  },
  {
    id: 'vid_6',
    degreeId: 'anatomia',
    degreeCode: 'APC',
    moduleName: 'Histotecnología',
    title: 'Procesamiento Tisular y Marcadores Inmunohistoquímicos (Ki-67 / HER2)',
    professor: 'Dr. Fernando L. • Patólogo Docente',
    duration: '27:15',
    topicsCount: 'Módulo 3',
    thumbnailColor: 'from-slate-900 to-rose-900',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    summary: 'Fijación con formol neutro tamponado, microtomo, tinción Hematoxilina-Eosina e identificación de biomarcadores tumorales.',
    pdfUrl: '#'
  }
];

export default function VideoLibrary({ onAskQuestion }) {
  const [selectedModuleFilter, setSelectedModuleFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  // Available module filters
  const moduleFilters = ['Todos', 'Radiobiología', 'Tomografía Computarizada (TC)', 'Resonancia Magnética (RM)', 'Dosimetría', 'Bioquímica'];

  const filteredVideos = SAMPLE_VIDEOS.filter((vid) => {
    const matchesModule =
      selectedModuleFilter === 'Todos' ||
      vid.moduleName.toLowerCase().includes(selectedModuleFilter.toLowerCase()) ||
      vid.title.toLowerCase().includes(selectedModuleFilter.toLowerCase());

    const matchesSearch =
      vid.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vid.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vid.professor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vid.degreeCode.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesModule && matchesSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 text-left text-slate-900 animate-fadeIn pb-16">
      
      {/* Page Title & Search Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Videoteca y Clases Magistrales
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300 border border-amber-400 text-[10px] font-extrabold">
                  STREAMING HD
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Clases teóricas y resolución de casos clínicos grabadas por profesores sanitarios colegiados.
              </p>
            </div>
          </div>

          <div className="w-full sm:w-72 relative">
            <input
              type="text"
              placeholder="Buscar clase o concepto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-900"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex overflow-x-auto gap-2 no-scrollbar">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0 pr-2">
            <Filter className="w-3.5 h-3.5" />
            Filtrar:
          </span>
          {moduleFilters.map((mod) => (
            <button
              key={mod}
              onClick={() => setSelectedModuleFilter(mod)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedModuleFilter === mod
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>
      </div>

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 space-y-3">
          <Video className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-600">No se encontraron video-clases con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((vid) => (
            <div
              key={vid.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail Header */}
                <div
                  onClick={() => setActiveVideoModal(vid)}
                  className={`h-44 bg-gradient-to-br ${vid.thumbnailColor} relative p-4 flex flex-col justify-between cursor-pointer overflow-hidden`}
                >
                  <div className="flex items-center justify-between z-10">
                    <span className="px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md text-white font-mono font-bold text-[11px] border border-white/20">
                      {vid.degreeCode}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-semibold flex items-center gap-1 border border-slate-800">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {vid.duration} min
                    </span>
                  </div>

                  {/* Center Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-amber-400">
                      <Play className="w-6 h-6 fill-slate-900 ml-1" />
                    </div>
                  </div>

                  <div className="z-10">
                    <span className="text-[11px] font-semibold text-slate-300 block truncate">
                      {vid.moduleName}
                    </span>
                  </div>
                </div>

                {/* Video Info Content */}
                <div className="p-5 space-y-2">
                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2">
                    {vid.title}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                    <UserCheck className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                    <span>{vid.professor}</span>
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                    {vid.summary}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-5 pt-0 border-t border-slate-100 mt-3">
                <button
                  onClick={() => setActiveVideoModal(vid)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Reproducir Clase Magistral</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Video Player Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 text-slate-900 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 font-mono font-extrabold text-xs">
                  {activeVideoModal.degreeCode}
                </span>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white line-clamp-1">
                    {activeVideoModal.title}
                  </h3>
                  <p className="text-xs text-slate-400">{activeVideoModal.moduleName}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                aria-label="Cerrar reproductor"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Container */}
            <div className="bg-slate-950 relative aspect-video flex items-center justify-center overflow-hidden">
              <video
                controls
                autoPlay
                src={activeVideoModal.videoUrl}
                className="w-full h-full object-contain"
                poster="/video-poster.jpg"
              >
                Tu navegador no soporta reproducción de vídeo HTML5.
              </video>
            </div>

            {/* Video Details Footer */}
            <div className="p-6 space-y-4 overflow-y-auto max-h-56 bg-slate-50 border-t border-slate-200 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Docente a cargo:</span>
                  <p className="text-sm font-extrabold text-slate-900">{activeVideoModal.professor}</p>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={activeVideoModal.videoUrl}
                    download
                    className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    <span>Descargar Diapositivas (PDF)</span>
                  </a>

                  <button
                    onClick={() => {
                      setActiveVideoModal(null);
                      onAskQuestion && onAskQuestion(activeVideoModal);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Enviar Duda al Tutor</span>
                  </button>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide block">Resumen Técnico de la Clase:</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeVideoModal.summary}
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
