import React, { useState, useEffect } from 'react';
import { EssayFile, Proposal } from '../../types/index.ts';
import { api } from '../../lib/api.ts';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  Send,
  Layers,
  Sparkles
} from 'lucide-react';

interface StudentSubmitEssayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitEssay: (data: {
    title: string;
    theme: string;
    proposalId?: string;
    originalFile: EssayFile;
  }) => Promise<void>;
  targetExam?: string;
  preselectedTheme?: string;
}

export const StudentSubmitEssayModal: React.FC<StudentSubmitEssayModalProps> = ({
  isOpen,
  onClose,
  onSubmitEssay,
  targetExam,
  preselectedTheme
}) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposalId, setSelectedProposalId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState('');
  const [file, setFile] = useState<EssayFile | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (preselectedTheme) {
        setSelectedProposalId('custom');
        setTheme(preselectedTheme);
        setTitle(`Redação: ${preselectedTheme}`);
      } else {
        api.getProposals().then((props) => {
          const activeProps = props.filter(p => p.status === 'ativa');
          setProposals(activeProps);
          if (activeProps.length > 0 && !selectedProposalId) {
            setSelectedProposalId(activeProps[0].id);
            setTheme(activeProps[0].theme);
            setTitle(`Redação: ${activeProps[0].title}`);
          }
        }).catch(() => {});
      }
    }
  }, [isOpen, preselectedTheme]);

  const handleSelectProposal = (propId: string) => {
    setSelectedProposalId(propId);
    if (propId === 'custom') {
      setTheme('');
      setTitle('');
    } else {
      const found = proposals.find(p => p.id === propId);
      if (found) {
        setTheme(found.theme);
        setTitle(`Redação: ${found.title}`);
      }
    }
  };

  const selectedProposal = proposals.find(p => p.id === selectedProposalId);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(uploadedFile.type) && !uploadedFile.name.match(/\.(pdf|jpe?g|png)$/i)) {
      setErrorMessage('Formato inválido. Envie sua redação em PDF, JPG, JPEG ou PNG.');
      return;
    }

    if (uploadedFile.size > 20 * 1024 * 1024) {
      setErrorMessage('O arquivo excede o limite máximo de 20MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFile({
        name: uploadedFile.name,
        size: uploadedFile.size,
        type: uploadedFile.type || 'application/pdf',
        dataUrl: event.target?.result as string
      });
      setErrorMessage('');
    };
    reader.readAsDataURL(uploadedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Por favor, informe o título da sua redação.');
      return;
    }
    if (!theme.trim()) {
      setErrorMessage('Por favor, informe o tema da proposta.');
      return;
    }
    if (!file) {
      setErrorMessage('Por favor, anexe o arquivo da sua redação (PDF ou Imagem legível).');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      await onSubmitEssay({
        title: title.trim(),
        theme: theme.trim(),
        originalFile: file
      });
      setSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao enviar a redação. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setTitle('');
    setTheme('');
    setFile(null);
    setErrorMessage('');
    setSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full my-4 sm:my-6 overflow-hidden shadow-xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Protocolo de Envio
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
              Enviar Nova Redação
            </h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          {success ? (
            /* Success State (Section 13 Requirement) */
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Redação enviada com sucesso!
                </h4>
                <p className="text-xs text-amber-800 font-semibold mt-1">
                  Aguarde a correção do Professor Gabriel.
                </p>
                <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                  O sistema registrou a data do seu envio. Assim que a nota e o arquivo corrigido forem lançados, você receberá a notificação em seu painel.
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Concluir e Voltar ao Painel
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Título da Redação */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Título da Redação *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: A soberania estatal e o combate ao narcotráfico"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              {/* Tema da Proposta */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Tema da Proposta *
                </label>
                <input
                  type="text"
                  required
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="Ex: O papel da integração tecnológica na segurança viária"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              {/* Arquivo da Redação (Aceitar PDF, JPG, JPEG, PNG) */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Arquivo da Redação (PDF, JPG, JPEG, PNG) *
                </label>
                
                <div className="mt-1 border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl p-5 text-center transition-colors bg-slate-50 relative">
                  <input
                    type="file"
                    accept=".pdf,image/png,image/jpeg,image/jpg"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {file ? (
                    <div className="flex flex-col items-center">
                      <FileCheck className="w-8 h-8 text-emerald-600 mb-1" />
                      <span className="font-semibold text-slate-800 text-xs font-mono">{file.name}</span>
                      <span className="text-[11px] text-slate-500 mt-0.5">
                        {Math.round(file.size / 1024)} KB · Clique para trocar de arquivo
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center pointer-events-none">
                      <Upload className="w-8 h-8 text-amber-600 mb-2" />
                      <p className="font-medium text-slate-800 text-xs">
                        Clique aqui ou arraste o arquivo da folha definitiva
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Formatos aceitos: PDF digitalizado ou fotos nítidas (JPG, PNG) até 20MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {targetExam && (
                <div className="text-[11px] text-slate-600 flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                  <span>Concurso Alvo Vinculado:</span>
                  <span className="text-amber-800 font-semibold">{targetExam}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors disabled:opacity-60 cursor-pointer shadow-xs"
                >
                  {submitting ? (
                    <span>Enviando redação...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-white" />
                      <span>Enviar Redação</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
