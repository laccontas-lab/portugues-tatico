import React, { useState } from 'react';
import { Essay, EssayFile } from '../../types/index.ts';
import { api } from '../../lib/api.ts';
import { 
  FileText, 
  Download, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Clock, 
  Plus, 
  X, 
  FileCheck,
  Sparkles,
  UserCheck,
  Trash2
} from 'lucide-react';

interface StudentEssaysProps {
  essays: Essay[];
  onOpenSubmitModal: () => void;
  onRefresh?: () => Promise<void>;
}

export const StudentEssays: React.FC<StudentEssaysProps> = ({
  essays,
  onOpenSubmitModal,
  onRefresh
}) => {
  const [selectedEssay, setSelectedEssay] = useState<Essay | null>(null);
  const [deletingEssay, setDeletingEssay] = useState<Essay | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDeleteEssay = async () => {
    if (!deletingEssay) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      await api.deleteEssay(deletingEssay.id);
      if (onRefresh) await onRefresh();
      setDeletingEssay(null);
    } catch (err: any) {
      setDeleteError(err.message || 'Erro ao cancelar envio.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownloadFile = (fileObj: EssayFile, defaultFilename: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const link = document.createElement('a');
    link.href = fileObj.dataUrl || 'data:text/plain;charset=utf-8,Redacao%20Portugues%20Tatico';
    link.download = fileObj.name || defaultFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Minhas Redações
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Histórico completo de redações submetidas, notas lançadas e arquivos corrigidos pelo Professor Gabriel.
          </p>
        </div>

        <button
          onClick={onOpenSubmitModal}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Enviar Nova Redação</span>
        </button>
      </div>

      {/* Mobile & Tablet Card View for Celular e Tablet */}
      <div className="md:hidden space-y-3">
        {essays.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 shadow-xs">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
            <p className="text-sm">Você ainda não enviou nenhuma redação.</p>
            <button
              onClick={onOpenSubmitModal}
              className="mt-3 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg cursor-pointer"
            >
              Enviar sua primeira redação agora
            </button>
          </div>
        ) : (
          essays.map((essay) => {
            const isCorrected = essay.status === 'Corrigida' && !!essay.correction;
            const isPending = essay.status === 'Pendente';
            return (
              <div 
                key={essay.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3 hover:border-amber-300 transition-colors"
              >
                {/* Header: Status and Date */}
                <div className="flex items-start justify-between gap-2">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                    isCorrected 
                      ? 'text-emerald-800 bg-emerald-50 border-emerald-200' 
                      : 'text-amber-800 bg-amber-50 border-amber-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isCorrected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                    }`} />
                    {essay.status}
                  </span>

                  <span className="text-[11px] text-slate-500 font-mono">
                    {new Date(essay.submittedAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                {/* Title & Theme */}
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {essay.title || essay.theme}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {essay.theme}
                  </p>
                </div>

                {/* Grade & Exam Target */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <div>
                    {essay.examTarget && (
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        {essay.examTarget}
                      </span>
                    )}
                  </div>
                  <div>
                    {isCorrected ? (
                      <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 font-mono">
                        Nota: {essay.correction!.grade.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs italic">Aguardando correção</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedEssay(essay)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-center transition-colors cursor-pointer ${
                      isCorrected
                        ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isCorrected ? 'Ver Correção' : 'Ver Detalhes do Envio'}
                  </button>

                  <button
                    type="button"
                    title="Baixar redação enviada"
                    onClick={(e) => handleDownloadFile(essay.originalFile, `minha_redacao.pdf`, e)}
                    className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {isPending && (
                    <button
                      type="button"
                      title="Cancelar envio"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingEssay(essay);
                        setDeleteError('');
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-lg border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Essays Table (Hidden on mobile) */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-5">Tema da Redação</th>
                <th className="py-3.5 px-5">Data de Envio</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-center">Nota</th>
                <th className="py-3.5 px-5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {essays.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                    <p className="text-sm">Você ainda não enviou nenhuma redação.</p>
                    <button
                      onClick={onOpenSubmitModal}
                      className="mt-3 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg cursor-pointer"
                    >
                      Enviar sua primeira redação agora
                    </button>
                  </td>
                </tr>
              ) : (
                essays.map((essay) => {
                  const isCorrected = essay.status === 'Corrigida' && !!essay.correction;
                  const isPending = essay.status === 'Pendente';
                  return (
                    <tr
                      key={essay.id}
                      onClick={() => setSelectedEssay(essay)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      {/* Tema & Título */}
                      <td className="py-3.5 px-5 max-w-md">
                        <div className="font-semibold text-slate-900 group-hover:text-amber-700 transition-colors">
                          {essay.title || essay.theme}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5" title={essay.theme}>
                          {essay.theme}
                        </div>
                      </td>

                      {/* Data */}
                      <td className="py-3.5 px-5 font-mono text-[11px] text-slate-500 tabular-nums whitespace-nowrap">
                        {new Date(essay.submittedAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </td>

                      {/* Status */}
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

                      {/* Nota */}
                      <td className="py-3.5 px-5 text-center font-mono font-bold text-sm tabular-nums whitespace-nowrap">
                        {isCorrected ? (
                          <span className="text-amber-800 px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                            {essay.correction!.grade.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal text-xs">Em fila</span>
                        )}
                      </td>

                      {/* Ação */}
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEssay(essay);
                            }}
                            className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                              isCorrected
                                ? 'bg-amber-600 text-white hover:bg-amber-700'
                                : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                            }`}
                          >
                            {isCorrected ? 'Ver Correção' : 'Ver Detalhes'}
                          </button>

                          {isPending && (
                            <button
                              type="button"
                              title="Cancelar envio"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletingEssay(essay);
                                setDeleteError('');
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancel Submission Confirmation Modal (CRUD Delete) */}
      {deletingEssay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-xl relative">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Cancelar Envio de Redação
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Deseja cancelar o envio da redação <strong className="text-slate-900">&quot;{deletingEssay.title || deletingEssay.theme}&quot;</strong>?
                </p>
                <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  Esta redação ainda não foi corrigida. Cancelando agora, você poderá submeter um novo arquivo.
                </p>

                {deleteError && (
                  <div className="mt-3 p-2 rounded bg-red-50 text-xs text-red-700 border border-red-200">
                    {deleteError}
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-5">
                  <button
                    type="button"
                    onClick={() => setDeletingEssay(null)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={handleDeleteEssay}
                    className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-60"
                  >
                    {isDeleting ? 'Cancelando...' : 'Sim, Cancelar Envio'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes da Redação e Correção (Section 14 Requirement) */}
      {selectedEssay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full my-6 overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                  Espelho da Redação
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5 truncate max-w-lg">
                  {selectedEssay.title || selectedEssay.theme}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEssay(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Informações Básicas */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
                  <div>
                    <span className="text-slate-500 block">Tema da Proposta:</span>
                    <span className="text-slate-900 font-semibold">{selectedEssay.theme}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Data de Envio:</span>
                    <span className="text-slate-700 font-mono">
                      {new Date(selectedEssay.submittedAt).toLocaleDateString('pt-BR', {
                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-slate-700">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span>Arquivo Original Enviado ({selectedEssay.originalFile?.name})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownloadFile(selectedEssay.originalFile, `minha_redacao_${selectedEssay.id}.pdf`)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar Original</span>
                  </button>
                </div>
              </div>

              {/* Avaliação e Correção do Professor */}
              {selectedEssay.status === 'Corrigida' && selectedEssay.correction ? (
                <div className="space-y-4">
                  {/* Card Nota e Parecer */}
                  <div className="flex items-center gap-4 bg-amber-50/60 border border-amber-200 p-4 rounded-xl">
                    <div className="text-center px-4 py-2 rounded-lg bg-amber-100 border border-amber-300">
                      <span className="text-[10px] uppercase font-bold text-amber-800 block">Sua Nota</span>
                      <span className="text-3xl font-extrabold text-amber-700 font-mono tabular-nums">
                        {selectedEssay.correction.grade.toFixed(1)}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-700" />
                        Parecer do Professor Gabriel Figueiredo
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Avaliado em {new Date(selectedEssay.correction.correctedAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  {/* Pontos de Atenção assinalados */}
                  {selectedEssay.correction.attentionPoints && selectedEssay.correction.attentionPoints.length > 0 && (
                    <div>
                      <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Critérios e Pontos de Atenção Destacados:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedEssay.correction.attentionPoints.map((pt) => (
                          <span
                            key={pt}
                            className="px-2.5 py-1 text-xs font-medium rounded-md bg-amber-100 border border-amber-300 text-amber-900"
                          >
                            {pt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Feedback detalhado */}
                  <div>
                    <span className="text-xs font-semibold text-slate-700 block mb-1">
                      Comentários Pedagógicos do Professor:
                    </span>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                      {selectedEssay.correction.feedback}
                    </div>
                  </div>

                  {/* Arquivo Corrigido / Botão Baixar Correção (Section 14 Requirement) */}
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <FileCheck className="w-5 h-5 text-emerald-600" />
                      <div>
                        <span className="text-xs font-semibold text-emerald-900 block">
                          Arquivo de Correção com Apontamentos
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {selectedEssay.correction.correctionFile?.name || 'correcao_prof_gabriel.pdf'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownloadFile(
                        selectedEssay.correction!.correctionFile || selectedEssay.originalFile, 
                        `correcao_prof_gabriel_${selectedEssay.id}.pdf`
                      )}
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Baixar Correção</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Em Fila / Pendente */
                <div className="p-6 rounded-xl bg-amber-50 border border-amber-200 text-center space-y-2">
                  <Clock className="w-8 h-8 text-amber-600 mx-auto animate-pulse" />
                  <h4 className="text-sm font-semibold text-slate-900">
                    Redação em Fila de Correção
                  </h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Sua redação foi recebida pelo Professor Gabriel Figueiredo e está aguardando análise pedagógica criteriosa.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedEssay(null)}
                className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
