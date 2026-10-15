import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { api } from './lib/api.ts';
import { 
  User, 
  Essay, 
  StudentStats, 
  RankingEntry, 
  ExamBoardGuide, 
  TextTipGuide, 
  TacticalMethodMission,
  AttentionCriterion,
  EssayFile,
  WeeklyMission
} from './types/index.ts';

import { Navbar } from './components/Navbar.tsx';
import { LoginView } from './components/LoginView.tsx';
import { 
  KeyRound, 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Lock,
  ArrowRight,
  Eye,
  Shield
} from 'lucide-react';

// Teacher views
import { TeacherOverview } from './components/TeacherDashboard/TeacherOverview.tsx';
import { TeacherEssays } from './components/TeacherDashboard/TeacherEssays.tsx';
import { ThematicProposalsView } from './components/ThematicProposals/ThematicProposalsView.tsx';
import { TeacherStudents } from './components/TeacherDashboard/TeacherStudents.tsx';
import { TeacherCredentialsTab } from './components/TeacherDashboard/TeacherCredentialsTab.tsx';
import { EssayCorrectionModal } from './components/TeacherDashboard/EssayCorrectionModal.tsx';

// Student views
import { StudentOverview } from './components/StudentDashboard/StudentOverview.tsx';
import { StudentEssays } from './components/StudentDashboard/StudentEssays.tsx';
import { StudentEvolution } from './components/StudentDashboard/StudentEvolution.tsx';
import { StudentSubmitEssayModal } from './components/StudentDashboard/StudentSubmitEssayModal.tsx';
import { WhatsAppIcon, YouTubeIcon, InstagramIcon, FloatingWhatsAppButton } from './components/SocialLinks.tsx';
import { WeeklyMissionModal } from './components/StudentDashboard/WeeklyMissionModal.tsx';
import { CorrectionToasts } from './components/StudentDashboard/CorrectionToasts.tsx';

// Shared views
import { StudyHub } from './components/StudyHub/StudyHub.tsx';
import { RankingView } from './components/Ranking/RankingView.tsx';

function MainApp() {
  const { user, loading, logout, changePassword } = useAuth();

  // Active navigation tab
  const [currentTab, setCurrentTab] = useState<string>('overview');

  // Shared Data
  const [essays, setEssays] = useState<Essay[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [teacherStats, setTeacherStats] = useState<any>({
    pendingEssays: 0,
    correctedEssays: 0,
    activeStudents: 0,
    averageGrade: 0,
    totalEssays: 0,
    recentActivity: []
  });
  const [studentStats, setStudentStats] = useState<StudentStats>({
    essaysSubmitted: 0,
    essaysCorrected: 0,
    averageGrade: 0,
    highestGrade: 0,
    gradeHistory: [],
    questionsAnswered: 0,
    questionsCorrect: 0,
    accuracyRate: 0,
    subjectBreakdown: [],
    criticalWeaknesses: [],
    frequentAttentionPoints: []
  });

  const [weeklyMissionData, setWeeklyMissionData] = useState<(WeeklyMission & {
    progressPercent: number;
    completedCount: number;
    totalTasks: number;
  }) | null>(null);

  const [boards, setBoards] = useState<ExamBoardGuide[]>([]);
  const [textGuides, setTextGuides] = useState<TextTipGuide[]>([]);
  const [tacticalMethod, setTacticalMethod] = useState<TacticalMethodMission[]>([]);

  // Modals
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [preselectedTheme, setPreselectedTheme] = useState<string>('');
  const [showWeeklyMissionModal, setShowWeeklyMissionModal] = useState(false);
  const [selectedEssayIdForModal, setSelectedEssayIdForModal] = useState<string | null>(null);
  const [essayFilterStatus, setEssayFilterStatus] = useState<string>('Todas');

  // Professor First Access Password Change (Exclusividade de Acesso)
  const [showFirstAccessModal, setShowFirstAccessModal] = useState(false);
  const [firstAccessNewPwd, setFirstAccessNewPwd] = useState('');
  const [firstAccessConfirmPwd, setFirstAccessConfirmPwd] = useState('');
  const [firstAccessLoading, setFirstAccessLoading] = useState(false);
  const [firstAccessError, setFirstAccessError] = useState('');
  const [firstAccessSuccess, setFirstAccessSuccess] = useState('');

  const [viewingAsStudent, setViewingAsStudent] = useState(false);
  const isTeacher = user?.role === 'professor';
  const isEffectiveTeacher = isTeacher && !viewingAsStudent;

  const effectiveStudentUser: User = user ? (viewingAsStudent ? {
    ...user,
    name: user.name || 'Professor Gabriel (Visão do Aluno)',
    role: 'aluno',
    targetExam: user.targetExam || 'Polícia Rodoviária Federal (PRF)'
  } : user) : {
    id: 'student_preview',
    name: 'Aluno',
    email: '',
    role: 'aluno',
    status: 'ativo',
    paymentConfirmed: true,
    createdAt: new Date().toISOString()
  };

  const previewStudentStats: StudentStats = (viewingAsStudent && studentStats.essaysSubmitted === 0) ? {
    essaysSubmitted: 4,
    essaysCorrected: 3,
    averageGrade: 8.8,
    highestGrade: 9.6,
    lowestGrade: 7.8,
    questionsAnswered: 24,
    questionsCorrect: 21,
    accuracyRate: 87.5,
    subjectBreakdown: [],
    criticalWeaknesses: [],
    frequentAttentionPoints: [
      { criterion: 'Pontuação em Orações Subordinadas', count: 2 },
      { criterion: 'Paralelismo Sintático', count: 1 }
    ],
    gradeHistory: [
      { essayId: '1', title: 'O Fator Humano e a Fadiga Rodoviária', grade: 9.6, date: '10/09/2026' },
      { essayId: '2', title: 'A Segurança Pública no Estado Democrático', grade: 8.5, date: '18/09/2026' },
      { essayId: '3', title: 'Crise Hídrica e Sustentabilidade', grade: 8.3, date: '25/09/2026' }
    ]
  } : studentStats;

  useEffect(() => {
    if (user && user.role === 'professor' && user.mustChangePassword) {
      const dismissed = sessionStorage.getItem('portugues_tatico_dismissed_first_access');
      if (!dismissed) {
        setShowFirstAccessModal(true);
      }
    }
  }, [user]);

  const handleFirstAccessPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstAccessNewPwd) {
      setFirstAccessError('Informe a sua nova senha pessoal.');
      return;
    }
    if (firstAccessNewPwd.length < 6) {
      setFirstAccessError('A nova senha deve conter no mínimo 6 caracteres.');
      return;
    }
    if (firstAccessNewPwd !== firstAccessConfirmPwd) {
      setFirstAccessError('As senhas digitadas não coincidem.');
      return;
    }

    setFirstAccessLoading(true);
    setFirstAccessError('');
    try {
      await changePassword(firstAccessNewPwd);
      setFirstAccessSuccess('Senha alterada com sucesso! O módulo do professor está agora protegido com sua credencial exclusiva.');
      setTimeout(() => {
        setShowFirstAccessModal(false);
      }, 2500);
    } catch (err: any) {
      setFirstAccessError(err.message || 'Erro ao definir nova senha.');
    } finally {
      setFirstAccessLoading(false);
    }
  };

  // Load all data
  const loadData = async () => {
    if (!user) return;
    try {
      const results = await Promise.allSettled([
        api.getEssays(),
        api.getRanking(),
        api.getExamBoards(),
        api.getTextGuides(),
        api.getTacticalMethod(),
        api.getWeeklyMission()
      ]);

      const fetchedEssays = results[0].status === 'fulfilled' ? results[0].value : [];
      const fetchedRanking = results[1].status === 'fulfilled' ? results[1].value : [];
      const fetchedBoards = results[2].status === 'fulfilled' ? results[2].value : [];
      const fetchedTextGuides = results[3].status === 'fulfilled' ? results[3].value : [];
      const fetchedMethod = results[4].status === 'fulfilled' ? results[4].value : [];
      const fetchedMission = results[5].status === 'fulfilled' ? results[5].value : null;

      if (results[0].status === 'rejected') {
        console.warn('Aviso ao carregar redações:', results[0].reason);
      }

      setEssays(fetchedEssays);
      setRanking(fetchedRanking);
      if (Array.isArray(fetchedBoards) && fetchedBoards.length > 0) {
        setBoards(fetchedBoards);
      }
      if (Array.isArray(fetchedTextGuides) && fetchedTextGuides.length > 0) {
        setTextGuides(fetchedTextGuides);
      }
      if (Array.isArray(fetchedMethod) && fetchedMethod.length > 0) {
        setTacticalMethod(fetchedMethod);
      }
      if (fetchedMission) {
        setWeeklyMissionData(fetchedMission);
      }

      if (user.role === 'professor') {
        const [tStatsRes, studentListRes] = await Promise.allSettled([
          api.getTeacherStats(),
          api.getStudents()
        ]);
        if (tStatsRes.status === 'fulfilled') setTeacherStats(tStatsRes.value);
        if (studentListRes.status === 'fulfilled') setStudents(studentListRes.value);
      } else {
        try {
          const sStats = await api.getStudentStats();
          setStudentStats(sStats);
        } catch (e) {
          console.warn('Erro ao carregar stats do aluno:', e);
        }
      }
    } catch (err) {
      console.error('Error loading platform data:', err);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
          Carregando Português Tático...
        </span>
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  // Handlers
  const handleSaveCorrection = async (essayId: string, data: {
    grade: number;
    feedback: string;
    attentionPoints: AttentionCriterion[];
    correctionFile?: EssayFile;
  }) => {
    await api.correctEssay(essayId, data);
    
    // Trigger toast notification for student
    const targetEssay = essays.find(e => e.id === essayId);
    if (targetEssay) {
      const alertData = {
        essayId,
        studentId: targetEssay.studentId,
        title: targetEssay.title || targetEssay.theme,
        theme: targetEssay.theme,
        grade: data.grade,
        feedback: data.feedback,
        teacherName: user?.name || 'Prof. Gabriel Figueiredo',
        timestamp: Date.now()
      };
      try {
        localStorage.setItem('tactical_pending_correction_alert', JSON.stringify(alertData));
        window.dispatchEvent(new CustomEvent('tactical_essay_corrected', { detail: alertData }));
      } catch (_) {}
    }

    await loadData();
  };

  const handleSubmitEssay = async (data: {
    title: string;
    theme: string;
    originalFile: EssayFile;
  }) => {
    await api.submitEssay(data);
    await loadData();
  };

  const handleOpenEssayDetails = (essayId: string) => {
    setSelectedEssayIdForModal(essayId);
  };

  const selectedEssayObject = essays.find(e => e.id === selectedEssayIdForModal);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 overflow-x-hidden">
      {/* Top Bar Contract (3 zones) */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setEssayFilterStatus('Todas');
        }}
        onOpenSubmitEssay={!isEffectiveTeacher ? () => setShowSubmitModal(true) : undefined}
        essays={essays}
        onOpenEssayDetails={handleOpenEssayDetails}
        viewingAsStudent={viewingAsStudent}
        onToggleStudentView={() => {
          setViewingAsStudent(prev => !prev);
          setCurrentTab('overview');
        }}
      />

      {/* Banner Superior Modo de Pré-visualização do Aluno */}
      {viewingAsStudent && (
        <aside 
          aria-label="Barra de modo aluno ativo" 
          className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-slate-950 px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-bold shadow-md sticky top-16 z-30 border-b border-amber-600"
        >
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-slate-950 text-amber-400">
              <Eye className="w-4 h-4" />
            </span>
            <span>
              MODO ALUNO ATIVO: Você está navegando e experimentando a plataforma exatamente como um estudante.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setViewingAsStudent(false);
              setCurrentTab('overview');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 text-amber-300 hover:text-amber-200 text-xs font-extrabold transition-all cursor-pointer shadow-sm ml-auto"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Voltar ao Painel do Professor</span>
          </button>
        </aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* PROFESSOR VIEWS */}
        {isEffectiveTeacher ? (
          <>
            {currentTab === 'overview' && (
              <TeacherOverview
                stats={teacherStats}
                onNavigateToEssays={(status) => {
                  if (status) setEssayFilterStatus(status);
                  setCurrentTab('essays');
                }}
                onNavigateToStudents={() => setCurrentTab('students')}
                onOpenEssayDetails={handleOpenEssayDetails}
              />
            )}

            {currentTab === 'essays' && (
              <TeacherEssays
                essays={essays}
                onSaveCorrection={handleSaveCorrection}
                selectedFilterStatus={essayFilterStatus}
                onRefresh={loadData}
              />
            )}

            {currentTab === 'proposals' && (
              <ThematicProposalsView isTeacher={true} />
            )}

            {currentTab === 'students' && (
              <TeacherStudents
                students={students}
                onRefresh={loadData}
                onOpenEssayDetails={handleOpenEssayDetails}
              />
            )}

            {currentTab === 'study-hub' && (
              <StudyHub
                boards={boards}
                textGuides={textGuides}
                tacticalMethod={tacticalMethod}
                isTeacher={true}
                onRefresh={loadData}
              />
            )}

            {currentTab === 'ranking' && (
              <RankingView
                ranking={ranking}
                currentUserId={user.id}
              />
            )}

            {currentTab === 'credentials' && (
              <TeacherCredentialsTab />
            )}
          </>
        ) : (
          /* ALUNO VIEWS */
          <>
            {currentTab === 'overview' && (
              <StudentOverview
                user={effectiveStudentUser}
                stats={previewStudentStats}
                recentEssays={essays}
                weeklyMission={weeklyMissionData}
                onOpenSubmitEssay={() => setShowSubmitModal(true)}
                onNavigateToEssays={() => setCurrentTab('my-essays')}
                onNavigateToEvolution={() => setCurrentTab('evolution')}
                onNavigateToStudyHub={() => setCurrentTab('study-hub')}
                onOpenWeeklyMission={() => setShowWeeklyMissionModal(true)}
                onOpenEssayDetails={handleOpenEssayDetails}
              />
            )}

            {currentTab === 'my-essays' && (
              <StudentEssays
                essays={essays}
                onOpenSubmitModal={() => setShowSubmitModal(true)}
                onRefresh={loadData}
              />
            )}

            {currentTab === 'proposals' && (
              <ThematicProposalsView
                isTeacher={false}
                onSelectThemeForEssay={(themeTitle) => {
                  setPreselectedTheme(themeTitle);
                  setShowSubmitModal(true);
                }}
              />
            )}

            {currentTab === 'evolution' && (
              <StudentEvolution
                stats={previewStudentStats}
                onNavigateToEssays={() => setCurrentTab('my-essays')}
                studentName={effectiveStudentUser.name}
                targetExam={effectiveStudentUser.targetExam}
              />
            )}

            {currentTab === 'study-hub' && (
              <StudyHub
                boards={boards}
                textGuides={textGuides}
                tacticalMethod={tacticalMethod}
                isTeacher={false}
                onRefresh={loadData}
              />
            )}

            {currentTab === 'ranking' && (
              <RankingView
                ranking={ranking}
                currentUserId={user.id}
              />
            )}

            {currentTab === 'credentials' && (
              <TeacherCredentialsTab />
            )}
          </>
        )}
      </main>

      {/* Global Student Submit Essay Modal */}
      <StudentSubmitEssayModal
        isOpen={showSubmitModal}
        onClose={() => {
          setShowSubmitModal(false);
          setPreselectedTheme('');
        }}
        onSubmitEssay={handleSubmitEssay}
        targetExam={user.targetExam}
        preselectedTheme={preselectedTheme}
      />

      {/* Global Weekly Mission Modal */}
      {weeklyMissionData && (
        <WeeklyMissionModal
          mission={weeklyMissionData}
          isOpen={showWeeklyMissionModal}
          onClose={() => setShowWeeklyMissionModal(false)}
          onNavigateToStudyHub={() => {
            setShowWeeklyMissionModal(false);
            setCurrentTab('study-hub');
          }}
          onOpenSubmitEssay={() => {
            setShowWeeklyMissionModal(false);
            setShowSubmitModal(true);
          }}
        />
      )}

      {/* Essay Detail / Correction Modal */}
      {selectedEssayObject && (
        <EssayCorrectionModal
          essay={selectedEssayObject}
          isOpen={!!selectedEssayObject}
          onClose={() => setSelectedEssayIdForModal(null)}
          onSaveCorrection={async (essayId, data) => {
            await handleSaveCorrection(essayId, data);
            setSelectedEssayIdForModal(null);
          }}
        />
      )}

      {/* Student Essay Correction Toast Notifications */}
      {!isTeacher && (
        <CorrectionToasts
          user={user}
          essays={essays}
          onOpenEssayCorrection={handleOpenEssayDetails}
        />
      )}

      {/* Professor First Access Password Modal (Garante Exclusividade de Acesso) */}
      {showFirstAccessModal && isTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-700">
                  Primeiro Acesso · Professor
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  Proteja seu Módulo Exclusivo
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Para garantir que <strong>somente você</strong> tenha acesso ao Painel do Professor, à gestão de redações e à validação de pagamentos dos alunos, substitua a senha inicial (<code className="font-mono text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1 py-0.5 rounded">123456</code>) por sua senha pessoal definitiva.
            </p>

            {firstAccessError && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{firstAccessError}</span>
              </div>
            )}

            {firstAccessSuccess && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{firstAccessSuccess}</span>
              </div>
            )}

            <form onSubmit={handleFirstAccessPasswordSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nova Senha Pessoal Definitiva *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="password"
                    value={firstAccessNewPwd}
                    onChange={(e) => setFirstAccessNewPwd(e.target.value)}
                    placeholder="Mínimo de 6 dígitos"
                    required
                    className="block w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Confirmar Nova Senha *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="password"
                    value={firstAccessConfirmPwd}
                    onChange={(e) => setFirstAccessConfirmPwd(e.target.value)}
                    placeholder="Repita a nova senha"
                    required
                    className="block w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.setItem('portugues_tatico_dismissed_first_access', 'true');
                    setShowFirstAccessModal(false);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer order-2 sm:order-1"
                >
                  Manter senha padrão temporariamente
                </button>

                <button
                  type="submit"
                  disabled={firstAccessLoading}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-60 order-1 sm:order-2 flex items-center justify-center gap-1.5"
                >
                  {firstAccessLoading ? 'Salvando...' : (
                    <>
                      <span>Salvar Senha Pessoal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400 shadow-xs transition-colors no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              Português Tático © {new Date().getFullYear()} · Prof. Gabriel Figueiredo · Todos os direitos reservados.
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Método Português Tático · Acesso Restrito & Protegido · <strong className="text-amber-700 dark:text-amber-400 font-semibold">Bons estudos e Deus te abençoe</strong>
            </p>
          </div>

          {/* Social Links on Footer */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              title="Fale com o Prof. Gabriel no WhatsApp (Tirar Dúvidas)"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>WhatsApp do Professor</span>
            </a>

            <a
              href="https://www.youtube.com/@Portuguestatico"
              target="_blank"
              rel="noopener noreferrer"
              title="Canal Português Tático no YouTube"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white dark:bg-rose-950/50 dark:hover:bg-rose-600 border border-rose-200 dark:border-rose-900 text-xs font-semibold transition-all cursor-pointer"
            >
              <YouTubeIcon className="w-4 h-4" />
              <span className="hidden sm:inline">YouTube</span>
            </a>

            <a
              href="https://www.instagram.com/portuguestatico_/"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram @portuguestatico_"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-pink-50 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-600 hover:to-purple-600 text-pink-600 hover:text-white dark:bg-pink-950/50 border border-pink-200 dark:border-pink-900 text-xs font-semibold transition-all cursor-pointer"
            >
              <InstagramIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Instagram</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button on all pages */}
      <FloatingWhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
