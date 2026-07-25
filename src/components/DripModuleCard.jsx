import React, { useState } from 'react';
import { Lock, Unlock, CheckCircle2, Download, BookOpen, Clock, Zap, PlusCircle, ExternalLink, ShieldAlert } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function DripModuleCard({
  module,
  subscribedModuleIds = ['mod_1', 'mod_2'],
  planType = 'pro',
  userSubscriptionDate,
  unlockedModules = [],
  userPlan = 'free',
  isSubscriptionActive = true,
  onUnlockModule,
  onOpenContent,
  onUpgradePlan
}) {
  const [loadingUnlock, setLoadingUnlock] = useState(false);

  // 1. Check if module is contracted in user's monthly plan
  const isPlanTotalOrProMax = planType === 'total' || userPlan === 'promax';
  const isContracted = isPlanTotalOrProMax || (Array.isArray(subscribedModuleIds) && (subscribedModuleIds.includes('all') || subscribedModuleIds.includes(module.id)));

  // 2. Drip logic for contracted modules
  const subDate = userSubscriptionDate ? new Date(userSubscriptionDate) : new Date();
  const now = new Date();
  const diffTime = Math.max(0, now.getTime() - subDate.getTime());
  const daysActive = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const unlockDelay = module?.unlock_delay_days ?? 0;
  const isUnlockedByTime = daysActive >= unlockDelay;
  const isUnlockedByPay = Array.isArray(unlockedModules) && unlockedModules.includes(module.id);
  
  const canAccessContent = isContracted && (isPlanTotalOrProMax || isUnlockedByTime || isUnlockedByPay);
  const daysRemaining = Math.max(0, unlockDelay - daysActive);

  // Handle 3,00 € Early Unlock Click
  const handleUnlockClick = async () => {
    setLoadingUnlock(true);

    if (import.meta.env.DEV) {
      setTimeout(() => {
        if (onUnlockModule) onUnlockModule(module.id);
        setLoadingUnlock(false);
      }, 400);
    } else {
      try {
        if (isSupabaseConfigured()) {
          const sessionUser = (await supabase.auth.getUser())?.data?.user;
          if (sessionUser?.id) {
            await supabase.from('user_module_unlocks').insert([
              {
                user_id: sessionUser.id,
                module_id: module.id
              }
            ]);
          }
        }
      } catch (err) {
        console.warn('Error recording module unlock in Supabase:', err);
      } finally {
        const checkoutUrl = module.stripe_unlock_url || 'https://buy.stripe.com/test_unlock3euro';
        window.location.href = checkoutUrl;
        setLoadingUnlock(false);
      }
    }
  };

  // Handle Upgrade Plan Click
  const handleUpgradeClick = () => {
    if (onUpgradePlan) {
      onUpgradePlan(module);
    } else {
      window.open('https://billing.stripe.com/p/login/test', '_blank', 'noopener,noreferrer');
    }
  };

  // CASE 1: MODULE IS NOT CONTRACTED IN PLAN
  if (!isContracted) {
    return (
      <div className="rounded-xl border border-slate-300 bg-slate-100/90 p-5 transition-all flex flex-col justify-between text-left relative shadow-xs">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="p-2.5 rounded-lg bg-rose-100 text-rose-700">
              <Lock className="w-5 h-5" />
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
              <ShieldAlert className="w-3 h-3 text-rose-600" />
              Bloqueado / Ampliar plan
            </span>
          </div>

          <div>
            <h3 className="font-bold text-slate-800 text-base leading-snug">
              {module.title || module.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              {module.subtitle || `Módulo ${module.module_number || ''} • ${module.topics_count || 10} Temas en PDF`}
            </p>
            <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
              {module.description}
            </p>
          </div>
        </div>

        {/* Lock Overlay Banner */}
        <div className="pt-6 space-y-3 border-t border-slate-200 mt-4">
          <div className="bg-rose-50/80 border border-rose-200 p-2.5 rounded-lg text-rose-900 text-xs space-y-0.5">
            <p className="font-bold text-[11px] uppercase tracking-wide text-rose-800">
              Módulo no contratado
            </p>
            <p className="text-[11px] leading-tight text-slate-700">
              Este módulo no está incluido en tu suscripción mensual actual.
            </p>
          </div>

          <button
            onClick={handleUpgradeClick}
            className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ampliar plan / Contratar módulo</span>
          </button>
        </div>
      </div>
    );
  }

  // CASE 2: MODULE IS CONTRACTED IN PLAN
  return (
    <div
      className={`rounded-xl border p-5 transition-all flex flex-col justify-between text-left relative ${
        canAccessContent
          ? 'bg-white border-slate-200 shadow-sm hover:border-slate-300 ring-1 ring-slate-200'
          : 'bg-slate-50 border-slate-300 shadow-xs'
      }`}
    >
      {/* Header Badges */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div
            className={`p-2.5 rounded-lg w-fit ${
              canAccessContent
                ? 'bg-emerald-100 text-emerald-900'
                : 'bg-amber-100 text-amber-900'
            }`}
          >
            {canAccessContent ? <BookOpen className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
          </div>

          {canAccessContent ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Acceso Incluido
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
              <Clock className="w-3 h-3" />
              Liberación por Goteo
            </span>
          )}
        </div>

        {/* Module Title */}
        <div>
          <h3 className="font-bold text-slate-900 text-base leading-snug">
            {module.title || module.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            {module.subtitle || `Módulo ${module.module_number || ''} • ${module.topics_count || 10} Temas en PDF`}
          </p>
          {module.description && (
            <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
              {module.description}
            </p>
          )}
        </div>
      </div>

      {/* Access / Unlock Actions */}
      <div className="pt-6 space-y-3 border-t border-slate-200/80 mt-4">
        {canAccessContent ? (
          <button
            onClick={() => onOpenContent && onOpenContent(module)}
            className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Acceder al Módulo / PDFs</span>
          </button>
        ) : (
          <div className="space-y-2 text-center">
            <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-amber-900 text-xs space-y-0.5">
              <div className="flex items-center justify-center gap-1 font-semibold text-[11px] uppercase tracking-wide text-amber-800">
                <Clock className="w-3.5 h-3.5" />
                <span>Disponible en {daysRemaining} {daysRemaining === 1 ? 'día' : 'días'}</span>
              </div>
            </div>

            <button
              onClick={handleUnlockClick}
              disabled={loadingUnlock}
              className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              {loadingUnlock ? (
                <span>Procesando...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Desbloquear anticipadamente (3,00 €)</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
