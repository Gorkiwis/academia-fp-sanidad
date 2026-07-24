import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  GraduationCap,
  CreditCard,
  Calendar,
  ExternalLink,
  Unlock,
  Lock,
  CheckCircle2,
  Clock,
  HelpCircle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Check,
  PlusCircle,
  FileText
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const DEGREES = [
  {
    id: 'tsidmn',
    code: 'TSIDMN',
    name: 'Técnico Superior en Imagen para el Diagnóstico y Medicina Nuclear',
    shortName: 'Radiodiagnóstico (TSIDMN)',
    modules: [
      {
        id: 'mod_tsidmn_1',
        number: 1,
        title: 'Radiobiología y Protección Radiológica',
        description: 'Generación de Rayos X, dosimetría personal, efectos biológicos y normas de protección.',
        unlockDelayDays: 0,
        topicsCount: 12
      },
      {
        id: 'mod_tsidmn_2',
        number: 2,
        title: 'Tomografía Computarizada (TC/TAC)',
        description: 'Adquisición helicoidal, escala Hounsfield, reconstrucciones MPR/MIP y protocolos con contraste.',
        unlockDelayDays: 7,
        topicsCount: 10
      },
      {
        id: 'mod_tsidmn_3',
        number: 3,
        title: 'Resonancia Magnética (RM)',
        description: 'Física de la relajación T1/T2, secuencias Spin-Echo y FLAIR, gradientes magnéticos y seguridad.',
        unlockDelayDays: 14,
        topicsCount: 14
      },
      {
        id: 'mod_tsidmn_4',
        number: 4,
        title: 'Medicina Nuclear y PET-TC',
        description: 'Gammagrafía planar y SPECT, radiofármacos, radioprotección y tomografía por emisión de positrones.',
        unlockDelayDays: 21,
        topicsCount: 8
      }
    ]
  },
  {
    id: 'radioterapia',
    code: 'RTR',
    name: 'Técnico Superior en Radioterapia y Dosimetría',
    shortName: 'Radioterapia y Dosimetría',
    modules: [
      {
        id: 'mod_rtr_1',
        number: 1,
        title: 'Dosimetría Física y Clínica',
        description: 'Cálculo de distribución de dosis, isodosis y curvas de rendimiento en profundidad.',
        unlockDelayDays: 0,
        topicsCount: 11
      },
      {
        id: 'mod_rtr_2',
        number: 2,
        title: 'Equipos de Radioterapia y LINAC',
        description: 'Aceleradores lineales de electrones, colimación multilámina (MLC) y telecobaltoterapia.',
        unlockDelayDays: 7,
        topicsCount: 9
      },
      {
        id: 'mod_rtr_3',
        number: 3,
        title: 'Simulación y Planificación 3D',
        description: 'Simulación virtual por TC, volúmenes blancos (GTV, CTV, PTV) y contorneado de órganos.',
        unlockDelayDays: 14,
        topicsCount: 12
      },
      {
        id: 'mod_rtr_4',
        number: 4,
        title: 'Radiobiología Oncología',
        description: 'Respuesta celular a la radiación y fraccionamiento de dosis en radioterapia.',
        unlockDelayDays: 21,
        topicsCount: 8
      }
    ]
  },
  {
    id: 'laboratorio',
    code: 'LCB',
    name: 'Técnico Superior en Laboratorio Clínico y Biomédico',
    shortName: 'Laboratorio Clínico',
    modules: [
      {
        id: 'mod_lcb_1',
        number: 1,
        title: 'Bioquímica Clínica e Ionogramas',
        description: 'Espectrofotometría, ionogramas, perfiles lipídicos y autoanalizadores.',
        unlockDelayDays: 0,
        topicsCount: 14
      },
      {
        id: 'mod_lcb_2',
        number: 2,
        title: 'Microbiología y Antibiogramas',
        description: 'Siembra de cultivos, tinciones Gram y Ziehl-Neelsen e identificación de patógenos.',
        unlockDelayDays: 7,
        topicsCount: 10
      },
      {
        id: 'mod_lcb_3',
        number: 3,
        title: 'Hematología y Frotis Sanguíneo',
        description: 'Contadores hematológicos, tinción Giemsa y evaluación microscópica de frotis.',
        unlockDelayDays: 14,
        topicsCount: 12
      },
      {
        id: 'mod_lcb_4',
        number: 4,
        title: 'Biología Molecular y PCR',
        description: 'Extracción de ADN/ARN, PCR en tiempo real y electroforesis.',
        unlockDelayDays: 21,
        topicsCount: 9
      }
    ]
  },
  {
    id: 'anatomia',
    code: 'APC',
    name: 'Técnico Superior en Anatomía Patológica y Citodiagnóstico',
    shortName: 'Anatomía Patológica',
    modules: [
      {
        id: 'mod_apc_1',
        number: 1,
        title: 'Procesamiento Tisular e Histotecnología',
        description: 'Fijación en formol, inclusión en parafina, microtomo y tinción Hematoxilina-Eosina.',
        unlockDelayDays: 0,
        topicsCount: 10
      },
      {
        id: 'mod_apc_2',
        number: 2,
        title: 'Citomorfología Diagnóstica',
        description: 'Evaluación citológica en frotis Bethesda, PAAF mamaria y tiroides.',
        unlockDelayDays: 7,
        topicsCount: 11
      },
      {
        id: 'mod_apc_3',
        number: 3,
        title: 'Inmunohistoquímica y Marcadores',
        description: 'Anticuerpos monoclonales para caracterización tumoral (Ki-67, HER2, CK7/20).',
        unlockDelayDays: 14,
        topicsCount: 8
      },
      {
        id: 'mod_apc_4',
        number: 4,
        title: 'Necropsias y Tallado de Biopsias',
        description: 'Técnicas de disección y descripción macroscópica de piezas quirúrgicas.',
        unlockDelayDays: 21,
        topicsCount: 7
      }
    ]
  },
  {
    id: 'documentacion',
    code: 'DAS',
    name: 'Técnico Superior en Documentación y Administración Sanitarias',
    shortName: 'Documentación Sanitaria',
    modules: [
      {
        id: 'mod_das_1',
        number: 1,
        title: 'Codificación Clínica CIE-10-ES',
        description: 'Asignación de códigos diagnósticos y procedimientos quirúrgicos según normativa ministerial.',
        unlockDelayDays: 0,
        topicsCount: 15
      },
      {
        id: 'mod_das_2',
        number: 2,
        title: 'Sistemas de Información Sanitaria (CMBD)',
        description: 'Gestión del Conjunto Mínimo Básico de Datos y archivos de historias clínicas.',
        unlockDelayDays: 7,
        topicsCount: 9
      },
      {
        id: 'mod_das_3',
        number: 3,
        title: 'Explotación y Estadística de Datos de Salud',
        description: 'Indicadores de frecuentación hospitalaria y control de calidad asistencial.',
        unlockDelayDays: 14,
        topicsCount: 10
      },
      {
        id: 'mod_das_4',
        number: 4,
        title: 'Lex Artis y Protección de Datos (LOPD-GDD)',
        description: 'Derechos del paciente, consentimiento informado y custodia de expedientes.',
        unlockDelayDays: 21,
        topicsCount: 8
      }
    ]
  }
];

const INITIAL_DEMO_TICKETS = [
  {
    id: 'tk_demo_101',
    code: 'TK-8492',
    date: '2026-07-21',
    degree: 'TSIDMN',
    asunto: 'Duda sobre secuencias T1 y T2 en Resonancia Magnética',
    question: 'Hola tutor, ¿cuál es la diferencia fundamental entre el tiempo de repetición (TR) y el tiempo de eco (TE) para potenciar una imagen en T1 vs T2?',
    estado: 'resuelto',
    respuesta: '¡Hola! En T1 utilizamos un TR corto (< 600 ms) y TE corto (< 20 ms) para anular las diferencias de relajación T2. En T2 utilizamos TR largo (> 2000 ms) y TE largo (> 80 ms). Recuerda que la grasa brilla en T1 y el agua/líquido cefalorraquídeo brilla intensamente en T2.'
  },
  {
    id: 'tk_demo_102',
    code: 'TK-9104',
    date: '2026-07-22',
    degree: 'TSIDMN',
    asunto: 'Cálculo de dosis equivalente en Protección Radiológica',
    question: 'En un ejercicio del Módulo 1 piden calcular la dosis equivalente en Sieverts a partir de 5 Gy de radiación Alfa. ¿Se multiplica por el factor W_R = 20?',
    estado: 'resuelto',
    respuesta: 'Correcto. La Dosis Equivalente H = Dosis Absorbida (D) × Factor de Ponderación de la Radiación (W_R). Para partículas Alfa W_R = 20, por lo que 5 Gy × 20 = 100 Sv.'
  },
  {
    id: 'tk_demo_103',
    code: 'TK-9540',
    date: '2026-07-23',
    degree: 'TSIDMN',
    asunto: 'Artefactos por movimiento en Tomografía Computarizada',
    question: '¿Qué algoritmo o filtro de reconstrucción es mejor aplicar para reducir los artefactos en estrella provocados por prótesis metálicas en TAC?',
    estado: 'pendiente',
    respuesta: null
  }
];

export default function StudentProfile({ userPlan = 'free', setUserPlan, onOpenTicketModal }) {
  const navigate = useNavigate();
  const isProMax = userPlan === 'promax';

  // Active Tab: 'account' | 'subscription' | 'progress' | 'tickets'
  const [activeTab, setActiveTab] = useState('account');

  // Account details state
  const [studentName, setStudentName] = useState(() => {
    return localStorage.getItem('academia_student_name') || 'Juan Pérez (Alumno FP)';
  });
  const [studentEmail, setStudentEmail] = useState(() => {
    return localStorage.getItem('academia_student_email') || 'alumno@academiafpsanidad.es';
  });
  const [selectedDegreeId, setSelectedDegreeId] = useState(() => {
    return localStorage.getItem('academia_student_degree') || 'tsidmn';
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Unlocked modules state (via 3.00€ Stripe payment)
  const [unlockedModules, setUnlockedModules] = useState(() => {
    try {
      const saved = localStorage.getItem('academia_unlocked_modules');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Days subscribed simulation (defaults to 3 days for drip logic)
  const [subscriptionDaysAgo, setSubscriptionDaysAgo] = useState(3);

  // Tickets state
  const [tickets, setTickets] = useState(() => {
    try {
      const saved = localStorage.getItem('academia_tickets');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed : INITIAL_DEMO_TICKETS;
      }
    } catch (e) {
      console.warn('Error reading tickets:', e);
    }
    return INITIAL_DEMO_TICKETS;
  });
  const [expandedTicketId, setExpandedTicketId] = useState(null);
  const [ticketFilter, setTicketFilter] = useState('todos'); // 'todos' | 'pendiente' | 'resuelto'

  // Sync state with Supabase if configured
  useEffect(() => {
    async function loadSupabaseData() {
      if (!isSupabaseConfigured()) return;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setStudentEmail(user.email || studentEmail);
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profile) {
            if (profile.nombre || profile.apellidos) {
              setStudentName(`${profile.nombre || ''} ${profile.apellidos || ''}`.trim());
            }
            if (profile.grado) {
              const matched = DEGREES.find(
                (d) => d.id === profile.grado.toLowerCase() || d.code === profile.grado
              );
              if (matched) setSelectedDegreeId(matched.id);
            }
          }

          // Fetch tickets for this user's email
          const { data: userTickets } = await supabase
            .from('tickets')
            .select('*')
            .eq('email', user.email)
            .order('created_at', { ascending: false });

          if (userTickets && userTickets.length > 0) {
            const mapped = userTickets.map((t) => ({
              id: t.id,
              code: `TK-${t.id.slice(0, 6).toUpperCase()}`,
              date: new Date(t.created_at).toISOString().split('T')[0],
              degree: t.grado,
              asunto: t.asunto,
              question: t.mensaje,
              estado: t.estado || 'pendiente',
              respuesta: t.respuesta || null
            }));
            setTickets(mapped);
          }
        }
      } catch (err) {
        console.warn('Error syncing profile with Supabase:', err);
      }
    }
    loadSupabaseData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Handle Degree Change
  const handleDegreeChange = (newDegreeId) => {
    setSelectedDegreeId(newDegreeId);
    localStorage.setItem('academia_student_degree', newDegreeId);
    const degObj = DEGREES.find((d) => d.id === newDegreeId);
    showToast(`Grado actualizado a: ${degObj?.shortName || newDegreeId}`);

    // Update profile in Supabase if logged in
    if (isSupabaseConfigured()) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          supabase
            .from('profiles')
            .update({ grado: degObj?.code || newDegreeId })
            .eq('id', user.id)
            .then(({ error }) => {
              if (error) console.error('Error updating degree in Supabase:', error);
            });
        }
      });
    }
  };

  // Handle Save Profile
  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('academia_student_name', studentName);
    localStorage.setItem('academia_student_email', studentEmail);
    setIsEditingProfile(false);
    showToast('Datos de la cuenta guardados correctamente.');
  };

  // Handle Module 3.00€ Unlock
  const handleUnlockModule = (moduleId) => {
    setUnlockedModules((prev) => {
      if (prev.includes(moduleId)) return prev;
      const updated = [...prev, moduleId];
      localStorage.setItem('academia_unlocked_modules', JSON.stringify(updated));
      return updated;
    });
    showToast('¡Módulo desbloqueado anticipadamente por 3,00 €!');
  };

  // Stripe Portal Redirect
  const handleStripePortalRedirect = () => {
    showToast('Redirigiendo a Stripe Customer Portal...');
    setTimeout(() => {
      window.open('https://billing.stripe.com/p/login/test', '_blank', 'noopener,noreferrer');
    }, 800);
  };

  const currentDegree = DEGREES.find((d) => d.id === selectedDegreeId) || DEGREES[0];

  // Calculate next renewal date (+30 days)
  const nextRenewalDate = new Date();
  nextRenewalDate.setDate(nextRenewalDate.getDate() + 27);
  const formattedRenewalDate = nextRenewalDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Filter tickets
  const filteredTickets = tickets.filter((t) => {
    if (ticketFilter === 'pendiente') return t.estado === 'pendiente';
    if (ticketFilter === 'resuelto') return t.estado === 'resuelto';
    return true;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 text-left text-slate-900 pb-20">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner Component */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
          <GraduationCap className="w-96 h-96 text-white" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-extrabold text-2xl shadow-inner shrink-0">
              {studentName.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  {studentName}
                </h1>
                {isProMax ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/60 text-amber-300 text-xs font-bold shadow-xs">
                    <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    PLAN PRO MAX
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-700/80 border border-slate-600 text-slate-300 text-xs font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-300" />
                    Plan Estándar Activo
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {studentEmail}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-300 font-medium">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {currentDegree.code}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => navigate('/campus/tsidmn')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <FileText className="w-4 h-4 text-slate-800" />
              <span>Ir al Visor de Temario</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex overflow-x-auto gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs no-scrollbar">
        <button
          onClick={() => setActiveTab('account')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'account'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>1. Datos de la Cuenta</span>
        </button>

        <button
          onClick={() => setActiveTab('subscription')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'subscription'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>2. Suscripción y Pagos</span>
        </button>

        <button
          onClick={() => setActiveTab('progress')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'progress'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Unlock className="w-4 h-4" />
          <span>3. Progreso y Desbloqueos</span>
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'tickets'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>4. Historial de Tickets ({tickets.length})</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="space-y-6">

        {/* ---------------------------------------------------- */}
        {/* BLOQUE 1: DATOS DE LA CUENTA */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'account' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Bloque 1: Datos de la Cuenta</h2>
                  <p className="text-xs text-slate-500">Gestión de datos personales y especialidad FP Sanidad matriculada.</p>
                </div>
              </div>

              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
              >
                {isEditingProfile ? 'Cancelar Edición' : 'Editar Datos'}
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              
              <div className="grid sm:grid-cols-2 gap-5">
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Correo Electrónico de la Cuenta
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      disabled={!isEditingProfile}
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border text-xs font-medium transition-all ${
                        isEditingProfile
                          ? 'bg-white border-slate-300 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900'
                          : 'bg-slate-50 border-slate-200 text-slate-600 cursor-not-allowed'
                      }`}
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Name Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Nombre del Alumno / Usuario
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border text-xs font-medium transition-all ${
                        isEditingProfile
                          ? 'bg-white border-slate-300 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900'
                          : 'bg-slate-50 border-slate-200 text-slate-600 cursor-not-allowed'
                      }`}
                    />
                    <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Grado Sanitario Dropdown Selector */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Grado Sanitario Matriculado (Cambiar Grado)
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Adaptado al currículo oficial 2026/2027
                  </span>
                </div>

                <div className="grid gap-3">
                  {DEGREES.map((deg) => {
                    const isSelected = deg.id === selectedDegreeId;
                    return (
                      <div
                        key={deg.id}
                        onClick={() => handleDegreeChange(deg.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-white border border-slate-200 text-slate-800'
                          }`}>
                            {deg.code}
                          </div>
                          <div>
                            <p className="text-xs font-extrabold">{deg.name}</p>
                            <p className={`text-[11px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                              {deg.modules.length} Módulos temáticos • 40+ Temas en PDF
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isSelected ? (
                            <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Matriculado
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-white border border-slate-300 text-slate-700 text-[10px] font-semibold">
                              Seleccionar
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {isEditingProfile && (
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md"
                  >
                    Guardar Cambios de Cuenta
                  </button>
                </div>
              )}
            </form>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* BLOQUE 2: SUSCRIPCIÓN Y PAGOS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'subscription' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Bloque 2: Suscripción y Pagos</h2>
                  <p className="text-xs text-slate-500">Plan actual, fecha de renovación y gestión de facturación vía Stripe.</p>
                </div>
              </div>
            </div>

            {/* Plan Info Card */}
            <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${
              isProMax
                ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-300/40'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                      Estado de Suscripción:
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
                      ACTIVO
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                    {isProMax ? 'Plan PRO MAX (Acceso Total + Soporte)' : 'Plan Estándar (Apuntes & Contenidos)'}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {isProMax
                      ? 'Acceso instantáneo a todos los módulos y consultas ilimitadas con tutores sanitarios.'
                      : 'Acceso a los módulos en formato goteo (Drip Content) y descargas PDF.'}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {isProMax ? '39,00 €' : '19,00 €'}
                  </span>
                  <span className="text-xs text-slate-500 block font-medium">/ mes</span>
                </div>
              </div>

              {/* Subscription details grid */}
              <div className="grid sm:grid-cols-3 gap-4 pt-6 text-xs text-slate-700">
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[11px]">Próxima Renovación:</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                    <Calendar className="w-4 h-4 text-slate-700" />
                    <span>{formattedRenewalDate}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[11px]">Método de Pago:</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                    <CreditCard className="w-4 h-4 text-slate-700" />
                    <span>Visa •••• 4242</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[11px]">Facturación:</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Recibo al día (Stripe)</span>
                  </div>
                </div>
              </div>

              {/* Stripe Customer Portal Redirect CTA */}
              <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <p className="text-xs text-slate-600">
                  Puedes modificar tu tarjeta, descargar facturas en PDF o cancelar tu suscripción en cualquier momento desde la pasarela segura de Stripe.
                </p>

                <button
                  onClick={handleStripePortalRedirect}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shrink-0"
                >
                  <span>Gestionar Método de Pago o Cancelar</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Simulation controls for DEV role switching */}
            {import.meta.env.DEV && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    Prueba de Roles (DEV Simulator):
                  </span>
                  <span className="text-[11px] text-slate-500">Cambia de plan en tiempo real</span>
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => {
                      setUserPlan && setUserPlan('free');
                      showToast('Cambiado a Plan Estándar (Free)');
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                      !isProMax
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Simular Plan Estándar (19€)
                  </button>

                  <button
                    onClick={() => {
                      setUserPlan && setUserPlan('promax');
                      showToast('Cambiado a Plan PRO MAX (39€)');
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                      isProMax
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Simular Plan PRO MAX (39€)
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* BLOQUE 3: MI PROGRESO Y DESBLOQUEOS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'progress' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                  <Unlock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Bloque 3: Mi Progreso y Desbloqueos</h2>
                  <p className="text-xs text-slate-500">
                    Módulos activos por antigüedad, desbloqueos anticipados de 3,00 € y próximos lanzamientos.
                  </p>
                </div>
              </div>

              {/* Dev Antigüedad simulator */}
              {import.meta.env.DEV && (
                <div className="flex items-center gap-2 text-xs bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[11px] font-semibold">Simular Antigüedad:</span>
                  <select
                    value={subscriptionDaysAgo}
                    onChange={(e) => setSubscriptionDaysAgo(Number(e.target.value))}
                    className="bg-white border border-slate-300 text-slate-800 font-semibold rounded-lg px-2 py-1 text-xs focus:outline-none"
                  >
                    <option value={0}>0 días (Nuevo alumno)</option>
                    <option value={8}>8 días (Módulos 1 y 2 OK)</option>
                    <option value={15}>15 días (Módulos 1, 2 y 3 OK)</option>
                    <option value={22}>22 días (Todos desbloqueados)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Modules List for Current Degree */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Módulos de {currentDegree.shortName} ({currentDegree.modules.length}):
                </h3>
                <span className="text-xs font-semibold text-slate-500">
                  Grado Activo: <strong className="text-slate-900">{currentDegree.code}</strong>
                </span>
              </div>

              <div className="grid gap-4">
                {currentDegree.modules.map((mod) => {
                  const isDripUnlocked = subscriptionDaysAgo >= mod.unlockDelayDays || isProMax;
                  const isPaidUnlocked = unlockedModules.includes(mod.id);
                  const isUnlocked = isDripUnlocked || isPaidUnlocked;

                  // Release date calculation
                  const releaseDate = new Date();
                  releaseDate.setDate(releaseDate.getDate() + (mod.unlockDelayDays - subscriptionDaysAgo));
                  const formattedReleaseDate = releaseDate.toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short'
                  });

                  return (
                    <div
                      key={mod.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        isUnlocked
                          ? 'bg-white border-slate-200 shadow-xs'
                          : 'bg-slate-50/80 border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 border ${
                          isUnlocked
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-200 text-slate-500 border-slate-300'
                        }`}>
                          Mod {mod.number}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-extrabold text-slate-900 text-base">{mod.title}</h4>
                            
                            {/* Badges */}
                            {isProMax ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold flex items-center gap-1">
                                <Zap className="w-3 h-3 text-amber-600 fill-amber-600" />
                                PRO MAX Total
                              </span>
                            ) : isPaidUnlocked ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold flex items-center gap-1">
                                <Unlock className="w-3 h-3" />
                                Desbloqueado (3,00 €)
                              </span>
                            ) : isDripUnlocked ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Activo por antigüedad
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-semibold flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Próximo Lanzamiento: {formattedReleaseDate}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                            {mod.description}
                          </p>

                          <span className="text-[11px] font-mono text-slate-400 font-semibold block pt-1">
                            {mod.topicsCount} Temas en PDF • Exámenes Oficiales Incluidos
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="w-full sm:w-auto shrink-0 flex justify-end">
                        {isUnlocked ? (
                          <button
                            onClick={() => navigate('/campus/tsidmn')}
                            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
                          >
                            <span>Acceder al Temario</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnlockModule(mod.id)}
                            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-md"
                          >
                            <Unlock className="w-4 h-4" />
                            <span>Desbloquear por 3,00 €</span>
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* BLOQUE 4: HISTORIAL DE TICKETS DE DUDAS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'tickets' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Bloque 4: Historial de Tickets de Dudas</h2>
                  <p className="text-xs text-slate-500">Consultas enviadas a profesores sanitarios y respuestas técnicas recibidas.</p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (onOpenTicketModal) {
                    onOpenTicketModal();
                  } else {
                    showToast('Abre el formulario de tickets desde el Campus');
                  }
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shrink-0"
              >
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <span>Nueva Consulta a Tutor</span>
              </button>
            </div>

            {/* Filter buttons */}
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

            {/* Tickets Table / Card List */}
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                <MessageSquare className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-600 font-medium">No se encontraron tickets con este filtro.</p>
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

                            {/* Status Tag */}
                            {isResolved ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Resuelto
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-700" />
                                Pendiente
                              </span>
                            )}

                            <span className="text-[11px] text-slate-400 font-mono">
                              {t.date}
                            </span>
                          </div>

                          <h4 className="font-extrabold text-slate-900 text-sm">{t.asunto}</h4>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <span className="text-xs text-slate-500 font-semibold">
                            {isExpanded ? 'Ocultar' : 'Ver detalle'}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-600" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Ticket Details */}
                      {isExpanded && (
                        <div className="pt-4 border-t border-slate-200/80 space-y-4 text-xs">
                          {/* Student Question */}
                          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
                            <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                              Tu Consulta:
                            </span>
                            <p className="text-slate-700 leading-relaxed font-medium">
                              "{t.question}"
                            </p>
                          </div>

                          {/* Tutor Technical Response */}
                          <div className={`p-4 rounded-xl border space-y-2 ${
                            isResolved
                              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                              : 'bg-amber-50/70 border-amber-200 text-amber-950'
                          }`}>
                            <div className="flex items-center gap-2 font-bold text-xs">
                              <ShieldCheck className={`w-4 h-4 ${isResolved ? 'text-emerald-700' : 'text-amber-700'}`} />
                              <span>
                                {isResolved
                                  ? 'Respuesta Técnica del Tutor Colegiado:'
                                  : 'Estado de Revisión Docente:'}
                              </span>
                            </div>

                            <p className="leading-relaxed">
                              {isResolved
                                ? t.respuesta
                                : 'Tu consulta ha sido asignada a un docente especialista en la materia. Recibirás respuesta en menos de 24 horas.'}
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

    </div>
  );
}
