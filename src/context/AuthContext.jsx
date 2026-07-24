import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [assignedDegree, setAssignedDegree] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile details from Supabase 'profiles' table
  const fetchProfile = async (userId, userEmail = '') => {
    if (!userId) {
      setProfile(null);
      setRole(null);
      setAssignedDegree(null);
      return null;
    }

    const isTargetSuperadmin = userEmail.toLowerCase().trim() === 'gorkaobiangolaso@gmail.com';

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        let currentProfile = data;

        // Auto-assign superadmin role and assigned_degree = 'all' for gorkaobiangolaso@gmail.com if not already set
        if (isTargetSuperadmin && (!currentProfile || currentProfile.role !== 'superadmin')) {
          console.info('Auto-upgrading profile to superadmin for:', userEmail);
          
          const { data: upserted, error: upsertError } = await supabase
            .from('profiles')
            .upsert({
              id: userId,
              nombre: currentProfile?.nombre || 'Gorka',
              apellidos: currentProfile?.apellidos || 'Obiang Olaso',
              grado: currentProfile?.grado || 'all',
              assigned_degree: 'all',
              role: 'superadmin',
              municipio: currentProfile?.municipio || 'General',
              centro_estudios: currentProfile?.centro_estudios || 'Academia FP Sanidad'
            })
            .select('*')
            .single();

          if (!upsertError && upserted) {
            currentProfile = upserted;
          } else {
            if (upsertError) console.warn('Supabase upsert error:', upsertError);
            currentProfile = {
              ...(currentProfile || {}),
              id: userId,
              email: userEmail,
              role: 'superadmin',
              assigned_degree: 'all'
            };
          }
        }

        if (currentProfile) {
          setProfile(currentProfile);
          const userRole = isTargetSuperadmin ? 'superadmin' : (currentProfile.role || 'student');
          const degree = isTargetSuperadmin ? 'all' : (currentProfile.assigned_degree || currentProfile.grado || '');
          setRole(userRole);
          setAssignedDegree(degree);
          return { ...currentProfile, role: userRole, assigned_degree: degree };
        }
      } catch (err) {
        console.warn('Error fetching profile from Supabase:', err);
      }
    }

    // Fallback based on metadata or email conventions
    let fallbackRole = 'student';
    let fallbackDegree = '';

    if (isTargetSuperadmin || userEmail.toLowerCase().includes('superadmin') || userEmail.toLowerCase().includes('admin')) {
      fallbackRole = 'superadmin';
      fallbackDegree = 'all';
    } else if (userEmail.toLowerCase().includes('author') || userEmail.toLowerCase().includes('autor')) {
      fallbackRole = 'author';
      fallbackDegree = 'tsidmn';
    }

    const defaultProfile = {
      id: userId,
      email: userEmail,
      role: fallbackRole,
      assigned_degree: fallbackDegree
    };

    setProfile(defaultProfile);
    setRole(fallbackRole);
    setAssignedDegree(fallbackDegree);
    return defaultProfile;
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      if (isSupabaseConfigured()) {
        try {
          const { data: { session: activeSession } } = await supabase.auth.getSession();
          if (mounted) {
            setSession(activeSession);
            setUser(activeSession?.user ?? null);
            if (activeSession?.user) {
              await fetchProfile(activeSession.user.id, activeSession.user.email);
            }
          }
        } catch (err) {
          console.warn('Error fetching initial session:', err);
        }
      } else {
        // Local mock session restoration
        const mockStored = localStorage.getItem('academia_mock_session');
        if (mockStored) {
          try {
            const parsed = JSON.parse(mockStored);
            if (mounted) {
              setSession(parsed);
              setUser(parsed.user);
              setRole(parsed.user?.role || parsed.role || 'superadmin');
              setAssignedDegree(parsed.user?.assigned_degree || parsed.assigned_degree || 'all');
            }
          } catch (e) {
            console.error('Error parsing mock session:', e);
          }
        }
      }
      if (mounted) setLoading(false);
    };

    initAuth();

    // Listen for auth state changes from Supabase
    let authListener = null;
    if (isSupabaseConfigured()) {
      const { data } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
        if (!mounted) return;
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          await fetchProfile(newSession.user.id, newSession.user.email);
        } else {
          setProfile(null);
          setRole(null);
          setAssignedDegree(null);
        }
        setLoading(false);
      });
      authListener = data?.subscription;
    }

    return () => {
      mounted = false;
      if (authListener) authListener.unsubscribe();
    };
  }, []);

  // Login method connected to supabase.auth.signInWithPassword
  const login = async (email, password) => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        setUser(data.user);
        setSession(data.session);
        const userProf = await fetchProfile(data.user.id, data.user.email);
        return { data, profile: userProf };
      }
      return data;
    } else {
      // Fallback demo login when Supabase credentials are mock/not connected
      let mockRole = 'student';
      let mockDegree = 'tsidmn';

      if (email.toLowerCase().trim() === 'gorkaobiangolaso@gmail.com' || email.toLowerCase().includes('superadmin') || email.toLowerCase().includes('admin')) {
        mockRole = 'superadmin';
        mockDegree = 'all';
      } else if (email.toLowerCase().includes('author') || email.toLowerCase().includes('autor')) {
        mockRole = 'author';
        mockDegree = 'tsidmn';
      } else if (password === 'admin123' || password === '902202122') {
        mockRole = 'superadmin';
        mockDegree = 'all';
      }

      const mockUser = {
        id: `usr-${Date.now()}`,
        email,
        role: mockRole,
        assigned_degree: mockDegree
      };

      const mockSession = { user: mockUser, token: 'mock-jwt-token' };
      setSession(mockSession);
      setUser(mockUser);
      setRole(mockRole);
      setAssignedDegree(mockDegree);
      setProfile(mockUser);

      localStorage.setItem('academia_mock_session', JSON.stringify({ user: mockUser, role: mockRole, assigned_degree: mockDegree }));
      return { user: mockUser, session: mockSession, profile: mockUser };
    }
  };

  // Logout method connected to supabase.auth.signOut
  const logout = async () => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Sign out error:', err);
      }
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    setRole(null);
    setAssignedDegree(null);
    localStorage.removeItem('academia_mock_session');
  };

  const value = {
    user,
    session,
    profile,
    role,
    assignedDegree,
    loading,
    login,
    logout,
    fetchProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider');
  }
  return context;
}

export default AuthContext;
