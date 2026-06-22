import React from 'react'
import { Activity, CircleCheck } from 'lucide-react'
import Theme from '../theme'

interface NavbarProps {
  adminPath: string
}

export default function LocalNavbar({ adminPath }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-10 items-center justify-end border-b border-[var(--vscode-border)] bg-[var(--vscode-side-bar-background)] px-4">
      <div className="flex items-center gap-2">
        <Theme>
          <Theme.ColorMode />
        </Theme>
        <a
          href={`/${adminPath}/api/stats`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Live Stats API"
          title="View Live Stats API"
          className="flex h-7 w-7 items-center justify-center border border-[color-mix(in_srgb,var(--vscode-accent)_45%,transparent)] bg-[var(--vscode-block-background)] text-[var(--vscode-accent)] transition hover:bg-[var(--vscode-list-hover-background)]"
        >
          <Activity className="h-4 w-4" aria-hidden="true" strokeWidth={1.8} />
        </a>

        <div
          aria-label="System Online"
          title="System Online"
          className="flex h-7 w-7 items-center justify-center border border-[var(--vscode-border)] bg-[var(--vscode-block-background)] text-[var(--vscode-success)]"
        >
          <CircleCheck className="h-4 w-4" aria-hidden="true" strokeWidth={1.8} />
        </div>
      </div>
    </header>
  )
}
