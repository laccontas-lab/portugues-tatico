import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Lightbulb, 
  Quote, 
  ShieldCheck,
  Flame,
  Award
} from 'lucide-react';
import tacticalCrest from '../../assets/images/tactical_gold_crest_1790889408670.jpg';

interface TacticalTip {
  id: number;
  category: string;
  focus: string;
  title: string;
  text: string;
  tag: string;
}

const TACTICAL_TIPS: TacticalTip[] = [
  {
    id: 1,
    category: 'Método Tático',
    focus: 'Redação Nota 10',
    title: 'Estrutura do Parágrafo de Desenvolvimento',
    text: 'Inicie o D1 sempre com um tópico frasal assertivo e engate logo em seguida um repertório legitimado (Constituição de 1988, doutrina ou jurisprudência). Isso ancora seu argumento com autoridade imediata perante a banca.',
    tag: 'Construção Textual'
  },
  {
    id: 2,
    category: 'Gramática Aplicada',
    focus: 'Coesão Interparágrafos',
    title: 'O Segredo dos Conectivos de Abertura',
    text: 'Nunca inicie um novo parágrafo sem um conectivo de valor argumentativo explícito. Expressões como "Sob esse prisma", "Nesse viés" e "Por conseguinte" garantem a pontuação máxima no critério de articulação das ideias.',
    tag: 'Coesão & Coerência'
  },
  {
    id: 3,
    category: 'Estratégia de Prova',
    focus: 'Gestão de Tempo',
    title: 'Cronômetro Tático na Prova Discursiva',
    text: 'Não deixe a redação para a última hora do certame. Dedique 15 min para o esqueleto argumentativo, 40 min para o rascunho e 20 min para a transcrição definitiva. O cansaço mental é o maior vilão da precisão gramatical.',
    tag: 'Foco Operacional'
  },
  {
    id: 4,
    category: 'Norma Padrão',
    focus: 'Eliminação de Desvios',
    title: 'Tolerância Zero com Crase e Regência',
    text: 'Bancas de concursos policiais penalizam severamente o esquecimento da crase facultativa antes de pronomes possessivos femininos e a regência do verbo "visar". Revise esses pontos com lupa antes do envio final.',
    tag: 'Sintaxe & Morfologia'
  },
  {
    id: 5,
    category: 'Estilo & Clareza',
    focus: 'Bancas Cebraspe & FGV',
    title: 'Ordem Direta: Clareza e Firmeza',
    text: 'Nas carreiras policiais, a clareza cirúrgica se sobrepõe ao vocabulário rebuscado. Prefira orações em ordem direta (sujeito + verbo + complementos). Um texto sem circunlóquios transmite segurança e comando.',
    tag: 'Assertividade'
  },
  {
    id: 6,
    category: 'Mentalidade Tática',
    focus: 'Motivação & Disciplina',
    title: 'O Erro Apontado é a Sua Maior Arma',
    text: 'Cada apontamento na sua correção não é uma censura, é uma coordenada tática para blindar sua nota antes da prova real. Quem reescreve as passagens corrigidas pelo professor assimila o método 3 vezes mais rápido.',
    tag: 'Rumo à Posse'
  }
];

export const TacticalTipsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TACTICAL_TIPS.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TACTICAL_TIPS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TACTICAL_TIPS.length);
  };

  const currentTip = TACTICAL_TIPS[currentIndex];

  return (
    <div 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-50/60 to-white dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900 border border-amber-300/80 dark:border-amber-800/80 p-5 sm:p-6 shadow-xs transition-colors"
    >
      {/* Subtle background crest watermark */}
      <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-44 h-44 opacity-5 dark:opacity-10 pointer-events-none">
        <img 
          src={tacticalCrest} 
          alt="Watermark" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Category Header & Quote */}
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 bg-amber-200/70 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
              <Sparkles className="w-3 h-3 text-amber-700 dark:text-amber-400" />
              Dicas Táticas do Dia
            </span>

            <span className="text-xs text-slate-400 dark:text-slate-600">·</span>

            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Prof. Gabriel Figueiredo
            </span>

            <span className="text-xs text-slate-400 dark:text-slate-600">·</span>

            <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
              {currentTip.category}
            </span>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{currentTip.title}</span>
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-2 leading-relaxed italic pr-2 sm:pr-8">
              &ldquo;{currentTip.text}&rdquo;
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1 text-[11px]">
            <span className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Foco Tático: {currentTip.focus}
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              #{currentTip.tag}
            </span>
          </div>
        </div>

        {/* Right Side: Navigation Controls & Dots */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-amber-200/60 dark:border-slate-800">
          <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
            <span>Dica {currentIndex + 1} de {TACTICAL_TIPS.length}</span>
          </div>

          {/* Previous / Next buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              title="Dica anterior"
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-400 text-slate-700 dark:text-slate-200 hover:text-amber-700 dark:hover:text-amber-400 transition-colors shadow-2xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              title="Próxima dica tática"
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-400 text-slate-700 dark:text-slate-200 hover:text-amber-700 dark:hover:text-amber-400 transition-colors shadow-2xs cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1">
            {TACTICAL_TIPS.map((tip, idx) => (
              <button
                key={tip.id}
                onClick={() => setCurrentIndex(idx)}
                title={`Ir para dica ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx
                    ? 'w-5 bg-amber-600 dark:bg-amber-400'
                    : 'w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
