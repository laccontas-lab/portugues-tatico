import React from 'react';
import { RankingEntry } from '../../types/index.ts';
import { Award, Trophy, Medal, Shield, Sparkles } from 'lucide-react';

interface RankingViewProps {
  ranking: RankingEntry[];
  currentUserId?: string;
}

export const RankingView: React.FC<RankingViewProps> = ({ ranking, currentUserId }) => {
  const top3 = ranking.slice(0, 3);
  const remainingTop10 = ranking.slice(3, 10);

  const getPodiumBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          icon: '🥇',
          label: '1º Lugar',
          border: 'border-amber-300 bg-amber-50/80 text-amber-900',
          badge: 'bg-amber-400 text-slate-950',
          glow: 'shadow-xs'
        };
      case 2:
        return {
          icon: '🥈',
          label: '2º Lugar',
          border: 'border-slate-300 bg-slate-50/80 text-slate-800',
          badge: 'bg-slate-200 text-slate-800',
          glow: 'shadow-xs'
        };
      case 3:
        return {
          icon: '🥉',
          label: '3º Lugar',
          border: 'border-amber-200 bg-amber-50/40 text-amber-900',
          badge: 'bg-amber-600 text-white',
          glow: 'shadow-xs'
        };
      default:
        return {
          icon: `${rank}º`,
          label: `${rank}º`,
          border: 'border-slate-200 bg-white text-slate-700',
          badge: 'bg-slate-100 text-slate-600',
          glow: ''
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
              Quadro de Honra Tático
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">Atualização em tempo real</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Classificação Geral — Top 10
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            O ranking é calculado automaticamente com base na <strong>melhor nota individual</strong> de cada concurseiro.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Critério:</span>
          <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
            Maior Nota Individual
          </span>
        </div>
      </div>

      {ranking.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 shadow-xs">
          <Trophy className="w-10 h-10 mx-auto mb-2 opacity-40 text-amber-500" />
          <p className="text-sm">Nenhum aluno classificado ainda. O ranking será preenchido conforme novas redações forem corrigidas.</p>
        </div>
      ) : (
        <>
          {/* Podium Top 3 Cards (Section 8 Example Visual) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {top3.map((entry) => {
              const style = getPodiumBadge(entry.rank);
              const isCurrentUser = currentUserId === entry.studentId;

              return (
                <div
                  key={entry.studentId}
                  className={`rounded-xl border p-5 flex flex-col justify-between transition-all relative overflow-hidden ${style.border} ${style.glow} ${
                    isCurrentUser ? 'ring-2 ring-amber-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl leading-none">{style.icon}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${style.badge}`}>
                      {style.label}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 truncate">
                      {entry.displayName}
                    </h3>
                    {entry.targetExam && (
                      <p className="text-[11px] text-amber-700 font-medium truncate mt-0.5">
                        {entry.targetExam}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Melhor Nota</span>
                      <span className="text-3xl font-extrabold text-amber-600 font-mono tabular-nums">
                        {entry.bestGrade.toFixed(1)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-medium text-slate-700">
                        {entry.correctedEssaysCount} {entry.correctedEssaysCount === 1 ? 'redação' : 'redações'}
                      </span>
                      <span className="text-[10px] text-slate-400 block">corrigidas</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Do 4º ao 10º (Section 8 Requirement) */}
          {remainingTop10.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 bg-slate-50/70">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Classificação do 4º ao 10º Colocado
                </h3>
              </div>

              {/* Mobile View (Celular e Tablet) */}
              <div className="sm:hidden divide-y divide-slate-100">
                {remainingTop10.map((entry) => {
                  const isCurrentUser = currentUserId === entry.studentId;
                  return (
                    <div 
                      key={entry.studentId}
                      className={`p-3.5 flex items-center justify-between gap-3 ${
                        isCurrentUser ? 'bg-amber-50/70 font-medium' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                          {entry.rank}º
                        </span>
                        <div>
                          <div className="font-semibold text-xs text-slate-900">
                            {entry.displayName} {isCurrentUser && <span className="text-amber-700 text-[10px] ml-1 font-bold">(Você)</span>}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {entry.targetExam || 'Concursos Gerais'} · {entry.correctedEssaysCount} red.
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-sm text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {entry.bestGrade.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-5 text-center w-16">Posição</th>
                      <th className="py-3 px-5">Aluno</th>
                      <th className="py-3 px-5">Foco / Concurso</th>
                      <th className="py-3 px-5 text-center">Redações Corrigidas</th>
                      <th className="py-3 px-5 text-right">Melhor Nota</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {remainingTop10.map((entry) => {
                      const isCurrentUser = currentUserId === entry.studentId;
                      return (
                        <tr
                          key={entry.studentId}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isCurrentUser ? 'bg-amber-50/60 font-medium' : ''
                          }`}
                        >
                          <td className="py-3 px-5 text-center font-mono font-bold text-slate-500">
                            {entry.rank}º
                          </td>

                          <td className="py-3 px-5 font-semibold text-slate-800">
                            {entry.displayName} {isCurrentUser && <span className="text-amber-600 text-[10px] ml-1">(Você)</span>}
                          </td>

                          <td className="py-3 px-5 text-slate-500">
                            {entry.targetExam || 'Concursos Gerais'}
                          </td>

                          <td className="py-3 px-5 text-center font-mono text-slate-600">
                            {entry.correctedEssaysCount} redações
                          </td>

                          <td className="py-3 px-5 text-right font-mono font-bold text-amber-600 tabular-nums text-sm">
                            {entry.bestGrade.toFixed(1)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Privacy Note (Section 8: Não exibir informações pessoais sensíveis no ranking) */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2 shadow-xs">
            <Shield className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Privacidade e Proteção de Dados:</strong> O ranking preserva a privacidade dos concurseiros e não exibe CPF, telefone, e-mail ou dados sensíveis.
            </span>
          </div>
        </>
      )}
    </div>
  );
};
