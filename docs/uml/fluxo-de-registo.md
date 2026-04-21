# Diagrama de Sequência — Fluxo de Registo

> Engenharia de Software I — ESTG-ESI-SkoolBay, 2025/2026

---

## Intervenientes

| Componente | Descrição |
|------------|-----------|
| **Estudante** | Utilizador que pretende criar uma conta na plataforma. |
| **Frontend** | Interface de utilizador que realiza validações com **Zod**. |
| **Backend** | API que processa a lógica de negócio e segurança (**Bcrypt**). |
| **Base de Dados** | Sistema de persistência gerido através do **Prisma ORM**. |
| **Email Service** | Serviço responsável pelo envio do token de verificação. |

---

## Diagrama

```mermaid
sequenceDiagram
    autonumber
    actor E as Estudante
    participant F as Frontend
    participant B as Backend
    participant DB as Base de Dados
    participant M as Email Service

    Note over E, F: 1. Validação Inicial
    E->>F: Preenche formulário de registo
    F->>F: Validação Zod (Client-side)
    
    alt Erro de Formatação
        F-->>E: Exibe mensagens de erro
    else Sucesso
        F->>B: POST /api/auth/register
    end

    Note over B: 2. Processamento e Segurança
    B->>B: Validação Zod (Server-side)
    
    alt Dados Inválidos ou Email em uso
        B-->>F: Retorna Erro (400/409)
        F-->>E: "Tente novamente"
    else Sucesso
        B->>B: Verificar domínio institucional
        B->>B: Hash password (Bcrypt)
        
        Note over B, DB: 3. Persistência e Notificação
        B->>DB: Criar Utilizador (Status: PENDING)
        B->>M: Enviar link com Token único
        M-->>E: Recebe email de verificação
    end

    Note over E, B: 4. Ativação da Conta
    E->>B: Clica no link de ativação
    
    alt Token Inválido ou Expirado
        B-->>E: Exibe página de erro
    else Token Válido
        B->>DB: Atualizar status para ACTIVE
        DB-->>B: Confirmação de sucesso
        B-->>E: Redireciona para Login
    end