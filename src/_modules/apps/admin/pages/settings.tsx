'use client'

import React, { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import AppsHeader from '../../_components/header'

interface SettingEntry {
  key: string
  value: string
}

interface SettingsResponse {
  status: string
  settings?: SettingEntry[]
  error?: string
}

const getContextAdminPath = (propPath?: string) => {
  if (propPath) return propPath
  if (typeof window !== 'undefined') {
    const segments = window.location.pathname.split('/')
    return segments[1] || 'admin'
  }
  return 'admin'
}

export default function ApplicationsSettings({ adminPath: propAdminPath }: { adminPath?: string }) {
  const adminPath = getContextAdminPath(propAdminPath)
  const [appsDir, setAppsDir] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const response = await fetch(`/${adminPath}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'applications_dir',
          value: appsDir.trim()
        })
      })
      const data = await response.json() as SettingsResponse

      if (!response.ok || data.status !== 'success') {
        throw new Error(data.error || 'Failed to save configuration')
      }

      setMessage('Applications configuration saved successfully')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save configuration')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    let disposed = false

    async function loadInitialConfig() {
      try {
        const response = await fetch(`/${adminPath}/api/settings`)
        const data = await response.json() as SettingsResponse
        if (!disposed && response.ok && data.status === 'success') {
          const settings = data.settings ?? []
          const dirSetting = settings.find(s => s.key === 'applications_dir')
          setAppsDir(dirSetting ? dirSetting.value : '../apps')
        }
      } catch (loadError) {
        if (!disposed) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load configurations')
        }
      } finally {
        if (!disposed) {
          setLoading(false)
        }
      }
    }

    void loadInitialConfig()

    return () => {
      disposed = true
    }
  }, [adminPath])

  return (
    <div className="space-y-6">
      <AppsHeader
        adminPath={adminPath}
        currentPage="settings"
        title="Applications Configuration"
        description="Manage system execution defaults and working directories for external application tasks."
      />

      {(message || error) && (
        <div
          className={`border px-3 py-2 text-xs ${
            error
              ? 'border-rose-500/20 bg-rose-500/10 text-rose-400'
              : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
          }`}
        >
          {error || message}
        </div>
      )}

      <section className="border border-slate-800 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <h4 className="text-lg font-bold text-slate-100 font-mono">Applications Folder Options</h4>
            <p className="text-slate-500 text-xs mt-1">Configured settings will save to database settings table using applications_ prefix.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400">Applications Working Directory (applications_dir)</label>
              <input
                type="text"
                required
                value={appsDir}
                onChange={e => setAppsDir(e.target.value)}
                disabled={loading || saving}
                placeholder="../apps"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500 transition disabled:opacity-50"
              />
              <span className="block text-[10px] text-slate-500">
                Path on the host filesystem where deployed apps will be unzipped or cloned.
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
            <button
              type="submit"
              disabled={loading || saving}
              className="inline-flex h-9 items-center justify-center gap-2 border border-[color-mix(in_srgb,var(--vscode-accent)_45%,transparent)] bg-[var(--vscode-block-background)] px-4 text-xs font-semibold text-[var(--vscode-accent)] transition hover:bg-[var(--vscode-list-hover-background)] disabled:pointer-events-none disabled:opacity-50"
            >
              <Save className="h-4 w-4" aria-hidden="true" strokeWidth={1.8} />
              <span>{saving ? 'Saving...' : 'Save Config'}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
