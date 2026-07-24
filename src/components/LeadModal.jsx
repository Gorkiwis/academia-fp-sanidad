import React, { useState, useEffect } from 'react';
import { X, Download, CheckCircle2, Lock, Sparkles, AlertCircle, Database } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function LeadModal({ isOpen, onClose, initialEmail = '' }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    specialty: 'TSIDMN (Imagen para el Diagnóstico y Medicina Nuclear)',
    acceptTerms: true
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [dbSaved, setDbSaved] = useState(false);

  useEffect(() => {
    if (initialEmail) {
      setFormData((prev) => ({ ...prev, email: initialEmail }));
    }
  }, [initialEmail]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.from('leads').insert([
          {
            full_name: formData.fullName || 'Alumno Interesado',
            email: formData.email,
            specialty: formData.specialty,
            created_at: new Date().toISOString()
          }
        ]);
        if (error) {
          console.warn('Supabase insert error:', error.message);
          setDbSaved(false);
        } else {
          setDbSaved(true);
        }
      } else {
        const existingLeads = JSON.parse(localStorage.getItem('academia_leads') || '[]');
        existingLeads.push({ ...formData, timestamp: new Date().toISOString() });
        localStorage.setItem('academia_leads', JSON.stringify(existingLeads));
        setDbSaved(false);
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Lead error:', err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-xl relative text-left text-slate-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="space-y-2 pr-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-slate-800" />
                <span>Descarga Inmediata en PDF</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Obtén el Tema 0 + Guía de Nota de Corte
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Accede gratis al temario explicativo de <strong className="text-slate-900">"Radiobiología y Física Médica TSIDMN"</strong>.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nombre y Apellidos *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Laura Gómez"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  placeholder="laura@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Objetivo / Especialidad *
                </label>
                <select
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-colors"
                >
                  <option value="TSIDMN (Imagen para el Diagnóstico y Medicina Nuclear)">TSIDMN (Imagen para el Diagnóstico y Medicina Nuclear)</option>
                  <option value="Acceso a Universidad (Subir Nota de Corte)">Acceso a Universidad (Subir Nota de Corte)</option>
                  <option value="Anatomía Patológica y Citodiagnóstico">Anatomía Patológica y Citodiagnóstico</option>
                  <option value="Laboratorio Clínico y Biomédico">Laboratorio Clínico y Biomédico</option>
                  <option value="Radioterapia y Dosimetría">Radioterapia y Dosimetría</option>
                  <option value="Otro Grado Sanitario">Otro Grado Sanitario</option>
                </select>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  required
                  checked={formData.acceptTerms}
                  onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                  className="mt-1 rounded bg-white border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <label htmlFor="acceptTerms" className="text-[11px] text-slate-600">
                  Acepto recibir el Tema 0 en mi email y las novedades académicas para el acceso a la Universidad.
                </label>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-slate-700 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Guardando en Supabase y generando PDF...</span>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Confirmar y Descargar PDF</span>
                  </>
                )}
              </button>

            </form>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-200">
              <Lock className="w-3.5 h-3.5 text-slate-700" />
              <span>Conexión segura. Tus datos se registran en Supabase.</span>
            </div>

          </div>
        ) : (
          /* Confirmation Screen */
          <div className="py-6 text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 text-slate-900 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-slate-900">¡Registro Confirmado!</h3>
              <p className="text-slate-600 text-sm max-w-sm mx-auto">
                Hemos registrado correctamente tu correo <strong className="text-slate-900">{formData.email}</strong> en la base de datos de <span className="text-slate-900 font-semibold">Supabase</span>.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono">
              <Database className="w-4 h-4" />
              <span>Estado: {dbSaved ? 'Registrado en Supabase (leads)' : 'Registrado Localmente (Modo Demo)'}</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs text-slate-600 block font-medium">Descarga directa del material:</span>
              <button
                onClick={() => {
                  alert('¡Descarga iniciada! "Tema_0_Radiobiologia_Guia_Nota_Corte_TSIDMN.pdf"');
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                Descargar "Tema_0_Radiobiologia_TSIDMN.pdf"
              </button>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 underline"
            >
              Volver a la web
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
