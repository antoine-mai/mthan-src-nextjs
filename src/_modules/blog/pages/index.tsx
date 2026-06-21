import Link from '@/_components/link'

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

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <section className="mx-auto w-full max-w-5xl px-6 py-14 md:py-20">
        <div className="mb-10 border-b border-neutral-800 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
            Blog Module
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
            Editorial workspace
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-400 md:text-base">
            A sample blog module mounted from the dynamic registry with public content, API data, and admin configuration.
          </p>
        </div>

        <div className="grid gap-5">
          {posts.map((post) => (
            <article
              key={post.id}
              className="border border-neutral-800 bg-neutral-900/70 p-5 shadow-xl shadow-black/20 transition hover:border-sky-500/60 hover:bg-neutral-900 md:p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                    <span>{post.category}</span>
                    <span className="h-1 w-1 bg-neutral-700" />
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="mt-3 text-xl font-bold text-white md:text-2xl">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm text-neutral-400">
                    By {post.author}
                  </p>
                </div>
                <span
                  className={`border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                    post.status === 'Published'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                  }`}
                >
                  {post.status}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="border border-neutral-800 bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-neutral-300 transition hover:border-neutral-700 hover:text-white"
          >
            Back to home
          </Link>
          <Link
            href="/api/blog"
            className="border border-sky-500/30 bg-sky-500/10 px-5 py-2.5 text-sm font-semibold text-sky-300 transition hover:border-sky-400/60 hover:text-sky-100"
          >
            View blog API
          </Link>
        </div>
      </section>
    </main>
  )
}
