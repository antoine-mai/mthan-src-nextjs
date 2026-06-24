'use client'
import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Circle, Code2, Database, HardDrive, LayoutDashboard, LogOut, Package, Settings, Workflow, type LucideIcon } from 'lucide-react'
import Link from '@/_components/link'
import { apisRegistry, moduleSettingsRegistry, pagesRegistry } from '@/_modules/registry'
import { formatModuleDisplayName } from './_utils/module-name'

interface SidebarProps {
  adminPath: string
}

const componentModuleKeys = new Set(['docker', 'golang', 'nginx', 'nodejs', 'pm2'])

type SidebarModule = {
  key: string
  displayName?: string
  path: string
  active: boolean
}

function getFallbackModules(adminPath: string): SidebarModule[] {
  const moduleKeys = Array.from(new Set([
    ...Object.keys(pagesRegistry),
    ...Object.keys(apisRegistry),
    ...Object.keys(moduleSettingsRegistry)
  ])).filter((key) => !componentModuleKeys.has(key)).sort()

  return moduleKeys.map((key) => {
    return {
      key,
      displayName: formatModuleDisplayName(key),
      path: `/${adminPath}/modules/${key}`,
      active: false
    }
  })
}

export default function LocalSidebar({ adminPath }: SidebarProps) {
  const currentPath = usePathname()
  const [sidebarModules, setSidebarModules] = useState<SidebarModule[]>(() => getFallbackModules(adminPath))
  
  const menuItems: { Icon: LucideIcon, name: string, path: string }[] = [
    { Icon: LayoutDashboard, name: 'Overview', path: `/${adminPath}` },
    { Icon: Workflow, name: 'Workflows', path: `/${adminPath}/workflows` },
    { Icon: Database, name: 'Databases', path: `/${adminPath}/databases` },
    { Icon: Package, name: 'Modules', path: `/${adminPath}/modules` },
    { Icon: HardDrive, name: 'Storages', path: `/${adminPath}/storages` },
    { Icon: Code2, name: 'API', path: `/${adminPath}/api` },
  ]

  const systemItems = [
    { name: 'Environment', path: `/${adminPath}/system/environment` },
    { name: 'System', path: `/${adminPath}/system/settings` },
  ]

  const isSettingsActive = currentPath.startsWith(`/${adminPath}/system`)

  const isModulesActive = currentPath.startsWith(`/${adminPath}/modules`)

  const loadModules = useCallback(async () => {
    try {
      const res = await fetch(`/${adminPath}/api/modules`)
      if (!res.ok) return

      const data = await res.json()
      const modules = Array.isArray(data.modules) ? data.modules : []

      setSidebarModules(modules.map((item: SidebarModule) => ({
        key: item.key,
        displayName: item.displayName ?? item.key,
        path: `/${adminPath}/modules/${item.key}`,
        active: Boolean(item.active)
      })))
    } catch {
      setSidebarModules(getFallbackModules(adminPath))
    }
  }, [adminPath])

  useEffect(() => {
    void loadModules()
  }, [loadModules])

  useEffect(() => {
    const handleModuleStatusChanged = () => {
      void loadModules()
    }

    window.addEventListener('module-status-changed', handleModuleStatusChanged)

    return () => {
      window.removeEventListener('module-status-changed', handleModuleStatusChanged)
    }
  }, [loadModules])

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-[var(--vscode-border)] bg-[var(--vscode-side-bar-background)]">
      <div className="flex h-10 items-center border-b border-[var(--vscode-border)] px-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center border border-[var(--vscode-border)] bg-[var(--vscode-block-background)]">
            <Image
              src="/images/logo.png"
              alt=""
              width={400}
              height={400}
              className="h-5 w-5 object-contain"
              priority
            />
          </div>
          <span className="text-xs font-bold text-[var(--vscode-editor-foreground)]">
            MTHAN.NET CLIENT CONSOLE
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = currentPath === item.path
          const Icon = item.Icon
          const isModulesItem = item.name === 'Modules'

          return (
            <div key={item.path}>
              <Link
                href={item.path}
                className={`flex h-[60px] items-center space-x-3 px-4 text-sm font-medium transition duration-200 ${
                  isActive || (isModulesItem && isModulesActive)
                    ? 'border-l-2 border-[var(--vscode-accent)] bg-[var(--vscode-list-active-background)] text-[var(--vscode-editor-foreground)]'
                    : 'text-[var(--vscode-description-foreground)] hover:bg-[var(--vscode-list-hover-background)] hover:text-[var(--vscode-editor-foreground)]'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" strokeWidth={1.8} />
                <span>{item.name}</span>
              </Link>

              {isModulesItem && isModulesActive && (
                <div className="ml-3 border-l border-[var(--vscode-border)] pl-4 my-1">
                  {sidebarModules.map((mod) => (
                    <Link
                      key={mod.path}
                      href={mod.path}
                      className={`flex items-center justify-between gap-3 py-1.5 px-3 text-xs transition duration-200 ${
                        currentPath === mod.path || currentPath.startsWith(mod.path + '/')
                          ? 'font-semibold text-[var(--vscode-accent)]'
                          : 'text-[var(--vscode-description-foreground)] hover:text-[var(--vscode-editor-foreground)]'
                      }`}
                    >
                      <span>{mod.displayName ?? mod.key}</span>
                      <span
                        title={mod.active ? 'Active' : 'Inactive'}
                        aria-hidden="true"
                        className="relative ml-auto flex h-3 w-3 shrink-0 items-center justify-center"
                      >
                        <Circle
                          className={`h-2.5 w-2.5 ${
                            mod.active
                              ? 'text-emerald-300 fill-emerald-400 drop-shadow-[0_0_2px_rgba(74,222,128,0.3)]'
                              : 'text-[var(--vscode-border)] fill-transparent'
                          }`}
                          strokeWidth={1.7}
                        />
                        {mod.active && (
                          <span className="pointer-events-none absolute left-[2px] top-[2px] h-[2px] w-[2px] bg-white/70" />
                        )}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        <div>
          <Link
            href={`/${adminPath}/system/settings`}
            className={`flex h-[60px] items-center space-x-3 px-4 text-sm font-medium transition duration-200 ${
              isSettingsActive
                ? 'border-l-2 border-[var(--vscode-accent)] bg-[var(--vscode-list-active-background)] text-[var(--vscode-editor-foreground)]'
                : 'text-[var(--vscode-description-foreground)] hover:bg-[var(--vscode-list-hover-background)] hover:text-[var(--vscode-editor-foreground)]'
            }`}
          >
            <Settings className="h-4 w-4 shrink-0" aria-hidden="true" strokeWidth={1.8} />
            <span>System</span>
          </Link>

          {isSettingsActive && (
            <div className="ml-3 border-l border-[var(--vscode-border)] pl-4">
              {systemItems.map((mod) => (
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

      <div className="border-t border-[var(--vscode-border)] bg-[var(--vscode-side-bar-background)] p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center border border-[var(--vscode-border)] bg-[var(--vscode-block-background)] text-sm font-semibold text-[var(--vscode-description-foreground)]">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-semibold text-[var(--vscode-editor-foreground)]">Administrator</p>
            <p className="truncate text-[10px] text-[var(--vscode-description-foreground)]">admin@system.com</p>
          </div>
          <Link
            href={`/${adminPath}/login`}
            aria-label="Log out"
            title="Log out"
            className="flex h-8 w-8 shrink-0 items-center justify-center border border-[var(--vscode-border)] text-[var(--vscode-description-foreground)] transition hover:bg-[var(--vscode-list-hover-background)] hover:text-[var(--vscode-editor-foreground)]"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" strokeWidth={1.8} />
          </Link>
        </div>
      </div>
    </aside>
  )
}
