export async function GET() {
  const products = [
    { id: 1, name: 'Quantum CPU Cooler', category: 'Hardware', price: 89.0, status: 'In Stock' },
    { id: 2, name: 'AeroGlide Mechanical Keyboard', category: 'Peripherals', price: 129.0, status: 'In Stock' },
    { id: 3, name: 'VividSync 4K Monitor', category: 'Displays', price: 449.0, status: 'Low Stock' },
    { id: 4, name: 'NeoSound Wireless Headphones', category: 'Audio', price: 199.0, status: 'Out of Stock' }
  ]

  return Response.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    products
  })
}
