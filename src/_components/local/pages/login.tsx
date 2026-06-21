'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { getAdminLoginHooks } from '@/_modules/registry'

// Load hooks dynamically
const hookComponents = getAdminLoginHooks().map((config) => ({
  id: config.id,
  slot: config.slot,
  Component: dynamic(() => config.importFn().then(mod => mod.default), {
    ssr: false,
    loading: () => <div className="animate-pulse bg-slate-900/50 h-10 border border-slate-800" />
  })
}))

export default function LocalLogin({ adminPath }: { adminPath: string }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError('')
    if (!username || !password) {
      setError('Please enter both username/email and password')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/${adminPath}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (res.ok && data.status === 'success') {
        window.location.href = `/${adminPath}`
      } else {
        setError(data.error || 'Invalid credentials')
      }
    } catch {
      setError('Failed to connect to the authentication server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="local-shell flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--vscode-editor-background)] p-6 text-[var(--vscode-editor-foreground)]">
      <div className="z-10 w-full max-w-md space-y-8">
        {hookComponents.filter(h => h.slot === 'top').map(({ id, Component }) => (
          <Component key={id} />
        ))}

        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center border border-[color-mix(in_srgb,var(--vscode-accent)_45%,transparent)] bg-[var(--vscode-block-background)] text-xl font-bold text-[var(--vscode-accent)]">
            A
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--vscode-editor-foreground)]">
            Local Console
          </h2>
          <p className="text-sm text-[var(--vscode-description-foreground)]">
            Please sign in to access management console
          </p>
        </div>

        <div className="space-y-6 border border-[var(--vscode-border)] bg-[var(--vscode-block-background)] p-8 shadow-2xl">
          {error && (
            <div className="border border-[color-mix(in_srgb,var(--vscode-danger)_45%,transparent)] bg-[var(--vscode-block-background)] px-4 py-2.5 text-center text-xs text-[var(--vscode-danger)]">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[var(--vscode-description-foreground)]">Email Address</label>
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@system.com"
                className="w-full border border-[var(--vscode-border)] bg-[var(--vscode-block-background)] px-4 py-2.5 text-sm text-[var(--vscode-editor-foreground)] placeholder-[var(--vscode-description-foreground)] transition focus:border-[var(--vscode-accent)] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-[var(--vscode-description-foreground)]">Password</label>
                <a href="#" className="text-xs text-[var(--vscode-accent)] transition hover:opacity-80">Forgot?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-[var(--vscode-border)] bg-[var(--vscode-block-background)] px-4 py-2.5 text-sm text-[var(--vscode-editor-foreground)] placeholder-[var(--vscode-description-foreground)] transition focus:border-[var(--vscode-accent)] focus:outline-none"
              />
            </div>

            {hookComponents.filter(h => h.slot === 'fields').map(({ id, Component }) => (
              <Component key={id} />
            ))}
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full border border-[color-mix(in_srgb,var(--vscode-accent)_45%,transparent)] bg-[var(--vscode-block-background)] py-3 font-semibold text-[var(--vscode-accent)] transition duration-300 hover:bg-[var(--vscode-list-hover-background)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          {hookComponents.filter(h => h.slot === 'actions').map(({ id, Component }) => (
            <Component key={id} />
          ))}
        </div>

        {hookComponents.filter(h => h.slot === 'bottom').map(({ id, Component }) => (
          <Component key={id} />
        ))}
      </div>
    </main>
  )
}
