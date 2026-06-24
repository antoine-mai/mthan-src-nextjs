'use client'

import React, { useEffect, useState } from 'react'
import Link from '@/_components/link'
import ModuleLayout from '@/_components/local/modules/module-layout'

interface StatusData {
  active: boolean
  version: string
  command?: string
  output?: string
  error?: string
}

export default function DockerPage() {
  const [data, setData] = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(true)

  const checkStatus = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/docker')
      const json = await res.json()
      setData(json)
    } catch {
      setData({ active: false, version: 'Connection failed' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let disposed = false

    async function checkInitialStatus() {
      try {
        const res = await fetch('/api/docker')
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
      <div className="max-w-xl w-full">
        <ModuleLayout
          title="Docker"
          description="Status check for local Docker installation and daemon socket permission."
        >
          <div className="border border-neutral-800 bg-neutral-900/50 p-6 space-y-6">
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

            <div className="flex gap-2">
              <button
                type="button"
                onClick={checkStatus}
                disabled={loading}
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
        </ModuleLayout>
      </div>
    </main>
  )
}
