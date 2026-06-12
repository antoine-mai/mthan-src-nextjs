import { notFound } from 'next/navigation'
import { getAdminPath } from '@/_utils/dotenv'
import { getLoginPathFromDb } from '@/_utils/db-config'
import { guardPage } from '@/_utils/guard'
import { getModulePage, getAdminModuleSettings } from '@/_modules/registry'
import AdminLayout from '@/_components/admin/layout'
import AdminDashboard from '@/_components/admin/pages/dashboard'
import AdminUsers from '@/_components/admin/pages/users'
import AdminSettings from '@/_components/admin/pages/settings'
import UserLogin from '@/_components/login'

interface PageProps {
  params: Promise<{ slug?: string[] }>
}

export default async function CatchAllPage({ params }: PageProps) {
  guardPage()

  const { slug } = await params
  const adminPath = getAdminPath()
  const loginPath = await getLoginPathFromDb()

  // 1. Check if it's the public user login route (configured dynamically via database)
  if (slug && slug.length === 1 && slug[0] === loginPath) {
    return <UserLogin />
  }

  // 2. Check if it's an admin route (e.g. starting with /[admin_path])
  if (slug && slug[0] === adminPath) {
    const adminSlug = slug.slice(1)

    // A. Root admin page "/[adminPath]"
    if (adminSlug.length === 0) {
      return (
        <AdminLayout adminPath={adminPath}>
          <AdminDashboard />
        </AdminLayout>
      )
    }

    // B. "/[adminPath]/settings/*"
    if (adminSlug[0] === 'settings') {
      if (adminSlug.length === 1) {
        // "/[adminPath]/settings"
        return (
          <AdminLayout adminPath={adminPath}>
            <AdminSettings />
          </AdminLayout>
        )
      }

      if (adminSlug.length === 2) {
        // "/[adminPath]/settings/[module]"
        const moduleKey = adminSlug[1]
        const config = getAdminModuleSettings(moduleKey)
        if (!config) notFound()
        const { default: Component } = await config.importFn()
        return (
          <AdminLayout adminPath={adminPath}>
            <div className="space-y-6">
              <Component />
            </div>
          </AdminLayout>
        )
      }

      notFound()
    }

    // D. Other direct admin pages like "/[adminPath]/users"
    if (adminSlug.length === 1) {
      const route = adminSlug[0]
      if (route === 'users') {
        return (
          <AdminLayout adminPath={adminPath}>
            <AdminUsers />
          </AdminLayout>
        )
      }
    }

    notFound()
  }

  // 2. Regular user pages
  const route = slug ? slug.join('/') : ''
  const importFn = getModulePage(route)
  if (!importFn) {
    notFound()
  }

  try {
    const { default: Component } = await importFn()
    return <Component />
  } catch (error) {
    console.error(`Failed to dynamically load module for route: /${route}`, error)
    notFound()
  }
}
