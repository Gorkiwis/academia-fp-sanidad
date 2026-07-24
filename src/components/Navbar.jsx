import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, Menu, X, Download, ShieldCheck, User, Zap, BookOpen, GraduationCap, Lock, LogIn, UserPlus } from 'lucide-react';

export default function Navbar({
  onOpenLeadModal,
  onOpenTicketModal,
  onOpenLoginModal,
  userPlan = 'free',
  currentView = 'landing',
  onSelectView,
  currentUser
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isProMax = userPlan === 'promax' || currentUser?.plan === 'promax';
  const isAdmin = currentUser?.role === 'admin' || location.pathname === '/admin' || location.search.includes('admin=true');
  const isLoggedOrPro = isProMax || location.pathname.includes('/campus') || location.pathname.includes('/perfil') || isAdmin;

  const handleStudentAccess = () => {
    if (onOpenLoginModal) {
      onOpenLoginModal();
    } else {
      navigate('/login');
    }
  };

  const handleGoToProfile = () => {
    if (onSelectView) {
      onSelectView('profile');
    } else {
      navigate('/campus/tsidmn?view=profile');
    }
  };

  const handleGoToVisor = () => {
    if (onSelectView) {
      onSelectView('visor');
    } else {
      navigate('/campus/tsidmn');
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Active Mode Indicator Badge */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-base tracking-tight text-slate-900">
                  Academia FP <span className="text-blue-600">Sanidad</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">
                  Nº1 en Especialización FP
                </span>
              </div>
            </Link>

            {/* Visual Indicator of Active Session/Role */}
            <div className="hidden md:flex items-center">
              {isAdmin ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-300 shadow-xs">
                  <Lock className="w-3.5 h-3.5 text-rose-600" />
                  <span>Modo: Admin</span>
                </span>
              ) : isProMax ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
                  <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                  <span>Modo: Alumno PRO MAX</span>
                </span>
              ) : null}
            </div>
          </div>

          {/* View Toggler when in Campus/Profile zone */}
          {(location.pathname.includes('/campus') || location.pathname.includes('/perfil')) ? (
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={handleGoToVisor}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
                  currentView === 'visor'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Temario / Visor</span>
              </button>
              
              <button
                onClick={handleGoToProfile}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
                  currentView === 'profile'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Mi Perfil</span>
                {isProMax && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
              </button>
            </div>
          ) : (
            /* Desktop Navigation Links for Landing */
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="#nota-corte" className="hover:text-slate-900 transition-colors">Nota de Corte FP</a>
              <a href="#grados" className="hover:text-slate-900 transition-colors">Grados FP Sanidad</a>
              <a href="#precios" className="hover:text-slate-900 transition-colors">Planes</a>
              <a href="#dudas" className="hover:text-slate-900 transition-colors flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                Garantía & Dudas
              </a>
            </div>
          )}

          {/* Action CTAs: Botones /login y /colabora */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/login"
              className="text-slate-700 hover:text-slate-900 font-medium text-sm px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors"
            >
              Iniciar Sesión
            </Link>

            <Link
              to="/colabora"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Unirse al Equipo
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900"
              aria-label="Menu Toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 pt-3 pb-6 space-y-3 text-left">
          
          <a
            href="#nota-corte"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Nota de Corte FP Sanidad
          </a>
          <a
            href="#grados"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Grados FP Sanidad
          </a>
          <a
            href="#precios"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Planes y Precios
          </a>
          
          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2.5">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center text-slate-700 hover:text-slate-900 font-medium text-sm px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors"
            >
              Iniciar Sesión
            </Link>

            <Link
              to="/colabora"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              Unirse al Equipo
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
