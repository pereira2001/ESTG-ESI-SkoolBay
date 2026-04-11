#!/usr/bin/env bash
# ============================================================================
# SkoolBay — Sprint 1 Setup
# Next.js 14 + TypeScript + Tailwind + shadcn/ui
# Prisma ORM + PostgreSQL 16
# NextAuth.js v5 + bcrypt
# Docker + Docker Compose
# GitHub Actions CI
# ============================================================================
# Uso:
#   1. Coloca este ficheiro na raiz do repo (ESTG-ESI-SkoolBay/)
#   2. chmod +x setup-sprint1.sh
#   3. ./setup-sprint1.sh
#
# Pré-requisitos: Node.js 20+, npm, git
# ============================================================================

set -euo pipefail

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()    { echo -e "${CYAN}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[OK]${NC} $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }

# ── 0. Corrigir .gitignore (remove a linha *.sh se existir) ─────────────────
info "A verificar .gitignore..."
if grep -q "^\*\.sh$" .gitignore 2>/dev/null; then
  sed -i '' '/^\*\.sh$/d' .gitignore 2>/dev/null || sed -i '/^\*\.sh$/d' .gitignore
  success ".gitignore corrigido (removida regra *.sh)"
fi

# ── 1. create-next-app ───────────────────────────────────────────────────────
# create-next-app não aceita nomes com maiúsculas (restrições npm).
# Solução: criar em pasta temporária com nome lowercase e mover os ficheiros.
info "A criar projeto Next.js 14..."

# Instalar globalmente primeiro para evitar o prompt interativo do npx
npm install -g create-next-app@14 --silent

TMPDIR_NAME="skoolbay-tmp-$$"

CI=1 create-next-app "../$TMPDIR_NAME" \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias="@/*" \
  --no-git \
  --use-npm \
  --yes

# Corrigir o nome no package.json para lowercase antes de mover
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('../$TMPDIR_NAME/package.json', 'utf8'));
pkg.name = 'skoolbay';
fs.writeFileSync('../$TMPDIR_NAME/package.json', JSON.stringify(pkg, null, 2));
"

# Mover tudo para a pasta atual, sem sobrescrever ficheiros já existentes (README, docs/, etc.)
# cp -rn pode retornar exit code 1 no macOS quando há ficheiros a saltar — ignorar esse erro
cp -rn "../$TMPDIR_NAME/." . || true
rm -rf "../$TMPDIR_NAME"

success "Next.js 14 criado"

# ── 2. Instalar dependências ─────────────────────────────────────────────────
info "A instalar dependências..."

npm install --legacy-peer-deps \
  @prisma/client \
  next-auth@beta \
  bcryptjs \
  nodemailer@^7.0.7 \
  zod

npm install -D --legacy-peer-deps \
  prisma \
  @types/bcryptjs \
  @types/nodemailer \
  vitest \
  @vitejs/plugin-react \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jsdom

success "Dependências instaladas"

# ── 3. shadcn/ui ─────────────────────────────────────────────────────────────
info "A inicializar shadcn/ui..."

npx shadcn@latest init \
  --base-color slate \
  --css-variables \
  --yes

# Componentes necessários para Sprint 1
npx shadcn@latest add button input label card form toast avatar badge \
  dropdown-menu navigation-menu separator skeleton --yes

success "shadcn/ui inicializado com componentes base"

# ── 4. Prisma ────────────────────────────────────────────────────────────────
info "A configurar Prisma..."

npx prisma init --datasource-provider postgresql

# Schema completo com todas as entidades do domínio
cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  USER
  ADMIN
}

enum RequestStatus {
  PENDING
  ACCEPTED
  REJECTED
  COMPLETED
  CANCELLED
}

enum ReportStatus {
  PENDING
  RESOLVED
  DISMISSED
}

enum ReportTargetType {
  SERVICE
  USER
}

model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  emailVerified DateTime?
  password      String
  university    String?
  course        String?
  bio           String?
  avatarUrl     String?
  rating        Float     @default(0)
  role          Role      @default(USER)
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Tokens de verificação de email
  verifyToken       String?   @unique
  verifyTokenExpiry DateTime?

  // Relações
  services         Service[]
  requestsAsBuyer  ServiceRequest[] @relation("BuyerRequests")
  reportsCreated   Report[]         @relation("ReporterReports")

  @@map("users")
}

model Category {
  id       String    @id @default(cuid())
  name     String    @unique
  slug     String    @unique
  icon     String?
  services Service[]

  @@map("categories")
}

model Service {
  id           String   @id @default(cuid())
  title        String
  description  String
  price        Float
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relações
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  categoryId String?
  category   Category? @relation(fields: [categoryId], references: [id])
  requests   ServiceRequest[]
  reports    Report[]  @relation("ServiceReports")

  @@map("services")
}

model ServiceRequest {
  id        String        @id @default(cuid())
  message   String
  status    RequestStatus @default(PENDING)
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt

  // Relações
  serviceId String
  service   Service @relation(fields: [serviceId], references: [id], onDelete: Cascade)
  buyerId   String
  buyer     User    @relation("BuyerRequests", fields: [buyerId], references: [id], onDelete: Cascade)
  review    Review?

  @@map("service_requests")
}

model Review {
  id        String   @id @default(cuid())
  rating    Int      // 1-5
  comment   String?
  createdAt DateTime @default(now())

  // Relações
  requestId String         @unique
  request   ServiceRequest @relation(fields: [requestId], references: [id], onDelete: Cascade)

  @@map("reviews")
}

model Report {
  id          String           @id @default(cuid())
  reason      String
  description String
  targetType  ReportTargetType
  targetId    String
  status      ReportStatus     @default(PENDING)
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  // Relações
  reporterId String
  reporter   User     @relation("ReporterReports", fields: [reporterId], references: [id], onDelete: Cascade)
  service    Service? @relation("ServiceReports", fields: [targetId], references: [id], map: "report_service_fk")

  @@map("reports")
}
EOF

success "Schema Prisma criado"

# ── 5. Prisma Client singleton ───────────────────────────────────────────────
mkdir -p lib

cat > lib/prisma.ts << 'EOF'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
EOF

success "Prisma client singleton criado"

# ── 6. NextAuth.js v5 ────────────────────────────────────────────────────────
info "A configurar NextAuth.js v5..."

cat > auth.ts << 'EOF'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            emailVerified: true,
            role: true,
            avatarUrl: true,
          },
        })

        if (!user) return null
        if (!user.emailVerified) return null
        if (!user.isActive) return null

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatarUrl,
          role: user.role,
        }
      },
    }),
  ],
})
EOF

# Middleware de proteção de rotas
cat > middleware.ts << 'EOF'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

const protectedRoutes = ['/dashboard', '/services/new', '/profile/edit']
const adminRoutes = ['/admin']
const authRoutes = ['/login', '/register']

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session

  const isProtected = protectedRoutes.some((r) => nextUrl.pathname.startsWith(r))
  const isAdmin = adminRoutes.some((r) => nextUrl.pathname.startsWith(r))
  const isAuthRoute = authRoutes.some((r) => nextUrl.pathname.startsWith(r))

  if (isAdmin && (!isLoggedIn || (session?.user as any)?.role !== 'ADMIN')) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  if (isProtected && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname)
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl))
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
EOF

# Route handler para NextAuth
mkdir -p app/api/auth/\[...nextauth\]
cat > "app/api/auth/[...nextauth]/route.ts" << 'EOF'
import { handlers } from '@/auth'
export const { GET, POST } = handlers
EOF

success "NextAuth.js v5 configurado"

# ── 7. Zod schemas partilhados ───────────────────────────────────────────────
info "A criar Zod schemas..."

mkdir -p lib/validations

cat > lib/validations/auth.ts << 'EOF'
import { z } from 'zod'

// Domínios institucionais aceites
const INSTITUTIONAL_DOMAINS = [
  'estudantes.piaget.pt',
  'alunos.piaget.pt',
  'piaget.pt',
  'edu',
  'ac.pt',
  'ipleiria.pt',
  'iscte.pt',
  'ulisboa.pt',
  'up.pt',
  'uminho.pt',
  'ua.pt',
  'uc.pt',
]

function isInstitutionalEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase() ?? ''
  return INSTITUTIONAL_DOMAINS.some(
    (d) => domain === d || domain.endsWith(`.${d}`)
  )
}

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z
    .string()
    .email('E-mail inválido')
    .refine(isInstitutionalEmail, 'É necessário um e-mail institucional universitário'),
  password: z
    .string()
    .min(8, 'Password deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'Deve conter pelo menos um número'),
  university: z.string().min(2, 'Universidade obrigatória'),
  course: z.string().min(2, 'Curso obrigatório'),
})

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Password obrigatória'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
EOF

cat > lib/validations/service.ts << 'EOF'
import { z } from 'zod'

export const createServiceSchema = z.object({
  title: z.string().min(5, 'Título deve ter pelo menos 5 caracteres').max(100),
  description: z.string().min(20, 'Descrição deve ter pelo menos 20 caracteres').max(2000),
  price: z.number().positive('Preço deve ser maior que 0'),
  categoryId: z.string().cuid().optional(),
})

export const updateServiceSchema = createServiceSchema.partial()

export type CreateServiceInput = z.infer<typeof createServiceSchema>
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>
EOF

cat > lib/validations/request.ts << 'EOF'
import { z } from 'zod'

export const createRequestSchema = z.object({
  serviceId: z.string().cuid(),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres').max(1000),
})

export type CreateRequestInput = z.infer<typeof createRequestSchema>
EOF

cat > lib/validations/review.ts << 'EOF'
import { z } from 'zod'

export const createReviewSchema = z.object({
  requestId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
})

export type CreateReviewInput = z.infer<typeof createReviewSchema>
EOF

success "Zod schemas criados"

# ── 8. Seed ──────────────────────────────────────────────────────────────────
info "A criar seed script..."

mkdir -p prisma

cat > prisma/seed.ts << 'EOF'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 A correr seed...')

  // Categorias
  const categories = [
    { name: 'Ciências', slug: 'ciencias', icon: '🔬' },
    { name: 'Tecnologia', slug: 'tecnologia', icon: '💻' },
    { name: 'Artes', slug: 'artes', icon: '🎨' },
    { name: 'Idiomas', slug: 'idiomas', icon: '🌍' },
    { name: 'Escrita', slug: 'escrita', icon: '✍️' },
    { name: 'Design', slug: 'design', icon: '🖌️' },
    { name: 'Música', slug: 'musica', icon: '🎵' },
    { name: 'Desporto', slug: 'desporto', icon: '⚽' },
    { name: 'Outro', slug: 'outro', icon: '📦' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('✅ Categorias criadas')

  // Admin user (para dev)
  const adminPassword = await bcrypt.hash('Admin123!', 12)
  await prisma.user.upsert({
    where: { email: 'admin@estudantes.piaget.pt' },
    update: {},
    create: {
      name: 'Admin SkoolBay',
      email: 'admin@estudantes.piaget.pt',
      password: adminPassword,
      emailVerified: new Date(),
      university: 'Instituto Piaget',
      course: 'Engenharia Informática',
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin criado (admin@estudantes.piaget.pt / Admin123!)')

  // User de teste
  const testPassword = await bcrypt.hash('Test123!', 12)
  const testUser = await prisma.user.upsert({
    where: { email: 'test@estudantes.piaget.pt' },
    update: {},
    create: {
      name: 'Estudante Teste',
      email: 'test@estudantes.piaget.pt',
      password: testPassword,
      emailVerified: new Date(),
      university: 'Instituto Piaget',
      course: 'Engenharia Informática',
      bio: 'Estudante de teste para desenvolvimento.',
    },
  })
  console.log('✅ Utilizador de teste criado (test@estudantes.piaget.pt / Test123!)')

  // Serviço de exemplo
  const techCat = await prisma.category.findUnique({ where: { slug: 'tecnologia' } })
  await prisma.service.create({
    data: {
      title: 'Explicações de Programação em Python',
      description: 'Ajudo com fundamentos de Python, lógica de programação, e projetos académicos. Tenho experiência a ensinar algoritmos, estruturas de dados, e debugging.',
      price: 15.00,
      userId: testUser.id,
      categoryId: techCat?.id,
    },
  })
  console.log('✅ Serviço de exemplo criado')

  console.log('\n🎉 Seed concluído!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
EOF

# Adicionar script de seed ao package.json
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.prisma = { seed: 'ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts' };
pkg.scripts = pkg.scripts || {};
pkg.scripts['db:seed'] = 'npx prisma db seed';
pkg.scripts['db:studio'] = 'npx prisma studio';
pkg.scripts['db:migrate'] = 'npx prisma migrate dev';
pkg.scripts['db:reset'] = 'npx prisma migrate reset --force';
pkg.scripts['test'] = 'vitest';
pkg.scripts['test:ui'] = 'vitest --ui';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

npm install -D ts-node

success "Seed script criado"

# ── 9. Docker ────────────────────────────────────────────────────────────────
info "A criar ficheiros Docker..."

cat > Dockerfile << 'EOF'
# ── Deps ──────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ── Builder ───────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ── Runner ────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
EOF

cat > docker-compose.yml << 'EOF'
services:
  db:
    image: postgres:16-alpine
    container_name: skoolbay_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: skoolbay
      POSTGRES_PASSWORD: skoolbay_dev
      POSTGRES_DB: skoolbay
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U skoolbay"]
      interval: 5s
      timeout: 5s
      retries: 5

  app:
    build: .
    container_name: skoolbay_app
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://skoolbay:skoolbay_dev@db:5432/skoolbay
      NEXTAUTH_URL: http://localhost:3000
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
    ports:
      - "3000:3000"

volumes:
  postgres_data:
EOF

cat > .dockerignore << 'EOF'
.git
.next
node_modules
*.md
.env*
!.env.example
EOF

success "Docker configurado"

# ── 10. Variáveis de ambiente ────────────────────────────────────────────────
info "A criar .env files..."

cat > .env.example << 'EOF'
# Base de Dados
DATABASE_URL="postgresql://skoolbay:skoolbay_dev@localhost:5432/skoolbay"

# NextAuth.js
# Gerar com: openssl rand -base64 32
NEXTAUTH_SECRET="alterar-para-valor-seguro"
NEXTAUTH_URL="http://localhost:3000"

# Email (Nodemailer) — opcional para dev, obrigatório em produção
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="noreply@skoolbay.pt"
EMAIL_SERVER_PASSWORD="password-do-email"
EMAIL_FROM="SkoolBay <noreply@skoolbay.pt>"
EOF

# .env para desenvolvimento local (não vai para git)
cat > .env << 'EOF'
DATABASE_URL="postgresql://skoolbay:skoolbay_dev@localhost:5432/skoolbay"
NEXTAUTH_SECRET="dev-secret-mudar-em-producao-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
EOF

# Garantir que .env está no .gitignore mas .env.example não
if ! grep -q "^\.env$" .gitignore 2>/dev/null; then
  echo ".env" >> .gitignore
fi
if ! grep -q "^\.env\.local$" .gitignore 2>/dev/null; then
  echo ".env.local" >> .gitignore
fi

success "Variáveis de ambiente configuradas"

# ── 11. GitHub Actions CI ────────────────────────────────────────────────────
info "A criar GitHub Actions workflow..."

mkdir -p .github/workflows

cat > .github/workflows/ci.yml << 'EOF'
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  ci:
    name: Lint, Type-check & Build
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: skoolbay
          POSTGRES_PASSWORD: skoolbay_dev
          POSTGRES_DB: skoolbay_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    env:
      DATABASE_URL: postgresql://skoolbay:skoolbay_dev@localhost:5432/skoolbay_test
      NEXTAUTH_SECRET: ci-secret-not-used-in-tests
      NEXTAUTH_URL: http://localhost:3000

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma Client
        run: npx prisma generate

      - name: Run migrations
        run: npx prisma migrate deploy

      - name: Type-check
        run: npx tsc --noEmit

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build

      - name: Tests
        run: npm test -- --run
EOF

success "GitHub Actions CI criado"

# ── 12. Vitest config ────────────────────────────────────────────────────────
info "A configurar Vitest..."

cat > vitest.config.ts << 'EOF'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', '.next/', 'prisma/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
EOF

mkdir -p tests
cat > tests/setup.ts << 'EOF'
import '@testing-library/jest-dom'
EOF

# Teste de exemplo — validação de email institucional
cat > tests/auth.test.ts << 'EOF'
import { describe, it, expect } from 'vitest'
import { registerSchema } from '@/lib/validations/auth'

describe('registerSchema — email institucional', () => {
  it('aceita email @estudantes.piaget.pt', () => {
    const result = registerSchema.safeParse({
      name: 'João Silva',
      email: 'joao@estudantes.piaget.pt',
      password: 'Test123!',
      university: 'Instituto Piaget',
      course: 'Engenharia Informática',
    })
    expect(result.success).toBe(true)
  })

  it('rejeita email gmail', () => {
    const result = registerSchema.safeParse({
      name: 'João Silva',
      email: 'joao@gmail.com',
      password: 'Test123!',
      university: 'Instituto Piaget',
      course: 'Engenharia Informática',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/institucional/)
  })

  it('rejeita password sem maiúscula', () => {
    const result = registerSchema.safeParse({
      name: 'João Silva',
      email: 'joao@estudantes.piaget.pt',
      password: 'test1234',
      university: 'Instituto Piaget',
      course: 'Engenharia Informática',
    })
    expect(result.success).toBe(false)
  })
})
EOF

success "Vitest configurado com teste inicial"

# ── 13. next.config atualizar para standalone ────────────────────────────────
node -e "
const fs = require('fs');
let config = fs.readFileSync('next.config.ts', 'utf8');
if (!config.includes('output')) {
  config = config.replace(
    'const nextConfig: NextConfig = {',
    'const nextConfig: NextConfig = {\n  output: \"standalone\","
  );
  fs.writeFileSync('next.config.ts', config);
}
"

success "next.config.ts atualizado (output: standalone)"

# ── 14. Gerar Prisma Client ──────────────────────────────────────────────────
info "A gerar Prisma Client..."
npx prisma generate
success "Prisma Client gerado"

# ── 15. Resumo final ─────────────────────────────────────────────────────────
echo ""
echo "============================================================================"
echo -e "${GREEN}Sprint 1 setup concluído!${NC}"
echo "============================================================================"
echo ""
echo "Próximos passos:"
echo ""
echo "  1. Iniciar a base de dados:"
echo "       docker compose up -d db"
echo ""
echo "  2. Executar migrações + seed:"
echo "       npx prisma migrate dev --name init"
echo "       npm run db:seed"
echo ""
echo "  3. Iniciar servidor de dev:"
echo "       npm run dev"
echo ""
echo "  4. Abrir em: http://localhost:3000"
echo "     Prisma Studio: npm run db:studio"
echo ""
echo "  Credenciais de teste:"
echo "    Admin:  admin@estudantes.piaget.pt / Admin123!"
echo "    Teste:  test@estudantes.piaget.pt  / Test123!"
echo ""
echo "  5. Correr testes:"
echo "       npm test"
echo ""
echo "  6. Commit e push:"
echo "       git checkout -b feat/sprint1-setup"
echo "       git add ."
echo "       git commit -m 'feat: Sprint 1 setup — Next.js + Prisma + NextAuth + Docker'"
echo "       git push origin feat/sprint1-setup"
echo "       gh pr create --title 'feat: Sprint 1 setup' --body 'Fecha #<issue-setup>'"
echo ""
echo "============================================================================"
