import React, { useState, useEffect } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function Pricing({ onOpenLeadModal, onOpenTicketModal, userPlan = 'free' }) {
  const isProMax = userPlan === 'promax';
  const [config, setConfig] = useState({
    plan_1_price: '19',
    plan_1_stripe_url: 'https://buy.stripe.com/test_plan1',
    plan_2_price: '39',
    plan_2_stripe_url: 'https://buy.stripe.com/test_plan2'
  });

  useEffect(() => {
    async function loadConfig() {
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('site_config')
            .select('*')
            .eq('id', 'default_config')
            .single();

          if (data && !error) {
            setConfig((prev) => ({
              ...prev,
              plan_1_price: data.plan_1_price || prev.plan_1_price,
              plan_1_stripe_url: data.plan_1_stripe_url || prev.plan_1_stripe_url,
              plan_2_price: data.plan_2_price || prev.plan_2_price,
              plan_2_stripe_url: data.plan_2_stripe_url || prev.plan_2_stripe_url
            }));
          }
        } catch (err) {
          console.warn('Error loading site_config from Supabase:', err);
        }
      }
    }
    loadConfig();
  }, []);

  const handlePlanClick = (stripeUrl, planName) => {
    if (stripeUrl && stripeUrl.startsWith('http')) {
      window.open(stripeUrl, '_blank', 'noopener,noreferrer');
    } else if (onOpenLeadModal) {
      onOpenLeadModal(planName);
    }
  };

  const plans = [
    {
      id: 'plan_1',
      name: 'Plan Apuntes',
      subtitle: 'Acceso directo a todo el material de estudio sintetizado.',
      price: config.plan_1_price,
      stripeUrl: config.plan_1_stripe_url,
      buttonText: 'Acceder a los Apuntes',
      buttonStyle: 'border border-slate-300 text-slate-700 bg-white hover:bg-slate-50',
      features: [
        'Resúmenes y esquemas en PDF descargables de los módulos.',
        'Banco de exámenes y ejercicios resueltos paso a paso.',
        'Actualizaciones de temario incluidas.',
        'Sin permanencia (cancela cuando quieras).'
      ]
    },
    {
      id: 'plan_2',
      name: 'Plan Apuntes + Dudas',
      subtitle: 'Todo el material de estudio junto con soporte técnico a dudas.',
      price: config.plan_2_price,
      stripeUrl: config.plan_2_stripe_url,
      buttonText: 'Acceder con Soporte',
      buttonStyle: 'bg-slate-900 text-white hover:bg-slate-800',
      features: [
        'Todo lo incluido en el Plan Apuntes.',
        'Resolución de dudas puntuales por sistema de tickets.',
        'Explicaciones de ejercicios o conceptos del curso (respuesta 24-48h).',
        'Sin permanencia.'
      ]
    }
  ];

  return (
    <section id="precios" className="bg-slate-50 py-20 px-6 relative border-t border-slate-200">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          {isProMax && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
              <span>⚡ MODO DEV: Plan PRO MAX Activo</span>
            </div>
          )}
          <h2 className="text-3xl font-extrabold text-slate-900">
            Planes Claros y Sin Sorpresas
          </h2>
          <p className="text-slate-600 text-base">
            Elige la opción que mejor se adapte a lo que necesitas para tu curso.
          </p>
        </div>

        {/* Pricing Cards Grid - 2 Plans */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {plans.map((plan) => {
            const isThisProMax = plan.id === 'plan_2' && isProMax;
            return (
              <div
                key={plan.id}
                className={`bg-white rounded-xl p-8 border flex flex-col justify-between text-left relative transition-all ${
                  isThisProMax
                    ? 'border-amber-400 ring-2 ring-amber-400 shadow-lg'
                    : 'border-slate-200'
                }`}
              >
                {isThisProMax && (
                  <div className="absolute -top-3.5 right-6 bg-slate-900 text-amber-300 border border-amber-400 px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wide shadow">
                    ★ PLAN ACTIVADO (PRO MAX)
                  </div>
                )}
                <div className="space-y-6">
                  
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                    <p className="text-slate-600 text-xs mt-1 min-h-[32px]">{plan.subtitle}</p>
                  </div>

                  {/* Pricing Number */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900">{plan.price}€</span>
                    <span className="text-xs text-slate-500 font-medium">/ mes</span>
                  </div>

                  {/* Feature list */}
                  <div className="space-y-3 pt-4 border-t border-slate-200">
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <Check className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Card Button */}
                <div className="pt-8">
                  <button
                    onClick={() => {
                      if (plan.id === 'plan_2' && onOpenTicketModal) {
                        onOpenTicketModal();
                      } else {
                        handlePlanClick(plan.stripeUrl, plan.name);
                      }
                    }}
                    className={`w-full py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      isThisProMax
                        ? 'bg-slate-900 text-amber-300 border border-amber-400 font-bold hover:bg-slate-800'
                        : plan.buttonStyle
                    }`}
                  >
                    <span>{isThisProMax ? 'Acceso PRO MAX Activo (Soporte Incluido)' : plan.buttonText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
