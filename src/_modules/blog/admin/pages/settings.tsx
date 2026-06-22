export default function BlogSettings() {
  return (
    <div className="space-y-6">
      <div className="border border-slate-800 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md">
        <div>
          <h4 className="text-lg font-bold text-slate-100">Blog Settings</h4>
          <p className="mt-1 text-xs text-slate-500">
            Configure editorial defaults, publishing state, and post listing behavior.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Default Post Status</label>
            <select className="w-full border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 transition focus:border-sky-500 focus:outline-none">
              <option>Draft</option>
              <option>Published</option>
              <option>Scheduled</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Posts Per Page</label>
            <input
              type="number"
              defaultValue={10}
              className="w-full border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 transition focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Default Author Name</label>
            <input
              type="text"
              defaultValue="Admin Team"
              className="w-full border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 transition focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Featured Category</label>
            <select className="w-full border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 transition focus:border-sky-500 focus:outline-none">
              <option>Architecture</option>
              <option>Engineering</option>
              <option>Workflow</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-800/80 pt-4">
          <button className="bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-700">
            Reset Defaults
          </button>
          <button className="border border-[color-mix(in_srgb,var(--vscode-accent)_45%,transparent)] bg-[var(--vscode-block-background)] px-5 py-2.5 text-sm font-semibold text-[var(--vscode-accent)] transition hover:bg-[var(--vscode-list-hover-background)]">
            Save Blog Config
          </button>
        </div>
      </div>
    </div>
  )
}
