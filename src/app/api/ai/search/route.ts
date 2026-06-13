import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { callGroq } from '@/lib/groq'
import { prisma } from '@/lib/prisma'

const bodySchema = z.object({
  query: z.string().min(3).max(500),
})

interface SearchMeta {
  intencao: string
  categoria: string
  keywords: string[]
  termosAdicionais: string[]
}

interface GroqSearchResult {
  keywords: string[]
  categoria: string
  intencao: string
  termosAdicionais: string[]
}

const VALID_CATEGORIES = [
  'tecnologia',
  'design',
  'idiomas',
  'tutoria',
  'musica',
  'fotografia',
  'escrita',
  'ciencias',
  'artes',
  'desporto',
  'outros',
] as const

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Corpo da requisição inválido' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Query inválida', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const { query } = parsed.data

  const userPrompt = `Query: '${query}'

Extrai:
- keywords: array de 2-5 palavras-chave relevantes em português
- categoria: uma de [tecnologia, design, idiomas, tutoria, musica, fotografia, escrita, ciencias, artes, desporto, outros]
- intencao: string curta descrevendo o que o utilizador quer (máx 60 chars)
- termosAdicionais: array de sinónimos ou termos relacionados (máx 3)

Responde APENAS com JSON válido, sem markdown, sem texto extra.`

  let groqResponse: string
  try {
    groqResponse = await callGroq([
      {
        role: 'system',
        content:
          'Analisa queries de pesquisa de serviços académicos e extrai informação estruturada. Responde APENAS em JSON válido sem markdown.',
      },
      { role: 'user', content: userPrompt },
    ])
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido'
    return NextResponse.json(
      { error: `Falha ao comunicar com a API de IA: ${message}` },
      { status: 502 },
    )
  }

  let extracted: GroqSearchResult
  try {
    const cleaned = groqResponse.trim().replace(/^```json\s*/i, '').replace(/```\s*$/, '')
    extracted = JSON.parse(cleaned) as GroqSearchResult
  } catch {
    return NextResponse.json(
      { error: 'A IA devolveu uma resposta que não foi possível processar. Tenta novamente.' },
      { status: 500 },
    )
  }

  const { keywords = [], categoria = 'outros', intencao = query, termosAdicionais = [] } = extracted
  const allTerms = [...keywords, ...termosAdicionais].filter(Boolean)

  const isValidCategory = VALID_CATEGORIES.includes(
    categoria as (typeof VALID_CATEGORIES)[number],
  )

  if (allTerms.length === 0) allTerms.push(query)

  const orConditions = allTerms.flatMap((term) => [
    { title: { contains: term, mode: 'insensitive' as const } },
    { description: { contains: term, mode: 'insensitive' as const } },
  ])

  if (isValidCategory && categoria !== 'outros') {
    orConditions.push({ category: { slug: categoria } } as never)
  }

  const services = await prisma.service.findMany({
    where: {
      isActive: true,
      ...(orConditions.length > 0 ? { OR: orConditions } : {}),
    },
    select: {
      id: true,
      title: true,
      price: true,
      category: { select: { name: true, slug: true } },
      user: { select: { id: true, name: true, avatarUrl: true, rating: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 24,
  })

  const ranked = isValidCategory && categoria !== 'outros'
    ? [...services].sort((a, b) => {
        const aMatch = a.category?.slug === categoria ? 1 : 0
        const bMatch = b.category?.slug === categoria ? 1 : 0
        return bMatch - aMatch
      })
    : services

  const finalResults = ranked.slice(0, 12)

  const meta: SearchMeta = { intencao, categoria, keywords, termosAdicionais }

  return NextResponse.json({
    results: finalResults,
    meta,
    total: finalResults.length,
  })
}
