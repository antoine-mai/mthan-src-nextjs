'use client'

import React, { useState } from 'react'
import { X, Upload, GitBranch, FolderUp, Globe } from 'lucide-react'
import GitHubConnect from '@/_components/github'
import Link from '@/_components/link'

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

export interface Application {
  id: string
  name: string
  type: string
  route: string
  status: string
}

interface AppsHeaderProps {
  adminPath: string
  currentPage: 'list' | 'settings'
  title: string
  description: string
  onAppAdded?: () => void
}

export default function AppsHeader({
  adminPath,
  currentPage,
  title,
  description,
  onAppAdded
}: AppsHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'upload' | 'clone' | 'github' | 'public'>('upload')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [appName, setAppName] = useState('')
  const [repoUrl, setRepoUrl] = useState('')
  const [repoBranch, setRepoBranch] = useState('main')
  const [uploadFileName, setUploadFileName] = useState('')
  const [githubConnected, setGithubConnected] = useState(false)
  const [selectedRepo, setSelectedRepo] = useState('')

  const publicTemplates: { name: string; desc: string }[] = []

  const githubRepos = [
    { name: 'mthan-src-nextjs', url: 'https://github.com/antoine/mthan-src-nextjs' },
    { name: 'ecommerce-template', url: 'https://github.com/antoine/ecommerce-template' },
    { name: 'personal-blog', url: 'https://github.com/antoine/personal-blog' }
  ]

  const handleSelectTemplate = (templateName: string) => {
    setSelectedTemplate(templateName)
    if (templateName) {
      setAppName(templateName)
    }
  }

  const handleSelectRepo = (repoName: string) => {
    setSelectedRepo(repoName)
    if (repoName) {
      setAppName(repoName)
    }
  }

  const handleRepoUrlChange = (url: string) => {
    setRepoUrl(url)
    if (url) {
      const parts = url.split('/')
      const lastPart = parts[parts.length - 1] || ''
      const repoName = lastPart.replace(/\.git$/, '')
      if (repoName) {
        setAppName(repoName)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadFileName(file.name)
      if (!appName) {
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
        setAppName(nameWithoutExt)
      }
    }
  }

  const closeModal = () => {
    setIsOpen(false)
    setAppName('')
    setRepoUrl('')
    setRepoBranch('main')
    setUploadFileName('')
    setSelectedRepo('')
    setSelectedTemplate('')
  }

  const handleAddApp = (e: React.FormEvent) => {
    e.preventDefault()

    const newApp: Application = {
      id: appName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: appName,
      type: activeTab === 'upload' ? 'Upload' : activeTab === 'clone' ? 'Git' : activeTab === 'github' ? 'GitHub' : 'Public',
      route: '',
      status: 'Online'
    }

    // Persist to localStorage
    const stored = localStorage.getItem('apps_list')
    let currentApps: Application[] = []
    if (stored) {
      try {
        currentApps = JSON.parse(stored) as Application[]
      } catch (err) {
        console.error(err)
      }
    }
    const updated = [...currentApps, newApp]
    localStorage.setItem('apps_list', JSON.stringify(updated))

    closeModal()
    if (onAppAdded) {
      onAppAdded()
    }
  }

  return (
    <>
      <header className="border-b border-slate-800 pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100">{title}</h2>
            <p className="mt-1 text-xs text-slate-500">{description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/${adminPath}/modules/apps`}
              className={`inline-flex h-9 items-center justify-center border border-slate-800 px-4 text-xs font-semibold transition ${
                currentPage === 'list'
                  ? 'bg-slate-950 text-slate-200 hover:bg-slate-900'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              Apps List
            </Link>
            <Link
              href={`/${adminPath}/modules/apps/settings`}
              className={`inline-flex h-9 items-center justify-center border border-slate-800 px-4 text-xs font-semibold transition ${
                currentPage === 'settings'
                  ? 'bg-slate-950 text-slate-200 hover:bg-slate-900'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              Settings
            </Link>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex h-9 items-center justify-center border border-[color-mix(in_srgb,var(--vscode-accent)_45%,transparent)] bg-[var(--vscode-block-background)] px-4 text-xs font-semibold text-[var(--vscode-accent)] transition hover:bg-[var(--vscode-list-hover-background)]"
            >
              Add Application
            </button>
          </div>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-6" role="dialog" aria-modal="true">
          <div className="w-full max-w-2xl border border-[var(--vscode-border)] bg-[var(--vscode-editor-background)] shadow-2xl">
            <div className="flex h-11 items-center justify-between border-b border-[var(--vscode-border)] px-4">
              <h3 className="text-sm font-semibold text-[var(--vscode-editor-foreground)]">
                Add Application
              </h3>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close modal"
                className="flex h-8 w-8 items-center justify-center border border-transparent text-[var(--vscode-description-foreground)] transition hover:border-[var(--vscode-border)] hover:bg-[var(--vscode-list-hover-background)] hover:text-[var(--vscode-editor-foreground)]"
              >
                <X className="h-4 w-4" aria-hidden="true" strokeWidth={1.8} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-[var(--vscode-border)] bg-[var(--vscode-side-bar-background)]">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex items-center gap-2 border-r border-[var(--vscode-border)] px-4 py-2.5 text-xs font-semibold transition ${
                  activeTab === 'upload'
                    ? 'border-t-2 border-t-[var(--vscode-accent)] bg-[var(--vscode-editor-background)] text-[var(--vscode-editor-foreground)]'
                    : 'text-[var(--vscode-description-foreground)] hover:bg-[var(--vscode-list-hover-background)] hover:text-[var(--vscode-editor-foreground)]'
                }`}
              >
                <FolderUp className="h-3.5 w-3.5" strokeWidth={1.8} />
                <span>Upload</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('clone')}
                className={`flex items-center gap-2 border-r border-[var(--vscode-border)] px-4 py-2.5 text-xs font-semibold transition ${
                  activeTab === 'clone'
                    ? 'border-t-2 border-t-[var(--vscode-accent)] bg-[var(--vscode-editor-background)] text-[var(--vscode-editor-foreground)]'
                    : 'text-[var(--vscode-description-foreground)] hover:bg-[var(--vscode-list-hover-background)] hover:text-[var(--vscode-editor-foreground)]'
                }`}
              >
                <GitBranch className="h-3.5 w-3.5" strokeWidth={1.8} />
                <span>Clone Repo</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('github')}
                className={`flex items-center gap-2 border-r border-[var(--vscode-border)] px-4 py-2.5 text-xs font-semibold transition ${
                  activeTab === 'github'
                    ? 'border-t-2 border-t-[var(--vscode-accent)] bg-[var(--vscode-editor-background)] text-[var(--vscode-editor-foreground)]'
                    : 'text-[var(--vscode-description-foreground)] hover:bg-[var(--vscode-list-hover-background)] hover:text-[var(--vscode-editor-foreground)]'
                }`}
              >
                <Github className="h-3.5 w-3.5" strokeWidth={1.8} />
                <span>GitHub</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('public')}
                className={`flex items-center gap-2 border-r border-[var(--vscode-border)] px-4 py-2.5 text-xs font-semibold transition ${
                  activeTab === 'public'
                    ? 'border-t-2 border-t-[var(--vscode-accent)] bg-[var(--vscode-editor-background)] text-[var(--vscode-editor-foreground)]'
                    : 'text-[var(--vscode-description-foreground)] hover:bg-[var(--vscode-list-hover-background)] hover:text-[var(--vscode-editor-foreground)]'
                }`}
              >
                <Globe className="h-3.5 w-3.5" strokeWidth={1.8} />
                <span>Public</span>
              </button>
            </div>

            <form onSubmit={handleAddApp} className="space-y-4 p-5">
              {activeTab === 'upload' && (
                <div className="space-y-3">
                  <span className="block text-xs font-semibold text-[var(--vscode-description-foreground)]">Upload Zip File</span>
                  <div className="relative flex flex-col items-center justify-center border border-dashed border-[var(--vscode-border)] bg-[var(--vscode-block-background)] p-8 text-center transition hover:border-[var(--vscode-accent)]">
                    <input
                      type="file"
                      accept=".zip"
                      onChange={handleFileChange}
                      required={!uploadFileName}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    <Upload className="mb-2 h-8 w-8 text-[var(--vscode-description-foreground)]" strokeWidth={1.5} />
                    {uploadFileName ? (
                      <span className="text-sm font-semibold text-[var(--vscode-editor-foreground)]">
                        {uploadFileName}
                      </span>
                    ) : (
                      <>
                        <span className="text-sm font-semibold text-[var(--vscode-editor-foreground)]">
                          Click or drag file to upload
                        </span>
                        <span className="mt-1 text-xs text-[var(--vscode-description-foreground)]">
                          ZIP files only
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'clone' && (
                <div className="space-y-4">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-[var(--vscode-description-foreground)]">Repository URL</span>
                    <input
                      type="url"
                      value={repoUrl}
                      onChange={(e) => handleRepoUrlChange(e.target.value)}
                      required
                      placeholder="https://github.com/username/repository"
                      className="h-10 w-full border border-[var(--vscode-border)] bg-[var(--vscode-block-background)] px-3 text-sm text-[var(--vscode-editor-foreground)] placeholder-[var(--vscode-description-foreground)] transition focus:border-[var(--vscode-accent)] focus:outline-none"
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-[var(--vscode-description-foreground)]">Branch</span>
                    <input
                      type="text"
                      value={repoBranch}
                      onChange={(e) => setRepoBranch(e.target.value)}
                      required
                      placeholder="main"
                      className="h-10 w-full border border-[var(--vscode-border)] bg-[var(--vscode-block-background)] px-3 text-sm text-[var(--vscode-editor-foreground)] placeholder-[var(--vscode-description-foreground)] transition focus:border-[var(--vscode-accent)] focus:outline-none"
                    />
                  </label>
                </div>
              )}

              {activeTab === 'github' && (
                <div className="space-y-4">
                  <GitHubConnect
                    connected={githubConnected}
                    onConnect={setGithubConnected}
                  />

                  {githubConnected && (
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <label className="block space-y-1.5 col-span-2">
                          <span className="text-xs font-semibold text-[var(--vscode-description-foreground)]">Select GitHub Repository</span>
                          <select
                            value={selectedRepo}
                            onChange={(e) => handleSelectRepo(e.target.value)}
                            required
                            className="h-10 w-full border border-[var(--vscode-border)] bg-[var(--vscode-block-background)] px-3 text-sm text-[var(--vscode-editor-foreground)] transition focus:border-[var(--vscode-accent)] focus:outline-none"
                          >
                            <option value="">-- Choose Repository --</option>
                            {githubRepos.map((repo) => (
                              <option key={repo.name} value={repo.name}>{repo.name}</option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <label className="block space-y-1.5">
                        <span className="text-xs font-semibold text-[var(--vscode-description-foreground)]">Branch</span>
                        <input
                          type="text"
                          value={repoBranch}
                          onChange={(e) => setRepoBranch(e.target.value)}
                          required
                          placeholder="main"
                          className="h-10 w-full border border-[var(--vscode-border)] bg-[var(--vscode-block-background)] px-3 text-sm text-[var(--vscode-editor-foreground)] placeholder-[var(--vscode-description-foreground)] transition focus:border-[var(--vscode-accent)] focus:outline-none"
                        />
                      </label>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'public' && (
                <div className="space-y-2">
                  <span className="block text-xs font-semibold text-[var(--vscode-description-foreground)]">Select Public Template</span>
                  <div className="max-h-60 overflow-y-auto border border-[var(--vscode-border)] bg-[var(--vscode-block-background)] divide-y divide-[var(--vscode-border)]">
                    {publicTemplates.map((tpl) => {
                      const isSelected = selectedTemplate === tpl.name
                      return (
                        <button
                          key={tpl.name}
                          type="button"
                          onClick={() => handleSelectTemplate(tpl.name)}
                          className={`w-full text-left p-3.5 transition block focus:outline-none ${
                            isSelected
                              ? 'bg-[var(--vscode-list-active-background)] text-[var(--vscode-editor-foreground)] border-l-2 border-l-[var(--vscode-accent)]'
                              : 'text-[var(--vscode-description-foreground)] hover:bg-[var(--vscode-list-hover-background)] hover:text-[var(--vscode-editor-foreground)]'
                          }`}
                        >
                          <div className="text-sm font-semibold">{tpl.name}</div>
                          <div className="text-xs text-[color-mix(in_srgb,var(--vscode-description-foreground)_80%,transparent)] mt-0.5 font-normal">
                            {tpl.desc}
                          </div>
                        </button>
                      )
                    })}
                    {publicTemplates.length === 0 && (
                      <div className="p-8 text-center text-xs text-[var(--vscode-description-foreground)]">
                        No public templates found.
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 border-t border-[var(--vscode-border)] pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-9 border border-[var(--vscode-border)] px-4 text-xs font-semibold text-[var(--vscode-description-foreground)] transition hover:bg-[var(--vscode-list-hover-background)] hover:text-[var(--vscode-editor-foreground)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={(activeTab === 'github' && !githubConnected) || (activeTab === 'public' && !selectedTemplate)}
                  className="h-9 border border-[color-mix(in_srgb,var(--vscode-accent)_45%,transparent)] bg-[var(--vscode-block-background)] px-4 text-xs font-semibold text-[var(--vscode-accent)] transition hover:bg-[var(--vscode-list-hover-background)] disabled:pointer-events-none disabled:opacity-50"
                >
                  Add Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
