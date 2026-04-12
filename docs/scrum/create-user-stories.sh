#!/usr/bin/env bash
# ============================================================================
# SkoolBay — Criar User Stories como Issues no GitHub
# ============================================================================
# Pré-requisitos:
#   1. GitHub CLI instalado e autenticado (gh auth login)
#   2. Repositório já existente
#
# Uso:
#   chmod +x create-user-stories.sh
#   ./create-user-stories.sh
# ============================================================================

set -euo pipefail

REPO="pereira2001/ESTG-ESI-SkoolBay"

GREEN='\033[0;32m'
NC='\033[0m'
success() { echo -e "${GREEN}[OK]${NC} $1"; }

# ── US-001 ───────────────────────────────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "US-001 — Registo com e-mail institucional" \
  --body "**Como** estudante não autenticado,
**quero** registar-me com o meu e-mail universitário,
**para** ter acesso à plataforma SkoolBay.

**Prioridade:** Must
**Sprint:** 1
**Story Points:** 8
**Módulo:** auth_module" \
  --label "sprint:1,priority:high,points:8,mod:auth,type:feature" \
  --milestone "Sprint 1" > /dev/null 2>&1
success "US-001 — Registo com e-mail institucional"

# ── US-002 ───────────────────────────────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "US-002 — Login na plataforma" \
  --body "**Como** estudante registado,
**quero** fazer login com o meu e-mail e password,
**para** aceder às funcionalidades da plataforma.

**Prioridade:** Must
**Sprint:** 1
**Story Points:** 3
**Módulo:** auth_module" \
  --label "sprint:1,priority:high,points:3,mod:auth,type:feature" \
  --milestone "Sprint 1" > /dev/null 2>&1
success "US-002 — Login na plataforma"

# ── US-003 ───────────────────────────────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "US-003 — Logout" \
  --body "**Como** estudante autenticado,
**quero** terminar sessão na plataforma,
**para** proteger a minha conta.

**Prioridade:** Must
**Sprint:** 1
**Story Points:** 1
**Módulo:** auth_module" \
  --label "sprint:1,priority:high,points:1,mod:auth,type:feature" \
  --milestone "Sprint 1" > /dev/null 2>&1
success "US-003 — Logout"

# ── US-004 ───────────────────────────────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "US-004 — Ver e editar perfil" \
  --body "**Como** estudante autenticado,
**quero** ver o meu perfil público e poder editá-lo,
**para** manter as minhas informações atualizadas e atrativas para outros estudantes.

**Prioridade:** Must
**Sprint:** 1
**Story Points:** 8
**Módulo:** user_module" \
  --label "sprint:1,priority:high,points:8,mod:user,type:feature" \
  --milestone "Sprint 1" > /dev/null 2>&1
success "US-004 — Ver e editar perfil"

# ── US-005 ───────────────────────────────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "US-005 — Publicar serviço" \
  --body "**Como** prestador (estudante autenticado),
**quero** publicar um serviço com título, descrição, categoria e preço,
**para** que outros estudantes me possam encontrar e contratar.

**Prioridade:** Must
**Sprint:** 2
**Story Points:** 5
**Módulo:** service_module" \
  --label "sprint:2,priority:high,points:5,mod:service,type:feature" \
  --milestone "Sprint 2" > /dev/null 2>&1
success "US-005 — Publicar serviço"

# ── US-006 ───────────────────────────────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "US-006 — Editar serviço" \
  --body "**Como** prestador,
**quero** editar um serviço que publiquei,
**para** corrigir ou atualizar informações.

**Prioridade:** Must
**Sprint:** 2
**Story Points:** 3
**Módulo:** service_module" \
  --label "sprint:2,priority:high,points:3,mod:service,type:feature" \
  --milestone "Sprint 2" > /dev/null 2>&1
success "US-006 — Editar serviço"

# ── US-007 ───────────────────────────────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "US-007 — Remover serviço" \
  --body "**Como** prestador,
**quero** remover um serviço que publiquei,
**para** deixar de receber pedidos para algo que já não ofereço.

**Prioridade:** Must
**Sprint:** 2
**Story Points:** 1
**Módulo:** service_module" \
  --label "sprint:2,priority:high,points:1,mod:service,type:feature" \
  --milestone "Sprint 2" > /dev/null 2>&1
success "US-007 — Remover serviço"

# ── US-008 ───────────────────────────────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "US-008 — Pesquisar e filtrar serviços" \
  --body "**Como** cliente (estudante autenticado ou não),
**quero** pesquisar serviços por categoria, preço e avaliação,
**para** encontrar rapidamente o que preciso.

**Prioridade:** Must
**Sprint:** 2
**Story Points:** 8
**Módulo:** service_module" \
  --label "sprint:2,priority:high,points:8,mod:service,type:feature" \
  --milestone "Sprint 2" > /dev/null 2>&1
success "US-008 — Pesquisar e filtrar serviços"

# ── US-009 ───────────────────────────────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "US-009 — Ver detalhe de serviço" \
  --body "**Como** cliente,
**quero** ver a página de detalhe de um serviço,
**para** avaliar se corresponde ao que preciso antes de pedir.

**Prioridade:** Must
**Sprint:** 2
**Story Points:** 5
**Módulo:** service_module" \
  --label "sprint:2,priority:high,points:5,mod:service,type:feature" \
  --milestone "Sprint 2" > /dev/null 2>&1
success "US-009 — Ver detalhe de serviço"

# ── US-010 ───────────────────────────────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "US-010 — Enviar pedido de serviço" \
  --body "**Como** cliente,
**quero** enviar um pedido de serviço com uma mensagem,
**para** explicar ao prestador o que preciso.

**Prioridade:** Must
**Sprint:** 3
**Story Points:** 5
**Módulo:** request_module" \
  --label "sprint:3,priority:high,points:5,mod:request,type:feature" \
  --milestone "Sprint 3" > /dev/null 2>&1
success "US-010 — Enviar pedido de serviço"

# ── US-011 ───────────────────────────────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "US-011 — Gerir pedidos recebidos (prestador)" \
  --body "**Como** prestador,
**quero** ver e gerir os pedidos que recebi,
**para** aceitar, recusar ou concluir serviços.

**Prioridade:** Must
**Sprint:** 3
**Story Points:** 8
**Módulo:** request_module" \
  --label "sprint:3,priority:high,points:8,mod:request,type:feature" \
  --milestone "Sprint 3" > /dev/null 2>&1
success "US-011 — Gerir pedidos recebidos (prestador)"

# ── US-012 ───────────────────────────────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "US-012 — Ver pedidos enviados (cliente)" \
  --body "**Como** cliente,
**quero** ver o estado dos pedidos que enviei,
**para** acompanhar o progresso dos meus pedidos.

**Prioridade:** Must
**Sprint:** 3
**Story Points:** 5
**Módulo:** request_module" \
  --label "sprint:3,priority:high,points:5,mod:request,type:feature" \
  --milestone "Sprint 3" > /dev/null 2>&1
success "US-012 — Ver pedidos enviados (cliente)"

# ── US-013 ───────────────────────────────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "US-013 — Cancelar pedido (cliente)" \
  --body "**Como** cliente,
**quero** cancelar um pedido que enviei,
**para** desistir de um serviço que já não preciso.

**Prioridade:** Should
**Sprint:** 3
**Story Points:** 2
**Módulo:** request_module" \
  --label "sprint:3,priority:medium,points:2,mod:request,type:feature" \
  --milestone "Sprint 3" > /dev/null 2>&1
success "US-013 — Cancelar pedido (cliente)"

# ── US-014 ───────────────────────────────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "US-014 — Avaliar prestador após serviço" \
  --body "**Como** cliente,
**quero** deixar uma avaliação (1-5 estrelas + comentário) após um serviço concluído,
**para** ajudar outros estudantes a escolher prestadores de confiança.

**Prioridade:** Must
**Sprint:** 4
**Story Points:** 5
**Módulo:** review_module" \
  --label "sprint:4,priority:high,points:5,mod:review,type:feature" \
  --milestone "Sprint 4" > /dev/null 2>&1
success "US-014 — Avaliar prestador após serviço"

# ── US-015 ───────────────────────────────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "US-015 — Ver avaliações de um prestador" \
  --body "**Como** cliente,
**quero** ver as avaliações de um prestador,
**para** decidir se quero contratar os seus serviços.

**Prioridade:** Should
**Sprint:** 4
**Story Points:** 2
**Módulo:** review_module" \
  --label "sprint:4,priority:medium,points:2,mod:review,type:feature" \
  --milestone "Sprint 4" > /dev/null 2>&1
success "US-015 — Ver avaliações de um prestador"

# ── US-016 ───────────────────────────────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "US-016 — Denunciar serviço ou utilizador" \
  --body "**Como** estudante autenticado,
**quero** denunciar um serviço ou utilizador inadequado,
**para** manter a qualidade e segurança da plataforma.

**Prioridade:** Should
**Sprint:** 4
**Story Points:** 3
**Módulo:** service_module" \
  --label "sprint:4,priority:medium,points:3,mod:service,type:feature" \
  --milestone "Sprint 4" > /dev/null 2>&1
success "US-016 — Denunciar serviço ou utilizador"

# ── US-017 ───────────────────────────────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "US-017 — Moderar conteúdo (admin)" \
  --body "**Como** administrador,
**quero** ver e atuar sobre denúncias,
**para** manter a qualidade da plataforma.

**Prioridade:** Should
**Sprint:** 4
**Story Points:** 5
**Módulo:** service_module" \
  --label "sprint:4,priority:medium,points:5,mod:service,type:feature" \
  --milestone "Sprint 4" > /dev/null 2>&1
success "US-017 — Moderar conteúdo (admin)"

# ── US-018 ───────────────────────────────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "US-018 — Dashboard principal" \
  --body "**Como** estudante autenticado,
**quero** ter uma página de dashboard com um resumo da minha atividade,
**para** aceder rapidamente às funcionalidades que uso mais.

**Prioridade:** Should
**Sprint:** 3
**Story Points:** 3
**Módulo:** user_module" \
  --label "sprint:3,priority:medium,points:3,mod:user,type:feature" \
  --milestone "Sprint 3" > /dev/null 2>&1
success "US-018 — Dashboard principal"

# ── US-019 ───────────────────────────────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "US-019 — Navegação e layout base" \
  --body "**Como** utilizador (autenticado ou não),
**quero** uma navegação clara e consistente,
**para** encontrar facilmente as diferentes secções da plataforma.

**Prioridade:** Must
**Sprint:** 1
**Story Points:** 3
**Módulo:** (transversal)" \
  --label "sprint:1,priority:high,points:3,type:feature" \
  --milestone "Sprint 1" > /dev/null 2>&1
success "US-019 — Navegação e layout base"

# ── US-020 ───────────────────────────────────────────────────────────────────
gh issue create --repo "$REPO" \
  --title "US-020 — Landing page" \
  --body "**Como** visitante,
**quero** ver uma homepage apelativa que explique o que é o SkoolBay,
**para** decidir se quero registar-me.

**Prioridade:** Could
**Sprint:** 2
**Story Points:** 3
**Módulo:** (transversal)" \
  --label "sprint:2,priority:low,points:3,type:feature" \
  --milestone "Sprint 2" > /dev/null 2>&1
success "US-020 — Landing page"

# ── Resumo ───────────────────────────────────────────────────────────────────
echo ""
echo "============================================================================"
echo -e "${GREEN}20 User Stories criadas como issues no GitHub!${NC}"
echo "============================================================================"
echo ""
echo "Verifica em: https://github.com/${REPO}/issues"
echo ""
echo "Depois de confirmar, fecha o issue #8:"
echo "  gh issue close 8 --repo ${REPO} --reason completed"
echo "============================================================================"
