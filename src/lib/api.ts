import { 
  User, 
  Essay, 
  Proposal,
  ProposalCriterion,
  CorrectionCurrent,
  CorrectionVersion,
  Question, 
  StudentStats, 
  RankingEntry, 
  ExamBoardGuide, 
  TextTipGuide, 
  TacticalMethodMission,
  AttentionCriterion,
  WeeklyMission
} from '../types/index.ts';
import { supabase } from './supabase.ts';

async function getAccessToken(): Promise<string | null> {
  if (typeof window !== 'undefined') {
    const demoToken = localStorage.getItem('portugues_tatico_demo_token');
    if (demoToken) return demoToken;
  }
  if (!supabase) return null;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  } catch {
    return null;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await getAccessToken();
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  if (response.status === 401) {
    window.dispatchEvent(new Event('auth-unauthorized'));
  }

  let data: any;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.error || `Erro na requisição (${response.status})`);
  }

  return data as T;
}

export const api = {
  // Auth via backend session validation
  async me(): Promise<{ user: User }> {
    return request<{ user: User }>('/api/auth/me');
  },

  async logout(): Promise<void> {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    }
  },

  // Stats
  async getTeacherStats(): Promise<any> {
    return request('/api/stats/teacher');
  },

  async getStudentStats(studentId?: string): Promise<StudentStats> {
    const query = studentId ? `?studentId=${encodeURIComponent(studentId)}` : '';
    return request<StudentStats>(`/api/stats/student${query}`);
  },

  // Students (Teacher)
  async getStudents(): Promise<(User & { essaysSubmitted: number; essaysCorrected: number; averageGrade: number; bestGrade: number })[]> {
    return request('/api/students');
  },

  async createStudent(studentData: {
    name: string;
    email: string;
    password: string;
    cpf?: string;
    phone?: string;
    targetExam?: string;
  }): Promise<User> {
    return request<User>('/api/students', {
      method: 'POST',
      body: JSON.stringify(studentData)
    });
  },

  async updateStudent(id: string, updates: Partial<User & { password?: string }>): Promise<User> {
    return request<User>(`/api/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async toggleStudentStatus(id: string): Promise<User> {
    return request<User>(`/api/students/${id}/toggle-status`, {
      method: 'POST'
    });
  },

  async approveStudent(id: string): Promise<User> {
    return request<User>(`/api/students/${id}/approve`, {
      method: 'POST'
    });
  },

  async rejectStudent(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/api/students/${id}/reject`, {
      method: 'POST'
    });
  },

  async togglePayment(id: string): Promise<User> {
    return request<User>(`/api/students/${id}/toggle-payment`, {
      method: 'POST'
    });
  },

  async deleteStudent(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/api/students/${id}`, {
      method: 'DELETE'
    });
  },

  async getStudentProfile(id: string): Promise<{ student: User; essays: Essay[]; stats: StudentStats }> {
    return request(`/api/students/${id}/profile`);
  },

  // Proposals & Rubric Criteria
  async getProposals(): Promise<Proposal[]> {
    return request<Proposal[]>('/api/proposals');
  },

  async getProposal(id: string): Promise<Proposal> {
    return request<Proposal>(`/api/proposals/${id}`);
  },

  async createProposal(data: {
    title: string;
    theme: string;
    instructions: string;
    deadline?: string;
    status?: 'rascunho' | 'ativa' | 'arquivada';
  }): Promise<Proposal> {
    return request<Proposal>('/api/proposals', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateProposal(id: string, updates: Partial<Proposal>): Promise<Proposal> {
    return request<Proposal>(`/api/proposals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async deleteProposal(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/api/proposals/${id}`, {
      method: 'DELETE'
    });
  },

  async createProposalCriterion(proposalId: string, data: {
    name: string;
    description?: string;
    maxPoints: number;
    orderIndex?: number;
  }): Promise<ProposalCriterion> {
    return request<ProposalCriterion>(`/api/proposals/${proposalId}/criteria`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateProposalCriterion(proposalId: string, criterionId: string, data: Partial<ProposalCriterion>): Promise<ProposalCriterion> {
    return request<ProposalCriterion>(`/api/proposals/${proposalId}/criteria/${criterionId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteProposalCriterion(proposalId: string, criterionId: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/api/proposals/${proposalId}/criteria/${criterionId}`, {
      method: 'DELETE'
    });
  },

  // Controlled Atomic Corrections
  async saveCorrectionTransaction(data: {
    essayId: string;
    status: 'rascunho' | 'finalizada';
    generalFeedback?: string;
    strengths?: string;
    improvements?: string;
    criteriaScores: { criterionId: string; score: number; comments?: string }[];
  }): Promise<{ correction: CorrectionCurrent; versionArchived?: boolean }> {
    return request('/api/corrections/transaction', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getEssayCorrection(essayId: string): Promise<CorrectionCurrent | null> {
    return request<CorrectionCurrent | null>(`/api/essays/${essayId}/correction`);
  },

  async getCorrectionVersions(essayId: string): Promise<CorrectionVersion[]> {
    return request<CorrectionVersion[]>(`/api/essays/${essayId}/correction-versions`);
  },

  // Essays
  async getEssays(filters?: { status?: string; studentId?: string; search?: string }): Promise<Essay[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    if (filters?.studentId) params.set('studentId', filters.studentId);
    if (filters?.search) params.set('search', filters.search);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request<Essay[]>(`/api/essays${qs}`);
  },

  async getEssay(id: string): Promise<Essay> {
    return request<Essay>(`/api/essays/${id}`);
  },

  async submitEssay(data: {
    title: string;
    theme: string;
    examTarget?: string;
    originalFile: {
      name: string;
      size: number;
      type: string;
      dataUrl?: string;
    };
  }): Promise<Essay> {
    return request<Essay>('/api/essays', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateEssay(id: string, updates: Partial<Essay>): Promise<Essay> {
    return request<Essay>(`/api/essays/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async deleteEssay(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/api/essays/${id}`, {
      method: 'DELETE'
    });
  },

  async correctEssay(id: string, data: {
    grade: number;
    feedback: string;
    attentionPoints: AttentionCriterion[];
    correctionFile?: {
      name: string;
      size: number;
      type: string;
      dataUrl?: string;
    };
  }): Promise<Essay> {
    return request<Essay>(`/api/essays/${id}/correct`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Questions
  async getDailyQuestion(): Promise<{ question: Question; alreadyAttempted: boolean; previousAttempt?: any }> {
    return request('/api/questions/daily');
  },

  async getQuestions(filters?: { subject?: string; difficulty?: string; examBoard?: string }): Promise<Question[]> {
    const params = new URLSearchParams();
    if (filters?.subject) params.set('subject', filters.subject);
    if (filters?.difficulty) params.set('difficulty', filters.difficulty);
    if (filters?.examBoard) params.set('examBoard', filters.examBoard);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request<Question[]>(`/api/questions${qs}`);
  },

  async createQuestion(q: Omit<Question, 'id'>): Promise<Question> {
    return request<Question>('/api/questions', {
      method: 'POST',
      body: JSON.stringify(q)
    });
  },

  async updateQuestion(id: string, q: Partial<Question>): Promise<Question> {
    return request<Question>(`/api/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(q)
    });
  },

  async deleteQuestion(id: string): Promise<void> {
    await request(`/api/questions/${id}`, { method: 'DELETE' });
  },

  async attemptQuestion(id: string, selectedAnswer: 'A' | 'B' | 'C' | 'D' | 'E'): Promise<{
    isCorrect: boolean;
    correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
    explanation: string;
    subject: string;
    attempt: any;
  }> {
    return request(`/api/questions/${id}/attempt`, {
      method: 'POST',
      body: JSON.stringify({ selectedAnswer })
    });
  },

  // Weekly Mission
  async getWeeklyMission(): Promise<WeeklyMission & { progressPercent: number; completedCount: number; totalTasks: number }> {
    return request('/api/missions/weekly');
  },

  // Ranking
  async getRanking(): Promise<RankingEntry[]> {
    return request<RankingEntry[]>('/api/ranking');
  },

  // Study Hub
  async getExamBoards(): Promise<ExamBoardGuide[]> {
    return request<ExamBoardGuide[]>('/api/study-hub/boards');
  },

  async getTextGuides(): Promise<TextTipGuide[]> {
    return request<TextTipGuide[]>('/api/study-hub/text-guides');
  },

  async getTacticalMethod(): Promise<TacticalMethodMission[]> {
    return request<TacticalMethodMission[]>('/api/study-hub/tactical-method');
  },

  async updateTacticalMethod(missionNum: number, data: Partial<TacticalMethodMission>): Promise<TacticalMethodMission> {
    return request<TacticalMethodMission>(`/api/study-hub/tactical-method/${missionNum}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  // Supabase Integration & Migrations
  async getSupabaseStatus(): Promise<{
    configured: boolean;
    supabaseUrl: string | null;
    requiredTables: string[];
    tables: Record<string, { status: string; count?: number; error?: string }>;
    migrationReport: any;
  }> {
    return request('/api/supabase/status');
  },

  async runSupabaseMigrations(): Promise<{ success: boolean; message: string; report: any }> {
    return request('/api/supabase/migrate', { method: 'POST' });
  },

  async syncSupabaseData(): Promise<{ success: boolean; results?: any; message?: string; error?: string }> {
    return request('/api/supabase/sync', { method: 'POST' });
  },

  async getSupabaseSql(): Promise<{ sql: string }> {
    return request('/api/supabase/sql');
  }
};
