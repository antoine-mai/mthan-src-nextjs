const posts = [
  {
    id: 1,
    title: 'Designing a modular content platform',
    category: 'Architecture',
    author: 'Admin Team',
    status: 'Published',
    readTime: '6 min read'
  },
  {
    id: 2,
    title: 'Routing content through dynamic module hooks',
    category: 'Engineering',
    author: 'Platform Team',
    status: 'Published',
    readTime: '8 min read'
  },
  {
    id: 3,
    title: 'Planning editorial workflows for small teams',
    category: 'Workflow',
    author: 'Content Team',
    status: 'Draft',
    readTime: '5 min read'
  }
]

export async function GET() {
  return Response.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    posts
  })
}
