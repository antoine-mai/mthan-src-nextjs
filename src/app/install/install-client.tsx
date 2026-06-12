'use client'

import React, { useState } from 'react'

export default function InstallClient() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [setupSuccess, setSetupSuccess] = useState(false)
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' })

  // Form values corresponding to the 3 .env admin variables
  const [adminPath, setAdminPath] = useState('admin')
  const [adminUser, setAdminUser] = useState('admin')
  const [adminPass, setAdminPass] = useState('')

  const handleCompleteSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    setStatusMessage({ type: '', text: '' })

    try {
      const res = await fetch('/api/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'initialize',
          adminPath,
          adminUser,
          adminPass
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to complete platform setup')

      setSetupSuccess(true)
      setStatusMessage({ type: 'success', text: 'Platform configured successfully!' })
      
      // Delay redirection slightly so the user sees the success state
      setTimeout(() => {
        window.location.href = `/${adminPath}`
      }, 2000)
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message })
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-30%] right-[-20%] w-[60%] h-[60%] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-30%] left-[-20%] w-[60%] h-[60%] bg-violet-600/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-xl w-full z-10 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-200 to-teal-400">
            Platform Setup Wizard
          </h1>
          <p className="text-slate-400 text-xs md:text-sm">
            Initialize your modular application environment and dynamic security parameters
          </p>
        </div>

        {/* Setup Form */}
        {!setupSuccess ? (
          <form onSubmit={handleCompleteSetup} className="space-y-6">
            <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-6 shadow-2xl space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800/60 pb-3">
                Administrative Configurations (.env)
              </h3>

              <div className="space-y-4">
                {/* Admin Path */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Admin Area Path Segment</label>
                  <div className="flex overflow-hidden border border-slate-800 bg-slate-950 focus-within:border-indigo-500 transition duration-300">
                    <span className="bg-slate-900 px-3 py-2.5 text-xs md:text-sm text-slate-500 select-none border-r border-slate-800 font-mono">
                      /
                    </span>
                    <input
                      type="text"
                      required
                      pattern="[a-z0-9-]+"
                      value={adminPath}
                      onChange={(e) => setAdminPath(e.target.value.toLowerCase())}
                      placeholder="e.g. admin, backend"
                      className="w-full px-4 py-2 bg-transparent text-xs md:text-sm text-slate-200 focus:outline-none font-mono"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Defines the URL prefix for control panel (written to <code className="text-violet-400 font-mono">ADMIN_PATH</code>).
                  </p>
                </div>

                {/* Admin Username */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Admin Username</label>
                  <input
                    type="text"
                    required
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    placeholder="e.g. admin"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                  />
                  <p className="text-[10px] text-slate-500">
                    Username to log in to the admin workspace (written to <code className="text-violet-400 font-mono">ADMIN_USER</code>).
                  </p>
                </div>

                {/* Admin Password */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Admin Password</label>
                  <input
                    type="password"
                    required
                    minLength={5}
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                  />
                  <p className="text-[10px] text-slate-500">
                    Minimum 5 characters (written to <code className="text-violet-400 font-mono">ADMIN_PASS</code>).
                  </p>
                </div>
              </div>
            </div>

            {/* Setup Actions */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition duration-300 text-xs md:text-sm"
              >
                {isSubmitting ? 'Saving Configuration & Running Migrations...' : 'Save Configuration & Initialize Database'}
              </button>
            </div>
          </form>
        ) : (
          /* Success Wizard Screen */
          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-8 shadow-2xl text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-3xl mx-auto animate-bounce">
              ✓
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-200">Platform Ready!</h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-md mx-auto">
                The setup wizard completed successfully. The environment file <code className="text-violet-400 font-mono">.env</code> is written, database structures seeded, and configuration locked.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/60 text-xs text-slate-500">
              Redirecting you to the dynamic administration panel <span className="text-indigo-400 font-semibold font-mono">/{adminPath}</span>...
            </div>
          </div>
        )}

        {/* Feedback Messages */}
        {statusMessage.text && !setupSuccess && (
          <div className={`p-4 border text-xs text-center z-10 transition duration-300 animate-fadeIn ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            {statusMessage.text}
          </div>
        )}
      </div>
    </main>
  )
}
