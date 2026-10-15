import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { User, StudentStats, Essay, WeeklyMission } from '../../types/index.ts';
import { TacticalTipsCarousel } from './TacticalTipsCarousel.tsx';
import { 
  FileText, 
  CheckCircle, 
  Award, 
  TrendingUp, 
  Target, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  Plus,
  BookOpen,
  AlertCircle,
  Bell,
  LogOut
} from 'lucide-react';

interface StudentOverviewProps {
  user: User;
  stats: StudentStats;
  recentEssays: Essay[];
  weeklyMission: (WeeklyMission & { progressPercent: number; completedCount: number; totalTasks: number }) | null;
  onOpenSubmitEssay: () => void;
  onNavigateToEssays: () => void;
  onNavigateToEvolution: () => void;
  onNavigateToStudyHub: () => void;
  onOpenWeeklyMission: () => void;
  onOpenEssayDetails: (essayId: string) => void;
}

export const StudentOverview: React.FC<StudentOverviewProps> = ({
  user,
  stats,
  recentEssays,
  weeklyMission,
  onOpenSubmitEssay,
  onNavigateToEssays,
  onNavigateToEvolution,
  onNavigateToStudyHub,
  onOpenWeeklyMission,
  onOpenEssayDetails
}) => {
  const { logout } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Banner (Section 9: Olá, [Nome do aluno]!) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-200/25 to-amber-50/10 dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 border border-amber-300/80 dark:border-amber-800/80 p-6 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                Área de Treinamento Tático
              </span>
              {user.targetExam && (
                <>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-700 font-semibold">{user.targetExam}</span>
                </>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Olá, {user.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
              Seu painel estratégico de preparação para concursos públicos. Envie novas redações, pratique a questão do dia e monitore sua evolução rumo à nota 10.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                const corrected = recentEssays.find(e => e.status === 'Corrigida' && e.correction);
                window.dispatchEvent(new CustomEvent('tactical_essay_corrected', {
                  detail: {
                    essayId: corrected?.id || 'demo-essay-toast',
                    studentId: user.id,
                    title: corrected?.title || corrected?.theme || 'A Segurança Pública no Brasil',
                    theme: corrected?.theme || 'A Segurança Pública no Brasil',
                    grade: corrected?.correction?.grade || 9.5,
                    feedback: corrected?.correction?.feedback || 'Excelente aplicação do Método Tático na dissertação.',
                    teacherName: 'Prof. Gabriel Figueiredo'
                  }
                }));
              }}
              title="Disparar uma notificação toast de redação corrigida para teste"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-300 dark:border-amber-800 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 animate-pulse" />
              <span>Testar Toast</span>
            </button>

            <button
              onClick={onOpenSubmitEssay}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Enviar Nova Redação</span>
            </button>

            <button
              type="button"
              onClick={() => logout()}
              title="Sair da plataforma (Logout)"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-300 dark:border-rose-800 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dicas Táticas do Dia - Carrossel Motivacional do Prof. Gabriel */}
      <TacticalTipsCarousel />

      {/* 4 Metric Indicators Focused on Essays */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Redações enviadas */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Redações Enviadas</span>
          <div className="mt-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {stats.essaysSubmitted}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Total submetido</span>
        </div>

        {/* 2. Redações corrigidas */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Redações Corrigidas</span>
          <div className="mt-2">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
              {stats.essaysCorrected}
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Com parecer emitido</span>
        </div>

        {/* 3. Média */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Média das Notas</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-amber-700 dark:text-amber-400 font-mono tabular-nums">
              {stats.averageGrade > 0 ? stats.averageGrade.toFixed(1) : '—'}
            </span>
            <span className="text-xs text-slate-400">/10</span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Todas as avaliações</span>
        </div>

        {/* 4. Melhor nota */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Melhor Nota</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-500 font-mono tabular-nums">
              {stats.highestGrade > 0 ? stats.highestGrade.toFixed(1) : '—'}
            </span>
            <span className="text-xs text-slate-400">/10</span>
          </div>
          <span className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">Classificação</span>
        </div>
      </div>

      {/* Feature Cards: Missão da Semana & Central de Estudos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Missão Tática da Semana */}
        {weeklyMission && (
          <div className="bg-white border border-slate-200 hover:border-amber-400 rounded-xl p-5 flex flex-col justify-between shadow-xs transition-colors">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                  <Target className="w-4 h-4" />
                  <span>Missão Tática da Semana</span>
                </div>
                <span className="font-mono text-xs font-bold text-amber-700">
                  {weeklyMission.progressPercent}% Concluída
                </span>
              </div>

              <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                {weeklyMission.objective}
              </h3>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200 my-2">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                  style={{ width: `${weeklyMission.progressPercent}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-500 line-clamp-1">
                {weeklyMission.completedCount} de {weeklyMission.totalTasks} tarefas estratégicas finalizadas
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Ciclo semanal automatizado</span>
              <button
                onClick={onOpenWeeklyMission}
                className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors cursor-pointer"
              >
                <span>Ver Tarefas da Missão</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Central de Estudos e Guias Táticos */}
        <div className="bg-white border border-slate-200 hover:border-amber-400 rounded-xl p-5 flex flex-col justify-between shadow-xs transition-colors">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                <BookOpen className="w-4 h-4" />
                <span>Central de Estudos Táticos</span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-amber-50 text-amber-800 border-amber-200">
                Doutrina & Bancas
              </span>
            </div>

            <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
              Método Tático & Análise de Bancas
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mt-1">
              Consulte os manuais de bancas (Cebraspe, FGV, Vunesp, EsPCEx) e aprenda técnicas cirúrgicas de introdução, argumentação e conclusão.
            </p>
          </div>

          <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Guias de redação do Prof. Gabriel</span>
            <button
              onClick={onNavigateToStudyHub}
              className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors cursor-pointer"
            >
              <span>Acessar Central</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Seção: Minhas Últimas Redações */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Minhas Últimas Redações</h2>
            <p className="text-xs text-slate-500">Histórico recente de envios e correções</p>
          </div>

          <button
            onClick={onNavigateToEssays}
            className="text-xs font-medium text-amber-700 hover:text-amber-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Ver todas as minhas redações</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile View for Recent Essays (Celular e Tablet) */}
        <div className="sm:hidden divide-y divide-slate-100">
          {recentEssays.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              Você ainda não submeteu redações. Clique em &quot;Enviar Nova Redação&quot; para começar seu treinamento.
            </div>
          ) : (
            recentEssays.slice(0, 4).map((essay) => {
              const isCorrected = essay.status === 'Corrigida' && !!essay.correction;
              return (
                <div
                  key={essay.id}
                  onClick={() => onOpenEssayDetails(essay.id)}
                  className="p-4 space-y-2.5 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold text-xs text-slate-900 leading-snug">
                      {essay.title || essay.theme}
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${
                      isCorrected ? 'text-emerald-800 bg-emerald-50 border-emerald-200' : 'text-amber-800 bg-amber-50 border-amber-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isCorrected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                      {essay.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {essay.theme}
                  </p>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                    <span className="text-slate-500 font-mono">
                      {new Date(essay.submittedAt).toLocaleDateString('pt-BR')}
                    </span>
                    <div className="flex items-center gap-2">
                      {isCorrected && (
                        <span className="font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300 font-mono text-[11px]">
                          Nota: {essay.correction!.grade.toFixed(1)}
                        </span>
                      )}
                      <span className="text-amber-700 font-semibold text-xs">
                        {isCorrected ? 'Ver Correção →' : 'Detalhes →'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop / Tablet Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="py-3 px-5">Tema da Redação</th>
                <th className="py-3 px-5">Data de Envio</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-center">Nota</th>
                <th className="py-3 px-5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentEssays.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Você ainda não submeteu redações. Clique em &quot;Enviar Nova Redação&quot; para começar seu treinamento.
                  </td>
                </tr>
              ) : (
                recentEssays.slice(0, 4).map((essay) => {
                  const isCorrected = essay.status === 'Corrigida' && !!essay.correction;
                  return (
                    <tr
                      key={essay.id}
                      onClick={() => onOpenEssayDetails(essay.id)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-5 max-w-sm">
                        <div className="font-semibold text-slate-900 group-hover:text-amber-700 transition-colors truncate">
                          {essay.title || essay.theme}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {essay.theme}
                        </div>
                      </td>

                      <td className="py-3.5 px-5 font-mono text-[11px] text-slate-500 tabular-nums whitespace-nowrap">
                        {new Date(essay.submittedAt).toLocaleDateString('pt-BR')}
                      </td>

                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${
                          isCorrected ? 'text-emerald-700' : 'text-amber-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isCorrected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                          }`} />
                          {essay.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-5 text-center font-mono font-bold text-sm tabular-nums whitespace-nowrap">
                        {isCorrected ? (
                          <span className="text-amber-800 px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                            {essay.correction!.grade.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal text-xs">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenEssayDetails(essay.id);
                          }}
                          className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                            isCorrected
                              ? 'bg-amber-600 text-white hover:bg-amber-700'
                              : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                          }`}
                        >
                          {isCorrected ? 'Ver Correção' : 'Ver Detalhes'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
