'use client'

import React, { useEffect, useState } from 'react'
import AppsHeader, { Application } from '../_components/header'

const getContextAdminPath = () => {
  if (typeof window !== 'undefined') {
    const segments = window.location.pathname.split('/')
    return segments[1] || 'admin'
  }
  return 'admin'
}

export default function LocalApplications() {
  const adminPath = getContextAdminPath()
  const [appList, setAppList] = useState<Application[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const loadApps = () => {
    const stored = localStorage.getItem('apps_list')
    if (stored) {
      try {
        setAppList(JSON.parse(stored) as Application[])
      } catch (err) {
        console.error(err)
      }
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadApps()
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      <AppsHeader
        adminPath={adminPath}
        currentPage="list"
        title="Applications"
        description="Local application surfaces managed outside the module registry."
        isAddModalOpen={isAddModalOpen}
        onAddModalOpenChange={setIsAddModalOpen}
        onAppAdded={loadApps}
      />

      <section className="border border-slate-800 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-sm">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-bold text-slate-500">AP</span>
            <input
              type="text"
              placeholder="Search applications..."
              className="w-full border border-slate-800 bg-slate-955 py-2 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button className="border border-slate-800 bg-slate-955 px-3 py-2 font-semibold text-slate-400 transition hover:text-slate-200">
              All
            </button>
            <button className="border border-sky-500/20 bg-sky-500/10 px-3 py-2 font-semibold text-sky-300">
              Online
            </button>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="border border-[color-mix(in_srgb,var(--vscode-accent)_45%,transparent)] bg-[var(--vscode-block-background)] px-3 py-2 font-semibold text-[var(--vscode-accent)] transition hover:bg-[var(--vscode-list-hover-background)]"
            >
              Add Application
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 font-semibold text-slate-500">
                <th className="pb-3">Name</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Route</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {appList.map((application) => (
                <tr key={application.id} className="text-slate-300 transition hover:bg-slate-800/10">
                  <td className="py-4">
                    <div className="font-semibold text-slate-200">{application.name}</div>
                    <div className="mt-1 text-xs text-slate-500">{application.id}</div>
                  </td>
                  <td className="py-4 text-slate-400">{application.type}</td>
                  <td className="py-4">
                    <code className="border border-slate-800 bg-slate-955 px-2 py-1 text-xs text-slate-400 font-mono">
                      {application.route || '—'}
                    </code>
                  </td>
                  <td className="py-4">
                    <span
                      className="inline-block border border-sky-500/20 bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-sky-400"
                    >
                      {application.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300 transition hover:bg-slate-700">
                      Open
                    </button>
                  </td>
                </tr>
              ))}

              {appList.length === 0 && (
                <tr>
                  <td className="py-8 text-center text-sm text-slate-500" colSpan={5}>
                    No applications found. Click &quot;Add Application&quot; to get started.
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
