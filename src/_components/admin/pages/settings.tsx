import React from 'react'

export default function AdminSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-xl font-bold text-slate-100">System Settings</h2>
        {/* Module Settings Card */}
        <div className="bg-slate-900/40 border border-slate-800 backdrop-blur-md p-6 shadow-xl space-y-6">
          <div>
            <h4 className="text-lg font-bold text-slate-100">Dynamic Module Settings</h4>
            <p className="text-slate-500 text-xs mt-1">Configure parameters for routing and dynamic registry resolution.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Registry Cache TTL (seconds)</label>
              <input
                type="number"
                defaultValue={300}
                className="w-full px-4 py-2.5 bg-slate-955 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Default Auth Guard</label>
              <select className="w-full px-4 py-2.5 bg-slate-955 border border-slate-800 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition">
                <option>None (Public)</option>
                <option>JWT Cookie Guard</option>
                <option>API Token Authorization</option>
              </select>
            </div>
          </div>
        </div>

        {/* System Config Card */}
        <div className="bg-slate-900/40 border border-slate-800 backdrop-blur-md p-6 shadow-xl space-y-6">
          <div>
            <h4 className="text-lg font-bold text-slate-100">Global Configuration</h4>
            <p className="text-slate-500 text-xs mt-1">Manage system notifications and deployment options.</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-955/40 border border-slate-850/60">
              <div>
                <div className="text-sm font-semibold text-slate-200">Enable Hot Registry Reload</div>
                <div className="text-xs text-slate-500 mt-0.5">Allows updates in registry.ts to propagate instantly.</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 bg-slate-955 border-slate-800" />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-955/40 border border-slate-850/60">
              <div>
                <div className="text-sm font-semibold text-slate-200">Detailed API Logging</div>
                <div className="text-xs text-slate-500 mt-0.5">Log method, path, and duration for all module endpoints.</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 bg-slate-955 border-slate-800" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
            <button className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition">
              Reset Defaults
            </button>
            <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 transition">
              Save Configuration
            </button>
          </div>
        </div>
    </div>
  )
}
