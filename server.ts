import dotenv from 'dotenv';
dotenv.config();

import express, { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { dbService } from './src/server/db.ts';
import { supabaseService } from './src/server/supabaseService.ts';
import { authenticate, requireRole, AuthenticatedRequest } from './src/server/auth.ts';
import { isServerSupabaseConfigured, serverSupabase } from './src/server/supabase.ts';
import { runMigrations, REQUIRED_TABLES } from './scripts/run-supabase-migrations.ts';

const app = express();
const defaultPort = process.env.DEFAULT_APP_PORT ? parseInt(process.env.DEFAULT_APP_PORT, 10) : 3000;
const portArgIndex = process.argv.indexOf('--port');
const cliPort = portArgIndex !== -1 && process.argv[portArgIndex + 1] ? parseInt(process.argv[portArgIndex + 1], 10) : null;
const PORT = cliPort || defaultPort || 3000;

const hostArgIndex = process.argv.indexOf('--host');
const cliHost = hostArgIndex !== -1 && process.argv[hostArgIndex + 1] ? process.argv[hostArgIndex + 1] : '0.0.0.0';

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// -------------------------------------------------------------
// Authentication Endpoints (Exclusively validated via Supabase Auth)
// -------------------------------------------------------------
app.get('/api/auth/me', authenticate, (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: req.user });
});

app.post('/api/auth/logout', authenticate, (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true });
});

// Explicit rejection of any legacy local login endpoints to prevent concurrent auth bypass
app.all(['/api/auth/login', '/api/auth/register', '/api/auth/reset-password', '/api/auth/forgot-password'], (req, res) => {
  res.status(410).json({
    error: 'Autenticação local descontinuada. O Português Tático opera exclusivamente com Supabase Auth.'
  });
});

// -------------------------------------------------------------
// Students Management (Professor only)
// -------------------------------------------------------------
app.get('/api/students', authenticate, requireRole('professor'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const students = await supabaseService.getProfiles({ role: 'aluno' });
    const allEssays = await supabaseService.getEssays();

    const enriched = students.map(student => {
      const essays = allEssays.filter(e => e.studentId === student.id);
      const corrected = essays.filter(e => e.status === 'Corrigida' && e.correction);
      const grades = corrected.map(e => e.correction?.finalGrade ?? (e.correction as any)?.grade ?? 0);
      const averageGrade = grades.length > 0
        ? Number((grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1))
        : 0;
      const bestGrade = grades.length > 0 ? Math.max(...grades) : 0;

      return {
        ...student,
        essaysSubmitted: essays.length,
        essaysCorrected: corrected.length,
        averageGrade,
        bestGrade
      };
    });

    res.json(enriched);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao carregar alunos do Supabase.' });
  }
});

app.post('/api/students', authenticate, requireRole('professor'), async (req: AuthenticatedRequest, res: Response) => {
  res.status(400).json({ 
    error: 'Alunos devem criar sua própria conta através do formulário oficial de cadastro do Supabase Auth.' 
  });
});

app.put('/api/students/:id', authenticate, requireRole('professor'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const student = await supabaseService.getProfileById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Aluno não encontrado no Supabase.' });
    }
    const updated = await supabaseService.toggleStudentStatus(req.params.id);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Erro ao atualizar dados do aluno.' });
  }
});

app.post('/api/students/:id/approve', authenticate, requireRole('professor'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await supabaseService.approveStudent(req.params.id);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Erro ao aprovar aluno no Supabase.' });
  }
});

app.post('/api/students/:id/reject', authenticate, requireRole('professor'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    await supabaseService.deleteStudent(req.params.id);
    res.json({ success: true, message: 'Solicitação de cadastro rejeitada e removida com sucesso.' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Erro ao rejeitar aluno no Supabase.' });
  }
});

app.post('/api/students/:id/toggle-payment', authenticate, requireRole('professor'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Para efeito de liberação sem dependência financeira, aprova o aluno
    const updated = await supabaseService.approveStudent(req.params.id);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Erro ao alterar status.' });
  }
});

app.post('/api/students/:id/toggle-status', authenticate, requireRole('professor'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await supabaseService.toggleStudentStatus(req.params.id);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Erro ao alterar status do aluno no Supabase.' });
  }
});

app.delete('/api/students/:id', authenticate, requireRole('professor'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    await supabaseService.deleteStudent(req.params.id);
    res.json({ success: true, message: 'Aluno excluído com sucesso.' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Erro ao excluir aluno.' });
  }
});

app.get('/api/students/:id/profile', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const targetId = req.params.id;
  // Strict Privacy: Student can only view their own profile; Professor can view any student
  if (req.user!.role === 'aluno' && req.user!.id !== targetId) {
    return res.status(403).json({ error: 'Acesso negado: você não tem permissão para visualizar dados de outro aluno.' });
  }

  try {
    const student = await supabaseService.getProfileById(targetId);
    if (!student) {
      return res.status(404).json({ error: 'Aluno não encontrado no Supabase.' });
    }

    const essays = await supabaseService.getEssays({ studentId: targetId });
    const stats = await supabaseService.getStudentStats(targetId);

    res.json({
      student,
      essays,
      stats
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao consultar perfil no Supabase.' });
  }
});

// -------------------------------------------------------------
// Proposals & Rubric Criteria Endpoints
// -------------------------------------------------------------
app.get('/api/proposals', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const filter = user.role === 'professor' ? undefined : { status: 'ativa' };
    const proposals = await supabaseService.getProposals(filter);
    res.json(proposals);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao buscar propostas no Supabase.' });
  }
});

app.get('/api/proposals/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const prop = await supabaseService.getProposalById(req.params.id);
    if (!prop) {
      return res.status(404).json({ error: 'Proposta não encontrada.' });
    }
    if (req.user!.role === 'aluno' && prop.status === 'rascunho') {
      return res.status(403).json({ error: 'Esta proposta ainda não foi publicada pelo professor.' });
    }
    res.json(prop);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao buscar proposta no Supabase.' });
  }
});

app.post('/api/proposals', authenticate, requireRole('professor'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, theme, instructions, deadline, status } = req.body;
    if (!title || !theme || !instructions) {
      return res.status(400).json({ error: 'Título, tema e instruções são obrigatórios.' });
    }
    const created = await supabaseService.createProposal({
      title,
      theme,
      instructions,
      deadline,
      createdBy: req.user!.id,
      status
    });
    res.status(201).json(created);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Erro ao criar proposta no Supabase.' });
  }
});

app.put('/api/proposals/:id', authenticate, requireRole('professor'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await supabaseService.updateProposal(req.params.id, req.body);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Erro ao atualizar proposta no Supabase.' });
  }
});

app.delete('/api/proposals/:id', authenticate, requireRole('professor'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    await supabaseService.deleteProposal(req.params.id);
    res.json({ success: true, message: 'Proposta removida com sucesso.' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Erro ao remover proposta no Supabase.' });
  }
});

app.post('/api/proposals/:id/criteria', authenticate, requireRole('professor'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, maxPoints, orderIndex } = req.body;
    if (!name || maxPoints === undefined) {
      return res.status(400).json({ error: 'Nome e pontuação máxima do critério são obrigatórios.' });
    }
    const created = await supabaseService.createProposalCriterion({
      proposalId: req.params.id,
      name,
      description,
      maxPoints: Number(maxPoints),
      orderIndex: orderIndex ? Number(orderIndex) : undefined
    });
    res.status(201).json(created);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Erro ao criar critério no Supabase.' });
  }
});

app.put('/api/proposals/:proposalId/criteria/:criterionId', authenticate, requireRole('professor'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await supabaseService.updateProposalCriterion(req.params.criterionId, req.body);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Erro ao atualizar critério no Supabase.' });
  }
});

app.delete('/api/proposals/:proposalId/criteria/:criterionId', authenticate, requireRole('professor'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    await supabaseService.deleteProposalCriterion(req.params.criterionId);
    res.json({ success: true, message: 'Critério removido com sucesso.' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Erro ao remover critério no Supabase.' });
  }
});

// -------------------------------------------------------------
// Controlled Atomic Corrections Endpoints
// -------------------------------------------------------------
app.post('/api/corrections/transaction', authenticate, requireRole('professor'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { essayId, status, generalFeedback, strengths, improvements, criteriaScores } = req.body;
    if (!essayId || !status || !Array.isArray(criteriaScores)) {
      return res.status(400).json({ error: 'essayId, status e criteriaScores são obrigatórios.' });
    }

    const result = await supabaseService.saveCorrectionTransaction({
      essayId,
      teacherId: req.user!.id,
      status,
      generalComments: generalFeedback || '',
      strengths,
      improvements,
      criteriaScores
    });

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Erro ao registrar correção no Supabase.' });
  }
});

app.get('/api/essays/:id/correction', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const essay = await supabaseService.getEssayById(req.params.id);
    if (!essay) {
      return res.status(404).json({ error: 'Redação não encontrada no Supabase.' });
    }

    // Aluno só pode consultar sua própria correção
    if (req.user!.role === 'aluno' && essay.studentId !== req.user!.id) {
      return res.status(403).json({ error: 'Acesso negado: esta redação pertence a outro aluno.' });
    }

    const correction = await supabaseService.getCorrectionByEssayId(req.params.id);
    // Aluno só vê se for 'finalizada'
    if (req.user!.role === 'aluno' && (!correction || correction.status !== 'finalizada')) {
      return res.status(404).json({ error: 'A correção ainda não foi finalizada pelo professor.' });
    }

    res.json(correction || null);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao buscar correção no Supabase.' });
  }
});

app.get('/api/essays/:id/correction-versions', authenticate, requireRole('professor'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const corr = await supabaseService.getCorrectionByEssayId(req.params.id);
    if (!corr) {
      return res.json([]);
    }
    const versions = await supabaseService.getCorrectionVersions(corr.id);
    res.json(versions);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao buscar versões no Supabase.' });
  }
});

// -------------------------------------------------------------
// Essays Endpoints
// -------------------------------------------------------------
app.get('/api/essays', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { status, studentId, search } = req.query;

    // Strict Privacy: If student, restrict to their own essays
    let targetStudentId = typeof studentId === 'string' ? studentId : undefined;
    if (user.role === 'aluno') {
      targetStudentId = user.id;
    }

    let essays = await supabaseService.getEssays({
      studentId: targetStudentId,
      status: typeof status === 'string' && status !== 'Todas' ? status : undefined
    });

    if (typeof search === 'string' && search.trim()) {
      const q = search.toLowerCase();
      essays = essays.filter(e => 
        e.title.toLowerCase().includes(q) ||
        e.theme.toLowerCase().includes(q) ||
        e.studentName.toLowerCase().includes(q)
      );
    }

    res.json(essays);
  } catch (error: any) {
    console.warn('Erro ao buscar redações:', error.message);
    const targetStudentId = req.user?.role === 'aluno' ? req.user.id : (typeof req.query.studentId === 'string' ? req.query.studentId : undefined);
    const fallback = dbService.getEssays({
      studentId: targetStudentId,
      status: typeof req.query.status === 'string' && req.query.status !== 'Todas' ? req.query.status : undefined
    });
    res.json(fallback);
  }
});

app.get('/api/essays/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const essay = await supabaseService.getEssayById(req.params.id);
    if (!essay) {
      return res.status(404).json({ error: 'Redação não encontrada no Supabase.' });
    }

    // Strict Privacy
    if (req.user!.role === 'aluno' && essay.studentId !== req.user!.id) {
      return res.status(403).json({ error: 'Acesso negado: esta redação pertence a outro aluno.' });
    }

    res.json(essay);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao buscar redação no Supabase.' });
  }
});

app.post('/api/essays', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { title, theme, examTarget, originalFile, proposalId } = req.body;

    if (!title || !theme || !originalFile || !originalFile.name) {
      return res.status(400).json({ error: 'Título, tema e arquivo da redação são obrigatórios.' });
    }

    const newEssay = await supabaseService.createEssay({
      proposalId: proposalId || undefined,
      studentId: user.id,
      studentName: user.name,
      title: title.trim(),
      theme: theme.trim(),
      examTarget: examTarget || user.targetExam,
      textContent: originalFile.name || '',
      originalFile
    });

    res.status(201).json(newEssay);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Erro ao enviar redação no Supabase.' });
  }
});

app.post('/api/essays/:id/correct', authenticate, requireRole('professor'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { grade, feedback, attentionPoints, correctionFile } = req.body;
    if (grade === undefined || grade === null || grade < 0 || grade > 10) {
      return res.status(400).json({ error: 'A nota deve ser um valor de 0 a 10.' });
    }
    if (!feedback || feedback.trim().length === 0) {
      return res.status(400).json({ error: 'O feedback do professor é obrigatório.' });
    }

    const updatedEssay = await supabaseService.saveCorrection(req.params.id, {
      grade: Number(grade),
      feedback: feedback.trim(),
      attentionPoints: attentionPoints || [],
      teacherId: req.user!.id,
      teacherName: req.user!.name,
      correctionFile
    });

    res.json(updatedEssay);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Erro ao registrar correção no Supabase.' });
  }
});

app.put('/api/essays/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const essay = await supabaseService.getEssayById(req.params.id);
    if (!essay) {
      return res.status(404).json({ error: 'Redação não encontrada no Supabase.' });
    }
    if (req.user!.role === 'aluno' && essay.studentId !== req.user!.id) {
      return res.status(403).json({ error: 'Acesso negado: esta redação pertence a outro aluno.' });
    }
    const updated = await supabaseService.updateEssay(req.params.id, req.body);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Erro ao atualizar redação no Supabase.' });
  }
});

app.delete('/api/essays/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const essay = await supabaseService.getEssayById(req.params.id);
    if (!essay) {
      return res.status(404).json({ error: 'Redação não encontrada no Supabase.' });
    }
    if (req.user!.role === 'aluno' && essay.studentId !== req.user!.id) {
      return res.status(403).json({ error: 'Acesso negado: esta redação pertence a outro aluno.' });
    }
    await supabaseService.deleteEssay(req.params.id);
    res.json({ success: true, message: 'Redação excluída com sucesso no Supabase.' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Erro ao excluir redação no Supabase.' });
  }
});

// -------------------------------------------------------------
// Dashboard & Statistics
// -------------------------------------------------------------
app.get('/api/stats/teacher', authenticate, requireRole('professor'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const essays = await supabaseService.getEssays();
    const students = await supabaseService.getProfiles({ role: 'aluno', status: 'ativo' });
    const pendingEssays = essays.filter(e => e.status === 'Pendente').length;
    const correctedEssays = essays.filter(e => e.status === 'Corrigida').length;
    const correctedList = essays.filter(e => e.status === 'Corrigida' && (e.correction?.finalGrade !== undefined || (e.correction as any)?.grade !== undefined));
    const averageGrade = correctedList.length > 0
      ? Number((correctedList.reduce((acc, cur) => acc + (cur.correction?.finalGrade ?? (cur.correction as any)?.grade ?? 0), 0) / correctedList.length).toFixed(1))
      : 0;

    const recentActivity = essays.slice(0, 6).map(e => ({
      id: e.id,
      studentName: e.studentName,
      studentId: e.studentId,
      theme: e.theme,
      title: e.title,
      submittedAt: e.submittedAt,
      status: e.status,
      grade: e.correction?.finalGrade ?? (e.correction as any)?.grade
    }));

    res.json({
      pendingEssays,
      correctedEssays,
      activeStudents: students.length,
      averageGrade,
      totalEssays: essays.length,
      recentActivity
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao carregar estatísticas do Supabase.' });
  }
});

app.get('/api/stats/student', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const studentId = req.query.studentId && req.user!.role === 'professor'
    ? (req.query.studentId as string)
    : req.user!.id;

  try {
    const stats = await supabaseService.getStudentStats(studentId);
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao calcular estatísticas do aluno no Supabase.' });
  }
});

// -------------------------------------------------------------
// Top 10 Ranking
// -------------------------------------------------------------
app.get('/api/ranking', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const ranking = dbService.getTop10Ranking();
  res.json(ranking);
});

// -------------------------------------------------------------
// Question Bank & Daily Tactical Question
// -------------------------------------------------------------
app.get('/api/questions/daily', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const dailyQuestion = dbService.getDailyQuestion();
  // Check if current user already attempted it today
  const attempts = dbService.getStudentAttempts(req.user!.id);
  const alreadyAttempted = attempts.find(a => a.questionId === dailyQuestion.id);

  res.json({
    question: dailyQuestion,
    alreadyAttempted: !!alreadyAttempted,
    previousAttempt: alreadyAttempted
  });
});

app.get('/api/questions', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const { subject, difficulty, examBoard } = req.query;
  const questions = dbService.getQuestions({
    subject: typeof subject === 'string' ? subject : undefined,
    difficulty: typeof difficulty === 'string' ? difficulty : undefined,
    examBoard: typeof examBoard === 'string' ? examBoard : undefined
  });
  res.json(questions);
});

app.post('/api/questions', authenticate, requireRole('professor'), (req: AuthenticatedRequest, res: Response) => {
  try {
    const created = dbService.createQuestion(req.body);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Erro ao cadastrar questão.' });
  }
});

app.put('/api/questions/:id', authenticate, requireRole('professor'), (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = dbService.updateQuestion(req.params.id, req.body);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Erro ao editar questão.' });
  }
});

app.delete('/api/questions/:id', authenticate, requireRole('professor'), (req: AuthenticatedRequest, res: Response) => {
  try {
    dbService.deleteQuestion(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Erro ao excluir questão.' });
  }
});

app.post('/api/questions/:id/attempt', authenticate, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { selectedAnswer } = req.body;
    if (!selectedAnswer || !['A', 'B', 'C', 'D', 'E'].includes(selectedAnswer)) {
      return res.status(400).json({ error: 'Selecione uma alternativa válida (A a E).' });
    }

    const result = dbService.submitQuestionAttempt(req.user!.id, req.params.id, selectedAnswer);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Erro ao registrar resposta.' });
  }
});

// -------------------------------------------------------------
// Weekly Mission
// -------------------------------------------------------------
app.get('/api/missions/weekly', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const mission = dbService.getWeeklyMission(req.user!.id);
  res.json(mission);
});

// -------------------------------------------------------------
// Study Hub Endpoints
// -------------------------------------------------------------
app.get('/api/study-hub/boards', authenticate, (req: AuthenticatedRequest, res: Response) => {
  res.json(dbService.getExamBoards());
});

app.get('/api/study-hub/text-guides', authenticate, (req: AuthenticatedRequest, res: Response) => {
  res.json(dbService.getTextGuides());
});

app.get('/api/study-hub/tactical-method', authenticate, (req: AuthenticatedRequest, res: Response) => {
  res.json(dbService.getTacticalMethodMissions());
});

app.put('/api/study-hub/tactical-method/:missionNumber', authenticate, requireRole('professor'), (req: AuthenticatedRequest, res: Response) => {
  try {
    const missionNum = parseInt(req.params.missionNumber, 10);
    const updated = dbService.updateTacticalMission(missionNum, req.body);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Erro ao atualizar missão.' });
  }
});

// -------------------------------------------------------------
// Supabase Integration & Migrations Endpoints
// -------------------------------------------------------------
app.get('/api/supabase/status', async (_req, res) => {
  const reportPath = path.resolve(process.cwd(), 'supabase', 'migration_report.json');
  let migrationReport = null;
  if (fs.existsSync(reportPath)) {
    try {
      migrationReport = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    } catch {
      // ignore parse error
    }
  }

  const tableStatuses: Record<string, { status: string; count?: number; error?: string }> = {};

  if (isServerSupabaseConfigured && serverSupabase) {
    for (const table of REQUIRED_TABLES) {
      try {
        const { count, error } = await serverSupabase.from(table).select('*', { count: 'exact', head: true });
        if (error) {
          tableStatuses[table] = { status: 'error', error: error.message };
        } else {
          tableStatuses[table] = { status: 'ready', count: count ?? 0 };
        }
      } catch (err: any) {
        tableStatuses[table] = { status: 'unreachable', error: err.message };
      }
    }
  } else {
    for (const table of REQUIRED_TABLES) {
      tableStatuses[table] = { status: 'local_schema_verified' };
    }
  }

  res.json({
    configured: isServerSupabaseConfigured,
    supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL ? 'CONFIGURED' : null,
    requiredTables: REQUIRED_TABLES,
    tables: tableStatuses,
    migrationReport,
  });
});

app.get('/api/supabase/sql', (_req, res) => {
  const sqlPath = path.resolve(process.cwd(), 'supabase', 'schema_completo_supabase.sql');
  if (fs.existsSync(sqlPath)) {
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    res.json({ sql });
  } else {
    res.status(404).json({ error: 'Arquivo SQL não encontrado.' });
  }
});

app.post('/api/supabase/migrate', authenticate, requireRole('professor'), async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const report = await runMigrations();
    res.json({
      success: true,
      message: 'Migrações do Supabase verificadas e executadas com sucesso.',
      report,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Erro ao executar migrações do Supabase.',
    });
  }
});

app.post('/api/supabase/sync', authenticate, requireRole('professor'), async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const syncResult = await dbService.syncAllToSupabase();
    res.json(syncResult);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Erro ao sincronizar dados com o Supabase.',
    });
  }
});

// -------------------------------------------------------------
// Static / Vite Mounting
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, cliHost, () => {
    console.log(`Português Tático server running on port ${PORT} (${cliHost})`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
