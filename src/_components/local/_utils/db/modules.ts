import 'server-only'

import fs from 'fs'
import path from 'path'
import db from './index'
import { formatModuleDisplayName } from '../module-name'
import { apisRegistry, moduleSettingsRegistry, pagesRegistry } from '@/_modules/registry'

export type ModuleCatalogItem = {
  key: string
  displayName: string
  path: string
  category: string
  config: string
  status: 'Active' | 'Inactive'
  active: boolean
}

const modulesDir = path.join(process.cwd(), 'src', '_modules')
const componentModuleKeys = new Set(['docker', 'golang', 'nginx', 'nodejs', 'pm2'])

function readModuleFolders() {
  if (!fs.existsSync(modulesDir)) return []

  return fs
    .readdirSync(modulesDir)
    .filter((entry) => {
      if (entry.startsWith('_')) return false
      if (entry === 'registry.ts') return false
      const entryPath = path.join(modulesDir, entry)
      return fs.statSync(entryPath).isDirectory()
    })
    .filter((entry) => !componentModuleKeys.has(entry))
    .sort()
}

function getModuleCategory(key: string) {
  const settings = moduleSettingsRegistry[key]
  const category = [
    pagesRegistry[key] ? 'Page' : null,
    apisRegistry[key] ? 'API' : null,
    settings ? 'Settings' : null
  ].filter(Boolean)

  return category.join(', ') || 'None'
}

function getActiveModulePaths() {
  const rows = db.prepare("SELECT path FROM modules WHERE status = 'Active'").all() as { path: string }[]
  return new Set(rows.map((row) => row.path))
}

export function listModuleCatalog(): ModuleCatalogItem[] {
  const activePaths = getActiveModulePaths()

  return readModuleFolders().map((key) => {
    const displayName = formatModuleDisplayName(key)
    const category = getModuleCategory(key)
    const active = activePaths.has(key)

    return {
      key,
      displayName,
      path: key,
      category,
      config: JSON.stringify({
        displayName,
        category
      }),
      status: active ? 'Active' : 'Inactive',
      active
    }
  })
}

export function markModuleActive(modulePath: string) {
  if (componentModuleKeys.has(modulePath)) return null

  const moduleItem = listModuleCatalog().find((item) => item.path === modulePath)
  if (!moduleItem) return null

  db.prepare(
    `
    INSERT INTO modules (id, key, path, category, config, status)
    VALUES (@id, @key, @path, @category, @config, @status)
    ON CONFLICT(path) DO UPDATE SET
      key = excluded.key,
      category = excluded.category,
      config = excluded.config,
      status = excluded.status,
      modified = CURRENT_TIMESTAMP
  `
  ).run({
    id: moduleItem.path,
    key: moduleItem.key,
    path: moduleItem.path,
    category: moduleItem.category,
    config: moduleItem.config,
    status: 'Active'
  })

  return moduleItem
}

export function setModuleStatus(modulePath: string, active: boolean) {
  if (componentModuleKeys.has(modulePath)) return null

  const moduleItem = listModuleCatalog().find((item) => item.path === modulePath)
  if (!moduleItem) return null

  db.prepare(
    `
    INSERT INTO modules (id, key, path, category, config, status)
    VALUES (@id, @key, @path, @category, @config, @status)
    ON CONFLICT(path) DO UPDATE SET
      key = excluded.key,
      category = excluded.category,
      config = excluded.config,
      status = excluded.status,
      modified = CURRENT_TIMESTAMP
  `
  ).run({
    id: moduleItem.path,
    key: moduleItem.key,
    path: moduleItem.path,
    category: moduleItem.category,
    config: moduleItem.config,
    status: active ? 'Active' : 'Inactive'
  })

  return {
    ...moduleItem,
    status: active ? 'Active' : 'Inactive',
    active
  }
}
