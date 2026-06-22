export async function GET() {
  try {
    const { exec } = await import('child_process')
    const { promisify } = await import('util')
    const execAsync = promisify(exec)

    // nginx -v output is written to stderr, so redirect to stdout with 2>&1
    const { stdout } = await execAsync('nginx -v 2>&1')
    return Response.json({
      status: 'success',
      active: true,
      version: stdout.trim(),
      output: stdout.trim(),
      command: 'nginx -v 2>&1'
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return Response.json({
      status: 'success',
      active: false,
      version: 'Not Installed',
      error: errorMessage,
      command: 'nginx -v 2>&1'
    })
  }
}
