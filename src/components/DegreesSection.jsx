import React, { useState } from 'react';
import {
  Radio,
  Zap,
  TestTube,
  Microscope,
  FileText,
  BookOpen,
  CheckCircle2,
  Download,
  FileCheck,
  Award,
  FileCode,
  ArrowRight
} from 'lucide-react';

export default function DegreesSection({ onOpenLeadModal, userPlan = 'free' }) {
  const [activeTab, setActiveTab] = useState('tsidmn');
  const isProMax = userPlan === 'promax';

  const tabs = [
    { id: 'tsidmn', label: 'TSIDMN (Radiodiagnóstico)', icon: Radio },
    { id: 'radioterapia', label: 'Radioterapia', icon: Zap },
    { id: 'laboratorio', label: 'Laboratorio Clínico', icon: TestTube },
    { id: 'anatomia', label: 'Anatomía Patológica', icon: Microscope },
    { id: 'documentacion', label: 'Documentación Sanitaria', icon: FileText }
  ];

  const degreesData = {
    tsidmn: {
      code: 'TSIDMN',
      title: 'Radiodiagnóstico y Medicina Nuclear (TSIDMN)',
      fullName: 'Técnico Superior en Imagen para el Diagnóstico y Medicina Nuclear',
      badge: 'Más Demandado',
      description: 'Dominio completo de la física radiológica, secuencias de Resonancia Magnética, reconstrucciones TAC, gammagrafía y protección radiológica.',
      testsCount: '1.800+ Tests',
      casesCount: '65 Casos',
      detailedModules: [
        {
          name: '1. Fundamentos Físicos y Equipos',
          description: 'Generación de Rayos X, tubos de ánodo giratorio, filtración, geometría del haz y física de atenuación.'
        },
        {
          name: '2. Tomografía Computarizada (TC)',
          description: 'Adquisición helicoidal, escala Hounsfield, reconstrucciones multiplanares (MPR/MIP) y protocolos con contraste.'
        },
        {
          name: '3. Resonancia Magnética (RM)',
          description: 'Física de la relajación T1/T2, secuencias Spin-Echo y FLAIR, gradientes de campo magnético y normas de seguridad.'
        },
        {
          name: '4. Protección Radiológica y Radiobiología',
          description: 'Límites dosimétricos, blindajes estructurales, efectos estocásticos vs deterministas y dosimetría personal.'
        }
      ],
      pdfIndex: [
        'Capítulo 1: Estructura del Átomo y Radiación Ionizante (Física de Partículas)',
        'Capítulo 2: Interacción de los Fotones con la Materia (Efecto Fotoeléctrico y Compton)',
        'Capítulo 3: Principios Básicos de Dosimetría y Magnitudes Radiológicas (Gray y Sievert)',
        'Capítulo 4: Casos Prácticos y Exámenes Resueltos de Convocatoria Oficial'
      ]
    },
    radioterapia: {
      code: 'RTR',
      title: 'Radioterapia y Dosimetría (RTR)',
      fullName: 'Técnico Superior en Radioterapia y Dosimetría',
      badge: 'Alta Ponderación',
      description: 'Especialízate en cálculo de dosis clínicas, aceleradores lineales de electrones, simulación en 3D e IMRT oncología.',
      testsCount: '1.400+ Tests',
      casesCount: '50 Casos',
      detailedModules: [
        {
          name: '1. Dosimetría Física y Clínica',
          description: 'Cálculo de distribución de dosis, isodosis, factores de campo y curvas de rendimiento en profundidad.'
        },
        {
          name: '2. Equipos de Radioterapia',
          description: 'Funcionamiento de aceleradores lineales de electrones (LINAC), colimación multilámina (MLC) y unidad de telecobaltoterapia.'
        },
        {
          name: '3. Simulación y Planificación',
          description: 'Simulación virtual mediante TC colimado, definición de volúmenes blancos (GTV, CTV, PTV) y órganos en riesgo.'
        },
        {
          name: '4. Radiobiología Especializada',
          description: 'Respuesta celular a la radiación, las 5 R de la radiobiología y fraccionamiento de la dosis en tratamientos radioterápicos.'
        }
      ],
      pdfIndex: [
        'Capítulo 1: Fundamentos de Física Nuclear Aplicada a Radioterapia',
        'Capítulo 2: Principios de Teleterapia y Braquiterapia',
        'Capítulo 3: Contorneado y Delimitación de Volúmenes Tumorales',
        'Capítulo 4: Simulacros de Examen de Dosimetría y Física Médica'
      ]
    },
    laboratorio: {
      code: 'LCB',
      title: 'Laboratorio Clínico y Biomédico (LCB)',
      fullName: 'Técnico Superior en Laboratorio Clínico y Biomédico',
      badge: 'Top Nota Universidad',
      description: 'Comprensión exhaustiva de reactivos, espectrofotometría, frotis sanguíneos, microbiología y técnicas genéticas PCR.',
      testsCount: '2.100+ Tests',
      casesCount: '80 Casos',
      detailedModules: [
        {
          name: '1. Bioquímica Clínica',
          description: 'Espectrofotometría, ionogramas, perfiles lipídicos, enzimología y control de calidad en analizadores automáticos.'
        },
        {
          name: '2. Microbiología y Parasitología',
          description: 'Siembra de cultivos, tinciones Gram y Ziehl-Neelsen, antibiogramas e identificación bacteriana.'
        },
        {
          name: '3. Hematología y Hemostasia',
          description: 'Contadores hematológicos, morfología de frotis sanguíneo en microscopio y pruebas de coagulación.'
        },
        {
          name: '4. Biología Molecular y Genética',
          description: 'Extracción de ADN, amplificación por PCR cuantitativa en tiempo real y electroforesis en gel.'
        }
      ],
      pdfIndex: [
        'Capítulo 1: Protocolos de Seguridad y Calidad en Laboratorio Biomédico',
        'Capítulo 2: Interpretación de Analíticas y Valores de Referencia',
        'Capítulo 3: Manual de Microbiología Práctica y Tinciones Diagnósticas',
        'Capítulo 4: Preguntas Tipo Test Explicadas de Bioquímica y Hematología'
      ]
    },
    anatomia: {
      code: 'APC',
      title: 'Anatomía Patológica y Citodiagnóstico (APC)',
      fullName: 'Técnico Superior en Anatomía Patológica y Citodiagnóstico',
      badge: 'Estratégico Sanitario',
      description: 'Procesamiento de muestras histológicas, tinción H-E e inmunohistoquímica, citología cérvico-vaginal y biopsias.',
      testsCount: '1.600+ Tests',
      casesCount: '55 Casos',
      detailedModules: [
        {
          name: '1. Procesamiento Tisular e Histotecnología',
          description: 'Fijación en formol, inclusión en parafina, corte en micrótomo y tinción estándar Hematoxilina-Eosina.'
        },
        {
          name: '2. Citomorfología Diagnóstica',
          description: 'Evaluación citológica de frotis Papanicolaou (Bethesda), PAAF mamaria y tiroidea.'
        },
        {
          name: '3. Inmunohistoquímica y Marcadores',
          description: 'Técnicas de anticuerpos monoclonales para la caracterización tumoral (Ki-67, HER2, CK7/20).'
        },
        {
          name: '4. Necropsias y Macroscopía',
          description: 'Técnicas de disección, descripción macroscópica de piezas quirúrgicas y tallado de biopsias.'
        }
      ],
      pdfIndex: [
        'Capítulo 1: Manual de Procesamiento Histológico y Artefactos de Técnica',
        'Capítulo 2: Atlas de Citología Ginecológica y Criterios Diagnósticos',
        'Capítulo 3: Fundamentos de Inmunohistoquímica y Patología Molecular',
        'Capítulo 4: Casos Prácticos Resueltos de Anatomía Patológica'
      ]
    },
    documentacion: {
      code: 'DAS',
      title: 'Documentación y Administración Sanitarias (DAS)',
      fullName: 'Técnico Superior en Documentación y Administración Sanitarias',
      badge: 'Alta Empleabilidad',
      description: 'Domina la codificación de diagnósticos y procedimientos con la normativa CIE-10-ES, sistemas de información y bases de datos.',
      testsCount: '1.300+ Tests',
      casesCount: '45 Casos',
      detailedModules: [
        {
          name: '1. Codificación Clínica CIE-10-ES',
          description: 'Asignación de códigos de diagnóstico y procedimientos quirúrgicos según la normativa ministerial vigente.'
        },
        {
          name: '2. Sistemas de Información Sanitaria',
          description: 'Gestión del Conjunto Mínimo Básico de Datos (CMBD), archivo de historias clínicas e interoperabilidad.'
        },
        {
          name: '3. Explotación y Validación de Datos',
          description: 'Estadística sanitaria, indicadores de frecuentación hospitalaria y control de calidad asistencial.'
        },
        {
          name: '4. Derecho y Lex Artis Sanitaria',
          description: 'Protección de datos del paciente (LOPD-GDD), consentimiento informado y custodia de documentos.'
        }
      ],
      pdfIndex: [
        'Capítulo 1: Guía Completa de Codificación CIE-10-ES Diagnósticos y Procedimientos',
        'Capítulo 2: Estructura del CMBD y Explotación de Datos de Salud',
        'Capítulo 3: Aspectos Legales de la Historia Clínica Digital',
        'Capítulo 4: Ejercicios de Codificación Clínica y Test de Evaluación'
      ]
    }
  };

  const currentDegree = degreesData[activeTab];

  const handleScrollToPricingOrModal = (degreeName) => {
    if (onOpenLeadModal) {
      onOpenLeadModal(degreeName);
    }
    const pricingElem = document.getElementById('precios');
    if (pricingElem) {
      pricingElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="grados" className="bg-white py-20 px-6 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
            <BookOpen className="w-4 h-4 text-slate-800" />
            <span>Especialidades Sanitarias Oficiales</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Preparación Integral para Todos los Grados Superiores Sanitarios
          </h2>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Sintetizamos las asignaturas más complejas de cada especialidad para que obtengas la máxima nota en tu FP Sanidad y asegures tu plaza en la Universidad.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 max-w-4xl mx-auto mb-10 no-scrollbar justify-start sm:justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display - Detailed View for Active Degree */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-8 text-left max-w-5xl mx-auto">
          
          {/* Degree Header Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 border border-slate-200 text-slate-700">
                  {currentDegree.code}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 border border-slate-200 text-slate-700">
                  {currentDegree.badge}
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">{currentDegree.title}</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">{currentDegree.fullName}</p>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-slate-600 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200">
              <span className="flex items-center gap-1.5 font-mono font-medium">
                <FileCheck className="w-4 h-4 text-slate-800" />
                {currentDegree.testsCount}
              </span>
              <span className="flex items-center gap-1.5 font-mono font-medium">
                <Award className="w-4 h-4 text-slate-800" />
                {currentDegree.casesCount}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {currentDegree.description}
          </p>

          {/* Detailed 4 Modules Grid */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Desglose Detallado de los 4 Módulos Clave:
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
              {currentDegree.detailedModules.map((mod, idx) => (
                <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-slate-900 shrink-0" />
                    <span>{mod.name}</span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed pl-6">
                    {mod.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* PDF Preview Box (Tema 0: Física de Radiaciones / Guía Muestra) */}
          <div className={`rounded-xl p-5 sm:p-6 border space-y-4 transition-all ${
            isProMax
              ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300/60'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <FileCode className={`w-5 h-5 shrink-0 ${isProMax ? 'text-amber-700' : 'text-slate-800'}`} />
                <span>
                  {isProMax
                    ? `Temario Completo Desbloqueado - Todos los Capítulos PDF (${currentDegree.code}):`
                    : `Vista previa del Índice - PDF Tema 0 de muestra (${currentDegree.code}):`}
                </span>
              </div>
              {isProMax && (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-200/80 text-amber-900 border border-amber-300">
                  ⚡ ACCESO PRO MAX DESBLOQUEADO
                </span>
              )}
            </div>
            
            <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-700 pl-1">
              {currentDegree.pdfIndex.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-start justify-between gap-2 p-2.5 rounded-lg border transition-all ${
                    isProMax
                      ? 'bg-white border-amber-200/80 shadow-xs'
                      : 'bg-white border-slate-200/80'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-slate-400 font-bold shrink-0">{idx + 1}.</span>
                    <span className={isProMax ? 'font-medium text-slate-900' : ''}>{item}</span>
                  </div>
                  {isProMax && (
                    <span className="shrink-0 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                      PDF OK
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
            <button
              onClick={() => onOpenLeadModal && onOpenLeadModal(`Muestra Tema 0 ${currentDegree.code}`)}
              className="w-full sm:w-auto border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 py-3 px-6 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{isProMax ? 'Descargar Todos los Temas PDF' : 'Descargar Muestra en PDF'}</span>
            </button>

            <button
              onClick={() => handleScrollToPricingOrModal(currentDegree.fullName)}
              className={`w-full sm:w-auto py-3 px-6 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                isProMax
                  ? 'bg-amber-600 text-white hover:bg-amber-700 font-semibold shadow-sm'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <span>{isProMax ? 'Material PRO MAX Desbloqueado' : `Obtener Material de ${currentDegree.code}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
