import React, { useState } from 'react';
import { StudentStats } from '../../types/index.ts';
import { 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  FileText,
  Target,
  BarChart2,
  Bookmark,
  Sparkles,
  Download,
  FileSpreadsheet,
  Check,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
  Zap,
  Activity,
  Calendar,
  Layers,
  HelpCircle
} from 'lucide-react';

interface StudentEvolutionProps {
  stats: StudentStats;
  onNavigateToEssays?: () => void;
  studentName?: string;
  targetExam?: string;
}

export type EvolutionSubTab = 'todos' | 'melhor' | 'menor' | 'media' | 'entregues';

export const StudentEvolution: React.FC<StudentEvolutionProps> = ({
  stats,
  onNavigateToEssays,
  studentName = 'Lucas Mendes da Silva',
  targetExam = 'Polícia Rodoviária Federal (PRF)'
}) => {
  const [activeTab, setActiveTab] = useState<EvolutionSubTab>('todos');
  const [downloadSuccess, setDownloadSuccess] = useState<'csv' | null>(null);

  // Compute calculated metrics
  const highestGrade = stats.highestGrade > 0 
    ? stats.highestGrade 
    : (stats.gradeHistory && stats.gradeHistory.length > 0 
        ? Math.max(...stats.gradeHistory.map(g => g.grade)) 
        : 9.0);

  const lowestGrade = (stats.lowestGrade !== undefined && stats.lowestGrade > 0)
    ? stats.lowestGrade
    : (stats.gradeHistory && stats.gradeHistory.length > 0
        ? Math.min(...stats.gradeHistory.map(g => g.grade))
        : 7.8);

  const averageGrade = stats.averageGrade > 0 
    ? stats.averageGrade 
    : 8.4;

  const essaysSubmitted = stats.essaysSubmitted > 0 
    ? stats.essaysSubmitted 
    : 4;

  const essaysCorrected = stats.essaysCorrected > 0 
    ? stats.essaysCorrected 
    : (stats.gradeHistory && stats.gradeHistory.length > 0 ? stats.gradeHistory.length : 3);

  // Criteria data for "Domínio Tático por Critério de Redação"
  const tacticalCriteria = [
    {
      id: 'estrutura',
      name: 'Estrutura & Tipologia Textual (Paragrafação & Projeto de Texto)',
      score: 9.4,
      percentage: 94,
      level: 'Operacional Avançado',
      badgeColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700',
      feedback: 'Introdução com tese afirmativa indiscutível. Dois desenvolvimentos simétricos com 4 períodos cada, blindando contra quebras de raciocínio.',
      rule: 'Missão 02 e 03 cumpridas com louvor.'
    },
    {
      id: 'repertorio',
      name: 'Repertório Legitimado & Fundamentação Constitucional (CF/88)',
      score: 8.8,
      percentage: 88,
      level: 'Consolidado',
      badgeColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700',
      feedback: 'Uso pertinente do Art. 144 da CF/88 e doutrina de segurança pública. O repertório foi devidamente conectado com a realidade prática das rodovias.',
      rule: 'Repertório de autoridade legítimo presente em todos os parágrafos.'
    },
    {
      id: 'coesao',
      name: 'Coesão Interparágrafos & Conectivos de Alto Impacto',
      score: 9.0,
      percentage: 90,
      level: 'Operacional Avançado',
      badgeColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700',
      feedback: 'Transições perfeitas no início dos desenvolvimentos ("Nesse prisma", "Outrossim") e operador conclusivo clássico ("Depreende-se, portanto").',
      rule: 'Zero repetição de operadores argumentativos.'
    },
    {
      id: 'gramatica',
      name: 'Norma Culta, Sintaxe, Regência, Crase & Pontuação',
      score: 8.2,
      percentage: 82,
      level: 'Em Aperfeiçoamento',
      badgeColor: 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700',
      feedback: 'Redução drástica de desvios de crase. Mantenha atenção nas orações subordinadas adjetivas explicativas para não omitir vírgulas.',
      rule: 'Utilizar o Checklist Tático da Missão 06 antes de passar a limpo.'
    },
    {
      id: 'conclusao',
      name: 'Conclusão Propositiva, Intervenção & Fechamento Crítico',
      score: 8.6,
      percentage: 86,
      level: 'Consolidado',
      badgeColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700',
      feedback: 'Retomada clara da tese com apresentação de agentes institucionais, ações concretas e finalidade alinhada com o interesse público.',
      rule: 'Conclusão fecha sem deixar pontas soltas.'
    }
  ];

  // Global Tactical Mastery Calculation
  const globalMastery = Number((tacticalCriteria.reduce((acc, c) => acc + c.percentage, 0) / tacticalCriteria.length).toFixed(1));

  // Best essay reference
  const bestEssayInfo = {
    title: 'O Fator Humano e a Fadiga no Trânsito Rodoviário',
    grade: highestGrade,
    date: '08/09/2026',
    highlights: [
      'Aplicação exemplar do Art. 144 da Constituição Federal de 1988.',
      'Paragrafação em 4 blocos simétricos de 7 a 8 linhas cada.',
      'Excelente conectividade com operadores argumentativos formais.',
      'Zero desvios graves de regência verbal e nominal.'
    ]
  };

  // Lowest essay reference (nota base para superação)
  const lowestEssayInfo = {
    title: 'O Policiamento Ostensivo e a Preservação da Ordem Pública',
    grade: lowestGrade,
    date: '05/08/2026',
    diagnostic: 'Primeiro texto diagnóstico: identificadas falhas de paragrafação (bloco extenso contínuo) e falta de fundamentação legal expressa.',
    overcomePoints: [
      'Parágrafos fracionados em períodos menores e objetivos.',
      'Inclusão mandatória de base legislativa e jurisprudencial.',
      'Revisão tática no rascunho antes da transposição definitiva.'
    ]
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    const dateStr = new Date().toLocaleDateString('pt-BR');
    const rows = [
      ['RELATÓRIO DE DESEMPENHO E EVOLUÇÃO TÁTICA - PORTUGUÊS TÁTICO'],
      ['Professor Gabriel Figueiredo · Método Tático'],
      ['Aluno', studentName],
      ['Foco / Concurso', targetExam],
      ['Data de Emissão', dateStr],
      [],
      ['1. RESUMO DOS INDICADORES CENTRAIS'],
      ['Métrica', 'Valor', 'Status'],
      ['Melhor Nota Alcançada', highestGrade.toFixed(1), 'Recorde Individual'],
      ['Menor Nota Registrada', lowestGrade.toFixed(1), 'Base de Superação'],
      ['Média Geral das Redações', averageGrade.toFixed(1), 'Média Consolidada'],
      ['Redações Entregues', essaysSubmitted.toString(), `${essaysCorrected} corrigidas`],
      ['Domínio Tático Global', `${globalMastery}%`, 'Nível Avançado'],
      [],
      ['2. DOMÍNIO TÁTICO POR CRITÉRIO DE REDAÇÃO'],
      ['Critério Avaliativo', 'Nota (0 a 10)', 'Aproveitamento (%)', 'Nível'],
      ...tacticalCriteria.map(c => [`"${c.name.replace(/"/g, '""')}"`, c.score.toFixed(1), `${c.percentage}%`, c.level]),
      [],
      ['3. PONTOS DE ATENÇÃO APONTADOS PELO PROF. GABRIEL'],
      ['Critério', 'Ocorrências'],
      ...(stats.frequentAttentionPoints && stats.frequentAttentionPoints.length > 0
        ? stats.frequentAttentionPoints.map(p => [`"${p.criterion.replace(/"/g, '""')}"`, `${p.count} ocorrências`])
        : [
            ['Pontuação em Orações Adjetivas', '3 ocorrências'],
            ['Crase diante de Palavras Femininas', '2 ocorrências'],
            ['Paralelismo Sintático no D2', '1 ocorrência']
          ])
    ];

    const csvContent = '\uFEFF' + rows.map(e => e.join(';')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_evolucao_tatico_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess('csv');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header with Export Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-700">
              Painel de Desempenho Tático
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{studentName} ({targetExam})</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Minha Evolução & Desempenho
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Acompanhamento analítico da sua melhor nota, menor nota, média geral e produção entregue.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 no-print">
          <button
            type="button"
            onClick={handleExportCSV}
            title="Baixar planilha CSV com dados consolidados de notas e desvios"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg shadow-2xs transition-all cursor-pointer"
          >
            {downloadSuccess === 'csv' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">CSV Baixado!</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Exportar CSV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4 CARDS PRINCIPAIS: MELHOR NOTA, MENOR NOTA, MÉDIA GERAL, REDAÇÕES ENTREGUES */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Melhor Nota */}
        <button
          type="button"
          onClick={() => setActiveTab('melhor')}
          className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
            activeTab === 'melhor'
              ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600 shadow-sm ring-1 ring-amber-400/50'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-slate-700 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              Melhor Nota
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-1.5 py-0.5 rounded">
              Pico
            </span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono tabular-nums">
              {highestGrade.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">/ 10,0</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block line-clamp-1">
            Recorde individual de pontuação
          </span>
          {activeTab === 'melhor' && (
            <div className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-500" />
          )}
        </button>

        {/* Card 2: Menor Nota */}
        <button
          type="button"
          onClick={() => setActiveTab('menor')}
          className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
            activeTab === 'menor'
              ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-400 dark:border-slate-600 shadow-sm ring-1 ring-slate-400/50'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-slate-500" />
              Menor Nota
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              Base
            </span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-700 dark:text-slate-300 font-mono tabular-nums">
              {lowestGrade.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">/ 10,0</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block line-clamp-1">
            Produção inicial superada
          </span>
          {activeTab === 'menor' && (
            <div className="absolute bottom-0 inset-x-0 h-0.5 bg-slate-500" />
          )}
        </button>

        {/* Card 3: Média Geral */}
        <button
          type="button"
          onClick={() => setActiveTab('media')}
          className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
            activeTab === 'media'
              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600 shadow-sm ring-1 ring-emerald-400/50'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-slate-700 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              Média Geral
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded">
              Consolidada
            </span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
              {averageGrade.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">/ 10,0</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block line-clamp-1">
            Todas as redações corrigidas
          </span>
          {activeTab === 'media' && (
            <div className="absolute bottom-0 inset-x-0 h-0.5 bg-emerald-500" />
          )}
        </button>

        {/* Card 4: Redações Entregues */}
        <button
          type="button"
          onClick={() => setActiveTab('entregues')}
          className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
            activeTab === 'entregues'
              ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600 shadow-sm ring-1 ring-amber-400/50'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-slate-700 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              Redações Entregues
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-1.5 py-0.5 rounded">
              Volume
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {essaysSubmitted}
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 font-mono">
              ({essaysCorrected} corrigidas)
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block line-clamp-1">
            Cadência contínua de escrita
          </span>
          {activeTab === 'entregues' && (
            <div className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-500" />
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* NAVEGAÇÃO DE ABAS DE EVOLUÇÃO E DESEMPENHO                                */}
      {/* ========================================================================= */}
      <div className="border-b border-slate-200 dark:border-slate-800 no-print">
        <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto pb-px scrollbar-none touch-pan-x">
          {[
            { id: 'todos', label: 'Todos os Indicadores', icon: BarChart2 },
            { id: 'melhor', label: 'Melhor Nota', icon: Award },
            { id: 'menor', label: 'Menor Nota', icon: Target },
            { id: 'media', label: 'Média Geral', icon: TrendingUp },
            { id: 'entregues', label: 'Redações Entregues', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as EvolutionSubTab)}
                className={`flex items-center gap-1.5 py-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                  isActive
                    ? 'border-amber-600 text-amber-800 dark:text-amber-400 dark:border-amber-500'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ========================================================================= */}
      {/* ABA: MELHOR NOTA (DETALHAMENTO DO PICO)                                   */}
      {/* ========================================================================= */}
      {activeTab === 'melhor' && (
        <div className="space-y-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-amber-50/40 dark:from-amber-950/30 dark:via-slate-900 dark:to-amber-950/20 border border-amber-200 dark:border-amber-800/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded">
                  Pico de Rendimento Registrado
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  Sua Melhor Nota: {highestGrade.toFixed(1)} / 10,0
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Produção com maior aproveitamento metodológico nos critérios avaliativos da banca.
                </p>
              </div>

              <div className="text-left sm:text-right bg-white dark:bg-slate-800/80 px-3.5 py-2 rounded-xl border border-amber-200/80 dark:border-amber-800/60 shadow-2xs">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Redação Referência</span>
                <strong className="text-xs text-slate-800 dark:text-slate-200 line-clamp-1">{bestEssayInfo.title}</strong>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Fatores Determinantes para Alcançar Essa Nota:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {bestEssayInfo.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Diretriz: replique exatamente a mesma estrutura de tópicos na sua próxima entrega.
              </span>
              {onNavigateToEssays && (
                <button
                  type="button"
                  onClick={onNavigateToEssays}
                  className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Abrir na Lista de Redações</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA: MENOR NOTA (DIAGNÓSTICO E SUPERAÇÃO)                                  */}
      {/* ========================================================================= */}
      {activeTab === 'menor' && (
        <div className="space-y-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  Base Inicial Superada
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-2">
                  <Target className="w-5 h-5 text-slate-500" />
                  Sua Menor Nota: {lowestGrade.toFixed(1)} / 10,0
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Identificação das falhas pontuais do texto base e como elas foram superadas nas produções posteriores.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Texto Base</span>
                <strong className="text-xs text-slate-800 dark:text-slate-200 line-clamp-1">{lowestEssayInfo.title}</strong>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Diagnóstico Base do Professor:
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed">
                "{lowestEssayInfo.diagnostic}"
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Medidas Corretivas Adotadas com Sucesso:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {lowestEssayInfo.overcomePoints.map((pt, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 font-medium flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA: MÉDIA GERAL (ANÁLISE DE REGULARIDADE E CONSISTÊNCIA)                 */}
      {/* ========================================================================= */}
      {activeTab === 'media' && (
        <div className="space-y-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-700">
                  Consolidação Global
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Média Geral: {averageGrade.toFixed(1)} / 10,0
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Índice ponderado de todas as redações avaliadas pela banca do Professor Gabriel.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-4 py-2 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Linha de Corte da Vaga</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">8.5 pts</span>
                </div>
                <div className="w-px h-8 bg-emerald-200 dark:bg-emerald-800" />
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Status Atual</span>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Na Faixa Competitiva
                  </span>
                </div>
              </div>
            </div>

            {/* Historical Grade Entries */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Histórico das Notas que Compõem a Média:
              </h4>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                {(stats.gradeHistory && stats.gradeHistory.length > 0 ? stats.gradeHistory : [
                  { title: 'O Policiamento Ostensivo e a Ordem Pública', date: '05/08/2026', grade: 7.8 },
                  { title: 'Segurança Viária e Fiscalização Eletrônica', date: '20/08/2026', grade: 8.4 },
                  { title: 'O Fator Humano e a Fadiga no Trânsito Rodoviário', date: '08/09/2026', grade: 9.0 }
                ]).map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">{item.title}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{item.date}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-base font-bold font-mono text-amber-700 dark:text-amber-400 tabular-nums">
                        {item.grade.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">/ 10,0</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA: REDAÇÕES ENTREGUES (VOLUME E CONTROLE DE FLUXO)                      */}
      {/* ========================================================================= */}
      {activeTab === 'entregues' && (
        <div className="space-y-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-700">
                  Volume de Produção Tática
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  {essaysSubmitted} Redações Entregues ({essaysCorrected} Corrigidas)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  A regularidade no envio garante a fixação muscular da tipologia dissertativa-argumentativa.
                </p>
              </div>

              {onNavigateToEssays && (
                <button
                  type="button"
                  onClick={onNavigateToEssays}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
                >
                  Ver Todas na Aba Redações
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Total de Envios</span>
                <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">{essaysSubmitted}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Produções submetidas</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60">
                <span className="text-xs text-emerald-800 dark:text-emerald-300 block mb-1">Corrigidas & Analisadas</span>
                <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">{essaysCorrected}</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-1">Com espelho e nota lançada</span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60">
                <span className="text-xs text-amber-800 dark:text-amber-300 block mb-1">Aguardando Avaliação</span>
                <span className="text-2xl font-extrabold text-amber-700 dark:text-amber-400 font-mono">
                  {Math.max(0, essaysSubmitted - essaysCorrected)}
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 block mt-1">Em fila de correção</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA: TODOS OS INDICADORES (CRITÉRIOS ANALÍTICOS & PONTOS DE ATENÇÃO)      */}
      {/* ========================================================================= */}
      {(activeTab === 'todos') && (
        <div className="space-y-6">
          {/* DASHBOARD: DOMÍNIO TÁTICO POR CRITÉRIO DE REDAÇÃO */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6 shadow-sm transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-700">
                    Avaliação Analítica do Espelho
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Critérios Oficiais das Bancas</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  Domínio Tático por Critério de Redação
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Diagnóstico detalhado de desempenho em cada competência avaliativa do Método Português Tático.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 px-3.5 py-1.5 rounded-xl self-start sm:self-auto shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <div className="text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Domínio Global:</span>{' '}
                  <strong className="text-amber-900 dark:text-amber-200 font-mono font-extrabold text-sm">{globalMastery}%</strong>
                </div>
              </div>
            </div>

            {/* Tactical Criteria Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {tacticalCriteria.map((c) => (
                <div 
                  key={c.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 shadow-2xs hover:border-amber-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                        {c.name}
                      </h3>
                      <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.badgeColor}`}>
                        {c.level}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-lg sm:text-xl font-extrabold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
                        {c.score.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {c.percentage}% domínio
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${
                        c.percentage >= 90
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                          : c.percentage >= 80
                          ? 'bg-gradient-to-r from-amber-500 to-emerald-500'
                          : 'bg-gradient-to-r from-rose-500 to-amber-500'
                      }`}
                      style={{ width: `${c.percentage}%` }}
                    />
                  </div>

                  {/* Feedback */}
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/70 dark:border-slate-700">
                    {c.feedback}
                  </p>

                  {/* Golden Rule Tag */}
                  <div className="flex items-center gap-1.5 text-[10px] text-amber-800 dark:text-amber-300 font-medium">
                    <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                    <span>Diretriz: {c.rule}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mapeamento de Pontos de Atenção Mais Apontados */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 space-y-5 shadow-xs transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                  Mapeamento de Desvios
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Pontos de Atenção Mais Apontados nas Correções
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Critérios que mais receberam observações para orientar sua revisão cirúrgica antes de passar a limpo.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4.5 space-y-3">
                {(!stats.frequentAttentionPoints || stats.frequentAttentionPoints.length === 0) ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { criterion: 'Pontuação em Orações Adjetivas', count: 3 },
                      { criterion: 'Crase diante de Palavras Femininas', count: 2 },
                      { criterion: 'Paralelismo Sintático no D2', count: 1 }
                    ].map(pt => (
                      <div
                        key={pt.criterion}
                        className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs shadow-2xs"
                      >
                        <span className="font-medium text-slate-800 dark:text-slate-200">{pt.criterion}</span>
                        <span className="text-[11px] font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                          {pt.count}x
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {stats.frequentAttentionPoints.map(pt => (
                      <div
                        key={pt.criterion}
                        className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs shadow-2xs"
                      >
                        <span className="font-medium text-slate-800 dark:text-slate-200">{pt.criterion}</span>
                        <span className="text-[11px] font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                          {pt.count}x
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
