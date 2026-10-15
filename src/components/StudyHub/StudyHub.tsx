import React, { useState } from 'react';
import { ExamBoardGuide, TextTipGuide, TacticalMethodMission } from '../../types/index.ts';
import { api } from '../../lib/api.ts';
import { 
  BookOpen, 
  Shield, 
  FileText, 
  Target, 
  CheckCircle2, 
  ChevronRight, 
  Search, 
  Edit3, 
  Sparkles, 
  Award,
  Layers,
  ChevronDown
} from 'lucide-react';

interface StudyHubProps {
  boards: ExamBoardGuide[];
  textGuides: TextTipGuide[];
  tacticalMethod: TacticalMethodMission[];
  isTeacher: boolean;
  onRefresh: () => Promise<void>;
}

export const StudyHub: React.FC<StudyHubProps> = ({
  boards,
  textGuides,
  tacticalMethod,
  isTeacher,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'bancas' | 'construcao' | 'metodo'>('metodo');
  
  // Bancas category state
  const [boardCategory, setBoardCategory] = useState<'civil' | 'militar'>('civil');
  const [selectedBoardId, setSelectedBoardId] = useState<string>('');

  const filteredBoards = (boards || []).filter(b => b.category === boardCategory);
  const selectedBoard = 
    filteredBoards.find(b => b.id === selectedBoardId) || 
    filteredBoards[0] || 
    (boards && boards[0]) || 
    null;

  // Selected Text Guide
  const [selectedGuideId, setSelectedGuideId] = useState<string>('');
  const selectedTextGuide = 
    (textGuides || []).find(g => g.id === selectedGuideId) || 
    (textGuides && textGuides[0]) || 
    null;

  // Teacher edit tactical method state
  const [editingMission, setEditingMission] = useState<TacticalMethodMission | null>(null);
  const [missionTitle, setMissionTitle] = useState('');
  const [missionSubtitle, setMissionSubtitle] = useState('');
  const [missionObjective, setMissionObjective] = useState('');
  const [missionGoldenRule, setMissionGoldenRule] = useState('');
  const [savingMission, setSavingMission] = useState(false);

  const handleOpenEditMission = (m: TacticalMethodMission) => {
    setEditingMission(m);
    setMissionTitle(m.title);
    setMissionSubtitle(m.subtitle);
    setMissionObjective(m.objective);
    setMissionGoldenRule(m.goldenRule);
  };

  const handleSaveMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMission) return;
    setSavingMission(true);
    try {
      await api.updateTacticalMethod(editingMission.number, {
        title: missionTitle,
        subtitle: missionSubtitle,
        objective: missionObjective,
        goldenRule: missionGoldenRule
      });
      await onRefresh();
      setEditingMission(null);
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar missão.');
    } finally {
      setSavingMission(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
              Acervo Pedagógico
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">Professor Gabriel Figueiredo</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Central de Estudos Tática
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Doutrina de redação, análise analítica de bancas examinadoras e o Método Português Tático.
          </p>
        </div>
      </div>

      {/* 3 Main Navigation Tabs (Sections 18, 19, 20) */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('metodo')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'metodo'
              ? 'border-amber-500 text-amber-800 bg-amber-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Target className="w-4 h-4 text-amber-600" />
          <span>Método Português Tático (Missões 01 a 06)</span>
        </button>

        <button
          onClick={() => setActiveTab('bancas')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'bancas'
              ? 'border-amber-500 text-amber-800 bg-amber-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4 text-amber-600" />
          <span>Como as Bancas Cobram</span>
        </button>

        <button
          onClick={() => setActiveTab('construcao')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'construcao'
              ? 'border-amber-500 text-amber-800 bg-amber-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-600" />
          <span>Dicas de Construção de Texto</span>
        </button>
      </div>

      {/* TAB 1: MÉTODO PORTUGUÊS TÁTICO (Section 20) */}
      {activeTab === 'metodo' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-100/40 to-white border border-amber-200/80 rounded-xl p-6 relative overflow-hidden shadow-xs">
            <div className="max-w-2xl relative z-10">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
                A Fórmula Estratégica da Nota 10
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Método Português Tático: 6 Etapas Operacionais
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Desenvolvido pelo Professor Gabriel Figueiredo para concursos policiais, civis e militares. Um passo a passo militarmente disciplinado, direto ao ponto e orientado à máxima pontuação no espelho da banca.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tacticalMethod.map((mission) => (
              <div
                key={mission.number}
                className="bg-white border border-slate-200 hover:border-amber-400 rounded-xl p-5 flex flex-col justify-between transition-all group shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                      {mission.title}
                    </span>
                    {isTeacher && (
                      <button
                        onClick={() => handleOpenEditMission(mission)}
                        className="text-slate-400 hover:text-amber-600 p-1 transition-colors"
                        title="Editar conteúdo da missão como professor"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                    {mission.subtitle}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {mission.objective}
                  </p>

                  {/* Execution Steps */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                      Passo a Passo Tático:
                    </span>
                    {mission.executionSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <span className="text-amber-600 font-mono font-bold text-[11px] shrink-0 mt-0.5">
                          {idx + 1}.
                        </span>
                        <span className="leading-snug">{step}</span>
                      </div>
                    ))}
                  </div>

                  {/* Model Template */}
                  <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <span className="text-[10px] font-mono uppercase font-bold text-amber-800 block mb-1">
                      Template Operacional:
                    </span>
                    <p className="text-slate-700 italic text-[11px] leading-relaxed">
                      {mission.modelTemplate}
                    </p>
                  </div>
                </div>

                {/* Golden Rule */}
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-amber-800 flex items-start gap-1.5">
                  <span className="font-bold shrink-0">Regra de Ouro:</span>
                  <span className="leading-tight text-slate-600">{mission.goldenRule}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Teacher Edit Modal */}
          {editingMission && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
              <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 shadow-xl">
                <h3 className="text-sm font-bold text-slate-900 mb-3">
                  Editar {editingMission.title} — {editingMission.subtitle}
                </h3>
                <form onSubmit={handleSaveMission} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Título da Etapa</label>
                    <input
                      type="text"
                      value={missionSubtitle}
                      onChange={(e) => setMissionSubtitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Objetivo Estratégico</label>
                    <textarea
                      rows={2}
                      value={missionObjective}
                      onChange={(e) => setMissionObjective(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Regra de Ouro</label>
                    <input
                      type="text"
                      value={missionGoldenRule}
                      onChange={(e) => setMissionGoldenRule(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingMission(null)}
                      className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={savingMission}
                      className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-xs"
                    >
                      {savingMission ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COMO AS BANCAS COBRAM (Section 18) */}
      {activeTab === 'bancas' && (
        <div className="space-y-6">
          {/* Civil vs Militar Subtabs */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-1 p-1 bg-white rounded-lg border border-slate-200 shadow-xs">
              <button
                onClick={() => {
                  setBoardCategory('civil');
                  const firstCivil = (boards || []).find(b => b.category === 'civil');
                  if (firstCivil) setSelectedBoardId(firstCivil.id);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  boardCategory === 'civil'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bancas Civis (Cebraspe, Vunesp, FGV, FCC...)
              </button>

              <button
                onClick={() => {
                  setBoardCategory('militar');
                  const firstMilitar = (boards || []).find(b => b.category === 'militar');
                  if (firstMilitar) setSelectedBoardId(firstMilitar.id);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  boardCategory === 'militar'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bancas Militares (EsPCEx, ESA, AFA, Marinha...)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar with boards list */}
            <div className="lg:col-span-1 space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Examinadoras Disponíveis:
              </span>
              <div className="space-y-1.5">
                {filteredBoards.length === 0 ? (
                  <p className="text-xs text-slate-400 p-3 italic">Nenhuma banca nesta categoria.</p>
                ) : (
                  filteredBoards.map((b) => {
                    const isSelected = selectedBoard?.id === b.id;
                    return (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBoardId(b.id)}
                        className={`w-full p-3 rounded-xl border text-left text-xs flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50 border-amber-400 text-amber-900 font-semibold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span>{b.name}</span>
                        <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-600' : 'text-slate-400'}`} />
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Detailed Board Content */}
            {selectedBoard ? (
              <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs">
                <div>
                  <span className="text-[11px] font-mono uppercase font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                    Dossiê da Examinadora
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    {selectedBoard.name}
                  </h2>
                </div>

                {/* Características */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Características e Forma de Cobrança
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                    {selectedBoard.characteristics}
                  </p>
                </div>

                {/* Critérios de Avaliação */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Critérios de Pontuação e Correção
                  </h4>
                  <div className="space-y-2">
                    {(selectedBoard.scoringCriteria || []).map((crit, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{crit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Estrutura Recomendada */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Estrutura Textual Ideal
                  </h4>
                  <p className="text-xs sm:text-sm text-amber-900 font-medium bg-amber-50 p-3.5 rounded-xl border border-amber-200 leading-relaxed">
                    {selectedBoard.recommendedStructure}
                  </p>
                </div>

                {/* Dicas Táticas do Professor Gabriel */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Estratégias Táticas do Professor Gabriel
                  </h4>
                  <div className="space-y-2">
                    {(selectedBoard.tacticalTips || []).map((tip, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
                        <span className="text-amber-600 font-bold shrink-0">🎯</span>
                        <span className="leading-relaxed">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exemplo de Tema Típico */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Exemplo de Proposta Típica desta Banca:
                  </span>
                  <p className="text-xs font-semibold text-slate-800 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                    "{selectedBoard.sampleTheme}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="lg:col-span-3 p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center">
                <Shield className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold">Nenhuma banca selecionada</p>
                <p className="text-xs text-slate-400 mt-1">Selecione uma examinadora na lista ao lado.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: DICAS DE CONSTRUÇÃO DE TEXTO (Section 19) */}
      {activeTab === 'construcao' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Guides Navigation List */}
          <div className="lg:col-span-1 space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Tópicos de Redação:
            </span>
            {textGuides.map((guide) => {
              const isSelected = selectedGuideId === guide.id;
              return (
                <button
                  key={guide.id}
                  onClick={() => setSelectedGuideId(guide.id)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50 border-amber-400 text-amber-900 font-semibold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="truncate">{guide.title}</span>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-600' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Guide Detail Display */}
          {selectedTextGuide ? (
            <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-xs">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Construção Tática
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                  {selectedTextGuide.title}
                </h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {selectedTextGuide.summary}
                </p>
              </div>

              {/* Key Points */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Pontos de Atenção Estratégicos
                </h4>
                <div className="space-y-1.5">
                  {(selectedTextGuide.keyPoints || []).map((pt, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <span className="leading-relaxed">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practical Example */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1.5">
                <span className="font-bold text-amber-800 uppercase tracking-wider text-[10px] block">
                  Aplicação Prática em Prova:
                </span>
                <p className="leading-relaxed italic">
                  {selectedTextGuide.practicalExample}
                </p>
              </div>

              {/* Checklist */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Checklist de Verificação Rápida
                </h4>
                <div className="space-y-1.5">
                  {(selectedTextGuide.checklist || []).map((chk, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{chk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-3 p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center">
              <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold">Nenhum tópico selecionado</p>
              <p className="text-xs text-slate-400 mt-1">Selecione um tópico na lista ao lado.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
