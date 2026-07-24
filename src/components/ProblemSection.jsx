import React from 'react';
import { AlertCircle, CheckCircle, HelpCircle, FileText, Zap, Cpu, Award } from 'lucide-react';

export default function ProblemSection({ onOpenLeadModal }) {
  const problems = [
    {
      title: "Física y Radiobiología indescifrables",
      problem: "Explicaciones teóricas complejas, fórmulas sin sentido práctico y falta de ejemplos visuales.",
      solution: "Esquemas 3D interactivos, física explicada para técnicos y resúmenes al grano.",
      icon: Zap,
    },
    {
      title: "Respuesta tardía a dudas en clase",
      problem: "Días esperando a que un profesor responda una duda de un ejercicio antes de un examen.",
      solution: "Sistema de Tickets directo con respuesta prioritaria de Técnicos Sanitarios Colegiados.",
      icon: HelpCircle,
    },
    {
      title: "Temarios desactualizados en institutos",
      problem: "Materiales antiguos que no reflejan la tecnología de los hospitales modernos (RM de 3T, TC Multicorte).",
      solution: "Temario 2026/2027 actualizado con protocolos reales de hospitales públicos y privados.",
      icon: Cpu,
    },
    {
      title: "Estrés antes de los exámenes finales",
      problem: "Falta de bancos de preguntas tipo test reales y casos prácticos corregidos paso a paso.",
      solution: "Más de 3,000 preguntas tipo test explicadas con justificación de cada respuesta.",
      icon: FileText,
    },
  ];

  return (
    <section id="problema" className="bg-slate-50 py-20 px-6 border-y border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-medium">
            <AlertCircle className="w-3.5 h-3.5 text-slate-600" />
            <span>El Desafío del Grado Superior de Sanidad</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            ¿Te cuesta avanzar en Radiobiología o Anatomía por Imagen?
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Sabemos que el Grado Superior en Sanidad exige un nivel alto. Compara la enseñanza tradicional de instituto con nuestra metodología orientada al aprobado.
          </p>
        </div>

        {/* Problem vs Solution Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {problems.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between text-left"
              >
                <div className="space-y-4">
                  
                  {/* Icon & Title */}
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                  </div>

                  {/* Problem Box */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider block mb-0.5">La realidad en muchos centros:</span>
                      <p className="text-slate-600 text-xs sm:text-sm">{item.problem}</p>
                    </div>
                  </div>

                  {/* Solution Box */}
                  <div className="bg-slate-100 border border-slate-200/80 rounded-xl p-3.5 flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-semibold text-slate-900 uppercase tracking-wider block mb-0.5">Nuestra Solución en la Academia:</span>
                      <p className="text-slate-800 text-xs sm:text-sm font-medium">{item.solution}</p>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 bg-white rounded-xl p-6 sm:p-8 border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 shrink-0 hidden sm:block">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">Comprueba el método con el Tema Cero de muestra</h4>
              <p className="text-slate-600 text-xs sm:text-sm">Descarga el PDF gratuito de "Fundamentos de la Radiación y Protección Radiológica".</p>
            </div>
          </div>
          <button
            onClick={onOpenLeadModal}
            className="w-full md:w-auto bg-slate-900 text-white hover:bg-slate-800 transition-all px-6 py-3 rounded-lg text-sm font-medium shrink-0"
          >
            Obtener Tema 0 Gratuito
          </button>
        </div>

      </div>
    </section>
  );
}
