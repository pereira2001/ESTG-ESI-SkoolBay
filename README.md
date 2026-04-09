# SkoolBay — Marketplace de Skills entre Estudantes

> Plataforma web peer-to-peer onde estudantes universitários podem oferecer e contratar serviços entre si.

[![CI](https://github.com/pereira2001/ESTG-ESI-SkoolBay/actions/workflows/ci.yml/badge.svg)](https://github.com/pereira2001/ESTG-ESI-SkoolBay/actions)

## Descrição

O SkoolBay é uma plataforma académica que permite a estudantes publicar e contratar serviços como explicações, design, tradução, programação, entre outros. A autenticação é feita por e-mail institucional, garantindo que a comunidade é exclusivamente universitária.

Projeto desenvolvido no âmbito da cadeira de **Engenharia de Software I** — Instituto Piaget, 2025/2026.

## Participantes

| Nome | Número de Aluno |
|------|----------------|
| António Rafael Marques Simões | 2022115742 |
| Diogo Filipe Gonçalves Pereira | 2024115723 |
| Jonathan Henriques Ferreira Alves | 2024111122 |
| Kauã Henrique Santos Pina | 2024126856 |
| Leonardo Alexandre Martins Afonso | 2022111829 |
| Marinela Suely João Bettencourt | 2024117541 |
| Miguel Lourenço e Lozano Alves de Almeida Costa | 2024107218 |

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| Backend | Next.js Route Handlers + Server Actions |
| Base de Dados | PostgreSQL 16 + Prisma ORM |
| Autenticação | NextAuth.js v5 + bcrypt |
| Validação | Zod v4 |
| Testes | Vitest |
| CI/CD | GitHub Actions |
| Deploy | Docker + Docker Compose |

## Estrutura do Repositório

```
ESTG-ESI-SkoolBay/
├── app/                  # Next.js App Router (páginas e layouts)
├── components/           # Componentes React reutilizáveis
├── lib/                  # Utilitários, auth, prisma client
├── prisma/               # Schema e migrações
├── docs/
│   ├── docvisao.md       # Documento de Visão
│   ├── uml/              # Diagramas UML (Mermaid)
│   ├── scrum/            # Backlog, sprint backlogs, atas
│   ├── ux/               # Protótipos e mockups
│   └── test/             # Resultados de testes
├── .github/workflows/    # CI/CD pipelines
├── docker-compose.yml
└── README.md
```

## Setup Local

### Pré-requisitos

- Node.js 20+
- Docker + Docker Compose
- Git

### Instalação

```bash
# 1. Clonar o repositório
git clone https://github.com/pereira2001/ESTG-ESI-SkoolBay.git
cd ESTG-ESI-SkoolBay

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com os valores corretos

# 4. Iniciar base de dados com Docker
docker compose up -d db

# 5. Executar migrações
npx prisma migrate dev

# 6. Iniciar o servidor de desenvolvimento
npm run dev
```

A aplicação fica disponível em `http://localhost:3000`.

### Com Docker (stack completa)

```bash
docker compose up
```

## Variáveis de Ambiente

Copiar `.env.example` para `.env` e preencher:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/skoolbay
NEXTAUTH_SECRET=<gerar com: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
```

## Documentação

Toda a documentação do projeto está na pasta [`/docs`](./docs/):

- [Documento de Visão](./docs/docvisao.md)
- [Product Backlog](./docs/scrum/product-backlog.md)
- [Diagramas UML](./docs/uml/)
- [Protótipos UX](./docs/ux/)
