import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Zap,
  Clock,
  RefreshCw,
  GraduationCap,
  Layers,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import StudentLayout from '../components/StudentLayout';
import DripModuleCard from '../components/DripModuleCard';
import { useAuth } from '../context/AuthContext';

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
  const navigate = useNavigate();
  const {
    user,
    role,
    isSuperadmin,
    isPremium,
    subscriptionStatus,
    subscribedModuleIds,
    planType,
    updateSubscribedModules,
    isSubscriptionActive
  } = useAuth();

  const effectiveEmail = currentUser?.email || user?.email || '';
  const isTargetSuperadmin = effectiveEmail.toLowerCase().trim() === 'gorkaobiangolaso@gmail.com' || isSuperadmin || role === 'superadmin' || currentUser?.role === 'superadmin';
  const isProMax = userPlan === 'promax' || currentUser?.plan === 'promax' || isPremium || isTargetSuperadmin;

  const sectionMap = {
    profile: 'perfil',
    perfil: 'perfil',
    videoteca: 'videoteca',
    tickets: 'tickets',
    temario: 'temario',
    visor: 'temario'
  };
  const mappedSection = sectionMap[initialView] || 'temario';

  // State for simulated module subscription (defaults to context state or 'mod_1', 'mod_2')
  const [activePlanType, setActivePlanType] = useState(planType || 'pro'); // 'basic', 'pro', 'total'
  const [activeSubscribedModules, setActiveSubscribedModules] = useState(() => {
    return subscribedModuleIds || ['mod_1', 'mod_2'];
  });

  // State for user subscription date
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

  const handleSelectSimulatedPlan = (pType) => {
    setActivePlanType(pType);
    if (pType === 'basic') {
      const basicMods = ['mod_1'];
      setActiveSubscribedModules(basicMods);
      if (updateSubscribedModules) updateSubscribedModules(basicMods, 'basic');
    } else if (pType === 'pro') {
      const proMods = ['mod_1', 'mod_2'];
      setActiveSubscribedModules(proMods);
      if (updateSubscribedModules) updateSubscribedModules(proMods, 'pro');
    } else if (pType === 'total') {
      const totalMods = ['all'];
      setActiveSubscribedModules(totalMods);
      if (updateSubscribedModules) updateSubscribedModules(totalMods, 'total');
    }
  };

  const handleUpgradePlan = (mod) => {
    window.open('https://billing.stripe.com/p/login/test', '_blank', 'noopener,noreferrer');
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
        
        {/* Welcome & Subscription Status Banner */}
        <div className={`bg-white rounded-2xl border p-6 sm:p-8 space-y-5 relative shadow-sm ${
          activePlanType === 'total' ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Suscripción Mensual Activa</span>
              </div>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {activePlanType === 'basic' && 'Plan Básico (1 Módulo)'}
                  {activePlanType === 'pro' && 'Plan Profesional (2-3 Módulos)'}
                  {activePlanType === 'total' && 'Plan Total (Acceso Ilimitado)'}
                </span>
              </div>
            </div>

            {/* Dev Selector to Test Plan Switching & Uncontracted Modules */}
            <div className="flex items-center gap-2 text-xs bg-slate-100 p-2 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-bold text-[11px] pl-1">Simular Plan Contratado:</span>
              <button
                onClick={() => handleSelectSimulatedPlan('basic')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  activePlanType === 'basic' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                1 Módulo (Básico)
              </button>
              <button
                onClick={() => handleSelectSimulatedPlan('pro')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  activePlanType === 'pro' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                2-3 Módulos (Pro)
              </button>
              <button
                onClick={() => handleSelectSimulatedPlan('total')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  activePlanType === 'total' ? 'bg-amber-500 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                Todos (Total)
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Módulos del Ciclo Formativo
            </h2>
            <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
              Consulta los módulos contratados en tu suscripción mensual. Si deseas acceder a asignaturas adicionales, puedes realizar una ampliación de plan o desbloquear de forma anticipada.
            </p>
          </div>
        </div>

        {/* Modules Grid with Contracted vs Uncontracted (Bloqueado / Ampliar plan) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Listado de Módulos Sanitaria ({SAMPLE_MODULES.length}):
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Suscripción por número de módulos (sin matrícula inicial)
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SAMPLE_MODULES.map((mod) => (
              <DripModuleCard
                key={mod.id}
                module={mod}
                subscribedModuleIds={activeSubscribedModules}
                planType={activePlanType}
                userSubscriptionDate={userSubscriptionDate}
                unlockedModules={unlockedModules}
                userPlan={userPlan}
                isSubscriptionActive={isSubscriptionActive}
                onUnlockModule={handleUnlockModule}
                onUpgradePlan={handleUpgradePlan}
                onOpenContent={(m) => alert(`Accediendo al temario completo del ${m.title}`)}
              />
            ))}
          </div>
        </div>

      </div>
    </StudentLayout>
  );
}
