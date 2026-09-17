import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Cable,
  CreditCard,
  Headphones,
  LayoutGrid,
  MonitorSmartphone,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Star,
  Store,
  Truck,
  Wallet,
  Wrench,
  Zap,
  Clock,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Search,
  Sliders,
  Flame,
} from 'lucide-react'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'
import Logo from '../components/Logo'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import confetti from 'canvas-confetti'

const partnerBrands = [
  'CP PLUS',
  'HIKVISION',
  'DAHUA',
  'TP-LINK',
  'D-LINK',
  'SEAGATE SKYHAWK',
  'WD PURPLE',
  'SCHNEIDER',
  'SECUREYE',
  'HONEYWELL',
  'NETGEAR',
  'FRONTECH',
]

const servicePoints = [
  {
    title: 'Fast Dispatch',
    text: 'Orders processed and dispatched on the same business day for minimal project downtime.',
    icon: Truck,
    color: 'from-amber-500 to-red-500',
  },
  {
    title: 'COD & Online Pay',
    text: 'Multiple flexible payment methods including UPI, Cards, Netbanking & Cash on Delivery.',
    icon: Wallet,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    title: '100% Genuine Warranty',
    text: 'All technical accessories and power units backed by official manufacturer warranty.',
    icon: ShieldCheck,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    title: 'B2B Wholesale Support',
    text: 'Special volume pricing and GST tax invoices tailored for installers and retail dealers.',
    icon: CreditCard,
    color: 'from-purple-500 to-pink-500',
  },
]

const categoryCards = [
  {
    title: 'CCTV Products',
    slug: 'CCTV Range',
    count: '150+ Items',
    text: 'Camera accessories, connectors, BNC plugs, DVR/NVR support items & daily surveillance.',
    icon: MonitorSmartphone,
    bg: 'bg-red-50 hover:bg-red-100/80 text-red-700',
  },
  {
    title: 'Networking Items',
    slug: 'Networking',
    count: '90+ Items',
    text: 'Gigabit routers, POE switches, patch panels, RJ45 boots and setup accessories.',
    icon: LayoutGrid,
    bg: 'bg-blue-50 hover:bg-blue-100/80 text-blue-700',
  },
  {
    title: 'Power Solutions',
    slug: 'Power Solutions',
    count: '80+ Items',
    text: 'Heavy SMPS power supplies, 12V adapters, camera splitters & uninterrupted supplies.',
    icon: BadgeCheck,
    bg: 'bg-amber-50 hover:bg-amber-100/80 text-amber-700',
  },
  {
    title: 'Storage & Memory',
    slug: 'Storage Devices',
    count: '45+ Items',
    text: 'High endurance surveillance HDDs, SATA SSDs, memory cards and external storage.',
    icon: PackageCheck,
    bg: 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700',
  },
  {
    title: 'Cables & Wiring',
    slug: 'Cables Range',
    count: '120+ Items',
    text: '3+1 CCTV copper coaxial cables, Cat6 LAN rolls, HDMI 4K cords, and USB wiring.',
    icon: Cable,
    bg: 'bg-purple-50 hover:bg-purple-100/80 text-purple-700',
  },
  {
    title: 'Adapters & Converters',
    slug: 'Converters',
    count: '75+ Items',
    text: 'HDMI to VGA, USB-C multi-hubs, audio adapters, and gender changers.',
    icon: Boxes,
    bg: 'bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700',
  },
  {
    title: 'Installation Tools',
    slug: 'Tools',
    count: '50+ Items',
    text: 'Heavy crimping pliers, wire strippers, LAN cable testers, punch-down tools.',
    icon: Wrench,
    bg: 'bg-orange-50 hover:bg-orange-100/80 text-orange-700',
  },
  {
    title: 'Computer Peripherals',
    slug: 'Computer Accessories',
    count: '60+ Items',
    text: 'Wireless keyboards, optical mice, thermal paste, cleaning kits, and display cables.',
    icon: Store,
    bg: 'bg-slate-100 hover:bg-slate-200/80 text-slate-800',
  },
]

const stats = [
  { value: '1,500+', label: 'Catalog Products', suffix: 'In Stock' },
  { value: '10,000+', label: 'Orders Shipped', suffix: 'Pan-India' },
  { value: '4.9 / 5', label: 'Customer Rating', suffix: 'Google Verified' },
  { value: '24/7', label: 'WhatsApp Helpdesk', suffix: 'Instant Reply' },
]

const testimonials = [
  {
    name: 'Shivam Gupta',
    role: 'Managing Director, Delhi Electronics',
    quote: 'We have been ordering Cat6 cables, BNC connectors, and 12V power adapters in bulk from IT SAATHI. Unbeatable wholesale prices, top copper quality, and ultra-reliable dispatch.',
    rating: 5,
    city: 'New Delhi',
  },
  {
    name: 'Rajiv Sharma',
    role: 'Lead CCTV Project Contractor',
    quote: 'The 16-channel SMPS power boxes and CP Plus camera accessories are consistently durable. Not a single power failure across 40+ site installations.',
    rating: 5,
    city: 'Meerut, UP',
  },
  {
    name: 'Ankur Yadav',
    role: 'IT Infrastructure Engineer',
    quote: 'Superb customer guidance from Adarsh Jain and the team. Whenever we need urgent gigabit switches or HDMI extenders, they arrange rapid delivery.',
    rating: 5,
    city: 'Noida',
  },
]

const faqItems = [
  {
    question: 'What kind of products are available on IT SAATHI?',
    answer: 'The catalog is packed with CCTV camera accessories, BNC/DC connectors, power supplies (SMPS), 12V heavy adapters, Cat6/Cat5e networking cables, routers, switches, hard drives, HDMI/VGA converters, and installation tools for technicians and resellers.',
  },
  {
    question: 'Do you offer GST Invoices for B2B input tax credit?',
    answer: 'Yes! All orders can be generated with a comprehensive GST Tax Invoice. Enter your Company Name & GSTIN during checkout, and the system automatically issues compliant invoices.',
  },
  {
    question: 'How fast will my order be dispatched?',
    answer: 'Orders placed before 4:00 PM are dispatched on the same business day. Delivery across north India typically takes 1-2 business days, and 3-4 days nationwide.',
  },
  {
    question: 'Can I purchase in bulk or request a custom wholesale quotation?',
    answer: 'Absolutely. Click on our WhatsApp button or call +91 80060 33345 to connect directly with our wholesale team for dealer slab discounts and bulk container rates.',
  },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState('trending')
  const [openFaqIdx, setOpenFaqIdx] = useState(0)
  const [heroSearch, setHeroSearch] = useState('')

  // Countdown timer for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 19 })

  const { addToCart, openDrawer } = useCart()
  const { addToast } = useToast()

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 }
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return { hours: 6, minutes: 0, seconds: 0 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Filtered products for tabs
  const tabProducts = products
    .filter((item) => {
      if (activeTab === 'trending') return item.section === 'featured' || item.badge === 'Best Seller'
      if (activeTab === 'deals') return item.oldPrice && item.oldPrice > item.price
      if (activeTab === 'cctv') return item.category === 'CCTV Range' || item.category === 'Cables Range'
      if (activeTab === 'power') return item.category === 'Power Solutions' || item.category === 'Converters'
      return true
    })
    .slice(0, 8)

  const flashDeals = products
    .filter((item) => item.oldPrice && item.oldPrice > item.price)
    .slice(0, 4)

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION WITH DYNAMIC BADGES & GLASS CARDS */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20">
        <div className="container-main relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left Column: Heading & Interactive Search */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow">
                <Sparkles size={14} className="text-red-600 animate-spin" style={{ animationDuration: '6s' }} />
                Premium IT & CCTV Hardware Hub
              </span>
              <span className="rounded-full bg-emerald-100/90 text-emerald-800 text-[11px] font-black px-3 py-1 uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                Live Stock Ready
              </span>
            </div>

            <h1 className="text-4xl font-black leading-[1.12] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Power Your Network & Security With <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-red-600 to-orange-600">IT SAATHI</span>
            </h1>

            <p className="text-base leading-relaxed text-slate-600 sm:text-lg max-w-xl">
              India's high-reliability distributor of heavy-duty CCTV power supplies, networking switches, 3+1 copper coaxial cables, and high-performance adapters at true wholesale rates.
            </p>

            {/* Live Search & Quick Jump */}
            <div className="p-2 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-900/5 max-w-lg">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (heroSearch.trim()) {
                    window.location.hash = `#/shop?search=${encodeURIComponent(heroSearch.trim())}`
                  }
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Search 12V SMPS, BNC pins, Cat6 wire, HDMI..."
                    className="w-full bg-transparent pl-10 pr-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary py-2.5 px-5 text-xs sm:text-sm font-bold shadow-md shadow-red-900/20 shrink-0"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/shop" className="btn-primary px-7 py-3.5 text-sm font-black shadow-xl shadow-red-950/20">
                Explore Full Catalog <ArrowRight className="ml-2" size={18} />
              </Link>
              <Link to="/about" className="btn-secondary px-6 py-3.5 text-sm font-bold">
                About Adarsh Jain & Store
              </Link>
            </div>

            {/* Live Stats Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-md hover:border-red-200"
                >
                  <div className="text-2xl font-black text-red-700 tracking-tight">{item.value}</div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">{item.label}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{item.suffix}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Hero Visual Card with Dynamic Glow */}
          <div className="relative">
            <div className="relative rounded-[32px] overflow-hidden border border-slate-800 bg-slate-950 p-6 sm:p-8 text-white shadow-2xl shadow-slate-950/40">
              {/* Background gradient pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-950/60 via-slate-950 to-slate-900" />
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-600/20 blur-3xl animate-pulse" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-blue-600/30 border border-blue-500/40 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-blue-300">
                    ⚡ Official Partner
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star size={14} className="fill-amber-400" />
                    <span>Top Rated Store</span>
                  </div>
                </div>

                {/* Official Brand Logo Block */}
                <div className="rounded-2xl bg-white/5 p-4 border border-white/10 backdrop-blur-md">
                  <Logo variant="horizontal" size="md" isDarkBg={true} />
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                    Smart Tech, Trusted Service
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    Direct warehouse supply for high-demand CCTV infrastructure, power conversion, copper wiring, and server room equipment.
                  </p>
                </div>

                {/* Highlight Matrix */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/10 p-4 border border-white/10 backdrop-blur-md">
                    <div className="text-[11px] font-bold text-red-300 uppercase">Focus Hardware</div>
                    <div className="text-sm font-black text-white mt-1">CCTV & Power Supplies</div>
                    <div className="text-[10px] text-slate-300 mt-0.5">Heavy gauge copper alloys</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4 border border-white/10 backdrop-blur-md">
                    <div className="text-[11px] font-bold text-amber-300 uppercase">Wholesale Slab</div>
                    <div className="text-sm font-black text-white mt-1">Direct Dealer Margins</div>
                    <div className="text-[10px] text-slate-300 mt-0.5">Verified B2B invoices</div>
                  </div>
                </div>

                {/* Instant Helpline Card */}
                <div className="rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 p-4 flex items-center justify-between text-white shadow-lg">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider opacity-90">Direct Orders & Inquiries</div>
                    <div className="text-lg font-black tracking-wide mt-0.5">+91 80060 33345</div>
                  </div>
                  <a
                    href="tel:8006033345"
                    className="rounded-full bg-white text-slate-950 px-4 py-2 text-xs font-black hover:bg-slate-100 transition shadow"
                  >
                    Call Desk
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INFINITE BRAND MARQUEE TICKER */}
      <section className="border-y border-slate-200/80 bg-white py-6 overflow-hidden shadow-inner">
        <div className="container-main mb-3 text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
            Compatible & Tested With Leading Industry Brands
          </span>
        </div>
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="animate-marquee flex items-center gap-10 whitespace-nowrap">
            {[...partnerBrands, ...partnerBrands].map((brand, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-2xl bg-slate-50 border border-slate-200/90 px-6 py-2.5 text-xs font-black tracking-wider text-slate-700 hover:border-red-500 hover:text-red-700 transition cursor-default shadow-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FLASH DEALS WITH LIVE COUNTDOWN TIMER */}
      <section className="container-main">
        <div className="rounded-[32px] bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 p-6 sm:p-10 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />

          {/* Header & Live Timer */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-red-600/30 border border-red-500/40 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-red-400 mb-2">
                <Flame size={14} className="text-red-400 animate-pulse" /> Limited Time Flash Sale
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                Wholesale Hot Deals of the Day
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Grab heavy discounts on popular cables, 12V power units, and adapters before time expires.
              </p>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-700 p-3 rounded-2xl shrink-0">
              <Clock size={20} className="text-red-400" />
              <div className="flex items-center gap-2 text-center">
                <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  <span className="text-lg font-black text-white font-mono">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="block text-[9px] uppercase text-slate-400 font-bold">Hours</span>
                </div>
                <span className="font-black text-red-500 text-lg">:</span>
                <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  <span className="text-lg font-black text-white font-mono">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="block text-[9px] uppercase text-slate-400 font-bold">Mins</span>
                </div>
                <span className="font-black text-red-500 text-lg">:</span>
                <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  <span className="text-lg font-black text-red-400 font-mono">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="block text-[9px] uppercase text-slate-400 font-bold">Secs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Flash Deal Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
            {flashDeals.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. DYNAMIC INTERACTIVE CATEGORY SHOWCASE */}
      <section className="container-main">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="eyebrow">Hardware Departments</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
              Explore Our Core Catalog
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select a specialized category to view inventory, specifications, and wholesale bundles.
            </p>
          </div>
          <Link to="/shop" className="btn-secondary text-xs font-bold self-start sm:self-auto">
            Browse All Categories <ArrowRight size={14} className="ml-1.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categoryCards.map((cat) => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.title}
                to={`/shop?category=${encodeURIComponent(cat.slug)}`}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-red-300"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`p-3.5 rounded-2xl transition-transform duration-300 group-hover:scale-110 ${cat.bg}`}>
                      <Icon size={24} />
                    </div>
                    <span className="text-[11px] font-extrabold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                      {cat.count}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 mt-5 group-hover:text-red-700 transition">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-2">
                    {cat.text}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-red-700">
                  <span>View Products</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 5. INTERACTIVE PRODUCT TABS WITH SMOOTH GRID */}
      <section className="container-main">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="eyebrow">Catalog Highlights</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
              Featured & Installer Favorites
            </h2>
          </div>

          {/* Interactive Filter Pills */}
          <div className="flex flex-wrap gap-2 rounded-2xl bg-slate-100 p-1.5 border border-slate-200">
            {[
              { id: 'trending', label: '🔥 Best Sellers' },
              { id: 'deals', label: '⚡ Discounted' },
              { id: 'cctv', label: '📹 CCTV Essentials' },
              { id: 'power', label: '🔌 Power & SMPS' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-4 py-2 text-xs font-extrabold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white shadow-md shadow-red-900/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tabProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/shop" className="btn-primary px-8 py-3.5 text-sm font-black shadow-xl shadow-red-950/20">
            Explore All 1,500+ Hardware Products <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </section>

      {/* 6. WHY CHOOSE IT SAATHI */}
      <section className="container-main">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicePoints.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="group rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white shadow-md shadow-red-900/20 group-hover:scale-110 transition-transform">
                  <Icon size={22} />
                </div>
                <h3 className="text-base font-black text-slate-900 mt-5">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-2">{item.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* 8. VERIFIED CUSTOMER REVIEWS */}
      <section className="container-main">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="eyebrow">Verified Feedback</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
            Trusted by Dealers & Installers
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Real feedback from professional system integrators, shop owners, and corporate clients across India.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between transition hover:-translate-y-1 hover:shadow-md"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} size={16} className="fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-slate-900">{t.name}</div>
                  <div className="text-[10px] font-bold text-slate-400">{t.role}</div>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                  {t.city}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. INTERACTIVE FAQ ACCORDION */}
      <section className="container-main">
        <div className="max-w-3xl mx-auto rounded-[32px] border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
          <div className="text-center mb-8">
            <span className="eyebrow">Clear Answers</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {faqItems.map((faq, idx) => {
              const isOpen = openFaqIdx === idx
              return (
                <div key={idx} className="py-4">
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? -1 : idx)}
                    className="flex w-full items-center justify-between text-left text-sm font-black text-slate-800 transition hover:text-red-600 gap-4"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-slate-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-red-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="mt-3 text-xs leading-relaxed text-slate-600 animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 10. VIP WHOLESALE CTA BANNER */}
      <section className="container-main">
        <div className="rounded-[32px] bg-gradient-to-r from-red-700 via-red-600 to-slate-950 p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="rounded-full bg-white/20 border border-white/30 px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-white">
              🚀 Direct B2B Pricing Channel
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Looking for Bulk Reseller Containers or Contractor Orders?
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Connect directly with Adarsh Jain and our wholesale distribution desk for specialized project pricing, bulk GST quotations, and custom packaging.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="https://wa.me/918006033345?text=Hello%20IT%20SAATHI%2C%20I%20would%20like%20to%20request%20a%20bulk%20wholesale%20quotation."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3.5 text-xs sm:text-sm font-black shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              WhatsApp Wholesale Desk
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full bg-white text-slate-950 hover:bg-slate-100 px-6 py-3.5 text-xs sm:text-sm font-bold shadow-xl transition-all"
            >
              Send Online Inquiry
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
