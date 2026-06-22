'use client'

import React from 'react'

export default function GitHubAuthPage() {
  const handleAuthorize = () => {
    if (typeof window !== 'undefined' && window.opener) {
      window.opener.postMessage({ type: 'GITHUB_AUTH_SUCCESS' }, window.location.origin)
      window.close()
    }
  }

  const handleCancel = () => {
    if (typeof window !== 'undefined') {
      window.close()
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f8fa] text-[#24292f] font-sans flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md border border-[#d0d7de] bg-white p-6 shadow-sm space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#d0d7de] pb-4">
          <div className="flex items-center gap-2">
            <svg className="h-8 w-8 text-[#24292f]" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 01-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.35 3.12.91 0 .68.01 1.24.01 1.41 0 .21-.16.47-.55.38A8.013 8.013 0 010 8c0-4.42 3.58-8 8-8z" />
            </svg>
            <span className="text-sm font-semibold">GitHub OAuth</span>
          </div>
          <span className="text-xs text-[#57606a]">Step 1 of 1</span>
        </div>

        {/* Integration flow visuals */}
        <div className="flex items-center justify-center gap-6 py-4">
          <div className="h-14 w-14 border border-[#d0d7de] bg-[#f6f8fa] flex items-center justify-center font-bold text-lg text-[#24292f]">
            AM
          </div>
          <div className="text-[#57606a]">➔</div>
          <div className="h-14 w-14 border border-teal-500 bg-teal-50 flex items-center justify-center font-bold text-lg text-teal-600">
            M
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold text-[#24292f]">Authorize MTHAN.NET Console</h2>
          <p className="text-xs text-[#57606a]">
            by <span className="font-semibold text-[#24292f]">antoine-mai</span>
          </p>
        </div>

        {/* Permissions */}
        <div className="border-t border-b border-[#d0d7de] py-4 space-y-3 text-xs text-[#57606a]">
          <p className="font-semibold text-[#24292f]">This application will be able to:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-1">
            <li>Read access to public repositories (including metadata, code)</li>
            <li>Access your personal info (profile name, avatar, email)</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleAuthorize}
            className="w-full h-10 border border-[#1a7f37] bg-[#2da44e] hover:bg-[#2c974b] text-white font-semibold text-xs tracking-wide uppercase transition"
          >
            Authorize antoine-mai
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="w-full h-10 border border-[#d0d7de] bg-[#f6f8fa] hover:bg-[#f3f4f6] text-[#24292f] font-semibold text-xs tracking-wide uppercase transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  )
}
