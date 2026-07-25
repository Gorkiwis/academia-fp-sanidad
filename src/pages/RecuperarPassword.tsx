import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, AlertCircle, CheckCircle2, Loader2, KeyRound } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function RecuperarPassword() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/actualizar-password`,
      });

      if (error) {
        throw error;
      }

      setSuccessMessage('Hemos enviado un correo electrónico con instrucciones para restablecer tu contraseña.');
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Ocurrió un error al procesar tu solicitud. Inténtalo de nuevo.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 sm:p-6 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Volver a login */}
      <div className="max-w-md mx-auto w-full pt-4">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600" />
          <span>Volver a iniciar sesión</span>
        </Link>
      </div>

      {/* Tarjeta Central */}
      <div className="bg-white border border-slate-200 shadow-md rounded-2xl p-8 max-w-md w-full mx-auto my-auto space-y-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto sm:mx-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Recuperar Contraseña</h1>
          <p className="text-sm text-slate-600">
            Introduce tu correo electrónico para recibir un enlace de restablecimiento.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-800 mb-1.5">
              Correo electrónico <span className="text-blue-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu.email@ejemplo.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg w-full transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enviando...</span>
              </>
            ) : (
              <span>Enviar enlace de recuperación</span>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-600">
          ¿Recordaste tu contraseña?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            Volver a Iniciar Sesión
          </Link>
        </div>
      </div>

      <footer className="text-center text-xs text-slate-500 py-4">
        © {new Date().getFullYear()} FP Sanidad 10. Todos los derechos reservados.
      </footer>
    </div>
  );
}
