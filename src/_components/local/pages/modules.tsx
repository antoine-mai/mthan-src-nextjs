import { apisRegistry, moduleSettingsRegistry, pagesRegistry } from '@/_modules/registry'
import Link from '@/_components/link'

function getModules() {
  const moduleKeys = Array.from(new Set([
    ...Object.keys(pagesRegistry),
    ...Object.keys(apisRegistry),
    ...Object.keys(moduleSettingsRegistry)
  ])).sort()

  return moduleKeys.map((key) => {
    const settings = moduleSettingsRegistry[key]
    const surfaces = [
      pagesRegistry[key] ? 'Page' : null,
      apisRegistry[key] ? 'API' : null,
      settings ? 'Settings' : null
    ].filter(Boolean)

    return {
      key,
      label: settings?.label.replace(/ Config$/, '') ?? key,
      route: `/${key}`,
      surfaces: surfaces.join(', ') || 'None',
      status: 'Mounted'
    }
  })
}

export default function LocalModules({ adminPath }: { adminPath: string }) {
  const modules = getModules()
  const settingsCount = modules.filter((moduleItem) => moduleItem.surfaces.includes('Settings')).length

  const metrics = [
    { label: 'Modules', value: modules.length.toString(), tone: 'text-slate-100' },
    { label: 'Pages', value: modules.filter((moduleItem) => moduleItem.surfaces.includes('Page')).length.toString(), tone: 'text-sky-300' },
    { label: 'APIs', value: modules.filter((moduleItem) => moduleItem.surfaces.includes('API')).length.toString(), tone: 'text-emerald-300' },
    { label: 'Settings', value: settingsCount.toString(), tone: 'text-indigo-300' }
  ]

  return (
    <div className="space-y-6">
      <header className="border-b border-slate-800 pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Modules</h2>
            <p className="mt-1 text-xs text-slate-500">
              Registered page, API, and settings modules.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800">
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
                <th className="pb-3">Route</th>
                <th className="pb-3">Surfaces</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {modules.map((moduleItem) => (
                <tr key={moduleItem.key} className="text-slate-300 transition hover:bg-slate-800/10">
                  <td className="py-4">
                    <div className="font-semibold text-slate-200">{moduleItem.label}</div>
                    <div className="mt-1 text-xs text-slate-500">{moduleItem.key}</div>
                  </td>
                  <td className="py-4">
                    <code className="border border-slate-800 bg-slate-955 px-2 py-1 text-xs text-slate-400">
                      {moduleItem.route}
                    </code>
                  </td>
                  <td className="py-4 text-slate-400">{moduleItem.surfaces}</td>
                  <td className="py-4">
                    <span className="inline-block border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-400">
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
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
