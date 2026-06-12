import React from 'react'

export default function ProductsPage() {
  const products = [
    { id: 1, name: 'Quantum CPU Cooler', category: 'Hardware', price: '$89.00', status: 'In Stock', rating: 4.8 },
    { id: 2, name: 'AeroGlide Mechanical Keyboard', category: 'Peripherals', price: '$129.00', status: 'In Stock', rating: 4.9 },
    { id: 3, name: 'VividSync 4K Monitor', category: 'Displays', price: '$449.00', status: 'Low Stock', rating: 4.7 },
    { id: 4, name: 'NeoSound Wireless Headphones', category: 'Audio', price: '$199.00', status: 'Out of Stock', rating: 4.6 }
  ]

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl w-full z-10 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-teal-200 to-indigo-500">
            Products Showcase
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Rendered dynamically from modular path <code className="text-indigo-400 bg-slate-900/50 px-1.5 py-0.5 rounded border border-slate-800 font-mono">src/_modules/products/pages/index.tsx</code>
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl space-y-4 hover:-translate-y-1 transition duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{product.category}</span>
                  <h3 className="text-lg font-bold text-slate-200 mt-1">{product.name}</h3>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  product.status === 'In Stock'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : product.status === 'Low Stock'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {product.status}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                <span className="text-xl font-extrabold text-teal-400">{product.price}</span>
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  <span>★</span>
                  <span className="font-semibold text-slate-300">{product.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <a
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-slate-355 hover:text-white border border-slate-800 hover:border-slate-700 bg-slate-900/80 rounded-xl transition duration-300"
          >
            ← Back to Home Module
          </a>
        </div>
      </div>
    </main>
  )
}
