import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X, ShoppingCart, Heart, ShieldCheck, Truck, Check, Star, ArrowRight, Zap } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../context/ToastContext'
import { useProductImages } from '../context/ProductImageContext'
import confetti from 'canvas-confetti'

export default function QuickViewModal({ product, isOpen, onClose }) {
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const { addToCart, openDrawer } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { addToast } = useToast()
  const { productImages } = useProductImages()

  const imageUrl = product ? productImages[product.slug] : null
  const isWished = product ? isInWishlist(product.slug) : false

  useEffect(() => {
    setQty(1)
    setAdded(false)
  }, [product])

  // ESC key listener
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen || !product) return null

  const handleAddToCart = () => {
    addToCart(product, qty)
    setAdded(true)
    addToast({
      title: 'Added to Cart',
      message: `${qty}x ${product.name} added.`,
      type: 'success',
      action: {
        label: 'Open Cart',
        onClick: openDrawer,
      },
    })
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    addToCart(product, qty)
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      })
    } catch {
      // ignore
    }
    onClose()
    openDrawer()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-[32px] bg-white text-left shadow-2xl transition-all animate-pop-in border border-slate-100">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 p-2.5 rounded-full bg-slate-100/80 text-slate-500 hover:bg-red-50 hover:text-red-600 transition backdrop-blur-md"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Preview & Badge */}
            <div className="relative bg-slate-50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 min-h-[300px]">
              <span className="absolute left-6 top-6 rounded-full bg-red-600 px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-sm">
                {product.badge || 'GENUINE'}
              </span>

              <button
                onClick={() => {
                  toggleWishlist(product)
                  addToast({
                    title: isWished ? 'Removed from Wishlist' : 'Added to Wishlist',
                    message: product.name,
                    type: 'wishlist',
                  })
                }}
                className={`absolute right-6 top-6 md:right-auto md:left-6 md:top-16 p-2.5 rounded-full transition shadow-sm ${
                  isWished ? 'bg-rose-50 text-rose-600 ring-2 ring-rose-300' : 'bg-white text-slate-400 hover:text-rose-500'
                }`}
                title="Wishlist"
              >
                <Heart size={18} className={isWished ? 'fill-rose-500 text-rose-500' : ''} />
              </button>

              <div className="p-4 flex items-center justify-center h-56 w-full">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1598450847827-7a7be5258086?w=200'
                    }}
                  />
                ) : (
                  <div className="text-center p-6 bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 rounded-2xl text-slate-800">
                    <div className="text-lg font-black">{product.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{product.category}</div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center gap-3 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1 text-emerald-600">
                  <ShieldCheck size={14} /> 1 Year Warranty
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-blue-600">
                  <Truck size={14} /> Fast Dispatch
                </span>
              </div>
            </div>

            {/* Product Details & Actions */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <span>{product.category}</span>
                  <span className="font-mono text-[11px] text-slate-500">{product.sku}</span>
                </div>

                <h3 className="text-xl font-black text-slate-900 leading-snug">{product.name}</h3>

                <div className="mt-3 flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full text-amber-700 text-xs font-black">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    4.9
                  </div>
                  <span className="text-xs text-slate-400 font-medium">(48 wholesale reviews)</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">In Stock</span>
                </div>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-3xl font-black text-red-700">₹{Number(product.price).toLocaleString('en-IN')}</span>
                  {product.oldPrice && (
                    <span className="text-sm font-semibold text-slate-400 line-through">
                      ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                    </span>
                  )}
                  {product.oldPrice && (
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-extrabold text-emerald-800">
                      Save {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                    </span>
                  )}
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-3">
                  {product.short || product.desc || 'Premium grade professional hardware with factory certified tolerance and heavy duty copper alloy contacts.'}
                </p>

                {/* Quantity adjuster */}
                <div className="mt-6 flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quantity:</span>
                  <div className="flex items-center rounded-xl border border-slate-300 bg-slate-50 overflow-hidden shadow-inner">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-200 font-bold transition"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-xs font-black text-slate-900">{qty}</span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-200 font-bold transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className={`inline-flex items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-black transition-all ${
                      added
                        ? 'bg-emerald-600 text-white'
                        : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20'
                    }`}
                  >
                    {added ? <Check size={16} /> : <ShoppingCart size={16} />}
                    {added ? 'Added to Cart' : 'Add to Cart'}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="btn-primary py-3.5 text-xs justify-center font-black shadow-lg shadow-red-700/20"
                  >
                    <Zap size={16} className="mr-1" /> Buy Now
                  </button>
                </div>

                <Link
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-700 transition py-1"
                >
                  View Full Product Specifications <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
