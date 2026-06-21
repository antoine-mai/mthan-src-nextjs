import React from 'react'
import LocalSidebar from './sidebar'
import LocalNavbar from './navbar'

export default function LocalLayout({ children, adminPath }: { children: React.ReactNode, adminPath: string }) {
  return (
    <div className="local-shell flex min-h-screen bg-[var(--vscode-editor-background)] text-[var(--vscode-editor-foreground)]">
      <LocalSidebar adminPath={adminPath} />

      <div className="flex-1 flex flex-col min-w-0">
        <LocalNavbar adminPath={adminPath} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[var(--vscode-editor-background)] p-6 md:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
