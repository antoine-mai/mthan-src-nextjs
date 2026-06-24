import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAdminPath } from '@/_utils/dotenv'
import { getLoginPathFromDb } from '@/_utils/db-config'
import { guardPage } from '@/_utils/guard'
import { getModulePage, getAdminModuleSettings } from '@/_modules/registry'
import { Local, Login } from '@/_components'

interface PageProps {
  params: Promise<{ slug?: string[] }>
}

const getDefaultApplicationsDir = () => {
  if (process.platform === 'linux') {
    return 'htdocs'
  }

  return '../apps'
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const adminPath = getAdminPath()
  const loginPath = await getLoginPathFromDb()

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  // 1. Check if it's the public user login route (configured dynamically via database)
  if (slug && slug.length === 1 && slug[0] === loginPath) {
    return {
      title: 'Console Login'
    }
  }

  // 2. Check if it's an admin route (e.g. starting with /[admin_path])
  if (slug && slug[0] === adminPath) {
    const adminSlug = slug.slice(1)

    // A. Root admin page "/[adminPath]"
    if (adminSlug.length === 0) {
      return {
        title: 'Dashboard Overview - Admin Console'
      }
    }

    // B. "/[adminPath]/system/*"
    if (adminSlug[0] === 'system') {
      if (adminSlug.length === 2) {
        if (adminSlug[1] === 'settings') {
          return {
            title: 'System Settings - Admin Console'
          }
        }
        if (adminSlug[1] === 'environment') {
          return {
            title: 'Environment Config - Admin Console'
          }
        }
      }
    }

    // D. Other direct admin pages
    if (adminSlug.length === 1) {
      const route = adminSlug[0]
      if (route === 'login') {
        return {
          title: 'Admin Login - Admin Console'
        }
      }
      if (route === 'workflows') {
        return {
          title: 'Workflows - Admin Console'
        }
      }
      if (route === 'modules') {
        return {
          title: 'Modules - Admin Console'
        }
      }
      if (route === 'databases') {
        return {
          title: 'Databases - Admin Console'
        }
      }
      if (route === 'storages') {
        return {
          title: 'Storages - Admin Console'
        }
      }
    }

    // E. Nested module settings routes (e.g. /[adminPath]/modules/[moduleKey])
    if (adminSlug.length === 3 && adminSlug[0] === 'modules') {
      const moduleKey = adminSlug[1]
      const subpage = adminSlug[2]
      if (moduleKey === 'apps' && subpage === 'settings') {
        return {
          title: 'Apps Settings - Admin Console'
        }
      }
    }

    if (adminSlug.length === 2 && adminSlug[0] === 'modules') {
      const moduleKey = adminSlug[1]
      if (moduleKey === 'apps') {
        return {
          title: 'Apps - Admin Console'
        }
      }
      const settingsModule = getAdminModuleSettings(moduleKey)
      if (settingsModule) {
        return {
          title: `${capitalize(moduleKey)} Settings - Admin Console`
        }
      }
    }
  }

  // 2. Regular user pages
  const route = slug ? slug.join('/') : ''
  const importFn = getModulePage(route)
  if (importFn !== null) {
    return {
      title: `${capitalize(route || 'Home')} - Console Platform`
    }
  }

  return {
    title: 'Not Found - Console Platform'
  }
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

    // B. "/[adminPath]/system/*"
    if (adminSlug[0] === 'system') {
      if (adminSlug.length === 2) {
        // "/[adminPath]/system/settings"
        if (adminSlug[1] === 'settings') {
          return (
            <Local.Layout adminPath={adminPath}>
              <Local.Settings adminPath={adminPath} />
            </Local.Layout>
          )
        }

        // "/[adminPath]/system/environment"
        if (adminSlug[1] === 'environment') {
          return (
            <Local.Layout adminPath={adminPath}>
              <Local.Environment adminPath={adminPath} />
            </Local.Layout>
          )
        }
      }

      notFound()
    }

    // D. Other direct admin pages
    if (adminSlug.length === 1) {
      const route = adminSlug[0]
      if (route === 'login') {
        return <Local.Login adminPath={adminPath} />
      }

      if (route === 'workflows') {
        return (
          <Local.Layout adminPath={adminPath}>
            <Local.Workflows />
          </Local.Layout>
        )
      }

      if (route === 'modules') {
        return (
          <Local.Layout adminPath={adminPath}>
            <Local.Modules adminPath={adminPath} />
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

    // F. Nested module subroutes (e.g. /[adminPath]/modules/apps/settings)
    if (adminSlug.length === 3 && adminSlug[0] === 'modules') {
      const moduleKey = adminSlug[1]
      const subpage = adminSlug[2]
      if (moduleKey === 'apps' && subpage === 'settings') {
        const settingsModule = getAdminModuleSettings(moduleKey)
        if (settingsModule) {
          let Component
          try {
            const loaded = await settingsModule.importFn()
            Component = loaded.default
          } catch (error) {
            console.error(`Failed to dynamically load settings for module: ${moduleKey}`, error)
            notFound()
          }
          return (
            <Local.Layout adminPath={adminPath}>
              <Component adminPath={adminPath} />
            </Local.Layout>
          )
        }
      }
      notFound()
    }

    // E. Nested module settings routes (e.g. /[adminPath]/modules/[moduleKey])
    if (adminSlug.length === 2 && adminSlug[0] === 'modules') {
      const moduleKey = adminSlug[1]

      if (moduleKey === 'apps') {
        const importFn = getModulePage('apps')
        if (importFn) {
          let Component
          try {
            const loaded = await importFn()
            Component = loaded.default
          } catch (error) {
            console.error(`Failed to dynamically load index for module: ${moduleKey}`, error)
            notFound()
          }
          return (
            <Local.Layout adminPath={adminPath}>
              <Component adminPath={adminPath} defaultApplicationsDir={getDefaultApplicationsDir()} />
            </Local.Layout>
          )
        }
      }

      const settingsModule = getAdminModuleSettings(moduleKey)
      if (settingsModule) {
        let Component
        try {
          const loaded = await settingsModule.importFn()
          Component = loaded.default
        } catch (error) {
          console.error(`Failed to dynamically load settings for module: ${moduleKey}`, error)
          notFound()
        }
        return (
          <Local.Layout adminPath={adminPath}>
            <Component adminPath={adminPath} />
          </Local.Layout>
        )
      }
      notFound()
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

  return <Component adminPath={adminPath} />
}
