import React from 'react';
import { Target, CheckCircle2, Circle, X, ArrowRight, BookOpen, Award, Plus } from 'lucide-react';
import { WeeklyMission } from '../../types/index.ts';

interface WeeklyMissionModalProps {
  mission: WeeklyMission & { progressPercent: number; completedCount: number; totalTasks: number };
  isOpen: boolean;
  onClose: () => void;
  onNavigateToStudyHub: () => void;
  onOpenSubmitEssay?: () => void;
}

export const WeeklyMissionModal: React.FC<WeeklyMissionModalProps> = ({
  mission,
  isOpen,
  onClose,
  onNavigateToStudyHub,
  onOpenSubmitEssay
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full my-4 sm:my-6 overflow-hidden shadow-xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Missão Tática da Semana
              </span>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                Objetivo: {mission.objective}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
          {/* Progress bar card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-900">Progresso da Operação</span>
              <span className="font-mono font-bold text-amber-700">{mission.progressPercent}% Concluído</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                style={{ width: `${mission.progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              {mission.completedCount} de {mission.totalTasks} tarefas táticas executadas com sucesso.
            </p>
          </div>

          {/* Checklist of Tasks */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Tarefas Estratégicas
            </h4>
            <div className="space-y-2">
              {mission.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between text-xs gap-3 transition-colors ${
                    task.completed
                      ? 'bg-emerald-50 border-emerald-200 text-slate-800'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                    <span className={task.completed ? 'line-through text-slate-400' : 'font-medium'}>
                      {task.description}
                    </span>
                  </div>

                  {task.targetCount && (
                    <span className="font-mono text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0">
                      {task.currentCount} / {task.targetCount}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {onOpenSubmitEssay && (
              <button
                onClick={() => {
                  onClose();
                  onOpenSubmitEssay();
                }}
                className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Enviar Nova Redação</span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onNavigateToStudyHub();
              }}
              className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-lg border border-slate-300 transition-colors cursor-pointer shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Ver Central de Estudos</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
