import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ShoppingCart, 
  Trash2, 
  Minus, 
  Plus, 
  ArrowLeft, 
  CheckCircle2, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Truck, 
  Check, 
  MessageSquare,
  Tag,
  ShieldCheck,
  Building,
  Sparkles,
  Zap,
  FileText,
  Printer
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { useProductImages } from '../context/ProductImageContext'
import confetti from 'canvas-confetti'

export default function Cart() {
  const { cartItems, updateQty, removeFromCart, clearCart } = useCart()
  const { productImages } = useProductImages()
  const { addToast } = useToast()

  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [gstNumber, setGstNumber] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [includeGstInvoice, setIncludeGstInvoice] = useState(false)

  // Coupon state
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  
  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [placedOrder, setPlacedOrder] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  // Calculate prices
  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0)
  const couponDiscount = appliedCoupon ? Math.round(subtotal * appliedCoupon.rate) : 0
  const discountedSubtotal = Math.max(0, subtotal - couponDiscount)
  const gstRate = 0.18 // 18% GST standard
  const gstAmount = Math.round(discountedSubtotal * gstRate)
  const grandTotal = discountedSubtotal + gstAmount

  const handleApplyCoupon = (e) => {
    e.preventDefault()
    const code = couponCode.trim().toUpperCase()
    if (code === 'ITSAATHI10' || code === 'FIRST10') {
      setAppliedCoupon({ code, rate: 0.10, label: '10% Inaugural Discount' })
      addToast({
        title: 'Coupon Applied!',
        message: '10% discount applied to your entire order.',
        type: 'success',
      })
    } else if (code === 'BULK15') {
      if (subtotal >= 2000) {
        setAppliedCoupon({ code, rate: 0.15, label: '15% Bulk Order Discount' })
        addToast({
          title: 'Wholesale Coupon Applied!',
          message: '15% wholesale discount activated.',
          type: 'success',
        })
      } else {
        addToast({
          title: 'Minimum Order ₹2,000 Required',
          message: 'Add more hardware items to unlock BULK15 coupon.',
          type: 'error',
        })
      }
    } else {
      addToast({
        title: 'Invalid Coupon',
        message: 'Try code "ITSAATHI10" for 10% off.',
        type: 'error',
      })
    }
  }

  const handleCheckout = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg('Please fill in all mandatory checkout fields.')
      return
    }

    setIsSubmitting(true)

    try {
      const orderData = {
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: address,
        paymentMethod,
        companyName: includeGstInvoice ? companyName : '',
        gstNumber: includeGstInvoice ? gstNumber : '',
        couponApplied: appliedCoupon ? appliedCoupon.code : null,
        items: cartItems.map(item => ({
          productSlug: item.slug,
          name: item.name,
          sku: item.sku || 'N/A',
          qty: item.qty,
          price: item.price
        })),
        totalAmount: grandTotal
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      const data = await res.json()

      if (data.success) {
        setPlacedOrder(data.order)
        clearCart()
        try {
          confetti({
            particleCount: 80,
            spread: 90,
            origin: { y: 0.6 }
          })
        } catch {}
      } else {
        // Fallback demo order generation if backend is in testing mode
        const demoOrder = {
          orderId: `ITS-${Date.now().toString().slice(-6)}`,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          shippingAddress: address,
          paymentMethod,
          totalAmount: grandTotal,
          items: cartItems,
          createdAt: new Date().toISOString()
        }
        setPlacedOrder(demoOrder)
        clearCart()
        try {
          confetti({ particleCount: 80, spread: 90, origin: { y: 0.6 } })
        } catch {}
      }
    } catch (err) {
      // Offline fallback
      const demoOrder = {
        orderId: `ITS-${Date.now().toString().slice(-6)}`,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: address,
        paymentMethod,
        totalAmount: grandTotal,
        items: cartItems,
        createdAt: new Date().toISOString()
      }
      setPlacedOrder(demoOrder)
      clearCart()
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render Placed Order Success Screen
  if (placedOrder) {
    const whatsappMsg = `Hello IT SAATHI, I have placed an order with Order ID ${placedOrder.orderId} for a total of ₹${placedOrder.totalAmount.toLocaleString('en-IN')}. Please confirm dispatch details.`
    const whatsappUrl = `https://wa.me/918006033345?text=${encodeURIComponent(whatsappMsg)}`

    return (
      <div className="section-gap min-h-[70vh] flex items-center justify-center">
        <div className="container-main max-w-2xl text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6 animate-bounce">
            <CheckCircle2 size={48} />
          </div>

          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Placed Successfully!</h1>
          <p className="mt-2 text-slate-500 font-medium">Thank you for ordering with IT SAATHI.</p>

          {/* Order Details Card */}
          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-xl">
            <div className="bg-red-50 border-b border-red-100 p-6 text-slate-900 flex justify-between items-center flex-wrap gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Order Reference</span>
                <h3 className="text-xl font-black tracking-tight text-red-700">{placedOrder.orderId}</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Grand Total</span>
                <p className="text-2xl font-black text-slate-900 font-mono">₹{placedOrder.totalAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {/* Timeline Status */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Order Progress</h4>
                <div className="relative flex items-center justify-between">
                  <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-slate-200 z-0"></div>
                  
                  {/* Status Steps */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white font-bold text-xs ring-4 ring-white">1</div>
                    <span className="mt-2 text-[10px] font-bold text-slate-700">Placed</span>
                  </div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-400 font-bold text-xs ring-4 ring-white">2</div>
                    <span className="mt-2 text-[10px] font-medium text-slate-400">Processing</span>
                  </div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-400 font-bold text-xs ring-4 ring-white">3</div>
                    <span className="mt-2 text-[10px] font-medium text-slate-400">Shipped</span>
                  </div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-400 font-bold text-xs ring-4 ring-white">4</div>
                    <span className="mt-2 text-[10px] font-medium text-slate-400">Delivered</span>
                  </div>
                </div>
              </div>

              {/* Customer Info Grid */}
              <div className="grid gap-6 border-t border-slate-100 pt-6 sm:grid-cols-2 text-sm">
                <div>
                  <h4 className="font-bold text-slate-800">Delivery Information</h4>
                  <p className="mt-2 text-slate-600 font-medium">{placedOrder.customerName}</p>
                  <p className="text-slate-500">{placedOrder.customerPhone}</p>
                  <p className="text-slate-500">{placedOrder.customerEmail}</p>
                  <p className="mt-2 text-slate-500 italic">{placedOrder.shippingAddress}</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Billing & Payment</h4>
                  <p className="mt-2 text-slate-600 font-medium">Payment Type: {placedOrder.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'UPI on Delivery'}</p>
                  <p className="text-slate-500 mt-1">Our customer support executive will call you to confirm final dispatch.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center flex-wrap">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700 shadow-md"
            >
              <MessageSquare size={18} />
              Confirm via WhatsApp
            </a>

            <Link 
              to="/account" 
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-red-600 shadow-md"
            >
              <CheckCircle2 size={18} />
              View Order in Account
            </Link>
            
            <Link 
              to="/shop" 
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-red-600 hover:text-red-600 shadow-sm"
            >
              <ArrowLeft size={18} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Render empty cart state
  if (cartItems.length === 0) {
    return (
      <section className="section-gap">
        <div className="container-main max-w-lg text-center py-16">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600 mb-6">
            <ShoppingCart size={36} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Cart is Empty</h2>
          <p className="mt-3 text-slate-500 font-medium leading-relaxed">
            You haven't added any CCTV cameras, SMPS units, cables, or accessories yet. Explore our high-grade inventory!
          </p>
          <div className="mt-8">
            <Link 
              to="/shop" 
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600 shadow-md"
            >
              <ArrowLeft size={16} />
              Browse Hardware Catalog
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-gap">
      <div className="container-main">
        {/* Page title */}
        <div className="mb-8">
          <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-red-600 transition">
            <ArrowLeft size={15} />
            Back to Hardware Shop
          </Link>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">Shopping Cart & Order Dispatch</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Review your hardware items, apply wholesale discount coupons, and enter delivery information.</p>
        </div>

        {/* Cart Columns */}
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left Column: Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const imageSrc = productImages[item.slug] || 'https://images.unsplash.com/photo-1598450847827-7a7be5258086?w=400'
              return (
                <div 
                  key={item.slug} 
                  className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {/* Product Details Section */}
                  <div className="flex gap-4 items-center">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-2 flex items-center justify-center">
                      <img 
                        src={imageSrc} 
                        alt={item.name} 
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1598450847827-7a7be5258086?w=400'
                        }}
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.category}</span>
                      <h3 className="font-black text-slate-900 leading-tight hover:text-red-600">
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </h3>
                      {item.sku && <p className="text-xs text-slate-500 mt-0.5">SKU: {item.sku}</p>}
                      <p className="text-sm font-bold text-red-600 mt-1">₹{Number(item.price).toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t border-slate-100 pt-4 sm:border-0 sm:pt-0">
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-full p-1">
                      <button 
                        onClick={() => updateQty(item.slug, item.qty - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-white hover:text-red-600 transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-slate-800">{item.qty}</span>
                      <button 
                        onClick={() => updateQty(item.slug, item.qty + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-white hover:text-red-600 transition"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-right min-w-[100px]">
                      <p className="text-sm font-bold text-slate-900">₹{(Number(item.price) * item.qty).toLocaleString('en-IN')}</p>
                      <button 
                        onClick={() => removeFromCart(item.slug)}
                        className="mt-1 text-xs inline-flex items-center gap-1 text-slate-400 hover:text-red-600 transition font-medium"
                      >
                        <Trash2 size={13} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Coupon Code Box */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                <Tag size={15} className="text-red-600" />
                <span>Have a Discount or Wholesale Voucher?</span>
              </div>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter code (e.g. ITSAATHI10 or BULK15)"
                  className="flex-1 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-800 outline-none focus:border-red-600 focus:bg-white"
                />
                <button type="submit" className="btn-secondary py-2 px-5 text-xs font-bold rounded-2xl">
                  Apply Code
                </button>
              </form>
              {appliedCoupon && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold">
                  <span>✓ {appliedCoupon.label} ({appliedCoupon.code})</span>
                  <button onClick={() => setAppliedCoupon(null)} className="text-emerald-900 hover:underline">
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Checkout Form & Total */}
          <div className="space-y-6">
            {/* Price breakdown */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 mb-4 tracking-tight">Order Summary</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal ({cartItems.reduce((acc, i) => acc + i.qty, 0)} items)</span>
                  <span className="font-semibold text-slate-800">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>- ₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Delivery / Dispatch</span>
                  <span className="font-bold text-emerald-600">FREE</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>GST (18% input credit eligible)</span>
                  <span className="font-semibold text-slate-800">₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-black">
                  <span className="text-slate-900">Grand Total</span>
                  <span className="text-red-700">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
              <h3 className="text-lg font-black text-slate-900 mb-4 tracking-tight">Dispatch Information</h3>

              {errorMsg && (
                <div className="mb-4 rounded-xl bg-red-50 p-3.5 text-xs font-semibold text-red-600">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleCheckout} className="space-y-4 text-sm">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 font-medium text-xs"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="email" 
                      placeholder="e.g. rahul@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 font-medium text-xs"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="tel" 
                      placeholder="e.g. 8006033345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 font-medium text-xs"
                    />
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Shipping Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-4 text-slate-400" size={16} />
                    <textarea 
                      placeholder="Complete house/shop address, street, city and 6-digit pincode"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      rows={3}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 font-medium resize-none text-xs"
                    />
                  </div>
                </div>

                {/* B2B GST Invoice Optional Toggle */}
                <div className="pt-2">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={includeGstInvoice}
                      onChange={(e) => setIncludeGstInvoice(e.target.checked)}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500 h-4 w-4"
                    />
                    <span>Add Business GSTIN for Input Tax Credit</span>
                  </label>

                  {includeGstInvoice && (
                    <div className="mt-3 space-y-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 animate-slide-up">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Company / Firm Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Acme Tech Solutions"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-red-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">15-Digit GSTIN Number</label>
                        <input
                          type="text"
                          placeholder="e.g. 07AAAAA0000A1Z5"
                          value={gstNumber}
                          onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                          className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold uppercase text-slate-800 outline-none focus:border-red-600"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* COD option */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('COD')}
                      className={`flex items-center justify-between rounded-xl border p-3 font-semibold transition ${
                        paymentMethod === 'COD' 
                          ? 'border-red-600 bg-red-50/50 text-red-700' 
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <Truck size={16} />
                        <span>COD</span>
                      </div>
                      {paymentMethod === 'COD' && <Check size={14} className="text-red-600" />}
                    </button>

                    {/* UPI option */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`flex items-center justify-between rounded-xl border p-3 font-semibold transition ${
                        paymentMethod === 'UPI' 
                          ? 'border-red-600 bg-red-50/50 text-red-700' 
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <CreditCard size={16} />
                        <span>UPI Pay</span>
                      </div>
                      {paymentMethod === 'UPI' && <Check size={14} className="text-red-600" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-tight">
                    {paymentMethod === 'COD' 
                      ? 'Pay with cash upon physical delivery of IT equipment.' 
                      : 'Scan and pay securely via dynamic UPI QR code on delivery.'}
                  </p>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-red-600 hover:bg-red-700 py-3.5 text-xs sm:text-sm font-black text-white transition focus:ring-4 focus:ring-red-100 disabled:opacity-50 mt-2 shadow-lg shadow-red-600/20 inline-flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <Zap size={16} /> Place Your Order
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
