export async function GET() {
  try {
    const { exec } = await import('child_process')
    const { promisify } = await import('util')
    const os = await import('os')
    const path = await import('path')
    const fs = await import('fs')
    const execAsync = promisify(exec)

    // Check custom path first, then global node
    let nodeCmd = 'node'
    const localNodePath = path.join(os.homedir(), '.local', 'bin', 'node')
    if (fs.existsSync(localNodePath)) {
      nodeCmd = localNodePath
    }

    const { stdout } = await execAsync(`${nodeCmd} -v`)
    return Response.json({
      status: 'success',
      active: true,
      version: stdout.trim(),
      output: stdout.trim(),
      command: `${nodeCmd} -v`
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return Response.json({
      status: 'success',
      active: false,
      version: 'Not Installed',
      error: errorMessage,
      command: 'node -v'
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
    const arch = process.arch === 'arm64' ? 'arm64' : 'x64'
    const version = 'v20.18.0'
    const tarName = `node-${version}-linux-${arch}.tar.xz`
    const downloadUrl = `https://nodejs.org/dist/${version}/${tarName}`
    const tempTarPath = path.join(os.tmpdir(), tarName)
    const targetLibDir = path.join(home, '.local', 'lib', 'nodejs', `node-${version}`)
    const targetBinDir = path.join(home, '.local', 'bin')

    const installCmd = `mkdir -p "${targetLibDir}" && mkdir -p "${targetBinDir}" && (curl -sL "${downloadUrl}" -o "${tempTarPath}" || wget -q "${downloadUrl}" -O "${tempTarPath}") && tar -xf "${tempTarPath}" -C "${targetLibDir}" --strip-components=1 && ln -sf "${targetLibDir}/bin/node" "${targetBinDir}/node" && ln -sf "${targetLibDir}/bin/npm" "${targetBinDir}/npm" && ln -sf "${targetLibDir}/bin/npx" "${targetBinDir}/npx" && rm -f "${tempTarPath}"`

    await execAsync(installCmd)

    return Response.json({
      status: 'success',
      message: 'Node.js installed successfully'
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return Response.json({
      status: 'error',
      error: errorMessage
    })
  }
}
