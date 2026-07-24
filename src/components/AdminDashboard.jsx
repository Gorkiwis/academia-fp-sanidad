import React, { useState, useEffect } from 'react';
import { 
  Lock, ShieldCheck, Download, RefreshCw, Filter, 
  MessageSquare, CheckCircle2, Clock, Mail, GraduationCap, 
  Send, X, Sparkles, FileSpreadsheet, AlertCircle, LogOut,
  DollarSign, TrendingUp, Users, UserPlus, BookOpen, Upload, KeyRound
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import AdminUploadModal from './AdminUploadModal';

const AVAILABLE_DEGREES = [
  { id: 'tsidmn', name: 'TSIDMN - Radiodiagnóstico y Medicina Nuclear' },
  { id: 'radioterapia', name: 'Radioterapia y Dosimetría' },
  { id: 'laboratorio', name: 'Laboratorio Clínico y Biomédico' },
  { id: 'anatomia', name: 'Anatomía Patológica y Citodiagnóstico' },
  { id: 'documentacion', name: 'Documentación y Administración Sanitarias' }
];

export default function AdminDashboard({ onClose }) {
  const { user, role, assignedDegree, logout, loading: authLoading } = useAuth();
  
  const isSuperadmin = role === 'superadmin';
  const isAuthor = role === 'author';
  const hasAdminAccess = isSuperadmin || isAuthor;

  // Active tab state: superadmin gets 'leads' by default, author gets 'content' by default
  const [activeTab, setActiveTab] = useState('content');

  // Adjust active tab on role resolution
  useEffect(() => {
    if (isAuthor) {
      setActiveTab('content');
    } else if (isSuperadmin) {
      setActiveTab('leads');
    }
  }, [role, isAuthor, isSuperadmin]);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Topics / Content Data
  const [topics, setTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(false);

  // Leads Data
  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [leadsSearch, setLeadsSearch] = useState('');

  // Tickets Data
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [ticketFilter, setTicketFilter] = useState('todos');

  // Response Modal State
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const [responseSuccess, setResponseSuccess] = useState('');

  // Author Registration State (Superadmin only)
  const [authorEmail, setAuthorEmail] = useState('');
  const [authorPassword, setAuthorPassword] = useState('');
  const [authorDegree, setAuthorDegree] = useState('tsidmn');
  const [authorLoading, setAuthorLoading] = useState(false);
  const [authorSuccess, setAuthorSuccess] = useState('');
  const [authorError, setAuthorError] = useState('');
  const [authorsList, setAuthorsList] = useState([]);
  const [loadingAuthors, setLoadingAuthors] = useState(false);

  // Pricing / Site Config State (Superadmin only)
  const [pricingData, setPricingData] = useState({
    plan_1_price: '19',
    plan_1_stripe_url: 'https://buy.stripe.com/test_plan1',
    plan_2_price: '39',
    plan_2_stripe_url: 'https://buy.stripe.com/test_plan2'
  });
  const [savingPricing, setSavingPricing] = useState(false);
  const [pricingSuccess, setPricingSuccess] = useState(false);

  // Helper function to match degree strings
  const matchesDegree = (itemDegree, targetDegree) => {
    if (!targetDegree) return true;
    const it = (itemDegree || '').toLowerCase();
    const tg = (targetDegree || '').toLowerCase();
    if (it.includes(tg) || tg.includes(it)) return true;
    if (tg === 'tsidmn' && (it.includes('tsidmn') || it.includes('radio') || it.includes('imagen'))) return true;
    if (tg === 'radioterapia' && it.includes('radioterapia')) return true;
    if (tg === 'laboratorio' && it.includes('laboratorio')) return true;
    if (tg === 'anatomia' && (it.includes('anatomia') || it.includes('citodiagnóstico'))) return true;
    if (tg === 'documentacion' && it.includes('documentacion')) return true;
    return false;
  };

  // Fetch data on tab change or auth status
  useEffect(() => {
    if (hasAdminAccess) {
      if (activeTab === 'leads' && isSuperadmin) fetchLeads();
      if (activeTab === 'tickets') fetchTickets();
      if (activeTab === 'content') fetchTopics();
      if (activeTab === 'authors' && isSuperadmin) fetchAuthors();
      if (activeTab === 'finance' && isSuperadmin) fetchSiteConfig();
    }
  }, [hasAdminAccess, activeTab, isSuperadmin, role]);

  // Fetch Topics
  const fetchTopics = async () => {
    setLoadingTopics(true);
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('topics').select('*').order('created_at', { ascending: false });
        if (isAuthor && assignedDegree) {
          query = query.eq('degree_id', assignedDegree);
        }
        const { data, error } = await query;
        if (!error && data) {
          setTopics(data);
        } else {
          loadLocalTopics();
        }
      } catch (err) {
        console.warn('Error fetching topics:', err);
        loadLocalTopics();
      } finally {
        setLoadingTopics(false);
      }
    } else {
      loadLocalTopics();
      setLoadingTopics(false);
    }
  };

  const loadLocalTopics = () => {
    const stored = JSON.parse(localStorage.getItem('academia_topics') || '[]');
    let filtered = stored;
    if (isAuthor && assignedDegree) {
      filtered = stored.filter((t) => matchesDegree(t.degree_id, assignedDegree));
    }
    if (filtered.length > 0) {
      setTopics(filtered);
    } else {
      // Mock topics
      const mockList = [
        {
          id: 'top-1',
          degree_id: 'tsidmn',
          title: 'Tema 1: Física de las Radiaciones y Rayos X',
          description: 'Introducción a la radiación ionizante, tubos de rayos X y espectros.',
          unlock_delay_days: 0,
          created_at: '2026-07-20T10:00:00Z'
        },
        {
          id: 'top-2',
          degree_id: 'tsidmn',
          title: 'Tema 2: Dosimetría y Protección Radiológica',
          description: 'Límites de dosis, magnitudes radiológicas (Gray, Sievert) y blindajes.',
          unlock_delay_days: 7,
          created_at: '2026-07-22T15:30:00Z'
        }
      ];
      setTopics(isAuthor ? mockList.filter(t => matchesDegree(t.degree_id, assignedDegree)) : mockList);
    }
  };

  // Fetch Leads
  const fetchLeads = async () => {
    setLoadingLeads(true);
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setLeads(data);
        } else {
          loadLocalLeads();
        }
      } catch (err) {
        console.warn('Error fetching leads:', err);
        loadLocalLeads();
      } finally {
        setLoadingLeads(false);
      }
    } else {
      loadLocalLeads();
      setLoadingLeads(false);
    }
  };

  const loadLocalLeads = () => {
    const stored = JSON.parse(localStorage.getItem('academia_leads') || '[]');
    if (stored.length > 0) {
      setLeads(stored.map((item, idx) => ({
        id: item.id || `local-${idx}`,
        full_name: item.fullName || item.full_name || 'Alumno Interesado',
        email: item.email || 'N/A',
        specialty: item.specialty || 'General',
        created_at: item.created_at || item.timestamp || new Date().toISOString()
      })));
    } else {
      setLeads([
        {
          id: 'lead-1',
          full_name: 'María Carmen Fernández',
          email: 'mcarmen.fer@ejemplo.com',
          specialty: 'TSIDMN (Imagen para el Diagnóstico)',
          created_at: '2026-07-23T18:30:00Z'
        },
        {
          id: 'lead-2',
          full_name: 'David Ortiz Ruiz',
          email: 'd.ortiz@ejemplo.com',
          specialty: 'Acceso a Universidad (Subir Nota)',
          created_at: '2026-07-23T14:10:00Z'
        }
      ]);
    }
  };

  // Fetch Tickets
  const fetchTickets = async () => {
    setLoadingTickets(true);
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('tickets')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          if (isAuthor && assignedDegree) {
            setTickets(data.filter((t) => matchesDegree(t.grado, assignedDegree)));
          } else {
            setTickets(data);
          }
        } else {
          loadLocalTickets();
        }
      } catch (err) {
        console.warn('Error fetching tickets:', err);
        loadLocalTickets();
      } finally {
        setLoadingTickets(false);
      }
    } else {
      loadLocalTickets();
      setLoadingTickets(false);
    }
  };

  const loadLocalTickets = () => {
    const stored = JSON.parse(localStorage.getItem('academia_tickets') || '[]');
    const rawList = stored.length > 0 ? stored.map((item, idx) => ({
      id: item.id || `local-tk-${idx}`,
      email: item.email || item.studentEmail || 'alumno@ejemplo.com',
      grado: item.grado || item.moduleName || 'TSIDMN',
      asunto: item.asunto || item.ticketType || 'Duda General',
      mensaje: item.mensaje || item.question || 'Sin detalle',
      estado: item.estado || item.status || 'pendiente',
      respuesta: item.respuesta || null,
      created_at: item.created_at || item.timestamp || new Date().toISOString()
    })) : [
      {
        id: 'tk-101',
        email: 'alumno.ejemplo@fp.es',
        grado: 'TSIDMN - Radiobiología',
        asunto: 'Duda Ejercicio Dosis Absorbida (Gray vs Sievert)',
        mensaje: 'No entiendo la diferencia en el cálculo cuando aplicamos el factor W_r para radiación alfa.',
        estado: 'pendiente',
        respuesta: null,
        created_at: '2026-07-23T19:45:00Z'
      },
      {
        id: 'tk-102',
        email: 'lucia.sanchez@fp.es',
        grado: 'Resonancia Magnética (RM)',
        asunto: 'Secuencias T1 vs T2 en Patología Cerebral',
        mensaje: '¿Por qué el LCR se ve hiperintenso en T2 pero hipointenso en T1?',
        estado: 'resuelto',
        respuesta: 'En T2 el tiempo de relajación transversal del agua libre es mayor.',
        created_at: '2026-07-22T11:20:00Z'
      }
    ];

    if (isAuthor && assignedDegree) {
      setTickets(rawList.filter((t) => matchesDegree(t.grado, assignedDegree)));
    } else {
      setTickets(rawList);
    }
  };

  // Fetch Authors (Superadmin)
  const fetchAuthors = async () => {
    setLoadingAuthors(true);
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'author')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setAuthorsList(data);
        } else {
          loadLocalAuthors();
        }
      } catch (err) {
        console.warn('Error fetching authors:', err);
        loadLocalAuthors();
      } finally {
        setLoadingAuthors(false);
      }
    } else {
      loadLocalAuthors();
      setLoadingAuthors(false);
    }
  };

  const loadLocalAuthors = () => {
    const stored = JSON.parse(localStorage.getItem('academia_authors') || '[]');
    if (stored.length > 0) {
      setAuthorsList(stored);
    } else {
      setAuthorsList([
        {
          id: 'auth-1',
          email: 'autor.tsidmn@academiafpsanidad.es',
          role: 'author',
          assigned_degree: 'tsidmn',
          created_at: '2026-07-15T09:00:00Z'
        }
      ]);
    }
  };

  // Fetch Site Config (Superadmin)
  const fetchSiteConfig = async () => {
    if (isSupabaseConfigured()) {
      try {
        const { data } = await supabase
          .from('site_config')
          .select('*')
          .eq('id', 'default_config')
          .single();

        if (data) {
          setPricingData({
            plan_1_price: data.plan_1_price || '19',
            plan_1_stripe_url: data.plan_1_stripe_url || '',
            plan_2_price: data.plan_2_price || '39',
            plan_2_stripe_url: data.plan_2_stripe_url || ''
          });
        }
      } catch (err) {
        console.warn('Error fetching site_config:', err);
      }
    }
  };

  // Author Registration Handler (Superadmin)
  const handleRegisterAuthor = async (e) => {
    e.preventDefault();
    setAuthorSuccess('');
    setAuthorError('');
    setAuthorLoading(true);

    try {
      let newUserId = `author-${Date.now()}`;

      if (isSupabaseConfigured()) {
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email: authorEmail.trim(),
          password: authorPassword.trim(),
          options: {
            data: {
              role: 'author',
              assigned_degree: authorDegree
            }
          }
        });

        if (authErr) throw authErr;
        if (authData?.user) {
          newUserId = authData.user.id;
        }

        // Insert / Update profiles table
        const { error: profileErr } = await supabase.from('profiles').upsert([
          {
            id: newUserId,
            nombre: authorEmail.split('@')[0],
            apellidos: 'Autor / Colaborador',
            grado: authorDegree,
            assigned_degree: authorDegree,
            role: 'author',
            municipio: 'General',
            centro_estudios: 'Academia FP Sanidad'
          }
        ]);

        if (profileErr) console.warn('Profile upsert warning:', profileErr);
      }

      const newAuthorObj = {
        id: newUserId,
        email: authorEmail.trim(),
        role: 'author',
        assigned_degree: authorDegree,
        created_at: new Date().toISOString()
      };

      setAuthorsList((prev) => [newAuthorObj, ...prev]);

      const stored = JSON.parse(localStorage.getItem('academia_authors') || '[]');
      localStorage.setItem('academia_authors', JSON.stringify([newAuthorObj, ...stored]));

      setAuthorSuccess(`¡Autor registrado con éxito para el grado "${authorDegree}"!`);
      setAuthorEmail('');
      setAuthorPassword('');
      setAuthorDegree('tsidmn');
    } catch (err) {
      console.error('Error registrando autor:', err);
      setAuthorError(err.message || 'Error al registrar el autor en Supabase.');
    } finally {
      setAuthorLoading(false);
    }
  };

  // Save Pricing Handler (Superadmin)
  const handleSavePricing = async (e) => {
    e.preventDefault();
    setSavingPricing(true);
    setPricingSuccess(false);

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
      setPricingSuccess(true);
      setTimeout(() => setPricingSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving pricing:', err);
      alert('Error guardando en Supabase. Se guardó localmente.');
    } finally {
      setSavingPricing(false);
    }
  };

  // Submit Answer to Ticket
  const handleResolveTicket = async (e) => {
    e.preventDefault();
    if (!selectedTicket || !responseText.trim()) return;

    setSubmittingResponse(true);
    setResponseSuccess('');

    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('tickets')
          .update({
            respuesta: responseText.trim(),
            estado: 'resuelto'
          })
          .eq('id', selectedTicket.id);

        if (error) throw error;
      }

      setTickets((prev) =>
        prev.map((tk) =>
          tk.id === selectedTicket.id
            ? { ...tk, respuesta: responseText.trim(), estado: 'resuelto' }
            : tk
        )
      );

      const localTickets = JSON.parse(localStorage.getItem('academia_tickets') || '[]');
      const updatedLocal = localTickets.map((t) => 
        (t.id === selectedTicket.id || t.email === selectedTicket.email) 
          ? { ...t, respuesta: responseText.trim(), estado: 'resuelto' } 
          : t
      );
      localStorage.setItem('academia_tickets', JSON.stringify(updatedLocal));

      setResponseSuccess('¡Respuesta guardada y ticket marcado como RESUELTO!');
      setTimeout(() => {
        setResponseSuccess('');
        setSelectedTicket(null);
        setResponseText('');
      }, 1500);
    } catch (err) {
      console.error('Error resolving ticket:', err);
      alert('Error actualizando ticket en Supabase. Se guardó localmente.');
      setTickets((prev) =>
        prev.map((tk) =>
          tk.id === selectedTicket.id
            ? { ...tk, respuesta: responseText.trim(), estado: 'resuelto' }
            : tk
        )
      );
      setSelectedTicket(null);
      setResponseText('');
    } finally {
      setSubmittingResponse(false);
    }
  };

  // Export Leads to CSV
  const exportLeadsToCSV = () => {
    if (leads.length === 0) return;

    const headers = ['Nombre Completo', 'Email', 'Especialidad / Grado', 'Fecha de Registro'];
    const rows = leads.map((l) => [
      `"${l.full_name || 'Alumno'}"`,
      `"${l.email || ''}"`,
      `"${l.specialty || ''}"`,
      `"${l.created_at ? new Date(l.created_at).toLocaleString('es-ES') : ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_tema_cero_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Tickets
  const filteredTickets = tickets.filter((tk) => {
    if (ticketFilter === 'todos') return true;
    return (tk.estado || 'pendiente').toLowerCase() === ticketFilter;
  });

  // Filtered Leads Search
  const filteredLeads = leads.filter((lead) => {
    const q = leadsSearch.toLowerCase();
    return (
      (lead.full_name || '').toLowerCase().includes(q) ||
      (lead.email || '').toLowerCase().includes(q) ||
      (lead.specialty || '').toLowerCase().includes(q)
    );
  });

  // Render Login Modal if unauthenticated
  if (!hasAdminAccess) {
    return <LoginModal isOpen={true} onClose={onClose} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-8 flex flex-col items-center animate-fadeIn">
      
      {/* Top Header Bar */}
      <div className="w-full max-w-6xl flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Panel de Administración
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isSuperadmin 
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' 
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {isSuperadmin ? 'Superadmin' : `Autor (${assignedDegree || 'Asignado'})`}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Academia FP Sanidad • {user?.email || 'Usuario Autenticado'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={logout}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors shadow-sm"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Cerrar Sesión</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* DASHBOARD MAIN CONTENT */}
      <div className="w-full max-w-6xl space-y-6 text-left">
        
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/80 p-2 rounded-2xl border border-slate-700/80">
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            
            {/* Contenidos Tab (Superadmin & Author) */}
            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'content'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Gestión de Contenidos</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900/60 text-slate-300 font-mono">
                {topics.length}
              </span>
            </button>

            {/* Tickets Tab (Superadmin & Author) */}
            <button
              onClick={() => setActiveTab('tickets')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'tickets'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Tickets de Soporte</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900/60 text-slate-300 font-mono">
                {tickets.length}
              </span>
            </button>

            {/* SUPERADMIN EXCLUSIVE TABS */}
            {isSuperadmin && (
              <>
                <button
                  onClick={() => setActiveTab('leads')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                    activeTab === 'leads'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Leads (Tema Cero)</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900/60 text-slate-300 font-mono">
                    {leads.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('finance')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                    activeTab === 'finance'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Métricas & Precios</span>
                </button>

                <button
                  onClick={() => setActiveTab('authors')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                    activeTab === 'authors'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <UserPlus className="w-4 h-4 text-purple-400" />
                  <span>Gestión de Autores</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900/60 text-slate-300 font-mono">
                    {authorsList.length}
                  </span>
                </button>
              </>
            )}

          </div>

          <div className="text-xs text-slate-400 px-3 font-mono flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{isSupabaseConfigured() ? 'Supabase Conectado' : 'Modo Demo Local'}</span>
          </div>
        </div>

        {/* TAB 1: GESTIÓN DE CONTENIDOS */}
        {activeTab === 'content' && (
          <div className="bg-slate-800/60 rounded-2xl border border-slate-700/80 p-6 space-y-5 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <span>Gestión de Temarios & Publicación PDF</span>
                </h3>
                <p className="text-xs text-slate-400">
                  {isAuthor 
                    ? `Publicación de módulos restringida a tu grado asignado (${assignedDegree}).`
                    : 'Administra y sube contenidos PDF para todos los grados FP Sanidad.'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchTopics}
                  className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                  title="Recargar temarios"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Subir Nuevo Tema PDF</span>
                </button>
              </div>
            </div>

            {/* List of Topics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loadingTopics ? (
                <div className="col-span-full p-8 text-center text-slate-400 bg-slate-900/60 rounded-xl border border-slate-700">
                  Cargando temarios desde Supabase...
                </div>
              ) : topics.length === 0 ? (
                <div className="col-span-full p-8 text-center text-slate-400 bg-slate-900/60 rounded-xl border border-slate-700">
                  No hay temarios subidos para este grado.
                </div>
              ) : (
                topics.map((top) => (
                  <div key={top.id} className="bg-slate-900/90 rounded-xl border border-slate-700 p-4 space-y-2 shadow-md">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono uppercase">
                        Grado: {top.degree_id}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {top.created_at ? new Date(top.created_at).toLocaleDateString('es-ES') : ''}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{top.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{top.description || 'Sin descripción.'}</p>
                    <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
                      <span>Desbloqueo: {top.unlock_delay_days || 0} días</span>
                      <span className="font-mono text-indigo-400 truncate max-w-[180px]">{top.file_path}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: TICKETS DE SOPORTE */}
        {activeTab === 'tickets' && (
          <div className="bg-slate-800/60 rounded-2xl border border-slate-700/80 p-6 space-y-5 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                  <span>Gestión de Tickets de Soporte</span>
                </h3>
                <p className="text-xs text-slate-400">
                  {isAuthor 
                    ? `Consultas de alumnos filtradas para tu grado asignado (${assignedDegree}).`
                    : 'Preguntas teóricas y resolución de dudas de alumnos de todos los grados.'}
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-700">
                <span className="text-[11px] text-slate-400 px-2 font-medium flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Estado:
                </span>
                {['todos', 'pendiente', 'resuelto'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setTicketFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      ticketFilter === st
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
                <button
                  onClick={fetchTickets}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors ml-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tickets List */}
            <div className="space-y-4">
              {loadingTickets ? (
                <div className="p-8 text-center text-slate-400 bg-slate-900/60 rounded-xl border border-slate-700">
                  Cargando tickets de soporte desde Supabase...
                </div>
              ) : filteredTickets.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-900/60 rounded-xl border border-slate-700">
                  No hay tickets registrados {isAuthor ? `para el grado ${assignedDegree}` : ''}.
                </div>
              ) : (
                filteredTickets.map((tk) => (
                  <div
                    key={tk.id}
                    className="bg-slate-900/90 rounded-xl border border-slate-700 p-5 space-y-4 shadow-md text-left transition-all hover:border-slate-600"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            (tk.estado || 'pendiente') === 'resuelto'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {(tk.estado || 'pendiente') === 'resuelto' ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <Clock className="w-3.5 h-3.5" />
                          )}
                          <span className="capitalize">{tk.estado || 'pendiente'}</span>
                        </span>

                        <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                          {tk.grado || 'Modulo FP'}
                        </span>
                      </div>

                      <div className="text-xs text-slate-400 font-mono">
                        {tk.created_at ? new Date(tk.created_at).toLocaleString('es-ES') : ''}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-indigo-300 font-mono">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{tk.email}</span>
                      </div>
                      <h4 className="text-base font-bold text-white">
                        {tk.asunto || 'Consulta de Alumno'}
                      </h4>
                      <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/80 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {tk.mensaje}
                      </div>
                    </div>

                    {tk.respuesta && (
                      <div className="bg-emerald-950/40 border border-emerald-800/60 p-4 rounded-xl space-y-1.5 text-xs text-emerald-200">
                        <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" /> Respuesta del Tutor:
                        </span>
                        <p className="whitespace-pre-wrap">{tk.respuesta}</p>
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          setSelectedTicket(tk);
                          setResponseText(tk.respuesta || '');
                        }}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{tk.respuesta ? 'Editar Respuesta' : 'Responder y Resolver'}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SUPERADMIN ONLY TAB 3: LEADS */}
        {isSuperadmin && activeTab === 'leads' && (
          <div className="bg-slate-800/60 rounded-2xl border border-slate-700/80 p-6 space-y-5 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                  <span>Captura de Alumnos Interesados (Leads)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Estudiantes que solicitaron el Tema 0 y la Guía de Nota de Corte FP Sanidad.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Buscar por email o nombre..."
                  value={leadsSearch}
                  onChange={(e) => setLeadsSearch(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-full sm:w-64"
                />
                <button
                  onClick={fetchLeads}
                  className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={exportLeadsToCSV}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar CSV</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900/80">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-800/90 text-slate-300 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-700">
                  <tr>
                    <th className="p-3.5 border-r border-slate-700/80">Nombre Completo</th>
                    <th className="p-3.5 border-r border-slate-700/80">Correo Electrónico</th>
                    <th className="p-3.5 border-r border-slate-700/80">Especialidad / Objetivo</th>
                    <th className="p-3.5">Fecha Registro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {loadingLeads ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-400">
                        Cargando registros desde Supabase...
                      </td>
                    </tr>
                  ) : filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-400">
                        No se encontraron registros de leads.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-800/60 transition-colors">
                        <td className="p-3.5 font-medium text-white border-r border-slate-800">
                          {lead.full_name || 'Alumno Interesado'}
                        </td>
                        <td className="p-3.5 border-r border-slate-800 font-mono text-indigo-300">
                          <span className="inline-flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {lead.email}
                          </span>
                        </td>
                        <td className="p-3.5 border-r border-slate-800">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-[11px]">
                            {lead.specialty || 'General'}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                          {lead.created_at ? new Date(lead.created_at).toLocaleString('es-ES') : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUPERADMIN ONLY TAB 4: MÉTRICAS FINANCIERAS & PRECIOS */}
        {isSuperadmin && activeTab === 'finance' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-1">
                <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> Ingresos Brutos Mensuales
                </span>
                <p className="text-2xl font-extrabold text-white">4.890 €</p>
                <span className="text-[11px] text-emerald-400 font-mono">+18.4% vs mes anterior</span>
              </div>
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-1">
                <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                  <Users className="w-4 h-4 text-indigo-400" /> Alumnos Activos PRO
                </span>
                <p className="text-2xl font-extrabold text-white">142 Alumnos</p>
                <span className="text-[11px] text-indigo-300 font-mono">Plan Estándar (19€) y PRO MAX (39€)</span>
              </div>
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-1">
                <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                  <TrendingUp className="w-4 h-4 text-purple-400" /> Comisiones Autores (30%)
                </span>
                <p className="text-2xl font-extrabold text-white">1.467 €</p>
                <span className="text-[11px] text-purple-300 font-mono">Repartidos entre autores asignados</span>
              </div>
            </div>

            {/* Pricing Settings Form */}
            <div className="bg-slate-800/60 rounded-2xl border border-slate-700/80 p-6 space-y-5 backdrop-blur-sm">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span>Configuración de Precios & Enlaces Stripe</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Modifica los precios y pasarelas de pago que ven los estudiantes.
                </p>
              </div>

              <form onSubmit={handleSavePricing} className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Precio Plan Estándar (€/mes)
                    </label>
                    <input
                      type="text"
                      value={pricingData.plan_1_price}
                      onChange={(e) => setPricingData({ ...pricingData, plan_1_price: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      URL Checkout Stripe Plan Estándar
                    </label>
                    <input
                      type="text"
                      value={pricingData.plan_1_stripe_url}
                      onChange={(e) => setPricingData({ ...pricingData, plan_1_stripe_url: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Precio Plan PRO MAX (€/mes)
                    </label>
                    <input
                      type="text"
                      value={pricingData.plan_2_price}
                      onChange={(e) => setPricingData({ ...pricingData, plan_2_price: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      URL Checkout Stripe Plan PRO MAX
                    </label>
                    <input
                      type="text"
                      value={pricingData.plan_2_stripe_url}
                      onChange={(e) => setPricingData({ ...pricingData, plan_2_stripe_url: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                {pricingSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>¡Configuración de Stripe actualizada correctamente!</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={savingPricing}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <span>{savingPricing ? 'Guardando...' : 'Guardar Precios'}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* SUPERADMIN ONLY TAB 5: GESTIÓN DE AUTORES */}
        {isSuperadmin && activeTab === 'authors' && (
          <div className="space-y-6">
            
            {/* Form to Register New Author */}
            <div className="bg-slate-800/60 rounded-2xl border border-slate-700/80 p-6 space-y-5 backdrop-blur-sm max-w-2xl">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-purple-400" />
                  <span>Registrar Nuevo Autor / Colaborador</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Crea una cuenta para un tutor especializado asignándole un grado específico de FP Sanidad.
                </p>
              </div>

              <form onSubmit={handleRegisterAuthor} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Correo Electrónico del Autor *
                  </label>
                  <input
                    type="email"
                    required
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    placeholder="autor.radioterapia@academiafpsanidad.es"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Contraseña Inicial *
                  </label>
                  <input
                    type="password"
                    required
                    value={authorPassword}
                    onChange={(e) => setAuthorPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Grado FP Sanidad Asignado *
                  </label>
                  <select
                    value={authorDegree}
                    onChange={(e) => setAuthorDegree(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500 font-medium"
                  >
                    {AVAILABLE_DEGREES.map((deg) => (
                      <option key={deg.id} value={deg.id}>
                        {deg.name}
                      </option>
                    ))}
                  </select>
                </div>

                {authorError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{authorError}</span>
                  </div>
                )}

                {authorSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{authorSuccess}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authorLoading}
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all disabled:opacity-50"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{authorLoading ? 'Creando cuenta...' : 'Dar de Alta Autor'}</span>
                </button>
              </form>
            </div>

            {/* List of Authors */}
            <div className="bg-slate-800/60 rounded-2xl border border-slate-700/80 p-6 space-y-4 backdrop-blur-sm">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Autores Registrados en el Sistema</span>
              </h3>

              <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900/80">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-800/90 text-slate-300 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-700">
                    <tr>
                      <th className="p-3.5 border-r border-slate-700">Email</th>
                      <th className="p-3.5 border-r border-slate-700">Rol</th>
                      <th className="p-3.5 border-r border-slate-700">Grado Asignado</th>
                      <th className="p-3.5">Fecha de Alta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {loadingAuthors ? (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-slate-400">
                          Cargando lista de autores...
                        </td>
                      </tr>
                    ) : authorsList.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-slate-400">
                          No hay autores registrados.
                        </td>
                      </tr>
                    ) : (
                      authorsList.map((authItem) => (
                        <tr key={authItem.id} className="hover:bg-slate-800/60 transition-colors">
                          <td className="p-3.5 font-medium text-white border-r border-slate-800 font-mono">
                            {authItem.email}
                          </td>
                          <td className="p-3.5 border-r border-slate-800">
                            <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-bold uppercase">
                              {authItem.role || 'author'}
                            </span>
                          </td>
                          <td className="p-3.5 border-r border-slate-800">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-indigo-300 font-mono text-[11px]">
                              {authItem.assigned_degree || authItem.grado || 'tsidmn'}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                            {authItem.created_at ? new Date(authItem.created_at).toLocaleDateString('es-ES') : '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* RESPONSE MODAL FOR TICKETS */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 rounded-2xl max-w-xl w-full p-6 sm:p-8 border border-slate-700 shadow-2xl relative text-left text-white space-y-6">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 pr-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Responder a {selectedTicket.email}</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {selectedTicket.asunto}
              </h3>
              <p className="text-xs text-slate-400">
                Módulo: {selectedTicket.grado}
              </p>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 text-xs text-slate-300 max-h-36 overflow-y-auto">
              <strong className="block text-slate-400 mb-1">Consulta original:</strong>
              {selectedTicket.mensaje}
            </div>

            <form onSubmit={handleResolveTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Escribe la Explicación / Respuesta para el Alumno *
                </label>
                <textarea
                  required
                  rows={5}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Detalla los pasos de resolución o la explicación teórica..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {responseSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{responseSuccess}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submittingResponse}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{submittingResponse ? 'Guardando...' : 'Marcar como Resuelto'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* UPLOAD MODAL */}
      <AdminUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        userRole={role}
        assignedDegree={assignedDegree}
        onSuccess={fetchTopics}
      />

    </div>
  );
}
