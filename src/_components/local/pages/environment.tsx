'use client'

import React, { FormEvent, useEffect, useState } from 'react'
import { Pencil, Plus, RefreshCw, Trash2, X } from 'lucide-react'

interface EnvEntry {
  key: string
  displayValue: string
  secret: boolean
  source: '.env'
}

interface EnvResponse {
  status: string
  env?: EnvEntry[]
  error?: string
}

type EnvModal =
  | { type: 'add' }
  | { type: 'edit'; item: EnvEntry }
  | { type: 'delete'; item: EnvEntry }
  | null

async function fetchEnvItems(adminPath: string) {
  const response = await fetch(`/${adminPath}/api/env`)
  const data = await response.json() as EnvResponse

  if (!response.ok || data.status !== 'success') {
    throw new Error(data.error || 'Failed to load environment values')
  }

  return data.env ?? []
}

export default function LocalEnvironment({ adminPath }: { adminPath: string }) {
  const [envItems, setEnvItems] = useState<EnvEntry[]>([])
  const [modal, setModal] = useState<EnvModal>(null)
  const [keyInput, setKeyInput] = useState('')
  const [valueInput, setValueInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadEnv = async () => {
    setLoading(true)
    setError('')

    try {
      setEnvItems(await fetchEnvItems(adminPath))
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load environment values')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let disposed = false

    async function loadInitialEnv() {
      try {
        const items = await fetchEnvItems(adminPath)

        if (!disposed) {
          setEnvItems(items)
        }
      } catch (loadError) {
        if (!disposed) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load environment values')
        }
      } finally {
        if (!disposed) {
          setLoading(false)
        }
      }
    }

    void loadInitialEnv()

    return () => {
      disposed = true
    }
  }, [adminPath])

  const openAddModal = () => {
    setKeyInput('')
    setValueInput('')
    setError('')
    setMessage('')
    setModal({ type: 'add' })
  }

  const openEditModal = (item: EnvEntry) => {
    setKeyInput(item.key)
    setValueInput(item.secret ? '' : item.displayValue)
    setError('')
    setMessage('')
    setModal({ type: 'edit', item })
  }

  const openDeleteModal = (item: EnvEntry) => {
    setKeyInput(item.key)
    setValueInput('')
    setError('')
    setMessage('')
    setModal({ type: 'delete', item })
  }

  const closeModal = () => {
    if (saving) {
      return
    }

    setModal(null)
    setKeyInput('')
    setValueInput('')
  }

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!modal || modal.type === 'delete') {
      return
    }

    setSaving(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch(`/${adminPath}/api/env`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: modal.type === 'edit' ? modal.item.key : keyInput,
          value: valueInput
        })
      })
      const data = await response.json() as EnvResponse

      if (!response.ok || data.status !== 'success') {
        throw new Error(data.error || 'Failed to save environment value')
      }

      setEnvItems(data.env ?? [])
      setMessage('Environment value saved')
      setModal(null)
      setKeyInput('')
      setValueInput('')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save environment value')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!modal || modal.type !== 'delete') {
      return
    }

    setSaving(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch(`/${adminPath}/api/env`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: modal.item.key
        })
      })
      const data = await response.json() as EnvResponse

      if (!response.ok || data.status !== 'success') {
        throw new Error(data.error || 'Failed to delete environment value')
      }

      setEnvItems(data.env ?? [])
      setMessage('Environment value deleted')
      setModal(null)
      setKeyInput('')
      setValueInput('')
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete environment value')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--vscode-border)] pb-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--vscode-editor-foreground)]">Environment</h2>
            <p className="mt-1 text-xs text-[var(--vscode-description-foreground)]">
              Runtime values stored in the local .env file.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex h-9 items-center justify-center gap-2 border border-[color-mix(in_srgb,var(--vscode-accent)_45%,transparent)] bg-[var(--vscode-block-background)] px-3 text-xs font-semibold text-[var(--vscode-accent)] transition hover:bg-[var(--vscode-list-hover-background)]"
            >
              <Plus className="h-4 w-4" aria-hidden="true" strokeWidth={1.8} />
              <span>Add</span>
            </button>
            <button
              type="button"
              onClick={loadEnv}
              disabled={loading}
              className="inline-flex h-9 items-center justify-center gap-2 border border-[var(--vscode-border)] bg-[var(--vscode-block-background)] px-3 text-xs font-semibold text-[var(--vscode-description-foreground)] transition hover:bg-[var(--vscode-list-hover-background)] hover:text-[var(--vscode-editor-foreground)] disabled:pointer-events-none disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" strokeWidth={1.8} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {(message || error) && (
        <div
          className={`border px-3 py-2 text-xs ${
            error
              ? 'border-[color-mix(in_srgb,var(--vscode-danger)_45%,transparent)] text-[var(--vscode-danger)]'
              : 'border-[color-mix(in_srgb,var(--vscode-accent)_35%,transparent)] text-[var(--vscode-accent)]'
          }`}
          aria-live="polite"
        >
          {error || message}
        </div>
      )}

      <section className="border border-[var(--vscode-border)] bg-[var(--vscode-block-background)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--vscode-border)] text-xs font-semibold uppercase text-[var(--vscode-description-foreground)]">
                <th className="px-4 py-3">Key</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--vscode-border)]">
              {envItems.map((item) => (
                <tr key={item.key}>
                  <td className="px-4 py-3 font-semibold text-[var(--vscode-editor-foreground)]">
                    {item.key}
                  </td>
                  <td className="px-4 py-3 text-[var(--vscode-description-foreground)]">
                    {item.displayValue || 'Empty'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="inline-flex h-8 items-center justify-center gap-2 border border-[var(--vscode-border)] px-3 text-xs font-semibold text-[var(--vscode-description-foreground)] transition hover:bg-[var(--vscode-list-hover-background)] hover:text-[var(--vscode-editor-foreground)]"
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={1.8} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openDeleteModal(item)}
                        className="inline-flex h-8 items-center justify-center gap-2 border border-[color-mix(in_srgb,var(--vscode-danger)_40%,transparent)] px-3 text-xs font-semibold text-[var(--vscode-danger)] transition hover:bg-[var(--vscode-list-hover-background)]"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={1.8} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && envItems.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-sm text-[var(--vscode-description-foreground)]" colSpan={3}>
                    No environment values found.
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td className="px-4 py-8 text-center text-sm text-[var(--vscode-description-foreground)]" colSpan={3}>
                    Loading environment values...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-6" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg border border-[var(--vscode-border)] bg-[var(--vscode-editor-background)] shadow-2xl">
            <div className="flex h-11 items-center justify-between border-b border-[var(--vscode-border)] px-4">
              <h3 className="text-sm font-semibold text-[var(--vscode-editor-foreground)]">
                {modal.type === 'add' ? 'Add Environment Value' : modal.type === 'edit' ? 'Edit Environment Value' : 'Delete Environment Value'}
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

            {modal.type === 'delete' ? (
              <div className="space-y-5 p-5">
                <p className="text-sm text-[var(--vscode-description-foreground)]">
                  Delete <code className="border border-[var(--vscode-border)] px-1.5 py-0.5 text-[var(--vscode-editor-foreground)]">{modal.item.key}</code> from .env?
                </p>
                <div className="flex justify-end gap-2 border-t border-[var(--vscode-border)] pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="h-9 border border-[var(--vscode-border)] px-4 text-xs font-semibold text-[var(--vscode-description-foreground)] transition hover:bg-[var(--vscode-list-hover-background)] hover:text-[var(--vscode-editor-foreground)] disabled:pointer-events-none disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={saving}
                    className="h-9 border border-[color-mix(in_srgb,var(--vscode-danger)_45%,transparent)] px-4 text-xs font-semibold text-[var(--vscode-danger)] transition hover:bg-[var(--vscode-list-hover-background)] disabled:pointer-events-none disabled:opacity-50"
                  >
                    {saving ? 'Deleting' : 'Delete'}
                  </button>
                </div>
              </div>
            ) : (
              <form className="space-y-5 p-5" onSubmit={handleSave}>
                <label className="block space-y-2">
                  <span className="text-xs font-semibold text-[var(--vscode-description-foreground)]">Key</span>
                  <input
                    type="text"
                    value={keyInput}
                    onChange={(event) => setKeyInput(event.target.value.toUpperCase())}
                    readOnly={modal.type === 'edit'}
                    required
                    placeholder="CUSTOM_KEY"
                    className="h-10 w-full border border-[var(--vscode-border)] bg-[var(--vscode-block-background)] px-3 text-sm text-[var(--vscode-editor-foreground)] placeholder-[var(--vscode-description-foreground)] transition focus:border-[var(--vscode-accent)] focus:outline-none read-only:text-[var(--vscode-description-foreground)]"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-xs font-semibold text-[var(--vscode-description-foreground)]">Value</span>
                  <input
                    type="text"
                    value={valueInput}
                    onChange={(event) => setValueInput(event.target.value)}
                    placeholder="Value"
                    className="h-10 w-full border border-[var(--vscode-border)] bg-[var(--vscode-block-background)] px-3 text-sm text-[var(--vscode-editor-foreground)] placeholder-[var(--vscode-description-foreground)] transition focus:border-[var(--vscode-accent)] focus:outline-none"
                  />
                </label>

                <div className="flex justify-end gap-2 border-t border-[var(--vscode-border)] pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="h-9 border border-[var(--vscode-border)] px-4 text-xs font-semibold text-[var(--vscode-description-foreground)] transition hover:bg-[var(--vscode-list-hover-background)] hover:text-[var(--vscode-editor-foreground)] disabled:pointer-events-none disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="h-9 border border-[color-mix(in_srgb,var(--vscode-accent)_45%,transparent)] px-4 text-xs font-semibold text-[var(--vscode-accent)] transition hover:bg-[var(--vscode-list-hover-background)] disabled:pointer-events-none disabled:opacity-50"
                  >
                    {saving ? 'Saving' : 'Save'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
