export function resolveAdminPath(adminPath?: string) {
  if (adminPath) return adminPath

  if (typeof window !== 'undefined') {
    const segments = window.location.pathname.split('/')
    return segments[1] || 'admin'
  }

  return 'admin'
}
