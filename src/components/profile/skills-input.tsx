'use client'

import { useState, type KeyboardEvent } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'

interface SkillsInputProps {
  value: string[]
  onChange: (skills: string[]) => void
  max?: number
}

export function SkillsInput({ value, onChange, max = 10 }: SkillsInputProps) {
  const [inputValue, setInputValue] = useState('')

  function addSkill(raw: string) {
    const skill = raw.trim()
    if (!skill || skill.length > 30) return
    if (value.includes(skill)) return
    if (value.length >= max) return
    onChange([...value, skill])
    setInputValue('')
  }

  function removeSkill(skill: string) {
    onChange(value.filter((s) => s !== skill))
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSkill(inputValue)
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeSkill(value[value.length - 1])
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5 min-h-8">
        {value.map((skill) => (
          <Badge key={skill} variant="secondary" className="gap-1 pr-1">
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5"
              aria-label={`Remover ${skill}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      {value.length < max && (
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addSkill(inputValue)}
          placeholder="Escreve e prime Enter para adicionar"
          className="h-8 text-sm"
        />
      )}
      <p className="text-xs text-muted-foreground">
        {value.length}/{max} competências · max 30 caracteres cada
      </p>
    </div>
  )
}
