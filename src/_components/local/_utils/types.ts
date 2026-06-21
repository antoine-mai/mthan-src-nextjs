export interface LocalUser {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Moderator' | 'User'
  status: 'Active' | 'Suspended' | 'Pending'
  joinedDate: string
}

export interface DashboardStats {
  totalUsers: number
  activeSessions: number
  monthlyRevenue: number
  systemLoad: number
}
