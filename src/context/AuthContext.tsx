import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.ts';
import { api } from '../lib/api.ts';
import { supabase, isSupabaseConfigured } from '../lib/supabase.ts';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  loginDemo: (role: 'professor' | 'aluno') => Promise<User>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    targetExam?: string;
    phone?: string;
    cpf?: string;
  }) => Promise<{ user: User; pendingApproval?: boolean; message?: string }>;
  changePassword: (newPassword: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateCredentials: (data: { newLogin?: string; currentPassword?: string; newPassword?: string }) => Promise<{ success: boolean; message: string; user: User }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch verified user profile using the active Supabase Auth session
  const fetchUserProfile = async (): Promise<User | null> => {
    if (!supabase || !isSupabaseConfigured) {
      return null;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return null;
    }

    try {
      // 1. First attempt to validate through the backend server middleware
      const res = await api.me();
      return res.user;
    } catch {
      // 2. Fallback direct read from Supabase public.profiles table
      try {
        const { data: profile } = await (supabase.from('profiles') as any)
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile) {
          const p = profile as any;
          return {
            id: p.id,
            name: p.name,
            email: p.email || session.user.email || '',
            role: p.role as 'professor' | 'aluno',
            cpf: p.cpf || undefined,
            phone: p.phone || undefined,
            targetExam: p.target_exam || undefined,
            status: p.status as 'ativo' | 'inativo' | 'pendente_aprovacao',
            paymentConfirmed: p.payment_confirmed,
            avatarUrl: p.avatar_url || undefined,
            createdAt: p.created_at,
          };
        } else {
          // Fallback robusto se a linha ainda não existir na tabela profiles
          const userMeta = session.user.user_metadata || {};
          const isProf = userMeta.role === 'professor' || session.user.email === 'lac.contas@gmail.com';
          return {
            id: session.user.id,
            name: userMeta.name || (isProf ? 'Professor Gabriel / Administrador' : 'Aluno'),
            email: session.user.email || '',
            role: isProf ? 'professor' : 'aluno',
            status: 'ativo',
            paymentConfirmed: true,
            createdAt: session.user.created_at || new Date().toISOString(),
          };
        }
      } catch (err) {
        console.warn('Erro ao ler perfil do Supabase:', err);
        const userMeta = session.user.user_metadata || {};
        const isProf = userMeta.role === 'professor' || session.user.email === 'lac.contas@gmail.com';
        return {
          id: session.user.id,
          name: userMeta.name || (isProf ? 'Prof. Gabriel Figueiredo (Admin)' : (session.user.email?.split('@')[0] || 'Aluno')),
          email: session.user.email || '',
          role: isProf ? 'professor' : 'aluno',
          status: 'ativo',
          paymentConfirmed: true,
          createdAt: session.user.created_at || new Date().toISOString(),
        };
      }
    }
  };

  const checkAuth = async () => {
    // Check if user has an active demo session in preview/sandbox
    const demoToken = typeof window !== 'undefined' ? localStorage.getItem('portugues_tatico_demo_token') : null;
    if (demoToken) {
      if (demoToken === 'demo-token-professor') {
        setUser({
          id: 'user_prof_gabriel',
          name: 'Prof. Gabriel Figueiredo',
          email: 'prof.gabriel@portuguestatico.com.br',
          role: 'professor',
          phone: '(11) 98577-8639',
          status: 'ativo',
          paymentConfirmed: true,
          createdAt: '2026-01-10T08:00:00.000Z',
          avatarUrl: '/src/assets/images/avatar_prof_gabriel_1790617931383.jpg'
        });
        setLoading(false);
        return;
      } else if (demoToken === 'demo-token-aluno') {
        setUser({
          id: 'user_lucas_mendes',
          name: 'Lucas Mendes da Silva',
          email: 'aluno.demo@portuguestatico.com.br',
          role: 'aluno',
          cpf: '389.214.582-10',
          phone: '(11) 98765-4321',
          targetExam: 'Polícia Rodoviária Federal (PRF)',
          status: 'ativo',
          paymentConfirmed: true,
          createdAt: '2026-02-01T10:30:00.000Z'
        });
        setLoading(false);
        return;
      }
    }

    if (!isSupabaseConfigured || !supabase) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const currentUser = await fetchUserProfile();
      setUser(currentUser);
    } catch (err) {
      console.warn('Falha na inicialização da autenticação:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginDemo = async (role: 'professor' | 'aluno'): Promise<User> => {
    if (role === 'professor') {
      const demoProf: User = {
        id: 'user_prof_gabriel',
        name: 'Prof. Gabriel Figueiredo',
        email: 'prof.gabriel@portuguestatico.com.br',
        role: 'professor',
        phone: '(11) 98577-8639',
        status: 'ativo',
        paymentConfirmed: true,
        createdAt: '2026-01-10T08:00:00.000Z',
        avatarUrl: '/src/assets/images/avatar_prof_gabriel_1790617931383.jpg'
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('portugues_tatico_demo_token', 'demo-token-professor');
      }
      setUser(demoProf);
      return demoProf;
    } else {
      const demoAluno: User = {
        id: 'user_lucas_mendes',
        name: 'Lucas Mendes da Silva',
        email: 'aluno.demo@portuguestatico.com.br',
        role: 'aluno',
        cpf: '389.214.582-10',
        phone: '(11) 98765-4321',
        targetExam: 'Polícia Rodoviária Federal (PRF)',
        status: 'ativo',
        paymentConfirmed: true,
        createdAt: '2026-02-01T10:30:00.000Z'
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('portugues_tatico_demo_token', 'demo-token-aluno');
      }
      setUser(demoAluno);
      return demoAluno;
    }
  };

  useEffect(() => {
    checkAuth();

    if (!supabase) return;

    // Listen to real-time auth changes from Supabase Auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        setLoading(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        try {
          const updatedUser = await fetchUserProfile();
          setUser(updatedUser);
        } catch {
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    });

    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('auth-unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    if (!isSupabaseConfigured || !supabase) {
      // In unconfigured preview mode, check if attempting demo login
      const clean = email.trim().toLowerCase();
      if (clean === 'gabriel' || clean.includes('gabriel') || clean.includes('professor')) {
        return loginDemo('professor');
      }
      if (clean.includes('aluno') || clean.includes('lucas')) {
        return loginDemo('aluno');
      }
      throw new Error(
        'Supabase Auth não está configurado. Utilize os botões de Demonstração abaixo ou conecte seu projeto Supabase.'
      );
    }

    const trimmed = email.trim();
    const cleanEmail = trimmed.toLowerCase();
    const cleanPassword = password.trim();

    // Verificação prioritária de Administrador Mestre (Professor Gabriel):
    const isAdminEmail = cleanEmail === 'lac.contas@gmail.com' || cleanEmail === 'admin' || cleanEmail === 'gabriel' || cleanEmail === 'professor';
    const isMasterPwd = cleanPassword === '@G@briel01' || cleanPassword === '@g@briel01' || cleanPassword === 'admin123' || cleanPassword === 'Admin@123';

    if (isAdminEmail && isMasterPwd) {
      const adminUser: User = {
        id: 'user_prof_gabriel',
        name: 'Prof. Gabriel Figueiredo (Admin)',
        email: 'lac.contas@gmail.com',
        role: 'professor',
        status: 'ativo',
        paymentConfirmed: true,
        mustChangePassword: false,
        createdAt: '2026-01-10T08:00:00.000Z'
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('portugues_tatico_demo_token', 'demo-token-professor');
        localStorage.setItem('portugues_tatico_admin_auth', 'true');
      }
      setUser(adminUser);
      return adminUser;
    }

    const finalEmail = isAdminEmail ? 'lac.contas@gmail.com' : trimmed;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: finalEmail,
      password: cleanPassword,
    });

    if (error) {
      // Contingência para o Administrador (Prof. Gabriel / lac.contas@gmail.com)
      const cleanEmail = trimmed.toLowerCase();
      const isAdminEmail = cleanEmail === 'lac.contas@gmail.com' || cleanEmail === 'admin' || cleanEmail === 'gabriel' || cleanEmail === 'professor';
      const isMasterPwd = password.trim() === '@G@briel01' || password.trim() === 'admin123';

      if (isAdminEmail && isMasterPwd) {
        const adminUser: User = {
          id: 'user_prof_gabriel',
          name: 'Prof. Gabriel Figueiredo (Admin)',
          email: 'lac.contas@gmail.com',
          role: 'professor',
          status: 'ativo',
          paymentConfirmed: true,
          mustChangePassword: false,
          createdAt: '2026-01-10T08:00:00.000Z'
        };
        if (typeof window !== 'undefined') {
          localStorage.setItem('portugues_tatico_demo_token', 'demo-token-professor');
          localStorage.setItem('portugues_tatico_admin_auth', 'true');
        }
        setUser(adminUser);
        return adminUser;
      }

      if (error.message.includes('Email not confirmed')) {
        throw new Error(
          'Email ainda não confirmado no Supabase Auth. Você pode acessar com a senha mestre de administrador @G@briel01 ou confirmar o e-mail no painel do Supabase.'
        );
      }
      throw new Error(
        error.message === 'Invalid login credentials'
          ? 'Credenciais inválidas. Verifique seu e-mail e senha cadastrados.'
          : error.message
      );
    }

    if (!data.user) {
      throw new Error('Falha ao autenticar usuário com o Supabase.');
    }

    // Fetch the authenticated profile
    const profile = await fetchUserProfile();
    if (!profile) {
      throw new Error('Perfil de usuário não encontrado após autenticação no Supabase.');
    }

    if (profile.status === 'pendente_aprovacao') {
      // Sign out immediately so pending user cannot access protected features
      await supabase.auth.signOut();
      setUser(null);
      throw new Error(
        'Seu cadastro está aguardando aprovação pelo Professor Gabriel. Assim que for aprovado, seu acesso será liberado.'
      );
    }

    if (profile.status !== 'ativo') {
      await supabase.auth.signOut();
      setUser(null);
      throw new Error('Esta conta está inativa. Entre em contato com o Professor Gabriel.');
    }

    setUser(profile);
    return profile;
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    targetExam?: string;
    phone?: string;
    cpf?: string;
  }): Promise<{ user: User; pendingApproval?: boolean; message?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(
        'Supabase Auth não está configurado. Configure as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env.'
      );
    }

    const cleanEmail = data.email.trim().toLowerCase();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: cleanEmail,
      password: data.password.trim(),
      options: {
        data: {
          name: data.name.trim(),
          role: 'aluno',
          target_exam: data.targetExam?.trim() || null,
          phone: data.phone?.trim() || null,
          cpf: data.cpf?.trim() || null,
        },
      },
    });

    if (authError) {
      throw new Error(authError.message || 'Erro ao realizar cadastro no Supabase.');
    }

    if (!authData.user) {
      throw new Error('Falha ao criar usuário no Supabase Auth.');
    }

    // Create / ensure pending approval student profile in public.profiles table
    const newProfile: User = {
      id: authData.user.id,
      name: data.name.trim(),
      email: cleanEmail,
      role: 'aluno',
      status: 'pendente_aprovacao',
      targetExam: data.targetExam?.trim() || undefined,
      phone: data.phone?.trim() || undefined,
      cpf: data.cpf?.trim() || undefined,
      paymentConfirmed: false,
      createdAt: new Date().toISOString(),
    };

    try {
      await (supabase.from('profiles') as any).upsert({
        id: authData.user.id,
        name: newProfile.name,
        email: cleanEmail,
        role: 'aluno',
        status: 'pendente_aprovacao',
        target_exam: newProfile.targetExam || null,
        phone: newProfile.phone || null,
        cpf: newProfile.cpf || null,
        created_at: newProfile.createdAt,
      });
    } catch (err) {
      console.warn('Aviso ao sincronizar perfil no cadastro:', err);
    }

    // Always log out immediately so pending student must await teacher approval
    await supabase.auth.signOut();
    setUser(null);

    return {
      user: newProfile,
      pendingApproval: true,
      message:
        'Cadastro realizado com sucesso! Sua conta aguarda aprovação pelo Professor Gabriel antes de liberar o acesso à plataforma.',
    };
  };

  const changePassword = async (newPassword: string) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase Auth não está configurado.');
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword.trim() });
    if (error) {
      throw new Error(error.message || 'Erro ao alterar senha.');
    }
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase Auth não está configurado.');
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin,
    });
    if (error) {
      throw new Error(error.message || 'Erro ao enviar e-mail de redefinição de senha.');
    }
  };

  const updateCredentials = async (data: { newLogin?: string; currentPassword?: string; newPassword?: string }) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase Auth não está configurado.');
    }

    const updates: { email?: string; password?: string } = {};
    if (data.newLogin && data.newLogin.trim()) {
      updates.email = data.newLogin.trim();
    }
    if (data.newPassword && data.newPassword.trim()) {
      updates.password = data.newPassword.trim();
    }

    const { data: updated, error } = await supabase.auth.updateUser(updates);
    if (error) {
      throw new Error(error.message || 'Erro ao atualizar credenciais no Supabase Auth.');
    }

    if (data.newLogin && data.newLogin.trim() && user?.id) {
      try {
        await (supabase.from('profiles') as any)
          .update({ email: data.newLogin.trim() })
          .eq('id', user.id);
      } catch (err) {
        console.warn('Aviso ao sincronizar profiles com novo e-mail:', err);
      }
    }

    const refreshed = await fetchUserProfile();
    if (refreshed) {
      setUser(refreshed);
    }

    return {
      success: true,
      message: 'Credenciais atualizadas com sucesso no Supabase Auth!',
      user: refreshed || user!,
    };
  };

  const logout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('portugues_tatico_demo_token');
    }
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Erro ao deslogar no Supabase:', e);
      }
    }
    await api.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginDemo,
        register,
        changePassword,
        resetPassword,
        updateCredentials,
        logout,
        refreshUser,
        isConfigured: isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

