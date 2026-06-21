'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react'

type ThemePreference = 'light' | 'dark' | 'system'

const options: { Icon: LucideIcon, label: string, value: ThemePreference }[] = [
  { Icon: Sun, label: 'Light mode', value: 'light' },
  { Icon: Moon, label: 'Dark mode', value: 'dark' },
  { Icon: Monitor, label: 'Auto mode', value: 'system' }
]

const subscribers = new Set<() => void>()

function resolveTheme(preference: ThemePreference) {
  if (typeof window === 'undefined') return 'light'
  if (preference !== 'system') return preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(preference: ThemePreference) {
  if (typeof document === 'undefined') return
  const resolved = resolveTheme(preference)
  document.documentElement.dataset.theme = resolved
  document.documentElement.dataset.themePreference = preference
}

function getStoredTheme(): ThemePreference {
  if (typeof window === 'undefined') return 'system'
  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  return 'system'
}

function getServerTheme(): ThemePreference {
  return 'system'
}

function notifyThemeSubscribers() {
  subscribers.forEach((subscriber) => subscriber())
}

function subscribeThemeChange(subscriber: () => void) {
  subscribers.add(subscriber)

  const onStorage = (event: StorageEvent) => {
    if (event.key === 'theme') subscriber()
  }

  window.addEventListener('storage', onStorage)

  return () => {
    subscribers.delete(subscriber)
    window.removeEventListener('storage', onStorage)
  }
}

export default function ColorMode() {
  const theme = useSyncExternalStore(
    subscribeThemeChange,
    getStoredTheme,
    getServerTheme
  )

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    applyTheme(theme)

    const syncSystemTheme = () => {
      if (theme === 'system') applyTheme('system')
    }

    media.addEventListener('change', syncSystemTheme)
    return () => media.removeEventListener('change', syncSystemTheme)
  }, [theme])

  const selectTheme = (value: ThemePreference) => {
    window.localStorage.setItem('theme', value)
    applyTheme(value)
    notifyThemeSubscribers()
  }

  return (
    <div className="flex border border-[var(--vscode-border)] bg-[var(--vscode-block-background)]">
      {options.map((option) => {
        const isActive = theme === option.value
        const Icon = option.Icon

        return (
          <button
            key={option.value}
            type="button"
            aria-label={option.label}
            aria-pressed={isActive}
            title={option.label}
            onClick={() => selectTheme(option.value)}
            className={`flex h-7 w-7 items-center justify-center transition ${
              isActive
                ? 'bg-[var(--vscode-block-background)] text-[var(--vscode-accent)] shadow-[inset_0_0_0_1px_var(--vscode-accent)]'
                : 'text-[var(--vscode-description-foreground)] hover:bg-[var(--vscode-list-hover-background)] hover:text-[var(--vscode-editor-foreground)]'
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" strokeWidth={1.8} />
          </button>
        )
      })}
    </div>
  )
}
