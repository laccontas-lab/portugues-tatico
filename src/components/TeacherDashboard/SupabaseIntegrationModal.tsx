import React, { useState, useEffect } from 'react';
import { 
  Database, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  Layers, 
  FileCode, 
  Server,
  ArrowRight,
  HardDriveDownload,
  Copy,
  Check
} from 'lucide-react';
import { api } from '../../lib/api.ts';

interface SupabaseIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseIntegrationModal: React.FC<SupabaseIntegrationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [loading, setLoading] = useState(true);
  const [runningMigration, setRunningMigration] = useState(false);
  const [runningSync, setRunningSync] = useState(false);
  const [statusData, setStatusData] = useState<any>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedFullSql, setCopiedFullSql] = useState(false);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await api.getSupabaseStatus();
      setStatusData(res);
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Erro ao consultar status do Supabase' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      setActionMessage(null);
    }
  }, [isOpen]);

  const handleCopyFullSql = async () => {
    try {
      const res = await api.getSupabaseSql();
      await navigator.clipboard.writeText(res.sql);
      setCopiedFullSql(true);
      setActionMessage({ type: 'success', text: 'Script SQL completo copiado! Cole no SQL Editor do seu Supabase e clique em RUN.' });
      setTimeout(() => setCopiedFullSql(false), 3000);
    } catch {
      setActionMessage({ type: 'error', text: 'Não foi possível copiar o script SQL.' });
    }
  };

  const handleRunMigrations = async () => {
    try {
      setRunningMigration(true);
      setActionMessage({ type: 'info', text: 'Executando validação e aplicação das migrações SQL...' });
      const res = await api.runSupabaseMigrations();
      setActionMessage({ type: 'success', text: res.message || 'Migrações aplicadas com sucesso!' });
      await fetchStatus();
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Erro ao executar migrações.' });
    } finally {
      setRunningMigration(false);
    }
  };

  const handleSyncData = async () => {
    try {
      setRunningSync(true);
      setActionMessage({ type: 'info', text: 'Sincronizando dados dos esquemas com o Supabase...' });
      const res = await api.syncSupabaseData();
      if (res.success) {
        setActionMessage({ type: 'success', text: res.message || 'Dados sincronizados com sucesso!' });
      } else {
        setActionMessage({ type: 'error', text: res.message || res.error || 'Erro na sincronização.' });
      }
      await fetchStatus();
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Erro ao sincronizar dados.' });
    } finally {
      setRunningSync(false);
    }
  };

  const copySqlPath = () => {
    navigator.clipboard.writeText('npm run supabase:migrate');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const requiredTables = statusData?.requiredTables || [
    'profiles',
    'essays',
    'exam_boards',
    'text_guides',
    'tactical_method',
    'weekly_missions',
    'student_stats'
  ];

  const tableDescriptions: Record<string, string> = {
    profiles: 'Usuários, perfis dos alunos, status de pagamento e login do professor',
    essays: 'Redações enviadas pelos alunos e notas/correções táticas do professor',
    exam_boards: 'Guias estruturais e táticas das bancas examinadoras (Cebraspe, Vunesp, EsPCEx)',
    text_guides: 'Guias de estrutura textual, interpretação e gramática aplicada à redação',
    tactical_method: 'Missões estratégicas do Método Português Tático (1 a 3)',
    weekly_missions: 'Missão semanal de regência, crase e desafios de fixação',
    student_stats: 'Métricas de evolução, histórico de notas e pontos de atenção dos alunos'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Integração Supabase & Migrations
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  PostgreSQL
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Esquemas das 7 tabelas e integridade dos dados da plataforma
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm flex-1">
          {actionMessage && (
            <div className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs font-medium ${
              actionMessage.type === 'success' 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : actionMessage.type === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
            }`}>
              {actionMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{actionMessage.text}</span>
            </div>
          )}

          {/* Connection status card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5" /> Status da Conexão
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold ${
                statusData?.configured 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300' 
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
              }`}>
                {statusData?.configured ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Supabase Conectado
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Ambiente Local / Esquema Verificado
                  </>
                )}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {statusData?.configured
                ? 'Conexão configurada com o projeto https://fvamqiqzsfdpepxbtbkt.supabase.co.'
                : 'As migrações SQL foram geradas e validadas. Para conectar à nuvem, insira SUPABASE_URL e chaves no arquivo .env.'}
            </p>
          </div>

          {/* SQL Editor Run Card */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-lg shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Instrução Rápida: Criação das 7 Tabelas no Supabase (2 Segundos)
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Para criar os esquemas das 7 tabelas e carregar os seeds no seu Supabase, copie o script SQL consolidado e cole no <strong>SQL Editor</strong> do painel Supabase:
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyFullSql}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                {copiedFullSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedFullSql ? 'SQL Completo Copiado!' : 'Copiar Script SQL Completo (7 Tabelas + Seeds)'}</span>
              </button>
              <a
                href="https://supabase.com/dashboard/project/fvamqiqzsfdpepxbtbkt/sql/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                <span>Abrir SQL Editor no Supabase</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Tables checklist */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Tabelas Obrigatórias do Esquema (7)
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Esquema Válido
              </span>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
              {requiredTables.map((table: string) => {
                const tableInfo = statusData?.tables?.[table];
                return (
                  <div key={table} className="p-3 bg-white dark:bg-slate-900 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                          {table}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          Postgres Table
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {tableDescriptions[table] || 'Tabela da plataforma'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {tableInfo?.count !== undefined && (
                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          {tableInfo.count} reg.
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Pronta
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Migration files info */}
          <div className="border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/40">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
              <FileCode className="w-3.5 h-3.5 text-blue-500" /> Scripts de Migração Disponíveis:
            </span>
            <div className="space-y-1.5 font-mono text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <span>supabase/migrations/20261008000001_initial_schema.sql</span>
                <span className="text-[10px] text-slate-400 font-sans">Esquemas, RLS, Triggers</span>
              </div>
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <span>supabase/migrations/20261008000002_seed_initial_data.sql</span>
                <span className="text-[10px] text-slate-400 font-sans">Seeds com ON CONFLICT</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-slate-200 dark:border-slate-700/60">
              <span className="text-xs text-slate-500">Executar via terminal:</span>
              <button
                type="button"
                onClick={copySqlPath}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-md transition-colors cursor-pointer text-slate-800 dark:text-slate-200"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>npm run supabase:migrate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={fetchStatus}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar Status</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSyncData}
              disabled={runningSync || loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <HardDriveDownload className={`w-3.5 h-3.5 text-emerald-600 ${runningSync ? 'animate-bounce' : ''}`} />
              <span>{runningSync ? 'Sincronizando...' : 'Sincronizar Dados'}</span>
            </button>

            <button
              type="button"
              onClick={handleRunMigrations}
              disabled={runningMigration || loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Database className={`w-3.5 h-3.5 ${runningMigration ? 'animate-spin' : ''}`} />
              <span>{runningMigration ? 'Executando...' : 'Executar Migrações'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
