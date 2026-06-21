'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import { getAdminModuleSettingsList } from '@/_modules/registry'
import Link from '@/_components/link'

interface SidebarProps {
  adminPath: string
}

export default function LocalSidebar({ adminPath }: SidebarProps) {
  const currentPath = usePathname()
  
  const menuItems = [
    { name: 'Dashboard', path: `/${adminPath}`, icon: '📊' },
    { name: 'Admin Account', path: `/${adminPath}/users`, icon: 'AD' },
    { name: 'Databases', path: `/${adminPath}/databases`, icon: 'DB' },
    { name: 'Storages', path: `/${adminPath}/storages`, icon: 'ST' },
  ]

  const settingsModules = getAdminModuleSettingsList().map((mod) => ({
    name: mod.label,
    path: `/${adminPath}/settings/${mod.key}`,
  }))

  const isSettingsActive = currentPath.startsWith(`/${adminPath}/settings`)

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-[var(--vscode-border)] bg-[var(--vscode-side-bar-background)]">
      <div className="flex h-10 items-center border-b border-[var(--vscode-border)] px-4">
        <div className="flex items-center space-x-2">
          <div className="flex h-7 w-7 items-center justify-center border border-[color-mix(in_srgb,var(--vscode-accent)_45%,transparent)] bg-[var(--vscode-block-background)] text-sm font-bold text-[var(--vscode-accent)]">
            A
          </div>
          <span className="text-sm font-bold text-[var(--vscode-editor-foreground)]">
            Local Console
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = currentPath === item.path
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium transition duration-200 ${
                isActive
                  ? 'border-l-2 border-[var(--vscode-accent)] bg-[var(--vscode-list-active-background)] text-[var(--vscode-editor-foreground)]'
                  : 'text-[var(--vscode-description-foreground)] hover:bg-[var(--vscode-list-hover-background)] hover:text-[var(--vscode-editor-foreground)]'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          )
        })}

        <div className="space-y-1">
          <Link
            href={`/${adminPath}/settings`}
            className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium transition duration-200 ${
              currentPath === `/${adminPath}/settings`
                ? 'border-l-2 border-[var(--vscode-accent)] bg-[var(--vscode-list-active-background)] text-[var(--vscode-editor-foreground)]'
                : 'text-[var(--vscode-description-foreground)] hover:bg-[var(--vscode-list-hover-background)] hover:text-[var(--vscode-editor-foreground)]'
            }`}
          >
            <span className="text-lg">⚙️</span>
            <span>Settings</span>
          </Link>

          {isSettingsActive && (
            <div className="ml-6 mt-1 space-y-1 border-l border-[var(--vscode-border)] pl-9">
              <Link
                href={`/${adminPath}/settings`}
                className={`block py-1.5 px-3 text-xs transition duration-200 ${
                  currentPath === `/${adminPath}/settings`
                    ? 'font-semibold text-[var(--vscode-accent)]'
                    : 'text-[var(--vscode-description-foreground)] hover:text-[var(--vscode-editor-foreground)]'
                }`}
              >
                System Config
              </Link>
              {settingsModules.map((mod) => (
                <Link
                  key={mod.path}
                  href={mod.path}
                  className={`block py-1.5 px-3 text-xs transition duration-200 ${
                    currentPath === mod.path
                      ? 'font-semibold text-[var(--vscode-accent)]'
                      : 'text-[var(--vscode-description-foreground)] hover:text-[var(--vscode-editor-foreground)]'
                  }`}
                >
                  {mod.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="border-t border-[var(--vscode-border)] bg-[var(--vscode-block-background)] p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center border border-[var(--vscode-border)] bg-[var(--vscode-block-background)] text-sm font-semibold text-[var(--vscode-description-foreground)]">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-semibold text-[var(--vscode-editor-foreground)]">Administrator</p>
            <p className="truncate text-[10px] text-[var(--vscode-description-foreground)]">admin@system.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
