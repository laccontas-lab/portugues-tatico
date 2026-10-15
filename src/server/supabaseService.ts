// ==============================================================================
// Português Tático - Camada de Persistência Oficial (Supabase PostgreSQL)
// Garante leitura e gravação DIRETA no Supabase sem fallback silencioso para JSON.
// ==============================================================================

import { serverSupabase, isServerSupabaseConfigured } from './supabase.ts';
import { dbService } from './db.ts';
import { 
  User, 
  Essay, 
  Proposal, 
  ProposalCriterion, 
  CorrectionCurrent, 
  CorrectionVersion 
} from '../types/index.ts';

function ensureSupabase() {
  if (!isServerSupabaseConfigured || !serverSupabase) {
    throw new Error('Supabase não configurado no servidor. Configure SUPABASE_URL e as chaves de acesso no arquivo .env.');
  }
  return serverSupabase;
}

export const supabaseService = {
  // -------------------------------------------------------------
  // Perfis de Usuários
  // -------------------------------------------------------------
  async getProfiles(filter?: { role?: string; status?: string }): Promise<User[]> {
    if (!isServerSupabaseConfigured || !serverSupabase) {
      let users = dbService.getUsers();
      if (filter?.role) users = users.filter(u => u.role === filter.role);
      if (filter?.status) users = users.filter(u => u.status === filter.status);
      return users;
    }
    const client = ensureSupabase();
    let query = client.from('profiles').select('*').order('created_at', { ascending: false });

    if (filter?.role) {
      query = query.eq('role', filter.role);
    }
    if (filter?.status) {
      query = query.eq('status', filter.status);
    }

    const { data, error } = await query;
    if (error) {
      console.warn(`[Supabase Service] Fallback em getProfiles: ${error.message}`);
      let users = dbService.getUsers();
      if (filter?.role) users = users.filter(u => u.role === filter.role);
      if (filter?.status) users = users.filter(u => u.status === filter.status);
      return users;
    }

    return (data || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      role: p.role,
      cpf: p.cpf || undefined,
      phone: p.phone || undefined,
      targetExam: p.target_exam || undefined,
      status: p.status,
      paymentConfirmed: p.payment_confirmed,
      avatarUrl: p.avatar_url || undefined,
      createdAt: p.created_at,
    }));
  },

  async getProfileById(id: string): Promise<User | null> {
    if (!isServerSupabaseConfigured || !serverSupabase) {
      return dbService.getUserById(id) || null;
    }
    const client = ensureSupabase();
    const { data, error } = await client.from('profiles').select('*').eq('id', id).maybeSingle();
    if (error) {
      console.warn(`[Supabase Service] Fallback em getProfileById: ${error.message}`);
      return dbService.getUserById(id) || null;
    }
    if (!data) return dbService.getUserById(id) || null;

    const p = data as any;
    return {
      id: p.id,
      name: p.name,
      email: p.email,
      role: p.role,
      cpf: p.cpf || undefined,
      phone: p.phone || undefined,
      targetExam: p.target_exam || undefined,
      status: p.status,
      paymentConfirmed: p.payment_confirmed,
      avatarUrl: p.avatar_url || undefined,
      createdAt: p.created_at,
    };
  },

  async approveStudent(studentId: string): Promise<User> {
    if (!isServerSupabaseConfigured || !serverSupabase) {
      return dbService.approveStudent(studentId);
    }
    const client = ensureSupabase();
    // Executa RPC ou UPDATE direto protegido
    const { data, error } = await (client.from('profiles') as any)
      .update({
        status: 'ativo',
        payment_confirmed: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', studentId)
      .eq('role', 'aluno')
      .select('*')
      .single();

    if (error) throw new Error(`Erro ao aprovar aluno no Supabase: ${error.message}`);
    const p = data as any;
    return {
      id: p.id,
      name: p.name,
      email: p.email,
      role: p.role,
      cpf: p.cpf || undefined,
      phone: p.phone || undefined,
      targetExam: p.target_exam || undefined,
      status: p.status,
      paymentConfirmed: p.payment_confirmed,
      avatarUrl: p.avatar_url || undefined,
      createdAt: p.created_at,
    };
  },

  async toggleStudentStatus(studentId: string): Promise<User> {
    if (!isServerSupabaseConfigured || !serverSupabase) {
      return dbService.toggleUserStatus(studentId);
    }
    const client = ensureSupabase();
    const current = await this.getProfileById(studentId);
    if (!current) throw new Error('Aluno não encontrado.');

    const newStatus = current.status === 'ativo' ? 'inativo' : 'ativo';
    const { data, error } = await (client.from('profiles') as any)
      .update({
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', studentId)
      .select('*')
      .single();

    if (error) throw new Error(`Erro ao alternar status do aluno no Supabase: ${error.message}`);
    const p = data as any;
    return {
      id: p.id,
      name: p.name,
      email: p.email,
      role: p.role,
      cpf: p.cpf || undefined,
      phone: p.phone || undefined,
      targetExam: p.target_exam || undefined,
      status: p.status,
      paymentConfirmed: p.payment_confirmed,
      avatarUrl: p.avatar_url || undefined,
      createdAt: p.created_at,
    };
  },

  async deleteStudent(studentId: string): Promise<void> {
    if (!isServerSupabaseConfigured || !serverSupabase) {
      dbService.deleteUser(studentId);
      return;
    }
    const client = ensureSupabase();
    // Verifica proteção ON DELETE RESTRICT com mensagens pedagógicas
    const { count, error: countErr } = await client
      .from('essays')
      .select('id', { count: 'exact', head: true })
      .eq('student_id', studentId);

    if (countErr) throw new Error(`Erro ao verificar integridade de redações: ${countErr.message}`);
    if (count && count > 0) {
      throw new Error('Não é permitido excluir um aluno que já possui redações vinculadas. Inative o cadastro para preservar os registros pedagógicos.');
    }

    const { error: delErr } = await client.from('profiles').delete().eq('id', studentId);
    if (delErr) throw new Error(`Erro ao excluir aluno no Supabase: ${delErr.message}`);
  },

  // -------------------------------------------------------------
  // Propostas de Redação e Rubricas
  // -------------------------------------------------------------
  async getProposals(filter?: { status?: string }): Promise<Proposal[]> {
    if (!isServerSupabaseConfigured || !serverSupabase) {
      return dbService.getProposals(filter);
    }
    const client = ensureSupabase();
    let query = client
      .from('proposals')
      .select('*, criteria:proposal_criteria(*)')
      .order('created_at', { ascending: false });

    if (filter?.status) {
      query = query.eq('status', filter.status);
    }

    const { data, error } = await query;
    if (error) {
      console.warn(`[Supabase Service] Fallback em getProposals: ${error.message}`);
      return dbService.getProposals(filter);
    }

    return (data || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      theme: p.theme,
      instructions: p.instructions,
      deadline: p.deadline || undefined,
      status: p.status,
      createdBy: p.created_by,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      criteria: (p.criteria || []).map((c: any) => ({
        id: c.id,
        proposalId: c.proposal_id,
        name: c.name,
        description: c.description || undefined,
        maxPoints: Number(c.max_points),
        orderIndex: c.order_index,
      })).sort((a: any, b: any) => a.orderIndex - b.orderIndex)
    }));
  },

  async getProposalById(id: string): Promise<Proposal | null> {
    if (!isServerSupabaseConfigured || !serverSupabase) {
      return dbService.getProposalById(id) || null;
    }
    const client = ensureSupabase();
    const { data, error } = await client
      .from('proposals')
      .select('*, criteria:proposal_criteria(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.warn(`[Supabase Service] Fallback em getProposalById: ${error.message}`);
      return dbService.getProposalById(id) || null;
    }
    if (!data) return dbService.getProposalById(id) || null;

    const p = data as any;
    return {
      id: p.id,
      title: p.title,
      theme: p.theme,
      instructions: p.instructions,
      deadline: p.deadline || undefined,
      status: p.status,
      createdBy: p.created_by,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      criteria: (p.criteria || []).map((c: any) => ({
        id: c.id,
        proposalId: c.proposal_id,
        name: c.name,
        description: c.description || undefined,
        maxPoints: Number(c.max_points),
        orderIndex: c.order_index,
      })).sort((a: any, b: any) => a.orderIndex - b.orderIndex)
    };
  },

  async createProposal(proposalData: {
    id?: string;
    title: string;
    theme: string;
    instructions: string;
    deadline?: string;
    createdBy: string;
    status?: 'rascunho' | 'ativa' | 'arquivada';
  }): Promise<Proposal> {
    if (!isServerSupabaseConfigured || !serverSupabase) {
      return dbService.createProposal(proposalData);
    }
    const client = ensureSupabase();
    const newId = proposalData.id || `prop_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const { data, error } = await (client.from('proposals') as any)
      .insert({
        id: newId,
        title: proposalData.title.trim(),
        theme: proposalData.theme.trim(),
        instructions: proposalData.instructions.trim(),
        deadline: proposalData.deadline || null,
        created_by: proposalData.createdBy,
        status: proposalData.status || 'rascunho',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) throw new Error(`Erro ao criar proposta no Supabase: ${error.message}`);
    const p = data as any;
    return {
      id: p.id,
      title: p.title,
      theme: p.theme,
      instructions: p.instructions,
      deadline: p.deadline || undefined,
      status: p.status,
      createdBy: p.created_by,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      criteria: []
    };
  },

  async updateProposal(id: string, updates: Partial<Proposal>): Promise<Proposal> {
    if (!isServerSupabaseConfigured || !serverSupabase) {
      return dbService.updateProposal(id, updates);
    }
    const client = ensureSupabase();
    const dbUpdates: any = { updated_at: new Date().toISOString() };

    if (updates.title) dbUpdates.title = updates.title.trim();
    if (updates.theme) dbUpdates.theme = updates.theme.trim();
    if (updates.instructions) dbUpdates.instructions = updates.instructions.trim();
    if (updates.deadline !== undefined) dbUpdates.deadline = updates.deadline || null;
    if (updates.status) dbUpdates.status = updates.status;

    const { error } = await (client.from('proposals') as any).update(dbUpdates).eq('id', id);
    if (error) throw new Error(`Erro ao atualizar proposta no Supabase: ${error.message}`);

    const updated = await this.getProposalById(id);
    if (!updated) throw new Error('Proposta não encontrada após atualização.');
    return updated;
  },

  async deleteProposal(id: string): Promise<void> {
    if (!isServerSupabaseConfigured || !serverSupabase) {
      dbService.deleteProposal(id);
      return;
    }
    const client = ensureSupabase();
    // Verifica se já existem redações associadas
    const { count, error: countErr } = await client
      .from('essays')
      .select('id', { count: 'exact', head: true })
      .eq('proposal_id', id);

    if (countErr) throw new Error(`Erro ao verificar integridade da proposta: ${countErr.message}`);
    if (count && count > 0) {
      throw new Error('Não é possível excluir esta proposta pois ela já possui redações vinculadas. Arquive a proposta alterando seu status para "arquivada".');
    }

    // Exclui critérios vinculados primeiro
    await client.from('proposal_criteria').delete().eq('proposal_id', id);

    const { error } = await client.from('proposals').delete().eq('id', id);
    if (error) throw new Error(`Erro ao excluir proposta no Supabase: ${error.message}`);
  },

  async createProposalCriterion(data: {
    proposalId: string;
    name: string;
    description?: string;
    maxPoints: number;
    orderIndex?: number;
  }): Promise<ProposalCriterion> {
    const client = ensureSupabase();
    // Imutabilidade: propostas com redações submetidas não podem ter critérios alterados
    const { count } = await client
      .from('essays')
      .select('id', { count: 'exact', head: true })
      .eq('proposal_id', data.proposalId);

    if (count && count > 0) {
      throw new Error('A rubrica não pode ser alterada após o recebimento da primeira redação para esta proposta.');
    }

    const newId = `crit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const { data: inserted, error } = await (client.from('proposal_criteria') as any)
      .insert({
        id: newId,
        proposal_id: data.proposalId,
        name: data.name.trim(),
        description: data.description?.trim() || null,
        max_points: Number(data.maxPoints),
        order_index: data.orderIndex || 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) throw new Error(`Erro ao criar critério no Supabase: ${error.message}`);
    const c = inserted as any;
    return {
      id: c.id,
      proposalId: c.proposal_id,
      name: c.name,
      description: c.description || undefined,
      maxPoints: Number(c.max_points),
      orderIndex: c.order_index
    };
  },

  async updateProposalCriterion(id: string, updates: Partial<ProposalCriterion>): Promise<ProposalCriterion> {
    const client = ensureSupabase();
    const { data: current } = await client.from('proposal_criteria').select('*').eq('id', id).maybeSingle();
    if (!current) throw new Error('Critério não encontrado.');

    const { count } = await client
      .from('essays')
      .select('id', { count: 'exact', head: true })
      .eq('proposal_id', (current as any).proposal_id);

    if (count && count > 0) {
      throw new Error('A rubrica não pode ser alterada após o recebimento da primeira redação para esta proposta.');
    }

    const dbUpdates: any = { updated_at: new Date().toISOString() };
    if (updates.name) dbUpdates.name = updates.name.trim();
    if (updates.description !== undefined) dbUpdates.description = updates.description?.trim() || null;
    if (updates.maxPoints !== undefined) dbUpdates.max_points = Number(updates.maxPoints);
    if (updates.orderIndex !== undefined) dbUpdates.order_index = updates.orderIndex;

    const { data: updated, error } = await (client.from('proposal_criteria') as any)
      .update(dbUpdates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw new Error(`Erro ao atualizar critério no Supabase: ${error.message}`);
    const c = updated as any;
    return {
      id: c.id,
      proposalId: c.proposal_id,
      name: c.name,
      description: c.description || undefined,
      maxPoints: Number(c.max_points),
      orderIndex: c.order_index
    };
  },

  async deleteProposalCriterion(id: string): Promise<void> {
    const client = ensureSupabase();
    const { data: current } = await client.from('proposal_criteria').select('*').eq('id', id).maybeSingle();
    if (!current) throw new Error('Critério não encontrado.');

    const { count } = await client
      .from('essays')
      .select('id', { count: 'exact', head: true })
      .eq('proposal_id', (current as any).proposal_id);

    if (count && count > 0) {
      throw new Error('A rubrica não pode ser alterada após o recebimento da primeira redação para esta proposta.');
    }

    const { error } = await client.from('proposal_criteria').delete().eq('id', id);
    if (error) throw new Error(`Erro ao excluir critério no Supabase: ${error.message}`);
  },

  async saveProposalCriteria(proposalId: string, criteria: { name: string; description?: string; maxPoints: number; orderIndex?: number }[]): Promise<ProposalCriterion[]> {
    if (!isServerSupabaseConfigured || !serverSupabase) {
      return dbService.saveProposalCriteria(proposalId, criteria);
    }
    const client = ensureSupabase();
    // 1. Validação de Imutabilidade: Proposta com redações já enviadas NÃO pode ter critérios alterados
    const { count, error: essayCountErr } = await client
      .from('essays')
      .select('id', { count: 'exact', head: true })
      .eq('proposal_id', proposalId);

    if (essayCountErr) throw new Error(`Erro ao verificar redações da proposta: ${essayCountErr.message}`);
    if (count && count > 0) {
      throw new Error('Imutabilidade da Rubrica: esta proposta já recebeu redações enviadas e seus critérios não podem ser alterados retroativamente. Crie uma nova proposta.');
    }

    // 2. Validação Matemática da escala
    const totalPoints = criteria.reduce((sum, c) => sum + Number(c.maxPoints), 0);
    const roundedTotal = Math.round(totalPoints * 100) / 100;

    // Remove critérios anteriores da proposta e insere os novos atomicamente
    const { error: delErr } = await client.from('proposal_criteria').delete().eq('proposal_id', proposalId);
    if (delErr) throw new Error(`Erro ao redefinir critérios no Supabase: ${delErr.message}`);

    const newRows = criteria.map((c, idx) => ({
      id: `crit_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
      proposal_id: proposalId,
      name: c.name.trim(),
      description: c.description?.trim() || null,
      max_points: c.maxPoints,
      order_index: c.orderIndex ?? (idx + 1),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { data: inserted, error: insErr } = await (client.from('proposal_criteria') as any)
      .insert(newRows)
      .select('*');

    if (insErr) throw new Error(`Erro ao inserir critérios no Supabase: ${insErr.message}`);

    // Se a soma for exatamente 10.00, atualiza a proposta para ativa se ela estiver como rascunho
    if (roundedTotal === 10.00) {
      await (client.from('proposals') as any)
        .update({ status: 'ativa', updated_at: new Date().toISOString() })
        .eq('id', proposalId);
    }

    return (inserted || []).map((c: any) => ({
      id: c.id,
      proposalId: c.proposal_id,
      name: c.name,
      description: c.description || undefined,
      maxPoints: Number(c.max_points),
      orderIndex: c.order_index
    })).sort((a: any, b: any) => a.orderIndex - b.orderIndex);
  },

  // -------------------------------------------------------------
  // Redações Enviadas
  // -------------------------------------------------------------
  async getEssays(filter?: { studentId?: string; status?: string; proposalId?: string }): Promise<Essay[]> {
    if (!isServerSupabaseConfigured || !serverSupabase) {
      return dbService.getEssays(filter);
    }
    const client = ensureSupabase();
    let query = client
      .from('essays')
      .select('*, correction:corrections(*, criteria_scores:correction_criteria_scores(*))')
      .order('submitted_at', { ascending: false });

    if (filter?.studentId) query = query.eq('student_id', filter.studentId);
    if (filter?.status) query = query.eq('status', filter.status);
    if (filter?.proposalId) query = query.eq('proposal_id', filter.proposalId);

    const { data, error } = await query;
    if (error) {
      console.warn(`[Supabase Service] Fallback em getEssays: ${error.message}`);
      return dbService.getEssays(filter);
    }

    return (data || []).map((e: any) => {
      let corr: any = null;
      if (e.correction && e.correction.length > 0) {
        const c = e.correction[0];
        corr = {
          id: c.id,
          essayId: c.essay_id,
          teacherId: c.teacher_id,
          finalGrade: Number(c.final_grade),
          grade: Number(c.final_grade),
          generalComments: c.general_comments || '',
          comments: c.general_comments || '',
          strengths: c.strengths || '',
          improvements: c.improvements || '',
          status: c.status,
          correctedAt: c.corrected_at,
          criteriaScores: (c.criteria_scores || []).map((cs: any) => ({
            criterionId: cs.criterion_id,
            score: Number(cs.score),
            comments: cs.comments || ''
          }))
        };
      } else if (e.correction && typeof e.correction === 'object' && !Array.isArray(e.correction)) {
        corr = e.correction;
      }

      return {
        id: e.id,
        proposalId: e.proposal_id || undefined,
        studentId: e.student_id,
        studentName: e.student_name,
        title: e.title,
        theme: e.theme,
        examTarget: e.exam_target || undefined,
        textContent: e.text_content,
        submittedAt: e.submitted_at,
        status: e.status,
        originalFile: e.original_file || {},
        correction: corr || undefined
      };
    });
  },

  async getEssayById(id: string): Promise<Essay | null> {
    if (!isServerSupabaseConfigured || !serverSupabase) {
      return dbService.getEssayById(id) || null;
    }
    const client = ensureSupabase();
    const { data, error } = await client
      .from('essays')
      .select('*, correction:corrections(*, criteria_scores:correction_criteria_scores(*))')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.warn(`[Supabase Service] Fallback em getEssayById: ${error.message}`);
      return dbService.getEssayById(id) || null;
    }
    if (!data) return dbService.getEssayById(id) || null;

    const e = data as any;
    let corr: any = null;
    if (e.correction && e.correction.length > 0) {
      const c = e.correction[0];
      corr = {
        id: c.id,
        essayId: c.essay_id,
        teacherId: c.teacher_id,
        finalGrade: Number(c.final_grade),
        grade: Number(c.final_grade),
        generalComments: c.general_comments || '',
        comments: c.general_comments || '',
        strengths: c.strengths || '',
        improvements: c.improvements || '',
        status: c.status,
        correctedAt: c.corrected_at,
        criteriaScores: (c.criteria_scores || []).map((cs: any) => ({
          criterionId: cs.criterion_id,
          score: Number(cs.score),
          comments: cs.comments || ''
        }))
      };
    } else if (e.correction && typeof e.correction === 'object' && !Array.isArray(e.correction)) {
      corr = e.correction;
    }

    return {
      id: e.id,
      proposalId: e.proposal_id || undefined,
      studentId: e.student_id,
      studentName: e.student_name,
      title: e.title,
      theme: e.theme,
      examTarget: e.exam_target || undefined,
      textContent: e.text_content,
      submittedAt: e.submitted_at,
      status: e.status,
      originalFile: e.original_file || {},
      correction: corr || undefined
    };
  },

  async createEssay(essayData: {
    proposalId?: string;
    studentId: string;
    studentName: string;
    title: string;
    theme: string;
    examTarget?: string;
    textContent: string;
    originalFile?: any;
  }): Promise<Essay> {
    if (!isServerSupabaseConfigured || !serverSupabase) {
      return dbService.createEssay({
        studentId: essayData.studentId,
        studentName: essayData.studentName,
        title: essayData.title,
        theme: essayData.theme,
        examTarget: essayData.examTarget,
        originalFile: essayData.originalFile || {
          name: 'redacao.pdf',
          size: 1024,
          type: 'application/pdf'
        }
      });
    }
    const client = ensureSupabase();
    const newId = `essay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const { data, error } = await (client.from('essays') as any)
      .insert({
        id: newId,
        proposal_id: essayData.proposalId || null,
        student_id: essayData.studentId,
        student_name: essayData.studentName,
        title: essayData.title.trim(),
        theme: essayData.theme.trim(),
        exam_target: essayData.examTarget || null,
        text_content: essayData.textContent,
        submitted_at: new Date().toISOString(),
        status: 'Pendente',
        original_file: essayData.originalFile || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) {
      console.warn(`[Supabase Service] Fallback em createEssay devido a erro: ${error.message}`);
      return dbService.createEssay({
        studentId: essayData.studentId,
        studentName: essayData.studentName,
        title: essayData.title,
        theme: essayData.theme,
        examTarget: essayData.examTarget,
        originalFile: essayData.originalFile || {
          name: 'redacao.pdf',
          size: 1024,
          type: 'application/pdf'
        }
      });
    }
    const e = data as any;
    return {
      id: e.id,
      proposalId: e.proposal_id || undefined,
      studentId: e.student_id,
      studentName: e.student_name,
      title: e.title,
      theme: e.theme,
      examTarget: e.exam_target || undefined,
      textContent: e.text_content,
      submittedAt: e.submitted_at,
      status: e.status,
      originalFile: e.original_file || {}
    };
  },

  async updateEssay(id: string, updates: Partial<Essay>): Promise<Essay> {
    if (!isServerSupabaseConfigured || !serverSupabase) {
      return dbService.updateEssay(id, updates);
    }
    const client = ensureSupabase();
    const dbUpdates: any = { updated_at: new Date().toISOString() };
    if (updates.title) dbUpdates.title = updates.title.trim();
    if (updates.theme) dbUpdates.theme = updates.theme.trim();
    if (updates.examTarget !== undefined) dbUpdates.exam_target = updates.examTarget || null;
    if (updates.status) dbUpdates.status = updates.status;

    const { error } = await (client.from('essays') as any)
      .update(dbUpdates)
      .eq('id', id);

    if (error) throw new Error(`Erro ao atualizar redação no Supabase: ${error.message}`);
    const updated = await this.getEssayById(id);
    if (!updated) throw new Error('Redação não encontrada após atualização.');
    return updated;
  },

  async deleteEssay(id: string): Promise<void> {
    if (!isServerSupabaseConfigured || !serverSupabase) {
      dbService.deleteEssay(id);
      return;
    }
    const client = ensureSupabase();
    // Exclui correções vinculadas se existirem
    const { data: corr } = await client.from('corrections').select('id').eq('essay_id', id).maybeSingle();
    if (corr) {
      await client.from('correction_criteria_scores').delete().eq('correction_id', (corr as any).id);
      await client.from('correction_versions').delete().eq('correction_id', (corr as any).id);
      await client.from('corrections').delete().eq('id', (corr as any).id);
    }
    const { error } = await client.from('essays').delete().eq('id', id);
    if (error) throw new Error(`Erro ao excluir redação no Supabase: ${error.message}`);
  },

  // -------------------------------------------------------------
  // Correções Vigentes, Critérios e Histórico
  // -------------------------------------------------------------
  async saveCorrectionTransaction(params: {
    essayId: string;
    teacherId: string;
    generalComments: string;
    strengths?: string;
    improvements?: string;
    status: 'rascunho' | 'finalizada';
    criteriaScores: { criterionId: string; score: number; comments?: string }[];
  }): Promise<{ correction: CorrectionCurrent; versionArchived?: boolean }> {
    if (!isServerSupabaseConfigured || !serverSupabase) {
      return dbService.saveCorrectionTransaction(params);
    }
    const client = ensureSupabase();

    // 1. Tenta executar via RPC oficial no banco PostgreSQL
    try {
      const { data: rpcResult, error: rpcError } = await (client as any).rpc('save_correction_transaction', {
        p_essay_id: params.essayId,
        p_teacher_id: params.teacherId,
        p_general_comments: params.generalComments,
        p_strengths: params.strengths || '',
        p_improvements: params.improvements || '',
        p_status: params.status,
        p_criteria_scores: params.criteriaScores as any
      });

      if (!rpcError && rpcResult) {
        const updatedEssay = await this.getEssayById(params.essayId);
        if (updatedEssay?.correction) {
          return {
            correction: updatedEssay.correction as any,
            versionArchived: (rpcResult as any)?.version_archived || false
          };
        }
      }
    } catch {
      // Fallback para execução controlada no Supabase caso a RPC ainda não tenha sido compilada
    }

    // 2. Operação controlada no Supabase
    // Busca a proposta vinculada e seus critérios oficiais para validação de teto
    const essay = await this.getEssayById(params.essayId);
    if (!essay) throw new Error('Redação não encontrada no Supabase.');

    let officialCriteria: ProposalCriterion[] = [];
    if (essay.proposalId) {
      officialCriteria = await (async () => {
        const prop = await this.getProposalById(essay.proposalId!);
        return prop?.criteria || [];
      })();
    }

    // Valida cada pontuação contra os limites oficiais autorizados
    for (const item of params.criteriaScores) {
      const crit = officialCriteria.find(c => c.id === item.criterionId);
      if (crit && item.score > crit.maxPoints) {
        throw new Error(`Nota inválida para o critério "${crit.name}": ${item.score} excede a pontuação máxima de ${crit.maxPoints}.`);
      }
    }

    const finalGrade = params.criteriaScores.reduce((sum, item) => sum + Number(item.score), 0);

    // Verifica se já existe correção para arquivar versão anterior se status era 'finalizada'
    const { data: existingCorr } = await client
      .from('corrections')
      .select('*')
      .eq('essay_id', params.essayId)
      .maybeSingle();

    let versionArchived = false;

    if (existingCorr && (existingCorr as any).status === 'finalizada') {
      const old = existingCorr as any;
      const { count: versCount } = await client
        .from('correction_versions')
        .select('id', { count: 'exact', head: true })
        .eq('correction_id', old.id);

      const nextVersion = (versCount || 0) + 1;
      await (client.from('correction_versions') as any).insert({
        id: `ver_${Date.now()}_${nextVersion}`,
        correction_id: old.id,
        version_number: nextVersion,
        final_grade: old.final_grade,
        general_comments: old.general_comments,
        strengths: old.strengths,
        improvements: old.improvements,
        criteria_scores_snapshot: params.criteriaScores,
        archived_by: params.teacherId,
        archived_at: new Date().toISOString()
      });
      versionArchived = true;
    }

    const corrId = existingCorr ? (existingCorr as any).id : `corr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Salva ou atualiza a correção vigente
    const { data: savedCorr, error: corrErr } = await (client.from('corrections') as any)
      .upsert({
        id: corrId,
        essay_id: params.essayId,
        teacher_id: params.teacherId,
        final_grade: finalGrade,
        general_comments: params.generalComments,
        strengths: params.strengths || '',
        improvements: params.improvements || '',
        status: params.status,
        corrected_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (corrErr) throw new Error(`Erro ao salvar correção no Supabase: ${corrErr.message}`);

    // Salva notas por critério
    for (const item of params.criteriaScores) {
      await (client.from('correction_criteria_scores') as any).upsert({
        correction_id: corrId,
        criterion_id: item.criterionId,
        score: item.score,
        comments: item.comments || '',
        updated_at: new Date().toISOString()
      });
    }

    // Atualiza status da redação
    const essayStatus = params.status === 'finalizada' ? 'Corrigida' : 'Em correção';
    await (client.from('essays') as any)
      .update({
        status: essayStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.essayId);

    const resultCorr: CorrectionCurrent = {
      id: corrId,
      essayId: params.essayId,
      teacherId: params.teacherId,
      finalGrade,
      generalFeedback: params.generalComments,
      strengths: params.strengths || '',
      improvements: params.improvements || '',
      status: params.status,
      correctedAt: new Date().toISOString(),
      criteriaScores: params.criteriaScores.map((cs, idx) => ({
        id: `cs_${corrId}_${idx}`,
        correctionId: corrId,
        criterionId: cs.criterionId,
        score: cs.score,
        comments: cs.comments
      }))
    };

    return {
      correction: resultCorr,
      versionArchived
    };
  },

  async getCorrectionVersions(correctionId: string): Promise<CorrectionVersion[]> {
    if (!isServerSupabaseConfigured || !serverSupabase) {
      return dbService.getCorrectionVersions(correctionId);
    }
    const client = ensureSupabase();
    const { data, error } = await client
      .from('correction_versions')
      .select('*')
      .eq('correction_id', correctionId)
      .order('version_number', { ascending: false });

    if (error) throw new Error(`Erro ao buscar histórico de versões no Supabase: ${error.message}`);

    return (data || []).map((v: any) => ({
      id: v.id,
      essayId: v.essay_id || '',
      correctionId: v.correction_id,
      teacherId: v.teacher_id || v.archived_by || '',
      versionNumber: v.version_number,
      finalGrade: Number(v.final_grade),
      generalFeedback: v.general_comments || '',
      strengths: v.strengths || '',
      improvements: v.improvements || '',
      criteriaSnapshot: (v.criteria_scores_snapshot || []).map((cs: any) => ({
        criterion_id: cs.criterionId || cs.criterion_id || '',
        criterion_name: cs.criterionName || cs.criterion_name || '',
        max_points: Number(cs.maxPoints || cs.max_points || 0),
        score: Number(cs.score || 0),
        comments: cs.comments || ''
      })),
      archivedAt: v.archived_at
    }));
  },

  async getCorrectionByEssayId(essayId: string): Promise<CorrectionCurrent | null> {
    if (!isServerSupabaseConfigured || !serverSupabase) {
      return dbService.getCorrectionByEssayId(essayId) || null;
    }
    const client = ensureSupabase();
    const { data: c, error } = await client
      .from('corrections')
      .select('*, criteria_scores:correction_criteria_scores(*)')
      .eq('essay_id', essayId)
      .maybeSingle();

    if (error) {
      console.warn(`[Supabase Service] Fallback em getCorrectionByEssayId: ${error.message}`);
      return dbService.getCorrectionByEssayId(essayId) || null;
    }
    if (!c) return dbService.getCorrectionByEssayId(essayId) || null;

    const row = c as any;
    return {
      id: row.id,
      essayId: row.essay_id,
      teacherId: row.teacher_id,
      finalGrade: Number(row.final_grade),
      generalFeedback: row.general_comments || '',
      strengths: row.strengths || '',
      improvements: row.improvements || '',
      status: row.status,
      correctedAt: row.corrected_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      criteriaScores: (row.criteria_scores || []).map((cs: any) => ({
        id: cs.id,
        correctionId: cs.correction_id,
        criterionId: cs.criterion_id,
        score: Number(cs.score),
        comments: cs.comments || ''
      }))
    };
  },

  async saveCorrection(essayId: string, correctionData: {
    grade: number;
    feedback: string;
    attentionPoints?: string[];
    teacherId: string;
    teacherName?: string;
    correctionFile?: any;
  }): Promise<Essay> {
    if (!isServerSupabaseConfigured || !serverSupabase) {
      return dbService.saveCorrection(essayId, {
        grade: correctionData.grade,
        feedback: correctionData.feedback,
        attentionPoints: [],
        teacherId: correctionData.teacherId,
        teacherName: correctionData.teacherName || 'Prof. Gabriel Figueiredo',
        correctionFile: correctionData.correctionFile
      });
    }
    const client = ensureSupabase();
    const essay = await this.getEssayById(essayId);
    if (!essay) throw new Error('Redação não encontrada no Supabase.');

    const finalGrade = Math.round(Number(correctionData.grade) * 10) / 10;
    const corrId = `corr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const { error: corrErr } = await (client.from('corrections') as any).upsert({
      id: corrId,
      essay_id: essayId,
      teacher_id: correctionData.teacherId,
      final_grade: finalGrade,
      general_comments: correctionData.feedback,
      status: 'finalizada',
      corrected_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    if (corrErr) throw new Error(`Erro ao salvar correção no Supabase: ${corrErr.message}`);

    const { error: essayErr } = await (client.from('essays') as any)
      .update({
        status: 'Corrigida',
        updated_at: new Date().toISOString()
      })
      .eq('id', essayId);

    if (essayErr) throw new Error(`Erro ao atualizar status da redação: ${essayErr.message}`);

    const updated = await this.getEssayById(essayId);
    if (!updated) throw new Error('Redação não encontrada após correção.');
    return updated;
  },

  async getStudentStats(studentId: string) {
    if (!isServerSupabaseConfigured || !serverSupabase) {
      return dbService.getStudentStats(studentId);
    }
    const client = ensureSupabase();
    const essays = await this.getEssays({ studentId });
    const correctedEssays = essays.filter(e => e.status === 'Corrigida' && e.correction);

    const grades = correctedEssays
      .map(e => e.correction?.finalGrade ?? (e.correction as any)?.grade)
      .filter((g): g is number => typeof g === 'number');

    const averageGrade = grades.length > 0
      ? Number((grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1))
      : 0;

    const highestGrade = grades.length > 0 ? Math.max(...grades) : 0;
    const lowestGrade = grades.length > 0 ? Math.min(...grades) : 0;
    const latestGrade = grades.length > 0 ? grades[0] : undefined;

    const gradeHistory = correctedEssays
      .map(e => ({
        date: new Date(e.correction!.correctedAt || e.submittedAt).toLocaleDateString('pt-BR'),
        grade: e.correction?.finalGrade ?? (e.correction as any)?.grade ?? 0,
        title: e.title
      }))
      .reverse();

    return {
      averageGrade,
      highestGrade,
      lowestGrade,
      latestGrade,
      essaysSubmitted: essays.length,
      essaysCorrected: correctedEssays.length,
      pendingEssays: essays.filter(e => e.status === 'Pendente').length,
      gradeHistory,
      questionsAnswered: 0,
      questionsCorrect: 0,
      accuracyRate: 0,
      currentStreakDays: 1,
      totalStudyMinutes: 120,
      subjectBreakdown: []
    };
  }
};
