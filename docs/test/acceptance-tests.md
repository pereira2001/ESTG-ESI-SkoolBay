# Testes de Aceitação — SkoolBay

> Formato por caso: **Pré-condição | Passos | Resultado esperado | Estado**
>
> Estados possíveis: ✅ Pass · ❌ Fail · ⏳ Pending

---

## US-001 — Registo de utilizador

### AT-001-01 — Registo com e-mail institucional válido

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador não autenticado; e-mail `novo@estudantes.piaget.pt` não registado |
| **Passos** | 1. Aceder a `/register` · 2. Preencher nome, e-mail `novo@estudantes.piaget.pt`, password `Segura123`, universidade e curso · 3. Submeter formulário |
| **Resultado esperado** | Conta criada; redireciona para página de confirmação; e-mail de verificação enviado |
| **Estado** | ✅ Pass |

### AT-001-02 — Registo com e-mail não institucional

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador não autenticado |
| **Passos** | 1. Aceder a `/register` · 2. Preencher e-mail `utilizador@gmail.com` · 3. Submeter formulário |
| **Resultado esperado** | Formulário rejeitado; mensagem "É necessário um e-mail institucional universitário" |
| **Estado** | ✅ Pass |

### AT-001-03 — Registo com password fraca

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador não autenticado |
| **Passos** | 1. Aceder a `/register` · 2. Preencher e-mail válido e password `abc` · 3. Submeter |
| **Resultado esperado** | Formulário rejeitado; mensagem sobre comprimento mínimo (8 chars) e requisitos de maiúscula/número |
| **Estado** | ✅ Pass |

### AT-001-04 — Registo com e-mail já existente

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Conta `existente@estudantes.piaget.pt` já registada |
| **Passos** | 1. Aceder a `/register` · 2. Preencher e-mail `existente@estudantes.piaget.pt` com dados válidos · 3. Submeter |
| **Resultado esperado** | Erro 409; mensagem "E-mail já registado" |
| **Estado** | ✅ Pass |

---

## US-002 — Login

### AT-002-01 — Login com credenciais corretas

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Conta `joao@estudantes.piaget.pt` registada e e-mail verificado |
| **Passos** | 1. Aceder a `/login` · 2. Inserir e-mail e password corretos · 3. Submeter |
| **Resultado esperado** | Sessão criada; redireciona para `/dashboard` |
| **Estado** | ✅ Pass |

### AT-002-02 — Login com password incorreta

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Conta existe e está verificada |
| **Passos** | 1. Aceder a `/login` · 2. Inserir e-mail correto e password errada · 3. Submeter |
| **Resultado esperado** | Erro de autenticação; mensagem genérica "Credenciais inválidas"; sem indicação de qual campo está errado |
| **Estado** | ✅ Pass |

### AT-002-03 — Login com e-mail não verificado

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Conta registada mas `emailVerified` é `null` |
| **Passos** | 1. Aceder a `/login` · 2. Inserir credenciais corretas · 3. Submeter |
| **Resultado esperado** | Autenticação recusada; mensagem de verificação pendente |
| **Estado** | ✅ Pass |

### AT-002-04 — Login com e-mail não registado

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Nenhuma conta com o e-mail fornecido |
| **Passos** | 1. Aceder a `/login` · 2. Inserir e-mail `fantasma@estudantes.piaget.pt` · 3. Submeter |
| **Resultado esperado** | Autenticação recusada; mensagem genérica (não revelar se o e-mail existe) |
| **Estado** | ✅ Pass |

---

## US-003 — Logout

### AT-003-01 — Logout de sessão ativa

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador autenticado |
| **Passos** | 1. Clicar no avatar no header · 2. Selecionar `Logout` no dropdown |
| **Resultado esperado** | Sessão terminada; redireciona para a homepage; header passa a mostrar botão `Login` |
| **Estado** | ⚠️ A validar |

### AT-003-02 — Cookies de sessão limpos após logout

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador autenticado |
| **Passos** | 1. Fazer logout · 2. Tentar aceder a `/dashboard` |
| **Resultado esperado** | Cookies de sessão removidos; acesso a `/dashboard` redireciona para `/login` |
| **Estado** | ⚠️ A validar |

---

## US-004 — Ver e editar perfil

### AT-004-01 — Ver perfil público de outro utilizador

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Existe utilizador com id conhecido |
| **Passos** | 1. Aceder a `/profile/[id]` de outro utilizador |
| **Resultado esperado** | Página SSR exibe nome, universidade, curso, bio, avatar, rating médio e lista de serviços publicados |
| **Estado** | ⚠️ A validar |

### AT-004-02 — Editar o próprio perfil com dados válidos

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador autenticado a ver o próprio perfil |
| **Passos** | 1. Aceder ao próprio perfil · 2. Editar bio e curso · 3. Guardar |
| **Resultado esperado** | Server Action valida e persiste; mensagem de sucesso; alterações refletidas no perfil |
| **Estado** | ⚠️ A validar |

### AT-004-03 — Campo de e-mail é read-only

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador autenticado em modo edição |
| **Passos** | 1. Abrir formulário de edição de perfil · 2. Tentar alterar o e-mail |
| **Resultado esperado** | Campo e-mail não editável (read-only); não é submetido |
| **Estado** | ⚠️ A validar |

### AT-004-04 — Upload de avatar acima do limite

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador autenticado em modo edição |
| **Passos** | 1. Selecionar avatar > 2MB · 2. Submeter |
| **Resultado esperado** | Upload rejeitado; mensagem sobre tamanho/formato (max 2MB; jpg, png, webp) |
| **Estado** | ⚠️ A validar |

### AT-004-05 — Tentar editar perfil de outro utilizador

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador autenticado (não dono) |
| **Passos** | 1. Aceder ao formulário de edição de um perfil que não é o seu |
| **Resultado esperado** | Edição inacessível; apenas o próprio utilizador pode editar |
| **Estado** | ⚠️ A validar |

---

## US-005 — Criar serviço

### AT-005-01 — Criar serviço autenticado com dados válidos

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador autenticado com e-mail verificado |
| **Passos** | 1. Aceder a `/services/new` · 2. Preencher título (≥ 5 chars), descrição (≥ 20 chars), preço positivo · 3. Submeter |
| **Resultado esperado** | Serviço criado; redireciona para `/services/[id]`; serviço visível na listagem |
| **Estado** | ✅ Pass |

### AT-005-02 — Tentar criar serviço sem autenticação

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador não autenticado |
| **Passos** | 1. Aceder diretamente a `/services/new` |
| **Resultado esperado** | Redireciona para `/login?callbackUrl=/services/new` |
| **Estado** | ✅ Pass |

### AT-005-03 — Criar serviço com título demasiado curto

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador autenticado |
| **Passos** | 1. Aceder a `/services/new` · 2. Preencher título com 3 caracteres · 3. Submeter |
| **Resultado esperado** | Formulário rejeitado; mensagem "Título deve ter pelo menos 5 caracteres" |
| **Estado** | ✅ Pass |

### AT-005-04 — Criar serviço com preço negativo

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador autenticado |
| **Passos** | 1. Aceder a `/services/new` · 2. Inserir preço `-10` · 3. Submeter |
| **Resultado esperado** | Formulário rejeitado; mensagem sobre preço inválido |
| **Estado** | ✅ Pass |

---

## US-006 — Editar serviço

### AT-006-01 — Editar serviço próprio com dados válidos

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador autenticado, dono do serviço |
| **Passos** | 1. Aceder a `/services/[id]/edit` · 2. Alterar título/descrição · 3. Submeter |
| **Resultado esperado** | `PUT /api/services/[id]` valida ownership e dados; redireciona para `/services/[id]` com dados atualizados |
| **Estado** | ⚠️ A validar |

### AT-006-02 — Formulário pré-preenchido

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador autenticado, dono do serviço |
| **Passos** | 1. Aceder a `/services/[id]/edit` |
| **Resultado esperado** | Formulário carrega com os dados atuais do serviço |
| **Estado** | ⚠️ A validar |

### AT-006-03 — Tentar editar serviço de outro utilizador

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador autenticado (não dono) |
| **Passos** | 1. Aceder a `/services/[id]/edit` de serviço alheio · 2. Submeter |
| **Resultado esperado** | Operação rejeitada; mensagem de erro de ownership; alteração não persistida |
| **Estado** | ⚠️ A validar |

### AT-006-04 — Editar com título demasiado curto

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador autenticado, dono do serviço |
| **Passos** | 1. Editar serviço · 2. Definir título com 3 caracteres · 3. Submeter |
| **Resultado esperado** | Validação Zod rejeita; mensagem 'Título deve ter pelo menos 5 caracteres' |
| **Estado** | ⚠️ A validar |

---

## US-007 — Remover serviço

### AT-007-01 — Remover serviço próprio com confirmação

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador autenticado, dono do serviço |
| **Passos** | 1. Na página de detalhe/edição, clicar `Remover` · 2. Confirmar no diálogo |
| **Resultado esperado** | Soft delete (`isActive = false`) via `DELETE /api/services/[id]`; serviço deixa de aparecer na listagem e pesquisa |
| **Estado** | ⚠️ A validar |

### AT-007-02 — Cancelar a confirmação de remoção

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador autenticado, dono do serviço |
| **Passos** | 1. Clicar `Remover` · 2. Cancelar no diálogo |
| **Resultado esperado** | Serviço mantém-se ativo; nenhuma alteração |
| **Estado** | ⚠️ A validar |

### AT-007-03 — Tentar remover serviço de outro utilizador

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador autenticado (não dono) |
| **Passos** | 1. Invocar `DELETE /api/services/[id]` para serviço alheio |
| **Resultado esperado** | Rejeitado por validação de ownership; serviço inalterado |
| **Estado** | ⚠️ A validar |

### AT-007-04 — Pedidos existentes não afetados pela remoção

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Serviço com pedidos PENDING/ACCEPTED |
| **Passos** | 1. Remover o serviço (soft delete) |
| **Resultado esperado** | Pedidos PENDING/ACCEPTED mantêm-se inalterados |
| **Estado** | ⚠️ A validar |

---

## US-008 — Pesquisar e filtrar serviços

### AT-008-01 — Pesquisa por texto

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Existem serviços ativos |
| **Passos** | 1. Aceder a `/services` · 2. Pesquisar por termo presente em título/descrição |
| **Resultado esperado** | Grid mostra apenas serviços correspondentes; URL reflete o termo em query param |
| **Estado** | ⚠️ A validar |

### AT-008-02 — Filtrar por categoria e range de preço

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Existem serviços ativos de várias categorias |
| **Passos** | 1. Selecionar categoria · 2. Definir preço min/max |
| **Resultado esperado** | Resultados filtrados corretamente; URL reflete os filtros |
| **Estado** | ⚠️ A validar |

### AT-008-03 — Ordenar por preço crescente

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Existem serviços ativos com preços distintos |
| **Passos** | 1. Selecionar ordenação 'preço crescente' |
| **Resultado esperado** | Serviços ordenados do menor para o maior preço |
| **Estado** | ⚠️ A validar |

### AT-008-04 — Empty state sem resultados

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Nenhum serviço corresponde aos filtros |
| **Passos** | 1. Aplicar filtros sem correspondência |
| **Resultado esperado** | Empty state apresentado com sugestão de limpar filtros |
| **Estado** | ⚠️ A validar |

### AT-008-05 — Serviços inativos não aparecem

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Existe serviço com `isActive = false` |
| **Passos** | 1. Aceder a `/services` e pesquisar pelo serviço inativo |
| **Resultado esperado** | Serviço inativo não aparece nos resultados |
| **Estado** | ⚠️ A validar |

---

## US-009 — Ver detalhe de serviço

### AT-009-01 — Ver detalhe de serviço ativo

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Existe serviço ativo |
| **Passos** | 1. Aceder a `/services/[id]` |
| **Resultado esperado** | SSR exibe título, descrição, preço, categoria, disponibilidade e card do prestador com link para o perfil |
| **Estado** | ⚠️ A validar |

### AT-009-02 — Botão 'Pedir Serviço' visível a cliente autenticado

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador autenticado, não dono do serviço |
| **Passos** | 1. Aceder ao detalhe de um serviço de outro utilizador |
| **Resultado esperado** | Botão 'Pedir Serviço' visível |
| **Estado** | ⚠️ A validar |

### AT-009-03 — Botão 'Pedir Serviço' oculto para o dono

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador autenticado, dono do serviço |
| **Passos** | 1. Aceder ao detalhe do próprio serviço |
| **Resultado esperado** | Botão 'Pedir Serviço' não é apresentado |
| **Estado** | ⚠️ A validar |

---

## US-010 — Enviar pedido de serviço

### AT-010-01 — Enviar pedido a serviço de outro utilizador

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador A autenticado; serviço publicado pelo Utilizador B |
| **Passos** | 1. Utilizador A acede a `/services/[id]` do serviço de B · 2. Clica "Enviar pedido" · 3. Preenche mensagem (≥ 10 chars) · 4. Confirma |
| **Resultado esperado** | Pedido criado com `status: PENDING`; visível em `/dashboard/my-requests` do A e em `/dashboard/requests` do B |
| **Estado** | ✅ Pass |

### AT-010-02 — Tentar pedir o próprio serviço

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador autenticado; é dono do serviço |
| **Passos** | 1. Aceder a `/services/[id]` de um serviço próprio |
| **Resultado esperado** | Botão "Enviar pedido" não visível; em alternativa, mostra botões de gestão (editar/desativar) |
| **Estado** | ✅ Pass |

### AT-010-03 — Tentar enviar pedido sem autenticação

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador não autenticado |
| **Passos** | 1. Aceder a `/services/[id]` · 2. Clicar "Enviar pedido" |
| **Resultado esperado** | Redireciona para `/login` |
| **Estado** | ✅ Pass |

### AT-010-04 — Enviar pedido com mensagem curta

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador autenticado; serviço de outro utilizador |
| **Passos** | 1. Aceder ao serviço · 2. Preencher mensagem com < 10 caracteres · 3. Submeter |
| **Resultado esperado** | Formulário rejeitado; mensagem "Mensagem deve ter pelo menos 10 caracteres" |
| **Estado** | ✅ Pass |

---

## US-011 — Gerir pedidos recebidos (prestador)

### AT-011-01 — Aceitar pedido pendente

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Prestador autenticado com pedido PENDING |
| **Passos** | 1. Aceder a `/dashboard/requests` · 2. Clicar `Aceitar` num pedido PENDING |
| **Resultado esperado** | Estado transita para ACCEPTED; transição registada com timestamp |
| **Estado** | ⚠️ A validar |

### AT-011-02 — Recusar pedido pendente

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Prestador autenticado com pedido PENDING |
| **Passos** | 1. Em `/dashboard/requests`, clicar `Recusar` |
| **Resultado esperado** | Estado transita para REJECTED |
| **Estado** | ⚠️ A validar |

### AT-011-03 — Concluir pedido aceite

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Prestador autenticado com pedido ACCEPTED |
| **Passos** | 1. Em `/dashboard/requests`, clicar `Concluir` |
| **Resultado esperado** | Estado transita para COMPLETED |
| **Estado** | ⚠️ A validar |

### AT-011-04 — Transição inválida bloqueada

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Prestador autenticado com pedido REJECTED |
| **Passos** | 1. Tentar concluir um pedido REJECTED |
| **Resultado esperado** | Transição rejeitada pela validação da máquina de estados |
| **Estado** | ⚠️ A validar |

### AT-011-05 — Filtrar pedidos por estado

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Prestador com pedidos em vários estados |
| **Passos** | 1. Aplicar filtro por estado (ex: pendente) |
| **Resultado esperado** | Lista mostra apenas pedidos no estado selecionado |
| **Estado** | ⚠️ A validar |

---

## US-012 — Ver pedidos enviados (cliente)

### AT-012-01 — Ver lista de pedidos enviados

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Cliente autenticado com pedidos enviados |
| **Passos** | 1. Aceder a `/dashboard/my-requests` |
| **Resultado esperado** | Lista de pedidos enviados com badge de estado por cor e links para serviço/prestador |
| **Estado** | ⚠️ A validar |

### AT-012-02 — Botão 'Avaliar' em pedido concluído sem review

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Cliente com pedido COMPLETED sem review |
| **Passos** | 1. Aceder a `/dashboard/my-requests` |
| **Resultado esperado** | Botão 'Avaliar' visível no pedido COMPLETED por avaliar |
| **Estado** | ⚠️ A validar |

---

## US-013 — Cancelar pedido (cliente)

### AT-013-01 — Cancelar pedido pendente

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Cliente autenticado com pedido PENDING |
| **Passos** | 1. Em `/dashboard/my-requests`, clicar `Cancelar` · 2. Confirmar |
| **Resultado esperado** | Estado transita para CANCELLED |
| **Estado** | ⚠️ A validar |

### AT-013-02 — Cancelar pedido aceite

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Cliente autenticado com pedido ACCEPTED |
| **Passos** | 1. Clicar `Cancelar` · 2. Confirmar |
| **Resultado esperado** | Estado transita para CANCELLED |
| **Estado** | ⚠️ A validar |

### AT-013-03 — Não permitir cancelar pedido concluído

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Cliente com pedido COMPLETED |
| **Passos** | 1. Verificar ações disponíveis num pedido COMPLETED |
| **Resultado esperado** | Botão 'Cancelar' indisponível; estado não pode transitar para CANCELLED |
| **Estado** | ⚠️ A validar |

---

## US-014 — Avaliar prestador

### AT-014-01 — Avaliar após pedido COMPLETED

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador A tem um pedido no estado `COMPLETED`; ainda sem review |
| **Passos** | 1. Aceder a `/dashboard/my-requests` · 2. Localizar pedido concluído · 3. Clicar "Avaliar prestador" · 4. Selecionar 4 estrelas · 5. Escrever comentário ≥ 10 chars · 6. Submeter |
| **Resultado esperado** | Review criada; toast de sucesso; botão de avaliação substituído por "Avaliação submetida"; rating do prestador atualizado |
| **Estado** | ✅ Pass |

### AT-014-02 — Tentar avaliar pedido não concluído

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador A tem pedido com `status: PENDING` ou `ACCEPTED` |
| **Passos** | 1. Aceder a `/dashboard/my-requests` |
| **Resultado esperado** | Botão "Avaliar prestador" não visível para pedidos que não estejam `COMPLETED` |
| **Estado** | ✅ Pass |

### AT-014-03 — Tentar avaliar o mesmo pedido duas vezes

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Pedido `COMPLETED` com review já existente |
| **Passos** | 1. Enviar `POST /api/reviews` com o mesmo `requestId` |
| **Resultado esperado** | Erro 409; mensagem "Este pedido já foi avaliado" |
| **Estado** | ✅ Pass |

### AT-014-04 — Avaliar com comentário demasiado curto

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador A tem pedido `COMPLETED` sem review |
| **Passos** | 1. Abrir formulário de avaliação · 2. Selecionar 5 estrelas · 3. Escrever comentário "Bom" (3 chars) · 4. Tentar submeter |
| **Resultado esperado** | Formulário rejeitado; toast/mensagem "O comentário deve ter pelo menos 10 caracteres" |
| **Estado** | ✅ Pass |

### AT-014-05 — Avaliar sem selecionar estrelas

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador A tem pedido `COMPLETED` sem review |
| **Passos** | 1. Abrir formulário de avaliação · 2. Escrever comentário válido · 3. Não selecionar estrelas · 4. Tentar submeter |
| **Resultado esperado** | Botão de submissão desativado (`disabled`) enquanto `rating === 0`; toast de erro se submetido via workaround |
| **Estado** | ✅ Pass |

---

## US-015 — Ver avaliações de um prestador

### AT-015-01 — Ver avaliações no perfil do prestador

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Prestador com reviews recebidas |
| **Passos** | 1. Aceder a `/profile/[id]` do prestador |
| **Resultado esperado** | Secção de avaliações lista rating (estrelas), comentário, nome do cliente e data; rating médio no topo |
| **Estado** | ⚠️ A validar |

### AT-015-02 — Ordenação por data

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Prestador com várias reviews |
| **Passos** | 1. Ver a secção de avaliações |
| **Resultado esperado** | Reviews ordenadas da mais recente para a mais antiga |
| **Estado** | ⚠️ A validar |

---

## US-016 — Denunciar serviço ou utilizador

### AT-016-01 — Denunciar serviço com motivo válido

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador autenticado, não dono |
| **Passos** | 1. No detalhe do serviço, clicar `Denunciar` · 2. Escolher tipo · 3. Descrição ≥ 20 chars · 4. Submeter |
| **Resultado esperado** | `POST /api/reports` cria Report com status PENDING; confirmação visual |
| **Estado** | ⚠️ A validar |

### AT-016-02 — Descrição demasiado curta

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador autenticado |
| **Passos** | 1. Abrir modal de denúncia · 2. Descrição com < 20 chars · 3. Submeter |
| **Resultado esperado** | Validação rejeita; mensagem sobre mínimo de caracteres |
| **Estado** | ⚠️ A validar |

### AT-016-03 — Não permitir denunciar o próprio serviço

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador autenticado, dono do serviço |
| **Passos** | 1. Aceder ao próprio serviço |
| **Resultado esperado** | Ação de denúncia indisponível para conteúdo próprio |
| **Estado** | ⚠️ A validar |

---

## US-017 — Moderar conteúdo (admin)

### AT-017-01 — Aceder ao painel de denúncias como admin

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador com role ADMIN |
| **Passos** | 1. Aceder a `/admin/reports` |
| **Resultado esperado** | Lista de denúncias com filtro por estado (PENDING, RESOLVED, DISMISSED) |
| **Estado** | ⚠️ A validar |

### AT-017-02 — Acesso negado a não-admin

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador autenticado com role USER |
| **Passos** | 1. Tentar aceder a `/admin/reports` |
| **Resultado esperado** | Middleware bloqueia o acesso; redirecionado/negado |
| **Estado** | ⚠️ A validar |

### AT-017-03 — Descartar denúncia

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Admin em `/admin/reports` com denúncia PENDING |
| **Passos** | 1. Selecionar denúncia · 2. Ação 'descartar' |
| **Resultado esperado** | Denúncia transita para DISMISSED; ação e autor registados |
| **Estado** | ⚠️ A validar |

### AT-017-04 — Desativar serviço denunciado

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Admin com denúncia sobre serviço |
| **Passos** | 1. Selecionar denúncia de serviço · 2. Ação 'desativar serviço' |
| **Resultado esperado** | Serviço desativado (`isActive = false`); deixa de aparecer na listagem |
| **Estado** | ⚠️ A validar |

---

## US-018 — Dashboard principal

### AT-018-01 — Ver resumo de atividade

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador autenticado |
| **Passos** | 1. Aceder a `/dashboard` |
| **Resultado esperado** | Resumo com nº de serviços publicados, pedidos recebidos/enviados, rating médio e links rápidos |
| **Estado** | ⚠️ A validar |

### AT-018-02 — Últimos pedidos recebidos

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Prestador com pedidos recebidos |
| **Passos** | 1. Aceder a `/dashboard` |
| **Resultado esperado** | São apresentados os 3 pedidos recebidos mais recentes |
| **Estado** | ⚠️ A validar |

---

## US-019 — Navegação e layout base

### AT-019-01 — Header autenticado

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Utilizador autenticado |
| **Passos** | 1. Navegar na aplicação autenticado |
| **Resultado esperado** | Header mostra avatar + nome e dropdown com Dashboard, Perfil e Logout |
| **Estado** | ⚠️ A validar |

### AT-019-02 — Header não autenticado

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Visitante não autenticado |
| **Passos** | 1. Aceder à aplicação sem sessão |
| **Resultado esperado** | Header mostra links de navegação e botão `Login` |
| **Estado** | ⚠️ A validar |

### AT-019-03 — Navegação responsiva em mobile

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Viewport mobile |
| **Passos** | 1. Reduzir a largura para mobile |
| **Resultado esperado** | Navegação colapsa em hamburger menu funcional |
| **Estado** | ⚠️ A validar |

---

## US-020 — Landing page

### AT-020-01 — Hero e CTA visíveis

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Visitante |
| **Passos** | 1. Aceder a `/` |
| **Resultado esperado** | Hero com tagline e CTA ('Registar' / 'Explorar Serviços') apresentados |
| **Estado** | ⚠️ A validar |

### AT-020-02 — Secções de conteúdo

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Visitante |
| **Passos** | 1. Percorrer a homepage |
| **Resultado esperado** | Secção 'Como funciona' (3 passos), serviços em destaque e categorias disponíveis |
| **Estado** | ⚠️ A validar |

### AT-020-03 — Responsividade

| Campo | Detalhe |
|---|---|
| **Pré-condição** | Viewport mobile |
| **Passos** | 1. Aceder à homepage em mobile |
| **Resultado esperado** | Layout adapta-se corretamente ao ecrã |
| **Estado** | ⚠️ A validar |
