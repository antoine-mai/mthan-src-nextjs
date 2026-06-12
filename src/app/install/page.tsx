import { guardInstallPage } from '@/_utils/guard'
import InstallClient from './install-client'

export default async function InstallPage() {
  guardInstallPage()

  return <InstallClient />
}
