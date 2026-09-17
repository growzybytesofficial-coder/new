import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  MessageSquare,
  Clock,
  CheckCircle2,
  Lock,
  Headphones,
  FileText,
  CreditCard,
  Building2,
  ChevronRight,
  Send,
  Sparkles,
  Download
} from 'lucide-react'

const trustPillars = [
  {
    icon: Truck,
    title: 'Express All-India Delivery',
    description: 'Fast, secure doorstep dispatch with real-time consignment tracking.',
    badge: 'Fast Logistics'
  },
  {
    icon: ShieldCheck,
    title: '100% Genuine Hardware',
    description: 'Certified original products backed by official manufacturer warranty.',
    badge: 'Verified Stock'
  },
  {
    icon: Building2,
    title: 'B2B & Wholesale Rates',
    description: 'Special bulk volume pricing with GST input tax credit for businesses.',
    badge: 'GST Input Credit'
  },
  {
    icon: Headphones,
    title: 'Expert Technical Assistance',
    description: 'Direct consultation for CCTV layout, cabling, and hardware selection.',
    badge: 'Live Support'
  }
]

const productCategories = [
  { name: 'CCTV & Security Cameras', to: '/shop' },
  { name: 'SMPS & Power Supply Units', to: '/shop' },
  { name: 'Cat6 Networking & LAN Routers', to: '/shop' },
  { name: 'HDMI, VGA & Display Adapters', to: '/shop' },
  { name: 'Computer Peripherals & Storage', to: '/shop' },
  { name: 'Cable Management & Tools', to: '/shop' }
]

const customerServiceLinks = [
  { name: 'My Account & Orders', to: '/account' },
  { name: 'Shopping Cart', to: '/cart' },
  { name: 'Wholesale & Bulk Orders', to: '/contact' },
  { name: 'About IT SAATHI', to: '/about' },
  { name: 'Contact & Store Helpline', to: '/contact' }
]

const quickCompanyLinks = [
  { name: 'Storefront Home', to: '/' },
  { name: 'All Hardware Catalog', to: '/shop' },
  { name: 'Corporate Support', to: '/contact' },
  { name: 'Authorized Admin Portal', to: '/admin/', isExternal: true }
]

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false)

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (!newsletterEmail.trim()) return
    setNewsletterSubscribed(true)
    setNewsletterEmail('')
    setTimeout(() => {
      setNewsletterSubscribed(false)
    }, 4000)
  }

  return (
    <footer id="main-footer" className="relative bg-slate-950 text-slate-300 overflow-hidden font-sans border-t border-slate-800/80">
      {/* Ambient background glow accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-red-600/10 blur-[130px]" />
        <div className="absolute top-1/2 right-[-5%] h-96 w-96 rounded-full bg-slate-800/20 blur-[140px]" />
        <div className="absolute bottom-0 left-[-5%] h-64 w-64 rounded-full bg-red-900/15 blur-[120px]" />
      </div>

      {/* TOP TRUST PILLARS SECTION */}
      <div className="relative border-b border-slate-850 bg-slate-900/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {trustPillars.map((pillar, idx) => {
              const Icon = pillar.icon
              return (
                <div
                  key={idx}
                  className="group relative rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 transition-all duration-300 hover:border-red-500/40 hover:bg-slate-900/90 hover:shadow-lg hover:shadow-red-950/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600/20 to-red-900/40 text-red-500 border border-red-500/20 group-hover:scale-105 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <Icon size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                          {pillar.badge}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-0.5 tracking-tight group-hover:text-red-400 transition-colors">
                        {pillar.title}
                      </h4>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* CALL TO ACTION PROMO STRIP */}
      <div className="relative border-b border-slate-850 bg-gradient-to-r from-slate-900 via-slate-900/90 to-red-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 rounded-3xl border border-slate-800 bg-slate-950/60 p-6 sm:p-8 backdrop-blur-md">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400 mb-3">
                <Sparkles size={13} className="animate-pulse" />
                <span>Need Technical Hardware Guidance or Custom Bulk Quotes?</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                Talk to our surveillance and networking specialists
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Get itemized quotations, B2B wholesale pricing, and instant assistance on hardware specs for your projects.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <a
                href="https://wa.me/918006033345?text=Hello%20IT%20SAATHI%20Team%2C%20I%20need%20assistance%20with%20hardware%20products."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs sm:text-sm font-bold text-white transition hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-950/30 active:scale-95"
              >
                <MessageSquare size={16} />
                <span>WhatsApp Desk</span>
              </a>

              <a
                href="tel:8006033345"
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-xs sm:text-sm font-bold text-white transition hover:bg-red-500 hover:shadow-lg hover:shadow-red-950/30 active:scale-95"
              >
                <Phone size={16} />
                <span>Call 8006033345</span>
              </a>

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-xs sm:text-sm font-bold text-slate-200 transition hover:border-slate-600 hover:bg-slate-700 hover:text-white active:scale-95"
              >
                <span>Browse Products</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER DIRECTORY & DIRECT CONTACT MATRIX */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Col 1: Brand Info & Identity (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="space-y-2">
              <Link to="/" className="inline-block" title="IT SAATHI Home">
                <Logo variant="horizontal" size="md" isDarkBg={true} />
              </Link>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pt-2">
                Your reliable destination for professional CCTV surveillance, SMPS power supplies, Cat6 networking cables, display adapters, and enterprise computer accessories.
              </p>
            </div>

            {/* Newsletter quick subscribe */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-2">
                Stay Updated on Price Drops & New Arrivals
              </span>
              <form onSubmit={handleNewsletterSubmit} className="relative flex items-center">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your business email..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2.5 pr-10 text-xs text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
                  required
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="absolute right-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-500 transition cursor-pointer"
                >
                  <Send size={13} />
                </button>
              </form>
              {newsletterSubscribed && (
                <p className="mt-1.5 text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>Thank you for subscribing to IT SAATHI updates!</span>
                </p>
              )}
            </div>

            {/* Security and assurance badge */}
            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-400">
              <Lock size={14} className="text-red-400" />
              <span>SSL 256-Bit Encrypted Secure Browsing</span>
            </div>
          </div>

          {/* Col 2: Categories (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200 border-l-2 border-red-500 pl-2.5">
              Product Categories
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {productCategories.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.to}
                    className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <ChevronRight size={13} className="text-slate-600 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Care (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200 border-l-2 border-red-500 pl-2.5">
              Customer Desk
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {customerServiceLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.to}
                    className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <ChevronRight size={13} className="text-slate-600 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
              {quickCompanyLinks.map((link, idx) => (
                <li key={`qc-${idx}`}>
                  {link.isExternal ? (
                    <a
                      href={link.to}
                      className="group flex items-center gap-2 text-red-400 font-semibold hover:text-red-300 transition-colors"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                      <span>{link.name}</span>
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Operations Matrix (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200 border-l-2 border-red-500 pl-2.5">
              Contact &amp; Operations
            </h4>

            <div className="space-y-3">
              {/* Phone card */}
              <a
                href="tel:8006033345"
                className="flex items-start gap-3 rounded-2xl border border-slate-850 bg-slate-900/60 p-3.5 transition-all hover:border-red-500/40 hover:bg-slate-900 group"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400 group-hover:bg-red-600 group-hover:text-white transition">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Helpline &amp; WhatsApp
                  </span>
                  <span className="text-sm font-bold text-white group-hover:text-red-400 transition">
                    80060 33345
                  </span>
                </div>
              </a>

              {/* Email card */}
              <a
                href="mailto:Support@itsaathi.com"
                className="flex items-start gap-3 rounded-2xl border border-slate-850 bg-slate-900/60 p-3.5 transition-all hover:border-red-500/40 hover:bg-slate-900 group"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400 group-hover:bg-red-600 group-hover:text-white transition">
                  <Mail size={16} />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Official Support Email
                  </span>
                  <span className="text-sm font-bold text-white break-all group-hover:text-red-400 transition">
                    Support@itsaathi.com
                  </span>
                </div>
              </a>

              {/* Working Hours card */}
              <div className="flex items-start gap-3 rounded-2xl border border-slate-850 bg-slate-900/40 p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-300">
                  <Clock size={16} />
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Business Hours
                  </span>
                  <span className="text-xs font-semibold text-slate-200">
                    Mon - Sat: 9:30 AM – 7:30 PM IST
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM LEGAL BAR & PAYMENT METHODS */}
      <div className="relative border-t border-slate-900 bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            
            <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
              <span className="font-semibold text-slate-300">
                © {new Date().getFullYear()} IT SAATHI.
              </span>
              <span className="hidden sm:inline text-slate-700">•</span>
              <span>Smart Tech, Trusted Service</span>
              <span className="hidden sm:inline text-slate-700">•</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                All Systems Operational
              </span>
            </div>

            {/* Payment & Security badges */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-slate-300">
                UPI Scan &amp; Pay
              </span>
              <span className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-slate-300">
                Net Banking
              </span>
              <span className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-slate-300">
                Cash On Delivery
              </span>
              <span className="rounded-lg border border-red-900/60 bg-red-950/40 px-2.5 py-1 text-[11px] font-bold text-red-400">
                GST Invoice Verified
              </span>
              <a
                href="/it-saathi-project.zip"
                download="it-saathi-project.zip"
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 px-3 py-1 text-[11px] font-bold text-emerald-400 hover:bg-emerald-500 hover:text-white transition"
                title="Download Project Files (ZIP)"
              >
                <Download size={12} />
                <span>Export ZIP</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
