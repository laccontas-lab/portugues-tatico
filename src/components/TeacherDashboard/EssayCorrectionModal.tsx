import React, { useState } from 'react';
import { Essay, AttentionCriterion, EssayFile } from '../../types/index.ts';
import { 
  X, 
  Download, 
  FileText, 
  CheckCircle, 
  Upload, 
  AlertCircle, 
  Clock, 
  Calendar, 
  User, 
  Award,
  Sparkles,
  FileCheck
} from 'lucide-react';

interface EssayCorrectionModalProps {
  essay: Essay;
  isOpen: boolean;
  onClose: () => void;
  onSaveCorrection: (essayId: string, data: {
    grade: number;
    feedback: string;
    attentionPoints: AttentionCriterion[];
    correctionFile?: EssayFile;
  }) => Promise<void>;
}

const ALL_ATTENTION_CRITERIA: AttentionCriterion[] = [
  'Coesão',
  'Coerência',
  'Argumentação',
  'Estrutura',
  'Introdução',
  'Desenvolvimento',
  'Conclusão',
  'Gramática',
  'Pontuação',
  'Adequação ao tema',
  'Repertório'
];

export const EssayCorrectionModal: React.FC<EssayCorrectionModalProps> = ({
  essay,
  isOpen,
  onClose,
  onSaveCorrection
}) => {
  const isAlreadyCorrected = essay.status === 'Corrigida' && !!essay.correction;

  const [grade, setGrade] = useState<string>(
    isAlreadyCorrected ? essay.correction!.grade.toString() : ''
  );
  const [feedback, setFeedback] = useState<string>(
    isAlreadyCorrected ? essay.correction!.feedback : ''
  );
  const [selectedAttentionPoints, setSelectedAttentionPoints] = useState<AttentionCriterion[]>(
    isAlreadyCorrected ? essay.correction!.attentionPoints : []
  );
  const [correctionFile, setCorrectionFile] = useState<EssayFile | undefined>(
    isAlreadyCorrected ? essay.correction!.correctionFile : undefined
  );
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isEditing, setIsEditing] = useState(!isAlreadyCorrected);

  if (!isOpen) return null;

  const handleToggleCriterion = (criterion: AttentionCriterion) => {
    if (!isEditing) return;
    if (selectedAttentionPoints.includes(criterion)) {
      setSelectedAttentionPoints(selectedAttentionPoints.filter(c => c !== criterion));
    } else {
      setSelectedAttentionPoints([...selectedAttentionPoints, criterion]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|jpe?g|png)$/i)) {
      setErrorMsg('Arquivo inválido. Por favor, envie em formato PDF, JPG, JPEG ou PNG.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCorrectionFile({
        name: file.name,
        size: file.size,
        type: file.type || 'application/pdf',
        dataUrl
      });
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadFile = (fileObj: EssayFile, defaultFilename: string) => {
    const link = document.createElement('a');
    link.href = fileObj.dataUrl || 'data:text/plain;charset=utf-8,Conteudo%20da%20redacao%20tatico';
    link.download = fileObj.name || defaultFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const numGrade = parseFloat(grade.replace(',', '.'));
    if (isNaN(numGrade) || numGrade < 0 || numGrade > 10) {
      setErrorMsg('A nota deve ser um número válido entre 0,0 e 10,0.');
      return;
    }
    if (!feedback.trim()) {
      setErrorMsg('Por favor, escreva o feedback pedagógico do professor.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      await onSaveCorrection(essay.id, {
        grade: numGrade,
        feedback: feedback.trim(),
        attentionPoints: selectedAttentionPoints,
        correctionFile
      });
      setIsEditing(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao salvar a correção.');
    } finally {
      setSaving(false);
    }
  };

  const applyFeedbackSnippet = (snippet: string) => {
    setFeedback(prev => prev ? `${prev}\n\n${snippet}` : snippet);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-xl max-w-3xl w-full my-4 sm:my-6 overflow-hidden shadow-xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Avaliação de Redação
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className={`text-[11px] font-semibold ${
                essay.status === 'Pendente' ? 'text-amber-700' : 'text-emerald-700'
              }`}>
                {essay.status}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate max-w-xs sm:max-w-lg mt-0.5">
              {essay.title || essay.theme}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section: Dados da Redação (Section 5 Requirement) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-3">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              Dados da Redação
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block mb-0.5">Nome do Aluno:</span>
                <span className="text-slate-900 font-semibold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  {essay.studentName}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Data de Envio:</span>
                <span className="text-slate-700 font-mono tabular-nums flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {new Date(essay.submittedAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="md:col-span-2">
                <span className="text-slate-500 block mb-0.5">Tema Proposto:</span>
                <p className="text-slate-800 font-medium bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
                  {essay.theme}
                </p>
              </div>
              {essay.examTarget && (
                <div>
                  <span className="text-slate-500 block mb-0.5">Concurso Alvo:</span>
                  <span className="text-amber-800 font-semibold">{essay.examTarget}</span>
                </div>
              )}
            </div>

            {/* Original File & Download Button */}
            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <FileText className="w-4 h-4 text-amber-600" />
                <span className="font-medium">{essay.originalFile?.name || 'redacao_original.pdf'}</span>
                {essay.originalFile?.size && (
                  <span className="text-slate-500">
                    ({Math.round(essay.originalFile.size / 1024)} KB)
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleDownloadFile(essay.originalFile, `redacao_${essay.studentName}.pdf`)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar Redação</span>
              </button>
            </div>
          </div>

          {/* Section: Correção (Section 6 Requirement) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                Correção e Feedback Tático
              </h3>
              {isAlreadyCorrected && !isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-amber-700 hover:text-amber-800 font-semibold underline cursor-pointer"
                >
                  Editar Correção
                </button>
              )}
            </div>

            {isAlreadyCorrected && !isEditing ? (
              /* Read-only view of existing correction */
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-center px-4 py-2 rounded-lg bg-amber-50 border border-amber-200">
                    <span className="text-[10px] uppercase font-bold text-amber-800 block">Nota Final</span>
                    <span className="text-3xl font-extrabold text-amber-700 font-mono tabular-nums">
                      {essay.correction!.grade.toFixed(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      Corrigida por {essay.correction!.teacherName || 'Prof. Gabriel Figueiredo'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Registrada em {new Date(essay.correction!.correctedAt).toLocaleDateString('pt-BR', {
                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Attention Points */}
                {essay.correction!.attentionPoints?.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-600 block mb-1.5">Pontos de Atenção Assinalados:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {essay.correction!.attentionPoints.map(point => (
                        <span key={point} className="px-2.5 py-1 text-xs rounded-md bg-amber-50 border border-amber-200 text-amber-900 font-medium">
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Feedback */}
                <div>
                  <span className="text-xs text-slate-600 block mb-1">Feedback Pedagógico do Professor:</span>
                  <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed shadow-2xs">
                    {essay.correction!.feedback}
                  </div>
                </div>

                {/* Correction File Download */}
                {essay.correction!.correctionFile && (
                  <div className="pt-2 flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center gap-2 text-xs text-emerald-900">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span>{essay.correction!.correctionFile.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownloadFile(essay.correction!.correctionFile!, 'correcao_prof_gabriel.pdf')}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Baixar Arquivo Corrigido</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Editable Correction Form */
              <form onSubmit={handleSave} className="space-y-4">
                {/* Nota Field (0 to 10) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nota do Professor (0 a 10) *
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="Ex: 9.5"
                      required
                      className="w-32 px-3 py-2 text-base font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                    />
                    <div className="flex flex-wrap gap-1">
                      {[10.0, 9.8, 9.5, 9.0, 8.5, 8.0, 7.5].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGrade(g.toFixed(1))}
                          className="px-2 py-1 text-[11px] rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors font-mono cursor-pointer"
                        >
                          {g.toFixed(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Attention Points / Categorias de Redação (Section 12) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Pontos de Atenção da Redação (selecione os critérios aplicáveis)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_ATTENTION_CRITERIA.map(criterion => {
                      const isSelected = selectedAttentionPoints.includes(criterion);
                      return (
                        <button
                          key={criterion}
                          type="button"
                          onClick={() => handleToggleCriterion(criterion)}
                          className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold shadow-2xs'
                              : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          {criterion}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Feedback Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Feedback Detalhado do Professor Gabriel *
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Oriente o aluno com clareza e autoridade
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Escreva sua análise detalhada: introdução, progressão temática, repertório constitucional, conectivos e gramática..."
                    required
                    className="w-full px-3 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 leading-relaxed resize-y"
                  />
                  {/* Quick Snippets */}
                  <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto pb-1 text-[11px] text-slate-500">
                    <span className="shrink-0 flex items-center gap-1 text-amber-700 font-semibold">
                      <Sparkles className="w-3 h-3" /> Inserir tático:
                    </span>
                    <button
                      type="button"
                      onClick={() => applyFeedbackSnippet('Excelente domínio da estrutura dissertativa e do Método Português Tático. Tese assertiva e progressão lógica impecável.')}
                      className="px-2 py-0.5 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 truncate max-w-xs shrink-0 cursor-pointer"
                    >
                      "Excelente estrutura e tese assertiva"
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFeedbackSnippet('Atenção ao paralelismo sintático e à pontuação de orações adjetivas explicativas. Evite períodos excessivamente longos.')}
                      className="px-2 py-0.5 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 truncate max-w-xs shrink-0 cursor-pointer"
                    >
                      "Atenção ao paralelismo e pontuação"
                    </button>
                  </div>
                </div>

                {/* Arquivo de Correção (PDF, JPG, JPEG, PNG) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Arquivo de Correção (PDF anotado ou imagem)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-amber-600" />
                      <span>{correctionFile ? 'Substituir arquivo' : 'Selecionar arquivo (PDF, PNG, JPG)'}</span>
                      <input
                        type="file"
                        accept=".pdf,image/png,image/jpeg,image/jpg"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    {correctionFile && (
                      <span className="text-xs text-amber-800 flex items-center gap-1 font-mono font-medium">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        {correctionFile.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                  {isAlreadyCorrected && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 rounded-md transition-colors cursor-pointer"
                    >
                      Cancelar Edição
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
                  >
                    {saving ? (
                      <span>Salvando correção...</span>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 text-white" />
                        <span>Salvar Correção</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Português Tático · Gestão de Redações</span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-600 hover:text-slate-900 transition-colors font-medium cursor-pointer"
          >
            Fechar janela
          </button>
        </div>
      </div>
    </div>
  );
};
