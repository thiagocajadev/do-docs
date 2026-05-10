'use client'

import cn from '@/lib/cn'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { LuMonitor, LuMoon, LuSun } from 'react-icons/lu'

const ORDER = ['system', 'light', 'dark'] as const
const LABEL = { system: 'Tema do sistema', light: 'Tema claro', dark: 'Tema escuro' } as const

export function ToggleTheme({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const current = (mounted && (theme as (typeof ORDER)[number])) || 'system'
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length]

  const Icon = current === 'light' ? LuSun : current === 'dark' ? LuMoon : LuMonitor

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={LABEL[current]}
      title={LABEL[current]}
      className={cn(
        'cursor-pointer text-on-surface-variant transition-colors hover:text-on-surface',
        className,
      )}
    >
      <Icon />
    </button>
  )
}
