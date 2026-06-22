export async function GET() {
  try {
    const { exec } = await import('child_process')
    const { promisify } = await import('util')
    const os = await import('os')
    const path = await import('path')
    const fs = await import('fs')
    const execAsync = promisify(exec)

    // Check custom path first, then global pm2
    let pm2Cmd = 'pm2'
    const localPm2Path = path.join(os.homedir(), '.local', 'bin', 'pm2')
    if (fs.existsSync(localPm2Path)) {
      pm2Cmd = localPm2Path
    }

    const { stdout } = await execAsync(`${pm2Cmd} -v`)
    return Response.json({
      status: 'success',
      active: true,
      version: stdout.trim(),
      output: stdout.trim(),
      command: `${pm2Cmd} -v`
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return Response.json({
      status: 'success',
      active: false,
      version: 'Not Installed',
      error: errorMessage,
      command: 'pm2 -v'
    })
  }
}

export async function POST() {
  try {
    const { exec } = await import('child_process')
    const { promisify } = await import('util')
    const os = await import('os')
    const path = await import('path')
    const fs = await import('fs')
    const execAsync = promisify(exec)

    // Verify if node/npm is available first
    let npmCmd = 'npm'
    const localNpmPath = path.join(os.homedir(), '.local', 'bin', 'npm')
    if (fs.existsSync(localNpmPath)) {
      npmCmd = localNpmPath
    }

    try {
      await execAsync(`${npmCmd} -v`)
    } catch {
      return Response.json({
        status: 'error',
        error: 'Node.js (npm) is required to install PM2. Please install Node.js first.'
      })
    }

    const home = os.homedir()
    const targetBinDir = path.join(home, '.local')

    // Install PM2 locally in ~/.local
    const installCmd = `"${npmCmd}" install -g --prefix "${targetBinDir}" pm2`
    await execAsync(installCmd)

    return Response.json({
      status: 'success',
      message: 'PM2 installed successfully'
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return Response.json({
      status: 'error',
      error: errorMessage
    })
  }
}
