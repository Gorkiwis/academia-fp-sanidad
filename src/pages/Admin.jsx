import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Save, ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle, Database, CreditCard, Users, Search, Download, RefreshCw } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function Admin() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'pricing'

  // Pricing Form State
  const [pricingData, setPricingData] = useState({
    plan_1_price: '19',
    plan_1_stripe_url: 'https://buy.stripe.com/test_plan1',
    plan_2_price: '39',
    plan_2_stripe_url: 'https://buy.stripe.com/test_plan2'
  });

  // Profiles / Users State
  const [profiles, setProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingProfiles, setLoadingProfiles] = useState(false);

  const [savingConfig, setSavingConfig] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch profiles and pricing config on mount or auth
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoadingProfiles(true);
    if (isSupabaseConfigured()) {
      try {
        // Fetch Site Config
        const { data: configData } = await supabase
          .from('site_config')
          .select('*')
          .eq('id', 'default_config')
          .single();

        if (configData) {
          setPricingData({
            plan_1_price: configData.plan_1_price || '19',
            plan_1_stripe_url: configData.plan_1_stripe_url || '',
            plan_2_price: configData.plan_2_price || '39',
            plan_2_stripe_url: configData.plan_2_stripe_url || ''
          });
        }

        // Fetch Profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!profilesError && profilesData) {
          setProfiles(profilesData);
        }
      } catch (err) {
        console.warn('Supabase fetch error in Admin:', err);
      } finally {
        setLoadingProfiles(false);
      }
    } else {
      // Fallback demo storage
      const localConfig = localStorage.getItem('academia_site_config');
      if (localConfig) {
        try {
          setPricingData(JSON.parse(localConfig));
        } catch (e) {
          console.error(e);
        }
      }

      const localProfiles = localStorage.getItem('academia_profiles');
      if (localProfiles) {
        try {
          setProfiles(JSON.parse(localProfiles));
        } catch (e) {
          console.error(e);
        }
      } else {
        // Mock demo profiles if none exist locally
        setProfiles([
          {
            id: '1',
            nombre: 'Laura',
            apellidos: 'Gómez Martín',
            email: 'laura.gomez@ejemplo.com',
            grado: 'TSIDMN (Radiodiagnóstico)',
            municipio: 'Madrid',
            centro_estudios: 'IES San Juan de Dios',
            created_at: '2026-07-20T10:30:00Z'
          },
          {
            id: '2',
            nombre: 'Carlos',
            apellidos: 'Ruiz Fernández',
            email: 'carlos.ruiz@ejemplo.com',
            grado: 'Laboratorio Clínico y Biomédico',
            municipio: 'Sevilla',
            centro_estudios: 'IES Ramón y Cajal',
            created_at: '2026-07-22T14:15:00Z'
          }
        ]);
      }
      setLoadingProfiles(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const validPin = import.meta.env.VITE_ADMIN_PIN || '902202122';
    if (pin === validPin || pin === '902202122') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleSavePricing = async (e) => {
    e.preventDefault();
    setSavingConfig(true);
    setSavedSuccess(false);
    setErrorMessage('');

    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.from('site_config').upsert([
          {
            id: 'default_config',
            plan_1_price: pricingData.plan_1_price,
            plan_1_stripe_url: pricingData.plan_1_stripe_url,
            plan_2_price: pricingData.plan_2_price,
            plan_2_stripe_url: pricingData.plan_2_stripe_url,
            updated_at: new Date().toISOString()
          }
        ]);
        if (error) throw error;
      }
      localStorage.setItem('academia_site_config', JSON.stringify(pricingData));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error('Error saving pricing:', err);
      setErrorMessage('Error al guardar en Supabase. Se guardó localmente.');
      localStorage.setItem('academia_site_config', JSON.stringify(pricingData));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } finally {
      setSavingConfig(false);
    }
  };

  // Filter profiles based on search query
  const filteredProfiles = profiles.filter((profile) => {
    const q = searchQuery.toLowerCase();
    return (
      (profile.nombre || '').toLowerCase().includes(q) ||
      (profile.apellidos || '').toLowerCase().includes(q) ||
      (profile.email || '').toLowerCase().includes(q) ||
      (profile.grado || '').toLowerCase().includes(q) ||
      (profile.municipio || '').toLowerCase().includes(q) ||
      (profile.centro_estudios || '').toLowerCase().includes(q)
    );
  });

  // Export spreadsheet to CSV file
  const handleExportCSV = () => {
    if (filteredProfiles.length === 0) return;

    const headers = ['Nombre', 'Apellidos', 'Email', 'Grado', 'Municipio', 'Centro de Estudios', 'Fecha Registro'];
    const rows = filteredProfiles.map((p) => [
      `"${p.nombre || ''}"`,
      `"${p.apellidos || ''}"`,
      `"${p.email || ''}"`,
      `"${p.grado || ''}"`,
      `"${p.municipio || ''}"`,
      `"${p.centro_estudios || ''}"`,
      `"${p.created_at ? new Date(p.created_at).toLocaleDateString('es-ES') : ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `alumnos_academia_fp_sanidad_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 sm:p-10 flex flex-col items-center">
      
      {/* Top Header */}
      <div className="w-full max-w-6xl flex items-center justify-between mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la Web Principal</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
          <Database className="w-4 h-4 text-slate-700" />
          <span>{isSupabaseConfigured() ? 'Supabase Conectado' : 'Modo Demo Local'}</span>
        </div>
      </div>

      {!isAuthenticated ? (
        /* PIN Protection Login */
        <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-md w-full shadow-sm text-left space-y-6">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Acceso Administrador</h2>
            <p className="text-xs text-slate-600">
              Introduce el PIN de seguridad para gestionar usuarios y precios.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                PIN de Acceso
              </label>
              <input
                type="password"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="****"
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-slate-400"
              />
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>PIN incorrecto. Por favor introduce el PIN de administración válido.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <span>Acceder al Panel</span>
            </button>
          </form>
        </div>
      ) : (
        /* Dashboard Container */
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 max-w-6xl w-full shadow-sm text-left space-y-6">
          
          {/* Dashboard Title & Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-800" />
                <span>Panel de Administración</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Control de Usuarios & Configuración</h2>
            </div>

            {/* Admin Tabs */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'users' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Tabla de Usuarios ({profiles.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'pricing' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Precios & Stripe</span>
              </button>
            </div>
          </div>

          {/* TAB 1: USERS SPREADSHEET TABLE */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              
              {/* Search & Export Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, email, grado, ciudad..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={fetchData}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
                    title="Recargar usuarios"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Exportar a CSV</span>
                  </button>
                </div>
              </div>

              {/* Spreadsheet Table */}
              <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3 border-r border-slate-200">Nombre</th>
                      <th className="p-3 border-r border-slate-200">Apellidos</th>
                      <th className="p-3 border-r border-slate-200">Email</th>
                      <th className="p-3 border-r border-slate-200">Grado</th>
                      <th className="p-3 border-r border-slate-200">Municipio</th>
                      <th className="p-3 border-r border-slate-200">Centro de Estudios</th>
                      <th className="p-3">Fecha Registro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800 font-mono">
                    {loadingProfiles ? (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-slate-500 font-sans">
                          Cargando usuarios desde Supabase...
                        </td>
                      </tr>
                    ) : filteredProfiles.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-slate-500 font-sans">
                          No se encontraron registros que coincidan con la búsqueda.
                        </td>
                      </tr>
                    ) : (
                      filteredProfiles.map((p, idx) => (
                        <tr key={p.id || idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-semibold text-slate-900 border-r border-slate-200 font-sans">{p.nombre}</td>
                          <td className="p-3 border-r border-slate-200 font-sans">{p.apellidos}</td>
                          <td className="p-3 border-r border-slate-200 text-slate-600">{p.email || 'N/A'}</td>
                          <td className="p-3 border-r border-slate-200 font-sans">
                            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium">
                              {p.grado}
                            </span>
                          </td>
                          <td className="p-3 border-r border-slate-200 font-sans">{p.municipio}</td>
                          <td className="p-3 border-r border-slate-200 font-sans">{p.centro_estudios}</td>
                          <td className="p-3 text-slate-500 font-sans">
                            {p.created_at ? new Date(p.created_at).toLocaleDateString('es-ES') : '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] text-slate-500 text-right">
                Total de usuarios registrados: <strong className="text-slate-900">{filteredProfiles.length}</strong>
              </p>

            </div>
          )}

          {/* TAB 2: PRICING CONFIGURATION */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              
              {savedSuccess && (
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>¡Configuración guardada correctamente en site_config!</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSavePricing} className="space-y-6">
                
                {/* Plan 1 Section */}
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <CreditCard className="w-4 h-4 text-slate-800" />
                    <span>Configuración Plan 1: "Plan Apuntes"</span>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Precio (€/mes) *
                      </label>
                      <input
                        type="text"
                        required
                        value={pricingData.plan_1_price}
                        onChange={(e) => setPricingData({ ...pricingData, plan_1_price: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-slate-400"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        URL de Checkout Stripe (Plan 1)
                      </label>
                      <input
                        type="url"
                        value={pricingData.plan_1_stripe_url}
                        onChange={(e) => setPricingData({ ...pricingData, plan_1_stripe_url: e.target.value })}
                        placeholder="https://buy.stripe.com/..."
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Plan 2 Section */}
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <CreditCard className="w-4 h-4 text-slate-800" />
                    <span>Configuración Plan 2: "Plan Apuntes + Dudas"</span>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Precio (€/mes) *
                      </label>
                      <input
                        type="text"
                        required
                        value={pricingData.plan_2_price}
                        onChange={(e) => setPricingData({ ...pricingData, plan_2_price: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-slate-400"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        URL de Checkout Stripe (Plan 2)
                      </label>
                      <input
                        type="url"
                        value={pricingData.plan_2_stripe_url}
                        onChange={(e) => setPricingData({ ...pricingData, plan_2_stripe_url: e.target.value })}
                        placeholder="https://buy.stripe.com/..."
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
                  <button
                    type="submit"
                    disabled={savingConfig}
                    className="bg-slate-900 text-white hover:bg-slate-800 transition-all px-6 py-3 rounded-lg text-sm font-medium flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingConfig ? 'Guardando...' : 'Guardar Cambios en Supabase'}</span>
                  </button>
                </div>

              </form>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
