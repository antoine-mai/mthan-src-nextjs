'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { getUserLoginHooks } from '@/_modules/registry'

// Load hooks dynamically
const hookComponents = getUserLoginHooks().map((config) => ({
  id: config.id,
  slot: config.slot,
  Component: dynamic(() => config.importFn().then(mod => mod.default), {
    ssr: false,
    loading: () => <div className="animate-pulse bg-slate-900/30 h-10 border border-slate-800" />
  })
}))

export default function UserLogin() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-15%] right-[-15%] w-[45%] h-[45%] bg-teal-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-15%] w-[45%] h-[45%] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md z-10 space-y-6">
        {/* Top hooks */}
        {hookComponents.filter(h => h.slot === 'top').map(({ id, Component }) => (
          <Component key={id} />
        ))}

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-11 w-11 bg-gradient-to-tr from-teal-500 to-indigo-500 items-center justify-center font-bold text-lg text-white shadow-lg shadow-teal-500/20">
            M
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-xs">
            Sign in to access your user account
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/30 border border-slate-800/80 backdrop-blur-lg p-6 shadow-xl space-y-5">
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Email</label>
              <input
                type="email"
                placeholder="you@domain.com"
                className="w-full px-3 py-2 bg-slate-955/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-655 focus:outline-none focus:border-teal-500 transition"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-400">Password</label>
                <a href="#" className="text-xs text-teal-400 hover:text-teal-300 transition">Forgot password?</a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-slate-955/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-655 focus:outline-none focus:border-teal-500 transition"
              />
            </div>

            {/* Fields hooks */}
            {hookComponents.filter(h => h.slot === 'fields').map(({ id, Component }) => (
              <Component key={id} />
            ))}
          </div>

          <button
            onClick={() => { window.location.href = '/' }}
            className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white font-semibold shadow-md shadow-teal-500/10 transition duration-300 active:scale-[0.98] text-sm"
          >
            Sign In
          </button>

          {/* Actions hooks */}
          {hookComponents.filter(h => h.slot === 'actions').map(({ id, Component }) => (
            <Component key={id} />
          ))}
        </div>

        {/* Bottom hooks */}
        {hookComponents.filter(h => h.slot === 'bottom').map(({ id, Component }) => (
          <Component key={id} />
        ))}
      </div>
    </main>
  )
}
