'use client'

import React, { useEffect, useState } from 'react'

interface StatusData {
  active: boolean
  version: string
  command?: string
  output?: string
  error?: string
}

export default function DockerSettings() {
  const [data, setData] = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(true)

  const loadStatus = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/docker')
      const json = await res.json()
      setData(json)
    } catch {
      setData({ active: false, version: 'API Error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let disposed = false

    async function loadInitialStatus() {
      try {
        const res = await fetch('/api/docker')
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
      <div className="border border-slate-800 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md">
        <div className="flex justify-between items-start border-b border-slate-800/80 pb-4">
          <div>
            <h4 className="text-lg font-bold text-slate-100 font-mono">Docker Config</h4>
            <p className="mt-1 text-xs text-slate-500">
              Diagnostic logs and status verification for local Docker service.
            </p>
          </div>
          <div>
            {loading ? (
              <span className="text-xs text-slate-500 animate-pulse">Checking...</span>
            ) : data?.active ? (
              <span className="border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-400">
                Service Active
              </span>
            ) : (
              <span className="border border-rose-500/20 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-rose-400">
                Service Inactive
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-slate-400">Daemon Socket Location</span>
              <input
                type="text"
                readOnly
                defaultValue="/var/run/docker.sock"
                className="w-full border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-slate-400 font-mono focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-slate-400">Version Detected</span>
              <input
                type="text"
                readOnly
                value={loading ? 'Checking...' : data?.version || 'Not Installed'}
                className="w-full border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-slate-400 font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <span className="block text-xs font-semibold text-slate-400">Docker Version Diagnostics Output</span>
            <pre className="w-full border border-slate-800 bg-slate-955 p-4 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap max-h-48">
              {loading ? 'Executing command...' : data?.output || data?.error || 'No output recorded.'}
            </pre>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-800/80 pt-4">
          <button
            type="button"
            onClick={loadStatus}
            disabled={loading}
            className="bg-slate-850 border border-slate-800 px-5 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
          >
            Recheck Daemon
          </button>
        </div>
      </div>
    </div>
  )
}
