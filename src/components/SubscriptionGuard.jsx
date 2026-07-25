import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { ShieldAlert, ExternalLink, RefreshCw, CreditCard, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SubscriptionGuard({ children }) {
  const { user, loading, isSubscriptionActive, subscriptionStatus, isSuperadmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-sm font-semibold text-slate-400">Verificando estado de suscripción...</p>
        </div>
      </div>
    );
  }

  // 1. If not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If subscription is NOT active and not superadmin, render subscription lock screen
  if (!isSubscriptionActive && !isSuperadmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl space-y-6 text-center">
          
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono uppercase tracking-wider font-bold">
              Suscripción Inactiva ({subscriptionStatus.toUpperCase()})
            </span>
            <h1 className="text-2xl font-extrabold text-white">Acceso al Campus Requerido</h1>
            <p className="text-slate-400 text-xs leading-relaxed">
              Tu suscripción mensual actual no se encuentra activa. Para continuar disfrutando del material didáctico, videoteca y tutorías sin matrícula inicial, activa o renueva tu plan.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 text-xs text-slate-300 text-left space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Estado de pago:</span>
              <span className="font-bold text-rose-400 capitalize">{subscriptionStatus}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Matrícula inicial:</span>
              <span className="font-bold text-emerald-400">0,00 € (Gratis)</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <a
              href="https://billing.stripe.com/p/login/test"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Activar / Gestionar Suscripción en Stripe</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <Link
              to="/#precios"
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all flex items-center justify-center gap-2"
            >
              <span>Ver Planes de Suscripción Comparativos</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return children;
}
