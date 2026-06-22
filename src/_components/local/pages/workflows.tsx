'use client'

import React, { useState } from 'react'
import { Play, RefreshCw, CheckCircle2, XCircle, Clock, Inbox } from 'lucide-react'

interface Workflow {
  id: string
  name: string
  description: string
  schedule: string
  lastRun: string
  status: 'Success' | 'Failed' | 'Running' | 'Scheduled'
}

export default function LocalWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(false)

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 800)
  }

  const handleTrigger = (id: string) => {
    setWorkflows(prev =>
      prev.map(wf => {
        if (wf.id === id) {
          return {
            ...wf,
            status: 'Running',
            lastRun: 'Triggered just now'
          }
        }
        return wf
      })
    )
  }

  const getStatusIndicator = (status: Workflow['status']) => {
    switch (status) {
      case 'Success':
        return (
          <span className="inline-flex items-center gap-1 border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-400">
            <CheckCircle2 className="h-3 w-3" strokeWidth={2} />
            Success
          </span>
        )
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1 border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-rose-400">
            <XCircle className="h-3 w-3" strokeWidth={2} />
            Failed
          </span>
        )
      case 'Running':
        return (
          <span className="inline-flex items-center gap-1 border border-sky-500/20 bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-sky-400 animate-pulse">
            <RefreshCw className="h-3 w-3 animate-spin" strokeWidth={2} />
            Running
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 border border-slate-700 bg-slate-800/40 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-400">
            <Clock className="h-3 w-3" strokeWidth={2} />
            Scheduled
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-slate-800 pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Workflows</h2>
            <p className="mt-1 text-xs text-slate-500">
              Automated operations, background scripts, and scheduled maintenance pipelines.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex h-9 items-center justify-center gap-2 border border-slate-800 bg-slate-900 px-4 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" strokeWidth={1.8} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </header>

      <section className="border border-slate-800 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md">
        {workflows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center border border-slate-800 bg-slate-950 text-slate-500">
              <Inbox className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-200">No workflows configured</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                There are no active automated workflows or maintenance pipelines configured for this node.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 font-semibold text-slate-500">
                  <th className="pb-3">Workflow Name</th>
                  <th className="pb-3">Schedule</th>
                  <th className="pb-3">Last Run</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {workflows.map((wf) => (
                  <tr key={wf.id} className="text-slate-300 transition hover:bg-slate-800/10">
                    <td className="py-4">
                      <div className="font-semibold text-slate-200">{wf.name}</div>
                      <div className="mt-1 text-xs text-slate-500">{wf.description}</div>
                    </td>
                    <td className="py-4 text-slate-400">{wf.schedule}</td>
                    <td className="py-4 text-slate-400">{wf.lastRun}</td>
                    <td className="py-4">{getStatusIndicator(wf.status)}</td>
                    <td className="py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleTrigger(wf.id)}
                        disabled={wf.status === 'Running'}
                        className="inline-flex h-8 items-center justify-center gap-1.5 border border-slate-800 bg-slate-900 px-3 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:pointer-events-none disabled:opacity-50"
                      >
                        <Play className="h-3 w-3" strokeWidth={2} />
                        <span>Trigger</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
