'use client'

import React, { useEffect, useState } from 'react'
import Link from '@/_components/link'

interface StatusData {
  active: boolean
  version: string
  command?: string
  output?: string
  error?: string
}

export default function NodejsPage() {
  const [data, setData] = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(true)
  const [installing, setInstalling] = useState(false)
  const [installMessage, setInstallMessage] = useState('')
  const [installError, setInstallError] = useState('')

  const checkStatus = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/nodejs')
      const json = await res.json()
      setData(json)
    } catch {
      setData({ active: false, version: 'Connection failed' })
    } finally {
      setLoading(false)
    }
  }

  const handleInstall = async () => {
    setInstalling(true)
    setInstallMessage('Downloading and extracting Node.js locally...')
    setInstallError('')
    try {
      const res = await fetch('/api/nodejs', { method: 'POST' })
      const json = await res.json()
      if (json.status === 'success') {
        setInstallMessage('Node.js installed successfully!')
        await checkStatus()
      } else {
        setInstallError(json.error || 'Failed to install Node.js')
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

    async function checkInitialStatus() {
      try {
        const res = await fetch('/api/nodejs')
        const json = await res.json()
        if (!disposed) {
          setData(json)
        }
      } catch {
        if (!disposed) {
          setData({ active: false, version: 'Connection failed' })
        }
      } finally {
        if (!disposed) {
          setLoading(false)
        }
      }
    }

    void checkInitialStatus()

    return () => {
      disposed = true
    }
  }, [])

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full border border-neutral-800 bg-neutral-900/50 p-6 space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">System Runtime</span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-white">Node.js Runtime</h1>
          <p className="text-xs text-neutral-400 mt-2">
            Status check for local Node.js engine and active executable.
          </p>
        </div>

        {installMessage && (
          <div className="border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-400 font-mono">
            {installMessage}
          </div>
        )}

        {installError && (
          <div className="border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-400 font-mono">
            {installError}
          </div>
        )}

        <div className="border border-neutral-800 bg-neutral-955 p-4 space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
            <span className="text-xs font-semibold text-neutral-400">Status</span>
            {loading ? (
              <span className="text-xs text-neutral-500 animate-pulse">Checking...</span>
            ) : data?.active ? (
              <span className="border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-400">
                Active / Running
              </span>
            ) : (
              <span className="border border-rose-500/20 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-rose-400">
                Inactive / Not Found
              </span>
            )}
          </div>

          <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
            <span className="text-xs font-semibold text-neutral-400">Version</span>
            <span className="text-xs font-mono text-neutral-200">
              {loading ? '...' : data?.version || 'N/A'}
            </span>
          </div>

          <div className="flex justify-between items-center pb-1">
            <span className="text-xs font-semibold text-neutral-400">Check Command</span>
            <span className="text-xs font-mono text-neutral-200">
              {loading ? '...' : data?.command || 'N/A'}
            </span>
          </div>
        </div>

        {!loading && data?.error && (
          <div className="border border-rose-500/20 bg-rose-500/5 p-3 text-xs text-rose-400 font-mono overflow-x-auto">
            {data.error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          {data && !data.active && (
            <button
              type="button"
              onClick={handleInstall}
              disabled={installing || loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 border border-indigo-500 py-2.5 text-xs font-semibold text-white transition disabled:opacity-50"
            >
              {installing ? 'Installing...' : 'Install Node.js (Non-Root)'}
            </button>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={checkStatus}
              disabled={loading || installing}
              className="flex-1 border border-neutral-800 bg-neutral-900 py-2.5 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 transition disabled:opacity-50"
            >
              Recheck
            </button>
            <Link
              href="/"
              className="flex-1 border border-neutral-800 bg-neutral-900 py-2.5 text-xs font-semibold text-neutral-300 text-center hover:bg-neutral-800 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
