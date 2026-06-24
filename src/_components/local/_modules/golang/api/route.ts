export async function GET() {
  try {
    const { exec } = await import('child_process')
    const { promisify } = await import('util')
    const os = await import('os')
    const path = await import('path')
    const fs = await import('fs')
    const execAsync = promisify(exec)

    // Check custom path first, then global go
    let goCmd = 'go'
    const localGoPath = path.join(os.homedir(), '.local', 'bin', 'go')
    if (fs.existsSync(localGoPath)) {
      goCmd = localGoPath
    }

    const { stdout } = await execAsync(`${goCmd} version`)
    return Response.json({
      status: 'success',
      active: true,
      version: stdout.trim(),
      output: stdout.trim(),
      command: `${goCmd} version`
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return Response.json({
      status: 'success',
      active: false,
      version: 'Not Installed',
      error: errorMessage,
      command: 'go version'
    })
  }
}

export async function POST() {
  try {
    const { exec } = await import('child_process')
    const { promisify } = await import('util')
    const os = await import('os')
    const path = await import('path')
    const execAsync = promisify(exec)

    const home = os.homedir()
    const arch = process.arch === 'arm64' ? 'arm64' : 'amd64'
    const version = '1.22.4'
    const tarName = `go${version}.linux-${arch}.tar.gz`
    const downloadUrl = `https://go.dev/dl/${tarName}`
    const tempTarPath = path.join(os.tmpdir(), tarName)
    const targetLibDir = path.join(home, '.local', 'lib')
    const targetBinDir = path.join(home, '.local', 'bin')

    const installCmd = `mkdir -p "${targetLibDir}" && mkdir -p "${targetBinDir}" && rm -rf "${targetLibDir}/go" && (curl -sL "${downloadUrl}" -o "${tempTarPath}" || wget -q "${downloadUrl}" -O "${tempTarPath}") && tar -xf "${tempTarPath}" -C "${targetLibDir}" && ln -sf "${targetLibDir}/go/bin/go" "${targetBinDir}/go" && ln -sf "${targetLibDir}/go/bin/gofmt" "${targetBinDir}/gofmt" && rm -f "${tempTarPath}"`

    await execAsync(installCmd)

    return Response.json({
      status: 'success',
      message: 'Golang installed successfully'
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return Response.json({
      status: 'error',
      error: errorMessage
    })
  }
}
