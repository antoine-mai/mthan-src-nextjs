import fs from 'fs'
import path from 'path'

const envPath = path.join(process.cwd(), '.env')

export function readEnv(key: string, defaultValue: string = ''): string {
  try {
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

export function hasAdminInstallConfig(): boolean {
  try {
    if (!fs.existsSync(envPath)) {
      return false
    }

    const content = fs.readFileSync(envPath, 'utf8')
    return ['ADMIN_PATH', 'ADMIN_USER', 'ADMIN_PASS'].every(key => {
      const pattern = new RegExp(`^${key}=.+$`, 'm')
      return pattern.test(content)
    })
  } catch {
    return false
  }
}
