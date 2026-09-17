import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ShoppingCart,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Check,
  Zap,
  Sparkles,
  MessageSquare,
  ChevronRight,
  Share2,
  Package,
  Plus,
  Minus,
} from 'lucide-react'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../context/ToastContext'
import { useProductImages } from '../context/ProductImageContext'
import ProductCard from '../components/ProductCard'
import confetti from 'canvas-confetti'

export default function ProductDetails() {
  const { slug } = useParams()
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('specs')
  const [pincode, setPincode] = useState('')
  const [pincodeStatus, setPincodeStatus] = useState(null)
  const [justAdded, setJustAdded] = useState(false)

  const { addToCart, openDrawer } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { addToast } = useToast()
  const { productImages } = useProductImages()

  const product = products.find((item) => item.slug === slug)
  const imageUrl = product ? productImages[slug] : null
  const isWished = product ? isInWishlist(product.slug) : false

  if (!product) {
    return (
      <section className="section-gap">
        <div className="container-main">
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-4 shadow-sm">
            <h1 className="text-3xl font-black text-slate-900">Product Not Found</h1>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              The requested IT or CCTV item could not be located in our catalog.
            </p>
            <Link to="/shop" className="btn-primary text-xs py-2.5 px-6">
              Return to Catalog
            </Link>
          </div>
        </div>
      </section>
    )
  }

  // Tiered pricing calculation
  let effectiveUnitPrice = Number(product.price)
  let bulkDiscountRate = 0
  if (qty >= 50) {
    bulkDiscountRate = 0.20
  } else if (qty >= 20) {
    bulkDiscountRate = 0.12
  } else if (qty >= 5) {
    bulkDiscountRate = 0.05
  }
  effectiveUnitPrice = Math.round(effectiveUnitPrice * (1 - bulkDiscountRate) * 10) / 10
  const totalPrice = Math.round(effectiveUnitPrice * qty * 10) / 10

  const handleAddToCart = () => {
    addToCart(product, qty)
    setJustAdded(true)
    addToast({
      title: 'Added to Cart',
      message: `${qty}x ${product.name} added to cart.`,
      type: 'success',
      action: {
        label: 'Open Cart',
        onClick: openDrawer,
      },
    })
    setTimeout(() => setJustAdded(false), 2000)
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
    openDrawer()
  }

  const checkPincode = (e) => {
    e.preventDefault()
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeStatus({
        available: true,
        eta: 'Delivery in 2 - 3 Days',
        cod: 'Cash on Delivery Available',
      })
    } else {
      setPincodeStatus({
        available: false,
        message: 'Please enter a valid 6-digit Indian PIN code',
      })
    }
  }

  const relatedProducts = products
    .filter((item) => item.category === product.category && item.slug !== product.slug)
    .slice(0, 4)

  // Bundle suggestions
  const bundleItem = products.find((p) => p.category === 'Cables Range' && p.slug !== product.slug) || products[0]
  const bundleDiscount = 10
  const bundleTotal = Math.round((Number(product.price) + Number(bundleItem.price)) * 0.9)

  const handleAddBundle = () => {
    addToCart(product, 1)
    addToCart(bundleItem, 1)
    try {
      confetti({ particleCount: 50, spread: 60 })
    } catch {}
    addToast({
      title: 'Bundle Added',
      message: 'Both bundle products have been added with special savings!',
      type: 'success',
      action: {
        label: 'View Cart',
        onClick: openDrawer,
      },
    })
  }

  return (
    <div className="space-y-12 pb-16">
      {/* Breadcrumb */}
      <div className="container-main pt-6">
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-red-700">Home</Link>
          <ChevronRight size={13} />
          <Link to="/shop" className="hover:text-red-700">Shop</Link>
          <ChevronRight size={13} />
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-red-700">
            {product.category}
          </Link>
          <ChevronRight size={13} />
          <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
        </nav>
      </div>

      {/* Main Product Display Stage */}
      <div className="container-main grid gap-10 lg:grid-cols-[1fr_1.1fr] items-start">
        {/* Left Column: Image Stage */}
        <div className="sticky top-28 space-y-4">
          <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 shadow-md flex items-center justify-center min-h-[420px]">
            {/* Badges */}
            <div className="absolute left-6 top-6 z-10 flex flex-col gap-2">
              <span className="rounded-full bg-red-600 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-md">
                {product.badge || 'PRO GRADE'}
              </span>
              {product.oldPrice && (
                <span className="rounded-full bg-emerald-600 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                  SAVE {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Action buttons (Wishlist & Share) */}
            <div className="absolute right-6 top-6 z-10 flex flex-col gap-2">
              <button
                onClick={() => {
                  toggleWishlist(product)
                  addToast({
                    title: isWished ? 'Removed from Wishlist' : 'Saved to Wishlist',
                    message: product.name,
                    type: 'wishlist',
                  })
                }}
                className={`p-3 rounded-full shadow-sm transition-all cursor-pointer ${
                  isWished
                    ? 'bg-rose-50 text-rose-600 ring-2 ring-rose-300 scale-105'
                    : 'bg-slate-100/90 backdrop-blur-md text-slate-400 hover:text-rose-500 hover:bg-white'
                }`}
                title={isWished ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart size={18} className={isWished ? 'fill-rose-500 text-rose-500' : ''} />
              </button>

              <button
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href)
                    addToast({
                      title: 'Link Copied',
                      message: 'Product link copied to clipboard.',
                      type: 'info',
                    })
                  }
                }}
                className="p-3 rounded-full bg-slate-100/90 backdrop-blur-md text-slate-400 hover:text-slate-900 hover:bg-white shadow-sm transition cursor-pointer"
                title="Share product link"
              >
                <Share2 size={18} />
              </button>
            </div>

            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="max-h-80 w-full object-contain transition-transform duration-500 hover:scale-110 cursor-zoom-in"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1598450847827-7a7be5258086?w=400'
                }}
              />
            ) : (
              <div className="rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 p-8 text-slate-800 w-full text-center">
                <div className="text-2xl font-black">{product.name}</div>
                <div className="text-xs text-slate-500 mt-1">{product.category}</div>
              </div>
            )}
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 text-center shadow-sm">
              <ShieldCheck size={20} className="mx-auto text-red-600" />
              <div className="text-xs font-bold text-slate-900 mt-1">100% Genuine</div>
              <div className="text-[10px] text-slate-400">1 Yr Warranty</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 text-center shadow-sm">
              <Truck size={20} className="mx-auto text-blue-600" />
              <div className="text-xs font-bold text-slate-900 mt-1">Express Dispatch</div>
              <div className="text-[10px] text-slate-400">Same-Day Shipping</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 text-center shadow-sm">
              <RotateCcw size={20} className="mx-auto text-emerald-600" />
              <div className="text-xs font-bold text-slate-900 mt-1">Hassle-Free</div>
              <div className="text-[10px] text-slate-400">7-Day Replacement</div>
            </div>
          </div>
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span className="text-red-700 bg-red-50 px-2.5 py-1 rounded-md">{product.category}</span>
              <span className="font-mono text-slate-500">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-amber-800 text-xs font-black">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                4.9 / 5.0
              </div>
              <span className="text-xs text-slate-500 font-semibold">(52 Verified Technician Reviews)</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                🟢 Ready in Stock
              </span>
            </div>
          </div>

          {/* Pricing & Bulk Slab Indicator */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-red-700">₹{effectiveUnitPrice.toLocaleString('en-IN')}</span>
              {product.oldPrice && (
                <span className="text-base font-semibold text-slate-400 line-through">
                  ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                </span>
              )}
              {bulkDiscountRate > 0 && (
                <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-black text-white">
                  Bulk Tier: {bulkDiscountRate * 100}% OFF Applied!
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600">
              Tax inclusive with available input GST credit. Wholesale tiered slabs automatically calculate as you increase quantity.
            </p>

            {/* Wholesale Tier Pills */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
              <div className={`p-2.5 rounded-xl border transition ${qty >= 5 && qty < 20 ? 'bg-red-50 border-red-400 font-black text-red-700' : 'bg-white border-slate-200 text-slate-600'}`}>
                <div className="font-bold">5 - 19 Units</div>
                <div className="text-[10px] text-emerald-600 font-extrabold mt-0.5">5% OFF</div>
              </div>
              <div className={`p-2.5 rounded-xl border transition ${qty >= 20 && qty < 50 ? 'bg-red-50 border-red-400 font-black text-red-700' : 'bg-white border-slate-200 text-slate-600'}`}>
                <div className="font-bold">20 - 49 Units</div>
                <div className="text-[10px] text-emerald-600 font-extrabold mt-0.5">12% OFF</div>
              </div>
              <div className={`p-2.5 rounded-xl border transition ${qty >= 50 ? 'bg-red-50 border-red-400 font-black text-red-700' : 'bg-white border-slate-200 text-slate-600'}`}>
                <div className="font-bold">50+ Units</div>
                <div className="text-[10px] text-emerald-600 font-extrabold mt-0.5">20% OFF</div>
              </div>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-slate-600">
            {product.description || product.short}
          </p>

          {/* Quantity and Primary Action Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Select Quantity:</span>
              <div className="flex items-center rounded-2xl border border-slate-300 bg-white overflow-hidden shadow-inner">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 font-black text-sm transition"
                >
                  <Minus size={14} />
                </button>
                <span className="px-5 py-2.5 text-sm font-black text-slate-900">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 font-black text-sm transition"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="text-right flex-1">
                <div className="text-xs text-slate-400">Total Cart Value</div>
                <div className="text-xl font-black text-slate-900">₹{totalPrice.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl py-4 text-xs sm:text-sm font-black transition-all ${
                  justAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 text-white hover:bg-red-600 hover:shadow-lg'
                }`}
              >
                {justAdded ? <Check size={18} /> : <ShoppingCart size={18} />}
                {justAdded ? 'Added to Cart' : 'Add to Cart'}
              </button>

              <button
                onClick={handleBuyNow}
                className="btn-primary py-4 text-xs sm:text-sm justify-center font-black shadow-lg shadow-red-600/20"
              >
                <Zap size={18} className="mr-1.5" /> Instant Buy Now
              </button>
            </div>

            {/* WhatsApp Wholesale Quote */}
            <a
              href={`https://wa.me/918006033345?text=Hello%20IT%20SAATHI%2C%20I%20am%20interested%20in%20wholesale%20pricing%20for%3A%20${encodeURIComponent(product.name)}%20(SKU%3A%20${product.sku})%20Qty%3A%20${qty}`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 rounded-2xl border border-emerald-600/40 bg-emerald-50 py-3 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition"
            >
              <MessageSquare size={16} className="text-emerald-600" />
              Inquire Wholesale Dealer Pricing on WhatsApp
            </a>
          </div>

          {/* Delivery & Pincode Checker */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-black text-slate-800">
              <Truck size={16} className="text-red-600" />
              <span>Check Delivery Pincode & Availability</span>
            </div>
            <form onSubmit={checkPincode} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter 6-digit Pincode (e.g. 110001)"
                className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-red-600"
              />
              <button
                type="submit"
                className="btn-secondary py-2 px-4 text-xs font-bold rounded-xl"
              >
                Check
              </button>
            </form>

            {pincodeStatus && (
              <div className={`text-xs p-3 rounded-xl ${pincodeStatus.available ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}>
                {pincodeStatus.available ? (
                  <div className="flex flex-col gap-0.5">
                    <span className="font-black">✓ Delivery available for {pincode}</span>
                    <span>{pincodeStatus.eta} • {pincodeStatus.cod}</span>
                  </div>
                ) : (
                  <span>{pincodeStatus.message}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Frequently Bought Together Bundle */}
      <div className="container-main">
        <div className="rounded-3xl border border-red-200 bg-gradient-to-br from-red-50/70 to-orange-50/70 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <span className="eyebrow bg-red-100 text-red-700 border-red-200">
              <Sparkles size={13} /> Installer Deal
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              Frequently Bought Together Bundle
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Combine this item with standard matching wiring hardware and save an additional {bundleDiscount}% instantly.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex flex-wrap items-center gap-4">
              {/* Product 1 */}
              <div className="rounded-2xl bg-white p-3 border border-slate-200 flex items-center gap-3 w-64 shadow-sm">
                <div className="h-12 w-12 rounded-xl bg-slate-50 p-1 flex items-center justify-center shrink-0">
                  {imageUrl ? <img src={imageUrl} alt="" className="h-full w-full object-contain" /> : 'IT'}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">{product.name}</div>
                  <div className="text-xs font-black text-red-700">₹{product.price}</div>
                </div>
              </div>

              <span className="text-lg font-black text-slate-400">+</span>

              {/* Product 2 */}
              <div className="rounded-2xl bg-white p-3 border border-slate-200 flex items-center gap-3 w-64 shadow-sm">
                <div className="h-12 w-12 rounded-xl bg-slate-50 p-1 flex items-center justify-center shrink-0">
                  <span className="font-black text-red-600 text-xs">CABLE</span>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">{bundleItem.name}</div>
                  <div className="text-xs font-black text-red-700">₹{bundleItem.price}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <div className="text-right">
                <div className="text-xs text-slate-500">Bundle Price ({bundleDiscount}% off)</div>
                <div className="text-2xl font-black text-red-700">₹{bundleTotal}</div>
              </div>
              <button
                onClick={handleAddBundle}
                className="btn-primary py-3 px-6 text-xs font-black shadow-md"
              >
                Add Bundle to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Compatibility Tabs */}
      <div className="container-main">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex border-b border-slate-200 gap-4 overflow-x-auto">
            {[
              { id: 'specs', label: 'Technical Specifications' },
              { id: 'compatibility', label: 'Wiring & Compatibility' },
              { id: 'reviews', label: 'Technician Reviews (52)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-sm font-black transition border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-red-600 text-red-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'specs' && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-base font-black text-slate-900">Key Engineering Parameters</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                {product.specs?.map((spec, index) => (
                  <div key={index} className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <Check size={16} className="text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-800">{spec}</span>
                  </div>
                ))}
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <Check size={16} className="text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-800">Operating Temperature: -10°C to +60°C</span>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <Check size={16} className="text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-800">Dielectric Voltage Isolation: Tested 1.5KV Safe</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compatibility' && (
            <div className="space-y-3 text-xs leading-relaxed text-slate-600 animate-fade-in">
              <h4 className="text-base font-black text-slate-900">Deployment Suitability</h4>
              <p>
                Engineered for 100% interoperability with CP Plus, Hikvision, Dahua, Honeywell, and standard DVR/NVR surveillance platforms, as well as rackmount patch setups.
              </p>
              <ul className="list-disc pl-5 space-y-1 font-semibold text-slate-700">
                <li>Compatible with both Analog HD (AHD/CVI/TVI) and IP PoE Network architectures.</li>
                <li>Heavy copper core ensures minimum line attenuation over 90+ meters runs.</li>
                <li>Flame-retardant PVC/ABS outer molding resistant to ambient shop/warehouse heat.</li>
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="text-3xl font-black text-amber-700">4.9</div>
                <div className="text-xs text-slate-700">
                  <div className="font-black">Based on 52 contractor purchase ratings</div>
                  <div className="text-slate-500">100% genuine verified buyer reviews</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-900">Manoj Kumar (CCTV Tech)</span>
                    <span className="text-amber-500">★★★★★</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    "Excellent build quality and exact factory fit. We installed 25 pieces on our commercial mall site without any voltage drop issues."
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="container-main space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="eyebrow">Related Hardware</span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                More in {product.category}
              </h3>
            </div>
            <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="btn-secondary text-xs font-bold">
              View Category <ChevronRight size={14} className="ml-1" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
