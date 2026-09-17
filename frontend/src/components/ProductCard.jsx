import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingCart, Eye, Heart, Check, Star, Zap } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../context/ToastContext'
import { useProductImages } from '../context/ProductImageContext'
import QuickViewModal from './QuickViewModal'

export default function ProductCard({ product, onQuickView }) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const { addToCart, openDrawer } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { addToast } = useToast()
  const { productImages } = useProductImages()

  const imageUrl = productImages[product.slug]
  const isWished = isInWishlist(product.slug)

  const discountPercent =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    setJustAdded(true)
    addToast({
      title: 'Added to Cart',
      message: `${product.name} has been added.`,
      type: 'success',
      action: {
        label: 'Open Cart',
        onClick: openDrawer,
      },
    })
    setTimeout(() => setJustAdded(false), 1800)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
    addToast({
      title: isWished ? 'Removed from Wishlist' : 'Saved to Wishlist',
      message: product.name,
      type: 'wishlist',
    })
  }

  const handleOpenQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onQuickView) {
      onQuickView(product)
    } else {
      setIsQuickViewOpen(true)
    }
  }

  return (
    <>
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)] hover:border-red-200">
        {/* Top Floating Badges */}
        <div className="relative">
          {/* Action buttons (Wishlist) */}
          <div className="absolute right-3.5 top-3.5 z-20 flex flex-col gap-1.5">
            <button
              onClick={handleWishlist}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 shadow-sm backdrop-blur-md cursor-pointer ${
                isWished
                  ? 'bg-rose-50 text-rose-600 ring-2 ring-rose-300 scale-105'
                  : 'bg-white/90 text-slate-400 hover:bg-white hover:text-rose-500 hover:scale-110'
              }`}
              title={isWished ? 'Remove from wishlist' : 'Save to wishlist'}
              aria-label="Wishlist"
            >
              <Heart size={14} className={`transition-transform duration-300 ${isWished ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          {/* Badge & Discount */}
          <div className="absolute left-3.5 top-3.5 z-20 flex flex-col gap-1.5 items-start">
            <span className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md shadow-red-950/20">
              {product.badge || 'PRO'}
            </span>
            {discountPercent && (
              <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-sm">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Product Image Stage */}
          <Link
            to={`/product/${product.slug}`}
            className="relative flex h-52 w-full items-center justify-center overflow-hidden bg-slate-50/70 p-6 border-b border-slate-100/80 transition-colors group-hover:bg-slate-50"
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="h-full max-h-40 w-full object-contain transition-transform duration-500 ease-out group-hover:scale-110"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1598450847827-7a7be5258086?w=200'
                }}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 p-4 text-center text-slate-800">
                <div className="text-sm font-black uppercase tracking-wider">{product.name}</div>
                <div className="mt-1 text-[11px] text-slate-500">{product.category}</div>
              </div>
            )}

            {/* Quick View Hover Pill */}
            <button
              onClick={handleOpenQuickView}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 inline-flex items-center gap-1.5 rounded-full bg-white/95 text-slate-900 border border-slate-200/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold shadow-md hover:bg-red-600 hover:text-white hover:border-red-600 cursor-pointer"
            >
              <Eye size={13} /> Quick View
            </button>
          </Link>
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
              <span className="uppercase tracking-wider text-[10px] text-red-700 bg-red-50 px-2 py-0.5 rounded-md font-black">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-500 text-[11px] font-bold">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                4.9
              </div>
            </div>

            {/* Title */}
            <Link
              to={`/product/${product.slug}`}
              className="block font-black text-slate-900 leading-snug tracking-tight text-base sm:text-lg hover:text-red-700 transition line-clamp-2"
              title={product.name}
            >
              {product.name}
            </Link>

            <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">
              {product.short || product.desc}
            </p>
          </div>

          {/* Pricing & Footer Actions */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-baseline justify-between mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-red-700 font-mono">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                {product.oldPrice && (
                  <span className="text-xs font-medium text-slate-400 line-through">
                    ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono text-slate-400">{product.sku}</span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={`/product/${product.slug}`}
                className="btn-secondary flex-1 py-2.5 text-xs font-bold justify-center rounded-xl"
              >
                Details <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                onClick={handleAdd}
                className={`inline-flex items-center justify-center rounded-xl p-2.5 transition-all duration-300 cursor-pointer ${
                  justAdded
                    ? 'bg-emerald-600 text-white scale-105 shadow-md shadow-emerald-600/30'
                    : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-md hover:shadow-red-600/25 active:scale-95'
                }`}
                title="Add to cart"
                aria-label="Add to cart"
              >
                {justAdded ? <Check size={18} /> : <ShoppingCart size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Quick View Modal */}
      {!onQuickView && (
        <QuickViewModal
          product={product}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </>
  )
}
