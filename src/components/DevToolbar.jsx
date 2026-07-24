import React from 'react';
import { User, Zap, Lock, Terminal, GraduationCap } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function DevToolbar({ currentUser, onSelectUser, userPlan, onChangePlan }) {
  // Only render if in development environment
  if (!import.meta.env.DEV) {
    return null;
  }

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAdminActive = searchParams.get('admin') === 'true' || window.location.pathname === '/admin';

  const activeRole = currentUser?.role || (isAdminActive ? 'admin' : 'student');
  const activePlan = currentUser?.plan || userPlan || 'free';

  const isAdminSelected = activeRole === 'admin' || isAdminActive;
  const isProMaxSelected = !isAdminSelected && activePlan === 'promax';

  const handleSetAdmin = () => {
    const adminUser = {
      email: 'admin@academiafpsanidad.es',
      role: 'admin',
      plan: 'promax',
      name: 'Gorka (Admin)'
    };
    localStorage.setItem('active_dev_user', JSON.stringify(adminUser));
    localStorage.setItem('dev_user_plan', 'promax');
    sessionStorage.setItem('admin_authenticated', 'true'); // Auto-authorize PIN for convenience in dev mode

    if (onSelectUser) {
      onSelectUser(adminUser);
    } else if (onChangePlan) {
      onChangePlan('promax');
    }

    // Redirect to ?admin=true
    navigate('/?admin=true');
  };

  const handleSetAlumnoProMax = () => {
    const proMaxUser = {
      email: 'alumno_promax@test.com',
      role: 'student',
      plan: 'promax',
      name: 'Alumno PRO MAX'
    };
    localStorage.setItem('active_dev_user', JSON.stringify(proMaxUser));
    localStorage.setItem('dev_user_plan', 'promax');

    if (onSelectUser) {
      onSelectUser(proMaxUser);
    } else if (onChangePlan) {
      onChangePlan('promax');
    }

    // Exit admin view if currently in admin
    if (isAdminActive) {
      navigate('/campus/tsidmn');
    }
  };

  const handleSetAlumnoFree = () => {
    const freeUser = {
      email: 'alumno@academiafpsanidad.es',
      role: 'student',
      plan: 'free',
      name: 'Alumno Estándar'
    };
    localStorage.setItem('active_dev_user', JSON.stringify(freeUser));
    localStorage.setItem('dev_user_plan', 'free');

    if (onSelectUser) {
      onSelectUser(freeUser);
    } else if (onChangePlan) {
      onChangePlan('free');
    }

    if (isAdminActive) {
      navigate('/');
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 p-2 bg-slate-900/95 text-white rounded-full shadow-2xl border border-slate-700/80 backdrop-blur-md transition-all duration-300 hover:border-slate-500 max-w-[95vw] overflow-x-auto no-scrollbar">
      
      {/* Dev Label Badge */}
      <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 rounded-full border border-slate-700 text-[11px] font-semibold tracking-wider text-slate-300 uppercase shrink-0">
        <Terminal className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span className="hidden sm:inline">DEV Toolbar</span>
      </div>

      <div className="h-4 w-px bg-slate-700 mx-0.5 shrink-0" />

      {/* Button 1: [👤 Iniciar como Admin (Gorka)] */}
      <button
        onClick={handleSetAdmin}
        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
          isAdminSelected
            ? 'bg-rose-600 text-white border border-rose-400 shadow-md shadow-rose-600/30 ring-2 ring-rose-500/40'
            : 'bg-slate-800 text-rose-300 border border-rose-500/40 hover:bg-rose-900/50 hover:text-white'
        }`}
        title="Iniciar como Admin (Gorka) con acceso total a panel de control"
      >
        <User className="w-3.5 h-3.5 text-rose-300" />
        <span>👤 Iniciar como Admin (Gorka)</span>
      </button>

      {/* Button 2: [🎓 Iniciar como Alumno PRO MAX] */}
      <button
        onClick={handleSetAlumnoProMax}
        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
          isProMaxSelected
            ? 'bg-amber-500 text-slate-950 border border-amber-300 shadow-md shadow-amber-500/30 ring-2 ring-amber-400/40 font-extrabold'
            : 'bg-slate-800 text-amber-300 border border-amber-500/40 hover:bg-amber-900/50 hover:text-amber-200'
        }`}
        title="Iniciar como Alumno PRO MAX (Sin drip, todo desbloqueado y tickets de duda)"
      >
        <GraduationCap className="w-4 h-4 text-amber-400" />
        <span>🎓 Iniciar como Alumno PRO MAX</span>
      </button>

      {/* Option 3: [Vista Gratis] */}
      <button
        onClick={handleSetAlumnoFree}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
          !isAdminSelected && activePlan === 'free'
            ? 'bg-slate-700 text-white border border-slate-500 shadow-sm font-semibold'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`}
        title="Forzar usuario Plan Gratis (con restricción por fecha / goteo)"
      >
        <User className="w-3.5 h-3.5 text-slate-400" />
        <span className="hidden md:inline">Vista Gratis</span>
      </button>

    </div>
  );
}
