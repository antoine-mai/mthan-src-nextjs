'use client'

import React, { useEffect, useState } from 'react'
import ModuleLayout from '@/_components/local/modules/module-layout'

interface StatusData {
  active: boolean
  version: string
  command?: string
  output?: string
  error?: string
}

export default function Pm2Settings() {
  const [data, setData] = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(true)
  const [installing, setInstalling] = useState(false)
  const [installMessage, setInstallMessage] = useState('')
  const [installError, setInstallError] = useState('')

  const loadStatus = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/pm2')
      const json = await res.json()
      setData(json)
    } catch {
      setData({ active: false, version: 'API Error' })
    } finally {
      setLoading(false)
    }
  }

  const handleInstall = async () => {
    setInstalling(true)
    setInstallMessage('Installing PM2 locally via npm...')
    setInstallError('')
    try {
      const res = await fetch('/api/pm2', { method: 'POST' })
      const json = await res.json()
      if (json.status === 'success') {
        setInstallMessage('PM2 installed successfully!')
        await loadStatus()
      } else {
        setInstallError(json.error || 'Failed to install PM2')
        setInstallMessage('')
      }
    } catch {
      setInstallError('Connection failed')
      setInstallMessage('')
    } finally {
      setInstalling(false)
    }
  }

  useEffect(() => {
    let disposed = false

    async function loadInitialStatus() {
      try {
        const res = await fetch('/api/pm2')
        const json = await res.json()
        if (!disposed) {
          setData(json)
        }
      } catch {
        if (!disposed) {
          setData({ active: false, version: 'API Error' })
        }
      } finally {
        if (!disposed) {
          setLoading(false)
        }
      }
    }

    void loadInitialStatus()

    return () => {
      disposed = true
    }
  }, [])

  return (
    <div className="space-y-6">
      <ModuleLayout
        title="PM2 Settings"
        description="Diagnostic logs and status verification for local PM2 daemon."
      >
        <div className="border border-slate-800 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md">
          <div className="flex justify-between items-start border-b border-slate-800/80 pb-4">
            <div>
              <h4 className="text-lg font-bold text-slate-100 font-mono">PM2 Config</h4>
              <p className="mt-1 text-xs text-slate-500">
                Diagnostic logs and status verification for local PM2 daemon.
              </p>
            </div>
            <div>
              {loading ? (
                <span className="text-xs text-slate-500 animate-pulse">Checking...</span>
              ) : data?.active ? (
                <span className="border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-400">
                  Daemon Active
                </span>
              ) : (
                <span className="border border-rose-500/20 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-rose-400">
                  Daemon Inactive
                </span>
              )}
            </div>
          </div>

          {installMessage && (
            <div className="mt-4 border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-400 font-mono">
              {installMessage}
            </div>
          )}

          {installError && (
            <div className="mt-4 border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-400 font-mono">
              {installError}
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-slate-400">Process Daemon</span>
                <input
                  type="text"
                  readOnly
                  defaultValue="PM2 Runtime Service"
                  className="w-full border border-slate-800 bg-slate-955 px-4 py-2.5 text-xs text-slate-400 font-mono focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-slate-400">Version Detected</span>
                <input
                  type="text"
                  readOnly
                  value={loading ? 'Checking...' : data?.version || 'Not Installed'}
                  className="w-full border border-slate-800 bg-slate-955 px-4 py-2.5 text-xs text-slate-400 font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <span className="block text-xs font-semibold text-slate-400">PM2 Version Diagnostics Output</span>
              <pre className="w-full border border-slate-800 bg-slate-955 p-4 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap max-h-48">
                {loading ? 'Executing command...' : data?.output || data?.error || 'No output recorded.'}
              </pre>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-800/80 pt-4">
            {data && !data.active && (
              <button
                type="button"
                onClick={handleInstall}
                disabled={installing || loading}
                className="bg-indigo-600 hover:bg-indigo-700 border border-indigo-500 px-5 py-2.5 text-xs font-semibold text-white transition disabled:opacity-50"
              >
                {installing ? 'Installing...' : 'Install PM2 (Non-Root)'}
              </button>
            )}
            <button
              type="button"
              onClick={loadStatus}
              disabled={loading || installing}
              className="bg-slate-850 border border-slate-800 px-5 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
            >
              Recheck Daemon
            </button>
          </div>
        </div>
      </ModuleLayout>
    </div>
  )
}
