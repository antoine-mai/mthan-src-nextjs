import { notFound } from 'next/navigation'
import { getAdminPath } from '@/_utils/dotenv'
import { getLoginPathFromDb } from '@/_utils/db-config'
import { guardPage } from '@/_utils/guard'
import { getModulePage, getAdminModuleSettings } from '@/_modules/registry'
import { Local, Login } from '@/_components'

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
    return <Login />
  }

  // 2. Check if it's an admin route (e.g. starting with /[admin_path])
  if (slug && slug[0] === adminPath) {
    const adminSlug = slug.slice(1)

    // A. Root admin page "/[adminPath]"
    if (adminSlug.length === 0) {
      return (
        <Local.Layout adminPath={adminPath}>
          <Local.Dashboard />
        </Local.Layout>
      )
    }

    // B. "/[adminPath]/settings/*"
    if (adminSlug[0] === 'settings') {
      if (adminSlug.length === 1) {
        // "/[adminPath]/settings"
        return (
          <Local.Layout adminPath={adminPath}>
            <Local.Settings />
          </Local.Layout>
        )
      }

      if (adminSlug.length === 2) {
        // "/[adminPath]/settings/[module]"
        const moduleKey = adminSlug[1]
        const config = getAdminModuleSettings(moduleKey)
        if (!config) notFound()
        const { default: Component } = await config.importFn()
        return (
          <Local.Layout adminPath={adminPath}>
            <div className="space-y-6">
              <Component />
            </div>
          </Local.Layout>
        )
      }

      notFound()
    }

    // D. Other direct admin pages like "/[adminPath]/users"
    if (adminSlug.length === 1) {
      const route = adminSlug[0]
      if (route === 'login') {
        return <Local.Login adminPath={adminPath} />
      }

      if (route === 'users') {
        return (
          <Local.Layout adminPath={adminPath}>
            <Local.Users />
          </Local.Layout>
        )
      }

      if (route === 'databases') {
        return (
          <Local.Layout adminPath={adminPath}>
            <Local.Databases />
          </Local.Layout>
        )
      }

      if (route === 'storages') {
        return (
          <Local.Layout adminPath={adminPath}>
            <Local.Storages />
          </Local.Layout>
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

  let Component
  try {
    const modulePage = await importFn()
    Component = modulePage.default
  } catch (error) {
    console.error(`Failed to dynamically load module for route: /${route}`, error)
    notFound()
  }

  return <Component />
}
