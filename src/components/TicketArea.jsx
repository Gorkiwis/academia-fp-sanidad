import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  HelpCircle,
  Upload,
  ShieldCheck,
  Zap,
  Filter,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  FileText,
  AlertCircle
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const SAMPLE_INITIAL_TICKETS = [
  {
    id: 'tk_demo_101',
    code: 'TK-8492',
    date: '2026-07-21',
    grado: 'TSIDMN',
    asunto: 'Duda sobre secuencias T1 y T2 en Resonancia Magnética',
    mensaje: 'Hola tutor, ¿cuál es la diferencia fundamental entre el tiempo de repetición (TR) y el tiempo de eco (TE) para potenciar una imagen en T1 vs T2?',
    estado: 'resuelto',
    respuesta: '¡Hola! En T1 utilizamos un TR corto (< 600 ms) y TE corto (< 20 ms) para anular las diferencias de relajación T2. En T2 utilizamos TR largo (> 2000 ms) y TE largo (> 80 ms). Recuerda que la grasa brilla en T1 y el agua/líquido cefalorraquídeo brilla intensamente en T2.',
    prioridad: 'Normal'
  },
  {
    id: 'tk_demo_102',
    code: 'TK-9104',
    date: '2026-07-22',
    grado: 'TSIDMN',
    asunto: 'Cálculo de dosis equivalente en Protección Radiológica',
    mensaje: 'En un ejercicio del Módulo 1 piden calcular la dosis equivalente en Sieverts a partir de 5 Gy de radiación Alfa. ¿Se multiplica por el factor W_R = 20?',
    estado: 'resuelto',
    respuesta: 'Correcto. La Dosis Equivalente H = Dosis Absorbida (D) × Factor de Ponderación de la Radiación (W_R). Para partículas Alfa W_R = 20, por lo que 5 Gy × 20 = 100 Sv.',
    prioridad: 'Alta - Examen Próximo'
  },
  {
    id: 'tk_demo_103',
    code: 'TK-9540',
    date: '2026-07-23',
    grado: 'TSIDMN',
    asunto: 'Artefactos por movimiento en Tomografía Computarizada',
    mensaje: '¿Qué algoritmo o filtro de reconstrucción es mejor aplicar para reducir los artefactos en estrella provocados por prótesis metálicas en TAC?',
    estado: 'pendiente',
    respuesta: null,
    prioridad: 'Normal'
  }
];

export default function TicketArea({ initialFormContext = null }) {
  // Active Tab: 'new' | 'list'
  const [activeTab, setActiveTab] = useState('list');

  // Form State
  const [formData, setFormData] = useState({
    studentName: localStorage.getItem('academia_student_name') || 'Juan Pérez',
    studentEmail: localStorage.getItem('academia_student_email') || 'alumno@academiafpsanidad.es',
    grado: 'TSIDMN - Radiodiagnóstico y Medicina Nuclear',
    moduleName: 'Radiobiología y Protección Radiológica',
    asunto: '',
    mensaje: '',
    priority: 'Normal'
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccessCode, setSubmitSuccessCode] = useState(null);

  // Tickets List State
  const [tickets, setTickets] = useState(() => {
    try {
      const saved = localStorage.getItem('academia_tickets');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed : SAMPLE_INITIAL_TICKETS;
      }
    } catch (e) {
      console.warn('Error reading tickets:', e);
    }
    return SAMPLE_INITIAL_TICKETS;
  });

  const [expandedTicketId, setExpandedTicketId] = useState(null);
  const [ticketFilter, setTicketFilter] = useState('todos'); // 'todos' | 'pendiente' | 'resuelto'

  // Pre-fill form if contextual question passed from VideoLibrary
  useEffect(() => {
    if (initialFormContext) {
      setFormData((prev) => ({
        ...prev,
        grado: initialFormContext.degreeCode || prev.grado,
        moduleName: initialFormContext.moduleName || prev.moduleName,
        asunto: `Duda sobre clase: ${initialFormContext.title || ''}`,
        mensaje: `Hola tutor, tengo una duda sobre la explicación de la clase "${initialFormContext.title || ''}"...`
      }));
      setActiveTab('new');
    }
  }, [initialFormContext]);

  // Fetch tickets from Supabase if configured
  useEffect(() => {
    async function loadSupabaseTickets() {
      if (!isSupabaseConfigured()) return;
      try {
        const userEmail = formData.studentEmail;
        const { data: dbTickets, error } = await supabase
          .from('tickets')
          .select('*')
          .eq('email', userEmail)
          .order('created_at', { ascending: false });

        if (dbTickets && dbTickets.length > 0 && !error) {
          const mapped = dbTickets.map((t) => ({
            id: t.id,
            code: `TK-${t.id.slice(0, 6).toUpperCase()}`,
            date: new Date(t.created_at).toISOString().split('T')[0],
            grado: t.grado,
            asunto: t.asunto,
            mensaje: t.mensaje,
            estado: t.estado || 'pendiente',
            respuesta: t.respuesta || null,
            prioridad: t.prioridad || 'Normal'
          }));
          setTickets(mapped);
        }
      } catch (err) {
        console.warn('Error loading tickets from Supabase:', err);
      }
    }
    loadSupabaseTickets();
  }, [formData.studentEmail]);

  // Submit Ticket Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    let ticketCode = `TK-FP-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicketObj = {
      id: `tk_${Date.now()}`,
      code: ticketCode,
      date: new Date().toISOString().split('T')[0],
      email: formData.studentEmail,
      grado: formData.grado,
      moduleName: formData.moduleName,
      asunto: formData.asunto,
      mensaje: formData.mensaje,
      prioridad: formData.priority,
      estado: 'pendiente',
      respuesta: null
    };

    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.from('tickets').insert([
          {
            email: formData.studentEmail,
            grado: `${formData.grado} • ${formData.moduleName}`,
            asunto: formData.asunto,
            mensaje: formData.mensaje,
            estado: 'pendiente'
          }
        ]).select('id').single();

        if (data?.id && !error) {
          ticketCode = `TK-${data.id.slice(0, 6).toUpperCase()}`;
          newTicketObj.code = ticketCode;
        }
      }

      // Update LocalStorage & state
      const updatedList = [newTicketObj, ...tickets];
      setTickets(updatedList);
      localStorage.setItem('academia_tickets', JSON.stringify(updatedList));

      setSubmitSuccessCode(ticketCode);
    } catch (err) {
      console.error('Error submitting ticket:', err);
      setSubmitSuccessCode(ticketCode);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    if (ticketFilter === 'pendiente') return t.estado === 'pendiente';
    if (ticketFilter === 'resuelto') return t.estado === 'resuelto';
    return true;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 text-left text-slate-900 animate-fadeIn pb-16">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Sistema de Resolución de Dudas Técnicas
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-extrabold">
                  TUTORES SANITARIOS
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Resuelve preguntas tipo test, ejercicios prácticos y dudas del temario oficial con docentes colegiados.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveTab('list');
                setSubmitSuccessCode(null);
              }}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'list'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mis Consultas ({tickets.length})
            </button>

            <button
              onClick={() => {
                setActiveTab('new');
                setSubmitSuccessCode(null);
              }}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'new'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>Enviar Nueva Duda</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'new' ? (
        /* ---------------------------------------------------- */
        /* TAB 1: FORMULARIO NUEVA DUDA */
        /* ---------------------------------------------------- */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          
          {!submitSuccessCode ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-slate-900">Formulario de Consulta Docente</h2>
                <p className="text-xs text-slate-500">
                  Completa los datos de la duda. Recibirás respuesta técnica detallada antes de 24h.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Tu Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email para la Respuesta *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.studentEmail}
                    onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Grado Sanitario *
                  </label>
                  <select
                    value={formData.grado}
                    onChange={(e) => setFormData({ ...formData, grado: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-900"
                  >
                    <option value="TSIDMN - Radiodiagnóstico y Medicina Nuclear">TSIDMN - Radiodiagnóstico y Medicina Nuclear</option>
                    <option value="RTR - Radioterapia y Dosimetría">RTR - Radioterapia y Dosimetría</option>
                    <option value="LCB - Laboratorio Clínico y Biomédico">LCB - Laboratorio Clínico y Biomédico</option>
                    <option value="APC - Anatomía Patológica y Citodiagnóstico">APC - Anatomía Patológica y Citodiagnóstico</option>
                    <option value="DAS - Documentación y Administración Sanitarias">DAS - Documentación Sanitaria</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Módulo / Asignatura del problema *
                  </label>
                  <select
                    value={formData.moduleName}
                    onChange={(e) => setFormData({ ...formData, moduleName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-900"
                  >
                    <option value="Radiobiología y Protección Radiológica">Radiobiología y Protección Radiológica</option>
                    <option value="Tomografía Computarizada (TC)">Tomografía Computarizada (TC)</option>
                    <option value="Resonancia Magnética (RM)">Resonancia Magnética (RM)</option>
                    <option value="Medicina Nuclear y PET-TC">Medicina Nuclear y PET-TC</option>
                    <option value="Dosimetría Física y Clínica">Dosimetría Física y Clínica</option>
                    <option value="Bioquímica o Hematología">Bioquímica o Hematología</option>
                    <option value="Histotecnología o Citomorfología">Histotecnología o Citomorfología</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Asunto / Título Resumido *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Duda con la fórmula de atenuación lineal en Rayos X"
                  value={formData.asunto}
                  onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Descripción Detallada de la Consulta *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Detalla qué parte del temario o qué pregunta del test no comprendes..."
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-900 resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Nivel de Prioridad *
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-900"
                  >
                    <option value="Normal">Normal (Respuesta en &lt; 24h)</option>
                    <option value="Alta - Examen Próximo">🔥 Alta - Tengo examen en 48h</option>
                  </select>
                </div>

                {/* Upload Dropzone Simulation */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Adjuntar Captura o PDF (Opcional)
                  </label>
                  <div className="border border-dashed border-slate-300 rounded-xl p-3.5 text-center bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-slate-500" />
                    <span className="text-xs text-slate-600 font-medium">Arrastra una imagen o PDF del ejercicio</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span>Registrando Ticket...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-amber-400" />
                      <span>Enviar Consulta a Tutor Colegiado</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          ) : (
            /* Ticket Creation Confirmation View */
            <div className="py-10 text-center space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-slate-900">¡Consulta Enviada con Éxito!</h3>
                <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto">
                  Tu duda ha sido registrada en el sistema de tutorías. Código de seguimiento:
                </p>
                <div className="inline-block px-5 py-2.5 rounded-xl bg-slate-100 border border-slate-300 font-mono font-extrabold text-slate-900 text-lg shadow-xs">
                  {submitSuccessCode}
                </div>
              </div>

              <div className="pt-4 flex justify-center gap-4">
                <button
                  onClick={() => {
                    setSubmitSuccessCode(null);
                    setActiveTab('list');
                  }}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                >
                  Ver en Mis Consultas
                </button>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* ---------------------------------------------------- */
        /* TAB 2: LISTA DE TICKETS "MIS CONSULTAS" */
        /* ---------------------------------------------------- */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <h2 className="text-xl font-extrabold text-slate-900">Historial de Consultas enviadas</h2>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Filtrar:</span>
              {['todos', 'pendiente', 'resuelto'].map((st) => (
                <button
                  key={st}
                  onClick={() => setTicketFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    ticketFilter === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'todos' ? `Todos (${tickets.length})` : st}
                </button>
              ))}
            </div>
          </div>

          {filteredTickets.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-600">No se encontraron tickets con este filtro.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((t) => {
                const isExpanded = expandedTicketId === t.id;
                const isResolved = t.estado === 'resuelto';

                return (
                  <div
                    key={t.id}
                    className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4 transition-all hover:border-slate-300"
                  >
                    <div
                      onClick={() => setExpandedTicketId(isExpanded ? null : t.id)}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                            {t.code}
                          </span>

                          {/* Status Badge */}
                          {isResolved ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-extrabold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Resuelto
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-700" />
                              Pendiente de respuesta
                            </span>
                          )}

                          {t.prioridad && t.prioridad.includes('Alta') && (
                            <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold">
                              🔥 Examen Próximo
                            </span>
                          )}

                          <span className="text-[11px] text-slate-400 font-mono">
                            {t.date}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-slate-900 text-sm pt-1">{t.asunto}</h3>
                        <p className="text-xs text-slate-500">{t.grado}</p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="text-xs text-slate-600 font-semibold">
                          {isExpanded ? 'Ocultar' : 'Ver respuesta'}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-600" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Content Drawer */}
                    {isExpanded && (
                      <div className="pt-4 border-t border-slate-200/80 space-y-4 text-xs">
                        {/* Student Question */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
                          <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                            Tu Consulta:
                          </span>
                          <p className="text-slate-800 leading-relaxed font-medium">
                            "{t.mensaje}"
                          </p>
                        </div>

                        {/* Tutor Technical Response */}
                        <div className={`p-4.5 rounded-xl border space-y-2 ${
                          isResolved
                            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                            : 'bg-amber-50/80 border-amber-300 text-amber-950'
                        }`}>
                          <div className="flex items-center gap-2 font-bold text-xs">
                            <ShieldCheck className={`w-4 h-4 ${isResolved ? 'text-emerald-700' : 'text-amber-700'}`} />
                            <span>
                              {isResolved
                                ? 'Explicación Técnica del Profesor Docente:'
                                : 'Estado de Asignación Docente:'}
                            </span>
                          </div>

                          <p className="leading-relaxed text-xs">
                            {isResolved
                              ? t.respuesta
                              : 'Tu consulta ha sido asignada a un docente especialista en la materia. Recibirás respuesta antes de 24 horas.'}
                          </p>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
