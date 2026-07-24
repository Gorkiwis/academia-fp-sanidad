import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      if (isSupabaseConfigured()) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (authError) throw authError;

        const userId = authData.user?.id;

        if (userId) {
          // Check role in profiles
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();

          if (profile && profile.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/campus/tsidmn');
          }
        } else {
          navigate('/campus/tsidmn');
        }
      } else {
        // Fallback demo mode login logic
        if (email.includes('admin')) {
          navigate('/admin');
        } else {
          navigate('/campus/tsidmn');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage(err.message || 'Credenciales incorrectas o error de inicio de sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 sm:p-10 flex flex-col items-center justify-center">
      
      {/* Back to Home */}
      <div className="w-full max-w-md mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la Web Principal</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 max-w-md w-full shadow-sm text-left space-y-6">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
            <LogIn className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Acceso a Alumnos</h2>
          <p className="text-xs text-slate-600">
            Introduce tus credenciales para entrar al Campus Virtual de FP Sanidad.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Correo Electrónico *
            </label>
            <input
              type="email"
              required
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contraseña *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Iniciando sesión...' : 'Entrar al Campus'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-600">
          ¿Aún no tienes cuenta?{' '}
          <Link to="/register" className="font-semibold text-slate-900 hover:underline">
            Registrarme gratis
          </Link>
        </div>

      </div>
    </div>
  );
}
