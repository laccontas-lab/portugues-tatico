import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { api } from '../lib/api.ts';
import tacticalCrest from '../assets/images/tactical_gold_crest_1790889408670.jpg';
import { 
  Shield, 
  KeyRound, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  UserPlus, 
  LogIn, 
  User, 
  Target,
  Lock,
  X,
  Sun,
  Moon,
  Clock,
  Phone,
  CreditCard,
  MessageCircle,
  FileCheck,
  Sparkles,
  Settings,
  Database,
  ExternalLink
} from 'lucide-react';
import { SOCIAL_LINKS, WhatsAppIcon, YouTubeIcon, InstagramIcon, FloatingWhatsAppButton } from './SocialLinks.tsx';
import { saveSupabaseConfig, clearSupabaseConfig } from '../lib/supabase.ts';

export const LoginView: React.FC = () => {
  const { login, loginDemo, register, resetPassword, isConfigured } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Supabase Config Modal State
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('PORTUGUES_TATICO_SUPABASE_URL') || '' : ''
  );
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('PORTUGUES_TATICO_SUPABASE_ANON_KEY') || '' : ''
  );
  const [demoRoleLoading, setDemoRoleLoading] = useState<'professor' | 'aluno' | null>(null);

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCpf, setRegCpf] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regTargetExam, setRegTargetExam] = useState('Polícia Rodoviária Federal (PRF)');
  const [regCustomTargetExam, setRegCustomTargetExam] = useState('');
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');

  // Post-Registration Pending Approval Screen
  const [registrationSubmitted, setRegistrationSubmitted] = useState(false);
  const [submittedStudentEmail, setSubmittedStudentEmail] = useState('');

  // Forgot / Reset Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');

  // Load remembered email on mount
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('portugues_tatico_remembered_email');
      if (savedEmail) {
        setEmail(savedEmail);
      }
    } catch (_) {}
  }, []);

  const handleQuickDemo = async (role: 'professor' | 'aluno') => {
    try {
      setDemoRoleLoading(role);
      setErrorMessage('');
      await loginDemo(role);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao entrar no modo demonstração.');
    } finally {
      setDemoRoleLoading(null);
    }
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Por favor, informe seu e-mail e senha de acesso.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      if (rememberEmail) {
        localStorage.setItem('portugues_tatico_remembered_email', email);
      } else {
        localStorage.removeItem('portugues_tatico_remembered_email');
      }

      if (!isConfigured) {
        const clean = email.trim().toLowerCase();
        if (clean.includes('aluno') || clean.includes('lucas')) {
          await loginDemo('aluno');
          return;
        }
        await loginDemo('professor');
        return;
      }

      await login(email, password);
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao autenticar. Verifique seu e-mail e senha.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setRegError('Preencha nome completo, e-mail e senha.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('As senhas digitadas não coincidem.');
      return;
    }

    if (!isConfigured) {
      setRegError(
        'Supabase Auth não está configurado. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env.'
      );
      return;
    }

    setRegLoading(true);
    setRegError('');

    try {
      const finalTargetExam = regTargetExam === 'OUTROS'
        ? (regCustomTargetExam.trim() ? `Outros (${regCustomTargetExam.trim()})` : 'Outros')
        : regTargetExam;

      const res = await register({
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        password: regPassword.trim(),
        targetExam: finalTargetExam,
        phone: regPhone.trim(),
        cpf: regCpf.trim()
      });

      // The student must await teacher approval before accessing protected views
      if (res.pendingApproval) {
        setSubmittedStudentEmail(regEmail.trim());
        setRegistrationSubmitted(true);
      }
    } catch (err: any) {
      setRegError(err.message || 'Erro ao realizar cadastro.');
    } finally {
      setRegLoading(false);
    }
  };

  // Handle Reset Password Submit via Supabase Auth
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotError('Informe seu e-mail cadastrado.');
      return;
    }

    if (!isConfigured) {
      setForgotError('Supabase Auth não está configurado.');
      return;
    }

    setForgotLoading(true);
    setForgotError('');
    setForgotSuccessMessage('');

    try {
      await resetPassword(forgotEmail);
      setForgotSuccessMessage('Link de redefinição de acesso enviado com sucesso para seu e-mail via Supabase Auth.');
    } catch (err: any) {
      setForgotError(err.message || 'Erro ao solicitar redefinição de senha.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-6 sm:py-10 px-3 sm:px-6 lg:px-8 relative overflow-x-hidden transition-colors">
      {/* Background Subtle Gradient & Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-slate-50 to-slate-50 dark:from-amber-500/5 dark:via-slate-950 dark:to-slate-950 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      {/* Top Controls: Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400 shadow-xs cursor-pointer transition-colors"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Modo Claro</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-slate-600" />
              <span>Modo Escuro</span>
            </>
          )}
        </button>
      </div>

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="flex justify-center mb-3">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400/60 p-1 flex items-center justify-center shadow-lg bg-white dark:bg-slate-900">
            <img 
              src={tacticalCrest} 
              alt="Português Tático" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          PORTUGUÊS TÁTICO
        </h1>
        <div className="mt-1 text-center space-y-0.5">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Português e Redação para Concursos
          </p>
          <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
            Professor Gabriel Figueiredo
          </p>
        </div>
      </div>

      {/* Card Container */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm transition-colors">
          
          {/* Banner de Demonstração & Configuração Supabase */}
          {!isConfigured ? (
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-slate-100/60 dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900 border border-amber-500/30 text-left space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs space-y-1">
                  <p className="font-bold text-amber-900 dark:text-amber-200">
                    Modo Demonstração Ativo · Teste Imediato
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Você pode acessar e testar todas as funcionalidades do sistema agora mesmo ou conectar seu projeto oficial Supabase.
                  </p>
                </div>
              </div>

              {/* Botões de Acesso Rápido */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('professor')}
                  disabled={demoRoleLoading !== null}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold text-amber-950 dark:text-amber-100 bg-amber-100/90 hover:bg-amber-200 dark:bg-amber-900/40 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-700 transition-all cursor-pointer shadow-2xs hover:scale-[1.01]"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                  <span>{demoRoleLoading === 'professor' ? 'Acessando...' : 'Entrar: Professor'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('aluno')}
                  disabled={demoRoleLoading !== null}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-100 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer shadow-2xs hover:scale-[1.01]"
                >
                  <User className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                  <span>{demoRoleLoading === 'aluno' ? 'Acessando...' : 'Entrar: Aluno'}</span>
                </button>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] border-t border-amber-500/20">
                <span className="text-slate-500 dark:text-slate-400">Banco de produção pendente</span>
                <button
                  type="button"
                  onClick={() => setShowConfigModal(true)}
                  className="inline-flex items-center gap-1 font-semibold text-amber-800 dark:text-amber-300 hover:underline cursor-pointer"
                >
                  <Settings className="w-3 h-3" />
                  <span>Conectar meu Supabase</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1.5 font-medium text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Supabase Auth & Banco Oficial Conectados
              </span>
              <button
                type="button"
                onClick={() => setShowConfigModal(true)}
                className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-700 underline cursor-pointer"
              >
                Configurações
              </button>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 mb-6 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMessage('');
                setRegistrationSubmitted(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs border border-slate-200/60 dark:border-slate-600'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Acessar Conta</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setRegError('');
                setErrorMessage('');
                setRegistrationSubmitted(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs border border-slate-200/60 dark:border-slate-600'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Criar Conta (Novo Aluno)</span>
            </button>
          </div>

          {/* ============================================================== */}
          {/* POST-REGISTRATION CONFIRMATION SCREEN (Pendente de Aprovação)  */}
          {/* ============================================================== */}
          {registrationSubmitted ? (
            <div className="space-y-5 text-center py-2 animate-in fade-in duration-200">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-sm">
                <Clock className="w-7 h-7 animate-pulse" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-300 dark:border-amber-700">
                  ⏳ Cadastro em Análise · Aguardando Aprovação
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-2.5">
                  Cadastro Realizado com Sucesso!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                  Para garantir o acompanhamento pedagógico rigoroso, o acesso aos simulados e ao envio de redações com correção individual é liberado após a <strong className="text-amber-700 dark:text-amber-400">aprovação do cadastro pelo Professor Gabriel</strong>.
                </p>
              </div>

              {/* Status Box */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">E-mail registrado:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{submittedStudentEmail}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Concurso Alvo:</span>
                  <span className="font-semibold text-amber-800 dark:text-amber-300">{regTargetExam}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Status de Liberação:</span>
                  <span className="inline-flex items-center gap-1 font-bold text-amber-700 dark:text-amber-400">
                    <Clock className="w-3.5 h-3.5" />
                    Pendente de Aprovação Pedagógica
                  </span>
                </div>
              </div>

              {/* Contact Direct */}
              <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-left flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0 mt-0.5 shadow-2xs">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="text-xs space-y-1">
                  <p className="font-bold text-slate-900 dark:text-slate-100">
                    Contato Direto com o Professor Gabriel:
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-snug">
                    Dúvidas sobre o cadastro e liberação podem ser tratadas diretamente pelo WhatsApp: 
                    <strong className="text-emerald-700 dark:text-emerald-400 block font-mono mt-0.5">(11) 99123-4567</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setRegistrationSubmitted(false);
                  setAuthMode('login');
                  setEmail(submittedStudentEmail);
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Voltar para a Tela de Login
              </button>
            </div>
          ) : authMode === 'login' ? (
            /* ============================================================== */
            /* LOGIN FORM                                                     */
            /* ============================================================== */
            <div>
              <div className="mb-4">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Entrar na Plataforma
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Informe suas credenciais para acessar sua área de estudos.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/70 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Login / E-mail de Acesso
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Seu login ou e-mail (ex: gabriel)"
                      required
                      autoComplete="username"
                      className="block w-full pl-9 pr-3 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Senha
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotModal(true);
                        setForgotEmail(email);
                        setForgotSuccessMessage('');
                        setForgotError('');
                      }}
                      className="text-xs text-amber-700 dark:text-amber-400 hover:text-amber-800 font-medium transition-colors cursor-pointer"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      className="block w-full pl-9 pr-10 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember me checkbox */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={rememberEmail}
                      onChange={(e) => setRememberEmail(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-700 text-amber-600 focus:ring-amber-500 h-3.5 w-3.5"
                    />
                    <span>Lembrar meu login/e-mail</span>
                  </label>
                </div>

                {/* PROMINENT LOGIN BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-md transition-all disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>ENTRAR NO SISTEMA (LOGIN)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Redes Sociais Oficiais e Contato Direto */}
              <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 text-center space-y-3">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Canais Oficiais · Prof. Gabriel Figueiredo:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <a
                    href={SOCIAL_LINKS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Fale com o Prof. Gabriel no WhatsApp (Tirar Dúvidas)"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={SOCIAL_LINKS.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Canal Português Tático no YouTube"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-600 border border-rose-200 dark:border-rose-900 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <YouTubeIcon className="w-4 h-4" />
                    <span>YouTube</span>
                  </a>

                  <a
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Instagram Oficial @portuguestatico_"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-pink-600 hover:text-white bg-pink-50 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-600 hover:to-purple-600 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <InstagramIcon className="w-4 h-4" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* ============================================================== */
            /* REGISTER FORM (Criar Conta de Aluno com Validação e Lista)     */
            /* ============================================================== */
            <div>
              <div className="mb-4">
                <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-700 mb-1 inline-block">
                  Aprovação Pedagógica
                </span>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Criar Cadastro de Novo Aluno
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Cadastre-se na plataforma. O acesso será liberado mediante aprovação do cadastro pelo Professor Gabriel.
                </p>
              </div>

              {regError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Ex: Carlos Eduardo Nogueira"
                      required
                      className="block w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    E-mail de Acesso *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      required
                      className="block w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      WhatsApp / Telefone *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="(11) 98765-4321"
                        required
                        className="block w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      CPF (para validação)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        value={regCpf}
                        onChange={(e) => setRegCpf(e.target.value)}
                        placeholder="000.000.000-00"
                        className="block w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Target Exam Categorized Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Concurso Alvo *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Target className="h-4 w-4" />
                    </div>
                    <select
                      value={regTargetExam}
                      onChange={(e) => setRegTargetExam(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
                    >
                      <optgroup label="Carreiras Civis & Policiais">
                        <option value="Polícia Rodoviária Federal (PRF)">Polícia Rodoviária Federal (PRF)</option>
                        <option value="Polícia Federal (PF - Agente / Escrivão)">Polícia Federal (PF - Agente / Escrivão)</option>
                        <option value="Concurso Nacional Unificado (CNU)">Concurso Nacional Unificado (CNU)</option>
                        <option value="Bancos Públicos (Caixa / Banco do Brasil)">Bancos Públicos (Caixa / Banco do Brasil)</option>
                        <option value="Polícia Civil (PC)">Polícia Civil (PC)</option>
                        <option value="Polícias Militares e Perícias Oficiais">Polícias Militares e Perícias Oficiais</option>
                        <option value="Polícia Penal e Segurança Pública">Polícia Penal e Segurança Pública</option>
                        <option value="Conselhos Profissionais e Órgãos Públicos">Conselhos Profissionais e Órgãos Públicos</option>
                        <option value="Tribunais de Justiça (TJ)">Tribunais de Justiça (TJ)</option>
                        <option value="Tribunais Regionais Federais (TRF)">Tribunais Regionais Federais (TRF)</option>
                        <option value="Tribunal Superior Eleitoral Unificado (TSE / TRE)">Tribunal Superior Eleitoral Unificado (TSE / TRE)</option>
                        <option value="Carreiras Fiscais (Receita Federal / SEFAZ)">Carreiras Fiscais (Receita Federal / SEFAZ)</option>
                        <option value="Ministério Público e Defensoria (MPU / DPU)">Ministério Público e Defensoria (MPU / DPU)</option>
                        <option value="INSS / IBGE / Agências Reguladoras">INSS / IBGE / Agências Reguladoras</option>
                      </optgroup>

                      <optgroup label="Carreiras Militares & Forças Armadas">
                        <option value="EsPCEx (Escola Preparatória de Cadetes do Exército)">EsPCEx (Escola Preparatória de Cadetes do Exército)</option>
                        <option value="ESA (Escola de Sargentos das Armas)">ESA (Escola de Sargentos das Armas)</option>
                        <option value="AFA (Academia da Força Aérea)">AFA (Academia da Força Aérea)</option>
                        <option value="Escola Naval (Marinha do Brasil)">Escola Naval (Marinha do Brasil)</option>
                        <option value="EFOMM (Oficiais da Marinha Mercante)">EFOMM (Oficiais da Marinha Mercante)</option>
                        <option value="Colégio Naval / EPCAR">Colégio Naval / EPCAR</option>
                        <option value="Oficial da Polícia Militar (CFO)">Oficial da Polícia Militar (CFO)</option>
                        <option value="Soldado da Polícia Militar">Soldado da Polícia Militar</option>
                        <option value="Corpo de Bombeiros Militar">Corpo de Bombeiros Militar</option>
                        <option value="IME / ITA">IME / ITA</option>
                      </optgroup>

                      <optgroup label="Outro Concurso">
                        <option value="OUTROS">OUTROS (Não listado acima)</option>
                      </optgroup>
                    </select>
                  </div>
                </div>

                {regTargetExam === 'OUTROS' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Qual é o seu concurso alvo? *
                    </label>
                    <input
                      type="text"
                      value={regCustomTargetExam}
                      onChange={(e) => setRegCustomTargetExam(e.target.value)}
                      placeholder="Ex: Guarda Municipal, PM-BA, Polícia Penal Estadual..."
                      required
                      className="block w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Criar Senha *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="h-3.5 w-3.5" />
                      </div>
                      <input
                        type={regShowPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Mín. 6 dígitos"
                        required
                        className="block w-full pl-8 pr-8 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setRegShowPassword(!regShowPassword)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        title={regShowPassword ? 'Ocultar senha' : 'Exibir senha'}
                      >
                        {regShowPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Confirmar Senha *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="h-3.5 w-3.5" />
                      </div>
                      <input
                        type={regShowPassword ? 'text' : 'password'}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Repita a senha"
                        required
                        className="block w-full pl-8 pr-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={regLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-md transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {regLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>SOLICITAR CADASTRO DE ALUNO</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Já é aluno cadastrado?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setErrorMessage('');
                    }}
                    className="font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    Fazer Login
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer on Login / Register */}
      <footer className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2 relative z-10 px-4 pb-6">
        <p className="font-medium text-slate-600 dark:text-slate-300">
          Português Tático © {new Date().getFullYear()} · Prof. Gabriel Figueiredo · Todos os direitos reservados.
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Método Português Tático · Acesso Restrito & Protegido · <strong className="text-amber-700 dark:text-amber-400 font-semibold">Bons estudos e Deus te abençoe</strong>
        </p>
      </footer>

      {/* Floating WhatsApp button for fast student support on mobile, tablet & notebook */}
      <FloatingWhatsAppButton />

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl relative text-left">
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-700 dark:text-amber-300">
                <KeyRound className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Recuperação de Senha
              </h3>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Informe seu e-mail cadastrado para receber as instruções oficiais de recuperação e redefinição de senha via Supabase Auth.
            </p>

            {forgotError && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSuccessMessage && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{forgotSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Seu E-mail Cadastrado
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  required
                  className="block w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  {forgotLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supabase Integration & Setup Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-left max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowConfigModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700 dark:text-amber-300">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Conexão com o Supabase PostgreSQL
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Configure o banco de produção oficial para autenticação real e persistência
                </p>
              </div>
            </div>

            {/* Guia Rápido do Script */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2 mb-4">
              <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span>📋 Como rodar o script no seu Supabase:</span>
              </p>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                <li>Acesse seu projeto no <strong>supabase.com</strong>.</li>
                <li>Clique no menu lateral em <strong>SQL Editor</strong> e depois em <strong>New query</strong>.</li>
                <li>Abra o arquivo <code className="font-mono text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-1 py-0.5 rounded">supabase/schema_completo_supabase.sql</code> no projeto, copie todo o código e cole na query.</li>
                <li>Clique no botão verde <strong>RUN</strong> para criar as tabelas, triggers e RLS.</li>
                <li>Vá em <strong>Project Settings → API</strong> para copiar a <strong>Project URL</strong> e a <strong>anon public key</strong>.</li>
              </ol>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!supabaseUrlInput.trim() || !supabaseKeyInput.trim()) {
                  alert('Por favor, informe a URL e a Chave Pública Anon do seu Supabase.');
                  return;
                }
                saveSupabaseConfig(supabaseUrlInput, supabaseKeyInput);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  VITE_SUPABASE_URL (Project URL)
                </label>
                <input
                  type="url"
                  value={supabaseUrlInput}
                  onChange={(e) => setSupabaseUrlInput(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  required
                  className="block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  VITE_SUPABASE_ANON_KEY (Anon Public Key)
                </label>
                <textarea
                  rows={2}
                  value={supabaseKeyInput}
                  onChange={(e) => setSupabaseKeyInput(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  required
                  className="block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {isConfigured && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Deseja desconectar as chaves e voltar ao modo demonstração?')) {
                        clearSupabaseConfig();
                      }
                    }}
                    className="text-red-600 dark:text-red-400 hover:underline cursor-pointer text-[11px]"
                  >
                    Desconectar Supabase
                  </button>
                )}
                {!isConfigured && <div />}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="px-3 py-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Salvar e Conectar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
