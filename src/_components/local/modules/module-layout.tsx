import type { ReactNode } from 'react'
import ModuleStatusToggle from './module-status-toggle'

type ModuleLayoutProps = {
  title: string
  description: string
  moduleKey?: string
  adminPath?: string
  settingsHref?: string
  actions?: ReactNode
  children?: ReactNode
}

export default function ModuleLayout({
  title,
  description,
  moduleKey,
  adminPath,
  settingsHref,
  actions,
  children
}: ModuleLayoutProps) {
  return (
    <div className="space-y-6">
      <header className="border-b border-slate-800 pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold text-slate-100">{title}</h2>
              {moduleKey ? <ModuleStatusToggle moduleKey={moduleKey} adminPath={adminPath} /> : null}
            </div>
            <p className="mt-1 text-xs text-slate-500">{description}</p>
          </div>
          {(settingsHref || actions) ? (
            <div className="flex flex-wrap items-center gap-2 lg:justify-end lg:ml-auto">
              {actions}
              {settingsHref ? (
                <a
                  href={settingsHref}
                  className="inline-flex h-9 items-center justify-center border border-slate-800 bg-slate-900 px-4 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-slate-100"
                >
                  Settings
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </header>

      {children}
    </div>
  )
}
