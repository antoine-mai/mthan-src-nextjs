import React from 'react'
import AdminSidebar from './sidebar'
import AdminNavbar from './navbar'

export default function AdminLayout({ children, adminPath }: { children: React.ReactNode, adminPath: string }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <AdminSidebar adminPath={adminPath} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <AdminNavbar adminPath={adminPath} />

        {/* Dashboard/Page Body */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto overflow-x-hidden relative">
          {/* Background Ambient Lights */}
          <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto space-y-6 relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
