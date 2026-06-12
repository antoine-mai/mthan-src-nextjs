import fs from 'fs'
import path from 'path'

export function readEnv(key: string, defaultValue: string = ''): string {
  try {
    const envPath = path.join(process.cwd(), '.env')
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8')
      const lines = content.split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith(`${key}=`)) {
          const value = line.substring(line.indexOf('=') + 1).trim()
          return value.replace(/['"]/g, '').trim()
        }
      }
    }
  } catch (error) {
    console.error(`Error reading ${key} from .env file:`, error)
  }
  return defaultValue
}

export function getAdminPath(): string {
  return readEnv('ADMIN_PATH', 'admin')
}

export function hasEnvFile(): boolean {
  try {
    const envPath = path.join(process.cwd(), '.env')
    return fs.existsSync(envPath)
  } catch {
    return false
  }
}
