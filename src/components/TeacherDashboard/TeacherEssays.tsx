import React, { useState } from 'react';
import { Essay, EssayFile, AttentionCriterion } from '../../types/index.ts';
import { EssayCorrectionModal } from './EssayCorrectionModal.tsx';
import { api } from '../../lib/api.ts';
import { 
  FileText, 
  Search, 
  Filter, 
  Calendar, 
  Download, 
  CheckCircle, 
  Clock, 
  User, 
  FileClock,
  Eye,
  SlidersHorizontal,
  Trash2
} from 'lucide-react';

interface TeacherEssaysProps {
  essays: Essay[];
  onSaveCorrection: (essayId: string, data: {
    grade: number;
    feedback: string;
    attentionPoints: AttentionCriterion[];
    correctionFile?: EssayFile;
  }) => Promise<void>;
  selectedFilterStatus?: string;
  onRefresh?: () => Promise<void>;
}

export const TeacherEssays: React.FC<TeacherEssaysProps> = ({
  essays,
  onSaveCorrection,
  selectedFilterStatus = 'Todas',
  onRefresh
}) => {
  const [filterStatus, setFilterStatus] = useState<string>(selectedFilterStatus);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentFilter, setSelectedStudentFilter] = useState('all');
  const [selectedEssayForCorrection, setSelectedEssayForCorrection] = useState<Essay | null>(null);

  // Delete essay state (CRUD Delete)
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
      setDeleteError(err.message || 'Erro ao excluir redação.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Extract unique students
  const uniqueStudents = Array.from(new Set(essays.map(e => e.studentName))).sort();

  // Filter essays
  const filteredEssays = essays.filter(e => {
    // Status filter
    if (filterStatus !== 'Todas' && e.status !== filterStatus) {
      return false;
    }
    // Student filter
    if (selectedStudentFilter !== 'all' && e.studentName !== selectedStudentFilter) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = e.studentName.toLowerCase().includes(q);
      const matchTheme = e.theme.toLowerCase().includes(q);
      const matchTitle = e.title.toLowerCase().includes(q);
      if (!matchName && !matchTheme && !matchTitle) return false;
    }
    return true;
  });

  const handleDownloadFile = (fileObj: EssayFile, defaultFilename: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = fileObj.dataUrl || 'data:text/plain;charset=utf-8,Conteudo%20da%20redacao%20tatico';
    link.download = fileObj.name || defaultFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Redações
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Acompanhe todos os textos submetidos, baixe os arquivos originais e lance as correções táticas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Total:</span>
          <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200">
            {filteredEssays.length} redações
          </span>
        </div>
      </div>

      {/* Filter Toolbar (Section 5 Requirement: Todas, Pendentes, Corrigidas, Por aluno, Por período) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
        {/* Status segmented controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 shrink-0">
          {(['Todas', 'Pendente', 'Corrigida'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                filterStatus === status
                  ? 'bg-white text-amber-800 font-semibold shadow-xs border border-amber-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status === 'Todas' ? 'Todas' : status === 'Pendente' ? 'Pendentes' : 'Corrigidas'}
            </button>
          ))}
        </div>

        {/* Search & Student filter */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 flex-1 max-w-xl">
          {/* Search box */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por tema, título ou aluno..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          {/* Student Filter */}
          <div className="w-full sm:w-48 shrink-0">
            <select
              value={selectedStudentFilter}
              onChange={(e) => setSelectedStudentFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="all">Todos os alunos</option>
              {uniqueStudents.map(studentName => (
                <option key={studentName} value={studentName}>
                  {studentName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Card View for Celular e Tablet */}
      <div className="md:hidden space-y-3">
        {filteredEssays.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 shadow-xs">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
            <p className="text-sm">Nenhuma redação encontrada com os filtros selecionados.</p>
          </div>
        ) : (
          filteredEssays.map((essay) => {
            const isPending = essay.status === 'Pendente';
            return (
              <div 
                key={essay.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3 hover:border-amber-300 transition-colors"
              >
                {/* Header: Student, Concurso, Status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {essay.studentName}
                    </h3>
                    {essay.examTarget && (
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-1 inline-block">
                        {essay.examTarget}
                      </span>
                    )}
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                    isPending 
                      ? 'text-amber-800 bg-amber-50 border-amber-200' 
                      : 'text-emerald-800 bg-emerald-50 border-emerald-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isPending ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                    }`} />
                    {essay.status}
                  </span>
                </div>

                {/* Title & Theme */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                  <div className="font-semibold text-xs text-slate-900">
                    {essay.title || essay.theme}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {essay.theme}
                  </div>
                </div>

                {/* Footer Info: Data & Nota */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <div className="text-slate-500 text-[11px]">
                    Envio: {new Date(essay.submittedAt).toLocaleDateString('pt-BR')}
                  </div>
                  <div>
                    {essay.correction?.grade !== undefined && essay.correction?.grade !== null ? (
                      <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 font-mono">
                        Nota: {essay.correction.grade.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs italic">Aguardando nota</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedEssayForCorrection(essay)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-center transition-colors cursor-pointer ${
                      isPending
                        ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isPending ? 'Corrigir Redação' : 'Ver Correção'}
                  </button>

                  <button
                    type="button"
                    title="Baixar redação original"
                    onClick={(e) => handleDownloadFile(essay.originalFile, `redacao_${essay.studentName}.pdf`, e)}
                    className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    title="Excluir redação"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingEssay(essay);
                      setDeleteError('');
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-lg border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
                <th className="py-3.5 px-5">Nome do Aluno</th>
                <th className="py-3.5 px-5">Tema & Título</th>
                <th className="py-3.5 px-5">Data de Envio</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-center">Nota</th>
                <th className="py-3.5 px-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEssays.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                    <p className="text-sm">Nenhuma redação encontrada com os filtros selecionados.</p>
                  </td>
                </tr>
              ) : (
                filteredEssays.map((essay) => {
                  const isPending = essay.status === 'Pendente';
                  return (
                    <tr 
                      key={essay.id}
                      onClick={() => setSelectedEssayForCorrection(essay)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      {/* Aluno */}
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-slate-900 group-hover:text-amber-700 transition-colors">
                          {essay.studentName}
                        </div>
                        {essay.examTarget && (
                          <span className="text-[10px] text-slate-500 font-medium">
                            {essay.examTarget}
                          </span>
                        )}
                      </td>

                      {/* Tema & Título */}
                      <td className="py-3.5 px-5 max-w-sm">
                        <div className="font-medium text-slate-800 truncate" title={essay.title}>
                          {essay.title || essay.theme}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5" title={essay.theme}>
                          {essay.theme}
                        </div>
                      </td>

                      {/* Data de Envio */}
                      <td className="py-3.5 px-5 text-slate-500 font-mono text-[11px] tabular-nums whitespace-nowrap">
                        {new Date(essay.submittedAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${
                          isPending ? 'text-amber-700' : 'text-emerald-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isPending ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                          }`} />
                          {essay.status}
                        </span>
                      </td>

                      {/* Nota */}
                      <td className="py-3.5 px-5 text-center font-mono font-bold text-sm tabular-nums whitespace-nowrap">
                        {essay.correction?.grade !== undefined && essay.correction?.grade !== null ? (
                          <span className="text-amber-800 px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                            {essay.correction.grade.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal text-xs">—</span>
                        )}
                      </td>

                      {/* Ações */}
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            title="Baixar redação original"
                            onClick={(e) => handleDownloadFile(essay.originalFile, `redacao_${essay.studentName}.pdf`, e)}
                            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEssayForCorrection(essay);
                            }}
                            className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                              isPending
                                ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                            }`}
                          >
                            {isPending ? 'Corrigir' : 'Ver Correção'}
                          </button>

                          <button
                            type="button"
                            title="Excluir redação"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingEssay(essay);
                              setDeleteError('');
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* Delete Essay Confirmation Modal (CRUD Delete) */}
      {deletingEssay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-xl relative">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Excluir Redação
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Tem certeza que deseja excluir a redação <strong className="text-slate-900">&quot;{deletingEssay.title || deletingEssay.theme}&quot;</strong> do aluno {deletingEssay.studentName}?
                </p>
                <p className="text-xs text-rose-600 mt-2 bg-rose-50 p-2 rounded-lg border border-rose-100">
                  Essa ação removerá o arquivo enviado e a eventual correção lançada.
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
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={handleDeleteEssay}
                    className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-60"
                  >
                    {isDeleting ? 'Excluindo...' : 'Sim, Excluir Redação'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Correction / View */}
      {selectedEssayForCorrection && (
        <EssayCorrectionModal
          essay={selectedEssayForCorrection}
          isOpen={!!selectedEssayForCorrection}
          onClose={() => setSelectedEssayForCorrection(null)}
          onSaveCorrection={async (essayId, data) => {
            await onSaveCorrection(essayId, data);
            setSelectedEssayForCorrection(null);
          }}
        />
      )}
    </div>
  );
};
