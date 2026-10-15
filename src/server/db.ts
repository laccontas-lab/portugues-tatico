import fs from 'fs';
import path from 'path';
import { 
  User, 
  Essay, 
  Proposal,
  ProposalCriterion,
  CorrectionCurrent,
  CorrectionCriterionScore,
  CorrectionVersion,
  Question, 
  QuestionAttempt, 
  StudentStats, 
  RankingEntry, 
  ExamBoardGuide, 
  TextTipGuide, 
  TacticalMethodMission, 
  QuestionSubject, 
  AttentionCriterion 
} from '../types/index.ts';
import { serverSupabase, isServerSupabaseConfigured } from './supabase.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'portugues_tatico_db.json');

export interface DatabaseSchema {
  users: User[];
  essays: Essay[];
  proposals: Proposal[];
  proposalCriteria: ProposalCriterion[];
  corrections: CorrectionCurrent[];
  correctionVersions: CorrectionVersion[];
  questions: Question[];
  questionAttempts: QuestionAttempt[];
  examBoards: ExamBoardGuide[];
  textGuides: TextTipGuide[];
  tacticalMissions: TacticalMethodMission[];
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Initial Seed Data (Managed via Supabase Auth & profiles table)
// Usuários reais são criados exclusivamente via Supabase Auth.
const initialUsers: User[] = [];

export const initialProposals: Proposal[] = [];

export const initialProposalCriteria: ProposalCriterion[] = [];

// Sample base64 text snippet for simulation of original and corrected PDFs
const SAMPLE_DOC_PREVIEW = 'data:text/plain;charset=utf-8;base64,UkVEQcOHw4NPIFRBVEFDQSBQT1JUVUdVw4pTCgo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQpUcmFuc2NyacOnw6NvIGVzdHJ1dHVyYWRhIGRhIHJlZGHDp8OjbyBlbnZpYWRhIG5vIFBvcnR1Z3XDqnMgVMOidGljby4=';

const initialEssays: Essay[] = [];

const initialQuestions: Question[] = [
  {
    id: 'q_01',
    statement: 'Assinale a alternativa em que a concordância verbal está em estrita conformidade com a norma-padrão da língua portuguesa:',
    options: [
      { id: 'A', text: 'Houveram muitos incidentes graves durante a operação policial na rodovia federal.' },
      { id: 'B', text: 'Faziam anos que a corporação não realizava concurso público para oficiais.' },
      { id: 'C', text: 'Tratam-se de investigações complexas conduzidas pela delegacia especializada.' },
      { id: 'D', text: 'Mais de um policial e mais de um perito compareceu ao local do crime.' },
      { id: 'E', text: 'Devem existir evidências materiais suficientes para corroborar a denúncia.' }
    ],
    correctAnswer: 'E',
    explanation: 'Na alternativa E, a locução "devem existir" tem como sujeito "evidências materiais suficientes" (plural). O verbo "existir" é pessoal, transmitindo sua concordância para o verbo auxiliar "dever" (Devem existir). Nas outras: A) O verbo haver no sentido de existir é impessoal: "Houve muitos incidentes"; B) O verbo fazer indicando tempo transcorrido é impessoal: "Fazia anos"; C) Com índice de indeterminação do sujeito "se", o verbo transitivo indireto fica no singular: "Trata-se de investigações".',
    subject: 'Concordância',
    examBoard: 'Cebraspe',
    difficulty: 'Média',
    year: 2024,
    referenceExam: 'Polícia Federal — Agente'
  },
  {
    id: 'q_02',
    statement: 'Analise o emprego do sinal indicativo de crase nas orações a seguir e assinale a opção correta quanto à regência e à crase:',
    options: [
      { id: 'A', text: 'O comandante referiu-se à ordens superiores emanadas pelo Ministério da Defesa.' },
      { id: 'B', text: 'O agente informou o ocorrido à pessoa cujo veículo fora furtado.' },
      { id: 'C', text: 'A patrulha militar agiu com rapidez e dirigiu-se à um galpão abandonado.' },
      { id: 'D', text: 'O delegado aspirava o cargo de diretor geral do departamento de polícia.' },
      { id: 'E', text: 'Os candidatos foram submetidos à testes rigorosos de aptidão física.' }
    ],
    correctAnswer: 'B',
    explanation: 'Na alternativa B: O verbo "informar" é bitransitivo (informar algo A alguém): "o ocorrido" (OD) + "à pessoa" (OI preposição "a" + artigo definido "a" = crase obrigatória). Erros nas outras: A) Não há crase antes de palavra no plural sem artigo definido ("a ordens"); C) Não há crase antes de artigo indefinido "um"; D) O verbo "aspirar" no sentido de desejar/almejar exige preposição "a": "aspirava ao cargo"; E) Não há crase antes de palavra no masculino e plural ("a testes").',
    subject: 'Crase',
    examBoard: 'Vunesp',
    difficulty: 'Média',
    year: 2024,
    referenceExam: 'PMESP — Oficial do Barro Branco'
  },
  {
    id: 'q_03',
    statement: 'No que concerne à regência verbal de acordo com a norma culta, assinale a oração redigida de forma impecável:',
    options: [
      { id: 'A', text: 'O investigador preferiu interrogar o suspeito do que aguardar a perícia técnica.' },
      { id: 'B', text: 'O oficial visou aos documentos oficiais antes de autorizar o envio ao tribunal militar.' },
      { id: 'C', text: 'Custou ao policial para entender os verdadeiros motivos do crime hediondo.' },
      { id: 'D', text: 'Todos os cidadãos devem obedecer os sinais regulamentares de trânsito rodoviário.' },
      { id: 'E', text: 'A equipe de resgate assistiu os feridos com presteza e dedicação humanitária.' }
    ],
    correctAnswer: 'E',
    explanation: 'O verbo "assistir" no sentido de prestar auxílio/socorro é transitivo direto (ou transitivo indireto com preposição a), aceitando a regência direta "assistiu os feridos". Erros: A) O verbo preferir rejeita "do que" ou "mais que": prefere-se uma coisa A outra ("preferiu interrogar o suspeito a aguardar"); B) "Visar" no sentido de pôr visto/assinar é transitivo direto ("visou os documentos"); C) A construção clássica do verbo custar no sentido de ser difícil é: "Custou ao policial entender..." (sem a preposição "para"); D) O verbo "obedecer" é estritamente transitivo indireto ("obedecer aos sinais").',
    subject: 'Regência',
    examBoard: 'FGV',
    difficulty: 'Difícil',
    year: 2023,
    referenceExam: 'Polícia Civil — Escrivão'
  },
  {
    id: 'q_04',
    statement: 'Assinale a alternativa em que a pontuação respeita integralmente as regras gramaticais e a clareza sintática do período:',
    options: [
      { id: 'A', text: 'Os relatórios de inteligência militar, apontam que o crime organizado atua de forma transnacional.' },
      { id: 'B', text: 'Durante a abordagem noturna os agentes encontraram, armas e munições de grosso calibre.' },
      { id: 'C', text: 'A soberania do Estado, embora constantemente desafiada, permanece como alicerce da ordem jurídica.' },
      { id: 'D', text: 'Nenhum dos novos recrutas soube explicar, por que a guarda havia sido desfeita.' },
      { id: 'E', text: 'O perito colheu as amostras, e as encaminhou para análise laboratorial imediata.' }
    ],
    correctAnswer: 'C',
    explanation: 'Na alternativa C, a oração subordinada adverbial concessiva intercalada "embora constantemente desafiada" está corretamente isolada por vírgulas duplas, sem separar o sujeito ("A soberania do Estado") do seu predicado verbal. Em A: Vírgula incorreta separando sujeito de verbo. Em B: Vírgula proibida separando verbo transitivo de objeto direto. Em D: Vírgula separando a oração subordinada substantiva objetiva direta. Em E: Vírgula dispensável antes de "e" com o mesmo sujeito.',
    subject: 'Pontuação',
    examBoard: 'EsPCEx',
    difficulty: 'Fácil',
    year: 2024,
    referenceExam: 'Exército Brasileiro — Cadete'
  },
  {
    id: 'q_05',
    statement: 'Considere o período: "Apresentadas as conclusões da comissão de sindicância, os delegados deliberaram sobre as punições cabíveis." A oração reduzida destacada classifica-se sintaticamente como subordinada:',
    options: [
      { id: 'A', text: 'Adverbial causal reduzida de particípio.' },
      { id: 'B', text: 'Adverbial temporal reduzida de particípio.' },
      { id: 'C', text: 'Adverbial condicional reduzida de gerúndio.' },
      { id: 'D', text: 'Substantiva completiva nominal.' },
      { id: 'E', text: 'Adjetiva restritiva reduzida de particípio.' }
    ],
    correctAnswer: 'B',
    explanation: 'Ao desenvolver a oração: "Assim que foram apresentadas as conclusões..." ou "Quando foram apresentadas as conclusões...". Trata-se indiscutivelmente de uma oração subordinada adverbial temporal reduzida de particípio.',
    subject: 'Sintaxe',
    examBoard: 'Cebraspe',
    difficulty: 'Difícil',
    year: 2023,
    referenceExam: 'PRF — Policial Rodoviário Federal'
  },
  {
    id: 'q_06',
    statement: 'Identifique a opção em que a concordância nominal atende às normas da gramática normativa:',
    options: [
      { id: 'A', text: 'Seguem anexo às correspondências os laudos periciais solicitados pelo magistrado.' },
      { id: 'B', text: 'A delegada declarou que ela mesma redigiu o auto de prisão em flagrante delito.' },
      { id: 'C', text: 'Para o ingresso no curso de formação, é necessária pontuação alta e dedicação total.' },
      { id: 'D', text: 'Os militares estavam bastante cansados, mas se mantiveram alertas durante o turno.' },
      { id: 'E', text: 'A entrada no quartel general é proibido para civis desacompanhados.' }
    ],
    correctAnswer: 'B',
    explanation: 'O pronome reflexivo "mesmo" concorda com a pessoa a que se refere: a delegada declarou que ela mesma redigiu. Erros nas demais: A) "Seguem anexos os laudos" (concorda com laudos); C) Com sujeito posposto determinado, se houver artigo "é necessária A pontuação", mas sem artigo seria "é necessário pontuação"; D) "alertas" como adjetivo concorda com militares, mas D possui "bastante" como advérbio correto e "alertas" pluralizado (embora alerta costume figurar invariável na tradição militar); E) "é proibida" quando há o artigo definido "a entrada". Portanto B é a regra de ouro.',
    subject: 'Concordância',
    examBoard: 'FCC',
    difficulty: 'Média',
    year: 2024,
    referenceExam: 'Tribunal de Justiça — Oficial de Justiça'
  },
  {
    id: 'q_07',
    statement: 'Assinale a alternativa em que a regência do verbo destacado e o emprego de preposições estão plenamente adequados:',
    options: [
      { id: 'A', text: 'Esta é a viatura da polícia que o motorista bateu na rodovia federal.' },
      { id: 'B', text: 'O cargo militar a que a aspirante almeja exige renúncia e disciplina férrea.' },
      { id: 'C', text: 'Os documentos com que o escrivão fez referência constam no inquérito policial.' },
      { id: 'D', text: 'O tema sobre o qual o coronel discursou versava sobre a estratégia de fronteiras.' },
      { id: 'E', text: 'Aquela foi a perícia cujos resultados todos os agentes duvidavam.' }
    ],
    correctAnswer: 'D',
    explanation: 'Quem discursa, discursa "sobre" algo ("O tema sobre o qual o coronel discursou"). Em A: "em que o motorista bateu"; em B: "almejar" é transitivo direto ("o cargo que a aspirante almeja"); em C: quem faz referência, faz referência "a" ("a que o escrivão fez referência"); em E: quem duvida, duvida "de" ("de cujos resultados todos os agentes duvidavam").',
    subject: 'Regência',
    examBoard: 'Cebraspe',
    difficulty: 'Difícil',
    year: 2024,
    referenceExam: 'Polícia Federal — Perito Criminal'
  },
  {
    id: 'q_08',
    statement: 'No trecho: "O policial, cujo distintivo reluzia à luz do sol matutino, avançou com cautela.", o vocábulo CUJO desempenha a função sintática de:',
    options: [
      { id: 'A', text: 'Sujeito da oração adjetiva.' },
      { id: 'B', text: 'Adjunto adnominal do substantivo distintivo.' },
      { id: 'C', text: 'Complemento nominal.' },
      { id: 'D', text: 'Objeto direto do verbo reluzia.' },
      { id: 'E', text: 'Aposto explicativo do policial.' }
    ],
    correctAnswer: 'B',
    explanation: 'O pronome relativo "cujo" e suas flexões exercem invariavelmente a função sintática de adjunto adnominal do substantivo determinado que introduz (o distintivo dele = cujo distintivo).',
    subject: 'Sintaxe',
    examBoard: 'Vunesp',
    difficulty: 'Média',
    year: 2023,
    referenceExam: 'PMESP — Soldado de 2ª Classe'
  }
];

// Seed question attempts to simulate performance on topics
const initialAttempts: QuestionAttempt[] = [
  // Lucas Mendes (PRF)
  { id: 'att_1', userId: 'user_lucas_mendes', questionId: 'q_01', selectedAnswer: 'E', isCorrect: true, attemptedAt: '2026-09-20T10:00:00Z', subject: 'Concordância' },
  { id: 'att_2', userId: 'user_lucas_mendes', questionId: 'q_02', selectedAnswer: 'B', isCorrect: true, attemptedAt: '2026-09-21T11:00:00Z', subject: 'Crase' },
  { id: 'att_3', userId: 'user_lucas_mendes', questionId: 'q_03', selectedAnswer: 'E', isCorrect: true, attemptedAt: '2026-09-22T14:30:00Z', subject: 'Regência' },
  { id: 'att_4', userId: 'user_lucas_mendes', questionId: 'q_04', selectedAnswer: 'B', isCorrect: false, attemptedAt: '2026-09-23T15:20:00Z', subject: 'Pontuação' },
  { id: 'att_5', userId: 'user_lucas_mendes', questionId: 'q_05', selectedAnswer: 'A', isCorrect: false, attemptedAt: '2026-09-24T16:00:00Z', subject: 'Sintaxe' },
  { id: 'att_6', userId: 'user_lucas_mendes', questionId: 'q_06', selectedAnswer: 'B', isCorrect: true, attemptedAt: '2026-09-25T17:10:00Z', subject: 'Concordância' },
  { id: 'att_7', userId: 'user_lucas_mendes', questionId: 'q_07', selectedAnswer: 'B', isCorrect: false, attemptedAt: '2026-09-26T18:00:00Z', subject: 'Regência' },
  { id: 'att_8', userId: 'user_lucas_mendes', questionId: 'q_08', selectedAnswer: 'B', isCorrect: true, attemptedAt: '2026-09-27T09:40:00Z', subject: 'Sintaxe' }
];

const initialExamBoards: ExamBoardGuide[] = [
  {
    id: 'board_cebraspe',
    name: 'Cebraspe / Cespe',
    category: 'civil',
    slug: 'cebraspe',
    characteristics: 'Estrutura dissertativo-argumentativa ou dissertativa com tópicos pontuais pré-definidos (padrão de resposta fechado). Avalia densidade informativa, domínio da terminologia técnica da segurança e precisão vocabular sem rodeios.',
    scoringCriteria: [
      'Apresentação e Legibilidade (0,5 a 1,0 ponto): Margens impecáveis, ausência de rasuras grotescas e translineação correta.',
      'Estrutura Textual e Coesão: Conectivos interparágrafos e encadeamento lógico de argumentos.',
      'Desenvolvimento dos Tópicos (maior peso da prova): Cada tópico do edital deve ser respondido em um parágrafo dedicado.',
      'Penalização Gramatical: Cálculo clássico Nota = Conteúdo - (Número de Erros / Total de Linhas) * Fator.'
    ],
    recommendedStructure: '1 Parágrafo de Introdução apresentando a tese e mapeando os tópicos + 1 Parágrafo para cada tópico exigido na prova (geralmente Tópico 1, 2 e 3) + 1 Parágrafo de Conclusão sintética.',
    tacticalTips: [
      'Inicie os parágrafos de desenvolvimento citando explicitamente os termos da banca (ex: "No que concerne ao combate à lavagem de capitais...").',
      'Nunca deixe um tópico da banca sem resposta expressa, pois a régua de correção do Cebraspe é pontuada por espelho analítico de tópicos.',
      'Escreva com letra legível e preencha sempre entre 27 e 30 linhas para diluir o impacto das penalizações gramaticais.'
    ],
    sampleTheme: 'O papel da Polícia Rodoviária Federal na garantia da mobilidade e segurança nas rodovias sustentáveis do século XXI.'
  },
  {
    id: 'board_vunesp',
    name: 'Vunesp',
    category: 'civil',
    slug: 'vunesp',
    characteristics: 'Predileção por temas de relevância social, dilemas éticos, cidadania e direitos coletivos. Exige tese muito bem defendida com posicionamento claro desde a introdução.',
    scoringCriteria: [
      'Tema (Adequação temático-conceitual): Não tangenciar o tema nem cometer fuga parcial.',
      'Estrutura (Gênero dissertativo-argumentativo): Proposições lógicas, introdução com tese, desenvolvimento com argumentos de autoridade e conclusão coesa.',
      'Expressão (Norma-Padrão e Coesão): Domínio impecável da regência, concordância, crase e precisão semântica.'
    ],
    recommendedStructure: 'Clássica em 4 parágrafos: Introdução (Tópico frasal + Tese + 2 Argumentos norteadores) + D1 (Argumento 1 aprofundado) + D2 (Argumento 2 aprofundado) + Conclusão (Retomada da tese e proposta reflexiva).',
    tacticalTips: [
      'Evite clichês e neutralidade covarde: a Vunesp premia candidatos com posicionamento seguro.',
      'Utilize repertórios legitimados: Sociologia, Filosofia e Legislação Vigente (CF/88, Declaração Universal dos Direitos Humanos).',
      'Faça uso refinado de operadores argumentativos (Ademais, Outrossim, Por conseguinte).'
    ],
    sampleTheme: 'A militarização da segurança pública e a preservação das garantias fundamentais individuais.'
  },
  {
    id: 'board_fgv',
    name: 'Fundação Getulio Vargas (FGV)',
    category: 'civil',
    slug: 'fgv',
    characteristics: 'Banca densa, com temas conceituais ou polêmicos. Valoriza raciocínio crítico original, precisão léxica e encadeamento rigoroso de causas e consequências.',
    scoringCriteria: [
      'Consistência Argumentativa e Originalidade: Repudia cópia ou paráfrase fraca de textos motivadores.',
      'Coesão e Coerência: Fluidez no trânsito das ideias sem saltos lógicos.',
      'Correção Gramatical e Elegância Sintática: Construções de períodos complexos bem pontuadas.'
    ],
    recommendedStructure: 'Introdução delimitadora + 2 Parágrafos de desenvolvimento em contraposição dialética ou causa-consequência + Conclusão sintetizadora.',
    tacticalTips: [
      'Tenha precisão nos substantivos e adjetivos: a FGV penaliza vocabulário vago como "coisa", "fazer", "bom", "ruim".',
      'Analise os textos motivadores para extrair o recorte exato do debate, mas traga dados e pensadores externos.'
    ],
    sampleTheme: 'Inteligência Artificial e a vigilância estatal: limites entre a prevenção criminal e a privacidade do cidadão.'
  },
  {
    id: 'board_fcc',
    name: 'Fundação Carlos Chagas (FCC)',
    category: 'civil',
    slug: 'fcc',
    characteristics: 'Temas filosóficos, humanísticos e sociais abstratos (tempo, memória, ética, dignidade, tecnologia). Exige capacidade reflexiva e texto maduro.',
    scoringCriteria: [
      'Conteúdo e Reflexão Crítica: Profundidade reflexiva sem superficialidade.',
      'Estrutura e Progressão Textual: Parágrafos equilibrados e concatenados.',
      'Linguagem e Expressão: Vocabulário culto, domínio das orações subordinadas e paralelismo.'
    ],
    recommendedStructure: 'Introdução problematizadora + Desenvolvimento 1 (Causa/Origem histórica) + Desenvolvimento 2 (Consequência/Cenário contemporâneo) + Conclusão (Síntese filosófica da questão).',
    tacticalTips: [
      'A FCC valoriza a citação ponderada de filósofos contemporâneos (Byung-Chul Han, Bauman, Arendt).',
      'Cuidado com a estrutura sintática: evite orações soltas sem oração principal subordinante.'
    ],
    sampleTheme: 'O imperativo da urgência e a erosão da convivência democrática no espaço público contemporâneo.'
  },
  {
    id: 'board_espcex',
    name: 'EsPCEx (Escola Preparatória de Cadetes do Exército)',
    category: 'militar',
    slug: 'espcex',
    characteristics: 'Exige texto dissertativo em prosa de 25 a 30 linhas. Temas comumente voltados para civismo, patriotismo, avanços científicos, defesa nacional, soberania e ética.',
    scoringCriteria: [
      'Apresentação (legibilidade, margens e parágrafos): 0 a 20 pontos.',
      'Tema e Tipologia Textual (fidelidade ao tema e defesa de ponto de vista): 0 a 40 pontos.',
      'Expressão e Norma Culta (ortografia, concordância, regência, pontuação): 0 a 40 pontos.'
    ],
    recommendedStructure: '4 Parágrafos canônicos: Introdução de 5 a 6 linhas + D1 de 7 a 8 linhas + D2 de 7 a 8 linhas + Conclusão de 5 a 6 linhas.',
    tacticalTips: [
      'Nunca assine ou faça qualquer marca identificadora na folha definitiva de redação.',
      'Valorize a importância das Forças Armadas e da soberania nacional com equilíbrio técnico e respeito à Constituição.',
      'Mantenha título obrigatório caso solicitado pela banca, com centralização e sem ponto final no título.'
    ],
    sampleTheme: 'O papel da ciência e tecnologia militar na garantia da independência estratégica do Brasil.'
  },
  {
    id: 'board_esa',
    name: 'ESA (Escola de Sargentos das Armas)',
    category: 'militar',
    slug: 'esa',
    characteristics: 'Redação eliminatória com conceito APTO ou INAPTO (mínimo de nota 5,0 a 7,0). Temas diretos sobre valores humanos, dever moral, responsabilidade e superação.',
    scoringCriteria: [
      'Mínimo de 20 e máximo de 30 linhas escritas.',
      'Coesão e Coerência textual sem fuga temática.',
      'Gramática normativa com foco em concordância e ortografia.'
    ],
    recommendedStructure: 'Introdução objetiva + D1 focado em um exemplo concreto + D2 focado na importância para a sociedade + Conclusão propositiva.',
    tacticalTips: [
      'O segredo na ESA é a segurança ortográfica e a clareza: um texto simples e gramaticalmente perfeito garante a aprovação.',
      'Treine a letra de forma ou cursiva com legibilidade militar absoluta.'
    ],
    sampleTheme: 'A disciplina e a resiliência como pilares da formação do caráter do líder militar.'
  },
  {
    id: 'board_cesgranrio',
    name: 'Fundação Cesgranrio',
    category: 'civil',
    slug: 'cesgranrio',
    characteristics: 'Banca responsável pelo Concurso Nacional Unificado (CNU), Banco do Brasil, Caixa Econômica Federal e Petrobras. Exige dissertação estruturada de 20 a 30 linhas com posicionamento firme, coesão exemplar e soluções pragmáticas.',
    scoringCriteria: [
      'Adequação ao Tema e à Tipologia: Compreensão do recorte temático e formulação de tese evidente (0 a 10 pontos).',
      'Progressão Textual e Coesão: Encadeamento lógico com uso variado e preciso de operadores argumentativos (0 a 10 pontos).',
      'Norma-Padrão e Domínio da Escrita: Concordância, regência, crase e precisão semântica (0 a 10 pontos).'
    ],
    recommendedStructure: '4 Parágrafos: Introdução com contextualização temática e tese + D1 focado em causas/desafios estruturais + D2 focado nos impactos socioeconômicos + Conclusão com intervenção aplicável.',
    tacticalTips: [
      'Evite soluções vagas de senso comum ("as pessoas devem se conscientizar"); detalhe o agente estatal, a ação e o efeito esperado.',
      'Em temas do CNU, traga a perspectiva de políticas públicas, diversidade, inclusão e cidadania.',
      'Não faça rasuras e respeite rigorosamente as margens laterais.'
    ],
    sampleTheme: 'Desafios da inclusão produtiva e da qualificação profissional diante da automação no Brasil contemporâneo.'
  },
  {
    id: 'board_instituto_aocp',
    name: 'Instituto AOCP',
    category: 'civil',
    slug: 'instituto-aocp',
    characteristics: 'Banca tradicional em concursos das Polícias Militares, Polícias Civis, Perícias Oficiais e Tribunais. Provas discursivas objetivas, frequentemente voltadas para segurança pública, Direitos Humanos e legislação.',
    scoringCriteria: [
      'Aspectos Formais e Gramaticais: Ortografia, pontuação, sintaxe e paragrafação equilibrada (0 a 10 pontos).',
      'Aspectos Textuais: Capacidade de argumentar sem circular em torno do tema (0 a 15 pontos).',
      'Aspectos Técnicos: Conhecimento específico sobre o tema proposto com fundamentação legal (0 a 15 pontos).'
    ],
    recommendedStructure: 'Introdução direta com tese clara + 2 desenvolvimentos temáticos densos (causa e consequência) + Conclusão que sintetiza as ideias e fecha o posicionamento.',
    tacticalTips: [
      'A AOCP premia citações diretas de dispositivos da CF/88 (art. 5º e 144) em concursos policiais.',
      'Equilibre o tamanho dos parágrafos (aproximadamente 6 a 8 linhas cada).',
      'Evite primeira pessoa (nem singular nem plural); mantenha total impessoalidade.'
    ],
    sampleTheme: 'A integração entre forças de segurança e a comunidade no enfrentamento da violência urbana.'
  },
  {
    id: 'board_quadrix',
    name: 'Instituto Quadrix',
    category: 'civil',
    slug: 'quadrix',
    characteristics: 'Presente em conselhos profissionais e órgãos distritais/estaduais. Adota espelho de correção analítico com quesitos e tópicos pontuados individualmente no padrão Cebraspe.',
    scoringCriteria: [
      'Apresentação e Estrutura: Legibilidade, respeito às margens e estrutura dissertativa.',
      'Desenvolvimento dos Tópicos Norteadores: Resposta direta e aprofundada a cada um dos tópicos indicados no comando.',
      'Fórmula de Penalização Gramatical: Desconto por desvio em relação ao número total de linhas escritas.'
    ],
    recommendedStructure: 'Introdução integradora + 1 parágrafo de desenvolvimento dedicado a CADA tópico da banca + Conclusão concisa.',
    tacticalTips: [
      'Trate os tópicos exatamente na ordem em que aparecem no comando da prova.',
      'Use termos do próprio tópico no início do parágrafo correspondente para guiar visualmente o examinador.',
      'Escreva o número máximo de linhas para diluir o impacto percentual de eventuais erros gramaticais.'
    ],
    sampleTheme: 'Ética na gestão pública e transparência como antídoto contra desvios de conduta.'
  },
  {
    id: 'board_ibfc',
    name: 'IBFC (Instituto Brasileiro de Formação e Capacitação)',
    category: 'civil',
    slug: 'ibfc',
    characteristics: 'Banca de grande porte para Polícias Civis, Polícias Penais e Tribunais de Justiça. Cobra textos dissertativo-argumentativos clássicos com enunciados diretos e exigência de vocabulário formal.',
    scoringCriteria: [
      'Conhecimento do Tema: Domínio dos conceitos e dados apresentados.',
      'Habilidade Argumentativa: Pertinência dos argumentos na sustentação do ponto de vista.',
      'Coesão e Coerência: Ligação harmônica entre orações e parágrafos.',
      'Morfossintaxe e Acentuação: Rigor gramatical estrito.'
    ],
    recommendedStructure: '4 Parágrafos: Introdução de 5 linhas + D1 de 8 linhas + D2 de 8 linhas + Conclusão com desfecho sólido de 5 linhas.',
    tacticalTips: [
      'O IBFC penaliza muito a pontuação truncada e orações adjetivas explicativas sem vírgula.',
      'Mantenha a letra limpa e homogênea; a banca é rigorosa com a apresentação estética.',
      'Conecte cada ideia ao impacto real na sociedade.'
    ],
    sampleTheme: 'Ressocialização no sistema prisional brasileiro: entraves estruturais e caminhos viáveis.'
  },
  {
    id: 'board_afa',
    name: 'AFA (Academia da Força Aérea)',
    category: 'militar',
    slug: 'afa',
    characteristics: 'Concurso para Oficiais Aviadores, Intendentes e de Infantaria da Força Aérea Brasileira. Redação eliminatória e classificatória de 20 a 30 linhas. Temas humanísticos, éticos, científicos e de soberania aeroespacial.',
    scoringCriteria: [
      'Expressão (Gramática, Vocabulário Culto e Precisão Léxica): 0 a 4 pontos.',
      'Estrutura (Paragrafação, Coesão e Conexão Lógica): 0 a 3 pontos.',
      'Conteúdo (Pertinência da Tese e Consistência Argumentativa): 0 a 3 pontos.'
    ],
    recommendedStructure: 'Introdução canônica com tese explícita + 2 desenvolvimentos densos com repertório histórico ou científico + Conclusão afirmativa e prospectiva.',
    tacticalTips: [
      'Na AFA, o título é facultativo a menos que o edital o exija expressamente; se colocar, não pontue o final.',
      'O vocabulário deve ser culto e refinado, sem pedantismo.',
      'Evite sentimentalismo ou arroubos patrióticos vazios; fundamente seus argumentos em fatos e lógica.'
    ],
    sampleTheme: 'A exploração aeroespacial e a preservação do meio ambiente: dilemas éticos do progresso técnico.'
  },
  {
    id: 'board_en',
    name: 'EN (Escola Naval)',
    category: 'militar',
    slug: 'escola-naval',
    characteristics: 'Formação de Oficiais da Marinha do Brasil (Armada, Fuzileiros Navais e Intendentes). Exige dissertação argumentativa de 20 a 30 linhas com rigor militar, erudição e reflexão estratégica de alto nível.',
    scoringCriteria: [
      'Estrutura e Conteúdo (Tese, Relevância, Coerência e Repertório): 0 a 50 pontos.',
      'Expressão e Domínio da Norma Culta (Concordância, Regência, Pontuação e Precisão): 0 a 50 pontos.'
    ],
    recommendedStructure: 'Introdução com delimitação temática e tese + Desenvolvimento 1 com argumento de autoridade + Desenvolvimento 2 com análise de causa/efeito + Conclusão sintetizadora.',
    tacticalTips: [
      'Demonstre compreensão sobre o papel estratégico da Amazônia Azul e da soberania nacional quando o tema for afim.',
      'Respeite as margens rigidamente: ultrapassar ou recuar margem é penalizado com rigor.',
      'Jamais ultrapasse o limite de 30 linhas nem escreva menos de 20 linhas.'
    ],
    sampleTheme: 'A importância da mentalidade marítima para o desenvolvimento econômico e a segurança do Brasil.'
  },
  {
    id: 'board_efomm',
    name: 'EFOMM (Escola de Formação de Oficiais da Marinha Mercante)',
    category: 'militar',
    slug: 'efomm',
    characteristics: 'Concurso do Centro de Instrução Almirante Graça Aranha (CIAGA) e Centro de Instrução Almirante Braz de Aguiar (CIABA). Redação eliminatória (mínimo de 50 pontos) de 20 a 30 linhas.',
    scoringCriteria: [
      'Estrutura do Texto e Articulação de Parágrafos: 0 a 30 pontos.',
      'Desenvolvimento dos Argumentos e Informatividade: 0 a 40 pontos.',
      'Norma-Padrão da Língua Portuguesa: 0 a 30 pontos.'
    ],
    recommendedStructure: 'Introdução com 2 núcleos argumentativos + D1 focado no primeiro aspecto + D2 focado no segundo aspecto + Conclusão com perspectiva de futuro.',
    tacticalTips: [
      'A EFOMM costuma trazer temas que conectam sustentabilidade, relações internacionais, comércio exterior e tecnologia.',
      'Cuidado redobrado com a translineação correta de palavras nas margens.',
      'Mantenha períodos médios (2 a 3 linhas por período) para evitar truncamento sintático.'
    ],
    sampleTheme: 'O comércio marítimo internacional e a sustentabilidade dos oceanos: desafios do século XXI.'
  }
];

const initialTextGuides: TextTipGuide[] = [
  {
    id: 'guide_tema',
    title: 'Como interpretar o tema sem tangenciar',
    summary: 'Aprenda a dissecar a frase-tema em palavras-chave e delimitadores conceituais para garantir nota máxima em adequação temática.',
    keyPoints: [
      'Destaque o Núcleo Temático (o assunto geral) e os Recortes Específicos (o aspecto exato a ser debatido).',
      'Identifique a palavra de comando da banca ("desafios", "impactos", "medidas", "papel").',
      'Nunca confunda o tema geral (ex: trânsito) com o recorte proposto (ex: fadiga humana e tecnologia de fiscalização).'
    ],
    practicalExample: 'Se o tema for "Desafios da integração tecnológica no policiamento de fronteiras", você DEVE falar sobre integração (1), tecnologia (2) e fronteiras (3). Se falar apenas de armas ou presídios, ocorrerá fuga parcial.',
    checklist: [
      'Sublinhei as palavras-chave da frase-tema?',
      'Minha introdução contém todas as palavras essenciais do tema?',
      'Os meus dois desenvolvimentos respondem diretamente ao recorte temático?'
    ]
  },
  {
    id: 'guide_introducao',
    title: 'Como fazer uma Introdução Tática e Matadora',
    summary: 'A introdução é a certidão de nascimento do seu texto. Deve ter entre 5 e 7 linhas com 3 partes bem delimitadas.',
    keyPoints: [
      'Frase 1 (Tópico Frasal / Contextualização): Apresentação do tema com repertório ou fato histórico/legal.',
      'Frase 2 (Tese Central): Posição inequívoca e assertiva do candidato sobre o problema.',
      'Frase 3 (Mapeamento dos Argumentos): Apresentação sintética dos dois pontos (D1 e D2) que serão provados adiante.'
    ],
    practicalExample: '"Promulgada com o escopo de assegurar os direitos fundamentais, a Constituição de 1988 preconiza a segurança pública como dever do Estado. Todavia, a vulnerabilidade das fronteiras nacionais desafia esse preceito. Nesse cenário, urge combater a escassez de efetivo tático e intensificar o investimento em inteligência cibernética."',
    checklist: [
      'Tem entre 5 e 7 linhas?',
      'Contém repertório legitimado de abertura?',
      'Apresenta com clareza o que será discutido no D1 e no D2?'
    ]
  },
  {
    id: 'guide_argumentos',
    title: 'Desenvolvimento dos Argumentos com Técnica Tática',
    summary: 'Estruture parágrafos de desenvolvimento à prova de contestações dos avaliadores utilizando a fórmula Tópico Frasal + Fundamentação + Análise Crítica.',
    keyPoints: [
      'Tópico Frasal (1 linha): afirmação categórica do parágrafo ligada ao que foi prometido na introdução.',
      'Fundamentação / Repertório (2-3 linhas): leis, dados, filósofos, sociólogos ou história que sustentam sua afirmação.',
      'Análise Crítica e Fechamento (2 linhas): interpretação própria ligando a prova à realidade e ao tema.'
    ],
    practicalExample: '"Em primeiro plano, cabe salientar que a defasagem operacional nas regiões fronteiriças potencializa o narcotráfico. Consoante o jurista Luigi Ferrajoli, a efetividade das leis depende da capacidade institucional do Estado em fazer valer suas prerrogativas. Dessa forma, sem uma logística integrada entre as forças de segurança, o policiamento torna-se inócuo diante da sofisticação bélica das facções."',
    checklist: [
      'Iniciei com conectivo interparágrafo ("Em primeiro plano", "Nesse prisma")?',
      'Incluí uma fundamentação externa com fonte explícita?',
      'Fechei o parágrafo mostrando a consequência direta para o problema?'
    ]
  },
  {
    id: 'guide_conclusao',
    title: 'Como construir a Conclusão: Bancas Civis vs Bancas Militares',
    summary: 'Diferenças cruciais entre a intervenção detalhada para carreiras civis e a conclusão reflexiva sintética para carreiras militares.',
    keyPoints: [
      'Concursos Civis / Cebraspe / Vunesp: Soluções práticas, apontando quem fará (Agente), o que fará (Ação), como fará (Meio/Modo) e para que fará (Finalidade).',
      'Concursos Militares / EsPCEx / ESA: Retomada da tese com reafirmação valorativa, sem necessidade de proposta de intervenção nos moldes do ENEM.'
    ],
    practicalExample: '"Infere-se, portanto, que a soberania estatal nas rodovias exige ações coordenadas. Cabe ao Ministério da Justiça, em parceria com a Polícia Rodoviária Federal, expandir o sistema de videomonitoramento com inteligência artificial, mediante alocação de fundos de segurança pública, a fim de mitigar o contrabando e salvaguardar a sociedade."',
    checklist: [
      'Iniciei com conjunção conclusiva ("Infere-se, portanto,", "Depreende-se, desse modo,")?',
      'Evitei termos vulgares como "conclui-se que" ou "para finalizar"?',
      'Retomei o tema e a tese de maneira madura?'
    ]
  },
  {
    id: 'guide_coesao',
    title: 'Coesão, Coerência e Conectivos Táticos Indispensáveis',
    summary: 'O repertório de operadores argumentativos que diferenciam uma redação mediana de uma redação nota 10.',
    keyPoints: [
      'Adição: Ademais, Outrossim, Além disso, Vale ainda acrescentar que.',
      'Oposição / Concessão: Não obstante, Embora, Conquanto, Em contrapartida, Todavia.',
      'Causa e Consequência: Haja vista que, Por conseguinte, Em decorrência de, Dessa forma.',
      'Conclusão: Destarte, Portanto, Infere-se, Por todos esses aspectos.'
    ],
    practicalExample: 'Em vez de usar "Mas" ou "Porém", use "Em contrapartida" ou "Não obstante". Em vez de "Também", utilize "Ademais" ou "Outrossim".',
    checklist: [
      'Todos os parágrafos iniciam com conectivos interparágrafos?',
      'Usei pronomes anafóricos para evitar repetições viciosas de palavras?',
      'Não há períodos iniciados por gerúndio solto?'
    ]
  },
  {
    id: 'guide_checklist_final',
    title: 'Checklist Tático Final de 5 Minutos',
    summary: 'O ritual estratégico antes de passar a redação a limpo na folha definitiva da banca examinadora.',
    keyPoints: [
      '1. Verificação de Crases: toda palavra feminina que recebeu crase admite troca por "ao" no masculino?',
      '2. Concordância do verbo Haver: não flexionou o verbo haver no plural quando tinha sentido de existir?',
      '3. Vírgulas proibidas: garantiu que não há vírgula separando sujeito e predicado ou verbo e seu objeto?',
      '4. Translineação: a separação silábica no fim da linha tem traço lateral ou inferior limpo, sem invadir a margem direita?',
      '5. Parágrafos: todos os 4 parágrafos têm recuo inicial idêntico de cerca de 2 centímetros?'
    ],
    practicalExample: 'Reserve sempre 10 a 15 minutos finais exclusivamente para esta checagem com olhos de avaliador.',
    checklist: [
      'Revisei as 4 armadilhas clássicas da banca?',
      'Verifiquei se preenchi o número mínimo e máximo de linhas exigidas?',
      'A folha definitiva está sem marcas pessoais e com legibilidade perfeita?'
    ]
  }
];

const initialTacticalMethod: TacticalMethodMission[] = [
  {
    number: 1,
    title: 'MISSÃO 01',
    subtitle: 'Entender o Tema',
    objective: 'Decodificar o comando da banca examinadora e blindar o texto contra tangenciamento ou fuga temática.',
    executionSteps: [
      'Leia a proposta e circule as palavras-chave obrigatórias.',
      'Identifique a palavra-âncora e o problema central.',
      'Faça uma tempestade de ideias (brainstorming tático) em 3 minutos na folha de rascunho.',
      'Defina em uma frase o que você defenderá.'
    ],
    modelTemplate: 'Tema: [Núcleo Temático] sob o prisma de [Recorte da Banca]. Problema Central: Por que isso é um obstáculo para o Brasil hoje?',
    goldenRule: 'Nunca comece a escrever antes de ter a pergunta-problema formulada no rascunho.'
  },
  {
    number: 2,
    title: 'MISSÃO 02',
    subtitle: 'Construir a Tese',
    objective: 'Formular uma tese firme, objetiva e indubitável para apresentar na primeira frase da introdução.',
    executionSteps: [
      'Escolha um posicionamento claro (favorável, desfavorável ou ponderado crítico).',
      'Associe a tese a dois pilares argumentativos (Argumento 1 e Argumento 2).',
      'Garanta que a tese responda diretamente ao problema do tema.'
    ],
    modelTemplate: '"É imperativo reconhecer que [Problema Central] perpetua-se tanto pela [Causa A / Argumento 1] quanto pela [Causa B / Argumento 2]."',
    goldenRule: 'A tese que não divide opiniões não é tese; é mero fato óbvio.'
  },
  {
    number: 3,
    title: 'MISSÃO 03',
    subtitle: 'Organizar os Argumentos',
    objective: 'Planejar o esqueleto do texto antes de redigir qualquer linha definitiva.',
    executionSteps: [
      'Parágrafo 2 (D1): Reserve para a causa estrutural ou o aspecto estatal/normativo.',
      'Parágrafo 3 (D2): Reserve para o impacto social, a repercussão prática ou a consequência operacional.',
      'Selecione 1 repertório de autoridade legítimo para cada parágrafo (CF/88, autoridade doutrinária, dados consolidados).'
    ],
    modelTemplate: 'Esqueleto: Intro (Tese + Arg1 + Arg2) -> D1 (Tópico Frasal 1 + Prova Constitucional + Fechamento) -> D2 (Tópico Frasal 2 + Exemplo Prático + Fechamento).',
    goldenRule: 'Um argumento sem comprovação documental ou teórica vira mera opinião pessoal do candidato.'
  },
  {
    number: 4,
    title: 'MISSÃO 04',
    subtitle: 'Desenvolver os Parágrafos',
    objective: 'Escrever desenvolvimentos densos com conectivos ricos e períodos coordenados e subordinados bem pontuados.',
    executionSteps: [
      'Abra com um conectivo interparágrafo forte.',
      'Apresente o Tópico Frasal curto e contundente.',
      'Insira a fundamentação teórica conectada à realidade prática.',
      'Feche com reflexão crítica, evitando pontas soltas.'
    ],
    modelTemplate: '"[Conectivo Interparágrafo], é fulcral constatar que [Tópico Frasal]. Segundo [Pensador/Lei/Dado], [Citação/Referência contextualizada]. Desse modo, [Análise crítica mostrando a consequência]."',
    goldenRule: 'Nenhum parágrafo deve ter apenas uma frase do início ao fim. Use sempre 3 a 4 períodos por parágrafo.'
  },
  {
    number: 5,
    title: 'MISSÃO 05',
    subtitle: 'Construir a Conclusão',
    objective: 'Arrematar o texto com autoridade intelectual e coerência plena com os desenvolvimentos apresentados.',
    executionSteps: [
      'Inicie com operador argumentativo conclusivo.',
      'Faça uma paráfrase concisa da tese defendida.',
      'Apresente as medidas aplicáveis (para bancas civis) ou a reflexão prospectiva (para bancas militares).'
    ],
    modelTemplate: '"Depreende-se, portanto, a urgência de medidas mitigadoras para [Problema]. Cabe ao [Órgão Competente], por intermédio de [Ação Concreta], viabilizar [Meio/Modo], a fim de garantir [Finalidade Constitucional]."',
    goldenRule: 'Nunca adicione um argumento inédito na conclusão. A conclusão serve para fechar o que foi aberto.'
  },
  {
    number: 6,
    title: 'MISSÃO 06',
    subtitle: 'Revisar o Texto',
    objective: 'Caçar e exterminar erros gramaticais e de translineação com o Checklist Tático.',
    executionSteps: [
      'Faça a leitura reversa por períodos (do último parágrafo para o primeiro).',
      'Confira os verbos impessoais (haver, fazer) e a concordância dos verbos transitivos com a partícula "se".',
      'Passe a limpo com traço firme, sem rasuras grosseiras e respeitando os limites das margens.'
    ],
    modelTemplate: 'Se errar uma palavra na folha definitiva, passe apenas um traço simples sobre ela e reescreva ao lado: "~~escreveu-se~~ redigiu-se". Nunca use parênteses nem borre com tinta.',
    goldenRule: 'A nota da redação é o divisor de águas entre a lista de aprovados e a convocação para o Curso de Formação.'
  }
];

class DatabaseService {
  private db: DatabaseSchema;

  constructor() {
    ensureDataDir();
    if (fs.existsSync(DB_FILE)) {
      try {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        this.db = JSON.parse(content);
        // Ensure all new initial exam boards are synced into the database
        for (const board of initialExamBoards) {
          if (!this.db.examBoards.some(b => b.slug === board.slug)) {
            this.db.examBoards.push(board);
          }
        }

        // Ensure pending demonstration students are synced
        for (const user of initialUsers) {
          if (!this.db.users.some(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase())) {
            this.db.users.push(user);
          }
        }
        // Ensure demonstration essays are synced
        for (const essay of initialEssays) {
          if (!this.db.essays.some(e => e.id === essay.id)) {
            this.db.essays.push(essay);
          }
        }
        if (!this.db.proposals) {
          this.db.proposals = [...initialProposals];
        } else {
          for (const prop of initialProposals) {
            if (!this.db.proposals.some(p => p.id === prop.id)) {
              this.db.proposals.push(prop);
            }
          }
        }
        if (!this.db.proposalCriteria) {
          this.db.proposalCriteria = [...initialProposalCriteria];
        } else {
          for (const crit of initialProposalCriteria) {
            if (!this.db.proposalCriteria.some(c => c.id === crit.id)) {
              this.db.proposalCriteria.push(crit);
            }
          }
        }
        if (!this.db.corrections) this.db.corrections = [];
        if (!this.db.correctionVersions) this.db.correctionVersions = [];

        this.save();
      } catch (err) {
        console.error('Error reading database file, resetting to initial seed:', err);
        this.db = this.getDefaultSeed();
        this.save();
      }
    } else {
      this.db = this.getDefaultSeed();
      this.save();
    }
  }

  private getDefaultSeed(): DatabaseSchema {
    return {
      users: initialUsers,
      essays: initialEssays,
      proposals: [...initialProposals],
      proposalCriteria: [...initialProposalCriteria],
      corrections: [],
      correctionVersions: [],
      questions: initialQuestions,
      questionAttempts: initialAttempts,
      examBoards: initialExamBoards,
      textGuides: initialTextGuides,
      tacticalMissions: initialTacticalMethod
    };
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database file:', err);
    }
  }

  // --- Supabase Synchronization Helpers ---
  private syncProfileToSupabase(user: User & { passwordHash?: string }) {
    if (!isServerSupabaseConfigured || !serverSupabase) return;
    Promise.resolve(
      (serverSupabase.from('profiles') as any).upsert({
        id: user.id,
        name: user.name,
        email: user.email,
        password_hash: user.passwordHash || null,
        role: user.role,
        cpf: user.cpf || null,
        phone: user.phone || null,
        target_exam: user.targetExam || null,
        status: user.status,
        payment_confirmed: Boolean(user.paymentConfirmed),
        must_change_password: Boolean(user.mustChangePassword),
        avatar_url: user.avatarUrl || null,
        created_at: user.createdAt || new Date().toISOString(),
      })
    )
      .then((res: any) => {
        if (res?.error) console.warn('[Supabase Sync] Profile sync warning:', res.error.message);
      })
      .catch((err: any) => console.warn('[Supabase Sync] Profile sync error:', err));
  }

  private deleteProfileFromSupabase(id: string) {
    if (!isServerSupabaseConfigured || !serverSupabase) return;
    Promise.resolve((serverSupabase.from('profiles') as any).delete().eq('id', id))
      .then((res: any) => {
        if (res?.error) console.warn('[Supabase Sync] Profile delete warning:', res.error.message);
      })
      .catch((err: any) => console.warn('[Supabase Sync] Profile delete error:', err));
  }

  private syncEssayToSupabase(essay: Essay) {
    if (!isServerSupabaseConfigured || !serverSupabase) return;
    Promise.resolve(
      (serverSupabase.from('essays') as any).upsert({
        id: essay.id,
        student_id: essay.studentId,
        student_name: essay.studentName,
        title: essay.title,
        theme: essay.theme,
        exam_target: essay.examTarget || null,
        submitted_at: essay.submittedAt,
        status: essay.status,
        original_file: essay.originalFile,
        correction: essay.correction || null,
      })
    )
      .then((res: any) => {
        if (res?.error) console.warn('[Supabase Sync] Essay sync warning:', res.error.message);
      })
      .catch((err: any) => console.warn('[Supabase Sync] Essay sync error:', err));
  }

  private deleteEssayFromSupabase(id: string) {
    if (!isServerSupabaseConfigured || !serverSupabase) return;
    Promise.resolve((serverSupabase.from('essays') as any).delete().eq('id', id))
      .then((res: any) => {
        if (res?.error) console.warn('[Supabase Sync] Essay delete warning:', res.error.message);
      })
      .catch((err: any) => console.warn('[Supabase Sync] Essay delete error:', err));
  }

  // --- Users ---
  public getUsers(): User[] {
    return this.db.users;
  }

  public getUserById(id: string): User | undefined {
    return this.db.users.find(u => u.id === id);
  }

  public getUserByEmail(emailOrLogin: string): User | undefined {
    const clean = emailOrLogin.trim().toLowerCase();
    return this.db.users.find(u => 
      u.email.toLowerCase() === clean || 
      (clean === 'gabriel' && (u.id === 'user_prof_gabriel' || u.role === 'professor')) ||
      (u.id === 'user_prof_gabriel' && (clean === 'gabriel' || clean === 'prof.gabriel' || clean === 'prof.gabriel@portuguestatico.com.br'))
    );
  }

  public syncUserFromExternal(user: User): void {
    const existingIndex = this.db.users.findIndex(u => u.id === user.id || (user.email && u.email.toLowerCase() === user.email.toLowerCase()));
    if (existingIndex >= 0) {
      this.db.users[existingIndex] = {
        ...this.db.users[existingIndex],
        ...user
      };
    } else {
      this.db.users.push(user);
    }
    this.save();
  }

  public createUser(userData: {
    id?: string;
    name: string;
    email: string;
    role?: 'aluno' | 'professor';
    cpf?: string;
    phone?: string;
    targetExam?: string;
  }): User {
    const existing = this.getUserByEmail(userData.email);
    if (existing) {
      throw new Error('E-mail já cadastrado na plataforma.');
    }

    const isProf = userData.role === 'professor';
    const newUser: User = {
      id: userData.id || `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'aluno',
      cpf: userData.cpf,
      phone: userData.phone,
      targetExam: userData.targetExam,
      status: isProf ? 'ativo' : 'pendente_aprovacao',
      paymentConfirmed: isProf ? true : false,
      createdAt: new Date().toISOString()
    };

    this.db.users.push(newUser);
    this.save();
    this.syncProfileToSupabase(newUser);

    return newUser;
  }

  public approveStudent(id: string): User {
    const user = this.db.users.find(u => u.id === id);
    if (!user) throw new Error('Aluno não encontrado.');
    user.status = 'ativo';
    user.paymentConfirmed = true;
    this.save();
    this.syncProfileToSupabase(user);
    return user;
  }

  public rejectStudent(id: string): void {
    const index = this.db.users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('Aluno não encontrado.');
    this.db.users.splice(index, 1);
    this.save();
    this.deleteProfileFromSupabase(id);
  }

  public togglePayment(id: string): User {
    const user = this.db.users.find(u => u.id === id);
    if (!user) throw new Error('Aluno não encontrado.');
    user.paymentConfirmed = !user.paymentConfirmed;
    this.save();
    this.syncProfileToSupabase(user);
    return user;
  }

  public getPendingStudents(): User[] {
    return this.db.users.filter(u => u.role === 'aluno' && u.status === 'pendente_aprovacao');
  }

  public updateUser(id: string, updates: Partial<User>): User {
    const index = this.db.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('Usuário não encontrado.');
    }

    const current = this.db.users[index];
    if (updates.name) current.name = updates.name;
    if (updates.email) current.email = updates.email;
    if (updates.cpf) current.cpf = updates.cpf;
    if (updates.phone) current.phone = updates.phone;
    if (updates.targetExam !== undefined) current.targetExam = updates.targetExam;
    if (updates.status) current.status = updates.status;
    if (updates.mustChangePassword !== undefined) current.mustChangePassword = updates.mustChangePassword;

    this.db.users[index] = current;
    this.save();
    this.syncProfileToSupabase(current);

    return current;
  }

  public toggleUserStatus(id: string): User {
    const user = this.db.users.find(u => u.id === id);
    if (!user) throw new Error('Usuário não encontrado.');
    user.status = user.status === 'ativo' ? 'inativo' : 'ativo';
    this.save();
    this.syncProfileToSupabase(user);
    return user;
  }

  public deleteUser(id: string): void {
    const index = this.db.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('Usuário não encontrado.');
    }
    // Preservação de dados pedagógicos (ON DELETE RESTRICT):
    const hasEssays = this.db.essays.some(e => e.studentId === id);
    if (hasEssays) {
      throw new Error('Não é permitido excluir um aluno que já possui redações vinculadas. Inative o cadastro para preservar os registros pedagógicos.');
    }
    // Remove the user
    this.db.users.splice(index, 1);
    this.db.questionAttempts = this.db.questionAttempts.filter(a => a.userId !== id);
    this.save();
    this.deleteProfileFromSupabase(id);
  }

  // --- Proposals & Rubric Criteria ---
  public getProposals(filter?: { status?: string }): Proposal[] {
    let result = [...this.db.proposals];
    if (filter?.status) {
      result = result.filter(p => p.status === filter.status);
    }
    return result.map(p => ({
      ...p,
      criteria: this.getProposalCriteria(p.id)
    }));
  }

  public getProposalById(id: string): Proposal | undefined {
    const prop = this.db.proposals.find(p => p.id === id);
    if (!prop) return undefined;
    return {
      ...prop,
      criteria: this.getProposalCriteria(prop.id)
    };
  }

  public createProposal(data: {
    title: string;
    theme: string;
    instructions: string;
    deadline?: string;
    createdBy: string;
    status?: 'rascunho' | 'ativa' | 'arquivada';
  }): Proposal {
    const newProp: Proposal = {
      id: `prop_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: data.title.trim(),
      theme: data.theme.trim(),
      instructions: data.instructions.trim(),
      deadline: data.deadline,
      status: data.status || 'rascunho',
      createdBy: data.createdBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.db.proposals.push(newProp);
    this.save();
    return newProp;
  }

  public updateProposal(id: string, updates: Partial<Proposal>): Proposal {
    const prop = this.db.proposals.find(p => p.id === id);
    if (!prop) throw new Error('Proposta não encontrada.');

    // Validação da escala da rubrica: soma deve ser exatamente 10,00 para ativar
    if (updates.status === 'ativa') {
      const criteria = this.getProposalCriteria(id);
      const sum = criteria.reduce((acc, c) => acc + Number(c.maxPoints), 0);
      if (Math.abs(sum - 10.00) > 0.001) {
        throw new Error(`A proposta só pode ser ativada se a soma dos critérios da rubrica for exatamente 10,00 pontos. Soma atual: ${sum.toFixed(2)}.`);
      }
    }

    if (updates.title) prop.title = updates.title.trim();
    if (updates.theme) prop.theme = updates.theme.trim();
    if (updates.instructions) prop.instructions = updates.instructions.trim();
    if (updates.deadline !== undefined) prop.deadline = updates.deadline;
    if (updates.status) prop.status = updates.status;
    prop.updatedAt = new Date().toISOString();

    this.save();
    return {
      ...prop,
      criteria: this.getProposalCriteria(prop.id)
    };
  }

  public deleteProposal(id: string): void {
    const index = this.db.proposals.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Proposta não encontrada.');
    const hasEssays = this.db.essays.some(e => e.proposalId === id);
    if (hasEssays) {
      throw new Error('Não é possível excluir esta proposta pois ela já possui redações vinculadas. Arquive a proposta.');
    }
    this.db.proposals.splice(index, 1);
    this.db.proposalCriteria = this.db.proposalCriteria.filter(c => c.proposalId !== id);
    this.save();
  }

  public saveProposalCriteria(proposalId: string, criteria: { name: string; description?: string; maxPoints: number; orderIndex?: number }[]): ProposalCriterion[] {
    this.db.proposalCriteria = this.db.proposalCriteria.filter(c => c.proposalId !== proposalId);
    const newCriteria: ProposalCriterion[] = criteria.map((c, idx) => ({
      id: `crit_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
      proposalId,
      name: c.name.trim(),
      description: c.description?.trim(),
      maxPoints: Number(c.maxPoints),
      orderIndex: c.orderIndex ?? (idx + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    this.db.proposalCriteria.push(...newCriteria);
    this.save();
    return newCriteria;
  }

  public getProposalCriteria(proposalId: string): ProposalCriterion[] {
    return this.db.proposalCriteria
      .filter(c => c.proposalId === proposalId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  public createProposalCriterion(data: {
    proposalId: string;
    name: string;
    description?: string;
    maxPoints: number;
    orderIndex?: number;
  }): ProposalCriterion {
    // Imutabilidade da rubrica após a primeira submissão:
    const hasSubmissions = this.db.essays.some(e => e.proposalId === data.proposalId);
    if (hasSubmissions) {
      throw new Error('A rubrica não pode ser alterada após o recebimento da primeira redação para esta proposta.');
    }

    if (data.maxPoints <= 0 || data.maxPoints > 10.00) {
      throw new Error('A pontuação máxima do critério deve ser maior que 0 e menor ou igual a 10,00.');
    }

    const existingCriteria = this.getProposalCriteria(data.proposalId);
    const newCrit: ProposalCriterion = {
      id: `crit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      proposalId: data.proposalId,
      name: data.name.trim(),
      description: data.description?.trim(),
      maxPoints: Number(data.maxPoints),
      orderIndex: data.orderIndex !== undefined ? data.orderIndex : existingCriteria.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.db.proposalCriteria.push(newCrit);
    this.save();
    return newCrit;
  }

  public updateProposalCriterion(id: string, updates: Partial<ProposalCriterion>): ProposalCriterion {
    const crit = this.db.proposalCriteria.find(c => c.id === id);
    if (!crit) throw new Error('Critério não encontrado.');

    // Imutabilidade da rubrica após a primeira submissão:
    const hasSubmissions = this.db.essays.some(e => e.proposalId === crit.proposalId);
    if (hasSubmissions) {
      throw new Error('A rubrica não pode ser alterada após o recebimento da primeira redação para esta proposta.');
    }

    if (updates.maxPoints !== undefined && (updates.maxPoints <= 0 || updates.maxPoints > 10.00)) {
      throw new Error('A pontuação máxima do critério deve ser maior que 0 e menor ou igual a 10,00.');
    }

    if (updates.name) crit.name = updates.name.trim();
    if (updates.description !== undefined) crit.description = updates.description?.trim();
    if (updates.maxPoints !== undefined) crit.maxPoints = Number(updates.maxPoints);
    if (updates.orderIndex !== undefined) crit.orderIndex = updates.orderIndex;
    crit.updatedAt = new Date().toISOString();

    this.save();
    return crit;
  }

  public deleteProposalCriterion(id: string): void {
    const index = this.db.proposalCriteria.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Critério não encontrado.');

    const crit = this.db.proposalCriteria[index];
    const hasSubmissions = this.db.essays.some(e => e.proposalId === crit.proposalId);
    if (hasSubmissions) {
      throw new Error('A rubrica não pode ser excluída após o recebimento da primeira redação para esta proposta.');
    }

    this.db.proposalCriteria.splice(index, 1);
    this.save();
  }

  // --- Controlled Atomic Correction Operations ---
  public getCorrectionByEssayId(essayId: string): CorrectionCurrent | undefined {
    return this.db.corrections.find(c => c.essayId === essayId);
  }

  public getCorrectionVersions(essayId: string): CorrectionVersion[] {
    return this.db.correctionVersions
      .filter(v => v.essayId === essayId)
      .sort((a, b) => a.versionNumber - b.versionNumber);
  }

  public saveCorrectionTransaction(params: {
    essayId: string;
    teacherId: string;
    teacherName?: string;
    status: 'rascunho' | 'finalizada';
    generalFeedback?: string;
    strengths?: string;
    improvements?: string;
    criteriaScores: { criterionId: string; score: number; comments?: string }[];
  }): { success: boolean; correction: CorrectionCurrent; versionArchived: boolean } {
    const essay = this.db.essays.find(e => e.id === params.essayId);
    if (!essay) {
      throw new Error(`Redação com ID ${params.essayId} não encontrada.`);
    }

    const proposalId = essay.proposalId || 'prop_tatica_01';
    const officialCriteria = this.getProposalCriteria(proposalId);

    // 1. Validar notas e calcular nota total
    let totalGrade = 0;
    const validatedScores: CorrectionCriterionScore[] = [];

    for (const item of params.criteriaScores) {
      const crit = officialCriteria.find(c => c.id === item.criterionId);
      if (!crit) {
        throw new Error(`Critério ${item.criterionId} não pertence à rubrica desta proposta.`);
      }
      if (item.score < 0) {
        throw new Error(`A nota do critério "${crit.name}" não pode ser negativa.`);
      }
      if (item.score > crit.maxPoints) {
        throw new Error(`A nota informada (${item.score}) excede a pontuação máxima de ${crit.maxPoints} para "${crit.name}".`);
      }

      totalGrade += item.score;
      validatedScores.push({
        id: `sc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        correctionId: '', // preenchido abaixo
        criterionId: item.criterionId,
        criterionName: crit.name,
        maxPoints: crit.maxPoints,
        score: Number(item.score.toFixed(2)),
        comments: item.comments?.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // 2. Se status for 'finalizada', valida campos obrigatórios e cobertura total da rubrica
    if (params.status === 'finalizada') {
      if (!params.generalFeedback || params.generalFeedback.trim().length === 0) {
        throw new Error('A devolutiva geral é obrigatória para finalizar a correção.');
      }
      if (validatedScores.length < officialCriteria.length) {
        throw new Error(`Todos os ${officialCriteria.length} critérios da rubrica devem ser avaliados para finalizar a correção.`);
      }
    }

    // 3. Verifica correção existente e arquiva histórico se a anterior já estava finalizada
    let existingIndex = this.db.corrections.findIndex(c => c.essayId === params.essayId);
    let versionArchived = false;

    if (existingIndex !== -1 && this.db.corrections[existingIndex].status === 'finalizada') {
      const existing = this.db.corrections[existingIndex];
      const priorVersions = this.getCorrectionVersions(params.essayId);
      const nextVer = priorVersions.length > 0 ? Math.max(...priorVersions.map(v => v.versionNumber)) + 1 : 1;

      const archivedVersion: CorrectionVersion = {
        id: `ver_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        essayId: params.essayId,
        correctionId: existing.id,
        teacherId: existing.teacherId,
        versionNumber: nextVer,
        generalFeedback: existing.generalFeedback,
        strengths: existing.strengths,
        improvements: existing.improvements,
        finalGrade: existing.finalGrade || 0,
        criteriaSnapshot: (existing.criteriaScores || []).map(cs => ({
          criterion_id: cs.criterionId,
          criterion_name: cs.criterionName || '',
          max_points: cs.maxPoints || 0,
          score: cs.score,
          comments: cs.comments
        })),
        archivedAt: new Date().toISOString()
      };

      this.db.correctionVersions.push(archivedVersion);
      versionArchived = true;
    }

    // 4. Salva ou atualiza a correção vigente
    const correctionId = existingIndex !== -1 
      ? this.db.corrections[existingIndex].id 
      : `corr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    validatedScores.forEach(s => { s.correctionId = correctionId; });

    const currentCorrection: CorrectionCurrent = {
      id: correctionId,
      essayId: params.essayId,
      teacherId: params.teacherId,
      teacherName: params.teacherName || 'Prof. Gabriel Figueiredo',
      generalFeedback: params.generalFeedback?.trim(),
      strengths: params.strengths?.trim(),
      improvements: params.improvements?.trim(),
      finalGrade: Number(totalGrade.toFixed(2)),
      status: params.status,
      criteriaScores: validatedScores,
      correctedAt: params.status === 'finalizada' ? new Date().toISOString() : undefined,
      createdAt: existingIndex !== -1 ? this.db.corrections[existingIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (existingIndex !== -1) {
      this.db.corrections[existingIndex] = currentCorrection;
    } else {
      this.db.corrections.push(currentCorrection);
    }

    // 5. Atualiza o status da redação correspondente
    essay.status = params.status === 'finalizada' ? 'Corrigida' : 'Em correção';
    if (params.status === 'finalizada') {
      essay.correction = {
        grade: Number(totalGrade.toFixed(2)),
        feedback: params.generalFeedback?.trim() || '',
        attentionPoints: [],
        correctedAt: new Date().toISOString(),
        teacherId: params.teacherId,
        teacherName: params.teacherName || 'Prof. Gabriel Figueiredo'
      };
    }

    this.save();

    return {
      success: true,
      correction: currentCorrection,
      versionArchived
    };
  }

  // --- Essays ---
  public getEssays(filter?: { studentId?: string; status?: string; search?: string }): Essay[] {
    let result = [...this.db.essays];

    if (filter?.studentId) {
      result = result.filter(e => e.studentId === filter.studentId);
    }
    if (filter?.status && filter.status !== 'Todas') {
      result = result.filter(e => e.status === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(e => 
        e.title.toLowerCase().includes(q) ||
        e.theme.toLowerCase().includes(q) ||
        e.studentName.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  public getEssayById(id: string): Essay | undefined {
    return this.db.essays.find(e => e.id === id);
  }

  public createEssay(essayData: {
    studentId: string;
    studentName: string;
    title: string;
    theme: string;
    examTarget?: string;
    originalFile: {
      name: string;
      size: number;
      type: string;
      dataUrl?: string;
    };
  }): Essay {
    const newEssay: Essay = {
      id: `essay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      studentId: essayData.studentId,
      studentName: essayData.studentName,
      title: essayData.title,
      theme: essayData.theme,
      examTarget: essayData.examTarget,
      submittedAt: new Date().toISOString(),
      status: 'Pendente',
      originalFile: essayData.originalFile
    };

    this.db.essays.unshift(newEssay);
    this.save();
    this.syncEssayToSupabase(newEssay);
    return newEssay;
  }

  public saveCorrection(essayId: string, correctionData: {
    grade: number;
    feedback: string;
    attentionPoints: AttentionCriterion[];
    teacherId: string;
    teacherName: string;
    correctionFile?: {
      name: string;
      size: number;
      type: string;
      dataUrl?: string;
    };
  }): Essay {
    const essay = this.db.essays.find(e => e.id === essayId);
    if (!essay) {
      throw new Error('Redação não encontrada.');
    }

    essay.status = 'Corrigida';
    essay.correction = {
      grade: Math.round(correctionData.grade * 10) / 10,
      feedback: correctionData.feedback,
      attentionPoints: correctionData.attentionPoints || [],
      teacherId: correctionData.teacherId,
      teacherName: correctionData.teacherName,
      correctedAt: new Date().toISOString(),
      correctionFile: correctionData.correctionFile
    };

    this.save();
    this.syncEssayToSupabase(essay);
    return essay;
  }

  public updateEssay(essayId: string, updates: Partial<Essay>): Essay {
    const essay = this.db.essays.find(e => e.id === essayId);
    if (!essay) {
      throw new Error('Redação não encontrada.');
    }
    if (updates.title) essay.title = updates.title.trim();
    if (updates.theme) essay.theme = updates.theme.trim();
    if (updates.examTarget !== undefined) essay.examTarget = updates.examTarget;
    if (updates.status) essay.status = updates.status;
    this.save();
    this.syncEssayToSupabase(essay);
    return essay;
  }

  public deleteEssay(essayId: string): void {
    const index = this.db.essays.findIndex(e => e.id === essayId);
    if (index === -1) {
      throw new Error('Redação não encontrada.');
    }
    this.db.essays.splice(index, 1);
    this.save();
    this.deleteEssayFromSupabase(essayId);
  }

  // --- Questions ---
  public getQuestions(filter?: { subject?: string; difficulty?: string; examBoard?: string }): Question[] {
    let result = [...this.db.questions];
    if (filter?.subject) {
      result = result.filter(q => q.subject === filter.subject);
    }
    if (filter?.difficulty) {
      result = result.filter(q => q.difficulty === filter.difficulty);
    }
    if (filter?.examBoard) {
      result = result.filter(q => q.examBoard.toLowerCase().includes(filter.examBoard!.toLowerCase()));
    }
    return result;
  }

  public getQuestionById(id: string): Question | undefined {
    return this.db.questions.find(q => q.id === id);
  }

  public getDailyQuestion(): Question {
    // Automated selection based on date of year to select without teacher intervention
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const index = dayOfYear % this.db.questions.length;
    return this.db.questions[index] || this.db.questions[0];
  }

  public createQuestion(qData: Omit<Question, 'id'>): Question {
    const newQ: Question = {
      ...qData,
      id: `q_${Date.now()}`
    };
    this.db.questions.push(newQ);
    this.save();
    return newQ;
  }

  public updateQuestion(id: string, qData: Partial<Question>): Question {
    const index = this.db.questions.findIndex(q => q.id === id);
    if (index === -1) throw new Error('Questão não encontrada.');
    this.db.questions[index] = { ...this.db.questions[index], ...qData };
    this.save();
    return this.db.questions[index];
  }

  public deleteQuestion(id: string): void {
    const index = this.db.questions.findIndex(q => q.id === id);
    if (index === -1) throw new Error('Questão não encontrada.');
    this.db.questions.splice(index, 1);
    this.save();
  }

  public submitQuestionAttempt(userId: string, questionId: string, selectedAnswer: 'A' | 'B' | 'C' | 'D' | 'E'): {
    isCorrect: boolean;
    correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
    explanation: string;
    subject: QuestionSubject;
    attempt: QuestionAttempt;
  } {
    const question = this.getQuestionById(questionId);
    if (!question) throw new Error('Questão não encontrada.');

    const isCorrect = question.correctAnswer === selectedAnswer;

    const attempt: QuestionAttempt = {
      id: `att_${Date.now()}`,
      userId,
      questionId,
      selectedAnswer,
      isCorrect,
      attemptedAt: new Date().toISOString(),
      subject: question.subject
    };

    this.db.questionAttempts.push(attempt);
    this.save();

    return {
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      subject: question.subject,
      attempt
    };
  }

  public getStudentAttempts(userId: string): QuestionAttempt[] {
    return this.db.questionAttempts.filter(a => a.userId === userId);
  }

  // --- Statistics & Desempenho ---
  public getTeacherDashboardStats() {
    const totalEssays = this.db.essays.length;
    const pendingEssays = this.db.essays.filter(e => e.status === 'Pendente').length;
    const correctedEssays = this.db.essays.filter(e => e.status === 'Corrigida').length;
    const activeStudents = this.db.users.filter(u => u.role === 'aluno' && u.status === 'ativo').length;

    const correctedList = this.db.essays.filter(e => e.status === 'Corrigida' && e.correction?.grade !== undefined);
    const averageGrade = correctedList.length > 0 
      ? Number((correctedList.reduce((acc, cur) => acc + (cur.correction?.grade || 0), 0) / correctedList.length).toFixed(1))
      : 0;

    const recentActivity = this.db.essays.slice(0, 6).map(e => ({
      id: e.id,
      studentName: e.studentName,
      studentId: e.studentId,
      theme: e.theme,
      title: e.title,
      submittedAt: e.submittedAt,
      status: e.status,
      grade: e.correction?.grade
    }));

    return {
      pendingEssays,
      correctedEssays,
      activeStudents,
      averageGrade,
      totalEssays,
      recentActivity
    };
  }

  public getStudentStats(studentId: string): StudentStats {
    const studentEssays = this.db.essays.filter(e => e.studentId === studentId);
    const correctedEssays = studentEssays.filter(e => e.status === 'Corrigida' && e.correction);

    const grades = correctedEssays
      .map(e => e.correction!.grade)
      .filter(g => typeof g === 'number');

    const averageGrade = grades.length > 0
      ? Number((grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1))
      : 0;

    const highestGrade = grades.length > 0 ? Math.max(...grades) : 0;
    const lowestGrade = grades.length > 0 ? Math.min(...grades) : 0;
    const latestGrade = grades.length > 0 ? grades[0] : undefined;

    const gradeHistory = correctedEssays
      .map(e => ({
        date: new Date(e.correction!.correctedAt).toLocaleDateString('pt-BR'),
        grade: e.correction!.grade,
        title: e.title
      }))
      .reverse();

    // Question stats
    const studentAttempts = this.db.questionAttempts.filter(a => a.userId === studentId);
    const questionsAnswered = studentAttempts.length;
    const questionsCorrect = studentAttempts.filter(a => a.isCorrect).length;
    const accuracyRate = questionsAnswered > 0
      ? Math.round((questionsCorrect / questionsAnswered) * 100)
      : 0;

    // Subjects
    const subjectsMap = new Map<QuestionSubject, { answered: number; correct: number }>();
    studentAttempts.forEach(att => {
      const current = subjectsMap.get(att.subject) || { answered: 0, correct: 0 };
      current.answered += 1;
      if (att.isCorrect) current.correct += 1;
      subjectsMap.set(att.subject, current);
    });

    const defaultSubjects: QuestionSubject[] = ['Concordância', 'Regência', 'Crase', 'Pontuação', 'Sintaxe'];
    const subjectBreakdown = defaultSubjects.map(sub => {
      const data = subjectsMap.get(sub) || { answered: 0, correct: 0 };
      const percentage = data.answered > 0 ? Math.round((data.correct / data.answered) * 100) : 0;
      return {
        subject: sub,
        answered: data.answered,
        correct: data.correct,
        percentage
      };
    });

    // Critical Weaknesses with color state
    const criticalWeaknesses = subjectBreakdown
      .filter(s => s.answered > 0)
      .map(s => {
        let status: 'crítico' | 'atenção' | 'bom' | 'excelente' = 'excelente';
        if (s.percentage < 65) status = 'crítico';
        else if (s.percentage < 75) status = 'atenção';
        else if (s.percentage < 85) status = 'bom';
        return {
          subject: s.subject,
          percentage: s.percentage,
          status
        };
      })
      .sort((a, b) => a.percentage - b.percentage);

    // Attention points from teacher corrections
    const attentionMap = new Map<AttentionCriterion, number>();
    correctedEssays.forEach(e => {
      e.correction?.attentionPoints?.forEach(pt => {
        attentionMap.set(pt, (attentionMap.get(pt) || 0) + 1);
      });
    });

    const frequentAttentionPoints = Array.from(attentionMap.entries())
      .map(([criterion, count]) => ({ criterion, count }))
      .sort((a, b) => b.count - a.count);

    return {
      essaysSubmitted: studentEssays.length,
      essaysCorrected: correctedEssays.length,
      averageGrade,
      highestGrade,
      lowestGrade,
      latestGrade,
      gradeHistory,
      questionsAnswered,
      questionsCorrect,
      accuracyRate,
      subjectBreakdown,
      criticalWeaknesses,
      frequentAttentionPoints
    };
  }

  // --- Top 10 Ranking ---
  public getTop10Ranking(): RankingEntry[] {
    const students = this.db.users.filter(u => u.role === 'aluno' && u.status === 'ativo');
    
    const ranking: RankingEntry[] = [];

    students.forEach(student => {
      const studentEssays = this.db.essays.filter(e => e.studentId === student.id && e.status === 'Corrigida' && e.correction);
      if (studentEssays.length > 0) {
        const bestGrade = Math.max(...studentEssays.map(e => e.correction!.grade));
        // Privacy: only display first name and last name initial to protect personal information
        const nameParts = student.name.split(' ');
        const sanitizedName = nameParts.length > 1
          ? `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}.`
          : student.name;

        ranking.push({
          rank: 0,
          studentId: student.id,
          displayName: sanitizedName,
          bestGrade,
          correctedEssaysCount: studentEssays.length,
          targetExam: student.targetExam
        });
      }
    });

    // Sort by best grade descending, tie-break by number of corrected essays
    ranking.sort((a, b) => {
      if (b.bestGrade !== a.bestGrade) {
        return b.bestGrade - a.bestGrade;
      }
      return b.correctedEssaysCount - a.correctedEssaysCount;
    });

    // Take top 10 and assign ranks
    return ranking.slice(0, 10).map((entry, idx) => ({
      ...entry,
      rank: idx + 1
    }));
  }

  // --- Study Hub & Guides ---
  public getExamBoards(): ExamBoardGuide[] {
    return this.db.examBoards;
  }

  public getTextGuides(): TextTipGuide[] {
    return this.db.textGuides;
  }

  public getTacticalMethodMissions(): TacticalMethodMission[] {
    return this.db.tacticalMissions;
  }

  public updateTacticalMission(missionNumber: number, updates: Partial<TacticalMethodMission>): TacticalMethodMission {
    const index = this.db.tacticalMissions.findIndex(m => m.number === missionNumber);
    if (index === -1) throw new Error('Missão não encontrada.');
    this.db.tacticalMissions[index] = { ...this.db.tacticalMissions[index], ...updates };
    this.save();
    return this.db.tacticalMissions[index];
  }

  // --- Weekly Mission ---
  public getWeeklyMission(userId: string) {
    const studentAttempts = this.db.questionAttempts.filter(a => a.userId === userId);
    const regenciaAttempts = studentAttempts.filter(a => a.subject === 'Regência');
    const correctRegencia = regenciaAttempts.filter(a => a.isCorrect).length;
    const accuracy = regenciaAttempts.length > 0 
      ? Math.round((correctRegencia / regenciaAttempts.length) * 100) 
      : 0;

    const task1Done = regenciaAttempts.length >= 10;
    const task2Done = regenciaAttempts.length >= 5 && accuracy >= 70;
    const task3Done = true; // Guide visited
    const task4Done = regenciaAttempts.length >= 8;

    const tasks = [
      {
        id: 't_01',
        description: 'Responder 10 questões de Regência Verbal',
        targetCount: 10,
        currentCount: Math.min(10, regenciaAttempts.length),
        completed: task1Done
      },
      {
        id: 't_02',
        description: 'Atingir pelo menos 70% de aproveitamento em Regência',
        targetCount: 70,
        currentCount: accuracy,
        completed: task2Done
      },
      {
        id: 't_03',
        description: 'Estudar o conteúdo de regência e crase na Central de Estudos',
        completed: task3Done
      },
      {
        id: 't_04',
        description: 'Revisar os erros comentados pelo Professor Gabriel',
        completed: task4Done
      }
    ];

    const completedCount = tasks.filter(t => t.completed).length;
    const progressPercent = Math.round((completedCount / tasks.length) * 100);

    return {
      title: 'Missão Tática da Semana',
      objective: 'Domínio Estratégico de Regência Verbal e Crase',
      targetSubject: 'Regência' as QuestionSubject,
      progressPercent,
      completedCount,
      totalTasks: tasks.length,
      tasks
    };
  }

  // --- Supabase Bulk Sync ---
  public async syncAllToSupabase() {
    if (!isServerSupabaseConfigured || !serverSupabase) {
      return {
        success: false,
        message: 'Supabase não está configurado. Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY ou SUPABASE_ANON_KEY no arquivo .env.',
        configured: false,
      };
    }

    const results = {
      profiles: 0,
      essays: 0,
      examBoards: 0,
      textGuides: 0,
      tacticalMissions: 0,
      studentStats: 0,
      errors: [] as string[],
    };

    try {
      // 1. Profiles
      const profilesData = this.db.users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        cpf: u.cpf || null,
        phone: u.phone || null,
        target_exam: u.targetExam || null,
        status: u.status,
        payment_confirmed: Boolean(u.paymentConfirmed),
        must_change_password: Boolean(u.mustChangePassword),
        avatar_url: u.avatarUrl || null,
        created_at: u.createdAt || new Date().toISOString(),
      }));
      const { error: pErr } = await serverSupabase.from('profiles').upsert(profilesData as any);
      if (pErr) results.errors.push(`profiles: ${pErr.message}`);
      else results.profiles = profilesData.length;

      // 2. Essays
      const essaysData = this.db.essays.map((e) => ({
        id: e.id,
        student_id: e.studentId,
        student_name: e.studentName,
        title: e.title,
        theme: e.theme,
        exam_target: e.examTarget || null,
        submitted_at: e.submittedAt,
        status: e.status,
        original_file: e.originalFile as any,
        correction: (e.correction || null) as any,
      }));
      const { error: eErr } = await serverSupabase.from('essays').upsert(essaysData as any);
      if (eErr) results.errors.push(`essays: ${eErr.message}`);
      else results.essays = essaysData.length;

      // 3. Exam Boards
      const examBoardsData = this.db.examBoards.map((b) => ({
        id: b.id,
        name: b.name,
        category: b.category,
        slug: b.slug,
        characteristics: b.characteristics,
        scoring_criteria: b.scoringCriteria as any,
        recommended_structure: b.recommendedStructure,
        tactical_tips: b.tacticalTips as any,
        sample_theme: b.sampleTheme || null,
      }));
      const { error: bErr } = await serverSupabase.from('exam_boards').upsert(examBoardsData as any);
      if (bErr) results.errors.push(`exam_boards: ${bErr.message}`);
      else results.examBoards = examBoardsData.length;

      // 4. Text Guides
      const textGuidesData = this.db.textGuides.map((g) => ({
        id: g.id,
        title: g.title,
        summary: g.summary,
        key_points: g.keyPoints as any,
        practical_example: g.practicalExample,
        checklist: g.checklist as any,
      }));
      const { error: gErr } = await serverSupabase.from('text_guides').upsert(textGuidesData as any);
      if (gErr) results.errors.push(`text_guides: ${gErr.message}`);
      else results.textGuides = textGuidesData.length;

      // 5. Tactical Method
      const tacticalData = this.db.tacticalMissions.map((m) => ({
        id: `mission_0${m.number}`,
        number: m.number,
        title: m.title,
        subtitle: m.subtitle,
        objective: m.objective,
        execution_steps: m.executionSteps as any,
        model_template: m.modelTemplate,
        golden_rule: m.goldenRule,
      }));
      const { error: mErr } = await serverSupabase.from('tactical_method').upsert(tacticalData as any);
      if (mErr) results.errors.push(`tactical_method: ${mErr.message}`);
      else results.tacticalMissions = tacticalData.length;

      // 6. Student Stats
      const studentIds = this.db.users.filter((u) => u.role === 'aluno').map((u) => u.id);
      for (const sId of studentIds) {
        const stats = this.getStudentStats(sId);
        const { error: sErr } = await serverSupabase.from('student_stats').upsert({
          student_id: sId,
          essays_submitted: stats.essaysSubmitted,
          essays_corrected: stats.essaysCorrected,
          average_grade: stats.averageGrade,
          highest_grade: stats.highestGrade,
          lowest_grade: stats.lowestGrade || 0,
          latest_grade: stats.latestGrade || null,
          grade_history: stats.gradeHistory as any,
          questions_answered: stats.questionsAnswered,
          questions_correct: stats.questionsCorrect,
          accuracy_rate: stats.accuracyRate,
          subject_breakdown: stats.subjectBreakdown as any,
          critical_weaknesses: stats.criticalWeaknesses as any,
          frequent_attention_points: stats.frequentAttentionPoints as any,
        } as any);
        if (!sErr) results.studentStats++;
        else results.errors.push(`student_stats (${sId}): ${sErr.message}`);
      }

      return {
        success: results.errors.length === 0,
        configured: true,
        results,
        message:
          results.errors.length === 0
            ? 'Todos os esquemas e dados foram sincronizados com sucesso no Supabase!'
            : `Sincronização parcial com avisos: ${results.errors.join('; ')}`,
      };
    } catch (err: any) {
      return { success: false, configured: true, error: err.message };
    }
  }
}

export const dbService = new DatabaseService();
