import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Colabora from './pages/Colabora';
import Login from './pages/Login';
import Register from './pages/Register';
import Campus from './pages/Campus';
import Admin from './pages/Admin';
import RecuperarPassword from './pages/RecuperarPassword';
import ActualizarPassword from './pages/ActualizarPassword';
import { supabase } from './lib/supabase';

const GRADOS = [
  'Anatomía Patológica y Citodiagnóstico',
  'Documentación y Administración Sanitarias',
  'Higiene Bucodental',
  'Laboratorio Clínico y Biomédico',
  'Imagen para el Diagnóstico y Medicina Nuclear',
  'Prótesis Dentales',
  'Radioterapia y Dosimetría',
  'Cuidados Auxiliares de Enfermería (TCAE)',
  'Emergencias Sanitarias',
  'Farmacia y Parafarmacia',
  'Otro grado / Aún no lo sé'
];

function Home() {
  const [email, setEmail] = useState('');
  const [grado, setGrado] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Por favor, introduce un correo electrónico válido.');
      return;
    }

    if (!grado) {
      setStatus('error');
      setErrorMessage('Por favor, selecciona el grado que te interesa.');
      return;
    }

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email, grado }]);

      if (error) {
        if (error.code === '23505') {
          throw new Error('Este correo electrónico ya está registrado en la lista de reserva.');
        }
        throw error;
      }

      setStatus('success');
      setEmail('');
      setGrado('');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err?.message || 'Ha ocurrido un error al procesar tu solicitud.');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 hover:opacity-90 transition">
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-sm font-black tracking-wider">FP</span>
            <span>Sanidad <span className="text-blue-600">10</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-slate-700 hover:text-slate-900 font-medium text-sm px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/colabora"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Unirse al Equipo
            </Link>
          </div>
        </div>
      </header>

      <main style={styles.mainContent}>
        <section id="registro" style={styles.heroSection}>
          <div style={styles.badge}>Campus Virtual en Desarrollo · Convocatoria 2026/2027</div>
          <h1 style={styles.heroTitle}>
            Preparación Especializada para Formación Profesional de Sanidad
          </h1>
          <p style={styles.heroSubtitle}>
            Plataforma de alto rendimiento académico para ciclos de Grado Superior y Grado Medio de la familia sanitaria. Temarios oficializados, banco de test explicados y simulacros de examen reales.
          </p>

          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>Reserva tu plaza con acceso prioritario</h2>
            <p style={styles.formSubtitle}>
              Únete a la lista de espera para obtener descuento de lanzamiento y acceso anticipado al material didáctico.
            </p>

            {status === 'success' ? (
              <div style={styles.successBox}>
                ✓ <strong>¡Reserva completada!</strong> Hemos registrado tu solicitud. Te notificaremos por correo electrónico antes de la apertura oficial de plazas.
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label htmlFor="email" style={styles.label}>Correo Electrónico</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="tu.email@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'loading'}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label htmlFor="grado" style={styles.label}>Especialidad de FP Sanidad</label>
                  <select
                    id="grado"
                    value={grado}
                    onChange={(e) => setGrado(e.target.value)}
                    disabled={status === 'loading'}
                    style={styles.select}
                    required
                  >
                    <option value="" disabled>Selecciona tu ciclo formativo...</option>
                    {GRADOS.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  style={styles.button}
                >
                  {status === 'loading' ? 'Procesando reserva...' : 'Obtener Acceso Prioritario'}
                </button>
              </form>
            )}

            {status === 'error' && (
              <p style={styles.errorText}>{errorMessage}</p>
            )}
          </div>
        </section>

        <section style={styles.featuresSection}>
          <h2 style={styles.sectionTitle}>Optimizado para el Máximo Rendimiento en FP Sanitaria</h2>
          <p style={styles.sectionSubtitle}>
            Diseñado por profesionales en activo y especialistas docentes de la rama socio-sanitaria.
          </p>

          <div style={styles.featuresGrid}>
            <article style={styles.featureCard}>
              <h3 style={styles.featureTitle}>Simulacros de Examen Reales</h3>
              <p style={styles.featureDescription}>
                Bancos de preguntas tipo test categorizados por módulos profesionales. Explicaciones razonadas y métricas de progreso detalladas por asignatura.
              </p>
            </article>

            <article style={styles.featureCard}>
              <h3 style={styles.featureTitle}>Adaptado a Pruebas Libres y Presencial</h3>
              <p style={styles.featureDescription}>
                Contenidos alineados con los currículos oficiales del Ministerio de Educación y Comunidades Autónomas. Cobertura completa para exámenes libres y apoyo a clases presenciales.
              </p>
            </article>

            <article style={styles.featureCard}>
              <h3 style={styles.featureTitle}>Casos Prácticos y Diagnósticos</h3>
              <p style={styles.featureDescription}>
                Resolución paso a paso de supuestos prácticos, identificación de imágenes médicas, protocolos de radioprotección y gestión de muestras biológicas.
              </p>
            </article>
          </div>
        </section>

        <section style={styles.degreesSection}>
          <h2 style={styles.sectionTitle}>Ciclos Formativos Soportados</h2>
          <p style={styles.sectionSubtitle}>
            Preparación adaptada a la normativa vigente de los títulos de la familia profesional Sanidad:
          </p>

          <div style={styles.degreesList}>
            <div style={styles.degreeTag}>Imagen para el Diagnóstico y Medicina Nuclear</div>
            <div style={styles.degreeTag}>Radioterapia y Dosimetría</div>
            <div style={styles.degreeTag}>Laboratorio Clínico y Biomédico</div>
            <div style={styles.degreeTag}>Anatomía Patológica y Citodiagnóstico</div>
            <div style={styles.degreeTag}>Cuidados Auxiliares de Enfermería (TCAE)</div>
            <div style={styles.degreeTag}>Emergencias Sanitarias</div>
            <div style={styles.degreeTag}>Farmacia y Parafarmacia</div>
            <div style={styles.degreeTag}>Higiene Bucodental</div>
            <div style={styles.degreeTag}>Documentación y Administración Sanitarias</div>
            <div style={styles.degreeTag}>Prótesis Dentales</div>
          </div>
        </section>

        <section style={styles.faqSection}>
          <h2 style={styles.sectionTitle}>Preguntas Frecuentes sobre FP Sanidad 10</h2>
          
          <div style={styles.faqContainer}>
            <article style={styles.faqItem}>
              <h3 style={styles.faqQuestion}>¿Cuándo estará disponible la plataforma?</h3>
              <p style={styles.faqAnswer}>
                Estamos completando la fase final de auditoría del contenido didáctico. Los usuarios registrados en la lista de reserva recibirán una invitación exclusiva de acceso anticipado antes del lanzamiento público general.
              </p>
            </article>

            <article style={styles.faqItem}>
              <h3 style={styles.faqQuestion}>¿El temario sirve para las Pruebas Libres de FP de Sanidad?</h3>
              <p style={styles.faqAnswer}>
                Sí. Toda la estructura modular está redactada tomando como referencia los Reales Decretos de título mínimo de cada especialidad sanitaria, permitiendo preparar con garantías tanto las Pruebas Libres autonómicas como las evaluaciones continuas en centros oficiales.
              </p>
            </article>

            <article style={styles.faqItem}>
              <h3 style={styles.faqQuestion}>¿Qué ventajas tiene registrarse en la lista de espera?</h3>
              <p style={styles.faqAnswer}>
                El registro garantiza la reserva de plaza con tarifa promocional reducida para el primer año académico, además de acceso a simulacros de prueba gratuitos previa apertura del campus.
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p style={styles.footerText}>
            © {new Date().getFullYear()} FP Sanidad 10. Todos los derechos reservados.
          </p>
          <p style={styles.legalText}>
            De conformidad con el RGPD (UE 2016/679) y la LOPDGDD 3/2018, los datos recopilados serán procesados exclusivamente con la finalidad de gestionar su solicitud de acceso prioritario al campus virtual.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/colabora" element={<Colabora />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/campus" element={<Campus />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/recuperar-password" element={<RecuperarPassword />} />
        <Route path="/actualizar-password" element={<ActualizarPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    padding: '1rem 1.5rem',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  headerContent: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: '800',
    letterSpacing: '-0.025em',
    color: '#0f172a',
  },
  logoHighlight: {
    color: '#0284c7',
  },
  colaboraLink: {
    color: '#475569',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  headerCta: {
    backgroundColor: '#f1f5f9',
    color: '#0369a1',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
  },
  heroSection: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '4rem 1.5rem 3rem 1.5rem',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-block',
    padding: '0.35rem 0.85rem',
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
  },
  heroTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    lineHeight: '1.2',
    letterSpacing: '-0.03em',
    color: '#0f172a',
    marginBottom: '1.25rem',
  },
  heroSubtitle: {
    fontSize: '1.125rem',
    lineHeight: '1.6',
    color: '#475569',
    marginBottom: '2.5rem',
  },
  formCard: {
    backgroundColor: '#ffffff',
    padding: '2.5rem',
    borderRadius: '1rem',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
    border: '1px solid #e2e8f0',
    textAlign: 'left',
  },
  formTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 0.5rem 0',
  },
  formSubtitle: {
    fontSize: '0.95rem',
    color: '#64748b',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    padding: '0.875rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    fontSize: '1rem',
    outline: 'none',
  },
  select: {
    padding: '0.875rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    fontSize: '0.95rem',
    outline: 'none',
    cursor: 'pointer',
  },
  button: {
    padding: '1rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    backgroundColor: '#0284c7',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'background-color 0.2s',
  },
  successBox: {
    padding: '1.25rem',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderRadius: '0.5rem',
    border: '1px solid #a7f3d0',
    fontSize: '0.95rem',
    lineHeight: '1.5',
  },
  errorText: {
    color: '#dc2626',
    fontSize: '0.875rem',
    marginTop: '1rem',
  },
  featuresSection: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e2e8f0',
    borderBottom: '1px solid #e2e8f0',
    padding: '4rem 1.5rem',
  },
  sectionTitle: {
    fontSize: '1.875rem',
    fontWeight: '800',
    textAlign: 'center',
    color: '#0f172a',
    margin: '0 0 0.75rem 0',
    letterSpacing: '-0.025em',
  },
  sectionSubtitle: {
    fontSize: '1rem',
    textAlign: 'center',
    color: '#64748b',
    maxWidth: '600px',
    margin: '0 auto 3rem auto',
  },
  featuresGrid: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  featureCard: {
    backgroundColor: '#f8fafc',
    padding: '2rem',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0',
  },
  featureTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 0,
    marginBottom: '0.75rem',
  },
  featureDescription: {
    color: '#475569',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    margin: 0,
  },
  degreesSection: {
    padding: '4rem 1.5rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  degreesList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    justifyContent: 'center',
  },
  degreeTag: {
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    color: '#334155',
    padding: '0.6rem 1rem',
    borderRadius: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  faqSection: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e2e8f0',
    padding: '4rem 1.5rem',
  },
  faqContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  faqItem: {
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: '1.5rem',
  },
  faqQuestion: {
    fontSize: '1.125rem',
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 0,
    marginBottom: '0.5rem',
  },
  faqAnswer: {
    color: '#475569',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    margin: 0,
  },
  footer: {
    backgroundColor: '#0f172a',
    color: '#94a3b8',
    padding: '2.5rem 1.5rem',
    marginTop: 'auto',
  },
  footerContent: {
    maxWidth: '1100px',
    margin: '0 auto',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: '0.75rem',
  },
  legalText: {
    fontSize: '0.8rem',
    lineHeight: '1.5',
    color: '#64748b',
    maxWidth: '800px',
    margin: '0 auto',
  },
};
