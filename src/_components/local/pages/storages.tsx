import db from '../_utils/db'

interface StorageRow {
  id: string
  name: string
  driver: string
  location: string
  used: string
  files: string
  status: string
  locked: number
}

interface StorageItem {
  id: string
  name: string
  driver: string
  location: string
  used: string
  files: string
  status: string
  locked: boolean
}

function getStorages(): StorageItem[] {
  const rows = db.prepare(`
    SELECT id, name, driver, location, used, files, status, locked
    FROM storages
    ORDER BY CASE WHEN id = 'default' THEN 0 ELSE 1 END, name ASC
  `).all() as StorageRow[]

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    driver: row.driver,
    location: row.location,
    used: row.used,
    files: row.files,
    status: row.status,
    locked: row.locked === 1
  }))
}

const fallbackStorage: StorageItem = {
  id: 'default',
  name: 'Default Storage',
  driver: 'Filesystem',
  location: 'public/storage',
  used: 'System',
  files: 'Fallback',
  status: 'Mounted',
  locked: true
}

export default function LocalStorages() {
  const storages = getStorages()
  const defaultStorage = storages.find((storage) => storage.id === 'default') ?? fallbackStorage
  const metrics = [
    { label: 'Locations', value: storages.length.toString(), tone: 'text-slate-100' },
    { label: 'Protected', value: storages.filter((storage) => storage.locked).length.toString(), tone: 'text-sky-300' },
    { label: 'Mounted', value: storages.filter((storage) => storage.status === 'Mounted').length.toString(), tone: 'text-emerald-300' },
    { label: 'Driver', value: defaultStorage.driver, tone: 'text-indigo-300' }
  ]
  const mountedCount = storages.filter((storage) => storage.status === 'Mounted').length
  const protectedCount = storages.filter((storage) => storage.locked).length
  const idleCount = storages.filter((storage) => storage.status === 'Idle').length

  return (
    <div className="space-y-6">
      <header className="border-b border-slate-800 pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Storages</h2>
            <p className="mt-1 text-xs text-slate-500">
              Mounted storage registry and default file destination map.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800">
              Refresh
            </button>
            <button className="border border-[color-mix(in_srgb,var(--vscode-accent)_45%,transparent)] bg-[var(--vscode-block-background)] px-4 py-2 text-sm font-semibold text-[var(--vscode-accent)] transition hover:bg-[var(--vscode-list-hover-background)]">
              Add Storage
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

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="border border-slate-800 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full max-w-sm">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-bold text-slate-500">ST</span>
              <input
                type="text"
                placeholder="Search storages..."
                className="w-full border border-slate-800 bg-slate-950 py-2 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <button className="border border-slate-800 bg-slate-950 px-3 py-2 font-semibold text-slate-400 transition hover:text-slate-200">
                All
              </button>
              <button className="border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 font-semibold text-emerald-300">
                Mounted
              </button>
              <button className="border border-sky-500/20 bg-sky-500/10 px-3 py-2 font-semibold text-sky-300">
                Protected
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 font-semibold text-slate-500">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Driver</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Used</th>
                  <th className="pb-3">Files</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {storages.map((storage) => (
                  <tr key={storage.id} className="text-slate-300 transition hover:bg-slate-800/10">
                    <td className="py-4">
                      <div className="font-semibold text-slate-200">{storage.name}</div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <span>{storage.id}</span>
                        {storage.locked && (
                          <span className="border border-sky-500/20 bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-sky-400">
                            Default Fallback
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-slate-400">{storage.driver}</td>
                    <td className="py-4">
                      <code className="border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-400">
                        {storage.location}
                      </code>
                    </td>
                    <td className="py-4 text-slate-400">{storage.used}</td>
                    <td className="py-4 text-slate-400">{storage.files}</td>
                    <td className="py-4">
                      <span
                        className={`inline-block border px-2 py-0.5 text-[10px] font-bold uppercase ${
                          storage.status === 'Mounted'
                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                            : 'border-slate-700 bg-slate-800 text-slate-400'
                        }`}
                      >
                        {storage.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {storage.locked ? (
                        <span className="inline-block border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-400">
                          Locked
                        </span>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button className="bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300 transition hover:bg-slate-700">
                            Edit
                          </button>
                          <button className="border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-400 transition hover:bg-rose-500/20">
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="border border-sky-500/20 bg-sky-500/10 p-5">
            <div className="text-sm font-bold text-sky-200">Default Fallback</div>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-xs font-semibold text-sky-400">Storage</dt>
                <dd className="mt-1 text-slate-200">{defaultStorage.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-sky-400">Location</dt>
                <dd className="mt-1">
                  <code className="border border-sky-500/20 bg-slate-950/80 px-2 py-1 text-xs text-sky-100">
                    {defaultStorage.location}
                  </code>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-sky-400">Protection</dt>
                <dd className="mt-1 text-slate-300">Edit and delete actions are disabled.</dd>
              </div>
            </dl>
          </div>

          <div className="border border-slate-800 bg-slate-900/40 p-5">
            <div className="text-sm font-bold text-slate-200">Usage Snapshot</div>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span>Mounted paths</span>
                <span className="font-semibold text-emerald-300">{mountedCount}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span>Protected paths</span>
                <span className="font-semibold text-sky-300">{protectedCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Idle paths</span>
                <span className="font-semibold text-slate-300">{idleCount}</span>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
