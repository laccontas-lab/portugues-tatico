import React, { useState, useMemo } from 'react';
import { THEMATIC_AXES, ALL_THEMES, EssayThemeProposal, ThematicAxis } from '../../data/thematicAxes.ts';
import { 
  Sparkles, 
  Search, 
  BookOpen, 
  Layers, 
  PenTool, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Shuffle, 
  Scale, 
  Shield, 
  FileText,
  Lightbulb,
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';

interface ThematicProposalsViewProps {
  onSelectThemeForEssay?: (themeTitle: string) => void;
  isTeacher?: boolean;
}

export const ThematicProposalsView: React.FC<ThematicProposalsViewProps> = ({
  onSelectThemeForEssay,
  isTeacher = false
}) => {
  const [selectedAxisNumber, setSelectedAxisNumber] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedThemeId, setExpandedThemeId] = useState<string | null>(null);
  const [copiedThemeId, setCopiedThemeId] = useState<string | null>(null);

  // Filtered themes list
  const filteredThemes = useMemo(() => {
    return ALL_THEMES.filter(theme => {
      const matchesAxis = selectedAxisNumber === 'all' || theme.axisNumber === selectedAxisNumber;
      if (!matchesAxis) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchTitle = theme.title.toLowerCase().includes(q);
      const matchAxis = theme.axisTitle.toLowerCase().includes(q);
      const matchPrompt = theme.prompt.toLowerCase().includes(q);
      const matchRepertoire = theme.repertoire.some(r => r.toLowerCase().includes(q));

      return matchTitle || matchAxis || matchPrompt || matchRepertoire;
    });
  }, [selectedAxisNumber, searchQuery]);

  const handleCopyTheme = (theme: EssayThemeProposal) => {
    navigator.clipboard.writeText(`Tema de Redação: ${theme.title}\n(${theme.axisTitle})`);
    setCopiedThemeId(theme.id);
    setTimeout(() => {
      setCopiedThemeId(null);
    }, 2000);
  };

  const handleRandomTheme = () => {
    const randomIndex = Math.floor(Math.random() * ALL_THEMES.length);
    const chosen = ALL_THEMES[randomIndex];
    setSelectedAxisNumber(chosen.axisNumber);
    setExpandedThemeId(chosen.id);
    // Smooth scroll to the element
    setTimeout(() => {
      const el = document.getElementById(chosen.id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const selectedAxisData = selectedAxisNumber !== 'all' 
    ? THEMATIC_AXES.find(a => a.number === selectedAxisNumber) 
    : null;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-2xl p-6 sm:p-8 border border-amber-500/30 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-md border border-amber-400/40">
              Acervo Oficial · Professor Gabriel Figueiredo
            </span>
            <span className="text-xs text-amber-200/60 hidden sm:inline">·</span>
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              100 Propostas Exclusivas
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Temas e Propostas de Redação
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Consulte os <strong className="text-amber-300 font-semibold">10 Eixos Temáticos</strong> indispensáveis para concursos policiais, civis, militares e vestibulares de alto rendimento. Escolha qualquer proposta e comece a escrever imediatamente.
          </p>

          {/* Quick Stats & Action */}
          <div className="mt-5 flex flex-wrap items-center gap-3 pt-4 border-t border-slate-700/60">
            <div className="flex items-center gap-2 text-xs text-amber-200 font-semibold bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
              <span>📚 10 Eixos Estruturados</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
              <span>✍️ 100 Propostas Táticas</span>
            </div>
            <button
              onClick={handleRandomTheme}
              className="ml-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Sortear Tema de Treino</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Axis Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por palavra-chave (ex: inteligência artificial, violência, meio ambiente, CF/88)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Eixos Temáticos - Desktop and Mobile Tabs */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3 h-3 text-amber-500" />
              Selecione o Eixo Temático:
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {filteredThemes.length} {filteredThemes.length === 1 ? 'tema encontrado' : 'temas encontrados'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
            <button
              onClick={() => setSelectedAxisNumber('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedAxisNumber === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Todos os 10 Eixos (100)
            </button>

            {THEMATIC_AXES.map((axis) => {
              const isSelected = selectedAxisNumber === axis.number;
              return (
                <button
                  key={axis.number}
                  onClick={() => setSelectedAxisNumber(axis.number)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-xs font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>Eixo {axis.number}</span>
                  <span className="hidden md:inline ml-1 opacity-80">· {axis.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Axis Information Banner if single axis selected */}
      {selectedAxisData && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-200">
              {selectedAxisData.title}
            </h3>
            <p className="text-xs text-amber-800/90 dark:text-amber-300/80 mt-0.5 leading-relaxed">
              {selectedAxisData.description}
            </p>
          </div>
        </div>
      )}

      {/* Themes Grid */}
      {filteredThemes.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center text-slate-500 dark:text-slate-400">
          <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
            Nenhuma proposta encontrada
          </h3>
          <p className="text-xs mt-1">
            Tente buscar com outra palavra-chave ou selecione "Todos os 10 Eixos".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedAxisNumber('all');
            }}
            className="mt-4 px-4 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-xs cursor-pointer"
          >
            Ver Todas as 100 Propostas
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredThemes.map((theme) => {
            const isExpanded = expandedThemeId === theme.id;
            const isCopied = copiedThemeId === theme.id;

            return (
              <div
                id={theme.id}
                key={theme.id}
                className={`bg-white dark:bg-slate-900 border rounded-xl p-5 flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md ${
                  isExpanded
                    ? 'border-amber-400 dark:border-amber-500 ring-2 ring-amber-500/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/80">
                        Eixo {theme.axisNumber}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        Tema #{theme.themeNumber}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyTheme(theme)}
                      title="Copiar tema"
                      className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Theme Title */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {theme.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    {theme.axisTitle}
                  </p>

                  {/* Expanded Tactical Dossier */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3.5 text-xs animate-fadeIn">
                      {/* Enunciado / Comando de Prova */}
                      <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          Comando Oficial de Prova:
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                          {theme.prompt}
                        </p>
                      </div>

                      {/* Repertório Recomendado */}
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-1.5 flex items-center gap-1">
                          <Scale className="w-3 h-3 text-amber-600" />
                          Repertórios & Legislações Estratégicas:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {theme.repertoire.map((rep, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/80 font-medium"
                            >
                              {rep}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Perguntas Norteadoras */}
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-1 flex items-center gap-1">
                          <Lightbulb className="w-3 h-3 text-amber-500" />
                          Direcionamento Tático para D1 e D2:
                        </span>
                        <div className="space-y-1 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
                          {theme.guidingQuestions.map((q, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                              <span className="font-bold text-amber-600 dark:text-amber-400 shrink-0">·</span>
                              <span className="leading-snug">{q}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setExpandedThemeId(isExpanded ? null : theme.id)}
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>{isExpanded ? 'Recolher Dossiê' : 'Ver Dossiê Tático'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {/* Primary Call to Action */}
                  {onSelectThemeForEssay ? (
                    <button
                      onClick={() => onSelectThemeForEssay(theme.title)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-2xs transition-transform active:scale-95 cursor-pointer"
                    >
                      <PenTool className="w-3 h-3" />
                      <span>Escrever Redação</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCopyTheme(theme)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      {isCopied ? 'Copiado!' : 'Copiar Tema'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
