import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    apellidos: '',
    grado: 'TSIDMN (Radiodiagnóstico)',
    municipio: '',
    centro_estudios: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (isSupabaseConfigured()) {
        // 1. Sign up user with Supabase Auth (passing profile metadata for DB trigger)
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.nombre,
              last_name: formData.apellidos,
              degree: formData.grado,
              city: formData.municipio,
              study_center: formData.centro_estudios
            }
          }
        });

        if (authError) throw authError;
      } else {
        // Demo storage fallback
        const existingUsers = JSON.parse(localStorage.getItem('academia_profiles') || '[]');
        const mockId = `user-${Date.now()}`;
        existingUsers.push({
          id: mockId,
          email: formData.email,
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          grado: formData.grado,
          municipio: formData.municipio,
          centro_estudios: formData.centro_estudios,
          role: 'student',
          created_at: new Date().toISOString()
        });
        localStorage.setItem('academia_profiles', JSON.stringify(existingUsers));
      }

      setSuccessMessage('¡Registro realizado con éxito! Redirigiendo...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error('Registration error:', err);
      setErrorMessage(err.message || 'Error en el proceso de registro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 sm:p-10 flex flex-col items-center justify-center">
      
      {/* Back to Home */}
      <div className="w-full max-w-xl mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la Web Principal</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 max-w-xl w-full shadow-sm text-left space-y-6">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
            <UserPlus className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Registro de Alumno FP Sanidad</h2>
          <p className="text-xs text-slate-600">
            Crea tu cuenta oficial para acceder a los materiales de estudio y campus virtual.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Laura"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Apellidos *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Gómez Ruiz"
                value={formData.apellidos}
                onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Correo Electrónico *
              </label>
              <input
                type="email"
                required
                placeholder="laura@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Grado Superior Sanitario *
            </label>
            <select
              value={formData.grado}
              onChange={(e) => setFormData({ ...formData, grado: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-400"
            >
              <option value="TSIDMN (Radiodiagnóstico)">TSIDMN (Radiodiagnóstico y Medicina Nuclear)</option>
              <option value="Radioterapia y Dosimetría">Radioterapia y Dosimetría</option>
              <option value="Laboratorio Clínico y Biomédico">Laboratorio Clínico y Biomédico</option>
              <option value="Anatomía Patológica y Citodiagnóstico">Anatomía Patológica y Citodiagnóstico</option>
              <option value="Documentación y Administración Sanitarias">Documentación y Administración Sanitarias</option>
            </select>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Municipio / Ciudad *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Madrid / Sevilla"
                value={formData.municipio}
                onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Centro de Estudios / Instituto *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. IES San Juan de Dios"
                value={formData.centro_estudios}
                onChange={(e) => setFormData({ ...formData, centro_estudios: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 pt-3"
          >
            <span>{loading ? 'Procesando registro...' : 'Crear Cuenta y Registrarme'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-semibold text-slate-900 hover:underline">
            Iniciar Sesión
          </Link>
        </div>

      </div>
    </div>
  );
}
