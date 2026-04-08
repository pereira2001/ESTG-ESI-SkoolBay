#!/usr/bin/env bash
# ============================================================================
# SkoolBay — GitHub Project Setup Script
# ============================================================================
# Alinhado com o documento "Projeto Engenharia de Software I" do Prof. Toacy
# e com o plano de estudos da cadeira.
#
# Pré-requisitos:
#   1. GitHub CLI instalado: https://cli.github.com/
#   2. Autenticado: gh auth login
#   3. Permissões: repo, project, read:org
#
# Uso:
#   chmod +x setup-skoolbay-github.sh
#   ./setup-skoolbay-github.sh
#
# O script é idempotente — labels e milestones duplicados são ignorados.
# ============================================================================

set -eo pipefail

# ── Configuração ─────────────────────────────────────────────────────────────
# Altera estes valores antes de correr o script
OWNER="pereira2001"   # ← username GitHub ou nome da organização
REPO_NAME="ESTG-ESI-SkoolBay"
REPO_DESC="SkoolBay — Marketplace de Skills entre Estudantes Universitários (Projeto ESI - Piaget)"
VISIBILITY="private"             # private ou public

FULL_REPO="${OWNER}/${REPO_NAME}"

# ── Cores para output ────────────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

info()    { echo -e "${CYAN}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[OK]${NC} $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
error()   { echo -e "${RED}[ERRO]${NC} $1"; exit 1; }

# ── Verificações ─────────────────────────────────────────────────────────────
if [[ "$OWNER" == "<TEU-USERNAME-OU-ORG>" ]]; then
  error "Edita o script e altera OWNER para o teu username GitHub ou organização."
fi

if ! command -v gh &> /dev/null; then
  error "GitHub CLI (gh) não está instalado. Instala em: https://cli.github.com/"
fi

if ! gh auth status &> /dev/null 2>&1; then
  error "Não estás autenticado. Corre: gh auth login"
fi

# ── 1. Criar Repositório ────────────────────────────────────────────────────
info "A criar repositório ${FULL_REPO}..."
if gh repo view "$FULL_REPO" &> /dev/null 2>&1; then
  warn "Repositório já existe, a saltar criação."
else
  gh repo create "$FULL_REPO" \
    --"$VISIBILITY" \
    --description "$REPO_DESC" \
    --clone=false
  success "Repositório criado: ${FULL_REPO}"
fi

# ── 2. Labels ────────────────────────────────────────────────────────────────
# Formato: "nome|cor|descrição" — compatível com bash 3.2 (macOS)
info "A criar labels..."

LABELS=(
  # Sprints
  "sprint:0|E6E6FA|Sprint 0 — Setup e Planeamento"
  "sprint:1|C5DEF5|Sprint 1 — Auth e Perfis"
  "sprint:2|BFD4F2|Sprint 2 — Serviços e Pesquisa"
  "sprint:3|A8D8EA|Sprint 3 — Pedidos e Painel"
  "sprint:4|96C8E8|Sprint 4 — Reviews e Moderação"
  "sprint:5|84B8E0|Sprint 5 — Testes e Docs Final"
  # Prioridade
  "priority:high|D73A4A|Prioridade Alta"
  "priority:medium|FBCA04|Prioridade Média"
  "priority:low|0E8A16|Prioridade Baixa"
  # Tipo
  "type:feature|1D76DB|Nova funcionalidade"
  "type:docs|0075CA|Documentação"
  "type:infra|5319E7|Infraestrutura e DevOps"
  "type:bug|D73A4A|Bug"
  "type:test|6F42C1|Testes"
  "type:uml|F9D0C4|Diagrama UML"
  "type:scrum|BFDADC|Artefacto Scrum"
  "type:ux|D4A5A5|UX e Protótipos"
  # Story points
  "points:1|EDEDED|1 Story Point"
  "points:2|D4D4D4|2 Story Points"
  "points:3|BABABA|3 Story Points"
  "points:5|A0A0A0|5 Story Points"
  "points:8|878787|8 Story Points"
  "points:13|6E6E6E|13 Story Points"
  # Módulo
  "mod:auth|FEF2C0|Módulo Auth"
  "mod:user|F7E8B0|Módulo User"
  "mod:service|EFDB8A|Módulo Service"
  "mod:request|E7CE64|Módulo Request"
  "mod:review|DFC13E|Módulo Review"
  # Etapas do professor
  "etapa:0|FF9F1C|Etapa 0 — Grupos (10/04)"
  "etapa:1|FF9F1C|Etapa 1 — Tema (17/04)"
  "etapa:2|FF9F1C|Etapa 2 — Repo e Planning (17/04)"
  "etapa:3|FF9F1C|Etapa 3 — Doc Visão (24/04)"
  "etapa:4|FF9F1C|Etapa 4 — Modelos Iniciais (15/05)"
  "etapa:5|FF9F1C|Etapa 5 — Modelos Adicionais (29/05)"
  "etapa:6|FF9F1C|Etapa 6 — Implementação (12/06)"
  "etapa:7|FF9F1C|Etapa 7 — Apresentação Final (18/06)"
)

for entry in "${LABELS[@]}"; do
  IFS='|' read -r label color desc <<< "$entry"
  gh label create "$label" \
    --repo "$FULL_REPO" \
    --color "$color" \
    --description "$desc" \
    --force 2>/dev/null || true
done
success "Labels criadas."

# ── 3. Milestones ────────────────────────────────────────────────────────────
info "A criar milestones..."

create_milestone() {
  local title="$1"
  local desc="$2"
  local due="$3"

  if gh api "repos/${FULL_REPO}/milestones" --jq ".[].title" 2>/dev/null | grep -qx "$title"; then
    warn "Milestone '${title}' já existe, a saltar."
    return
  fi

  gh api "repos/${FULL_REPO}/milestones" \
    --method POST \
    -f title="$title" \
    -f description="$desc" \
    -f due_on="${due}T23:59:59Z" \
    -f state="open" > /dev/null 2>&1

  success "Milestone criada: ${title}"
}

# Datas alinhadas com as etapas do professor
create_milestone "Sprint 0" "Setup, requisitos, doc visão, UML inicial, backlog — Etapas 0-3" "2026-04-24"
create_milestone "Sprint 1" "Auth (NextAuth.js), perfis, estrutura BD — Etapa 4 (parcial)" "2026-05-08"
create_milestone "Sprint 2" "CRUD serviços, pesquisa, filtros — Etapa 4 (conclusão)" "2026-05-18"
create_milestone "Sprint 3" "Pedidos, painel prestador, modelos adicionais — Etapa 5" "2026-06-01"
create_milestone "Sprint 4" "Reviews, moderação, polish UI — Etapa 6 (parcial)" "2026-06-12"
create_milestone "Sprint 5" "Testes, retrospectiva, relatório final, apresentação — Etapas 6-7" "2026-06-18"

# ── 4. Helper: criar issue ───────────────────────────────────────────────────
create_issue() {
  local title="$1"
  local body="$2"
  local labels="$3"
  local milestone="$4"

  gh issue create \
    --repo "$FULL_REPO" \
    --title "$title" \
    --body "$body" \
    --label "$labels" \
    --milestone "$milestone" > /dev/null 2>&1

  success "Issue: ${title}"
}

# ============================================================================
# SPRINT 0 — Setup e Planeamento (Etapas 0, 1, 2, 3)
# ============================================================================
info "A criar issues do Sprint 0..."

# ── Tarefas 1-3 do professor: Repo + Project + Participantes ──
create_issue \
  "[S0] Criar repositório GitHub ESTG-ESI-SkoolBay" \
  "## Requisito do Professor (Tarefas 1-3)
Criar repositório no GitHub com o nome **ESTG-ESI-SkoolBay**.
Criar Projeto no GitHub com o mesmo nome.
Adicionar todos os participantes como collaborators.

## Acceptance Criteria
- [ ] Repo criado: \`ESTG-ESI-SkoolBay\`
- [ ] GitHub Project criado: \`ESTG-ESI-SkoolBay\`
- [ ] 7 participantes adicionados como collaborators
- [ ] Branch protection na \`main\` (require PR review)

## Entrega
Responder tarefa no InfoEstudante com URL do repositório. **Prazo: 17/04**

## Story Points: 1" \
  "sprint:0,type:infra,priority:high,points:1,etapa:2" \
  "Sprint 0"

# ── Tarefa 4 do professor: README.md ──
create_issue \
  "[S0] Criar README.md com descrição e lista de participantes" \
  "## Requisito do Professor (Tarefa 4)
Criar README.md com uma breve descrição do projeto e a lista de participantes.

## Conteúdo do README
- Nome do projeto: SkoolBay
- Descrição: Marketplace de skills/serviços entre estudantes universitários
- Lista de participantes (nome + número de aluno + GitHub username)
- Instruções de setup local
- Stack tecnológica
- Estrutura do repositório

## Acceptance Criteria
- [ ] README.md na raiz do repo
- [ ] Descrição do projeto clara
- [ ] Lista completa dos 7 participantes
- [ ] Instruções de como correr o projeto localmente
- [ ] Formatado em Markdown

## Story Points: 1" \
  "sprint:0,type:docs,priority:high,points:1,etapa:2" \
  "Sprint 0"

# ── Tarefas 5-7 do professor: Documento de Visão ──
create_issue \
  "[S0] Criar Documento de Visão (docs/docvisao.md)" \
  "## Requisito do Professor (Tarefas 5-7)
Criar pasta \`docs/\` no repositório e ficheiro \`docs/docvisao.md\` com a estrutura definida pelo professor.

## Estrutura obrigatória do docvisao.md
### (a) Objetivo
O que o sistema fará? — Marketplace de serviços entre estudantes universitários.

### (b) Escopo
Indicativo de onde pode ser usado — Universidades e institutos politécnicos.

### (c) Partes interessadas (stakeholders)
- Estudantes universitários (prestadores e clientes de serviços)
- Administradores da plataforma
- Instituições de ensino superior

### (d) Equipe do projeto
Lista dos 7 membros com papel no grupo (ex: Scrum Master, Dev, QA, etc.)

### (e) Características do sistema
Lista completa de funcionalidades (MVP + secundárias):
- Autenticação por email institucional
- Perfis de utilizador
- Publicação e pesquisa de serviços
- Sistema de pedidos e avaliações
- Painel de prestador e moderação

### (f) Arquitetura de Referência
Desenho/diagrama indicando componentes:
- Frontend (Next.js 14)
- Backend (Route Handlers + Server Actions)
- BD (PostgreSQL 16 + Prisma)
- Auth (NextAuth.js v5)
- (Futuro) Recommendation Service (LLM)

### (g) Restrições do produto
- Requer email institucional para registo
- Funciona apenas via browser (sem app nativa)
- PostgreSQL como único SGBD suportado
- LLM não implementado no MVP

### (h) Integração LLM (Opcional)
- Matching semântico de serviços por linguagem natural
- Geração automática de descrições de serviços
- Resumo de avaliações
- Módulo isolado \`recommendation_service\` (Ollama local ou API)

## Acceptance Criteria
- [ ] Pasta \`docs/\` criada no repo
- [ ] Ficheiro \`docs/docvisao.md\` com TODAS as 8 secções
- [ ] Formatado em Markdown
- [ ] Diagrama de arquitetura incluído (Mermaid)
- [ ] Revisto pelo grupo

## Entrega
Responder tarefa no InfoEstudante com o documento. **Prazo: 24/04**

## Story Points: 5" \
  "sprint:0,type:docs,priority:high,points:5,etapa:3" \
  "Sprint 0"

# ── Setup técnico ──
create_issue \
  "[S0] Setup projeto Next.js + TypeScript + Tailwind + shadcn/ui" \
  "## Descrição
Inicializar o projeto Next.js 14 com App Router, TypeScript, Tailwind CSS e shadcn/ui.

## Acceptance Criteria
- [ ] \`npx create-next-app@latest\` com App Router + TypeScript
- [ ] Tailwind CSS configurado
- [ ] shadcn/ui inicializado
- [ ] Estrutura de pastas: \`/app\`, \`/components\`, \`/lib\`, \`/prisma\`
- [ ] \`.gitignore\` com \`.env\`, \`node_modules\`, \`.next\`
- [ ] \`.env.example\` com variáveis necessárias

## Story Points: 3" \
  "sprint:0,type:infra,priority:high,points:3" \
  "Sprint 0"

create_issue \
  "[S0] Configurar Prisma ORM + PostgreSQL" \
  "## Descrição
Setup do Prisma com PostgreSQL 16. Schema inicial com todas as entidades do domínio.

## Acceptance Criteria
- [ ] \`prisma init\` com provider postgresql
- [ ] Schema com modelos: User, Service, ServiceRequest, Review, Category
- [ ] Relações definidas (FK, 1:N)
- [ ] \`prisma migrate dev\` funcional
- [ ] Seed script básico com dados de teste
- [ ] \`DATABASE_URL\` no \`.env.example\`

## Story Points: 5" \
  "sprint:0,type:infra,priority:high,points:5" \
  "Sprint 0"

create_issue \
  "[S0] Configurar Docker + Docker Compose" \
  "## Descrição
Dockerfile e docker-compose.yml para desenvolvimento local (app + PostgreSQL).

## Acceptance Criteria
- [ ] \`Dockerfile\` multi-stage (dev + prod)
- [ ] \`docker-compose.yml\` com serviços: app, db (postgres:16)
- [ ] Volume para persistência da BD
- [ ] \`docker compose up\` funcional com hot reload

## Story Points: 3" \
  "sprint:0,type:infra,priority:high,points:3" \
  "Sprint 0"

create_issue \
  "[S0] Configurar GitHub Actions (CI/CD)" \
  "## Descrição
Pipeline básico: lint, type-check e build em cada PR.

## Acceptance Criteria
- [ ] Workflow \`.github/workflows/ci.yml\`
- [ ] Steps: install → lint → type-check → build
- [ ] Corre em push para \`main\` e em PRs
- [ ] Badge de status no README

## Story Points: 2" \
  "sprint:0,type:infra,priority:medium,points:2" \
  "Sprint 0"

# ── Tarefa 8 do professor: User Stories ──
create_issue \
  "[S0] Criar User Stories completas" \
  "## Requisito do Professor (Tarefa 8)
Criar user stories para todas as funcionalidades do sistema.

## User Stories (mínimo)
- Como estudante, quero registar-me com o meu e-mail universitário para ter acesso à plataforma.
- Como estudante, quero editar o meu perfil para manter as minhas informações atualizadas.
- Como prestador, quero publicar um serviço com título, descrição e preço para que outros me possam contratar.
- Como prestador, quero gerir os pedidos que recebi para aceitar/recusar/concluir.
- Como cliente, quero pesquisar serviços por categoria para encontrar o que preciso rapidamente.
- Como cliente, quero enviar um pedido de serviço com uma mensagem para explicar o que preciso.
- Como cliente, quero deixar uma avaliação após o serviço para ajudar outros estudantes a escolher.
- Como admin, quero poder remover serviços denunciados para manter a qualidade da plataforma.

## Acceptance Criteria
- [ ] Todas as stories no formato 'Como [ator], quero [ação] para [benefício]'
- [ ] Cada story com acceptance criteria detalhados
- [ ] Story points estimados
- [ ] Prioridade atribuída (MoSCoW)
- [ ] Registadas como issues no GitHub e no \`docs/scrum/product-backlog.md\`

## Entrega (parte da Etapa 4): Prazo 15/05

## Story Points: 5" \
  "sprint:0,type:scrum,priority:high,points:5,etapa:4" \
  "Sprint 0"

# ── Tarefa 9 do professor: Protótipos UX ──
create_issue \
  "[S0] Criar Protótipos de UX (Mockups)" \
  "## Requisito do Professor (Tarefa 9)
Criar protótipos de UX para os ecrãs principais do sistema.

## Ecrãs a prototipar
- Landing page / Homepage
- Página de registo e login
- Perfil de utilizador
- Página de criação de serviço
- Listagem de serviços (com filtros)
- Página de detalhe de serviço
- Dashboard do prestador (pedidos recebidos)
- Dashboard do cliente (pedidos enviados)
- Formulário de avaliação

## Acceptance Criteria
- [ ] Mockups para todos os ecrãs acima
- [ ] Ferramenta: Figma, draw.io, Excalidraw ou similar
- [ ] Exportados como imagens no \`/docs/ux/\`
- [ ] Fluxo de navegação entre ecrãs documentado
- [ ] Mobile e desktop (pelo menos homepage e listagem)

## Entrega (parte da Etapa 4): Prazo 15/05

## Story Points: 8" \
  "sprint:0,type:ux,priority:high,points:8,etapa:4" \
  "Sprint 0"

# ── Tarefa 12 do professor: Diagrama de Casos de Uso ──
create_issue \
  "[S0] Diagrama de Casos de Uso" \
  "## Requisito do Professor (Tarefa 12)
Diagrama UML de casos de uso com todos os atores e funcionalidades.

## Atores
- Estudante não autenticado
- Prestador (estudante que oferece serviços)
- Cliente (estudante que contrata)
- Administrador

## Casos de Uso
- Registar-se, Login, Logout
- Publicar/Editar/Remover serviço
- Pesquisar serviços, Filtrar resultados
- Enviar pedido de serviço
- Aceitar/Recusar/Concluir pedido
- Avaliar prestador
- Denunciar serviço/utilizador
- Moderar conteúdo (Admin)

## Acceptance Criteria
- [ ] Diagrama completo em Mermaid, PlantUML ou draw.io
- [ ] Exportado no \`/docs/uml/\`
- [ ] Ficheiro fonte versionado
- [ ] Todos os diagramas em Markdown (conforme professor exige)

## Story Points: 3" \
  "sprint:0,type:uml,priority:high,points:3,etapa:4" \
  "Sprint 0"

# ── Tarefa 13 do professor: Diagrama de Classes ──
create_issue \
  "[S0] Diagrama de Classes" \
  "## Requisito do Professor (Tarefa 13)
Diagrama de classes UML com entidades, atributos, métodos e relações.

## Entidades
- User (id, name, email, university, course, bio, avatarUrl, rating, role, createdAt)
- Service (id, title, description, category, price, userId, isActive, createdAt)
- ServiceRequest (id, serviceId, buyerId, message, status, createdAt)
- Review (id, requestId, rating, comment, createdAt)
- Category (id, name, slug, icon)
- Report (id, reporterId, targetType, targetId, reason, status, createdAt)

## Relações
- User 1:N Service
- User 1:N ServiceRequest (como buyer)
- Service 1:N ServiceRequest
- ServiceRequest 1:1 Review
- Category 1:N Service

## Acceptance Criteria
- [ ] Diagrama com atributos, tipos e cardinalidade
- [ ] Mermaid ou PlantUML (Markdown)
- [ ] Exportado no \`/docs/uml/\`

## Story Points: 3" \
  "sprint:0,type:uml,priority:high,points:3,etapa:4" \
  "Sprint 0"

create_issue \
  "[S0] Diagrama de Componentes" \
  "## Descrição
Diagrama de componentes mostrando a arquitetura (alinha com secção (f) do doc visão).

## Componentes
- Frontend (Next.js App Router)
- Backend (Route Handlers + Server Actions)
- Auth (NextAuth.js v5)
- Database (PostgreSQL 16 via Prisma)
- Email (Nodemailer)
- (Futuro) Recommendation Service (LLM / Ollama)

## Acceptance Criteria
- [ ] Diagrama com interfaces entre componentes
- [ ] Módulo LLM marcado como futuro/isolado
- [ ] Mermaid ou PlantUML
- [ ] Exportado no \`/docs/uml/\`

## Story Points: 2" \
  "sprint:0,type:uml,priority:medium,points:2" \
  "Sprint 0"

create_issue \
  "[S0] Diagrama de Estados — ServiceRequest" \
  "## Descrição
Diagrama de estados para o ciclo de vida de um ServiceRequest.

## Estados e Transições
- PENDING → ACCEPTED (prestador aceita)
- PENDING → REJECTED (prestador recusa)
- PENDING → CANCELLED (cliente cancela)
- ACCEPTED → COMPLETED (prestador conclui)
- ACCEPTED → CANCELLED (cliente cancela)

## Acceptance Criteria
- [ ] Todos os estados e transições
- [ ] Guards/condições nas transições
- [ ] Mermaid ou PlantUML
- [ ] Exportado no \`/docs/uml/\`

## Story Points: 2" \
  "sprint:0,type:uml,priority:medium,points:2" \
  "Sprint 0"

create_issue \
  "[S0] Product Backlog e Definition of Done" \
  "## Descrição
Compilar Product Backlog completo e definir critérios de Done.

## Acceptance Criteria
- [ ] \`docs/scrum/product-backlog.md\` com todas as user stories priorizadas
- [ ] Story points estimados por planning poker
- [ ] \`docs/scrum/definition-of-done.md\` com critérios claros
- [ ] Aprovado por todo o grupo

## Story Points: 3" \
  "sprint:0,type:scrum,priority:high,points:3" \
  "Sprint 0"

# ============================================================================
# SPRINT 1 — Auth e Perfis
# ============================================================================
info "A criar issues do Sprint 1..."

create_issue \
  "[S1] Configurar NextAuth.js v5 com credentials provider" \
  "## User Story
Como estudante, quero registar-me e fazer login com o meu e-mail para aceder à plataforma.

## Acceptance Criteria
- [ ] NextAuth.js v5 configurado no App Router
- [ ] Provider de credentials com email + password
- [ ] Sessões JWT com httpOnly cookies, SameSite=Strict
- [ ] Middleware de proteção de rotas
- [ ] \`NEXTAUTH_SECRET\` em variáveis de ambiente

## Story Points: 5" \
  "sprint:1,type:feature,priority:high,points:5,mod:auth" \
  "Sprint 1"

create_issue \
  "[S1] Registo com validação de e-mail institucional" \
  "## User Story
Como estudante, quero registar-me com o meu e-mail universitário para ter acesso à plataforma.

## Acceptance Criteria
- [ ] Formulário: name, email, password, university, course
- [ ] Validação Zod: email com domínio institucional
- [ ] Password hash com bcrypt (salt 12)
- [ ] Email de verificação com token (Nodemailer)
- [ ] Conta inativa até verificação
- [ ] Route Handler \`POST /api/auth/register\`

## Story Points: 8" \
  "sprint:1,type:feature,priority:high,points:8,mod:auth" \
  "Sprint 1"

create_issue \
  "[S1] Página de Login" \
  "## Acceptance Criteria
- [ ] Formulário: email + password
- [ ] Validação Zod client + server
- [ ] Redirect após login para /dashboard
- [ ] Mensagens de erro (credenciais inválidas, email não verificado)
- [ ] Link para página de registo

## Story Points: 3" \
  "sprint:1,type:feature,priority:high,points:3,mod:auth" \
  "Sprint 1"

create_issue \
  "[S1] Perfil de utilizador (view + edit)" \
  "## User Story
Como estudante, quero ter um perfil público e poder editá-lo.

## Acceptance Criteria
- [ ] Página \`/profile/[id]\` com SSR
- [ ] Dados: nome, universidade, curso, bio, avatar, rating médio
- [ ] Lista de competências/tags e serviços publicados
- [ ] Formulário de edição (apenas para o próprio)
- [ ] Upload de avatar
- [ ] Server Action para atualização

## Story Points: 8" \
  "sprint:1,type:feature,priority:high,points:8,mod:user" \
  "Sprint 1"

create_issue \
  "[S1] Layout base e navegação" \
  "## Acceptance Criteria
- [ ] Header com logo, navegação, botão login/perfil
- [ ] Navegação responsiva (mobile)
- [ ] Footer básico
- [ ] Layout wrapping \`/app/layout.tsx\`
- [ ] Componentes shadcn/ui

## Story Points: 3" \
  "sprint:1,type:feature,priority:high,points:3" \
  "Sprint 1"

create_issue \
  "[S1] Diagrama de Sequência — Fluxo de Registo" \
  "## Fluxo
1. Estudante preenche formulário → Validação Zod (client)
2. POST /api/auth/register → Validação Zod (server)
3. Verificar email institucional → Hash password (bcrypt)
4. Criar User na BD (Prisma) → Enviar email verificação
5. Estudante clica link → Backend verifica token → Conta ativa

## Acceptance Criteria
- [ ] Cenário sucesso e erro
- [ ] Mermaid no \`/docs/uml/\`

## Story Points: 2" \
  "sprint:1,type:uml,priority:medium,points:2,mod:auth" \
  "Sprint 1"

# ============================================================================
# SPRINT 2 — Serviços e Pesquisa
# ============================================================================
info "A criar issues do Sprint 2..."

create_issue \
  "[S2] CRUD de serviços — criação" \
  "## User Story
Como prestador, quero publicar um serviço com título, descrição e preço.

## Acceptance Criteria
- [ ] Formulário: título, descrição, categoria (select), preço, disponibilidade
- [ ] Validação Zod (título min 5 chars, preço > 0, descrição min 20 chars)
- [ ] Route Handler \`POST /api/services\`
- [ ] \`userId\` extraído da sessão (nunca do body)

## Story Points: 5" \
  "sprint:2,type:feature,priority:high,points:5,mod:service" \
  "Sprint 2"

create_issue \
  "[S2] CRUD de serviços — edição e remoção" \
  "## Acceptance Criteria
- [ ] Página \`/services/[id]/edit\` — apenas o dono
- [ ] \`PUT /api/services/[id]\` — validação ownership
- [ ] \`DELETE /api/services/[id]\` — soft delete (isActive = false)
- [ ] Confirmação antes de remover

## Story Points: 3" \
  "sprint:2,type:feature,priority:high,points:3,mod:service" \
  "Sprint 2"

create_issue \
  "[S2] Página de detalhe de serviço" \
  "## Acceptance Criteria
- [ ] Página \`/services/[id]\` com SSR
- [ ] Título, descrição, preço, categoria, disponibilidade
- [ ] Card do prestador (avatar, nome, rating)
- [ ] Botão 'Pedir Serviço' (autenticado e não é o dono)
- [ ] SEO: meta tags dinâmicas

## Story Points: 5" \
  "sprint:2,type:feature,priority:high,points:5,mod:service" \
  "Sprint 2"

create_issue \
  "[S2] Listagem de serviços com pesquisa e filtros" \
  "## User Story
Como cliente, quero pesquisar serviços por categoria para encontrar o que preciso.

## Acceptance Criteria
- [ ] Página \`/services\` com grid/cards
- [ ] Search bar (título + descrição)
- [ ] Filtros: categoria, range preço, rating mínimo, disponibilidade
- [ ] Ordenação: recentes, melhor avaliados, preço asc/desc
- [ ] Paginação
- [ ] Loading states e empty state

## Story Points: 8" \
  "sprint:2,type:feature,priority:high,points:8,mod:service" \
  "Sprint 2"

create_issue \
  "[S2] Gestão de categorias (seed + UI)" \
  "## Categorias iniciais
Ciências, Tecnologia, Artes, Idiomas, Escrita, Design, Música, Desporto, Outro

## Acceptance Criteria
- [ ] Seed script com categorias
- [ ] Cada categoria: name, slug, icon
- [ ] Componente de seleção nos formulários
- [ ] \`GET /api/categories\`

## Story Points: 3" \
  "sprint:2,type:feature,priority:medium,points:3,mod:service" \
  "Sprint 2"

create_issue \
  "[S2] Diagrama de Sequência — Publicação de Serviço" \
  "## Acceptance Criteria
- [ ] Cenário sucesso e erros (não autenticado, validação falha)
- [ ] Mermaid no \`/docs/uml/\`

## Story Points: 2" \
  "sprint:2,type:uml,priority:medium,points:2,mod:service" \
  "Sprint 2"

# ============================================================================
# SPRINT 3 — Pedidos e Painel (+ Tarefas 10-11: Refinar Stories e UX)
# ============================================================================
info "A criar issues do Sprint 3..."

create_issue \
  "[S3] Enviar pedido de serviço" \
  "## User Story
Como cliente, quero enviar um pedido de serviço com uma mensagem.

## Acceptance Criteria
- [ ] Botão 'Pedir Serviço' na página do serviço
- [ ] Modal/formulário com campo de mensagem
- [ ] \`POST /api/requests\`
- [ ] Validação: não pode pedir o próprio serviço
- [ ] Status inicial: PENDING

## Story Points: 5" \
  "sprint:3,type:feature,priority:high,points:5,mod:request" \
  "Sprint 3"

create_issue \
  "[S3] Painel do prestador — gestão de pedidos" \
  "## User Story
Como prestador, quero ver e gerir os pedidos que recebi.

## Acceptance Criteria
- [ ] Página \`/dashboard/requests\`
- [ ] Filtro por estado (pendente, aceite, concluído, cancelado, recusado)
- [ ] Botões: Aceitar, Recusar (pendentes) / Concluir (aceites)
- [ ] Server Actions para transições de estado
- [ ] Validação de transições (não pode concluir recusado, etc.)

## Story Points: 8" \
  "sprint:3,type:feature,priority:high,points:8,mod:request" \
  "Sprint 3"

create_issue \
  "[S3] Painel do cliente — pedidos enviados" \
  "## Acceptance Criteria
- [ ] Página \`/dashboard/my-requests\`
- [ ] Estado visível de cada pedido
- [ ] Botão Cancelar (pendentes ou aceites)
- [ ] Link para serviço e perfil do prestador

## Story Points: 5" \
  "sprint:3,type:feature,priority:high,points:5,mod:request" \
  "Sprint 3"

create_issue \
  "[S3] Dashboard principal" \
  "## Acceptance Criteria
- [ ] Página \`/dashboard\`
- [ ] Resumo: serviços publicados, pedidos recebidos/enviados, rating
- [ ] Links rápidos
- [ ] Responsive

## Story Points: 3" \
  "sprint:3,type:feature,priority:medium,points:3" \
  "Sprint 3"

# ── Tarefa 10 do professor: Refinar User Stories ──
create_issue \
  "[S3] Refinar User Stories com informações necessárias" \
  "## Requisito do Professor (Tarefa 10)
Refinar todas as user stories com base no progresso da implementação.

## Acceptance Criteria
- [ ] Rever acceptance criteria de cada user story
- [ ] Adicionar detalhes técnicos descobertos durante implementação
- [ ] Atualizar story points se necessário
- [ ] Atualizar \`docs/scrum/product-backlog.md\`
- [ ] Novas stories identificadas durante sprints anteriores

## Entrega (parte da Etapa 5): Prazo 29/05

## Story Points: 3" \
  "sprint:3,type:scrum,priority:high,points:3,etapa:5" \
  "Sprint 3"

# ── Tarefa 11 do professor: Refinar UX ──
create_issue \
  "[S3] Refinar Protótipos UX com informações necessárias" \
  "## Requisito do Professor (Tarefa 11)
Atualizar mockups/protótipos com base no feedback e implementação real.

## Acceptance Criteria
- [ ] Comparar protótipos originais com UI implementada
- [ ] Atualizar mockups que divergiram
- [ ] Documentar decisões de design alteradas e porquê
- [ ] Atualizar \`/docs/ux/\`

## Entrega (parte da Etapa 5): Prazo 29/05

## Story Points: 3" \
  "sprint:3,type:ux,priority:medium,points:3,etapa:5" \
  "Sprint 3"

create_issue \
  "[S3] Diagrama de Sequência — Contratação e Avaliação" \
  "## Fluxo
1. Cliente envia pedido → PENDING
2. Prestador aceita → ACCEPTED
3. Prestador conclui → COMPLETED
4. Cliente avalia → Review criado
5. Rating médio atualizado

## Acceptance Criteria
- [ ] Fluxo completo com alternativas (recusar, cancelar)
- [ ] Mermaid no \`/docs/uml/\`

## Story Points: 2" \
  "sprint:3,type:uml,priority:medium,points:2,mod:request" \
  "Sprint 3"

# ============================================================================
# SPRINT 4 — Reviews e Moderação
# ============================================================================
info "A criar issues do Sprint 4..."

create_issue \
  "[S4] Sistema de avaliações" \
  "## User Story
Como cliente, quero deixar uma avaliação após o serviço.

## Acceptance Criteria
- [ ] Formulário: rating (1-5 estrelas) + comentário
- [ ] Apenas após ServiceRequest COMPLETED
- [ ] Uma review por request
- [ ] \`POST /api/reviews\`
- [ ] Cálculo automático de rating médio
- [ ] Reviews visíveis no perfil e página do serviço

## Story Points: 5" \
  "sprint:4,type:feature,priority:high,points:5,mod:review" \
  "Sprint 4"

create_issue \
  "[S4] Componente de estrelas (rating)" \
  "## Acceptance Criteria
- [ ] Modo input: clicar para selecionar (1-5)
- [ ] Modo display: estrelas parciais
- [ ] Acessível (keyboard, aria labels)

## Story Points: 2" \
  "sprint:4,type:feature,priority:medium,points:2,mod:review" \
  "Sprint 4"

create_issue \
  "[S4] Sistema de denúncia" \
  "## Acceptance Criteria
- [ ] Botão 'Denunciar' em serviços e perfis
- [ ] Modal com motivo + descrição
- [ ] \`POST /api/reports\`
- [ ] Modelo Report na BD

## Story Points: 3" \
  "sprint:4,type:feature,priority:medium,points:3" \
  "Sprint 4"

create_issue \
  "[S4] Painel de moderação (admin)" \
  "## User Story
Como admin, quero poder remover serviços denunciados.

## Acceptance Criteria
- [ ] Página \`/admin/reports\`
- [ ] Filtro por estado
- [ ] Ações: desativar serviço, suspender user, descartar
- [ ] Role ADMIN no modelo User
- [ ] Middleware de proteção

## Story Points: 5" \
  "sprint:4,type:feature,priority:medium,points:5" \
  "Sprint 4"

create_issue \
  "[S4] Polish de UI e responsividade" \
  "## Acceptance Criteria
- [ ] Todas as páginas responsivas
- [ ] Loading states e empty states
- [ ] Toast/notificações
- [ ] Acessibilidade básica (tab, aria)

## Story Points: 5" \
  "sprint:4,type:feature,priority:medium,points:5" \
  "Sprint 4"

# ============================================================================
# SPRINT 5 — Testes, Docs Final, Apresentação (Etapas 6-7)
# ============================================================================
info "A criar issues do Sprint 5..."

# ── Tarefa 15 do professor: Testes Unitários ──
create_issue \
  "[S5] Testes Unitários — auth e user" \
  "## Requisito do Professor (Tarefa 15)

## Acceptance Criteria
- [ ] Vitest configurado
- [ ] Testes para validação de email institucional
- [ ] Testes para hash/verify password
- [ ] Testes para criação de user (schema Zod)
- [ ] Testes para proteção de rotas
- [ ] Coverage report

## Story Points: 5" \
  "sprint:5,type:test,priority:high,points:5,mod:auth,mod:user" \
  "Sprint 5"

create_issue \
  "[S5] Testes Unitários — service e request" \
  "## Requisito do Professor (Tarefa 15)

## Acceptance Criteria
- [ ] Testes para CRUD de serviço
- [ ] Testes para pesquisa e filtros
- [ ] Testes para transições de estado de ServiceRequest
- [ ] Testes para validação de ownership
- [ ] Testes para review (1 por request, rating 1-5)

## Story Points: 5" \
  "sprint:5,type:test,priority:high,points:5,mod:service,mod:request" \
  "Sprint 5"

# ── Tarefa 16 do professor: User Stories como Teste de Aceitação ──
create_issue \
  "[S5] Executar User Stories como Testes de Aceitação" \
  "## Requisito do Professor (Tarefa 16)
Usar as user stories definidas como base para testes de aceitação.

## Acceptance Criteria
- [ ] Cada user story principal testada end-to-end
- [ ] Fluxo de registo e login
- [ ] Fluxo de publicar e pesquisar serviço
- [ ] Fluxo de pedir, aceitar e concluir serviço
- [ ] Fluxo de avaliar prestador
- [ ] Resultados documentados (pass/fail + evidência)
- [ ] Documento \`docs/test/acceptance-tests.md\`

## Story Points: 8" \
  "sprint:5,type:test,priority:high,points:8" \
  "Sprint 5"

# ── Tarefa 17 do professor: Retrospectiva e Relatório Final ──
create_issue \
  "[S5] Documento de Retrospectiva e Relatório Final" \
  "## Requisito do Professor (Tarefa 17)
Criar documento de retrospectiva do projeto e relatório final.

## Conteúdo
- Resumo do projeto e objetivos alcançados
- Retrospectiva por sprint: o que correu bem, o que correu mal, melhorias
- Contribuição individual de cada membro
- Burndown charts
- Lições aprendidas
- Problemas encontrados e como foram resolvidos
- Auto-avaliação do grupo

## Acceptance Criteria
- [ ] \`docs/scrum/retrospectiva.md\`
- [ ] Contribuições individuais documentadas
- [ ] Retrospectiva honesta (pontos positivos e negativos)
- [ ] Burndown charts de cada sprint
- [ ] Sprint backlogs com estado final

## Story Points: 5" \
  "sprint:5,type:docs,priority:high,points:5,etapa:7" \
  "Sprint 5"

create_issue \
  "[S5] Documentação final completa" \
  "## Descrição
Compilar e rever toda a documentação para entrega.

## Acceptance Criteria
- [ ] README.md completo e atualizado
- [ ] \`/docs/uml/\` com todos os diagramas atualizados
- [ ] \`/docs/scrum/\` completo (backlog, sprint backlogs, atas, burndown, DoD)
- [ ] \`/docs/ux/\` com protótipos atualizados
- [ ] \`/docs/docvisao.md\` atualizado com mudanças
- [ ] \`/docs/test/\` com resultados de testes
- [ ] Tudo em Markdown (conforme exigido pelo professor)
- [ ] Diagramas em Mermaid (conforme professor sugere)

## Story Points: 5" \
  "sprint:5,type:docs,priority:high,points:5,etapa:7" \
  "Sprint 5"

create_issue \
  "[S5] Preparação da Apresentação Final" \
  "## Requisito do Professor (Etapa 7)
Preparar apresentação final do projeto.

## Acceptance Criteria
- [ ] Slides: problema, solução, demo, arquitetura, processo Scrum, lições
- [ ] Demo funcional com dados seed
- [ ] Partes atribuídas aos 7 membros
- [ ] Ensaio realizado

## Entrega: Apresentação em sala. **Prazo: 18/06**

## Story Points: 5" \
  "sprint:5,type:docs,priority:high,points:5,etapa:7" \
  "Sprint 5"

# ── 5. Criar GitHub Project (Kanban Board) ──────────────────────────────────
info "A criar GitHub Project board..."

PROJECT_URL=$(gh project create \
  --owner "$OWNER" \
  --title "ESTG-ESI-SkoolBay" \
  --format json 2>/dev/null | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4) || true

if [[ -n "$PROJECT_URL" ]]; then
  success "Project board criado: ${PROJECT_URL}"
  echo ""
  info "Para adicionar issues ao board, abre o Project no GitHub e usa 'Add items'."
else
  warn "Não foi possível criar o project board automaticamente."
  warn "Cria manualmente: GitHub → Projects → New Project → Board"
fi

# ── 6. Resumo ────────────────────────────────────────────────────────────────
echo ""
echo "============================================================================"
echo -e "${GREEN}Setup completo!${NC}"
echo "============================================================================"
echo ""
echo "Repositório:  https://github.com/${FULL_REPO}"
echo ""
echo "Mapeamento Tarefas do Professor → Issues:"
echo "  Tarefa 1-3  → [S0] Criar repositório ESTG-ESI-SkoolBay"
echo "  Tarefa 4    → [S0] Criar README.md"
echo "  Tarefa 5-7  → [S0] Documento de Visão (docs/docvisao.md)"
echo "  Tarefa 8    → [S0] User Stories completas"
echo "  Tarefa 9    → [S0] Protótipos UX (Mockups)"
echo "  Tarefa 10   → [S3] Refinar User Stories"
echo "  Tarefa 11   → [S3] Refinar Protótipos UX"
echo "  Tarefa 12   → [S0] Diagrama de Casos de Uso"
echo "  Tarefa 13   → [S0] Diagrama de Classes"
echo "  Tarefa 14   → Sprints 1-4 (implementação)"
echo "  Tarefa 15   → [S5] Testes Unitários"
echo "  Tarefa 16   → [S5] Testes de Aceitação"
echo "  Tarefa 17   → [S5] Retrospectiva e Relatório Final"
echo ""
echo "Checklist de entregas (datas do professor):"
echo "  10/04 — Etapa 0: Formação dos grupos"
echo "  17/04 — Etapa 1: Parágrafo sobre o projeto"
echo "  17/04 — Etapa 2: URL do repositório"
echo "  24/04 — Etapa 3: Documento de Visão"
echo "  15/05 — Etapa 4: Casos de Uso, User Stories, Mockups (apresentação)"
echo "  29/05 — Etapa 5: Modelos e docs atualizados"
echo "  12/06 — Etapa 6: Implementação"
echo "  18/06 — Etapa 7: Apresentação final"
echo ""
echo "Próximos passos:"
echo "  1. Clona o repo:  git clone git@github.com:${FULL_REPO}.git"
echo "  2. Abre o Project board e adiciona as issues ('Add items')"
echo "  3. Atribui os 7 membros às issues do Sprint 0"
echo "  4. Responde à Etapa 0 no InfoEstudante (nomes do grupo)"
echo ""
echo "Dica: Para ver issues de um sprint:"
echo "  gh issue list --repo ${FULL_REPO} --label sprint:0"
echo "============================================================================"
