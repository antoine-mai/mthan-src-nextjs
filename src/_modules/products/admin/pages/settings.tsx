import React from 'react'

export default function ProductsSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-slate-900/40 border border-slate-800 backdrop-blur-md rounded-2xl p-6 shadow-xl space-y-6">
        <div>
          <h4 className="text-lg font-bold text-slate-100">Products Catalog Settings</h4>
          <p className="text-slate-500 text-xs mt-1">Configure default listing parameters, inventory alert thresholds, and pricing tax rates.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Inventory Alert Threshold</label>
            <input
              type="number"
              defaultValue={5}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Default Catalog Currency</label>
            <select className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm text-slate-350 focus:outline-none focus:border-indigo-500 transition">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>VND (₫)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Product Sales Tax Rate (%)</label>
            <input
              type="number"
              defaultValue={8}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Catalog Sorting Default</label>
            <select className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm text-slate-350 focus:outline-none focus:border-indigo-500 transition">
              <option>Popularity (Highest First)</option>
              <option>Price (Low to High)</option>
              <option>Price (High to Low)</option>
              <option>Newest Arrivals</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
          <button className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl transition">
            Reset Defaults
          </button>
          <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition">
            Save Catalog Config
          </button>
        </div>
      </div>
    </div>
  )
}
