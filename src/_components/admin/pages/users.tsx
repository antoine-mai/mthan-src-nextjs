import React from 'react'
import { AdminUser } from '../_utils/types'

export default function AdminUsers() {
  const users: AdminUser[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', joinedDate: '2026-01-10' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Moderator', status: 'Active', joinedDate: '2026-02-14' },
    { id: '3', name: 'Alice Cooper', email: 'alice@example.com', role: 'User', status: 'Suspended', joinedDate: '2026-03-21' },
    { id: '4', name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Pending', joinedDate: '2026-04-05' },
    { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'Active', joinedDate: '2026-05-18' }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-100">User Management</h2>
      <div className="bg-slate-900/40 border border-slate-800 backdrop-blur-md p-6 shadow-xl space-y-6">
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative max-w-xs w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">🔍</span>
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
          <button className="self-start sm:self-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 transition">
            + Add New User
          </button>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 font-semibold">
                <th className="pb-3">User</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Joined Date</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {users.map((user) => (
                <tr key={user.id} className="text-slate-300 hover:bg-slate-800/10 transition">
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 shadow">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200">{user.name}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`text-xs px-2.5 py-1 font-medium border ${
                      user.role === 'Admin'
                        ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                        : user.role === 'Moderator'
                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                        : 'bg-slate-800 border-slate-750 text-slate-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 inline-block ${
                      user.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : user.status === 'Pending'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 text-slate-400 text-sm">{user.joinedDate}</td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition">
                        Edit
                      </button>
                      <button className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium transition border border-rose-500/20">
                        Suspend
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
