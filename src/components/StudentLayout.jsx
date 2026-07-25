import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  Video,
  MessageSquare,
  User,
  Activity,
  LogOut,
  Menu,
  X,
  Zap,
  Lock,
  GraduationCap,
  ShieldCheck,
  Bell,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import DevToolbar from './DevToolbar';
import StudentProfile from './StudentProfile';
import VideoLibrary from './VideoLibrary';
import TicketArea from './TicketArea';
import { useAuth } from '../context/AuthContext';

export default function StudentLayout({
  currentUser,
  onSelectUser,
  userPlan = 'free',
  setUserPlan,
  children,
  activeSection: propActiveSection
}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Active section state: 'temario' | 'videoteca' | 'tickets' | 'perfil'
  const [activeSection, setActiveSection] = useState(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'videoteca') return 'videoteca';
    if (tabParam === 'tickets') return 'tickets';
    if (tabParam === 'perfil' || tabParam === 'profile') return 'perfil';
    if (propActiveSection) return propActiveSection;
    return 'temario';
  });

  const [contextualVideoQuestion, setContextualVideoQuestion] = useState(null);

  // Sync with URL query parameter ?tab=...
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['temario', 'videoteca', 'tickets', 'perfil'].includes(tabParam)) {
      if (tabParam !== activeSection) {
        setActiveSection(tabParam);
      }
    }
  }, [searchParams]);

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    setSearchParams({ tab: sectionId });
    setMobileSidebarOpen(false);
  };

  const handleAskQuestionFromVideo = (videoObj) => {
    setContextualVideoQuestion(videoObj);
    handleNavClick('tickets');
  };

  const { user, role, isSuperadmin, isPremium } = useAuth();
  const effectiveEmail = currentUser?.email || user?.email || '';
  const isTargetSuperadmin = effectiveEmail.toLowerCase().trim() === 'gorkaobiangolaso@gmail.com' || isSuperadmin || role === 'superadmin' || currentUser?.role === 'superadmin';

  const isProMax = userPlan === 'promax' || currentUser?.plan === 'promax' || isPremium || isTargetSuperadmin;
  const isAdmin = currentUser?.role === 'admin' || isTargetSuperadmin;

  const navItems = [
    {
      id: 'temario',
      label: 'Temario y Apuntes',
      icon: BookOpen,
      badge: '4 Módulos'
    },
    {
      id: 'videoteca',
      label: 'Videoteca y Clases',
      icon: Video,
      badge: 'HD Streaming'
    },
    {
      id: 'tickets',
      label: 'Mis Tickets de Dudas',
      icon: MessageSquare,
      badge: 'Soporte Docente'
    },
    {
      id: 'perfil',
      label: 'Mi Perfil y Suscripción',
      icon: User,
      badge: isProMax ? 'PRO MAX' : 'Estándar'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col md:flex-row relative">
      
      {/* Dev Toolbar Floating Widget */}
      <DevToolbar
        currentUser={currentUser}
        onSelectUser={onSelectUser}
        userPlan={userPlan}
        onChangePlan={setUserPlan}
      />

      {/* Mobile Top Bar */}
      <div className="md:hidden sticky top-0 z-40 bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shadow-md">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold">
            <Activity className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white">FP Sanidad</span>
        </Link>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* LEFT SIDEBAR NAVIGATION */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-40 w-64 bg-slate-900 text-white flex flex-col justify-between p-5 border-r border-slate-800 transition-transform duration-300 md:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } h-screen shrink-0`}
      >
        <div className="space-y-6">
          
          {/* Logo & Brand Header */}
          <Link to="/" className="flex items-center gap-3 px-2 pt-1 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-sm text-white tracking-tight">
                Academia FP <span className="text-amber-400">Sanidad</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Área Privada Alumnos
              </span>
            </div>
          </Link>

          {/* Active Session Status Card */}
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Usuario Activo:</span>
              {isAdmin ? (
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] font-extrabold">
                  ADMIN
                </span>
              ) : isProMax ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-extrabold">
                  PRO MAX
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 text-[9px] font-semibold">
                  ESTÁNDAR
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {(currentUser?.name || 'A').charAt(0)}
              </div>
              <div className="truncate">
                <p className="font-extrabold text-white text-xs truncate">
                  {currentUser?.name || 'Alumno FP Sanidad'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {currentUser?.email || 'alumno@test.com'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-2">
              Navegación Principal
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-extrabold transition-all text-left ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                    isActive
                      ? 'bg-slate-950 text-amber-300 font-bold'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </nav>

        </div>

        {/* Bottom Sidebar Action */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>Volver a la Web Principal</span>
          </Link>
        </div>

      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="hidden md:flex sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-8 py-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Zona Alumno:
            </span>
            <h2 className="text-lg font-extrabold text-slate-900">
              {activeSection === 'temario' && 'Temario y Apuntes sintetizados'}
              {activeSection === 'videoteca' && 'Videoteca y Clases Magistrales'}
              {activeSection === 'tickets' && 'Mis Tickets de Dudas y Consultas'}
              {activeSection === 'perfil' && 'Mi Perfil y Suscripción'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Monthly Subscription Status Badge */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 border bg-emerald-50 text-emerald-800 border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Suscripción: Activa</span>
              </span>
            </div>

            {/* Manage Subscription Button (Stripe Customer Portal) */}
            <a
              href="https://billing.stripe.com/p/login/test"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="Gestionar tu plan y pagos en el Stripe Customer Portal"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Gestionar suscripción</span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </a>

            <button
              onClick={() => handleNavClick('perfil')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Ir a Mi Perfil"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Section Switcher */}
        <main className="p-6 sm:p-10 flex-1">
          {activeSection === 'temario' && (children || null)}

          {activeSection === 'videoteca' && (
            <VideoLibrary onAskQuestion={handleAskQuestionFromVideo} />
          )}

          {activeSection === 'tickets' && (
            <TicketArea initialFormContext={contextualVideoQuestion} />
          )}

          {activeSection === 'perfil' && (
            <StudentProfile
              userPlan={userPlan}
              setUserPlan={setUserPlan}
              onOpenTicketModal={() => handleNavClick('tickets')}
            />
          )}
        </main>

      </div>

    </div>
  );
}
