// ==============================================================================
// Português Tático - Acervo Oficial de Eixos Temáticos e Propostas de Redação
// 10 Eixos Temáticos x 10 Propostas por Eixo = 100 Propostas de Redação
// ==============================================================================

export interface EssayThemeProposal {
  id: string;
  axisNumber: number;
  themeNumber: number;
  axisTitle: string;
  title: string;
  prompt: string;
  repertoire: string[];
  guidingQuestions: string[];
}

export interface ThematicAxis {
  number: number;
  title: string;
  shortName: string;
  description: string;
  color: string;
  themes: EssayThemeProposal[];
}

export const THEMATIC_AXES: ThematicAxis[] = [
  {
    number: 1,
    title: "Eixo 1 — Sociedade e Comportamento",
    shortName: "Sociedade & Comportamento",
    description: "Relações humanas, convivência social, vulnerabilidade, preconceitos estruturais e transformações comportamentais na contemporaneidade.",
    color: "from-blue-600 to-indigo-700",
    themes: [
      {
        id: "e1_t1",
        axisNumber: 1,
        themeNumber: 1,
        axisTitle: "Sociedade e Comportamento",
        title: "O impacto do isolamento social e da solidão na sociedade contemporânea.",
        prompt: "A partir da leitura dos textos motivadores e com base nos conhecimentos construídos ao longo de sua formação, redija texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre a epidemia da solidão e seus impactos na saúde mental e nas relações sociais contemporâneas.",
        repertoire: ["Zygmunt Bauman (Modernidade Líquida)", "OMS (Relatório Global sobre Solidão e Conexão Social)", "Artigo 196 da CF/88 (Direito à Saúde)"],
        guidingQuestions: [
          "Quais transformações tecnológicas e urbanas intensificam a solidão na contemporaneidade?",
          "De que maneira o isolamento crônico impacta a coesão social e a saúde coletiva?"
        ]
      },
      {
        id: "e1_t2",
        axisNumber: 1,
        themeNumber: 2,
        axisTitle: "Sociedade e Comportamento",
        title: "A cultura do cancelamento e os limites da liberdade de expressão nas redes sociais.",
        prompt: "Redija texto dissertativo-argumentativo discutindo a cultura do linchamento virtual, a intolerância digital e a conciliação entre a liberdade de expressão e a preservação da dignidade humana.",
        repertoire: ["Artigo 5º, incisos IV e X da CF/88 (Liberdade de manifestação e inviolabilidade da honra)", "John Stuart Mill (Sobre a Liberdade)", "Byung-Chul Han (No Enxame)"],
        guidingQuestions: [
          "Onde termina a crítica legítima e começa o linchamento moral nas redes?",
          "Quais as consequências jurídicas e psicológicas do cancelamento sumário?"
        ]
      },
      {
        id: "e1_t3",
        axisNumber: 1,
        themeNumber: 3,
        axisTitle: "Sociedade e Comportamento",
        title: "Caminhos para combater a espetacularização da vida e a busca por validação digital.",
        prompt: "Analise como a superexposição nas plataformas digitais e a cobrança por vidas perfeitas afetam a autoestima, a autenticidade e a convivência humana.",
        repertoire: ["Guy Debord (A Sociedade do Espetáculo)", "Jean Baudrillard (Simulacros e Simulação)", "Artigo 227 da CF/88 (Proteção integral)"],
        guidingQuestions: [
          "Como os algoritmos monetizam e alimentam a necessidade incessante de validação externa?",
          "Quais políticas educacionais podem promover uma relação saudável com a própria imagem?"
        ]
      },
      {
        id: "e1_t4",
        axisNumber: 1,
        themeNumber: 4,
        axisTitle: "Sociedade e Comportamento",
        title: "Desafios para a inclusão socioeconômica de pessoas em situação de rua no Brasil.",
        prompt: "Discuta os entraves para a garantia da dignidade humana, moradia e oportunidades de reinserção social da população em situação de vulnerabilidade extrema nos centros urbanos.",
        repertoire: ["Princípio da Dignidade da Pessoa Humana (Art. 1º, III da CF/88)", "Política Nacional para a População em Situação de Rua (Decreto 7.053/2009)", "ADPF 976 (STF - Direitos da População de Rua)"],
        guidingQuestions: [
          "Quais falhas estruturais perpetuam a invisibilidade dessa população?",
          "Como integrar acolhimento, capacitação profissional e políticas de habitação popular?"
        ]
      },
      {
        id: "e1_t5",
        axisNumber: 1,
        themeNumber: 5,
        axisTitle: "Sociedade e Comportamento",
        title: "O aumento da intolerância e dos discursos de ódio no convívio social.",
        prompt: "Avalie as causas e consequências da polarização exacerbada, dos ataques a minorias e da erosão da empatia nas interações cotidianas.",
        repertoire: ["Theodor Adorno (A Personalidade Autoritária)", "Karl Popper (Paradoxo da Tolerância)", "Artigo 3º, IV da CF/88 (Promoção do bem de todos sem preconceitos)"],
        guidingQuestions: [
          "De que forma o anonimato digital potencializa atitudes discriminatórias?",
          "Qual o papel das instituições estatais e escolares na mediação pacífica de conflitos?"
        ]
      },
      {
        id: "e1_t6",
        axisNumber: 1,
        themeNumber: 6,
        axisTitle: "Sociedade e Comportamento",
        title: "A herança do preconceito linguístico e seus impactos na exclusão social.",
        prompt: "Reflita sobre como o estigma contra variações linguísticas regionais e de classes populares atua como mecanismo de exclusão educacional e profissional no Brasil.",
        repertoire: ["Marcos Bagno (Preconceito Linguístico)", "Pierre Bourdieu (Poder Simbólico)", "LDB - Lei nº 9.394/1996"],
        guidingQuestions: [
          "Como a valorização da norma culta pode coexistir com o respeito à diversidade dialetal?",
          "De que maneira o mercado de trabalho pune indivíduos por sua variante linguística?"
        ]
      },
      {
        id: "e1_t7",
        axisNumber: 1,
        themeNumber: 7,
        axisTitle: "Sociedade e Comportamento",
        title: "Desafios para combater o etarismo e valorizar a população idosa.",
        prompt: "Aborde o preconceito etário, a marginalização dos idosos no mercado de trabalho e as estratégias para um envelhecimento ativo e respeitado no país.",
        repertoire: ["Estatuto da Pessoa Idosa (Lei nº 10.741/2003)", "Artigo 230 da CF/88 (Dever da família, sociedade e Estado com o idoso)", "Simone de Beauvoir (A Velhice)"],
        guidingQuestions: [
          "Quais mitos sobre produtividade sustentam a discriminação contra pessoas maduras?",
          "Como estruturar cidades e postos de trabalho amigáveis para a longevidade?"
        ]
      },
      {
        id: "e1_t8",
        axisNumber: 1,
        themeNumber: 8,
        axisTitle: "Sociedade e Comportamento",
        title: "A solidão parental e as dificuldades na criação de filhos na era hiperconectada.",
        prompt: "Examine a sobrecarga de mães e pais, a escassez de redes comunitárias de apoio e os desafios de educar crianças cercadas por estímulos digitais incessantes.",
        repertoire: ["Artigo 226 da CF/88 (Proteção da Família)", "Donald Winnicott (O Ambiente e os Processos de Maturação)", "Estatuto da Criança e do Adolescente (ECA)"],
        guidingQuestions: [
          "Por que a dissolução das redes comunitárias intensifica a ansiedade dos cuidadores?",
          "Como equilibrar limites no uso de telas com o desenvolvimento socioemocional infantil?"
        ]
      },
      {
        id: "e1_t9",
        axisNumber: 1,
        themeNumber: 9,
        axisTitle: "Sociedade e Comportamento",
        title: "Os impactos do consumismo infantil e a publicidade direcionada a crianças.",
        prompt: "Discuta a vulnerabilidade infantil frente aos apelos do marketing predatório e as responsabilidades de empresas, famílias e Estado.",
        repertoire: ["Código de Defesa do Consumidor (Art. 37 - Publicidade Abusiva)", "Resolução 163 do CONANDA", "Artigo 227 da CF/88 (Prioridade Absoluta)"],
        guidingQuestions: [
          "Em que medida a criança é incapaz de discernir a intencionalidade persuasiva da propaganda?",
          "Quais os efeitos a longo prazo na formação de valores e na sustentabilidade ambiental?"
        ]
      },
      {
        id: "e1_t10",
        axisNumber: 1,
        themeNumber: 10,
        axisTitle: "Sociedade e Comportamento",
        title: "Caminhos para a visibilidade e garantia de direitos de pessoas LGBTQIA+.",
        prompt: "Analise os obstáculos sociais, trabalhistas e judiciais para a efetivação da cidadania plena e segurança de indivíduos LGBTQIA+ no Brasil.",
        repertoire: ["STF - ADO 26 (Criminalização da Homotransfobia)", "Declaração Universal dos Direitos Humanos (Artigo 1º)", "Princípios de Yogyakarta"],
        guidingQuestions: [
          "Quais fatores colocam o Brasil entre os países que mais violentam pessoas trans no mundo?",
          "Que medidas educativas e de segurança pública são prioritárias para combater essa violência?"
        ]
      }
    ]
  },
  {
    number: 2,
    title: "Eixo 2 — Tecnologia e Mundo Digital",
    shortName: "Tecnologia & Mundo Digital",
    description: "Inteligência Artificial, segurança cibernética, soberania digital, privacidade, trabalho mediado por plataformas e novas dinâmicas virtuais.",
    color: "from-cyan-600 to-blue-800",
    themes: [
      {
        id: "e2_t1",
        axisNumber: 2,
        themeNumber: 1,
        axisTitle: "Tecnologia e Mundo Digital",
        title: "Os impactos da Inteligência Artificial no mercado de trabalho e na ética humana.",
        prompt: "Debata os reflexos da automação cognitiva e dos sistemas inteligentes na substituição de empregos, responsabilidade decisória e dignidade profissional.",
        repertoire: ["Yuval Noah Harari (21 Lições para o Século 21)", "Constituição Federal (Art. 7º, XXVII - Proteção em face da automação)", "Recomendações da UNESCO sobre Ética da Inteligência Artificial"],
        guidingQuestions: [
          "Quais profissões enfrentam maior risco de desestruturação e como qualificar a força de trabalho?",
          "Quem responde civil e penalmente por decisões automatizadas discriminatórias?"
        ]
      },
      {
        id: "e2_t2",
        axisNumber: 2,
        themeNumber: 2,
        axisTitle: "Tecnologia e Mundo Digital",
        title: "Caminhos para combater a desinformação e as Fake News na era da pós-verdade.",
        prompt: "Examine a disseminação em massa de conteúdos fraudulentos, seu impacto sobre processos eleitorais e a saúde coletiva, e os limites da moderação de conteúdo.",
        repertoire: ["Marco Civil da Internet (Lei nº 12.965/2014)", "Jürgen Habermas (Esfera Pública e Teoria da Ação Comunicativa)", "STF - Inquérito das Fake News (Inq. 4781)"],
        guidingQuestions: [
          "Como a monetização por engajamento alimenta a indústria da mentira organizada?",
          "Qual o papel do letramento midiático na formação crítica dos cidadãos?"
        ]
      },
      {
        id: "e2_t3",
        axisNumber: 2,
        themeNumber: 3,
        axisTitle: "Tecnologia e Mundo Digital",
        title: "O desafio da proteção de dados pessoais e a privacidade na internet.",
        prompt: "Analise a mercantilização de registros digitais, a vigilância algorítmica e a eficácia das regras de consentimento no ecossistema informacional.",
        repertoire: ["LGPD - Lei Geral de Proteção de Dados (Lei nº 13.709/2018)", "Shoshana Zuboff (A Era do Capitalismo de Vigilância)", "Emenda Constitucional nº 115/2022 (Proteção de dados como direito fundamental)"],
        guidingQuestions: [
          "De que maneira a assimetria informativa impede o usuário de exercer controle real sobre seus dados?",
          "Como fortalecer a fiscalização da Autoridade Nacional de Proteção de Dados (ANPD)?"
        ]
      },
      {
        id: "e2_t4",
        axisNumber: 2,
        themeNumber: 4,
        axisTitle: "Tecnologia e Mundo Digital",
        title: "O vício em telas e a precarização da atenção da Geração Alfa.",
        prompt: "Reflita sobre os danos cognitivos, déficits de atenção e impactos sociais decorrentes do consumo precoce e abusivo de smartphones e redes sociais por crianças.",
        repertoire: ["Sociedade Brasileira de Pediatria (Manual Menos Telas, Mais Saúde)", "Nicholas Carr (Os Inocentes na Rede)", "ECA - Artigo 4º"],
        guidingQuestions: [
          "Quais os prejuízos no vocabulário, raciocínio lógico e sociabilidade dos mais jovens?",
          "Quais diretrizes devem ser aplicadas em salas de aula para conter o hiperestímulo digital?"
        ]
      },
      {
        id: "e2_t5",
        axisNumber: 2,
        themeNumber: 5,
        axisTitle: "Tecnologia e Mundo Digital",
        title: "A uberização do trabalho e os desafios da economia de aplicativos.",
        prompt: "Discuta a precarização dos vínculos laborais, a ausência de garantias previdenciárias e o controle algorítmico sobre motoristas e entregadores por aplicativos.",
        repertoire: ["Artigo 1º, IV da CF/88 (Valores Sociais do Trabalho)", "Ricardo Antunes (O Privilégio da Servidão)", "Decisões do TST sobre Subordinação Algorítmica"],
        guidingQuestions: [
          "Como o discurso do 'empreendedorismo próprio' mascara jornadas extenuantes e inseguras?",
          "Qual modelo de regulação trabalhista equilibra inovação e proteção social mínima?"
        ]
      },
      {
        id: "e2_t6",
        axisNumber: 2,
        themeNumber: 6,
        axisTitle: "Tecnologia e Mundo Digital",
        title: "Os perigos do ciberterrorismo e a urgência da segurança nacional digital.",
        prompt: "Aborde as vulnerabilidades de sistemas de infraestrutura crítica (energia, saúde, bancos) e a defesa cibernética militar frente a ameaças transnacionais.",
        repertoire: ["Estratégia Nacional de Segurança Cibernética (E-Ciber)", "Decreto nº 10.748/2021 (Rede Federal de Gestão de Incidentes)", "Doutrina Militar de Defesa Cibernética do Exército Brasileiro"],
        guidingQuestions: [
          "Quais riscos ataques cibernéticos representam para a soberania do Estado brasileiro?",
          "Como capacitar peritos e analistas de segurança para respostas em tempo real?"
        ]
      },
      {
        id: "e2_t7",
        axisNumber: 2,
        themeNumber: 7,
        axisTitle: "Tecnologia e Mundo Digital",
        title: "Impactos dos Deepfakes na manipulação da realidade e na imagem pública.",
        prompt: "Analise a sintetização hiper-realista de voz e imagem para cometer fraudes, violência de gênero e manipulação eleitoral.",
        repertoire: ["Código Penal (Artigos 138 a 140 - Crimes contra a Honra; Art. 171 - Estelionato)", "Resolução do TSE sobre IA nas Eleições", "Artigo 5º, X da CF/88"],
        guidingQuestions: [
          "Como a impossibilidade de distinguir o real do falso corrói a confiança pública nas instituições?",
          "Quais ferramentas tecnológicas de marcação d'água e autenticação digital são necessárias?"
        ]
      },
      {
        id: "e2_t8",
        axisNumber: 2,
        themeNumber: 8,
        axisTitle: "Tecnologia e Mundo Digital",
        title: "A exclusão digital como barreira para o exercício pleno da cidadania.",
        prompt: "Discuta a ausência de internet de qualidade e dispositivos adequados nas periferias e zonas rurais como gerador de desigualdade de oportunidades.",
        repertoire: ["Marco Legal da Primeira Infância", "Universalização do Acesso à Internet (Lei nº 14.172/2021)", "Artigo 5º da CF/88 (Princípio da Igualdade)"],
        guidingQuestions: [
          "Como o processo de digitalização dos serviços públicos afeta quem não possui conectividade?",
          "De que maneira a conectividade escolar é pressuposto para democratizar o conhecimento?"
        ]
      },
      {
        id: "e2_t9",
        axisNumber: 2,
        themeNumber: 9,
        axisTitle: "Tecnologia e Mundo Digital",
        title: "Os impactos da inteligência artificial generativa na propriedade intelectual e nos direitos autorais.",
        prompt: "Debata o treinamento de modelos de linguagem e geradores de imagens com obras protegidas sem remuneração aos autores originais.",
        repertoire: ["Lei de Direitos Autorais (Lei nº 9.610/1998)", "Declaração de Berna para a Proteção das Obras Literárias e Artísticas", "Artigo 5º, XXVII da CF/88 (Direito autoral)"],
        guidingQuestions: [
          "É ético alimentar algoritmos comerciais com a produção criativa de artistas sem consentimento?",
          "Quais marcos regulatórios devem proteger a remuneração justa da classe artística?"
        ]
      },
      {
        id: "e2_t10",
        axisNumber: 2,
        themeNumber: 10,
        axisTitle: "Tecnologia e Mundo Digital",
        title: "O fenômeno dos jogos de azar online (bets) e a dependência psicológica digital.",
        prompt: "Avalie o crescimento exponencial das apostas esportivas e cassinos virtuais, seus efeitos no endividamento familiar e na saúde mental de jovens e trabalhadores.",
        repertoire: ["Lei nº 14.790/2023 (Regulamentação das Apostas Esportivas)", "Manual Diagnóstico e Estatístico de Transtornos Mentais (Ludopatia / Transtorno do Jogo)", "Código de Defesa do Consumidor"],
        guidingQuestions: [
          "Quais mecanismos de reforço intermitente e gamificação tornam as apostas altamente aditivas?",
          "Que limites devem ser impostos à publicidade de celebridades promovendo plataformas de jogos?"
        ]
      }
    ]
  },
  {
    number: 3,
    title: "Eixo 3 — Educação e Transformação Social",
    shortName: "Educação & Transformação",
    description: "Formação integral, combate ao analfabetismo, inclusão de neurodivergentes, infraestrutura escolar, evasão e inovação pedagógica.",
    color: "from-amber-600 to-orange-700",
    themes: [
      {
        id: "e3_t1",
        axisNumber: 3,
        themeNumber: 1,
        axisTitle: "Educação e Transformação Social",
        title: "Desafios para a universalização da alfabetização funcional na infância e idade adulta.",
        prompt: "Discuta os entraves para assegurar o domínio da leitura, escrita e operações lógicas básicas como requisito para o pleno exercício dos direitos civis.",
        repertoire: ["Paulo Freire (Pedagogia da Autonomia)", "Compromisso Nacional Criança Alfabetizada (Decreto 11.556/2023)", "Artigo 205 da CF/88 (A educação é direito de todos e dever do Estado)"],
        guidingQuestions: [
          "Quais sequelas a alfabetização tardia provoca na inserção do cidadão no mercado formal?",
          "Como qualificar a formação continuada de professores nos anos iniciais?"
        ]
      },
      {
        id: "e3_t2",
        axisNumber: 3,
        themeNumber: 2,
        axisTitle: "Educação e Transformação Social",
        title: "O papel da escola na formação cidadã e no combate ao bullying e cyberbullying.",
        prompt: "Reflita sobre a responsabilidade do ambiente escolar na promoção da cultura de paz, respeito às diferenças e repressão à intimidação sistemática.",
        repertoire: ["Lei Antibullying (Lei nº 13.185/2015)", "Lei nº 14.811/2024 (Inclusão do bullying e cyberbullying no Código Penal)", "Immanuel Kant (Conceito de Educação para a autonomia)"],
        guidingQuestions: [
          "Como a omissão institucional amplia o sofrimento e a evasão de estudantes agredidos?",
          "Quais projetos pedagógicos integrados conseguem criar redes de apoio e acolhimento escolar?"
        ]
      },
      {
        id: "e3_t3",
        axisNumber: 3,
        themeNumber: 3,
        axisTitle: "Educação e Transformação Social",
        title: "Caminhos para a valorização do ensino técnico e profissionalizante no Brasil.",
        prompt: "Analise como a formação técnica articulada ao Ensino Médio pode impulsionar a empregabilidade jovem e a industrialização qualificada do país.",
        repertoire: ["Plano Nacional de Educação (PNE)", "Rede Federal de Educação Profissional, Científica e Tecnológica", "Artigo 214 da CF/88"],
        guidingQuestions: [
          "Por que persiste no Brasil um preconceito histórico que diminui o ensino técnico frente ao superior?",
          "De que maneira parcerias com setores produtivos estratégicos geram oportunidades reais para jovens?"
        ]
      },
      {
        id: "e3_t4",
        axisNumber: 3,
        themeNumber: 4,
        axisTitle: "Educação e Transformação Social",
        title: "A inclusão pedagógica de alunos neurodivergentes no ensino regular.",
        prompt: "Aborde as barreiras para garantir adaptação curricular, mediadores qualificados e infraestrutura humanizada para estudantes com TEA, TDAH e outras condições.",
        repertoire: ["Estatuto da Pessoa com Deficiência (Lei nº 13.146/2015)", "Lei Berenice Piana (Lei nº 12.764/2012)", "Convenção da ONU sobre os Direitos das Pessoas com Deficiência"],
        guidingQuestions: [
          "Quais as diferenças entre matrícula formal e inclusão participativa real na rotina pedagógica?",
          "Como capacitar o corpo docente para práticas avaliativas individualizadas?"
        ]
      },
      {
        id: "e3_t5",
        axisNumber: 3,
        themeNumber: 5,
        axisTitle: "Educação e Transformação Social",
        title: "Caminhos para a inserção efetiva da educação financeira nas escolas públicas.",
        prompt: "Discuta como a instrução sobre orçamento, consumo responsável e planejamento patrimonial protege famílias contra o superendividamento.",
        repertoire: ["Base Nacional Comum Curricular (BNCC - Habilidades de Educação Financeira)", "Estratégia Nacional de Educação Financeira (ENEF)", "Artigo 6º da CF/88"],
        guidingQuestions: [
          "De que forma a falta de instrução financeira perpetua ciclos de pobreza multigeracionais?",
          "Como ensinar conceitos econômicos com linguagem acessível e exemplos práticos da realidade dos alunos?"
        ]
      },
      {
        id: "e3_t6",
        axisNumber: 3,
        themeNumber: 6,
        axisTitle: "Educação e Transformação Social",
        title: "O desafio da evasão escolar no Ensino Médio e a atratividade da escola.",
        prompt: "Examine os motivos socioeconômicos que levam milhares de adolescentes a abandonar as salas de aula e a urgência de programas de incentivo à permanência.",
        repertoire: ["Programa Pé-de-Meia (Lei nº 14.818/2024)", "IBGE (Pesquisa Nacional por Amostra de Domicílios Contínua - Educação)", "Artigo 208 da CF/88"],
        guidingQuestions: [
          "Como a necessidade prematura de trabalhar para complementar a renda familiar força o abandono?",
          "O que torna a matriz curricular atrativa e conectada com as aspirações do jovem contemporâneo?"
        ]
      },
      {
        id: "e3_t7",
        axisNumber: 3,
        themeNumber: 7,
        axisTitle: "Educação e Transformação Social",
        title: "O papel do esporte e da cultura nas escolas como ferramentas de inclusão.",
        prompt: "Reflita sobre como práticas desportivas e manifestações artísticas reduzem a criminalidade, desenvolvem disciplina e promovem coesão comunitária.",
        repertoire: ["Artigo 217 da CF/88 (Fomento às práticas desportivas formais e não-formais)", "Pierre de Coubertin (Olimpismo e Educação)", "LDB - Artigo 26"],
        guidingQuestions: [
          "De que forma o esporte funciona como escudo social para jovens em territórios de alta vulnerabilidade?",
          "Por que quadras e salas de artes ainda são negligenciadas no orçamento de investimentos escolares?"
        ]
      },
      {
        id: "e3_t8",
        axisNumber: 3,
        themeNumber: 8,
        axisTitle: "Educação e Transformação Social",
        title: "Os limites e desafios do Ensino a Distância (EAD) na educação básica.",
        prompt: "Avalie a inadequação de modelos remotos para faixas etárias que dependem da convivência presencial e da mediação pedagógica direta.",
        repertoire: ["Conselho Nacional de Educação (Diretrizes sobre Carga Horária EAD)", "Lev Vygotsky (Interacionismo e Zona de Desenvolvimento Proximal)", "Artigo 206 da CF/88"],
        guidingQuestions: [
          "Quais perdas de socialização e desenvolvimento motor ocorrem quando se substitui a sala de aula física por vídeos?",
          "Como o EAD pode agravar disparidades educacionais entre classes sociais distintas?"
        ]
      },
      {
        id: "e3_t9",
        axisNumber: 3,
        themeNumber: 9,
        axisTitle: "Educação e Transformação Social",
        title: "Desafios para a implementação efetiva da educação sexual e prevenção nas escolas.",
        prompt: "Aborde a relevância do ensino científico de anatomia, consentimento e proteção contra abuso sexual infantil como medida de saúde pública e segurança.",
        repertoire: ["ECA - Artigo 130", "OMS - Diretrizes Internacionais de Educação em Sexualidade", "Ministério da Saúde - Boletim Epidemiológico sobre ISTs em Jovens"],
        guidingQuestions: [
          "Como a desinformação e tabus ideológicos bloqueiam mecanismos vitais para identificar abusos no ambiente doméstico?",
          "De que maneira a orientação baseada em evidências reduz gestações precoces indesejadas?"
        ]
      },
      {
        id: "e3_t10",
        axisNumber: 3,
        themeNumber: 10,
        axisTitle: "Educação e Transformação Social",
        title: "O impacto das disparidades regionais na infraestrutura das escolas brasileiras.",
        prompt: "Discuta o abismo estrutural entre escolas com laboratórios de ponta e unidades sem água encanada, energia elétrica ou saneamento no interior do Brasil.",
        repertoire: ["Censo Escolar (INEP)", "FUNDEB - Lei nº 14.113/2020", "Artigo 3º, III da CF/88 (Erradicação das desigualdades regionais)"],
        guidingQuestions: [
          "Como a repartição federativa de recursos pode corrigir distorções históricas entre Norte/Nordeste e Sul/Sudeste?",
          "Qual o impacto de banheiros dignos e bibliotecas na retenção de professores e alunos?"
        ]
      }
    ]
  },
  {
    number: 4,
    title: "Eixo 4 — Meio Ambiente e Sustentabilidade",
    shortName: "Meio Ambiente & Sustentabilidade",
    description: "Crise climática, transição energética, gestão de resíduos, desmatamento, racismo ambiental, conservação de biomas e recursos hídricos.",
    color: "from-emerald-600 to-teal-800",
    themes: [
      {
        id: "e4_t1",
        axisNumber: 4,
        themeNumber: 1,
        axisTitle: "Meio Ambiente e Sustentabilidade",
        title: "Desafios para a gestão de resíduos sólidos e o combate ao plástico descartável.",
        prompt: "Aborde a ineficiência da reciclagem urbana, a poluição de aterros sanitários e rios e a necessidade de políticas de logística reversa e economia circular.",
        repertoire: ["Política Nacional de Resíduos Sólidos (Lei nº 12.305/2010)", "Artigo 225 da CF/88 (Meio Ambiente Ecologicamente Equilibrado)", "PNUMA - Relatório sobre Poluição Plástica Global"],
        guidingQuestions: [
          "Por que a maioria dos municípios brasileiros ainda descumpre prazos para encerramento de lixões a céu aberto?",
          "Qual a responsabilidade das indústrias de embalagens no ciclo de vida dos produtos descartáveis?"
        ]
      },
      {
        id: "e4_t2",
        axisNumber: 4,
        themeNumber: 2,
        axisTitle: "Meio Ambiente e Sustentabilidade",
        title: "Os impactos do racismo ambiental nas comunidades periféricas e tradicionais.",
        prompt: "Examine como desastres ecológicos, enchente, contaminação de solos e ausência de saneamento afetam desproporcionalmente populações negras, indígenas e ribeirinhas.",
        repertoire: ["Robert Bullard (Pai da Justiça Ambiental)", "Artigo 5º e 225 da CF/88", "Convenção 169 da OIT"],
        guidingQuestions: [
          "Por que indústrias poluidoras e depósitos de rejeitos são rotineiramente instalados nas proximidades de bairros pobres?",
          "Como assegurar poder decisório e reparação histórica a territórios vulnerabilizados?"
        ]
      },
      {
        id: "e4_t3",
        axisNumber: 4,
        themeNumber: 3,
        axisTitle: "Meio Ambiente e Sustentabilidade",
        title: "Alternativas para conter o desmatamento ilegal e proteger a biodiversidade brasileira.",
        prompt: "Discuta a fiscalização remota por satélite, o combate à grilagem de terras públicas e a valorização da bioeconomia na Amazônia e no Cerrado.",
        repertoire: ["Código Florestal (Lei nº 12.651/2012)", "Plano de Ação para Prevenção e Controle do Desmatamento na Amazônia Legal (PPCDAm)", "Chico Mendes (Legado da Luta Socioambiental)"],
        guidingQuestions: [
          "Como aparelhar órgãos como IBAMA e ICMBio para operações contundentes contra o crime organizado ambiental?",
          "De que maneira manter a floresta em pé pode ser mais rentável do que convertê-la em pasto degradado?"
        ]
      },
      {
        id: "e4_t4",
        axisNumber: 4,
        themeNumber: 4,
        axisTitle: "Meio Ambiente e Sustentabilidade",
        title: "A crise climática mundial e a urgência pela transição energética.",
        prompt: "Reflita sobre a substituição de combustíveis fósseis por fontes renováveis (solar, eólica, hidrogênio verde) e os compromissos brasileiros perante o Acordo de Paris.",
        repertoire: ["Painel Intergovernamental sobre Mudanças Climáticas (IPCC)", "Acordo de Paris sobre o Clima (2015)", "Artigo 170, VI da CF/88 (Defesa do Meio Ambiente na Ordem Econômica)"],
        guidingQuestions: [
          "Qual o papel estratégico do Brasil na liderança de uma matriz energética limpa global?",
          "Como financiar a transição sem penalizar as camadas sociais mais humildes com tarifas de energia elevadas?"
        ]
      },
      {
        id: "e4_t5",
        axisNumber: 4,
        themeNumber: 5,
        axisTitle: "Meio Ambiente e Sustentabilidade",
        title: "A escassez hídrica e os desafios para a segurança da água no Brasil.",
        prompt: "Analise as ameaças às bacias hidrográficas, o desperdício na distribuição urbana e a gestão compartilhada das reservas de água potável no país.",
        repertoire: ["Política Nacional de Recursos Hídricos (Lei das Águas - Lei nº 9.433/1997)", "Agência Nacional de Águas e Saneamento Básico (ANA)", "Objetivo de Desenvolvimento Sustentável 6 da ONU (Água Potável e Saneamento)"],
        guidingQuestions: [
          "Como o desmatamento afeta o regime de chuvas e os 'rios voadores' responsáveis pelo abastecimento do Sudeste e Centro-Oeste?",
          "Quais tecnologias de reuso e dessalinização devem ser expandidas em regiões semiáridas?"
        ]
      },
      {
        id: "e4_t6",
        axisNumber: 4,
        themeNumber: 6,
        axisTitle: "Meio Ambiente e Sustentabilidade",
        title: "Fast fashion e o impacto ambiental do consumo desenfreado de roupas.",
        prompt: "Aborde a poluição química têxtil, o uso exacerbado de microplásticos, a geração massiva de lixo e a precarização do trabalho na cadeia global da moda rápida.",
        repertoire: ["Fundação Ellen MacArthur (Economia Circular Têxtil)", "Artigo 225 da CF/88", "Relatórios sobre o Deserto do Atacama e Lixões de Roupas"],
        guidingQuestions: [
          "Como as redes sociais incentivam tendências hiper-rápidas que estimulam o descarte imediato?",
          "Que incentivos fiscais e certificações podem estimular a reutilização, o upcycling e fibras sustentáveis?"
        ]
      },
      {
        id: "e4_t7",
        axisNumber: 4,
        themeNumber: 7,
        axisTitle: "Meio Ambiente e Sustentabilidade",
        title: "Desafios para a preservação dos oceanos e o combate à pesca predatória.",
        prompt: "Discuta a degradação dos recifes de corais, o lixo marinho e a necessidade de proteção das Unidades de Conservação costeiras e da Amazônia Azul.",
        repertoire: ["Década da Ciência Oceânica para o Desenvolvimento Sustentável (ONU 2021-2030)", "Convenção das Nações Unidas sobre o Direito do Mar", "Marinha do Brasil - Conceito Estratégico da Amazônia Azul"],
        guidingQuestions: [
          "Como conciliar o sustento de comunidades pesqueiras artesanais com períodos de defeso e áreas protegidas?",
          "Quais medidas de fiscalização marítima impedem frotas industriais ilegais em águas territoriais?"
        ]
      },
      {
        id: "e4_t8",
        axisNumber: 4,
        themeNumber: 8,
        axisTitle: "Meio Ambiente e Sustentabilidade",
        title: "O impacto das queimadas e incêndios florestais na saúde pública e na economia.",
        prompt: "Analise a contaminação do ar por fumaça tóxica, internações respiratórias em massa, perda de lavouras e punição para incêndios criminosos.",
        repertoire: ["Lei de Crimes Ambientais (Lei nº 9.605/1998)", "SUS - Dados do DataSUS sobre Doenças Respiratórias por Queimadas", "Artigo 196 da CF/88"],
        guidingQuestions: [
          "Como a seca severa combinada com ações criminosas potencializa desastres em escala continental?",
          "Quais investimentos em brigadas permanentes e inteligência policial são indispensáveis?"
        ]
      },
      {
        id: "e4_t9",
        axisNumber: 4,
        themeNumber: 9,
        axisTitle: "Meio Ambiente e Sustentabilidade",
        title: "Caminhos para incentivar a agricultura familiar sustentável frente aos agrotóxicos.",
        prompt: "Reflita sobre o papel dos pequenos produtores no fornecimento da comida que chega à mesa do brasileiro e os caminhos da transição agroecológica.",
        repertoire: ["Programa Nacional de Fortalecimento da Agricultura Familiar (PRONAF)", "Lei de Agroecologia e Produção Orgânica (Decreto nº 7.794/2012)", "Josué de Castro (Geografia da Fome)"],
        guidingQuestions: [
          "Por que a agricultura familiar é a principal responsável pela segurança alimentar interna enquanto o agronegócio foca commodities de exportação?",
          "Como conter a contaminação desenfreada de rios e alimentos por defensivos agrícolas proibidos internacionalmente?"
        ]
      },
      {
        id: "e4_t10",
        axisNumber: 4,
        themeNumber: 10,
        axisTitle: "Meio Ambiente e Sustentabilidade",
        title: "Os desafios da mobilidade urbana sustentável nas grandes metrópoles.",
        prompt: "Examine o modelo rodoviarista centrado em automóveis individuais, os engarrafamentos quilométricos e a urgência de transporte público elétrico e ciclovias integradas.",
        repertoire: ["Política Nacional de Mobilidade Urbana (Lei nº 12.587/2012)", "Estatuto da Cidade (Lei nº 10.257/2001)", "Artigo 182 da CF/88 (Política Urbana)"],
        guidingQuestions: [
          "Como o tempo perdido em deslocamentos precários afeta a produtividade e a saúde mental do trabalhador?",
          "Quais incentivos governamentais tornam trens, metrôs e ônibus elétricos a escolha primária dos cidadãos?"
        ]
      }
    ]
  },
  {
    number: 5,
    title: "Eixo 5 — Saúde e Qualidade de Vida",
    shortName: "Saúde & Qualidade de Vida",
    description: "Sistema Único de Saúde (SUS), saúde mental, prevenção de doenças crônicas, segurança alimentar, doação de órgãos e humanização do atendimento.",
    color: "from-rose-600 to-red-800",
    themes: [
      {
        id: "e5_t1",
        axisNumber: 5,
        themeNumber: 1,
        axisTitle: "Saúde e Qualidade de Vida",
        title: "Caminhos para a democratização do acesso à saúde mental no sistema público.",
        prompt: "Discuta a escassez de Centros de Atenção Psicossocial (CAPS), o estigma em torno de transtornos psíquicos e a urgência de atendimento preventivo para todas as faixas etárias.",
        repertoire: ["Lei da Reforma Psiquiátrica (Lei nº 10.216/2001)", "Artigo 196 da CF/88 (Saúde como dever do Estado)", "Michel Foucault (História da Loucura)"],
        guidingQuestions: [
          "Por que a depressão e a ansiedade ainda são tratadas com desdém por parte da sociedade?",
          "Como expandir a atuação de psicólogos e psiquiatras na Atenção Básica de Saúde?"
        ]
      },
      {
        id: "e5_t2",
        axisNumber: 5,
        themeNumber: 2,
        axisTitle: "Saúde e Qualidade de Vida",
        title: "O estigma associado às doenças crônicas e a urgência de políticas de prevenção.",
        prompt: "Aborde as dificuldades de convivência e adesão ao tratamento de indivíduos com diabetes, hipertensão, obesidade e doenças autoimunes.",
        repertoire: ["Plano de Ações Estratégicas para o Enfrentamento das Doenças Crônicas Não Transmissíveis (Ministério da Saúde)", "Declaração de Alma-Ata", "Artigo 198 da CF/88"],
        guidingQuestions: [
          "Como hábitos de vida modernos elevam os custos do Estado com internações evitáveis?",
          "Quais estratégias comunitárias incentivam o diagnóstico precoce nas periferias?"
        ]
      },
      {
        id: "e5_t3",
        axisNumber: 5,
        themeNumber: 3,
        axisTitle: "Saúde e Qualidade de Vida",
        title: "Os perigos da automedicação e a cultura da 'cura rápida' na sociedade contemporânea.",
        prompt: "Analise o consumo indiscriminado de analgésicos, antibióticos e ansiolíticos sem prescrição médica e os riscos de resistência bacteriana e intoxicação.",
        repertoire: ["Agência Nacional de Vigilância Sanitária (ANVISA)", "Conselho Federal de Farmácia (CFF - Pesquisa sobre Automedicação)", "Ivan Illich (A Expropriação da Saúde / Nêmesis da Medicina)"],
        guidingQuestions: [
          "Como a facilidade de compras online e o marketing farmacêutico estimulam o uso irresponsável de remédios?",
          "Qual o perigo da proliferação de superbactérias para o futuro da medicina hospitalar?"
        ]
      },
      {
        id: "e5_t4",
        axisNumber: 5,
        themeNumber: 4,
        axisTitle: "Saúde e Qualidade de Vida",
        title: "Desafios para a garantia da segurança alimentar e o combate à fome.",
        prompt: "Reflita sobre os contrastes de um país campeão de exportações agrícolas que convive com milhões de cidadãos em situação de insegurança alimentar grave.",
        repertoire: ["Lei Orgânica de Segurança Alimentar e Nutricional (LOSAN - Lei nº 11.346/2006)", "Artigo 6º da CF/88 (Direito Social à Alimentação)", "Josué de Castro (Homens e Caranguejos)"],
        guidingQuestions: [
          "Quais fatores econômicos e de desperdício impedem que o alimento chegue aos mais necessitados?",
          "Como fortalecer cozinhas solidárias e bancos de alimentos como políticas permanentes de Estado?"
        ]
      },
      {
        id: "e5_t5",
        axisNumber: 5,
        themeNumber: 5,
        axisTitle: "Saúde e Qualidade de Vida",
        title: "Os impactos do sedentarismo e os caminhos para incentivar a atividade física.",
        prompt: "Avalie a inatividade física como fator de risco primário para infartos e AVCs e a necessidade de espaços públicos seguros para lazer e exercícios.",
        repertoire: ["Guia de Atividade Física para a População Brasileira (Ministério da Saúde)", "OMS - Plano de Ação Global para a Atividade Física", "Artigo 217 da CF/88"],
        guidingQuestions: [
          "Como a falta de praças iluminadas e calçadas adequadas desestimula a prática esportiva gratuita?",
          "Que campanhas de conscientização nas escolas podem criar hábitos saudáveis duradouros?"
        ]
      },
      {
        id: "e5_t6",
        axisNumber: 5,
        themeNumber: 6,
        axisTitle: "Saúde e Qualidade de Vida",
        title: "O avanço das ISTs entre os jovens e a importância da prevenção.",
        prompt: "Examine o aumento de diagnósticos de sífilis e HIV entre adolescentes, o relaxamento com o uso de preservativos e o tabu na comunicação pública.",
        repertoire: ["Programa Nacional de IST/Aids do Ministério da Saúde", "Metas 95-95-95 da UNAIDS", "Artigo 196 da CF/88"],
        guidingQuestions: [
          "Por que as novas gerações perderam o receio histórico diante de infecções sexualmente transmissíveis?",
          "De que maneira a distribuição massiva de profilaxias (PrEP e PEP) deve ser acompanhada de diálogo preventivo?"
        ]
      },
      {
        id: "e5_t7",
        axisNumber: 5,
        themeNumber: 7,
        axisTitle: "Saúde e Qualidade de Vida",
        title: "A doação de órgãos no Brasil: barreiras para a efetivação dos transplantes.",
        prompt: "Discuta a recusa familiar, falhas na identificação de morte encefálica e gargalos logísticos que impedem salvar vidas na fila do Sistema Nacional de Transplantes.",
        repertoire: ["Lei de Transplantes (Lei nº 9.434/1997)", "Sistema Nacional de Transplantes (SNT - Maior sistema público do mundo)", "Artigo 199, § 4º da CF/88"],
        guidingQuestions: [
          "Qual o peso da desinformação e de crenças religiosas na recusa de famílias enlutadas em autorizar doações?",
          "Como aperfeiçoar a coordenação aérea e hospitalar para transporte de órgãos com tempo de isquemia reduzido?"
        ]
      },
      {
        id: "e5_t8",
        axisNumber: 5,
        themeNumber: 8,
        axisTitle: "Saúde e Qualidade de Vida",
        title: "O desafio do atendimento humanizado às gestantes e o combate à violência obstétrica.",
        prompt: "Aborde intervenções cirúrgicas desnecessárias, agressões verbais no parto, mortalidade materna e a garantia de acompanhante legal para as mulheres.",
        repertoire: ["Lei do Acompanhante (Lei nº 11.108/2005)", "Rede Cegonha / Rede Alyne (Ministério da Saúde)", "Convenção de Belém do Pará"],
        guidingQuestions: [
          "Por que mulheres negras sofrem com índices desproporcionalmente maiores de violência no pré-natal e parto?",
          "Como fiscalizar e punir condutas médicas abusivas sem desestruturar o suporte obstétrico hospitalar?"
        ]
      },
      {
        id: "e5_t9",
        axisNumber: 5,
        themeNumber: 9,
        axisTitle: "Saúde e Qualidade de Vida",
        title: "Impactos do consumo excessivo de alimentos ultraprocessados na saúde coletiva.",
        prompt: "Analise a alta densidade calórica, aditivos químicos e estratégias publicitárias que provocam epidemias de obesidade infantil e doenças cardiovasculares.",
        repertoire: ["Guia Alimentar para a População Brasileira (Ministério da Saúde - Classificação NOVA)", "Carlos Monteiro (NUPENS/USP)", "Rotulagem Nutricional Frontal (RDC 429/2020 da ANVISA)"],
        guidingQuestions: [
          "Por que produtos hipercalóricos de baixo valor nutricional costumam ser mais baratos do que comida de verdade?",
          "Que medidas de tributação seletiva (Imposto do Pecado) podem desestimular o consumo de refrigerantes e salgadinhos?"
        ]
      },
      {
        id: "e5_t10",
        axisNumber: 5,
        themeNumber: 10,
        axisTitle: "Saúde e Qualidade de Vida",
        title: "Os gargalos no atendimento oncológico e os prazos de tratamento no SUS.",
        prompt: "Discuta a demora entre o diagnóstico suspeito e o início efetivo da radioterapia/quimioterapia, e os impactos na sobrevida de pacientes com câncer.",
        repertoire: ["Lei dos 60 Dias (Lei nº 12.732/2012)", "Lei dos 30 Dias para Diagnóstico (Lei nº 13.896/2019)", "Instituto Nacional de Câncer (INCA)"],
        guidingQuestions: [
          "Por que hospitais habilitados em oncologia enfrentam filas desumanas de espera pelo país?",
          "Como descentralizar o parque tecnológico de diagnóstico por imagem para regiões do interior?"
        ]
      }
    ]
  },
  {
    number: 6,
    title: "Eixo 6 — Cidadania e Democracia",
    shortName: "Cidadania & Democracia",
    description: "Direitos humanos, combate à violência doméstica, proteção a povos originários, transparência, sistema prisional, sufrágio e acesso à justiça.",
    color: "from-purple-600 to-indigo-900",
    themes: [
      {
        id: "e6_t1",
        axisNumber: 6,
        themeNumber: 1,
        axisTitle: "Cidadania e Democracia",
        title: "Caminhos para combater a violência doméstica e o feminicídio no Brasil.",
        prompt: "Analise o machismo estrutural, as falhas na concessão de medidas protetivas de urgência e a necessidade de acolhimento psicológico e econômico para mulheres.",
        repertoire: ["Lei Maria da Penha (Lei nº 11.340/2006)", "Lei do Feminicídio (Lei nº 13.104/2015)", "Artigo 226, § 8º da CF/88 (Coibição da violência intrafamiliar)"],
        guidingQuestions: [
          "O que faz com que agressores reincidentes descumpram medidas cautelares sem consequências imediatas?",
          "Como criar autonomia financeira para que vítimas consigam romper o ciclo de abusos?"
        ]
      },
      {
        id: "e6_t2",
        axisNumber: 6,
        themeNumber: 2,
        axisTitle: "Cidadania e Democracia",
        title: "O papel do voto consciente no fortalecimento das instituições democráticas.",
        prompt: "Reflita sobre o valor do sufrágio universal, o combate à compra de votos, a fiscalização parlamentar e a participação popular contínua entre eleições.",
        repertoire: ["Artigo 14 da CF/88 (Soberania Popular e Sufrágio Universal)", "Jean-Jacques Rousseau (O Contrato Social)", "Lei da Ficha Limpa (Lei Complementar nº 135/2010)"],
        guidingQuestions: [
          "Como o desencanto com a classe política alimenta posturas de apatia cívica prejudicial à democracia?",
          "Quais instrumentos de controle social (audiências públicas, orçamentos participativos) aproximam o povo do poder?"
        ]
      },
      {
        id: "e6_t3",
        axisNumber: 6,
        themeNumber: 3,
        axisTitle: "Cidadania e Democracia",
        title: "Desafios para a garantia dos direitos dos povos indígenas e comunidades quilombolas.",
        prompt: "Aborde a demarcação de terras ancestrais, o enfrentamento ao garimpo ilegal e a preservação das culturas e línguas originárias.",
        repertoire: ["Artigo 231 da CF/88 (Direito originário às terras tradicionalmente ocupadas)", "ADPF 709 (STF - Proteção a Povos Indígenas)", "Estatuto do Índio e Declaração da ONU sobre Direitos dos Povos Indígenas"],
        guidingQuestions: [
          "Por que a integridade física de lideranças indígenas permanece sob constante ameaça em áreas de fronteira agrícola?",
          "De que maneira a garantia da posse de terras preserva biomas e a soberania nacional?"
        ]
      },
      {
        id: "e6_t4",
        axisNumber: 6,
        themeNumber: 4,
        axisTitle: "Cidadania e Democracia",
        title: "A importância da transparência governamental e o combate à corrupção.",
        prompt: "Discuta o acesso do cidadão às contas públicas, a atuação de órgãos de controle e a integridade ética na administração direta e indireta.",
        repertoire: ["Lei de Acesso à Informação - LAI (Lei nº 12.527/2011)", "Princípios da Administração Pública (Artigo 37 da CF/88 - LIMPE)", "Controladoria-Geral da União (CGU) e Tribunal de Contas da União (TCU)"],
        guidingQuestions: [
          "Como o segredo de informações públicas favorece desvios e o mau uso do erário?",
          "De que forma portais de transparência amigáveis empoderam jornalistas investigativos e cidadãos comuns?"
        ]
      },
      {
        id: "e6_t5",
        axisNumber: 6,
        themeNumber: 5,
        axisTitle: "Cidadania e Democracia",
        title: "Caminhos para a ressocialização de detentos e a crise do sistema prisional.",
        prompt: "Examine a superlotação carcerária, o domínio das penitenciárias por facções criminosas e a urgência de estudo e trabalho remunerado para os apenados.",
        repertoire: ["Lei de Execução Penal (LEP - Lei nº 7.210/1984)", "STF - ADPF 347 (Estado de Coisas Inconstitucional no Sistema Penitenciário)", "Regras Mínimas da ONU para o Tratamento de Presos (Regras de Mandela)"],
        guidingQuestions: [
          "Por que a prisão no Brasil funciona frequentemente como 'escola do crime' em vez de espaço de reeducação?",
          "Quais incentivos fiscais para empresas contratarem egressos diminuem os índices de reincidência delitiva?"
        ]
      },
      {
        id: "e6_t6",
        axisNumber: 6,
        themeNumber: 6,
        axisTitle: "Cidadania e Democracia",
        title: "Desafios para a erradicação do trabalho análogo à escravidão na atualidade.",
        prompt: "Analise a servidão por dívidas, jornadas exaustivas e condições degradantes de alojamento no campo e em confecções urbanas.",
        repertoire: ["Artigo 149 do Código Penal", "Lista Suja do Trabalho Escravo (Ministério do Trabalho e Emprego)", "Convenção nº 29 da OIT sobre Trabalho Forçado"],
        guidingQuestions: [
          "Quais ardis os aliciadores usam para reter documentos e endividar trabalhadores desprotegidos?",
          "Como o fortalecimento dos Auditores-Fiscais do Trabalho é essencial para flagrantes e resgates humanizados?"
        ]
      },
      {
        id: "e6_t7",
        axisNumber: 6,
        themeNumber: 7,
        axisTitle: "Cidadania e Democracia",
        title: "A importância do voluntariado e do terceiro setor no fortalecimento social.",
        prompt: "Reflita sobre como ONGs, associações de bairro e projetos comunitários preenchem lacunas estatais no apoio a grupos marginalizados.",
        repertoire: ["Marco Regulatório das Organizações da Sociedade Civil (MROSC - Lei nº 13.019/2014)", "Artigo 1º, II e III da CF/88", "Amartya Sen (Desenvolvimento como Liberdade)"],
        guidingQuestions: [
          "Como a solidariedade organizada fortalece o tecido social e a cidadania ativa?",
          "De que maneira mecanismos de transparência protegem a credibilidade das entidades filantrópicas sérias?"
        ]
      },
      {
        id: "e6_t8",
        axisNumber: 6,
        themeNumber: 8,
        axisTitle: "Cidadania e Democracia",
        title: "Caminhos para combater a intolerância religiosa e garantir a laicidade do Estado.",
        prompt: "Aborde ataques a templos de matriz africana, preconceitos sectários e a necessidade de preservar o Estado laico como garantidor de todas as crenças e descrenças.",
        repertoire: ["Artigo 5º, VI e VIII da CF/88 (Liberdade de crença e culto invioláveis)", "Lei nº 11.635/2008 (Dia Nacional de Combate à Intolerância Religiosa)", "Voltaire (Tratado sobre a Tolerância)"],
        guidingQuestions: [
          "Como o avanço de discursos fundamentalistas na política coloca em risco a neutralidade estatal?",
          "Que ações de segurança pública são prioritárias para coibir depredações e crimes de ódio contra terreiros?"
        ]
      },
      {
        id: "e6_t9",
        axisNumber: 6,
        themeNumber: 9,
        axisTitle: "Cidadania e Democracia",
        title: "O desafio da subnotificação civil e o direito fundamental ao registro de nascimento.",
        prompt: "Discuta como a falta de certidão de nascimento impede o acesso a benefícios sociais, vacinação, matrícula escolar e votação, criando 'cidadãos invisíveis'.",
        repertoire: ["Lei nº 9.534/1997 (Gratuidade do Registro Civil de Nascimento)", "Artigo 5º, LXXVI da CF/88", "Tema do ENEM 2021 (Invisibilidade e Registro Civil)"],
        guidingQuestions: [
          "Por que populações ribeirinhas e periféricas ainda enfrentam obstáculos para registrar seus filhos recém-nascidos?",
          "Como cartórios itinerantes e integração em maternidades garantem a identidade formal de toda criança?"
        ]
      },
      {
        id: "e6_t10",
        axisNumber: 6,
        themeNumber: 10,
        axisTitle: "Cidadania e Democracia",
        title: "A importância do acesso universal à justiça e o papel da Defensoria Pública.",
        prompt: "Examine a garantia de ampla defesa para cidadãos sem recursos financeiros e o déficit de defensores públicos nas comarcas do interior do Brasil.",
        repertoire: ["Artigo 134 da CF/88 (Defensoria Pública como instituição essencial à função jurisdicional)", "Emenda Constitucional nº 80/2014 (Defensor em todas as comarcas)", "Mauro Cappelletti (Acesso à Justiça)"],
        guidingQuestions: [
          "Qual o prejuízo para a cidadania quando o hipossuficiente não dispõe de assistência jurídica gratuita qualificada?",
          "Como priorizar orçamentariamente a Defensoria Pública em paridade de armas com o Ministério Público?"
        ]
      }
    ]
  },
  {
    number: 7,
    title: "Eixo 7 — Cultura, Arte e Identidade",
    shortName: "Cultura & Identidade",
    description: "Patrimônio histórico, manifestações populares e periféricas, democratização do acesso aos museus, memória plural e proteção linguística.",
    color: "from-amber-500 to-yellow-700",
    themes: [
      {
        id: "e7_t1",
        axisNumber: 7,
        themeNumber: 1,
        axisTitle: "Cultura, Arte e Identidade",
        title: "A importância da preservação do patrimônio histórico e cultural brasileiro.",
        prompt: "Discuta o abandono de casarões centenários, acervos de museus e sítios arqueológicos, e o risco de apagamento da memória nacional por falta de verbas.",
        repertoire: ["Artigos 215 e 216 da CF/88 (Patrimônio Cultural Brasileiro)", "Instituto do Patrimônio Histórico e Artístico Nacional (IPHAN)", "Incêndio do Museu Nacional (2018)"],
        guidingQuestions: [
          "Por que a manutenção de museus é frequentemente tratada como gasto dispensável em vez de investimento essencial?",
          "De que maneira cidades históricas podem aliar preservação e turismo sustentável gerador de emprego?"
        ]
      },
      {
        id: "e7_t2",
        axisNumber: 7,
        themeNumber: 2,
        axisTitle: "Cultura, Arte e Identidade",
        title: "A apropriação cultural versus o intercâmbio cultural na sociedade globalizada.",
        prompt: "Reflita sobre os limites entre a admiração mútua entre povos e a descaracterização mercantilista de símbolos sagrados e tradicionais de grupos minoritários.",
        repertoire: ["Stuart Hall (A Identidade Cultural na Pós-Modernidade)", "Edward Said (Orientalismo)", "Artigo 215 da CF/88"],
        guidingQuestions: [
          "Quando o uso de elementos de outra cultura desrespeita lutas históricas e marginalizações?",
          "Como valorizar o diálogo criativo multicultural sem esvaziar os significados originais?"
        ]
      },
      {
        id: "e7_t3",
        axisNumber: 7,
        themeNumber: 3,
        axisTitle: "Cultura, Arte e Identidade",
        title: "O papel da cultura periférica (Funk, Slam, Hip-Hop) na expressão da juventude.",
        prompt: "Aborde a estigmatização de ritmos urbanos populares e seu valor como cronistas da realidade das favelas e motores de inclusão artística.",
        repertoire: ["Lei Estadual nº 5.543/2009 (Funk como patrimônio cultural fluminense)", "Gilberto Freyre (Conceito de cultura popular)", "Artigo 215, § 1º da CF/88 (Proteção às manifestações culturais populares)"],
        guidingQuestions: [
          "Por que produções artísticas das periferias continuam sendo alvo de repressão policial injustificada?",
          "Como as batalhas de rima e saraus desenvolvem oratória, pensamento crítico e pertencimento entre os jovens?"
        ]
      },
      {
        id: "e7_t4",
        axisNumber: 7,
        themeNumber: 4,
        axisTitle: "Cultura, Arte e Identidade",
        title: "A democratização do acesso ao cinema, teatro e museus no interior do país.",
        prompt: "Examine a concentração de salas de cinema e centros culturais nas capitais ricas e a exclusão da população de pequenos municípios do circuito das artes.",
        repertoire: ["Lei Paulo Gustavo (Lei Complementar nº 195/2022)", "Lei Aldir Blanc (Lei nº 14.017/2020 e 14.399/2022)", "Tema do ENEM 2019 (Democratização do acesso ao cinema)"],
        guidingQuestions: [
          "Como os ingressos caros e a ausência de transporte público barram famílias trabalhadoras dos teatros?",
          "De que forma cineclubes comunitários e itinerância artística transformam a vida de cidades do interior?"
        ]
      },
      {
        id: "e7_t5",
        axisNumber: 7,
        themeNumber: 5,
        axisTitle: "Cultura, Arte e Identidade",
        title: "O apagamento histórico de minorias e a necessidade de uma memória plural.",
        prompt: "Discuta como a historiografia tradicional invisibilizou heróis negros, mulheres e indígenas, e a urgência de monumentos e narrativas que reflitam a diversidade real.",
        repertoire: ["Lei nº 10.639/2003 e Lei nº 11.645/2008 (Ensino da história e cultura afro-brasileira e indígena)", "Lélia Gonzalez (Lugar de Negro e Intelectualidade Negra)", "Walter Benjamin (Teses sobre o Conceito de História)"],
        guidingQuestions: [
          "Quem escolhe quais estátuas ocupam as praças das cidades e quem elas celebram?",
          "Como o resgate da memória de Zumbi dos Palmares e Dandara cura feridas do passado colonial?"
        ]
      },
      {
        id: "e7_t6",
        axisNumber: 7,
        themeNumber: 6,
        axisTitle: "Cultura, Arte e Identidade",
        title: "O impacto dos influenciadores digitais na padronização cultural da juventude.",
        prompt: "Analise a repetição de comportamentos, gírias e padrões estéticos mundiais ditados por criadores de conteúdo e a perda da autenticidade comunitária.",
        repertoire: ["Theodor Adorno e Max Horkheimer (Indústria Cultural)", "Gilles Lipovetsky (A Era do Vazio)", "Artigo 220 da CF/88"],
        guidingQuestions: [
          "Como o algoritmo privilegia conteúdos homogêneos e pasteurizados em detrimento da riqueza regional?",
          "De que maneira estimular o senso crítico para que os jovens criem suas próprias identidades?"
        ]
      },
      {
        id: "e7_t7",
        axisNumber: 7,
        themeNumber: 7,
        axisTitle: "Cultura, Arte e Identidade",
        title: "Desafios para o financiamento e a sobrevivência de artistas independentes.",
        prompt: "Aborde as dificuldades de captação de recursos, a burocracia de editais públicos e a precarização previdenciária de trabalhadores da cultura.",
        repertoire: ["Lei Rouanet (Lei nº 8.313/1991)", "Artigo 216-A da CF/88 (Sistema Nacional de Cultura)", "Estatuto do Artista (Lei nº 6.533/1978)"],
        guidingQuestions: [
          "Por que a maior parte dos incentivos fiscais costuma ficar concentrada em megaespetáculos corporativos?",
          "Como estruturar microcréditos e fundos municipais de apoio direto à criação independente?"
        ]
      },
      {
        id: "e7_t8",
        axisNumber: 7,
        themeNumber: 8,
        axisTitle: "Cultura, Arte e Identidade",
        title: "O papel da literatura nacional na construção da empatia e identidade crítica.",
        prompt: "Reflita sobre como as obras clássicas e contemporâneas (Machado de Assis, Clarice Lispector, Conceição Evaristo) despertam consciência social e leitura do mundo.",
        repertoire: ["Antonio Candido (O Direito à Literatura)", "Machado de Assis (Dom Casmurro / Memórias Póstumas)", "Conceição Evaristo (Conceito de Escrevivência)"],
        guidingQuestions: [
          "Por que a leitura literária desenvolve competências emocionais que telas rápidas não conseguem estimular?",
          "Quais políticas públicas são urgentes para dotar toda escola de acervos vivos e bibliotecários qualificados?"
        ]
      },
      {
        id: "e7_t9",
        axisNumber: 7,
        themeNumber: 9,
        axisTitle: "Cultura, Arte e Identidade",
        title: "A representação estereotipada de grupos marginalizados nas mídias tradicionais.",
        prompt: "Examine a reprodução de papéis subalternos ou caricatos para negros, nordestinos e mulheres em novelas, jornais e propagandas de grande alcance.",
        repertoire: ["Sueli Carneiro (Dispositivo de Racialidade)", "Artigo 221 da CF/88 (Princípios da programação das emissoras de rádio e TV)", "Muniz Sodré (Claraboia da Mídia)"],
        guidingQuestions: [
          "De que maneira narrativas reducionistas reforçam preconceitos enraizados no imaginário popular?",
          "Como a pluralidade em equipes de roteiro e direção transforma a representação visual da sociedade?"
        ]
      },
      {
        id: "e7_t10",
        axisNumber: 7,
        themeNumber: 10,
        axisTitle: "Cultura, Arte e Identidade",
        title: "Caminhos para a preservação de línguas e dialetos tradicionais ameaçados.",
        prompt: "Discuta o risco de extinção de mais de 150 línguas indígenas faladas no Brasil e de variantes linguísticas quilombolas e de comunidades isoladas.",
        repertoire: ["Inventário Nacional da Diversidade Linguística (Decreto nº 7.387/2010)", "Artigo 210, § 2º da CF/88 (Ensino fundamental em língua materna para comunidades indígenas)", "Declaração Universal sobre a Diversidade Cultural (UNESCO)"],
        guidingQuestions: [
          "O que a humanidade perde em termos de cosmologia e conhecimento medicinal quando uma língua desaparece?",
          "Como utilizar ferramentas digitais e escolas bilíngues para registrar e manter vivas as línguas maternas?"
        ]
      }
    ]
  },
  {
    number: 8,
    title: "Eixo 8 — Economia, Trabalho e Desenvolvimento",
    shortName: "Economia & Trabalho",
    description: "Empreendedorismo jovem, disparidade salarial, inflação, desemprego estrutural, cooperativismo, endividamento e saneamento como motor econômico.",
    color: "from-emerald-700 to-green-900",
    themes: [
      {
        id: "e8_t1",
        axisNumber: 8,
        themeNumber: 1,
        axisTitle: "Economia, Trabalho e Desenvolvimento",
        title: "Desafios para o empreendedorismo jovem e a sobrevivência de novos negócios.",
        prompt: "Aborde a alta carga tributária inicial, a escassez de crédito facilitado e a carência de consultoria de gestão que levam startups a fechar as portas rapidamente.",
        repertoire: ["Marco Legal das Startups (Lei Complementar nº 182/2021)", "Estatuto Nacional da Microempresa e Empresa de Pequeno Porte (Lei Complementar nº 123/2006)", "SEBRAE (Pesquisa sobre Sobrevivência das Empresas)"],
        guidingQuestions: [
          "Como transformar a vocação inovadora de jovens em negócios sustentáveis e geradores de vagas?",
          "Quais incentivos de incubadoras municipais e redução de burocracia são determinantes nos primeiros 2 anos?"
        ]
      },
      {
        id: "e8_t2",
        axisNumber: 8,
        themeNumber: 2,
        axisTitle: "Economia, Trabalho e Desenvolvimento",
        title: "A persistência da desigualdade salarial entre gêneros e etnias no Brasil.",
        prompt: "Discuta a diferença de remuneração para funções idênticas, a sobrecarga de trabalho de cuidado não remunerado e os entraves de ascensão na carreira corporativa.",
        repertoire: ["Lei da Igualdade Salarial entre Homens e Mulheres (Lei nº 14.611/2023)", "Artigo 7º, XXX da CF/88 (Proibição de diferença de salários por motivo de sexo ou cor)", "Estatuto da Igualdade Racial (Lei nº 12.288/2010)"],
        guidingQuestions: [
          "O que explica a mulher com maior escolaridade média ainda receber até 20% a menos que homens no mesmo cargo?",
          "Como relatórios de transparência salarial e multas severas fiscalizam o cumprimento da lei?"
        ]
      },
      {
        id: "e8_t3",
        axisNumber: 8,
        themeNumber: 3,
        axisTitle: "Economia, Trabalho e Desenvolvimento",
        title: "O impacto da inflação e da perda do poder de compra na qualidade de vida das famílias.",
        prompt: "Analise a alta de preços de itens básicos da cesta básica, gás de cozinha e aluguel, e o consequente empobrecimento de trabalhadores assalariados.",
        repertoire: ["DIEESE (Cálculo do Salário Mínimo Necessário)", "Artigo 7º, IV da CF/88 (Salário Mínimo capaz de atender às necessidades vitais básicas)", "IPCA - Índice Nacional de Preços ao Consumidor Amplo (IBGE)"],
        guidingQuestions: [
          "Como a inflação funciona como o imposto mais regressivo e perverso contra as classes mais pobres?",
          "Quais políticas de estoques reguladores de alimentos e valorização real do piso salarial protegem as famílias?"
        ]
      },
      {
        id: "e8_t4",
        axisNumber: 8,
        themeNumber: 4,
        axisTitle: "Economia, Trabalho e Desenvolvimento",
        title: "O papel do turismo sustentável no desenvolvimento econômico regional.",
        prompt: "Reflita sobre como o ecoturismo, turismo de base comunitária e valorização da gastronomia geram renda sem degradar ecossistemas locais.",
        repertoire: ["Plano Nacional de Turismo (Ministério do Turismo)", "Artigo 180 da CF/88 (Incentivo ao turismo como fator de desenvolvimento social e econômico)", "OMT - Organização Mundial do Turismo"],
        guidingQuestions: [
          "Como evitar que o turismo predatório encareça o custo de vida e expulse moradores tradicionais (turistificação/gentrificação)?",
          "Que investimentos em infraestrutura de aeroportos e capacitação em línguas abrem portas para novos roteiros?"
        ]
      },
      {
        id: "e8_t5",
        axisNumber: 8,
        themeNumber: 5,
        axisTitle: "Economia, Trabalho e Desenvolvimento",
        title: "Os desafios do teletrabalho (home office) para o bem-estar e direitos do trabalhador.",
        prompt: "Examine a invasão da privacidade pelo trabalho fora de horário, a síndrome de burnout e o direito à desconexão na era dos mensageiros instantâneos.",
        repertoire: ["CLT - Artigo 75-A a 75-F (Regulamentação do Teletrabalho)", "Convenção nº 177 da OIT sobre Trabalho em Domicílio", "Artigo 7º, XXII da CF/88 (Redução dos riscos inerentes ao trabalho)"],
        guidingQuestions: [
          "Como delimitar fronteiras entre vida pessoal e demandas corporativas quando o escritório é a própria casa?",
          "Quem arca com custos de ergonomia, internet e energia elétrica no trabalho remoto contínuo?"
        ]
      },
      {
        id: "e8_t6",
        axisNumber: 8,
        themeNumber: 6,
        axisTitle: "Economia, Trabalho e Desenvolvimento",
        title: "Caminhos para combater o desemprego estrutural causado pela automação.",
        prompt: "Discuta a extinção de cargos operacionais no comércio e na indústria por robôs e softwares e a urgência de requalificação profissional maciça.",
        repertoire: ["Artigo 170, VIII da CF/88 (Busca do pleno emprego)", "Domenico De Masi (O Futuro do Trabalho)", "OCDE - Relatório sobre Automação e Habilidades Laborais"],
        guidingQuestions: [
          "O que fazer com trabalhadores de média idade que não conseguem acompanhar a velocidade das exigências digitais?",
          "Como sistemas de cooperação entre governos e universidades técnicas podem antecipar demandas do mercado?"
        ]
      },
      {
        id: "e8_t7",
        axisNumber: 8,
        themeNumber: 7,
        axisTitle: "Economia, Trabalho e Desenvolvimento",
        title: "A importância do cooperativismo para o fortalecimento de pequenos produtores.",
        prompt: "Aborde a união de forças em cooperativas agrícolas e de crédito para obter melhores preços de compra, maquinário compartilhado e escala de venda.",
        repertoire: ["Lei do Cooperativismo (Lei nº 5.764/1971)", "Artigo 174, § 2º da CF/88 (Incentivo do Estado às formas de associativismo e cooperativismo)", "OCB - Organização das Cooperativas Brasileiras"],
        guidingQuestions: [
          "Como o modelo cooperativo distribui lucros de forma democrática frente a monopólios comerciais?",
          "De que maneira cooperativas de crédito barateiam taxas de juros para negócios rurais e urbanos?"
        ]
      },
      {
        id: "e8_t8",
        axisNumber: 8,
        themeNumber: 8,
        axisTitle: "Economia, Trabalho e Desenvolvimento",
        title: "O impacto do endividamento das famílias e as armadilhas do crédito fácil.",
        prompt: "Analise o juro rotativo exorbitante de cartões, empréstimos consignados sem planejamento e o comprometimento de mais da metade da renda mensal com juros.",
        repertoire: ["Lei do Superendividamento (Lei nº 14.181/2021)", "Código de Defesa do Consumidor (Princípio do Mínimo Existencial)", "CNC - Pesquisa de Endividamento e Inadimplência do Consumidor (PEIC)"],
        guidingQuestions: [
          "Como instituições financeiras assediam aposentados e pessoas sem instrução com ofertas enganosas de crédito rápido?",
          "Quais mecanismos de repactuação judicial de dívidas preservam recursos para alimentação e moradia digna?"
        ]
      },
      {
        id: "e8_t9",
        axisNumber: 8,
        themeNumber: 9,
        axisTitle: "Economia, Trabalho e Desenvolvimento",
        title: "Desafios para conciliar o desenvolvimento econômico com a preservação ambiental.",
        prompt: "Debata a superação da falsa dicotomia entre 'produzir ou preservar', e os instrumentos de licenciamento ecológico e mercado de créditos de carbono.",
        repertoire: ["Relatório Brundtland (Nosso Futuro Comum - Conceito de Desenvolvimento Sustentável)", "Artigo 170, VI e Artigo 225 da CF/88", "Marco Regulatório do Mercado de Carbono"],
        guidingQuestions: [
          "É possível manter recordes de colheita agrícola adotando rotação de culturas e recuperação de pastagens degradadas?",
          "Como punir empresas que externalizam prejuízos ecológicos para maximizar lucros privados de curto prazo?"
        ]
      },
      {
        id: "e8_t10",
        axisNumber: 8,
        themeNumber: 10,
        axisTitle: "Economia, Trabalho e Desenvolvimento",
        title: "A importância do saneamento básico como motor de crescimento econômico.",
        prompt: "Discuta como cada real investido em tratamento de esgoto e água encanada economiza quatro reais em saúde e atrai valorização imobiliária e turismo.",
        repertoire: ["Novo Marco Legal do Saneamento Básico (Lei nº 14.026/2020)", "Instituto Trata Brasil (Benefícios Econômicos da Expansão do Saneamento)", "Artigo 200, IV da CF/88"],
        guidingQuestions: [
          "Por que quase 100 milhões de brasileiros ainda não contam com coleta e tratamento adequado de esgoto?",
          "De que maneira obras de infraestrutura sanitária geram milhares de empregos diretos nas cidades?"
        ]
      }
    ]
  },
  {
    number: 9,
    title: "Eixo 9 — Ciência, Pesquisa e Inovação",
    shortName: "Ciência & Pesquisa",
    description: "Investimento em pesquisa, fuga de cérebros, ética genética, enfrentamento a pandemias, negacionismo, patentes e divulgação científica.",
    color: "from-blue-700 to-cyan-900",
    themes: [
      {
        id: "e9_t1",
        axisNumber: 9,
        themeNumber: 1,
        axisTitle: "Ciência, Pesquisa e Inovação",
        title: "A desvalorização da pesquisa científica e a 'fuga de cérebros' no Brasil.",
        prompt: "Aborde os cortes em bolsas de pós-graduação, a perda de talentos brilhantes para laboratórios no exterior e a perda de competitividade tecnológica do país.",
        repertoire: ["Artigos 218 e 219 da CF/88 (Incentivo do Estado ao desenvolvimento científico e à pesquisa)", "CNPq e CAPES (Histórico de Fomento à Ciência)", "Academia Brasileira de Ciências (ABC)"],
        guidingQuestions: [
          "O que leva mestres e doutores com anos de dedicação a abandonar o país por falta de perspectivas e bolsas dignas?",
          "Como criar pontes perenes entre a pesquisa acadêmica das universidades públicas e a indústria nacional?"
        ]
      },
      {
        id: "e9_t2",
        axisNumber: 9,
        themeNumber: 2,
        axisTitle: "Ciência, Pesquisa e Inovação",
        title: "Os limites éticos da edição genética humana (como o sistema CRISPR).",
        prompt: "Reflita sobre o potencial de curar doenças hereditárias graves frente ao risco de eugenia e criação de desigualdades biológicas entre ricos e pobres.",
        repertoire: ["Lei de Biossegurança (Lei nº 11.105/2005)", "Declaração Universal sobre o Genoma Humano e os Direitos Humanos (UNESCO)", "Michael Sandel (Contra a Perfeição: A Ética na Era da Engenharia Genética)"],
        guidingQuestions: [
          "Onde traçar a linha moral entre terapias celulares para salvar vidas e manipulações genéticas com fins estéticos?",
          "Quem fiscaliza internacionalmente experimentos científicos que possam violar o patrimônio genético da humanidade?"
        ]
      },
      {
        id: "e9_t3",
        axisNumber: 9,
        themeNumber: 3,
        axisTitle: "Ciência, Pesquisa e Inovação",
        title: "O papel da ciência no combate a futuras pandemias e epidemias globais.",
        prompt: "Analise a vigilância genômica, a soberania na produção de vacinas e medicamentos e a cooperação internacional diante de ameaças zoonóticas.",
        repertoire: ["Fundação Oswaldo Cruz (Fiocruz)", "Instituto Butantan", "Regulamento Sanitário Internacional (OMS)"],
        guidingQuestions: [
          "Por que depender de insumos farmacêuticos ativos (IFA) importados colocou o Brasil em risco no início da COVID-19?",
          "Como investimentos prévios em biologia molecular salvam milhões de vidas em situações de emergência sanitária?"
        ]
      },
      {
        id: "e9_t4",
        axisNumber: 9,
        themeNumber: 4,
        axisTitle: "Ciência, Pesquisa e Inovação",
        title: "Negacionismo científico: causas e consequências da recusa à vacinação e evidências.",
        prompt: "Discuta o retorno de doenças erradicadas como o sarampo, teorias da conspiração em grupos de mensagens e a perda de confiança na autoridade médica.",
        repertoire: ["Programa Nacional de Imunizações (PNI - Criado em 1973)", "Revolta da Vacina (Oswaldo Cruz - Contexto Histórico de 1904)", "STF - Decisão sobre Obrigatoriedade da Vacinação Infantil"],
        guidingQuestions: [
          "Quais interesses ideológicos e financeiros patrocinam o descrédito de consensos da comunidade científica?",
          "Como médicos e comunicadores de ciência podem desmistificar boatos sem adotar linguagem inacessível ou arrogante?"
        ]
      },
      {
        id: "e9_t5",
        axisNumber: 9,
        themeNumber: 5,
        axisTitle: "Ciência, Pesquisa e Inovação",
        title: "A exploração espacial e o dilema dos investimentos bilionários fora da Terra.",
        prompt: "Debata se faz sentido gastar fortunas astronômicas em missões a Marte enquanto problemas urgentes como fome e clima persistem no planeta Terra.",
        repertoire: ["Agência Espacial Brasileira (AEB)", "Carl Sagan (Pálido Ponto Azul)", "Tratado do Espaço Exterior da ONU (1967)"],
        guidingQuestions: [
          "De que maneira tecnologias espaciais (satélites meteorológicos, GPS, materiais resistentes) melhoram o cotidiano na Terra?",
          "Qual o risco da militarização e da privatização desregulada da órbita terrestre por bilionários?"
        ]
      },
      {
        id: "e9_t6",
        axisNumber: 9,
        themeNumber: 6,
        axisTitle: "Ciência, Pesquisa e Inovação",
        title: "Caminhos para popularizar e aproximar a ciência das crianças e jovens nas escolas.",
        prompt: "Aborde feiras de ciências, clubes de robótica, museus interativos e o incentivo a meninas na área STEM (Ciência, Tecnologia, Engenharia e Matemática).",
        repertoire: ["Semana Nacional de Ciência e Tecnologia (MCTI)", "Movimento Meninas na Ciência", "Carl Sagan (O Mundo Assombrado pelos Demônios)"],
        guidingQuestions: [
          "Como transformar aulas teóricas de física e química em experimentações fascinantes que despertem vocações?",
          "De que modo quebrar estereótipos de que a carreira de exatas e pesquisas não é território feminino?"
        ]
      },
      {
        id: "e9_t7",
        axisNumber: 9,
        themeNumber: 7,
        axisTitle: "Ciência, Pesquisa e Inovação",
        title: "O uso da biotecnologia como aliada na produção sustentável de alimentos.",
        prompt: "Reflita sobre sementes resistentes à seca, biofertilizantes que substituem químicos e controle biológico de pragas desenvolvido por cientistas brasileiros.",
        repertoire: ["Empresa Brasileira de Pesquisa Agropecuária (EMBRAPA)", "Artigo 218, § 2º da CF/88", "Norman Borlaug (Revolução Verde)"],
        guidingQuestions: [
          "Como a engenharia genética aplicada à agricultura pode reduzir o uso de agrotóxicos nocivos à saúde humana?",
          "Qual o papel pioneiro da Embrapa em transformar o solo do cerrado brasileiro em celeiro fértil e produtivo?"
        ]
      },
      {
        id: "e9_t8",
        axisNumber: 9,
        themeNumber: 8,
        axisTitle: "Ciência, Pesquisa e Inovação",
        title: "O avanço da nanotecnologia e suas aplicações na medicina contemporânea.",
        prompt: "Analise nanopartículas para entrega direcionada de remédios em tumores, próteses inteligentes e regeneração de tecidos corporais lesionados.",
        repertoire: ["Iniciativa Brasileira de Nanotecnologia (IBN)", "Artigo 196 e 218 da CF/88", "Sociedade Brasileira de Física"],
        guidingQuestions: [
          "Quais revoluções nos tratamentos de câncer a entrega microscópica e localizada de quimioterápicos já proporciona?",
          "Quais precauções de biossegurança e toxicologia devem acompanhar a fabricação de nanomateriais?"
        ]
      },
      {
        id: "e9_t9",
        axisNumber: 9,
        themeNumber: 9,
        axisTitle: "Ciência, Pesquisa e Inovação",
        title: "Os desafios da propriedade patentária e o acesso democrático a inovações científicas.",
        prompt: "Discuta o monopólio de patentes de remédios de alto custo por multinacionais versus a quebra de patentes (licença compulsória) para salvar vidas no SUS.",
        repertoire: ["Lei de Propriedade Industrial (Lei nº 9.279/1996)", "Acordo TRIPS da Organização Mundial do Comércio (OMC)", "Instituto Nacional da Propriedade Industrial (INPI)"],
        guidingQuestions: [
          "O lucro corporativo legítimo de quem investe em pesquisa pode se sobrepor ao direito à vida de pacientes?",
          "Quando o Estado soberano deve intervir com licenças compulsórias para fabricar genéricos mais acessíveis?"
        ]
      },
      {
        id: "e9_t10",
        axisNumber: 9,
        themeNumber: 10,
        axisTitle: "Ciência, Pesquisa e Inovação",
        title: "A importância do investimento em ciência básica versus ciência aplicada.",
        prompt: "Reflita sobre por que financiar pesquisas teóricas puras (astronomia, matemática, biologia fundamental) é o alicerce indispensável de todas as invenções práticas do futuro.",
        repertoire: ["FAPESP e Fundações Estaduais de Amparo à Pesquisa", "Albert Einstein (Teoria da Relatividade e aplicações práticas posteriores)", "Artigo 218 da CF/88"],
        guidingQuestions: [
          "Por que governos míopes erram ao cortar verbas de cientistas que não prometem lucro fabuloso no dia seguinte?",
          "Como invenções cotidianas como o laser e a internet nasceram de pesquisas acadêmicas sem finalidade comercial imediata?"
        ]
      }
    ]
  },
  {
    number: 10,
    title: "Eixo 10 — Segurança Pública e Justiça",
    shortName: "Segurança Pública & Justiça",
    description: "Violência urbana, letalidade, crimes cibernéticos, medidas socioeducativas, facções, trânsito, polícia comunitária e câmeras corporais.",
    color: "from-slate-700 to-amber-900",
    themes: [
      {
        id: "e10_t1",
        axisNumber: 10,
        themeNumber: 1,
        axisTitle: "Segurança Pública e Justiça",
        title: "Caminhos para reduzir os índices de violência urbana e a letalidade policial.",
        prompt: "Discuta o uso proporcional da força, o treinamento humanizado de agentes da lei, a inteligência operacional e a redução de mortes de civis e de policiais em serviço.",
        repertoire: ["Artigo 144 da CF/88 (Segurança pública como dever do Estado e responsabilidade de todos)", "Sistema Único de Segurança Pública (SUSP - Lei nº 13.675/2018)", "Fórum Brasileiro de Segurança Pública (Anuário Brasileiro de Segurança Pública)"],
        guidingQuestions: [
          "Como a militarização das abordagens nas periferias muitas vezes aprofunda o abismo entre moradores e fardas?",
          "Quais protocolos rígidos de uso progressivo da força garantem a volta segura do policial para casa e protegem inocentes?"
        ]
      },
      {
        id: "e10_t2",
        axisNumber: 10,
        themeNumber: 2,
        axisTitle: "Segurança Pública e Justiça",
        title: "O aumento dos crimes cibernéticos e os desafios para a segurança pública digital.",
        prompt: "Aborde o golpe do Pix, o roubo de contas em aplicativos, a extorsão virtual e a urgência de delegacias especializadas em crimes de alta tecnologia.",
        repertoire: ["Lei Carolina Dieckmann (Lei nº 12.737/2012)", "Lei nº 14.155/2021 (Agravamento de penas para fraudes digitais)", "Código Penal (Artigos 154-A e 171, § 2º-A)"],
        guidingQuestions: [
          "Por que quadrilhas especializadas conseguem agir com facilidade e anonimato usando laranjas bancários?",
          "De que maneira a cooperação entre operadoras de telefonia, fintechs e polícias civis agiliza o rastreio do dinheiro roubado?"
        ]
      },
      {
        id: "e10_t3",
        axisNumber: 10,
        themeNumber: 3,
        axisTitle: "Segurança Pública e Justiça",
        title: "A eficácia das medidas socioeducativas na reabilitação de menores infratores.",
        prompt: "Examine a superlotação em unidades de internação, a falta de cursos profissionalizantes reais e o debate sobre a redução da maioridade penal.",
        repertoire: ["Sistema Nacional de Atendimento Socioeducativo (SINASE - Lei nº 12.594/2012)", "Estatuto da Criança e do Adolescente (ECA - Artigos 112 a 125)", "Artigo 228 da CF/88 (Inimputabilidade penal de menores de 18 anos)"],
        guidingQuestions: [
          "O que acontece com um jovem que cumpre medida de internação e sai sem qualquer qualificação ou acompanhamento familiar?",
          "Por que focar na ressocialização gera mais segurança para a sociedade do que simplesmente endurecer penas?"
        ]
      },
      {
        id: "e10_t4",
        axisNumber: 10,
        themeNumber: 4,
        axisTitle: "Segurança Pública e Justiça",
        title: "Violência nos estádios e o desafio de garantir o lazer seguro no esporte.",
        prompt: "Analise brigas marcadas entre torcidas organizadas, emboscadas em avenidas e o papel do reconhecimento facial e cadastramento biométrico nos portões.",
        repertoire: ["Lei Geral do Esporte (Lei nº 14.597/2023 - Substituiu o Estatuto do Torcedor)", "Ministério Público - Grupos de Atuação Especial em Grandes Eventos (GEPE)", "Artigo 217 da CF/88"],
        guidingQuestions: [
          "Como a infiltração de criminosos comuns descaracteriza a paixão esportiva das famílias que vão aos jogos?",
          "Quais punições individualizadas e banimentos definitivos afastam violentos sem penalizar os clubes inteiros?"
        ]
      },
      {
        id: "e10_t5",
        axisNumber: 10,
        themeNumber: 5,
        axisTitle: "Segurança Pública e Justiça",
        title: "O tráfico de armas e drogas como principal motor do crime organizado.",
        prompt: "Reflita sobre o controle das rotas fluviais e terrestres nas fronteiras nacionais, a lavagem de dinheiro em capitais e o poderio bélico de facções transnacionais.",
        repertoire: ["Lei de Drogas (Lei nº 11.343/2006)", "Estatuto do Desarmamento (Lei nº 10.826/2003)", "Polícia Federal e Forças Armadas - Operações de Fronteira (Artigo 142 da CF/88)"],
        guidingQuestions: [
          "Por que apreender cargas de varejo na ponta da linha não desmantela os líderes que movimentam bilhões nos bancos?",
          "Como a inteligência financeira do COAF é a arma mais poderosa para sufocar o poder de compra do narcotráfico?"
        ]
      },
      {
        id: "e10_t6",
        axisNumber: 10,
        themeNumber: 6,
        axisTitle: "Segurança Pública e Justiça",
        title: "Desafios da segurança viária e o combate à imprudência no trânsito brasileiro.",
        prompt: "Discuta o número alarmante de mortes por embriaguez ao volante, excesso de velocidade e uso de celular dirigindo nas rodovias e cidades.",
        repertoire: ["Código de Trânsito Brasileiro (CTB - Lei nº 9.503/1997)", "Lei Seca (Lei nº 11.705/2008 e Lei nº 12.760/2012)", "Plano Nacional de Redução de Mortes e Lesões no Trânsito (PNATRANS)"],
        guidingQuestions: [
          "Por que muitos motoristas ainda enxergam acidentes de trânsito fatais como 'fatalidades' e não como crimes evitáveis?",
          "De que maneira a fiscalização eletrônica ostensiva e bafômetros salvam milhares de vidas anualmente?"
        ]
      },
      {
        id: "e10_t7",
        axisNumber: 10,
        themeNumber: 7,
        axisTitle: "Segurança Pública e Justiça",
        title: "A importância do policiamento comunitário e preventivo nas periferias.",
        prompt: "Aborde a presença constante e amiga de policiais em bases de bairro, rondas escolares, proximidade com líderes locais e a restauração da confiança mútua.",
        repertoire: ["Filosofia de Polícia Comunitária (Método Koban japonês)", "Artigo 144 da CF/88", "Secretaria Nacional de Segurança Pública (SENASP)"],
        guidingQuestions: [
          "Como o policiamento que dialoga com a comunidade colhe informações vitais para antecipar e evitar crimes?",
          "Quais preconceitos de parte da corporação e da população precisam ser desarmados para a cooperação mútua?"
        ]
      },
      {
        id: "e10_t8",
        axisNumber: 10,
        themeNumber: 8,
        axisTitle: "Segurança Pública e Justiça",
        title: "O combate ao desaparecimento de pessoas e o suporte às famílias das vítimas.",
        prompt: "Analise a agonia de mães e parentes, a morosidade inicial nas buscas policiais e a criação de cadastros unificados com DNA para identificação de corpos e crianças.",
        repertoire: ["Política Nacional de Busca de Pessoas Desaparecidas (Lei nº 13.812/2019)", "Cadastro Nacional de Pessoas Desaparecidas", "Artigo 5º, III da CF/88"],
        guidingQuestions: [
          "Por que a falsa crença de que é preciso 'esperar 24 ou 48 horas' para registrar o sumiço custa a vida de vítimas sequestradas?",
          "Como integrar bancos de dados de hospitais, IMLs e abrigos em tempo real em todas as unidades da federação?"
        ]
      },
      {
        id: "e10_t9",
        axisNumber: 9,
        themeNumber: 9,
        axisTitle: "Segurança Pública e Justiça",
        title: "A impunidade em crimes de colarinho branco e os reflexos na sociedade.",
        prompt: "Discuta fraudes fiscais milionárias, desvios em licitações de saúde e a sensação de que as leis penais só punem os vulneráveis e perdoam os poderosos.",
        repertoire: ["Lei dos Crimes do Colarinho Branco (Lei nº 7.492/1986)", "Lei Anticorrupção (Lei nº 12.846/2013)", "Edwin Sutherland (Conceito de White-Collar Crime)"],
        guidingQuestions: [
          "De que forma desvios bilionários da saúde e merenda matam mais cidadãos do que crimes violentos de rua?",
          "Como a morosidade recursal nos tribunais superiores gera prescrição de crimes de réus de alto poder aquisitivo?"
        ]
      },
      {
        id: "e10_t10",
        axisNumber: 10,
        themeNumber: 10,
        axisTitle: "Segurança Pública e Justiça",
        title: "Os limites e desafios do uso de câmeras corporais por agentes de segurança.",
        prompt: "Avalie a gravação ininterrupta em uniformes como salvaguarda da legalidade policial, instrumento para combater acusações falsas e mecanismo de transparência.",
        repertoire: ["Portaria do Ministério da Justiça e Segurança Pública sobre Diretrizes de Câmeras Corporais", "Constituição Federal (Artigos 5º e 144)", "Estudos da Fundação Getulio Vargas (FGV) e PMESP sobre Câmeras Operacionais"],
        guidingQuestions: [
          "Como os dados comprovam a queda dramática na letalidade policial e na morte de policiais onde as câmeras foram implantadas?",
          "Quais garantias de privacidade do próprio agente e regras de custódia das imagens digitais devem ser mantidas?"
        ]
      }
    ]
  }
];

export const ALL_THEMES: EssayThemeProposal[] = THEMATIC_AXES.flatMap(axis => axis.themes);
