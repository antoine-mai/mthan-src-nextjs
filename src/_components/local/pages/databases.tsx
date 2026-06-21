import db from '../_utils/db'

interface DatabaseRow {
  id: string
  name: string
  engine: string
  path: string
  size: string
  status: string
  last_backup: string
  locked: number
}

interface DatabaseItem {
  id: string
  name: string
  engine: string
  path: string
  size: string
  status: string
  lastBackup: string
  locked: boolean
}

function getDatabases(): DatabaseItem[] {
  const rows = db.prepare(`
    SELECT id, name, engine, path, size, status, last_backup, locked
    FROM databases
    ORDER BY CASE WHEN id = 'default' THEN 0 ELSE 1 END, name ASC
  `).all() as DatabaseRow[]

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    engine: row.engine,
    path: row.path,
    size: row.size,
    status: row.status,
    lastBackup: row.last_backup,
    locked: row.locked === 1
  }))
}

const fallbackDatabase: DatabaseItem = {
  id: 'default',
  name: 'Default SQLite',
  engine: 'SQLite',
  path: '.data/db.sqlite',
  size: 'System',
  status: 'Online',
  lastBackup: 'Fallback',
  locked: true
}

export default function LocalDatabases() {
  const databases = getDatabases()
  const defaultDatabase = databases.find((database) => database.id === 'default') ?? fallbackDatabase
  const metrics = [
    { label: 'Registered', value: databases.length.toString(), tone: 'text-slate-100' },
    { label: 'Protected', value: databases.filter((database) => database.locked).length.toString(), tone: 'text-sky-300' },
    { label: 'Online', value: databases.filter((database) => database.status === 'Online').length.toString(), tone: 'text-emerald-300' },
    { label: 'Engine', value: defaultDatabase.engine, tone: 'text-indigo-300' }
  ]
  const writableCount = databases.filter((database) => !database.locked).length
  const protectedCount = databases.filter((database) => database.locked).length
  const pendingSyncCount = databases.filter((database) => database.status === 'Syncing').length

  return (
    <div className="space-y-6">
      <header className="border-b border-slate-800 pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Databases</h2>
            <p className="mt-1 text-xs text-slate-500">
              Runtime database registry and fallback connection map.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800">
              Refresh
            </button>
            <button className="border border-[color-mix(in_srgb,var(--vscode-accent)_45%,transparent)] bg-[var(--vscode-block-background)] px-4 py-2 text-sm font-semibold text-[var(--vscode-accent)] transition hover:bg-[var(--vscode-list-hover-background)]">
              Add Database
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
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-bold text-slate-500">DB</span>
              <input
                type="text"
                placeholder="Search databases..."
                className="w-full border border-slate-800 bg-slate-950 py-2 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <button className="border border-slate-800 bg-slate-950 px-3 py-2 font-semibold text-slate-400 transition hover:text-slate-200">
                All
              </button>
              <button className="border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 font-semibold text-emerald-300">
                Online
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
                  <th className="pb-3">Engine</th>
                  <th className="pb-3">Path</th>
                  <th className="pb-3">Size</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Last Backup</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {databases.map((database) => (
                  <tr key={database.id} className="text-slate-300 transition hover:bg-slate-800/10">
                    <td className="py-4">
                      <div className="font-semibold text-slate-200">{database.name}</div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <span>{database.id}</span>
                        {database.locked && (
                          <span className="border border-sky-500/20 bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-sky-400">
                            Default Fallback
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-slate-400">{database.engine}</td>
                    <td className="py-4">
                      <code className="border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-400">
                        {database.path}
                      </code>
                    </td>
                    <td className="py-4 text-slate-400">{database.size}</td>
                    <td className="py-4">
                      <span
                        className={`inline-block border px-2 py-0.5 text-[10px] font-bold uppercase ${
                          database.status === 'Online'
                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                            : database.status === 'Ready'
                              ? 'border-indigo-500/20 bg-indigo-500/10 text-indigo-400'
                              : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {database.status}
                      </span>
                    </td>
                    <td className="py-4 text-xs text-slate-500">{database.lastBackup}</td>
                    <td className="py-4 text-right">
                      {database.locked ? (
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
                <dt className="text-xs font-semibold text-sky-400">Database</dt>
                <dd className="mt-1 text-slate-200">{defaultDatabase.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-sky-400">Path</dt>
                <dd className="mt-1">
                  <code className="border border-sky-500/20 bg-slate-950/80 px-2 py-1 text-xs text-sky-100">
                    {defaultDatabase.path}
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
            <div className="text-sm font-bold text-slate-200">Health Snapshot</div>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span>Writable paths</span>
                <span className="font-semibold text-emerald-300">{writableCount}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span>Protected paths</span>
                <span className="font-semibold text-sky-300">{protectedCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Pending sync</span>
                <span className="font-semibold text-amber-300">{pendingSyncCount}</span>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
