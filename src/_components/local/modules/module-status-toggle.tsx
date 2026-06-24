'use client'

import { useEffect, useState } from 'react'

type ModuleStatusToggleProps = {
  moduleKey: string
  adminPath?: string
}

type ModuleCatalogItem = {
  key: string
  active: boolean
}

const getContextAdminPath = () => {
  if (typeof window !== 'undefined') {
    const segments = window.location.pathname.split('/')
    return segments[1] || 'admin'
  }

  return 'admin'
}

export default function ModuleStatusToggle({ moduleKey, adminPath }: ModuleStatusToggleProps) {
  const [active, setActive] = useState(false)
  const [busy, setBusy] = useState(false)

  const resolvedAdminPath = adminPath || getContextAdminPath()

  const loadStatus = async () => {
    try {
      const res = await fetch(`/${resolvedAdminPath}/api/modules`)
      if (!res.ok) return

      const data = await res.json()
      const modules = Array.isArray(data.modules) ? data.modules : []
      const current = modules.find((item: ModuleCatalogItem) => item.key === moduleKey)
      setActive(Boolean(current?.active))
    } catch {
      setActive(false)
    }
  }

  const toggle = async () => {
    setBusy(true)
    try {
      const res = await fetch(`/${resolvedAdminPath}/api/modules`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: moduleKey,
          active: !active
        })
      })

      if (res.ok) {
        await loadStatus()
        window.dispatchEvent(
          new CustomEvent('module-status-changed', {
            detail: { key: moduleKey }
          })
        )
      }
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    void loadStatus()
  }, [moduleKey, resolvedAdminPath])

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      disabled={busy}
      className={`inline-flex h-7 items-center justify-center border px-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] transition disabled:cursor-wait disabled:opacity-60 ${
        active
          ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/20'
          : 'border-slate-600 bg-slate-900 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
      }`}
    >
      {busy ? '...' : active ? 'Disable' : 'Enable'}
    </button>
  )
}
