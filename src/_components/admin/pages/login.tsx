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

export default function AdminLogin({ adminPath }: { adminPath: string }) {
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
    } catch (err) {
      setError('Failed to connect to the authentication server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10 space-y-8">
        {/* Top hooks */}
        {hookComponents.filter(h => h.slot === 'top').map(({ id, Component }) => (
          <Component key={id} />
        ))}

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 bg-gradient-to-tr from-indigo-500 to-purple-600 items-center justify-center font-bold text-xl text-white shadow-xl shadow-indigo-500/20">
            A
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-purple-400">
            Admin Console
          </h2>
          <p className="text-slate-400 text-sm">
            Please sign in to access management console
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900/40 border border-slate-800 backdrop-blur-md p-8 shadow-2xl space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/25 text-red-400 text-xs px-4 py-2.5 text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Email Address</label>
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@system.com"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-650 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-400">Password</label>
                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition">Forgot?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-650 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Fields hooks */}
            {hookComponents.filter(h => h.slot === 'fields').map(({ id, Component }) => (
              <Component key={id} />
            ))}
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-500/25 transition duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          {/* Actions hooks */}
          {hookComponents.filter(h => h.slot === 'actions').map(({ id, Component }) => (
            <Component key={id} />
          ))}
        </div>

        {/* Bottom hooks */}
        {hookComponents.filter(h => h.slot === 'bottom').map(({ id, Component }) => (
          <Component key={id} />
        ))}
      </div>
    </main>
  )
}
