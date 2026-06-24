import React from 'react'
import ModuleLayout from '@/_components/local/modules/module-layout'
import { resolveAdminPath } from '@/_components/local/modules/admin-path'

export default function WebsitesSettings({ adminPath: propAdminPath }: { adminPath?: string }) {
  const adminPath = resolveAdminPath(propAdminPath)

  return (
    <div className="space-y-6">
      <ModuleLayout
        title="Websites Settings"
        description="Configure global custom domains settings, reverse proxy parameters, and SSL certificate provider."
        moduleKey="websites"
        settingsHref={`/${adminPath}/modules/websites`}
      >
        <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-6 shadow-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Hosting Provider</label>
              <select className="w-full px-4 py-2.5 bg-slate-955 border border-slate-800 text-sm text-slate-355 focus:outline-none focus:border-indigo-500 transition">
                <option>Vercel (Recommended)</option>
                <option>Cloudflare Pages</option>
                <option>AWS S3 / CloudFront</option>
                <option>Self-Hosted (Nginx Proxy)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Primary Nameserver</label>
              <input
                type="text"
                defaultValue="ns1.platform-dns.net"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">SSL Certificate Renewal (days)</label>
              <input
                type="number"
                defaultValue={90}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">SSL Authority Provider</label>
              <select className="w-full px-4 py-2.5 bg-slate-955 border border-slate-800 text-sm text-slate-355 focus:outline-none focus:border-indigo-500 transition">
                <option>{"Let's Encrypt"}</option>
                <option>ZeroSSL</option>
                <option>Custom CA Authority</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
            <button className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition">
              Check Server Health
            </button>
            <button className="border border-[color-mix(in_srgb,var(--vscode-accent)_45%,transparent)] bg-[var(--vscode-block-background)] px-5 py-2.5 text-sm font-semibold text-[var(--vscode-accent)] transition hover:bg-[var(--vscode-list-hover-background)]">
              Save Domains Config
            </button>
          </div>
        </div>
      </ModuleLayout>
    </div>
  )
}
