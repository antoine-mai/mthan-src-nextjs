import 'server-only'
import fs from 'fs'
import path from 'path'

export interface EnvEntry {
  key: string
  displayValue: string
  secret: boolean
  source: '.env'
}

const envLinePattern = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=(.*)$/

function getEnvPath() {
  return path.join(process.cwd(), '.env')
}

function isSecretKey(key: string) {
  return /(pass|password|secret|token|private|credential)/i.test(key)
}

function decodeEnvValue(rawValue: string) {
  const value = rawValue.trim()
  const quote = value[0]
  const hasMatchingQuotes = (quote === '"' || quote === "'") && value[value.length - 1] === quote

  if (!hasMatchingQuotes) {
    return value
  }

  return value
    .slice(1, -1)
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\')
}

function encodeEnvValue(value: string) {
  if (value === '') {
    return ''
  }

  if (/^[A-Za-z0-9_./:@%+-]+$/.test(value)) {
    return value
  }

  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

function toEnvEntry(key: string, value: string): EnvEntry {
  const secret = isSecretKey(key)

  return {
    key,
    displayValue: secret ? '********' : value,
    secret,
    source: '.env'
  }
}

export function readEnvFileEntries() {
  const envPath = getEnvPath()

  if (!fs.existsSync(envPath)) {
    return []
  }

  const content = fs.readFileSync(envPath, 'utf8')

  return content
    .split(/\r?\n/)
    .map((line) => {
      const match = line.match(envLinePattern)
      if (!match) {
        return null
      }

      return toEnvEntry(match[1], decodeEnvValue(match[2]))
    })
    .filter((entry): entry is EnvEntry => entry !== null)
}

export function upsertEnvFileValue(key: string, value: string) {
  const normalizedKey = key.trim()

  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(normalizedKey)) {
    throw new Error('Invalid environment key')
  }

  if (value.includes('\n') || value.includes('\r')) {
    throw new Error('Environment value cannot contain new lines')
  }

  const envPath = getEnvPath()
  const nextLine = `${normalizedKey}=${encodeEnvValue(value)}`
  const content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : ''
  const lines = content ? content.replace(/\r\n/g, '\n').split('\n') : []

  while (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop()
  }

  let didUpdate = false
  const nextLines = lines.map((line) => {
    const match = line.match(envLinePattern)

    if (match?.[1] !== normalizedKey) {
      return line
    }

    didUpdate = true
    return nextLine
  })

  if (!didUpdate) {
    nextLines.push(nextLine)
  }

  fs.writeFileSync(envPath, `${nextLines.join('\n')}\n`, 'utf8')

  return toEnvEntry(normalizedKey, value)
}

export function deleteEnvFileValue(key: string) {
  const normalizedKey = key.trim()

  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(normalizedKey)) {
    throw new Error('Invalid environment key')
  }

  const envPath = getEnvPath()

  if (!fs.existsSync(envPath)) {
    return
  }

  const content = fs.readFileSync(envPath, 'utf8')
  const lines = content.replace(/\r\n/g, '\n').split('\n')
  const nextLines = lines.filter((line) => {
    const match = line.match(envLinePattern)

    return match?.[1] !== normalizedKey
  })

  while (nextLines.length > 0 && nextLines[nextLines.length - 1] === '') {
    nextLines.pop()
  }

  fs.writeFileSync(envPath, nextLines.length > 0 ? `${nextLines.join('\n')}\n` : '', 'utf8')
}
