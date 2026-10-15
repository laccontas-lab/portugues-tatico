import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import tacticalCrest from '../assets/images/tactical_gold_crest_1790889408670.jpg';
import { Essay } from '../types/index.ts';
import { SOCIAL_LINKS, WhatsAppIcon, YouTubeIcon, InstagramIcon } from './SocialLinks.tsx';
import { TeacherCredentialsModal } from './TeacherDashboard/TeacherCredentialsModal.tsx';
import { 
  FileText, 
  Users, 
  Award, 
  BookOpen, 
  LogOut, 
  Shield, 
  TrendingUp,
  UserCheck,
  Bell,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  X,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Sun,
  Moon,
  ChevronDown,
  Layers
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSubmitEssay?: () => void;
  essays?: Essay[];
  onOpenEssayDetails?: (essayId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentTab, 
  onSelectTab, 
  onOpenSubmitEssay,
  essays = [],
  onOpenEssayDetails
}) => {
  const { user, logout, changePassword } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Teacher Credentials Modal State
  const [showTeacherCredsModal, setShowTeacherCredsModal] = useState(false);

  // Change Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [showPwdText, setShowPwdText] = useState(false);

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPwd) {
      setPwdError('Preencha a nova senha desejada.');
      return;
    }
    if (newPwd.length < 6) {
      setPwdError('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError('As novas senhas não coincidem.');
      return;
    }

    setPwdLoading(true);
    setPwdError('');
    setPwdSuccess('');

    try {
      await changePassword(newPwd);
      setPwdSuccess('Senha atualizada com sucesso no Supabase Auth!');
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
    } catch (err: any) {
      setPwdError(err.message || 'Erro ao alterar senha.');
    } finally {
      setPwdLoading(false);
    }
  };

  // Close notifications & profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const isTeacher = user.role === 'professor';

  // Get student's corrected essays
  const studentCorrections = !isTeacher
    ? essays.filter(e => e.studentId === user.id && e.status === 'Corrigida' && !!e.correction)
    : [];

  const handleSimulateToast = () => {
    const sampleEssay = studentCorrections[0] || essays.find(e => e.correction) || {
      id: 'demo-essay-toast',
      studentId: user.id,
      title: 'A Segurança Pública no Estado Democrático de Direito',
      theme: 'A Segurança Pública no Estado Democrático de Direito',
      correction: {
        grade: 9.6,
        feedback: 'Excelente progressão temática, repertório constitucional legítimo e excelente coesão interparágrafos.',
        teacherName: 'Prof. Gabriel Figueiredo'
      }
    };

    window.dispatchEvent(new CustomEvent('tactical_essay_corrected', {
      detail: {
        essayId: sampleEssay.id,
        studentId: user.id,
        title: sampleEssay.title || sampleEssay.theme,
        theme: sampleEssay.theme,
        grade: sampleEssay.correction?.grade || 9.6,
        feedback: sampleEssay.correction?.feedback || 'Excelente trabalho! Nota lançada e parecer emitido com sucesso.',
        teacherName: 'Prof. Gabriel Figueiredo'
      }
    }));
    setShowNotifications(false);
  };

  const teacherTabs = [
    { id: 'overview', label: 'Painel', icon: Shield },
    { id: 'essays', label: 'Redações', icon: FileText },
    { id: 'proposals', label: 'Temas & Propostas', icon: Sparkles },
    { id: 'students', label: 'Alunos', icon: Users },
    { id: 'study-hub', label: 'Central de Estudos', icon: BookOpen },
    { id: 'ranking', label: 'Classificação', icon: Award },
    { id: 'credentials', label: 'Alterar Login & Senha', icon: KeyRound },
  ];

  const studentTabs = [
    { id: 'overview', label: 'Início', icon: Shield },
    { id: 'my-essays', label: 'Minhas Redações', icon: FileText },
    { id: 'proposals', label: 'Temas & Propostas', icon: Sparkles },
    { id: 'evolution', label: 'Minha Evolução', icon: TrendingUp },
    { id: 'study-hub', label: 'Central de Estudos', icon: BookOpen },
    { id: 'ranking', label: 'Classificação', icon: Award },
    { id: 'credentials', label: 'Alterar Senha', icon: KeyRound },
  ];

  const tabs = isTeacher ? teacherTabs : studentTabs;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs transition-colors no-print">
      {/* Top Ambient Tactical Gold Gradient Line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600 shadow-2xs" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Single Brand Lockup */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button 
            onClick={() => onSelectTab('overview')} 
            className="flex items-center gap-2 sm:gap-2.5 text-left focus:outline-none cursor-pointer group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden border border-amber-500/40 flex items-center justify-center shadow-xs shrink-0 bg-slate-950 group-hover:border-amber-500 transition-colors">
              <img 
                src={tacticalCrest} 
                alt="Português Tático" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                PORTUGUÊS TÁTICO
                <span className="hidden sm:inline-flex text-[10px] font-semibold tracking-wider text-amber-800 dark:text-amber-300 uppercase bg-amber-100/70 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-700">
                  {isTeacher ? 'Professor' : 'Aluno'}
                </span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Prof. Gabriel Figueiredo
              </p>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Laptop / Desktop) */}
        <nav className="hidden lg:flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 shadow-xs border border-amber-200/80 dark:border-amber-800/80 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-700 dark:text-amber-400' : 'text-slate-400 dark:text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Profile */}
        <div className="flex items-center gap-1 sm:gap-2.5">
          {/* Social Channels: WhatsApp, YouTube, Instagram */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              title="Fale com o Prof. Gabriel no WhatsApp (Tirar Dúvidas)"
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">WhatsApp</span>
            </a>

            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              title="Canal Português Tático no YouTube"
              className="p-1.5 rounded-lg text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-600 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
            >
              <YouTubeIcon className="w-3.5 h-3.5" />
            </a>

            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram Oficial @portuguestatico_"
              className="p-1.5 rounded-lg text-pink-600 hover:text-white bg-pink-50 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-600 hover:to-purple-600 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900 transition-all cursor-pointer"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Quick Teacher Credentials Button */}
          {isTeacher && (
            <button
              type="button"
              onClick={() => setShowTeacherCredsModal(true)}
              title="Alterar seu Login de Acesso e Senha do Sistema"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700 rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden xl:inline">Mudar Login & Senha</span>
              <span className="xl:hidden">Segurança</span>
            </button>
          )}

          {/* Quick Submit Essay for Student */}
          {!isTeacher && onOpenSubmitEssay && (
            <button
              onClick={onOpenSubmitEssay}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-md transition-all shadow-xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-white" />
              <span>Enviar Redação</span>
            </button>
          )}

          {/* Student Notifications Bell (Section 3: Toast & Notificações de Correção) */}
          {!isTeacher && (
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                title="Notificações de correções"
                className={`relative p-1.5 sm:p-2 rounded-lg transition-colors cursor-pointer ${
                  showNotifications 
                    ? 'bg-amber-100 text-amber-900' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Bell className="w-4 h-4" />
                {studentCorrections.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs animate-pulse">
                    {studentCorrections.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Panel */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in duration-200">
                  <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                        Notificações de Correção
                      </span>
                    </div>
                    <span className="text-[10px] bg-slate-800 text-amber-400 px-2 py-0.5 rounded-full font-mono">
                      {studentCorrections.length} {studentCorrections.length === 1 ? 'corrigida' : 'corrigidas'}
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-1">
                    {studentCorrections.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p>Nenhuma correção recente ainda.</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Assim que o Professor Gabriel corrigir uma redação, você receberá um alerta imediato aqui.
                        </p>
                      </div>
                    ) : (
                      studentCorrections.map(item => (
                        <div 
                          key={item.id}
                          className="p-3 hover:bg-amber-50/50 transition-colors text-xs space-y-1.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-slate-900 line-clamp-1">
                              {item.title || item.theme}
                            </span>
                            {item.correction && (
                              <span className="font-mono font-bold text-xs bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded shrink-0">
                                Nota {item.correction.grade.toFixed(1)}
                              </span>
                            )}
                          </div>

                          {item.correction?.feedback && (
                            <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                              &ldquo;{item.correction.feedback}&rdquo;
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] text-slate-400">
                              {item.correction?.correctedAt 
                                ? new Date(item.correction.correctedAt).toLocaleDateString('pt-BR') 
                                : 'Corrigida recentemente'}
                            </span>

                            {onOpenEssayDetails && (
                              <button
                                type="button"
                                onClick={() => {
                                  setShowNotifications(false);
                                  onOpenEssayDetails(item.id);
                                }}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
                              >
                                <span>Ver Correção</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Dropdown footer with Test Simulation button */}
                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={handleSimulateToast}
                      className="text-[11px] font-semibold text-amber-800 hover:text-amber-900 bg-amber-100/80 hover:bg-amber-200/80 px-2.5 py-1.5 rounded-lg border border-amber-300/80 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-amber-700" />
                      <span>Testar Alerta Toast</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="text-[11px] text-slate-500 hover:text-slate-800 px-2 py-1 cursor-pointer"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            )}
          </button>

          {/* User Profile trigger with Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Minha Conta e Opções"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center text-xs font-extrabold overflow-hidden shrink-0 shadow-2xs">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0)
                )}
              </div>
              <div className="hidden xl:block text-left text-xs leading-tight">
                <p className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[110px]">{user.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[110px]">{user.role === 'professor' ? 'Professor' : 'Aluno'}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in duration-150 text-left">
                <div className="p-3 bg-gradient-to-r from-amber-500/10 via-amber-100/30 to-transparent dark:from-amber-950/40 dark:via-slate-800 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-700">
                      {user.role === 'professor' ? 'Professor' : 'Aluno'}
                    </span>
                    {user.targetExam && (
                      <span className="text-[10px] text-slate-600 dark:text-slate-300 truncate max-w-[140px]">
                        {user.targetExam}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-2 space-y-1">
                  {isTeacher ? (
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowTeacherCredsModal(true);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-amber-900 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-lg transition-colors cursor-pointer text-left font-bold"
                    >
                      <KeyRound className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Mudar Meu Login & Senha</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowPasswordModal(true);
                        setPwdError('');
                        setPwdSuccess('');
                        setCurrentPwd('');
                        setNewPwd('');
                        setConfirmPwd('');
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-left font-medium"
                    >
                      <KeyRound className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Alterar Senha de Acesso</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SINGLE PROMINENT LOGOUT BUTTON: Sair da Conta / Logout */}
          <button
            type="button"
            onClick={() => logout()}
            title="Sair da Conta e Encerrar Sessão (Logout)"
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-lg transition-all shadow-xs cursor-pointer shrink-0 border border-rose-500/50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair da Conta</span>
            <span className="sm:hidden">Sair</span>
          </button>
        </div>
      </div>

      {/* Alterar Senha Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Minha Conta & Alterar Senha
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {user.name} ({user.email})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {pwdError && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{pwdError}</span>
              </div>
            )}

            {pwdSuccess && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{pwdSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Senha Atual
                </label>
                <div className="relative">
                  <input
                    type={showPwdText ? 'text' : 'password'}
                    value={currentPwd}
                    onChange={(e) => setCurrentPwd(e.target.value)}
                    placeholder="Digite sua senha atual"
                    required
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwdText(!showPwdText)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPwdText ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nova Senha (Mínimo 6 caracteres)
                </label>
                <input
                  type={showPwdText ? 'text' : 'password'}
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="Nova senha segura"
                  required
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirmar Nova Senha
                </label>
                <input
                  type={showPwdText ? 'text' : 'password'}
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  placeholder="Repita a nova senha"
                  required
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  disabled={pwdLoading}
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors disabled:opacity-60 cursor-pointer shadow-xs"
                >
                  {pwdLoading ? 'Salvando...' : 'Atualizar Senha'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Credentials Modal (Change Login & Password) */}
      <TeacherCredentialsModal 
        isOpen={showTeacherCredsModal} 
        onClose={() => setShowTeacherCredsModal(false)} 
      />

      {/* Mobile & Tablet Nav Scroller */}
      <div className="lg:hidden flex items-center overflow-x-auto border-t border-slate-200 dark:border-slate-800 px-2 sm:px-3 py-1.5 gap-1.5 scrollbar-none bg-white dark:bg-slate-900 transition-colors">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                isActive
                  ? 'text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/60 font-bold border border-amber-300 dark:border-amber-700 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
