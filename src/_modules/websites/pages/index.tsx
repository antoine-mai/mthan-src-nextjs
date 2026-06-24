import React from 'react'
import ModuleLayout from '@/_components/local/modules/module-layout'
import { resolveAdminPath } from '@/_components/local/modules/admin-path'

export default function WebsitesPage({ adminPath: propAdminPath }: { adminPath?: string }) {
  const adminPath = resolveAdminPath(propAdminPath)

  const websites = [
    { id: 1, name: 'Creative Agency Portfolio', domain: 'creative-agency.com', type: 'Portfolio', status: 'Active' },
    { id: 2, name: 'Apex E-commerce Store', domain: 'apex-shop.net', type: 'E-commerce', status: 'Active' },
    { id: 3, name: 'SaaS Platform Documentation', domain: 'docs.saas-platform.io', type: 'Documentation', status: 'Draft' },
    { id: 4, name: 'Tech Blog & Newsletter', domain: 'tech-blog.dev', type: 'Blog', status: 'Suspended' }
  ]

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="max-w-4xl w-full z-10">
        <ModuleLayout
          title="Websites"
          description="Website listings, domains, and publishing state for the websites module."
          moduleKey="websites"
          settingsHref={`/${adminPath}/modules/websites`}
        >
          {/* Background gradients */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-600/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="space-y-8">
            {/* Websites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {websites.map((web) => (
                <div key={web.id} className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-6 shadow-xl space-y-3 hover:-translate-y-1 transition duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-slate-200">{web.name}</h3>
                      <a href={`https://${web.domain}`} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:underline mt-0.5 block">
                        {web.domain} ↗
                      </a>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                      web.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : web.status === 'Draft'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {web.status}
                    </span>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/60">
                    <span>Type: <strong>{web.type}</strong></span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <a
                href="/"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-slate-355 hover:text-white border border-slate-800 hover:border-slate-700 bg-slate-900/80 transition duration-300"
              >
                ← Back to Home Module
              </a>
            </div>
          </div>
        </ModuleLayout>
      </div>
    </main>
  )
}
