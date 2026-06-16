import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 A correr seed...')

  // ── Categorias ────────────────────────────────────────────────────────────
  const categories = [
    { name: 'Tecnologia', slug: 'tecnologia', icon: 'Laptop' },
    { name: 'Design', slug: 'design', icon: 'Palette' },
    { name: 'Idiomas', slug: 'idiomas', icon: 'Languages' },
    { name: 'Tutoria', slug: 'tutoria', icon: 'GraduationCap' },
    { name: 'Música', slug: 'musica', icon: 'Music' },
    { name: 'Fotografia', slug: 'fotografia', icon: 'Camera' },
    { name: 'Escrita', slug: 'escrita', icon: 'PenLine' },
    { name: 'Outros', slug: 'outros', icon: 'Package' },
    { name: 'Ciências', slug: 'ciencias', icon: 'FlaskConical' },
    { name: 'Artes', slug: 'artes', icon: 'Brush' },
    { name: 'Desporto', slug: 'desporto', icon: 'Trophy' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { icon: cat.icon },
      create: cat,
    })
  }
  console.log('✅ Categorias criadas/atualizadas')

  const cat = async (slug: string) => {
    const c = await prisma.category.findUnique({ where: { slug } })
    return c?.id ?? null
  }

  // ── Domínios institucionais ───────────────────────────────────────────────
  const domains = [
    { domain: 'ipiaget.pt', name: 'Instituto Piaget (Staff)' },
    { domain: 'skoolbay.com', name: 'SkoolBay' },
  ]
  for (const d of domains) {
    await prisma.institutionalDomain.upsert({
      where: { domain: d.domain },
      update: {},
      create: d,
    })
  }
  console.log('✅ Domínios institucionais criados/atualizados')

  // ── Admins e utilizador de teste ──────────────────────────────────────────
  const adminHash = await bcrypt.hash('Admin123!', 12)

  await prisma.user.upsert({
    where: { email: 'admin@ipiaget.pt' },
    update: {},
    create: {
      name: 'Admin SkoolBay',
      email: 'admin@ipiaget.pt',
      password: adminHash,
      emailVerified: new Date(),
      university: 'Instituto Piaget',
      course: 'Engenharia Informática',
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin criado (admin@ipiaget.pt / Admin123!)')

  const adminSkoolbayHash = await bcrypt.hash('skoolbay', 12)
  await prisma.user.upsert({
    where: { email: 'administrator@skoolbay.com' },
    update: {},
    create: {
      name: 'Administrator',
      email: 'administrator@skoolbay.com',
      password: adminSkoolbayHash,
      emailVerified: new Date(),
      isActive: true,
      university: 'SkoolBay',
      course: 'Administração',
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin SkoolBay criado (administrator@skoolbay.com / skoolbay)')

  const testHash = await bcrypt.hash('Test123!', 12)
  await prisma.user.upsert({
    where: { email: 'test@ipiaget.pt' },
    update: {},
    create: {
      name: 'Estudante Teste',
      email: 'test@ipiaget.pt',
      password: testHash,
      emailVerified: new Date(),
      university: 'Instituto Piaget',
      course: 'Engenharia Informática',
      bio: 'Estudante de teste para desenvolvimento.',
    },
  })
  console.log('✅ Utilizador de teste criado (test@ipiaget.pt / Test123!)')

  // ── 11 utilizadores com 5 serviços cada ──────────────────────────────────
  type ServiceDef = {
    title: string
    description: string
    price: number
    categorySlug: string
  }

  type UserDef = {
    name: string
    email: string
    university: string
    course: string
    bio: string
    services: ServiceDef[]
  }

  const seedUsers: UserDef[] = [
    {
      name: 'João Silva',
      email: 'joao.silva@ipiaget.pt',
      university: 'Instituto Piaget',
      course: 'Engenharia Informática',
      bio: 'Apaixonado por programação e sistemas distribuídos. Tenho experiência em Python, Java e desenvolvimento web.',
      services: [
        {
          title: 'Explicações de Python para Iniciantes',
          description: 'Aulas individuais de Python focadas em fundamentos: variáveis, estruturas de controlo, funções e listas. Ideal para quem começa do zero ou tem dificuldades nos primeiros semestres.',
          price: 15,
          categorySlug: 'tecnologia',
        },
        {
          title: 'Desenvolvimento de Website em Next.js',
          description: 'Desenvolvo websites modernos com Next.js e Tailwind CSS. Portfolio, landing pages e projetos académicos. Entrega com código limpo e documentado.',
          price: 35,
          categorySlug: 'tecnologia',
        },
        {
          title: 'Apoio em Algoritmos e Estruturas de Dados',
          description: 'Ajudo a perceber algoritmos de ordenação, pesquisa, listas ligadas, árvores e grafos. Com exemplos práticos em Python ou Java conforme a UC.',
          price: 18,
          categorySlug: 'tecnologia',
        },
        {
          title: 'Resolução de Projetos de Programação Java',
          description: 'Ajudo com projetos de POO em Java: classes, herança, interfaces e padrões de design. Explico os conceitos ao mesmo tempo que resolvemos o teu projeto.',
          price: 20,
          categorySlug: 'tecnologia',
        },
        {
          title: 'Desenvolvimento de App Mobile com React Native',
          description: 'Apoio no desenvolvimento de aplicações mobile com React Native. Desde a estrutura do projeto até à publicação. Ideal para projetos de final de curso.',
          price: 30,
          categorySlug: 'tecnologia',
        },
      ],
    },
    {
      name: 'Ana Rodrigues',
      email: 'ana.rodrigues@ipiaget.pt',
      university: 'Instituto Piaget',
      course: 'Design de Comunicação',
      bio: 'Designer focada em identidade visual e comunicação digital. Trabalho com Adobe Creative Suite e Figma.',
      services: [
        {
          title: 'Design de Logótipo Profissional',
          description: 'Criação de logótipo para projetos académicos, associações ou negócios pessoais. Entrega em ficheiros editáveis (AI, PDF) e formatos web (PNG, SVG). Inclui 2 revisões.',
          price: 25,
          categorySlug: 'design',
        },
        {
          title: 'Design de Flyer e Cartaz',
          description: 'Criação de flyers e cartazes para eventos, campanhas universitárias ou projetos pessoais. Formato digital e adaptado para impressão. Entrega em 48h.',
          price: 15,
          categorySlug: 'design',
        },
        {
          title: 'Mockup de Interface UI/UX',
          description: 'Prototipagem de interfaces em Figma para aplicações web ou mobile. Inclui wireframes e protótipo interativo. Ideal para projetos de dissertação ou portfólio.',
          price: 30,
          categorySlug: 'design',
        },
        {
          title: 'Edição e Retoque de Fotografias',
          description: 'Edição profissional de fotografias com Adobe Lightroom e Photoshop. Retoques de pele, correção de cor, remoção de fundos e composições. Até 20 fotos por sessão.',
          price: 20,
          categorySlug: 'fotografia',
        },
        {
          title: 'Aulas de Desenho e Ilustração Digital',
          description: 'Introdução ao desenho tradicional e ilustração digital com Procreate ou Adobe Illustrator. Técnicas de esboço, composição, luz e sombra. Adaptado a iniciantes — sem material especial necessário para começar.',
          price: 20,
          categorySlug: 'artes',
        },
      ],
    },
    {
      name: 'Mariana Santos',
      email: 'mariana.santos@ipiaget.pt',
      university: 'Instituto Piaget',
      course: 'Psicologia',
      bio: 'Estudante de Psicologia com formação em técnicas de relaxamento e gestão de stress académico.',
      services: [
        {
          title: 'Apoio Emocional entre Pares (não é terapia)',
          description: 'Espaço de escuta ativa e apoio emocional entre pares. Não substitui acompanhamento clínico. Ideal para falar de stress académico, relações interpessoais ou ansiedade de provas, com alguém que te ouve sem julgamento.',
          price: 10,
          categorySlug: 'outros',
        },
        {
          title: 'Técnicas de Gestão de Ansiedade de Exame',
          description: 'Sessão prática de técnicas de regulação emocional e gestão de ansiedade antes de exames: respiração diafragmática, técnica 5-4-3-2-1 e reestruturação cognitiva básica.',
          price: 12,
          categorySlug: 'outros',
        },
        {
          title: 'Métodos de Estudo e Organização Académica',
          description: 'Ajudo a estruturar um plano de estudo eficaz com base em técnicas de memorização ativa (Pomodoro, spaced repetition, mind maps). Sessão personalizada ao teu curso.',
          price: 10,
          categorySlug: 'tutoria',
        },
        {
          title: 'Introdução a Mindfulness para Estudantes',
          description: 'Sessão introdutória de mindfulness adaptada à rotina universitária. Exercícios de atenção plena para melhorar foco, reduzir stress e dormir melhor antes de épocas de exame.',
          price: 8,
          categorySlug: 'outros',
        },
        {
          title: 'Revisão de Trabalhos de Psicologia',
          description: 'Revisão académica de trabalhos de Psicologia: estrutura, coerência argumentativa, citações APA e adequação ao tema. Não escrevo pelo aluno — revejo e sugiro melhorias.',
          price: 15,
          categorySlug: 'escrita',
        },
      ],
    },
    {
      name: 'Pedro Ferreira',
      email: 'pedro.ferreira@ipiaget.pt',
      university: 'Instituto Piaget',
      course: 'Gestão de Empresas',
      bio: 'Estudante de Gestão com experiência em análise financeira e modelação em Excel. Estágio em consultoria.',
      services: [
        {
          title: 'Excel Avançado: Tabelas Dinâmicas e Dashboards',
          description: 'Ensino Excel do intermédio ao avançado: tabelas dinâmicas, PROCV/ÍNDICE+CORRESP, formatação condicional e dashboards automáticos. Sessões práticas com os teus próprios dados.',
          price: 18,
          categorySlug: 'tecnologia',
        },
        {
          title: 'Análise Financeira de Projetos',
          description: 'Apoio na análise de viabilidade financeira: VAL, TIR, payback, análise de sensibilidade. Ideal para trabalhos de UC de Finanças ou projetos de plano de negócios.',
          price: 22,
          categorySlug: 'tutoria',
        },
        {
          title: 'Contabilidade Básica e Lançamentos',
          description: 'Explicações de contabilidade para quem começa: débito/crédito, balancete, diário e razão. Resolução de exercícios práticos ao ritmo do aluno.',
          price: 16,
          categorySlug: 'tutoria',
        },
        {
          title: 'Plano de Negócios para Projetos Académicos',
          description: 'Ajudo a estruturar e redigir planos de negócios para UCs ou concursos de empreendedorismo: análise de mercado, modelo canvas, projeções financeiras e pitch deck.',
          price: 30,
          categorySlug: 'escrita',
        },
        {
          title: 'Estatística Aplicada à Gestão com SPSS',
          description: 'Apoio em análise estatística com SPSS para dissertações e trabalhos de Gestão: análise descritiva, testes de hipótese, regressão linear e interpretação de resultados.',
          price: 20,
          categorySlug: 'tutoria',
        },
      ],
    },
    {
      name: 'Inês Carvalho',
      email: 'ines.carvalho@ipiaget.pt',
      university: 'Instituto Piaget',
      course: 'Engenharia Civil',
      bio: 'Estudante de Engenharia Civil com forte base em Matemática e Física. Tutora voluntária desde o 1º ano.',
      services: [
        {
          title: 'Explicações de Cálculo e Análise Matemática',
          description: 'Apoio em Cálculo I e II: limites, derivadas, integrais, séries e equações diferenciais. Resolução passo a passo com foco nos exercícios dos teus exames.',
          price: 17,
          categorySlug: 'ciencias',
        },
        {
          title: 'Física para Engenharia (Mecânica e Ondas)',
          description: 'Explicações de Física I e II: mecânica clássica, dinâmica, termodinâmica e ondas. Com resolução de problemas tipo exame e revisão de conceitos base.',
          price: 17,
          categorySlug: 'ciencias',
        },
        {
          title: 'Álgebra Linear e Geometria Analítica',
          description: 'Apoio em Álgebra Linear: vetores, matrizes, sistemas lineares, espaços vetoriais e transformações lineares. Explicações claras com exemplos visuais.',
          price: 15,
          categorySlug: 'ciencias',
        },
        {
          title: 'Introdução ao AutoCAD para Projetos',
          description: 'Aprende os fundamentos do AutoCAD: interface, comandos de desenho 2D, cotas, blocos e impressão de peças. Ideal para alunos de engenharia que usam CAD nas UCs.',
          price: 20,
          categorySlug: 'tecnologia',
        },
        {
          title: 'Preparação para Exames de Matemática e Física',
          description: 'Sessões intensivas de preparação para exame. Resolução de exames anteriores, identificação de padrões e estratégia de resposta. Marcação com mínimo 3 dias de antecedência.',
          price: 22,
          categorySlug: 'ciencias',
        },
      ],
    },
    {
      name: 'Miguel Costa',
      email: 'miguel.costa@ipiaget.pt',
      university: 'Instituto Piaget',
      course: 'Tradução e Interpretação',
      bio: 'Estudante de Tradução com fluência em inglês, francês e espanhol. Traduções técnicas e académicas.',
      services: [
        {
          title: 'Tradução Português → Inglês (textos académicos)',
          description: 'Tradução de textos académicos, resumos, abstracts e relatórios de PT para EN. Revisão incluída. Prazo: 2 dias úteis por 1000 palavras. Fluência nativa em inglês académico.',
          price: 20,
          categorySlug: 'idiomas',
        },
        {
          title: 'Tradução Português → Francês',
          description: 'Tradução de PT para FR para trabalhos universitários, candidaturas e correspondência formal. Preço por projeto — contacta para orçamento conforme extensão do texto.',
          price: 22,
          categorySlug: 'idiomas',
        },
        {
          title: 'Tradução Português → Espanhol',
          description: 'Tradução PT → ES de textos académicos, técnicos ou criativos. Revisão de naturalidade e adequação cultural incluída. Entrega em 48h para textos até 2000 palavras.',
          price: 18,
          categorySlug: 'idiomas',
        },
        {
          title: 'Explicações de Inglês (B2 ao C1)',
          description: 'Aulas de inglês focadas em gramática avançada, escrita académica e preparação para certificações (Cambridge, TOEFL). Sessões personalizadas ao teu nível e objetivos.',
          price: 15,
          categorySlug: 'idiomas',
        },
        {
          title: 'Revisão e Correção de Textos em Inglês',
          description: 'Revisão gramatical, de estilo e coerência de textos escritos em inglês: emails formais, relatórios, dissertações e candidaturas. Comentários detalhados com sugestões de melhoria.',
          price: 16,
          categorySlug: 'escrita',
        },
      ],
    },
    {
      name: 'Sofia Martins',
      email: 'sofia.martins@ipiaget.pt',
      university: 'Instituto Piaget',
      course: 'Música',
      bio: 'Estudante de Música com 10 anos de piano e formação em teoria musical. Professora de piano desde os 17.',
      services: [
        {
          title: 'Aulas de Piano para Iniciantes e Intermédios',
          description: 'Aulas de piano adaptadas ao teu nível: leitura de partitura, técnica de mãos, repertório clássico e contemporâneo. Método personalizado — criança ou adulto, clássico ou pop.',
          price: 20,
          categorySlug: 'musica',
        },
        {
          title: 'Teoria Musical e Formação Musical',
          description: 'Explicações de teoria musical: leitura de partituras, solfejo, intervalos, escalas, acordes e harmonia. Ideal para quem quer tirar exames de Conservatório ou entrar no curso de Música.',
          price: 15,
          categorySlug: 'musica',
        },
        {
          title: 'Produção Musical Básica com GarageBand/Logic',
          description: 'Introdução à produção musical digital: gravação de instrumentos e voz, uso de loops, mixagem básica e exportação. Usando GarageBand (gratuito) ou Logic Pro.',
          price: 25,
          categorySlug: 'musica',
        },
        {
          title: 'Aulas de Canto — Técnica Vocal Básica',
          description: 'Sessões de técnica vocal: respiração diafragmática, postura, afinação e projeção. Repertório livre — pop, clássico ou MPB. Indicado para quem quer cantar melhor, não necessariamente ser profissional.',
          price: 18,
          categorySlug: 'musica',
        },
        {
          title: 'Composição e Arranjos para Projetos Académicos',
          description: 'Ajudo a compor músicas originais ou criar arranjos para projetos de Música, cinema ou publicidade. Entrega em formato áudio (MP3/WAV) e partitura se necessário.',
          price: 30,
          categorySlug: 'musica',
        },
      ],
    },
    {
      name: 'Rui Oliveira',
      email: 'rui.oliveira@ipiaget.pt',
      university: 'Instituto Piaget',
      course: 'Ciências do Desporto',
      bio: 'Estudante de Ciências do Desporto e personal trainer certificado. Especializado em treino funcional e nutrição desportiva.',
      services: [
        {
          title: 'Plano de Treino Personalizado',
          description: 'Criação de plano de treino semanal adaptado ao teu objetivo: perda de peso, hipertrofia, resistência ou saúde geral. Inclui fichas de exercícios com descrição e séries/repetições.',
          price: 20,
          categorySlug: 'desporto',
        },
        {
          title: 'Treino Funcional Online (sessão ao vivo)',
          description: 'Sessão de treino funcional online de 45 minutos via videochamada. Sem equipamento necessário. Intensidade adaptada ao teu nível. Ideal para quem quer começar sem ir ao ginásio.',
          price: 15,
          categorySlug: 'desporto',
        },
        {
          title: 'Plano Nutricional Desportivo (não substitui nutricionista)',
          description: 'Orientação nutricional para desportistas baseada em princípios gerais: distribuição de macros, timing de refeições e sugestões práticas. Não é aconselhamento clínico — para questões médicas, consultar nutricionista.',
          price: 18,
          categorySlug: 'desporto',
        },
        {
          title: 'Introdução ao Yoga e Mobilidade',
          description: 'Sessão introdutória de yoga e exercícios de mobilidade articular. Ideal para complementar treinos de força ou para quem passa muitas horas sentado a estudar. Sessão de 60 min via videochamada.',
          price: 12,
          categorySlug: 'desporto',
        },
        {
          title: 'Apoio em Trabalhos de Fisiologia do Exercício',
          description: 'Explicações e apoio em trabalhos académicos de Fisiologia do Exercício, Biomecânica e Nutrição Desportiva. Resolução de exercícios e preparação para exames.',
          price: 16,
          categorySlug: 'ciencias',
        },
      ],
    },
    {
      name: 'Catarina Sousa',
      email: 'catarina.sousa@ipiaget.pt',
      university: 'Instituto Piaget',
      course: 'Marketing',
      bio: 'Estudante de Marketing com experiência em gestão de redes sociais e criação de conteúdo digital.',
      services: [
        {
          title: 'Gestão de Redes Sociais (Instagram/LinkedIn)',
          description: 'Gestão mensal de perfil no Instagram ou LinkedIn: planeamento de conteúdo, criação de posts (texto + imagem), publicação e análise de métricas. Ideal para projetos estudantis ou pequenos negócios.',
          price: 30,
          categorySlug: 'outros',
        },
        {
          title: 'Estratégia de Conteúdo Digital',
          description: 'Criação de estratégia de conteúdo para redes sociais: definição de persona, calendário editorial e sugestões de formato por plataforma. Entrega em documento PDF.',
          price: 25,
          categorySlug: 'escrita',
        },
        {
          title: 'Copywriting para Posts e Anúncios',
          description: 'Redação de textos persuasivos para posts em redes sociais, newsletters e anúncios digitais. Estilo adaptado à voz da marca. Entrega em 48h.',
          price: 15,
          categorySlug: 'escrita',
        },
        {
          title: 'SEO Básico para Websites',
          description: 'Auditoria SEO básica e recomendações de otimização: keywords, meta tags, estrutura de URLs e conteúdo. Ideal para quem tem um site WordPress ou criado com builder.',
          price: 20,
          categorySlug: 'tecnologia',
        },
        {
          title: 'Criação de Apresentações Profissionais (PowerPoint/Canva)',
          description: 'Criação ou redesign de apresentações académicas ou profissionais em PowerPoint ou Canva. Design limpo, coerente e adaptado ao público-alvo. Entrega em 48h.',
          price: 18,
          categorySlug: 'design',
        },
      ],
    },
    {
      name: 'Bruno Lopes',
      email: 'bruno.lopes@ipiaget.pt',
      university: 'Instituto Piaget',
      course: 'Biologia',
      bio: 'Estudante de Biologia com gosto por ensinar ciências. Explicador voluntário desde o ensino secundário.',
      services: [
        {
          title: 'Explicações de Biologia Celular e Molecular',
          description: 'Apoio em Biologia Celular: estrutura celular, divisão celular, genética molecular, expressão génica e biotecnologia. Explicações com esquemas e resolução de problemas.',
          price: 16,
          categorySlug: 'ciencias',
        },
        {
          title: 'Química Orgânica e Bioquímica',
          description: 'Explicações de Química Orgânica e Bioquímica: nomenclatura, reações orgânicas, metabolismo e estrutura de biomoléculas. Com resolução de exercícios dos exames anteriores.',
          price: 17,
          categorySlug: 'ciencias',
        },
        {
          title: 'Anatomia e Fisiologia Humana',
          description: 'Apoio em Anatomia e Fisiologia: sistemas orgânicos, histologia básica e correlações fisiológicas. Ideal para alunos de Biologia, Ciências do Desporto ou Enfermagem.',
          price: 16,
          categorySlug: 'ciencias',
        },
        {
          title: 'Preparação para Exames de Biologia',
          description: 'Sessões de revisão intensiva para exames de Biologia: identificação das matérias com maior peso, resolução de exames anteriores e estratégia de resposta. Marcação com 48h de antecedência.',
          price: 20,
          categorySlug: 'ciencias',
        },
        {
          title: 'Revisão de Relatórios de Laboratório',
          description: 'Revisão de relatórios laboratoriais de Biologia, Química ou Bioquímica: estrutura, interpretação de resultados, discussão e referências. Feedback detalhado em 48h.',
          price: 12,
          categorySlug: 'escrita',
        },
      ],
    },
    {
      name: 'Beatriz Nunes',
      email: 'beatriz.nunes@ipiaget.pt',
      university: 'Instituto Piaget',
      course: 'Direito',
      bio: 'Estudante de Direito com forte capacidade de análise jurídica e redação académica. Membro da clínica jurídica.',
      services: [
        {
          title: 'Revisão de Trabalhos Académicos de Direito',
          description: 'Revisão de trabalhos de Direito: argumentação jurídica, coerência, citações (normas ABNT ou estilo da faculdade) e adequação à questão colocada. Não escrevo pelo aluno — revejo e oriento.',
          price: 18,
          categorySlug: 'escrita',
        },
        {
          title: 'Resumos de Legislação e Doutrina',
          description: 'Elaboração de resumos esquemáticos de legislação, doutrina e jurisprudência para estudo. Formato adaptado ao teu estilo de aprendizagem: tabelas, mapas conceptuais ou texto corrido.',
          price: 15,
          categorySlug: 'escrita',
        },
        {
          title: 'Redação de Pareceres Jurídicos Simples',
          description: 'Apoio na estruturação e redação de pareceres jurídicos para trabalhos académicos: identificação da questão, enquadramento legal, análise e conclusão. Sessão de 90 minutos.',
          price: 22,
          categorySlug: 'escrita',
        },
        {
          title: 'Explicações de Direito Civil e Contratos',
          description: 'Apoio em Direito Civil: negócio jurídico, contratos típicos, responsabilidade civil e direitos reais. Resolução de casos práticos e preparação para exame.',
          price: 18,
          categorySlug: 'tutoria',
        },
        {
          title: 'Revisão e Melhoria de Redação Académica',
          description: 'Apoio geral em escrita académica: estrutura de argumentos, clareza, coesão e adequação ao registo formal. Aplicável a qualquer área — experiência em textos de Direito, Gestão e Humanidades.',
          price: 14,
          categorySlug: 'escrita',
        },
      ],
    },
  ]

  let usersCreated = 0
  let servicesCreated = 0

  for (const userDef of seedUsers) {
    const user = await prisma.user.upsert({
      where: { email: userDef.email },
      update: {},
      create: {
        name: userDef.name,
        email: userDef.email,
        password: testHash,
        emailVerified: new Date(),
        university: userDef.university,
        course: userDef.course,
        bio: userDef.bio,
      },
    })
    usersCreated++

    for (const svc of userDef.services) {
      const exists = await prisma.service.findFirst({
        where: { title: svc.title, userId: user.id },
      })
      if (exists) continue

      const categoryId = await cat(svc.categorySlug)
      await prisma.service.create({
        data: {
          title: svc.title,
          description: svc.description,
          price: svc.price,
          userId: user.id,
          categoryId,
        },
      })
      servicesCreated++
    }
  }

  console.log(`\n✅ ${usersCreated} utilizadores seed criados/verificados`)
  console.log(`✅ ${servicesCreated} serviços novos criados`)
  console.log('\n🎉 Seed concluído!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
