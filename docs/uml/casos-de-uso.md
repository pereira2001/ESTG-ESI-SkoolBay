# Diagrama de Casos de Uso — SkoolBay

> Engenharia de Software I — Instituto Piaget, 2025/2026

---

## Atores

| Ator | Descrição |
|------|-----------|
| Visitante | Utilizador não autenticado — pode pesquisar e ver serviços |
| Estudante | Utilizador autenticado — pode publicar e contratar serviços |
| Prestador | Estudante que publicou pelo menos um serviço |
| Cliente | Estudante que envia pedidos de serviço |
| Administrador | Gestor da plataforma — modera conteúdo |

> Nota: Prestador e Cliente são papéis do Estudante autenticado, não atores separados. Um mesmo utilizador pode desempenhar ambos os papéis.

---

## Diagrama

```mermaid
graph LR
    %% Atores
    Visitante(("👤\nVisitante"))
    Estudante(("👤\nEstudante"))
    Admin(("👤\nAdministrador"))

    %% Casos de uso — Autenticação
    UC1["Registar-se"]
    UC2["Verificar e-mail"]
    UC3["Fazer login"]
    UC4["Fazer logout"]

    %% Casos de uso — Perfil
    UC5["Ver perfil público"]
    UC6["Editar perfil"]

    %% Casos de uso — Serviços
    UC7["Pesquisar serviços"]
    UC8["Ver detalhe de serviço"]
    UC9["Publicar serviço"]
    UC10["Editar serviço"]
    UC11["Remover serviço"]

    %% Casos de uso — Pedidos
    UC12["Enviar pedido de serviço"]
    UC13["Aceitar pedido"]
    UC14["Recusar pedido"]
    UC15["Concluir pedido"]
    UC16["Cancelar pedido"]
    UC17["Ver pedidos enviados"]
    UC18["Ver pedidos recebidos"]

    %% Casos de uso — Avaliações
    UC19["Avaliar prestador"]
    UC20["Ver avaliações"]

    %% Casos de uso — Moderação
    UC21["Denunciar serviço/utilizador"]
    UC22["Ver denúncias"]
    UC23["Desativar serviço"]
    UC24["Suspender utilizador"]

    %% Visitante
    Visitante --> UC1
    Visitante --> UC3
    Visitante --> UC7
    Visitante --> UC8
    Visitante --> UC5

    %% Estudante (autenticado)
    Estudante --> UC4
    Estudante --> UC6
    Estudante --> UC7
    Estudante --> UC8
    Estudante --> UC5
    Estudante --> UC9
    Estudante --> UC10
    Estudante --> UC11
    Estudante --> UC12
    Estudante --> UC13
    Estudante --> UC14
    Estudante --> UC15
    Estudante --> UC16
    Estudante --> UC17
    Estudante --> UC18
    Estudante --> UC19
    Estudante --> UC20
    Estudante --> UC21

    %% UC1 inclui UC2
    UC1 -.->|"«include»"| UC2

    %% Admin
    Admin --> UC22
    Admin --> UC23
    Admin --> UC24
    Admin --> UC3
    Admin --> UC4
```

---

## Descrição dos Casos de Uso Principais

### UC01 — Registar-se
**Ator:** Visitante  
**Pré-condição:** Utilizador não tem conta.  
**Fluxo principal:** Preenche formulário → sistema valida e-mail institucional → envia e-mail de verificação → conta criada inativa.  
**Inclui:** UC02 — Verificar e-mail.

### UC03 — Fazer login
**Ator:** Visitante, Administrador  
**Pré-condição:** Conta verificada e ativa.  
**Fluxo principal:** Insere credenciais → sistema autentica → redireciona para dashboard.

### UC09 — Publicar serviço
**Ator:** Estudante  
**Pré-condição:** Autenticado.  
**Fluxo principal:** Preenche título, descrição, categoria, preço → sistema valida → serviço publicado e visível.

### UC12 — Enviar pedido de serviço
**Ator:** Estudante (como Cliente)  
**Pré-condição:** Autenticado, serviço ativo, não é o dono do serviço.  
**Fluxo principal:** Clica "Pedir Serviço" → escreve mensagem → pedido criado com estado PENDING.

### UC13 — Aceitar pedido / UC14 — Recusar pedido / UC15 — Concluir pedido
**Ator:** Estudante (como Prestador)  
**Pré-condição:** Autenticado, pedido pertence ao seu serviço.  
**Fluxo principal:** Acede ao painel de pedidos → escolhe ação → estado do pedido atualizado.

### UC19 — Avaliar prestador
**Ator:** Estudante (como Cliente)  
**Pré-condição:** Pedido com estado COMPLETED, sem review anterior.  
**Fluxo principal:** Seleciona rating 1-5 estrelas → escreve comentário (opcional) → review submetida → rating médio do prestador atualizado.

### UC22 — Ver denúncias / UC23 — Desativar serviço / UC24 — Suspender utilizador
**Ator:** Administrador  
**Pré-condição:** Autenticado com role ADMIN.  
**Fluxo principal:** Acede ao painel de moderação → analisa denúncia → toma ação.
