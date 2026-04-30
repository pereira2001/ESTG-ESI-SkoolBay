const GROQ_BASE_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

interface GroqMessage {
  role: string
  content: string
}

interface GroqResponseChoice {
  message: {
    content: string
  }
}

interface GroqResponse {
  choices: GroqResponseChoice[]
}

export async function callGroq(
  messages: GroqMessage[],
  temperature: number = 0.3,
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error('GROQ_API_KEY não está configurada nas variáveis de ambiente')
  }

  const response = await fetch(GROQ_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Sem detalhes do erro')
    throw new Error(
      `Groq API respondeu com status ${response.status}: ${errorText}`,
    )
  }

  const data = (await response.json()) as GroqResponse
  const content = data.choices?.[0]?.message?.content

  if (!content) {
    throw new Error('Resposta da Groq API não contém conteúdo válido')
  }

  return content
}
