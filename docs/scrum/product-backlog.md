# Product Backlog — SkoolBay

> Marketplace de Skills entre Estudantes Universitários  
> Última atualização: 09/04/2026

---

## Legenda de Prioridade (MoSCoW)

| Prioridade | Significado |
|------------|-------------|
| **Must**   | Obrigatório para o MVP funcionar |
| **Should** | Importante, mas o sistema funciona sem isto |
| **Could**  | Desejável se houver tempo |
| **Won't**  | Fora do âmbito atual (roadmap futuro) |

---

## US-001 — Registo com e-mail institucional

**Como** estudante não autenticado,  
**quero** registar-me com o meu e-mail universitário,  
**para** ter acesso à plataforma SkoolBay.

**Prioridade:** Must  
**Sprint:** 1  
**Story Points:** 8  
**Módulo:** auth_module

### Acceptance Criteria

- [ ] Formulário de registo com campos: nome, e-mail, password, universidade, curso
- [ ] Validação de e-mail com domínio institucional (ex: `@estudantes.piaget.pt`, `.edu`)
- [ ] Password armazenada com hash bcrypt (salt 12)
- [ ] Envio de e-mail de verificação com token único (Nodemailer)
- [ ] Conta fica inativa até o utilizador clicar no link de verificação
- [ ] Route Handler `POST /api/auth/register` com validação Zod server-side
- [ ] Validação Zod client-side no formulário (feedback imediato)
- [ ] Mensagens de erro claras: e-mail já registado, domínio inválido, password fraca
- [ ] Password mínimo 8 caracteres com pelo menos 1 número e 1 maiúscula
- [ ] Após verificação bem-sucedida, redirect para página de login com mensagem de sucesso

---

## US-002 — Login na plataforma

**Como** estudante registado,  
**quero** fazer login com o meu e-mail e password,  
**para** aceder às funcionalidades da plataforma.

**Prioridade:** Must  
**Sprint:** 1  
**Story Points:** 3  
**Módulo:** auth_module

### Acceptance Criteria

- [ ] Formulário de login com campos: e-mail, password
- [ ] Validação Zod client-side e server-side
- [ ] Autenticação via NextAuth.js v5 (credentials provider)
- [ ] Sessão JWT com cookie httpOnly e SameSite=Strict
- [ ] Redirect para `/dashboard` após login bem-sucedido
- [ ] Mensagens de erro: credenciais inválidas, e-mail não verificado
- [ ] Link para página de registo
- [ ] Middleware de proteção: rotas protegidas redirecionam para `/login`

---

## US-003 — Logout

**Como** estudante autenticado,  
**quero** terminar sessão na plataforma,  
**para** proteger a minha conta.

**Prioridade:** Must  
**Sprint:** 1  
**Story Points:** 1  
**Módulo:** auth_module

### Acceptance Criteria

- [ ] Botão de logout visível no header (quando autenticado)
- [ ] Sessão JWT invalidada no servidor
- [ ] Redirect para a homepage após logout
- [ ] Cookies de sessão limpos

---

## US-004 — Ver e editar perfil

**Como** estudante autenticado,  
**quero** ver o meu perfil público e poder editá-lo,  
**para** manter as minhas informações atualizadas e atrativas para outros estudantes.

**Prioridade:** Must  
**Sprint:** 1  
**Story Points:** 8  
**Módulo:** user_module

### Acceptance Criteria

- [ ] Página pública `/profile/[id]` com SSR — visível por qualquer utilizador
- [ ] Exibe: nome, universidade, curso, bio, avatar, rating médio, competências/tags
- [ ] Lista de serviços publicados pelo utilizador
- [ ] Formulário de edição acessível apenas ao próprio utilizador
- [ ] Campos editáveis: nome, bio, curso, competências, avatar
- [ ] Upload de avatar com preview (max 2MB, formatos: jpg, png, webp)
- [ ] Server Action para atualização com validação Zod
- [ ] Não é possível editar o e-mail (campo read-only)
- [ ] Mensagem de sucesso após guardar alterações

---

## US-005 — Publicar serviço

**Como** prestador (estudante autenticado),  
**quero** publicar um serviço com título, descrição, categoria e preço,  
**para** que outros estudantes me possam encontrar e contratar.

**Prioridade:** Must  
**Sprint:** 2  
**Story Points:** 5  
**Módulo:** service_module

### Acceptance Criteria

- [ ] Formulário: título, descrição, categoria (select), preço (€), disponibilidade (toggle)
- [ ] Validação Zod: título min 5 chars, descrição min 20 chars, preço > 0
- [ ] Categoria selecionada a partir de lista pré-definida
- [ ] Route Handler `POST /api/services`
- [ ] `userId` extraído da sessão (nunca enviado no body do request)
- [ ] Serviço criado com `isActive = true` por defeito
- [ ] Redirect para a página de detalhe do serviço após criação
- [ ] Utilizador não autenticado é redirecionado para login

---

## US-006 — Editar serviço

**Como** prestador,  
**quero** editar um serviço que publiquei,  
**para** corrigir ou atualizar informações.

**Prioridade:** Must  
**Sprint:** 2  
**Story Points:** 3  
**Módulo:** service_module

### Acceptance Criteria

- [ ] Página `/services/[id]/edit` — acessível apenas ao dono do serviço
- [ ] Formulário pré-preenchido com dados atuais
- [ ] Route Handler `PUT /api/services/[id]` com validação de ownership (`userId` da sessão)
- [ ] Validação Zod idêntica à criação
- [ ] Mensagem de erro se o utilizador não for o dono
- [ ] Redirect para a página de detalhe após edição bem-sucedida

---

## US-007 — Remover serviço

**Como** prestador,  
**quero** remover um serviço que publiquei,  
**para** deixar de receber pedidos para algo que já não ofereço.

**Prioridade:** Must  
**Sprint:** 2  
**Story Points:** 1  
**Módulo:** service_module

### Acceptance Criteria

- [ ] Botão "Remover" na página de detalhe e edição (apenas para o dono)
- [ ] Confirmação obrigatória antes de remover (modal ou dialog)
- [ ] Soft delete: `isActive = false` (não apaga da BD)
- [ ] Route Handler `DELETE /api/services/[id]` com validação de ownership
- [ ] Serviço removido deixa de aparecer na listagem e pesquisa
- [ ] Pedidos existentes (PENDING/ACCEPTED) não são afetados

---

## US-008 — Pesquisar e filtrar serviços

**Como** cliente (estudante autenticado ou não),  
**quero** pesquisar serviços por categoria, preço e avaliação,  
**para** encontrar rapidamente o que preciso.

**Prioridade:** Must  
**Sprint:** 2  
**Story Points:** 8  
**Módulo:** service_module

### Acceptance Criteria

- [ ] Página `/services` com grid de cards
- [ ] Barra de pesquisa por texto (título + descrição)
- [ ] Filtros: categoria, range de preço (min/max), rating mínimo, disponibilidade
- [ ] Ordenação: mais recentes, melhor avaliados, preço crescente, preço decrescente
- [ ] Paginação (10 resultados por página)
- [ ] Loading states durante pesquisa
- [ ] Empty state quando não há resultados (com sugestão de limpar filtros)
- [ ] URL reflete os filtros aplicados (query params) para partilha de links
- [ ] Apenas serviços com `isActive = true` aparecem

---

## US-009 — Ver detalhe de serviço

**Como** cliente,  
**quero** ver a página de detalhe de um serviço,  
**para** avaliar se corresponde ao que preciso antes de pedir.

**Prioridade:** Must  
**Sprint:** 2  
**Story Points:** 5  
**Módulo:** service_module

### Acceptance Criteria

- [ ] Página `/services/[id]` com SSR
- [ ] Exibe: título, descrição completa, preço, categoria, disponibilidade
- [ ] Card do prestador: avatar, nome, universidade, rating médio
- [ ] Link para o perfil do prestador
- [ ] Botão "Pedir Serviço" (visível apenas se autenticado e não é o dono)
- [ ] Lista de avaliações do serviço (se existirem)
- [ ] Meta tags dinâmicas para SEO (og:title, og:description)

---

## US-010 — Enviar pedido de serviço

**Como** cliente,  
**quero** enviar um pedido de serviço com uma mensagem,  
**para** explicar ao prestador o que preciso.

**Prioridade:** Must  
**Sprint:** 3  
**Story Points:** 5  
**Módulo:** request_module

### Acceptance Criteria

- [ ] Botão "Pedir Serviço" na página de detalhe abre modal/formulário
- [ ] Campo de mensagem obrigatório (min 10 chars)
- [ ] Route Handler `POST /api/requests`
- [ ] Validação: utilizador não pode pedir o próprio serviço
- [ ] Validação: serviço tem de estar ativo (`isActive = true`)
- [ ] Status inicial do pedido: `PENDING`
- [ ] Confirmação visual após envio (toast/notificação)
- [ ] Pedido visível no painel do prestador e no painel do cliente

---

## US-011 — Gerir pedidos recebidos (prestador)

**Como** prestador,  
**quero** ver e gerir os pedidos que recebi,  
**para** aceitar, recusar ou concluir serviços.

**Prioridade:** Must  
**Sprint:** 3  
**Story Points:** 8  
**Módulo:** request_module

### Acceptance Criteria

- [ ] Página `/dashboard/requests` com lista de pedidos recebidos
- [ ] Filtro por estado: pendente, aceite, concluído, cancelado, recusado
- [ ] Para pedidos PENDING: botões "Aceitar" e "Recusar"
- [ ] Para pedidos ACCEPTED: botão "Concluir"
- [ ] Server Actions para transições de estado
- [ ] Validação de transições: não pode concluir um pedido recusado, não pode aceitar um cancelado
- [ ] Mensagem do cliente visível em cada pedido
- [ ] Link para o serviço e perfil do cliente
- [ ] Timestamp de cada transição de estado

---

## US-012 — Ver pedidos enviados (cliente)

**Como** cliente,  
**quero** ver o estado dos pedidos que enviei,  
**para** acompanhar o progresso dos meus pedidos.

**Prioridade:** Must  
**Sprint:** 3  
**Story Points:** 5  
**Módulo:** request_module

### Acceptance Criteria

- [ ] Página `/dashboard/my-requests` com lista de pedidos enviados
- [ ] Estado visível de cada pedido (badge com cor por estado)
- [ ] Botão "Cancelar" para pedidos PENDING ou ACCEPTED
- [ ] Link para o serviço e perfil do prestador
- [ ] Para pedidos COMPLETED sem review: botão "Avaliar"

---

## US-013 — Cancelar pedido (cliente)

**Como** cliente,  
**quero** cancelar um pedido que enviei,  
**para** desistir de um serviço que já não preciso.

**Prioridade:** Should  
**Sprint:** 3  
**Story Points:** 2  
**Módulo:** request_module

### Acceptance Criteria

- [ ] Botão "Cancelar" visível em pedidos com estado PENDING ou ACCEPTED
- [ ] Confirmação obrigatória antes de cancelar
- [ ] Server Action altera estado para CANCELLED
- [ ] Não é possível cancelar pedidos COMPLETED, REJECTED ou já CANCELLED

---

## US-014 — Avaliar prestador após serviço

**Como** cliente,  
**quero** deixar uma avaliação (1-5 estrelas + comentário) após um serviço concluído,  
**para** ajudar outros estudantes a escolher prestadores de confiança.

**Prioridade:** Must  
**Sprint:** 4  
**Story Points:** 5  
**Módulo:** review_module

### Acceptance Criteria

- [ ] Formulário de avaliação: rating 1-5 estrelas (componente interativo) + comentário (opcional, max 500 chars)
- [ ] Apenas disponível para pedidos com estado COMPLETED
- [ ] Apenas o cliente (buyer) pode avaliar
- [ ] Uma única review por pedido (ServiceRequest)
- [ ] Route Handler `POST /api/reviews`
- [ ] Cálculo automático do rating médio do prestador (atualizado em User.rating)
- [ ] Review visível na página do serviço e no perfil do prestador
- [ ] Não é possível editar ou remover uma review após submissão

---

## US-015 — Ver avaliações de um prestador

**Como** cliente,  
**quero** ver as avaliações de um prestador,  
**para** decidir se quero contratar os seus serviços.

**Prioridade:** Should  
**Sprint:** 4  
**Story Points:** 2  
**Módulo:** review_module

### Acceptance Criteria

- [ ] Secção de avaliações na página de perfil do prestador
- [ ] Cada review mostra: rating (estrelas), comentário, nome do cliente, data
- [ ] Rating médio calculado e exibido no topo
- [ ] Ordenação por data (mais recentes primeiro)

---

## US-016 — Denunciar serviço ou utilizador

**Como** estudante autenticado,  
**quero** denunciar um serviço ou utilizador inadequado,  
**para** manter a qualidade e segurança da plataforma.

**Prioridade:** Should  
**Sprint:** 4  
**Story Points:** 3  
**Módulo:** service_module

### Acceptance Criteria

- [ ] Botão "Denunciar" em páginas de serviço e perfil
- [ ] Modal com: tipo de denúncia (dropdown), descrição (min 20 chars)
- [ ] Route Handler `POST /api/reports`
- [ ] Modelo Report na BD: reporterId, targetType (SERVICE/USER), targetId, reason, status, createdAt
- [ ] Não é possível denunciar o próprio serviço/perfil
- [ ] Confirmação visual após envio
- [ ] Status inicial: PENDING

---

## US-017 — Moderar conteúdo (admin)

**Como** administrador,  
**quero** ver e atuar sobre denúncias,  
**para** manter a qualidade da plataforma.

**Prioridade:** Should  
**Sprint:** 4  
**Story Points:** 5  
**Módulo:** service_module

### Acceptance Criteria

- [ ] Página `/admin/reports` (protegida por role ADMIN)
- [ ] Lista de denúncias com filtro por estado (PENDING, RESOLVED, DISMISSED)
- [ ] Ações disponíveis: desativar serviço, suspender utilizador, descartar denúncia
- [ ] Campo ROLE adicionado ao modelo User (USER, ADMIN)
- [ ] Middleware que verifica role ADMIN para rotas `/admin/*`
- [ ] Registo de ação tomada e por quem

---

## US-018 — Dashboard principal

**Como** estudante autenticado,  
**quero** ter uma página de dashboard com um resumo da minha atividade,  
**para** aceder rapidamente às funcionalidades que uso mais.

**Prioridade:** Should  
**Sprint:** 3  
**Story Points:** 3  
**Módulo:** user_module

### Acceptance Criteria

- [ ] Página `/dashboard`
- [ ] Resumo: nº serviços publicados, nº pedidos recebidos/enviados, rating médio
- [ ] Links rápidos: criar serviço, ver pedidos, editar perfil
- [ ] Últimos pedidos recebidos (3 mais recentes)
- [ ] Layout responsivo

---

## US-019 — Navegação e layout base

**Como** utilizador (autenticado ou não),  
**quero** uma navegação clara e consistente,  
**para** encontrar facilmente as diferentes secções da plataforma.

**Prioridade:** Must  
**Sprint:** 1  
**Story Points:** 3  
**Módulo:** (transversal)

### Acceptance Criteria

- [ ] Header com: logo SkoolBay, links de navegação (Serviços, Sobre), botão Login/Perfil
- [ ] Quando autenticado: avatar + nome no header, dropdown com Dashboard, Perfil, Logout
- [ ] Navegação responsiva (hamburger menu em mobile)
- [ ] Footer com informações básicas
- [ ] Layout global em `/app/layout.tsx`
- [ ] Componentes shadcn/ui consistentes

---

## US-020 — Landing page

**Como** visitante,  
**quero** ver uma homepage apelativa que explique o que é o SkoolBay,  
**para** decidir se quero registar-me.

**Prioridade:** Could  
**Sprint:** 2  
**Story Points:** 3  
**Módulo:** (transversal)

### Acceptance Criteria

- [ ] Hero section com tagline e CTA (botão "Registar" / "Explorar Serviços")
- [ ] Secção "Como funciona" (3 passos)
- [ ] Serviços em destaque (mais recentes ou melhor avaliados)
- [ ] Categorias disponíveis
- [ ] Responsiva

---

---

## Resumo por Sprint

| Sprint | User Stories | Total Story Points |
|--------|------------|-------------------|
| Sprint 1 | US-001, US-002, US-003, US-004, US-019 | 23 |
| Sprint 2 | US-005, US-006, US-007, US-008, US-009, US-020 | 25 |
| Sprint 3 | US-010, US-011, US-012, US-013, US-018 | 23 |
| Sprint 4 | US-014, US-015, US-016, US-017 | 15 |

---

## Resumo por Prioridade

| Prioridade | User Stories |
|------------|-------------|
| **Must**   | US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-014, US-019 |
| **Should** | US-013, US-015, US-016, US-017, US-018 |
| **Could**  | US-020 |
| **Won't**  | Matching semântico LLM, Geração de descrições LLM, Resumo de avaliações LLM, Chatbot suporte, Moderação inteligente |
