import React, { useState, useEffect } from 'react';
import { Upload, X, CheckCircle2, AlertCircle, FileText, Lock, GraduationCap } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AVAILABLE_DEGREES = [
  { id: 'tsidmn', name: 'TSIDMN - Radiodiagnóstico y Medicina Nuclear' },
  { id: 'radioterapia', name: 'Radioterapia y Dosimetría' },
  { id: 'laboratorio', name: 'Laboratorio Clínico y Biomédico' },
  { id: 'anatomia', name: 'Anatomía Patológica y Citodiagnóstico' },
  { id: 'documentacion', name: 'Documentación y Administración Sanitarias' }
];

export default function AdminUploadModal({
  isOpen = false,
  onClose,
  userRole = 'superadmin',
  assignedDegree = 'tsidmn',
  onSuccess
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [degreeId, setDegreeId] = useState(assignedDegree || 'tsidmn');
  const [unlockDelayDays, setUnlockDelayDays] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Lock degree for author
  const isAuthor = userRole === 'author';

  useEffect(() => {
    if (isAuthor && assignedDegree) {
      // Standardize degree code or fallback to assignedDegree
      const matched = AVAILABLE_DEGREES.find(
        (d) => d.id.toLowerCase() === assignedDegree.toLowerCase() || d.name.toLowerCase().includes(assignedDegree.toLowerCase())
      );
      setDegreeId(matched ? matched.id : assignedDegree);
    }
  }, [isAuthor, assignedDegree]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    const targetDegree = isAuthor ? (assignedDegree || degreeId) : degreeId;

    try {
      let filePath = `temas/${targetDegree}/${Date.now()}_${selectedFile ? selectedFile.name : 'tema.pdf'}`;

      if (isSupabaseConfigured() && selectedFile) {
        // Upload file to Supabase Storage bucket 'temarios-pdf'
        const { error: storageError } = await supabase.storage
          .from('temarios-pdf')
          .upload(filePath, selectedFile, { upsert: true });

        if (storageError) {
          console.warn('Storage upload error, continuing record creation:', storageError);
        }
      }

      if (isSupabaseConfigured()) {
        const { error: dbError } = await supabase.from('topics').insert([
          {
            degree_id: targetDegree,
            title: title.trim(),
            description: description.trim(),
            file_path: filePath,
            unlock_delay_days: Number(unlockDelayDays) || 0
          }
        ]);

        if (dbError) throw dbError;
      }

      // Sync local storage fallback
      const localTopics = JSON.parse(localStorage.getItem('academia_topics') || '[]');
      localTopics.unshift({
        id: `topic-${Date.now()}`,
        degree_id: targetDegree,
        title: title.trim(),
        description: description.trim(),
        file_path: filePath,
        unlock_delay_days: Number(unlockDelayDays) || 0,
        created_at: new Date().toISOString()
      });
      localStorage.setItem('academia_topics', JSON.stringify(localTopics));

      setSuccessMsg('¡Contenido subido y registrado correctamente!');
      setTimeout(() => {
        setSubmitting(false);
        setSuccessMsg('');
        setTitle('');
        setDescription('');
        setSelectedFile(null);
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 1500);

    } catch (err) {
      console.error('Error uploading topic:', err);
      setErrorMsg(err.message || 'Error al subir el contenido PDF.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 rounded-2xl max-w-xl w-full p-6 sm:p-8 border border-slate-700 shadow-2xl relative text-left text-white space-y-6">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
            <Upload className="w-3.5 h-3.5" />
            <span>Subida de Temario & Contenidos</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Añadir Nuevo Tema / PDF Académico
          </h3>
          <p className="text-xs text-slate-400">
            Sube recursos educativos en formato PDF para los alumnos de FP Sanidad.
          </p>
        </div>

        {isAuthor && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Rol de Autor:</strong> El campo de grado está bloqueado. Solo puedes publicar en tu grado asignado (<strong>{assignedDegree}</strong>).
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Degree Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Grado FP Sanidad *</span>
            </label>
            {isAuthor ? (
              <div className="relative">
                <input
                  type="text"
                  disabled
                  value={
                    AVAILABLE_DEGREES.find((d) => d.id.toLowerCase() === (assignedDegree || degreeId).toLowerCase())?.name ||
                    assignedDegree
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700/80 text-slate-400 text-xs cursor-not-allowed font-medium"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute right-4 top-3.5" />
              </div>
            ) : (
              <select
                value={degreeId}
                onChange={(e) => setDegreeId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 font-medium"
              >
                {AVAILABLE_DEGREES.map((deg) => (
                  <option key={deg.id} value={deg.id}>
                    {deg.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Título del Tema / Módulo *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Tema 4: Protección Radiológica y Dosis Absorbida"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Descripción Corta del Contenido
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Resumen del contenido, fórmulas incluidas, conceptos clave..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Unlock Delay Days */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Días de Retardo para Desbloqueo (Drip Content)
            </label>
            <input
              type="number"
              min={0}
              value={unlockDelayDays}
              onChange={(e) => setUnlockDelayDays(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              0 = Disponible inmediatamente tras la suscripción.
            </p>
          </div>

          {/* File Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Documento PDF (Adjunto) *
            </label>
            <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-xl p-4 text-center transition-colors bg-slate-950/40">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="hidden"
                id="admin-pdf-upload"
              />
              <label htmlFor="admin-pdf-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <FileText className="w-8 h-8 text-indigo-400" />
                <span className="text-xs text-slate-300 font-medium">
                  {selectedFile ? selectedFile.name : 'Haz clic para seleccionar un archivo PDF'}
                </span>
                <span className="text-[10px] text-slate-500">Formato PDF (Máx. 25MB)</span>
              </label>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{submitting ? 'Subiendo...' : 'Publicar Contenido'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
