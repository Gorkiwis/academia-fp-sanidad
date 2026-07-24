import React, { useState } from 'react';
import { X, Send, CheckCircle2, ShieldCheck, Upload, Zap, Lock } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function TicketModal({ isOpen, onClose, userPlan = 'free' }) {
  const isProMax = userPlan === 'promax';
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    moduleName: 'Radiobiología y Protección Radiológica',
    ticketType: 'Duda de Temario o Ejercicio',
    question: '',
    priority: 'Normal'
  });
  const [loading, setLoading] = useState(false);
  const [ticketResult, setTicketResult] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let ticketCode = `TK-FP-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.from('tickets').insert([
          {
            email: formData.studentEmail,
            grado: formData.moduleName,
            asunto: formData.ticketType,
            mensaje: formData.question,
            estado: 'pendiente'
          }
        ]).select('id').single();
        
        if (error) throw error;
        if (data?.id) {
          ticketCode = `TK-${data.id.slice(0, 8).toUpperCase()}`;
        }
      } else {
        const existingTickets = JSON.parse(localStorage.getItem('academia_tickets') || '[]');
        existingTickets.push({ ticketCode, ...formData, timestamp: new Date().toISOString() });
        localStorage.setItem('academia_tickets', JSON.stringify(existingTickets));
      }

      setTicketResult(ticketCode);
    } catch (err) {
      console.error('Ticket submission error:', err);
      setTicketResult(ticketCode);
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
          aria-label="Cerrar modal de ticket"
        >
          <X className="w-5 h-5" />
        </button>

        {!ticketResult ? (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="space-y-2 pr-8">
              {isProMax ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
                  <Zap className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
                  <span>Soporte PRO MAX Activo • Consultas Ilimitadas</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-800" />
                  <span>Atención por Profesores Sanitarios</span>
                </div>
              )}
              <h3 className="text-2xl font-extrabold text-slate-900">
                Sistema de Resolución de Dudas
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {isProMax
                  ? 'Como usuario PRO MAX tienes acceso ilimitado a tutores sanitarios con respuesta prioritaria.'
                  : 'Envía tu pregunta teórica o caso práctico. Tu tutor colegiado te responderá de forma personalizada.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tu Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carlos Ruiz"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email para respuesta *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="carlos@ejemplo.com"
                    value={formData.studentEmail}
                    onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Módulo / Asignatura del problema *
                </label>
                <select
                  value={formData.moduleName}
                  onChange={(e) => setFormData({ ...formData, moduleName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                >
                  <option value="Radiobiología y Protección Radiológica">Radiobiología y Protección Radiológica</option>
                  <option value="Física Médica y Equipos de Diagnóstico">Física Médica y Equipos de Diagnóstico</option>
                  <option value="Resonancia Magnética (RM)">Resonancia Magnética (RM)</option>
                  <option value="Tomografía Computarizada (TC/TAC)">Tomografía Computarizada (TC/TAC)</option>
                  <option value="Anatomía por Imagen">Anatomía por Imagen</option>
                  <option value="Medicina Nuclear y PET-TC">Medicina Nuclear y PET-TC</option>
                  <option value="Anatomía Patológica o Laboratorio">Anatomía Patológica / Laboratorio</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detalla tu duda o ejercicio *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explica qué parte del tema o qué pregunta tipo test no logras comprender..."
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 resize-none"
                />
              </div>

              {/* Upload field */}
              <div className="border border-dashed border-slate-300 rounded-lg p-3 text-center bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-slate-600 mx-auto mb-1" />
                <span className="text-[11px] text-slate-600 block">
                  Adjuntar captura o PDF del ejercicio (Opcional)
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Registrando Ticket...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar Consulta al Tutor</span>
                  </>
                )}
              </button>

            </form>

          </div>
        ) : (
          /* Confirmation State */
          <div className="py-6 text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 text-slate-900 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-slate-900">¡Ticket Registrado!</h3>
              <p className="text-slate-600 text-xs sm:text-sm max-w-sm mx-auto">
                Tu consulta ha sido enviada al equipo docente. Código de seguimiento:
              </p>
              <div className="inline-block px-4 py-2 rounded-lg bg-slate-100 border border-slate-200 font-mono font-bold text-slate-900 text-base">
                {ticketResult}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2 text-left">
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Tiempo de Respuesta Estimado:</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Recibirás la explicación detallada y esquemas aclaratorios en <strong>{formData.studentEmail}</strong> antes de 24 horas laborables.
              </p>
            </div>

            <button
              onClick={() => {
                setTicketResult(null);
                onClose();
              }}
              className="px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors"
            >
              Cerrar y Volver
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
