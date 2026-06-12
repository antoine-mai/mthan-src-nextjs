import React from 'react'

interface NavbarProps {
  adminPath: string
}

export default function AdminNavbar({ adminPath }: NavbarProps) {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-end">
      {/* Right Action Icons */}
      <div className="flex items-center space-x-4">
        {/* API Stats Link */}
        <a
          href={`/${adminPath}/api/stats`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 hover:bg-indigo-500/20 transition"
        >
          View Live Stats API
        </a>

        {/* Status Indicator */}
        <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 border border-slate-700/50">
          <span className="h-2 w-2 bg-emerald-500 animate-pulse" />
          <span className="text-xs text-slate-300 font-medium">System Online</span>
        </div>
      </div>
    </header>
  )
}
