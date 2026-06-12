'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import { getAdminModuleSettingsList } from '@/_modules/registry'

interface SidebarProps {
  adminPath: string
}

export default function AdminSidebar({ adminPath }: SidebarProps) {
  const currentPath = usePathname()
  
  const menuItems = [
    { name: 'Dashboard', path: `/${adminPath}`, icon: '📊' },
    { name: 'Users', path: `/${adminPath}/users`, icon: '👥' },
  ]

  const settingsModules = getAdminModuleSettingsList().map((mod) => ({
    name: mod.label,
    path: `/${adminPath}/settings/${mod.key}`,
  }))

  const isSettingsActive = currentPath.startsWith(`/${adminPath}/settings`)

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            A
          </div>
          <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Admin Console
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = currentPath === item.path
          return (
            <a
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium transition duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/25 to-purple-600/10 text-indigo-400 border-l-2 border-indigo-500'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </a>
          )
        })}

        {/* Settings Group */}
        <div className="space-y-1">
          <a
            href={`/${adminPath}/settings`}
            className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium transition duration-200 ${
              currentPath === `/${adminPath}/settings`
                ? 'bg-gradient-to-r from-indigo-600/25 to-purple-600/10 text-indigo-400 border-l-2 border-indigo-500'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <span className="text-lg">⚙️</span>
            <span>Settings</span>
          </a>

          {/* Settings Sub-links */}
          {isSettingsActive && (
            <div className="pl-9 space-y-1 border-l border-slate-800 ml-6 mt-1">
              <a
                href={`/${adminPath}/settings`}
                className={`block py-1.5 px-3 text-xs transition duration-200 ${
                  currentPath === `/${adminPath}/settings`
                    ? 'text-indigo-400 font-semibold bg-indigo-500/5'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                System Config
              </a>
              {settingsModules.map((mod) => (
                <a
                  key={mod.path}
                  href={mod.path}
                  className={`block py-1.5 px-3 text-xs transition duration-200 ${
                    currentPath === mod.path
                      ? 'text-indigo-400 font-semibold bg-indigo-500/5'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {mod.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-semibold text-slate-300">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-300 truncate">Administrator</p>
            <p className="text-[10px] text-slate-500 truncate">admin@system.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
