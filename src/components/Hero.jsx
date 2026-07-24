import React, { useState } from 'react';
import { Download, ChevronRight, CheckCircle2, Star, GraduationCap, Shield, Award, Check } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function Hero({ onOpenLeadModal, onLeadSuccess }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);

    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.from('leads').insert([
          {
            email: email,
            specialty: 'TSIDMN (Nota de Corte Universidad)',
            created_at: new Date().toISOString()
          }
        ]);
        if (error) throw error;
      } else {
        const existingLeads = JSON.parse(localStorage.getItem('academia_leads') || '[]');
        existingLeads.push({ email, specialty: 'TSIDMN (Nota de Corte Universidad)', timestamp: new Date().toISOString() });
        localStorage.setItem('academia_leads', JSON.stringify(existingLeads));
      }

      if (onLeadSuccess) {
        onLeadSuccess(email);
      } else if (onOpenLeadModal) {
        onOpenLeadModal(email);
      }
    } catch (err) {
      console.error('Hero lead submit error:', err);
      if (onOpenLeadModal) onOpenLeadModal(email);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="nota-corte" className="bg-white py-20 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Grade focus, Email Input */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Top Pill - Universidad desde FP Sanidad */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
              <GraduationCap className="w-4 h-4 text-slate-800" />
              <span>Acceso directo a la Universidad desde FP Sanidad</span>
              <span className="bg-slate-200 text-slate-800 text-[10px] px-2 py-0.5 rounded-full font-semibold">Nota 10/10</span>
            </div>

            {/* Headline Principal */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Consigue el 10 en tu FP Sanidad y asegura tu plaza en la Universidad.
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed">
              Sintetizamos los módulos técnicos más difíciles de la rama sanitaria con resúmenes, exámenes resueltos y soporte a dudas.
            </p>

            {/* Direct Form: Email capture for "Tema Cero" */}
            <div className="pt-2 max-w-xl">
              <form onSubmit={handleSubmitEmail} className="bg-white p-2 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Introduce tu correo electrónico..."
                  className="flex-1 px-4 py-3 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 border border-slate-200"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-slate-900 text-white hover:bg-slate-800 transition-all px-6 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {loading ? (
                    <span>Registrando...</span>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Consigue el Tema 0</span>
                    </>
                  )}
                </button>
              </form>
              <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5 pl-1">
                <Shield className="w-3.5 h-3.5 text-slate-600" />
                <span>Recibe gratis el PDF del Tema 0 + Guía de Notas de Corte Sanitarias 2026</span>
              </p>
            </div>

            {/* Quick Benefits Checklist */}
            <div className="grid sm:grid-cols-2 gap-3 pt-3 text-sm font-medium text-slate-600">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-slate-800 shrink-0" />
                <span>Especial para subir nota en FP Sanidad</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-slate-800 shrink-0" />
                <span>Radiobiología, Anatomía y Bioquímica sin misterios</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-slate-800 shrink-0" />
                <span>Simulacros de examen para asegurar el 10</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-slate-800 shrink-0" />
                <span>Tutoría directa con Profesionales Sanitarios</span>
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-4 border-t border-slate-200/80">
              <div className="flex -space-x-2 overflow-hidden">
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 text-slate-800 font-semibold text-xs flex items-center justify-center border border-slate-200">9.8</div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 text-slate-800 font-semibold text-xs flex items-center justify-center border border-slate-200">9.9</div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 text-slate-800 font-semibold text-xs flex items-center justify-center border border-slate-200">10</div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-800 text-white font-semibold text-xs flex items-center justify-center border border-slate-800">+1.2k</div>
              </div>
              <div className="text-xs text-slate-600">
                <div className="flex items-center gap-1 text-slate-800 font-semibold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-slate-800 text-slate-800" />
                  ))}
                  <span className="text-slate-900 ml-1">4.9/5.0</span>
                </div>
                <span>Estudiantes que accedieron a Grado Universitario</span>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Grade & Cutoff Card */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200/80 relative text-left">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Calculadora Nota de Corte</h3>
                    <p className="text-xs text-slate-500">Vía FP Superior → Universidad</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 border border-slate-200 text-slate-700">
                  Cupo FP Garantizado
                </span>
              </div>

              {/* Target Degrees Cut-off Marks Preview */}
              <div className="space-y-4 py-6">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-900 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-slate-700" />
                      Grado en Medicina
                    </span>
                    <span className="text-slate-900 font-mono font-bold text-sm">12.85 / 14</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-slate-900 h-full w-[94%] rounded-full" />
                  </div>
                  <p className="text-[11px] text-slate-600">Tu FP de Sanidad aporta hasta <strong className="text-slate-900">10 puntos de la nota media</strong>.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                    <span className="text-[11px] text-slate-500 block">Enfermería</span>
                    <span className="text-lg font-bold text-slate-900">11.40 - 12.10</span>
                    <span className="text-[10px] text-slate-600 font-medium block mt-0.5">Acceso directo desde FP</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                    <span className="text-[11px] text-slate-500 block">Fisioterapia</span>
                    <span className="text-lg font-bold text-slate-900">10.90 - 11.80</span>
                    <span className="text-[10px] text-slate-600 block mt-0.5">Asignaturas reconocidas</span>
                  </div>
                </div>

                {/* Highlight box */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    !
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="text-slate-900 font-bold">¿Por qué estudiar un FP Sanitario en lugar de EBAU?</p>
                    <p className="text-slate-600 leading-relaxed">
                      El 92% de nuestros alumnos consiguen una nota media superior a 9.0 en el ciclo formativo, asegurando su plaza en la facultad deseada.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <Check className="w-4 h-4 text-slate-800" />
                  Convocatoria 2026/2027
                </span>
                <button
                  onClick={() => onOpenLeadModal && onOpenLeadModal()}
                  className="text-slate-900 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Solicitar plan personalizado</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
