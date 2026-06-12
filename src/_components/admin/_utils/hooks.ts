import { useState, useEffect } from 'react'
import { adminService } from './service'
import { DashboardStats } from './types'

export function useAdminStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    adminService.getDashboardStats()
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err)
        setLoading(false)
      })
  }, [])

  return { stats, loading, error }
}
