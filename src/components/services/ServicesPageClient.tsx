'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { ServiceCard } from '@/components/services/service-card'
import { SmartSearchBar, type AiService } from '@/components/services/SmartSearchBar'

interface ServicesPageClientProps {
  categories: { id: string; name: string }[]
  children: React.ReactNode
}

export function ServicesPageClient({ categories, children }: ServicesPageClientProps) {
  const [aiResults, setAiResults] = useState<AiService[] | null>(null)
  const [aiIntencao, setAiIntencao] = useState<string | null>(null)

  function handleAiResults(results: AiService[] | null, intencao: string | null) {
    setAiResults(results)
    setAiIntencao(intencao)
  }

  return (
    <div>
      <div className="mt-4">
        <p className="text-xs text-muted-foreground mb-2">ou pesquisa por linguagem natural</p>
        <SmartSearchBar categories={categories} onAiResults={handleAiResults} />
      </div>

      {aiResults !== null ? (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
              ✨ IA: {aiIntencao}
            </span>
            <button
              onClick={() => handleAiResults(null, null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Limpar resultados IA"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            {aiResults.length === 0
              ? 'Nenhum serviço encontrado.'
              : `${aiResults.length} ${aiResults.length === 1 ? 'serviço encontrado' : 'serviços encontrados'}`}
          </p>

          {aiResults.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground">
              Tenta reformular a pesquisa.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiResults.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6">{children}</div>
      )}
    </div>
  )
}
