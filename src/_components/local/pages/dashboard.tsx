import React from 'react'

export default function LocalDashboard() {
  const stats = [
    { title: 'Applications', value: '4', change: '+1', trend: 'up', icon: 'AP' },
    { title: 'Mounted Modules', value: '12', change: '+2', trend: 'up', icon: 'MD' },
    { title: 'Active Sessions', value: '412', change: '+8.4%', trend: 'up', icon: 'SE' },
    { title: 'Monthly Revenue', value: '$12,480', change: '+24.1%', trend: 'up', icon: 'MR' },
    { title: 'System Load', value: '24.2%', change: '-3.1%', trend: 'down', icon: 'LD' }
  ]

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Created dynamic module "billing"', time: '2 mins ago', status: 'Success' },
    { id: 2, user: 'Jane Smith', action: 'Modified routing registry', time: '15 mins ago', status: 'Success' },
    { id: 3, user: 'Alice Cooper', action: 'Suspended user account #2394', time: '1 hour ago', status: 'Warning' },
    { id: 4, user: 'Bob Johnson', action: 'Failed login attempt from IP 192.168.1.4', time: '3 hours ago', status: 'Failed' }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[var(--vscode-editor-foreground)]">Dashboard Overview</h2>
      <div className="border border-[var(--vscode-border)] bg-[var(--vscode-block-background)] p-6 shadow-xl md:p-8">
        <div className="space-y-2">
          <h3 className="text-2xl font-extrabold tracking-tight text-[var(--vscode-editor-foreground)] md:text-3xl">
            Welcome back, Administrator
          </h3>
          <p className="max-w-2xl text-sm leading-relaxed text-[var(--vscode-description-foreground)] md:text-base">
            The platform is running smoothly. Your modules are successfully mounted and listening on dynamic catch-all hooks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="border border-[var(--vscode-border)] bg-[var(--vscode-block-background)] p-6 shadow-lg transition duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--vscode-description-foreground)]">{stat.title}</span>
              <span className="border border-[var(--vscode-border)] bg-[var(--vscode-block-background)] px-1.5 py-1 text-xs font-bold text-[var(--vscode-accent)]">{stat.icon}</span>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-bold tracking-tight text-[var(--vscode-editor-foreground)]">{stat.value}</span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 ${
                  stat.trend === 'up'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-rose-500/10 text-rose-400'
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 border border-slate-800 backdrop-blur-md p-6 lg:col-span-2 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold text-slate-100">Recent Audit Logs</h4>
            <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition">
              View All Logs
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 font-semibold">
                  <th className="pb-3">User</th>
                  <th className="pb-3">Action</th>
                  <th className="pb-3">Time</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {recentActivities.map((act) => (
                  <tr key={act.id} className="text-slate-300 hover:bg-slate-800/20 transition">
                    <td className="py-3.5 font-medium text-slate-200">{act.user}</td>
                    <td className="py-3.5 text-slate-400">{act.action}</td>
                    <td className="py-3.5 text-xs text-slate-500">{act.time}</td>
                    <td className="py-3.5 text-right">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 inline-block ${
                          act.status === 'Success'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : act.status === 'Warning'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {act.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 backdrop-blur-md p-6 shadow-xl space-y-6">
          <h4 className="text-lg font-bold text-slate-100">System Hook Diagnostics</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-400">
                <span>API Gateway Load</span>
                <span className="text-indigo-400 font-semibold">42 requests/sec</span>
              </div>
              <div className="w-full bg-slate-850 h-2 overflow-hidden">
                <div className="bg-indigo-500 h-full w-[45%]" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-400">
                <span>Page Handler Resolution</span>
                <span className="text-emerald-400 font-semibold">99.8% Success Rate</span>
              </div>
              <div className="w-full bg-slate-850 h-2 overflow-hidden">
                <div className="bg-emerald-500 h-full w-[99.8%]" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-400">
                <span>Page Cache Hit</span>
                <span className="text-indigo-400 font-semibold">87.5% Hit Rate</span>
              </div>
              <div className="w-full bg-slate-850 h-2 overflow-hidden">
                <div className="bg-indigo-500 h-full w-[87.5%]" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80">
            <div className="bg-indigo-950/20 border border-indigo-900/30 p-4 text-xs text-indigo-300 leading-relaxed">
              💡 <strong>Developer Tip:</strong> You can edit mapping configs dynamically at <code className="bg-indigo-950/60 px-1 py-0.5 border border-indigo-900/50">src/_modules/registry.ts</code> to mount/unmount routes on the fly.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
