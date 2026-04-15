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
