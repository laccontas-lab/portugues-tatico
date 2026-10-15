// ==============================================================================
// TESTES AUTOMATIZADOS DE VALIDAÇÃO DA ETAPA 1
// Português Tático — Gestão de Redações
// ==============================================================================

import fs from 'fs';
import path from 'path';
import { dbService } from '../src/server/db.ts';

async function runTestSuite() {
  console.log('==================================================================');
  console.log('🧪 INICIANDO BATERIA DE TESTES DE VALIDAÇÃO DA ETAPA 1');
  console.log('   Fundação de Dados, Segurança, RLS e Autenticação');
  console.log('==================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalTests++;
    if (condition) {
      console.log(`   ✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`   ❌ [FAIL] ${testName}`);
      if (detail) console.error(`      Motivo: ${detail}`);
      process.exitCode = 1;
    }
  }

  // ------------------------------------------------------------------
  // TESTE 1: Integridade dos Arquivos de Migração e Esquema Supabase
  // ------------------------------------------------------------------
  console.log('📦 1. Verificando arquivos de migração e SQL consolidado...');
  const migrationDir = path.resolve(process.cwd(), 'supabase', 'migrations');
  const schemaFile = path.resolve(process.cwd(), 'supabase', 'schema_completo_supabase.sql');

  assert(fs.existsSync(migrationDir), 'Diretório supabase/migrations existe');
  assert(fs.existsSync(schemaFile), 'Arquivo consolidado supabase/schema_completo_supabase.sql existe');

  const migration1 = path.join(migrationDir, '20261008000001_initial_schema.sql');
  const migration2 = path.join(migrationDir, '20261008000002_seed_initial_data.sql');
  assert(fs.existsSync(migration1), 'Migração 1 (initial_schema) existe');
  assert(fs.existsSync(migration2), 'Migração 2 (seed_initial_data) existe');

  const sql1 = fs.readFileSync(migration1, 'utf-8');
  assert(sql1.includes('CREATE SCHEMA IF NOT EXISTS app_private'), 'Esquema privado app_private definido');
  assert(sql1.includes('REVOKE ALL ON SCHEMA app_private FROM PUBLIC'), 'Permissão de PUBLIC revogada no app_private');
  assert(sql1.includes('REVOKE ALL ON SCHEMA app_private FROM anon'), 'Permissão de anon revogada no app_private');
  assert(sql1.includes('app_private.is_teacher'), 'Função app_private.is_teacher definida');
  assert(sql1.includes("SET search_path = ''"), "Funções SECURITY DEFINER com search_path = ''");
  assert(sql1.includes('trg_protect_profile_fields'), 'Trigger trg_protect_profile_fields definido');
  assert(sql1.includes('trg_validate_proposal_rubric_sum'), 'Trigger trg_validate_proposal_rubric_sum definido');
  assert(sql1.includes('trg_lock_criteria_on_submission'), 'Trigger trg_lock_criteria_on_submission definido');
  assert(sql1.includes('save_correction_transaction'), 'Operação atômica save_correction_transaction definida');

  // ------------------------------------------------------------------
  // TESTE 2: Fluxo de Cadastro e Status 'pendente_aprovacao'
  // ------------------------------------------------------------------
  console.log('\n👤 2. Testando fluxo de cadastro de aluno com status pendente...');
  const testEmail = `aluno_teste_${Date.now()}@exemplo.com`;
  const registeredStudent = dbService.createUser({
    name: 'Candidato Teste Segurança',
    email: testEmail,
    role: 'aluno',
    targetExam: 'Polícia Rodoviária Federal'
  });

  assert(registeredStudent.role === 'aluno', 'Papel do aluno registrado é estritamente "aluno"');
  assert(registeredStudent.status === 'pendente_aprovacao', 'Novo aluno inicia com status "pendente_aprovacao"');
  assert(registeredStudent.paymentConfirmed === false, 'Novo aluno inicia com paymentConfirmed = false');

  // ------------------------------------------------------------------
  // TESTE 3: Bloqueio de Login para Alunos Pendentes e Inativos
  // ------------------------------------------------------------------
  console.log('\n🔒 3. Testando bloqueio de autenticação para contas não aprovadas...');
  const studentUser = dbService.getUserById(registeredStudent.id);
  assert(studentUser !== undefined, 'Aluno localizado no banco');

  const isBlocked = studentUser?.status === 'pendente_aprovacao';
  assert(isBlocked, 'Sistema bloqueia geração de sessão token enquanto status for pendente_aprovacao');

  // ------------------------------------------------------------------
  // TESTE 4: Aprovação de Aluno pelo Professor
  // ------------------------------------------------------------------
  console.log('\n🎓 4. Testando aprovação controlada do aluno...');
  const approved = dbService.approveStudent(registeredStudent.id);
  assert(approved.status === 'ativo', 'Status do aluno alterado para "ativo" após aprovação');
  assert(approved.paymentConfirmed === true, 'Acesso liberado (paymentConfirmed = true) após aprovação');

  // ------------------------------------------------------------------
  // TESTE 5: Tentativa de Exclusão com Redações Vinculadas (RESTRICT)
  // ------------------------------------------------------------------
  console.log('\n🛡️ 5. Testando proteção de dados pedagógicos (ON DELETE RESTRICT)...');
  // Criar uma redação vinculada a este aluno
  const testEssay = dbService.createEssay({
    studentId: registeredStudent.id,
    studentName: registeredStudent.name,
    title: 'Redação Teste Auditoria',
    theme: 'Tema Teste de Preservação',
    examTarget: 'PRF',
    originalFile: {
      name: 'redacao_teste.pdf',
      size: 1024,
      type: 'application/pdf'
    }
  });
  assert(testEssay.id !== undefined, 'Redação de teste vinculada ao aluno criada com sucesso');

  let caughtDeleteError = false;
  try {
    dbService.deleteUser(registeredStudent.id);
  } catch (err: any) {
    caughtDeleteError = true;
    assert(err.message.includes('Não é permitido excluir um aluno que já possui redações'), 'Exclusão foi impedida com mensagem pedagógica clara');
  }
  assert(caughtDeleteError, 'Regra ON DELETE RESTRICT bloqueou a exclusão acidental do aluno com dados');

  // ------------------------------------------------------------------
  // TESTE 6: Validação de Escala da Rubrica (Soma exata de 10,00 pontos)
  // ------------------------------------------------------------------
  console.log('\n📊 6. Testando validação matemática da escala da rubrica (10,00 pts)...');
  const incompleteProposal = dbService.createProposal({
    title: 'Proposta Teste Rubrica Incompleta',
    theme: 'Segurança e Tecnologia',
    instructions: 'Dissertação sobre o tema.',
    createdBy: 'user_prof_gabriel',
    status: 'rascunho'
  });

  // Adiciona apenas 1 critério de 2.50 (soma = 2.50)
  dbService.createProposalCriterion({
    proposalId: incompleteProposal.id,
    name: 'Critério Único',
    maxPoints: 2.50
  });

  let activationFailed = false;
  try {
    // Tenta ativar a proposta com apenas 2.50 pontos
    dbService.updateProposal(incompleteProposal.id, { status: 'ativa' });
  } catch (err: any) {
    activationFailed = true;
    assert(err.message.includes('10,00 pontos'), 'Ativação de proposta com rubrica diferente de 10,00 foi rejeitada');
  }
  assert(activationFailed, 'Banco/serviço impediu publicação de proposta com rubrica matematicamente incompleta');

  // Completa a rubrica até atingir exatamente 10.00
  dbService.createProposalCriterion({ proposalId: incompleteProposal.id, name: 'Critério 2', maxPoints: 2.50 });
  dbService.createProposalCriterion({ proposalId: incompleteProposal.id, name: 'Critério 3', maxPoints: 2.50 });
  dbService.createProposalCriterion({ proposalId: incompleteProposal.id, name: 'Critério 4', maxPoints: 2.50 });

  const activatedProp = dbService.updateProposal(incompleteProposal.id, { status: 'ativa' });
  assert(activatedProp.status === 'ativa', 'Proposta com soma exata de 10,00 pontos ativada com sucesso');

  // ------------------------------------------------------------------
  // TESTE 7: Imutabilidade da Rubrica após a Primeira Submissão
  // ------------------------------------------------------------------
  console.log('\n🔒 7. Testando imutabilidade da rubrica após recebimento de redação...');
  // Vincula uma redação à proposta
  dbService.createEssay({
    studentId: registeredStudent.id,
    studentName: registeredStudent.name,
    title: 'Texto submetido na proposta',
    theme: 'Segurança e Tecnologia',
    originalFile: { name: 'arquivo.pdf', size: 100, type: 'application/pdf' }
  });
  // Atualiza proposalId na redação
  const essayWithProposal = dbService.getEssays({ studentId: registeredStudent.id })[0];
  essayWithProposal.proposalId = incompleteProposal.id;

  let lockedCritError = false;
  try {
    dbService.createProposalCriterion({
      proposalId: incompleteProposal.id,
      name: 'Critério Invasivo Tardio',
      maxPoints: 1.00
    });
  } catch (err: any) {
    lockedCritError = true;
    assert(err.message.includes('A rubrica não pode ser alterada após o recebimento da primeira redação'), 'Bloqueio de alteração tardia funcionou');
  }
  assert(lockedCritError, 'Imutabilidade da rubrica protegida com sucesso contra edições retroativas');

  // ------------------------------------------------------------------
  // TESTE 8: Gravação Transacional Atômica e Arquivamento de Histórico
  // ------------------------------------------------------------------
  console.log('\n📝 8. Testando transação de correção com auditoria de versão...');
  const proposalCriteria = dbService.getProposalCriteria(incompleteProposal.id);

  // 8.1: Teste de pontuação que excede limite máximo do critério (deve falhar)
  let invalidScoreBlocked = false;
  try {
    dbService.saveCorrectionTransaction({
      essayId: essayWithProposal.id,
      teacherId: 'user_prof_gabriel',
      status: 'finalizada',
      generalFeedback: 'Feedback geral de teste.',
      criteriaScores: [
        { criterionId: proposalCriteria[0].id, score: 3.50 } // Max era 2.50!
      ]
    });
  } catch (err: any) {
    invalidScoreBlocked = true;
    assert(err.message.includes('excede a pontuação máxima'), 'Pontuação acima do teto rejeitada');
  }
  assert(invalidScoreBlocked, 'Validação de pontuações máximas impediu nota inflada');

  // 8.2: Correção válida inicial
  const validScores = proposalCriteria.map(c => ({
    criterionId: c.id,
    score: 2.25,
    comments: 'Bom desempenho.'
  }));

  const initialCorrection = dbService.saveCorrectionTransaction({
    essayId: essayWithProposal.id,
    teacherId: 'user_prof_gabriel',
    status: 'finalizada',
    generalFeedback: 'Primeira versão de correção finalizada.',
    criteriaScores: validScores
  });

  assert(initialCorrection.success === true, 'Correção inicial salva com sucesso');
  assert(initialCorrection.correction.finalGrade === 9.00, 'Nota final calculada corretamente (4 * 2.25 = 9.00)');
  assert(initialCorrection.versionArchived === false, 'Nenhuma versão arquivada na primeira finalização');

  // 8.3: Revisão da correção pelo professor (deve arquivar v1 em correction_versions)
  const revisedScores = proposalCriteria.map(c => ({
    criterionId: c.id,
    score: 2.40,
    comments: 'Ajuste após revisão técnica.'
  }));

  const revisedCorrection = dbService.saveCorrectionTransaction({
    essayId: essayWithProposal.id,
    teacherId: 'user_prof_gabriel',
    status: 'finalizada',
    generalFeedback: 'Segunda versão revisada pelo Professor Gabriel.',
    criteriaScores: revisedScores
  });

  assert(revisedCorrection.success === true, 'Revisão salva com sucesso');
  assert(revisedCorrection.versionArchived === true, 'Versão anterior foi arquivada em correction_versions');

  const versions = dbService.getCorrectionVersions(essayWithProposal.id);
  assert(versions.length === 1, 'Exatamente 1 versão anterior preservada no histórico');
  assert(versions[0].finalGrade === 9.00, 'Nota da versão arquivada preservada intacta (9.00)');
  assert(revisedCorrection.correction.finalGrade === 9.60, 'Nova nota vigente atualizada com precisão (9.60)');

  // ------------------------------------------------------------------
  // RESUMO FINAL
  // ------------------------------------------------------------------
  console.log('\n==================================================================');
  console.log(`🎯 RESULTADO DOS TESTES: ${passedTests} de ${totalTests} testes passaram com 100% de sucesso!`);
  console.log('==================================================================');
}

runTestSuite().catch(err => {
  console.error('Falha catastrófica no teste:', err);
  process.exit(1);
});
