# SkoolBay — Estado Atual e Roadmap de Implementação

> Documento de contexto para Claude Code.  
> Última atualização: 22/04/2026  
> Repo: https://github.com/pereira2001/ESTG-ESI-SkoolBay

---

## Contexto do Projeto

Marketplace P2P para estudantes universitários publicarem e contratarem serviços entre si (explicações, design, tradução, programação, etc.). Autenticação por e-mail institucional.

**Stack confirmada:**
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Prisma ORM + PostgreSQL 16
- NextAuth.js v5 (beta)
- Zod v4
- Docker + Docker Compose
- GitHub Actions CI
- Vitest (testes)

**Contexto académico:** Engenharia de Software I — Instituto Piaget. Projeto vale 40% da nota. Avaliado por processo + documentação + implementação. Prazos a respeitar.

---

## Mapeamento Tarefas do Professor → Estado

| # | Tarefa | Prazo | Estado | Localização no repo |
|---|--------|-------|--------|---------------------|
| 1-3 | Criar repositório, GitHub Project, adicionar participantes | 17/04 | ✅ Feito | `github.com/pereira2001/ESTG-ESI-SkoolBay` |
| 4 | README.md com descrição e participantes | 17/04 | ✅ Feito | `README.md` |
| 5-7 | Documento de Visão (`docvisao.md`) | 24/04 | ✅ Feito | `docs/docvisao.md` |
| 8 | User Stories completas | 24/04 | ✅ Feito | `docs/scrum/product-backlog.md` |
| 9 | Protótipos UX / Mockups | 15/05 | ⚠️ Por fazer | `docs/ux/` (pasta não existe ainda) |
| 10 | Refinar User Stories | 29/05 | ⏳ Futuro | `docs/scrum/product-backlog.md` |
| 11 | Refinar Protótipos UX | 29/05 | ⏳ Futuro | `docs/ux/` |
| 12 | Diagrama de Casos de Uso | 15/05 | ✅ Feito | `docs/uml/casos-de-uso.md` |
| 13 | Diagrama de Classes | 15/05 | ✅ Feito | `docs/uml/diagrama-classes.md` |
| 14 | Implementação (Sprints 1–4) | 12/06 | ❌ Não iniciado | `app/` (estrutura não existe) |
| 15 | Testes Unitários (Vitest) | 18/06 | ❌ Não iniciado | `__tests__/` |
| 16 | Testes de Aceitação (User Stories como testes) | 18/06 | ❌ Não iniciado | `__tests__/acceptance/` |
| 17 | Retrospectiva e Relatório Final | 18/06 | ❌ Não iniciado | `docs/scrum/retrospectiva.md` |

---

## Documentação Produzida (em Project Knowledge / repo)

| Ficheiro | Conteúdo | Estado |
|----------|----------|--------|
| `README.md` | Descrição, participantes, stack, setup | ✅ |
| `docs/docvisao.md` | 8 secções: objetivo, escopo, stakeholders, equipa, funcionalidades, arquitetura, restrições, integração LLM | ✅ |
| `docs/scrum/product-backlog.md` | US-001 a US-020, prioridades MoSCoW, story points, sprints | ✅ |
| `docs/uml/casos-de-uso.md` | Diagrama Mermaid com 24 UCs, 5 atores, descrições | ✅ |
| `docs/uml/diagrama-classes.md` | Diagrama Mermaid com 6 entidades + enums + relações + máquina de estados | ✅ |
| `docs/ux/` | Mockups/protótipos | ❌ Não existe |
| `docs/scrum/sprint-backlogs/` | Backlogs detalhados por sprint | ❌ Não existe |
| `docs/scrum/retrospectiva.md` | Retrospectiva final | ❌ Não existe |

---

## Estado da Implementação (Código)

**O projeto Next.js ainda não foi inicializado no repositório.**  
O script `setup-sprint1.sh` foi preparado mas não executado/commitado.

### O que existe no repo (presumido):
- Documentação em `docs/`
- Scripts de setup (`.sh`) — podem ou não estar commitados
- Sem código de aplicação (`app/`, `prisma/`, etc.)

---

## Roadmap de Implementação por Sprint

### Sprint 1 — Auth e Perfis (prazo: ~08/05)

**Objetivo:** Ter login funcional com e-mail institucional e perfil de utilizador.

#### Infraestrutura base (fazer primeiro):
- [ ] Executar `setup-sprint1.sh` ou equivalente para scaffolding do Next.js 14
- [ ] Configurar `docker-compose.yml` com PostgreSQL 16
- [ ] Inicializar Prisma: `npx prisma init`
- [ ] Criar `prisma/schema.prisma` com modelos: `User`, `Account`, `Session` (NextAuth), `VerificationToken`
- [ ] Configurar `DATABASE_URL` e `.env.local`
- [ ] `npx prisma db push` + seed básico de categorias
- [ ] Configurar GitHub Actions CI (`.github/workflows/ci.yml`) com lint + typecheck + testes

#### US-001 — Registo com e-mail institucional
- [ ] Página `/auth/register` com form: nome, e-mail, password, universidade, curso
- [ ] Validação Zod: e-mail deve terminar em domínio institucional (ex: `@alunos.ipiaget.pt`)
- [ ] Server Action `registerUser` com bcrypt (salt 12)
- [ ] Envio de e-mail de verificação (Nodemailer)
- [ ] Utilizador criado com `emailVerified: false`
- [ ] Feedback de erro/sucesso no form

#### US-002 — Verificação de e-mail
- [ ] Route `/auth/verify?token=...`
- [ ] Handler que valida token e ativa conta (`emailVerified: true`)
- [ ] Expiração de token (24h)
- [ ] Redirecionamento para login após verificação

#### US-003 — Login / Logout
- [ ] Configurar `auth.ts` com NextAuth.js v5 (Credentials provider)
- [ ] Verificar `emailVerified` antes de autorizar sessão
- [ ] Página `/auth/login` com form e-mail + password
- [ ] Middleware `middleware.ts` para proteger rotas `/dashboard/**`
- [ ] Logout via Server Action

#### US-004 — Perfil de utilizador
- [ ] Página `/profile/[userId]` pública
- [ ] Página `/dashboard/profile` para edição (nome, bio, curso, avatar)
- [ ] Upload de avatar (local `/public/avatars/` ou URL externa)
- [ ] Exibir rating médio calculado das reviews

#### US-019 — Navegação e layout base
- [ ] `app/layout.tsx` com Header + Footer
- [ ] Header: logo, links (Serviços, Sobre), botão Login/Perfil
- [ ] Header autenticado: avatar + dropdown (Dashboard, Perfil, Logout)
- [ ] Hamburger menu mobile (shadcn/ui)
- [ ] `components/ui/` com componentes shadcn instalados: Button, Input, Card, Avatar, DropdownMenu, Sheet

---

### Sprint 2 — Serviços e Pesquisa (prazo: ~18/05)

**Objetivo:** Prestadores publicam serviços; clientes pesquisam e filtram.

#### US-005 — Publicar serviço
- [ ] Página `/dashboard/services/new`
- [ ] Form: título, descrição, categoria, preço, imagem (opcional)
- [ ] Validação Zod server-side
- [ ] `POST /api/services` ou Server Action `createService`
- [ ] Máx 10 serviços por utilizador (validar)
- [ ] Redirecionamento para página do serviço criado

#### US-006 — Editar/remover serviço
- [ ] Página `/dashboard/services/[id]/edit`
- [ ] Verificação de ownership (só o dono pode editar)
- [ ] Soft delete: `isActive = false` (não apaga da BD)
- [ ] Server Actions: `updateService`, `deactivateService`

#### US-007 — Listar serviços
- [ ] Página `/services` com grid de cards
- [ ] Componente `ServiceCard` com: imagem, título, categoria, preço, rating, nome do prestador
- [ ] Paginação (cursor-based com Prisma)
- [ ] Filtro por categoria na URL (`?category=tecnologia`)
- [ ] Mostrar apenas serviços `isActive: true`

#### US-008 — Detalhe de serviço
- [ ] Página `/services/[id]`
- [ ] Info completa: descrição, preço, prestador, avaliações, botão "Pedir Serviço"
- [ ] Botão desativado se: visitante não autenticado, ou é o próprio prestador
- [ ] Secção de reviews (lista)

#### US-009 — Pesquisa e filtros
- [ ] Barra de pesquisa no header (full-text search no título e descrição)
- [ ] Página `/services?q=...&category=...&price_min=...&price_max=...`
- [ ] Implementar com Prisma `contains` (ou `pg_trgm` se necessário)
- [ ] Estado vazio com sugestões quando sem resultados

#### US-020 — Landing page
- [ ] Página `/` com Hero, "Como funciona", serviços em destaque, categorias
- [ ] CTA para registo/explorar serviços
- [ ] Responsiva

---

### Sprint 3 — Pedidos e Painel (prazo: ~01/06)

**Objetivo:** Fluxo completo de contratação com máquina de estados.

#### Modelo Prisma adicional:
- [ ] Adicionar `ServiceRequest` ao schema com enum `RequestStatus` (PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED)
- [ ] Relações: `ServiceRequest → Service`, `ServiceRequest → User (buyer)`
- [ ] Migration: `npx prisma migrate dev --name add_service_request`

#### US-010 — Enviar pedido de serviço
- [ ] Botão "Pedir Serviço" na página `/services/[id]`
- [ ] Modal/drawer com campo de mensagem (shadcn/ui Dialog ou Sheet)
- [ ] `POST /api/requests` ou Server Action `createRequest`
- [ ] Validação: não pode pedir o próprio serviço
- [ ] Status inicial: `PENDING`
- [ ] Notificação ao prestador (e-mail opcional)

#### US-011 — Painel do prestador — gerir pedidos recebidos
- [ ] Página `/dashboard/requests` (pedidos recebidos)
- [ ] Filtro por estado (tabs ou select)
- [ ] Botões: Aceitar, Recusar (para PENDING) / Concluir (para ACCEPTED)
- [ ] Server Actions: `acceptRequest`, `rejectRequest`, `completeRequest`
- [ ] Validação de transições de estado

#### US-012 — Painel do cliente — pedidos enviados
- [ ] Página `/dashboard/my-requests`
- [ ] Estado visível de cada pedido (badge colorido)
- [ ] Botão Cancelar (para PENDING ou ACCEPTED)
- [ ] Server Action `cancelRequest`
- [ ] Link para serviço e perfil do prestador

#### US-013 — Dashboard principal
- [ ] Página `/dashboard`
- [ ] Cards de resumo: serviços publicados, pedidos recebidos, pedidos enviados, rating médio
- [ ] Lista dos 3 últimos pedidos recebidos
- [ ] Links rápidos: Criar serviço, Ver pedidos, Editar perfil

---

### Sprint 4 — Reviews, Moderação e Polish (prazo: ~12/06)

**Objetivo:** Sistema de avaliações e moderação básica.

#### Modelo Prisma adicional:
- [ ] Adicionar `Review` (1:1 com ServiceRequest)
- [ ] Adicionar `Report` com `TargetType` enum e `ReportStatus` enum
- [ ] Migration correspondente

#### US-014 — Avaliar prestador
- [ ] Após pedido COMPLETED, mostrar botão "Avaliar" no painel do cliente
- [ ] Form: rating 1-5 estrelas + comentário
- [ ] `POST /api/reviews` — verificar que o pedido está COMPLETED e ainda não tem review
- [ ] Recalcular `User.rating` após nova review (média das reviews do prestador)

#### US-015 — Ver avaliações
- [ ] Secção de reviews na página do serviço `/services/[id]`
- [ ] Perfil público `/profile/[userId]` com lista de reviews recebidas
- [ ] Rating médio visível no card do serviço e no header do perfil

#### US-016 — Denunciar serviço/utilizador
- [ ] Botão "Denunciar" na página do serviço e no perfil
- [ ] Modal com motivo da denúncia
- [ ] `POST /api/reports`
- [ ] Feedback de confirmação

#### US-017 — Painel de moderação (Admin)
- [ ] Rota protegida `/admin` — só acessível para `role: ADMIN`
- [ ] Lista de denúncias com estado (PENDING, RESOLVED, DISMISSED)
- [ ] Botões: Desativar serviço, Suspender utilizador, Dispensar denúncia
- [ ] Server Actions correspondentes com verificação de role

#### Polish geral:
- [ ] Toast notifications (sonner ou shadcn/ui Toast)
- [ ] Loading states em todas as Server Actions (useTransition)
- [ ] Tratamento de erros com mensagens user-friendly
- [ ] Responsividade em todas as páginas
- [ ] SEO básico: metadata por página (`generateMetadata`)
- [ ] Seed de dados para demonstração (10 utilizadores, 20 serviços, pedidos e reviews)

---

### Sprint 5 — Testes, Docs Final e Apresentação (prazo: 18/06)

#### Testes Unitários (Vitest) — Tarefa 15:
- [ ] Configurar `vitest.config.ts` com jsdom
- [ ] Testes para Server Actions críticas:
  - `registerUser` — validação de e-mail institucional
  - `createService` — validação Zod
  - `createRequest` — não pode pedir o próprio serviço
  - `acceptRequest` / `rejectRequest` — transições de estado válidas
  - `calculateRating` — cálculo correto da média
- [ ] Testes de componentes React (renderização básica de `ServiceCard`, `Header`)
- [ ] `npm test` a passar no CI

#### Testes de Aceitação (User Stories) — Tarefa 16:
- [ ] Executar cada User Story como teste manual e documentar resultado
- [ ] Formato: `docs/test/acceptance/US-XXX.md` com passos + resultado esperado + resultado real
- [ ] Prioridade: US-001 a US-014 (Must + Should)

#### Documentação Final — Tarefa 17:
- [ ] `docs/scrum/retrospectiva.md` com: resumo por sprint, o que correu bem/mal, contribuições individuais
- [ ] Burndown charts (podem ser gerados a partir dos dados do GitHub)
- [ ] Atualizar `docs/docvisao.md` se houve mudanças de arquitetura
- [ ] Atualizar diagramas UML se o código divergiu
- [ ] `docs/scrum/sprint-backlogs/` com estado final de cada sprint

#### Apresentação Final (18/06):
- [ ] Slides: problema → solução → demo → arquitetura → processo Scrum → lições
- [ ] Demo com dados seed (ambiente local ou deploy)
- [ ] Distribuir partes pelos 7 membros

---

## Estrutura de Ficheiros Alvo

```
ESTG-ESI-SkoolBay/
├── app/
│   ├── layout.tsx                    # Layout global + Header/Footer
│   ├── page.tsx                      # Landing page (US-020)
│   ├── auth/
│   │   ├── login/page.tsx            # US-003
│   │   ├── register/page.tsx         # US-001
│   │   └── verify/route.ts           # US-002
│   ├── services/
│   │   ├── page.tsx                  # US-007 — listagem
│   │   └── [id]/page.tsx             # US-008 — detalhe
│   ├── profile/
│   │   └── [userId]/page.tsx         # US-004 — perfil público
│   ├── dashboard/
│   │   ├── page.tsx                  # US-013 — dashboard
│   │   ├── profile/page.tsx          # US-004 — editar perfil
│   │   ├── services/
│   │   │   ├── new/page.tsx          # US-005
│   │   │   └── [id]/edit/page.tsx    # US-006
│   │   ├── requests/page.tsx         # US-011 — painel prestador
│   │   └── my-requests/page.tsx      # US-012 — painel cliente
│   ├── admin/
│   │   └── page.tsx                  # US-017 — moderação
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── services/route.ts
│       ├── requests/route.ts
│       ├── reviews/route.ts
│       └── reports/route.ts
├── components/
│   ├── ui/                           # shadcn/ui components
│   ├── ServiceCard.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── RequestModal.tsx
├── lib/
│   ├── auth.ts                       # NextAuth config
│   ├── prisma.ts                     # Prisma client singleton
│   ├── validations/
│   │   ├── auth.ts                   # Zod schemas — auth
│   │   ├── service.ts                # Zod schemas — serviços
│   │   └── request.ts                # Zod schemas — pedidos
│   └── actions/
│       ├── auth.ts                   # Server Actions — auth
│       ├── services.ts               # Server Actions — serviços
│       ├── requests.ts               # Server Actions — pedidos
│       └── reviews.ts                # Server Actions — reviews
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── __tests__/
│   ├── unit/
│   │   ├── actions/
│   │   └── components/
│   └── acceptance/
│       └── US-XXX.md
├── docs/
│   ├── docvisao.md                   ✅
│   ├── uml/
│   │   ├── casos-de-uso.md           ✅
│   │   ├── diagrama-classes.md       ✅
│   │   ├── diagrama-sequencia.md     ❌ Falta
│   │   ├── diagrama-componentes.md   ❌ Falta
│   │   └── diagrama-estados.md       ❌ Falta (está no diagrama-classes.md, separar)
│   ├── ux/
│   │   └── mockups/                  ❌ Falta (prazo 15/05)
│   ├── scrum/
│   │   ├── product-backlog.md        ✅
│   │   ├── sprint-backlogs/          ❌ Falta
│   │   └── retrospectiva.md          ❌ Falta
│   └── test/
│       └── acceptance/               ❌ Falta
├── .github/
│   └── workflows/ci.yml              ❌ Falta
├── docker-compose.yml                ❌ Falta
├── .env.local                        ❌ Falta (não commitar!)
├── .env.example                      ❌ Falta
├── middleware.ts                     ❌ Falta
└── README.md                         ✅
```

---

## Próxima Ação Imediata

**Prazo urgente: Etapa 3 — 24/04 (2 dias)**

O `docs/docvisao.md` já existe mas confirmar se está commitado e no formato certo com as 8 secções do professor:
- (a) Objetivo, (b) Escopo, (c) Stakeholders, (d) Equipa, (e) Funcionalidades, (f) Arquitetura, (g) Restrições, (h) Integração LLM

Depois do 24/04, o foco passa para **Etapa 4 (15/05)**:
1. Mockups UX — `docs/ux/mockups/` — obrigatório apresentar em aula
2. Diagramas UML em falta (sequência, componentes)
3. Arrancar implementação (Sprint 1 — executar `setup-sprint1.sh`)

---

## Variáveis de Ambiente Necessárias (.env.local)

```env
DATABASE_URL="postgresql://skoolbay:password@localhost:5432/skoolbay"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gerar com: openssl rand -base64 32"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="..."
EMAIL_PASS="..."
EMAIL_FROM="noreply@skoolbay.local"
```

---

## Regras de Desenvolvimento

- Nunca commitar em `main` diretamente — branch protection ativa
- Workflow: `git checkout -b feat/US-XXX` → commit → push → PR → merge
- Commits em português ou inglês, formato: `feat:`, `fix:`, `docs:`, `test:`
- Cada PR deve referenciar a issue correspondente com "Fecha #X"
- Definition of Done: código funcional + sem erros TypeScript + testes passam + PR revisto

---

*Gerado automaticamente com base no Project Knowledge do SkoolBay em 22/04/2026.*
