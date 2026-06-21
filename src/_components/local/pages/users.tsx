import { readEnv } from '@/_utils/dotenv'

export default function LocalUsers() {
  const adminUser = readEnv('ADMIN_USER', 'admin')
  const displayName = adminUser.includes('@') ? adminUser.split('@')[0] : adminUser
  const initials = displayName
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'AD'

  return (
    <div className="space-y-6">
      <header className="border-b border-slate-800 pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Admin Account</h2>
            <p className="mt-1 text-xs text-slate-500">
              Single administrator account loaded from environment configuration.
            </p>
          </div>
          <span className="self-start border border-sky-500/20 bg-sky-500/10 px-3 py-2 text-xs font-bold uppercase text-sky-300 lg:self-auto">
            Env Managed
          </span>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="border border-slate-800 bg-slate-900/40 p-4">
          <div className="text-xs font-medium text-slate-500">Accounts</div>
          <div className="mt-2 text-2xl font-bold text-slate-100">1</div>
        </div>
        <div className="border border-slate-800 bg-slate-900/40 p-4">
          <div className="text-xs font-medium text-slate-500">Role</div>
          <div className="mt-2 text-2xl font-bold text-indigo-300">Admin</div>
        </div>
        <div className="border border-slate-800 bg-slate-900/40 p-4">
          <div className="text-xs font-medium text-slate-500">Status</div>
          <div className="mt-2 text-2xl font-bold text-emerald-300">Active</div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="border border-slate-800 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200">Environment Account</h3>
              <p className="mt-1 text-xs text-slate-500">
                No additional admin users are stored in the application database.
              </p>
            </div>
            <span className="self-start border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-bold uppercase text-emerald-300 md:self-auto">
              Auth Enabled
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 font-semibold text-slate-500">
                  <th className="pb-3">Account</th>
                  <th className="pb-3">Source</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-slate-300 transition hover:bg-slate-800/10">
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center border border-slate-700 bg-slate-800 font-bold text-slate-300 shadow">
                        {initials}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200">{displayName}</div>
                        <div className="text-xs text-slate-500">{adminUser}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <code className="border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-400">
                      ADMIN_USER
                    </code>
                  </td>
                  <td className="py-4">
                    <span className="inline-block border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-300">
                      Admin
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="inline-block border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-400">
                      Active
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <span className="inline-block border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-400">
                      Locked
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="border border-sky-500/20 bg-sky-500/10 p-5">
            <div className="text-sm font-bold text-sky-200">Credential Source</div>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-xs font-semibold text-sky-400">Username</dt>
                <dd className="mt-1">
                  <code className="border border-sky-500/20 bg-slate-950/80 px-2 py-1 text-xs text-sky-100">
                    ADMIN_USER
                  </code>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-sky-400">Password</dt>
                <dd className="mt-1">
                  <code className="border border-sky-500/20 bg-slate-950/80 px-2 py-1 text-xs text-sky-100">
                    ADMIN_PASS
                  </code>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-sky-400">Protection</dt>
                <dd className="mt-1 text-slate-300">Database user mutations are disabled.</dd>
              </div>
            </dl>
          </div>
        </aside>
      </section>
    </div>
  )
}
