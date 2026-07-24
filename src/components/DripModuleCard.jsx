import React, { useState } from 'react';
import { Lock, Unlock, CheckCircle2, Download, BookOpen, Clock, Zap, ExternalLink } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function DripModuleCard({
  module,
  userSubscriptionDate,
  unlockedModules = [],
  userPlan = 'free',
  onUnlockModule,
  onOpenContent
}) {
  const [loadingUnlock, setLoadingUnlock] = useState(false);

  // 1. Calculate days active since user subscription date
  const subDate = userSubscriptionDate ? new Date(userSubscriptionDate) : new Date();
  const now = new Date();
  const diffTime = Math.max(0, now.getTime() - subDate.getTime());
  const daysActive = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const unlockDelay = module?.unlock_delay_days ?? 0;

  // 2. Logic flags
  const isUnlockedByTime = daysActive >= unlockDelay;
  const isUnlockedByPay = Array.isArray(unlockedModules) && unlockedModules.includes(module.id);
  const isUnlockedByPlan = userPlan === 'promax';
  const canAccess = isUnlockedByTime || isUnlockedByPay || isUnlockedByPlan;

  const daysRemaining = Math.max(0, unlockDelay - daysActive);

  // 3. Handle 3,00 € Early Unlock Click
  const handleUnlockClick = async () => {
    setLoadingUnlock(true);

    if (import.meta.env.DEV) {
      // DEV mode simulation: update local state & LocalStorage immediately
      setTimeout(() => {
        if (onUnlockModule) {
          onUnlockModule(module.id);
        }
        setLoadingUnlock(false);
      }, 400);
    } else {
      // Production mode: insert record in Supabase user_module_unlocks or redirect to Stripe Checkout
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
        // Redirect to Stripe checkout url for 3,00 € unlock
        const checkoutUrl = module.stripe_unlock_url || 'https://buy.stripe.com/test_unlock3euro';
        window.location.href = checkoutUrl;
        setLoadingUnlock(false);
      }
    }
  };

  return (
    <div
      className={`rounded-xl border p-5 transition-all flex flex-col justify-between text-left relative ${
        canAccess
          ? 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
          : 'bg-slate-50/90 border-slate-300/80 shadow-xs'
      }`}
    >
      {/* Top Header Badge */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div
            className={`p-2.5 rounded-lg w-fit ${
              canAccess
                ? 'bg-slate-100 text-slate-900'
                : 'bg-slate-200/80 text-slate-500'
            }`}
          >
            {canAccess ? <BookOpen className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          </div>

          {canAccess ? (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
              isUnlockedByPlan
                ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                : isUnlockedByPay
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              <CheckCircle2 className="w-3 h-3" />
              {isUnlockedByPlan ? 'PRO MAX Unlocked' : isUnlockedByPay ? 'Desbloqueado (3,00 €)' : 'Disponible'}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
              <Clock className="w-3 h-3" />
              Bloqueado (Goteo)
            </span>
          )}
        </div>

        {/* Module Title & Details */}
        <div>
          <h3 className="font-bold text-slate-900 text-base leading-snug">
            {module.title || module.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {module.subtitle || `Módulo ${module.module_number || ''} • ${module.topics_count || 10} Temas en PDF`}
          </p>
          {module.description && (
            <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
              {module.description}
            </p>
          )}
        </div>
      </div>

      {/* Main Action Area */}
      <div className="pt-6 space-y-3 border-t border-slate-200/80 mt-4">
        {canAccess ? (
          /* Unlocked State: Read/Download Button */
          <button
            onClick={() => onOpenContent && onOpenContent(module)}
            className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Acceder al Módulo / PDF</span>
          </button>
        ) : (
          /* Locked State: Show Days Remaining & 3,00 € Unlock CTA */
          <div className="space-y-2.5 text-center">
            <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-amber-900 text-xs font-medium space-y-0.5">
              <div className="flex items-center justify-center gap-1 font-semibold text-[11px] uppercase tracking-wide text-amber-800">
                <Clock className="w-3.5 h-3.5" />
                <span>Liberación Programada</span>
              </div>
              <p className="text-xs">
                Disponible de forma automática en <strong>{daysRemaining} {daysRemaining === 1 ? 'día' : 'días'}</strong>.
              </p>
            </div>

            <button
              onClick={handleUnlockClick}
              disabled={loadingUnlock}
              className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              {loadingUnlock ? (
                <span>Procesando Desbloqueo...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Desbloquear hoy mismo por 3,00 €</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
