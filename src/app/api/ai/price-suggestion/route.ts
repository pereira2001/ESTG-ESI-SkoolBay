import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { callGroq } from '@/lib/groq'

const bodySchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(2000),
  category: z.string().min(1).max(100),
  durationHours: z.number().positive().optional(),
})

interface PriceSuggestion {
  precoSugerido: number
  precoMinimo: number
  precoMaximo: number
  justificacao: string
  fatoresConsiderados: string[]
}

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
      { error: 'Dados inválidos', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const { title, description, category, durationHours } = parsed.data

  const userPrompt = `Analisa este serviço académico e sugere um preço justo para o mercado estudantil português:

Título: ${title}
Categoria: ${category}
Descrição: ${description}${durationHours ? `\nDuração estimada: ${durationHours} horas` : ''}

Responde APENAS com este JSON (sem markdown, sem texto extra):
{
  "precoSugerido": <número em EUR>,
  "precoMinimo": <número em EUR>,
  "precoMaximo": <número em EUR>,
  "justificacao": "<string máx 150 chars>",
  "fatoresConsiderados": ["<fator1>", "<fator2>", "<fator3>", "<fator4>"]
}`

  let groqResponse: string
  try {
    groqResponse = await callGroq([
      {
        role: 'system',
        content:
          'És um assistente especializado em precificação de serviços académicos peer-to-peer em Portugal. Conheces o mercado estudantil português e sabes que os estudantes têm orçamentos limitados. Responde SEMPRE em JSON válido, sem markdown, sem texto extra.',
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

  let suggestion: PriceSuggestion
  try {
    const cleaned = groqResponse.trim().replace(/^```json\s*/i, '').replace(/```\s*$/, '')
    suggestion = JSON.parse(cleaned) as PriceSuggestion
  } catch {
    return NextResponse.json(
      { error: 'A IA devolveu uma resposta que não foi possível processar. Tenta novamente.' },
      { status: 500 },
    )
  }

  return NextResponse.json(suggestion)
}
