import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { TeacherCredentialsModal } from './TeacherCredentialsModal.tsx';
import { SupabaseIntegrationModal } from './SupabaseIntegrationModal.tsx';
import { 
  FileClock, 
  CheckCircle, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  FileText, 
  UserPlus, 
  HelpCircle,
  Calendar,
  Sparkles,
  LogOut,
  KeyRound,
  ShieldCheck,
  Database
} from 'lucide-react';

interface TeacherOverviewProps {
  stats: {
    pendingEssays: number;
    correctedEssays: number;
    activeStudents: number;
    averageGrade: number;
    totalEssays: number;
    recentActivity: Array<{
      id: string;
      studentName: string;
      studentId: string;
      theme: string;
      title: string;
      submittedAt: string;
      status: string;
      grade?: number;
    }>;
  };
  onNavigateToEssays: (filterStatus?: string) => void;
  onNavigateToStudents: () => void;
  onOpenEssayDetails: (essayId: string) => void;
}

export const TeacherOverview: React.FC<TeacherOverviewProps> = ({
  stats,
  onNavigateToEssays,
  onNavigateToStudents,
  onOpenEssayDetails,
}) => {
  const { user, logout } = useAuth();
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-200/25 to-amber-50/10 dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 border border-amber-300/80 dark:border-amber-800/80 p-6 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                Painel Administrativo
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Coordenação Pedagógica</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Painel de Controle do Professor
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              Gerencie suas redações e acompanhe seus alunos com precisão tática e feedback cirúrgico.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateToEssays('Pendente')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <FileClock className="w-4 h-4 text-white" />
              <span>Corrigir Pendentes ({stats.pendingEssays})</span>
            </button>
            <button
              onClick={onNavigateToStudents}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>Novo Aluno</span>
            </button>
            <button
              type="button"
              onClick={() => setShowSupabaseModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-200 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 rounded-lg shadow-2xs transition-colors cursor-pointer"
              title="Gerenciar e Executar Migrações do Supabase"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Supabase & Migrações</span>
            </button>
            <button
              type="button"
              onClick={() => setShowCredentialsModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-900 dark:text-amber-200 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/70 dark:hover:bg-amber-900/70 border border-amber-300 dark:border-amber-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
              title="Alterar seu Login de Acesso e Senha do Sistema"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Mudar Meu Login & Senha</span>
            </button>
            <button
              type="button"
              onClick={() => logout()}
              title="Sair do sistema (Logout)"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-300 dark:border-rose-800 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Main Indicator Cards (Section 4 Requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Indicator 1: Redações Pendentes */}
        <div 
          onClick={() => onNavigateToEssays('Pendente')}
          className="bg-white border border-slate-200 hover:border-amber-400 rounded-xl p-5 shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-3">
            <span>Redações Pendentes</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700 group-hover:bg-amber-100 transition-colors">
              <FileClock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {stats.pendingEssays}
            </span>
            <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-0.5">
              Aguardando análise <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Textos enviados pelos alunos que necessitam de correção
          </p>
        </div>

        {/* Indicator 2: Redações Corrigidas */}
        <div 
          onClick={() => onNavigateToEssays('Corrigida')}
          className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-3">
            <span>Redações Corrigidas</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-emerald-600 font-mono tabular-nums">
              {stats.correctedEssays}
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold">
              Histórico consolidado
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Total de redações avaliadas com notas e arquivos entregues
          </p>
        </div>

        {/* Indicator 3: Alunos Ativos */}
        <div 
          onClick={onNavigateToStudents}
          className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-3">
            <span>Alunos Ativos</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {stats.activeStudents}
            </span>
            <span className="text-[11px] text-blue-700 font-semibold">
              Matrículas ativas
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Concurseiros em treinamento para carreiras civis e militares
          </p>
        </div>

        {/* Indicator 4: Nota Média Geral */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-3">
            <span>Nota Média Geral</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-amber-700 font-mono tabular-nums">
                {stats.averageGrade > 0 ? stats.averageGrade.toFixed(1) : '—'}
              </span>
              <span className="text-xs text-slate-400">/ 10,0</span>
            </div>
            <span className="text-[11px] text-amber-800 font-semibold">
              Desempenho da turma
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Média ponderada de todas as correções atribuídas
          </p>
        </div>
      </div>

      {/* Atividade Recente (Section 4 Requirement) */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Atividade Recente</h2>
            <p className="text-xs text-slate-500">Últimos envios de redações e atualizações dos alunos</p>
          </div>
          <button
            onClick={() => onNavigateToEssays()}
            className="text-xs font-medium text-amber-700 hover:text-amber-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            Ver todas as redações
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile View for Recent Activity (Celular e Tablet) */}
        <div className="sm:hidden divide-y divide-slate-100">
          {stats.recentActivity.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              Nenhuma atividade recente registrada.
            </div>
          ) : (
            stats.recentActivity.map((item) => {
              const isPending = item.status === 'Pendente';
              return (
                <div
                  key={item.id}
                  onClick={() => onOpenEssayDetails(item.id)}
                  className="p-4 space-y-2.5 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">
                        {item.studentName}
                      </h4>
                      <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                        {item.theme}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${
                      isPending ? 'text-amber-800 bg-amber-50 border-amber-200' : 'text-emerald-800 bg-emerald-50 border-emerald-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isPending ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                    <span className="text-slate-500 font-mono">
                      {new Date(item.submittedAt).toLocaleDateString('pt-BR')}
                    </span>
                    <div className="flex items-center gap-2">
                      {item.grade !== undefined && item.grade !== null && (
                        <span className="font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300 font-mono text-[11px]">
                          Nota: {item.grade.toFixed(1)}
                        </span>
                      )}
                      <span className="text-amber-700 font-semibold text-xs">
                        {isPending ? 'Corrigir →' : 'Detalhes →'}
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
                <th className="py-3 px-5">Aluno</th>
                <th className="py-3 px-5">Tema da Redação</th>
                <th className="py-3 px-5">Data de Envio</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Nota</th>
                <th className="py-3 px-5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.recentActivity.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Nenhuma atividade recente registrada.
                  </td>
                </tr>
              ) : (
                stats.recentActivity.map((item) => {
                  const isPending = item.status === 'Pendente';
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-5 font-semibold text-slate-900">
                        {item.studentName}
                      </td>
                      <td className="py-3.5 px-5 text-slate-700 max-w-xs truncate" title={item.theme}>
                        {item.theme}
                      </td>
                      <td className="py-3.5 px-5 text-slate-500 font-mono text-[11px] tabular-nums whitespace-nowrap">
                        {new Date(item.submittedAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${
                          isPending ? 'text-amber-700' : 'text-emerald-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isPending ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                          }`} />
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right font-mono font-bold text-[13px] tabular-nums whitespace-nowrap">
                        {item.grade !== undefined && item.grade !== null ? (
                          <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{item.grade.toFixed(1)}</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <button
                          onClick={() => onOpenEssayDetails(item.id)}
                          className={`px-2.5 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                            isPending
                              ? 'bg-amber-600 text-white hover:bg-amber-700 font-semibold shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                          }`}
                        >
                          {isPending ? 'Corrigir' : 'Ver Detalhes'}
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

      {/* Modal para Alterar Login e Senha */}
      <TeacherCredentialsModal 
        isOpen={showCredentialsModal} 
        onClose={() => setShowCredentialsModal(false)} 
      />

      {/* Modal para Supabase & Migrações */}
      <SupabaseIntegrationModal
        isOpen={showSupabaseModal}
        onClose={() => setShowSupabaseModal(false)}
      />
    </div>
  );
};
