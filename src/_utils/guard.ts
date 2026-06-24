import { hasAdminInstallConfig } from './dotenv'
import { redirect } from 'next/navigation'

// Guards regular server pages: redirects to setup page if .env doesn't exist
export function guardPage() {
  if (!hasAdminInstallConfig()) {
    redirect('/install')
  }
}

// Guards the setup page: redirects back to home if .env already exists
export function guardInstallPage() {
  if (hasAdminInstallConfig()) {
    redirect('/')
  }
}

// Guards regular API endpoints: returns a 503 JSON response if .env doesn't exist
export function guardApi() {
  if (!hasAdminInstallConfig()) {
    return Response.json(
      { error: 'Service Unavailable', message: 'System is not configured. Please visit /install to set up.' },
      { status: 503 }
    )
  }
  return null
}

// Guards the installation API: returns a 403 Forbidden JSON response if .env already exists
export function guardInstallApi() {
  if (hasAdminInstallConfig()) {
    return Response.json(
      { error: 'Forbidden', message: 'System is already configured.' },
      { status: 403 }
    )
  }
  return null
}
