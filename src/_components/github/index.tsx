'use client'

import React, { useState } from 'react'

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

interface GitHubConnectProps {
  onConnect: (connected: boolean) => void
  connected: boolean
}

export default function GitHubConnect({ onConnect, connected }: GitHubConnectProps) {
  const [loading, setLoading] = useState(false)

  const handleConnect = () => {
    setLoading(true)

    const width = 600
    const height = 700
    const left = window.screen.width / 2 - width / 2
    const top = window.screen.height / 2 - height / 2

    const popup = window.open(
      '/github-auth',
      'GitHub Authorization',
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes`
    )

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      if (event.data?.type === 'GITHUB_AUTH_SUCCESS') {
        onConnect(true)
        setLoading(false)
        window.removeEventListener('message', handleMessage)
      }
    }

    window.addEventListener('message', handleMessage)

    const timer = setInterval(() => {
      if (popup?.closed) {
        clearInterval(timer)
        setLoading(false)
        window.removeEventListener('message', handleMessage)
      }
    }, 1000)
  }

  const handleDisconnect = () => {
    onConnect(false)
  }

  if (connected) {
    return (
      <div className="flex items-center justify-between border border-[var(--vscode-border)] bg-[var(--vscode-side-bar-background)] p-3">
        <div className="flex items-center gap-2">
          <GithubIcon className="h-5 w-5 text-[var(--vscode-editor-foreground)]" />
          <div>
            <span className="block text-xs font-semibold text-[var(--vscode-editor-foreground)]">Connected to GitHub</span>
            <span className="block text-[10px] text-[var(--vscode-description-foreground)]">Account: antoine-mai</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDisconnect}
          className="border border-[color-mix(in_srgb,var(--vscode-danger)_40%,transparent)] px-2.5 py-1.5 text-[10px] font-semibold text-[var(--vscode-danger)] hover:bg-[var(--vscode-list-hover-background)] transition"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 border border-dashed border-[var(--vscode-border)] bg-[var(--vscode-block-background)] text-center space-y-4">
      <GithubIcon className="h-10 w-10 text-[var(--vscode-description-foreground)]" strokeWidth={1.5} />
      <div className="space-y-1">
        <span className="block text-sm font-semibold text-[var(--vscode-editor-foreground)]">GitHub not connected</span>
        <span className="block text-xs text-[var(--vscode-description-foreground)]">Connect your account to deploy repositories directly</span>
      </div>
      <button
        type="button"
        onClick={handleConnect}
        disabled={loading}
        className="inline-flex h-9 items-center gap-2 border border-[var(--vscode-border)] bg-[var(--vscode-editor-background)] px-4 text-xs font-semibold text-[var(--vscode-editor-foreground)] hover:bg-[var(--vscode-list-hover-background)] transition disabled:pointer-events-none disabled:opacity-50"
      >
        <GithubIcon className="h-4 w-4" />
        <span>{loading ? 'Connecting...' : 'Connect GitHub Account'}</span>
      </button>
    </div>
  )
}
