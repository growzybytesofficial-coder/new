import { Link, useParams } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'

export default function ProductDetails() {
  const { slug } = useParams()
  const { addToCart } = useCart()

  const product = products.find((item) => item.slug === slug)

  if (!product) {
    return (
      <section className="section-gap">
        <div className="container-main">
          <div className="card-shell p-10 text-center">
            <h1 className="text-3xl font-black">Product not found</h1>
            <Link to="/shop" className="btn-primary mt-6">
              Go to Shop
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const relatedProducts = products
    .filter((item) => item.category === product.category && item.slug !== product.slug)
    .slice(0, 3)

  return (
    <>
      <section className="section-gap">
        <div className="container-main grid gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            <div className="bg-gradient-to-br from-red-700 via-red-600 to-slate-900 p-10 text-white">
              <span className="rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]">
                {product.badge}
              </span>
              <h1 className="mt-6 text-4xl font-black leading-tight">{product.name}</h1>
              <p className="mt-3 text-white/80">{product.category}</p>
              <p className="mt-2 text-sm text-white/60">{product.sku}</p>
            </div>
          </div>

          <div>
            <span className="eyebrow">{product.category}</span>
            <h2 className="mt-4 text-4xl font-black">{product.name}</h2>
            <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
              {product.description}
            </p>

            <div className="mt-6 flex items-end gap-3">
              <span className="text-4xl font-black text-red-700">₹{product.price}</span>
              <span className="text-lg text-slate-400 line-through">₹{product.oldPrice}</span>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button onClick={() => addToCart(product)} className="btn-primary">
                <ShoppingCart className="mr-2" size={18} />
                Add to Cart
              </button>
              <Link to="/contact" className="btn-secondary">
                Send Inquiry
              </Link>
            </div>

            <div className="mt-10 card-shell p-6">
              <h3 className="text-2xl font-black">Key Highlights</h3>
              <ul className="mt-5 space-y-3 text-slate-600 dark:text-slate-300">
                {product.specs.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}