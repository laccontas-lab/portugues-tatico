export type UserRole = 'professor' | 'aluno';
export type UserStatus = 'ativo' | 'inativo' | 'pendente_aprovacao';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cpf?: string;
  phone?: string;
  targetExam?: string; // e.g. "Polícia Rodoviária Federal", "Oficial PMESP", "EsPCEx"
  status: UserStatus;
  paymentConfirmed?: boolean;
  mustChangePassword?: boolean;
  createdAt: string;
  avatarUrl?: string;
}

export type EssayStatus = 'Pendente' | 'Em correção' | 'Corrigida';

export type AttentionCriterion = 
  | 'Coesão'
  | 'Coerência'
  | 'Argumentação'
  | 'Estrutura'
  | 'Introdução'
  | 'Desenvolvimento'
  | 'Conclusão'
  | 'Gramática'
  | 'Pontuação'
  | 'Adequação ao tema'
  | 'Repertório';

export interface EssayFile {
  name: string;
  size: number;
  type: string; // 'application/pdf' | 'image/png' | 'image/jpeg'
  dataUrl?: string; // base64 representation for download and preview
}

export interface EssayCorrection {
  grade: number; // 0 to 10
  finalGrade?: number;
  feedback: string;
  attentionPoints: AttentionCriterion[];
  correctionFile?: EssayFile;
  correctedAt: string;
  teacherId: string;
  teacherName: string;
}

export interface Essay {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  theme: string;
  examTarget?: string;
  submittedAt: string;
  status: EssayStatus;
  originalFile: EssayFile;
  textContent?: string;
  proposalId?: string;
  correction?: EssayCorrection;
}

export type ProposalStatus = 'rascunho' | 'ativa' | 'arquivada';

export interface ProposalCriterion {
  id: string;
  proposalId: string;
  name: string;
  description?: string;
  maxPoints: number; // e.g. 2.50
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Proposal {
  id: string;
  title: string;
  theme: string;
  instructions: string;
  deadline?: string;
  status: ProposalStatus;
  createdBy: string;
  criteria?: ProposalCriterion[];
  createdAt?: string;
  updatedAt?: string;
}

export type CorrectionStatus = 'rascunho' | 'finalizada';

export interface CorrectionCriterionScore {
  id: string;
  correctionId: string;
  criterionId: string;
  criterionName?: string;
  maxPoints?: number;
  score: number;
  comments?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CorrectionCurrent {
  id: string;
  essayId: string;
  teacherId: string;
  teacherName?: string;
  generalFeedback?: string;
  strengths?: string;
  improvements?: string;
  finalGrade?: number;
  status: CorrectionStatus;
  criteriaScores?: CorrectionCriterionScore[];
  correctedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CorrectionVersion {
  id: string;
  essayId: string;
  correctionId: string;
  teacherId: string;
  versionNumber: number;
  generalFeedback?: string;
  strengths?: string;
  improvements?: string;
  finalGrade: number;
  criteriaSnapshot: {
    criterion_id: string;
    criterion_name: string;
    max_points: number;
    score: number;
    comments?: string;
  }[];
  archivedAt: string;
}

export type QuestionSubject =
  | 'Concordância'
  | 'Regência'
  | 'Crase'
  | 'Pontuação'
  | 'Sintaxe'
  | 'Morfologia'
  | 'Interpretação de Texto'
  | 'Coesão e Coerência';

export type QuestionDifficulty = 'Fácil' | 'Média' | 'Difícil';

export interface QuestionAlternative {
  id: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
}

export interface Question {
  id: string;
  statement: string;
  options: QuestionAlternative[];
  correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
  explanation: string;
  subject: QuestionSubject;
  examBoard: string; // e.g. Cebraspe, Vunesp, FGV, EsPCEx, FCC
  difficulty: QuestionDifficulty;
  year?: number;
  referenceExam?: string;
}

export interface QuestionAttempt {
  id: string;
  userId: string;
  questionId: string;
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
  isCorrect: boolean;
  attemptedAt: string;
  subject: QuestionSubject;
}

export interface WeeklyMission {
  id: string;
  title: string;
  objective: string;
  targetSubject: QuestionSubject;
  tasks: {
    id: string;
    description: string;
    targetCount?: number;
    currentCount?: number;
    completed: boolean;
  }[];
  startDate: string;
  endDate: string;
}

export interface ExamBoardGuide {
  id: string;
  name: string;
  category: 'civil' | 'militar';
  slug: string;
  characteristics: string;
  scoringCriteria: string[];
  recommendedStructure: string;
  tacticalTips: string[];
  sampleTheme: string;
}

export interface TextTipGuide {
  id: string;
  title: string;
  summary: string;
  keyPoints: string[];
  practicalExample: string;
  checklist: string[];
}

export interface TacticalMethodMission {
  number: number;
  title: string;
  subtitle: string;
  objective: string;
  executionSteps: string[];
  modelTemplate: string;
  goldenRule: string;
}

export interface StudentStats {
  essaysSubmitted: number;
  essaysCorrected: number;
  averageGrade: number;
  highestGrade: number;
  lowestGrade?: number;
  latestGrade?: number;
  gradeHistory: { date: string; grade: number; title: string }[];
  questionsAnswered: number;
  questionsCorrect: number;
  accuracyRate: number;
  subjectBreakdown: {
    subject: QuestionSubject;
    answered: number;
    correct: number;
    percentage: number;
  }[];
  criticalWeaknesses: {
    subject: QuestionSubject;
    percentage: number;
    status: 'crítico' | 'atenção' | 'bom' | 'excelente';
  }[];
  frequentAttentionPoints: {
    criterion: AttentionCriterion;
    count: number;
  }[];
}

export interface RankingEntry {
  rank: number;
  studentId: string;
  displayName: string;
  bestGrade: number;
  correctedEssaysCount: number;
  targetExam?: string;
}
