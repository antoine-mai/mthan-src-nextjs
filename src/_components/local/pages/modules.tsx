'use client'

import { useEffect, useMemo, useState } from 'react'
import { Power } from 'lucide-react'
import Link from '@/_components/link'

type ModuleCatalogItem = {
  key: string
  displayName: string
  path: string
  category: string
  config: string
  status: 'Active' | 'Inactive'
  active: boolean
}

export default function LocalModules({ adminPath }: { adminPath: string }) {
  const [modules, setModules] = useState<ModuleCatalogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [busyKey, setBusyKey] = useState<string | null>(null)

  const loadModules = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/${adminPath}/api/modules`)
      const data = await res.json()
      const nextModules = Array.isArray(data.modules) ? data.modules : []
      setModules(nextModules)
    } catch {
      setModules([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadModules()
  }, [adminPath])

  const activeCount = useMemo(
    () => modules.filter((moduleItem) => moduleItem.active).length,
    [modules]
  )

  const metrics = [
    { label: 'Modules', value: modules.length.toString(), tone: 'text-slate-100' },
    { label: 'Active', value: activeCount.toString(), tone: 'text-emerald-300' },
    { label: 'Pages', value: modules.filter((moduleItem) => moduleItem.category.includes('Page')).length.toString(), tone: 'text-sky-300' },
    { label: 'Settings', value: modules.filter((moduleItem) => moduleItem.category.includes('Settings')).length.toString(), tone: 'text-indigo-300' }
  ]

  return (
    <div className="space-y-6">
      <header className="border-b border-slate-800 pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Modules</h2>
            <p className="mt-1 text-xs text-slate-500">
              Registered folder-backed page, API, and settings modules.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void loadModules()}
              className="border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
            >
              Refresh
            </button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="border border-slate-800 bg-slate-900/40 p-4">
            <div className="text-xs font-medium text-slate-500">{metric.label}</div>
            <div className={`mt-2 text-2xl font-bold ${metric.tone}`}>{metric.value}</div>
          </div>
        ))}
      </section>

      <section className="border border-slate-800 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-sm">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-bold text-slate-500">MD</span>
            <input
              type="text"
              placeholder="Search modules..."
              className="w-full border border-slate-800 bg-slate-950 py-2 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button className="border border-slate-800 bg-slate-955 px-3 py-2 font-semibold text-slate-400 transition hover:text-slate-200">
              All
            </button>
            <button className="border border-sky-500/20 bg-sky-500/10 px-3 py-2 font-semibold text-sky-300">
              Pages
            </button>
            <button className="border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 font-semibold text-emerald-300">
              APIs
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 font-semibold text-slate-500">
                <th className="pb-3">Module</th>
                <th className="pb-3">Path</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {modules.map((moduleItem) => (
                <tr key={moduleItem.key} className="text-slate-300 transition hover:bg-slate-800/10">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={busyKey === moduleItem.key}
                        onClick={async () => {
                          setBusyKey(moduleItem.key)
                          try {
                            await fetch(`/${adminPath}/api/modules`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                key: moduleItem.key,
                                active: !moduleItem.active
                              })
                            })
                            await loadModules()
                          } finally {
                            setBusyKey(null)
                          }
                        }}
                        className={`inline-flex min-w-[92px] items-center justify-center gap-1.5 border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] shadow-sm transition ${
                          moduleItem.active
                            ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/20'
                            : 'border-slate-600 bg-slate-900 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
                        } disabled:cursor-wait disabled:opacity-60`}
                      >
                        <Power className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                        {moduleItem.active ? 'Disable' : 'Enable'}
                      </button>
                      <div>
                        <div className="font-semibold text-slate-200">{moduleItem.displayName}</div>
                        <div className="mt-1 text-xs text-slate-500">{moduleItem.key}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <code className="border border-slate-800 bg-slate-955 px-2 py-1 text-xs text-slate-400">
                      {moduleItem.path}
                    </code>
                  </td>
                  <td className="py-4 text-slate-400">{moduleItem.category}</td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center border px-2 py-0.5 text-[10px] font-bold uppercase ${
                        moduleItem.active
                          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                          : 'border-slate-700 bg-slate-900 text-slate-500'
                      }`}
                    >
                      {moduleItem.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <Link
                      href={`/${adminPath}/modules/${moduleItem.key}`}
                      className="inline-flex h-7 items-center justify-center bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300 transition hover:bg-slate-700"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
              {loading && modules.length === 0 && (
                <tr>
                  <td className="py-8 text-center text-sm text-slate-500" colSpan={5}>
                    Loading modules...
                  </td>
                </tr>
              )}
              {!loading && modules.length === 0 && (
                <tr>
                  <td className="py-8 text-center text-sm text-slate-500" colSpan={5}>
                    No modules found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
