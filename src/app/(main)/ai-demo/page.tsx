import type { Metadata } from 'next'
import { Separator } from '@/components/ui/separator'
import { PriceSuggestion } from '@/components/ai/PriceSuggestion'
import { SmartSearch } from '@/components/ai/SmartSearch'

export const metadata: Metadata = { title: 'IA — SkoolBay' }

export default function AiDemoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">
      <section className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Calculadora de Preço com IA</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Descreve o teu serviço e a IA sugere um preço justo para o mercado estudantil português.
          </p>
        </div>
        <PriceSuggestion category="outro" />
      </section>

      <Separator />

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Pesquisa por Linguagem Natural</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Descreve o que precisas em linguagem natural e a IA encontra os serviços mais relevantes.
          </p>
        </div>
        <SmartSearch />
      </section>
    </div>
  )
}
