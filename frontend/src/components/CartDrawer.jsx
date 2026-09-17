import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useProductImages } from '../context/ProductImageContext'

export default function CartDrawer() {
  const { cartItems, isDrawerOpen, closeDrawer, updateQty, removeFromCart, subtotal, cartCount } = useCart()
  const { productImages } = useProductImages()

  const freeShippingThreshold = 999
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal)
  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDrawerOpen, closeDrawer])

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isDrawerOpen])

  if (!isDrawerOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      {/* Slide-out Panel */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-slide-left">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-red-100 text-red-600">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 leading-tight">Your Shopping Cart</h2>
                <p className="text-xs font-semibold text-slate-500">{cartCount} {cartCount === 1 ? 'item' : 'items'} selected</p>
              </div>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-6 py-3.5 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="flex items-center gap-1.5 text-slate-700">
                <Truck size={14} className="text-red-600" />
                {amountNeeded === 0 ? (
                  <span className="text-emerald-700 font-extrabold">🎉 You unlocked FREE Express Delivery!</span>
                ) : (
                  <span>Add <span className="text-red-700 font-black">₹{amountNeeded.toLocaleString('en-IN')}</span> for FREE shipping</span>
                )}
              </span>
              <span className="text-slate-500">{shippingProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  shippingProgress >= 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-red-600 to-orange-500'
                }`}
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-slate-100">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-300">
                  <ShoppingBag size={40} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">Your cart is empty</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Explore our wholesale CCTV cables, networking devices, and high-performance adapters.
                  </p>
                </div>
                <Link
                  to="/shop"
                  onClick={closeDrawer}
                  className="btn-primary mt-2 text-xs py-2.5 px-6 shadow-md"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              cartItems.map((item) => {
                const img = productImages[item.slug]
                return (
                  <div key={item.slug} className="py-4 flex gap-4 items-center group">
                    <div className="h-20 w-20 shrink-0 rounded-2xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center overflow-hidden">
                      {img ? (
                        <img
                          src={img}
                          alt={item.name}
                          className="h-full w-full object-contain group-hover:scale-105 transition"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1598450847827-7a7be5258086?w=200'
                          }}
                        />
                      ) : (
                        <div className="bg-red-700 text-white font-bold text-xs p-2 rounded-lg text-center">
                          {item.badge || 'IT'}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <Link
                          to={`/product/${item.slug}`}
                          onClick={closeDrawer}
                          className="text-xs font-bold text-slate-800 line-clamp-1 hover:text-red-600 transition"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.slug)}
                          className="text-slate-400 hover:text-red-600 p-1 transition ml-2 shrink-0"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <p className="text-[11px] font-mono text-slate-400 mt-0.5">{item.sku}</p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden shadow-inner">
                          <button
                            onClick={() => updateQty(item.slug, item.qty - 1)}
                            className="p-1.5 hover:bg-slate-200 text-slate-600 transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-800">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.slug, item.qty + 1)}
                            className="p-1.5 hover:bg-slate-200 text-slate-600 transition"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-black text-slate-900">
                            ₹{(Number(item.price) * item.qty).toLocaleString('en-IN')}
                          </div>
                          {item.qty > 1 && (
                            <div className="text-[10px] text-slate-400">
                              ₹{Number(item.price).toLocaleString('en-IN')} each
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer / Summary */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50/80 space-y-4">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Estimated GST (18%)</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Shipping</span>
                  <span className={amountNeeded === 0 ? 'text-emerald-600 font-bold' : ''}>
                    {amountNeeded === 0 ? 'FREE' : 'Calculated at checkout'}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-base font-black text-slate-900">
                  <span>Estimated Total</span>
                  <span className="text-red-700">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/cart"
                  onClick={closeDrawer}
                  className="btn-secondary py-3 text-xs justify-center font-bold"
                >
                  View Full Cart
                </Link>
                <Link
                  to="/cart"
                  onClick={closeDrawer}
                  className="btn-primary py-3 text-xs justify-center font-bold shadow-lg shadow-red-900/20"
                >
                  Checkout <ArrowRight size={14} className="ml-1.5" />
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <ShieldCheck size={12} className="text-emerald-500" />
                100% Genuine Certified & Safe Checkout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
