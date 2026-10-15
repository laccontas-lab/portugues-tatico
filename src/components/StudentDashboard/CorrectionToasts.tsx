import React, { useState, useEffect, useRef } from 'react';
import { Essay, User } from '../../types/index.ts';
import { 
  Award, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  Sparkles, 
  FileCheck,
  Bell,
  Clock
} from 'lucide-react';

export interface CorrectionToastItem {
  id: string;
  essayId: string;
  title: string;
  theme: string;
  grade: number;
  feedback: string;
  correctedAt: string;
  teacherName: string;
  createdAt: number;
}

interface CorrectionToastsProps {
  user: User;
  essays: Essay[];
  onOpenEssayCorrection: (essayId: string) => void;
}

// Gentle pleasant tactical alert chime via Web Audio API
const playAlertChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    // Note 1: E5 (659.25Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.06, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    // Note 2: A5 (880Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0.08, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.45);
  } catch (_) {
    // Audio context may be blocked by autoplay policies until user interaction
  }
};

export const CorrectionToasts: React.FC<CorrectionToastsProps> = ({
  user,
  essays,
  onOpenEssayCorrection
}) => {
  const [toasts, setToasts] = useState<CorrectionToastItem[]>([]);
  const [hoveredToastId, setHoveredToastId] = useState<string | null>(null);
  const storageKey = `tactical_seen_corrections_${user.id}`;
  const initialCheckDone = useRef(false);

  // Helper to mark essay as seen
  const markAsSeen = (essayId: string) => {
    try {
      const stored = localStorage.getItem(storageKey);
      const seenIds: string[] = stored ? JSON.parse(stored) : [];
      if (!seenIds.includes(essayId)) {
        seenIds.push(essayId);
        localStorage.setItem(storageKey, JSON.stringify(seenIds));
      }
    } catch (_) {}
  };

  const removeToast = (toastId: string, essayId: string) => {
    markAsSeen(essayId);
    setToasts(prev => prev.filter(t => t.id !== toastId));
  };

  // Check for new corrections
  useEffect(() => {
    if (!user || user.role !== 'aluno') return;

    // Get list of seen IDs
    let seenIds: string[] = [];
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) seenIds = JSON.parse(stored);
    } catch (_) {}

    // Find student's corrected essays
    const studentCorrected = essays.filter(
      e => e.studentId === user.id && e.status === 'Corrigida' && !!e.correction
    );

    // Check if there are newly corrected essays
    const newCorrected = studentCorrected.filter(e => !seenIds.includes(e.id));

    // Also check if teacher just emitted a cross-tab/demo correction event
    let pendingAlert: any = null;
    try {
      const pendingStr = localStorage.getItem('tactical_pending_correction_alert');
      if (pendingStr) {
        pendingAlert = JSON.parse(pendingStr);
        localStorage.removeItem('tactical_pending_correction_alert');
      }
    } catch (_) {}

    if (newCorrected.length > 0 || (pendingAlert && pendingAlert.studentId === user.id)) {
      const itemsToAdd: CorrectionToastItem[] = [];

      newCorrected.forEach(essay => {
        // Prevent duplicate toasts
        if (!toasts.some(t => t.essayId === essay.id)) {
          itemsToAdd.push({
            id: `toast-${essay.id}-${Date.now()}`,
            essayId: essay.id,
            title: essay.title || essay.theme,
            theme: essay.theme,
            grade: essay.correction!.grade,
            feedback: essay.correction!.feedback,
            correctedAt: essay.correction!.correctedAt,
            teacherName: essay.correction!.teacherName || 'Prof. Gabriel Figueiredo',
            createdAt: Date.now()
          });
        }
      });

      if (itemsToAdd.length > 0) {
        setToasts(prev => [...itemsToAdd, ...prev].slice(0, 3));
        playAlertChime();
      }
    }

    initialCheckDone.current = true;
  }, [essays, user]);

  // Listen to custom window event for instant corrections or test events
  useEffect(() => {
    const handleNewCorrectionEvent = (e: CustomEvent<any>) => {
      const detail = e.detail;
      if (detail && detail.studentId === user.id) {
        const newToast: CorrectionToastItem = {
          id: `toast-instant-${Date.now()}`,
          essayId: detail.essayId,
          title: detail.title || 'Redação Tática',
          theme: detail.theme || 'Tema avaliado',
          grade: Number(detail.grade || 9.0),
          feedback: detail.feedback || 'Excelente aplicação da estrutura dissertativa e do repertório tático.',
          correctedAt: new Date().toISOString(),
          teacherName: 'Prof. Gabriel Figueiredo',
          createdAt: Date.now()
        };
        setToasts(prev => [newToast, ...prev.filter(t => t.essayId !== newToast.essayId)].slice(0, 3));
        playAlertChime();
      }
    };

    window.addEventListener('tactical_essay_corrected' as any, handleNewCorrectionEvent);
    return () => {
      window.removeEventListener('tactical_essay_corrected' as any, handleNewCorrectionEvent);
    };
  }, [user]);

  // Auto-dismiss after 9 seconds if not hovered
  useEffect(() => {
    if (toasts.length === 0) return;

    const timer = setInterval(() => {
      const now = Date.now();
      setToasts(prev => {
        return prev.filter(toast => {
          if (hoveredToastId === toast.id) return true; // pause timer if hovered
          const age = now - toast.createdAt;
          if (age > 9000) {
            markAsSeen(toast.essayId);
            return false;
          }
          return true;
        });
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [toasts, hoveredToastId]);

  if (toasts.length === 0) return null;

  return (
    <div 
      aria-live="polite"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-sm sm:max-w-md w-[calc(100vw-2rem)] sm:w-full space-y-3 pointer-events-none"
    >
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            onMouseEnter={() => setHoveredToastId(toast.id)}
            onMouseLeave={() => setHoveredToastId(null)}
            className="pointer-events-auto bg-slate-950 text-white rounded-xl border-2 border-amber-500/70 shadow-2xl shadow-amber-500/10 overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-5"
          >
            {/* Top Accent Bar */}
            <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 px-3.5 py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-950">
                  Nova Correção Disponível
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id, toast.essayId)}
                className="text-slate-950 hover:text-white p-0.5 rounded transition-colors cursor-pointer"
                title="Fechar notificação"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Main Content Area */}
            <div className="p-3.5 sm:p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400 mt-0.5">
                    <Award className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                      {toast.title}
                    </h4>
                    <p className="text-[11px] text-amber-300/90 font-medium mt-0.5">
                      Corrigida pelo {toast.teacherName}
                    </p>
                  </div>
                </div>

                {/* Grade Badge */}
                <div className="shrink-0 text-right">
                  <div className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md font-mono font-black text-xs sm:text-sm shadow-xs">
                    <span>Nota</span>
                    <span>{toast.grade.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {/* Feedback excerpt */}
              {toast.feedback && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 text-[11px] text-slate-300 italic line-clamp-2">
                  &ldquo;{toast.feedback}&rdquo;
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    removeToast(toast.id, toast.essayId);
                    onOpenEssayCorrection(toast.essayId);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Ver Correção Completa</span>
                </button>

                <button
                  type="button"
                  onClick={() => removeToast(toast.id, toast.essayId)}
                  className="px-2.5 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
                >
                  Depois
                </button>
              </div>
            </div>

            {/* Countdown bar */}
            <div className="h-0.5 w-full bg-slate-800">
              <div 
                className="h-full bg-amber-500 transition-all duration-1000 ease-linear"
                style={{
                  width: `${Math.max(0, 100 - ((Date.now() - toast.createdAt) / 9000) * 100)}%`
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
