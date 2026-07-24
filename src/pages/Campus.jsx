import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Zap,
  Clock,
  RefreshCw,
  GraduationCap
} from 'lucide-react';
import StudentLayout from '../components/StudentLayout';
import DripModuleCard from '../components/DripModuleCard';

const SAMPLE_MODULES = [
  {
    id: 'mod_1',
    module_number: 1,
    title: 'Radiobiología y Protección Radiológica',
    subtitle: 'Módulo 1 • 12 Temas en PDF',
    description: 'Generación de Rayos X, dosimetría personal, efectos biológicos de la radiación y normas de protección.',
    unlock_delay_days: 0,
    topics_count: 12,
    stripe_unlock_url: 'https://buy.stripe.com/test_unlock3euro'
  },
  {
    id: 'mod_2',
    module_number: 2,
    title: 'Tomografía Computarizada (TC)',
    subtitle: 'Módulo 2 • 10 Temas en PDF',
    description: 'Adquisición helicoidal, escala Hounsfield, reconstrucciones MPR/MIP y protocolos con contraste.',
    unlock_delay_days: 7,
    topics_count: 10,
    stripe_unlock_url: 'https://buy.stripe.com/test_unlock3euro'
  },
  {
    id: 'mod_3',
    module_number: 3,
    title: 'Resonancia Magnética (RM)',
    subtitle: 'Módulo 3 • 14 Temas en PDF',
    description: 'Física de la relajación T1/T2, secuencias Spin-Echo y FLAIR, gradientes magnéticos y seguridad.',
    unlock_delay_days: 14,
    topics_count: 14,
    stripe_unlock_url: 'https://buy.stripe.com/test_unlock3euro'
  },
  {
    id: 'mod_4',
    module_number: 4,
    title: 'Medicina Nuclear y PET-TC',
    subtitle: 'Módulo 4 • 8 Temas en PDF',
    description: 'Gammagrafía planar y SPECT, radiofármacos, radioprotección y tomografía por emisión de positrones.',
    unlock_delay_days: 21,
    topics_count: 8,
    stripe_unlock_url: 'https://buy.stripe.com/test_unlock3euro'
  }
];

export default function Campus({ currentUser, onSelectUser, userPlan = 'free', setUserPlan, initialView = 'temario' }) {
  const isProMax = userPlan === 'promax' || currentUser?.plan === 'promax';

  const sectionMap = {
    profile: 'perfil',
    perfil: 'perfil',
    videoteca: 'videoteca',
    tickets: 'tickets',
    temario: 'temario',
    visor: 'temario'
  };
  const mappedSection = sectionMap[initialView] || 'temario';

  // State for user subscription date (defaults to 3 days ago for testing drip logic)
  const [subscriptionDaysAgo, setSubscriptionDaysAgo] = useState(3);
  const userSubscriptionDate = new Date(Date.now() - subscriptionDaysAgo * 24 * 60 * 60 * 1000).toISOString();

  // State for modules unlocked via 3€ payment
  const [unlockedModules, setUnlockedModules] = useState(() => {
    try {
      const saved = localStorage.getItem('academia_unlocked_modules');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleUnlockModule = (moduleId) => {
    setUnlockedModules((prev) => {
      if (prev.includes(moduleId)) return prev;
      const updated = [...prev, moduleId];
      localStorage.setItem('academia_unlocked_modules', JSON.stringify(updated));
      return updated;
    });
  };

  const handleResetUnlocks = () => {
    localStorage.removeItem('academia_unlocked_modules');
    setUnlockedModules([]);
  };

  return (
    <StudentLayout
      currentUser={currentUser}
      onSelectUser={onSelectUser}
      userPlan={userPlan}
      setUserPlan={setUserPlan}
      activeSection={mappedSection}
    >
      {/* Visor / Temario View Content */}
      <div className="w-full max-w-5xl mx-auto space-y-6 text-left animate-fadeIn">
        
        {/* Welcome & Drip Info Banner */}
        <div className={`bg-white rounded-2xl border p-6 sm:p-8 space-y-4 relative shadow-sm ${
          isProMax ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-900" />
                <span>Acceso Alumno Activo</span>
              </div>
              {isProMax ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
                  <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                  <span>PLAN PRO MAX DESBLOQUEADO</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Sistema de Goteo (Drip Content) Activo</span>
                </div>
              )}
            </div>

            {/* Dev Controls for Testing Drip Content */}
            {import.meta.env.DEV && (
              <div className="flex items-center gap-2 text-xs bg-slate-100 p-1.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px] font-semibold pl-1">Simular Antigüedad:</span>
                <select
                  value={subscriptionDaysAgo}
                  onChange={(e) => setSubscriptionDaysAgo(Number(e.target.value))}
                  className="bg-white border border-slate-300 text-slate-800 font-semibold rounded px-2 py-1 text-xs focus:outline-none"
                >
                  <option value={0}>0 días (Nuevo)</option>
                  <option value={3}>3 días (Módulo 1 OK)</option>
                  <option value={10}>10 días (Módulos 1 y 2 OK)</option>
                  <option value={18}>18 días (Módulos 1, 2 y 3 OK)</option>
                  <option value={25}>25 días (Todos desbloqueados)</option>
                </select>
                {unlockedModules.length > 0 && (
                  <button
                    onClick={handleResetUnlocks}
                    className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded"
                    title="Reiniciar desbloqueos pagados"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900">¡Bienvenido a tu Campus Virtual!</h2>
          <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
            {isProMax
              ? 'Con el Plan PRO MAX tienes desbloqueados todos los módulos y temas de forma inmediata con descarga completa de PDFs.'
              : 'Los contenidos se liberan semanalmente según tu antigüedad de suscripción. ¿Necesitas un tema antes? Puedes realizar un **Desbloqueo Anticipado por 3,00 €**.'}
          </p>
        </div>

        {/* Modules Grid with Drip Content Logic */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
            Módulos del Curso ({SAMPLE_MODULES.length}):
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SAMPLE_MODULES.map((mod) => (
              <DripModuleCard
                key={mod.id}
                module={mod}
                userSubscriptionDate={userSubscriptionDate}
                unlockedModules={unlockedModules}
                userPlan={userPlan}
                onUnlockModule={handleUnlockModule}
                onOpenContent={(m) => alert(`Abriendo temario del ${m.title}`)}
              />
            ))}
          </div>
        </div>

      </div>
    </StudentLayout>
  );
}
