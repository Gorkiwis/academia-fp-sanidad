import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  BookOpen, Search, ArrowLeft, Calendar, Tag, User, 
  Sparkles, ChevronRight, GraduationCap, Share2, CheckCircle2, MessageSquare
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const SAMPLE_ARTICLES = [
  {
    id: 'art-1',
    title: 'Guía Completa de Refuerzo en FP Sanidad: Claves para Aprobar tus Exámenes',
    slug: 'guia-refuerzo-fp-sanidad-aprobar-examenes',
    category: 'Refuerzo FP Sanidad',
    keywords: 'refuerzo fp sanidad, aprobar fp sanidad, refuerzo escolar fp, grado superior sanidad',
    seo_description: 'Descubre las mejores estrategias de estudio, esquemas de repaso y métodos de apoyo académico para superar con éxito los ciclos formativos sanitarios.',
    author_email: 'gorkaobiangolaso@gmail.com',
    published_at: '2026-07-24',
    content: `
# Guía Completa de Refuerzo en FP Sanidad: Estrategias de Exito Académico

El estudio de la **Formación Profesional en la rama Sanitaria** (tanto en Grado Medio como en Grado Superior) requiere un enfoque muy práctico unido a una sólida comprensión teórica de la anatomía, fisiopatología y protocolos radiológicos o de laboratorio.

## 1. Planificación por Módulos Profesionales
La clave para no saturarse durante el curso es organizar los temarios en bloques conceptuales:
- **Términos médicos y nomenclatura:** Domina los prefijos y sufijos anatómicos.
- **Protocolos de actuación:** Memoriza las secuencias de trabajo en resonancia, tomografía o análisis clínico.
- **Resolución de supuestos prácticos:** Practica de forma diaria con casos clínicos reales.

## 2. La Importancia del Refuerzo Especializado
Un buen sistema de **refuerzo en FP Sanidad** ayuda a simplificar los conceptos densos de asignaturas complejas como *Radiobiología*, *Dosimetría*, *Microbiología* o *Citología*. Tener esquemas sintéticos y resolución directa de dudas marca la diferencia entre un aprobado ajustado y un expediente brillante.

## 3. Preparación de Exámenes y Pruebas Libres
Si te preparas para **pruebas libres** o evaluaciones continuas:
1. Realiza simulacros con control de tiempo.
2. Analiza los fallos cometidos en las preguntas de opción múltiple.
3. Consulta siempre a docentes en activo para aclarar conceptos dudososa.
    `
  },
  {
    id: 'art-2',
    title: 'Cómo Dominar la Tomografía Computarizada en TSIDMN: Escala Hounsfield y Protocolos',
    slug: 'dominar-tomografia-computarizada-tsidmn-hounsfield',
    category: 'Imagen Diagnóstica (TSIDMN)',
    keywords: 'TSIDMN refuerzo, tomografia computarizada, escala hounsfield, radiodiagnostico',
    seo_description: 'Explicación detallada de la escala Hounsfield, densidad tisular y protocolos con contraste intravenoso para alumnos de TSIDMN.',
    author_email: 'gorkaobiangolaso@gmail.com',
    published_at: '2026-07-22',
    content: `
# Tomografía Computarizada (TC): Dominando la Escala Hounsfield

En el ciclo de **Imagen para el Diagnóstico y Medicina Nuclear (TSIDMN)**, el estudio de la Tomografía Computarizada ocupa un lugar central.

## ¿Qué es la escala Hounsfield (HU)?
La escala Hounsfield mide la atenuación de los Rayos X al atravesar los tejidos corporales:
- **Aire:** -1000 HU (Negro)
- **Grasa:** -100 HU a -50 HU
- **Agua:** 0 HU (Referencia)
- **Tejidos blandos (Hígado/Músculo):** +30 HU a +60 HU
- **Hueso denso:** +1000 HU (Blanco brillante)

## Consejos de estudio para TSIDMN
Para dominar este módulo de FP Sanitaria:
- Revisa ventanas de visualización (Ventana Pulmonar vs Ventana Ósea).
- Entiende la reconstrucción helicoidal y el Pitch.
- Estudia las fases de contraste: arterial temprana, portal venosa y tardía.
    `
  },
  {
    id: 'art-3',
    title: 'Refuerzo para TCAE y Cuidados Auxiliares: Técnicas y Protocolos de Enfermería',
    slug: 'refuerzo-tcae-cuidados-auxiliares-enfermeria',
    category: 'Cuidados Auxiliares (TCAE)',
    keywords: 'refuerzo tcae, fp enfermeria auxiliares, ciclo medio sanidad, constantes vitales',
    seo_description: 'Resumen práctico de procedimientos de higiene, toma de constantes y cuidados de enfermería para estudiantes de TCAE.',
    author_email: 'gorkaobiangolaso@gmail.com',
    published_at: '2026-07-20',
    content: `
# Técnicas Básicas de Enfermería para Estudiantes de TCAE

El ciclo medio de **Cuidados Auxiliares de Enfermería (TCAE)** exige rapidez, precisión y una vocación orientada al cuidado directo del paciente.

## Aspectos Clave en la Evaluación Práctica
1. **Monitorización de Constantes Vitales:** Presión arterial, frecuencia cardíaca, saturación de oxígeno y temperatura corporal.
2. **Posiciones Anatómicas:** Decúbito supino, Fowler, Trendelenburg y Sims.
3. **Medidas de Aislamiento y Bioseguridad:** Colocación de EPIs y lavado quirúrgico de manos.
    `
  }
];

export default function Blog() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Categories list
  const categories = [
    'Todas',
    'Refuerzo FP Sanidad',
    'Imagen Diagnóstica (TSIDMN)',
    'Radioterapia y Dosimetría',
    'Laboratorio Clínico',
    'Anatomía Patológica',
    'Cuidados Auxiliares (TCAE)',
    'Emergencias Sanitarias'
  ];

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    let loadedList = [];

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          loadedList = data;
        }
      } catch (err) {
        console.warn('Error cargando artículos de Supabase:', err);
      }
    }

    if (loadedList.length === 0) {
      // Local fallback storage or sample articles
      const local = localStorage.getItem('academia_articles');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (parsed && parsed.length > 0) loadedList = parsed;
        } catch (e) {
          console.error(e);
        }
      }
      if (loadedList.length === 0) {
        loadedList = SAMPLE_ARTICLES;
      }
    }

    setArticles(loadedList);
    setLoading(false);
  };

  // Find active single article if slug parameter is present
  const currentArticle = slug ? articles.find((a) => a.slug === slug || a.id === slug) : null;

  // Update dynamic SEO meta tags if viewing an article
  useEffect(() => {
    if (currentArticle) {
      document.title = `${currentArticle.title} | Blog Academia FP Sanidad`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && currentArticle.seo_description) {
        metaDesc.setAttribute('content', currentArticle.seo_description);
      }
    } else {
      document.title = 'Blog de Refuerzo en FP Sanidad | Artículos y Guías Académicas';
    }
  }, [currentArticle]);

  // Filtered articles list
  const filteredArticles = articles.filter((art) => {
    const matchesCat = selectedCategory === 'Todas' || art.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (art.title || '').toLowerCase().includes(q) ||
      (art.content || '').toLowerCase().includes(q) ||
      (art.keywords || '').toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      
      {/* Header Bar */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 hover:opacity-90 transition">
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-sm font-black tracking-wider">FP</span>
            <span>Sanidad <span className="text-blue-600">10</span></span>
            <span className="ml-2 text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
              Blog Docente
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/campus"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Acceso Campus</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {currentArticle ? (
          /* ARTICLE DETAIL VIEW */
          <article className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6 text-left">
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a la lista de artículos</span>
            </button>

            <div className="space-y-3 border-b border-slate-100 pb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-extrabold uppercase tracking-wider">
                {currentArticle.category || 'Refuerzo FP Sanidad'}
              </span>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                {currentArticle.title}
              </h1>

              <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap pt-2">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Por Equipo Docente FP Sanidad</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentArticle.published_at ? new Date(currentArticle.published_at).toLocaleDateString('es-ES') : 'Reciente'}</span>
                </span>
              </div>
            </div>

            {/* Article Content Render */}
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line space-y-4">
              {currentArticle.content}
            </div>

            {/* Keywords Footer Tags */}
            {currentArticle.keywords && (
              <div className="pt-6 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Keywords Objetivo:</span>
                <div className="flex flex-wrap gap-2">
                  {currentArticle.keywords.split(',').map((kw, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                      #{kw.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action Box inside Article */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900 to-blue-950 text-white space-y-3 mt-8">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Refuerzo Especializado en FP Sanitaria</span>
              </div>
              <h3 className="text-lg font-bold text-white">¿Necesitas preparar tus exámenes de FP Sanidad?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Accede a temarios resumidos en PDF, videoteca HD y resolución directa de dudas docentes para todos los ciclos de la familia sanitaria.
              </p>
              <Link
                to="/campus"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-colors"
              >
                <span>Acceder al Campus Virtual</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </article>
        ) : (
          /* ARTICLES LISTING VIEW */
          <div className="space-y-8 text-left">
            
            {/* Blog Header Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Blog Docente & Artículos SEO</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Refuerzo de Formación Profesional de Sanidad
              </h1>
              <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
                Artículos, esquemas de estudio y guías metodológicas redactadas por profesores en activo para ayudarte a superar los ciclos de Grado Medio y Superior de la familia sanitaria.
              </p>

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar temas, módulos o palabras clave (ej: TSIDMN, Hounsfield)..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Categories Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            {loading ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                Cargando artículos docentes...
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
                <p className="text-slate-700 font-bold text-sm">No se encontraron artículos publicados para la búsqueda.</p>
                <p className="text-xs text-slate-500">Prueba seleccionando otra categoría o limpiando la barra de búsqueda.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((art) => (
                  <article
                    key={art.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-all group cursor-pointer"
                    onClick={() => navigate(`/blog/${art.slug || art.id}`)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-extrabold uppercase">
                          {art.category || 'Refuerzo FP'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {art.published_at ? new Date(art.published_at).toLocaleDateString('es-ES') : '2026'}
                        </span>
                      </div>

                      <h2 className="font-extrabold text-slate-900 text-base group-hover:text-blue-600 transition-colors leading-snug">
                        {art.title}
                      </h2>

                      <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed">
                        {art.seo_description || (art.content ? art.content.slice(0, 140) + '...' : '')}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                      <span>Leer artículo completo</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </article>
                ))}
              </div>
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 mt-auto text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto space-y-2">
          <p className="font-semibold text-slate-700">© {new Date().getFullYear()} FP Sanidad 10 · Academia de Refuerzo en Formación Profesional Sanitaria</p>
          <p className="text-slate-400 max-w-xl mx-auto">
            Contenidos adaptados a los currículos oficiales de Grado Medio y Grado Superior de Sanidad (TSIDMN, Radioterapia, Laboratorio, Anatomía Patológica, TCAE).
          </p>
        </div>
      </footer>

    </div>
  );
}
