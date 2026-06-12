export async function GET() {
  const websites = [
    { id: 1, name: 'Creative Agency Portfolio', domain: 'creative-agency.com', type: 'Portfolio', status: 'Active' },
    { id: 2, name: 'Apex E-commerce Store', domain: 'apex-shop.net', type: 'E-commerce', status: 'Active' },
    { id: 3, name: 'SaaS Platform Documentation', domain: 'docs.saas-platform.io', type: 'Documentation', status: 'Draft' },
    { id: 4, name: 'Tech Blog & Newsletter', domain: 'tech-blog.dev', type: 'Blog', status: 'Suspended' }
  ]

  return Response.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    websites
  })
}
