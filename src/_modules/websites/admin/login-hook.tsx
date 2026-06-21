import React from 'react'

export default function WebsitesAdminLoginHook() {
  return (
    <div className="space-y-3 pt-2">
      <button
        type="button"
        onClick={() => alert('Mock Sign in with Google Workspace (Enterprise SSO) from Websites Module!')}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-slate-200 transition duration-200 active:scale-[0.98]"
      >
        <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.093-5.136 4.093-3.415 0-6.19-2.775-6.19-6.19s2.775-6.19 6.19-6.19c1.5 0 2.87.54 3.93 1.433l3.076-3.076C18.665 1.942 15.6 1 12.24 1 6.033 1 12.24 12.24s5.033 11.24 11.24 11.24c6.265 0 11.36-4.523 11.36-11.24 0-.665-.06-1.306-.18-1.955H12.24z"/>
        </svg>
        Sign in with Google Workspace (SSO)
      </button>
    </div>
  )
}
