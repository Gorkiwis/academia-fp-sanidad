import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  Mail,
  Phone,
  Briefcase,
  BookOpen,
  Clock,
  FileText,
  Link as LinkIcon,
  Sparkles,
  ArrowLeft,
  DollarSign,
  CreditCard,
  Award,
  Info,
  Check,
  HelpCircle,
  Layers,
  PieChart,
  Percent,
  Receipt
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FormData {
  nombre_completo: string;
  email: string;
  telefono: string;
  perfil_profesional: 'tecnico_activo' | 'estudiante_2' | 'docente' | '';
  especialidad_principal: 'resonancia_magnetica' | 'tomografia_computarizada' | 'proteccion_radiologica' | 'medicina_nuclear' | 'anatomia_imagen' | '';
  disponibilidad_semanal: '1-3h' | '3-5h' | '+5h' | '';
  aceptacion_modelo: 'revenue_share' | 'mas_informacion' | '';
  linkedin_cv: string;
  experiencia_meritos: string;
  aceptaTerminos: boolean;
}

const initialFormState: FormData = {
  nombre_completo: '',
  email: '',
  telefono: '',
  perfil_profesional: '',
  especialidad_principal: '',
  disponibilidad_semanal: '',
  aceptacion_modelo: '',
  linkedin_cv: '',
  experiencia_meritos: '',
  aceptaTerminos: false
};

export default function Colabora() {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    if (!formData.aceptaTerminos) {
      setStatus('error');
      setErrorMessage('Debes aceptar la cláusula de privacidad para evaluar tu candidatura.');
      return;
    }

    try {
      const { error } = await supabase
        .from('colaboradores_solicitudes')
        .insert([
          {
            nombre_completo: formData.nombre_completo,
            email: formData.email,
            telefono: formData.telefono,
            perfil_profesional: formData.perfil_profesional,
            especialidad_principal: formData.especialidad_principal,
            disponibilidad_semanal: formData.disponibilidad_semanal,
            aceptacion_modelo: formData.aceptacion_modelo,
            linkedin_cv: formData.linkedin_cv.trim() || null,
            experiencia_meritos: formData.experiencia_meritos,
            acepta_privacidad: formData.aceptaTerminos
          }
        ]);

      if (error) {
        throw error;
      }

      setStatus('success');
      setFormData(initialFormState);
    } catch (err: any) {
      console.error('Error al enviar la solicitud:', err);
      setStatus('error');
      setErrorMessage(
        err?.message ||
          'Ha ocurrido un error al procesar tu solicitud. Por favor, verifica tus datos e inténtalo de nuevo.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Header / Nav */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 hover:opacity-90 transition">
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-sm font-black tracking-wider">FP</span>
            <span>Sanidad <span className="text-blue-600">10</span></span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 hover:text-blue-600 transition font-medium"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600" />
            <span>Volver al inicio</span>
          </Link>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 w-full space-y-12">
        
        {/* HERO PRINCIPAL */}
        <section className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 sm:p-12 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Convocatoria Abierta · Red de Colaboradores TSIDMN</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
            Únete al Cuadro Técnico de Redactores y Colaboradores <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TSIDMN
            </span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Buscamos graduados y estudiantes de alto rendimiento de Imagen para el Diagnóstico y Medicina Nuclear para la creación de material docente de élite.
          </p>
        </section>

        {/* SECCIÓN 1: ¿EN QUÉ CONSISTE LA COLABORACIÓN? */}
        <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <div className="p-2.5 bg-blue-100 border border-blue-200 text-blue-600 rounded-xl">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">1. ¿En qué consiste la colaboración?</h2>
              <p className="text-xs sm:text-sm text-slate-600">Actividades didácticas y maquetación técnica asignadas según tu área de especialización.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">Desarrollo de Temarios</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Redacción y revisión de módulos técnicos (Resonancia Magnética, TC, Medicina Nuclear, Protección Radiológica y Anatomía por la Imagen).
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">Bancos de Preguntas Tipo Test</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Creación de baterías de preguntas nivel examen oficial / OPE con respuesta correcta razonada justificando la física y la técnica aplicada.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">Supuestos Prácticos</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Elaboración de casos clínicos reales con imágenes/parámetros de adquisición para análisis técnico y diagnóstico por imagen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 2: MODELO DE COMPENSACIÓN: PARTICIPACIÓN EN INGRESOS (REVENUE SHARE) */}
        <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <div className="p-2.5 bg-blue-100 border border-blue-200 text-blue-600 rounded-xl">
              <PieChart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">2. Modelo de Compensación: Participación en Ingresos (Revenue Share)</h2>
              <p className="text-xs sm:text-sm text-slate-600">Vinculamos la retribución de los redactores al éxito comercial y la venta de los módulos docentes desarrollados.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Royalties por Contenido */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Royalties por Contenido</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Asignación de un porcentaje sobre los ingresos netos generados por las suscripciones o venta directa del módulo/batería de test que hayas redactado.
                </p>
              </div>
            </div>

            {/* 2. Riesgo Compartido y Escrupulosa Transparencia */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Riesgo Compartido y Escrupulosa Transparencia</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sin cuotas fijas de entrada. Si el módulo genera ventas, recibes tu parte proporcional de forma transparente.
                </p>
              </div>
            </div>

            {/* 3. Liquidación Periódica */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Liquidación Periódica</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cierre de caja mensual con informe de ventas y liquidación de importes mediante <strong>transferencia bancaria</strong> tras la validación del periodo de facturación.
                </p>
              </div>
            </div>

            {/* 4. Propiedad Intelectual y Certificación */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Propiedad Intelectual y Certificación</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Reconocimiento expreso de la autoría didáctica con certificado oficial para méritos docentes y currículum.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 3: FORMULARIO DE CANDIDATURA */}
        <section className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sm:p-10">
          {status === 'success' ? (
            <div className="p-6 sm:p-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center">
              <div className="w-16 h-16 bg-emerald-100 border border-emerald-300 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-emerald-900 mb-2">¡Solicitud Enviada con Éxito!</h2>
              <p className="text-emerald-700 max-w-md mx-auto text-sm sm:text-base leading-relaxed mb-6">
                Hemos registrado tu candidatura en el cuadro de colaboradores TSIDMN. Nuestro equipo técnico evaluará tu perfil y te contactará por email o WhatsApp en un plazo de 48-72 horas.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold transition cursor-pointer"
              >
                Enviar otra candidatura
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-slate-200 pb-4 mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>3. Formulario de Candidatura TSIDMN</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Completa tus datos personales, especialidad preferente y aceptación del modelo económico.
                </p>
              </div>

              {status === 'error' && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-red-900">Error al procesar la candidatura</span>
                    {errorMessage}
                  </div>
                </div>
              )}

              {/* 1. Nombre completo */}
              <div>
                <label htmlFor="nombre_completo" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Nombre completo <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <input
                    type="text"
                    id="nombre_completo"
                    name="nombre_completo"
                    required
                    value={formData.nombre_completo}
                    onChange={handleChange}
                    placeholder="Ej. María García López"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm transition"
                  />
                </div>
              </div>

              {/* 2. Correo electrónico & 3. Teléfono / WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Correo electrónico <span className="text-blue-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="maria@ejemplo.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm transition"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Teléfono / WhatsApp <span className="text-blue-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4 text-blue-600" />
                    </div>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      required
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="+34 600 000 000"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm transition"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Perfil profesional */}
              <div>
                <label htmlFor="perfil_profesional" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Perfil profesional <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                  </div>
                  <select
                    id="perfil_profesional"
                    name="perfil_profesional"
                    required
                    value={formData.perfil_profesional}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm transition appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Selecciona tu perfil profesional...</option>
                    <option value="tecnico_activo">TSIDMN en activo</option>
                    <option value="estudiante_2">Estudiante de 2.º curso [Nota &gt; 8.5]</option>
                    <option value="docente">Docente FP Sanitaria</option>
                  </select>
                </div>
              </div>

              {/* 5. Especialidad técnica preferente */}
              <div>
                <label htmlFor="especialidad_principal" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Especialidad técnica preferente <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  <select
                    id="especialidad_principal"
                    name="especialidad_principal"
                    required
                    value={formData.especialidad_principal}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm transition appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Selecciona tu especialidad...</option>
                    <option value="resonancia_magnetica">Resonancia Magnética</option>
                    <option value="tomografia_computarizada">Tomografía Computarizada</option>
                    <option value="proteccion_radiologica">Protección Radiológica</option>
                    <option value="medicina_nuclear">Medicina Nuclear</option>
                    <option value="anatomia_imagen">Anatomía por la Imagen</option>
                  </select>
                </div>
              </div>

              {/* 6. Disponibilidad semanal */}
              <div>
                <label htmlFor="disponibilidad_semanal" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Disponibilidad semanal <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <select
                    id="disponibilidad_semanal"
                    name="disponibilidad_semanal"
                    required
                    value={formData.disponibilidad_semanal}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm transition appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Selecciona tu disponibilidad semanal...</option>
                    <option value="1-3h">1-3 h/semana</option>
                    <option value="3-5h">3-5 h/semana</option>
                    <option value="+5h">&gt; 5 h/semana</option>
                  </select>
                </div>
              </div>

              {/* CAMPO ADICIONAL: Aceptación del modelo de remuneración */}
              <div>
                <label htmlFor="aceptacion_modelo" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Aceptación del modelo de remuneración <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                  </div>
                  <select
                    id="aceptacion_modelo"
                    name="aceptacion_modelo"
                    required
                    value={formData.aceptacion_modelo}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm transition appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Selecciona tu preferencia de retribución...</option>
                    <option value="revenue_share">
                      Entiendo y acepto el modelo de retribución variable por participación en ingresos (Revenue Share).
                    </option>
                    <option value="mas_informacion">
                      Deseo recibir más detalles sobre los porcentajes de reparto antes de confirmar.
                    </option>
                  </select>
                </div>
              </div>

              {/* 7. Enlace a LinkedIn / CV / Expediente */}
              <div>
                <label htmlFor="linkedin_cv" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Enlace a LinkedIn / CV / Expediente <span className="text-slate-500 text-xs font-normal">(Opcional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <LinkIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <input
                    type="url"
                    id="linkedin_cv"
                    name="linkedin_cv"
                    value={formData.linkedin_cv}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/tu-perfil o enlace a Google Drive / PDF"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm transition"
                  />
                </div>
              </div>

              {/* 8. Resumen de experiencia y méritos */}
              <div>
                <label htmlFor="experiencia_meritos" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Resumen de experiencia y méritos <span className="text-blue-600">*</span>
                </label>
                <textarea
                  id="experiencia_meritos"
                  name="experiencia_meritos"
                  required
                  rows={4}
                  value={formData.experiencia_meritos}
                  onChange={handleChange}
                  placeholder="Detalla brevemente tu experiencia profesional en TSIDMN, expediente académico relevante o interés en redactar y maquetar temarios y test..."
                  className="w-full p-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm transition"
                />
              </div>

              {/* Cláusula Legal de Privacidad y RGPD */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-3">
                <div className="flex items-start gap-2 text-slate-800">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span className="font-bold text-slate-900">Información sobre Protección de Datos (RGPD)</span>
                </div>
                <p className="leading-relaxed">
                  De conformidad con el RGPD (UE 2016/679) y la LOPDGDD 3/2018, los datos facilitados serán tratados por <strong className="text-slate-800">FP Sanidad 10</strong> para evaluar su candidatura docente. Base legal: consentimiento. No se cederán a terceros salvo obligación legal. Ejercicio de derechos en: <a href="mailto:soporte@fpsanidad10.es" className="text-blue-600 underline font-medium">soporte@fpsanidad10.es</a>.
                </p>

                <div className="pt-2 border-t border-slate-200">
                  <label htmlFor="aceptaTerminos" className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      id="aceptaTerminos"
                      name="aceptaTerminos"
                      required
                      checked={formData.aceptaTerminos}
                      onChange={handleChange}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 group-hover:text-slate-900 transition leading-snug">
                      He leído y acepto la cláusula de privacidad para la evaluación de mi candidatura. <span className="text-blue-600">*</span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Botón de Envío */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3.5 px-6 rounded-lg transition-colors text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Enviando candidatura...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Enviar Solicitud de Colaboración</span>
                  </>
                )}
              </button>
            </form>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 text-slate-400 py-8 text-center text-xs">
        <div className="max-w-4xl mx-auto px-4">
          <p>© {new Date().getFullYear()} FP Sanidad 10. Todos los derechos reservados.</p>
          <p className="mt-1 text-slate-500">
            Página de captación para la especialidad de Imagen para el Diagnóstico y Medicina Nuclear (TSIDMN).
          </p>
        </div>
      </footer>
    </div>
  );
}
