export async function GET() {
  return Response.json({
    status: 'success',
    module: 'blog',
    settings: {
      defaultStatus: 'Draft',
      postsPerPage: 10,
      defaultAuthor: 'Admin Team',
      featuredCategory: 'Architecture'
    }
  })
}
