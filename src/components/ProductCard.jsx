import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition hover:-translate-y-1">
      <div className="bg-gradient-to-br from-red-700 via-red-600 to-slate-900 p-6 text-white">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            {product.badge}
          </span>
          <span className="text-xs text-white/80">{product.sku}</span>
        </div>

        <h3 className="mt-6 text-2xl font-black leading-tight">{product.name}</h3>
        <p className="mt-2 text-sm text-white/80">{product.category}</p>
      </div>

      <div className="p-6">
        <p className="text-sm text-slate-600">{product.short}</p>

        <div className="mt-5 flex items-end gap-3">
          <span className="text-2xl font-black text-red-700">₹{product.price}</span>
          <span className="text-sm text-slate-400 line-through">₹{product.oldPrice}</span>
        </div>

        <div className="mt-6 flex gap-3">
          <Link to={`/product/${product.slug}`} className="btn-secondary flex-1">
            View <ArrowRight className="ml-2" size={16} />
          </Link>

          <button
            onClick={() => addToCart(product)}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-3 text-white transition hover:bg-red-600"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}