import { DashboardStats } from './types'
import { getAdminPath } from '@/_utils/dotenv'

const getContextAdminPath = () => {
  if (typeof window !== 'undefined') {
    const segments = window.location.pathname.split('/')
    return segments[1] || 'admin'
  }
  return getAdminPath()
}

export const localService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const adminPath = getContextAdminPath()
    const res = await fetch(`/${adminPath}/api`)
    if (!res.ok) throw new Error('Failed to fetch dashboard stats')
    const data = await res.json()
    return data.stats
  },

  async getSystemDiagnostics() {
    const adminPath = getContextAdminPath()
    const res = await fetch(`/${adminPath}/api/stats`)
    if (!res.ok) throw new Error('Failed to fetch diagnostics')
    const data = await res.json()
    return data.system
  }
}
