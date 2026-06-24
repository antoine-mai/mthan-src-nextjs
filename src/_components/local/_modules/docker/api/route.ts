export async function GET() {
  try {
    const { exec } = await import('child_process')
    const { promisify } = await import('util')
    const execAsync = promisify(exec)

    // docker version checks both installation and daemon connectivity/permissions
    const { stdout } = await execAsync('docker version')
    return Response.json({
      status: 'success',
      active: true,
      version: stdout.split('\n')[1]?.trim() || stdout.trim(),
      output: stdout.trim(),
      command: 'docker version'
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return Response.json({
      status: 'success',
      active: false,
      version: 'Not Installed / No Permission',
      error: errorMessage,
      command: 'docker version'
    })
  }
}
