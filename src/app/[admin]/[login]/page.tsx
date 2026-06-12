import { notFound } from 'next/navigation'
import { getAdminPath } from '@/_utils/dotenv'
import { guardPage } from '@/_utils/guard'
import AdminLogin from '@/_components/admin/pages/login'

interface PageProps {
  params: Promise<{ admin: string; login: string }>
}

export default async function AdminLoginPage({ params }: PageProps) {
  guardPage()

  const { admin, login } = await params
  const adminPath = getAdminPath()

  // Verify that the requested prefix matches the dynamic admin path from .env
  // and the second dynamic segment is literally 'login'
  if (admin !== adminPath || login !== 'login') {
    notFound()
  }

  return <AdminLogin adminPath={adminPath} />
}
