# Retrospectiva Final — SkoolBay

> Sprint Review & Retrospective · Engenharia de Software I · Instituto Piaget · 2025/2026

---

## 1. Resumo do projeto

| Campo | Detalhe |
|---|---|
| **Nome** | SkoolBay |
| **Objetivo** | Marketplace de serviços entre estudantes universitários — permite publicar, pesquisar e contratar competências (tutoria, design, programação, etc.) dentro da comunidade académica |
| **Stack** | Next.js 14 (App Router) · TypeScript · Prisma ORM · PostgreSQL · NextAuth.js v5 · Tailwind CSS · shadcn/ui · Vitest |
| **Infraestrutura** | Docker Compose (Postgres local) · Vercel (deploy) · GitHub (controlo de versão e gestão de projeto) |
| **Período** | Abril 2026 (Sprints 0–5) |
| **Repositório** | [pereira2001/ESTG-ESI-SkoolBay](https://github.com/pereira2001/ESTG-ESI-SkoolBay) |

---

## 2. O que correu bem

### Stack técnica escolhida funcionou

O Next.js 14 com App Router e Server Components permitiu colocar queries Prisma diretamente nas páginas sem camadas adicionais de API, reduzindo significativamente o boilerplate. A integração NextAuth → Prisma → PostgreSQL foi limpa desde o Sprint 1 e não criou problemas de regressão nos sprints seguintes.

A adoção do Tailwind CSS com shadcn/ui acelerou a implementação dos componentes UI sem sacrificar consistência visual — os tokens de cor da marca (`#7F77DD`) foram aplicados de forma coerente em toda a aplicação.

### Processo Scrum com GitHub Issues e PRs por US

Cada User Story teve a sua própria branch (`feat/us-XXX-...`), PR dedicado e issue de fecho (`Closes #N`). Isso tornou o histórico de git legível e permitiu rever exatamente o que foi feito por cada US sem misturar alterações de scopes diferentes.

As mensagens de commit em formato Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`) facilitaram a geração automática de changelogs e tornaram o `git log` informativo para qualquer elemento da equipa.

### Documentação completa desde Sprint 0

A decisão de documentar antes de codificar (Documento de Visão, User Stories com critérios de aceitação, Diagramas UML) evitou ambiguidade durante a implementação. Os ADRs (Architecture Decision Records) capturaram as decisões técnicas chave com contexto e alternativas consideradas.

---

## 3. O que correu menos bem

### Gestão de branches em equipa

A estratégia de branch-per-US funcionou bem individualmente, mas gerou fricção quando múltiplas US partilhavam ficheiros base (ex: `header.tsx`, `schema.prisma`). Os conflitos de merge entre branches paralelas consumiram tempo que poderia ter sido investido em funcionalidades.

Em retrospetiva, uma rebase mais frequente sobre a branch de destino (em vez de esperar pelo merge do PR anterior) teria reduzido o tamanho dos diffs de conflito.

### Estimativas de story points vs tempo real

Algumas US foram subestimadas em story points: US-016 (denúncias) e US-017 (moderação) revelaram-se mais complexas do que o estimado porque envolviam componentes novos (Dialog, sistema de roles), validações server-side cruzadas e estados de UI adicionais.

A ausência de uma definição formal de "Done" com critérios de UI responsiva levou a iterações extra em componentes que pareciam completos mas falhavam em viewports móveis.

---

## 4. O que melhoraríamos

### Revisões de PR mais rápidas entre elementos do grupo

Os PRs ficaram abertos durante períodos longos sem review, o que atrasou o merge e criou branches divergentes. Um acordo de SLA interno (ex: review em 24h após abertura do PR) teria mantido o fluxo mais linear.

Code owners por área (ex: só quem toca no schema Prisma revê PRs de migração) reduziria o tempo de review sem aumentar a carga individual.

### Testes escritos em paralelo com a implementação, não no final

Os testes unitários e de aceitação foram escritos no Sprint 5, depois de toda a implementação estar feita. Isso significou que alguns schemas foram corrigidos retroativamente para alinhar com os requisitos (ex: `createReviewSchema.comment` estava opcional sem mínimo e o teste expôs a inconsistência com a API).

Seguir uma abordagem TDD — ou pelo menos escrever os testes da validação no mesmo PR da implementação — teria apanhado estas inconsistências antes de chegarem à `main`.

---

## 5. Métricas do projeto

| Métrica | Valor |
|---|---|
| **Total de User Stories** | 20 (US-001 a US-020) |
| **Sprints** | 6 (Sprint 0 a Sprint 5) |
| **Story points totais** | 86 |
| **Branches criadas** | 19 |
| **Pull Requests** | 18 |
| **PRs merged** | 7 |
| **PRs open (aguardam merge na cadeia)** | 11 |
| **Testes unitários** | 37 (100% pass) |
| **Testes de aceitação documentados** | 18 |
| **Ficheiros de código fonte** | ~55 |
| **Modelos Prisma** | 7 (User, Category, Service, ServiceRequest, Review, Report, Role) |
| **Endpoints API** | 8 (`/api/auth`, `/api/services`, `/api/requests`, `/api/reviews`, `/api/reports`, `/api/profile/avatar`) |

### Distribuição de story points por sprint

| Sprint | US | Story Points |
|---|---|---|
| Sprint 0 | Documentação e setup | 8 |
| Sprint 1 | US-001, 002, 003, 004, 019 | 21 |
| Sprint 2 | US-005, 006, 007, 008, 009 | 18 |
| Sprint 3 | US-010, 011, 012 | 13 |
| Sprint 4 | US-013, 014, 015, 016, 017, 018 | 21 |
| Sprint 5 | US-020 + testes | 5 |
| **Total** | | **86** |

---

## 6. Conclusão

### Aprendizagens principais

**Processo Scrum aplicado** — A divisão do trabalho em sprints com backlog priorizado, planning e review por iteração foi a diferença entre um projeto caótico e um entregável coerente. A visibilidade do progresso através dos GitHub Issues fechados por PR tornou o estado do projeto transparente em qualquer momento.

**Desenvolvimento orientado a User Stories** — Escrever critérios de aceitação antes de escrever código obrigou a pensar no comportamento esperado do ponto de vista do utilizador, não da implementação. Isso reduziu retrabalho e tornou as decisões de UI mais fundamentadas.

**Documentação técnica como artefacto de primeira classe** — README, ADRs, diagramas UML e testes de aceitação não foram um extra — foram parte do Definition of Done. A documentação produzida no Sprint 0 ainda era relevante e correta no Sprint 5, o que validou o investimento inicial.

**TypeScript + Zod como rede de segurança** — A combinação de tipos estáticos com validação runtime (Zod) apanhou erros de integração entre frontend e API muito antes de chegarem ao browser. A disciplina de não usar `any` e de definir schemas partilhados entre cliente e servidor foi trabalhosa no início mas pagou dividendos em manutenibilidade.

### Nota final

O SkoolBay é um produto funcional, testado e documentado. Está pronto para ser demonstrado, avaliado e, se necessário, continuado por uma equipa diferente — o que é o melhor indicador de qualidade de um projeto de engenharia de software.
