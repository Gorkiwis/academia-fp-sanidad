import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, ShieldCheck, Zap, Sparkles, BookOpen, Layers, Star } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function Pricing({ onOpenLeadModal, userPlan = 'free' }) {
  const [config, setConfig] = useState({
    plan_basic_price: '19',
    plan_basic_stripe_url: 'https://buy.stripe.com/test_plan_basic',
    plan_pro_price: '39',
    plan_pro_stripe_url: 'https://buy.stripe.com/test_plan_pro',
    plan_total_price: '69',
    plan_total_stripe_url: 'https://buy.stripe.com/test_plan_total'
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
              plan_basic_price: data.plan_basic_price || data.plan_1_price || prev.plan_basic_price,
              plan_basic_stripe_url: data.plan_basic_stripe_url || data.plan_1_stripe_url || prev.plan_basic_stripe_url,
              plan_pro_price: data.plan_pro_price || data.plan_2_price || prev.plan_pro_price,
              plan_pro_stripe_url: data.plan_pro_stripe_url || data.plan_2_stripe_url || prev.plan_pro_stripe_url,
              plan_total_price: data.plan_total_price || prev.plan_total_price,
              plan_total_stripe_url: data.plan_total_stripe_url || prev.plan_total_stripe_url
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
      id: 'plan_basic',
      name: 'Plan Básico',
      badge: '1 Módulo FP',
      subtitle: 'Ideal para reforzar 1 módulo o asignatura suelta de tu ciclo sanitario.',
      price: config.plan_basic_price,
      stripeUrl: config.plan_basic_stripe_url,
      buttonText: 'Suscribirse al Plan Básico',
      buttonStyle: 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50',
      highlight: false,
      features: [
        '1 Módulo de FP a elegir libremente.',
        'Sin matrícula inicial (0 € de alta).',
        'PDFs y resúmenes sintetizados en descarga.',
        'Banco de preguntas tipo test y autoevaluación.',
        'Actualización continua del temario.',
        'Cancela o cambia de módulo cuando quieras.'
      ]
    },
    {
      id: 'plan_pro',
      name: 'Plan Profesional',
      badge: 'Recomendado (2-3 Módulos)',
      subtitle: 'La opción preferida para aprobar el bloque principal de asignaturas.',
      price: config.plan_pro_price,
      stripeUrl: config.plan_pro_stripe_url,
      buttonText: 'Suscribirse al Plan Profesional',
      buttonStyle: 'bg-blue-600 text-white hover:bg-blue-700 shadow-md',
      highlight: true,
      popularTag: 'MÁS POPULAR',
      features: [
        '2 o 3 Módulos de FP a elegir.',
        'Sin matrícula inicial (0 € de alta).',
        'Acceso completo a PDFs y videoteca en streaming.',
        'Resolución de dudas por sistema de tickets.',
        'Simulacros de examen oficial resueltos.',
        'Cambio flexible entre asignaturas.'
      ]
    },
    {
      id: 'plan_total',
      name: 'Plan Total / Premium',
      badge: 'Acceso Ilimitado',
      subtitle: 'Para preparar el ciclo completo de FP o Pruebas Libres sin restricciones.',
      price: config.plan_total_price,
      stripeUrl: config.plan_total_stripe_url,
      buttonText: 'Suscribirse al Plan Total',
      buttonStyle: 'bg-slate-900 text-white hover:bg-slate-800 shadow-md',
      highlight: false,
      features: [
        'Acceso ilimitado a TODOS los módulos del ciclo.',
        'Sin matrícula inicial (0 € de alta).',
        'Prioridad en resolución de dudas (respuesta <24h).',
        'Todos los PDFs, casos prácticos y videoteca completa.',
        'Preparación simultánea de Pruebas Libres y Presencial.',
        'Sin permanencia (cancela en 1 clic).'
      ]
    }
  ];

  return (
    <section id="precios" className="bg-slate-900 text-white py-24 px-6 relative border-t border-slate-800 overflow-hidden">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-extrabold tracking-wide uppercase">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Modelo de Suscripción Mensual · Sin Matrícula Inicial</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Tarifas Transparentes por Número de Módulos
          </h2>

          <p className="text-slate-400 text-base leading-relaxed">
            Suscríbete solo por las asignaturas que necesites. Sin permanencia ni cuotas ocultas de inscripción. Cancela o cambia de plan en cualquier momento desde tu panel.
          </p>
        </div>

        {/* Pricing Grid - 3 Plans */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const isHighlight = plan.highlight;
            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-8 flex flex-col justify-between text-left relative transition-all duration-300 ${
                  isHighlight
                    ? 'bg-slate-800/90 border-2 border-blue-500 shadow-2xl ring-4 ring-blue-500/20 scale-105 z-20'
                    : 'bg-slate-800/40 border border-slate-700/80 hover:border-slate-600 shadow-xl'
                }`}
              >
                {plan.popularTag && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-[11px] font-extrabold tracking-wider shadow-lg flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" />
                    <span>{plan.popularTag}</span>
                  </div>
                )}

                <div className="space-y-6">
                  
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-xl font-extrabold text-white">{plan.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                        isHighlight ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {plan.badge}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs min-h-[36px] leading-relaxed">
                      {plan.subtitle}
                    </p>
                  </div>

                  {/* Price Tag */}
                  <div className="pt-2 border-t border-slate-700/60">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">{plan.price}€</span>
                      <span className="text-xs text-slate-400 font-semibold">/ mes</span>
                    </div>
                    <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Sin matrícula inicial (0 € cuota de alta)
                    </p>
                  </div>

                  {/* Feature list */}
                  <div className="space-y-3 pt-4 border-t border-slate-700/60">
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${
                          isHighlight ? 'text-blue-400' : 'text-slate-400'
                        }`} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Checkout Action Button */}
                <div className="pt-8">
                  <button
                    onClick={() => handlePlanClick(plan.stripeUrl, plan.name)}
                    className={`w-full py-3.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${plan.buttonStyle}`}
                  >
                    <span>Suscribirse ahora</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[10px] text-slate-500 text-center mt-2 font-mono">
                    Stripe Checkout seguro · Cancela cuando quieras
                  </p>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="bg-slate-800/60 rounded-2xl border border-slate-700/80 p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-white">¿Tienes dudas sobre qué plan elegir para tu ciclo de FP?</h4>
            <p className="text-xs text-slate-400">
              Prueba la plataforma sin compromiso o consulta con nuestros docentes de FP Sanidad.
            </p>
          </div>
          <a
            href="https://billing.stripe.com/p/login/test"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-all shrink-0 border border-slate-600"
          >
            Portal de Suscripción Stripe
          </a>
        </div>

      </div>
    </section>
  );
}
